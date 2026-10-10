import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { methodAnchor, serviceAnchor } from "@/lib/content";

describe("homepage copy", () => {
  it("does not hard-code how many method or service groups the site has", () => {
    for (const file of ["app/page.tsx", "app/services/page.tsx", "app/treatments/page.tsx"]) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(
        /\b(\d+|ba|bốn|năm) nhóm (phương pháp|kỹ thuật|dịch vụ)/i,
      );
    }
  });

  it("has no unconfirmed offer or medical claims", () => {
    const home = readFileSync("app/page.tsx", "utf8");
    for (const claim of ["60 phút", "12 buổi", "miễn dịch", "THOÁT VỊ"]) {
      expect(home).not.toContain(claim);
    }
  });

  it("links only to anchors that /services and /treatments define", () => {
    const home = readFileSync("app/page.tsx", "utf8");
    const known = new Set<string>([
      ...Object.values(serviceAnchor),
      ...Object.values(methodAnchor),
    ]);
    const anchors = [...home.matchAll(/["`]\/(?:services|treatments)#([\w-]+)/g)].map((m) => m[1]);
    expect(anchors.length).toBeGreaterThan(0);
    for (const anchor of anchors) expect(known, anchor).toContain(anchor);
  });
});
