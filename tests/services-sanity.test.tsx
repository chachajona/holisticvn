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
      service("therapy"),
    ]);
    expect((await getServices()).map((s) => s.group)).toEqual(["training", "therapy"]);
  });

  it("uses the group's local image when the CMS image is missing or not from Sanity", async () => {
    fetch.mockResolvedValue([
      service("therapy", { image: null }),
      service("training", { image: "https://evil.example/x.jpg" }),
    ]);
    const [therapy, training] = await getServices();
    expect(therapy.image).toBe("/images/Iastm.jpg");
    expect(training.image).toBe("/images/Coaching.jpg");
  });

  it("removes treatment references that no longer resolve", async () => {
    fetch.mockResolvedValue([
      service("therapy", {
        treatments: [{ slug: "cupping", title: "Cupping" }, null, { slug: "", title: "" }],
      }),
    ]);
    expect((await getServices())[0].treatments).toEqual([{ slug: "cupping", title: "Cupping" }]);
  });

  it("renders page content, order, treatment links and group-aware booking CTAs from the CMS", async () => {
    fetch.mockResolvedValue([
      service("recovery", { treatments: [{ slug: "cold-plunge", title: "Cold Plunge" }] }),
      service("therapy"),
    ]);
    const html = renderToStaticMarkup(await ServicesPage());
    expect(html.indexOf("Dịch vụ recovery")).toBeLessThan(html.indexOf("Dịch vụ therapy"));
    expect(html).toContain("Nhóm recovery");
    expect(html).toContain("Tóm tắt recovery");
    expect(html).toContain('id="svc-recovery"');
    expect(html).toContain('href="#svc-therapy"');
    expect(html).toContain('href="/treatments/cold-plunge"');
    expect(html).toContain('href="/booking?service=recovery"');
    expect(html).toContain('href="/booking?service=therapy"');
    expect(html).toContain('aria-label="Đặt lịch Nhóm recovery"');
    expect(html).toContain('aria-label="Đặt lịch Nhóm therapy"');
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
    expect(leadForm).toHaveBeenCalledWith({ kind: "booking", treatment: undefined });
  });

  it("does not query Sanity for a plain /booking visit", async () => {
    renderToStaticMarkup(await BookingPage({ searchParams: Promise.resolve({}) }));
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("booking context", () => {
  afterEach(() => vi.useRealTimers());
  beforeEach(() => {
    fetch.mockReset();
    leadForm.mockReset();
    fetch.mockResolvedValue([service("therapy"), service("training")]);
  });

  it("shows the chosen service and passes it to the lead form", async () => {
    const html = renderToStaticMarkup(
      await BookingPage({ searchParams: Promise.resolve({ service: "training" }) }),
    );
    expect(html).toContain("Dịch vụ: Dịch vụ training");
    expect(leadForm).toHaveBeenCalledWith({ kind: "booking", treatment: "Dịch vụ training" });
  });

  it.each([undefined, "unknown", ["therapy", "training"]])(
    "ignores a missing or invalid service (%s)",
    async (value) => {
      const html = renderToStaticMarkup(
        await BookingPage({ searchParams: Promise.resolve({ service: value }) }),
      );
      expect(html).not.toContain("Dịch vụ:");
      expect(leadForm).toHaveBeenCalledWith({ kind: "booking", treatment: undefined });
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it("does not substitute another published service for a missing group", async () => {
    fetch.mockResolvedValue([service("therapy")]);
    renderToStaticMarkup(
      await BookingPage({ searchParams: Promise.resolve({ service: "training" }) }),
    );
    expect(leadForm).toHaveBeenCalledWith({ kind: "booking", treatment: undefined });
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
    expect(leadForm).toHaveBeenCalledWith({ kind: "booking", treatment: undefined });
    expect(vi.getTimerCount()).toBe(0);
  });
});
