// @vitest-environment happy-dom

import { act, type ComponentProps, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import Link from "next/link";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MethodArticle, MethodTags, MethodsExplorer } from "@/app/treatments/methods-explorer";
import { CtaGarland } from "@/app/treatments/cta-garland";
import { ScrollThread } from "@/app/treatments/scroll-thread";
import { methodAnchor, methodStages, methods } from "@/lib/content";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const items: ComponentProps<typeof MethodsExplorer>["items"] = methods.map((method) => ({
  group: method.group,
  stage: methodStages.find((stage) => (stage.groups as readonly string[]).includes(method.group))!
    .id,
  anchor: methodAnchor[method.group],
  filterTags: method.filterTags,
  content: (
    <MethodArticle
      id={methodAnchor[method.group]}
      title={method.title}
      media={<div />}
      head={<h3>{method.title}</h3>}
    >
      <p>{method.body}</p>
      <MethodTags ids={method.filterTags} />
      {method.treatments.map((treatment) => (
        <Link key={treatment.slug} href={`/treatments/${treatment.slug}`}>
          {treatment.title}
        </Link>
      ))}
    </MethodArticle>
  ),
}));

let container: HTMLDivElement;
let root: Root;
const render = async (element: ReactNode) => {
  await act(async () => root.render(element));
};
const click = async (node: HTMLElement) => {
  await act(async () => {
    node.focus();
    node.click();
  });
};
const select = async (category: "condition" | "goal", value: string) => {
  const node = container.querySelector<HTMLSelectElement>(`#method-filter-${category}`)!;
  await act(async () => {
    node.value = value;
    node.dispatchEvent(new Event("change", { bubbles: true }));
  });
};
const toggle = (anchor: string) =>
  container.querySelector<HTMLButtonElement>(`#${anchor} button[aria-expanded]`)!;
const pill = (anchor: string, label: string) =>
  [...container.querySelectorAll<HTMLButtonElement>(`#${anchor} button[aria-pressed]`)].find(
    (button) => button.textContent === label,
  )!;
const visible = () =>
  methods
    .filter(
      (method) => !container.querySelector(`#${methodAnchor[method.group]}`)!.parentElement!.hidden,
    )
    .map((method) => method.group);
const explorer = () => (
  <>
    <nav aria-label="Lộ trình">
      <a href="#mtd-cold">Hồi phục</a>
    </nav>
    <MethodsExplorer items={items} stages={methodStages.map(({ id, title }) => ({ id, title }))} />
    <footer>
      <Link href="/treatments#mtd-cold">Ngâm lạnh</Link>
      <Link href="/treatments#mtd-manual">Trị liệu thủ công</Link>
    </footer>
  </>
);

