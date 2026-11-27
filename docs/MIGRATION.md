# Legacy content migration runbook

This website sends consultation and booking requests directly to staff. It does not import or store customer contacts, appointment records or subscriber lists. Staff manage bookings in the clinic’s existing system.

1. Export the old Sanity dataset as NDJSON. Keep a backup outside this repository.
2. Run `npm run migrate:legacy -- sanity.ndjson migration-output` locally; inspect `report.json` and `sanity.ndjson` before importing anything.
3. Import website content into an empty staging dataset first. Document IDs are preserved so references and draft/published pairs remain connected. Re-map media assets separately and review Vietnamese copy, metadata, links and slugs.
4. Make a path inventory from the live legacy website. Keep equal paths; add permanent redirects for changed paths in `next.config.ts`, verify them on preview, then switch the domain in Vercel.

The migration script is offline: it only reads and writes local content export files.

`transform-legacy-content.mjs` is a separate remote patch tool. It requires an explicit project and dataset and defaults to a dry run:

```bash
node --env-file=.env.local scripts/transform-legacy-content.mjs --project PROJECT_ID --dataset staging
# After reviewing the output, apply to that same target:
node --env-file=.env.local scripts/transform-legacy-content.mjs --project PROJECT_ID --dataset staging --apply --confirm PROJECT_ID/staging
```

Apply requires a Sanity token with write permission; each patch checks the fetched revision to avoid overwriting concurrent edits. Environment variables alone never select the write target.

## Services groups and infrared slug (#41)

1. Run the dry run against staging and review the plan. The transaction renames `heat-light` in place, changes the Services groups, and creates any missing linked treatments from the reviewed seed and SEO files. Existing treatment content and IDs are preserved. An occupied ID aborts the transaction.
2. Before starting `--apply`, confirm with editors and operators that Studio edits, API jobs and writes, and creation or publishing of releases are paused for `treatment` and `servicesPage` in the target dataset. Keep them paused through the transaction result. Resolve any existing drafts or release versions before applying. `--confirm-editing-frozen` records the operator's confirmation and the script checks for existing drafts and releases at runtime.
3. Keep the backup in `.context/` with the apply log, which lists any newly created IDs. After applying, rerun the dry run and verify the four groups, linked treatments, redirect from `/treatments/heat-light` to `/treatments/infrared-heat`, and group-specific booking links on a preview that reads this staging dataset.
4. Repeat the review and editing pause for production. Coordinate the migration with deployment of the new schema and routes, then call `/api/revalidate` and repeat the public route checks.

```bash
node --env-file=.env.local scripts/migrate-services-groups.mjs --project PROJECT_ID --dataset staging
node --env-file=.env.local scripts/migrate-services-groups.mjs --project PROJECT_ID --dataset staging --apply --confirm PROJECT_ID/staging --confirm-editing-frozen
```
