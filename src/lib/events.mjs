export const timeZone = "Africa/Kampala";
export function dateLabel(value, time = false) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    ...(time
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
  }).format(new Date(value));
}
// Kampala is UTC+3 year-round. Calendar arithmetic takes place in venue time.
export function filterEvents(
  events,
  search = "",
  filter = "all",
  now = Date.now(),
) {
  const day = 86400000,
    shift = 10800000,
    d = new Date(now + shift),
    today =
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - shift;
  let start = today,
    end = today + day;
  if (filter === "weekend") {
    const weekday = d.getUTCDay();
    start =
      today +
      (weekday === 0 ? -2 : weekday === 6 ? -1 : (5 - weekday + 7) % 7) * day;
    end = start + 3 * day;
  }
  if (filter === "month") {
    start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) - shift;
    end = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) - shift;
  }
  return events.filter((e) => {
    const a = Date.parse(e.eventStartTime),
      b = Date.parse(e.eventEndTime);
    return (
      (e.eventName || "").toLowerCase().includes(search.toLowerCase()) &&
      Number.isFinite(a) &&
      Number.isFinite(b) &&
      (filter === "all" ||
        (filter === "past" ? b <= now : a < end && b > start))
    );
  });
}
