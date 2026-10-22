import { describe, expect, it } from "vitest";
import { methods, treatments, type Method, type Treatment } from "@/lib/content";
import { buildTreatmentDetail } from "@/lib/treatment-detail";

const find = (slug: string) => treatments.find((t) => t.slug === slug)!;
const group = (name: string, filterTags: string[], slugs: string[]) =>
  ({
    group: name,
    title: `Nhóm ${name}`,
    filterTags,
    treatments: slugs.map((slug) => ({ slug, title: slug })),
  }) as unknown as Method;
const doc = (slug: string, price?: number) =>
  ({ slug, title: slug, price }) as unknown as Treatment;

describe("buildTreatmentDetail", () => {
  it("reads groups, stages and siblings without treating group filters as clinical indications", () => {
    const detail = buildTreatmentDetail(find("cupping"), treatments, methods);
    expect(detail.groups).toEqual([{ group: "manual", title: "Trị liệu thủ công" }]);
    expect(detail.stages).toEqual(["therapy"]);
    expect(detail.conditions).toEqual([]);
    expect(detail.related.map((r) => r.slug)).toEqual([
      "dry-needling",
      "iastm",
      "tapping",
      "chiropractic-adjustment",
    ]);
  });

  it("returns nothing related when the treatment is alone in its group", () => {
    const detail = buildTreatmentDetail(find("heat-light"), treatments, methods);
    expect(detail.stages).toEqual(["recovery"]);
    expect(detail.related).toEqual([]);
  });

  it("returns empty collections when the treatment belongs to no group", () => {
    const detail = buildTreatmentDetail(doc("orphan"), [doc("orphan")], methods);
    expect(detail).toEqual({ groups: [], stages: [], conditions: [], related: [] });
  });

  it("merges groups without repeating stages or siblings, and leaves clinical indications empty", () => {
    const two = [
      group("cold", ["post-workout-recovery", "muscle-stiffness"], ["a", "b", "c"]),
      group("infrared", ["muscle-stiffness"], ["a", "c", "d"]),
    ];
    const detail = buildTreatmentDetail(doc("a"), [doc("a"), doc("b"), doc("c"), doc("d")], two);
    expect(detail.groups.map((g) => g.group)).toEqual(["cold", "infrared"]);
    expect(detail.stages).toEqual(["recovery"]);
    expect(detail.conditions).toEqual([]);
    expect(detail.related.map((r) => r.slug)).toEqual(["b", "c", "d"]);
  });

  it("skips siblings with no document, drops non-positive prices and caps the list at six", () => {
    const slugs = ["me", "s1", "s2", "ghost", "s3", "s4", "s5", "s6", "s7"];
    const catalogue = [
      doc("me"),
      doc("s1", 0),
      doc("s2", 99000),
      ...["s3", "s4", "s5", "s6", "s7"].map((s) => doc(s)),
    ];
    const detail = buildTreatmentDetail(catalogue[0], catalogue, [group("manual", [], slugs)]);
    expect(detail.related.map((r) => r.slug)).toEqual(["s1", "s2", "s3", "s4", "s5", "s6"]);
    expect(detail.related[0].price).toBeUndefined();
    expect(detail.related[1].price).toBe(99000);
  });
});
