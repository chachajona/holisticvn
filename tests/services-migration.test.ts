import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error plain ESM script helper without type declarations
import { planServicesMigration } from "../scripts/lib/services-migration.mjs";

const seed = JSON.parse(readFileSync("scripts/seed/services-page.json", "utf8"));
const links = JSON.parse(readFileSync("scripts/seed/treatment-links.json", "utf8"));
const slugs = Object.values(links.servicesPage).flat() as string[];
const ref = (slug: string, _key = `editor-${slug}`) => ({
  _key,
  _type: "reference",
  _ref: `id-${slug}`,
});
const treatments = (heat = "heat-light") =>
  [...new Set(slugs.map((s) => (s === "infrared-heat" ? heat : s)))].map((slug) => ({
    _id: `id-${slug}`,
    _rev: `rev-${slug}`,
    slug,
  }));
const image = { _type: "image", asset: { _ref: "image-abc" }, alt: "Ảnh do editor chọn" };
const legacyPage = () => ({
  _id: "servicesPage",
  _rev: "page-rev",
  groups: [
    {
      _key: "k-therapy",
      group: "therapy",
      title: "Trị liệu bằng tay",
      image,
      treatments: [ref("cupping"), ref("shockwave")],
    },
    { _key: "k-training", group: "training", title: "Tập luyện", treatments: [] },
    { _key: "k-recovery", group: "recovery", title: "Cũ", treatments: [ref("heat-light")] },
  ],
});
const run = (overrides: object = {}) =>
  planServicesMigration({
    treatments: treatments(),
    servicesPage: legacyPage(),
    seed,
    links,
    draftIds: [],
    ...overrides,
  });
type Ref = { _key: string; _ref: string };
type Group = {
  group: string;
  title: string;
  _key: string;
  image?: unknown;
  treatments: Ref[];
};
type Patch = { id: string; ifRevisionID: string; set: Record<string, unknown> };
const patches = (plan: { mutations: Array<{ patch: Patch }> }) =>
  plan.mutations.map((m) => m.patch);

describe("planServicesMigration", () => {
  it("renames the slug in place and replaces the groups in one guarded set", () => {
    const [slugPatch, pagePatch] = patches(run());
    expect(slugPatch).toEqual({
      id: "id-heat-light",
      ifRevisionID: "rev-heat-light",
      set: { "slug.current": "infrared-heat" },
    });
    expect(pagePatch.id).toBe("servicesPage");
    expect(pagePatch.ifRevisionID).toBe("page-rev");
    const groups = pagePatch.set.groups as Array<Group>;
    expect(groups.map((g) => g.group)).toEqual(["manual", "electro", "training", "recovery"]);
    expect(JSON.stringify(groups)).not.toContain("therapy");
    for (const [i, g] of groups.entries()) expect(g.title).toBe(seed.groups[i].title);
  });

  it("carries the therapy image to manual and keeps editor keys of surviving references", () => {
    const groups = patches(run())[1].set.groups as Array<Group>;
    const [manual, electro, training, recovery] = groups;
    expect(manual.image).toEqual(image);
    expect(electro).not.toHaveProperty("image");
    expect(manual.treatments.map((r: Ref) => r._ref)).toEqual(
      links.servicesPage.manual.map((s: string) => `id-${s}`),
    );
    const key = (g: Group, slug: string) =>
      g.treatments.find((r: Ref) => r._ref === `id-${slug}`)?._key;
    expect(key(manual, "cupping")).toBe("editor-cupping");
    expect(key(manual, "dry-needling")).toBe("dry-needling");
    expect(key(electro, "shockwave")).toBe("editor-shockwave");
    expect(training._key).toBe("k-training");
    expect(recovery._key).toBe("k-recovery");
    expect(recovery.treatments.map((r: Ref) => r._ref)).toEqual([
      "id-cold-plunge",
      "id-heat-light",
    ]);
  });

  it("plans nothing on a second run", () => {
    const first = patches(run());
    const migrated = { _id: "servicesPage", _rev: "page-rev-2", groups: first[1].set.groups };
    const plan = run({ treatments: treatments("infrared-heat"), servicesPage: migrated });
    expect(plan.mutations).toEqual([]);
  });

  it("refuses to merge when both slugs exist", () => {
    const both = [...treatments(), { _id: "dup", _rev: "r", slug: "infrared-heat" }];
    expect(() => run({ treatments: both })).toThrow(/heat-light/);
  });

  it("skips a dataset without servicesPage and warns about open drafts", () => {
    const plan = run({ servicesPage: null, draftIds: ["drafts.servicesPage"] });
    expect(plan.skipped).toEqual(["servicesPage"]);
    expect(plan.warnings[0]).toMatch(/drafts\.servicesPage/);
  });
});
