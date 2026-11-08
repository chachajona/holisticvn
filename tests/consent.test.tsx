// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CookieConsent, CookiePreferencesButton } from "@/components/cookie-consent";
import { PageViewTracker, track } from "@/components/gtm";
import { clearAnalyticsCookies, consentKey, hasAnalyticsConsent } from "@/lib/consent";
import { usePathname } from "next/navigation";

vi.mock("next/navigation", () => ({ usePathname: vi.fn(() => "/") }));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const clearAll = () =>
  document.cookie.split("; ").forEach((c) => {
    document.cookie = `${c.split("=")[0]}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
const reload = vi.fn();
let root: Root;
let host: HTMLElement;

beforeEach(() => {
  clearAll();
  window.dataLayer = [];
  reload.mockClear();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: Object.assign(new URL("http://localhost/"), { reload }),
  });
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  host = document.body.appendChild(document.createElement("div"));
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
});

describe("analytics consent gating", () => {
  it.each([[undefined], ["rejected"]])("pushes nothing without consent (%s)", (value) => {
    if (value) document.cookie = `${consentKey}=${value}; path=/`;
    track("contact_submit");
    expect(window.dataLayer).toEqual([]);
  });

  it("pushes only after acceptance and carries no personal fields", () => {
    document.cookie = `${consentKey}=accepted; path=/`;
    track("contact_submit", { source: "home-hero" });
    expect(window.dataLayer).toEqual([{ event: "contact_submit", source: "home-hero" }]);
  });

  it("stops pushing once the choice is withdrawn", () => {
    document.cookie = `${consentKey}=accepted; path=/`;
    expect(hasAnalyticsConsent()).toBe(true);
    document.cookie = `${consentKey}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    track("chat_click");
    expect(window.dataLayer).toEqual([]);
  });
});

describe("page views on client navigation", () => {
  const render = () => act(() => root.render(<PageViewTracker />));

  it("skips the initial load and pushes each later route once, only with consent", () => {
    document.cookie = `${consentKey}=accepted; path=/`;
    vi.mocked(usePathname).mockReturnValue("/");
    render();
    expect(window.dataLayer).toEqual([]);
    vi.mocked(usePathname).mockReturnValue("/services");
    render();
    render();
    expect(window.dataLayer).toEqual([{ event: "page_view", page_path: "/services" }]);
  });

  it("pushes nothing for navigation after rejection", () => {
    document.cookie = `${consentKey}=rejected; path=/`;
    vi.mocked(usePathname).mockReturnValue("/");
    render();
    vi.mocked(usePathname).mockReturnValue("/booking");
    render();
    expect(window.dataLayer).toEqual([]);
  });
});

describe("cookie banner", () => {
  const buttons = () => [...host.querySelectorAll("button")];

  it("records a rejection, clears Google IDs and reloads", () => {
    document.cookie = "_ga=GA1.1.1; path=/";
    document.cookie = "_ga_ABC=GS1; path=/";
    act(() => root.render(<CookieConsent />));
    act(() =>
      buttons()
        .find((b) => b.textContent === "Từ chối")!
        .click(),
    );
    expect(document.cookie).toContain(`${consentKey}=rejected`);
    expect(document.cookie).not.toContain("_ga");
    expect(reload).toHaveBeenCalledOnce();
  });

  it("records acceptance and reloads so GTM loads", () => {
    act(() => root.render(<CookieConsent />));
    act(() =>
      buttons()
        .find((b) => b.textContent === "Chấp nhận")!
        .click(),
    );
    expect(hasAnalyticsConsent()).toBe(true);
    expect(reload).toHaveBeenCalledOnce();
  });

  it("stays quiet when a choice is already saved", () => {
    document.cookie = `${consentKey}=accepted; path=/`;
    act(() => root.render(<CookieConsent />));
    expect(host.querySelector("aside")).toBeNull();
  });

  it("footer control withdraws consent and Google cookies, then reloads to ask again", () => {
    document.cookie = `${consentKey}=accepted; path=/`;
    document.cookie = "_ga=GA1.1.1; path=/";
    act(() => root.render(<CookiePreferencesButton />));
    act(() => host.querySelector("button")!.click());
    expect(document.cookie).toBe("");
    expect(window.location.hash).toBe("#cookie-preferences");
    expect(reload).toHaveBeenCalledOnce();
  });

  it("focuses the first choice when opened from the footer control", () => {
    window.location.hash = "#cookie-preferences";
    vi.spyOn(history, "replaceState").mockImplementation(() => {});
    act(() => root.render(<CookieConsent />));
    expect(document.activeElement).toBe(buttons()[0]);
  });

  it("hides for this page view without reloading when cookies are blocked", () => {
    const read = vi.spyOn(document, "cookie", "get").mockReturnValue("");
    const write = vi.spyOn(document, "cookie", "set").mockImplementation(() => {});
    try {
      act(() => root.render(<CookieConsent />));
      act(() =>
        buttons()
          .find((b) => b.textContent === "Chấp nhận")!
          .click(),
      );
      expect(reload).not.toHaveBeenCalled();
      expect(host.querySelector("aside")).toBeNull();
    } finally {
      read.mockRestore();
      write.mockRestore();
    }
  });
});

describe("clearAnalyticsCookies", () => {
  it("removes _ga, _gid and _ga_* but keeps unrelated cookies", () => {
    document.cookie = "_ga=1; path=/";
    document.cookie = "_gid=1; path=/";
    document.cookie = "_ga_XYZ=1; path=/";
    document.cookie = "other=1; path=/";
    clearAnalyticsCookies();
    expect(document.cookie).toBe("other=1");
  });
});
