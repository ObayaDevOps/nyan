# Nekosero

Next.js Pages Router website with an embedded Sanity Studio. Node 24 is required.

## Development

Copy `.env.example` to `.env.local` and fill the project ID/dataset. The existing site uses project `7foz0wph`, dataset `production`; use a separate dataset for editing/testing. Do not copy mail or CMS credentials into public variables.

```
npm ci
npm run dev
npm run lint
npm test
npm run build
npm start
npm run test:browser
```

`npm run build` now fetches page content directly. No prebuild file generation occurs. A valid Sanity configuration and service connection are needed for the initial static build. ISR keeps existing pages when regeneration fails. Missing events return 404 and newly published event URLs are generated on request.

Use `NEXT_PUBLIC_SANITY_DATASET=production npm run build` if migrating an old `.env.local` which omitted the dataset. Hosting must also set that variable. Production builds use webpack to support the embedded Studio's current bundling requirements.

See [publishing](docs/publishing.md), [operations](docs/operations.md), [migration](docs/content-migration.md), [implementation status](docs/implementation-status.md), and [plan](IMPLEMENTATION_PLAN.md).
