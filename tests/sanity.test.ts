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
import TreatmentPage from "@/app/treatments/[slug]/page";
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
      image: "/images/Iastm.jpg",
      duration: "",
    });
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
});
