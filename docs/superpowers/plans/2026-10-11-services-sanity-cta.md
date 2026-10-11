# Khám phá dịch vụ từ Sanity tới CTA tư vấn — Kế hoạch triển khai (#8, bản 2: singleton `servicesPage`)

> **Dành cho agent thực thi:** dùng superpowers:subagent-driven-development (khuyến nghị) hoặc superpowers:executing-plans để làm từng task. Các bước dùng checkbox (`- [ ]`). Kế hoạch này **thay thế** bản đầu (document `service` tự do + `order` + validator async).

**Mục tiêu:** Editor sửa nội dung ba nhóm dịch vụ, thứ tự (kéo thả), ảnh và liên kết liệu pháp trong một document Sanity duy nhất; `/services` giữ nguyên layout và dẫn tới treatment hoặc `/booking` kèm ngữ cảnh dịch vụ.

**Kiến trúc:** Một singleton `servicesPage` có mảng `groups` gồm ba object `serviceGroup`, mỗi object ghim một `group` (`therapy` / `training` / `recovery`). Thứ tự mảng là thứ tự hiển thị. Validation cấp mảng (hàm thuần `validateServiceGroups`) chặn publish khi thiếu hoặc trùng nhóm; lớp zod/dedupe ở `getServices()` vẫn giữ vì validation chỉ chạy trong Studio. Danh sách ba nhóm có đúng một nguồn: `serviceGroups` trong `lib/content.ts`.

**Tech stack:** Next.js 16 (App Router, `searchParams` là Promise), Sanity Studio 6.17.0 (`sanity`, `@sanity/schema`, `@sanity/validation`), zod, vitest.

