import { describe, expect, it } from "vitest";
import { treatments, type Treatment } from "@/lib/content";
import reviewedSeo from "@/lib/treatment-seo.json";
import { resolveTreatmentSeo } from "@/lib/treatment-seo";

const cupping = treatments.find(({ slug }) => slug === "cupping")!;

describe("reviewed treatment SEO", () => {
  it("covers exactly the eleven catalogue slugs with unique, bounded metadata", () => {
    expect(Object.keys(reviewedSeo).sort()).toEqual(treatments.map(({ slug }) => slug).sort());
    expect(Object.keys(reviewedSeo)).toHaveLength(11);
    const entries = Object.values(reviewedSeo);
    expect(new Set(entries.map(({ title }) => title)).size).toBe(entries.length);
    expect(new Set(entries.map(({ description }) => description)).size).toBe(entries.length);
    for (const entry of entries) {
      expect(Object.keys(entry).sort()).toEqual(["description", "title"]);
      expect(entry.title.trim()).toBe(entry.title);
      expect(entry.description.trim()).toBe(entry.description);
      expect(entry.title).not.toContain("HolisticVN");
      expect(`${entry.title} | HolisticVN`.length).toBeLessThanOrEqual(60);
      expect(entry.description.length).toBeLessThanOrEqual(160);
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });

  it.each(treatments)(
    "uses reviewed defaults for bundled $slug without changing its image",
    (treatment) => {
      expect(resolveTreatmentSeo(treatment)).toEqual({
        ...reviewedSeo[treatment.slug as keyof typeof reviewedSeo],
        image: treatment.image,
      });
    },
  );

  it.each([
    { title: " Editor title ", description: " " },
    { title: "\n", description: " Editor description " },
    { title: "", description: "\t" },
  ])("resolves partial and blank CMS fields independently: %j", (seo) => {
    expect(resolveTreatmentSeo({ ...cupping, seo })).toMatchObject({
      title: seo.title.trim() || reviewedSeo.cupping.title,
      description: seo.description.trim() || reviewedSeo.cupping.description,
    });
  });

  it("prefers the CMS OG image, then the treatment image, treating blank values as absent", () => {
    const image = "https://cdn.sanity.io/images/p/d/og.jpg";
    expect(resolveTreatmentSeo({ ...cupping, seo: { ogImage: image } }).image).toBe(image);
    expect(resolveTreatmentSeo({ ...cupping, seo: { ogImage: "  " } }).image).toBe(cupping.image);
    expect(resolveTreatmentSeo({ ...cupping, image: undefined }).image).toBeUndefined();
  });

  it("uses a future treatment's own copy without inventing reviewed defaults", () => {
    const future: Treatment = {
      slug: "future-treatment",
      title: "Future treatment",
      shortDescription: "Its own description",
      description: "Its educational content",
      benefits: [],
    };
    expect(resolveTreatmentSeo(future)).toEqual({
      title: future.title,
      description: future.shortDescription,
      image: undefined,
    });
    expect(
      resolveTreatmentSeo({ ...future, seo: { description: "Editor description" } }),
    ).toMatchObject({ title: future.title, description: "Editor description" });
  });
});
