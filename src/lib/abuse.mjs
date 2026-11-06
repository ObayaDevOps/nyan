import { createHmac } from "node:crypto";
export async function checkAbuse(
  req,
  { env = process.env, fetchImpl = fetch } = {},
) {
  if (env.NODE_ENV !== "production") return true;
  const { ABUSE_KV_URL: url, ABUSE_KV_TOKEN: token } = env;
  if (!url || !token) throw new Error("Shared rate limiting is not configured");
  if (env.VERCEL !== "1")
    throw new Error(
      "Configure a trusted ingress IP adapter before enabling contact on this host",
    );
  const ip = req.headers["x-vercel-forwarded-for"];
  if (typeof ip !== "string") throw new Error("Trusted client IP unavailable");
  const key = createHmac("sha256", token).update(ip).digest("hex");
  const script =
    "local a=redis.call('INCR',KEYS[1]);if a==1 then redis.call('EXPIRE',KEYS[1],600) end;local b=redis.call('INCR',KEYS[2]);if b==1 then redis.call('EXPIRE',KEYS[2],600) end;return (a<=5 and b<=100) and 1 or 0";
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      script,
      "2",
      `contact:${key}`,
      "contact:global",
    ]),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Rate limit service unavailable");
  const payload = await response.json();
  if (payload.error) throw new Error("Rate limit service error");
  return payload.result === 1;
}
