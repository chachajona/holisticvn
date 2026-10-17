# Danh mục 11 liệu pháp và trang chi tiết — kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 11 liệu pháp của bảng giá owner có trang chi tiết hiển thị đúng tên, giá, chú thích `*` và mô tả; dữ liệu seed/patch được chuẩn bị an toàn cho staging và production.

**Architecture:** Mở rộng `Treatment` và schema Sanity (giá số nguyên, `englishTitle`, `requiresCertifiedPractitioner`), thêm một module hiển thị thuần (`lib/treatment-display.ts`), mở rộng dữ liệu fallback thành 11 liệu pháp, và một script đồng bộ (`scripts/sync-treatments.mjs`, mặc định dry-run) tạo/patch document và gắn tham chiếu nhóm với kiểm tra phiên bản. Trang chi tiết chỉ thêm ba phần tử vào hero hiện có.

**Tech Stack:** Next.js 16 (App Router), React 19, Sanity 6.17.0, zod 4, vitest 5, `@sanity/client` 8.9.0.

**Spec:** [`docs/superpowers/specs/2026-10-15-treatment-catalog-design.md`](../specs/2026-10-15-treatment-catalog-design.md). Nghiên cứu nền: `docs/treatment-detail-schema-research.md`, `docs/treatment-i18n-schema-research.md`.

## Global Constraints

- Chữ mô tả và giá là **nguyên văn bảng giá của owner** (spec mục 4). Không viết lại, không thêm tuyên bố hiệu quả.
- `price` là số nguyên VND (ví dụ `149000`), hiển thị bằng `Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })`; không có nhãn "từ" hay "ưu đãi". Giá không vào JSON-LD (không có JSON-LD trong kế hoạch này).
- `duration` **không hiển thị**; trường giữ trong schema.
- `h1` là `title` (tiếng Việt); `englishTitle` chỉ là dòng phụ, ẩn khi trùng `title` (không phân biệt hoa thường, bỏ khoảng trắng đầu cuối).
- Câu chú thích `*` nguyên văn: `Các dịch vụ trị liệu này chỉ được thực hiện và theo dõi bởi chuyên viên có chứng nhận và chứng chỉ chuyên môn.`
- Slug: `dry-needling`, `cupping`, `iastm`, `heat-light`, `cold-plunge`, `tapping`, `shockwave`, `bio-electric`, `therapeutic-ultrasound`, `electroacupuncture`, `chiropractic-adjustment`.
- Không ghi lên production trong kế hoạch này nếu chưa có xác nhận riêng của owner ở bước triển khai (Task 8). Script mặc định dry-run.
- Commit theo kiểu repo: `feat(treatments): ... #10`. **Không** thêm dòng `Co-Authored-By: Claude` hay "Generated with Claude Code" (memory của repo). Dùng `Refs #10`, không dùng `Closes #10` (GitHub tự đóng issue khi merge).
- Chỉ `git add` đúng file của từng task; worktree có file không thuộc kế hoạch này (xem Task 0).
- Next.js ở repo này có breaking changes (`AGENTS.md`); không đổi cấu trúc `app/` ngoài file được nêu.
- Trước khi merge: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` đều sạch; `docs/FRONTEND_CHECKLIST.md` cho thay đổi giao diện.

## Review Focus

1. **Giá bằng 0 hoặc thiếu:** không hiện dòng giá (Task 6 có test).
2. **`englishTitle` khác hoa/thường hoặc có khoảng trắng so với `title`:** vẫn ẩn dòng phụ (Task 1).
3. **Cờ `*` bật nhưng thiếu giá:** chú thích vẫn hiện, không hiện dòng giá (Task 6).
4. **Slug viết hoa, có khoảng trắng hoặc gạch đầu:** Studio báo lỗi (Task 3).
5. **Hai document production trùng slug, hoặc `methodsPage`/`servicesPage` chưa được seed trên production:** script dừng với thông báo rõ khi trùng slug, và bỏ qua trang vắng mặt thay vì làm hỏng cả giao dịch (Task 7).
6. **Editor đang mở bản nháp của document sắp patch:** script in cảnh báo, không ghi đè thầm lặng (Task 7).

---

## Task 0: Kiểm tra điều kiện trước khi làm

Không có code. Mục đích: không commit nhầm thay đổi của phiên khác.

- [ ] **Step 1: Xem trạng thái worktree**

Run: `git status --short`

Expected: có các thay đổi chưa commit của #10 (`app/treatments/[slug]/page.tsx`, `lib/content.ts`, `lib/sanity.ts`, `lib/seo.ts`, `sanity/schemaTypes/index.ts`, `tests/sanity.test.ts`, `app/globals.css`) và các file chưa theo dõi `app/treatments/[slug]/treatment-detail.module.css`, `design-plans/treatment-detail-*.md`, `docs/treatment-*-research.md`, `docs/superpowers/specs/2026-10-15-treatment-catalog-design.md`.

- [ ] **Step 2: Xác nhận với người dùng**

Hỏi người dùng: `treatment-detail.module.css`, việc xoá CSS `.treatment-*` khỏi `app/globals.css`, và hai file `design-plans/treatment-detail-*.md` có thuộc phạm vi #10 không (spec mục 11 đã ghi đây là rủi ro). **Không** triển khai tiếp nếu chưa có câu trả lời. Ghi chú: `design-plans/treatment-detail-layout-and-wording.md` là một kế hoạch bố cục riêng sẽ sửa tiếp `page.tsx` và module CSS; Task 6 dưới đây chỉ thêm ba phần tử vào hero và ba rule CSS nên ít xung đột, nhưng nếu kế hoạch bố cục chạy trước thì đặt ba phần tử vào chỗ tương ứng trong hero mới.

- [ ] **Step 3: Chạy baseline**

Run: `npm test`

Expected: PASS toàn bộ (209 test tại thời điểm viết kế hoạch).

- [ ] **Step 4: Commit phần #10 đã làm trước (chỉ khi người dùng xác nhận ở Step 2)**

```bash
git add app/treatments/[slug]/page.tsx app/treatments/[slug]/treatment-detail.module.css app/globals.css lib/content.ts lib/sanity.ts lib/seo.ts sanity/schemaTypes/index.ts tests/sanity.test.ts
git commit -m "feat(treatments): render protocols and CMS SEO, hide empty optional fields #10"
```

---

## Task 1: Module hiển thị thuần

**Files:**

- Create: `lib/treatment-display.ts`
- Test: `tests/treatment-display.test.ts`

**Interfaces:**

- Produces: `formatPrice(amount: number): string`, `englishSubtitle(t: { title: string; englishTitle?: string }): string | undefined`, `certifiedPractitionerNote: string` (dùng ở Task 6).

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/treatment-display.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { certifiedPractitionerNote, englishSubtitle, formatPrice } from "@/lib/treatment-display";

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
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatment-display.test.ts`

Expected: FAIL (`Failed to resolve import "@/lib/treatment-display"`).

- [ ] **Step 3: Viết cài đặt tối thiểu**

Tạo `lib/treatment-display.ts`:

