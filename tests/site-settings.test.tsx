import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { z } from "zod";

const { fetch, createClient, configs } = vi.hoisted(() => {
  const fetch = vi.fn();
  // Vitest clears mock calls before each test; retain configs created during module import.
  const configs: unknown[] = [];
  return {
    fetch,
    configs,
    createClient: (config: unknown) => {
      configs.push(config);
      return { fetch };
    },
  };
});
vi.mock("@sanity/client", () => ({ createClient }));
vi.mock("@/sanity/env", () => ({
  projectId: "configured-project",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
vi.mock("next/font/local", () => ({ default: () => ({ variable: "font" }) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/contact" }));
vi.mock("@/components/gtm", () => ({ GoogleTagManager: () => null, track: vi.fn() }));

import RootLayout, { revalidate } from "@/app/layout";
import ContactPage from "@/app/contact/page";
import { HolisticFooter } from "@/components/holistic-footer";
import { ChatWidgets } from "@/components/chat-widgets";
import { SiteDataProvider } from "@/components/site-data";
import { branches, site } from "@/lib/content";
import { getPublicSiteData, getSiteSettings } from "@/lib/sanity";

const published = {
  contactPhone: "0901234567",
  contactEmail: "clinic@example.com",
  socialMedia: {
    facebook: "https://www.facebook.com/clinic/",
    instagram: "https://www.instagram.com/clinic/",
    zalo: "1234567890",
  },
  locations: [{ name: "Closed", address: "205 Nguyễn Đình Chiểu", isPrimary: true }],
};

describe("resilient shared site settings", () => {
  beforeEach(() => {
    fetch.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  it("uses published overrides while pinning the confirmed clinic and daily hours", async () => {
    fetch.mockResolvedValue(published);
    expect(await getPublicSiteData()).toEqual({
      site: {
        ...site,
        phone: published.contactPhone,
        email: published.contactEmail,
        facebookUrl: published.socialMedia.facebook,
        instagramUrl: published.socialMedia.instagram,
        zaloId: published.socialMedia.zalo,
      },
      branches,
    });
    expect(revalidate).toBe(3600);
    expect(configs).toContainEqual(expect.objectContaining({ maxRetries: 0, timeout: 5000 }));
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      {},
      {
        signal: expect.any(AbortSignal),
        next: { revalidate: 3600, tags: ["sanity"] },
      },
    );
  });

  it.each([null, undefined, [], "not settings", 42])(
    "falls back safely for a missing or invalid result (%s)",
    async (value) => {
      fetch.mockResolvedValue(value);
      expect(await getPublicSiteData()).toEqual({ site, branches });
    },
  );

  it("keeps existing field normalization for incomplete settings", async () => {
    fetch.mockResolvedValue({
      contactEmail: "invalid",
      socialMedia: { facebook: "https://evil.test/", zalo: "bad" },
    });
    expect(await getPublicSiteData()).toEqual({ site, branches });
  });

  it("logs only a safe summary for provider errors carrying private data", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = Object.assign(new Error("private provider message"), {
      name: "private error name",
      statusCode: 403,
      responseBody: "private provider body",
      response: { headers: { authorization: "private token" } },
      cause: new Error("private nested error"),
    });
    try {
      fetch.mockRejectedValue(error);
      expect(await getPublicSiteData()).toEqual({ site, branches });
      expect(log.mock.calls).toEqual([
        ["[sanity] siteSettings unavailable, using fallback:", { name: "Error", status: 403 }],
      ]);
    } finally {
      log.mockRestore();
    }
  });

  it("does not log schema issue messages or inputs", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      fetch.mockRejectedValue(
        new z.ZodError([{ code: "custom", path: [], message: "private settings data" }]),
      );
      expect(await getSiteSettings()).toBeNull();
      expect(log.mock.calls).toEqual([
        ["[sanity] siteSettings unavailable, using fallback:", { name: "ZodError" }],
      ]);
    } finally {
      log.mockRestore();
    }
  });

  it.each(["403", NaN, Infinity, 399, 600, 403.5])(
    "omits invalid HTTP status metadata (%s)",
    async (statusCode) => {
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      try {
        fetch.mockRejectedValue(Object.assign(new Error("private message"), { statusCode }));
        expect(await getSiteSettings()).toBeNull();
        expect(log.mock.calls).toEqual([
          ["[sanity] siteSettings unavailable, using fallback:", { name: "Error" }],
        ]);
      } finally {
        log.mockRestore();
      }
    },
  );

  it.each([null, undefined, "private error", { message: "private error" }])(
    "handles non-Error rejection values without logging their contents (%s)",
    async (error) => {
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      try {
        fetch.mockRejectedValue(error);
        expect(await getSiteSettings()).toBeNull();
        expect(log.mock.calls).toEqual([
          ["[sanity] siteSettings unavailable, using fallback:", { name: "UnknownError" }],
        ]);
      } finally {
        log.mockRestore();
      }
    },
  );

  it.each(["network", "401", "403", "500", "invalid JSON"])(
    "renders async consumers and approved direct channels during %s failure",
    async (failure) => {
      fetch.mockRejectedValue(new Error(failure));
      const layout = await RootLayout({ children: <main id="main" /> });
      expect(layout.type).toBe("html");
      const contact = renderToStaticMarkup(await ContactPage());
      const footer = renderToStaticMarkup(await HolisticFooter());
      const data = await getPublicSiteData();
      const chat = renderToStaticMarkup(
        <SiteDataProvider data={data}>
          <ChatWidgets />
        </SiteDataProvider>,
      );
      for (const html of [contact, footer]) {
        expect(html).toContain("082 895 9598");
        expect(html).toContain("Holisticrep9@gmail.com");
        expect(html.replaceAll("\u00a0", " ")).toContain(site.address);
        expect(html).not.toContain("205 Nguyễn Đình Chiểu");
      }
      expect(footer).toContain("09:00 — 21:00");
      expect(footer.match(/Cơ sở Xóm Chiếu/g)).toHaveLength(1);
      expect(chat).toContain('href="tel:0828959598"');
      expect(chat).toContain(`href="https://zalo.me/${site.zaloId}"`);
    },
  );

  it("settles at five seconds, aborts stalled transport and cleans the deadline", async () => {
    vi.useFakeTimers();
    fetch.mockReturnValue(new Promise(() => {}));
    let settled = false;
    const result = getPublicSiteData().then((data) => {
      settled = true;
      return data;
    });
    await vi.advanceTimersByTimeAsync(4999);
    const signal = fetch.mock.calls[0][2].signal as AbortSignal;
    expect(settled).toBe(false);
    expect(signal.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(await result).toEqual({ site, branches });
    expect(signal.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["resolve", "reject"] as const)(
    "handles late %s after timeout and allows a fresh read to recover",
    async (settlement) => {
      vi.useFakeTimers();
      let resolve!: (value: unknown) => void;
      let reject!: (reason: Error) => void;
      fetch.mockReturnValueOnce(
        new Promise((yes, no) => {
          resolve = yes;
          reject = no;
        }),
      );
      const result = getSiteSettings();
      await vi.advanceTimersByTimeAsync(5000);
      expect(await result).toBeNull();
      if (settlement === "resolve") resolve(published);
      else reject(new Error("late transport failure"));
      await vi.advanceTimersByTimeAsync(0);
      fetch.mockResolvedValueOnce(published);
      expect((await getPublicSiteData()).site.phone).toBe(published.contactPhone);
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it.each(["success", "failure"])("cleans timers after early %s", async (outcome) => {
    vi.useFakeTimers();
    if (outcome === "success") fetch.mockResolvedValue(published);
    else fetch.mockRejectedValue(new Error("unavailable"));
    await getSiteSettings();
    expect(vi.getTimerCount()).toBe(0);
    expect((fetch.mock.calls[0][2].signal as AbortSignal).aborted).toBe(false);
  });
});

describe("unconfigured CMS and approved Zalo default", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("uses approved contacts without querying an unconfigured CMS", async () => {
    vi.resetModules();
    vi.doMock("@/sanity/env", () => ({
      projectId: "missing-project-id",
      dataset: "production",
      apiVersion: "2025-01-01",
    }));
    fetch.mockClear();
    const { getPublicSiteData: read } = await import("@/lib/sanity");
    expect(await read()).toEqual({ site, branches });
    expect(fetch).not.toHaveBeenCalled();
    vi.doUnmock("@/sanity/env");
  });

  it.each([undefined, "", "998877"])("preserves configured Zalo override (%s)", async (id) => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_ZALO_ID", id);
    const { site: configured } = await import("@/lib/content");
    expect(configured.zaloId).toBe(id || "4411042584729737012");
  });
});
