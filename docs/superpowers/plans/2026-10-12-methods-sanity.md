# Methods (Phương pháp) from Sanity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drive the five `/treatments` method groups and their treatment links from a Sanity `methodsPage` singleton, with stable per-group fallback and no anchor hidden under the sticky nav.

**Architecture:** Same shape as #8's `servicesPage`: a singleton with a fixed array `groups` of five `methodGroup` objects, each holding strong references to `treatment` documents. `getMethods()` validates with zod and always returns five groups in canonical order, filling a missing or invalid group from bundled copy (without bundled treatment links). The page derives numeral, anchor id and image side from position and `methodAnchor`.

**Tech Stack:** Next.js 16 (App Router, server components, ISR), Sanity Studio 6.17, `@sanity/client` 8.9, zod, vitest, CSS modules.

**Spec:** `docs/superpowers/specs/2026-10-12-methods-sanity-design.md` (research: `docs/methods-schema-research.md`). Executors read both.

## Global Constraints

- Exactly five groups, fixed order: `manual`, `electro`, `rehab`, `cold`, `infrared` (owner confirmed 2026-10-12). Do not add a sixth method or a new treatment claim.
- `methodAnchor` ids stay `mtd-manual`, `mtd-electro`, `mtd-rehab`, `mtd-cold`, `mtd-infrared` (footer links depend on them).
- Singleton `_id` is `methodsPage` (no dots in `_id`).
- Do not store `numeral`, anchor id or `imageLeft` in the CMS. `numeral = String(index + 1).padStart(2, "0")`, `imageLeft = index % 2 === 0`.
- Strong references only (never `weak: true`); `treatment` schema is not changed.
- Images: Sanity images must come from `https://cdn.sanity.io/`; otherwise use the group's bundled `/images/...` file. Only approved clinic photos (see `PRODUCT.md` Image Provenance).
- Page copy is Vietnamese; seed copy is the verbatim current hardcoded copy.
- Tests are vitest; run a single file with `npx vitest run tests/<file>`; full gate is `npm run format:check && npm run lint && npm run typecheck && npm test && npm run build`.
- Commit messages: Conventional Commits, reference the issue as `Refs #9` (never `Closes`), and no AI attribution lines.
- This workspace has no `node_modules`; run `npm ci` once before the first test.

## Review Focus

- A group's `treatments` contains a deleted/unpublished reference (`null`) or a treatment without `slug`: no link, no crash (Task 3 test).
- Sanity is configured but a group is missing or invalid: the group falls back to bundled copy but must NOT carry bundled treatment links (`dry-needling` and `iastm` have no production document) (Task 3 and Task 4 tests).
- The same treatment appears in two different groups: allowed in Studio validation and rendered twice; twice in one group is rejected (Task 2 test).
- `tags` with padding spaces, duplicates or empty strings: trimmed and deduped before render (Task 3 test).
- Image from a non-Sanity host or missing: bundled image of that group (Task 3 test).
- Fragment links land below the sticky nav: `html { scroll-padding-top }` exists (Task 4 test) and is verified by screenshots at 320/768/1440 (Task 5).
- Singleton not yet published (`null`) or Sanity down: page still renders five sections / throws only on network error, as `/services` does (Task 3 and Task 4 tests).

---

### Task 1: Shared constants, bundled fallback data, group validator

**Files:**
- Modify: `lib/content.ts` (near `serviceGroups` at ~line 20; near the `Service` type; before `export const treatments`)
- Modify: `sanity/serviceGroups.ts`
- Create: `tests/method-groups.test.ts`
- Create: `tests/method-groups-validation.test.ts`

**Interfaces:**
- Produces (`lib/content.ts`): `methodGroups` (`readonly ["manual","electro","rehab","cold","infrared"]`), `type MethodGroup`, `type Method = { group: MethodGroup; title: string; indexSubtitle: string; body: string; tags: string[]; image: string; imageAlt: string; treatments: Array<{ slug: string; title: string }> }`, `methodFallbackImage: Record<MethodGroup, string>`, `methods: Method[]` (canonical order, bundled copy).
- Produces (`sanity/serviceGroups.ts`): `validateGroupSet(allowed: readonly string[]) => (items) => true | Failure[]`, `validateServiceGroups`, `validateMethodGroups`.

- [ ] **Step 0: Install dependencies (once)**

Run: `npm ci`
Expected: completes without error; `node_modules/` exists.

- [ ] **Step 1: Write the failing tests**

Create `tests/method-groups.test.ts`:

```ts
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  methodAnchor,
  methodFallbackImage,
  methodGroups,
  methods,
  treatments,
} from "@/lib/content";

describe("method groups", () => {
  it("is the single list behind anchors, fallback images and fallback methods", () => {
    expect(methodGroups).toEqual(["manual", "electro", "rehab", "cold", "infrared"]);
    expect(Object.keys(methodAnchor)).toEqual([...methodGroups]);
    expect(Object.keys(methodFallbackImage)).toEqual([...methodGroups]);
    expect(methods.map((m) => m.group)).toEqual([...methodGroups]);
  });

  it("does not store presentation that the page derives from position", () => {
    for (const method of methods) {
      expect(method).not.toHaveProperty("numeral");
      expect(method).not.toHaveProperty("id");
      expect(method).not.toHaveProperty("imageLeft");
    }
  });

  it("only links treatments that exist and images that exist on disk", () => {
    const slugs = new Set(treatments.map((t) => t.slug));
    for (const method of methods) {
      expect(method.image).toBe(methodFallbackImage[method.group]);
      expect(existsSync(`public${method.image}`), method.image).toBe(true);
      expect(method.imageAlt).not.toBe("");
      for (const t of method.treatments) expect(slugs.has(t.slug), t.slug).toBe(true);
    }
  });

  it("maps the owner's price list: only treatments with a document are linked", () => {
    const linked = Object.fromEntries(methods.map((m) => [m.group, m.treatments.map((t) => t.slug)]));
    expect(linked).toEqual({
      manual: ["dry-needling", "cupping", "iastm"],
      electro: [],
      rehab: [],
      cold: ["cold-plunge"],
      infrared: ["heat-light"],
    });
  });
});
```

