import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeNavigation,
  safeUrl,
  eventPath,
} from "../src/lib/navigation.mjs";
import { filterEvents, dateLabel } from "../src/lib/events.mjs";
import { validateSubmission, InputError } from "../src/lib/contact.mjs";
import { revalidationPaths, revalidateAll } from "../src/lib/revalidation.mjs";
test("navigation preserves source order and keys; filters unsafe links and hidden content", () => {
  const n = normalizeNavigation(null, [
    {
      _id: "a",
      title: "Dining",
      icon: "FaGlassMartini",
      tenantNameAndURL: [
        { _key: "one", tenantName: "First", tenantLink: "https://example.com" },
        { _key: "two", tenantName: "Bad", tenantLink: "javascript:alert(1)" },
      ],
    },
  ]);
  assert.equal(n.categories[0]._key, "a");
  assert.deepEqual(
    n.categories[0].links.map((l) => l._key),
    ["one"],
  );
  assert.equal(safeUrl("https://user:pass@example.com"), null);
});
test("explicit empty menu does not restore defaults", () => {
  assert.equal(
    normalizeNavigation({ primaryLinks: [], categories: [] }).primaryLinks
      .length,
    0,
  );
});
const event = (a, b) => ({
  _id: "1",
  eventName: "Venue Event",
  eventStartTime: a,
  eventEndTime: b,
});
test("weekend includes Sunday evening and Saturday uses current weekend", () => {
  const e = event("2026-11-08T18:00:00+03:00", "2026-11-08T22:00:00+03:00");
  for (const now of ["2026-11-07T12:00:00+03:00", "2026-11-08T12:00:00+03:00"])
    assert.equal(filterEvents([e], "", "weekend", Date.parse(now)).length, 1);
});
test("month includes last evening, overlap includes ongoing events and past uses end time", () => {
  const e = event("2026-11-30T18:00:00+03:00", "2026-12-01T02:00:00+03:00"),
    now = Date.parse("2026-11-30T20:00:00+03:00");
  assert.equal(filterEvents([e], "", "month", now).length, 1);
  assert.equal(filterEvents([e], "", "past", now).length, 0);
  assert.equal(filterEvents([e], "other", "all", now).length, 0);
  assert.match(dateLabel("2026-11-30T22:00:00Z"), /1 Dec/);
});
const valid = {
  type: "rental",
  name: "Editor",
  email: "editor@example.com",
  phone: "+256 123456789",
  submissionId: "12345678-1234-1234",
  businessName: "Shop",
  website: "https://example.com",
  budget: "1000",
  floorArea: "30",
  referral: "",
  extra: "",
};
test("validates types, whitespace, numbers, unsafe links and header injection", () => {
  assert.equal(validateSubmission(valid).name, "Editor");
  for (const patch of [
    { name: {} },
    { name: "  " },
    { budget: "Infinity" },
    { floorArea: "-1" },
    { website: "javascript:x" },
    { email: "a@example.com\r\nBcc:b@example.com" },
    { extra: "x".repeat(4001) },
  ])
    assert.throws(() => validateSubmission({ ...valid, ...patch }), InputError);
});
test("event payload requires stable published event reference", () => {
  assert.throws(() => validateSubmission({ type: "event" }), InputError);
  assert.equal(
    validateSubmission({ ...valid, type: "event", eventId: "abc" }).eventId,
    "abc",
  );
});
test("slug changes invalidate both routes; navigation includes every event", () => {
  const slug = "style-&-sip";
  assert.equal(eventPath(slug), "/events/style-%26-sip");
  assert.deepEqual(
    revalidationPaths({
      type: "eventPage",
      beforeSlug: "old",
      afterSlug: slug,
    }),
    ["/events", "/events/old", eventPath(slug)],
  );
  assert.equal(
    revalidationPaths({ type: "siteNavigation" }, ["one", "two"]).length,
    5,
  );
  assert.deepEqual(revalidationPaths({ type: "unknown" }), []);
});
test("fanout awaits every path and reports failures with bounded concurrency", async () => {
  let active = 0,
    max = 0,
    count = 0;
  const failures = await revalidateAll(
    ["a", "b", "c", "d", "e"],
    async (path) => {
      max = Math.max(max, ++active);
      await new Promise((r) => setTimeout(r, 2));
      active--;
      count++;
      if (path === "c") throw new Error();
    },
  );
  assert.equal(count, 5);
  assert.ok(max <= 3);
  assert.deepEqual(failures, ["c"]);
});

