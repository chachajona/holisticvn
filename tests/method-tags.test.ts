import { describe, expect, it } from "vitest";
import { matchesMethodTags, methodTags, normalizeMethodTags } from "@/lib/method-tags";

describe("method content filters", () => {
  it("normalizes IDs and exact labels without guessing from old diagnoses", () => {
    expect(
      normalizeMethodTags([
        " neck-pain ",
        "Đau mỏi cổ vai gáy",
        "Lệch chậu",
        "unknown",
        "strength",
      ]),
    ).toEqual(["neck-pain", "strength"]);
  });
  it("keeps no-selection results, matches OR across conditions and goals, and rejects unmatched content", () => {
    expect(matchesMethodTags([], [])).toBe(true);
    expect(matchesMethodTags(["neck-pain"], ["neck-pain", "strength"])).toBe(true);
    expect(matchesMethodTags(["strength"], ["neck-pain", "strength"])).toBe(true);
    expect(matchesMethodTags(["post-workout-recovery"], ["neck-pain", "strength"])).toBe(false);
    expect(matchesMethodTags([], ["hip-pain"])).toBe(false);
  });
  it("has unique IDs and labels across both categories", () => {
    expect(new Set(methodTags.map((tag) => tag.id)).size).toBe(methodTags.length);
    expect(new Set(methodTags.map((tag) => tag.label)).size).toBe(methodTags.length);
    expect(new Set(methodTags.map((tag) => tag.category))).toEqual(new Set(["condition", "goal"]));
  });
});