```ts
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
```

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/treatment-display.test.ts`

Expected: PASS (3 test).

- [ ] **Step 5: Commit**

```bash
git add lib/treatment-display.ts tests/treatment-display.test.ts
git commit -m "feat(treatments): add price, subtitle and certified-note display helpers #10"
```

---

## Task 2: Kiểu dữ liệu, zod và GROQ

**Files:**

- Modify: `lib/content.ts` (kiểu `Treatment`, đầu file)
- Modify: `lib/sanity.ts` (`treatmentSchema`, truy vấn `getTreatments`)
- Test: `tests/sanity.test.ts`

**Interfaces:**

- Consumes: `optionalText` (đã có trong `lib/sanity.ts`).
- Produces: `Treatment.englishTitle?: string`, `Treatment.requiresCertifiedPractitioner?: boolean`; `getTreatments()` trả `price` chỉ khi là số nguyên không âm.

- [ ] **Step 1: Viết test thất bại**

Trong `tests/sanity.test.ts`, ngay sau test `"maps CMS SEO fields and ignores a non-CDN OG image"`, thêm:

```ts
it("keeps an integer price and drops anything else", async () => {
  fetch.mockResolvedValue([
    { slug: "a", title: "A", price: 149000 },
    { slug: "b", title: "B", price: 99.5 },
    { slug: "c", title: "C", price: -1 },
    { slug: "d", title: "D", price: "99000" },
  ]);
  expect((await getTreatments()).map((t) => t.price)).toEqual([
    149000,
    undefined,
    undefined,
    undefined,
  ]);
});
it("maps englishTitle and the certified-practitioner flag with safe defaults", async () => {
  fetch.mockResolvedValue([
    {
      slug: "a",
      title: "Châm khô",
      englishTitle: "Dry Needling",
      requiresCertifiedPractitioner: true,
    },
    { slug: "b", title: "Giác hơi", englishTitle: "  ", requiresCertifiedPractitioner: "yes" },
  ]);
  const [a, b] = await getTreatments();
  expect(a).toMatchObject({
    englishTitle: "Dry Needling",
    requiresCertifiedPractitioner: true,
  });
  expect(b.englishTitle).toBeUndefined();
  expect(b.requiresCertifiedPractitioner).toBe(false);
});
it("asks Sanity for the new treatment fields", async () => {
  fetch.mockResolvedValue([]);
  await getTreatments();
  const query = String(fetch.mock.calls.at(-1)?.[0]);
  expect(query).toContain("englishTitle");
  expect(query).toContain("requiresCertifiedPractitioner");
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/sanity.test.ts -t "integer price|englishTitle|new treatment fields"`

Expected: FAIL (giá thập phân vẫn được giữ; `englishTitle` undefined; truy vấn thiếu trường).

- [ ] **Step 3: Cài đặt**

Trong `lib/content.ts`, kiểu `Treatment`: thêm hai trường ngay sau `title: string;`:

```ts
  englishTitle?: string;
  requiresCertifiedPractitioner?: boolean;
```

Trong `lib/sanity.ts`, `treatmentSchema`: thay dòng `price` và thêm hai trường:

```ts
  title: z.string().min(1),
```

(giữ nguyên `...record`, không đổi). Thêm vào object `treatmentSchema` (cạnh `isPopular`):

```ts
  price: z.number().int().nonnegative().optional().catch(undefined),
  englishTitle: optionalText,
  requiresCertifiedPractitioner: z.boolean().catch(false),
```

(xoá dòng `price: z.number().nonnegative().optional().catch(undefined),` cũ). Trong truy vấn `getTreatments`, thêm `englishTitle,requiresCertifiedPractitioner,` ngay sau `title,`:

```ts
    `*[_type == "treatment"] | order(title asc){"slug":slug.current,title,englishTitle,requiresCertifiedPractitioner,shortDescription,description,duration,price,isPopular,"image":image.asset->url,"imageAlt":image.alt,benefits,protocols,"seo":seo{title,description,"ogImage":ogImage.asset->url}}`,
```

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/sanity.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts lib/sanity.ts tests/sanity.test.ts
git commit -m "feat(treatments): map English title, integer price and certified flag from Sanity #10"
```

---

## Task 3: Schema Sanity `treatment`

**Files:**

- Modify: `sanity/schemaTypes/index.ts` (`seo`, `treatment`)
- Test: `tests/treatment-schema.test.ts` (mới)

**Interfaces:**

- Produces: trường `englishTitle`, `requiresCertifiedPractitioner`; ràng buộc `price`, `slug`, `image.alt`, SEO `warning`.

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/treatment-schema.test.ts`:

```ts
import { Schema } from "@sanity/schema";
import { builtinTypes } from "@sanity/schema/_internal";
import { validateDocument } from "@sanity/validation";
import { describe, expect, it } from "vitest";
import { schemaTypes } from "@/sanity/schemaTypes";

const schema = Schema.compile({ name: "test", types: [...schemaTypes, ...builtinTypes] });
const client = { withConfig: () => client, fetch: async () => 0 };
// validateDocument is @beta: keep this the only place in this file that calls it.
const check = async (document: object) => {
  const result = await validateDocument({
    document,
    schema,
    client,
    getDocumentExists: async () => true,
  } as never);
  const level = (name: string) =>
    result.markers.filter((m) => m.level === name).map((m) => m.message);
  return { errors: level("error"), warnings: level("warning") };
};
const base = {
  _id: "treatment-test",
  _type: "treatment",
  title: "Giác hơi",
  slug: { _type: "slug", current: "cupping" },
};
const image = (alt?: string) => ({
  _type: "image",
  asset: { _type: "reference", _ref: "image-abc123-100x100-jpg" },
  ...(alt ? { alt } : {}),
});

describe("treatment schema", () => {
  const treatment = schemaTypes.find((t) => t.name === "treatment") as unknown as {
    fields: Array<{ name: string; type: string; initialValue?: unknown }>;
  };
  const field = (name: string) => treatment.fields.find((f) => f.name === name);

  it("has the English title and certified-practitioner fields", () => {
    expect(field("englishTitle")?.type).toBe("string");
    expect(field("requiresCertifiedPractitioner")).toMatchObject({
      type: "boolean",
      initialValue: false,
    });
  });

  it("accepts a document with only a title and a slug", async () => {
    expect((await check(base)).errors).toEqual([]);
  });

  it.each(["Giac Hoi", "giac hoi", "-giac-hoi", "giac--hoi", "giác-hơi"])(
    "rejects the slug %s",
    async (current) => {
      const { errors } = await check({ ...base, slug: { _type: "slug", current } });
      expect(errors).toContain("Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.");
    },
  );

  it.each([149000, 0])("accepts the price %s", async (price) => {
    expect((await check({ ...base, price })).errors).toEqual([]);
  });

  it.each([99.5, -1])("rejects the price %s", async (price) => {
    expect((await check({ ...base, price })).errors.length).toBeGreaterThan(0);
  });

  it("requires alt text once an image is chosen, not before", async () => {
    expect((await check({ ...base, image: image() })).errors).toContain("Cần alt text khi có ảnh.");
    expect((await check({ ...base, image: image("Giác hơi") })).errors).toEqual([]);
    expect((await check(base)).errors).toEqual([]);
  });

  it("limits the title to the booking limit", async () => {
    const { errors } = await check({ ...base, title: "x".repeat(121) });
    expect(errors).toContain("Tên liệu pháp không được dài quá 120 ký tự.");
  });

  it("warns, but does not block, on long SEO text", async () => {
    const { errors, warnings } = await check({
      ...base,
      seo: { title: "t".repeat(61), description: "d".repeat(161) },
    });
    expect(errors).toEqual([]);
    expect(warnings).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatment-schema.test.ts`

Expected: FAIL (thiếu trường, slug/giá/alt chưa kiểm, SEO đang là lỗi chứ không phải cảnh báo).

- [ ] **Step 3: Cài đặt**

Trong `sanity/schemaTypes/index.ts`:

(a) Kiểu `seo` — đổi hai giới hạn thành cảnh báo:

```ts
      validation: (rule) => rule.max(60).warning("Nên giữ SEO title trong 60 ký tự."),
```

```ts
      validation: (rule) => rule.max(160).warning("Nên giữ SEO description trong 160 ký tự."),
```

(b) Ngay sau hằng `image` (kết thúc bằng `fields: [defineField({ name: "alt", ... })],\n});`), thêm:

```ts
// Treatment photos need alt text once an image is chosen (same rule as service and method groups).
const treatmentImage = defineField({
  ...image,
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.parent as { asset?: unknown } | undefined)?.asset && !value
            ? "Cần alt text khi có ảnh."
            : true,
        ),
    }),
  ],
});
```

(c) Trong `defineType` `treatment`:

- Ngay sau trường `title`, thêm:

```ts
    defineField({
      name: "englishTitle",
      title: "Tên tiếng Anh",
      description:
        "Tên quốc tế của kỹ thuật, hiện làm dòng phụ dưới tên tiếng Việt. Bỏ trống nếu trùng tên tiếng Việt.",
      type: "string",
    }),
