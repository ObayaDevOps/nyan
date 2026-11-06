# Operations

## Publishing webhook

Deploy a Node/ISR-capable server (Vercel configuration is supplied). Configure one Sanity webhook for each dataset/environment:

- URL: `https://SITE/api/revalidate`; POST; secret matching server-only `SANITY_REVALIDATE_SECRET`.
- Trigger create, update and delete; draft/version events disabled.
- Filter: `coalesce(after()._type, before()._type) in ["siteNavigation", "tenantList", "eventPage", "rentalInterestPage"]`.
- Projection:

```groq
{
  "type": coalesce(after()._type, before()._type),
  "id": coalesce(after()._id, before()._id),
  "dataset": sanity::dataset(),
  "beforeSlug": before().slug.current,
  "afterSlug": after().slug.current
}
```

The route verifies raw-body signatures and dataset, waits for query propagation and awaits all path refreshes with at most three concurrent operations. Partial failures return 503 for retry and are logged by counts/IDs. Navigation affects every published event URL, homepage, events list and rental page. Event changes invalidate both old/new slugs. Replay a failed hook through Sanity's delivery dashboard. Never report the change as live without inspecting its output.

Test actual fan-out (49 events at implementation time) under the platform/webhook time limit. If it cannot finish reliably, move fan-out to a durable queue before promising a strict publication deadline. No unawaited serverless background work is used. Timed ISR remains the fallback. Protected staging deployments need narrowly scoped webhook machine access; do not remove deployment protection broadly.

## Contact service

Set explicit `RESEND_API_KEY`, `RESEND_FROM`, `RECIPIENT_ADDRESS`. Verify the sender domain and control test destinations before sending real test mail. There is no fallback personal inbox. React email rendering is retained because Resend dynamically imports it.

Production contact requires `ABUSE_KV_URL` and `ABUSE_KV_TOKEN`, a Redis REST endpoint supporting atomic EVAL. Counters expire after ten minutes (five client attempts and 100 global attempts). Vercel's trusted ingress client header is used; other hosts fail closed until a trusted ingress adapter is configured. Store outages/missing configuration prevent email sends with 503. Tune limits from actual traffic and allow for shared networks. Supplement with platform bot protection if abuse warrants it. An Origin header/honeypot is supplementary, not authentication.

New forms use stable submission IDs; notification and confirmation use separate provider idempotency keys. Confirmation failure after notification is still a successful inquiry. Do not advise users to submit again in this case. Provider duplicate protection is finite; a durable submission store is needed for guarantees beyond provider retention. A temporary legacy adapter resolves old event names/links to one published event and uses a deterministic request hash for duplicate protection. Remove it after cached-form traffic stops; ambiguous/missing legacy event references require a page refresh.

Avoid logging submission bodies, email addresses, tokens or full webhook payloads. Current logs contain only operational labels/document IDs/failure counts.

## Release and rollback

Run lint, unit tests, production build and browser checks before release. For offline checks, set `NYAN_TEST_MODE=fixture` when building/starting locally or in CI (using the separate `.next-fixture` output); never configure it in hosting. The adapter rejects Vercel/production deployment environments. Test real publishing/new/deleted events and signed webhook delivery in a staging dataset; routine tests never send live email. Rebuild after changing `NEXT_PUBLIC_*` values. Keep preview/test mail credentials separate.

Roll back UI independently of security fixes. Retain legacy content for content rollback; preserve singleton edits. If webhook delivery fails, retain timed ISR while repairing and replaying hooks. Revalidate route caches after changing deployments. Do not reintroduce a source JSON build snapshot.

The embedded Studio retains styled-components and Sanity's dependencies. Separate Studio hosting should be considered only if measured build/maintenance savings justify a second deployment; no public UI framework is needed for the website.
