# Thiết kế lại trang chi tiết liệu pháp — kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/treatments/[slug]` được dựng lại theo spec đã duyệt: hero thẻ ink, dải thông tin nhanh, Giới thiệu hướng E, Dành cho ai hướng tới gì, lưới thẻ các bước, FAQ, thẻ liên quan, panel form, huy hiệu và thanh dính đáy.

**Architecture:** Logic thuần (tách câu chủ đề, dựng view model, các ô thông tin, điều kiện hiện thanh dính) nằm trong `lib/` và có test đơn vị. Trang là server component ghép các component nhỏ trong `app/treatments/[slug]/`; chỉ thanh dính là client component. CSS mới nằm trong một module mới `treatment-page.module.css`; trang chuyển sang module mới ở Task 9, nên trang cũ chạy bình thường cho tới lúc đó.

**Tech Stack:** Next.js 16 (App Router, React 19), Sanity 6.17.0, zod 4, vitest 5.

**Spec:** [`docs/superpowers/specs/2026-10-15-treatment-detail-redesign-design.md`](../specs/2026-10-15-treatment-detail-redesign-design.md) (nguồn chính). Nền: [`2026-10-15-treatment-catalog-design.md`](../specs/2026-10-15-treatment-catalog-design.md), `DESIGN.md`. Mockup tham khảo (git bỏ qua, trong workspace): `.context/mockup/unified.html`.

## Global Constraints

