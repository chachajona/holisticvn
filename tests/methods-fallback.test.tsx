import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("@/sanity/env", () => ({
  projectId: "missing-project-id",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
import { renderToStaticMarkup } from "react-dom/server";
import TreatmentsPage from "@/app/treatments/page";
import { methodAnchor, methodGroups, methods } from "@/lib/content";
import { getMethods } from "@/lib/sanity";

describe("methods fallback (Sanity not configured)", () => {
  it("covers the five groups in canonical order", async () => {
    expect((await getMethods()).map((m) => m.group)).toEqual([...methodGroups]);
  });

  it("renders every section anchor and the bundled treatment links", async () => {
    const html = renderToStaticMarkup(await TreatmentsPage());
    for (const group of methodGroups) {
      expect(html).toContain(`id="${methodAnchor[group]}"`);
    }
    for (const method of methods) {
      for (const t of method.treatments) expect(html).toContain(`href="/treatments/${t.slug}"`);
    }
  });

  it("offsets fragment targets below the sticky nav", () => {
    expect(readFileSync("app/globals.css", "utf8")).toMatch(/scroll-padding-top:\s*7rem/);
  });
});
