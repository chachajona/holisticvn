import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { methods, services, treatments } from "@/lib/content";

// Names, prices and certification marks follow the owner's price list (2026-10-09).
// Researched descriptions are kept in sync with the seed by tests/treatments-seed.test.ts.
const priceList = [
  ["dry-needling", "Châm khô", "Dry Needling", 299000, true],
  ["cupping", "Giác hơi", "Cupping", 99000, false],
  ["iastm", "IASTM", undefined, 199000, false],
  ["heat-light", "Đèn hồng ngoại", "Heat Light", 99000, false],
  ["cold-plunge", "Ngâm lạnh", "Cold Plunge", 149000, false],
  ["tapping", "Tapping", undefined, 99000, false],
  ["shockwave", "Xung kích", "Shockwave Therapy", 349000, false],
  ["bio-electric", "Điện xung", "Bio-electric", 349000, false],
  ["therapeutic-ultrasound", "Sóng siêu âm", "Therapeutic Ultrasound", 349000, false],
  ["electroacupuncture", "Điện châm", "Electroacupuncture", 249000, true],
  ["chiropractic-adjustment", "Nắn chỉnh cột sống", "Chiropractic Adjustment", 299000, true],
] as const;

describe("treatment catalogue (fallback)", () => {
  it("matches the owner's price list: name, English name, price and the * flag", () => {
    expect(
      treatments.map((t) => [
        t.slug,
        t.title,
        t.englishTitle,
        t.price,
        t.requiresCertifiedPractitioner ?? false,
      ]),
    ).toEqual(priceList.map((row) => [...row]));
  });

  it("has a description per treatment, no duration, benefits or protocols", () => {
    for (const t of treatments) {
      expect(t.description, t.slug).not.toBe("");
      expect(t.shortDescription, t.slug).not.toBe("");
      expect(t.duration, t.slug).toBeUndefined();
      expect(t.benefits, t.slug).toEqual([]);
      expect(t.protocols, t.slug).toBeUndefined();
    }
  });

  it("only uses clinic photos that exist, and no photo is better than a wrong one", () => {
    for (const t of treatments)
      if (t.image) expect(existsSync(`public${t.image}`), t.slug).toBe(true);
  });

  it("links every group to existing treatments under their catalogue title", () => {
    const title = new Map(treatments.map((t) => [t.slug, t.title]));
    for (const group of [...methods, ...services]) {
      for (const link of group.treatments) {
        expect(title.get(link.slug), `${group.group}: ${link.slug}`).toBe(link.title);
      }
    }
  });

  it("keeps the owner's orthography (toả, hoá), never the new-style tỏa", () => {
    for (const t of treatments) expect(t.description, t.slug).not.toContain("tỏa");
    for (const t of treatments) expect(t.shortDescription, t.slug).not.toContain("tỏa");
    for (const t of treatments) expect(t.description, t.slug).not.toContain("hóa");
  });
});
