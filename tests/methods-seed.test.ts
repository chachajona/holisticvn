import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { methodGroups, methods } from "@/lib/content";
import { validateMethodGroups } from "@/sanity/serviceGroups";

const seed = JSON.parse(readFileSync("scripts/seed/methods-page.json", "utf8"));

describe("methodsPage seed", () => {
  it("is the published singleton with a dot-free _id", () => {
    expect(seed._id).toBe("methodsPage");
    expect(seed._type).toBe("methodsPage");
  });

  it("passes the Studio group validator with unique _keys in canonical order", () => {
    expect(validateMethodGroups(seed.groups)).toBe(true);
    expect(new Set(seed.groups.map((g: { _key: string }) => g._key)).size).toBe(5);
    expect(seed.groups.map((g: { group: string }) => g.group)).toEqual([...methodGroups]);
    for (const g of seed.groups) expect(g._type).toBe("methodGroup");
  });

  it("matches the bundled copy so the two cannot drift", () => {
    for (const [i, fallback] of methods.entries()) {
      const { title, indexSubtitle, body, tags } = seed.groups[i];
      expect({ title, indexSubtitle, body, tags }).toEqual({
        title: fallback.title,
        indexSubtitle: fallback.indexSubtitle,
        body: fallback.body,
        tags: fallback.tags,
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