beforeEach(async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.spyOn(HTMLElement.prototype, "scrollIntoView").mockImplementation(() => {});
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  window.history.replaceState(null, "", "/treatments");
  // Drain Happy DOM's synthetic history hash event before installing component listeners.
  await new Promise<void>((resolve) => window.setTimeout(resolve));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("interactive methods explorer", () => {
  it("reopens a manually closed row on every hero and footer fragment visit, then allows closure", async () => {
    await render(explorer());
    await click(toggle("mtd-cold"));
    await click(toggle("mtd-cold"));
    expect(toggle("mtd-cold").getAttribute("aria-expanded")).toBe("false");

    for (const selector of ["nav a", "footer a", "nav a", "footer a"]) {
      await click(container.querySelector<HTMLElement>(selector)!);
      expect(toggle("mtd-cold").getAttribute("aria-expanded")).toBe("true");
      expect(document.activeElement?.id).toBe("mtd-cold");
      expect(window.location.hash).toBe("#mtd-cold");
      await click(toggle("mtd-cold"));
      expect(toggle("mtd-cold").getAttribute("aria-expanded")).toBe("false");
    }
  });

  it("reveals an initial fragment and a later hashchange, even after manual closure", async () => {
    window.history.replaceState(null, "", "/treatments#mtd-cold");
    await new Promise<void>((resolve) => window.setTimeout(resolve));
    await render(explorer());
    expect(toggle("mtd-cold").getAttribute("aria-expanded")).toBe("true");
    await click(toggle("mtd-cold"));
    await act(async () => window.dispatchEvent(new Event("hashchange")));
    expect(toggle("mtd-cold").getAttribute("aria-expanded")).toBe("true");
  });

  it("keeps another row's manual closure when a fragment reveals its target", async () => {
    await render(explorer());
    await click(toggle("mtd-manual"));
    await click(toggle("mtd-manual"));
    await click(container.querySelector<HTMLElement>("nav a")!);
    expect(toggle("mtd-manual").getAttribute("aria-expanded")).toBe("false");
    expect(toggle("mtd-cold").getAttribute("aria-expanded")).toBe("true");
  });

  it("uses one condition and one goal with OR matching, then restores closed defaults when both clear", async () => {
    await render(explorer());
    await select("condition", "neck-pain");
    expect(visible()).toEqual(["manual"]);
    await select("goal", "strength");
    expect(visible()).toEqual(["manual", "rehab"]);
    expect(container.querySelector('[role="status"]')!.textContent).toBe("2 phương pháp");
    await select("condition", "");
    expect(visible()).toEqual(["rehab"]);
    await select("goal", "");
    expect(visible()).toHaveLength(5);
    expect(container.querySelectorAll('[aria-pressed="true"]')).toHaveLength(0);
    expect(container.querySelectorAll('[aria-expanded="true"]')).toHaveLength(0);
    expect(container.querySelector('[role="status"]')!.textContent).toBe(
      "Đang hiển thị 5 phương pháp",
    );
  });

  it("keeps focus on the final deselected pill when every method becomes visible", async () => {
    await render(explorer());
    await select("goal", "strength");
    const button = pill("mtd-rehab", "Tăng sức mạnh");
    await click(button);
    expect(visible()).toHaveLength(5);
    expect(document.activeElement).toBe(button);
    expect(button.getAttribute("aria-pressed")).toBe("false");
  });

  it.each([false, true])(
    "keeps mobile focus visible when the last pill clears (manually open: %s)",
    async (manuallyOpen) => {
      vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
        matches: query === "(max-width: 700px)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      const frames: FrameRequestCallback[] = [];
      vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
        frames.push(callback);
        return frames.length;
      });
      await render(explorer());
      if (manuallyOpen) await click(toggle("mtd-rehab"));
      await select("goal", "strength");
      const button = pill("mtd-rehab", "Tăng sức mạnh");
      await click(button);
      await act(async () => frames.splice(0).forEach((callback) => callback(0)));
      expect(visible()).toHaveLength(5);
      expect(toggle("mtd-rehab").getAttribute("aria-expanded")).toBe(String(manuallyOpen));
      expect(document.activeElement).toBe(
        manuallyOpen ? button : container.querySelector("#method-filter-goal"),
      );
    },
  );

  it("moves focus to the corresponding select only when deselection hides that method", async () => {
    await render(explorer());
    await select("condition", "neck-pain");
    await select("goal", "post-workout-recovery");
    await click(pill("mtd-manual", "Đau mỏi cổ vai gáy"));
    expect(visible()).toEqual(["cold"]);
    expect(document.activeElement?.id).toBe("method-filter-condition");
  });

  it("returns focus from an unmounted clear button to its persistent select", async () => {
    await render(explorer());
    await select("goal", "strength");
    await click(
      container.querySelector<HTMLButtonElement>('button[aria-label="Bỏ tăng sức mạnh"]')!,
    );
    expect(visible()).toHaveLength(5);
    expect(document.activeElement?.id).toBe("method-filter-goal");
    expect(container.querySelectorAll('[aria-expanded="true"]')).toHaveLength(0);
  });

  it("clears filters and preserves every treatment link when a hidden fragment is requested", async () => {
    await render(explorer());
    await select("goal", "strength");
    await click(container.querySelector<HTMLElement>("footer a")!);
    expect(visible()).toHaveLength(5);
    expect(container.querySelector<HTMLSelectElement>("#method-filter-goal")!.value).toBe("");
    expect(toggle("mtd-cold").getAttribute("aria-expanded")).toBe("true");
    for (const method of methods)
      for (const treatment of method.treatments)
        expect(container.querySelector(`a[href="/treatments/${treatment.slug}"]`)).not.toBeNull();
  });

  it("server-renders every description and link without enabling hidden thread dots", () => {
    const html = renderToStaticMarkup(explorer());
    expect(html).not.toContain("data-thread-ready");
    for (const method of methods) {
      expect(html).toContain(method.body);
      for (const treatment of method.treatments)
        expect(html).toContain(`href="/treatments/${treatment.slug}"`);
    }
  });

  it("removes thread readiness and restores the static fallback on teardown", async () => {
    const host = document.createElement("div");
    container.append(host);
    const threadRoot = createRoot(host);
    await act(async () => threadRoot.render(<ScrollThread />));
    expect(host.hasAttribute("data-thread-ready")).toBe(true);
    await act(async () => threadRoot.unmount());
    expect(host.hasAttribute("data-thread-ready")).toBe(false);
  });
});

