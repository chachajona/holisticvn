// Pure planning for scripts/sync-treatments.mjs: no network, no files. See
// docs/superpowers/specs/2026-10-15-treatment-catalog-design.md section 7.

// Content the owner has not reviewed (spec decision 4) and the unused duration field.
const UNSET = ["benefits", "protocols", "duration"];

/**
 * @param seed        documents from scripts/seed/treatments.json
 * @param links       scripts/seed/treatment-links.json
 * @param treatments  published treatments in the dataset: { _id, _rev, slug }
 * @param pages       { methodsPage, servicesPage }: { _id, _rev, groups: [{ _key, group }] } or null
 * @param draftIds    ids of open drafts for treatments and the two pages
 */
export function planSync({ seed, links, treatments, pages, draftIds = [] }) {
  const existingBySlug = new Map();
  for (const treatment of treatments) {
    if (existingBySlug.has(treatment.slug)) throw new Error(`Trùng slug "${treatment.slug}"`);
    existingBySlug.set(treatment.slug, treatment);
  }

  const mutations = [];
  const idBySlug = new Map();
  for (const doc of seed) {
    const slug = doc.slug.current;
    const existing = existingBySlug.get(slug);
    if (!existing) {
      // createIfNotExists would silently do nothing if the id is taken by another slug
      const other = treatments.find((t) => t._id === doc._id);
      if (other) throw new Error(`_id "${doc._id}" đã dùng cho slug "${other.slug}"`);
      idBySlug.set(slug, doc._id);
      mutations.push({ createIfNotExists: doc });
      continue;
    }
    idBySlug.set(slug, existing._id);
    // identity fields stay as they are; everything else is overwritten
    const fields = { ...doc };
    delete fields._id;
    delete fields._type;
    delete fields.slug;
    mutations.push({
      patch: {
        id: existing._id,
        ifRevisionID: existing._rev,
        set: fields,
        unset: fields.englishTitle ? UNSET : [...UNSET, "englishTitle"],
      },
    });
  }

  const skipped = [];
  for (const [pageId, groups] of Object.entries(links)) {
    const page = pages[pageId];
    if (!page) {
      skipped.push(pageId);
      continue;
    }
    const set = {};
    for (const [group, slugs] of Object.entries(groups)) {
      if (!slugs.length) continue;
      const found = page.groups?.find((g) => g.group === group);
      if (!found) throw new Error(`${pageId} thiếu nhóm "${group}"`);
      // the _key goes into a patch path, so only plain key characters are allowed
      if (!/^[A-Za-z0-9_-]+$/.test(found._key ?? "")) {
        throw new Error(`${pageId}: _key "${found._key}" của nhóm "${group}" không hợp lệ`);
      }
      set[`groups[_key=="${found._key}"].treatments`] = slugs.map((slug) => {
        const ref = idBySlug.get(slug);
        if (!ref) throw new Error(`Thiếu liệu pháp "${slug}"`);
        return { _key: slug, _type: "reference", _ref: ref };
      });
    }
    mutations.push({ patch: { id: pageId, ifRevisionID: page._rev, set } });
  }

  const warnings = draftIds.length
    ? [
        `Có bản nháp đang mở: ${draftIds.join(", ")}. Bản nháp sẽ không đổi; kiểm tra trước khi publish.`,
      ]
    : [];
  return { mutations, skipped, warnings };
}
