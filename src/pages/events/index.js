import { useEffect, useState } from "react";
import Link from "next/link";
import SideBar from "../../components/sidebar";
import Seo from "../../components/Seo";
import ContentImage from "../../components/ContentImage";
import Video from "../../components/boxWithYTBackground";
import { filterEvents, dateLabel } from "../../lib/events.mjs";
import { eventPath } from "../../lib/navigation.mjs";
export default function Events({ navigation, eventPages, referenceTime }) {
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [now, setNow] = useState(referenceTime);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = setInterval(update, 60000);
    window.addEventListener("focus", update);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, []);
  const events = filterEvents(eventPages, search, filter, now);
  return (
    <>
      <Seo title="Events at Nekosero" path="/events" />
      <SideBar navigation={navigation} showNavIcon />
      <main>
        <Video videoId="OgBI2ewu8Yo">
          <h1>What&apos;s On at Nekosero</h1>
        </Video>
        <section className="events">
          <h2>Our Events</h2>
          <div className="event-controls">
            <label className="sr-only" htmlFor="search">
              Search events
            </label>
            <input
              id="search"
              type="search"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filters">
              {[
                ["today", "Today"],
                ["weekend", "This Weekend"],
                ["month", "This Month"],
                ["past", "Past Events"],
                ["all", "All Events"],
              ].map(([key, label]) => (
                <button
                  className="button"
                  key={key}
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="event-grid">
            {events.map((e) => (
              <article className="event-card" key={e._id}>
                <Link href={eventPath(e.slug)}>
                  <ContentImage
                    image={e.image}
                    alt={e.eventName}
                    sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                  />
                </Link>
                <div>
                  <h3>
                    <Link href={eventPath(e.slug)}>{e.eventName}</Link>
                  </h3>
                  <div className="card-meta">
                    <span>{dateLabel(e.eventStartTime)}</span>
                    <Link className="button" href={eventPath(e.slug)}>
                      Details ↗
                    </Link>
                  </div>
                  <p>{e.eventLandingPageDisplayShortDescription}</p>
                </div>
              </article>
            ))}
          </div>
          {!events.length && (
            <p role="status" className="empty">
              No events found
            </p>
          )}
        </section>
      </main>
    </>
  );
}
export async function getStaticProps(context) {
  const { pageProps, getEvents } = await import("../../lib/content");
  return pageProps(context, {
    eventPages: await getEvents(!!context.preview),
    referenceTime: Date.now(),
  });
}
