import { deliverInquiry } from "../../lib/mail.mjs";
import { createHash } from "node:crypto";
import { Resend } from "resend";
import { validateSubmission, InputError } from "../../lib/contact.mjs";
import { checkAbuse } from "../../lib/abuse.mjs";
import { getClient } from "../../../sanity/lib/client";
import { dateLabel } from "../../lib/events.mjs";
import {
  EventAutoConfirmationEmail,
  EventNotificationEmail,
  RentalAutoConfirmationEmail,
  RentalNotificationEmail,
} from "../../components/emails/contactEmailTemplates";
export const config = { api: { bodyParser: { sizeLimit: "32kb" } } };
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!req.headers["content-type"]?.startsWith("application/json"))
    return res.status(415).json({ error: "JSON required" });
  const origin = req.headers.origin;
  const expected =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.nekosero.ug";
  if (
    origin &&
    origin !== expected &&
    !(
      process.env.NODE_ENV !== "production" &&
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    )
  )
    return res.status(403).json({ error: "Invalid origin" });
  if (req.body?.companyFax)
    return res.status(400).json({ error: "Invalid submission" });
  let body = req.body;
  // Temporary adapter for forms in cached HTML from the previous deployment.
  if (body && !body.type && (body.BusinessName || body.EventName)) {
    const submissionId = createHash("sha256")
      .update(JSON.stringify(body))
      .digest("hex");
    if (body.BusinessName) {
      body = {
        type: "rental",
        submissionId,
        name: body.ClientName,
        email: body.ClientEmail,
        phone: body.ClientPhoneNumber,
        businessName: body.BusinessName,
        website: body.BusinessWebsiteOrSocials,
        budget: body.RentalBudget,
        floorArea: body.FloorArea,
        referral: body.FindOut || "",
        extra: body.ExtraInfo || "",
      };
    } else {
      if (
        typeof body.EventName !== "string" ||
        typeof body.EventLink !== "string"
      )
        return res
          .status(400)
          .json({ error: "Refresh the event form and try again" });
      let matches;
      try {
        matches = await getClient().fetch(
          '*[_type=="eventPage" && eventName==$name && contactSocialLink==$link]{_id}',
          { name: body.EventName, link: body.EventLink },
        );
      } catch {
        return res.status(503).json({ error: "Event service is unavailable" });
      }
      if (matches.length !== 1)
        return res
          .status(400)
          .json({ error: "Refresh the event form and try again" });
      body = {
        type: "event",
        submissionId,
        eventId: matches[0]._id,
        name: body.Name,
        email: body.Email,
        phone: body.PhoneNumber,
      };
    }
  }
  let data;
  try {
    data = validateSubmission(body);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      errors: error instanceof InputError ? error.errors : {},
    });
  }
  const {
    RESEND_API_KEY: key,
    RESEND_FROM: from,
    RECIPIENT_ADDRESS: recipients,
  } = process.env;
  const to = recipients
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (
    !key ||
    !from ||
    !to?.length ||
    to.some((s) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))
  )
    return res.status(503).json({ error: "Contact service is unavailable" });
  try {
    if (!(await checkAbuse(req))) {
      res.setHeader("Retry-After", "600");
      return res
        .status(429)
        .json({ error: "Please wait before trying again." });
    }
  } catch {
    console.error("Contact rate limit configuration/service unavailable");
    return res.status(503).json({ error: "Contact service is unavailable" });
  }
  let Notification, Confirmation, payload;
  if (data.type === "event") {
    let event;
    try {
      event = await getClient().fetch('*[_type=="eventPage" && _id==$id][0]', {
        id: data.eventId,
      });
    } catch {
      return res.status(503).json({ error: "Event service is unavailable" });
    }
    if (!event)
      return res
        .status(400)
        .json({ error: "This event is no longer published" });
    payload = {
      EventName: event.eventName,
      EventDate: `${dateLabel(event.eventStartTime)} – ${dateLabel(event.eventEndTime)}`,
      EventTime: `${dateLabel(event.eventStartTime, true)} – ${dateLabel(event.eventEndTime, true)}`,
      EventLink: event.contactSocialLink,
      Name: data.name,
      Email: data.email,
      PhoneNumber: data.phone,
    };
    Notification = EventNotificationEmail;
    Confirmation = EventAutoConfirmationEmail;
  } else {
    payload = {
      BusinessName: data.businessName,
      BusinessWebsiteOrSocials: data.website,
      RentalBudget: data.budget,
      FloorArea: data.floorArea,
      ClientName: data.name,
      ClientEmail: data.email,
      ClientPhoneNumber: data.phone,
      FindOut: data.referral,
      ExtraInfo: data.extra,
    };
    Notification = RentalNotificationEmail;
    Confirmation = RentalAutoConfirmationEmail;
  }
  const resend = new Resend(key);
  async function send(to, Component, suffix) {
    const result = await resend.emails.send(
      {
        from,
        to,
        replyTo: data.email,
        subject: `Nekosero — ${suffix === "staff" ? "New interest" : "We received your interest"}`,
        react: <Component data={payload} />,
      },
      { idempotencyKey: `${data.type}/${data.submissionId}/${suffix}` },
    );
    if (result.error) throw result.error;
  }
  try {
    const result = await deliverInquiry((kind) =>
      send(
        kind === "staff" ? to : [data.email],
        kind === "staff" ? Notification : Confirmation,
        kind,
      ),
    );
    return res.json(result);
  } catch (error) {
    console.error("Contact notification failed", error.name);
    return res
      .status(error.name === "invalid_idempotent_request" ? 409 : 502)
      .json({ error: "Could not send. Please retry the same submission." });
  }
}
