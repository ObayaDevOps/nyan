# Code audit — codeClean

Historical baseline. Repository implementation and current verification results are recorded in [implementation status](./docs/implementation-status.md).

Audit date: 5 November 2026. Scope: all tracked application source, Sanity schemas/configuration, build scripts, package declarations and deployment configuration. This is an assessment; application behavior and CMS content have not been changed.

## Recommendation

Keep Sanity. Replace the menu's prebuild JSON snapshot with published Sanity content fetched through Next.js page data functions and incremental static regeneration (ISR). Give editors an ordered navigation document with friendly fields and an icon picker. Add a signed publishing webhook if prompt updates are needed. No router migration is necessary to solve this problem.

The current look can be recreated with CSS Modules, the existing fonts/assets, and small React components. Remove redundant packages first, then migrate Chakra in stages. Preserve accessible interaction behavior, not just screenshots. Do not replace Sanity's client, email rendering, or complex accessible interactions merely to lower the dependency count.

## Prioritized findings

### 1. High: published menu changes require another deployment

Evidence: `src/functions/preBuildScripts/preBuildUtilities.js:9`, `src/components/sidebar.js:80`, `src/components/sidebar.js:256`, `package.json:5`.

The flow is `npm run build` → npm's `prebuild` hook → Axios request to Sanity → overwrite `src/data/preBuild/tenantListData.json` → bundle that JSON into the sidebar. There is no runtime menu fetch. Publishing a change in Studio cannot update an already deployed bundle. Event/rental page regeneration does not refresh this imported JSON.

