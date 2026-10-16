import { describe, expect, it } from "vitest";
import {
  certifiedPractitionerNote,
  englishSubtitle,
  factCells,
  formatPrice,
  paragraphs,
} from "@/lib/treatment-display";

describe("treatment display helpers", () => {
  it("formats VND with dot separators, no decimals and the dong sign", () => {
    // Intl puts a no-break space before the sign; \s matches it.
    expect(formatPrice(149000)).toMatch(/^149\.000\s₫$/);
    expect(formatPrice(99000)).toMatch(/^99\.000\s₫$/);
    expect(formatPrice(349000)).toMatch(/^349\.000\s₫$/);
  });

  it("shows the English name only when it adds information", () => {
    expect(englishSubtitle({ title: "Châm khô", englishTitle: "Dry Needling" })).toBe(
      "Dry Needling",
    );
    expect(englishSubtitle({ title: "IASTM", englishTitle: " iastm " })).toBeUndefined();
    expect(englishSubtitle({ title: "Tapping", englishTitle: "TAPPING" })).toBeUndefined();
    expect(englishSubtitle({ title: "Giác hơi", englishTitle: "   " })).toBeUndefined();
    expect(englishSubtitle({ title: "Giác hơi" })).toBeUndefined();
  });

  it("keeps the owner's wording for the certified-practitioner note", () => {
    expect(certifiedPractitionerNote).toBe(
      "Các dịch vụ trị liệu này chỉ được thực hiện và theo dõi bởi chuyên viên có chứng nhận và chứng chỉ chuyên môn.",
    );
  });

  it("splits CMS text into paragraphs on real line breaks and on the legacy literal \\n", () => {
    expect(paragraphs("Một.\\n\\nHai.")).toEqual(["Một.", "Hai."]);
    expect(paragraphs("Một.\n\nHai.\n Ba. ")).toEqual(["Một.", "Hai.", "Ba."]);
    expect(paragraphs("Chỉ một đoạn.")).toEqual(["Chỉ một đoạn."]);
    expect(paragraphs("")).toEqual([]);
    expect(paragraphs(undefined)).toEqual([]);
  });

  it("builds the quick-facts cells only from data that exists", () => {
    expect(
      factCells({
        price: 99000,
        duration: " 45 phút ",
        protocols: [{ step: 1, title: "A", description: "" }],
      }),
    ).toEqual([
      { label: "Giá", value: expect.stringMatching(/^99\.000\s₫$/) },
      { label: "Thời lượng gợi ý", value: "45 phút" },
      { label: "Quy trình", value: "1 bước" },
    ]);
    expect(factCells({ price: 0, duration: "  ", protocols: [] })).toEqual([]);
    expect(factCells({})).toEqual([]);
  });
});
