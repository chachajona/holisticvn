#!/usr/bin/env node
/** Prepare legacy Sanity content offline, preserving document references. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const [sanityPath, outputDir = "migration-output"] = process.argv.slice(2);
if (!sanityPath) {
  console.error("Usage: npm run migrate:legacy -- <sanity.ndjson> [output-dir]");
  process.exit(1);
}
if (!existsSync(sanityPath)) {
  console.error("Export file not found.");
  process.exit(1);
}
const sanityDocuments = readFileSync(sanityPath, "utf8")
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .filter((document) =>
    ["page", "service", "treatment", "testimonial", "faq", "siteSettings", "post"].includes(
      document._type,
    ),
  )
  .map((document) => ({
    ...document,
    // IDs stay intact so references and draft/published pairs stay connected.
    _id: document._id,
    _rev: undefined,
    _createdAt: undefined,
    _updatedAt: undefined,
  }));
mkdirSync(outputDir, { recursive: true });
writeFileSync(
  join(outputDir, "sanity.ndjson"),
  sanityDocuments.map((document) => JSON.stringify(document)).join("\n") + "\n",
);
writeFileSync(
  join(outputDir, "report.json"),
  JSON.stringify(
    {
      source: { sanity: basename(sanityPath) },
      counts: { sanity_documents: sanityDocuments.length },
      generated_at: new Date().toISOString(),
    },
    null,
    2,
  ),
);
console.log(`Prepared ${sanityDocuments.length} Sanity documents in ${outputDir}.`);
