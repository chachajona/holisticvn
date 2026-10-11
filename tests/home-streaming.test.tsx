import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { getInstagramPosts } from "@/lib/instagram";
import { site, branches } from "@/lib/content";

vi.mock("@/lib/sanity", () => ({ getPublicSiteData: vi.fn(async () => ({ site, branches })) }));
vi.mock("@/lib/instagram", () => ({ getInstagramPosts: vi.fn() }));

describe("homepage Instagram streaming", () => {
  it("streams the hero before the optional feed resolves", async () => {
    let resolveFeed!: (value: Awaited<ReturnType<typeof getInstagramPosts>>) => void;
    const feed = new Promise<Awaited<ReturnType<typeof getInstagramPosts>>>((resolve) => {
      resolveFeed = resolve;
    });
    vi.mocked(getInstagramPosts).mockReturnValue(feed);
    let renderer: ReturnType<typeof renderToPipeableStream> | undefined;
    const output = new PassThrough();
    try {
      const element = await HomePage();
      let html = "";
      const shell = new Promise<void>((resolve) => {
        output.on("data", (chunk) => {
          html += chunk.toString();
          if (html.includes("Cải thiện sức khoẻ vận động")) resolve();
        });
      });
      renderer = renderToPipeableStream(element, {
        onShellReady() {
          renderer!.pipe(output);
        },
      });
      await shell;
      expect(html).toContain('id="main"');
      expect(html).toContain("Dịch vụ nổi bật");
      expect(html).toContain("Theo dõi hành trình hồi phục trên Instagram");
      expect(getInstagramPosts).toHaveBeenCalledTimes(1);
      const end = new Promise<void>((resolve) => output.on("end", resolve));
      resolveFeed(null);
      await end;
    } finally {
      resolveFeed(null);
      renderer?.abort();
      output.destroy();
      vi.resetAllMocks();
    }
  });
});
