// @vitest-environment happy-dom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { TreatmentDock } from "@/app/treatments/[slug]/treatment-dock";

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

it("hides when a disclosure changes page height without scroll or window resize", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const callbacks = new Map<Element, ResizeObserverCallback>();
  const disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(private callback: ResizeObserverCallback) {}
      observe(target: Element) {
        callbacks.set(target, this.callback);
      }
      disconnect = disconnect;
    },
  );
  const frames: FrameRequestCallback[] = [];
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => frames.push(callback));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  document.body.innerHTML =
    '<main><div id="facts"></div><section id="yeu-cau"></section><div id="dock-host"></div></main>';
  const main = document.querySelector("main")!;
  const marker = document.getElementById("facts")!;
  const panel = document.getElementById("yeu-cau")!;
  let panelTop = window.innerHeight + 200;
  marker.getBoundingClientRect = () => new DOMRect(0, -100, 100, 50);
  panel.getBoundingClientRect = () => new DOMRect(0, panelTop, 100, 500);
  const root = createRoot(document.getElementById("dock-host")!);
  const flush = async () =>
    act(async () => {
      for (const callback of frames.splice(0)) callback(0);
    });
  try {
    await act(async () => root.render(<TreatmentDock markerId="facts" title="Giác hơi" />));
    const dock = document.querySelector("aside")!;
    expect(dock.hasAttribute("inert")).toBe(false);
    expect(callbacks.has(main)).toBe(true);
    const resize = callbacks.get(main)!;
    panelTop = window.innerHeight - 100;
    resize([], {} as ResizeObserver);
    await flush();
    expect(dock.hasAttribute("inert")).toBe(true);
    panelTop = window.innerHeight + 200;
    resize([], {} as ResizeObserver);
    await flush();
    expect(dock.hasAttribute("inert")).toBe(true);
  } finally {
    await act(async () => root.unmount());
  }
  expect(disconnect).toHaveBeenCalled();
});
