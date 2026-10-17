import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { methods, services, treatments } from "@/lib/content";

// The owner's price list (supplied 2026-10-09). Descriptions are checked against the seed in
// tests/treatments-seed.test.ts and by eye against the price-list image.
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

  it("has one description per treatment, no duration, benefits or protocols", () => {
    for (const t of treatments) {
      expect(t.description, t.slug).not.toBe("");
      expect(t.shortDescription, t.slug).toBe(t.description);
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
    const ultrasound = treatments.find((t) => t.slug === "therapeutic-ultrasound");
    expect(ultrasound?.description).toContain("giải toả căng cơ");
  });
});
