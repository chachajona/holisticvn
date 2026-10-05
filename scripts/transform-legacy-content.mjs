// One-time patch for content imported from the old Sanity project (7mzuucx6).
// That project's schema used bilingual {_type: localeString/localeText, en, vi}
// objects and different field/type names than surat's schema. This flattens
// locale objects to Vietnamese (falling back to English) and renames fields
// so they match sanity/schemaTypes/index.ts.
//
// Safe to re-run: every step is idempotent (re-flattening a plain string is a
// no-op via localeToString, and .set() again with the same shape is a no-op).
//
// Dry run: node --env-file=.env.local scripts/transform-legacy-content.mjs --project <id> --dataset staging
// Apply: add --apply --confirm <id>/staging after reviewing the dry run.

import { createClient } from "@sanity/client";
import { parseArgs } from "node:util";

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
console.log(`${values.apply ? "APPLY" : "DRY RUN"}: ${target}`);

async function patchDocument(doc, fields) {
  // Remove undefined optional values before sending patches to Sanity.
  const patch = JSON.parse(JSON.stringify(fields));
  if (!values.apply) {
    console.log("Would patch:", doc._id, JSON.stringify(patch));
    return;
  }
  await client.patch(doc._id).ifRevisionId(doc._rev).set(patch).commit();
}

const client = createClient({
  projectId: values.project,
  dataset: values.dataset,
  token: process.env.SANITY_API_READ_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function localeToString(value) {
  if (!value || typeof value !== "object") return value ?? "";
  return value.vi || value.en || "";
}

async function transformTreatments() {
  const docs = await client.fetch(`*[_type == "treatment"]`);
  for (const doc of docs) {
    await patchDocument(doc, {
      title: localeToString(doc.title),
      shortDescription: localeToString(doc.shortDescription),
      description: localeToString(doc.description) || localeToString(doc.fullDescription),
      benefits: (doc.benefits || []).map((b) =>
        typeof b === "string" ? b : localeToString(b.title),
      ),
      protocols: (doc.protocols || []).map((p) => ({
        _key: p._key,
        _type: "protocolStep",
        step: p.step,
        title: localeToString(p.title),
        description: localeToString(p.description),
      })),
    });
    console.log("treatment processed:", doc.slug?.current);
  }
}

async function transformServices() {
  const docs = await client.fetch(`*[_type == "service"]`);
  for (const doc of docs) {
    await patchDocument(doc, {
      title: localeToString(doc.title),
      description: localeToString(doc.description),
      slug: doc.slug?.current ? doc.slug : { _type: "slug", current: doc.id?.current },
      treatments: doc.treatments?.length ? doc.treatments : doc.details?.treatments || [],
    });
    console.log("service processed:", doc.id?.current || doc.slug?.current);
  }
}

async function transformTestimonials() {
  const docs = await client.fetch(`*[_type == "testimonial"]`);
  for (const doc of docs) {
    await patchDocument(doc, {
      quote: localeToString(doc.quote),
      context: localeToString(doc.author) || doc.context,
      avatar: doc.avatar || doc.icon,
      rating: doc.rating,
    });
    console.log("testimonial processed:", doc._id);
  }
}

async function transformSiteSettings() {
  const docs = await client.fetch(`*[_type == "siteSettings"]`);
  for (const doc of docs) {
    await patchDocument(doc, {
      contactPhone: doc.contactPhone || doc.contactInfo?.phone,
      contactEmail: doc.contactEmail || doc.contactInfo?.email,
      locations: doc.locations?.length
        ? doc.locations
        : (doc.contactInfo?.locations || []).map((l) => ({
            _key: l._key,
            _type: "location",
            name: l.name,
            address: l.address,
            mapUrl: l.mapUrl,
            isPrimary: l.isPrimary,
          })),
      socialMedia: {
        facebook: doc.socialMedia?.facebook,
        instagram: doc.socialMedia?.instagram,
        zalo: doc.socialMedia?.zalo,
      },
      seo:
        doc.seo ||
        (doc.defaultSeo
          ? { _type: "seo", title: doc.defaultSeo.title, description: doc.defaultSeo.description }
          : undefined),
    });
    console.log("siteSettings processed:", doc._id);
  }
}

await transformTreatments();
await transformServices();
await transformTestimonials();
await transformSiteSettings();
console.log("done");
