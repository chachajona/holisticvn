import { describe, expect, it } from "vitest";
import { dockVisible, nextDockState } from "@/lib/dock-visibility";

const view = 800;

describe("dockVisible", () => {
  it("stays hidden while the marker is still on screen", () => {
    expect(dockVisible({ markerBottom: 120, panelTop: 3000, viewportHeight: view })).toBe(false);
    expect(dockVisible({ markerBottom: 0, panelTop: 3000, viewportHeight: view })).toBe(false);
  });

  it("shows once the marker has scrolled above the viewport", () => {
    expect(dockVisible({ markerBottom: -1, panelTop: 3000, viewportHeight: view })).toBe(true);
  });

  it("hides again as the form panel comes into reach", () => {
    expect(dockVisible({ markerBottom: -400, panelTop: view - 40, viewportHeight: view })).toBe(
      false,
    );
    expect(dockVisible({ markerBottom: -400, panelTop: view - 39, viewportHeight: view })).toBe(
      true,
    );
    expect(dockVisible({ markerBottom: -4000, panelTop: -200, viewportHeight: view })).toBe(false);
  });
});

describe("nextDockState", () => {
  const step = (reached: boolean, markerBottom: number, panelTop: number) =>
    nextDockState({ reached, markerBottom, panelTop, viewportHeight: view });

  it("matches dockVisible while the form has not been reached", () => {
    expect(step(false, 120, 3000)).toEqual({ reached: false, visible: false });
    expect(step(false, -1, 3000)).toEqual({ reached: false, visible: true });
  });

  it("stays hidden after the form was reached, even when scrolling back up", () => {
    let state = step(false, -400, 3000);
    expect(state.visible).toBe(true);
    state = step(state.reached, -400, view - 40);
    expect(state).toEqual({ reached: true, visible: false });
    state = step(state.reached, -400, 3000);
    expect(state).toEqual({ reached: true, visible: false });
    state = step(state.reached, 200, 3500);
    expect(state).toEqual({ reached: true, visible: false });
  });

  it("counts a page that loads already scrolled past the form as reached", () => {
    expect(step(false, -4000, -200)).toEqual({ reached: true, visible: false });
  });
});
