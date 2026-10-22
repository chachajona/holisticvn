import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TreatmentAudience } from "@/app/treatments/[slug]/treatment-audience";
import { TreatmentFaqList } from "@/app/treatments/[slug]/treatment-faq";
import { TreatmentIntro } from "@/app/treatments/[slug]/treatment-intro";
import { TreatmentRelated } from "@/app/treatments/[slug]/treatment-related";
import { TreatmentSteps } from "@/app/treatments/[slug]/treatment-steps";

const sentence =
  "Giác hơi là một phương pháp trị liệu cổ xưa có nguồn gốc từ y học cổ truyền Trung Quốc và các nền văn hóa khác trên thế giới.";

describe("TreatmentIntro", () => {
  it("leads with the first sentence, emphasises the title by colour and keeps the rest on the right", () => {
    const html = renderToStaticMarkup(
      <TreatmentIntro
        title="Giác hơi"
        description={`${sentence} Liệu pháp này dùng cốc.\n\nĐoạn hai.`}
      />,
    );
    expect(html).toContain("Giới thiệu");
    expect(html).toContain("<b>Giác hơi</b>");
    expect(html).toContain("Liệu pháp này dùng cốc.");
    expect(html).toContain("Đoạn hai.");
    expect(html.match(/trên thế giới\./g)).toHaveLength(1);
    expect(html).not.toMatch(/<(em|i)[ >]/);
  });

  it("gives a statement without body text the full width instead of an empty right column", () => {
    const html = renderToStaticMarkup(<TreatmentIntro title="Giác hơi" description={sentence} />);
    expect(html).toContain("<b>Giác hơi</b>");
    expect(html).toContain("introSolo");
    expect(html).not.toContain("introText");
  });

  it("falls back to plain paragraphs when the first sentence cannot lead", () => {
    const html = renderToStaticMarkup(
      <TreatmentIntro title="Giác hơi" description={"Ngắn quá. Câu hai.\n\nĐoạn hai."} />,
    );
    expect(html).toContain("Ngắn quá. Câu hai.");
    expect(html).toContain("Đoạn hai.");
    expect(html).not.toContain("<b>");
  });

  it("renders nothing for an empty description", () => {
    expect(renderToStaticMarkup(<TreatmentIntro title="A" description="" />)).toBe("");
  });
});

describe("TreatmentAudience", () => {
  it("shows both rows as tags", () => {
    const html = renderToStaticMarkup(
      <TreatmentAudience
        conditions={["Đau lưng", "Căng cứng cơ"]}
        benefits={["Giảm đau tự nhiên"]}
      />,
    );
    expect(html).toContain("Dành cho ai, hướng tới gì");
    expect(html).toContain("Khi bạn gặp");
    expect(html).toContain("Đau lưng");
    expect(html).toContain("Hướng tới");
    expect(html).toContain("Giảm đau tự nhiên");
    expect(html).not.toContain("Mỗi người một khác");
  });

  it("omits an empty row", () => {
    const html = renderToStaticMarkup(
      <TreatmentAudience conditions={[]} benefits={["Thư giãn"]} />,
    );
    expect(html).not.toContain("Khi bạn gặp");
    expect(html).toContain("Hướng tới");
  });

  it("renders nothing without conditions and benefits", () => {
    expect(renderToStaticMarkup(<TreatmentAudience conditions={[]} benefits={[]} />)).toBe("");
  });
});

describe("TreatmentSteps", () => {
  it("renders a vertical sequence in the given order with two-digit numerals", () => {
    const html = renderToStaticMarkup(
      <TreatmentSteps
        protocols={[
          { step: 1, title: "Bước một", description: "Mô tả một" },
          { step: 2, title: "Bước hai", description: "" },
        ]}
      />,
    );
    expect(html).toContain("diễn ra thế nào");
    expect(html).toContain("<ol");
    expect(html).toContain("01");
    expect(html).toContain("02");
    expect(html).toContain("Bước một");
    expect(html).toContain("Mô tả một");
    expect(html.indexOf("Bước một")).toBeLessThan(html.indexOf("Bước hai"));
    expect(html.match(/<p/g)).toHaveLength(2);
  });

  it("renders nothing without steps", () => {
    expect(renderToStaticMarkup(<TreatmentSteps protocols={[]} />)).toBe("");
  });
});

describe("TreatmentFaqList", () => {
  it("opens the first disclosure with a question and a paragraph per line of the answer", () => {
    const html = renderToStaticMarkup(
      <TreatmentFaqList faqs={[{ question: "Hỏi?", answer: "Đáp một.\n\nĐáp hai." }]} />,
    );
    expect(html).toContain("đang băn khoăn");
    expect(html).toContain("<details");
    expect(html).toContain("<details open");
    expect(html).toContain("<summary");
    expect(html).toContain("Hỏi?");
    expect(html).toContain("Đáp một.");
    expect(html).toContain("Đáp hai.");
  });

  it("renders nothing without entries", () => {
    expect(renderToStaticMarkup(<TreatmentFaqList faqs={[]} />)).toBe("");
  });
});

describe("TreatmentRelated", () => {
  it("links each card to its page and shows the price only when there is one", () => {
    const html = renderToStaticMarkup(
      <TreatmentRelated
        related={[
          { slug: "iastm", title: "IASTM", price: 199000 },
          { slug: "tapping", title: "Tapping" },
        ]}
      />,
    );
    expect(html).toContain("Liệu pháp cùng nhóm");
    expect(html).toContain('href="/treatments/iastm"');
    expect(html).toContain('href="/treatments/tapping"');
    expect(html.match(/199\.000/g)).toHaveLength(1);
    expect(html).toContain('href="/treatments"');
    expect(html).toContain("Xem tất cả phương pháp");
  });

  it("renders nothing without siblings", () => {
    expect(renderToStaticMarkup(<TreatmentRelated related={[]} />)).toBe("");
  });

  it("visibly discloses stock thumbnails without labelling clinic photos as stock", () => {
    const html = renderToStaticMarkup(
      <TreatmentRelated
        related={[
          { slug: "tapping", title: "Tapping", image: "/images/stock/tapping.jpg" },
          { slug: "cupping", title: "Giác hơi", image: "/images/Cupping.jpg" },
          { slug: "shockwave", title: "Xung kích" },
        ]}
      />,
    );
    expect(html.match(/<figcaption[^>]*>Ảnh minh hoạ<\/figcaption>/g)).toHaveLength(1);
    expect(html).toContain('href="/treatments/tapping"');
    expect(html).toContain('href="/treatments/cupping"');
    expect(html).toContain('href="/treatments/shockwave"');
  });
});
