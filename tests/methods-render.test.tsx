import { beforeEach, describe, expect, it, vi } from "vitest";
const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch }) }));
vi.mock("@/sanity/env", () => ({
  projectId: "configured-project",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
import { renderToStaticMarkup } from "react-dom/server";
import TreatmentsPage from "@/app/treatments/page";
import { methodAnchor, methodGroups } from "@/lib/content";

const cdn = "https://cdn.sanity.io/images/p/d/";
const method = (group: string, extra = {}) => ({
  group,
  title: `Nhóm ${group}`,
  indexSubtitle: `Phụ ${group}`,
  body: `Nội dung ${group}`,
  tags: [`Nhãn ${group}`],
  image: `${cdn}${group}.jpg`,
  imageAlt: `Ảnh ${group}`,
  treatments: [],
  ...extra,
});

describe("/treatments from Sanity", () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  it("renders CMS content, derived numerals and anchors, and treatment links", async () => {
    fetch.mockResolvedValue([
      method("cold", { treatments: [{ slug: "cold-plunge", title: "Cold Plunge" }] }),
    ]);
    const html = renderToStaticMarkup(await TreatmentsPage());
    for (const group of methodGroups) {
      expect(html).toContain(`id="${methodAnchor[group]}"`);
      expect(html).toContain(`href="#${methodAnchor[group]}"`);
    }
    expect(html).toContain("Nhóm cold");
    expect(html).toContain("Nội dung cold");
    expect(html).toContain('href="/treatments/cold-plunge"');
    expect(html).toContain("Cold Plunge");
    for (const numeral of ["01", "02", "03", "04", "05"]) expect(html).toContain(numeral);
  });

  it("shows no treatment links or related-treatment label when no group has treatments", async () => {
    fetch.mockResolvedValue(null);
    const html = renderToStaticMarkup(await TreatmentsPage());
    expect(html).not.toContain('href="/treatments/');
    expect(html).not.toContain("Liệu pháp liên quan");
    expect(html).toContain("<h1>Phương pháp</h1>");
  });

  it("never links a bundled treatment slug when Sanity is configured", async () => {
    fetch.mockResolvedValue([method("cold")]);
    const html = renderToStaticMarkup(await TreatmentsPage());
    expect(html).not.toContain("dry-needling");
    expect(html).not.toContain("/treatments/iastm");
  });

  it("drops a link whose reference was removed", async () => {
    fetch.mockResolvedValue([method("manual", { treatments: [null] })]);
    expect(renderToStaticMarkup(await TreatmentsPage())).not.toContain('href="/treatments/');
  });

  it("keeps assessment-focused CTAs to booking and contact", async () => {
    fetch.mockResolvedValue(null);
    const html = renderToStaticMarkup(await TreatmentsPage());
    expect(html).toContain("Đặt buổi đánh giá");
    expect(html).toContain('href="/booking"');
    expect(html).toContain('href="/contact"');
  });
});
