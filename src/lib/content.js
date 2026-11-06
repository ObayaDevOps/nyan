import { getClient } from "../../sanity/lib/client";
import { normalizeNavigation } from "./navigation.mjs";
export const imageFields = `{...,"url":asset->url,"dimensions":asset->metadata.dimensions,"lqip":asset->metadata.lqip}`;
export const eventFields = `{_id,_rev,eventName,eventStartTime,eventEndTime,eventLandingPageDisplayShortDescription,eventParagraphText1,eventParagraphText2,eventParagraphText3,contactSocialLink,subTitle,title,"slug":slug.current,"image":eventLandingDisplayImage${imageFields},"sharingImage":sharingUrlImage.asset->url}`;
export async function getNavigation(preview = false) {
  const client = getClient(preview);
  const doc = await client.fetch('*[_id=="siteNavigation"][0]');
  return normalizeNavigation(
    doc,
    doc
      ? []
      : await client.fetch(
          '*[_type=="tenantList"]|order(_createdAt asc,_id asc)',
        ),
  );
}
const listFields = `{_id,"slug":slug.current,eventName,eventStartTime,eventEndTime,eventLandingPageDisplayShortDescription,"image":eventLandingDisplayImage${imageFields}}`;
export function getEvents(preview = false) {
  return getClient(preview).fetch(
    `*[_type=="eventPage" && defined(slug.current)]|order(eventStartTime desc)${listFields}`,
  );
}
export function getEvent(slug, preview = false) {
  return getClient(preview).fetch(
    `*[_type=="eventPage" && slug.current==$slug][0]${eventFields}`,
    { slug },
  );
}
export async function getRental(preview = false) {
  const c = getClient(preview);
  const doc = await c.fetch(
    `*[_id=="rentalInterestPage"][0]{...,"image":mainDisplayImage${imageFields}}`,
  );
  if (doc) return doc;
  const docs = await c.fetch(
    `*[_type=="rentalInterestPage"]|order(_createdAt asc,_id asc){...,"image":mainDisplayImage${imageFields}}`,
  );
  if (docs.length !== 1)
    throw new Error(
      "Rental content missing or ambiguous. Run the reviewed singleton migration.",
    );
  return docs[0];
}
export async function pageProps(context, extra = {}) {
  return {
    props: {
      ...extra,
      navigation: await getNavigation(!!context.preview),
      preview: !!context.preview,
    },
    revalidate: 60,
  };
}
