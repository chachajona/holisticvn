import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  methodAnchor,
  methodFallbackImage,
  methodGroups,
  methodStages,
  methods,
  treatments,
} from "@/lib/content";

describe("method groups", () => {
  it("is the single list behind anchors, fallback images and fallback methods", () => {
    expect(methodGroups).toEqual(["manual", "electro", "rehab", "cold", "infrared"]);
    expect(Object.keys(methodAnchor)).toEqual([...methodGroups]);
    expect(Object.keys(methodFallbackImage)).toEqual([...methodGroups]);
    expect(methods.map((m) => m.group)).toEqual([...methodGroups]);
  });

  it("places every method group in exactly one pathway stage, in group order", () => {
    expect(methodStages.flatMap((stage) => stage.groups)).toEqual([...methodGroups]);
  });

  it("does not store presentation that the page derives from position", () => {
    for (const method of methods) {
      expect(method).not.toHaveProperty("numeral");
      expect(method).not.toHaveProperty("id");
      expect(method).not.toHaveProperty("imageLeft");
    }
  });

  it("only links treatments that exist and images that exist on disk", () => {
    const slugs = new Set(treatments.map((t) => t.slug));
    for (const method of methods) {
      expect(method.image).toBe(methodFallbackImage[method.group]);
      expect(existsSync(`public${method.image}`), method.image).toBe(true);
      expect(method.imageAlt).not.toBe("");
      for (const t of method.treatments) expect(slugs.has(t.slug), t.slug).toBe(true);
    }
  });

  it("maps the owner's price list: only treatments with a document are linked", () => {
    const linked = Object.fromEntries(
      methods.map((m) => [m.group, m.treatments.map((t) => t.slug)]),
    );
    expect(linked).toEqual({
      manual: ["dry-needling", "cupping", "iastm"],
      electro: [],
      rehab: [],
      cold: ["cold-plunge"],
      infrared: ["heat-light"],
    });
  });
});
