import { eventPath } from "./navigation.mjs";
export function revalidationPaths(body, slugs = []) {
  if (body.type === "siteNavigation" || body.type === "tenantList")
    return ["/", "/events", "/rental-interest", ...slugs.map(eventPath)];
  if (body.type === "rentalInterestPage") return ["/rental-interest"];
  if (body.type === "eventPage")
    return [
      ...new Set([
        "/events",
        ...[body.beforeSlug, body.afterSlug]
          .filter(
            (s) =>
              typeof s === "string" &&
              s.length &&
              s.length <= 200 &&
              !s.includes("/"),
          )
          .map(eventPath),
      ]),
    ];
  return [];
}
export async function revalidateAll(paths, run) {
  let index = 0;
  const failures = [];
  await Promise.all(
    Array.from({ length: Math.min(3, paths.length) }, async () => {
      while (index < paths.length) {
        const path = paths[index++];
        try {
          await run(path);
        } catch {
          failures.push(path);
        }
      }
    }),
  );
  return failures;
}
