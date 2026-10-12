// @vitest-environment happy-dom

import { act, type ComponentProps, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import Link from "next/link";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MethodTags, MethodsExplorer } from "@/app/treatments/methods-explorer";
import { methodAnchor, methods } from "@/lib/content";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const items = (emptyTags = false): ComponentProps<typeof MethodsExplorer>["items"] =>
  methods.map((method) => ({
    group: method.group,
    anchor: methodAnchor[method.group],
    title: method.title,
    indexSubtitle: method.indexSubtitle,
    filterTags: emptyTags ? [] : method.filterTags,
    content: (
      <div id={methodAnchor[method.group]} tabIndex={-1}>
        <h2>{method.title}</h2>
        <MethodTags ids={emptyTags ? [] : method.filterTags} />
      </div>
    ),
  }));

describe("interactive methods explorer", () => {
  let container: HTMLDivElement, root: Root;
  const render = async (emptyTags = false) => {
    await act(async () => {
      root.render(
        <>
          <MethodsExplorer items={items(emptyTags)} />
          <footer>
            <Link href="/treatments#mtd-cold">Ngâm lạnh</Link>
          </footer>
        </>,
      );
    });
  };
  const click = async (selector: string) => {
    const node = container.querySelector<HTMLElement>(selector)!;
    await act(async () => {
      node.focus();
      node.click();
    });
  };
  const visible = () =>
    methods
      .filter(
        (method) =>
          !container.querySelector(`#${methodAnchor[method.group]}`)!.parentElement!.hidden,
      )
      .map((method) => method.group);

  beforeEach(async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.spyOn(HTMLElement.prototype, "scrollIntoView").mockImplementation(() => {});
    window.history.replaceState(null, "", "/treatments#mtd-cold");
    // Happy DOM emits a synthetic hashchange for replaceState; drain it before mounting listeners.
    await new Promise<void>((resolve) => window.setTimeout(resolve));
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await render();
  });
  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("changes sections, pressed controls and counts with OR selections, then toggles and clears", async () => {
    await click("#method-filter-strength");
    expect(visible()).toEqual(["rehab"]);
    expect(container.querySelector('[role="status"]')!.textContent).toContain("1 phương pháp");
    expect(container.querySelector('#mtd-rehab button[aria-pressed="true"]')!.textContent).toBe(
      "Tăng sức mạnh",
    );
    await click("#method-filter-neck-pain");
    expect(visible()).toEqual(["manual", "rehab"]);
    await click("#method-filter-neck-pain");
    expect(visible()).toEqual(["rehab"]);
    await click('[class*="filterResult"] button');
    expect(visible()).toHaveLength(5);
    expect(container.querySelectorAll('button[aria-pressed="true"]')).toHaveLength(0);
  });

  it("recovers the same-hash index and footer targets from hidden content", async () => {
    for (const selector of ['nav[aria-label="Các phương pháp"] a[href="#mtd-cold"]', "footer a"]) {
      await click("#method-filter-strength");
      expect(visible()).toEqual(["rehab"]);
      await click(selector);
      expect(visible()).toHaveLength(5);
      await vi.waitFor(() => expect(document.activeElement?.id).toBe("mtd-cold"));
    }
  });

  it("returns focus to a persistent filter when deselection hides its own section", async () => {
    await click("#method-filter-strength");
    await click("#method-filter-post-workout-recovery");
    const button = [...container.querySelectorAll<HTMLButtonElement>("#mtd-rehab button")].find(
      (button) => button.textContent === "Tăng sức mạnh",
    )!;
    await act(async () => {
      button.focus();
      button.click();
    });
    expect(visible()).toEqual(["cold"]);
    expect(document.activeElement?.id).toBe("method-filter-strength");
  });

  it("clears stale selections after content refresh without losing keyboard focus", async () => {
    await click("#method-filter-strength");
    await render(true);
    expect(container.querySelector('[role="status"]')!.textContent).toContain("0 phương pháp");
    await click('[class*="emptyResults"] button');
    expect(visible()).toHaveLength(5);
    expect(document.activeElement?.id).toBe("method-filter-heading");
  });

  it("keeps sparse CMS content readable without inviting unavailable selections", async () => {
    await render(true);
    expect(visible()).toHaveLength(5);
    expect(container.querySelectorAll("fieldset button")).toHaveLength(0);
    expect(container.querySelector("#method-filter-heading")!.textContent).toBe(
      "Khám phá các phương pháp tại Holistic",
    );
    expect(container.querySelector('[class*="filterResult"] button')).toBeNull();
  });

  it("server-renders readable groups with controls disabled until hydration", () => {
    const server = document.createElement("div");
    server.innerHTML = renderToStaticMarkup(<MethodsExplorer items={items()} />);
    const buttons = [...server.querySelectorAll<HTMLButtonElement>("fieldset button")];
    expect(buttons).toHaveLength(9);
    expect(buttons.every((button) => button.disabled)).toBe(true);
    for (const method of methods)
      expect(server.querySelector(`#${methodAnchor[method.group]}`)!.parentElement!.hidden).toBe(
        false,
      );
  });
});