describe("CTA garland capabilities", () => {
  const observe = vi.fn();
  const disconnect = vi.fn();
  let notifyIntersection: (intersecting: boolean) => void;
  const setup = (fineHover: boolean, reduced: boolean) => {
    const media = (query: string, matches: boolean) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    const pointer = media("(any-hover: hover) and (any-pointer: fine)", fineHover);
    const motion = media("(prefers-reduced-motion: reduce)", reduced);
    vi.spyOn(window, "matchMedia").mockImplementation((query) =>
      query.includes("any-hover") ? pointer : motion,
    );
    observe.mockClear();
    disconnect.mockClear();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          notifyIntersection = (intersecting) =>
            callback(
              [
                {
                  isIntersecting: intersecting,
                  intersectionRatio: intersecting ? 1 : 0,
                } as IntersectionObserverEntry,
              ],
              this as unknown as IntersectionObserver,
            );
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    return { pointer, motion };
  };
  const card = () => (
    <div>
      <CtaGarland />
      <Link href="/booking">Đặt lịch</Link>
    </div>
  );
  const count = () => container.querySelectorAll("[data-item]").length;
  const pointerEnter = async (pointerType: string) => {
    await act(async () =>
      container
        .querySelector("a")!
        .dispatchEvent(new PointerEvent("pointerenter", { pointerType })),
    );
  };

  it.each([
    [false, false, "touch-only"],
    [true, true, "reduced-motion"],
  ])("keeps the finished initial garland for %s/%s (%s)", async (fineHover, reduced) => {
    setup(fineHover, reduced);
    await render(card());
    expect(observe).not.toHaveBeenCalled();
    expect(container.querySelector("svg")!.hasAttribute("data-paint")).toBe(false);
    await pointerEnter("touch");
    await pointerEnter("mouse");
    expect(count()).toBe(8);
  });

  it("ignores hybrid touch events while preserving mouse hover and visible keyboard focus", async () => {
    setup(true, false);
    await render(card());
    expect(window.matchMedia).toHaveBeenCalledWith("(any-hover: hover) and (any-pointer: fine)");
    notifyIntersection(true); // Already visible at load: keep the finished presentation.
    await pointerEnter("touch");
    expect(count()).toBe(8);
    await pointerEnter("mouse");
    expect(count()).toBe(9);
    const link = container.querySelector("a")!;
    const matches = link.matches.bind(link);
    vi.spyOn(link, "matches").mockImplementation((selector) =>
      selector === ":focus-visible" ? true : matches(selector),
    );
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 1000);
    await act(async () => link.dispatchEvent(new FocusEvent("focus")));
    expect(count()).toBe(10);
  });

  it.each(["pointer", "motion"] as const)(
    "allows later mouse and keyboard growth when the initial %s capability changes",
    async (capability) => {
      const { pointer, motion } = setup(capability !== "pointer", capability === "motion");
      await render(card());
      expect(observe).not.toHaveBeenCalled();
      await pointerEnter("mouse");
      expect(count()).toBe(8);
      pointer.matches = true;
      motion.matches = false;
      await pointerEnter("touch");
      expect(count()).toBe(8);
      await pointerEnter("mouse");
      expect(count()).toBe(9);
      const link = container.querySelector("a")!;
      vi.spyOn(link, "matches").mockReturnValue(true);
      vi.spyOn(Date, "now").mockReturnValue(Date.now() + 1000);
      await act(async () => link.dispatchEvent(new FocusEvent("focus")));
      expect(count()).toBe(10);
      expect(container.querySelector("svg")!.hasAttribute("data-paint")).toBe(false);
    },
  );

  it("draws only after scrolling into view and cancels its completion timer on teardown", async () => {
    setup(true, false);
    vi.useFakeTimers();
    await render(card());
    notifyIntersection(false);
    const svg = container.querySelector("svg")!;
    expect(svg.dataset.paint).toBe("pending");
    notifyIntersection(true);
    expect(svg.dataset.paint).toBe("painting");
    await pointerEnter("mouse");
    expect(count()).toBe(8);
    await render(null);
    expect(disconnect).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(3200);
    expect(svg.dataset.paint).toBe("painting");
  });
});
