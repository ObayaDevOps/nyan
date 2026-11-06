# Implementation plan

Status: repository implementation and local verification completed on 6 November 2026; external rollout and visual approval remain pending. See [implementation status](./docs/implementation-status.md) for evidence and configuration gates. This document records the implementation plan based on the [audit baseline](./CODE_AUDIT.md) from 5 November 2026.

## Intended result

A nontechnical editor can change menu labels, links, icons, visibility and order in Sanity, publish, and see those changes on the website without asking for a deployment. New events work immediately after publication; unpublished events stop appearing. The public website retains its current visual identity while Chakra, Emotion, redundant icon imports and other unnecessary packages are removed. Forms validate submissions on the server and resist duplicate submissions and automated email abuse.

Implement this as a sequence of reviewable changes on `codeClean`. Keep publishing reliability and the visual migration in separate changes so each has clear evidence and a useful rollback point.

## Architecture decisions

| Area | Planned approach |
| --- | --- |
| Framework | Keep the Pages Router; upgrade to a supported patched Next.js release with a compatible React/Sanity package set. Target Next 16; use a supported patched Next 15 only as a documented intermediate step if an actual compatibility blocker requires it. |
| Content | Keep Sanity and embedded Studio. Introduce fixed-ID navigation and rental singleton documents. |
| Public content updates | Shared server-side Sanity queries in each page's `getStaticProps`, 60-second ISR eligibility and a signed publishing webhook using `res.revalidate`. |
| Navigation delivery | Render navigation in page HTML and pass it as props. No additional browser fetching library or client-only menu is needed. |
| Styling | CSS variables and CSS Modules, existing fonts/assets, semantic HTML and small components. |
| Interactions | React state, a native modal `dialog`, buttons for disclosures, Clipboard API and accessible status messages. Use a focused library only if browser/accessibility testing demonstrates a specific unmet requirement. |
| Icons | Replace dynamic icon lookup with an explicit approved map. Prefer a small set of local SVG components, retaining source licenses and the existing artwork. |
| Email | Keep Resend and its React renderer; implement small, explicit validation helpers and provider idempotency. |
| Abuse controls | Prefer the hosting platform's rate limiting/bot controls. Use a shared durable counter service only if the actual platform cannot provide the required protection. |
| Tests | Built-in Node test runner for business/server logic; Playwright as a development dependency for production-mode publishing, keyboard and visual checks; ESLint run directly. |
| Scope boundaries | JavaScript remains JavaScript. No general TypeScript rewrite, replacement UI framework or App Router migration is needed. |

The installed `next-sanity@9.8.8` declares Next 14/15 peers. Upgrading Next alone is insufficient: resolve and record a compatible tuple of Next, React, React DOM, Sanity, next-sanity, styled-components and Node before editing package versions. Next's current [support policy](https://nextjs.org/support-policy) lists 16 as active LTS and 15 as maintenance LTS; select exact patched versions again when implementation starts.

## Delivery sequence and dependencies

| Change | Deliverable | Depends on |
| --- | --- | --- |
| A | Reproducible configuration, content inventory and visual baseline | — |
| B | Supported dependencies, working lint/build and removal of safe unused packages | A |
| C | Contact API validation, abuse controls and duplicate protection | A; validate on B before release |
| D | Shared Sanity queries, server-rendered navigation, event routing fixes and removal of prebuild | B |
| E | Editor-friendly schemas, safe data migration and singleton cutover | D |
| F | Signed webhook, reliable page refresh, preview and editor guidance | E |
| G | Date filters and time formatting | D |
| H | Responsive images, metadata, video behavior and small accessibility fixes | D |
| I | CSS foundations and page-by-page Chakra migration | E, G, H |
| J | Final dependency cleanup, operational documentation and release checks | C, F, I |

B and C are urgent work. D–F deliver the core editor requirement. I can proceed after those work correctly; the editor workflow does not have to wait for the UI rewrite. This ordering describes separate review units, not a requirement to delegate work to additional agents.

## A. Establish configuration and baselines

**Files:** `README.md`, new `.env.example`, `package.json`, `vercel.json`, new `docs/baselines.md`, development-only fixtures/tests as needed.