```

- Thay `validation` của `slug` bằng:

```ts
      validation: (rule) => [
        rule.required(),
        rule.custom((value) => {
          const current = (value as { current?: string } | undefined)?.current;
          return !current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)
            ? true
            : "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.";
        }),
      ],
```

- Thay trường `price` bằng:

```ts
    defineField({
      name: "price",
      title: "Giá (VNĐ)",
      description: "Số nguyên, ví dụ 149000. Hiển thị trên trang liệu pháp.",
      type: "number",
      validation: (rule) => rule.integer().min(0),
    }),
```

- Ngay sau trường `isPopular`, thay dòng `image,` bằng hai mục sau (thứ tự: cờ rồi ảnh):

```ts
    defineField({
      name: "requiresCertifiedPractitioner",
      title: "Chỉ chuyên viên có chứng nhận thực hiện (*)",
      description: "Hiện câu chú thích trên trang liệu pháp.",
      type: "boolean",
      initialValue: false,
    }),
    treatmentImage,
```

(Chỉ trong `treatment`; `post` vẫn dùng `image`.)

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/treatment-schema.test.ts tests/services-schema.test.ts tests/methods-schema.test.ts tests/studio-config.test.ts`

Expected: PASS (các test schema khác không bị ảnh hưởng).

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/index.ts tests/treatment-schema.test.ts
git commit -m "feat(treatments): validate slug, price and alt, add English title and certified flag #10"
```

---

## Task 4: Dữ liệu fallback 11 liệu pháp và liên kết nhóm

**Files:**

- Modify: `lib/content.ts` (`services`, `methods`, `treatments`)
- Modify: `tests/method-groups.test.ts` (bảng liên kết kỳ vọng)
- Test: `tests/treatment-catalog.test.ts` (mới)

**Interfaces:**

- Consumes: `Treatment` (Task 2).
- Produces: `treatments` gồm 11 mục theo spec mục 4; mỗi liên kết `{ slug, title }` trong `services`/`methods` dùng đúng `title` của danh mục.

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/treatment-catalog.test.ts`:

```ts
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { methods, services, treatments } from "@/lib/content";

// The owner's price list (supplied 2026-10-09). Descriptions are checked against the seed in
// tests/treatments-seed.test.ts and by eye against the price-list image.
const priceList = [
  ["dry-needling", "Châm khô", "Dry Needling", 299000, true],
  ["cupping", "Giác hơi", "Cupping", 99000, false],
  ["iastm", "IASTM", undefined, 199000, false],
  ["heat-light", "Đèn hồng ngoại", "Heat Light", 99000, false],
  ["cold-plunge", "Ngâm lạnh", "Cold Plunge", 149000, false],
  ["tapping", "Tapping", undefined, 99000, false],
  ["shockwave", "Xung kích", "Shockwave Therapy", 349000, false],
  ["bio-electric", "Điện xung", "Bio-electric", 349000, false],
  ["therapeutic-ultrasound", "Sóng siêu âm", "Therapeutic Ultrasound", 349000, false],
  ["electroacupuncture", "Điện châm", "Electroacupuncture", 249000, true],
  ["chiropractic-adjustment", "Nắn chỉnh cột sống", "Chiropractic Adjustment", 299000, true],
] as const;

describe("treatment catalogue (fallback)", () => {
  it("matches the owner's price list: name, English name, price and the * flag", () => {
    expect(
      treatments.map((t) => [
        t.slug,
        t.title,
        t.englishTitle,
        t.price,
        t.requiresCertifiedPractitioner ?? false,
      ]),
    ).toEqual(priceList.map((row) => [...row]));
  });

  it("has one description per treatment, no duration, benefits or protocols", () => {
    for (const t of treatments) {
      expect(t.description, t.slug).not.toBe("");
      expect(t.shortDescription, t.slug).toBe(t.description);
      expect(t.duration, t.slug).toBeUndefined();
      expect(t.benefits, t.slug).toEqual([]);
      expect(t.protocols, t.slug).toBeUndefined();
    }
  });

  it("only uses clinic photos that exist, and no photo is better than a wrong one", () => {
    for (const t of treatments)
      if (t.image) expect(existsSync(`public${t.image}`), t.slug).toBe(true);
  });

  it("links every group to existing treatments under their catalogue title", () => {
    const title = new Map(treatments.map((t) => [t.slug, t.title]));
    for (const group of [...methods, ...services]) {
      for (const link of group.treatments) {
        expect(title.get(link.slug), `${group.group}: ${link.slug}`).toBe(link.title);
      }
    }
  });
});
```

Trong `tests/method-groups.test.ts`, thay khối `expect(linked).toEqual({...})` bằng:

```ts
expect(linked).toEqual({
  manual: ["dry-needling", "cupping", "iastm", "tapping", "chiropractic-adjustment"],
  electro: ["shockwave", "bio-electric", "therapeutic-ultrasound", "electroacupuncture"],
  rehab: [],
  cold: ["cold-plunge"],
  infrared: ["heat-light"],
});
```

và đổi tên test thành `"maps the owner's price list: every treatment is linked to its group"`.

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatment-catalog.test.ts tests/method-groups.test.ts`

Expected: FAIL (mới có 5 liệu pháp, tên tiếng Anh, thiếu giá).

- [ ] **Step 3: Cài đặt `treatments`**

Trong `lib/content.ts`, thay toàn bộ khối `export const treatments: Treatment[] = [ ... ];` bằng:

```ts
// Owner price list (Vietnamese and English), supplied 2026-10-09: names, one-sentence descriptions
// and prices are verbatim. The price list gives no duration, benefits or steps, so none are shown.
// A treatment without a photo renders without one; only photos that fit are listed.
const catalogue: Array<{
  slug: string;
  title: string;
  englishTitle?: string;
  text: string;
  price: number;
  certified?: true;
  image?: string;
}> = [
  {
    slug: "dry-needling",
    title: "Châm khô",
    englishTitle: "Dry Needling",
    text: "Tác động vào các điểm co cứng (trigger point) để giải phóng căng thẳng, giảm đau và phục hồi chức năng thần kinh – cơ.",
    price: 299000,
    certified: true,
    image: "/images/TreatmentBeds.jpg",
  },
  {
    slug: "cupping",
    title: "Giác hơi",
    englishTitle: "Cupping",
    text: "Dùng áp suất trong ống giác hơi gây xung huyết tại chỗ để giải độc cơ thể và giải quyết một số cơn đau.",
    price: 99000,
    image: "/images/Cupping.jpg",
  },
  {
    slug: "iastm",
    title: "IASTM",
    text: "Dùng dụng cụ chuyên dụng tác động lên mô mềm nhằm giải phóng, tăng lưu thông máu và cải thiện độ đàn hồi của cơ – fascia.",
    price: 199000,
    image: "/images/Iastm.jpg",
  },
  {
    slug: "heat-light",
    title: "Đèn hồng ngoại",
    englishTitle: "Heat Light",
    text: "Thư giãn cơ, giảm căng thẳng, thúc đẩy quá trình tự chữa lành của cơ thể.",
    price: 99000,
    image: "/images/Infrared.jpg",
  },
  {
    slug: "cold-plunge",
    title: "Ngâm lạnh",
    englishTitle: "Cold Plunge",
    text: "Giúp giảm viêm, sưng và phục hồi sau vận động cường độ cao và cải thiện khả năng chịu đựng của hệ thần kinh.",
    price: 149000,
    image: "/images/ColdPlungeTub.jpg",
  },
  {
    slug: "tapping",
    title: "Tapping",
    text: "Hỗ trợ giúp điều chỉnh trương lực cơ, giảm sưng, cải thiện cảm nhận vận động và ổn định khớp trong quá trình phục hồi.",
    price: 99000,
  },
  {
    slug: "shockwave",
    title: "Xung kích",
    englishTitle: "Shockwave Therapy",
    text: "Tái tạo mô, giảm đau tại chỗ nhanh chóng.",
    price: 349000,
  },
  {
    slug: "bio-electric",
    title: "Điện xung",
    englishTitle: "Bio-electric",
    text: "Kích thích thần kinh – cơ bằng xung điện nhẹ nhằm giảm đau, tăng kích hoạt cơ và phục hồi kiểm soát vận động.",
    price: 349000,
  },
  {
    slug: "therapeutic-ultrasound",
    title: "Sóng siêu âm",
    englishTitle: "Therapeutic Ultrasound",
    text: "Giảm đau, giải toả căng cơ, tăng tuần hoàn máu và thúc đẩy quá trình tự chữa lành của cơ thể.",
    price: 349000,
  },
  {
    slug: "electroacupuncture",
    title: "Điện châm",
    englishTitle: "Electroacupuncture",
    text: "Kết hợp châm kim với dòng điện nhẹ nhằm tăng hiệu quả giảm đau, thư giãn cơ và cải thiện lưu thông tuần hoàn.",
    price: 249000,
    certified: true,
  },
  {
    slug: "chiropractic-adjustment",
    title: "Nắn chỉnh cột sống",
    englishTitle: "Chiropractic Adjustment",
    text: "Kỹ thuật huy động và nắn chỉnh khớp cột sống giúp cải thiện cân bằng, giảm chèn ép, tăng khả năng linh hoạt và tối ưu cảm nhận cơ thể.",
    price: 299000,
    certified: true,
  },
];