Create `tests/method-groups-validation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateMethodGroups, validateServiceGroups } from "@/sanity/serviceGroups";

const item = (group: string | undefined, _key = group ?? "empty") => ({ _key, group });
const five = ["manual", "electro", "rehab", "cold", "infrared"];

describe("validateMethodGroups", () => {
  it("accepts the five groups in any order", () => {
    expect(validateMethodGroups([...five].reverse().map((g) => item(g)))).toBe(true);
  });

  it("flags the second item of a duplicated group by _key", () => {
    const result = validateMethodGroups([
      item("manual", "a"),
      item("manual", "b"),
      ...five.slice(1).map((g) => item(g)),
    ]);
    expect(result).toEqual([{ message: 'Nhóm "manual" bị trùng.', path: [{ _key: "b" }] }]);
  });

  it("reports every missing group", () => {
    expect(validateMethodGroups([item("manual")])).toEqual([
      { message: 'Thiếu nhóm "electro".' },
      { message: 'Thiếu nhóm "rehab".' },
      { message: 'Thiếu nhóm "cold".' },
      { message: 'Thiếu nhóm "infrared".' },
    ]);
  });

  it("rejects a service group on a method list and treats undefined as all missing", () => {
    expect(validateMethodGroups([item("therapy", "t"), ...five.map((g) => item(g))])).toEqual([
      { message: "Chọn một nhóm hợp lệ.", path: [{ _key: "t" }] },
    ]);
    expect(validateMethodGroups(undefined)).toHaveLength(5);
  });

  it("keeps the service validator unchanged", () => {
    expect(validateServiceGroups([item("therapy"), item("training"), item("recovery")])).toBe(true);
    expect(validateServiceGroups([item("manual")])).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/method-groups.test.ts tests/method-groups-validation.test.ts`
Expected: FAIL (`methodGroups`/`validateMethodGroups` are not exported).

- [ ] **Step 3: Add types and constants to `lib/content.ts`**

Replace `export type ServiceGroup = (typeof serviceGroups)[number];` with:

```ts
export type ServiceGroup = (typeof serviceGroups)[number];

export const methodGroups = ["manual", "electro", "rehab", "cold", "infrared"] as const;
export type MethodGroup = (typeof methodGroups)[number];
```

Replace `export type Post = {` with:

```ts
export type Method = {
  group: MethodGroup;
  title: string;
  indexSubtitle: string;
  body: string;
  tags: string[];
  image: string;
  imageAlt: string;
  treatments: Array<{ slug: string; title: string }>;
};

export type Post = {
```

Replace `export const treatments: Treatment[] = [` with (copy is verbatim from the former `methods` array in `app/treatments/page.tsx`; the treatments listed per group follow `docs/superpowers/specs/2026-10-12-methods-sanity-design.md` section 10):

```ts
// Local image per group: fallback when a CMS method has no usable image.
export const methodFallbackImage: Record<MethodGroup, string> = {
  manual: "/images/Iastm.jpg",
  electro: "/images/ElectroPulse.jpg",
  rehab: "/images/Coaching.jpg",
  cold: "/images/ColdPlungeTub.jpg",
  infrared: "/images/Infrared.jpg",
};

// Bundled copy, used as-is when Sanity is not configured and per group when a CMS group is missing or invalid.
export const methods: Method[] = [
  {
    group: "manual",
    title: "Trị liệu thủ công",
    indexSubtitle: "Đau khớp, đau cơ, lệch tư thế",
    body: "Chuyên viên dùng tay để đánh giá và can thiệp trực tiếp lên khớp, cơ và mô mềm — giải phóng điểm co cứng, nắn chỉnh tư thế lệch, tăng biên độ vận động.",
    tags: ["Đau vai gáy", "Đau lưng dưới", "Lệch chậu"],
    image: methodFallbackImage.manual,
    imageAlt: "Trị liệu thủ công",
    treatments: [
      { slug: "dry-needling", title: "Dry Needling" },
      { slug: "cupping", title: "Cupping Therapy" },
      { slug: "iastm", title: "IASTM" },
    ],
  },
  {
    group: "electro",
    title: "Điện trị liệu",
    indexSubtitle: "Viêm, sưng, đau mạn tính",
    body: "Dòng điện tần số thấp kích thích thần kinh và cơ, giảm viêm và giảm đau mà không cần can thiệp bằng tay — thường dùng trước khi vận động để giảm co cứng.",
    tags: ["Viêm gân", "Đau mạn tính", "Co cứng cơ"],
    image: methodFallbackImage.electro,
    imageAlt: "Điện trị liệu",
    treatments: [],
  },
  {
    group: "rehab",
    title: "Tập luyện phục hồi",
    indexSubtitle: "Yếu cơ, mất ổn định khớp",
    body: "Bài tập có kiểm soát để lấy lại sức mạnh và sự ổn định ở vùng bị ảnh hưởng, tăng dần cường độ theo tiến độ hồi phục — nền tảng để tránh tái chấn thương.",
    tags: ["Yếu cơ", "Mất ổn định khớp", "Hậu chấn thương"],
    image: methodFallbackImage.rehab,
    imageAlt: "Tập luyện phục hồi",
    treatments: [],
  },
  {
    group: "cold",
    title: "Ngâm lạnh",
    indexSubtitle: "Hồi phục sau vận động nặng",
    body: "Ngâm lạnh giúp giảm viêm, giảm sưng và hỗ trợ phục hồi sau vận động cường độ cao, đồng thời cải thiện khả năng chịu đựng của hệ thần kinh.",
    tags: ["Sưng cơ", "Sau thi đấu", "Mỏi cơ"],
    image: methodFallbackImage.cold,
    imageAlt: "Ngâm lạnh",
    treatments: [{ slug: "cold-plunge", title: "Cold Plunge" }],
  },
  {
    group: "infrared",
    title: "Đèn hồng ngoại",
    indexSubtitle: "Giãn cơ, giảm căng thẳng",
    body: "Đèn hồng ngoại giúp thư giãn cơ, giảm căng thẳng và hỗ trợ quá trình tự chữa lành của cơ thể — thường kết hợp làm bước cuối của một buổi trị liệu.",
    tags: ["Căng cơ", "Mệt mỏi", "Giãn mô"],
    image: methodFallbackImage.infrared,
    imageAlt: "Đèn hồng ngoại",
    treatments: [{ slug: "heat-light", title: "Heat & Light" }],
  },
];

export const treatments: Treatment[] = [
```

- [ ] **Step 4: Generalize the validator**

Replace the whole of `sanity/serviceGroups.ts` with:

```ts
import { methodGroups, serviceGroups } from "@/lib/content";

type Item = { _key?: string; group?: string };
type Failure = { message: string; path?: [{ _key: string }] };

// Studio-only guard: exactly one item per allowed group. Content written through the API skips it, so the
// frontend getters still dedupe. Curried because Studio passes a context object as the validator's second
// argument; a second `allowed` parameter would be overwritten by it.
export const validateGroupSet =
  (allowed: readonly string[]) =>
  (items: Item[] | undefined): true | Failure[] => {
    const failures: Failure[] = [];
    const seen = new Set<string>();
    for (const item of items ?? []) {
      const path = item._key ? ([{ _key: item._key }] as [{ _key: string }]) : undefined;
      if (!item.group || !allowed.includes(item.group)) {
        failures.push({ message: "Chọn một nhóm hợp lệ.", path });
      } else if (seen.has(item.group)) {
        failures.push({ message: `Nhóm "${item.group}" bị trùng.`, path });
      } else {
        seen.add(item.group);
      }
    }
    for (const group of allowed) {
      if (!seen.has(group)) failures.push({ message: `Thiếu nhóm "${group}".` });
    }
    return failures.length ? failures : true;
  };

export const validateServiceGroups = validateGroupSet(serviceGroups);
export const validateMethodGroups = validateGroupSet(methodGroups);
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/method-groups.test.ts tests/method-groups-validation.test.ts tests/service-groups.test.ts tests/service-groups-validation.test.ts tests/services-seed.test.ts`
Expected: PASS (service tests unchanged and green).

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts sanity/serviceGroups.ts tests/method-groups.test.ts tests/method-groups-validation.test.ts
git commit -m "feat(methods): add method group constants, fallback data and validator

Refs #9"
```

---

### Task 2: Sanity schema and Studio wiring

**Files:**
- Modify: `sanity/schemaTypes/index.ts` (imports; new `methodGroup` and `methodsPage` types before `const treatment`; `schemaTypes` array)
- Modify: `sanity.config.ts`
- Modify: `tests/studio-config.test.ts`
- Create: `tests/methods-schema.test.ts`

**Interfaces:**
- Consumes: `methodGroups`, `MethodGroup` (Task 1), `validateMethodGroups` (Task 1).
- Produces: Sanity types `methodGroup` (object) and `methodsPage` (document, `_id` `methodsPage`) with fields `group, title, indexSubtitle, body, tags, image{alt}, treatments[]` per group.

- [ ] **Step 1: Write the failing tests**

Create `tests/methods-schema.test.ts`:

```ts
import { Schema } from "@sanity/schema";
import { builtinTypes } from "@sanity/schema/_internal";
import { validateDocument } from "@sanity/validation";
import { describe, expect, it } from "vitest";
import { methodGroups } from "@/lib/content";
import { schemaTypes } from "@/sanity/schemaTypes";

const schema = Schema.compile({ name: "test", types: [...schemaTypes, ...builtinTypes] });
// Studio merges its built-in types (sanity.imageHotspot, ...) into the schema; do the same here.
const client = { withConfig: () => client, fetch: async () => 0 };
// validateDocument is @beta: keep this the only place in this file that calls it.
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
  _type: "methodGroup",
  group: name,
  title: `Tên ${name}`,
  body: "Nội dung",
  ...extra,
});
const page = (groups?: object[]) => ({ _id: "methodsPage", _type: "methodsPage", groups });
const five = () => methodGroups.map((name) => group(name));
const ref = (key: string) => ({ _key: key, _type: "reference", _ref: "treatment-cupping" });

describe("methodsPage schema", () => {
  const methodsPage = schemaTypes.find((t) => t.name === "methodsPage") as unknown as {
    fields: Array<{
      name: string;
      initialValue?: Array<{ group: string }>;
      options?: { disableActions?: string[]; sortable?: boolean };
    }>;
  };
  const groupsField = methodsPage?.fields.find((f) => f.name === "groups");

  it("has a methodsPage singleton type and a methodGroup object, and leaves treatment alone", () => {
    const names = schemaTypes.map((t) => t.name);
    expect(names).toContain("methodsPage");
    expect(names).toContain("methodGroup");
    const treatment = schemaTypes.find((t) => t.name === "treatment") as unknown as {
      fields: Array<{ name: string }>;
    };
    expect(treatment.fields.map((f) => f.name)).not.toContain("group");
  });

  it("pre-fills the five groups in canonical order and locks add/remove/reorder", () => {
    expect(groupsField?.initialValue?.map((g) => g.group)).toEqual([...methodGroups]);
    expect(groupsField?.options?.disableActions).toEqual(
      expect.arrayContaining(["add", "addBefore", "addAfter", "remove", "duplicate"]),
    );
    expect(groupsField?.options?.sortable).toBe(false);
  });

  it("accepts five complete groups", async () => {
    expect((await check(page(five()))).status).toBe("passed");
  });

  it("blocks a duplicated group, a missing group and no groups at all", async () => {
    const duplicated = [group("manual"), { ...group("manual"), _key: "again" }, ...five().slice(1)];
    const dup = await check(page(duplicated));
    expect(dup.status).toBe("failed");
    expect(dup.messages).toContain('Nhóm "manual" bị trùng.');
    expect((await check(page(five().slice(0, 4)))).messages).toContain('Thiếu nhóm "infrared".');
    expect((await check(page(undefined))).status).toBe("failed");
  });

  it("requires title and body for every group", async () => {
    for (const missing of ["title", "body"]) {
      const groups = [group("manual", { [missing]: undefined }), ...five().slice(1)];
      const result = await check(page(groups));
      expect(result.status, missing).toBe("failed");
    }
  });

  it("requires alt text once an image is chosen", async () => {
    const image = {
      _type: "image",
      asset: { _type: "reference", _ref: "image-abc123-100x100-jpg" },
    };
    const groups = [group("manual", { image }), ...five().slice(1)];
    expect((await check(page(groups))).messages).toContain("Cần alt text khi có ảnh.");
  });

  it("rejects the same treatment twice in one group but allows it in two groups", async () => {
    const twice = await check(
      page([group("manual", { treatments: [ref("1"), ref("2")] }), ...five().slice(1)]),
    );
    expect(twice.status).toBe("failed");
    expect(twice.messages).toContain("Không chọn cùng một liệu pháp nhiều lần.");

    const acrossGroups = await check(
      page([
        group("manual", { treatments: [ref("1")] }),
        group("electro", { treatments: [ref("2")] }),
        ...five().slice(2),
      ]),
    );
    expect(acrossGroups.status).toBe("passed");
  });

  it.each([
    ["more than five tags", ["a", "b", "c", "d", "e", "f"], "Tối đa 5 nhãn."],
    ["a repeated tag", ["Đau", "Đau"], "Không lặp nhãn."],
    ["a blank tag", ["Đau", "   "], "Mỗi nhãn dài 1 đến 40 ký tự."],
    ["a 41-character tag", ["ị".repeat(41)], "Mỗi nhãn dài 1 đến 40 ký tự."],
  ])("rejects %s", async (_label, tags, message) => {
    const result = await check(page([group("manual", { tags }), ...five().slice(1)]));
    expect(result.status).toBe("failed");
    expect(result.messages).toContain(message);
  });

  it("accepts up to five distinct tags", async () => {
    const tags = ["Đau vai gáy", "Đau lưng dưới", "Lệch chậu", "Cứng cổ", "Mỏi cơ"];
    expect((await check(page([group("manual", { tags }), ...five().slice(1)]))).status).toBe(
      "passed",
    );
  });
});
```

Replace `tests/studio-config.test.ts` with:

```ts
import { describe, expect, it } from "vitest";
import config from "@/sanity.config";

