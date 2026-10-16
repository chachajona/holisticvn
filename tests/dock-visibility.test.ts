import { describe, expect, it } from "vitest";
import { dockVisible } from "@/lib/dock-visibility";

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
