// Owner wording from the price list footnote (the `*` services). Keep verbatim.
export const certifiedPractitionerNote =
  "Các dịch vụ trị liệu này chỉ được thực hiện và theo dõi bởi chuyên viên có chứng nhận và chứng chỉ chuyên môn.";

const vnd = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return vnd.format(amount);
}

// The English name is a subtitle on the Vietnamese page; hide it when it only repeats the title.
export function englishSubtitle({ title, englishTitle }: { title: string; englishTitle?: string }) {
  const english = englishTitle?.trim();
  if (!english) return undefined;
  return english.toLowerCase() === title.trim().toLowerCase() ? undefined : english;
}

// CMS text holds real line breaks or, from the legacy import, the two characters "\n".
export function paragraphs(text?: string) {
  return (text ?? "")
    .split(/\\n|\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}