const document = config.document as {
  newDocumentOptions: (prev: Array<{ templateId: string }>, ctx: object) => unknown[];
  actions: (prev: Array<{ action: string }>, ctx: { schemaType: string }) => unknown[];
};

describe.each(["servicesPage", "methodsPage"])("studio singleton %s", (singleton) => {
  it("is hidden from the global create menu", () => {
    const prev = [{ templateId: singleton }, { templateId: "post" }];
    expect(document.newDocumentOptions(prev, { creationContext: { type: "global" } })).toEqual([
      { templateId: "post" },
    ]);
  });

  it("keeps only publish, discard and restore", () => {
    const all = ["publish", "unpublish", "delete", "duplicate", "discardChanges", "restore"].map(
      (action) => ({ action }),
    );
    expect(document.actions(all, { schemaType: singleton })).toEqual([
      { action: "publish" },
      { action: "discardChanges" },
      { action: "restore" },
    ]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/methods-schema.test.ts tests/studio-config.test.ts`
Expected: FAIL (`methodsPage` type missing; `methodsPage` not in singleton set).

- [ ] **Step 3: Add the schema**

In `sanity/schemaTypes/index.ts` replace the two imports

```ts
import { serviceGroups, type ServiceGroup } from "@/lib/content";
```
```ts
import { validateServiceGroups } from "@/sanity/serviceGroups";
```

with

```ts
import { methodGroups, serviceGroups, type MethodGroup, type ServiceGroup } from "@/lib/content";
```
```ts
import { validateMethodGroups, validateServiceGroups } from "@/sanity/serviceGroups";
```

Insert before `const treatment = defineType({`:

```ts
const methodGroupTitles: Record<MethodGroup, string> = {
  manual: "Trị liệu thủ công",
  electro: "Điện trị liệu",
  rehab: "Tập luyện phục hồi",
  cold: "Ngâm lạnh",
  infrared: "Đèn hồng ngoại",
};
const methodGroup = defineType({
  name: "methodGroup",
  title: "Nhóm phương pháp",
  type: "object",
  fields: [
    defineField({
      name: "group",
      title: "Nhóm",
      description: "Cố định sau khi tạo. Quyết định mục neo trên trang và liên kết ở chân trang.",
      type: "string",
      options: {
        list: methodGroups.map((value) => ({ value, title: methodGroupTitles[value] })),
        layout: "radio",
      },
      readOnly: ({ value }) => Boolean(value),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Tên phương pháp",
      type: "string",
      validation: (rule) => rule.required().error("Cần tên phương pháp."),
    }),
    defineField({
      name: "indexSubtitle",
      title: "Dòng phụ trên thẻ chọn nhóm",
      description: "Ví dụ: tình trạng thường gặp. Bỏ trống để ẩn dòng này.",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Nội dung",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().error("Cần nội dung phương pháp."),
    }),
    defineField({
      name: "tags",
      title: "Nhãn tình trạng",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => [
        rule.max(5).error("Tối đa 5 nhãn."),
        rule.unique().error("Không lặp nhãn."),
        rule.custom((tags) =>
          (tags ?? []).every((t) => typeof t === "string" && t.trim() && t.trim().length <= 40)
            ? true
            : "Mỗi nhãn dài 1 đến 40 ký tự.",
        ),
      ],
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
      description:
        "Hiện thành liên kết tới trang liệu pháp. Chỉ chọn được liệu pháp có slug. Một liệu pháp có thể xuất hiện ở hai nhóm khác nhau.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "treatment" }],
          options: { filter: "defined(slug.current)", disableNew: true },
        }),
      ],
      validation: (rule) => rule.unique().error("Không chọn cùng một liệu pháp nhiều lần."),
    }),
  ],
  preview: {
    select: { title: "title", group: "group", media: "image" },
    prepare: ({ title, group, media }) => ({
      title,
      subtitle: methodGroupTitles[group as MethodGroup],
      media,
    }),
  },
});
const methodsPage = defineType({
  name: "methodsPage",
  title: "Trang Phương pháp",
  type: "document",
  fields: [
    defineField({
      name: "groups",
      title: "Năm nhóm phương pháp",
      description:
        "Thứ tự hiển thị cố định. Phải đủ trị liệu thủ công, điện trị liệu, tập luyện phục hồi, ngâm lạnh, đèn hồng ngoại, mỗi nhóm một lần.",
      type: "array",
      of: [defineArrayMember({ type: "methodGroup" })],
      options: {
        sortable: false,
        disableActions: ["add", "addBefore", "addAfter", "remove", "duplicate"],
      },
      initialValue: methodGroups.map((group) => ({ _type: "methodGroup", group })),
      validation: (rule) =>
        rule.required().custom<Array<{ _key?: string; group?: string }>>(validateMethodGroups),
    }),
  ],
  preview: { prepare: () => ({ title: "Trang Phương pháp" }) },
});
```

In the `schemaTypes` export replace `servicesPage,` with:

```ts
  servicesPage,
  methodGroup,
  methodsPage,
```

- [ ] **Step 4: Wire Studio**

In `sanity.config.ts` replace `const singletonTypes = new Set(["siteSettings", "servicesPage"]);` with:

```ts
const singletonTypes = new Set(["siteSettings", "servicesPage", "methodsPage"]);
```

and after the `servicesPage` list item add:

```ts
            S.listItem()
              .title("Trang Phương pháp")
              .id("methodsPage")
              .child(S.document().schemaType("methodsPage").documentId("methodsPage")),
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/methods-schema.test.ts tests/studio-config.test.ts tests/services-schema.test.ts`
Expected: PASS. If the tags tests fail because the Studio array-of-string validator reports differently, print `result.messages`, fix the expected string, and keep the same four scenarios.

- [ ] **Step 6: Commit**

```bash
git add sanity/schemaTypes/index.ts sanity.config.ts tests/methods-schema.test.ts tests/studio-config.test.ts
git commit -m "feat(methods): add methodsPage singleton schema and Studio wiring

Refs #9"
```

---

### Task 3: `getMethods()` data layer

**Files:**
- Modify: `lib/sanity.ts`
- Create: `tests/methods-sanity.test.ts`

**Interfaces:**
- Consumes: `methodGroups`, `methodFallbackImage`, `methods`, `type Method` (Task 1).
- Produces: `getMethods(): Promise<Method[]>`: always five groups in `methodGroups` order. Unconfigured Sanity returns `methods` unchanged. Configured Sanity returns CMS groups; any missing/invalid group is the bundled one with `treatments: []`.

- [ ] **Step 1: Write the failing tests**

Create `tests/methods-sanity.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
const { fetch } = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch }) }));
vi.mock("@/sanity/env", () => ({
  projectId: "configured-project",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
import { methodGroups, methods } from "@/lib/content";
import { getMethods } from "@/lib/sanity";

const cdn = "https://cdn.sanity.io/images/p/d/";
const method = (group: string, extra = {}) => ({
  group,
  title: `Nhóm ${group}`,
  indexSubtitle: `Phụ ${group}`,
  body: `Nội dung ${group}`,
  tags: [`Nhãn ${group}`],
  image: `${cdn}${group}.jpg`,
  imageAlt: `Ảnh ${group}`,
  treatments: [],
  ...extra,
});
const bundled = (group: string) => methods.find((m) => m.group === group)!;

describe("methods from Sanity", () => {
  beforeEach(() => fetch.mockReset());

  it("reads the methodsPage singleton groups without a client-side order()", async () => {
    fetch.mockResolvedValue([]);
    await getMethods();
    const query = fetch.mock.calls[0][0] as string;
    expect(query).toContain('_id == "methodsPage"');
    expect(query).toContain(".groups");
    expect(query).not.toContain("order(");
  });

  it("returns five bundled groups, without treatment links, before the singleton exists", async () => {
    fetch.mockResolvedValue(null);
    const result = await getMethods();
    expect(result.map((m) => m.group)).toEqual([...methodGroups]);
    expect(result.map((m) => m.title)).toEqual(methods.map((m) => m.title));
    for (const m of result) expect(m.treatments).toEqual([]);
  });

  it("always returns the canonical order, even when the CMS order differs", async () => {
    fetch.mockResolvedValue(methodGroups.map((g) => method(g)).reverse());
    expect((await getMethods()).map((m) => m.group)).toEqual([...methodGroups]);
  });

  it("drops invalid and duplicate groups and fills gaps from bundled copy", async () => {
    fetch.mockResolvedValue([
      method("cold"),
      method("nonsense"),
      method("cold", { title: "Trùng" }),
      method("manual"),
    ]);
    const result = await getMethods();
    expect(result.map((m) => m.group)).toEqual([...methodGroups]);
    expect(result.find((m) => m.group === "cold")!.title).toBe("Nhóm cold");
    expect(result.find((m) => m.group === "manual")!.title).toBe("Nhóm manual");
    const electro = result.find((m) => m.group === "electro")!;
    expect(electro.title).toBe(bundled("electro").title);
    expect(electro.body).toBe(bundled("electro").body);
  });

  it("does not leak bundled treatment links into a fallback group when Sanity is configured", async () => {
    fetch.mockResolvedValue([method("cold")]);
    const result = await getMethods();
    expect(bundled("manual").treatments.length).toBeGreaterThan(0);
    expect(result.find((m) => m.group === "manual")!.treatments).toEqual([]);
  });

  it("falls back for a group without title or body", async () => {
    fetch.mockResolvedValue([method("rehab", { title: "" }), method("cold", { body: "" })]);
    const result = await getMethods();
    expect(result.find((m) => m.group === "rehab")!.title).toBe(bundled("rehab").title);
    expect(result.find((m) => m.group === "cold")!.body).toBe(bundled("cold").body);
  });

  it("uses the group's local image when the CMS image is missing or not from Sanity", async () => {
    fetch.mockResolvedValue([
      method("manual", { image: null, imageAlt: "" }),
      method("electro", { image: "https://evil.example/x.jpg" }),
    ]);
    const result = await getMethods();
    const manual = result.find((m) => m.group === "manual")!;
    expect(manual.image).toBe("/images/Iastm.jpg");
    expect(manual.imageAlt).toBe("Nhóm manual");
    expect(result.find((m) => m.group === "electro")!.image).toBe("/images/ElectroPulse.jpg");
  });

  it("removes treatment references that no longer resolve or have no slug", async () => {
    fetch.mockResolvedValue([
      method("manual", {
        treatments: [{ slug: "cupping", title: "Cupping" }, null, { slug: "", title: "" }],
      }),
    ]);
    const manual = (await getMethods()).find((m) => m.group === "manual")!;
    expect(manual.treatments).toEqual([{ slug: "cupping", title: "Cupping" }]);
  });

  it("trims, drops empty and dedupes tags", async () => {
    fetch.mockResolvedValue([method("manual", { tags: ["  Đau vai ", "Đau vai", "", "Lệch chậu"] })]);
    const manual = (await getMethods()).find((m) => m.group === "manual")!;
    expect(manual.tags).toEqual(["Đau vai", "Lệch chậu"]);
  });

  it("throws when Sanity is down so ISR keeps the last good page", async () => {
    fetch.mockRejectedValue(new Error("down"));
    await expect(getMethods()).rejects.toThrow("down");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/methods-sanity.test.ts`
Expected: FAIL (`getMethods` is not exported).

- [ ] **Step 3: Implement**

In `lib/sanity.ts` extend the content import:

```ts
import {
  methodFallbackImage,
  methodGroups,
  methods as fallbackMethods,
  posts as fallbackPosts,
  serviceFallbackImage,
  serviceGroups,
  services as fallbackServices,
  testimonials as fallbackTestimonials,
  treatments as fallbackTreatments,
  site as fallbackSite,
  branches as fallbackBranches,
  type Method,
  type Post,
  type Service,
  type Testimonial,
  type Treatment,
} from "@/lib/content";
```

Add above `const serviceSchema` and use it in `serviceSchema.treatments` (replacing the inline `z.array(...)...transform(...)` there, keeping its comment):

```ts
// A deleted or unpublished reference resolves to null; drop it so no link points nowhere.
const treatmentLinks = z
  .array(z.object(record).nullable().catch(null))
  .catch([])
  .transform((items) => items.filter((item) => item !== null));
```

so that `serviceSchema` has `treatments: treatmentLinks,`.

Add after `serviceSchema`:

```ts
const methodSchema = z
  .object({
    group: z.enum(methodGroups),
    title: z.string().min(1),
    indexSubtitle: text,
    body: z.string().min(1),
    tags: strings.transform((tags) => [...new Set(tags.map((t) => t.trim()).filter(Boolean))]),
    image: cdnImage.optional().catch(undefined),
    imageAlt: text,
    treatments: treatmentLinks,
  })
  .transform((method) => ({
    ...method,
    image: method.image ?? methodFallbackImage[method.group],
    imageAlt: method.imageAlt || method.title,
  }));
```

Add after `getServices`:

```ts
export const getMethods = cache(async (): Promise<Method[]> => {
  if (!enabled) return fallbackMethods;
  const cms = await fetchRecords(
    `*[_id == "methodsPage"][0].groups[defined(group)]{group,title,indexSubtitle,body,tags,"image":image.asset->url,"imageAlt":image.alt,"treatments":treatments[]->{"slug":slug.current,title}}`,
    methodSchema,
  );
  // Five fixed groups in canonical order: a missing or invalid group takes the bundled copy so footer
  // anchors never dangle. Bundled treatment links are dropped: some slugs have no CMS document.
  return methodGroups.map(
    (group) =>
      cms.find((method) => method.group === group) ?? {
        ...fallbackMethods.find((method) => method.group === group)!,
        treatments: [],
      },
  );
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/methods-sanity.test.ts tests/services-sanity.test.tsx tests/sanity.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/sanity.ts tests/methods-sanity.test.ts
git commit -m "feat(methods): read method groups from Sanity with per-group fallback

Refs #9"
```

---

### Task 4: `/treatments` page, treatment links, anchor offset

**Files:**
- Modify: `app/treatments/page.tsx`
- Modify: `app/treatments/treatments.module.css`
- Modify: `app/globals.css:14-16`
- Modify: `tests/footer-links.test.ts`
- Create: `tests/methods-render.test.tsx`
- Create: `tests/methods-fallback.test.tsx`

**Interfaces:**
- Consumes: `getMethods(): Promise<Method[]>` (Task 3), `methodAnchor` (existing).
- Produces: async `TreatmentsPage`; section `id` = `methodAnchor[method.group]`; links `href="/treatments/<slug>"` inside `.methodLinks`.

- [ ] **Step 1: Write the failing tests**

Create `tests/methods-render.test.tsx`:

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
import TreatmentsPage from "@/app/treatments/page";
import { methodAnchor, methodGroups } from "@/lib/content";

const cdn = "https://cdn.sanity.io/images/p/d/";
const method = (group: string, extra = {}) => ({
  group,
  title: `Nhóm ${group}`,
  indexSubtitle: `Phụ ${group}`,
  body: `Nội dung ${group}`,
  tags: [`Nhãn ${group}`],
  image: `${cdn}${group}.jpg`,
  imageAlt: `Ảnh ${group}`,
  treatments: [],
  ...extra,
});

describe("/treatments from Sanity", () => {
  beforeEach(() => fetch.mockReset());

  it("renders CMS content, derived numerals and anchors, and treatment links", async () => {
    fetch.mockResolvedValue([
      method("cold", { treatments: [{ slug: "cold-plunge", title: "Cold Plunge" }] }),
    ]);
    const html = renderToStaticMarkup(await TreatmentsPage());
    for (const group of methodGroups) {
      expect(html).toContain(`id="${methodAnchor[group]}"`);
      expect(html).toContain(`href="#${methodAnchor[group]}"`);
    }
    expect(html).toContain("Nhóm cold");
    expect(html).toContain("Nội dung cold");
    expect(html).toContain('href="/treatments/cold-plunge"');
    expect(html).toContain("Cold Plunge");
    for (const numeral of ["01", "02", "03", "04", "05"]) expect(html).toContain(numeral);
  });

  it("shows no treatment links or related-treatment label when no group has treatments", async () => {
    fetch.mockResolvedValue(null);
    const html = renderToStaticMarkup(await TreatmentsPage());
    expect(html).not.toContain('href="/treatments/');
    expect(html).not.toContain("Liệu pháp liên quan");
    expect(html).toContain("<h1>Phương pháp</h1>");
  });

  it("never links a bundled treatment slug when Sanity is configured", async () => {
    fetch.mockResolvedValue([method("cold")]);
    const html = renderToStaticMarkup(await TreatmentsPage());
    expect(html).not.toContain("dry-needling");
    expect(html).not.toContain("/treatments/iastm");
  });

  it("drops a link whose reference was removed", async () => {
    fetch.mockResolvedValue([method("manual", { treatments: [null] })]);
    expect(renderToStaticMarkup(await TreatmentsPage())).not.toContain('href="/treatments/');
  });

  it("keeps assessment-focused CTAs to booking and contact", async () => {
    fetch.mockResolvedValue(null);
    const html = renderToStaticMarkup(await TreatmentsPage());
    expect(html).toContain("Đặt buổi đánh giá");
    expect(html).toContain('href="/booking"');
    expect(html).toContain('href="/contact"');
  });
});
```

Create `tests/methods-fallback.test.tsx`:

```tsx
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("@/sanity/env", () => ({
  projectId: "missing-project-id",
  dataset: "production",
  apiVersion: "2025-01-01",
}));
import { renderToStaticMarkup } from "react-dom/server";
import TreatmentsPage from "@/app/treatments/page";
import { methodAnchor, methodGroups, methods } from "@/lib/content";
import { getMethods } from "@/lib/sanity";

describe("methods fallback (Sanity not configured)", () => {
  it("covers the five groups in canonical order", async () => {
    expect((await getMethods()).map((m) => m.group)).toEqual([...methodGroups]);
  });

  it("renders every anchor, index card and the bundled treatment links", async () => {
    const html = renderToStaticMarkup(await TreatmentsPage());
    for (const group of methodGroups) {
      expect(html).toContain(`id="${methodAnchor[group]}"`);
      expect(html).toContain(`href="#${methodAnchor[group]}"`);
    }
    for (const method of methods) {
      for (const t of method.treatments) expect(html).toContain(`href="/treatments/${t.slug}"`);
    }
  });

  it("offsets fragment targets below the sticky nav", () => {
    expect(readFileSync("app/globals.css", "utf8")).toMatch(/scroll-padding-top:\s*7rem/);
  });
});
```

Replace `tests/footer-links.test.ts` with:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { footerMethods, footerServices, methodAnchor, serviceAnchor } from "@/lib/content";

// The pages and the footer share one set of anchor constants; these checks make sure the footer
// links are built from them and that each page still uses them as its section ids.
describe("footer links", () => {
  it.each([
    ["app/services/page.tsx", "serviceAnchor[service.group]", "/services", serviceAnchor, footerServices],
    ["app/treatments/page.tsx", "methodAnchor[method.group]", "/treatments", methodAnchor, footerMethods],
  ] as const)("%s sections match the footer links", (file, usage, path, anchors, links) => {
    const hrefs = links.map(([, href]) => href);
    for (const id of Object.values(anchors)) expect(hrefs, id).toContain(`${path}#${id}`);
    // Both pages key their sections by CMS group (ids are asserted per group in the render tests).
    expect(readFileSync(file, "utf8")).toContain(usage);
    expect(hrefs).toHaveLength(Object.keys(anchors).length);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/methods-render.test.tsx tests/methods-fallback.test.tsx tests/footer-links.test.ts`
Expected: FAIL (page still synchronous with hardcoded data; no `scroll-padding-top`).

- [ ] **Step 3: Rewrite the page**

In `app/treatments/page.tsx`:

1. Replace the imports `import { methodAnchor } from "@/lib/content";` with:

```tsx
import { methodAnchor } from "@/lib/content";
import { getMethods } from "@/lib/sanity";
```

(keep `Image`, `Link`, `createMetadata`, `styles` imports).

2. Immediately after the direction-contract comment, before `export const metadata`, add:

```tsx
export const revalidate = 3600;

```

3. Delete the entire hardcoded `const methods = [ ... ];` array (it now lives in `lib/content.ts`).

4. Replace `export default function TreatmentsPage() {` with:

```tsx
export default async function TreatmentsPage() {
  const methods = await getMethods();
  return (
```

and remove the original `return (` line that followed it (so there is a single `return (`).

5. Replace the index card map:

```tsx
          {methods.map((method, i) => (
            <a
              href={`#${methodAnchor[method.group]}`}
              key={method.group}
              className={styles.indexCard}
            >
              <span className={styles.indexNumeral}>{String(i + 1).padStart(2, "0")}</span>
              <strong>{method.title}</strong>
              {method.indexSubtitle ? <span>{method.indexSubtitle}</span> : null}
            </a>
          ))}
```

6. Replace the whole timeline map (`{methods.map((method, i) => ( <div className={styles.method} ...` through its closing `))}`) with:

```tsx
        {methods.map((method, i) => {
          const imageLeft = i % 2 === 0;
          return (
            <div className={styles.method} id={methodAnchor[method.group]} key={method.group}>
              <div className={styles.methodRail}>
                <span className={styles.methodNumeral}>{String(i + 1).padStart(2, "0")}</span>
                {i < methods.length - 1 ? <div className={styles.methodLine} /> : null}
              </div>
              <div className={styles.methodBody}>
                <div className={styles.methodCopy} style={{ order: imageLeft ? 2 : 1 }}>
                  <h2>{method.title}</h2>
                  <p>{method.body}</p>
                  {method.tags.length ? (
                    <div className={styles.methodTags}>
                      {method.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  ) : null}
                  {method.treatments.length ? (
                    <div className={styles.methodLinks}>
                      <span className={styles.methodLinksLabel}>Liệu pháp liên quan</span>
                      {method.treatments.map((t) => (
                        <Link key={t.slug} href={`/treatments/${t.slug}`}>
                          {t.title} ↗
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className={styles.methodMedia} style={{ order: imageLeft ? 1 : 2 }}>
                  <Image
                    src={method.image}
                    alt={method.imageAlt}
                    fill
                    sizes="(max-width: 980px) 100vw, 45vw"
                  />
                </div>
              </div>
            </div>
          );
        })}
```

The `<nav ... styles.index>` wrapper, hero, `note` and `cta` sections stay unchanged (they already stress practitioner assessment and combining 2–3 methods).

- [ ] **Step 4: CSS**

In `app/treatments/treatments.module.css`, directly after the `.methodTags span { ... }` rule add:

```css
.methodLinks {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.methodLinksLabel {
  font: 500 11px var(--font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
  margin-right: 4px;
}
.methodLinks a {
  font: 500 11px var(--font-mono);
  letter-spacing: 0.06em;
  color: var(--clay-deep);
  border: 1px solid rgba(116, 77, 64, 0.3);
  padding: 6px 12px;
  border-radius: 999px;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}
.methodLinks a:hover {
  border-color: var(--clay-deep);
  color: var(--clay-hover);
}
```

Check `--clay-deep` and `--clay-hover` resolve in this module (they are used by `.diveLinks` in `app/services/services.module.css`; if undefined in `treatments.module.css`, declare them on `.root` copying the values from `services.module.css`'s root).

In `app/globals.css` replace

```css
html {
  scroll-behavior: smooth;
}
```

with

```css
html {
  scroll-behavior: smooth;
  /* Sticky nav is 98px tall on desktop: keeps /treatments#mtd-* and /services#svc-* targets below it. */
  scroll-padding-top: 7rem;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/methods-render.test.tsx tests/methods-fallback.test.tsx tests/footer-links.test.ts`
Expected: PASS.

- [ ] **Step 6: Typecheck and lint the touched files**

Run: `npm run typecheck && npx eslint app/treatments lib sanity tests --max-warnings 0`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add app/treatments app/globals.css tests/methods-render.test.tsx tests/methods-fallback.test.tsx tests/footer-links.test.ts
git commit -m "feat(methods): render /treatments from Sanity with treatment links

Refs #9"
```

---

### Task 5: Seed, verification record, full gate

**Files:**
- Create: `scripts/seed/methods-page.json`
- Create: `tests/methods-seed.test.ts`
- Create: `docs/METHODS_VERIFICATION.md`

**Interfaces:**
- Consumes: `methods`, `methodGroups` (Task 1), `validateMethodGroups` (Task 1).
- Produces: published-singleton seed payload for `npx sanity documents create scripts/seed/methods-page.json --missing`.

- [ ] **Step 1: Write the failing test**

Create `tests/methods-seed.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { methodGroups, methods } from "@/lib/content";
import { validateMethodGroups } from "@/sanity/serviceGroups";

const seed = JSON.parse(readFileSync("scripts/seed/methods-page.json", "utf8"));

describe("methodsPage seed", () => {
  it("is the published singleton with a dot-free _id", () => {
    expect(seed._id).toBe("methodsPage");
    expect(seed._type).toBe("methodsPage");
  });

  it("passes the Studio group validator with unique _keys in canonical order", () => {
    expect(validateMethodGroups(seed.groups)).toBe(true);
    expect(new Set(seed.groups.map((g: { _key: string }) => g._key)).size).toBe(5);
    expect(seed.groups.map((g: { group: string }) => g.group)).toEqual([...methodGroups]);
    for (const g of seed.groups) expect(g._type).toBe("methodGroup");
  });

  it("matches the bundled copy so the two cannot drift", () => {
    for (const [i, fallback] of methods.entries()) {
      const { title, indexSubtitle, body, tags } = seed.groups[i];
      expect({ title, indexSubtitle, body, tags }).toEqual({
        title: fallback.title,
        indexSubtitle: fallback.indexSubtitle,
        body: fallback.body,
        tags: fallback.tags,
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

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/methods-seed.test.ts`
Expected: FAIL (`ENOENT: scripts/seed/methods-page.json`).

- [ ] **Step 3: Create the seed**

Create `scripts/seed/methods-page.json`:

```json
{
  "_id": "methodsPage",
  "_type": "methodsPage",
  "groups": [
    {
      "_key": "manual",
      "_type": "methodGroup",
      "group": "manual",
      "title": "Trị liệu thủ công",
      "indexSubtitle": "Đau khớp, đau cơ, lệch tư thế",
      "body": "Chuyên viên dùng tay để đánh giá và can thiệp trực tiếp lên khớp, cơ và mô mềm — giải phóng điểm co cứng, nắn chỉnh tư thế lệch, tăng biên độ vận động.",
      "tags": ["Đau vai gáy", "Đau lưng dưới", "Lệch chậu"]
    },
    {
      "_key": "electro",
      "_type": "methodGroup",
      "group": "electro",
      "title": "Điện trị liệu",
      "indexSubtitle": "Viêm, sưng, đau mạn tính",
      "body": "Dòng điện tần số thấp kích thích thần kinh và cơ, giảm viêm và giảm đau mà không cần can thiệp bằng tay — thường dùng trước khi vận động để giảm co cứng.",
      "tags": ["Viêm gân", "Đau mạn tính", "Co cứng cơ"]
    },
    {
      "_key": "rehab",
      "_type": "methodGroup",
      "group": "rehab",
      "title": "Tập luyện phục hồi",
      "indexSubtitle": "Yếu cơ, mất ổn định khớp",
      "body": "Bài tập có kiểm soát để lấy lại sức mạnh và sự ổn định ở vùng bị ảnh hưởng, tăng dần cường độ theo tiến độ hồi phục — nền tảng để tránh tái chấn thương.",
      "tags": ["Yếu cơ", "Mất ổn định khớp", "Hậu chấn thương"]
    },
    {
      "_key": "cold",
      "_type": "methodGroup",
      "group": "cold",
      "title": "Ngâm lạnh",
      "indexSubtitle": "Hồi phục sau vận động nặng",
      "body": "Ngâm lạnh giúp giảm viêm, giảm sưng và hỗ trợ phục hồi sau vận động cường độ cao, đồng thời cải thiện khả năng chịu đựng của hệ thần kinh.",
      "tags": ["Sưng cơ", "Sau thi đấu", "Mỏi cơ"]
    },
    {
      "_key": "infrared",
      "_type": "methodGroup",
      "group": "infrared",
      "title": "Đèn hồng ngoại",
      "indexSubtitle": "Giãn cơ, giảm căng thẳng",
      "body": "Đèn hồng ngoại giúp thư giãn cơ, giảm căng thẳng và hỗ trợ quá trình tự chữa lành của cơ thể — thường kết hợp làm bước cuối của một buổi trị liệu.",
      "tags": ["Căng cơ", "Mệt mỏi", "Giãn mô"]
    }
  ]
}
```

- [ ] **Step 4: Create the verification record**

Create `docs/METHODS_VERIFICATION.md` (to be completed with real evidence on staging; issue #9 stays open until each box is checked with a link or screenshot):

```markdown
# Methods acceptance — issue #9

Spec: `docs/superpowers/specs/2026-10-12-methods-sanity-design.md`. Plan: `docs/superpowers/plans/2026-10-12-methods-sanity.md`.

## Owner decisions

- [x] Five groups are official (owner, 2026-10-12). Issue #9 text still says four: edit it.
- [x] Price-list mapping to groups: spec section 10.
- [ ] Owner confirms the placement of tapping, dry needling, IASTM (manual) and electroacupuncture (electro).
- [ ] Owner approves the position and label of the "Liệu pháp liên quan" block.
- [ ] Owner confirms `tags` and `body` copy is approved.

## Staging setup

- [ ] Seed: `npx sanity documents create scripts/seed/methods-page.json --missing --project-id <id> --dataset <staging>`; re-run prints `Skipped (already exists): methodsPage`.
- [ ] Upload approved clinic photos and set `alt` per group; pick real `treatment` references in Studio.
- [ ] Webhook filter includes `methodsPage` (staging and production); publish returns `/api/revalidate` 200.

## Checks

- [ ] Publish an edit to one group (title/body/tag) and one treatment reference; `/treatments` updates; demo index → section → detail.
- [ ] Anchors: `/treatments#mtd-<group>` for all five lands with the heading below the sticky nav at 320, 768 and 1440 (screenshots attached).
- [ ] Keyboard: Tab reaches index cards, treatment links and CTAs in order; focus is visible; fragment focus does not hide the heading.
- [ ] Missing singleton, missing image, group removed, treatment unpublished or removed: page renders five sections and no dead link.
- [ ] Unpublish a referenced treatment: record whether Studio or the API refuses (open question in the research doc).
- [ ] Studio: duplicate/missing group blocks Publish; same treatment twice in one group is rejected.
- [ ] CI gate green (format, lint, typecheck, tests, build, smoke).
```

- [ ] **Step 5: Run the new test and the full gate**

Run: `npx vitest run tests/methods-seed.test.ts`
Expected: PASS.

Run: `npm run format:check && npm run lint && npm run typecheck && npm test && npm run build`
Expected: all pass. If `format:check` fails, run `npm run format`, review the diff (should only touch files from this plan) and re-run.

- [ ] **Step 6: Commit**

```bash
git add scripts/seed/methods-page.json tests/methods-seed.test.ts docs/METHODS_VERIFICATION.md
git commit -m "feat(methods): add methodsPage seed and verification record

Refs #9"
```

---

## Self-review

**Spec coverage:** schema, validator, Studio wiring (Tasks 1–2; spec §2); per-group fallback and no leaked bundled links (Task 3; spec §3); page, derived numeral/anchor/side, treatment block, CTAs kept, `scroll-padding-top` (Task 4; spec §4); seed (Task 5; spec §5); tests listed in spec §6 are all created or updated (`method-groups`, `method-groups-validation`, `methods-schema`, `methods-seed`, `methods-sanity`, `methods-fallback`, `studio-config`, `footer-links`); acceptance record (Task 5; spec §7). Spec §8 webhook filter and unverified items are tracked in `docs/METHODS_VERIFICATION.md`; they need staging access and cannot be done in code. The price-list mapping (spec §10) is pinned by the `maps the owner's price list` test.

**Known deviations from the spec text:** the spec §3 table was edited to say fallback groups carry no bundled treatment links when Sanity is configured; tests pin that. The spec's `docs/METHODS_VERIFICATION.md` is created as an evidence checklist, not as completed evidence.

**Placeholder scan:** none. The only deferred items are staging actions that require credentials and are listed as unchecked evidence boxes.

**Type consistency:** `Method`, `methodGroups`, `methodFallbackImage`, `methods` (Task 1) match their uses in `lib/sanity.ts` (Task 3), the page (Task 4) and tests; `validateMethodGroups` is defined in Task 1 and consumed in Tasks 2 and 5; `getMethods` is defined in Task 3 and consumed in Task 4; CSS classes `methodLinks`/`methodLinksLabel` are defined and used in Task 4.

**Not run here:** this workspace has no `node_modules`, so no test or build was executed while writing the plan. Task 1 Step 0 installs dependencies; Step 5 of Task 2 notes where Studio's validator messages may need adjusting.
