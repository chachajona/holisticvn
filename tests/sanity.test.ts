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
      expect(html).toContain("Thời lượng gợi ý");
      expect(html.indexOf("Bước một")).toBeGreaterThan(-1);
      expect(html.indexOf("Bước một")).toBeLessThan(html.indexOf("Bước hai"));
      expect(html).toContain("<img");
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
  });
});
