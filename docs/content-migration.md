# Content migration

The reader prefers the new navigation/rental singleton IDs and retains legacy reads until migration is accepted. Source documents are never deleted by migration scripts.

1. Export the affected Sanity dataset securely and review all published/draft documents. Work in a copied dataset first. Reconcile drafts before the script runs. More than one rental document is an explicit conflict.
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and a server-only `SANITY_MIGRATION_TOKEN` with the intended read/write permissions. Never commit the token. A read token is needed for draft-aware dry runs.
3. Run `npm run migrate:content -- --dataset staging` (or the actual test dataset). It is a dry run by default, reporting counts/target IDs. Resolve unknown icons, invalid URLs, missing names and ambiguous rental content before continuing.
4. Review the output and publish destination schema. Run with `--apply --dataset staging` to create absent singletons. Existing destination documents are never overwritten. A private backup is written to `/tmp/nyan-content-backup-TIMESTAMP.json`; retain/export it securely beyond this machine.
5. Compare category order, every tenant/link/icon, primary navigation and social links. Test all public pages. Obtain the correct Facebook URL from the business; the old incorrect Maps link is intentionally not migrated as Facebook.
6. Pause edits briefly, repeat review/apply for the production dataset and move editors to the singleton entries. The apply run creates published singleton documents immediately, so perform the content comparison in staging and review the dry run before applying in production. Legacy documents remain available for rollback; remove the legacy Studio entry only after the transition is accepted.

The script must not be run with a dataset name inferred from an unreviewed environment. Its explicit dataset argument is required even when an environment value exists. A rerun is safe for already-created targets but does not synchronize subsequent legacy edits.

Rollback: deploy the last compatible reader and reconcile new singleton edits with retained legacy data. Do not restore an entire dataset over newer editor work. Final removal of legacy documents/readers requires successful migration and an agreed observation period.
