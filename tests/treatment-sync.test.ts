import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error plain ESM script helper without type declarations
import { planSync } from "../scripts/lib/treatment-sync.mjs";

const seed = JSON.parse(readFileSync("scripts/seed/treatments.json", "utf8"));
const links = JSON.parse(readFileSync("scripts/seed/treatment-links.json", "utf8"));
const page = (id: string, groups: string[]) => ({
  _id: id,
  _rev: `${id}-rev`,
  groups: groups.map((group, i) => ({ _key: `k${i}`, group })),
});
const pages = () => ({
  methodsPage: page("methodsPage", ["manual", "electro", "rehab", "cold", "infrared"]),
  servicesPage: page("servicesPage", ["therapy", "training", "recovery"]),
});
// Production at the time of writing: three treatments with random legacy ids.
const production = [
  { _id: "legacy-cupping", _rev: "r1", slug: "cupping" },
  { _id: "legacy-cold", _rev: "r2", slug: "cold-plunge" },
  { _id: "legacy-heat", _rev: "r3", slug: "heat-light" },
];
const run = (overrides: object = {}) =>
  planSync({ seed, links, treatments: production, pages: pages(), draftIds: [], ...overrides });

describe("planSync", () => {
  it("creates the missing treatments and patches the existing ones by slug", () => {
    const { mutations } = run();
    const created = mutations.filter((m: object) => "createIfNotExists" in m);
    const patched = mutations.filter(
      (m: { patch?: { id: string } }) => m.patch && m.patch.id.startsWith("legacy-"),
    );
    expect(created).toHaveLength(8);
    expect(patched.map((m: { patch: { id: string } }) => m.patch.id).sort()).toEqual([
      "legacy-cold",
      "legacy-cupping",
      "legacy-heat",
    ]);
  });

  it("overwrites copy, price and flag on an existing treatment and unsets unreviewed content", () => {
    const { mutations } = run();
    const cupping = mutations.find(
      (m: { patch?: { id: string } }) => m.patch?.id === "legacy-cupping",
    ).patch;
    expect(cupping.ifRevisionID).toBe("r1");
    expect(cupping.set).toEqual({
      title: "Giác hơi",
      englishTitle: "Cupping",
      shortDescription: expect.any(String),
      description: expect.any(String),
      price: 99000,
      requiresCertifiedPractitioner: false,
    });
    expect(cupping.unset).toEqual(["seo", "benefits", "protocols", "duration"]);
    expect(cupping.set).not.toHaveProperty("slug");
  });

  it("clears a stale English title when the seed has none", () => {
    const { mutations } = run({
      treatments: [...production, { _id: "legacy-iastm", _rev: "r4", slug: "iastm" }],
    });
    const iastm = mutations.find(
      (m: { patch?: { id: string } }) => m.patch?.id === "legacy-iastm",
    ).patch;
    expect(iastm.set).not.toHaveProperty("englishTitle");
    expect(iastm.unset).toContain("englishTitle");
  });

  it("links groups to the right ids, keeping untouched groups alone", () => {
    const { mutations } = run();
    const methods = mutations.find(
      (m: { patch?: { id: string } }) => m.patch?.id === "methodsPage",
    ).patch;
    expect(methods.ifRevisionID).toBe("methodsPage-rev");
    expect(Object.keys(methods.set).sort()).toEqual([
      'groups[_key=="k0"].treatments',
      'groups[_key=="k1"].treatments',
      'groups[_key=="k3"].treatments',
      'groups[_key=="k4"].treatments',
    ]);
    const cold = methods.set['groups[_key=="k3"].treatments'];
    expect(cold).toEqual([{ _key: "cold-plunge", _type: "reference", _ref: "legacy-cold" }]);
    const electro = methods.set['groups[_key=="k1"].treatments'];
    expect(electro.map((r: { _ref: string }) => r._ref)).toEqual([
      "treatment-shockwave",
      "treatment-bio-electric",
      "treatment-therapeutic-ultrasound",
      "treatment-electroacupuncture",
    ]);
  });

  it("skips a page that was never seeded instead of failing", () => {
    const { mutations, skipped } = run({
      pages: { methodsPage: null, servicesPage: pages().servicesPage },
    });
    expect(skipped).toEqual(["methodsPage"]);
    expect(mutations.some((m: { patch?: { id: string } }) => m.patch?.id === "methodsPage")).toBe(
      false,
    );
  });

  it("stops when two documents share a slug", () => {
    expect(() =>
      run({ treatments: [...production, { _id: "dup", _rev: "r9", slug: "cupping" }] }),
    ).toThrow('Trùng slug "cupping"');
  });

  it("stops when a page lacks a group the links need", () => {
    expect(() =>
      run({ pages: { ...pages(), methodsPage: page("methodsPage", ["manual"]) } }),
    ).toThrow('methodsPage thiếu nhóm "electro"');
  });

  it("warns about open drafts instead of overwriting them silently", () => {
    const { warnings } = run({ draftIds: ["drafts.legacy-cupping", "drafts.methodsPage"] });
    expect(warnings).toEqual([
      "Có bản nháp đang mở: drafts.legacy-cupping, drafts.methodsPage. Bản nháp sẽ không đổi; kiểm tra trước khi publish.",
    ]);
  });

  it("is a no-op for the second run's creates: every seed slug is then 'existing'", () => {
    const after = seed.map((d: { slug: { current: string } }, i: number) => ({
      _id: `treatment-${d.slug.current}`,
      _rev: `r${i}`,
      slug: d.slug.current,
    }));
    const { mutations } = run({ treatments: after });
    expect(mutations.some((m: object) => "createIfNotExists" in m)).toBe(false);
  });
});
