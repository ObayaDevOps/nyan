# Implementation status

The repository implementation replaces the prebuild snapshot, adds shared Sanity queries and legacy-to-singleton navigation reads, fixes event fallback/not-found behavior, adds schemas and a guarded migration command, provides a signed refresh endpoint and optional preview routes, validates/protects contact requests, corrects dates, recreates public pages in CSS and removes Chakra and unused packages.

## Rollout steps that still require environment/account access

- Configure the explicit project/dataset/site URL in hosting. Local dataset now matches the previous prebuild's production dataset.
- Review and run the migration in a copied staging dataset with a scoped CMS token; apply production only after comparison. No CMS documents have been written by this implementation session. The existing reader continues to use legacy categories/rental content.
- Configure and exercise the signed Sanity webhook with staging changes (create/update/unpublish/delete, menu reorder and old/new slug). Measure the full 49-event navigation fan-out under actual hosting limits; add a durable queue if it does not reliably fit.
- Configure a shared Redis REST counter and verify trusted Vercel ingress. Production forms fail closed until abuse protection and mail configuration are valid. Live email sending has not been exercised.
- Supply optional preview read token/secret and privately distribute preview links. A Studio preview action and persistent delivery-status dashboard have not been added; the documented authenticated preview routes and provider logs are available.
- Confirm the venue timezone/filter policy, correct Facebook destination and any external consumers of removed example OG endpoints.
- Review the captured desktop/mobile visuals, particularly media framing and native form/status controls. Pixel equivalence is not certified. Current bundle and refresh measurements are recorded in `baselines.md`.
- CI uses the explicit `NYAN_TEST_MODE=fixture` offline content adapter, forbidden on Vercel/production deployments. Real publishing and protected deployment webhook tests remain staging release gates.
- After an observation period, retire legacy schema/reader/API adapters with retained backups. Separate Studio hosting is deferred: embedding retains one deployment and its own styled-components dependency.

## Verification

Local verification is complete as listed below. No deployment, production CMS mutation, live email or hosting configuration change is implied by a successful local check.

- Migration dry run against published production content succeeded: six categories; navigation and rental singleton targets are absent. No writes were applied. Authenticated draft/conflict verification still needs the migration token.
- Clean lockfile contains no unversioned package entries; `npm ci` succeeded. Direct runtime dependencies reduced from 22 to 11.
- Final lint passes without warnings; fourteen focused unit tests pass. Remaining moderate advisory cascade is documented in `dependency-review.md`.
- A temporary original-source browser capture timed out, so pixel equivalence has not been certified. New production browser checks are recorded separately below.

- Published-content production build completed successfully: all 55 pages generated, with event routes using blocking fallback and 60-second ISR eligibility. Log: `/tmp/nyan-build-implementation.log`.
- Offline CI fixture build completed in `.next-fixture`; its output is isolated from the real-content `.next` build. Log: `/tmp/nyan-fixture-build.log`.
- Browser suite: five checks passed against real published content and the same five passed against the offline build, covering 390/1440-pixel layouts, menu/focus, search/detail navigation, forms and invalid API requests. No client exceptions were observed in those checks.
- Sanity schema extraction succeeded (`/tmp/nyan-schema-extract.json`). Studio loaded without client exceptions and reached the expected project-connection/CORS gate for the new localhost origin. Register/allow the actual editor origin in Sanity before release.
- Signed event webhook regenerated three local routes successfully in 3.83 seconds. Full navigation refresh regenerated 52 local routes in 8.52 seconds, zero failures. Altering the signed raw payload returned 401. These are local measurements, not a production latency guarantee or proof of a real publishing event.
- Local font assets use WOFF2 (about 85 KB for the four heading/body files); Tiny5 remains unchanged and is not preloaded. Font licenses and local SVG attributions are retained.
- A fresh browser also reached the deployed public homepage, but a reliable original-source visual baseline was not captured; final visual approval remains a release gate.

No production deployment, CMS writes, live email sends, webhook registration or CORS/account changes were performed. Production contact fails closed until shared rate protection is configured; do not deploy without following `operations.md`.

- Advisory report refreshed on 6 November: zero critical, zero high, 21 moderate affected entries; all remaining findings trace through the documented minimatch tooling dependency. Final lockfile has no unversioned entries.
