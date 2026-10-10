import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ServicesCarousel } from "@/components/services-carousel";
import { HighlightStage } from "@/components/highlight-stage";
import { HeroPanels } from "@/components/hero-panels";

describe("homepage progressive enhancement", () => {
  it("renders every service without enabling client-only carousel or reveal styles", () => {
    const items = Array.from({ length: 8 }, (_, index) => ({
      title: `Dịch vụ ${index + 1}`,
      copy: "Thông tin dịch vụ",
      image: "/images/Studio.jpg",
      href: `/services#service-${index}`,
      tag: "Dịch vụ",
    }));
    const html = renderToStaticMarkup(<ServicesCarousel items={items} />);
    expect(html.match(/role="group"/g)).toHaveLength(8);
    for (const item of items) expect(html).toContain(item.href);
    expect(html).not.toContain("data-carousel-enhanced");
    expect(html).not.toContain("data-reveal-enhanced");
  });

  it("renders quote highlights without enabling the animated hidden state", () => {
    const html = renderToStaticMarkup(
      <HighlightStage>
        <mark>Không gian thoải mái</mark>
      </HighlightStage>,
    );
    expect(html).toContain("<mark>Không gian thoải mái</mark>");
    expect(html).not.toContain("data-highlight-stage");
  });

  it("keeps desktop hero images lazy with a viewport-specific default preload", () => {
    const steps = ["Tư vấn", "Trị liệu", "Tập luyện"].map((title, index) => ({
      num: String(index + 1),
      title,
      copy: "Thông tin bước",
      href: "/services",
      image: "/images/Intake.jpg",
      alt: "Ảnh clinic",
      position: "50% 50%",
      isDefault: index === 1,
    }));
    const html = renderToStaticMarkup(<HeroPanels steps={steps} />);
    expect(html.match(/<img\b[^>]*loading="lazy"/g)).toHaveLength(3);
    expect(html).not.toContain('loading="eager"');
    expect(html).toContain('media="(min-width: 701px)"');
  });
});
