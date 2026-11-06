import { timingSafeEqual } from "node:crypto";
import { getEvent } from "../../lib/content";
import { eventPath } from "../../lib/navigation.mjs";
export default async function handler(req, res) {
  const expected = process.env.SANITY_PREVIEW_SECRET,
    provided = req.query.secret;
  res.setHeader("Cache-Control", "no-store");
  if (
    !expected ||
    typeof provided !== "string" ||
    Buffer.byteLength(expected) !== Buffer.byteLength(provided) ||
    !timingSafeEqual(Buffer.from(expected), Buffer.from(provided))
  )
    return res.status(401).end();
  const path = req.query.path;
  let target = ["/", "/events", "/rental-interest"].includes(path)
    ? path
    : null;
  if (!target && typeof req.query.slug === "string") {
    const event = await getEvent(req.query.slug, true);
    if (event) target = eventPath(event.slug);
  }
  if (!target) return res.status(400).end();
  if (!process.env.SANITY_API_READ_TOKEN) return res.status(503).end();
  res.setPreviewData({}, { maxAge: 3600 });
  return res.redirect(307, target);
}
