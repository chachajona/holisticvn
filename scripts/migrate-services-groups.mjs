// #41 migration: servicesPage 3 groups -> 4 groups, treatment slug heat-light -> infrared-heat.
// One transaction, revision-guarded, idempotent (a second run plans nothing).
//
// Dry run (default): node --env-file=.env.local scripts/migrate-services-groups.mjs --project <id> --dataset staging
// Apply: add --apply --confirm <id>/staging after reviewing the dry run.
// Needs SANITY_AUTH_TOKEN (write access). Writes a backup to .context/ before applying.
// Aborts while drafts or release versions of the touched documents exist.
// Run staging first, check the preview, then run production together with the deploy and /api/revalidate.
// Run from the repository root (seed paths and the .context/ backup are relative to it).

import { createClient } from "@sanity/client";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { planServicesMigration } from "./lib/services-migration.mjs";

const { values } = parseArgs({
  options: {
    project: { type: "string" },
    dataset: { type: "string" },
    apply: { type: "boolean", default: false },
    confirm: { type: "string" },
  },
});
if (!values.project || !values.dataset) {
  console.error("Explicit --project and --dataset are required. Default mode is dry run.");
  process.exit(1);
}
const target = `${values.project}/${values.dataset}`;
if (values.apply && values.confirm !== target) {
  console.error(`Applying requires --confirm ${target}. Run without --apply to review first.`);
  process.exit(1);
}
if (!process.env.SANITY_AUTH_TOKEN) {
  console.error("SANITY_AUTH_TOKEN (write access) is required, even for a dry run.");
  process.exit(1);
}
console.log(`${values.apply ? "APPLY" : "DRY RUN"}: ${target}`);

const client = createClient({
  projectId: values.project,
  dataset: values.dataset,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
  perspective: "raw",
});
const seed = JSON.parse(readFileSync("scripts/seed/services-page.json", "utf8"));
const links = JSON.parse(readFileSync("scripts/seed/treatment-links.json", "utf8"));

const published = `!(_id in path("drafts.**")) && !(_id in path("versions.**"))`;
const treatments = await client.fetch(
  `*[_type == "treatment" && ${published}]{_id, _rev, "slug": slug.current}`,
);
const servicesPage = await client.fetch(`*[_id == "servicesPage"][0]`);
const draftIds = await client.fetch(
  `*[(_id in path("drafts.**") || _id in path("versions.**")) && (_type == "treatment" || _type == "servicesPage")]._id`,
);

const { mutations, skipped, warnings } = planServicesMigration({
  treatments,
  servicesPage,
  seed,
  links,
  draftIds,
});
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
if (values.apply && warnings.length) {
  console.error("Open drafts or release versions exist. Publish or discard them first.");
  process.exit(1);
}
for (const id of skipped) console.warn(`Skipped (not in this dataset): ${id}`);
for (const { patch } of mutations) console.log("Would patch:", patch.id, JSON.stringify(patch.set));

if (!values.apply) {
  console.log(`${mutations.length} mutations planned. Nothing written.`);
} else if (mutations.length) {
  const ids = mutations.map((m) => m.patch.id);
  const before = await client.fetch(`*[_id in $ids]`, { ids });
  mkdirSync(".context", { recursive: true });
  // unique name + "wx": never overwrite an earlier backup, it may be the only rollback copy
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = `.context/services-groups-before-${values.dataset}-${stamp}.json`;
  writeFileSync(backup, JSON.stringify(before, null, 2), { flag: "wx" });
  console.log(`Backed up ${before.length} documents to ${backup}`);

  const transaction = client.transaction();
  for (const { patch } of mutations) {
    transaction.patch(patch.id, (p) => p.ifRevisionId(patch.ifRevisionID).set(patch.set));
  }
  const result = await transaction.commit();
  console.log(`Committed transaction ${result.transactionId}: ${result.results.length} documents.`);
} else {
  console.log("Nothing to migrate.");
}