- Chỉ dùng token màu có sẵn: `--card #fdfaf6`, `--ink #3a2a24`, `--muted #5c4b44`, `--clay-deep #744d40`, `--clay-hover #5f3d32`, `--sage #48614c`, `--numeral #ab917e`, `--warm-band #f6efe6`, `--warm-band-2 #ede6dc`, `--hero-emphasis #e0c1af`. Không thêm tông nhạt mới.
- **Không** in nghiêng (không `<em>`, `<i>`, không `font-style: italic`); nhấn mạnh bằng màu. **Không** `box-shadow` ở nội dung. Bán kính chỉ 14/16/18 px, pill (999px), tròn (50%).
- Nhãn mono chỉ cho chú thích nhỏ (nhãn dải thông tin, dải lộ trình, liên kết quay lại), không làm eyebrow kèm tiêu đề.
- Mỗi khối chỉ hiện khi có dữ liệu thật; không bịa nội dung (FAQ, huy hiệu do owner đặt trong CMS).
- Chữ cố định đúng như bảng ở spec mục 7 (Vietnamese verbatim). Chú thích `*` dùng `certifiedPractitionerNote`.
- Một `h1` mỗi trang; thứ tự `h2` rồi `h3`; `<main id="main">`.
- Khung nội dung 1360 px: `max(24px, calc((100vw - 1360px) / 2))`; điểm ngắt 980 px và 700 px.
- Commit theo kiểu repo: `feat(treatments): ... #10`. **Không** thêm dòng `Co-Authored-By: Claude` hay "Generated with Claude Code" (memory của repo). Dùng `Refs #10`, không dùng `Closes #10`.
- Chỉ `git add` đúng file của từng task (worktree có `design-plans/*` không thuộc kế hoạch này; không bao giờ `git add -A` hoặc `git add .`).
- Next.js ở repo này có breaking changes (`AGENTS.md`): không đổi cấu trúc route ngoài các file được nêu.
- Trước khi merge: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` sạch; `docs/FRONTEND_CHECKLIST.md` cho thay đổi giao diện.

**Làm rõ so với spec (sẽ sửa lại trong spec ở Task 10):** (1) `badge` dùng danh sách thả xuống (dropdown), không dùng radio, vì radio không bỏ chọn được; (2) khớp nhấn mạnh chỉ chuẩn hoá NFC và không phân biệt hoa thường, không bỏ dấu (bỏ dấu sẽ khớp nhầm "giac hoi"); (3) nút liên hệ chỉ nâng lên bằng `--dock-h` ở mobile (≤700 px); ở desktop thanh dính đã chừa chỗ hai bên.

## Review Focus

1. **Giá bằng 0 hoặc thiếu:** không có ô giá, thanh dính không có giá (Task 4, 5, 9).
2. **Viết tắt "TP." trong đoạn đầu:** câu chủ đề không bị cắt ở "TP." (Task 3).
3. **Câu đầu quá ngắn hoặc quá dài:** không dùng kiểu câu chủ đề, không vỡ bố cục (Task 3).
4. **Liệu pháp thuộc hai nhóm:** nhãn điều kiện bỏ trùng, chặng không lặp, liệu pháp liên quan bỏ trùng và bỏ chính nó (Task 4).
5. **FAQ có mục thiếu trả lời:** mục đó bị bỏ; không còn mục nào thì không có phần FAQ (Task 1, 9).
6. **Thanh dính khi chưa hiện:** không nằm trong thứ tự Tab (`inert`) (Task 5).
7. **Hero không ảnh:** huy hiệu thành chip, không vỡ (Task 6).
8. **Không có chữ nghiêng** trong markup của trang (Task 9).

---

## Task 0: Điều kiện trước khi làm

- [ ] **Step 1: Xác nhận nhánh và baseline**

Run: `git branch --show-current && git status --short && npm test 2>&1 | grep -E "Test Files|Tests "`

Expected: nhánh `issue-10`; chỉ còn các file chưa theo dõi không thuộc kế hoạch (`design-plans/*`, hai file spec/plan mới); test xanh (260 test tại thời điểm viết).

- [ ] **Step 2: Commit spec và kế hoạch này**

```bash
git add docs/superpowers/specs/2026-10-15-treatment-detail-redesign-design.md docs/superpowers/plans/2026-10-15-treatment-detail-redesign.md
git commit -m "docs(treatments): add detail page redesign spec and plan #10"
```

---

## Task 1: Kiểu dữ liệu, zod và GROQ cho `badge` và `faqs`

**Files:**

- Modify: `lib/content.ts` (kiểu `Treatment`)
- Modify: `lib/sanity.ts` (`treatmentSchema`, truy vấn `getTreatments`)
- Test: `tests/sanity.test.ts`

**Interfaces:**

- Produces: `Treatment.badge?: TreatmentBadge`, `Treatment.faqs?: Array<{ question: string; answer: string }>`, `type TreatmentBadge = "popular" | "new"`.

- [ ] **Step 1: Viết test thất bại**

Trong `tests/sanity.test.ts`, ngay sau test `"asks Sanity for the new treatment fields"`, thêm:

```ts
it("maps the badge, falling back to the legacy isPopular flag", async () => {
  fetch.mockResolvedValue([
    { slug: "a", title: "A", badge: "new" },
    { slug: "b", title: "B", badge: "popular" },
    { slug: "c", title: "C", badge: "best-seller" },
    { slug: "d", title: "D", isPopular: true },
    { slug: "e", title: "E", badge: "new", isPopular: true },
    { slug: "f", title: "F" },
  ]);
  expect((await getTreatments()).map((t) => t.badge)).toEqual([
    "new",
    "popular",
    undefined,
    "popular",
    "new",
    undefined,
  ]);
});
it("keeps only FAQ entries that have both a question and an answer", async () => {
  fetch.mockResolvedValue([
    {
      slug: "a",
      title: "A",
      faqs: [
        { question: " Hỏi một? ", answer: " Đáp một. " },
        { question: "Thiếu đáp án?", answer: "  " },
        { question: "", answer: "Thiếu câu hỏi" },
        null,
      ],
    },
    { slug: "b", title: "B", faqs: "không phải mảng" },
  ]);
  const [a, b] = await getTreatments();
  expect(a.faqs).toEqual([{ question: "Hỏi một?", answer: "Đáp một." }]);
  expect(b.faqs).toEqual([]);
});
it("asks Sanity for the badge and FAQs", async () => {
  fetch.mockResolvedValue([]);
  await getTreatments();
  const query = String(fetch.mock.calls.at(-1)?.[0]);
  expect(query).toContain("badge");
  expect(query).toContain("faqs");
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/sanity.test.ts -t "badge|FAQ"`

Expected: FAIL (`badge` và `faqs` undefined; truy vấn thiếu trường).

- [ ] **Step 3: Cài đặt**

Trong `lib/content.ts`, ngay trên `export type Treatment = {` thêm và mở rộng:

```ts
export type TreatmentBadge = "popular" | "new";
export type TreatmentFaq = { question: string; answer: string };
```

và trong kiểu `Treatment`, thay dòng `isPopular?: boolean;` bằng:

```ts
  isPopular?: boolean;
  badge?: TreatmentBadge;
  faqs?: TreatmentFaq[];
```

Trong `lib/sanity.ts`: ngay sau `const protocolStepSchema = z.object({ ... });` thêm:

```ts
const faqSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});
```

trong `treatmentSchema`, thêm hai trường cạnh `isPopular`:

```ts
  badge: z.enum(["popular", "new"]).optional().catch(undefined),
  // One malformed entry is dropped, not the whole list.
  faqs: z
    .array(z.unknown())
    .catch([])
    .transform((items) =>
      items.flatMap((item) => {
        const parsed = faqSchema.safeParse(item);
        return parsed.success ? [parsed.data] : [];
      }),
    ),
```

và đổi phần kết thúc `const treatmentSchema = z.object({ ... });` thành có `transform` (dòng `});` cuối của object, ngay sau trường `seo`):

```ts
}).transform((treatment) => ({
  ...treatment,
  // The legacy isPopular flag reads as the "popular" badge until editors pick one.
  badge: treatment.badge ?? (treatment.isPopular ? ("popular" as const) : undefined),
}));
```

Trong truy vấn `getTreatments`, thêm `badge,"faqs":faqs[]{question,answer},` ngay sau `isPopular,`:

```ts
    `*[_type == "treatment"] | order(title asc){"slug":slug.current,title,englishTitle,requiresCertifiedPractitioner,shortDescription,description,duration,price,isPopular,badge,"faqs":faqs[]{question,answer},"image":image.asset->url,"imageAlt":image.alt,benefits,protocols,"seo":seo{title,description,"ogImage":ogImage.asset->url}}`,
```

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/sanity.test.ts && npm run typecheck`

Expected: PASS; typecheck sạch (nếu `next-env.d.ts` đổi: `git checkout next-env.d.ts`).

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts lib/sanity.ts tests/sanity.test.ts
git commit -m "feat(treatments): read badge and FAQs from Sanity #10"
```

---

## Task 2: Schema Sanity cho `badge` và `faqs`

**Files:**

- Modify: `sanity/schemaTypes/index.ts`
- Test: `tests/treatment-schema.test.ts`

**Interfaces:**

- Consumes: file test và helper `check` đã có.
- Produces: trường `badge` (dropdown, hai giá trị), `faqs` (mảng `treatmentFaq`), `isPopular` ẩn.

- [ ] **Step 1: Viết test thất bại**

Trong `tests/treatment-schema.test.ts`, trong `describe("treatment schema", ...)` thêm vào cuối:

```ts
it("offers exactly two badges and hides the legacy popular flag", () => {
  const badge = (
    treatment.fields as unknown as Array<{
      name: string;
      type: string;
      options?: { list?: Array<{ title: string; value: string }> };
      hidden?: unknown;
    }>
  ).find((f) => f.name === "badge");
  expect(badge?.type).toBe("string");
  expect(badge?.options?.list).toEqual([
    { title: "Được chọn nhiều", value: "popular" },
    { title: "Mới", value: "new" },
  ]);
  const popular = (treatment.fields as unknown as Array<{ name: string; hidden?: unknown }>).find(
    (f) => f.name === "isPopular",
  );
  expect(popular?.hidden).toBe(true);
});

it("requires both a question and an answer for each FAQ entry", async () => {
  const faq = (question?: string, answer?: string) => ({
    _key: "k1",
    _type: "treatmentFaq",
    question,
    answer,
  });
  expect((await check({ ...base, faqs: [faq("Hỏi?", "Đáp.")] })).errors).toEqual([]);
  expect((await check({ ...base, faqs: [faq("Hỏi?", undefined)] })).errors.length).toBeGreaterThan(
    0,
  );
  expect((await check({ ...base, faqs: [faq(undefined, "Đáp.")] })).errors.length).toBeGreaterThan(
    0,
  );
});

it("warns, but does not block, on more than ten FAQ entries", async () => {
  const faqs = Array.from({ length: 11 }, (_, i) => ({
    _key: `k${i}`,
    _type: "treatmentFaq",
    question: `Hỏi ${i}?`,
    answer: "Đáp.",
  }));
  const { errors, warnings } = await check({ ...base, faqs });
  expect(errors).toEqual([]);
  expect(warnings).toContain("Nên giữ tối đa 10 câu hỏi.");
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatment-schema.test.ts`

Expected: FAIL (chưa có `badge`, `faqs`, `treatmentFaq`).

- [ ] **Step 3: Cài đặt**

Trong `sanity/schemaTypes/index.ts`, ngay sau `const protocolStep = defineType({ ... });` thêm:

```ts
const treatmentFaq = defineType({
  name: "treatmentFaq",
  title: "Câu hỏi thường gặp",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Câu hỏi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Câu trả lời",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "question" } },
});
```

Trong `defineType` `treatment`: thay trường `isPopular` bằng bản ẩn, và thêm `badge` ngay sau nó:

```ts
    defineField({
      name: "isPopular",
      title: "Liệu pháp phổ biến",
      description: "Trường cũ, đã thay bằng Huy hiệu.",
      type: "boolean",
      initialValue: false,
      hidden: true,
    }),
    defineField({
      name: "badge",
      title: "Huy hiệu",
      description:
        "Chỉ bật khi có căn cứ thực tế (ví dụ số liệu lượt đặt). Chữ hiển thị cố định, không nhập tự do. Bỏ chọn để không có huy hiệu.",
      type: "string",
      options: {
        list: [
          { title: "Được chọn nhiều", value: "popular" },
          { title: "Mới", value: "new" },
        ],
      },
    }),
```

và ngay trước `defineField({ name: "seo", ... })` của `treatment` thêm:

```ts
    defineField({
      name: "faqs",
      title: "Câu hỏi thường gặp",
      description: "Tùy chọn. Chỉ hiện trên trang khi có ít nhất một câu hỏi.",
      type: "array",
      of: [defineArrayMember({ type: "treatmentFaq" })],
      validation: (rule) => rule.max(10).warning("Nên giữ tối đa 10 câu hỏi."),
    }),
```

Trong mảng `schemaTypes` (cuối file), thêm `treatmentFaq,` ngay sau `protocolStep,`.

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/treatment-schema.test.ts tests/studio-config.test.ts tests/services-schema.test.ts tests/methods-schema.test.ts`

Expected: PASS. Nếu test `max(10)` báo `warnings` không chứa chuỗi vì `validateDocument` hạ cấp quy tắc ở kiểu mảng (như đã gặp với slug), đổi assertion thành `[...errors, ...warnings]` và ghi chú lý do trong comment, như `tests/treatment-schema.test.ts` đã làm cho slug.

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/index.ts tests/treatment-schema.test.ts
git commit -m "feat(treatments): add badge and FAQ fields to the Sanity schema #10"
```

---

## Task 3: Hàm thuần tách câu chủ đề và nhấn mạnh

**Files:**

- Create: `lib/treatment-text.ts`
- Test: `tests/treatment-text.test.ts`

**Interfaces:**

- Consumes: `paragraphs` từ `lib/treatment-display.ts`.
- Produces: `type TextPart = { text: string; emphasis?: boolean }`, `emphasize(text: string, title: string): TextPart[]`, `introParts(description: string, title: string): { statement?: TextPart[]; rest: string[] }`.

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/treatment-text.test.ts`:

```ts
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
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatment-text.test.ts`

Expected: FAIL (`Failed to resolve import "@/lib/treatment-text"`).

- [ ] **Step 3: Cài đặt**

Tạo `lib/treatment-text.ts`:

```ts
import { paragraphs } from "@/lib/treatment-display";

export type TextPart = { text: string; emphasis?: boolean };

// A full stop after one of these is not the end of a sentence.
const ABBREVIATIONS = new Set(["TP", "TS", "BS", "PGS", "ThS", "Dr"]);
const MIN_STATEMENT = 40;
const MAX_STATEMENT = 220;

// Index just after the first sentence's full stop, or -1 when there is no reliable end.
function firstSentenceEnd(text: string) {
  for (const match of text.matchAll(/\.\s+(?=\p{Lu})/gu)) {
    const word = /(\S+)$/.exec(text.slice(0, match.index))?.[1] ?? "";
    if (ABBREVIATIONS.has(word)) continue;
    return match.index + 1;
  }
  return text.endsWith(".") ? text.length : -1;
}

// Emphasis is colour only (DESIGN.md): the first occurrence of the title, NFC and case-insensitive.
export function emphasize(text: string, title: string): TextPart[] {
  const source = text.normalize("NFC");
  const needle = title.normalize("NFC").trim().toLowerCase();
  const at = needle ? source.toLowerCase().indexOf(needle) : -1;
  if (at === -1) return [{ text: source }];
  return [
    { text: source.slice(0, at) },
    { text: source.slice(at, at + needle.length), emphasis: true },
    { text: source.slice(at + needle.length) },
  ].filter((part) => part.text);
}

// "Giới thiệu" (spec 4.4): the first sentence leads, the rest of the text sits in the right column.
export function introParts(
  description: string,
  title: string,
): { statement?: TextPart[]; rest: string[] } {
  const items = paragraphs(description);
  if (!items.length) return { rest: [] };
  const [first, ...others] = items;
  const end = firstSentenceEnd(first);
  const sentence = end > 0 ? first.slice(0, end).trim() : "";
  if (sentence.length < MIN_STATEMENT || sentence.length > MAX_STATEMENT) return { rest: items };
  const remainder = first.slice(end).trim();
  return {
    statement: emphasize(sentence, title),
    rest: [...(remainder ? [remainder] : []), ...others],
  };
}
```

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/treatment-text.test.ts`

Expected: PASS (11 test).

- [ ] **Step 5: Commit**

```bash
git add lib/treatment-text.ts tests/treatment-text.test.ts
git commit -m "feat(treatments): split the intro into a statement and body text #10"
```

---

## Task 4: View model của trang và các ô thông tin

**Files:**

- Create: `lib/treatment-detail.ts`
- Modify: `lib/treatment-display.ts` (thêm `factCells`)
- Test: `tests/treatment-detail.test.ts`, `tests/treatment-display.test.ts`

**Interfaces:**

- Produces: `buildTreatmentDetail(treatment, treatments, methods) → { groups, stages, conditions, related }`, `audienceNote(groupNames: string[], hasConditions: boolean): string`, `factCells(treatment): FactCell[]`.

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/treatment-detail.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { methods, treatments, type Method, type Treatment } from "@/lib/content";
import { audienceNote, buildTreatmentDetail } from "@/lib/treatment-detail";

const find = (slug: string) => treatments.find((t) => t.slug === slug)!;
const group = (name: string, filterTags: string[], slugs: string[]) =>
  ({
    group: name,
    title: `Nhóm ${name}`,
    filterTags,
    treatments: slugs.map((slug) => ({ slug, title: slug })),
  }) as unknown as Method;
const doc = (slug: string, price?: number) =>
  ({ slug, title: slug, price }) as unknown as Treatment;

describe("buildTreatmentDetail", () => {
  it("reads the group, stage, condition labels and siblings from the bundled catalogue", () => {
    const detail = buildTreatmentDetail(find("cupping"), treatments, methods);
    expect(detail.groups).toEqual([{ group: "manual", title: "Trị liệu thủ công" }]);
    expect(detail.stages).toEqual(["therapy"]);
    expect(detail.conditions).toEqual([
      "Đau mỏi cổ vai gáy",
      "Đau lưng",
      "Căng cứng cơ",
      "Khó cử động",
    ]);
    expect(detail.related.map((r) => r.slug)).toEqual([
      "dry-needling",
      "iastm",
      "tapping",
      "chiropractic-adjustment",
    ]);
  });

  it("returns nothing related when the treatment is alone in its group", () => {
    const detail = buildTreatmentDetail(find("heat-light"), treatments, methods);
    expect(detail.stages).toEqual(["recovery"]);
    expect(detail.related).toEqual([]);
  });

  it("returns empty collections when the treatment belongs to no group", () => {
    const detail = buildTreatmentDetail(doc("orphan"), [doc("orphan")], methods);
    expect(detail).toEqual({ groups: [], stages: [], conditions: [], related: [] });
  });

  it("merges two groups without repeating stages, conditions or siblings, and skips itself", () => {
    const two = [
      group("cold", ["post-workout-recovery", "muscle-stiffness"], ["a", "b"]),
      group("infrared", ["muscle-stiffness"], ["a", "c"]),
    ];
    const detail = buildTreatmentDetail(doc("a"), [doc("a"), doc("b"), doc("c")], two);
    expect(detail.groups.map((g) => g.group)).toEqual(["cold", "infrared"]);
    expect(detail.stages).toEqual(["recovery"]);
    expect(detail.conditions).toEqual(["Căng cứng cơ"]);
    expect(detail.related.map((r) => r.slug)).toEqual(["b", "c"]);
  });

  it("skips siblings with no document, drops non-positive prices and caps the list at six", () => {
    const slugs = ["me", "s1", "s2", "ghost", "s3", "s4", "s5", "s6", "s7"];
    const catalogue = [
      doc("me"),
      doc("s1", 0),
      doc("s2", 99000),
      ...["s3", "s4", "s5", "s6", "s7"].map((s) => doc(s)),
    ];
    const detail = buildTreatmentDetail(catalogue[0], catalogue, [group("manual", [], slugs)]);
    expect(detail.related.map((r) => r.slug)).toEqual(["s1", "s2", "s3", "s4", "s5", "s6"]);
    expect(detail.related[0].price).toBeUndefined();
    expect(detail.related[1].price).toBe(99000);
  });
});

describe("audienceNote", () => {
  const closing =
    "Mỗi người một khác: chuyên viên sẽ đánh giá tình trạng của bạn trước khi chọn kỹ thuật phù hợp.";

  it("names the single group the labels come from", () => {
    expect(audienceNote(["Trị liệu thủ công"], true)).toBe(
      `Nhãn "Khi bạn gặp" theo nhóm Trị liệu thủ công. ${closing}`,
    );
  });

  it("names several groups", () => {
    expect(audienceNote(["Ngâm lạnh", "Đèn hồng ngoại"], true)).toBe(
      `Nhãn "Khi bạn gặp" theo các nhóm Ngâm lạnh và Đèn hồng ngoại. ${closing}`,
    );
  });

  it("drops the group sentence when there are no condition labels", () => {
    expect(audienceNote(["Ngâm lạnh"], false)).toBe(closing);
    expect(audienceNote([], true)).toBe(closing);
  });
});
```

Trong `tests/treatment-display.test.ts`, thêm `factCells` vào import và test cuối `describe`:

```ts
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
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatment-detail.test.ts tests/treatment-display.test.ts`

Expected: FAIL (thiếu module và `factCells`).

- [ ] **Step 3: Cài đặt**

Trong `lib/treatment-display.ts`, đầu file thêm `import type { Treatment } from "@/lib/content";` và cuối file:

```ts
export type FactCell = { label: string; value: string };

// Quick-facts strip (spec 4.2): a cell exists only when its data does.
export function factCells(
  treatment: Pick<Treatment, "price" | "duration" | "protocols">,
): FactCell[] {
  const cells: FactCell[] = [];
  if (treatment.price && treatment.price > 0) {
    cells.push({ label: "Giá", value: formatPrice(treatment.price) });
  }
  const duration = treatment.duration?.trim();
  if (duration) cells.push({ label: "Thời lượng gợi ý", value: duration });
  const steps = treatment.protocols?.length ?? 0;
  if (steps) cells.push({ label: "Quy trình", value: `${steps} bước` });
  return cells;
}
```

Tạo `lib/treatment-detail.ts`:

```ts
import { methodStages, type Method, type MethodStageId, type Treatment } from "@/lib/content";
import { methodTagLabel, methodTags } from "@/lib/method-tags";

export type RelatedTreatment = { slug: string; title: string; price?: number };
export type TreatmentDetail = {
  groups: Array<{ group: Method["group"]; title: string }>;
  stages: MethodStageId[];
  conditions: string[];
  related: RelatedTreatment[];
};

const MAX_RELATED = 6;
const closing =
  "Mỗi người một khác: chuyên viên sẽ đánh giá tình trạng của bạn trước khi chọn kỹ thuật phù hợp.";

// Everything the page reads from the methods: groups, pathway stages, condition labels, siblings.
export function buildTreatmentDetail(
  treatment: Treatment,
  treatments: Treatment[],
  methods: Method[],
): TreatmentDetail {
  const own = methods.filter((method) => method.treatments.some((t) => t.slug === treatment.slug));
  const stages = methodStages
    .filter((stage) =>
      own.some((method) => (stage.groups as readonly string[]).includes(method.group)),
    )
    .map((stage) => stage.id);
  const conditions = [
    ...new Set(
      own
        .flatMap((method) => method.filterTags)
        .filter((id) => methodTags.find((tag) => tag.id === id)?.category === "condition"),
    ),
  ].map(methodTagLabel);

  const documents = new Map(treatments.map((item) => [item.slug, item]));
  const seen = new Set([treatment.slug]);
  const related: RelatedTreatment[] = [];
  for (const method of own) {
    for (const link of method.treatments) {
      if (seen.has(link.slug)) continue;
      seen.add(link.slug);
      const document = documents.get(link.slug);
      if (!document) continue;
      related.push({
        slug: document.slug,
        title: document.title,
        price: document.price && document.price > 0 ? document.price : undefined,
      });
    }
  }
  return {
    groups: own.map(({ group, title }) => ({ group, title })),
    stages,
    conditions,
    related: related.slice(0, MAX_RELATED),
  };
}

// Footnote under the "Khi bạn gặp" and "Hướng tới" rows (spec 4.5).
export function audienceNote(groupNames: string[], hasConditions: boolean) {
  if (!hasConditions || !groupNames.length) return closing;
  const source =
    groupNames.length === 1
      ? `nhóm ${groupNames[0]}`
      : `các nhóm ${groupNames.slice(0, -1).join(", ")} và ${groupNames.at(-1)}`;
  return `Nhãn "Khi bạn gặp" theo ${source}. ${closing}`;
}
```

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/treatment-detail.test.ts tests/treatment-display.test.ts && npm run typecheck`

Expected: PASS. Nếu `methods` bundled trong `lib/content.ts` có thứ tự liên kết khác danh sách kỳ vọng ở test đầu tiên, sửa danh sách kỳ vọng cho khớp dữ liệu bundled (bundled `manual` = dry-needling, cupping, iastm, tapping, chiropractic-adjustment).

- [ ] **Step 5: Commit**

```bash
git add lib/treatment-detail.ts lib/treatment-display.ts tests/treatment-detail.test.ts tests/treatment-display.test.ts
git commit -m "feat(treatments): build the detail view model and quick-facts cells #10"
```

---

## Task 5: Điều kiện hiện thanh dính, component và nút liên hệ

**Files:**

- Create: `lib/dock-visibility.ts`, `app/treatments/[slug]/treatment-dock.tsx`
- Modify: `components/chat-widgets.module.css`
- Test: `tests/dock-visibility.test.ts`, `tests/treatment-dock.test.tsx`

**Interfaces:**

- Produces: `dockVisible({ markerBottom, panelTop, viewportHeight }): boolean`; `TreatmentDock({ markerId, title, price?, duration? })` (client). Class names từ `treatment-page.module.css` sẽ có ở Task 6; ở task này tạo module rỗng có các class dock (xem Step 3).

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/dock-visibility.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { dockVisible } from "@/lib/dock-visibility";

const view = 800;

describe("dockVisible", () => {
  it("stays hidden while the marker is still on screen", () => {
    expect(dockVisible({ markerBottom: 120, panelTop: 3000, viewportHeight: view })).toBe(false);
    expect(dockVisible({ markerBottom: 0, panelTop: 3000, viewportHeight: view })).toBe(false);
  });

  it("shows once the marker has scrolled above the viewport", () => {
    expect(dockVisible({ markerBottom: -1, panelTop: 3000, viewportHeight: view })).toBe(true);
  });

  it("hides again as the form panel comes into reach", () => {
    expect(dockVisible({ markerBottom: -400, panelTop: view - 40, viewportHeight: view })).toBe(
      false,
    );
    expect(dockVisible({ markerBottom: -400, panelTop: view - 39, viewportHeight: view })).toBe(
      true,
    );
    expect(dockVisible({ markerBottom: -4000, panelTop: -200, viewportHeight: view })).toBe(false);
  });
});
```

Tạo `tests/treatment-dock.test.tsx`:

```tsx
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
    expect(html).toContain('aria-label="Tóm tắt và gửi yêu cầu tư vấn"');
    expect(html).toMatch(/<aside[^>]*\binert\b/);
    expect(html).toContain('href="#yeu-cau"');
    expect(html).toContain("Gửi yêu cầu tư vấn");
    expect(html).toContain("99.000 ₫");
    expect(html).toContain("45 phút");
  });

  it("shows only the title and the button when there is no price or duration", () => {
    const html = renderToStaticMarkup(<TreatmentDock markerId="treatment-facts" title="Tapping" />);
    expect(html).toContain("Tapping");
    expect(html).not.toContain("₫");
  });
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/dock-visibility.test.ts tests/treatment-dock.test.tsx`

Expected: FAIL (thiếu module).

- [ ] **Step 3: Cài đặt**

Tạo `lib/dock-visibility.ts`:

```ts
// The bottom dock appears once the quick-facts strip has scrolled off the top, and goes away for
// good as the booking panel comes into reach (spec 4.3).
export function dockVisible({
  markerBottom,
  panelTop,
  viewportHeight,
}: {
  markerBottom: number;
  panelTop: number;
  viewportHeight: number;
}) {
  return markerBottom < 0 && panelTop > viewportHeight - 40;
}
```

Tạo `app/treatments/[slug]/treatment-page.module.css` với nội dung tạm (sẽ được viết đầy đủ ở các task sau, đây chỉ để component biên dịch):

```css
.dock {
}
.dockShown {
}
.dockTitle {
}
.dockPrice {
}
.btn {
}
.btnPrimary {
}
```

Tạo `app/treatments/[slug]/treatment-dock.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { dockVisible } from "@/lib/dock-visibility";
import styles from "./treatment-page.module.css";

type Props = { markerId: string; title: string; price?: string; duration?: string };

export function TreatmentDock({ markerId, title, price, duration }: Props) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const marker = document.getElementById(markerId);
    const panel = document.getElementById("yeu-cau");
    if (!marker || !panel) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setShown(
        dockVisible({
          markerBottom: marker.getBoundingClientRect().bottom,
          panelTop: panel.getBoundingClientRect().top,
          viewportHeight: window.innerHeight,
        }),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [markerId]);

  // Other fixed widgets (chat buttons) read the dock's height to stay clear of it.
  useEffect(() => {
    const root = document.documentElement;
    if (shown && ref.current)
      root.style.setProperty("--dock-h", `${ref.current.offsetHeight + 12}px`);
    else root.style.removeProperty("--dock-h");
    return () => root.style.removeProperty("--dock-h");
  }, [shown]);

  return (
    <aside
      ref={ref}
      className={`${styles.dock} ${shown ? styles.dockShown : ""}`}
      aria-label="Tóm tắt và gửi yêu cầu tư vấn"
      inert={!shown}
    >
      <span className={styles.dockTitle}>{title}</span>
      {price || duration ? (
        <span className={styles.dockPrice}>
          {price ?? duration}
          {price && duration ? <small>{duration}</small> : null}
        </span>
      ) : null}
      <a className={`${styles.btn} ${styles.btnPrimary}`} href="#yeu-cau">
        Gửi yêu cầu tư vấn →
      </a>
    </aside>
  );
}
```

Trong `components/chat-widgets.module.css`, trong khối `@media (max-width: 700px)`, đổi quy tắc có cookie và thêm quy tắc cho thanh dính:

```css
@media (max-width: 700px) {
  /* Share the measured banner height so chat stays clear when cookie text wraps. */
  :global(body:has(.cookie)) .widgets {
    bottom: calc(var(--cookie-h, 134px) + 24px + var(--dock-h, 0px));
  }
  /* The treatment page's bottom dock publishes its height here. */
  .widgets {
    bottom: calc(16px + var(--dock-h, 0px));
  }
  .widgets[data-hold] {
    visibility: hidden;
    opacity: 0;
    transform: translateY(8px);
    pointer-events: none;
  }
}
```

(Quy tắc `.widgets` mới đặt **trước** `:global(body:has(.cookie)) .widgets` để quy tắc cookie có độ ưu tiên cao hơn khi có banner; nếu thứ tự hiện tại trong file khác, giữ quy tắc cookie sau quy tắc `.widgets`.)

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/dock-visibility.test.ts tests/treatment-dock.test.tsx tests/chat-widgets.test.tsx && npm run typecheck`

