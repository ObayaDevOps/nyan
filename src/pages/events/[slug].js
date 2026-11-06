import SideBar from "../../components/sidebar";
import Seo from "../../components/Seo";
import ContentImage from "../../components/ContentImage";
import ContactForm from "../../components/ContactForm";
import { dateLabel } from "../../lib/events.mjs";
import { eventPath, safeUrl } from "../../lib/navigation.mjs";
export default function Event({ eventPage: e, navigation }) {
  return (
    <>
      <Seo
        title={`${e.eventName} | Nekosero Events`}
        description={e.eventLandingPageDisplayShortDescription}
        path={eventPath(e.slug)}
        image={e.sharingImage}
      />
      <SideBar navigation={navigation} showNavIcon />
      <main className="event-detail">
        <ContentImage image={e.image} alt={e.eventName} priority />
        <section>
          <h1>{e.eventName}</h1>
          <p className="subtitle">{e.subTitle}</p>
          <p className="date">
            Date: {dateLabel(e.eventStartTime)} – {dateLabel(e.eventEndTime)}
            <br />
            Time: {dateLabel(e.eventStartTime, true)} –{" "}
            {dateLabel(e.eventEndTime, true)}
          </p>
          <h2>About</h2>
          {[e.eventParagraphText1, e.eventParagraphText2, e.eventParagraphText3]
            .filter(Boolean)
            .map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          {safeUrl(e.contactSocialLink) && (
            <a className="button" href={safeUrl(e.contactSocialLink)}>
              Get in Contact ↗
            </a>
          )}
          <details className="inquiry">
            <summary>Register interest</summary>
            <ContactForm type="event" eventId={e._id} />
          </details>
        </section>
      </main>
    </>
  );
}
export async function getStaticPaths() {
  const { getEvents } = await import("../../lib/content");
  return {
    paths: (await getEvents()).map((e) => ({ params: { slug: e.slug } })),
    fallback: "blocking",
  };
}
export async function getStaticProps(context) {
  const { getEvent, pageProps } = await import("../../lib/content");
  const event = await getEvent(context.params.slug, !!context.preview);
  if (!event) return { notFound: true, revalidate: 60 };
  return pageProps(context, { eventPage: event });
}
