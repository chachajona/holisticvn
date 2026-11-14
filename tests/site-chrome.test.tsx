// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";
import { SiteChrome } from "@/components/site-chrome";
import { consentKey } from "@/lib/consent";

vi.mock("next/navigation", () => ({ usePathname: vi.fn(() => "/") }));
vi.mock("@/components/holistic-nav", () => ({
  HolisticNav: () => <nav aria-label="Site navigation" />,
}));
vi.mock("@/components/chat-widgets", () => ({
  ChatWidgets: () => <div aria-label="Kênh tư vấn nhanh" />,
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLElement;
let root: Root;
beforeEach(() => {
  document.cookie = `${consentKey}=; path=/; max-age=0`;
  window.dataLayer = [];
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(140);
  host = document.body.appendChild(document.createElement("div"));
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const navigate = (path: string) => {
  vi.mocked(usePathname).mockReturnValue(path);
  act(() =>
    root.render(
      <SiteChrome footer={<footer>Footer</footer>}>
        <main>Page</main>
      </SiteChrome>,
    ),
  );
};

describe("route-specific services chrome", () => {
  it.each(["accepted", "rejected"] as const)(
    "keeps saved %s consent quiet across services and other routes",
    (choice) => {
      document.cookie = `${consentKey}=${choice}; path=/`;
      for (const path of ["/services", "/contact", "/services"]) {
        navigate(path);
        expect(host.querySelector(".cookie")).toBeNull();
        expect(document.documentElement.style.getPropertyValue("--cookie-h")).toBe("");
        expect(host.querySelector('[aria-label="Kênh tư vấn nhanh"]') !== null).toBe(
          path !== "/services",
        );
      }
    },
  );

  it("switches from floating chrome to one inline banner and restores defaults on other routes", () => {
    for (const path of [
      "/",
      "/contact",
      "/booking",
      "/treatments",
      "/treatments/cupping",
      "/services-other",
    ]) {
      navigate(path);
      expect(host.querySelectorAll(".cookie")).toHaveLength(1);
      expect(host.querySelector(".cookie")?.getAttribute("data-layout")).toBe("floating");
      expect(host.querySelector('[aria-label="Kênh tư vấn nhanh"]')).not.toBeNull();
      expect(document.documentElement.style.getPropertyValue("--cookie-h")).toBe("140px");
      navigate("/services");
      expect(host.querySelectorAll(".cookie")).toHaveLength(1);
      expect(host.querySelector("nav + .cookie + .page main")).not.toBeNull();
      expect(host.querySelector(".cookie")?.getAttribute("data-layout")).toBe("inline");
      expect(host.querySelector('[aria-label="Kênh tư vấn nhanh"]')).toBeNull();
      expect(document.documentElement.style.getPropertyValue("--cookie-h")).toBe("");
    }
  });

  it("shows no marketing chrome in Studio and cleans up a preceding fixed banner", () => {
    navigate("/contact");
    navigate("/studio/content");
    expect(host.textContent).toBe("Page");
    expect(host.querySelector("nav, footer, aside")).toBeNull();
    expect(document.documentElement.style.getPropertyValue("--cookie-h")).toBe("");
  });
});
