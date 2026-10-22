import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TreatmentDock } from "@/app/treatments/[slug]/treatment-dock";

describe("TreatmentDock", () => {
  it("starts hidden and out of the tab order, with an accessible name", () => {
    const html = renderToStaticMarkup(
      <TreatmentDock
        markerId="treatment-facts"
        title="Giác hơi"
        price="99.000 ₫"
        duration="45 phút"
      />,
    );
    expect(html).toContain('aria-label="Tóm tắt và tư vấn"');
    expect(html).toMatch(/<aside[^>]*\binert\b/);
    expect(html).toContain('href="#yeu-cau"');
    expect(html).toContain("Nhận tư vấn");
    expect(html).toContain("99.000 ₫");
    expect(html).toContain("45 phút");
  });

  it("shows only the title and the button when there is no price or duration", () => {
    const html = renderToStaticMarkup(<TreatmentDock markerId="treatment-facts" title="Tapping" />);
    expect(html).toContain("Tapping");
    expect(html).not.toContain("₫");
  });
});
