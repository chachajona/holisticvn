import { beforeEach, describe, expect, it, vi } from "vitest";
const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch }) }));
vi.mock("@/sanity/env", () => ({
  projectId: "configured-project",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
import { renderToStaticMarkup } from "react-dom/server";
import BlogPage from "@/app/blog/page";
import PostPage from "@/app/blog/[slug]/page";
import { getPosts, getTreatments, getServices, getPublicSiteData } from "@/lib/sanity";

describe("configured Sanity content", () => {
  beforeEach(() => {
    fetch.mockReset();
  });
  it("keeps an empty published dataset empty", async () => {
    fetch.mockResolvedValue([]);
    expect(await getPosts()).toEqual([]);
    expect(await getTreatments()).toEqual([]);
    expect(await getServices()).toEqual([]);
  });
  it("does not publish samples on a dataset outage", async () => {
    fetch.mockRejectedValue(new Error("Network unavailable"));
    await expect(getPosts()).rejects.toThrow("Network unavailable");
  });
  it("normalizes optional treatment fields and missing media", async () => {
    fetch.mockResolvedValue([
      { slug: "test-treatment", title: "Treatment", benefits: null, image: null },
    ]);
    expect((await getTreatments())[0]).toMatchObject({
      benefits: [],
      protocols: [],
      duration: "",
    });
    expect((await getTreatments())[0].image).toBeUndefined();
    expect((await getTreatments())[0].seo).toBeUndefined();
  });
  it("orders protocol steps and drops malformed ones", async () => {
    fetch.mockResolvedValue([
      {
        slug: "t",
        title: "T",
        protocols: [
          { step: 2, title: "Second", description: "b" },
          { step: 3, title: "  ", description: "empty title" },
          null,
          { step: 1, title: "First" },
        ],
      },
    ]);
    expect((await getTreatments())[0].protocols).toEqual([
      { step: 1, title: "First", description: "" },
      { step: 2, title: "Second", description: "b" },
    ]);
  });
  it("maps CMS SEO fields and ignores a non-CDN OG image", async () => {
    fetch.mockResolvedValue([
      {
        slug: "t",
        title: "T",
        image: "https://cdn.sanity.io/images/p/d/a.jpg",
        imageAlt: "Ảnh T",
        seo: { title: "SEO T", description: "", ogImage: "http://evil.test/x.jpg" },
      },
    ]);
    const [treatment] = await getTreatments();
    expect(treatment).toMatchObject({ imageAlt: "Ảnh T", seo: { title: "SEO T" } });
    expect(treatment.seo?.description).toBeUndefined();
    expect(treatment.seo?.ogImage).toBeUndefined();
  });
  it("keeps an integer price and drops anything else", async () => {
    fetch.mockResolvedValue([
      { slug: "a", title: "A", price: 149000 },
      { slug: "b", title: "B", price: 99.5 },
      { slug: "c", title: "C", price: -1 },
      { slug: "d", title: "D", price: "99000" },
    ]);
    expect((await getTreatments()).map((t) => t.price)).toEqual([
      149000,
      undefined,
      undefined,
      undefined,
    ]);
  });
  it("maps englishTitle and the certified-practitioner flag with safe defaults", async () => {
    fetch.mockResolvedValue([
      {
        slug: "a",
        title: "Châm khô",
        englishTitle: "Dry Needling",
        requiresCertifiedPractitioner: true,
      },
      { slug: "b", title: "Giác hơi", englishTitle: "  ", requiresCertifiedPractitioner: "yes" },
    ]);
    const [a, b] = await getTreatments();
    expect(a).toMatchObject({
      englishTitle: "Dry Needling",
      requiresCertifiedPractitioner: true,
    });
    expect(b.englishTitle).toBeUndefined();
    expect(b.requiresCertifiedPractitioner).toBe(false);
  });
  it("asks Sanity for the new treatment fields", async () => {
    fetch.mockResolvedValue([]);
    await getTreatments();
    const query = String(fetch.mock.calls.at(-1)?.[0]);
    expect(query).toContain("englishTitle");
    expect(query).toContain("requiresCertifiedPractitioner");
    expect(fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      {},
      {
        next: { revalidate: 3600, tags: ["sanity"] },
      },
    );
  });
  it("maps the badge, falling back to the legacy isPopular flag", async () => {
    fetch.mockResolvedValue([
      { slug: "a", title: "A", badge: "new" },
      { slug: "b", title: "B", badge: "popular" },
      { slug: "c", title: "C", badge: "best-seller" },
      { slug: "d", title: "D", isPopular: true },
      { slug: "e", title: "E", badge: "new", isPopular: true },
      { slug: "f", title: "F" },
    ]);
    expect((await getTreatments()).map((t) => t.badge)).toEqual([
      "new",
      "popular",
      undefined,
      "popular",
      "new",
      undefined,
    ]);
  });
  it("lets an explicit no-badge selection override the hidden legacy popular flag", async () => {
    fetch.mockResolvedValue([
      { slug: "legacy", title: "Legacy", badge: "none", isPopular: true },
      { slug: "plain", title: "Plain", badge: "none" },
      { slug: "untouched", title: "Untouched", isPopular: true },
    ]);
    expect((await getTreatments()).map((t) => t.badge)).toEqual([undefined, undefined, "popular"]);
  });
  it("keeps only FAQ entries that have both a question and an answer", async () => {
    fetch.mockResolvedValue([
      {
        slug: "a",
        title: "A",
        faqs: [
          { question: " Hỏi một? ", answer: " Đáp một. " },
          { question: "Thiếu đáp án?", answer: "  " },
          { question: "", answer: "Thiếu câu hỏi" },
          null,
        ],
      },
      { slug: "b", title: "B", faqs: "không phải mảng" },
    ]);
    const [a, b] = await getTreatments();
    expect(a.faqs).toEqual([{ question: "Hỏi một?", answer: "Đáp một." }]);
    expect(b.faqs).toEqual([]);
  });
  it("asks Sanity for the badge and FAQs", async () => {
    fetch.mockResolvedValue([]);
    await getTreatments();
    const query = String(fetch.mock.calls.at(-1)?.[0]);
    expect(query).toContain("badge");
    expect(query).toContain("faqs");
  });
  it.each([null, undefined, "invalid-date"])(
    "handles a post without valid publishedAt (%s)",
    async (publishedAt) => {
      fetch.mockResolvedValue([
        { slug: "test-post", title: "Post", publishedAt, body: "First\n\nSecond" },
      ]);
      expect((await getPosts())[0]).toMatchObject({ publishedAt: null, body: ["First", "Second"] });
    },
  );
  it("exposes CMS contact settings while keeping the owner-confirmed clinic", async () => {
    fetch.mockResolvedValue({
      contactPhone: "0901234567",
      contactEmail: "clinic@example.com",
      locations: [
        { name: "Cơ sở Xóm Chiếu", address: "109/15 Lê Quốc Hưng, P. Xóm Chiếu, TP. Hồ Chí Minh" },
        { name: "Chi nhánh Bàn Cờ", address: "205 Nguyễn Đình Chiểu", isPrimary: true },
      ],
      socialMedia: { instagram: "https://www.instagram.com/clinic/" },
    });
    const { site, branches } = await getPublicSiteData();
    expect(site.phone).toBe("0901234567");
    expect(site.email).toBe("clinic@example.com");
    expect(site.instagramUrl).toBe("https://www.instagram.com/clinic/");
    expect(branches).toEqual([
      { name: "Cơ sở Xóm Chiếu", address: "109/15 Lê Quốc Hưng, P. Xóm Chiếu, TP. Hồ Chí Minh" },
    ]);
    expect(site.address).toBe(branches[0].address);
  });
  it("renders CMS pages with omitted optional fields", async () => {
    fetch.mockResolvedValue([{ slug: "test-post", title: "Post" }]);
    expect(renderToStaticMarkup(await BlogPage())).toContain("Post");
    expect(
      renderToStaticMarkup(await PostPage({ params: Promise.resolve({ slug: "test-post" }) })),
    ).not.toContain("Invalid Date");
  });
});
