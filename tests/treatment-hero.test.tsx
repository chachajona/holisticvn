import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CertifiedNote, TreatmentFacts } from "@/app/treatments/[slug]/treatment-facts";
import { TreatmentHero } from "@/app/treatments/[slug]/treatment-hero";
import { type MethodStageId, type Treatment } from "@/lib/content";
import { factCells } from "@/lib/treatment-display";

const base: Treatment = {
  slug: "cupping",
  title: "Giác hơi",
  englishTitle: "Cupping",
  shortDescription: "Mô tả ngắn.",
  description: "Mô tả dài.",
  benefits: [],
  image: "https://cdn.sanity.io/images/p/d/a.jpg",
};
const hero = (
  treatment: Partial<Treatment> = {},
  props: { showPrimaryCta?: boolean; stages?: MethodStageId[] } = {},
) =>
  renderToStaticMarkup(
    <TreatmentHero
      treatment={{ ...base, ...treatment }}
      stages={props.stages ?? ["therapy"]}
      phone="082 895 9598"
      showPrimaryCta={props.showPrimaryCta ?? false}
    />,
  );

describe("TreatmentHero", () => {
  it("shows the title, an upright English subtitle, the lede, the phone link and the pathway", () => {
    const html = hero();
    expect(html).toContain("<h1>Giác hơi</h1>");
    expect(html).toMatch(/<p[^>]*lang="en"[^>]*>Cupping<\/p>/);
    expect(html).toContain("Mô tả ngắn.");
    expect(html).not.toContain("Mô tả dài.");
    expect(html).toContain('href="tel:0828959598"');
    expect(html).toContain("Gọi 082 895 9598");
    expect(html).toContain("Lộ trình");
    expect(html).toContain("Trị liệu");
    expect(html).toContain('href="/treatments"');
    expect(html).toContain("<img");
  });

  it("hides the subtitle when it repeats the title and the pathway when there is no stage", () => {
    const html = renderToStaticMarkup(
      <TreatmentHero
        treatment={{ ...base, title: "IASTM", englishTitle: "iastm" }}
        stages={[]}
        phone="082 895 9598"
        showPrimaryCta={false}
      />,
    );
    expect(html).not.toContain('lang="en"');
    expect(html).not.toContain("Lộ trình");
    expect(html).not.toContain('aria-label="Lộ trình:');
    expect(hero()).toContain('aria-label="Lộ trình: Trị liệu"');
  });

  it("names the active pathway stages for screen readers", () => {
    expect(hero()).toContain('aria-label="Lộ trình: Trị liệu"');
    const two = hero({}, { stages: ["therapy", "training"] });
    expect(two).toContain('aria-label="Lộ trình: Trị liệu, Tập luyện"');
  });

  it("falls back to the description as the lede when there is no short description", () => {
    expect(hero({ shortDescription: "" })).toContain("Mô tả dài.");
  });

  it("puts the primary call to action in the hero only when asked to", () => {
    expect(hero({}, { showPrimaryCta: true })).toContain("Gửi yêu cầu tư vấn");
    expect(hero({}, { showPrimaryCta: false })).not.toContain("Gửi yêu cầu tư vấn");
  });

  it("shows the badge as a stamp over a photo and as a chip without one", () => {
    const withImage = hero({ badge: "popular" });
    expect(withImage).toContain('data-badge="popular"');
    expect(withImage).toContain('data-variant="stamp"');
    expect(withImage).toContain("Được chọn nhiều");
    const plain = hero({ badge: "new", image: undefined });
    expect(plain).toContain('data-badge="new"');
    expect(plain).toContain('data-variant="chip"');
    expect(plain).toContain("Mới");
    expect(plain).toContain("data-plain");
    expect(plain).not.toContain("<img");
  });

  it("renders only the stamp over a photo and only the chip without one", () => {
    const withImage = hero({ badge: "popular" });
    expect(withImage).toContain('data-variant="stamp"');
    expect(withImage).not.toContain('data-variant="chip"');
    const plain = hero({ badge: "popular", image: undefined });
    expect(plain).toContain('data-variant="chip"');
    expect(plain).not.toContain('data-variant="stamp"');
  });

  it("shows no badge by default", () => {
    expect(hero()).not.toContain("data-badge");
  });
});

describe("TreatmentFacts", () => {
  it("renders one definition-list cell per fact without duplicating the hero call to action", () => {
    const html = renderToStaticMarkup(
      <TreatmentFacts
        cells={factCells({
          price: 99000,
          duration: "45 phút",
          protocols: [{ step: 1, title: "A", description: "" }],
        })}
      />,
    );
    expect(html).toContain('id="treatment-facts"');
    expect(html).toContain("Giá");
    expect(html).toContain("Thời lượng gợi ý");
    expect(html).toContain("1 bước");
    expect(html).not.toContain('href="#yeu-cau"');
    expect(html).toContain("--cells:3");
  });

  it("renders nothing when there are no facts", () => {
    expect(renderToStaticMarkup(<TreatmentFacts cells={[]} />)).toBe("");
  });
});

describe("CertifiedNote", () => {
  it("carries the owner's wording", () => {
    expect(renderToStaticMarkup(<CertifiedNote />)).toContain(
      "Các dịch vụ trị liệu này chỉ được thực hiện và theo dõi bởi chuyên viên có chứng nhận và chứng chỉ chuyên môn.",
    );
  });
});
