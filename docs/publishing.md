# Editing the website

Open `/studio` and log in with your Sanity account. Once the navigation migration is applied, open **Website navigation**. Edit page labels, category names, icons, tenant links and social/contact settings. Drag categories or tenants into order. Disable “Show on website” to hide an entry without deleting its contents. Publish when ready.

Events are edited individually. Keep their existing slug unless the URL should change. A changed URL makes the previous URL return 404; there is no automatic redirect. Unpublish removes a page. Enter dates for the venue timezone, Africa/Kampala. The website displays Kampala time regardless of a visitor's timezone.

Publication updates the website through the configured webhook. Reload the affected page after publishing. Already-open browser tabs are not forcibly refreshed. If delivery fails, an expired page becomes eligible for regeneration after 60 seconds on a later visit; this is not a guaranteed 60-second update deadline. Contact the site operator if a change remains missing.

## Optional draft preview

An operator configures `SANITY_API_READ_TOKEN` (read only) and `SANITY_PREVIEW_SECRET`. A trusted editor can open `/api/preview?secret=SECRET&path=/` for navigation or substitute `/rental-interest` or `/events`. Event preview uses `&slug=EXACT_SLUG` instead of `path`. The server creates a one-hour preview cookie, queries drafts and shows a visible exit link. Keep these links private and do not paste them into CMS fields or public pages. The Studio does not expose the server preview secret. Continuous live preview/Studio preview actions remain a future convenience; preview works by refresh.

A publication timestamp does not prove successful webhook delivery. Operators inspect webhook logs and website output before reporting a change as live.
