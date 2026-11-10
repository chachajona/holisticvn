// @vitest-environment happy-dom

import { act } from "react";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CookieConsent, CookiePreferencesButton } from "@/components/cookie-consent";
import { GoogleTagManager, PageViewTracker, track } from "@/components/gtm";
import {
  clearAnalyticsCookies,
  consentKey,
  hasAnalyticsConsent,
  resetConsent,
  writeConsent,
} from "@/lib/consent";
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
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("consent across cookie scopes", () => {
  let browser: Window;

  beforeEach(() => {
    browser = new Window({ url: "https://www.holisticvn.com/" });
    vi.stubGlobal("document", browser.document);
    vi.stubGlobal("location", browser.location);
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID", "GTM-TEST123");
  });

  afterEach(() => browser.happyDOM.close());

  const runGtm = () => {
    document.head.appendChild(document.createElement("script"));
    runInNewContext(GoogleTagManager()!.props.children, { document, window });
    return document.querySelector('script[src^="https://www.googletagmanager.com/gtm.js"]');
  };

  it.each(["accepted", "rejected"] as const)(
    "blocks both tracking gates when root consent is %s and a narrower path conflicts",
    (rootChoice) => {
      const staleChoice = rootChoice === "accepted" ? "rejected" : "accepted";
      document.cookie = `${consentKey}=${staleChoice}; path=/services`;
      writeConsent(rootChoice);
      browser.location.pathname = "/services";
      expect(document.cookie).toContain(`${consentKey}=accepted`);
      expect(document.cookie).toContain(`${consentKey}=rejected`);

      expect.soft(hasAnalyticsConsent()).toBe(false);
      track("contact_submit");
      expect.soft(window.dataLayer).toEqual([]);
      expect.soft(runGtm()).toBeNull();
      expect(window.dataLayer).toEqual([]);
    },
  );

  it.each([undefined, "rejected", "accepted"] as const)(
    "loads GTM only with unopposed acceptance (%s)",
    (choice) => {
      if (choice) writeConsent(choice);
      expect(Boolean(runGtm())).toBe(choice === "accepted");
      expect(window.dataLayer?.length).toBe(choice === "accepted" ? 1 : 0);
    },
  );

  it("withdrawal removes acceptance stored at a narrower path", () => {
    document.cookie = `${consentKey}=accepted; path=/services`;
    browser.location.pathname = "/services/botox";
    expect(hasAnalyticsConsent()).toBe(true);
    resetConsent();
    expect(document.cookie).not.toContain(consentKey);
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("reloads on navigation when a path-scoped rejection appears while GTM runs", () => {
    const reloadSpy = vi.spyOn(browser.location, "reload").mockImplementation(() => {});
    writeConsent("accepted");
    runGtm();
    document.cookie = `${consentKey}=rejected; path=/services`;
    browser.location.pathname = "/services";
    vi.mocked(usePathname).mockReturnValue("/");
    act(() => root.render(<PageViewTracker />));
    vi.mocked(usePathname).mockReturnValue("/services");
    act(() => root.render(<PageViewTracker />));
    expect(reloadSpy).toHaveBeenCalledOnce();
    expect(window.dataLayer?.some((e) => e.event === "page_view")).toBe(false);
  });

  it("withdraws host and parent-domain Google cookies while preserving unrelated cookies", () => {
    writeConsent("accepted");
    document.cookie = "_ga=host-id; path=/";
    document.cookie = "_ga=parent-id; path=/; domain=holisticvn.com";
    document.cookie = "_ga_HOST=host-domain-id; path=/; domain=www.holisticvn.com";
    document.cookie = "_gid=parent-id; path=/; domain=holisticvn.com";
    document.cookie = "other=host-value; path=/";
    document.cookie = "parent_other=parent-value; path=/; domain=holisticvn.com";
    expect(document.cookie.split("; ").filter((cookie) => cookie.startsWith("_ga="))).toHaveLength(
      2,
    );

    resetConsent();

    expect(document.cookie.split("; ").sort()).toEqual([
      "other=host-value",
      "parent_other=parent-value",
    ]);
    expect(hasAnalyticsConsent()).toBe(false);
  });
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

  it("states the purpose in one sentence and gives Reject and Accept the same style", () => {
    act(() => root.render(<CookieConsent />));
    const text = host.querySelector("p")!.textContent!;
    expect(text).toContain("cookie phân tích để cải thiện website, chỉ khi bạn đồng ý");
    expect(host.querySelector("a")!.getAttribute("href")).toBe("/cookie-policy");
    const [reject, accept] = buttons();
    expect(reject.textContent).toBe("Từ chối");
    expect(accept.textContent).toBe("Chấp nhận");
    expect(reject.className).toBe(accept.className);
  });

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
