import { Schema } from "@sanity/schema";
import { builtinTypes } from "@sanity/schema/_internal";
import { validateDocument } from "@sanity/validation";
import { describe, expect, it } from "vitest";
import { schemaTypes } from "@/sanity/schemaTypes";

const schema = Schema.compile({ name: "test", types: [...schemaTypes, ...builtinTypes] });
// fetch backs the built-in slug uniqueness check, which expects `true` when the slug is free.
const client = { withConfig: () => client, fetch: async () => true };
// validateDocument is @beta: keep this the only place in this file that calls it.
const check = async (document: object) => {
  const result = await validateDocument({
    document,
    schema,
    client,
    getDocumentExists: async () => true,
  } as never);
  const level = (name: string) =>
    result.markers.filter((m) => m.level === name).map((m) => m.message);
  return { errors: level("error"), warnings: level("warning") };
};
const base = {
  _id: "treatment-test",
  _type: "treatment",
  title: "Giác hơi",
  slug: { _type: "slug", current: "cupping" },
};
const image = (alt?: string) => ({
  _type: "image",
  asset: { _type: "reference", _ref: "image-abc123-100x100-jpg" },
  ...(alt ? { alt } : {}),
});

describe("treatment schema", () => {
  const treatment = schemaTypes.find((t) => t.name === "treatment") as unknown as {
    fields: Array<{ name: string; type: string; initialValue?: unknown }>;
  };
  const field = (name: string) => treatment.fields.find((f) => f.name === name);

  it("has the English title and certified-practitioner fields", () => {
    expect(field("englishTitle")?.type).toBe("string");
    expect(field("requiresCertifiedPractitioner")).toMatchObject({
      type: "boolean",
      initialValue: false,
    });
  });

  it("accepts a document with only a title and a slug", async () => {
    expect((await check(base)).errors).toEqual([]);
  });

  it.each(["Giac Hoi", "giac hoi", "-giac-hoi", "giac--hoi", "giác-hơi"])(
    "rejects the slug %s",
    async (current) => {
      const { errors, warnings } = await check({ ...base, slug: { _type: "slug", current } });
      // validateDocument runs in the "cli" environment, which downgrades every custom rule on an
      // object-typed field (slug) to a warning; in Studio the same rule is an error.
      expect([...errors, ...warnings]).toContain(
        "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.",
      );
    },
  );

  it.each([149000, 0])("accepts the price %s", async (price) => {
    expect((await check({ ...base, price })).errors).toEqual([]);
  });

  it.each([99.5, -1])("rejects the price %s", async (price) => {
    expect((await check({ ...base, price })).errors.length).toBeGreaterThan(0);
  });

  it("requires alt text once an image is chosen, not before", async () => {
    expect((await check({ ...base, image: image() })).errors).toContain("Cần alt text khi có ảnh.");
    expect((await check({ ...base, image: image("Giác hơi") })).errors).toEqual([]);
    expect((await check(base)).errors).toEqual([]);
  });

  it("limits the title to the booking limit", async () => {
    const { errors } = await check({ ...base, title: "x".repeat(121) });
    expect(errors).toContain("Tên liệu pháp không được dài quá 120 ký tự.");
  });

  it("warns, but does not block, on long SEO text", async () => {
    const { errors, warnings } = await check({
      ...base,
      seo: { title: "t".repeat(61), description: "d".repeat(161) },
    });
    expect(errors).toEqual([]);
    expect(warnings).toHaveLength(2);
  });

  it("offers exactly two badges and hides the legacy popular flag", () => {
    const badge = (
      treatment.fields as unknown as Array<{
        name: string;
        type: string;
        options?: { list?: Array<{ title: string; value: string }> };
        hidden?: unknown;
      }>
    ).find((f) => f.name === "badge");
    expect(badge?.type).toBe("string");
    expect(badge?.options?.list).toEqual([
      { title: "Được chọn nhiều", value: "popular" },
      { title: "Mới", value: "new" },
    ]);
    const popular = (treatment.fields as unknown as Array<{ name: string; hidden?: unknown }>).find(
      (f) => f.name === "isPopular",
    );
    expect(popular?.hidden).toBe(true);
  });

  it("requires both a question and an answer for each FAQ entry", async () => {
    const faq = (question?: string, answer?: string) => ({
      _key: "k1",
      _type: "treatmentFaq",
      question,
      answer,
    });
    expect((await check({ ...base, faqs: [faq("Hỏi?", "Đáp.")] })).errors).toEqual([]);
    expect(
      (await check({ ...base, faqs: [faq("Hỏi?", undefined)] })).errors.length,
    ).toBeGreaterThan(0);
    expect(
      (await check({ ...base, faqs: [faq(undefined, "Đáp.")] })).errors.length,
    ).toBeGreaterThan(0);
  });

  it("warns, but does not block, on more than ten FAQ entries", async () => {
    const faqs = Array.from({ length: 11 }, (_, i) => ({
      _key: `k${i}`,
      _type: "treatmentFaq",
      question: `Hỏi ${i}?`,
      answer: "Đáp.",
    }));
    const { errors, warnings } = await check({ ...base, faqs });
    expect(errors).toEqual([]);
    expect(warnings).toContain("Nên giữ tối đa 10 câu hỏi.");
  });
});
