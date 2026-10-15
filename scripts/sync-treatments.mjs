// Create the 11 price-list treatments, overwrite the 3 existing ones, and link them to the
// /treatments and /services groups. One transaction, revision-guarded.
//
// Dry run (default): node --env-file=.env.local scripts/sync-treatments.mjs --project <id> --dataset staging
// Apply: add --apply --confirm <id>/staging after reviewing the dry run.
// Needs SANITY_AUTH_TOKEN (write access). Writes a backup to .context/ before applying.

import { createClient } from "@sanity/client";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { planSync } from "./lib/treatment-sync.mjs";

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
const seed = JSON.parse(readFileSync("scripts/seed/treatments.json", "utf8"));
const links = JSON.parse(readFileSync("scripts/seed/treatment-links.json", "utf8"));

const published = `!(_id in path("drafts.**")) && !(_id in path("versions.**"))`;
const treatments = await client.fetch(
  `*[_type == "treatment" && ${published}]{_id, _rev, "slug": slug.current}`,
);
const pages = Object.fromEntries(
  await Promise.all(
    Object.keys(links).map(async (id) => [
      id,
      await client.fetch(`*[_id == $id][0]{_id, _rev, "groups": groups[]{_key, group}}`, { id }),
    ]),
  ),
);
const draftIds = await client.fetch(
  `*[(_id in path("drafts.**") || _id in path("versions.**")) && (_type == "treatment" || _type in ["methodsPage", "servicesPage"])]._id`,
);

const { mutations, skipped, warnings } = planSync({ seed, links, treatments, pages, draftIds });
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
for (const id of skipped) console.warn(`Skipped (not in this dataset): ${id}`);
for (const mutation of mutations) {
  if (mutation.createIfNotExists) console.log("Would create:", mutation.createIfNotExists._id);
  else console.log("Would patch:", mutation.patch.id, JSON.stringify(mutation.patch));
}
if (!values.apply) {
  console.log(`${mutations.length} mutations planned. Nothing written.`);
  process.exit(0);
}

const ids = mutations.map((m) => m.createIfNotExists?._id ?? m.patch.id);
const before = await client.fetch(`*[_id in $ids]`, { ids });
mkdirSync(".context", { recursive: true });
// unique name + "wx": never overwrite an earlier backup, it may be the only rollback copy
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backup = `.context/treatments-before-${values.dataset}-${stamp}.json`;
writeFileSync(backup, JSON.stringify(before, null, 2), { flag: "wx" });
console.log(`Backed up ${before.length} documents to ${backup}`);

const transaction = client.transaction();
for (const mutation of mutations) {
  if (mutation.createIfNotExists) {
    transaction.createIfNotExists(mutation.createIfNotExists);
    continue;
  }
  const { id, ifRevisionID, set, unset } = mutation.patch;
  transaction.patch(id, (patch) => {
    patch = patch.ifRevisionId(ifRevisionID);
    if (set && Object.keys(set).length) patch = patch.set(set);
    if (unset?.length) patch = patch.unset(unset);
    return patch;
  });
}
const result = await transaction.commit();
console.log(`Committed transaction ${result.transactionId}: ${result.results.length} documents.`);
