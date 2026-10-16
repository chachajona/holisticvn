import { describe, expect, it } from "vitest";
import { emphasize, introParts } from "@/lib/treatment-text";

const first =
  "Giác hơi là một phương pháp trị liệu cổ xưa có nguồn gốc từ y học cổ truyền Trung Quốc và các nền văn hóa khác trên thế giới.";
const sentenceTwo = "Liệu pháp này sử dụng các cốc thủy tinh, tre hoặc nhựa đặc biệt.";

describe("emphasize", () => {
  it("marks only the first occurrence of the title, ignoring case", () => {
    expect(emphasize("Hôm nay giác hơi và Giác hơi.", "Giác hơi")).toEqual([
      { text: "Hôm nay " },
      { text: "giác hơi", emphasis: true },
      { text: " và Giác hơi." },
    ]);
  });

  it("matches decomposed Unicode text against a composed title", () => {
    const decomposed = "Giác hơi là liệu pháp cổ xưa".normalize("NFD");
    const parts = emphasize(decomposed, "Giác hơi");
    expect(parts.map((part) => part.text).join("")).toBe(decomposed.normalize("NFC"));
    expect(parts.find((part) => part.emphasis)?.text).toBe("Giác hơi");
  });

  it("returns the text unchanged when the title is missing or empty", () => {
    expect(emphasize("Không có tên ở đây.", "Giác hơi")).toEqual([{ text: "Không có tên ở đây." }]);
    expect(emphasize("Giác hơi", "  ")).toEqual([{ text: "Giác hơi" }]);
  });
});

describe("introParts", () => {
  it("uses the first sentence as the statement and keeps the rest of the paragraph on the right", () => {
    const { statement, rest } = introParts(`${first} ${sentenceTwo}\n\nĐoạn hai.`, "Giác hơi");
    expect(statement?.map((part) => part.text).join("")).toBe(first);
    expect(statement?.find((part) => part.emphasis)?.text).toBe("Giác hơi");
    expect(rest).toEqual([sentenceTwo, "Đoạn hai."]);
  });

  it("does not repeat the statement when the paragraph is a single sentence", () => {
    const { statement, rest } = introParts(`${first}\n\n${sentenceTwo}`, "Giác hơi");
    expect(statement?.map((part) => part.text).join("")).toBe(first);
    expect(rest).toEqual([sentenceTwo]);
  });

  it("returns only a statement for a one-sentence description", () => {
    const { statement, rest } = introParts(first, "Giác hơi");
    expect(statement).toBeDefined();
    expect(rest).toEqual([]);
  });

  it("reads the legacy literal backslash-n as a paragraph break", () => {
    const { rest } = introParts(`${first}\\n\\n${sentenceTwo}`, "Giác hơi");
    expect(rest).toEqual([sentenceTwo]);
  });

  it("does not cut a sentence after the abbreviation TP.", () => {
    const sentence = "Phòng khám tại TP. Hồ Chí Minh phục vụ nhiều người mỗi ngày.";
    const { statement, rest } = introParts(`${sentence} Xin chào bạn.`, "Holistic");
    expect(statement?.map((part) => part.text).join("")).toBe(sentence);
    expect(rest).toEqual(["Xin chào bạn."]);
  });

  it("does not cut a sentence after a parenthesised abbreviation like (TP.", () => {
    const sentence = "Phòng khám của chúng tôi (TP. Hồ Chí Minh) phục vụ nhiều người mỗi ngày.";
    const { statement, rest } = introParts(`${sentence} Xin chào bạn.`, "Holistic");
    expect(statement?.map((part) => part.text).join("")).toBe(sentence);
    expect(rest).toEqual(["Xin chào bạn."]);
  });

  it("does not cut a sentence after a dotted title like PGS.TS.", () => {
    const sentence =
      "Liệu pháp này được hướng dẫn bởi PGS.TS. Nguyễn Văn A tại phòng khám của chúng tôi.";
    const { statement, rest } = introParts(`${sentence} Xin chào bạn.`, "Holistic");
    expect(statement?.map((part) => part.text).join("")).toBe(sentence);
    expect(rest).toEqual(["Xin chào bạn."]);
  });

  it("skips the statement style when the first sentence is under 40 characters", () => {
    const text = "Giác hơi là liệu pháp cổ xưa. Nhiều người biết đến nó từ lâu đời.";
    expect(introParts(text, "Giác hơi")).toEqual({ rest: [text] });
  });

  it("skips the statement style when the first sentence is over 220 characters", () => {
    const text = `Giác hơi ${"rất ".repeat(60)}tốt. Câu sau.`;
    expect(introParts(text, "Giác hơi")).toEqual({ rest: [text] });
  });

  it("does not split when no capital letter follows the full stop", () => {
    const text =
      "giác hơi là điều thú vị. không có chữ hoa sau dấu chấm nên không tách được đâu nhé";
    expect(introParts(text, "Giác hơi")).toEqual({ rest: [text] });
  });

  it("returns nothing for an empty description", () => {
    expect(introParts("", "Giác hơi")).toEqual({ rest: [] });
    expect(introParts(" \n ", "Giác hơi")).toEqual({ rest: [] });
  });
});