There are also inconsistent build entry points: `npm run build` runs `prebuild`; `npm run build:dev` runs `prebuild:dev`; `npm run build:prod` has no matching `prebuild:prod` and skips the fetch. Vercel explicitly uses `npm run build`, so that configured path does fetch it. Development fetches once before server startup, not on each edit. npm lifecycle behavior is documented in [npm scripts](https://docs.npmjs.com/cli/v11/using-npm/scripts/).

Replace the snapshot with a shared `getNavigation()` function called from each public page's `getStaticProps`, including a new `getStaticProps` on the homepage. Pass navigation to the shared layout/sidebar through page props. An ordinary component can receive server-fetched data via props; it does not need its own `getStaticProps`.

### 2. High: publishing a new event creates a link to a 404

Evidence: `src/pages/events/[slug].js:391`, `src/pages/events/index.js:425`.

The listing regenerates with `revalidate: 10`, but detail routes use `fallback: false`. A new published event can appear in the list while its route remains unavailable until deployment. Changing a slug has the same issue. Use `fallback: 'blocking'`; return `{notFound: true, revalidate: ...}` when the queried event does not exist. The current detail component dereferences `eventPage.eventStartTime` at line 202 without handling null, so unpublishing/deleting an existing event can cause regeneration errors and leave an old cached page visible. [Next.js ISR documentation](https://nextjs.org/docs/pages/guides/incremental-static-regeneration).

### 3. High: public email endpoint permits abuse and silently falls back to a personal recipient

Evidence: `src/pages/api/contact.js:9`, `:28`, `:56`, `:66`, `:94`, `:112`, `:138`.

The unauthenticated endpoint accepts caller-supplied email addresses and sends automatic confirmations. There is no rate limit or duplicate submission protection. Required fields are checked for truthiness, allowing whitespace, non-string values, unbounded strings and arbitrary event details. Browser validation does not protect this endpoint. Both forms also lack an in-flight submission lock.

Require an explicit submission type; validate types, trimmed lengths, email, numeric budget/area and required fields server-side. Accept an event ID and obtain authoritative event details on the server. Add platform-backed rate limiting and lightweight bot protection; a process-local Map is insufficient across serverless instances. Disable submission while pending and consider an idempotency key. Fail configuration checks if the notification recipient is missing rather than sending real inquiries to a hardcoded personal address. Keep the existing distinction between a delivered notification and failed auto-confirmation to avoid prompting duplicate inquiries.

### 4. High: dependency security maintenance is overdue

Evidence: `package.json:29`, installed `next@14.2.3`, live `npm audit --json` against the current lockfile.

The registry audit reports **60 affected package entries: 4 critical, 23 high, 28 moderate and 5 low**. These are dependency advisory matches, not 60 demonstrated exploitable defects in this website. Direct dependencies flagged include Next, Axios, Nodemailer, next-sanity, Sanity, Vision, styled-components, Resend, @vercel/og and @react-email/render; some inherit findings through dependencies.

Upgrade Next to a currently supported patched release and validate the Sanity/React compatibility matrix. Do not assume an old 14.x patch recommendation resolves all current advisories. Match each advisory to used features and hosting: this repository has no middleware, App Router Server Actions, or custom server, so findings specific to those paths do not establish an exploit here. Image optimization is used and merits direct attention. Remove unused Nodemailer; remove Axios once prebuild is gone. Upgrade remaining dependencies deliberately rather than using `npm audit fix --force`. [Next.js support policy](https://nextjs.org/support-policy), [official security advisory history](https://github.com/vercel/next.js/security/advisories).

### 5. Medium: build and page content can target different Sanity projects

Evidence: `src/functions/preBuildScripts/preBuildUtilities.js:10`, `sanity/env.js`, `sanity/lib/client.js:13`.

Prebuild hardcodes a project, production dataset and API version. Studio/page queries use environment variables; the page client ignores imported shared configuration and uses another API version. A preview/staging site can therefore show production navigation alongside different page content. The build check confirmed the current workspace fails collecting event pages with `dataset must be provided to perform queries`; production configuration was not inspected. Centralize configuration, validate missing variables with actionable errors, and use one intentionally pinned API version. Sanity API version dates are compatibility contracts; an older date alone is not a security defect.

Use an explicit `perspective: 'published'` for public content. Current requests have no token, so this audit does **not** establish draft leakage. Explicit perspective prevents surprises if authenticated fetching is introduced; older API dates default to `raw` for authenticated requests. [Sanity perspectives](https://www.sanity.io/docs/content-lake/perspectives).

The duplicated prebuild functions have no explicit timeout, response validation or contextual error handling and write directly over a tracked source file. A Sanity outage blocks build/dev startup. Removing them is preferable to maintaining a separate content pipeline.

### 6. Medium: the menu schema is awkward and insufficiently constrained for editors

Evidence: `sanity/schemas/tenantListSchema.js:32`, `:39`, prebuild's `order(_createdAt asc)`, `src/components/sidebar.js:397`.

Editors must type a React icon export name into a required field labelled “Icon (Do Not Change!)”. A typo silently shows an unrelated camera icon. Category order follows creation time rather than editorial intent. Tenant name/link are optional inside required arrays, allowing blank menu entries. The first three links and social destinations remain hardcoded. Tenant array ordering is already editable; preserve that useful behavior.

Use a friendly “Website navigation” singleton with an ordered categories array. Each category should have a required name, a dropdown of approved icon choices with a safe default, and an ordered array of links with required labels and validated destinations. Use stable Sanity `_key` values. Include visibility controls and concise descriptions/previews. If the same tenants will appear on multiple pages, use referenced tenant documents instead of duplicating their details; otherwise nested objects are simpler.

Keep fixed system routes in code unless editors actually need control over them. If the goal includes editing Home/Events/Rental links or social links, explicitly include those fields in the navigation/site settings schema. Disable duplicate singleton creation through Studio structure/template configuration; fetch by a stable document ID. Migrate existing category documents and preserve their intended order before switching readers. Do not delete old documents until the new flow has been verified.

### 7. Medium: navigation needs keyboard and focus fixes

Evidence: `src/components/sidebar.js:201`, `:206`, `:412`, `:454`, `:488`.

Category toggling is attached to a Stack click handler; its label is an anchor without an href. Keyboard users cannot reliably operate it, and clicks on child links bubble to the category handler. Render category toggles as buttons with `aria-expanded`/`aria-controls`, or use styled `details`/`summary`; put navigation in a labelled `nav` landmark. Return focus to the menu trigger when closing the drawer; `returnFocusOnClose={false}` currently disables that behavior. The hidden sidebar passes `() => onClose`, returning the function instead of calling it; remove the redundant hidden copy or correct it. Use category `_id`/`_key` and child `_key`; `child.label` does not exist in the queried tenant records.

### 8. Medium: event date filters omit valid results

Evidence: `src/pages/events/index.js:200–230`, `src/pages/events/[slug].js:202–208`.

The weekend range ends at Sunday 00:00, excluding almost all Sunday events. On Saturday/Sunday it jumps to the following Friday. The month range ends at 00:00 on the final day, excluding that day's later events. Use half-open intervals ending at the next day/month boundary, and define what “this weekend” means during the weekend. “Past” uses start date rather than end time, which misclassifies ongoing multi-day events.

Dates are formatted using server/browser local timezone without an explicit venue timezone; a server and visitor can render different times or dates. Define a venue timezone (likely Africa/Kampala; confirm with the business) and use it consistently with `Intl.DateTimeFormat`. Derive filtered events from props/search/filter rather than storing a second copy and synchronizing it through an effect. Add focused boundary tests for these behaviors.

### 9. Medium: schemas allow content that public pages cannot safely display

Evidence: `sanity/schemas/eventPageSchema.js`, `sanity/schemas/rentalInterestPageSchema.js`, `src/pages/rental-interest.js:43`.

Event slug and display image are optional even though listing/detail rendering expects them. There is no end-after-start validation. Rental content permits multiple documents while the page selects the first unordered result, so editors may publish the wrong document and see no apparent update. Make rental content a singleton with a deterministic query. Require critical event fields or provide deliberate fallbacks. Fix copied Studio previews referencing nonexistent author/date/coverImage fields; show real event dates/images and category link counts instead. Use an empty/missing-content state rather than `[]` as a fallback for an object.

### 10. Medium: an API route uses the wrong router convention

Evidence: `src/pages/api/og/route.jsx:5`, `src/pages/api/og/ecommerce.jsx`.

Named `GET` exports belong in App Router route handlers; Pages Router API files require a default handler. This file would map to `/api/og/route`, not `/api/og`. Fix the route or remove both copied OG examples if unused. The ecommerce route takes an arbitrary remote image URL and feeds it to a server-side image renderer. If retained, allowlist destinations and limit input sizes/cost; it should not be an unrestricted public image-fetching service. No current page references either example; current OG metadata uses static/Sanity image URLs. Review actual external usage before deleting public endpoints.

### 11. Lower priority: redundant source, performance and presentation issues

- `src/components/sidebar.js:102–190`: unused hardcoded category/tenant lists duplicate CMS content. Remove them and their unused imports. Do not mistake their outdated links for active rendered links.
- `src/components/sidebar.js:35`: namespace import plus dynamic lookup of all Font Awesome icons prevents a small static selection. Use a literal map of supported icons. Measure bundles rather than estimating savings from node_modules size.
- `src/pages/events/index.js:37`: unused datepicker import and global CSS. No datepicker is rendered.
- Event list/detail images use the full image URL as `blurDataURL` and omit responsive `sizes`. Use Sanity's low-quality placeholder metadata or no blur placeholder; supply real responsive dimensions/sizes and preserve hotspot/crop where needed. Retaining `@sanity/image-url` is useful if those transformations are implemented.
- `src/components/sidebar.js:334`: Facebook currently links to Google Maps.
- Event search has only a placeholder for its accessible name; add a label. Filter buttons should expose their selected state. Check focus visibility and reduced motion across pages.
- The YouTube background iframe has no title or pause control; muting changes its URL and reloads the video. Provide pause/reduced-motion behavior and a poster. Consider a native video only if an owned, licensed asset is available; do not automatically add an iframe-control package.
- Metadata uses homepage URLs on inner pages and inconsistent static image hosts; centralize canonical/OG generation with absolute URLs and page-specific metadata. Homepage lacks an obvious textual h1.
- `_app.js` imports unused fonts/components; rental content is logged during rendering. Remove unused imports, stale comments, placeholder `api/hello`, unused footer/image helpers/styles/assets after checking references. Keep domain verification files unless their service is intentionally retired.
- Global CSS still contains create-next-app dark-mode gradients/tokens unrelated to the design. Chakra color mode has no clear product purpose here. Replace this with explicit site tokens and deliberate theme behavior.
- `README.md` is boilerplate; no environment example, editor publishing guide, CI workflow, committed lint configuration or automated tests were found. `lint` invokes interactive `next lint` setup on a fresh configuration. Add reproducible lint/build checks and a short `.env.example` containing names only.
- `package-lock.json` **is tracked and is not ignored**. Retain it for reproducible installs; Vercel uses `npm ci`. The earlier claim that `.gitignore` listed it was corrected on reinspection while preparing the implementation plan.

## Proposed publishing flow

1. An editor opens “Website navigation”, edits a label/link, drags items into order and publishes.
2. Public page data functions fetch the published navigation through one shared Sanity client. Each rendered page passes it to the layout. Remove prebuild scripts and the imported snapshot after migration.
3. Start with `revalidate: 60` (choose the interval with the business). This makes an expired page eligible for regeneration when visited; it is **not** a timer or a promise that every browser updates within 60 seconds. The first visitor can receive stale HTML. Regeneration failures retain the last good page.
4. If publication must appear promptly, add a Sanity webhook that verifies its signature over the raw request body, validates document types, and maps changes to known routes. Use Pages Router `res.revalidate`, not App Router cache APIs. Re-fetch from Sanity's origin during regeneration (`useCdn: false`) to avoid repopulating with stale CDN data. Keep timed regeneration as recovery if a webhook is missed. [Next.js on-demand ISR](https://nextjs.org/docs/pages/guides/incremental-static-regeneration), [Sanity webhook guide](https://www.sanity.io/guides/sanity-webhooks-and-on-demand-revalidation-in-nextjs).
5. Navigation is shared across routes: invalidating only `/` is insufficient. Revalidate homepage, event listing, rental page and event detail routes; include both old/new slugs for slug changes. For the current small site, enumerating routes is reasonable. If content grows substantially, consider a separately cached navigation endpoint/client update with server-rendered initial navigation, or an App Router migration for shared cache tagging as a separate project. An already-open browser still needs navigation/refresh or an explicit client refresh mechanism.
6. Add optional authenticated draft preview and clear editor help: “Publish to update the website”; show last publication/update status. Keep drafts out of public fetching. Preview should not require teaching editors deployment concepts.

Acceptance checks: change label/URL, add/remove/reorder categories and tenants, publish/unpublish/delete, new event and slug change, missing image/content, signed/invalid webhook, Sanity outage, recovery after a missed webhook, all public routes showing the same menu, mobile keyboard navigation, focus restoration, and no duplicate form submission. Verify ISR with `next build` + `next start`; development behavior differs.

## Chakra and package decisions

There are 22 direct dependencies. The brand's yellow/black colors, fonts, layout, borders, responsive spacing and simple fades do not require Chakra. Use CSS variables for exact existing tokens, CSS Modules for layouts/components and `next/font` for fonts. No Tailwind or replacement UI framework is needed to preserve this design.

| Package(s) | Decision | Reason / replacement |
| --- | --- | --- |
| `nodemailer` | Remove | No application import; sending uses Resend. |
| `react-datepicker` | Remove | Imported but never rendered; remove its CSS too. |
| `cloudinary-build-url` | Remove after dead helper cleanup | Its helper functions have no active call sites. Existing Cloudinary metadata URLs do not require the package. |
| `axios` | Remove with prebuild | Its only use is the snapshot fetch. Keep Sanity's supported client for CMS queries; built-in fetch covers simple HTTP requests. |
| `@chakra-ui/react`, `@chakra-ui/icons`, `@emotion/react`, `@emotion/styled` | Remove after UI migration | Replace layouts with CSS, primitives with semantic HTML and a few icons with existing SVGs/a selected icon package. |
| `framer-motion` | Remove after Chakra | Direct animations are simple fades that CSS keyframes can reproduce; Chakra v2 also depends on Framer Motion behavior, so removal order matters. Add reduced-motion styles. |
| `react-icons`, `lucide-react` | Consolidate | Keep one curated set or commit the small required SVG set with license attribution. Preserve existing icon artwork if exact appearance matters. Remove dynamic namespace lookup first. |
| `@vercel/og` | Remove if example endpoints are retired | Public pages currently use static/Sanity OG images. If dynamic OG is needed, repair routes and evaluate `next/og` after the Next upgrade. |
| `@sanity/vision` | Optional | Query inspector is a developer tool, not needed for ordinary editors; remove plugin registration too if dropped. |
| `@sanity/image-url` | Keep if improving image delivery; otherwise remove unused helper | Currently only used in an unreferenced image helper. It provides useful Sanity-specific crop/hotspot/transformation handling worth retaining if adopted. |
| `@react-email/render` | Keep with current email API | Resend dynamically imports it for the `react:` payload; no direct application import does not make it unused. |
| `resend` | Keep | Small provider integration and error handling are useful. Replacing it with fetch shifts maintenance into application code for limited benefit. |
| `sanity`, `next-sanity`, `styled-components` | Keep for embedded Studio | Sanity/next-sanity declare styled-components peer dependencies. It cannot simply disappear when Chakra is removed. A separately hosted Studio can isolate its dependencies/build from the public website, but adds another deployment to maintain. |
| `next`, `react`, `react-dom` | Keep and upgrade compatibly | Core framework/runtime. |

Declare packages directly if imported directly: `@sanity/client`, `groq`, `@sanity/icons` and `date-fns` are currently reached through transitive dependencies. Prefer importing `groq`/client through supported next-sanity exports where appropriate. Remove copied date-fns preview logic if unused; otherwise declare it. Do not rely on npm hoisting for imports.

Chakra migration sequence: capture desktop/mobile screenshots and interaction baselines; extract exact theme colors, font weights, breakpoints and reset styles; implement shared Button/Input/Card/Layout; migrate pages; migrate drawer/disclosures/toasts; remove provider and packages last. A native modal `dialog` can supply much of the drawer behavior, but still needs scroll locking, initial/restored focus, Escape/backdrop behavior and browser checks. Use `details`/`summary` or accessible buttons for categories, `navigator.clipboard` with error handling, and live status messages for form feedback. Chakra's [drawer documentation](https://v2.chakra-ui.com/docs/components/drawer/usage) describes behavior that a replacement must preserve. Reimplementing a whole generic component framework would defeat the simplification.

## Delivery order

1. Repair build/route issues, establish lint/CI, update vulnerable framework dependencies, harden email delivery configuration/validation/abuse controls.
2. Centralize Sanity configuration; fix event fallback/missing content and migrate navigation to ISR. Validate the editor publishing journey on a preview deployment before changing production content.
3. Improve navigation/rental/event schemas and migrate data. Add the webhook/preview if required.
4. Remove unused dependencies/code and fix dates, images, metadata and keyboard navigation.
5. Migrate Chakra page by page against visual and interaction baselines; measure public-route JS and rendering before/after. Evaluate separate Studio hosting only if build/dependency isolation warrants it.

## Verification and limitations

- Read all tracked application source/configuration and traced all Sanity, prebuild and dependency import paths. Inspected installed versions with `npm ls --depth=0`.
- Ran the current dependency audit without modifying dependencies. Full machine-readable result is at `/tmp/nyan-code-audit.json` for this workspace session; counts above reflect this run, not a vulnerability exploit test.
- Build checks invoked Next directly to avoid overwriting the tracked CMS snapshot. The sandboxed build failed during webpack compilation without diagnostic detail. A second run outside the sandbox compiled successfully after Google Fonts retries, then failed collecting `/events/[slug]` page data with `dataset must be provided to perform queries`. No successful full production build is claimed. Detailed log: `/tmp/nyan-build-audit.log`. Consider self-hosting the existing font families to make builds independent of Google Fonts availability.
- No production CMS writes, webhook setup, email sending, deployment or dependency changes were performed. Remote Sanity project roles/CORS/webhooks, live deployment settings and editor permissions were not accessible/verified in this repository review.
- No complete browser accessibility, visual regression, bundle measurement or penetration test was performed; no numerical performance saving is claimed. Source-confirmed defects are distinguished from deployment-dependent security exposure.
