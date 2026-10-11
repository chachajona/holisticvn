import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ChatWidgets } from "@/components/chat-widgets";
import { HeroQuickConsult } from "@/components/hero-quick-consult";
import { usePathname } from "next/navigation";

vi.mock("next/navigation", () => ({ usePathname: vi.fn(() => "/") }));

describe("chat visibility before browser measurements", () => {
  it.each(["/", "/index", "/booking"])(
    "keeps chat out of the way on the initial %s HTML, before observers run",
    (pathname) => {
      vi.mocked(usePathname).mockReturnValue(pathname);
      const html = renderToStaticMarkup(<ChatWidgets />);
      expect(html).toContain('data-form-visible="true"');
      expect(html).toContain('href="tel:0828959598"');
    },
  );

  it("includes the hero consultation form in chat exclusion without changing its styling", () => {
    const html = renderToStaticMarkup(
      <HeroQuickConsult hours="09:00–21:00" phone="082 895 9598" />,
    );
    expect(html).toMatch(/<form[^>]*data-chat-exclusion="true"/);
    expect(html).toContain('aria-label="Tư vấn ngay"');
    expect(html).toContain('name="phone"');
  });
});