1. Record the current deployed routes, Sanity project/dataset, public site origin, hosting runtime and platform limits. Confirm whether this Vercel configuration reflects the actual deployment. Check Studio roles/CORS and existing webhook configuration through the relevant account when access is available.
2. Resolve the current local build failure: the effective Sanity dataset is missing. Read existing configuration securely; do not invent a production value or expose secrets. Identify required versus optional variables and give missing configuration a useful error before querying Sanity.
3. Add `.env.example` containing variable names and safe placeholders. Keep the existing public Sanity variable names for compatibility. Document `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, a pinned API version, `NEXT_PUBLIC_SITE_URL`, server-only `RESEND_API_KEY`, `RESEND_FROM`, `RECIPIENT_ADDRESS`, `SANITY_REVALIDATE_SECRET` and optional `SANITY_API_READ_TOKEN`/`SANITY_PREVIEW_SECRET`. Add rate-limiter credentials only if a shared service is selected.
4. Separate environments: preview deployments use a test dataset and controlled email destinations or a mocked sender. Production secrets and CMS write tokens must never be browser variables. Make explicit that `NEXT_PUBLIC_*` values are fixed into the build.
5. Inventory published and draft documents, category/tenant ordering, actual icon names, malformed links, missing event slugs/images/dates and all rental-page documents. Treat the committed menu JSON as a historical snapshot; the live published documents are the migration source. Preserve existing URL slugs.
6. Capture the homepage, menu open/expanded, events list/filter/empty state, event detail, rental form/error/success and Studio at representative widths: 375, 768 and 1440 pixels. Include short-height mobile, long category names and long forms. Keep fixed content fixtures so later visual comparisons are repeatable.
7. Record public-route JS sizes, request counts, representative image sizes and a consistent performance run. Use the same build mode/device/settings for later comparisons; do not infer browser savings from node_modules size.

**Acceptance:** a valid local environment can fetch the intended test dataset; fixtures and route inventories exist; build failure causes are documented; screenshots and measured baselines are available before visual changes. Check the current `.gitignore`: the lockfile is already tracked and is not ignored, so retain it without an unnecessary ignore-rule change.

## B. Restore build and dependency health

**Files:** `package.json`, `package-lock.json`, `next.config.js`, `vercel.json`, new `eslint.config.mjs`, new `.github/workflows/ci.yml`, runtime version declaration, related import sites.

1. Re-run the dependency audit and classify findings by actual runtime use, build/Studio use and unused packages. Save a concise advisory disposition with each unresolved high/critical finding and owner/action. The previous count is a baseline, not a permanent target or proof of exploitation.
2. Resolve a supported version set from package peer requirements and official migration guides. Pin the Node major used locally, in CI and in hosting. Upgrade in coherent groups; avoid forced peer resolutions and `npm audit fix --force`.
3. Keep Chakra temporarily while checking compatibility. If it blocks the preferred framework tuple, use a supported compatible intermediate release and schedule the final tuple as part of I/J. Do not keep an unsupported framework deployed throughout a long UI migration.
4. Remove `nodemailer`; remove unused `react-datepicker` imports/CSS; remove the unused Cloudinary helper and its imports, then `cloudinary-build-url`. Search references before each removal. Rebuild and inspect lockfile changes.
5. Correct undeclared direct imports: declare `@sanity/client` and `@sanity/icons` if they remain directly imported; use a supported `groq` export from next-sanity instead of relying on a hoisted package. Remove copied date-fns preview logic in E so it need not become another direct dependency.
6. Replace `next lint` with direct ESLint execution. Configure React Hooks and Next rules supported by the selected versions; make CI noninteractive. Use a staged lint cleanup if needed, with no new warnings in changed files and an explicit final cleanup in J.
7. Confirm external usage of `/api/og/route`, `/api/og/ecommerce` and `/api/hello`. Default plan: retire these unused examples and remove direct `@vercel/og`. If an actual consumer is found, retain a proper default Pages API handler, fixed dimensions/input limits and allowlisted image destinations; test it as a maintained route. Do not copy an App Router `GET` handler into `pages/api`.
8. Configure clean install, lint, focused tests and build in CI. A routine pull request uses deterministic fixtures/mocked external services; add a documented integration run against the staging dataset. Production build jobs use real environment configuration. Keep any fixture adapter server-only and explicitly forbidden in production deployment mode.
9. Move font files into `src/fonts` using the same families/weights, `next/font/local` and required license notices. Confirm rendering against A before removing Google font imports. This makes builds independent of Google Fonts network requests.

**Acceptance:** `npm ci`, lint, tests and `npm run build` pass with the documented environment; public routes and Studio load; dependency peers are valid; active high/critical findings are fixed or have a concrete, reviewed disposition. No mail is sent by routine CI.

## C. Harden contact handling

**Files:** `src/pages/api/contact.js`, `src/components/emails/contactEmailTemplates.jsx`, `src/pages/events/[slug].js`, `src/pages/rental-interest.js`; new `src/lib/contact/{validation,service,abuse}.js`, shared form helpers where useful, focused tests.

1. Introduce a versioned payload discriminator: `{type: 'event', submissionId, eventId, name, email, phone, ...}` or `{type: 'rental', submissionId, businessName, website, budget, floorArea, contactName, email, phone, ...}`. Normalize in one place and map to existing email templates rather than rewriting the templates unnecessarily.
2. Validate JSON content type, a bounded request body (initial limit 32 KB), field types, trimming and lengths. Initial limits: names/business names 120 characters, email 254, phone 40, URL 2048, referral 200 and extra information 4000. Reject control characters in header-bound fields. Parse budget/area as finite positive numbers with business-approved maxima; format values after validation. Support international phone formatting without claiming to verify ownership.
3. Validate HTTP(S) business links and reject unsafe schemes. Return structured field errors without echoing private submission data into logs or responses. These checks are small enough to implement locally; introduce a schema package only if later complexity justifies it.
4. Fetch event title, dates and contact URL by published event ID on the server. Reject missing/unpublished events and use authoritative values in mail. Include `_id` in the event detail query and form props; do not trust client-supplied event names/links.
5. Remove the personal-recipient fallback. Validate the configured sender and recipient list; respond with a generic unavailable message and log only a configuration error if they are absent. Test against controlled recipients and verify sending-domain configuration before enabling live mail.
6. Add per-client and global send-rate controls at the trusted hosting boundary. Initial tuning target: five attempts per ten minutes per client, with a separate global cap based on real traffic/provider quota. Allow for shared networks; return 429 with a retry hint. Never trust an arbitrary forwarded-IP header supplied by the caller. If platform controls are unavailable, implement an atomic expiring counter using a shared store through a small adapter; no process-local production limiter.
7. Add an accessible honeypot and validate expected browser origins as supplementary signals; neither substitutes for rate limiting. Decide on a managed challenge only if observed abuse warrants it. On protection-service failure, stop email sends and return a retryable unavailable response.
8. Generate a submission ID in the form, retain it for retries of unchanged data, and use separate Resend idempotency keys for staff notification and visitor confirmation. Keep send order: staff notification first, confirmation second. Scope keys to type/submission/message; handle provider conflicts and concurrent retries deliberately. [Resend idempotency documentation](https://resend.com/docs/dashboard/emails/idempotency-keys).
9. Freeze the form's normalized submission values during retries. If freshly fetched authoritative event data or another message input changes and the provider rejects the repeated key as a payload conflict, return a clear conflict response without automatically creating a fresh key or resending the notification. Provider idempotency has a finite retention period and is duplicate protection, not an anti-spam system. Add a durable submission snapshot only if recovery requirements go beyond that guarantee.
10. Add a pending state, disabled submit button, inline field errors and a live status message. Preserve typed values on failure. A sent staff notification with a failed confirmation remains a successful submission with a clear confirmation warning, avoiding duplicate staff mail.
11. Deploy API compatibility before switching forms: temporarily normalize the old payload shape. Old event forms lack an event ID; resolve their event name/contact link to exactly one published event, reject missing/ambiguous matches, and use the server's data. Retain only bounded legacy compatibility for cached HTML/open tabs, monitor old requests, then remove it in J. The legacy path receives the same validation and abuse controls; provider duplicate protection applies once forms supply stable submission IDs.

**Tests:** malformed/oversized JSON, arrays/objects in string fields, whitespace-only values, invalid/oversized numbers, unsafe URLs, forged event data, deleted event, missing configuration, send failure, partial success, concurrent duplicate requests, duplicate retry and changed-data conflict. Mock Resend. Browser-check rapid clicks, retry behavior, keyboard errors and retained input.

**Acceptance:** valid event/rental inquiries produce the intended notification; invalid submissions never invoke Resend; production abuse controls are effective across instances; retries do not duplicate notifications within the provider guarantee; no silent personal-recipient fallback remains.

## D. Replace prebuild with page data and fix event routes

**Files:** `sanity/env.js`, `sanity/lib/client.js`; new `sanity/lib/queries.js`, `src/lib/content.js`; `src/pages/index.js`, `src/pages/events/index.js`, `src/pages/events/[slug].js`, `src/pages/rental-interest.js`, `src/components/sidebar.js`, `package.json`, `vercel.json`.

1. Centralize project ID, dataset and a single API version. Use the supported client with explicit published perspective, `useCdn: false`, bounded timeout/retries and contextual errors. Instantiate it lazily where appropriate so a CMS-independent API route does not fail solely from an unused import. Keep authenticated preview fetching separate and server-only.
2. Define projected queries for navigation, event listing, event detail, event lookup for mail, event paths and rental content. Return only used fields plus stable IDs, revision metadata and image metadata needed later. A shared normalizer produces predictable serializable props.
3. First implement `getNavigation()` against existing `tenantList` documents, ordered by `_createdAt` plus `_id` as a deterministic tie-break. This separates removal of prebuild from the later data migration. Preserve current appearance and arrays.
4. Add homepage `getStaticProps`; fetch navigation in the other three public page data functions. Fetch independent page content/navigation concurrently. Pass `navigation` through the current page components to `SideBar`. Leave Studio outside the public layout. Keep data-fetching code out of the browser bundle and avoid `_app.getInitialProps`.
5. Use `revalidate: 60` consistently, including not-found event results. On network/auth/server errors, throw so a successful cached page is retained. On an authoritative missing event, return `notFound`; do not disguise an outage as a deletion. Initial builds fail clearly if required content/configuration is missing. Removing prebuild does not make static generation independent of Sanity.
6. Change event paths to `fallback: 'blocking'`; validate route parameters and return `notFound` before rendering null. Exclude invalid/missing slugs from the listing and path query, with actionable content diagnostics. Keep existing slugs working and define old slug behavior as 404 after change; redirects can be added only if preserving old URLs becomes a business requirement.
7. Supply safe image fallbacks and intentional missing-content behavior. For required singleton content during migration, retain deterministic legacy selection; do not silently use the first unordered document. A missing required rental page produces a clear content error instead of an empty fabricated page.
8. Once every public route reads server data, remove all prebuild hooks, the three `src/functions/preBuildScripts/*` files and the production JSON import. Retain migration evidence outside runtime code, then delete `src/data/preBuild/tenantListData.json` from application source. Remove Axios.
9. Simplify scripts to `dev`, `build`, `start`, `lint`, `test` and `test:browser`. If existing automation uses build aliases, keep aliases calling the canonical build temporarily. No command writes fetched content into tracked source.

**Acceptance:** change a legacy tenant in staging and observe updated server-rendered navigation without a deployment; create an event after build and load its detail URL; unpublish/delete it and confirm listing/detail removal; simulate query failure and confirm the last good cached page survives. Verify on a production build/server, not only `next dev`. [Pages Router ISR behavior](https://nextjs.org/docs/pages/guides/incremental-static-regeneration).

## E. Give editors safe schemas and migrate content

**Files:** new `sanity/schemas/siteNavigationSchema.js`, new `sanity/structure.js`, `sanity/schemaTypes.js`, `sanity.config.js`, existing event/rental schemas, query/normalizer modules; new `scripts/migrate-navigation.mjs`, `scripts/migrate-rental-page.mjs`, `docs/content-migration.md`.

### Navigation document

Use `_type: 'siteNavigation'`, `_id: 'siteNavigation'`, with these fields:

| Field | Editor behavior and constraints |
| --- | --- |
| `primaryLinks[]` | Ordered objects with stable `_key`, editable label, visibility and an allowed route key for Home/Events/Rental. Resolve destinations from code, preserving working system routes. |
| `categories[]` | Ordered objects with stable `_key`, required label, visibility, `iconKey` and `links[]`. |
| `categories[].iconKey` | Friendly dropdown backed by a finite map; default general-purpose icon. Preserve legacy artwork through a migration map. No React export names exposed to editors. |
| `categories[].links[]` | Ordered objects with stable `_key`, required name, required HTTP(S) URL and visibility. Validate on ingestion as well as in Studio. |
| `socialLinks` | Named Instagram, Facebook and map URLs, plus a validated contact email; display only configured links. Editors can correct destinations without source edits. |

Use nested objects because tenants currently appear only in the menu. Extract tenant documents later if another feature needs reusable tenant content. Keep external-link behavior consistent; add `rel` safeguards if new tabs are used.

1. Add descriptive field help, real document/array previews and friendly navigation headings. Hide technical fields that editors do not need.
2. Configure fixed-ID entries for navigation and rental content. Use the native singleton registry if the selected Studio version supports it; otherwise use custom structure, template filtering and restricted duplicate/delete actions. Fixed queries and content validation remain necessary because a Studio UI restriction is not database uniqueness enforcement. [Sanity singleton structure reference](https://www.sanity.io/docs/studio/structure-builder-cheat-sheet).
3. Tighten event schema: require slug/display image or documented fallback, validate uniqueness and safe slug generation, require end after start, add image alt text, improve date/image previews and explain venue timezone. Preserve published slugs. Existing invalid documents are repaired before stricter release gates are enforced; schema changes do not retroactively repair data.
4. Convert rental content to fixed `_id: 'rentalInterestPage'`. When several candidates exist, compare content/drafts and explicitly select the canonical document; do not overwrite an editor's draft. Replace copied preview fields/date-fns code and review duplicate title/pageName fields before removing unused ones.

### Migration and cutover

1. Export the affected dataset/documents and record `_id`/`_rev` manifests securely. Keep backups outside public assets and Git if they contain private content. Run migration in a copied test dataset first.
2. Default scripts to dry run. Report source IDs, destination IDs, projected counts, invalid entries, unknown icons, existing target conflicts and draft differences. Fail on unresolved content conflicts instead of dropping entries or substituting arbitrary icons.
3. Preserve live category order, tenant array order and stable `_key` values. Generate missing keys deterministically from source IDs/positions and verify uniqueness. Migrate primary/social configuration from active code; obtain the actual Facebook destination rather than copying the incorrect Maps URL.
4. Use create-if-absent/revision-guarded writes. Never overwrite a previously edited target on rerun. Require explicit dataset selection for a write run, and keep write tokens server-side. Scripts must not delete source documents.
5. Deploy schemas and a reader that uses the new singleton when present, falling back to legacy documents only when the singleton is absent—not on a failed query or invalid target.
6. Apply the reviewed migration, compare names/links/order/icons and inspect every public route. Pause edits to the affected documents briefly for final copy/cutover; reconcile drafts explicitly. Publish the new document after review.
7. Move editors to the singleton, hide legacy document creation and mark retained source documents read-only. Update the reader to require the singleton after the rollback window; remove legacy query code. Archive/delete old documents only as a separate content-retention decision after backup and acceptance.

**Acceptance:** an editor can add, rename, reorder, hide and remove categories/links; invalid entries block publishing with clear messages; icons are selected by name; primary/social settings are editable; no duplicate singleton affordance appears; migration dry run is repeatable, write reruns preserve edits and legacy content can still support rollback.

## F. Implement publishing refresh, preview and editor guidance

**Files:** new `src/pages/api/revalidate.js`, `src/lib/revalidation.js`, preview enable/exit API routes, server-only preview query helper, `docs/publishing.md`, `docs/operations.md`, Studio preview configuration and small status UI only if justified.

### Webhook contract

1. Configure one POST webhook per environment/dataset for navigation, rental and event published changes, including create/update/delete. Exclude draft/version edits. Project document type/ID, before/after slug and available revision metadata; use `before()` for deletion and slug changes. Prepare a checked-in configuration example without credentials. [Sanity webhook configuration](https://www.sanity.io/docs/content-lake/webhooks).
2. In the Pages API route, disable body parsing, enforce a small raw-body limit and verify the signature before parsing/trusting JSON. Use the official supported verification helper for Node requests. The currently installed `next-sanity/webhook.parseBody` expects a Fetch `NextRequest`, so do not pass a Pages `NextApiRequest` directly to it. A focused direct `@sanity/webhook` dependency is justified if the selected integration has no suitable Pages helper.
3. Fail closed when the secret is absent; validate payload type/ID and environment. Derive paths internally; never accept arbitrary URLs/paths for revalidation. Cover payloads representing deletes where `after` is null.
4. Handle origin query propagation: use bounded retry/backoff and available revision checks after a published update. Keep the complete operation within the webhook/platform time budget. A successful signature alone does not prove new query results are already visible.

| Changed document | Routes to revalidate |
| --- | --- |
| Navigation singleton | `/`, `/events`, `/rental-interest`, every currently published event slug |
| Rental singleton | `/rental-interest` |
| Event create/update | `/events`, new/current slug and previous slug when different |
| Event delete/unpublish | `/events` and previous published slug |

5. Deduplicate paths. Measure fan-out using the inventory from A; for this small site, start with bounded concurrency of three. Log route counts, duration and failures without secrets. Revalidation is safe to repeat for webhook retries and out-of-order updates because reads obtain current published content.
6. Return success only after every intended route has completed successfully. Return a retryable status for operational/partial failures and record which paths failed. Do not launch unawaited work after responding from a serverless handler. Timed ISR remains a recovery path, not a strict publish deadline.
7. Sanity documents a 30-second webhook timeout. Set a measured completion budget below that and the hosting limit. If the complete fan-out cannot reliably fit, add a durable job/queue adapter before promising prompt updates everywhere; do not silently cap the route list. Queue completion, retries and editor status must then be tracked separately. [Webhook delivery limits](https://www.sanity.io/docs/content-lake/webhooks).
8. Use a staging target of all affected routes showing a published edit within 30 seconds under normal service conditions. Measure it with the actual number of events; document any revised target before release. This does not imply that already-open browser tabs refresh themselves.
9. Confirm webhook delivery reaches protected preview deployments using a narrowly scoped machine-access mechanism. Production and staging secrets/datasets must be separate; do not broadly remove deployment protection.

### Preview and editorial feedback

1. Add an optional Studio “Preview website” action for navigation/rental/events using a supported authenticated preview flow. Set a short-lived Pages preview cookie after verifying the preview authorization, and redirect only to allowlisted local routes. Keep read tokens server-side; return preview responses without public caching. Provide an obvious exit-preview control.
2. Query drafts only in authenticated preview mode; the public client always queries published content. A draft-only new event must work in preview even though it is absent from published paths. Protect preview links and sanitize redirects; a read token must never be embedded in a link.
3. Support draft editing and a preview badge without adding a continuous live-update SDK. Verify current preview APIs against the chosen Next/next-sanity tuple.
4. Write a short editor guide: edit, preview, publish, check the website, and what to do if the change is delayed. Distinguish Sanity's publication status from verified delivery to the website. If no delivery status store is introduced, show only honest publication/update timestamps and link operators to webhook logs; do not display “live” merely because Publish succeeded.

**Tests:** missing/forged/altered signature, raw-body mismatch, oversized input, irrelevant type, draft edit, create/update/delete, old/new slug, new event absent at build, partial failure/retry, origin propagation delay, rapid consecutive edits, missed webhook/timed recovery, protected staging delivery, preview isolation and external redirect rejection.

**Acceptance:** a real staging publish updates every affected route without deployment, invalid hooks do nothing, deletions/slug changes clear old output, retry failures are visible and preview never leaks drafts into public pages.

## G. Correct event dates and filtering

**Files:** `src/pages/events/index.js`, `src/pages/events/[slug].js`, shared email date formatting; new `src/lib/events.js` with focused boundary tests.

1. Use `Africa/Kampala` as the proposed venue timezone, confirm it against venue operations and centralize it. Format server, browser and notification dates with the same `Intl.DateTimeFormat` settings.
2. Define filter semantics explicitly: Today covers events overlapping the current venue calendar day; This Weekend covers Friday through Sunday, using the current weekend on Saturday/Sunday; This Month covers events overlapping the current venue month; Past Events means `eventEndTime <= now`; All Events applies only the text search. Label any future change to “upcoming this month” explicitly.
3. Use half-open intervals `[start, nextBoundary)` and overlap logic `eventStart < rangeEnd && eventEnd > rangeStart`. Reject invalid dates in content diagnostics; tolerate existing malformed data without crashing the entire list.
4. Keep only search/filter selection in state; derive the displayed list from current props and those selections. Use stable `_id` keys. Centralize sort order, retaining the current descending order unless product review changes it.
5. Prevent server/browser timezone hydration differences by using the same formatting and a serialized reference time for initial render; update relative filters after hydration and at meaningful time boundaries. Reconcile on tab focus so an open page crosses midnight correctly.

**Tests:** Friday, Saturday and Sunday; Sunday evening; final day of month; year rollover/leap day; UTC-to-venue midnight; event spanning midnight/weekend/month; event ending exactly at a boundary; ongoing event; invalid date; text search combined with each filter. Inject clock values rather than relying on wall-clock test timing.

**Acceptance:** valid boundary/ongoing events appear in the defined filters and date/time displays agree across server, browser and email.

## H. Improve images, metadata, media and immediate accessibility

**Files:** `sanity/lib/image.js`, query projections, `next.config.js`, public pages, `src/components/boxWithYTBackground.js`, `src/components/sidebar.js`; new shared `Seo`/image helpers if they remove real duplication.

1. Fetch image dimensions, crop/hotspot and `metadata.lqip`. Retain `@sanity/image-url` and use its transforms for bounded responsive image URLs. Include accurate Next Image `sizes`, aspect ratios and alt text; use actual small LQIP values or omit blur placeholders. Limit remote image patterns to the real project/cloud paths supported by the chosen Next release.
2. Consolidate SEO metadata: page-specific title/description, canonical origin/path, absolute OG image URLs and consistent fallbacks. Add an accessible homepage h1 and review nested/multiple h1 usage on events. Use appropriate sharing-image dimensions instead of asking editors to hand-create tiny thumbnails.
3. Add an actual search label and `aria-pressed` to filter buttons; preserve visible focus and contrast. Fix navigation category buttons/expanded state and child keys immediately, before the final drawer rewrite. Re-enable focus restoration while Chakra remains.
4. Correct Facebook's destination using verified content; do not guess a profile URL. Consolidate settings through E.
5. Retain YouTube initially: add iframe title and a poster fallback, pause/play controls and reduced-motion handling. Use a small client-side controller for the official iframe API, a stable iframe URL and proper cleanup so mute/pause does not reload the video. Validate video IDs and avoid a wrapper dependency. Keep the poster if playback/script loading fails; do not autoplay for reduced-motion users. A native video remains an alternative only if an owned asset is supplied.
6. Check keyboard access to media controls, form error associations and status announcements. Avoid suppressing focus outlines and do not rely solely on color or placeholder text.

**Acceptance:** no full-size image is downloaded as its own blur placeholder; images fit cards without layout shifts; metadata points to the current route; media can be paused; reduced-motion and script-failure states remain usable; menu/search/filters work by keyboard.

## I. Recreate the design with CSS and remove Chakra

**Files:** `src/pages/_app.js`, `src/styles/globals.css`, new `src/styles/tokens.css`, page/component `.module.css` files; public pages, `src/components/sidebar.js`, media component, Studio wrapper; a small `src/components/ui/` set.

### Foundations

1. Extract actual computed colors, font metrics, spacings, borders, shadows, breakpoints, stacking and reset behavior from A. Preserve values rather than approximating Chakra names. Set explicit yellow/black site tokens and intentional color-scheme behavior.
2. Add the minimum reset and native control styling needed for matching typography/layout. Scope public-site rules so Studio inputs/layout do not inherit accidental overrides. Replace leftover create-next-app gradients/tokens and unused Home module after reference checks.
3. Implement only reused UI: button/link styles, labelled fields with error/help text, form status, event card and public layout. Native `div`, `section`, `main`, flex/grid and CSS media queries replace Box/Stack/Grid primitives. Do not build a prop-compatible Chakra replacement.
4. Consolidate icons into local SVG components. Preserve source artwork/viewBox, decorative versus labelled semantics and upstream license attribution. Introduce the approved `iconKey` map used by E; migrate navigation, search, socials and media controls before removing packages.

### Page migration

1. Migrate homepage and its simple fades/hover effects; use CSS animations and reduced-motion overrides. Keep fixed screenshot states independent of animation timing.
2. Migrate events listing/cards/filter controls and detail content, using G/H helpers. Preserve responsive card counts and spacing.
3. Extract reusable field presentation/validation status from rental/event forms, then migrate both forms. Keep C's payload behavior, pending state and server error mapping. Replace custom toasts with persistent in-form live status; preserve success/error visibility without requiring toast infrastructure.
4. Introduce `SiteLayout` for public pages, receiving `navigation` from page props and a homepage header option. Use a consistent Pages `getLayout` convention or explicit page wrappers, chosen once. Remove duplicated sidebar placement only after comparing top spacing/background behavior. Studio and error pages receive their own appropriate layouts; do not add a global `_app.getInitialProps` fetch.
5. Replace Studio's outer Chakra Box with a plain CSS wrapper, maintaining a usable viewport and scroll behavior. Keep Sanity's own UI and styled-components support.

### Menu interactions

1. Use a single native modal `dialog` containing a labelled navigation landmark. Open/close through a React ref/effect synchronized with dialog events, including native cancel/Escape. Avoid duplicate hidden copies.
2. Focus the close control or appropriate first item on opening; keep focus inside the modal; restore focus to the opener on close. Lock and restore background scrolling, including cleanup after route changes/unmount. Check short-height mobile layout so the social/footer area does not cover links.
3. Use category buttons with unique controlled region IDs, `aria-expanded` and keyboard activation. Handle child links independently so they do not toggle the category; close the menu on relevant navigation. Add collapse animation only when it preserves hidden-content accessibility.
4. Implement email copy with `navigator.clipboard.writeText`, try/catch and an announced success/failure state. Provide a usable mail link when clipboard access is unavailable. Use simple accessible help text instead of rebuilding a generic tooltip system.
5. Preserve the baseline look at all target sizes; verify real keyboard and mobile behavior before removing the Chakra provider.

### Remove dependencies

After reference search and tests pass, remove `@chakra-ui/react`, `@chakra-ui/icons`, `@emotion/react`, `@emotion/styled`, `framer-motion`, `react-icons` and `lucide-react`. Confirm the public route bundles no longer contain Chakra/Emotion/Framer Motion; a transitive copy elsewhere in the installed dependency tree does not imply the public route still uses it.

**Acceptance:** baseline screenshots match within a reviewed tolerance, required interaction tests pass, there is no unintended theme/font/breakpoint change, no Chakra imports/provider remain and public-route JS/performance is measured against A. Keep styled-components for Studio; do not claim the whole project is free of styling dependencies.

## J. Final cleanup, release and operations

**Files:** dependency/lock files, remaining unused source/assets, README, publishing/migration/operations docs, CI and tests.

1. Remove unused hardcoded tenant lists, dead imports, unregistered custom delete plugin, unused footer/helpers/styles and placeholder assets after reference and external-use checks. Preserve active favicons, font licenses, domain verification and externally referenced documents such as PDFs unless intentionally retired.
2. Remove Vision and its Studio registration from the editor-focused production Studio; retain it only if the maintainers establish a real need. Remove temporary legacy API/query compatibility after monitoring the transition window.
3. Keep core framework/runtime, Sanity/next-sanity, required direct Sanity packages, image URL helper, Resend, React email renderer and Studio's styled-components. Record reasons for any additional runtime package. Remove unused date-fns application imports; transitive Studio dependencies may remain.
4. Re-run audit/import/peer checks, production build, targeted tests and bundle comparison. Document remaining advisories and measured results. Do not add artificial tests for every deleted import; test meaningful behavior and regressions.
5. Finish docs: environment setup, scripts, local versus production ISR, editor guide, migration dry-run/apply/rollback, webhook configuration/retry/replay, recipient configuration, key rotation and dependency maintenance. Log operational events by document/request ID rather than full content, contact details or secrets.
6. Add operator visibility using existing deployment/webhook/provider logs: publish refresh failures, contact send failures, rate-limit events and recent successful refresh times. Introduce additional monitoring services only if existing facilities cannot meet operations needs.
7. Evaluate separate Studio hosting using measured public JS, build time and dependency maintenance. Default is to keep embedded Studio because it avoids another deployment. If isolation has clear value, write a follow-up decision covering shared schemas, project/dataset/CORS, access URL, ownership, CI and independent rollback. It is not a prerequisite for removing Chakra.

**Acceptance:** all audit items are implemented or have an explicit conditional disposition; runtime packages have a recorded purpose; editor/operator documentation is usable by someone outside this conversation; final release checks below pass.

## Verification strategy

| Layer | Required checks | Execution |
| --- | --- | --- |
| Static/reproducibility | Clean install, valid peers, lint, production build, no generated content diff | CI on each change |
| Unit | Validation/date boundaries, navigation normalization, deterministic migration keys, route mapping and unsafe URL rejection | Node test runner; injected clocks/services |
| API integration | Mocked email sends/partial failure/idempotency, signed webhook bytes, invalid hook/config, rate limiter behavior | Local/CI without live mail |
| Publishing integration | Add/edit/reorder/hide/delete navigation; new/changed/deleted event; missed webhook; cached-page survival | Staging dataset and production Next server |
| Preview | Draft-only event, public/draft separation, exit preview, cache headers and redirect restrictions | Staging with controlled credentials |
| Browser | Keyboard menu/focus/Escape, scrolling, forms/rapid submit/errors/status, search/filter/media | Playwright Chromium; focused Firefox/WebKit coverage for dialog/forms |
| Visual | Home, menu states, list/detail/rental/Studio, long content and short screens at baseline widths | Fixed fixtures and reviewed screenshots |
| Performance | JS per public route, image/request sizes and same-settings rendering run | Compare A with final production build |
| Operational | Protected webhook delivery, actual rate controls, origin consistency, bounded fan-out, rollback rehearsal | Preview deployment before production release |

Do not treat a successful mocked build as proof of real Sanity integration, or `next dev` refresh as proof of production ISR. Keep these checks distinct and label evidence accordingly.

## Rollout and rollback

1. Release configuration/framework/contact fixes with controlled preview email testing first. Verify Studio and existing public routes before content changes.
2. Release D against legacy content and verify timed updates and new event routes. Then deploy E's additive schemas/dual reader, run reviewed migration in staging, and repeat with the intended production dataset after the content comparison is complete.
3. Enable each environment's webhook after the matching endpoint is deployed; publish test edits, verify all pages, inspect failures and confirm fallback recovery. Preview and rate controls must also work on the real host.
4. Roll out I in separate page-level changes, preserving screenshot/interaction evidence. Complete J and remove compatibility code only after a defined observation window (initial proposal: seven days plus confirmation no legacy usage remains).
5. For a UI regression, roll back only the UI change to the last tested release. For webhook failure, disable the hook temporarily and retain timed ISR while repairing it. Do not roll back security fixes merely to recover styling.
6. For migration failure, use the retained legacy documents and compatible reader release. Preserve edits made to the new singleton; reconcile them before switching back. Restoring an entire dataset backup over new edits is a last resort, not the routine rollback.
7. After deployment rollback, verify route caches and revalidate as necessary. Retain known working environment/webhook configuration for each release. Avoid reintroducing prebuild as the normal rollback strategy.

## Decisions that require environment or business facts

These do not block writing code or preparing previews; resolve them before the affected rollout.

| Fact | Planned default | When it must be resolved |
| --- | --- | --- |
| Actual host/runtime and rate-limit capabilities | Existing Vercel configuration, Node runtime, platform protection first | A/C/F release |
| Canonical rental document and editor drafts | Explicit comparison/selection; never arbitrary overwrite | E migration apply |
| Menu scope | Editable primary labels/order/visibility, categories/tenants, socials; fixed allowed system destinations | E schema review |
| Venue timezone/filter semantics | Africa/Kampala and overlap semantics defined in G | G acceptance |
| Correct Facebook URL | Obtain from existing verified business configuration | E/H publication |
| Publication latency and route count | 30-second staging target with webhook, 60-second eligibility fallback | F release |
| Notification recipients/domain | Explicit verified configuration; no personal fallback | C live email test |
| External OG/example endpoint or PDF consumers | Remove examples only after usage review; preserve existing documents by default | B/J deletion |
| Exact package versions | Supported compatible tuple, locked after current advisory review | B implementation |

## Audit coverage

| Audit finding | Work package(s) |
| --- | --- |
| 1. Menu needs rebuild | D, E, F |
| 2. New event 404/deleted content | D, F |
| 3. Email abuse/personal fallback | C |
| 4. Vulnerable dependencies | B, I, J |
| 5. Inconsistent Sanity configuration | A, D |
| 6. Technical menu schema/order | E |
| 7. Keyboard/focus/keys | H, I |
| 8. Date range/timezone errors | G |
| 9. Weak schemas/rental ambiguity | E, D |
| 10. Incorrect OG API convention/unrestricted image input | B, H |
| 11. Dead code, icon imports, datepicker, images, socials, media, SEO, fonts, CSS, logs and tooling/docs | A, B, H, I, J |
| Optional draft preview | F |
| Separate Studio hosting evaluation | J |
| Lockfile ignore finding | Corrected on reinspection: tracked and not ignored; retain as-is |

## Completion criteria

- A nontechnical editor completes the navigation publishing journey without code changes, rebuilds or knowledge of component names.
- New events load, unpublished/deleted events are removed, and navigation refresh works on every public route.
- Public content/drafts are isolated; failed regeneration preserves last good content; initial failures are actionable.
- Both forms enforce server validation, effective distributed abuse controls and safe retry behavior.
- The same website design and required interactions work without Chakra/Emotion/Framer Motion in public route code.
- Packages removed are no longer imported, required indirect integrations still function, and the dependency/security disposition is recorded.
- Production build, meaningful tests, editor acceptance and rollback rehearsal are complete; remaining conditional decisions have explicit outcomes.
