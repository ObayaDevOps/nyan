export const routes = {
  home: "/",
  events: "/events",
  rental: "/rental-interest",
};
export const primaryLinks = [
  { _key: "home", routeKey: "home", label: "Home" },
  { _key: "events", routeKey: "events", label: "Events" },
  { _key: "rental", routeKey: "rental", label: "Register Rental Interest" },
];
export function safeUrl(value) {
  try {
    const u = new URL(value);
    return ["http:", "https:"].includes(u.protocol) &&
      !u.username &&
      !u.password
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export function normalizeNavigation(doc, legacy = []) {
  const categories = doc
    ? doc.categories
    : legacy.map((c) => ({
        ...c,
        _key: c._id,
        label: c.title,
        iconKey: c.icon,
        links: c.tenantNameAndURL?.map((l, index) => ({
          ...l,
          _key: l._key || `${c._id}-${index}`,
          label: l.tenantName,
          url: l.tenantLink,
        })),
      }));
  return {
    primaryLinks: (doc?.primaryLinks || primaryLinks)
      .filter((l) => l.visible !== false && Object.hasOwn(routes, l.routeKey))
      .map((l) => ({ ...l, url: routes[l.routeKey] })),
    categories: (categories || [])
      .filter((c) => c.visible !== false)
      .map((c) => ({
        ...c,
        links: (c.links || [])
          .filter((l) => l.visible !== false && l.label && safeUrl(l.url))
          .map((l) => ({ ...l, url: safeUrl(l.url) })),
      })),
    socialLinks: doc?.socialLinks
      ? Object.fromEntries(
          Object.entries(doc.socialLinks).filter(([key, value]) =>
            key === "email"
              ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
              : safeUrl(value),
          ),
        )
      : {
          email: "hello@nekosero.ug",
          instagram: "https://www.instagram.com/nekosero/",
          map: "https://maps.app.goo.gl/RT3ZEuogVDjsqX818",
        },
  };
}
export function eventPath(slug) {
  return "/events/" + encodeURIComponent(slug);
}
