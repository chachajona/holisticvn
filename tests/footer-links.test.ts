import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { footerMethods, footerServices, methodAnchor, serviceAnchor } from "@/lib/content";

// The pages and the footer share one set of anchor constants; these checks make sure the footer
// links are built from them and that each page still uses them as its section ids.
describe("footer links", () => {
  it.each([
    [
      "app/services/page.tsx",
      "serviceAnchor[service.group]",
      "/services",
      serviceAnchor,
      footerServices,
    ],
    [
      "app/treatments/page.tsx",
      "methodAnchor[method.group]",
      "/treatments",
      methodAnchor,
      footerMethods,
    ],
  ] as const)("%s sections match the footer links", (file, usage, path, anchors, links) => {
    const hrefs = links.map(([, href]) => href);
    for (const id of Object.values(anchors)) expect(hrefs, id).toContain(`${path}#${id}`);
    // Both pages key their sections by CMS group (ids are asserted per group in the render tests).
    expect(readFileSync(file, "utf8")).toContain(usage);
    expect(hrefs).toHaveLength(Object.keys(anchors).length);
  });
});
