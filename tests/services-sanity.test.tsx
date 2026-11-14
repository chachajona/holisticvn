import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const { fetch, leadForm } = vi.hoisted(() => ({ fetch: vi.fn(), leadForm: vi.fn() }));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch }) }));
vi.mock("@/sanity/env", () => ({
  projectId: "configured-project",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
vi.mock("@/components/lead-form", () => ({
  LeadForm: (props: unknown) => {
    leadForm(props);
    return null;
  },
}));
import { renderToStaticMarkup } from "react-dom/server";
import BookingPage from "@/app/booking/page";
import ServicesPage from "@/app/services/page";
import { getServices } from "@/lib/sanity";

const cdn = "https://cdn.sanity.io/images/p/d/";
const service = (group: string, extra = {}) => ({
  title: `Dịch vụ ${group}`,
  shortTitle: `Nhóm ${group}`,
  group,
  summary: `Tóm tắt ${group}`,
  body: `Nội dung ${group}`,
  bullets: [`Ý ${group}`],
  image: `${cdn}${group}.jpg`,
  imageAlt: `Ảnh ${group}`,
  treatments: [],
  ...extra,
});

describe("services from Sanity", () => {
  beforeEach(() => {
    fetch.mockReset();
    leadForm.mockReset();
  });

  it("reads the servicesPage singleton in array order", async () => {
    fetch.mockResolvedValue([]);
    await getServices();
    const query = fetch.mock.calls[0][0] as string;
    expect(query).toContain('_id == "servicesPage"');
    expect(query).toContain(".groups");
    expect(query).not.toContain("order(");
  });

  it("treats a missing servicesPage as no services instead of an error", async () => {
    fetch.mockResolvedValue(null);
    expect(await getServices()).toEqual([]);
  });

  it("drops services without a valid group and keeps the first of a duplicated group", async () => {
    fetch.mockResolvedValue([
      service("training"),
      service("nonsense"),
      service("training", { title: "Trùng" }),
      service("manual"),
    ]);
    expect((await getServices()).map((s) => s.group)).toEqual(["training", "manual"]);
  });

  it("uses the group's local image when the CMS image is missing or not from Sanity", async () => {
    fetch.mockResolvedValue([
      service("manual", { image: null }),
      service("training", { image: "https://evil.example/x.jpg" }),
    ]);
    const [manual, training] = await getServices();
    expect(manual.image).toBe("/images/Iastm.jpg");
    expect(training.image).toBe("/images/Coaching.jpg");
  });

  it("removes treatment references that no longer resolve", async () => {
    fetch.mockResolvedValue([
      service("manual", {
        treatments: [{ slug: "cupping", title: "Cupping" }, null, { slug: "", title: "" }],
      }),
    ]);
    expect((await getServices())[0].treatments).toEqual([{ slug: "cupping", title: "Cupping" }]);
  });

  it("renders page content, order, treatment links and group-aware booking CTAs from the CMS", async () => {
    fetch.mockResolvedValue([
      service("recovery", { treatments: [{ slug: "cold-plunge", title: "Cold Plunge" }] }),
      service("manual"),
    ]);
    const html = renderToStaticMarkup(await ServicesPage());
    expect(html.indexOf("Dịch vụ recovery")).toBeLessThan(html.indexOf("Dịch vụ manual"));
    expect(html).toContain("Nhóm recovery");
    expect(html).toContain("Tóm tắt recovery");
    expect(html).toContain('id="svc-recovery"');
    expect(html).toContain('id="svc-manual"');
    expect(html).toContain('href="/treatments/cold-plunge"');
    expect(html).toContain('href="/booking?service=recovery"');
    expect(html).toContain('href="/booking?service=manual"');
    expect(html).toContain('aria-label="Đặt lịch Nhóm recovery"');
    expect(html).toContain('aria-label="Đặt lịch Nhóm manual"');
    expect(html).not.toContain("svc-training");
    expect(html).toContain("Đặt lịch");
  });

  it("renders /services without sections before the singleton exists", async () => {
    fetch.mockResolvedValue(null);
    const html = renderToStaticMarkup(await ServicesPage());
    expect(html).toContain("<h1>Dịch vụ</h1>");
    expect(html).not.toContain("svc-");
    expect(html).not.toContain("/booking?service=");
  });

  it("drops the treatment link when the reference is removed", async () => {
    fetch.mockResolvedValue([service("recovery", { treatments: [null] })]);
    expect(renderToStaticMarkup(await ServicesPage())).not.toContain("/treatments/");
  });

  it("keeps the booking page usable when Sanity is down", async () => {
    fetch.mockRejectedValue(new Error("down"));
    const html = renderToStaticMarkup(
      await BookingPage({ searchParams: Promise.resolve({ service: "training" }) }),
    );
    expect(html).not.toContain("Dịch vụ:");
    expect(leadForm).toHaveBeenCalledWith({
      kind: "booking",
      treatment: undefined,
      variant: "page",
    });
  });

  it("does not query Sanity for a plain /booking visit", async () => {
    renderToStaticMarkup(await BookingPage({ searchParams: Promise.resolve({}) }));
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("recovery sub-cards and legacy anchor", () => {
  beforeEach(() => fetch.mockReset());
  const link = (slug: string, shortDescription?: string) => ({
    slug,
    title: slug,
    ...(shortDescription === undefined ? {} : { shortDescription }),
  });

  it("fills an empty recovery shortDescription from the catalogue and leaves other groups alone", async () => {
    fetch.mockResolvedValue([
      service("manual", { treatments: [link("cupping", "CMS copy")] }),
      service("recovery", {
        treatments: [link("cold-plunge", "CMS copy"), link("infrared-heat", "  ")],
      }),
    ]);
    const [manual, recovery] = await getServices();
    expect(manual.treatments).toEqual([{ slug: "cupping", title: "cupping" }]);
    expect(recovery.treatments[0].shortDescription).toBe("CMS copy");
    expect(recovery.treatments[1].shortDescription).toMatch(/hơi ấm/);
  });

  it("keeps #svc-therapy as a static alias at the head of the manual group", async () => {
    fetch.mockResolvedValue([service("manual"), service("electro")]);
    const html = renderToStaticMarkup(await ServicesPage());
    expect(html).toContain('id="svc-therapy"');
    expect(html).toContain('id="svc-manual"');
    expect(html.indexOf('id="svc-therapy"')).toBeGreaterThan(html.indexOf('id="svc-manual"'));
    expect(html.split('id="svc-therapy"').length).toBe(2);
  });
});

describe("services page layout (#41 index rows)", () => {
  beforeEach(() => fetch.mockReset());
  const render = async () => {
    fetch.mockResolvedValue([
      service("manual"),
      service("electro"),
      service("training"),
      service("recovery", {
        treatments: [
          { slug: "cold-plunge", title: "Ngâm lạnh", shortDescription: "Mô tả lạnh" },
          { slug: "infrared-heat", title: "Đèn hồng ngoại", shortDescription: "Mô tả ấm" },
        ],
      }),
    ]);
    return renderToStaticMarkup(await ServicesPage());
  };

  it("links the hero to /treatments and keeps a single h1", async () => {
    const html = await render();
    expect(html).toContain('href="/treatments"');
    expect(html).toContain("Tìm theo triệu chứng ở Phương pháp");
    expect(html.match(/<h1[ >]/g)).toHaveLength(1);
  });

  it("gives training its /treatments#mtd-rehab link and no other group", async () => {
    const html = await render();
    expect(html.split('href="/treatments#mtd-rehab"')).toHaveLength(2);
  });

  it("renders recovery as two sub-cards with their descriptions", async () => {
    const html = await render();
    expect(html).toContain('href="/treatments/cold-plunge"');
    expect(html).toContain('href="/treatments/infrared-heat"');
    expect(html).toContain("Mô tả lạnh");
    expect(html).toContain("Mô tả ấm");
  });

  it("keeps DOM order copy-then-image without inline order styles", async () => {
    const html = await render();
    expect(html).not.toMatch(/style="[^"]*order:/);
    const first = html.slice(html.indexOf('id="svc-manual"'));
    expect(first.indexOf("<h2")).toBeLessThan(first.indexOf("manual.jpg"));
  });

  it("renders one exclusive details row per group with only the first open", async () => {
    const html = await render();
    const rows = html.match(/<details[^>]*>/g) ?? [];
    expect(rows).toHaveLength(4);
    for (const row of rows) expect(row).toContain('name="services"');
    expect(rows.map((row) => row.includes(" open"))).toEqual([true, false, false, false]);
    expect(html.match(/<summary/g)).toHaveLength(4);
  });

  it("ends with the three CTA exits and links process steps onward", async () => {
    const html = await render();
    for (const href of ["/booking", "/treatments", "/contact", "/about"]) {
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).toContain("Đặt lịch đánh giá ban đầu");
  });
});

describe("booking context", () => {
  afterEach(() => vi.useRealTimers());
  beforeEach(() => {
    fetch.mockReset();
    leadForm.mockReset();
    fetch.mockResolvedValue([service("manual"), service("training")]);
  });

  it("shows the chosen service and passes it to the lead form", async () => {
    const html = renderToStaticMarkup(
      await BookingPage({ searchParams: Promise.resolve({ service: "training" }) }),
    );
    expect(html).toContain("Dịch vụ:");
    expect(html).toContain("Dịch vụ training");
    expect(leadForm).toHaveBeenCalledWith({
      kind: "booking",
      treatment: "Dịch vụ training",
      variant: "page",
    });
  });

  it.each([undefined, "unknown", ["manual", "training"]])(
    "ignores a missing or invalid service (%s)",
    async (value) => {
      const html = renderToStaticMarkup(
        await BookingPage({ searchParams: Promise.resolve({ service: value }) }),
      );
      expect(html).not.toContain("Dịch vụ:");
      expect(leadForm).toHaveBeenCalledWith({
        kind: "booking",
        treatment: undefined,
        variant: "page",
      });
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it("maps the pre-#41 therapy link onto the manual group", async () => {
    const html = renderToStaticMarkup(
      await BookingPage({ searchParams: Promise.resolve({ service: "therapy" }) }),
    );
    expect(html).toContain("Dịch vụ manual");
    expect(leadForm).toHaveBeenCalledWith({
      kind: "booking",
      treatment: "Dịch vụ manual",
      variant: "page",
    });
  });

  it("does not substitute another published service for a missing group", async () => {
    fetch.mockResolvedValue([service("manual")]);
    renderToStaticMarkup(
      await BookingPage({ searchParams: Promise.resolve({ service: "training" }) }),
    );
    expect(leadForm).toHaveBeenCalledWith({
      kind: "booking",
      treatment: undefined,
      variant: "page",
    });
  });

  it("bounds stalled optional context, aborts it and omits treatment", async () => {
    vi.useFakeTimers();
    fetch.mockReturnValue(new Promise(() => {}));
    const page = BookingPage({ searchParams: Promise.resolve({ service: "training" }) });
    await vi.advanceTimersByTimeAsync(4999);
    const signal = fetch.mock.calls[0][2].signal as AbortSignal;
    expect(signal.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(renderToStaticMarkup(await page)).not.toContain("Dịch vụ:");
    expect(signal.aborted).toBe(true);
    expect(leadForm).toHaveBeenCalledWith({
      kind: "booking",
      treatment: undefined,
      variant: "page",
    });
    expect(vi.getTimerCount()).toBe(0);
  });
});