Expected: PASS. Nếu typecheck báo `inert` không hợp lệ trên `aside`, kiểm tra phiên bản `@types/react` (React 19 chấp nhận `inert?: boolean`).

- [ ] **Step 5: Commit**

```bash
git add lib/dock-visibility.ts "app/treatments/[slug]/treatment-dock.tsx" "app/treatments/[slug]/treatment-page.module.css" components/chat-widgets.module.css tests/dock-visibility.test.ts tests/treatment-dock.test.tsx
git commit -m "feat(treatments): add the bottom dock and its visibility rule #10"
```

---

## Task 6: Hero, dải thông tin nhanh và chú thích `*`

**Files:**

- Create: `app/treatments/[slug]/treatment-hero.tsx`, `app/treatments/[slug]/treatment-facts.tsx`
- Modify: `app/treatments/[slug]/treatment-page.module.css` (viết CSS cho hero, dải, chú thích, huy hiệu)
- Test: `tests/treatment-hero.test.tsx`

**Interfaces:**

- Consumes: `englishSubtitle`, `paragraphs`, `factCells`, `FactCell`, `certifiedPractitionerNote` (`lib/treatment-display.ts`), `methodStages`, kiểu `Treatment`.
- Produces: `TreatmentHero({ treatment, stages, phone, showPrimaryCta })`, `TreatmentFacts({ cells })` (id `treatment-facts`), `CertifiedNote()`, `BadgeMark({ badge, variant })`.

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/treatment-hero.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CertifiedNote, TreatmentFacts } from "@/app/treatments/[slug]/treatment-facts";
import { TreatmentHero } from "@/app/treatments/[slug]/treatment-hero";
import { type Treatment } from "@/lib/content";
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
const hero = (treatment: Partial<Treatment> = {}, props: { showPrimaryCta?: boolean } = {}) =>
  renderToStaticMarkup(
    <TreatmentHero
      treatment={{ ...base, ...treatment }}
      stages={["therapy"]}
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
    expect(html).toContain("← Tất cả phương pháp");
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

  it("shows no badge by default", () => {
    expect(hero()).not.toContain("data-badge");
  });
});

