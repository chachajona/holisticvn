// Pure planning for scripts/migrate-services-groups.mjs (#41): no network, no files.
// 1. treatment slug heat-light -> infrared-heat, patched in place so _id, revisions and every reference survive.
// 2. servicesPage groups: therapy/training/recovery -> manual/electro/training/recovery, written as one
//    guarded `set` of the whole array so the old "therapy" item cannot linger.

const OLD_SLUG = "heat-light";
const NEW_SLUG = "infrared-heat";

/**
 * @param treatments   published treatments: { _id, _rev, slug }
 * @param servicesPage published servicesPage { _id, _rev, groups: [full items] } or null
 * @param seed         scripts/seed/services-page.json
 * @param links        scripts/seed/treatment-links.json -> servicesPage: { group: [slug] }
 * @param draftIds     ids of drafts/versions of treatments or servicesPage
 */
export function planServicesMigration({ treatments, servicesPage, seed, links, draftIds = [] }) {
  const bySlug = new Map();
  for (const t of treatments) {
    if (bySlug.has(t.slug)) throw new Error(`Trùng slug "${t.slug}"`);
    bySlug.set(t.slug, t);
  }
  if (bySlug.has(OLD_SLUG) && bySlug.has(NEW_SLUG)) {
    throw new Error(`Có cả "${OLD_SLUG}" và "${NEW_SLUG}": xử lý thủ công, không tự gộp.`);
  }

  const mutations = [];
  const skipped = [];
  const idBySlug = new Map([...bySlug].map(([slug, t]) => [slug, t._id]));

  const legacy = bySlug.get(OLD_SLUG);
  if (legacy) {
    idBySlug.set(NEW_SLUG, legacy._id);
    idBySlug.delete(OLD_SLUG);
    mutations.push({
      patch: { id: legacy._id, ifRevisionID: legacy._rev, set: { "slug.current": NEW_SLUG } },
    });
  }

  if (!servicesPage) {
    skipped.push("servicesPage");
  } else {
    const groups = servicesPage.groups ?? [];
    const done =
      groups.length === seed.groups.length &&
      seed.groups.every((s) => groups.some((g) => g.group === s.group));
    if (!done) {
      const slugById = new Map([...idBySlug].map(([slug, id]) => [id, slug]));
      const therapy = groups.find((g) => g.group === "therapy");
      const next = seed.groups.map((sg) => {
        const existing = groups.find((g) => g.group === sg.group);
        const image = existing?.image ?? (sg.group === "manual" ? therapy?.image : undefined);
        const slugs = links.servicesPage[sg.group];
        // Keep editor _keys of references that stay; otherwise the slug is the key (as in sync-treatments).
        const known = new Map(
          [
            ...(existing?.treatments ?? []),
            ...(sg.group === "manual" || sg.group === "electro" ? (therapy?.treatments ?? []) : []),
          ]
            .filter((ref) => ref?._ref)
            .map((ref) => [slugById.get(ref._ref), ref._key]),
        );
        const treatmentRefs = slugs
          ? slugs.map((slug) => {
              const _ref = idBySlug.get(slug);
              if (!_ref) throw new Error(`Thiếu liệu pháp "${slug}"`);
              return { _key: known.get(slug) ?? slug, _type: "reference", _ref };
            })
          : (existing?.treatments ?? []);
        return {
          ...sg,
          _key: existing?._key ?? sg._key,
          ...(image ? { image } : {}),
          treatments: treatmentRefs,
        };
      });
      mutations.push({
        patch: { id: servicesPage._id, ifRevisionID: servicesPage._rev, set: { groups: next } },
      });
    }
  }

  const warnings = draftIds.length
    ? [`Có bản nháp hoặc release đang mở: ${draftIds.join(", ")}. Publish hoặc xóa trước khi chạy.`]
    : [];
  return { mutations, skipped, warnings };
}
