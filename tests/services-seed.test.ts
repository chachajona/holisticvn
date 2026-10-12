import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { serviceGroups, services } from "@/lib/content";
import { validateServiceGroups } from "@/sanity/serviceGroups";

const seed = JSON.parse(readFileSync("scripts/seed/services-page.json", "utf8"));

describe("servicesPage seed", () => {
  it("is the published singleton with a dot-free _id", () => {
    expect(seed._id).toBe("servicesPage");
    expect(seed._type).toBe("servicesPage");
  });

  it("passes the Studio group validator with unique _keys", () => {
    expect(validateServiceGroups(seed.groups)).toBe(true);
    expect(new Set(seed.groups.map((g: { _key: string }) => g._key)).size).toBe(3);
    expect(seed.groups.map((g: { group: string }) => g.group)).toEqual([...serviceGroups]);
  });

  it("matches the fallback copy so the two cannot drift", () => {
    for (const [i, fallback] of services.entries()) {
      const { title, shortTitle, summary, body, bullets } = seed.groups[i];
      expect({ title, shortTitle, summary, body, bullets }).toEqual({
        title: fallback.title,
        shortTitle: fallback.shortTitle,
        summary: fallback.summary,
        body: fallback.body,
        bullets: fallback.bullets,
      });
    }
  });

  it("leaves images and treatment references to editors", () => {
    for (const g of seed.groups) {
      expect(g).not.toHaveProperty("image");
      expect(g).not.toHaveProperty("treatments");
    }
  });
});
