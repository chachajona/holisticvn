import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { methods, services, treatments } from "@/lib/content";
import { schemaTypes } from "@/sanity/schemaTypes";

type SeedDocument = {
  _id: string;
  _type: string;
  title: string;
  englishTitle?: string;
  slug: { _type: string; current: string };
  shortDescription: string;
  description: string;
  price: number;
  requiresCertifiedPractitioner: boolean;
};
const seed: SeedDocument[] = JSON.parse(readFileSync("scripts/seed/treatments.json", "utf8"));
const links = JSON.parse(readFileSync("scripts/seed/treatment-links.json", "utf8")) as Record<
  string,
  Record<string, string[]>
>;

describe("treatments seed", () => {
  it("has one dot-free published document per catalogue treatment", () => {
    expect(seed.map((d) => d.slug.current)).toEqual(treatments.map((t) => t.slug));
    for (const doc of seed) {
      expect(doc._type).toBe("treatment");
      expect(doc._id).toBe(`treatment-${doc.slug.current}`);
      expect(doc.slug._type).toBe("slug");
    }
  });

  it("matches the bundled catalogue so the two cannot drift", () => {
    for (const [i, t] of treatments.entries()) {
      const {
        title,
        englishTitle,
        shortDescription,
        description,
        price,
        requiresCertifiedPractitioner,
      } = seed[i];
      expect({
        title,
        englishTitle,
        shortDescription,
        description,
        price,
        requiresCertifiedPractitioner,
      }).toEqual({
        title: t.title,
        englishTitle: t.englishTitle,
        shortDescription: t.shortDescription,
        description: t.description,
        price: t.price,
        requiresCertifiedPractitioner: t.requiresCertifiedPractitioner,
      });
    }
  });

  it("carries the approved questions and answers of the bundled catalogue", () => {
    for (const [i, t] of treatments.entries()) {
      const seeded = (seed[i] as { faqs?: Array<{ question: string; answer: string }> }).faqs;
      expect(seeded?.map(({ question, answer }) => ({ question, answer }))).toEqual(t.faqs);
    }
  });

  it("only uses fields the treatment schema defines, and leaves photos, steps and SEO to editors", () => {
    const treatment = schemaTypes.find((t) => t.name === "treatment") as unknown as {
      fields: Array<{ name: string }>;
    };
    const known = new Set(["_id", "_type", ...treatment.fields.map((f) => f.name)]);
    for (const doc of seed) {
      for (const key of Object.keys(doc)) expect(known.has(key), `${doc._id}.${key}`).toBe(true);
      for (const key of ["image", "protocols", "benefits", "seo", "duration"]) {
        expect(doc).not.toHaveProperty(key);
      }
    }
  });
});

describe("treatment links", () => {
  it("match the bundled groups, in order", () => {
    const bundled = (groups: Array<{ group: string; treatments: Array<{ slug: string }> }>) =>
      Object.fromEntries(
        groups
          .filter((g) => g.treatments.length)
          .map((g) => [g.group, g.treatments.map((t) => t.slug)]),
      );
    expect(links.methodsPage).toEqual(bundled(methods));
    expect(links.servicesPage).toEqual(bundled(services));
  });

  it("only reference treatments in the seed", () => {
    const slugs = new Set(seed.map((d) => d.slug.current));
    for (const groups of Object.values(links)) {
      for (const list of Object.values(groups)) {
        for (const slug of list) expect(slugs.has(slug), slug).toBe(true);
      }
    }
  });
});