describe("TreatmentFacts", () => {
  it("renders one cell per fact and the call to action", () => {
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
    expect(html).toContain('href="#yeu-cau"');
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
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatment-hero.test.tsx`

Expected: FAIL (thiếu module).

- [ ] **Step 3: Cài đặt component**

Tạo `app/treatments/[slug]/treatment-hero.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import {
  methodStages,
  type MethodStageId,
  type Treatment,
  type TreatmentBadge,
} from "@/lib/content";
import { englishSubtitle, paragraphs } from "@/lib/treatment-display";
import styles from "./treatment-page.module.css";

const badgeText: Record<TreatmentBadge, string> = { popular: "Được chọn nhiều", new: "Mới" };

export function BadgeMark({
  badge,
  variant,
}: {
  badge: TreatmentBadge;
  variant: "stamp" | "chip";
}) {
  return (
    <span
      className={`${variant === "stamp" ? styles.badge : styles.badgeChip} ${badge === "new" ? styles.badgeNew : ""}`}
      data-badge={badge}
      data-variant={variant}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {badge === "popular" ? (
          <path d="M5 12.5 10 17.5 19 7" />
        ) : (
          <>
            <path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Z" />
            <path d="M4 20 14 10" />
          </>
        )}
      </svg>
      <span>{badgeText[badge]}</span>
    </span>
  );
}

type Props = {
  treatment: Treatment;
  stages: MethodStageId[];
  phone: string;
  showPrimaryCta: boolean;
};

export function TreatmentHero({ treatment, stages, phone, showPrimaryCta }: Props) {
  const subtitle = englishSubtitle(treatment);
  const lede = paragraphs(treatment.shortDescription || treatment.description);
  const { badge, image } = treatment;
  return (
    <>
      <Link className={styles.back} href="/treatments">
        ← Tất cả phương pháp
      </Link>
      <section
        className={styles.hero}
        aria-label={treatment.title}
        data-plain={image ? undefined : ""}
      >
        <div className={styles.heroCard}>
          {image ? (
            <>
              <div className={styles.heroPhoto}>
                <Image
                  src={image}
                  alt={treatment.imageAlt ?? treatment.title}
                  fill
                  priority
                  sizes="(max-width: 760px) 100vw, 1360px"
                />
              </div>
              <div className={styles.heroScrim} aria-hidden="true" />
            </>
          ) : null}
          <div className={styles.heroContent}>
            {badge && !image ? <BadgeMark badge={badge} variant="chip" /> : null}
            <h1>{treatment.title}</h1>
            {subtitle ? (
              <p className={styles.subtitle} lang="en">
                {subtitle}
              </p>
            ) : null}
            {lede.map((text, index) => (
              <p className={styles.lede} key={index}>
                {text}
              </p>
            ))}
            <div className={styles.heroActions} id="treatment-hero-actions">
              {showPrimaryCta ? (
                <a className={`${styles.btn} ${styles.btnLight}`} href="#yeu-cau">
                  Gửi yêu cầu tư vấn →
                </a>
              ) : null}
              <a
                className={`${styles.btn} ${styles.btnOutline}`}
                href={`tel:${phone.replaceAll(" ", "")}`}
              >
                Gọi {phone}
              </a>
            </div>
          </div>
          {badge && image ? <BadgeMark badge={badge} variant="stamp" /> : null}
          {stages.length ? (
            <div className={styles.ribbon} aria-label="Lộ trình">
              <span className={styles.ribbonLabel}>Lộ trình</span>
              {methodStages.map((stage, index) => (
                <span className={styles.ribbonStep} key={stage.id}>
                  {index > 0 ? <span className={styles.ribbonLine} aria-hidden="true" /> : null}
                  <span className={stages.includes(stage.id) ? styles.stageOn : styles.stage}>
                    <span className={styles.stageDot} aria-hidden="true" />
                    {stage.title}
                  </span>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
```

Tạo `app/treatments/[slug]/treatment-facts.tsx`:

```tsx
import type { CSSProperties } from "react";
import { certifiedPractitionerNote, type FactCell } from "@/lib/treatment-display";
import styles from "./treatment-page.module.css";

export function TreatmentFacts({ cells }: { cells: FactCell[] }) {
  if (!cells.length) return null;
  return (
    <section
      className={styles.facts}
      id="treatment-facts"
      aria-label="Thông tin nhanh"
      style={{ "--cells": cells.length } as CSSProperties}
    >
      {cells.map((cell) => (
        <div className={styles.factCell} key={cell.label}>
          <span className={styles.factLabel}>{cell.label}</span>
          <span className={styles.factValue}>{cell.value}</span>
        </div>
      ))}
      <div className={styles.factCta}>
        <a className={`${styles.btn} ${styles.btnPrimary}`} href="#yeu-cau">
          Gửi yêu cầu tư vấn →
        </a>
      </div>
    </section>
  );
}

export function CertifiedNote() {
  return <p className={styles.cert}>{certifiedPractitionerNote}</p>;
}
```

- [ ] **Step 4: Viết CSS (thay nội dung tạm của `treatment-page.module.css` bằng khối này; các task sau thêm tiếp ở cuối file)**

```css
/* Treatment detail page. Tokens and patterns follow DESIGN.md: flat, no italics, radii 14/16/18/pill. */
.root {
  --card: #fdfaf6;
  --ink: #3a2a24;
  --muted: #5c4b44;
  --clay-deep: #744d40;
  --clay-hover: #5f3d32;
  --sage: #48614c;
  --numeral: #ab917e;
  --warm-band: #f6efe6;
  --warm-band-2: #ede6dc;
  --hero-emphasis: #e0c1af;
  --line: rgba(58, 42, 36, 0.16);
  --frame: max(24px, calc((100vw - 1360px) / 2));
  color: var(--ink);
  background: var(--card);
  font-family: var(--font-accent);
  font-weight: 300;
  line-height: 1.75;
  overflow: clip;
}
.root h1,
.root h2,
.root h3 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 300;
  letter-spacing: -0.015em;
  text-wrap: pretty;
  color: var(--ink);
}
.root p {
  margin: 0;
}
.root :focus-visible {
  outline: 2px solid var(--clay-deep);
  outline-offset: 3px;
}

/* ---------- Buttons: full pills ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 999px;
  padding: 14px 26px;
  font: 400 15.5px/1 var(--font-accent);
  white-space: nowrap;
  text-decoration: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}
.btnPrimary {
  background: var(--clay-deep);
  color: #f7f3f0;
}
.btnPrimary:hover {
  background: var(--clay-hover);
}
.btnLight {
  background: #f7f3f0;
  color: var(--ink);
}
.btnLight:hover {
  background: var(--clay-deep);
  color: #fff;
}
.btnOutline {
  border: 1px solid rgba(247, 243, 240, 0.4);
  color: #f7f3f0;
}
.btnOutline:hover {
  border-color: #fff;
}

/* ---------- Hero: same card as /treatments ---------- */
.back {
  display: block;
  padding: 16px var(--frame) 12px;
  color: var(--clay-deep);
  font:
    500 11px/1.2 var(--font-mono),
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
}
.hero {
  padding: 6px var(--frame) 0;
}
.heroCard {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 420px;
  border-radius: 18px;
  overflow: hidden;
  background: var(--ink);
}
.heroPhoto {
  position: absolute;
  inset: 0;
}
.heroPhoto img {
  object-fit: cover;
}
.heroScrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      0deg,
      rgba(58, 42, 36, 0.85) 0,
      rgba(58, 42, 36, 0.75) 80px,
      rgba(58, 42, 36, 0) 160px
    ),
    linear-gradient(
      95deg,
      rgba(58, 42, 36, 0.82) 0%,
      rgba(58, 42, 36, 0.69) min(620px, 88%),
      rgba(58, 42, 36, 0.15) 100%
    );
  pointer-events: none;
}
.heroContent {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
  padding: 56px 64px 100px;
}
.heroContent h1 {
  font-size: clamp(2rem, 5vw, 56px);
  line-height: 1.1;
  color: #f7f3f0;
}
.subtitle {
  margin-top: -6px;
  font: 300 clamp(1.1rem, 2.2vw, 24px) / 1.2 var(--font-display);
  color: var(--hero-emphasis);
}
.lede {
  max-width: 520px;
  font-size: 17px;
  line-height: 1.6;
  color: rgba(247, 243, 240, 0.82);
}
.heroActions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
}
.ribbon {
  position: absolute;
  left: 64px;
  right: 64px;
  bottom: 26px;
  display: flex;
  align-items: center;
  color: rgba(247, 243, 240, 0.85);
  font-size: 14px;
}
.ribbonLabel {
  margin-right: 18px;
  color: var(--hero-emphasis);
  font:
    500 10.5px var(--font-mono),
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.ribbonStep {
  display: flex;
  align-items: center;
}
.ribbonLine {
  width: 56px;
  height: 1px;
  margin: 0 12px;
  background: rgba(224, 193, 175, 0.5);
}
.stage,
.stageOn {
  display: flex;
  align-items: center;
  gap: 8px;
}
.stageOn {
  color: #fff;
}
.stageDot {
  width: 9px;
  height: 9px;
  border: 1px solid var(--hero-emphasis);
  border-radius: 50%;
}
.stageOn .stageDot {
  background: var(--hero-emphasis);
}

/* ---------- Badge: tilted round stamp over a photo, a pill chip without one ---------- */
.badge {
  position: absolute;
  top: 36px;
  right: 56px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 4px;
  width: 108px;
  height: 108px;
  padding: 12px;
  border-radius: 50%;
  background: var(--clay-deep);
  color: #f7f3f0;
  text-align: center;
  transform: rotate(-8deg);
  font: 300 15.5px/1.15 var(--font-display);
}
.badgeNew {
  background: var(--sage);
}
.badge svg,
.badgeChip svg {
  width: 20px;
  height: 20px;
  stroke: var(--hero-emphasis);
  fill: none;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.badgeChip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px 7px 12px;
  border-radius: 999px;
  background: var(--clay-deep);
  color: #f7f3f0;
  font: 400 14px/1 var(--font-accent);
}
.badgeChip svg {
  width: 16px;
  height: 16px;
}

/* ---------- Quick facts: unboxed strip like the homepage quick-link strip ---------- */
.facts {
  display: grid;
  grid-template-columns: repeat(var(--cells, 3), minmax(0, 1fr)) auto;
  align-items: center;
  margin: 0 var(--frame);
  border-bottom: 1px solid var(--line);
}
.factCell {
  padding: 20px 24px;
  border-right: 1px solid var(--line);
}
.factLabel {
  display: block;
  margin-bottom: 4px;
  color: var(--muted);
  font:
    500 11px var(--font-mono),
    monospace;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.factValue {
  font: 300 clamp(1.5rem, 2.4vw, 32px) / 1.15 var(--font-display);
}
.factCta {
  padding-left: 24px;
}
.cert {
  margin: 14px var(--frame) 0;
  padding: 14px 22px;
  border-radius: 14px;
  background: var(--warm-band);
  color: var(--muted);
  font-size: 15px;
}

@media (max-width: 700px) {
  .heroCard {
    min-height: 520px;
  }
  .heroContent {
    padding: 30px 22px 110px;
  }
  .badge {
    top: 16px;
    right: 16px;
    width: 88px;
    height: 88px;
    font-size: 13px;
  }
  .ribbon {
    left: 22px;
    right: 22px;
    flex-wrap: wrap;
    row-gap: 8px;
  }
  .ribbonLabel {
    display: none;
  }
  .ribbonLine {
    width: 18px;
    margin: 0 6px;
  }
  .facts {
    grid-template-columns: 1fr 1fr;
    margin: 0 12px;
  }
  .factCell {
    padding: 14px 12px;
    border-bottom: 1px solid var(--line);
  }
  .factCell:nth-child(2n) {
    border-right: 0;
  }
  .factCell:last-of-type {
    grid-column: 1 / -1;
    border-right: 0;
  }
  .factCta {
    grid-column: 1 / -1;
    padding: 14px 0;
  }
  .factCta .btn {
    width: 100%;
    justify-content: center;
  }
}
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
```

Giữ các quy tắc rỗng `.dock`, `.dockShown`, `.dockTitle`, `.dockPrice` ở cuối file (Task 8 viết đầy đủ).

- [ ] **Step 5: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/treatment-hero.test.tsx && npm run typecheck && npx eslint "app/treatments/[slug]" tests/treatment-hero.test.tsx --max-warnings 0`

Expected: PASS và sạch. (Nếu `--cells:3` xuất hiện trong markup với khoảng trắng khác, chỉnh assertion theo markup thực tế: React ghi `--cells:3`.)

- [ ] **Step 6: Commit**

```bash
git add "app/treatments/[slug]/treatment-hero.tsx" "app/treatments/[slug]/treatment-facts.tsx" "app/treatments/[slug]/treatment-page.module.css" tests/treatment-hero.test.tsx
git commit -m "feat(treatments): add the hero, quick-facts strip and badge #10"
```

---

## Task 7: Các phần nội dung (Giới thiệu, Dành cho ai, các bước, FAQ, liên quan)

**Files:**

- Create: `app/treatments/[slug]/section-head.tsx`, `treatment-intro.tsx`, `treatment-audience.tsx`, `treatment-steps.tsx`, `treatment-faq.tsx`, `treatment-related.tsx` (đều trong `app/treatments/[slug]/`)
- Modify: `app/treatments/[slug]/treatment-page.module.css` (thêm CSS các phần)
- Test: `tests/treatment-sections.test.tsx`

**Interfaces:**

- Consumes: `introParts`, `audienceNote`, `RelatedTreatment`, `formatPrice`, `paragraphs`, `ProtocolStep`, `TreatmentFaq`.
- Produces: `SectionHead({ id, children })`, `TreatmentIntro({ title, description })`, `TreatmentAudience({ conditions, benefits, groupNames })`, `TreatmentSteps({ protocols })`, `TreatmentFaqList({ faqs })`, `TreatmentRelated({ related })`.

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/treatment-sections.test.tsx`:

```tsx
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
  it("shows both rows as tags with the group footnote", () => {
    const html = renderToStaticMarkup(
      <TreatmentAudience
        conditions={["Đau lưng", "Căng cứng cơ"]}
        benefits={["Giảm đau tự nhiên"]}
        groupNames={["Trị liệu thủ công"]}
      />,
    );
    expect(html).toContain("Dành cho ai, hướng tới gì");
    expect(html).toContain("Khi bạn gặp");
    expect(html).toContain("Đau lưng");
    expect(html).toContain("Hướng tới");
    expect(html).toContain("Giảm đau tự nhiên");
    expect(html).toContain('Nhãn "Khi bạn gặp" theo nhóm Trị liệu thủ công.');
    expect(html).toContain("Mỗi người một khác");
  });

  it("omits an empty row and the group sentence", () => {
    const html = renderToStaticMarkup(
      <TreatmentAudience conditions={[]} benefits={["Thư giãn"]} groupNames={["Ngâm lạnh"]} />,
    );
    expect(html).not.toContain("Khi bạn gặp");
    expect(html).not.toContain("Nhãn");
    expect(html).toContain("Hướng tới");
  });

  it("renders nothing without conditions and benefits", () => {
    expect(
      renderToStaticMarkup(<TreatmentAudience conditions={[]} benefits={[]} groupNames={[]} />),
    ).toBe("");
  });
});

describe("TreatmentSteps", () => {
  it("renders an ordered list of cards in the given order with two-digit numerals", () => {
    const html = renderToStaticMarkup(
      <TreatmentSteps
        protocols={[
          { step: 1, title: "Bước một", description: "Mô tả một" },
          { step: 2, title: "Bước hai", description: "" },
        ]}
      />,
    );
    expect(html).toContain("Một buổi diễn ra thế nào");
    expect(html).toContain("<ol");
    expect(html).toContain("01");
    expect(html).toContain("02");
    expect(html).toContain("Bước một");
    expect(html).toContain("Mô tả một");
    expect(html.indexOf("Bước một")).toBeLessThan(html.indexOf("Bước hai"));
    expect(html.match(/<p/g)).toHaveLength(1);
  });

  it("renders nothing without steps", () => {
    expect(renderToStaticMarkup(<TreatmentSteps protocols={[]} />)).toBe("");
  });
});

describe("TreatmentFaqList", () => {
  it("renders closed details with a question and a paragraph per line of the answer", () => {
    const html = renderToStaticMarkup(
      <TreatmentFaqList faqs={[{ question: "Hỏi?", answer: "Đáp một.\n\nĐáp hai." }]} />,
    );
    expect(html).toContain("Câu hỏi thường gặp");
    expect(html).toContain("<details");
    expect(html).not.toContain("<details open");
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
    expect(html).toContain("Có thể bạn quan tâm");
    expect(html).toContain('href="/treatments/iastm"');
    expect(html).toContain('href="/treatments/tapping"');
    expect(html.match(/199\.000/g)).toHaveLength(1);
    expect(html).toContain('href="/treatments"');
    expect(html).toContain("Xem tất cả phương pháp");
  });

  it("renders nothing without siblings", () => {
    expect(renderToStaticMarkup(<TreatmentRelated related={[]} />)).toBe("");
  });
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatment-sections.test.tsx`

Expected: FAIL (thiếu module).

- [ ] **Step 3: Cài đặt component**

`app/treatments/[slug]/section-head.tsx`:

```tsx
import type { ReactNode } from "react";
import styles from "./treatment-page.module.css";

// One section heading everywhere on the page: sage h2 with a hairline that runs on (homepage `.stepsHead`).
export function SectionHead({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className={styles.head}>
      <h2 id={id}>{children}</h2>
      <span className={styles.rule} aria-hidden="true" />
    </div>
  );
}
```

`treatment-intro.tsx`:

```tsx
import { introParts } from "@/lib/treatment-text";
import { SectionHead } from "./section-head";
import styles from "./treatment-page.module.css";

export function TreatmentIntro({ title, description }: { title: string; description: string }) {
  const { statement, rest } = introParts(description, title);
  if (!statement && !rest.length) return null;
  const body = rest.map((text, index) => <p key={index}>{text}</p>);
  return (
    <section className={styles.sec} aria-labelledby="gioi-thieu">
      <SectionHead id="gioi-thieu">Giới thiệu</SectionHead>
      {statement ? (
        <div className={styles.intro}>
          <p className={styles.statement}>
            {statement.map((part, index) =>
              part.emphasis ? <b key={index}>{part.text}</b> : <span key={index}>{part.text}</span>,
            )}
          </p>
          {rest.length ? <div className={styles.introText}>{body}</div> : null}
        </div>
      ) : (
        <div className={styles.introPlain}>{body}</div>
      )}
    </section>
  );
}
```

`treatment-audience.tsx`:

```tsx
import { audienceNote } from "@/lib/treatment-detail";
import { SectionHead } from "./section-head";
import styles from "./treatment-page.module.css";

function TagRow({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className={styles.tagRow}>
      <span className={styles.tagLabel}>{label}</span>
      <ul className={styles.tagPills}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

type Props = { conditions: string[]; benefits: string[]; groupNames: string[] };

export function TreatmentAudience({ conditions, benefits, groupNames }: Props) {
  if (!conditions.length && !benefits.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="danh-cho-ai">
      <SectionHead id="danh-cho-ai">Dành cho ai, hướng tới gì</SectionHead>
      <div>
        <TagRow label="Khi bạn gặp" items={conditions} />
        <TagRow label="Hướng tới" items={benefits} />
      </div>
      <p className={styles.note}>{audienceNote(groupNames, conditions.length > 0)}</p>
    </section>
  );
}
```

`treatment-steps.tsx`:

```tsx
import type { ProtocolStep } from "@/lib/content";
import { SectionHead } from "./section-head";
import styles from "./treatment-page.module.css";

export function TreatmentSteps({ protocols }: { protocols: ProtocolStep[] }) {
  if (!protocols.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="buoi-tri-lieu">
      <SectionHead id="buoi-tri-lieu">Một buổi diễn ra thế nào</SectionHead>
      <ol className={styles.stepsGrid}>
        {protocols.map((protocol, index) => (
          <li className={styles.stepCard} key={`${protocol.step}-${index}`}>
            <span className={styles.stepNumeral} aria-hidden="true">
              {String(protocol.step).padStart(2, "0")}
            </span>
            <h3>{protocol.title}</h3>
            {protocol.description ? <p>{protocol.description}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
```

`treatment-faq.tsx`:

```tsx
import type { TreatmentFaq } from "@/lib/content";
import { paragraphs } from "@/lib/treatment-display";
import { SectionHead } from "./section-head";
import styles from "./treatment-page.module.css";

export function TreatmentFaqList({ faqs }: { faqs: TreatmentFaq[] }) {
  if (!faqs.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="cau-hoi">
      <SectionHead id="cau-hoi">Câu hỏi thường gặp</SectionHead>
      <div className={styles.faq}>
        {faqs.map((faq, index) => (
          <details key={index}>
            <summary>{faq.question}</summary>
            {paragraphs(faq.answer).map((text, line) => (
              <p key={line}>{text}</p>
            ))}
          </details>
        ))}
      </div>
    </section>
  );
}
```

`treatment-related.tsx`:

```tsx
import Link from "next/link";
import type { RelatedTreatment } from "@/lib/treatment-detail";
import { formatPrice } from "@/lib/treatment-display";
import { SectionHead } from "./section-head";
import styles from "./treatment-page.module.css";

export function TreatmentRelated({ related }: { related: RelatedTreatment[] }) {
  if (!related.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="co-the-ban-quan-tam">
      <SectionHead id="co-the-ban-quan-tam">Có thể bạn quan tâm</SectionHead>
      <ul className={styles.cards}>
        {related.map((item) => (
          <li key={item.slug}>
            <Link className={styles.cardLink} href={`/treatments/${item.slug}`}>
              <h3>{item.title}</h3>
              <span className={styles.cardMeta}>
                {item.price ? <b>{formatPrice(item.price)}</b> : <span />}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link className={styles.all} href="/treatments">
        Xem tất cả phương pháp →
      </Link>
    </section>
  );
}
```

- [ ] **Step 4: Thêm CSS các phần vào cuối `treatment-page.module.css`** (trước các quy tắc rỗng `.dock*`, hoặc sau, miễn không trùng)

```css
/* ---------- Sections: one heading pattern (sage h2 + running hairline) ---------- */
.sec {
  display: flex;
  flex-direction: column;
  gap: 34px;
  padding: 80px var(--frame) 0;
}
.head {
  display: flex;
  align-items: baseline;
  gap: 20px;
}
.head h2 {
  max-width: 760px;
  font-size: clamp(1.6rem, 3vw, 36px);
  color: var(--sage);
  text-wrap: balance;
}
.rule {
  flex: 1;
  height: 1px;
  background: var(--line);
}

/* Intro: statement left, body text right. Emphasis is colour, never italic. */
.intro {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 64px;
  align-items: start;
}
.statement {
  font: 300 clamp(1.7rem, 3vw, 40px) / 1.25 var(--font-display);
}
.statement b {
  font-weight: 300;
  color: var(--clay-deep);
}
.introText p,
.introPlain p {
  color: var(--muted);
  font-size: 17px;
}
.introText p + p,
.introPlain p + p {
  margin-top: 16px;
}
.introPlain {
  max-width: 720px;
}

/* Tags: same rows as the Methods page */
.tagRow {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  gap: 4px 12px;
  align-items: start;
}
.tagRow + .tagRow {
  margin-top: 14px;
}
.tagLabel {
  padding-top: 8px;
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.5;
}
.tagPills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.tagPills li {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 18px;
  border-radius: 999px;
  background: var(--warm-band);
  color: var(--muted);
  font-size: 15px;
}
.note {
  max-width: 720px;
  margin-top: -10px;
  color: var(--muted);
  font-size: 15px;
}

/* Steps: same cards as the homepage pathway */
.stepsGrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.stepCard {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 30px 28px;
  border-radius: 14px;
  background: var(--warm-band-2);
}
.stepNumeral {
  font: 200 36px / 1 var(--font-display);
  color: var(--clay-deep);
}
.stepCard h3 {
  font: 400 21px/1.3 var(--font-display);
}
.stepCard p {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.7;
}

/* FAQ */
.faq details {
  border-bottom: 1px solid var(--line);
}
.faq details:first-child {
  border-top: 1px solid var(--line);
}
.faq summary {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 0;
  font: 300 clamp(1.15rem, 1.8vw, 22px) / 1.4 var(--font-display);
  list-style: none;
  cursor: pointer;
}
.faq summary::-webkit-details-marker {
  display: none;
}
.faq summary::after {
  content: "+";
  color: var(--clay-deep);
  font: 200 28px / 1 var(--font-display);
}
.faq details[open] summary::after {
  content: "–";
}
.faq details p {
  max-width: 640px;
  padding-bottom: 22px;
  color: var(--muted);
}

/* Related: index cards (Services pattern) */
.cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cardLink {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 26px;
  min-height: 164px;
  padding: 24px;
  border: 1px solid rgba(58, 42, 36, 0.14);
  border-radius: 16px;
  background: #fff;
  color: inherit;
  text-decoration: none;
  transition: background 0.2s ease;
}
.cardLink:hover {
  background: var(--warm-band);
}
.cardLink h3 {
  font: 300 clamp(1.3rem, 1.8vw, 24px) / 1.2 var(--font-display);
}
.cardMeta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: var(--clay-deep);
  font-size: 15px;
}
.cardMeta b {
  font: 300 19px var(--font-display);
}
.all {
  align-self: flex-start;
  border-bottom: 1px solid rgba(116, 77, 64, 0.4);
  color: var(--clay-deep);
  font-size: 15.5px;
  text-decoration: none;
}

@media (max-width: 980px) {
  .intro {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .stepsGrid,
  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .sec {
    gap: 24px;
    padding-top: 52px;
  }
  .tagRow {
    grid-template-columns: 1fr;
  }
  .tagLabel {
    padding-top: 0;
  }
  .stepsGrid,
  .cards {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  .cardLink {
    transition: none;
  }
}
```

- [ ] **Step 5: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/treatment-sections.test.tsx && npm run typecheck && npx eslint "app/treatments/[slug]" tests/treatment-sections.test.tsx --max-warnings 0`

Expected: PASS và sạch.

- [ ] **Step 6: Commit**

```bash
git add "app/treatments/[slug]" tests/treatment-sections.test.tsx
git commit -m "feat(treatments): add the intro, audience, steps, FAQ and related sections #10"
```

---

## Task 8: Panel form và CSS thanh dính

**Files:**

- Create: `app/treatments/[slug]/booking-panel.tsx`
- Modify: `app/treatments/[slug]/treatment-page.module.css`
- Test: `tests/booking-panel.test.tsx`

**Interfaces:**

- Consumes: `LeadForm`.
- Produces: `BookingPanel({ title })`.

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/booking-panel.test.tsx`:

```tsx
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BookingPanel } from "@/app/treatments/[slug]/booking-panel";
import { LeadForm } from "@/components/lead-form";

const find = (node: unknown): ReactElement<{ treatment?: string; kind?: string }> | undefined => {
  if (!node || typeof node !== "object") return undefined;
  const element = node as { type?: unknown; props?: { children?: unknown } };
  if (element.type === LeadForm) return element as never;
  return [element.props?.children].flat(Infinity).map(find).find(Boolean);
};

describe("BookingPanel", () => {
  it("hands the treatment title to the callback form", () => {
    const form = find(BookingPanel({ title: "Giác hơi" }));
    expect(form?.props).toMatchObject({ kind: "booking", treatment: "Giác hơi" });
  });

  it("is the anchor target with the approved wording and no booking promise", () => {
    const html = renderToStaticMarkup(<BookingPanel title="Giác hơi" />);
    expect(html).toContain('id="yeu-cau"');
    expect(html).toContain("Muốn biết liệu pháp này có phù hợp với bạn?");
    expect(html).toContain(
      "Để lại tên và số điện thoại. Holistic sẽ gọi lại để trao đổi và xác nhận thời gian; đây chưa phải lịch hẹn.",
    );
  });
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/booking-panel.test.tsx`

Expected: FAIL (thiếu module).

- [ ] **Step 3: Cài đặt**

`app/treatments/[slug]/booking-panel.tsx`:

```tsx
import { LeadForm } from "@/components/lead-form";
import styles from "./treatment-page.module.css";

export function BookingPanel({ title }: { title: string }) {
  return (
    <section className={styles.panel} id="yeu-cau" aria-labelledby="yeu-cau-title">
      <div>
        <h2 id="yeu-cau-title">Muốn biết liệu pháp này có phù hợp với bạn?</h2>
        <p>
          Để lại tên và số điện thoại. Holistic sẽ gọi lại để trao đổi và xác nhận thời gian; đây
          chưa phải lịch hẹn.
        </p>
      </div>
      <LeadForm kind="booking" treatment={title} />
    </section>
  );
}
```

Trong `treatment-page.module.css`, **thay** các quy tắc rỗng `.dock`, `.dockShown`, `.dockTitle`, `.dockPrice` bằng đầy đủ và thêm panel + form (giữ `.btn`, `.btnPrimary` ở trên, xoá bản rỗng trùng nếu còn):

```css
/* ---------- Booking panel: linen panel, 18px ---------- */
.panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  margin: 80px var(--frame) 96px;
  padding: 48px;
  border-radius: 18px;
  background: var(--warm-band);
  scroll-margin-top: 96px;
}
.panel h2 {
  font-size: clamp(1.6rem, 3vw, 36px);
  line-height: 1.2;
  color: var(--sage);
}
.panel p {
  max-width: 440px;
  margin-top: 14px;
  color: var(--muted);
}

/* ---------- Dock: floating pill like the scrolled nav pill, hairline, no shadow ---------- */
.dock {
  position: fixed;
  left: 50%;
  bottom: calc(16px + var(--cookie-h, 0px));
  z-index: 70;
  display: flex;
  align-items: center;
  gap: 18px;
  width: min(820px, calc(100% - 192px));
  padding: 8px 8px 8px 26px;
  border: 1px solid rgba(58, 42, 36, 0.2);
  border-radius: 999px;
  background: rgba(253, 250, 246, 0.96);
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 140%);
  transition:
    transform 0.35s ease,
    opacity 0.25s ease,
    visibility 0.35s;
}
.dockShown {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, 0);
}
.dockTitle {
  min-width: 0;
  overflow: hidden;
  font: 300 19px/1.2 var(--font-display);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dockPrice {
  margin-left: auto;
  text-align: right;
  font: 300 24px/1 var(--font-display);
}
.dockPrice small {
  display: block;
  margin-top: 3px;
  color: var(--clay-deep);
  font:
    500 10px var(--font-mono),
    monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.dock .btn {
  padding: 11px 20px;
  font-size: 14.5px;
}

@media (max-width: 980px) {
  .panel {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 28px 20px;
  }
}
@media (max-width: 700px) {
  .dock {
    left: 10px;
    right: 10px;
    bottom: calc(10px + var(--cookie-h, 0px) + env(safe-area-inset-bottom, 0px));
    width: auto;
    gap: 10px;
    padding: 8px 8px 8px 20px;
    transform: translateY(140%);
  }
  .dockShown {
    transform: none;
  }
  .dockTitle {
    display: none;
  }
  .dockPrice {
    margin: 0;
    text-align: left;
    font-size: 22px;
  }
  .dock .btn {
    margin-left: auto;
    padding: 11px 16px;
    font-size: 14px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .dock {
    transition: none;
  }
}

/* ---------- Lead form (scoped: /contact and /booking keep the global look) ---------- */
.root :global(.lead-form) :global(.button) {
  border-radius: 999px;
  border-color: var(--clay-deep);
  background: var(--clay-deep);
  color: #f7f3f0;
}
.root :global(.lead-form) :global(.button:hover) {
  border-color: var(--clay-hover);
  background: var(--clay-hover);
  transform: none;
}
.root :global(.lead-form) :global(.button:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}
.root :global(.lead-form) input,
.root :global(.lead-form) textarea,
.root :global(.lead-form) select {
  border: 1px solid rgba(58, 42, 36, 0.25);
  border-radius: 10px;
  background: #fff;
}
.root :global(.lead-form) input:focus,
.root :global(.lead-form) textarea:focus,
.root :global(.lead-form) select:focus {
  border-color: var(--clay-deep);
  box-shadow: none;
  outline: 2px solid var(--clay-deep);
  outline-offset: 2px;
}
.root :global(.lead-form__details) summary:focus-visible {
  outline-color: var(--clay-deep);
}
.root :global(.form-message) {
  color: var(--clay-deep);
}
```

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/booking-panel.test.tsx tests/treatment-dock.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "app/treatments/[slug]/booking-panel.tsx" "app/treatments/[slug]/treatment-page.module.css" tests/booking-panel.test.tsx
git commit -m "feat(treatments): add the booking panel and dock styles #10"
```

---

## Task 9: Ghép trang và viết lại test trang

**Files:**

- Modify: `app/treatments/[slug]/page.tsx`
- Delete: `app/treatments/[slug]/treatment-detail.module.css`
- Modify: `tests/sanity.test.ts` (bỏ khối test trang cũ)
- Create: `tests/treatment-detail-page.test.tsx`

**Interfaces:**

- Consumes: mọi component, `buildTreatmentDetail`, `factCells`, `getTreatments`, `getMethods`, `getPublicSiteData`.

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/treatment-detail-page.test.tsx`:

```tsx
import { beforeEach, describe, expect, it, vi } from "vitest";
const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch }) }));
vi.mock("@/sanity/env", () => ({
  projectId: "configured-project",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
import { renderToStaticMarkup } from "react-dom/server";
import TreatmentPage, { generateMetadata } from "@/app/treatments/[slug]/page";

const cdn = "https://cdn.sanity.io/images/p/d/";
const sentence =
  "Giác hơi là một phương pháp trị liệu cổ xưa có nguồn gốc từ y học cổ truyền Trung Quốc và các nền văn hóa khác trên thế giới.";
const full = {
  slug: "cupping",
  title: "Giác hơi",
  englishTitle: "Cupping",
  requiresCertifiedPractitioner: false,
  shortDescription: "Mô tả ngắn của giác hơi.",
  description: `${sentence} Liệu pháp này dùng cốc.\n\nĐoạn hai.`,
  duration: "45 phút",
  price: 99000,
  badge: "popular",
  image: `${cdn}a.jpg`,
  benefits: ["Giảm đau tự nhiên", "Thư giãn sâu"],
  protocols: [
    { step: 2, title: "Bước hai", description: "Mô tả hai" },
    { step: 1, title: "Bước một", description: "Mô tả một" },
  ],
  faqs: [
    { question: "Hỏi một?", answer: "Đáp một." },
    { question: "Thiếu đáp án?", answer: " " },
  ],
  seo: { title: "SEO title", description: "SEO description", ogImage: `${cdn}og.jpg` },
};
const sibling = (slug: string, title: string, price?: number) => ({ slug, title, price });
const method = (group: string, extra = {}) => ({
  group,
  title: `Nhóm ${group}`,
  indexSubtitle: `Phụ ${group}`,
  body: `Nội dung ${group}`,
  tags: [],
  filterTags: [],
  image: `${cdn}${group}.jpg`,
  imageAlt: `Ảnh ${group}`,
  treatments: [],
  ...extra,
});
const manual = method("manual", {
  title: "Trị liệu thủ công",
  filterTags: ["back-pain", "pain-relief"],
  treatments: [
    { slug: "cupping", title: "Giác hơi" },
    { slug: "iastm", title: "IASTM" },
    { slug: "ghost", title: "Không có document" },
  ],
});

type Fixture = { treatments?: object[]; methods?: object[] | "fail" };
const serve = ({
  treatments = [full, sibling("iastm", "IASTM", 199000)],
  methods = [manual],
}: Fixture = {}) =>
  fetch.mockImplementation(async (query: string) => {
    if (query.includes('_type == "treatment"')) return treatments;
    if (query.includes("methodsPage")) {
      if (methods === "fail") throw new Error("Sanity unavailable");
      return methods;
    }
    return null;
  });
const render = async (slug = "cupping") =>
  renderToStaticMarkup(await TreatmentPage({ params: Promise.resolve({ slug }) }));

describe("treatment detail page", () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  it("renders every block for a full document in the agreed order", async () => {
    serve();
    const html = await render();
    expect(html).toContain("<h1>Giác hơi</h1>");
    expect(html).toContain('lang="en"');
    expect(html).toContain("Mô tả ngắn của giác hơi.");
    expect(html).toContain('data-badge="popular"');
    expect(html).toContain('id="treatment-facts"');
    expect(html).toMatch(/99\.000\s₫/);
    expect(html).toContain("45 phút");
    expect(html).toContain("2 bước");
    const order = [
      "Giới thiệu",
      "Dành cho ai, hướng tới gì",
      "Một buổi diễn ra thế nào",
      "Câu hỏi thường gặp",
      "Có thể bạn quan tâm",
      "Muốn biết liệu pháp này có phù hợp với bạn?",
    ].map((heading) => html.indexOf(heading));
    expect(order.every((index) => index > -1)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(html.indexOf("Bước một")).toBeLessThan(html.indexOf("Bước hai"));
    expect(html).toContain("<b>Giác hơi</b>");
    expect(html).toContain("Đau lưng");
    expect(html).toContain("Hỏi một?");
    expect(html).not.toContain("Thiếu đáp án?");
    expect(html).toContain('href="/treatments/iastm"');
    expect(html).not.toContain("Không có document");
    expect(html).toContain('id="yeu-cau"');
    expect(html).toContain('aria-label="Tóm tắt và gửi yêu cầu tư vấn"');
    expect(html.match(/<h1/g)).toHaveLength(1);
  });

  it("never uses italics or boxes with shadows in the markup", async () => {
    serve();
    const html = await render();
    expect(html).not.toMatch(/<(em|i)[ >]/);
    expect(html).not.toContain("italic");
  });

  it("keeps the page valid with only a title and a slug", async () => {
    serve({ treatments: [{ slug: "bare", title: "Bare" }], methods: [] });
    const html = await render("bare");
    expect(html).toContain("<h1>Bare</h1>");
    expect(html).not.toContain('id="treatment-facts"');
    expect(html).not.toContain("Giới thiệu");
    expect(html).not.toContain("Dành cho ai");
    expect(html).not.toContain("Một buổi diễn ra thế nào");
    expect(html).not.toContain("Câu hỏi thường gặp");
    expect(html).not.toContain("Có thể bạn quan tâm");
    expect(html).not.toContain("<img");
    expect(html).toContain("data-plain");
    // With no facts strip the primary call to action sits in the hero (plus the dock).
    expect(html.match(/Gửi yêu cầu tư vấn/g)!.length).toBeGreaterThanOrEqual(2);
    expect(html).toContain('id="yeu-cau"');
  });

  it("leaves the primary call to action to the facts strip when there is one", async () => {
    serve();
    const html = await render();
    const hero = html.slice(0, html.indexOf('id="treatment-facts"'));
    expect(hero).not.toContain("Gửi yêu cầu tư vấn");
    expect(hero).toContain("Gọi ");
  });

  it("shows no price cell for a price of zero or none, and the dock has no price either", async () => {
    for (const price of [0, undefined]) {
      serve({ treatments: [{ ...full, price, duration: "" }], methods: [] });
      const html = await render();
      expect(html).not.toContain("₫");
      expect(html).not.toContain("Giá</span>");
    }
  });

  it("shows the certified note even without any quick facts", async () => {
    serve({
      treatments: [{ slug: "bare", title: "Bare", requiresCertifiedPractitioner: true }],
      methods: [],
    });
    const html = await render("bare");
    expect(html).toContain("chỉ được thực hiện và theo dõi bởi chuyên viên có chứng nhận");
    expect(html).not.toContain('id="treatment-facts"');
  });

  it("shows no price on a related card that has none", async () => {
    serve({ treatments: [full, sibling("iastm", "IASTM")], methods: [manual] });
    const html = await render();
    expect(html).toContain('href="/treatments/iastm"');
    expect(html.match(/₫/g)).toHaveLength(2); // the strip's price and the dock's price only
  });

  it("still renders when the methods cannot be read", async () => {
    serve({ methods: "fail" });
    const html = await render();
    expect(html).toContain("<h1>Giác hơi</h1>");
    expect(html).not.toContain("Có thể bạn quan tâm");
  });

  it("returns a real 404 for an unknown slug", async () => {
    serve();
    await expect(render("missing")).rejects.toMatchObject({
      digest: "NEXT_HTTP_ERROR_FALLBACK;404",
    });
  });

  it("uses the CMS SEO fields and falls back to the treatment's own", async () => {
    serve({ treatments: [full, { slug: "bare", title: "Bare", shortDescription: "Short" }] });
    const seo = await generateMetadata({ params: Promise.resolve({ slug: "cupping" }) });
    expect(seo).toMatchObject({
      title: "SEO title",
      description: "SEO description",
      openGraph: { images: [`${cdn}og.jpg`] },
    });
    const plain = await generateMetadata({ params: Promise.resolve({ slug: "bare" }) });
    expect(plain).toMatchObject({ title: "Bare", description: "Short" });
    expect(plain.openGraph).not.toHaveProperty("images");
  });
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatment-detail-page.test.tsx`

Expected: FAIL (trang cũ chưa có các khối mới).

- [ ] **Step 3: Viết lại trang**

Thay toàn bộ `app/treatments/[slug]/page.tsx` bằng:

```tsx
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { getMethods, getPublicSiteData, getTreatments } from "@/lib/sanity";
import { buildTreatmentDetail } from "@/lib/treatment-detail";
import { factCells, formatPrice } from "@/lib/treatment-display";
import { BookingPanel } from "./booking-panel";
import { TreatmentAudience } from "./treatment-audience";
import { TreatmentDock } from "./treatment-dock";
import { TreatmentFaqList } from "./treatment-faq";
import { CertifiedNote, TreatmentFacts } from "./treatment-facts";
import { TreatmentHero } from "./treatment-hero";
import { TreatmentIntro } from "./treatment-intro";
import { TreatmentRelated } from "./treatment-related";
import { TreatmentSteps } from "./treatment-steps";
import styles from "./treatment-page.module.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getTreatments()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const treatment = (await getTreatments()).find((item) => item.slug === slug);
  return treatment
    ? createMetadata({
        title: treatment.seo?.title ?? treatment.title,
        description: treatment.seo?.description ?? treatment.shortDescription,
        path: `/treatments/${treatment.slug}`,
        image: treatment.seo?.ogImage ?? treatment.image,
      })
    : {};
}
export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [treatments, methods, { site }] = await Promise.all([
    getTreatments(),
    // The groups only add context; the page must not go down with them.
    getMethods().catch(() => []),
    getPublicSiteData(),
  ]);
  const treatment = treatments.find((item) => item.slug === slug);
  if (!treatment) notFound();

  const detail = buildTreatmentDetail(treatment, treatments, methods);
  const cells = factCells(treatment);
  const lede = treatment.shortDescription || treatment.description;
  const showIntro = Boolean(treatment.description) && treatment.description.trim() !== lede.trim();
  const hasFacts = cells.length > 0;

  return (
    <main id="main" className={styles.root}>
      <TreatmentHero
        treatment={treatment}
        stages={detail.stages}
        phone={site.phone}
        showPrimaryCta={!hasFacts}
      />
      <TreatmentFacts cells={cells} />
      {treatment.requiresCertifiedPractitioner ? <CertifiedNote /> : null}
      {showIntro ? (
        <TreatmentIntro title={treatment.title} description={treatment.description} />
      ) : null}
      <TreatmentAudience
        conditions={detail.conditions}
        benefits={treatment.benefits}
        groupNames={detail.groups.map((group) => group.title)}
      />
      <TreatmentSteps protocols={treatment.protocols ?? []} />
      <TreatmentFaqList faqs={treatment.faqs ?? []} />
      <TreatmentRelated related={detail.related} />
      <BookingPanel title={treatment.title} />
      <TreatmentDock
        markerId={hasFacts ? "treatment-facts" : "treatment-hero-actions"}
        title={treatment.title}
        price={treatment.price && treatment.price > 0 ? formatPrice(treatment.price) : undefined}
        duration={treatment.duration?.trim() || undefined}
      />
    </main>
  );
}
```

Xoá module cũ: `git rm "app/treatments/[slug]/treatment-detail.module.css"`.

Trong `tests/sanity.test.ts`: (a) xoá toàn bộ khối `describe("treatment detail page", () => { ... });` (từ dòng `describe("treatment detail page"` đến dấu đóng của nó), (b) xoá import `TreatmentPage, { generateMetadata }` và `LeadForm` nếu không còn dùng, (c) trong test `"renders CMS pages with omitted optional fields"` xoá ba lệnh cuối liên quan `TreatmentPage` (từ `fetch.mockResolvedValue([{ slug: "test-treatment", title: "Treatment", benefits: null }]);` đến `.toContain("Treatment");`). Mọi ý định đó đã được phủ trong `tests/treatment-detail-page.test.tsx`.

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/treatment-detail-page.test.tsx tests/sanity.test.ts && npm run typecheck && npx eslint "app/treatments/[slug]" tests --max-warnings 0`

Expected: PASS và sạch. Nếu một assertion về số lần `₫` hay `Giá</span>` lệch do markup, chỉnh assertion theo markup thực tế nhưng giữ ý (không có giá thì không có `₫` nào; thẻ liên quan không giá thì không thêm `₫`).

- [ ] **Step 5: Chạy toàn bộ test**

Run: `npm test 2>&1 | grep -E "Test Files|Tests |FAIL"`

Expected: tất cả đạt. Test cũ nào còn kỳ vọng markup cũ của trang chi tiết (ví dụ `tests/methods-render.test.tsx` không dùng trang này) sẽ lộ ra ở đây; chỉ sửa test nào khẳng định markup cũ của trang chi tiết.

- [ ] **Step 6: Commit**

```bash
git add "app/treatments/[slug]/page.tsx" tests/sanity.test.ts tests/treatment-detail-page.test.tsx
git commit -m "feat(treatments): rebuild the detail page on the new sections #10"
```

(`git rm` ở Step 3 đã đưa việc xoá module cũ vào commit này.)

---

## Task 10: Kiểm chứng trên trình duyệt, tài liệu và hoàn tất

**Files:**

- Modify: `DESIGN.md` (thêm mục Treatment detail), `docs/superpowers/specs/2026-10-15-treatment-detail-redesign-design.md` (ba chỗ làm rõ), `docs/TREATMENTS_VERIFICATION.md` (hàng kiểm chứng giao diện)

- [ ] **Step 1: Chạy kiểm tra đầy đủ**

Run: `npm run lint && npm run typecheck && npm test && npm run build`

Expected: tất cả sạch. Nếu typecheck hay build đổi `next-env.d.ts`: `git checkout next-env.d.ts`.

- [ ] **Step 2: Kiểm tra trên trình duyệt (dữ liệu CMS thật, chỉ đọc)**

Chạy dev server: `NEXT_PUBLIC_SANITY_PROJECT_ID=yjzexxml NEXT_PUBLIC_SANITY_DATASET=production npx next dev -p 3418` (nền). Dùng Playwright (hoặc công cụ trình duyệt có sẵn) mở `/treatments/cupping`, `/treatments/cold-plunge`, `/treatments/heat-light` ở 1280, 768 và 375 px. Với mỗi cỡ: không cuộn ngang, đúng một `h1`, dải thông tin (giá, thời lượng, "N bước"), mô tả ngắn ở hero, câu chủ đề ở Giới thiệu, hai hàng tag, lưới bước, thẻ liên quan (Giác hơi có 4 thẻ cùng nhóm thủ công **chỉ khi** dataset đã có các liệu pháp đó; với dataset production hiện chỉ có 3 liệu pháp, thẻ liên quan có thể trống: ghi lại đúng điều quan sát được). Cuộn qua dải thông tin: thanh dính hiện ở đáy, có giá; cuộn tới panel form: thanh ẩn. Bàn phím: Tab đi qua liên kết quay lại, hành động hero, nút trong dải, nội dung, form; thanh dính ẩn không nhận Tab. Lưu ảnh vào `.context/evidence/redesign-<slug>-<width>.png`. Chạy lại với dữ liệu bundled (không đặt biến môi trường) cho `/treatments/tapping` (không ảnh, không bước), `/treatments/dry-needling` (có chú thích `*`), và thử `?badge` bằng cách sửa tạm một liệu pháp bundled có `badge: "popular"` rồi `"new"` (hoàn nguyên sau khi chụp, không commit). Kiểm tra thêm khi có banner cookie: thanh dính nằm trên banner, nút liên hệ nâng lên ở mobile. Ghi mọi điểm lệch spec vào báo cáo; **không** tự sửa giao diện ngoài phạm vi các task trên mà không báo.

Tắt server khi xong và khôi phục `next-env.d.ts` nếu bị đổi.

- [ ] **Step 3: Cập nhật `DESIGN.md`**

Trong phần `## Components`, ngay trước `### Homepage comparison table`, thêm:

```markdown
### Treatment detail (`/treatments/[slug]`)

Issue #10. One hero card (same as Methods: ink, 18px, photo and left scrim) with the title, an upright English subtitle in `hero-emphasis`, the short description, a phone link and the pathway ribbon (Trị liệu / Tập luyện / Hồi phục, the treatment's stage filled). An optional badge sits on the card: a tilted round stamp (108px, `clay-deep` for "Được chọn nhiều" with a check, `sage` for "Mới" with a leaf) over a photo, a pill chip above the title without one. Below the hero an unboxed quick-facts strip (price, suggested duration, "N bước", each only when it exists) ends with the primary "Gửi yêu cầu tư vấn" pill; without any fact the pill moves into the hero.

Every section shares one heading (sage `h2` with a running hairline, the homepage `.stepsHead`): Giới thiệu (statement left, text right; the title is coloured `clay-deep`, never italic), Dành cho ai, hướng tới gì (the Methods tag rows "Khi bạn gặp" and "Hướng tới"), Một buổi diễn ra thế nào (the homepage `.stepCard` grid, numerals 36px), Câu hỏi thường gặp (hairline `<details>`), Có thể bạn quan tâm (index cards, 16px, `warm-band` hover) and a linen booking panel (18px). A bottom dock (hairline pill, no shadow) appears once the quick-facts strip has scrolled away and hides for good when the booking panel is near; it publishes `--dock-h` so the mobile chat buttons stay clear, and sits above the cookie banner via `--cookie-h`.
```

- [ ] **Step 4: Làm rõ spec**

Trong `docs/superpowers/specs/2026-10-15-treatment-detail-redesign-design.md`:

- Mục 5.1: thay "`layout: "radio"`, `options.direction: "horizontal"`," bằng "danh sách thả xuống (dropdown, để owner bỏ chọn được)," .
- Mục 4.4 điểm 5: thay "(khớp không phân biệt hoa thường và dấu, chuẩn hoá NFC)" bằng "(khớp không phân biệt hoa thường, sau khi chuẩn hoá NFC; không bỏ dấu)".
- Mục 4.3: thay "nút liên hệ (`components/chat-widgets.module.css`, hai chỗ `bottom`) cộng thêm `var(--dock-h, 0px)`" bằng "nút liên hệ (`components/chat-widgets.module.css`, chỉ ở mobile ≤700 px) cộng thêm `var(--dock-h, 0px)`; trên desktop thanh dính đã chừa chỗ hai bên".

- [ ] **Step 5: Thêm hàng kiểm chứng**

Trong `docs/TREATMENTS_VERIFICATION.md`, trước mục "Staging", thêm:

```markdown
## Detail page redesign (spec 2026-10-15-treatment-detail-redesign)

- [ ] Real CMS data (Giác hơi, Ngâm lạnh, Đèn hồng ngoại) at 1280, 768 and 375 px: no horizontal scroll, one `h1`, every block present when its data exists
- [ ] Minimal data (Tapping), no photo and no steps: page valid, primary call to action in the hero
- [ ] `*` note (Châm khô) and both badges (stamp over a photo, chip without one)
- [ ] Bottom dock: appears after the facts strip scrolls away, hides at the form, sits above the cookie banner, mobile chat buttons clear of it
- [ ] Keyboard order and visible focus; the hidden dock is not tabbable; reduced motion switches the dock slide off
- [ ] Owner has approved the new wording (spec section 7) and decided on "An toàn và ít tác dụng phụ"
```

- [ ] **Step 6: Commit tài liệu**

```bash
npx prettier --write DESIGN.md docs/TREATMENTS_VERIFICATION.md docs/superpowers/specs/2026-10-15-treatment-detail-redesign-design.md
git add DESIGN.md docs/TREATMENTS_VERIFICATION.md docs/superpowers/specs/2026-10-15-treatment-detail-redesign-design.md
git commit -m "docs(treatments): record the detail page design and verification rows #10"
```

- [ ] **Step 7: Kiểm tra cuối**

Run: `npm run lint && npm run typecheck && npm test 2>&1 | grep -E "Test Files|Tests " && npm run build 2>&1 | tail -3`

Expected: sạch; báo cáo cho người dùng kèm danh sách ảnh bằng chứng và các điểm lệch (nếu có). Không merge, không push.