**Spec:** thiết kế được duyệt trong chat ngày 2026-10-11 (hướng A, "Xác nhận A"). Căn cứ kỹ thuật và nguồn: `docs/services-schema-research.md`. Bối cảnh: `docs/superpowers/specs/2026-10-09-service-catalogue-sanity-design.md` (phần `service` do #8 xử lý). Yêu cầu gốc: GitHub issue #8.

## Hiện trạng workspace `issue-8` (chưa commit)

Đã có và **giữ nguyên**: `app/services/page.tsx` (render từ `getServices()`, CTA "Đặt lịch →" → `/booking?service=<group>`), `app/booking/page.tsx` (ngữ cảnh dịch vụ, chịu lỗi Sanity, không gọi Sanity khi `/booking` trơn), `serviceFallbackImage` và fallback `services` trong `lib/content.ts`, `tests/services-fallback.test.ts`, `tests/footer-links.test.ts`.

Sẽ **đổi**: `lib/content.ts` (nguồn nhóm duy nhất, bỏ `slug`), `lib/sanity.ts` (query singleton, chịu `null`), `sanity/schemaTypes/index.ts` (bỏ document `service`, thêm `serviceGroup` + `servicesPage`), `sanity.config.ts` (thêm singleton), `tests/services-sanity.test.tsx`.

Sẽ **thêm**: `sanity/serviceGroups.ts`, `scripts/seed/services-page.json`, các file test mới, hai devDependency.

## Global Constraints

- Không page builder, không route chi tiết dịch vụ mới; chỉ thêm trường mà trang hiện có cần. Không hiển thị giá.
- Dataset đã cấu hình là nguồn duy nhất: thiếu singleton hoặc thiếu nhóm thì `/services` không có section đó (không bù từ fallback). Fallback chỉ dùng khi `projectId === "missing-project-id"`.
- Nhãn CTA là "Đặt lịch →" cho cả ba nhóm; ngữ cảnh đi theo URL (`/booking?service=<group>`).
- Chỉ nhận ảnh từ `cdn.sanity.io`, ảnh khác rơi về ảnh local của nhóm; ảnh công khai không lộ mặt người (`PRODUCT.md`).
- `_id` không chứa dấu chấm (document có dấu chấm không công khai được): `servicesPage`, `treatment-<slug>`.
- Singleton dùng cách thủ công của `siteSettings` (Structure + `newDocumentOptions` + allowlist `document.actions`). **Không** dùng `document.singletons` (`@beta` ở Studio 6.17.0).
- `validateDocument` của `@sanity/validation` là `@beta`: chỉ gọi nó ở một helper duy nhất trong test (`check`).
- Dependency pin chính xác như các gói khác (`docs/DEPENDENCY_UPGRADE.md`): `@sanity/schema` và `@sanity/validation` cùng `6.17.0` với `sanity`.
- Không có dòng attribution của Claude trong commit/PR (memory của repo); PR dùng `Refs #8`, không dùng `Closes #8`.
- Sau mỗi task: `npx vitest run`, `npm run lint`, `npm run typecheck` xanh.
- Một commit duy nhất ở Task 8 (không commit giữa chừng) để lịch sử không chứa thiết kế `service` đã bị thay.

## Review Focus

- **Singleton chưa tồn tại** (dataset mới, trước lần publish đầu): query trả `null`, `/services` không lỗi, section trống. Pin ở Task 4.
- **Ghi qua API làm trùng/thiếu/sai `group`** (validation không chạy ngoài Studio): zod dedupe theo group, bỏ nhóm không hợp lệ. Pin bằng test sẵn có (Task 4) và `validateServiceGroups` (Task 2).
- **Ảnh có asset mà thiếu alt, hoặc thiếu ảnh:** Studio chặn publish khi có ảnh mà không có alt (Task 3); frontend dùng alt = tên nhóm và ảnh local của nhóm (đã có test).
- **Reference liệu pháp trùng, không có slug hoặc trỏ tới document không còn:** `rule.unique()`, `options.filter`, và zod bỏ `null`. Pin ở Task 3 (unique) và Task 4 (null).
- **Editor rơi vào trạng thái kẹt** (`group` readOnly, không thêm/xoá nhóm được, tài liệu hỏng do ghi qua API): lối thoát là Discard changes hoặc ghi lại bằng CLI; không tự động hoá được, kiểm tra ở Task 9 bước 5.

---

### Task 1: Một nguồn duy nhất cho ba nhóm (`lib/content.ts`)

**Files:**

- Modify: `lib/content.ts` (`ServiceGroup`, `Service`, fallback `services`)
- Test: `tests/service-groups.test.ts` (tạo mới)

**Interfaces:**

- Produces: `export const serviceGroups: readonly ["therapy", "training", "recovery"]`; `export type ServiceGroup = (typeof serviceGroups)[number]`; `Service` không còn `slug`.

- [ ] **Step 1: Viết test lỗi**

```ts
// tests/service-groups.test.ts
import { describe, expect, it } from "vitest";
import { serviceAnchor, serviceFallbackImage, serviceGroups, services } from "@/lib/content";

describe("service groups", () => {
  it("is the single list behind anchors, fallback images and fallback services", () => {
    expect(serviceGroups).toEqual(["therapy", "training", "recovery"]);
    expect(Object.keys(serviceAnchor)).toEqual([...serviceGroups]);
    expect(Object.keys(serviceFallbackImage)).toEqual([...serviceGroups]);
    expect(services.map((s) => s.group)).toEqual([...serviceGroups]);
  });

  it("does not carry a slug (there is no service detail route)", () => {
    for (const service of services) expect(service).not.toHaveProperty("slug");
  });
});
```

- [ ] **Step 2: Chạy, xác nhận fail đúng lý do**

Run: `npx vitest run tests/service-groups.test.ts`
Expected: FAIL (`serviceGroups` chưa được export; và fallback còn `slug`).

- [ ] **Step 3: Cài đặt tối thiểu trong `lib/content.ts`**

Thay dòng `export type ServiceGroup = "therapy" | "training" | "recovery";` bằng:

```ts
export const serviceGroups = ["therapy", "training", "recovery"] as const;
export type ServiceGroup = (typeof serviceGroups)[number];
```

Trong `export type Service = {...}` xoá dòng `slug: string;`. Trong mảng `services` xoá ba dòng `slug: "tri-lieu-bang-tay",`, `slug: "tap-luyen-phuc-hoi-tang-cuong",`, `slug: "ngam-lanh-den-hong-ngoai",`.

- [ ] **Step 4: Chạy lại**

Run: `npx vitest run tests/service-groups.test.ts tests/services-fallback.test.ts tests/footer-links.test.ts`
Expected: PASS.

### Task 2: Validator cấp mảng `validateServiceGroups` (hàm thuần)

**Files:**

- Create: `sanity/serviceGroups.ts`
- Test: `tests/service-groups-validation.test.ts` (tạo mới)

**Interfaces:**

- Consumes: `serviceGroups` (Task 1).
- Produces: `validateServiceGroups(items: Array<{ _key?: string; group?: string }> | undefined): true | Array<{ message: string; path?: [{ _key: string }] }>`.

Lý do dùng hàm riêng: `rule.unique()` so sánh sâu cả object (chỉ bỏ `_key`) nên hai item cùng `group` khác nội dung vẫn qua (`docs/services-schema-research.md` mục 3.1).

- [ ] **Step 1: Viết test lỗi**

```ts
// tests/service-groups-validation.test.ts
import { describe, expect, it } from "vitest";
import { validateServiceGroups } from "@/sanity/serviceGroups";

const item = (group: string | undefined, _key = group ?? "empty") => ({ _key, group });

describe("validateServiceGroups", () => {
  it("accepts the three groups in any order", () => {
    expect(validateServiceGroups([item("recovery"), item("therapy"), item("training")])).toBe(true);
  });

  it("flags the second item of a duplicated group by _key", () => {
    const result = validateServiceGroups([
      item("therapy", "a"),
      item("therapy", "b"),
      item("training"),
      item("recovery"),
    ]);
    expect(result).toEqual([{ message: 'Nhóm "therapy" bị trùng.', path: [{ _key: "b" }] }]);
  });

  it("reports every missing group", () => {
    expect(validateServiceGroups([item("therapy")])).toEqual([
      { message: 'Thiếu nhóm "training".' },
      { message: 'Thiếu nhóm "recovery".' },
    ]);
  });

  it("rejects an unknown or empty group on that item", () => {
    const result = validateServiceGroups([
      item("nonsense", "u"),
      item(undefined, "e"),
      item("therapy"),
      item("training"),
      item("recovery"),
    ]);
    expect(result).toEqual([
      { message: "Chọn một nhóm hợp lệ.", path: [{ _key: "u" }] },
      { message: "Chọn một nhóm hợp lệ.", path: [{ _key: "e" }] },
    ]);
  });

  it("treats a missing array as all groups missing", () => {
    expect(validateServiceGroups(undefined)).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Chạy, xác nhận fail**

Run: `npx vitest run tests/service-groups-validation.test.ts`
Expected: FAIL (module `@/sanity/serviceGroups` chưa có).

- [ ] **Step 3: Cài đặt**

```ts
// sanity/serviceGroups.ts
import { serviceGroups } from "@/lib/content";

type Item = { _key?: string; group?: string };
type Failure = { message: string; path?: [{ _key: string }] };

// Studio-only guard: exactly one item per group. Content written through the API skips it, so
// getServices() still dedupes.
export function validateServiceGroups(items: Item[] | undefined): true | Failure[] {
  const failures: Failure[] = [];
  const seen = new Set<string>();
  for (const item of items ?? []) {
    const path = item._key ? ([{ _key: item._key }] as [{ _key: string }]) : undefined;
    if (!item.group || !(serviceGroups as readonly string[]).includes(item.group)) {
      failures.push({ message: "Chọn một nhóm hợp lệ.", path });
    } else if (seen.has(item.group)) {
      failures.push({ message: `Nhóm "${item.group}" bị trùng.`, path });
    } else {
      seen.add(item.group);
    }
  }
  for (const group of serviceGroups) {
    if (!seen.has(group)) failures.push({ message: `Thiếu nhóm "${group}".` });
  }
  return failures.length ? failures : true;
}
```

- [ ] **Step 4: Chạy lại**

Run: `npx vitest run tests/service-groups-validation.test.ts`
Expected: PASS (5 test).

### Task 3: Schema `serviceGroup` + `servicesPage`

**Files:**

- Modify: `package.json`, `package-lock.json` (hai devDependency)
- Modify: `sanity/schemaTypes/index.ts` (bỏ `serviceGroups` list và document `service`, bỏ import `apiVersion`; thêm hai type, đăng ký trong `schemaTypes`)
- Test: `tests/services-schema.test.ts` (tạo mới)

**Interfaces:**

- Consumes: `serviceGroups`, `ServiceGroup` (Task 1), `validateServiceGroups` (Task 2).
- Produces: document `servicesPage` (`_id` cố định `servicesPage`) với `groups: serviceGroup[]`; mỗi `serviceGroup` có `group`, `title`, `shortTitle?`, `summary`, `body`, `bullets?`, `image?` (+ `alt`), `treatments?` (reference tới `treatment`).

- [ ] **Step 1: Thêm devDependency (chỉ để test chạy validation thật của Sanity)**

Run: `npm install -D --save-exact @sanity/schema@6.17.0 @sanity/validation@6.17.0`
Expected: `package.json` có hai dòng mới, `package-lock.json` đổi; hai gói đã nằm trong `node_modules` ở đúng bản 6.17.0 nên không kéo thêm gói lạ (kiểm tra `git diff --stat package-lock.json` chỉ đổi nhỏ).

- [ ] **Step 2: Viết test lỗi**

```ts
// tests/services-schema.test.ts
import { Schema } from "@sanity/schema";
import { validateDocument } from "@sanity/validation";
import { describe, expect, it } from "vitest";
import { serviceGroups } from "@/lib/content";
import { schemaTypes } from "@/sanity/schemaTypes";

const schema = Schema.compile({ name: "test", types: schemaTypes });
const client: any = { withConfig: () => client, fetch: async () => 0 };
// validateDocument is @beta: keep this the only place that calls it.
const check = async (document: object) => {
  const result = await validateDocument({
    document,
    schema,
    client,
    getDocumentExists: async () => true,
  } as never);
  return { status: result.status, messages: result.markers.map((m) => m.message) };
};
const group = (name: string, extra: object = {}) => ({
  _key: name,
  _type: "serviceGroup",
  group: name,
  title: `Tên ${name}`,
  summary: "Tóm tắt",
  body: "Nội dung",
  ...extra,
});
const page = (groups?: object[]) => ({ _id: "servicesPage", _type: "servicesPage", groups });
const three = () => serviceGroups.map((name) => group(name));

describe("servicesPage schema", () => {
  const servicesPage = schemaTypes.find((t) => t.name === "servicesPage") as unknown as {
    fields: Array<{ name: string; initialValue?: Array<{ group: string }>; options?: any }>;
  };
  const groupsField = servicesPage?.fields.find((f) => f.name === "groups");

  it("has a servicesPage singleton type and no free-form service document", () => {
    const names = schemaTypes.map((t) => t.name);
    expect(names).toContain("servicesPage");
    expect(names).toContain("serviceGroup");
    expect(names).not.toContain("service");
  });

  it("pre-fills the three groups in pathway order and locks add/remove", () => {
    expect(groupsField?.initialValue?.map((g) => g.group)).toEqual([...serviceGroups]);
    expect(groupsField?.options?.disableActions).toEqual(
      expect.arrayContaining(["add", "addBefore", "addAfter", "remove", "duplicate"]),
    );
  });

  it("accepts three complete groups", async () => {
    expect((await check(page(three()))).status).toBe("passed");
  });

  it("blocks publishing a duplicated group", async () => {
    const duplicated = [
      group("therapy"),
      { ...group("therapy"), _key: "again" },
      group("training"),
    ];
    const { status, messages } = await check(page([...duplicated, group("recovery")]));
    expect(status).toBe("failed");
    expect(messages).toContain('Nhóm "therapy" bị trùng.');
  });

  it("blocks publishing with a missing group or no groups at all", async () => {
    expect((await check(page([group("therapy"), group("training")]))).messages).toContain(
      'Thiếu nhóm "recovery".',
    );
    expect((await check(page(undefined))).status).toBe("failed");
  });

  it("requires title, summary and body for every group", async () => {
    for (const missing of ["title", "summary", "body"]) {
      const groups = [
        group("therapy", { [missing]: undefined }),
        group("training"),
        group("recovery"),
      ];
      expect((await check(page(groups))).status, missing).toBe("failed");
    }
  });

  it("requires alt text once an image is chosen", async () => {
    const image = {
      _type: "image",
      asset: { _type: "reference", _ref: "image-abc123-100x100-jpg" },
    };
    const groups = [group("therapy", { image }), group("training"), group("recovery")];
    expect((await check(page(groups))).messages).toContain("Cần alt text khi có ảnh.");
  });

  it("rejects the same treatment twice in one group", async () => {
    const ref = (key: string) => ({ _key: key, _type: "reference", _ref: "treatment-cupping" });
    const groups = [
      group("therapy", { treatments: [ref("1"), ref("2")] }),
      group("training"),
      group("recovery"),
    ];
    expect((await check(page(groups))).status).toBe("failed");
  });
});
```

- [ ] **Step 3: Chạy, xác nhận fail đúng lý do**

Run: `npx vitest run tests/services-schema.test.ts`
Expected: FAIL (không có type `servicesPage`/`serviceGroup`, còn type `service`).

- [ ] **Step 4: Cài đặt schema**

Trong `sanity/schemaTypes/index.ts`:

1. Thay dòng `import { apiVersion } from "../env";` bằng:

```ts
import { serviceGroups, type ServiceGroup } from "@/lib/content";
import { validateServiceGroups } from "@/sanity/serviceGroups";
```

2. Xoá toàn bộ khối từ `const serviceGroups = [` (list có `title`/`value`) đến hết `const service = defineType({...});`, thay bằng:

```ts
const serviceGroupTitles: Record<ServiceGroup, string> = {
  therapy: "Trị liệu",
  training: "Tập luyện",
  recovery: "Thư giãn & hồi phục",
};
const serviceGroup = defineType({
  name: "serviceGroup",
  title: "Nhóm dịch vụ",
  type: "object",
  fields: [
    defineField({
      name: "group",
      title: "Nhóm",
      description: "Cố định sau khi tạo. Quyết định mục neo và ngữ cảnh khi khách bấm Đặt lịch.",
      type: "string",
      options: {
        list: serviceGroups.map((value) => ({ value, title: serviceGroupTitles[value] })),
        layout: "radio",
      },
      readOnly: ({ value }) => Boolean(value),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Tên dịch vụ",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortTitle",
      title: "Tên ngắn trên thẻ chọn nhóm",
      description: "Bỏ trống để dùng tên dịch vụ.",
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Mô tả ngắn trên thẻ chọn nhóm",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Nội dung",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bullets",
      title: "Ý chính",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "image",
      title: "Ảnh",
      description: "Bỏ trống để dùng ảnh mặc định của nhóm. Ảnh không được lộ mặt người.",
      type: "image",
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
    }),
    defineField({
      name: "treatments",
      title: "Liệu pháp liên quan",
      description: "Hiện thành liên kết tới trang liệu pháp. Chỉ chọn được liệu pháp có slug.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "treatment" }],
          options: { filter: "defined(slug.current)", disableNew: true },
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { title: "title", group: "group", media: "image" },
    prepare: ({ title, group, media }) => ({
      title,
      subtitle: serviceGroupTitles[group as ServiceGroup],
      media,
    }),
  },
});
const servicesPage = defineType({
  name: "servicesPage",
  title: "Trang Dịch vụ",
  type: "document",
  fields: [
    defineField({
      name: "groups",
      title: "Ba nhóm dịch vụ",
      description:
        "Kéo để đổi thứ tự hiển thị. Phải đủ trị liệu, tập luyện, thư giãn, mỗi nhóm một lần.",
      type: "array",
      of: [defineArrayMember({ type: "serviceGroup" })],
      options: { disableActions: ["add", "addBefore", "addAfter", "remove", "duplicate"] },
      initialValue: serviceGroups.map((group) => ({ _type: "serviceGroup", group })),
      validation: (rule) =>
        rule.required().custom<Array<{ _key?: string; group?: string }>>(validateServiceGroups),
    }),
  ],
  preview: { prepare: () => ({ title: "Trang Dịch vụ" }) },
});
```

(Đã bỏ `slug` và `seo` của dịch vụ: trang `/services` không dùng chúng.)

3. Ở cuối file, trong mảng `schemaTypes`, thay `service,` bằng `serviceGroup, servicesPage,`.

- [ ] **Step 5: Chạy test schema, rồi lint và typecheck**

Run: `npx vitest run tests/services-schema.test.ts && npm run lint && npm run typecheck`
Expected: PASS. Nếu `custom<...>(validateServiceGroups)` báo lỗi kiểu, bọc: `.custom((value) => validateServiceGroups(value as never))`; không đổi hành vi. Nếu helper `check` báo lỗi kiểu của `validateDocument` (beta), giữ cast `as never` ở đúng chỗ đó.

### Task 4: `getServices()` đọc singleton, chịu `null`

**Files:**

- Modify: `lib/sanity.ts` (`serviceSchema`, `fetchRecords`, `getServices`)
- Modify: `tests/services-sanity.test.tsx`

**Interfaces:**

- Consumes: `serviceGroups`, `Service` (Task 1).
- Produces: `getServices(): Promise<Service[]>` — thứ tự mảng của editor, không trùng group; `[]` khi chưa có singleton.

- [ ] **Step 1: Sửa test thành đỏ**

Trong `tests/services-sanity.test.tsx`:

1. Thay test đầu ("asks Sanity for services in editor order") bằng:

```tsx
it("reads the servicesPage singleton in array order", async () => {
  fetch.mockResolvedValue([]);
  await getServices();
  const query = fetch.mock.calls[0][0] as string;
  expect(query).toContain('_id == "servicesPage"');
  expect(query).toContain(".groups");
  expect(query).not.toContain("order(");
});

it("treats a missing servicesPage as no services instead of an error", async () => {
  fetch.mockResolvedValue(null);
  expect(await getServices()).toEqual([]);
});
```

2. Trong `describe("services from Sanity")` thêm:

```tsx
it("renders /services without sections before the singleton exists", async () => {
  fetch.mockResolvedValue(null);
  const html = renderToStaticMarkup(await ServicesPage());
  expect(html).toContain("<h1>Dịch vụ</h1>");
  expect(html).not.toContain("svc-");
  expect(html).not.toContain("/booking?service=");
});
```

3. Xoá dòng `slug: \`svc-${group}\`,`khỏi hàm`service` ở đầu file (nhóm không còn slug).

- [ ] **Step 2: Chạy, xác nhận fail đúng lý do**

Run: `npx vitest run tests/services-sanity.test.tsx`
Expected: FAIL ở ba test mới/sửa (query cũ là `_type == "service"` và `order(order asc)`; `null` ném "Invalid Sanity response"). Các test còn lại vẫn xanh.

- [ ] **Step 3: Cài đặt trong `lib/sanity.ts`**

1. Trong import từ `@/lib/content` thêm `serviceGroups,` (cạnh `serviceFallbackImage,`).
2. Trong `serviceSchema`: bỏ `...record,` (đòi `slug`), thay bằng `title: z.string().min(1),`, và đổi `group: z.enum(["therapy", "training", "recovery"]),` thành `group: z.enum(serviceGroups),`. Các trường còn lại giữ nguyên.
3. Trong `fetchRecords`, ngay trước dòng `if (!Array.isArray(value)) throw ...` thêm:

```ts
// A singleton query returns null until the document is first published: no records, not an outage.
if (value === null) return [];
```

4. Thay phần thân `getServices`:

```ts
export const getServices = cache(async (): Promise<Service[]> => {
  if (!enabled) return fallbackServices;
  // groups[] order is the editor's drag-and-drop order; defined(group) skips half-filled items.
  const services = await fetchRecords(
    `*[_id == "servicesPage"][0].groups[defined(group)]{group,title,shortTitle,summary,body,bullets,"image":image.asset->url,"imageAlt":image.alt,"treatments":treatments[]->{"slug":slug.current,title}}`,
    serviceSchema,
  );
  // One section per group: anchors and booking context are keyed by group.
  return services.filter((s, i) => services.findIndex((o) => o.group === s.group) === i);
});
```

- [ ] **Step 4: Chạy toàn bộ test**

Run: `npx vitest run`
Expected: PASS toàn bộ (gồm "does not publish samples on a dataset outage": lỗi mạng vẫn ném, không bị `null` nuốt).

### Task 5: Singleton `servicesPage` trong Studio

**Files:**

- Modify: `sanity.config.ts` (`singletonTypes`, mục Structure)
- Test: `tests/studio-config.test.ts` (tạo mới)

**Interfaces:**

- Produces: `servicesPage` ẩn khỏi menu tạo mới; chỉ còn action `publish`, `discardChanges`, `restore` (không Unpublish/Delete/Duplicate); mục "Trang Dịch vụ" trong Structure mở document `servicesPage`.

- [ ] **Step 1: Viết test lỗi**

```ts
// tests/studio-config.test.ts
import { describe, expect, it } from "vitest";
import config from "@/sanity.config";

const document = config.document as {
  newDocumentOptions: (prev: Array<{ templateId: string }>, ctx: object) => unknown[];
  actions: (prev: Array<{ action: string }>, ctx: { schemaType: string }) => unknown[];
};

describe("studio singletons", () => {
  it("hides servicesPage from the global create menu", () => {
    const prev = [{ templateId: "servicesPage" }, { templateId: "post" }];
    expect(document.newDocumentOptions(prev, { creationContext: { type: "global" } })).toEqual([
      { templateId: "post" },
    ]);
  });

  it("keeps only publish, discard and restore on servicesPage", () => {
    const all = ["publish", "unpublish", "delete", "duplicate", "discardChanges", "restore"].map(
      (action) => ({ action }),
    );
    expect(document.actions(all, { schemaType: "servicesPage" })).toEqual([
      { action: "publish" },
      { action: "discardChanges" },
      { action: "restore" },
    ]);
  });
});
```

- [ ] **Step 2: Chạy, xác nhận fail**

Run: `npx vitest run tests/studio-config.test.ts`
Expected: FAIL (`servicesPage` chưa nằm trong `singletonTypes`).

- [ ] **Step 3: Cài đặt trong `sanity.config.ts`**

Đổi `const singletonTypes = new Set(["siteSettings"]);` thành `const singletonTypes = new Set(["siteSettings", "servicesPage"]);`. Trong `.items([...])`, ngay sau mục `siteSettings` và trước `S.divider()` thêm:

```ts
            S.listItem()
              .title("Trang Dịch vụ")
              .id("servicesPage")
              .child(S.document().schemaType("servicesPage").documentId("servicesPage")),
```

- [ ] **Step 4: Chạy lại**

Run: `npx vitest run tests/studio-config.test.ts && npm run typecheck`
Expected: PASS.

### Task 6: Dữ liệu khởi tạo cho lần mở đầu (tuỳ chọn, cần quyền ghi staging khi chạy)

**Files:**

- Create: `scripts/seed/services-page.json`
- Test: `tests/services-seed.test.ts` (tạo mới)

Mục đích: dataset mới có sẵn nội dung ba nhóm đúng như trang hiện tại; không có ảnh và liệu pháp (cần asset và `_ref` thật, editor thêm sau). Test chống lệch với fallback.

- [ ] **Step 1: Viết test lỗi**

```ts
// tests/services-seed.test.ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { serviceGroups, services } from "@/lib/content";
import { validateServiceGroups } from "@/sanity/serviceGroups";

const seed = JSON.parse(readFileSync("scripts/seed/services-page.json", "utf8"));

describe("servicesPage seed", () => {
  it("is the published singleton with a dot-free _id", () => {
    expect(seed._id).toBe("servicesPage");
    expect(seed._type).toBe("servicesPage");
  });

  it("passes the Studio group validator with unique _keys", () => {
    expect(validateServiceGroups(seed.groups)).toBe(true);
    expect(new Set(seed.groups.map((g: { _key: string }) => g._key)).size).toBe(3);
    expect(seed.groups.map((g: { group: string }) => g.group)).toEqual([...serviceGroups]);
  });

  it("matches the fallback copy so the two cannot drift", () => {
    for (const [i, fallback] of services.entries()) {
      const { title, shortTitle, summary, body, bullets } = seed.groups[i];
      expect({ title, shortTitle, summary, body, bullets }).toEqual({
        title: fallback.title,
        shortTitle: fallback.shortTitle,
        summary: fallback.summary,
        body: fallback.body,
        bullets: fallback.bullets,
      });
    }
  });

  it("leaves images and treatment references to editors", () => {
    for (const g of seed.groups) {
      expect(g).not.toHaveProperty("image");
      expect(g).not.toHaveProperty("treatments");
    }
  });
});
```

- [ ] **Step 2: Chạy, xác nhận fail**

Run: `npx vitest run tests/services-seed.test.ts`
Expected: FAIL (file seed chưa có: `ENOENT`).

- [ ] **Step 3: Tạo `scripts/seed/services-page.json`**

```json
{
  "_id": "servicesPage",
  "_type": "servicesPage",
  "groups": [
    {
      "_key": "therapy",
      "_type": "serviceGroup",
      "group": "therapy",
      "title": "Trị liệu bằng tay",
      "shortTitle": "Trị liệu",
      "summary": "Massage trị liệu, nắn chỉnh và các phương pháp hỗ trợ giảm đau, thư giãn cơ.",
      "body": "Massage trị liệu toàn thân hoặc cục bộ, nắn chỉnh cột sống và IASTM giúp giảm căng cơ, giảm đau và phục hồi biên độ vận động.",
      "bullets": [
        "Massage trị liệu toàn thân hoặc cục bộ",
        "Nắn chỉnh cột sống và IASTM – cạo mạc",
        "Giác hơi, tapping và các phương pháp bổ trợ"
      ]
    },
    {
      "_key": "training",
      "_type": "serviceGroup",
      "group": "training",
      "title": "Tập luyện phục hồi & tăng cường",
      "shortTitle": "Tập luyện",
      "summary": "Tập luyện phục hồi và tăng cường, cá nhân hoá theo cơ thể bạn.",
      "body": "Hai chương trình tập cá nhân hoá: tập luyện phục hồi cho chấn thương, đau mỏi hoặc hạn chế vận động; tập luyện tăng cường để phát triển sức mạnh, kiểm soát và hiệu quả chuyển động.",
      "bullets": [
        "Đồng hành xuyên suốt từ tư vấn đến tập luyện",
        "Chương trình cá nhân hoá theo tình trạng của bạn",
        "Phù hợp cả người mới bắt đầu và vận động viên"
      ]
    },
    {
      "_key": "recovery",
      "_type": "serviceGroup",
      "group": "recovery",
      "title": "Ngâm lạnh & đèn hồng ngoại",
      "shortTitle": "Thư giãn & hồi phục",
      "summary": "Ngâm lạnh, đèn hồng ngoại và thư giãn cơ bắp sau tập luyện nặng.",
      "body": "Ngâm lạnh giúp giảm viêm, giảm sưng và phục hồi sau vận động cường độ cao; đèn hồng ngoại giúp thư giãn cơ, giảm căng thẳng — thường kết hợp sau buổi trị liệu hoặc tập luyện.",
      "bullets": [
        "Ngâm lạnh phục hồi sau vận động cường độ cao",
        "Đèn hồng ngoại thư giãn cơ, giảm căng thẳng",
        "Kết hợp linh hoạt trong lộ trình cá nhân"
      ]
    }
  ]
}
```

Lưu ý: file là **một object** (không phải mảng) để test đọc `seed._id` trực tiếp. Định dạng mà `sanity documents create` nhận (object, mảng hay NDJSON) được xác nhận ở bước 5.

- [ ] **Step 4: Chạy lại**

Run: `npx vitest run tests/services-seed.test.ts`
Expected: PASS (4 test).

- [ ] **Step 5: Nạp lên staging (HITL, cần token ghi của owner; không lưu token vào repo)**

Run: `npx sanity documents create --help` và xác nhận có `--missing` ("không sửa document đã tồn tại"), `--dataset`. Sau đó:

Run: `npx sanity documents create --missing -p <projectId> --dataset <staging> scripts/seed/services-page.json`
Expected: tạo `servicesPage` đã publish nếu chưa có; chạy lại không ghi đè nội dung editor đã sửa. Repo có `sanity.cli.ts` dùng cấu hình project/dataset chung với Studio; CLI cần file này ngay cả khi truyền `-p`. Định dạng object JSON và `--missing` đã chạy thành công trên staging bằng CLI 8.13.1. Các document cũ `_type == "service"` còn lại trong dataset vẫn giữ strong reference tới treatment (Studio không còn hiển thị chúng); kiểm kê và xin quyết định cleanup riêng trước khi xoá.

### Task 7: Đồng bộ tài liệu

**Files:**

- Modify: `docs/superpowers/specs/2026-10-09-service-catalogue-sanity-design.md`

- [ ] **Step 1: Cập nhật spec cũ cho khớp quyết định**

Trong mục 4, câu `` `service` (ba nhóm của `/services`) do #8 xử lý; spec này không đổi nó. `` thêm ngay sau: `Quyết định 2026-10-11: #8 chọn singleton `servicesPage`với mảng`groups`(xem`docs/services-schema-research.md`), không dùng document `service` tự do.`

Trong mục 6, chỗ `_id` cố định dạng `treatment.<slug>` đổi thành `treatment-<slug>` và thêm "(không dùng dấu chấm trong `_id`: document có dấu chấm không công khai được)".

- [ ] **Step 2: Kiểm tra định dạng**

Run: `npx prettier --write docs/superpowers/specs/2026-10-09-service-catalogue-sanity-design.md docs/superpowers/plans/2026-10-11-services-sanity-cta.md docs/services-schema-research.md`
Expected: không lỗi.

### Task 8: Kiểm chứng toàn bộ và một commit duy nhất

- [ ] **Step 1: Chạy toàn bộ kiểm tra**

Run: `npx vitest run && npm run lint && npm run typecheck && npm run build && npx prettier --check app lib sanity tests docs scripts sanity.config.ts`
Expected: tất cả PASS. (Không chạy `prettier --check .`: `_bmad/` bị gitignore và có sẵn lỗi định dạng.)

- [ ] **Step 2: Kiểm tra giao diện local ở 320 / 768 / 1440**

Run: `npm run dev -- -p 3107`, mở `/services` và `/booking?service=training`; kiểm tra không tràn ngang, không ảnh vỡ, CTA đúng href; lưu screenshot vào `.context/`. Xong thì dừng dev server và `git checkout next-env.d.ts` nếu bị sửa.

- [ ] **Step 3: Commit (không có dòng attribution Claude)**

```bash
git status --short   # chỉ gồm file của #8, không có next-env.d.ts
git add app lib sanity sanity.config.ts tests scripts docs package.json package-lock.json
git commit -m "feat(services): drive services page and booking context from Sanity #8"
```

- [ ] **Step 4: Push và mở PR**

```bash
git push -u origin feat/8-services-sanity-cta
gh pr create --base main --title "feat(services): drive services page and booking context from Sanity #8" --body-file .context/pr-body.md
```

`.context/pr-body.md` (không có dòng "Generated with Claude Code") gồm: phạm vi PR; `Refs #8`; singleton `servicesPage` thay document `service` (document `service` cũ trong dataset không còn được dùng); `/booking` chuyển từ static sang dynamic; hai devDependency mới và lý do; tiêu chí đã kiểm chứng local; tiêu chí còn chờ staging (Task 9).

### Task 9: Nghiệm thu trên staging (HITL, cần quyền Sanity staging)

Kết quả thực tế ngày 2026-10-12: xem [`docs/SERVICES_VERIFICATION.md`](../../SERVICES_VERIFICATION.md).
Đã seed staging, thử mutation bản published và khôi phục, kiểm tra responsive/keyboard/CTA,
reference và schema qua SDK, cùng revalidate thủ công. Studio/Vision, webhook tự động và
email thật còn chờ; không tick các bước ghép này chỉ dựa trên SDK hoặc response giả lập.

- [ ] **Step 1: Nạp nội dung.** Chạy Task 6 bước 5, hoặc mở Studio → "Trang Dịch vụ", Studio tự điền ba nhóm từ `initialValue`; điền `title`, `summary`, `body` rồi Publish. Xác nhận Studio hiện đủ ba nhóm, không có nút thêm/xoá/nhân bản, và không có Unpublish/Delete.
- [ ] **Step 2: Hiển thị.** Chạy dev trỏ tới staging: `/services` hiện đúng ba nhóm theo thứ tự mảng.
- [ ] **Step 3: Vòng đời một reference.** Thêm treatment vào một nhóm, Publish: link `/treatments/<slug>` xuất hiện và mở được. Đổi tên và ảnh một nhóm: trang đổi theo, không sửa code. Kéo đổi thứ tự hai nhóm: thứ tự trang đổi theo. Gỡ reference khỏi nhóm: link biến mất. Xoá ảnh: hiện ảnh local, không vỡ. (Không demo "unpublish treatment": strong reference có thể chặn Unpublish, chưa xác minh; ghi kết quả thử vào `docs/services-schema-research.md` mục 4.)
- [ ] **Step 4: Validation trong Studio.** Thử đổi `group` (phải khoá), để trống `summary`, thêm ảnh không alt, chọn cùng treatment hai lần: Studio phải chặn Publish với thông báo tiếng Việt đúng.
- [ ] **Step 5: Lối thoát khi tài liệu hỏng.** Ghi qua API một bản có trùng `group` vào draft; xác nhận Discard changes khôi phục bản đã publish và zod vẫn giữ trang hiển thị đúng.
- [ ] **Step 6: Query và webhook.** Trong Vision chạy câu GROQ của `getServices()` và xác nhận `treatments[]->{...}` trả `null` cho mục trỏ tới document không còn (và `array::compact` nếu muốn bỏ ở phía query); xác nhận webhook Sanity gọi `/api/revalidate` với `SANITY_REVALIDATE_SECRET` để thay đổi hiện ngay thay vì trễ tới 3600 giây.
- [ ] **Step 7: CTA, bàn phím, responsive.** Bấm "Đặt lịch →" ở từng nhóm: `/booking?service=<group>` hiện "Dịch vụ: …", gửi form và kiểm tra email nhân viên có dòng "Dịch vụ: <tên dịch vụ>". Tab qua thẻ nhóm và CTA ở 320 / 768 / desktop.
- [ ] **Step 8: Gắn kết quả vào PR.** Đính kèm screenshot và liệt kê tiêu chí đã có evidence. Chỉ khi đủ evidence mới đề nghị đóng #8.

### Task 10: Việc tách ra (không làm trong PR này)

- [ ] Bù nhóm thiếu từ fallback hay để trống: hiện chọn để trống (Global Constraints); chỉ đổi nếu owner yêu cầu.
- [ ] Xem bản nháp chưa publish: cần Draft Mode (`defineLive`, `defineEnableDraftMode`, Presentation tool, token); "preview" trong #8 được hiểu là nội dung đã publish hiện trên bản preview/staging. Cần owner xác nhận.
- [ ] Hotspot ảnh: query hiện chỉ lấy `image.asset->url` nên hotspot không có tác dụng ở frontend, vì vậy schema đã bỏ `hotspot: true` cho ảnh dịch vụ. Muốn dùng thì chiếu `image{asset,hotspot,crop}` và dùng image builder.
- [ ] Thống nhất nguồn dữ liệu footer và carousel homepage: #9.
- [ ] Chuyển sang `document.singletons` khi Sanity ổn định API này.

---

## Self-review

- **Độ phủ yêu cầu #8:** sửa nhóm/thứ tự/ảnh/liên kết liệu pháp trong Sanity không sửa code (Task 3, 5); CTA và link có đích tồn tại, giữ ngữ cảnh khi tới booking, fallback không vỡ ảnh/link (phần đã giữ nguyên + Task 4); ba nhóm trong một lộ trình, đọc được trên mobile/bàn phím (validator ba nhóm, thứ tự mảng, Task 9 bước 7). Verification: Task 8–9.
- **Placeholder:** không có; bước nào đổi code đều có code hoặc chuỗi thay thế chính xác. Hai chỗ phụ thuộc phiên bản đã nêu cách xử lý cụ thể (kiểu của `custom<...>`, định dạng nhập của `sanity documents create`).
- **Nhất quán tên và kiểu:** `serviceGroups`/`ServiceGroup` (Task 1) dùng ở Task 2, 3, 4, 6; `validateServiceGroups` (Task 2) dùng ở Task 3, 6; `getServices` (Task 4) giữ chữ ký cũ nên `app/services/page.tsx` và `app/booking/page.tsx` không đổi.
