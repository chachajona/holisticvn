import { describe, expect, it } from "vitest";
import { serviceAnchor, serviceFallbackImage, serviceGroups, services } from "@/lib/content";

describe("service groups", () => {
  it("is the single list behind anchors, fallback images and fallback services", () => {
    expect(serviceGroups).toEqual(["therapy", "training", "recovery"]);
    expect(Object.keys(serviceAnchor)).toEqual([...serviceGroups]);
    expect(Object.keys(serviceFallbackImage)).toEqual([...serviceGroups]);
    expect(services.map((s) => s.group)).toEqual([...serviceGroups]);
  });

  it("does not carry a slug (there is no service detail route)", () => {
    for (const service of services) expect(service).not.toHaveProperty("slug");
  });
});
