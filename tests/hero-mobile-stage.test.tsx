import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HeroMobileStage } from "@/components/hero-mobile-stage";

describe("mobile hero destination", () => {
  it.each([
    { title: "Tư vấn", href: "/booking", linkLabel: "Đặt lịch tư vấn" },
    { title: "Trị liệu", href: "/treatments", linkLabel: "Xem phương pháp trị liệu" },
    {
      title: "Tập luyện",
      href: "/services#svc-training",
      linkLabel: "Xem dịch vụ tập luyện",
    },
  ])("renders a native destination link for $title alongside the selector", (step) => {
    const html = renderToStaticMarkup(
      <HeroMobileStage
        steps={[
          {
            ...step,
            num: "01",
            image: "/images/Intake.jpg",
            alt: "Ảnh minh họa bước đang chọn",
            position: "50% 50%",
            isDefault: true,
          },
        ]}
      />,
    );
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    expect(links).toHaveLength(1);
    expect(links[0][1]).toBe(step.href);
    expect(links[0][2]).toContain(step.linkLabel);
    expect(links[0][2]).toContain('aria-hidden="true"');
    expect(html).toMatch(/<button\b[^>]*type="button"[^>]*aria-pressed="true"/);
  });
});
