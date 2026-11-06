import { readFileSync } from "node:fs";
// Explicit local/CI transport; never permitted on a hosted deployment.
export function fixtureClient() {
  if (process.env.VERCEL || process.env.DEPLOYMENT_ENV === "production")
    throw new Error("Fixture transport forbidden on a deployment");
  const fixture = JSON.parse(
    readFileSync("tests/fixtures/content.json", "utf8"),
  );
  return {
    config: () => ({ dataset: "fixtures" }),
    fetch: async (query, params = {}) => {
      if (query.includes("siteNavigation")) return fixture.navigation;
      if (query.includes("tenantList")) return fixture.tenants;
      if (query.includes("rentalInterestPage"))
        return query.includes("_id==") ? fixture.rental : [fixture.rental];
      if (query.includes("eventPage")) {
        if (query.includes("slug.current==$slug"))
          return fixture.events.find((e) => e.slug === params.slug) || null;
        if (query.includes("_id==$id"))
          return fixture.events.find((e) => e._id === params.id) || null;
        if (query.includes("eventName==$name"))
          return fixture.events.filter(
            (e) =>
              e.eventName === params.name &&
              e.contactSocialLink === params.link,
          );
        if (query.includes("][].slug.current"))
          return fixture.events.map((e) => e.slug);
        return fixture.events;
      }
      throw new Error("Unknown query in fixture transport");
    },
  };
}
