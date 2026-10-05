# Legacy migration runbook

1. Export the old Supabase `contacts` table as JSON and the old Sanity dataset as NDJSON. Keep encrypted backups outside this repository.
2. Run `npm run migrate:legacy -- contacts.json sanity.ndjson migration-output` locally; inspect `report.json`, `leads.json` and `sanity.ndjson` before importing anything.
3. Import Sanity documents into a staging dataset first. Re-map media assets and review Vietnamese copy, SEO title/description, links and slugs.
4. Import the normalized lead/subscriber JSON into the new Supabase project with a service-role-only script or controlled SQL import. Compare record counts and sample PII manually.
5. Make a path inventory from the live legacy website. Keep equal paths; add permanent redirects for changed paths in `next.config.ts`, verify them on preview, then switch the domain in Vercel.

The migration script is intentionally transform-only: it never writes to Supabase or Sanity and is safe to re-run.
