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
import { methodAnchor, methodGroups, methodStages, methods } from "@/lib/content";

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

  it("renders CMS content, section anchors in order, and treatment links", async () => {
    fetch.mockResolvedValue([
      ...methodGroups
        .map((group) =>
          method(group, {
            treatments: group === "cold" ? [{ slug: "cold-plunge", title: "Cold Plunge" }] : [],
          }),
        )
        .reverse(),
    ]);
    const html = renderToStaticMarkup(await TreatmentsPage());
    for (const group of methodGroups) {
      expect(html).toContain(`id="${methodAnchor[group]}"`);
    }
    expect(html).toContain("Nhóm cold");
    expect(html).toContain("Nội dung cold");
    expect(html).toContain('href="/treatments/cold-plunge"');
    expect(html).toContain("Cold Plunge");
    for (const [i, group] of methodGroups.entries()) {
      if (i > 0) {
        expect(html.indexOf(`id="${methodAnchor[group]}"`)).toBeGreaterThan(
          html.indexOf(`id="${methodAnchor[methodGroups[i - 1]]}"`),
        );
      }
      expect(html.match(new RegExp(`id="${methodAnchor[group]}"`, "g"))).toHaveLength(1);
    }
    expect(html).not.toMatch(/>0[1-5]</);
  });

  it("renders a shared treatment once in each group that references it", async () => {
    const treatment = { slug: "heat-light", title: "Heat & Light" };
    fetch.mockResolvedValue([
      method("manual", { treatments: [treatment, treatment] }),
      method("electro", { treatments: [treatment] }),
    ]);
    const html = renderToStaticMarkup(await TreatmentsPage());
    for (const group of ["manual", "electro"] as const) {
      const nextGroup = methodGroups[methodGroups.indexOf(group) + 1];
      const section = html.slice(
        html.indexOf(`id="${methodAnchor[group]}"`),
        html.indexOf(`id="${methodAnchor[nextGroup]}"`),
      );
      expect(section.match(/href="\/treatments\/heat-light"/g)).toHaveLength(1);
    }
    expect(html.match(/href="\/treatments\/heat-light"/g)).toHaveLength(2);
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

  it("pairs the local fallback image with its bundled alt in a CMS group", async () => {
    fetch.mockResolvedValue([method("manual", { image: null, imageAlt: "Alt của ảnh đã gỡ" })]);
    const html = renderToStaticMarkup(await TreatmentsPage());
    expect(html).toContain(`alt="${methods[0].imageAlt}"`);
    expect(html).toContain(encodeURIComponent(methods[0].image));
    expect(html).not.toContain("Alt của ảnh đã gỡ");
  });

  it("renders every group under its pathway stage when CMS and fallback groups coexist", async () => {
    fetch.mockResolvedValue([method("cold")]);
    const html = renderToStaticMarkup(await TreatmentsPage());
    expect(html).toContain("Nhóm cold");
    for (const [i, stage] of methodStages.entries()) {
      const start = html.indexOf(`id="stage-${stage.id}"`);
      expect(start, stage.id).toBeGreaterThan(-1);
      const next = methodStages[i + 1];
      const end = next ? html.indexOf(`id="stage-${next.id}"`) : html.length;
      for (const group of methodGroups) {
        const at = html.indexOf(`id="${methodAnchor[group]}"`);
        expect(at > start && at < end, `${group} in ${stage.id}`).toBe(
          (stage.groups as readonly string[]).includes(group),
        );
      }
    }
  });

  it("keeps assessment-focused CTAs to booking and contact", async () => {
    fetch.mockResolvedValue(null);
    const html = renderToStaticMarkup(await TreatmentsPage());
    expect(html).toContain("Đặt lịch đánh giá ban đầu");
    expect(html).toContain('href="/booking"');
    expect(html).toContain('href="/contact"');
  });
});
