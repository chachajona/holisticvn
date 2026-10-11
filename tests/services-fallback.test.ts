import { describe, expect, it, vi } from "vitest";
vi.mock("@/sanity/env", () => ({
  projectId: "missing-project-id",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
import { renderToStaticMarkup } from "react-dom/server";
import ServicesPage from "@/app/services/page";
import { serviceAnchor, services, treatments } from "@/lib/content";
import { getServices } from "@/lib/sanity";

describe("services fallback (Sanity not configured)", () => {
  it("covers the three groups in one pathway order", async () => {
    expect((await getServices()).map((s) => s.group)).toEqual(["therapy", "training", "recovery"]);
  });

  it("only links treatments and images that exist", () => {
    const slugs = new Set(treatments.map((t) => t.slug));
    for (const s of services) {
      expect(s.image).toMatch(/^\/images\//);
      expect(s.imageAlt).not.toBe("");
      for (const t of s.treatments) expect(slugs.has(t.slug)).toBe(true);
    }
  });

  it("renders every group anchor and a group-aware booking CTA", async () => {
    const html = renderToStaticMarkup(await ServicesPage());
    for (const group of Object.keys(serviceAnchor)) {
      expect(html).toContain(`id="${serviceAnchor[group as keyof typeof serviceAnchor]}"`);
      expect(html).toContain(`href="/booking?service=${group}"`);
    }
  });

  it("gives each booking CTA a distinct accessible name", async () => {
    const html = renderToStaticMarkup(await ServicesPage());
    const labels = services.map((s) => `Đặt lịch ${s.shortTitle}`);
    for (const label of labels) {
      expect(html).toContain(`aria-label="${label.replaceAll("&", "&amp;")}"`);
    }
    expect(new Set(labels).size).toBe(services.length);
  });
});
