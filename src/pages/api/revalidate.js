import { isValidSignature } from "@sanity/webhook";
import { getClient } from "../../../sanity/lib/client";
import { revalidationPaths, revalidateAll } from "../../lib/revalidation.mjs";
export const config = { api: { bodyParser: false } };
export const maxDuration = 30;
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return res.status(503).json({ error: "Webhook not configured" });
  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 16384) return res.status(413).end();
      chunks.push(chunk);
    }
    if (typeof req.headers["sanity-webhook-signature"] !== "string")
      return res.status(401).end();
    const raw = Buffer.concat(chunks).toString("utf8");
    if (
      !(await isValidSignature(
        raw,
        req.headers["sanity-webhook-signature"],
        secret,
      ))
    )
      return res.status(401).end();
    const body = JSON.parse(raw);
    if (
      !body ||
      typeof body !== "object" ||
      typeof body.id !== "string" ||
      body.id.startsWith("drafts.") ||
      body.id.startsWith("versions.")
    )
      return res.status(400).end();
    const client = getClient();
    if (body.dataset !== client.config().dataset) return res.status(400).end();
    // Allow origin query indexes to catch up before regenerating cached pages.
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const slugs = ["siteNavigation", "tenantList"].includes(body.type)
      ? await client.fetch(
          '*[_type=="eventPage" && defined(slug.current)][].slug.current',
        )
      : [];
    const paths = revalidationPaths(body, slugs),
      failures = await revalidateAll(paths, (path) => res.revalidate(path));
    console.info("Content refresh", {
      id: body.id,
      routes: paths.length,
      failures: failures.length,
    });
    return res
      .status(failures.length ? 503 : 200)
      .json({ revalidated: !failures.length, failures });
  } catch {
    console.error("Content refresh failed");
    return res.status(503).json({ error: "Refresh failed; retry delivery" });
  }
}
