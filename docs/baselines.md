# Verification measurements

Measured against the completed production build in this workspace.

| Public route | Initial JavaScript, approximate gzip KiB |
| --- | ---: |
| `/` | 183 |
| `/events` | 188 |
| `/events/[slug]` | 188 |
| `/rental-interest` | 188 |

The calculation deduplicates JS files from the page and `_app` build-manifest entries, then sums per-file gzip sizes. It includes framework code. It excludes images, fonts, external analytics and lazily loaded Studio assets; this is not a total network transfer or a Core Web Vitals result. No before/after percentage is claimed because a reliable original-source production baseline was unavailable.

The four heading/body WOFF2 files total approximately 85 KB. Tiny5 is retained with preload disabled. All public pages use the existing brand imagery, fonts and yellow/black design in native HTML/CSS. Browser checks passed at 390 and 1440 pixels; final visual approval remains separate from functional checks.

A signed local navigation hook refreshed all 52 affected routes (49 events plus homepage/list/rental) in 8.52 seconds with zero failures. A signed event hook refreshed three paths in 3.83 seconds. These read published Sanity content and regenerate only local caches; real publication latency must be verified on the target host. No CMS mutation was needed for these measurements.

Production build: 55 pages generated. Offline fixture build and both browser runs passed. The embedded Studio reached its project connection/CORS gate with no observed client exceptions. Authenticated editing and draft preview require project access and configured read credentials.