export const treatments: Treatment[] = catalogue.map(
  ({ text, certified, ...treatment }): Treatment => ({
    ...treatment,
    shortDescription: text,
    description: text,
    requiresCertifiedPractitioner: certified ?? false,
    benefits: [],
  }),
);
```

Lưu ý: `treatments` giờ được định nghĩa bằng `const catalogue` nên `services`/`methods` (khai báo trước đó trong file) chỉ dùng literal, không tham chiếu `treatments` — giữ như hiện nay.

- [ ] **Step 4: Cập nhật liên kết trong `services` và `methods`**

Trong `lib/content.ts`:

(a) `services`, nhóm `therapy` — thay mảng `treatments` (nằm ngay sau `imageAlt: "Trị liệu bằng tay",`) bằng:

```ts
    treatments: [
      { slug: "dry-needling", title: "Châm khô" },
      { slug: "cupping", title: "Giác hơi" },
      { slug: "iastm", title: "IASTM" },
      { slug: "tapping", title: "Tapping" },
      { slug: "chiropractic-adjustment", title: "Nắn chỉnh cột sống" },
      { slug: "shockwave", title: "Xung kích" },
      { slug: "bio-electric", title: "Điện xung" },
      { slug: "therapeutic-ultrasound", title: "Sóng siêu âm" },
      { slug: "electroacupuncture", title: "Điện châm" },
    ],
```

(b) `services`, nhóm `recovery` (sau `imageAlt: "Ngâm lạnh & đèn hồng ngoại",`):

```ts
    treatments: [
      { slug: "heat-light", title: "Đèn hồng ngoại" },
      { slug: "cold-plunge", title: "Ngâm lạnh" },
    ],
```

(c) `methods`, nhóm `manual` (sau `imageAlt: "Trị liệu thủ công",`):

```ts
    treatments: [
      { slug: "dry-needling", title: "Châm khô" },
      { slug: "cupping", title: "Giác hơi" },
      { slug: "iastm", title: "IASTM" },
      { slug: "tapping", title: "Tapping" },
      { slug: "chiropractic-adjustment", title: "Nắn chỉnh cột sống" },
    ],
```

(d) `methods`, nhóm `electro` (sau `imageAlt: "Trị liệu bằng thiết bị",`, thay `treatments: [],`):

```ts
    treatments: [
      { slug: "shockwave", title: "Xung kích" },
      { slug: "bio-electric", title: "Điện xung" },
      { slug: "therapeutic-ultrasound", title: "Sóng siêu âm" },
      { slug: "electroacupuncture", title: "Điện châm" },
    ],
```

(e) `methods`, nhóm `cold`: `treatments: [{ slug: "cold-plunge", title: "Ngâm lạnh" }],` và nhóm `infrared`: `treatments: [{ slug: "heat-light", title: "Đèn hồng ngoại" }],`.

- [ ] **Step 5: Chạy toàn bộ test, sửa các kỳ vọng cũ còn lại**

Run: `npx vitest run`

Expected: PASS. Nếu test nào khác còn kỳ vọng tên cũ ("Dry Needling", "Heat & Light", "Cupping Therapy", "Cold Plunge" làm tiêu đề fallback), đổi kỳ vọng sang tên mới; các test trong `tests/methods-*.test.tsx` và `tests/services-*.test.tsx` truyền dữ liệu giả (mock) nên không bị ảnh hưởng. Test `tests/sanity.test.ts` dùng dữ liệu `fetch` giả nên cũng không đổi.

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts tests/treatment-catalog.test.ts tests/method-groups.test.ts
git commit -m "feat(treatments): bundle all 11 price-list treatments and link them to their groups #10"
```

---

## Task 5: File seed 11 liệu pháp và bảng liên kết nhóm

**Files:**

- Create: `scripts/seed/treatments.json`
- Create: `scripts/seed/treatment-links.json`
- Modify: `docs/superpowers/specs/2026-10-15-treatment-catalog-design.md` (mục 7 và 10: seed gồm 11 document, đồng bộ bằng script)
- Test: `tests/treatments-seed.test.ts` (mới)

**Interfaces:**

- Produces: `treatments.json` là mảng 11 document `{_id, _type: "treatment", title, englishTitle?, slug: {_type: "slug", current}, shortDescription, description, price, requiresCertifiedPractitioner}` với `_id` = `treatment-<slug>`; `treatment-links.json` = `{ methodsPage: { [group]: slug[] }, servicesPage: { [group]: slug[] } }`. Task 7 đọc cả hai.

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/treatments-seed.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { methods, services, treatments } from "@/lib/content";
import { schemaTypes } from "@/sanity/schemaTypes";

type SeedDocument = {
  _id: string;
  _type: string;
  title: string;
  englishTitle?: string;
  slug: { _type: string; current: string };
  shortDescription: string;
  description: string;
  price: number;
  requiresCertifiedPractitioner: boolean;
};
const seed: SeedDocument[] = JSON.parse(readFileSync("scripts/seed/treatments.json", "utf8"));
const links = JSON.parse(readFileSync("scripts/seed/treatment-links.json", "utf8")) as Record<
  string,
  Record<string, string[]>
>;

describe("treatments seed", () => {
  it("has one dot-free published document per catalogue treatment", () => {
    expect(seed.map((d) => d.slug.current)).toEqual(treatments.map((t) => t.slug));
    for (const doc of seed) {
      expect(doc._type).toBe("treatment");
      expect(doc._id).toBe(`treatment-${doc.slug.current}`);
      expect(doc.slug._type).toBe("slug");
    }
  });

  it("matches the bundled catalogue so the two cannot drift", () => {
    for (const [i, t] of treatments.entries()) {
      const {
        title,
        englishTitle,
        shortDescription,
        description,
        price,
        requiresCertifiedPractitioner,
      } = seed[i];
      expect({
        title,
        englishTitle,
        shortDescription,
        description,
        price,
        requiresCertifiedPractitioner,
      }).toEqual({
        title: t.title,
        englishTitle: t.englishTitle,
        shortDescription: t.shortDescription,
        description: t.description,
        price: t.price,
        requiresCertifiedPractitioner: t.requiresCertifiedPractitioner,
      });
    }
  });

  it("only uses fields the treatment schema defines, and leaves photos, steps and SEO to editors", () => {
    const treatment = schemaTypes.find((t) => t.name === "treatment") as unknown as {
      fields: Array<{ name: string }>;
    };
    const known = new Set(["_id", "_type", ...treatment.fields.map((f) => f.name)]);
    for (const doc of seed) {
      for (const key of Object.keys(doc)) expect(known.has(key), `${doc._id}.${key}`).toBe(true);
      for (const key of ["image", "protocols", "benefits", "seo", "duration"]) {
        expect(doc).not.toHaveProperty(key);
      }
    }
  });
});