test("production abuse guard fails closed; shared atomic counters enforce limits", async () => {
  const { checkAbuse } = await import("../src/lib/abuse.mjs");
  await assert.rejects(() =>
    checkAbuse({}, { env: { NODE_ENV: "production" } }),
  );
  const env = {
    NODE_ENV: "production",
    VERCEL: "1",
    ABUSE_KV_URL: "https://counter.example",
    ABUSE_KV_TOKEN: "test-key",
  };
  let command;
  const allowed = await checkAbuse(
    { headers: { "x-vercel-forwarded-for": "192.0.2.1" } },
    {
      env,
      fetchImpl: async (url, options) => {
        command = JSON.parse(options.body);
        return { ok: true, json: async () => ({ result: 1 }) };
      },
    },
  );
  assert.equal(allowed, true);
  assert.equal(command[0], "EVAL");
  assert.ok(!command.join("").includes("192.0.2.1"));
  assert.equal(
    await checkAbuse(
      { headers: { "x-vercel-forwarded-for": "192.0.2.1" } },
      {
        env,
        fetchImpl: async () => ({
          ok: true,
          json: async () => ({ result: 0 }),
        }),
      },
    ),
    false,
  );
  await assert.rejects(() =>
    checkAbuse(
      { headers: { "x-vercel-forwarded-for": "x" } },
      {
        env,
        fetchImpl: async () => {
          throw new Error("offline");
        },
      },
    ),
  );
});

test("staff delivery failure stops confirmation; partial success stays successful", async () => {
  const { deliverInquiry } = await import("../src/lib/mail.mjs");
  let messages = [];
  await assert.rejects(() =>
    deliverInquiry(async (kind) => {
      messages.push(kind);
      throw Error("down");
    }),
  );
  assert.deepEqual(messages, ["staff"]);
  messages = [];
  const partial = await deliverInquiry(async (kind) => {
    messages.push(kind);
    if (kind === "confirmation") throw Error("down");
  });
  assert.deepEqual(messages, ["staff", "confirmation"]);
  assert.match(partial.message, /could not be sent/);
});

test("venue midnight, leap day and year boundaries use half-open overlap ranges", () => {
  const cases = [
    {
      now: "2026-11-05T22:30:00Z",
      filter: "today",
      start: "2026-11-06T00:00:00+03:00",
      end: "2026-11-06T02:00:00+03:00",
      count: 1,
    },
    {
      now: "2028-02-01T12:00:00+03:00",
      filter: "month",
      start: "2028-02-29T22:00:00+03:00",
      end: "2028-03-01T02:00:00+03:00",
      count: 1,
    },
    {
      now: "2026-12-01T12:00:00+03:00",
      filter: "month",
      start: "2027-01-01T00:00:00+03:00",
      end: "2027-01-01T02:00:00+03:00",
      count: 0,
    },
    {
      now: "2026-12-01T12:00:00+03:00",
      filter: "month",
      start: "2026-11-30T23:00:00+03:00",
      end: "2026-12-01T00:00:00+03:00",
      count: 0,
    },
  ];
  for (const c of cases)
    assert.equal(
      filterEvents([event(c.start, c.end)], "", c.filter, Date.parse(c.now))
        .length,
      c.count,
      JSON.stringify(c),
    );
  assert.equal(
    filterEvents([event("invalid", "invalid")], "", "all", Date.now()).length,
    0,
  );
});
test("past events include the exact ending instant and exclude ongoing events", () => {
  const now = Date.parse("2026-11-06T12:00:00+03:00");
  assert.equal(
    filterEvents(
      [event("2026-11-05T12:00:00+03:00", "2026-11-06T12:00:00+03:00")],
      "",
      "past",
      now,
    ).length,
    1,
  );
});
test("unknown system route keys cannot resolve through the object prototype", () => {
  const n = normalizeNavigation({
    primaryLinks: [{ _key: "bad", routeKey: "toString", label: "Bad" }],
    categories: [],
  });
  assert.deepEqual(n.primaryLinks, []);
});
test("fixture transport is forbidden in a hosted environment", async () => {
  const { fixtureClient } = await import("../src/lib/fixture-client.mjs");
  const previous = process.env.VERCEL;
  try {
    process.env.VERCEL = "1";
    assert.throws(() => fixtureClient(), /forbidden/);
  } finally {
    if (previous === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previous;
  }
});
