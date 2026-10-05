import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/sanity", () => ({ getPosts: vi.fn(), getTreatments: vi.fn() }));
import { revalidatePath } from "next/cache";
import { getPosts, getTreatments } from "@/lib/sanity";
import sitemap from "@/app/sitemap";
import { POST } from "@/app/api/revalidate/route";
import { generateMetadata } from "@/app/[policy]/page";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});
describe("publishing routes", () => {
  it("lists published CMS slugs instead of sample content", async () => {
    vi.mocked(getPosts).mockResolvedValue([{ slug: "cms-post" }] as never);
    vi.mocked(getTreatments).mockResolvedValue([{ slug: "cms-treatment" }] as never);
    const urls = (await sitemap()).map(({ url }) => url);
    expect(urls.some((url) => url.endsWith("/blog/cms-post"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/treatments/cms-treatment"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/treatments/dry-needling"))).toBe(false);
  });
  it("revalidates detail pages, shared settings and sitemap after authenticated webhooks", async () => {
    vi.stubEnv("SANITY_REVALIDATE_SECRET", "test-secret");
    const response = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: { "x-sanity-secret": "test-secret" },
      }),
    );
    expect(response.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
  });
  it("rejects unauthenticated revalidation", async () => {
    vi.stubEnv("SANITY_REVALIDATE_SECRET", "test-secret");
    expect(
      (await POST(new Request("http://localhost/api/revalidate", { method: "POST" }))).status,
    ).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
  it.each(["privacy-policy", "terms-conditions", "cookie-policy"])(
    "adds distinct policy metadata for %s",
    async (policy) => {
      const metadata = await generateMetadata({ params: Promise.resolve({ policy }) });
      expect(metadata.title).toBeTruthy();
      expect(metadata.alternates?.canonical).toContain(`/${policy}`);
      expect(metadata.description).toBeTruthy();
    },
  );
});
