import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { footerMethods, footerServices, methodAnchor, serviceAnchor } from "@/lib/content";

// The pages and the footer share one set of anchor constants; these checks make sure the footer
// links are built from them and that each page still uses them as its section ids.
describe("footer links", () => {
  it.each([
    ["app/services/page.tsx", "serviceAnchor", "/services", serviceAnchor, footerServices],
    ["app/treatments/page.tsx", "methodAnchor", "/treatments", methodAnchor, footerMethods],
  ] as const)("%s sections match the footer links", (file, name, path, anchors, links) => {
    const source = readFileSync(file, "utf8");
    const hrefs = links.map(([, href]) => href);
    for (const [key, id] of Object.entries(anchors)) {
      expect(hrefs, id).toContain(`${path}#${id}`);
      // Services sections are keyed by CMS group (see tests/services-fallback.test.ts for ids).
      if (name === "methodAnchor") {
        expect(source, `${file} uses ${name}.${key}`).toContain(`id: ${name}.${key},`);
      }
    }
    if (name === "serviceAnchor") expect(source).toContain("serviceAnchor[service.group]");
    expect(hrefs).toHaveLength(Object.keys(anchors).length);
  });
});
