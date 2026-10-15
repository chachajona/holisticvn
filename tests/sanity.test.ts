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
import TreatmentPage, { generateMetadata } from "@/app/treatments/[slug]/page";
import { LeadForm } from "@/components/lead-form";
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
    fetch.mockResolvedValue([{ slug: "test-treatment", title: "Treatment", benefits: null }]);
    expect(
      renderToStaticMarkup(
        await TreatmentPage({ params: Promise.resolve({ slug: "test-treatment" }) }),
      ),
    ).toContain("Treatment");
  });
  describe("treatment detail page", () => {
    const render = async (slug: string) =>
      renderToStaticMarkup(await TreatmentPage({ params: Promise.resolve({ slug }) }));
    const full = {
      slug: "full",
      title: "Full Treatment",
      shortDescription: "Short",
      description: "Long description",
      duration: "45 phút",
      image: "https://cdn.sanity.io/images/p/d/a.jpg",
      benefits: ["Một", "Hai"],
      protocols: [
        { step: 2, title: "Bước hai", description: "" },
        { step: 1, title: "Bước một", description: "Mô tả một" },
      ],
      seo: {
        title: "SEO title",
        description: "SEO description",
        ogImage: "https://cdn.sanity.io/images/p/d/og.jpg",
      },
    };
    it("renders a full document with ordered protocol steps", async () => {
      fetch.mockResolvedValue([full]);
      const html = await render("full");
      expect(html).toContain("Long description");
      expect(html).toContain("Thời lượng gợi ý · 45 phút");
      expect(html.indexOf("Bước một")).toBeGreaterThan(-1);
      expect(html.indexOf("Bước một")).toBeLessThan(html.indexOf("Bước hai"));
      expect(html).toContain("<img");
    });
    it("shows the short description up top and the detailed one under 'what to expect'", async () => {
      fetch.mockResolvedValue([full]);
      const html = await render("full");
      expect(html.indexOf("Short")).toBeGreaterThan(-1);
      expect(html.indexOf("Short")).toBeLessThan(html.indexOf("Long description"));
      expect(html).not.toContain("Chuyên gia sẽ trao đổi");
    });
    it("shows the generic 'what to expect' text only when the CMS has no separate detail", async () => {
      fetch.mockResolvedValue([
        { ...full, shortDescription: "Same text", description: "Same text" },
      ]);
      const html = await render("full");
      expect(html.match(/Same text/g)).toHaveLength(1);
      expect(html).toContain("Chuyên gia sẽ trao đổi");
    });
    it("splits CMS text on line breaks, including the legacy literal backslash-n", async () => {
      fetch.mockResolvedValue([{ ...full, description: "Đoạn một.\\n\\nĐoạn hai.\n\nĐoạn ba." }]);
      const html = await render("full");
      expect(html).not.toContain("\\n");
      for (const part of ["Đoạn một.", "Đoạn hai.", "Đoạn ba."]) {
        expect(html).toContain(`<p>${part}</p>`);
      }
    });
    it("omits empty sections and the image when optional fields are missing", async () => {
      fetch.mockResolvedValue([{ slug: "bare", title: "Bare" }]);
      const html = await render("bare");
      expect(html).toContain("Bare");
      expect(html).not.toContain("Thời lượng gợi ý");
      expect(html).not.toContain("<ul");
      expect(html).not.toContain("Quy trình");
      expect(html).not.toContain("<img");
      expect(html).toContain("data-plain");
      expect(html).not.toContain("/images/Iastm.jpg");
    });
    it("returns a real 404 for an unknown slug", async () => {
      fetch.mockResolvedValue([full]);
      await expect(render("missing")).rejects.toMatchObject({
        digest: "NEXT_HTTP_ERROR_FALLBACK;404",
      });
    });
    it("uses CMS SEO fields and falls back to the treatment fields", async () => {
      fetch.mockResolvedValue([full, { slug: "bare", title: "Bare", shortDescription: "Short" }]);
      const seo = await generateMetadata({ params: Promise.resolve({ slug: "full" }) });
      expect(seo).toMatchObject({
        title: "SEO title",
        description: "SEO description",
        openGraph: { images: ["https://cdn.sanity.io/images/p/d/og.jpg"] },
      });
      const plain = await generateMetadata({ params: Promise.resolve({ slug: "bare" }) });
      expect(plain).toMatchObject({ title: "Bare", description: "Short" });
      expect(plain.openGraph).not.toHaveProperty("images");
    });
    it("hands the treatment title to the callback form", async () => {
      fetch.mockResolvedValue([full]);
      const find = (node: unknown): { props: { treatment?: string } } | undefined => {
        if (!node || typeof node !== "object") return undefined;
        const element = node as { type?: unknown; props?: { children?: unknown } };
        if (element.type === LeadForm) return element as never;
        return [element.props?.children].flat(Infinity).map(find).find(Boolean);
      };
      const tree = await TreatmentPage({ params: Promise.resolve({ slug: "full" }) });
      expect(find(tree)?.props).toMatchObject({ kind: "booking", treatment: "Full Treatment" });
    });
    it("shows the English name as a subtitle, the price and the certified note", async () => {
      fetch.mockResolvedValue([
        {
          ...full,
          title: "Châm khô",
          englishTitle: "Dry Needling",
          price: 299000,
          requiresCertifiedPractitioner: true,
        },
      ]);
      const html = await render("full");
      expect(html).toContain("<h1>Châm khô</h1>");
      expect(html).toContain('lang="en">Dry Needling</p>');
      expect(html).toMatch(/Giá<\/span>\s*299\.000\s₫/);
      expect(html).toContain(
        "Các dịch vụ trị liệu này chỉ được thực hiện và theo dõi bởi chuyên viên có chứng nhận và chứng chỉ chuyên môn.",
      );
    });
    it("hides the subtitle when the English name repeats the title", async () => {
      fetch.mockResolvedValue([{ ...full, title: "IASTM", englishTitle: "iastm" }]);
      expect(await render("full")).not.toContain('lang="en"');
    });
    it.each([undefined, 0])("shows no price line for the price %s", async (price) => {
      fetch.mockResolvedValue([{ ...full, price }]);
      const html = await render("full");
      expect(html).not.toContain("Giá</span>");
      expect(html).not.toContain("₫");
    });
    it("shows the certified note even without a price, and not when the flag is off", async () => {
      fetch.mockResolvedValue([{ ...full, requiresCertifiedPractitioner: true }]);
      expect(await render("full")).toContain("chuyên viên có chứng nhận");
      fetch.mockResolvedValue([{ ...full, requiresCertifiedPractitioner: false }]);
      expect(await render("full")).not.toContain("chuyên viên có chứng nhận");
    });
  });
});
