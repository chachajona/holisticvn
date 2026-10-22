import { beforeEach, describe, expect, it, vi } from "vitest";
const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch }) }));
vi.mock("@/sanity/env", () => ({
  projectId: "configured-project",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
import { renderToStaticMarkup } from "react-dom/server";
import TreatmentPage, { generateMetadata } from "@/app/treatments/[slug]/page";
import { treatments } from "@/lib/content";
import reviewedSeo from "@/lib/treatment-seo.json";

const cdn = "https://cdn.sanity.io/images/p/d/";
const sentence =
  "Giác hơi là một phương pháp trị liệu cổ xưa có nguồn gốc từ y học cổ truyền Trung Quốc và các nền văn hóa khác trên thế giới.";
const full = {
  slug: "cupping",
  title: "Giác hơi",
  englishTitle: "Cupping",
  requiresCertifiedPractitioner: false,
  shortDescription: "Mô tả ngắn của giác hơi.",
  description: `${sentence} Liệu pháp này dùng cốc.\n\nĐoạn hai.`,
  duration: "45 phút",
  price: 99000,
  badge: "popular",
  image: `${cdn}a.jpg`,
  benefits: ["Giảm đau tự nhiên", "Thư giãn sâu"],
  protocols: [
    { step: 2, title: "Bước hai", description: "Mô tả hai" },
    { step: 1, title: "Bước một", description: "Mô tả một" },
  ],
  faqs: [
    { question: "Hỏi một?", answer: "Đáp một." },
    { question: "Thiếu đáp án?", answer: " " },
  ],
  seo: { title: "SEO title", description: "SEO description", ogImage: `${cdn}og.jpg` },
};
const sibling = (slug: string, title: string, price?: number) => ({ slug, title, price });
const method = (group: string, extra = {}) => ({
  group,
  title: `Nhóm ${group}`,
  indexSubtitle: `Phụ ${group}`,
  body: `Nội dung ${group}`,
  tags: [],
  filterTags: [],
  image: `${cdn}${group}.jpg`,
  imageAlt: `Ảnh ${group}`,
  treatments: [],
  ...extra,
});
const manual = method("manual", {
  title: "Trị liệu thủ công",
  filterTags: ["back-pain", "pain-relief"],
  treatments: [
    { slug: "cupping", title: "Giác hơi" },
    { slug: "iastm", title: "IASTM" },
    { slug: "ghost", title: "Không có document" },
  ],
});

type Fixture = { treatments?: object[]; methods?: object[] | "fail" };
const serve = ({
  treatments = [full, sibling("iastm", "IASTM", 199000)],
  methods = [manual],
}: Fixture = {}) =>
  fetch.mockImplementation(async (query: string) => {
    if (query.includes('_type == "treatment"')) return treatments;
    if (query.includes("methodsPage")) {
      if (methods === "fail") throw new Error("Sanity unavailable");
      return methods;
    }
    return null;
  });
const render = async (slug = "cupping") =>
  renderToStaticMarkup(await TreatmentPage({ params: Promise.resolve({ slug }) }));

describe("treatment detail page", () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  it("renders every block for a full document in the agreed order", async () => {
    serve();
    const html = await render();
    expect(html).toContain("<h1>Giác hơi</h1>");
    expect(html).toContain('lang="en"');
    expect(html).toContain("Mô tả ngắn của giác hơi.");
    expect(html).toContain('data-badge="popular"');
    expect(html).toContain('id="treatment-facts"');
    expect(html).toMatch(/99\.000\s₫/);
    expect(html).toContain("45 phút");
    expect(html).toContain("2 bước");
    const order = [
      "gioi-thieu",
      "danh-cho-ai",
      "buoi-tri-lieu",
      "cau-hoi",
      "co-the-ban-quan-tam",
      "yeu-cau-title",
    ].map((id) => html.indexOf(`<h2 id="${id}"`));
    expect(order.every((index) => index > -1)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(html.indexOf("Bước một")).toBeLessThan(html.indexOf("Bước hai"));
    expect(html).toContain("<b>Giác hơi</b>");
    expect(html).not.toContain("Đau lưng");
    expect(html).not.toContain("Khi bạn gặp");
    expect(html).toContain("Hỏi một?");
    expect(html).not.toContain("Thiếu đáp án?");
    expect(html).toContain('href="/treatments/iastm"');
    expect(html).not.toContain("Không có document");
    expect(html).toContain('id="yeu-cau"');
    expect(html).toContain('aria-label="Tóm tắt và tư vấn"');
    expect(html.match(/<h1/g)).toHaveLength(1);
  });

  it.each([undefined, "popular", "new"] as const)(
    "keeps the bundled stock photo caption with CMS badge %s",
    async (badge) => {
      serve({ treatments: [{ slug: "tapping", title: "Tapping", badge }], methods: [] });
      const html = await render("tapping");
      expect(html).toContain("images%2Fstock%2Ftapping.jpg");
      expect(html).toContain("Ảnh minh hoạ");
      expect(html).not.toContain("Hình ảnh tại Holistic");
      if (badge) expect(html).toContain(`data-badge="${badge}"`);
    },
  );

  it("never uses italics or boxes with shadows in the markup", async () => {
    serve();
    const html = await render();
    expect(html).not.toMatch(/<(em|i)[ >]/);
    expect(html).not.toContain("italic");
  });

  it("keeps the page valid with only a title and a slug", async () => {
    serve({ treatments: [{ slug: "bare", title: "Bare" }], methods: [] });
    const html = await render("bare");
    expect(html).toContain("<h1>Bare</h1>");
    expect(html).not.toContain('id="treatment-facts"');
    expect(html).not.toContain("Giới thiệu");
    expect(html).not.toContain("Dành cho ai");
    expect(html).not.toContain("Một buổi diễn ra thế nào");
    expect(html).not.toContain("Câu hỏi thường gặp");
    expect(html).not.toContain("Có thể bạn quan tâm");
    expect(html).not.toContain("<img");
    expect(html).toContain("data-plain");
    // With no facts strip the primary call to action sits in the hero (plus the dock).
    expect(html.match(/Nhận tư vấn/g)!.length).toBeGreaterThanOrEqual(2);
    expect(html).toContain('id="yeu-cau"');
  });

  it.each([" ", "\n\t"])(
    "omits the intro link and section for blank copy %j",
    async (description) => {
      serve({ treatments: [{ ...full, description }] });
      const html = await render();
      expect(html).toContain(full.shortDescription);
      expect(html).not.toContain('href="#gioi-thieu"');
      expect(html).not.toContain('id="gioi-thieu"');
    },
  );

  it("does not recommend a treatment based only on its group's symptom filters", async () => {
    serve({ treatments: [{ slug: "cupping", title: "Giác hơi" }], methods: [manual] });
    const html = await render();
    expect(html).not.toContain("Đau lưng");
    expect(html).not.toContain('id="danh-cho-ai"');
    expect(html).not.toContain('href="#danh-cho-ai"');
  });

  it("keeps the primary call to action and the phone link in the hero", async () => {
    serve();
    const html = await render();
    const hero = html.slice(0, html.indexOf('id="treatment-facts"'));
    expect(hero).toContain("Nhận tư vấn");
    expect(hero).toContain("Gọi ");
  });

  it("shows no price cell for a price of zero or none, and the dock has no price either", async () => {
    for (const price of [0, undefined]) {
      serve({ treatments: [{ ...full, price, duration: "" }], methods: [] });
      const html = await render();
      expect(html).not.toContain("₫");
      expect(html).not.toContain("Giá</span>");
    }
  });

  it("shows the certified note even without any quick facts", async () => {
    serve({
      treatments: [{ slug: "bare", title: "Bare", requiresCertifiedPractitioner: true }],
      methods: [],
    });
    const html = await render("bare");
    expect(html).toContain("chỉ được thực hiện và theo dõi bởi chuyên viên có chứng nhận");
    expect(html).not.toContain('id="treatment-facts"');
  });

  it("shows no price on a related card that has none", async () => {
    serve({ treatments: [full, sibling("iastm", "IASTM")], methods: [manual] });
    const html = await render();
    expect(html).toContain('href="/treatments/iastm"');
    expect(html.match(/₫/g)).toHaveLength(2); // the strip's price and the dock's price only
  });

  it("still renders when the methods cannot be read", async () => {
    serve({ methods: "fail" });
    const html = await render();
    expect(html).toContain("<h1>Giác hơi</h1>");
    expect(html).not.toContain("Có thể bạn quan tâm");
  });

  it("returns a real 404 for an unknown slug", async () => {
    serve();
    await expect(render("missing")).rejects.toMatchObject({
      digest: "NEXT_HTTP_ERROR_FALLBACK;404",
    });
    expect(await generateMetadata({ params: Promise.resolve({ slug: "missing" }) })).toEqual({});
  });

  it.each(Object.entries(reviewedSeo))(
    "uses reviewed metadata and the unchanged canonical for CMS treatment %s without SEO",
    async (slug, reviewed) => {
      serve({ treatments: [{ ...full, slug, seo: undefined }] });
      const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
      const canonical = new URL(
        `/treatments/${slug}`,
        process.env.NEXT_PUBLIC_SITE_URL || "https://holisticvn.com",
      ).toString();
      expect(metadata).toMatchObject({
        ...reviewed,
        alternates: { canonical },
        openGraph: { ...reviewed, url: canonical, images: [full.image] },
      });
    },
  );

  it("resolves partial and blank CMS SEO independently without changing visible copy", async () => {
    serve({ treatments: [{ ...full, seo: { title: " Editor title ", description: " " } }] });
    expect(await generateMetadata({ params: Promise.resolve({ slug: "cupping" }) })).toMatchObject({
      title: "Editor title",
      description: reviewedSeo.cupping.description,
    });
    serve({ treatments: [{ ...full, seo: { title: " ", description: " Editor description " } }] });
    expect(await generateMetadata({ params: Promise.resolve({ slug: "cupping" }) })).toMatchObject({
      title: reviewedSeo.cupping.title,
      description: "Editor description",
    });
    const html = await render();
    expect(html).toContain("<h1>Giác hơi</h1>");
    expect(html).toContain(full.shortDescription);
  });

  it("uses reviewed defaults and bundled images during an unconfigured-CMS fallback", async () => {
    vi.resetModules();
    vi.doMock("@/sanity/env", () => ({
      projectId: "missing-project-id",
      dataset: "production",
      apiVersion: "2025-01-01",
    }));
    try {
      const fallbackPage = await import("@/app/treatments/[slug]/page");
      for (const treatment of treatments) {
        const metadata = await fallbackPage.generateMetadata({
          params: Promise.resolve({ slug: treatment.slug }),
        });
        expect(metadata).toMatchObject(new Map(Object.entries(reviewedSeo)).get(treatment.slug)!);
        if (treatment.image) {
          expect(metadata.openGraph).toMatchObject({ images: [treatment.image] });
        } else {
          expect(metadata.openGraph).not.toHaveProperty("images");
        }
      }
      expect(fetch).not.toHaveBeenCalled();
    } finally {
      vi.doUnmock("@/sanity/env");
      vi.resetModules();
    }
  });

  it("uses the CMS SEO fields and falls back to the treatment's own", async () => {
    serve({ treatments: [full, { slug: "bare", title: "Bare", shortDescription: "Short" }] });
    const seo = await generateMetadata({ params: Promise.resolve({ slug: "cupping" }) });
    expect(seo).toMatchObject({
      title: "SEO title",
      description: "SEO description",
      openGraph: { images: [`${cdn}og.jpg`] },
    });
    const plain = await generateMetadata({ params: Promise.resolve({ slug: "bare" }) });
    expect(plain).toMatchObject({ title: "Bare", description: "Short" });
    expect(plain.openGraph).not.toHaveProperty("images");
  });
});