describe("treatment links", () => {
  it("match the bundled groups, in order", () => {
    const bundled = (groups: Array<{ group: string; treatments: Array<{ slug: string }> }>) =>
      Object.fromEntries(
        groups
          .filter((g) => g.treatments.length)
          .map((g) => [g.group, g.treatments.map((t) => t.slug)]),
      );
    expect(links.methodsPage).toEqual(bundled(methods));
    expect(links.servicesPage).toEqual(bundled(services));
  });

  it("only reference treatments in the seed", () => {
    const slugs = new Set(seed.map((d) => d.slug.current));
    for (const groups of Object.values(links)) {
      for (const list of Object.values(groups)) {
        for (const slug of list) expect(slugs.has(slug), slug).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatments-seed.test.ts`

Expected: FAIL (`ENOENT: scripts/seed/treatments.json`).

- [ ] **Step 3: Tạo `scripts/seed/treatments.json`**

Nội dung là mảng 11 object; chữ `shortDescription` và `description` trùng nhau và trùng `text` ở Task 4. Mỗi mục có dạng (ví dụ đầu tiên, đủ trường):

```json
{
  "_id": "treatment-dry-needling",
  "_type": "treatment",
  "title": "Châm khô",
  "englishTitle": "Dry Needling",
  "slug": { "_type": "slug", "current": "dry-needling" },
  "shortDescription": "Tác động vào các điểm co cứng (trigger point) để giải phóng căng thẳng, giảm đau và phục hồi chức năng thần kinh – cơ.",
  "description": "Tác động vào các điểm co cứng (trigger point) để giải phóng căng thẳng, giảm đau và phục hồi chức năng thần kinh – cơ.",
  "price": 299000,
  "requiresCertifiedPractitioner": true
}
```

Viết đủ 11 mục theo đúng thứ tự và giá trị của `catalogue` trong Task 4 (`slug` → `_id` = `treatment-<slug>`; `requiresCertifiedPractitioner` = `true` cho `dry-needling`, `electroacupuncture`, `chiropractic-adjustment`, còn lại `false`; **không** có khóa `englishTitle` cho `iastm` và `tapping`). Cách nhanh và tránh gõ sai chữ: sinh file từ dữ liệu fallback bằng lệnh một lần rồi kiểm tra bằng mắt với ảnh bảng giá:

```bash
cat > /tmp/gen-seed.test.ts <<'EOF'
import { writeFileSync } from "node:fs";
import { it } from "vitest";
import { treatments } from "@/lib/content";
it("writes the seed", () => {
  const docs = treatments.map((t) => ({
    _id: `treatment-${t.slug}`,
    _type: "treatment",
    title: t.title,
    ...(t.englishTitle ? { englishTitle: t.englishTitle } : {}),
    slug: { _type: "slug", current: t.slug },
    shortDescription: t.shortDescription,
    description: t.description,
    price: t.price,
    requiresCertifiedPractitioner: t.requiresCertifiedPractitioner ?? false,
  }));
  writeFileSync("scripts/seed/treatments.json", JSON.stringify(docs, null, 2) + "\n");
});
EOF
cp /tmp/gen-seed.test.ts tests/zz-gen-seed.test.ts && npx vitest run tests/zz-gen-seed.test.ts; rm tests/zz-gen-seed.test.ts
```

Sau đó đối chiếu từng `description` và `price` với ảnh bảng giá (tiếng Việt) ở `.context/attachments/PYMSmS/` trước khi commit.

- [ ] **Step 4: Tạo `scripts/seed/treatment-links.json`**

```json
{
  "methodsPage": {
    "manual": ["dry-needling", "cupping", "iastm", "tapping", "chiropractic-adjustment"],
    "electro": ["shockwave", "bio-electric", "therapeutic-ultrasound", "electroacupuncture"],
    "cold": ["cold-plunge"],
    "infrared": ["heat-light"]
  },
  "servicesPage": {
    "therapy": [
      "dry-needling",
      "cupping",
      "iastm",
      "tapping",
      "chiropractic-adjustment",
      "shockwave",
      "bio-electric",
      "therapeutic-ultrasound",
      "electroacupuncture"
    ],
    "recovery": ["heat-light", "cold-plunge"]
  }
}
```

(Nhóm không có liệu pháp — `rehab`, `training` — vắng mặt có chủ ý: script không đụng tới tham chiếu editor đã thêm ở các nhóm đó.)

- [ ] **Step 5: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/treatments-seed.test.ts`

Expected: PASS.

- [ ] **Step 6: Đồng bộ spec với cách làm này**

Trong `docs/superpowers/specs/2026-10-15-treatment-catalog-design.md`:

- Mục 7 điểm 1: thay câu về tám liệu pháp và lệnh `npx sanity documents create ... --missing` bằng: seed gồm **11 document** trong `scripts/seed/treatments.json` (nguồn dữ liệu duy nhất); `scripts/sync-treatments.mjs` tạo document chưa có (`createIfNotExists`, `_id: treatment-<slug>`), patch document đã có theo slug (mục 7 điểm 2) và gắn tham chiếu nhóm (điểm 3) trong một giao dịch, mặc định dry-run, theo quy ước `--project/--dataset/--apply/--confirm` của `scripts/transform-legacy-content.mjs`. Lý do thay lệnh CLI: một công cụ, có dry-run và kiểm tra phiên bản; CLI không có dry-run và chưa kiểm chứng việc nhận mảng nhiều document.
- Mục 10 test seed: "đúng 11 document" thay cho "đúng 8".

- [ ] **Step 7: Commit**

```bash
git add scripts/seed/treatments.json scripts/seed/treatment-links.json tests/treatments-seed.test.ts docs/superpowers/specs/2026-10-15-treatment-catalog-design.md
git commit -m "feat(treatments): add seed for the 11 price-list treatments and group links #10"
```

---

## Task 6: Trang chi tiết — dòng phụ, giá, chú thích `*`, bỏ thời lượng

**Files:**

- Modify: `app/treatments/[slug]/page.tsx` (hero)
- Modify: `app/treatments/[slug]/treatment-detail.module.css` (ba rule mới, bỏ `.duration`)
- Test: `tests/sanity.test.ts` (khối `treatment detail page`)

**Interfaces:**

- Consumes: `formatPrice`, `englishSubtitle`, `certifiedPractitionerNote` (Task 1); `Treatment.englishTitle`, `.requiresCertifiedPractitioner`, `.price` (Task 2).

- [ ] **Step 1: Cập nhật và thêm test**

Trong `tests/sanity.test.ts`, khối `describe("treatment detail page", ...)`:

(a) Trong test `"renders a full document with ordered protocol steps"`, đổi `expect(html).toContain("Thời lượng gợi ý");` thành `expect(html).not.toContain("Thời lượng gợi ý");` (fixture `full` có `duration: "45 phút"`, và trang không còn hiển thị thời lượng).

(b) Thêm các test sau cuối khối đó:

```ts
it("shows the English name as a subtitle, the price and the certified note", async () => {
  fetch.mockResolvedValue([
    {
      ...full,
      title: "Châm khô",
      englishTitle: "Dry Needling",
      price: 299000,
      requiresCertifiedPractitioner: true,
    },
  ]);
  const html = await render("full");
  expect(html).toContain("<h1>Châm khô</h1>");
  expect(html).toContain('lang="en">Dry Needling</p>');
  expect(html).toMatch(/Giá<\/span>\s*299\.000\s₫/);
  expect(html).toContain(
    "Các dịch vụ trị liệu này chỉ được thực hiện và theo dõi bởi chuyên viên có chứng nhận và chứng chỉ chuyên môn.",
  );
});
it("hides the subtitle when the English name repeats the title", async () => {
  fetch.mockResolvedValue([{ ...full, title: "IASTM", englishTitle: "iastm" }]);
  expect(await render("full")).not.toContain('lang="en"');
});
it.each([undefined, 0])("shows no price line for the price %s", async (price) => {
  fetch.mockResolvedValue([{ ...full, price }]);
  const html = await render("full");
  expect(html).not.toContain("Giá</span>");
  expect(html).not.toContain("₫");
});
it("shows the certified note even without a price, and not when the flag is off", async () => {
  fetch.mockResolvedValue([{ ...full, requiresCertifiedPractitioner: true }]);
  expect(await render("full")).toContain("chuyên viên có chứng nhận");
  fetch.mockResolvedValue([{ ...full, requiresCertifiedPractitioner: false }]);
  expect(await render("full")).not.toContain("chuyên viên có chứng nhận");
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/sanity.test.ts -t "treatment detail page"`

Expected: FAIL (trang vẫn hiện thời lượng; chưa có dòng phụ, giá, chú thích).

- [ ] **Step 3: Sửa `page.tsx`**

Thêm import (cạnh các import hiện có):

```tsx
import { certifiedPractitionerNote, englishSubtitle, formatPrice } from "@/lib/treatment-display";
```

Trong `TreatmentDetailPage`, sau `const protocols = ...;` thêm:

```tsx
const subtitle = englishSubtitle(treatment);
```

Trong khối hero, thay đoạn từ `<h1>` đến hết khối `duration` bằng:

```tsx
<h1>{treatment.title}</h1>;
{
  subtitle ? (
    <p className={styles.subtitle} lang="en">
      {subtitle}
    </p>
  ) : null;
}
{
  treatment.description ? <p>{treatment.description}</p> : null;
}
{
  treatment.price ? (
    <p className={styles.price}>
      <span>Giá</span> {formatPrice(treatment.price)}
    </p>
  ) : null;
}
{
  treatment.requiresCertifiedPractitioner ? (
    <p className={styles.note}>{certifiedPractitionerNote}</p>
  ) : null;
}
```

(Đoạn cũ gồm `<h1>{treatment.title}</h1>`, dòng `description`, và `{treatment.duration ? (<span className={styles.duration}>…</span>) : null}` — bỏ hẳn phần `duration`.)

- [ ] **Step 4: Sửa CSS module**

Trong `app/treatments/[slug]/treatment-detail.module.css`, thay rule `.duration { ... }` bằng ba rule sau (đặt **sau** rule `.hero p:not(.eyebrow)` để thắng cùng độ ưu tiên):

```css
.hero p.subtitle {
  margin: -8px 0 18px;
  font:
    500 12px/1.2 var(--font-mono),
    monospace;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--hero-emphasis);
}
.hero p.price {
  margin: 25px 0 0;
  padding-top: 12px;
  border-top: 1px solid rgba(247, 243, 240, 0.25);
  font:
    500 20px/1.2 var(--font-display),
    serif;
  color: #f7f3f0;
}
.hero p.price span {
  margin-right: 8px;
  font:
    500 11px var(--font-mono),
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--hero-emphasis);
}
.hero p.note {
  margin: 14px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(247, 243, 240, 0.72);
}
```

- [ ] **Step 5: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/sanity.test.ts`

Expected: PASS.

- [ ] **Step 6: Kiểm tra trên trình duyệt (giao diện)**

Run: `npx next dev -p 3418` (nền). Mở `http://localhost:3418/treatments/dry-needling` ở 1280 px và 375 px (Playwright hoặc trình duyệt): thấy `h1` "Châm khô", dòng phụ "DRY NEEDLING", dòng giá "GIÁ 299.000 ₫", câu chú thích `*`; `/treatments/iastm`: không có dòng phụ; `/treatments/tapping`: hero một cột (không ảnh), có giá, không có chú thích. Kiểm tra không cuộn ngang, một `h1`, thứ tự Tab hợp lý. Lưu ảnh vào `.context/`. Tắt server sau khi xong; nếu `next dev` đổi `next-env.d.ts`, chạy `git checkout next-env.d.ts`.

- [ ] **Step 7: Commit**

```bash
git add "app/treatments/[slug]/page.tsx" "app/treatments/[slug]/treatment-detail.module.css" tests/sanity.test.ts
git commit -m "feat(treatments): show English subtitle, price and certified note, drop duration #10"
```

---

## Task 7: Script đồng bộ Sanity (dry-run mặc định)

**Files:**

- Create: `scripts/lib/treatment-sync.mjs` (logic thuần)
- Create: `scripts/sync-treatments.mjs` (I/O)
- Test: `tests/treatment-sync.test.ts`

**Interfaces:**

- Consumes: `scripts/seed/treatments.json`, `scripts/seed/treatment-links.json` (Task 5).
- Produces: `planSync({ seed, links, treatments, pages, draftIds }) → { mutations, skipped, warnings }`. `mutations` là danh sách `{ createIfNotExists: doc }` hoặc `{ patch: { id, ifRevisionID, set?, unset? } }`.

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/treatment-sync.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error plain ESM script helper without type declarations
import { planSync } from "../scripts/lib/treatment-sync.mjs";

const seed = JSON.parse(readFileSync("scripts/seed/treatments.json", "utf8"));
const links = JSON.parse(readFileSync("scripts/seed/treatment-links.json", "utf8"));
const page = (id: string, groups: string[]) => ({
  _id: id,
  _rev: `${id}-rev`,
  groups: groups.map((group, i) => ({ _key: `k${i}`, group })),
});
const pages = () => ({
  methodsPage: page("methodsPage", ["manual", "electro", "rehab", "cold", "infrared"]),
  servicesPage: page("servicesPage", ["therapy", "training", "recovery"]),
});
// Production at the time of writing: three treatments with random legacy ids.
const production = [
  { _id: "legacy-cupping", _rev: "r1", slug: "cupping" },
  { _id: "legacy-cold", _rev: "r2", slug: "cold-plunge" },
  { _id: "legacy-heat", _rev: "r3", slug: "heat-light" },
];
const run = (overrides: object = {}) =>
  planSync({ seed, links, treatments: production, pages: pages(), draftIds: [], ...overrides });

describe("planSync", () => {
  it("creates the missing treatments and patches the existing ones by slug", () => {
    const { mutations } = run();
    const created = mutations.filter((m: object) => "createIfNotExists" in m);
    const patched = mutations.filter(
      (m: { patch?: { id: string } }) => m.patch && m.patch.id.startsWith("legacy-"),
    );
    expect(created).toHaveLength(8);
    expect(patched.map((m: { patch: { id: string } }) => m.patch.id).sort()).toEqual([
      "legacy-cold",
      "legacy-cupping",
      "legacy-heat",
    ]);
  });

  it("overwrites copy, price and flag on an existing treatment and unsets unreviewed content", () => {
    const { mutations } = run();
    const cupping = mutations.find(
      (m: { patch?: { id: string } }) => m.patch?.id === "legacy-cupping",
    ).patch;
    expect(cupping.ifRevisionID).toBe("r1");
    expect(cupping.set).toEqual({
      title: "Giác hơi",
      englishTitle: "Cupping",
      shortDescription: expect.any(String),
      description: expect.any(String),
      price: 99000,
      requiresCertifiedPractitioner: false,
    });
    expect(cupping.unset).toEqual(["seo", "benefits", "protocols", "duration"]);
    expect(cupping.set).not.toHaveProperty("slug");
  });

  it("clears a stale English title when the seed has none", () => {
    const { mutations } = run({
      treatments: [...production, { _id: "legacy-iastm", _rev: "r4", slug: "iastm" }],
    });
    const iastm = mutations.find(
      (m: { patch?: { id: string } }) => m.patch?.id === "legacy-iastm",
    ).patch;
    expect(iastm.set).not.toHaveProperty("englishTitle");
    expect(iastm.unset).toContain("englishTitle");
  });

  it("links groups to the right ids, keeping untouched groups alone", () => {
    const { mutations } = run();
    const methods = mutations.find(
      (m: { patch?: { id: string } }) => m.patch?.id === "methodsPage",
    ).patch;
    expect(methods.ifRevisionID).toBe("methodsPage-rev");
    expect(Object.keys(methods.set).sort()).toEqual([
      'groups[_key=="k0"].treatments',
      'groups[_key=="k1"].treatments',
      'groups[_key=="k3"].treatments',
      'groups[_key=="k4"].treatments',
    ]);
    const cold = methods.set['groups[_key=="k3"].treatments'];
    expect(cold).toEqual([{ _key: "cold-plunge", _type: "reference", _ref: "legacy-cold" }]);
    const electro = methods.set['groups[_key=="k1"].treatments'];
    expect(electro.map((r: { _ref: string }) => r._ref)).toEqual([
      "treatment-shockwave",
      "treatment-bio-electric",
      "treatment-therapeutic-ultrasound",
      "treatment-electroacupuncture",
    ]);
  });

  it("skips a page that was never seeded instead of failing", () => {
    const { mutations, skipped } = run({
      pages: { methodsPage: null, servicesPage: pages().servicesPage },
    });
    expect(skipped).toEqual(["methodsPage"]);
    expect(mutations.some((m: { patch?: { id: string } }) => m.patch?.id === "methodsPage")).toBe(
      false,
    );
  });

  it("stops when two documents share a slug", () => {
    expect(() =>
      run({ treatments: [...production, { _id: "dup", _rev: "r9", slug: "cupping" }] }),
    ).toThrow('Trùng slug "cupping"');
  });

  it("stops when a page lacks a group the links need", () => {
    expect(() =>
      run({ pages: { ...pages(), methodsPage: page("methodsPage", ["manual"]) } }),
    ).toThrow('methodsPage thiếu nhóm "electro"');
  });

  it("warns about open drafts instead of overwriting them silently", () => {
    const { warnings } = run({ draftIds: ["drafts.legacy-cupping", "drafts.methodsPage"] });
    expect(warnings).toEqual([
      "Có bản nháp đang mở: drafts.legacy-cupping, drafts.methodsPage. Bản nháp sẽ không đổi; kiểm tra trước khi publish.",
    ]);
  });

  it("is a no-op for the second run's creates: every seed slug is then 'existing'", () => {
    const after = seed.map((d: { slug: { current: string } }, i: number) => ({
      _id: `treatment-${d.slug.current}`,
      _rev: `r${i}`,
      slug: d.slug.current,
    }));
    const { mutations } = run({ treatments: after });
    expect(mutations.some((m: object) => "createIfNotExists" in m)).toBe(false);
  });
});
```

- [ ] **Step 2: Chạy test, xác nhận thất bại**

Run: `npx vitest run tests/treatment-sync.test.ts`

Expected: FAIL (`Failed to resolve import "../scripts/lib/treatment-sync.mjs"`).

- [ ] **Step 3: Viết `scripts/lib/treatment-sync.mjs`**

```js
// Pure planning for scripts/sync-treatments.mjs: no network, no files. See
// docs/superpowers/specs/2026-10-15-treatment-catalog-design.md section 7.

// Content the owner has not reviewed (spec decision 4) and the unused duration field.
const UNSET = ["seo", "benefits", "protocols", "duration"];

/**
 * @param seed        documents from scripts/seed/treatments.json
 * @param links       scripts/seed/treatment-links.json
 * @param treatments  published treatments in the dataset: { _id, _rev, slug }
 * @param pages       { methodsPage, servicesPage }: { _id, _rev, groups: [{ _key, group }] } or null
 * @param draftIds    ids of open drafts for treatments and the two pages
 */
export function planSync({ seed, links, treatments, pages, draftIds = [] }) {
  const existingBySlug = new Map();
  for (const treatment of treatments) {
    if (existingBySlug.has(treatment.slug)) throw new Error(`Trùng slug "${treatment.slug}"`);
    existingBySlug.set(treatment.slug, treatment);
  }

  const mutations = [];
  const idBySlug = new Map();
  for (const doc of seed) {
    const slug = doc.slug.current;
    const existing = existingBySlug.get(slug);
    if (!existing) {
      idBySlug.set(slug, doc._id);
      mutations.push({ createIfNotExists: doc });
      continue;
    }
    idBySlug.set(slug, existing._id);
    // identity fields stay as they are; everything else is overwritten
    const fields = { ...doc };
    delete fields._id;
    delete fields._type;
    delete fields.slug;
    mutations.push({
      patch: {
        id: existing._id,
        ifRevisionID: existing._rev,
        set: fields,
        unset: fields.englishTitle ? UNSET : [...UNSET, "englishTitle"],
      },
    });
  }

  const skipped = [];
  for (const [pageId, groups] of Object.entries(links)) {
    const page = pages[pageId];
    if (!page) {
      skipped.push(pageId);
      continue;
    }
    const set = {};
    for (const [group, slugs] of Object.entries(groups)) {
      if (!slugs.length) continue;
      const found = page.groups?.find((g) => g.group === group);
      if (!found) throw new Error(`${pageId} thiếu nhóm "${group}"`);
      set[`groups[_key=="${found._key}"].treatments`] = slugs.map((slug) => ({
        _key: slug,
        _type: "reference",
        _ref: idBySlug.get(slug),
      }));
    }
    mutations.push({ patch: { id: pageId, ifRevisionID: page._rev, set } });
  }

  const warnings = draftIds.length
    ? [
        `Có bản nháp đang mở: ${draftIds.join(", ")}. Bản nháp sẽ không đổi; kiểm tra trước khi publish.`,
      ]
    : [];
  return { mutations, skipped, warnings };
}
```

- [ ] **Step 4: Chạy test, xác nhận đạt**

Run: `npx vitest run tests/treatment-sync.test.ts`

Expected: PASS (9 test).

- [ ] **Step 5: Viết `scripts/sync-treatments.mjs`**

```js
// Create the 11 price-list treatments, overwrite the 3 existing ones, and link them to the
// /treatments and /services groups. One transaction, revision-guarded.
//
// Dry run (default): node --env-file=.env.local scripts/sync-treatments.mjs --project <id> --dataset staging
// Apply: add --apply --confirm <id>/staging after reviewing the dry run.
// Needs SANITY_AUTH_TOKEN (write access). Writes a backup to .context/ before applying.

import { createClient } from "@sanity/client";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { planSync } from "./lib/treatment-sync.mjs";

const { values } = parseArgs({
  options: {
    project: { type: "string" },
    dataset: { type: "string" },
    apply: { type: "boolean", default: false },
    confirm: { type: "string" },
  },
});
if (!values.project || !values.dataset) {
  console.error("Explicit --project and --dataset are required. Default mode is dry run.");
  process.exit(1);
}
const target = `${values.project}/${values.dataset}`;
if (values.apply && values.confirm !== target) {
  console.error(`Applying requires --confirm ${target}. Run without --apply to review first.`);
  process.exit(1);
}
if (!process.env.SANITY_AUTH_TOKEN) {
  console.error("SANITY_AUTH_TOKEN (write access) is required, even for a dry run.");
  process.exit(1);
}
console.log(`${values.apply ? "APPLY" : "DRY RUN"}: ${target}`);

const client = createClient({
  projectId: values.project,
  dataset: values.dataset,
  token: process.env.SANITY_AUTH_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
  perspective: "raw",
});
const seed = JSON.parse(readFileSync("scripts/seed/treatments.json", "utf8"));
const links = JSON.parse(readFileSync("scripts/seed/treatment-links.json", "utf8"));

const published = `!(_id in path("drafts.**"))`;
const treatments = await client.fetch(
  `*[_type == "treatment" && ${published}]{_id, _rev, "slug": slug.current}`,
);
const pages = Object.fromEntries(
  await Promise.all(
    Object.keys(links).map(async (id) => [
      id,
      await client.fetch(`*[_id == $id][0]{_id, _rev, "groups": groups[]{_key, group}}`, { id }),
    ]),
  ),
);
const draftIds = await client.fetch(
  `*[_id in path("drafts.**") && (_type == "treatment" || _type in ["methodsPage", "servicesPage"])]._id`,
);

const { mutations, skipped, warnings } = planSync({ seed, links, treatments, pages, draftIds });
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
for (const id of skipped) console.warn(`Skipped (not in this dataset): ${id}`);
for (const mutation of mutations) {
  if (mutation.createIfNotExists) console.log("Would create:", mutation.createIfNotExists._id);
  else console.log("Would patch:", mutation.patch.id, JSON.stringify(mutation.patch));
}
if (!values.apply) {
  console.log(`${mutations.length} mutations planned. Nothing written.`);
  process.exit(0);
}

const ids = mutations.map((m) => m.createIfNotExists?._id ?? m.patch.id);
const before = await client.fetch(`*[_id in $ids]`, { ids });
mkdirSync(".context", { recursive: true });
const backup = `.context/treatments-before-${values.dataset}.json`;
writeFileSync(backup, JSON.stringify(before, null, 2));
console.log(`Backed up ${before.length} documents to ${backup}`);

const transaction = client.transaction();
for (const mutation of mutations) {
  if (mutation.createIfNotExists) {
    transaction.createIfNotExists(mutation.createIfNotExists);
    continue;
  }
  const { id, ifRevisionID, set, unset } = mutation.patch;
  transaction.patch(id, (patch) => {
    patch = patch.ifRevisionId(ifRevisionID);
    if (set && Object.keys(set).length) patch = patch.set(set);
    if (unset?.length) patch = patch.unset(unset);
    return patch;
  });
}
const result = await transaction.commit();
console.log(`Committed transaction ${result.transactionId}: ${result.results.length} documents.`);
```

- [ ] **Step 6: Kiểm tra cú pháp và lint**

Run: `node --check scripts/sync-treatments.mjs && npx eslint scripts/sync-treatments.mjs scripts/lib/treatment-sync.mjs tests/treatment-sync.test.ts --max-warnings 0`

Expected: không có lỗi. Chạy thiếu tham số: `node scripts/sync-treatments.mjs` → in `Explicit --project and --dataset are required...` và thoát mã 1.

- [ ] **Step 7: Commit**

```bash
git add scripts/lib/treatment-sync.mjs scripts/sync-treatments.mjs tests/treatment-sync.test.ts
git commit -m "feat(treatments): add dry-run sync script for the price-list catalogue #10"
```

---

## Task 8: Tài liệu, kiểm chứng và triển khai có kiểm soát

**Files:**

- Modify: `docs/CONTENT_INVENTORY.md`
- Create: `docs/TREATMENTS_VERIFICATION.md`

- [ ] **Step 1: Cập nhật kiểm kê nội dung**

Trong `docs/CONTENT_INVENTORY.md`, bảng chính:

- Dòng `Service and method copy`: thêm vào cột Value/location `/treatments/[slug]` (11 trang); cột Source giữ nguyên.
- Thêm dòng mới `Treatment prices on /treatments/[slug]` | Giá từng liệu pháp (99k–349k) theo bảng giá, hiển thị dạng "149.000 ₫" | Owner price list supplied 2026-10-09; owner cho phép hiển thị giá theo bảng giá (hội thoại 2026-10-15) | confirmed. Ghi rõ: giá dịch vụ trên `/services` (tư vấn, massage, tập luyện) chưa hiển thị, issue riêng.
- Thêm dòng `Certified-practitioner note (*)` | Câu chú thích nguyên văn dưới giá của Châm khô, Điện châm, Nắn chỉnh cột sống | Footnote của bảng giá (bản tiếng Việt) | confirmed.
- Thêm dòng `Cupping detox wording` | "giải độc cơ thể" trong mô tả Giác hơi | Bảng giá owner (tiếng Việt và tiếng Anh "support detoxification"); owner cho hiển thị theo bảng giá; không có nguồn độc lập | confirmed (owner wording).

- [ ] **Step 2: Tạo `docs/TREATMENTS_VERIFICATION.md`**

```markdown
# Treatment catalogue verification (#10)

Spec: `docs/superpowers/specs/2026-10-15-treatment-catalog-design.md`. Mark an item only after it has been checked; attach the evidence (command output, screenshot path, staging URL).

## Automated

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`

## Copy and prices

- [ ] Every `description`, English name and price in `scripts/seed/treatments.json` compared with the owner's price-list image (Vietnamese and English): <result>
- [ ] `*` shown on Châm khô, Điện châm, Nắn chỉnh cột sống only: <result>

## Staging (project yjzexxml, dataset staging)

- [ ] Dry run output reviewed: `node --env-file=.env.local scripts/sync-treatments.mjs --project yjzexxml --dataset staging`
- [ ] Applied: `... --apply --confirm yjzexxml/staging`; backup at `.context/treatments-before-staging.json`
- [ ] Second dry run plans no creates (11 treatments exist) and only idempotent patches
- [ ] `/treatments` and `/services` link all 11 pages under their groups
- [ ] Full document, document missing optional fields, and unknown slug (real 404) checked
- [ ] Price, English subtitle and `*` note correct at 1280, 768 and 375 px; keyboard; no horizontal scroll
- [ ] Form submit on one `*` treatment and one other: email row "Liệu pháp" shows the Vietnamese name; success text does not confirm an appointment
- [ ] Sanity webhook filter includes `treatment`, `methodsPage`, `servicesPage`; a publish revalidates the page

## Production (only after the owner confirms the staging result)

- [ ] Owner confirmation recorded: <who, when>
- [ ] Dry run output reviewed, backup taken, applied with `--confirm yjzexxml/production`
- [ ] Spot check of the three overwritten treatments and one new treatment on the live site
```

(Các `<result>`/`<who, when>` là chỗ điền bằng chứng khi kiểm chứng, không phải việc còn thiếu của kế hoạch.)

- [ ] **Step 3: Chạy kiểm tra đầy đủ**

Run: `npm run lint && npm run typecheck && npm test && npm run build`

Expected: tất cả sạch. Nếu `npm run typecheck` hay `next dev` làm đổi `next-env.d.ts`, chạy `git checkout next-env.d.ts`.

- [ ] **Step 4: Commit tài liệu**

```bash
npx prettier --write docs/CONTENT_INVENTORY.md docs/TREATMENTS_VERIFICATION.md
git add docs/CONTENT_INVENTORY.md docs/TREATMENTS_VERIFICATION.md
git commit -m "docs(treatments): record price, footnote and detox wording and add verification checklist #10"
```

- [ ] **Step 5: Staging (cần người có `SANITY_AUTH_TOKEN`)**

Dừng và nhờ người dùng chạy hoặc cung cấp token qua môi trường (không dán vào chat). Dry run trước:

`node --env-file=.env.local scripts/sync-treatments.mjs --project yjzexxml --dataset staging`

Đính kèm kết quả cho người dùng xem. Chỉ khi họ đồng ý mới thêm `--apply --confirm yjzexxml/staging`. Điền kết quả vào `docs/TREATMENTS_VERIFICATION.md`.

- [ ] **Step 6: Production — DỪNG tại đây**

Không chạy với `--dataset production` cho tới khi chủ sở hữu xác nhận riêng sau khi xem kết quả staging (spec mục 7 điểm 4). Khi được phép: dry run, kiểm tra bản sao lưu `.context/treatments-before-production.json` có đủ document, rồi `--apply --confirm yjzexxml/production`.
