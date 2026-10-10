import { describe, expect, it } from "vitest";
import { navMorphProgress } from "@/lib/nav-morph";

describe("navMorphProgress", () => {
  it("holds the bar before the start and the pill after the range", () => {
    expect(navMorphProgress(0, 36, 120, false)).toBe(0);
    expect(navMorphProgress(36, 36, 120, false)).toBe(0);
    expect(navMorphProgress(156, 36, 120, false)).toBe(1);
    expect(navMorphProgress(900, 36, 120, false)).toBe(1);
  });
  it("eases monotonically in between", () => {
    const steps = [60, 90, 120].map((y) => navMorphProgress(y, 36, 120, false));
    expect(steps[0]).toBeGreaterThan(0);
    expect(steps[0]).toBeLessThan(steps[1]);
    expect(steps[1]).toBeLessThan(steps[2]);
    expect(steps[2]).toBeLessThan(1);
  });
  it("snaps instead of animating with reduced motion", () => {
    expect(navMorphProgress(60, 36, 120, true)).toBe(0);
    expect(navMorphProgress(120, 36, 120, true)).toBe(1);
  });
});
