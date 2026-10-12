import { beforeEach, describe, expect, it, vi } from "vitest";
const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch }) }));
vi.mock("@/sanity/env", () => ({
  projectId: "configured-project",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
import { methodGroups, methods } from "@/lib/content";
import { getMethods } from "@/lib/sanity";

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
const bundled = (group: string) => methods.find((m) => m.group === group)!;

describe("methods from Sanity", () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  it("reads the methodsPage singleton groups without a client-side order()", async () => {
    fetch.mockResolvedValue([]);
    await getMethods();
    const query = fetch.mock.calls[0][0] as string;
    expect(query).toContain('_id == "methodsPage"');
    expect(query).toContain(".groups");
    expect(query).not.toContain("order(");
  });

  it("returns five bundled groups, without treatment links, before the singleton exists", async () => {
    fetch.mockResolvedValue(null);
    const result = await getMethods();
    expect(result.map((m) => m.group)).toEqual([...methodGroups]);
    expect(result.map((m) => m.title)).toEqual(methods.map((m) => m.title));
    for (const m of result) expect(m.treatments).toEqual([]);
  });

  it("always returns the canonical order, even when the CMS order differs", async () => {
    fetch.mockResolvedValue(methodGroups.map((g) => method(g)).reverse());
    expect((await getMethods()).map((m) => m.group)).toEqual([...methodGroups]);
  });

  it("drops invalid and duplicate groups and fills gaps from bundled copy", async () => {
    fetch.mockResolvedValue([
      method("cold"),
      method("nonsense"),
      method("cold", { title: "Trùng" }),
      method("manual"),
    ]);
    const result = await getMethods();
    expect(result.map((m) => m.group)).toEqual([...methodGroups]);
    expect(result.find((m) => m.group === "cold")!.title).toBe("Nhóm cold");
    expect(result.find((m) => m.group === "manual")!.title).toBe("Nhóm manual");
    const electro = result.find((m) => m.group === "electro")!;
    expect(electro.title).toBe(bundled("electro").title);
    expect(electro.body).toBe(bundled("electro").body);
  });

  it("does not leak bundled treatment links into a fallback group when Sanity is configured", async () => {
    fetch.mockResolvedValue([method("cold")]);
    const result = await getMethods();
    expect(bundled("manual").treatments.length).toBeGreaterThan(0);
    expect(result.find((m) => m.group === "manual")!.treatments).toEqual([]);
  });

  it("falls back for a group without title or body", async () => {
    fetch.mockResolvedValue([method("rehab", { title: "" }), method("cold", { body: "" })]);
    const result = await getMethods();
    expect(result.find((m) => m.group === "rehab")!.title).toBe(bundled("rehab").title);
    expect(result.find((m) => m.group === "cold")!.body).toBe(bundled("cold").body);
  });

  it("uses the group's local image when the CMS image is missing or not from Sanity", async () => {
    fetch.mockResolvedValue([
      method("manual", { image: null, imageAlt: "Alt của ảnh đã gỡ" }),
      method("electro", { image: "https://evil.example/x.jpg", imageAlt: "Alt ảnh ngoài CMS" }),
    ]);
    const result = await getMethods();
    const manual = result.find((m) => m.group === "manual")!;
    expect(manual.image).toBe("/images/Iastm.jpg");
    expect(manual.imageAlt).toBe(bundled("manual").imageAlt);
    expect(result.find((m) => m.group === "electro")!.image).toBe("/images/ElectroPulse.jpg");
    expect(result.find((m) => m.group === "electro")!.imageAlt).toBe(bundled("electro").imageAlt);
  });

  it("keeps the CMS alt for its image and uses the title when that alt is empty", async () => {
    fetch.mockResolvedValue([method("manual"), method("electro", { imageAlt: "" })]);
    const result = await getMethods();
    expect(result.find((m) => m.group === "manual")!.imageAlt).toBe("Ảnh manual");
    expect(result.find((m) => m.group === "electro")!.imageAlt).toBe("Nhóm electro");
  });

  it("keeps the first link per slug in a group without deduping across groups", async () => {
    const first = { slug: "heat-light", title: "Heat & Light" };
    const second = { slug: "cupping", title: "Cupping" };
    fetch.mockResolvedValue([
      method("manual", {
        treatments: [first, null, second, { slug: first.slug, title: "Duplicate" }, first],
      }),
      method("infrared", { treatments: [first] }),
    ]);
    const result = await getMethods();
    expect(result.find((m) => m.group === "manual")!.treatments).toEqual([first, second]);
    expect(result.find((m) => m.group === "infrared")!.treatments).toEqual([first]);
  });

  it("removes treatment references that no longer resolve or have no slug", async () => {
    fetch.mockResolvedValue([
      method("manual", {
        treatments: [{ slug: "cupping", title: "Cupping" }, null, { slug: "", title: "" }],
      }),
    ]);
    const manual = (await getMethods()).find((m) => m.group === "manual")!;
    expect(manual.treatments).toEqual([{ slug: "cupping", title: "Cupping" }]);
  });

  it("trims, drops empty and dedupes tags", async () => {
    fetch.mockResolvedValue([
      method("manual", { tags: ["  Đau vai ", "Đau vai", "", "Lệch chậu"] }),
    ]);
    const manual = (await getMethods()).find((m) => m.group === "manual")!;
    expect(manual.tags).toEqual(["Đau vai", "Lệch chậu"]);
  });

  it("throws when Sanity is down so ISR keeps the last good page", async () => {
    fetch.mockRejectedValue(new Error("down"));
    await expect(getMethods()).rejects.toThrow("down");
  });
});
