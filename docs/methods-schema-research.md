# Schema Sanity cho trang Phương pháp: nhóm trong singleton hay trường `group` trên `treatment` (#9)

Ngày 2026-10-12. Phạm vi: chọn cấu trúc cho năm nhóm cố định `manual` / `electro` / `rehab` / `cold` / `infrared` của `/treatments` sao cho editor sửa được nội dung, ảnh (có alt) và liên kết tới liệu pháp cụ thể, còn visitor không bao giờ gặp trang lỗi, nhóm thiếu, neo chết hoặc link tới slug không tồn tại. Tài liệu này nối tiếp [`services-schema-research.md`](services-schema-research.md) (#8); những điều đã nghiên cứu ở đó (cảnh báo `initialValue`/`_key`, `disableActions`, `readOnly` callback, `unique()` so sánh sâu, tạo singleton lần đầu) chỉ được nhắc lại khi khác.

Phiên bản (khớp `package-lock.json` của repo này): `sanity` 6.17.0, `next-sanity` 13.3.4, `@sanity/client` 8.9.0, `next` 16.3.8. Worktree `rome` chưa có `node_modules`, nên d.ts, bundle Studio và tài liệu Next.js được đọc từ `node_modules` của worktree anh em `boston` (cùng phiên bản, đã đối chiếu `package-lock.json`). Đường dẫn d.ts dưới đây là đường dẫn trong `node_modules` của gói tương ứng.

Nguồn: tài liệu chính thức sanity.io/docs (đọc bản `.md` của chính trang đó; mọi câu đặt trong dấu ngoặc kép đã được `grep` lại từ bản `.md` thô, không trích từ bản tóm tắt), repo `sanity-io/sanity` (đọc qua `gh api`), d.ts và bundle của gói đã cài, MDN và W3C CSS Scroll Snap Module Level 1, tài liệu Next.js trong `node_modules/next/dist/docs`. Không dùng blog hay mục "answers". Điều không kiểm chứng được nằm ở mục 5.

Hiện trạng đọc từ repo: `lib/content.ts:80-86` (`methodAnchor`, 5 khoá), `app/treatments/page.tsx:32-83` (mảng `methods` viết cứng, trường `id`, `numeral`, `title`, `indexSubtitle`, `body`, `tags`, `image`, `imageLeft`), `app/treatments/page.tsx:129-157` (render timeline), `lib/sanity.ts:87-107` (`fetchRecords`, `getServices`), `sanity/serviceGroups.ts:8-25`, `sanity/schemaTypes/index.ts:80-204`, `sanity.config.ts:7-48`, `scripts/seed/services-page.json`, `tests/services-*.test.ts*`, `docs/SERVICES_VERIFICATION.md`.

## 1. Kết luận ngắn

**Chọn A: singleton `methodsPage` có mảng `groups` gồm năm object `methodGroup`, mỗi object chứa mảng reference mạnh `treatments`.** Đúng khuôn #8 dùng cho `servicesPage`. Thứ tự hiển thị lấy theo thứ tự chuẩn trong code (không theo thứ tự mảng), nên `numeral`, `imageLeft` và `id` neo đều suy ra, không lưu.

Năm điều quyết định:

1. **B không bỏ được singleton.** Tiêu đề, `indexSubtitle`, `body`, `tags`, ảnh của từng nhóm vẫn cần một chỗ để lưu; chỗ đó chính là `methodsPage`. B chỉ thêm một nguồn sự thật thứ hai (trường `group` trên `treatment`) cho phần liên kết.
2. **Một trường `group` kiểu string không thể để một liệu pháp thuộc hai nhóm.** Ví dụ `heat-light` ở cả `infrared` và `cold`: một giá trị `string` chỉ nhận một nhóm (suy ra từ định nghĩa kiểu, không cần tài liệu). Muốn làm B chạy nhiều-nhiều phải đổi thành mảng string, khi đó mất khoá cứng và còn cần trường thứ tự riêng. A cho phép, vì `rule.unique()` chỉ so sánh trong từng mảng (mục 3.3).
3. **A không đụng `treatment` và không cần migration.** B làm `group` bắt buộc trên `treatment`, nên cả ba liệu pháp production đang có sẽ không hợp lệ cho tới khi từng cái được sửa và publish lại; thêm trường `order` để sắp trong nhóm; và enum của spec 2026-10-09 có `consult` (6 giá trị) không khớp 5 nhóm.
4. **A đã được kiểm chứng cuối-đến-cuối ở #8**: validator mảng chặn Publish trong Studio, Discard thoát trạng thái hỏng, webhook revalidate 200, seed `--missing` giữ nội dung, production đã seed (`docs/SERVICES_VERIFICATION.md`). Validator, bài test schema, bài test seed, cấu hình Studio đều dùng lại được.
5. **Chi phí code thấp.** Một type object, một type document, một getter, một dòng trong `singletonTypes`, một mục Structure. Không đổi schema `treatment`.

Điểm B mạnh hơn A, nói thẳng: link tới liệu pháp **đúng theo cấu trúc** vì danh sách lấy từ chính `*[_type == "treatment"]` nên không có `null` để lọc. A phải dựa vào strong reference và lớp zod (mục 3.4). Đó là lý do chính để vẫn giữ lớp zod dù Studio đã chặn.

Hai điều khác #8 phải quyết, nêu ở mục 3.7 và 6:

- **Fallback theo từng nhóm** (nhóm thiếu hoặc không hợp lệ rơi về nội dung viết cứng) thay vì "dataset đã cấu hình là nguồn duy nhất" như `/services`. Lý do: footer luôn có 5 link neo (`lib/content.ts:92-98`), nên bỏ một section làm neo chết.
- **Webhook Sanity phải thêm `methodsPage` vào filter.** Route `/api/revalidate` của repo không cần đổi (mục 3.5), nhưng filter nằm trong Sanity Manage, không trong repo.

Phương án phụ đáng cân nhắc (A′, mục 2): thay mảng bằng năm trường object cố định `manual`, `electro`, `rehab`, `cold`, `infrared`. Trùng/thiếu nhóm khi đó bất khả theo cấu trúc, bỏ được validator, `initialValue`, `readOnly`, `disableActions`. Tôi vẫn khuyến nghị A vì khớp #8 và dùng lại phần đã kiểm chứng; A′ là lựa chọn của owner nếu muốn schema nhỏ hơn.

## 2. So sánh

| Tiêu chí                            | A. Singleton + mảng `groups`, reference trong từng nhóm                                                          | B. Trường `group` trên `treatment`                                                                          | A′. Singleton + 5 trường object cố định                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Nội dung nhóm (title, body, ảnh...) | Trong singleton                                                                                                  | Vẫn phải có singleton, tức hai nơi                                                                          | Trong singleton                                                                               |
| Liệu pháp trong hai nhóm            | Được (`unique()` chỉ trong từng mảng)                                                                            | Không với `string`; chỉ được nếu đổi thành mảng string                                                     | Được                                                                                          |
| Thứ tự liệu pháp trong nhóm         | Thứ tự mảng, kéo thả                                                                                             | Cần trường `order` trên `treatment` hoặc sắp theo tên                                                       | Như A                                                                                         |
| Link tới slug không tồn tại         | Strong reference chặn xoá (đã thử 409 ở #8) + zod lọc `null`. Unpublish chưa chắc (mục 3.4)                       | Bất khả theo cấu trúc: danh sách lấy từ chính tập `treatment` đã publish                                    | Như A                                                                                         |
| Trùng/thiếu nhóm                    | `rule.custom` ở mảng (chỉ trong Studio) + `initialValue` + khoá thêm/xoá                                         | Không áp dụng cho nhóm; nhưng `treatment` thiếu `group` biến mất khỏi trang âm thầm                         | Bất khả theo cấu trúc, không cần validator                                                    |
| Thay đổi `treatment`                | Không                                                                                                            | Thêm `group` bắt buộc + `order`; cả ba liệu pháp production phải sửa lại                                   | Không                                                                                         |
| Dùng lại phần #8                    | `validateServiceGroups` (tổng quát hoá), test schema/seed/studio-config, mẫu GROQ                                | Ít                                                                                                           | Chỉ mẫu GROQ và seed; bỏ validator                                                            |
| GROQ                                | Một query, một projection phẳng                                                                                  | Mỗi nhóm một truy vấn con lọc `group == ...` + sắp xếp                                                       | Liệt kê 5 trường trong projection (sinh từ `methodGroups`)                                    |
| Rủi ro chính                        | Form dài; lỗi một nhóm chặn Publish cả trang; link tạm thời tới liệu pháp vừa gỡ cho tới khi revalidate           | Liệu pháp quên gán `group` mất khỏi trang; không thể hai nhóm; migration                                    | Khác khuôn `/services` nên không dùng lại test; thêm nhóm sau này cần đổi schema (đã loại, cố định) |

## 3. Phát hiện theo từng chủ đề

### 3.1 Validation: đúng 5 nhóm, ghim giá trị

Căn cứ: [Array type](https://www.sanity.io/docs/studio/array-type), [Validation](https://www.sanity.io/docs/studio/validation); phần `unique()`, `readOnly` callback, `initialValue` + `_key` đã nằm ở `services-schema-research.md` mục 3.1. Chỉ ghi điều khác:

- **Nguồn danh sách duy nhất.** Thêm `export const methodGroups = ["manual", "electro", "rehab", "cold", "infrared"] as const` vào `lib/content.ts`, kèm `type MethodGroup`, và để `methodAnchor` khớp khoá (xem test 7.1). Cùng khuôn `serviceGroups` ở `lib/content.ts:20-21`.
- **Tổng quát hoá hay thêm hàm anh em.** Rẻ nhất là tổng quát hoá ngay trong `sanity/serviceGroups.ts`, giữ nguyên tên export cũ để `tests/service-groups-validation.test.ts` và `tests/services-seed.test.ts` không đổi:

```ts
// sanity/serviceGroups.ts
import { methodGroups, serviceGroups } from "@/lib/content";

type Item = { _key?: string; group?: string };
type Failure = { message: string; path?: [{ _key: string }] };

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

- **Không thêm tham số thứ hai `allowed` có giá trị mặc định vào hàm hiện có.** Studio gọi validator `custom` với hai đối số: d.ts định nghĩa `interface CustomValidator<T> { (value: T, context: ValidationContext): ... }` (`@sanity/types/lib/index.d.ts:653-656`). Code hiện tại dùng `.custom(validateServiceGroups)` (`sanity/schemaTypes/index.ts:200`), nên tham số thứ hai sẽ bị `context` ghi đè. Dùng hàm bọc (curried) như trên, hoặc `.custom((v) => validateGroupSet(methodGroups)(v))`.
- **Thông báo lỗi dùng khoá tiếng Anh** (`Thiếu nhóm "cold"`), giống #8. Nếu muốn tên Việt thì truyền thêm bản đồ nhãn vào `validateGroupSet`; không cần cho #9.
- **Khác với #8 về thứ tự:** nên đặt `options.sortable: false` cho mảng (`@sanity/types/lib/index.d.ts:802`; tài liệu array: "Controls whether the user is allowed to reorder the items in the array. Defaults to true."). Issue #9 không yêu cầu đổi thứ tự (khác #8). Thứ tự hiển thị do code quyết định (mục 3.7), nên nếu để kéo thả được thì editor sẽ thấy hiệu ứng không xảy ra. Nếu owner muốn kéo thả, bỏ dòng này và đổi `getMethods()` sang theo thứ tự mảng (mục 3.7), chấp nhận `numeral` và footer có thể lệch thứ tự.
- **Đừng dùng `hidden` để giấu `group`.** Tài liệu validation: trường `hidden` vẫn bị validate, trừ khi gọi `rule.skip()` khi `context.hidden` ("`rule.skip()` to skip validation entirely for a field"). Giữ radio `readOnly` như #8 (đã kiểm chứng ở Studio).

### 3.2 Trường của từng nhóm: tối thiểu

| Trường                                     | Lưu?                | Lý do                                                                                                                                                                          |
| ------------------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `group`                                    | Có                  | Khoá nhóm, quyết định `id` neo (`methodAnchor[group]`). Radio, `readOnly` khi đã có giá trị, như `serviceGroup`.                                                              |
| `title`                                    | Có, bắt buộc        | Tên nhóm trên thẻ index và `h2`. Cũng dùng làm `alt` dự phòng.                                                                                                                  |
| `indexSubtitle`                            | Có                  | Dòng phụ ở thẻ index (`app/treatments/page.tsx:123`). Không bắt buộc: thiếu thì bỏ dòng.                                                                                        |
| `body`                                     | Có, bắt buộc        | Đoạn mô tả. `type: "text"`, `rows: 5` như `serviceGroup.body`.                                                                                                                 |
| `tags`                                     | Có, tuỳ chọn        | Mảng string, xem dưới.                                                                                                                                                         |
| `image` + `alt`                            | Có, tuỳ chọn        | Thiếu ảnh thì dùng ảnh local của nhóm. `alt` bắt buộc khi có asset (giữ nguyên validator `context.parent` ở `sanity/schemaTypes/index.ts:152-157`).                              |
| `treatments`                               | Có, tuỳ chọn        | Mảng reference mạnh, mục 3.3.                                                                                                                                                  |
| `numeral`                                  | **Không**           | Suy ra: `String(index + 1).padStart(2, "0")` trên mảng đã sắp theo thứ tự chuẩn. Lưu sẽ lệch khi đổi chỗ và cần thêm validator dãy số.                                           |
| `imageLeft`                                | **Không**           | Suy ra: `index % 2 === 0`. **Khác `/services`** (`app/services/page.tsx:114` dùng `index % 2 === 1`): dữ liệu viết cứng của `/treatments` có ảnh trái ở vị trí 0, 2, 4 (`app/treatments/page.tsx:41,61,81`), dùng `=== 1` sẽ lật bố cục. |
| `id` (neo)                                 | **Không**           | `methodAnchor[group]`, giống `serviceAnchor[service.group]`.                                                                                                                   |
| `slug`, `seo` từng nhóm                    | Không               | Không có route chi tiết cho nhóm; metadata của trang là cố định (`app/treatments/page.tsx:25-30`).                                                                              |

Chi tiết `tags`:

- Kiểu `array` của `string`, `options.layout: "tags"`. Tài liệu array: "'tags' renders the array as a single tokenized input field. It only works if the array contains strings."; d.ts `layout?: 'list' | 'tags' | 'grid'` (`@sanity/types/lib/index.d.ts:799`).
- Ràng buộc: `rule.max(5)` (hiện mỗi nhóm có 3 nhãn; 5 là lựa chọn thiết kế, không phải từ tài liệu), `rule.unique()`, và một `custom` kiểm tra mỗi nhãn sau `trim()` không rỗng và không quá 40 ký tự. `unique()` trên mảng string chỉ bắt trùng nguyên văn ("Does a deep comparison"), không bắt khác hoa-thường hoặc thừa khoảng trắng, nên zod cũng phải `trim` và khử trùng.
- Trên màn hình ≤ 700px, `.methodTags` bị ẩn (`app/treatments/treatments.module.css`, khối `@media (max-width: 700px)`), nên đừng cho nhãn mang thông tin mà trang không thể thiếu.
- **Chưa kiểm chứng:** ô tags có tự `trim` hay chặn nhãn rỗng, và có phát sinh `null` khi xoá hết nhãn không; vì vậy zod vẫn lọc.

```ts
defineField({
  name: "tags",
  title: "Nhãn triệu chứng",
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
```

Ảnh: không bật `hotspot` (giống `serviceGroup`, `sanity/schemaTypes/index.ts:142-160`). Query chỉ lấy `image.asset->url` nên hotspot sẽ không có tác dụng ở frontend (xem `services-schema-research.md` mục 3.4). `assetRequired()` không cần vì ảnh là tuỳ chọn; nó chỉ có nghĩa khi dùng cùng `required()` (tài liệu image-type: "Must be used together with required").

### 3.3 Reference liệu pháp

Căn cứ: [Reference type](https://www.sanity.io/docs/studio/reference-type), [Array type](https://www.sanity.io/docs/studio/array-type).

Mẫu (giống `serviceGroup.treatments`, `sanity/schemaTypes/index.ts:161-174`):

```ts
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
  validation: (rule) => rule.unique().error("Không chọn cùng một liệu pháp nhiều lần."),
}),
```

- **Strong là mặc định**, đừng đặt `weak: true`. Tài liệu reference: "References can be either *strong* (default) or *weak*. A strong reference will enforce that the document it points to actually exists, and will not allow deletion of a document that any other document refers to."
- **`options.filter`** chỉ giúp editor chọn: "The filter only constrains the list of documents returned at the time you search. It does not guarantee that the referenced document will always match the filter provided." `disableNew: true` tắt tạo inline (tài liệu: "disable the inline creation of new document from the reference field").
- **Cùng một liệu pháp ở hai nhóm.** `unique()` chỉ so sánh các phần tử trong chính mảng nó gắn vào ("Requires all values within the array to be unique. Does a deep comparison, only excluding the _key property when comparing objects."). Mỗi nhóm có mảng `treatments` riêng, nên `heat-light` ở `infrared` và `cold` đều qua. Đây là suy ra từ định nghĩa, chưa thử trong Studio; test schema nên ghim cả hai chiều (trùng trong một nhóm bị chặn, khác nhóm được qua). Nếu owner không muốn trùng giữa các nhóm thì thêm một `custom` ở cấp `groups` gộp mọi `_ref`; không khuyến nghị làm trước khi có yêu cầu.
- **B với `string`:** một liệu pháp chỉ mang một giá trị `group`, nên "hai nhóm" là bất khả. Muốn được phải đổi thành `array` string, khi đó mất khoá cứng và thứ tự.

### 3.4 Strong reference có chặn Unpublish/Delete không

- **Delete: đã chứng minh.** Tài liệu như trên, và `docs/SERVICES_VERIFICATION.md` ghi: "deleting a strongly referenced target was rejected with **409**". Singleton trong thử nghiệm đó là tài liệu **đã publish** giữ reference, nên cùng điều kiện ở `methodsPage`.
- **Publish document tham chiếu khi đích chưa publish: bị chặn.** Tài liệu reference: "The referring document will be blocked from publishing until the new, referenced, document has been published." Tài liệu drafts: "A published document can't hold a strong reference to unpublished content."
- **Unpublish liệu pháp đang được tham chiếu: CHƯA RESOLVE từ tài liệu.** Trang [Drafts and versions](https://www.sanity.io/docs/content-lake/drafts-and-versions), [Reference type](https://www.sanity.io/docs/studio/reference-type) và [HTTP actions](https://www.sanity.io/docs/http-reference/actions) không nêu hành vi. Bằng chứng gián tiếp duy nhất đến từ Studio đã cài: hộp thoại Unpublish (`sanity/src/structure/documentActions/UnpublishAction.tsx`, dùng `ConfirmDeleteDialog` với `action="unpublish"` và `checkIncomingReferences`) hiển thị danh sách tài liệu đang tham chiếu, chuỗi giao diện ở `sanity/lib/resources-B2JQiyBa.js:383`: "You may not be able to unpublish “<DocumentTitle/>” because the following documents refer to it:", và nút ở dòng 333: "Unpublish anyway". Câu chữ "may not" cho thấy Studio cảnh báo, nhưng không chứng minh server từ chối hay cho qua. Webhook doc xác nhận hệ quả nếu thành công: "Unpublishing a document fires the **delete** trigger. An unpublish deletes the published document, and creates a draft from its contents if no draft already exists."
- **Hệ quả thiết kế:** không dựa vào việc "strong reference ngăn Unpublish". Dù server chặn hay không, `getMethods()` phải chịu được `null` ở `treatments[]->` (mục 3.5), và `/treatments/[slug]` trả `notFound()` (mục 3.6). Cách kiểm chứng rẻ nhất là một lần thử trên dataset staging (mục 5, câu 1).
- **Nếu server tự chuyển reference sang weak khi unpublish** (có một đoạn tóm tắt tìm kiếm nói vậy, nhưng không có trang nào tôi đọc được xác nhận, nên không dựa vào) thì `->` trả `null` tại published perspective, đúng case đã thử ở #8 (`[null]`, `array::compact` trả `[]`).

### 3.5 GROQ null-safety và truy vấn đề xuất

Căn cứ: [GROQ operators](https://www.sanity.io/docs/specifications/groq-operators), [GROQ functions](https://www.sanity.io/docs/specifications/groq-functions), [Perspectives](https://www.sanity.io/docs/content-lake/perspectives).

- `->`: "If the reference points to a non-existent document (for a weak reference), it returns `null`." Dưới perspective `published` chỉ thấy tài liệu đã publish (Perspectives: "`published` perspective to exclude all unpublished changes from your results").
- `array::compact`: "Returns a copy of the original array with all `null` values removed."
- **Truy vấn khuyến nghị** (cùng dạng `getServices()` ở `lib/sanity.ts:102`, đã chạy thật trong Vision ở #8 với projection tương đương; dạng `methodsPage` cụ thể **chưa chạy**, cần thử trong Vision trước khi merge):

```groq
*[_id == "methodsPage"][0].groups[defined(group)]{
  group,
  title,
  indexSubtitle,
  body,
  tags,
  "image": image.asset->url,
  "imageAlt": image.alt,
  "treatments": treatments[]->{"slug": slug.current, title}
}
```

- **Không cần `coalesce(array::compact(...), [])` trong query** vì zod đã lọc `null` (`lib/sanity.ts:44-47` mẫu `z.array(z.object(record).nullable().catch(null)).catch([]).transform(filter)`) và `fetchRecords` đã biến `null` thành `[]`. `array::compact` là tuỳ chọn nếu muốn giảm payload; kết quả của nó đã được xác nhận ở #8 trên mảng `[null]`. Không dùng `treatments[defined(@->slug.current)]->{...}`: tôi không thấy ví dụ chính thức nguyên dạng và nó chưa được thử.
- **Singleton chưa tồn tại:** `*[_id == "methodsPage"][0]` là `null`, `.groups[...]` trên `null` là `null`. `fetchRecords` hiện xử lý đúng (`lib/sanity.ts:91`: `if (value === null) return [];`), có test `fetch.mockResolvedValue(null)` ở `tests/services-sanity.test.tsx`. (Ghi chú: `services-schema-research.md` mục 1 nói `fetchRecords` ném lỗi với `null`; điều đó đã được sửa trong PR #8.)
- **Treatment thiếu slug hoặc thiếu title:** projection cho `{"slug": null, ...}`; `record` ở `lib/sanity.ts:31` đòi `slug` và `title` `min(1)`, mục bị `nullable().catch(null)` rồi bị lọc. Tập mục hợp lệ trùng đúng tập `getTreatments()` cho ra route, nên mọi link còn lại đều có trang (xem 3.6).
- **Perspective:** `lib/sanity.ts:25` đặt `perspective: "published"`. Singleton đang ở dạng draft chưa publish sẽ không xuất hiện.

### 3.6 Toàn vẹn link và ISR / revalidate

- `app/treatments/[slug]/page.tsx:10-12` `generateStaticParams` lấy slug từ `getTreatments()`; `app/treatments/[slug]/page.tsx:30-31` gọi `notFound()` khi không tìm thấy. `dynamicParams` mặc định `true` ("Dynamic route segments not included in `generateStaticParams` are generated at request time", `dynamicParams.md`); slug không tồn tại cho 404 (ISR guide: "if the post does not exist, then 404 is returned"). Vậy slug trỏ tới liệu pháp đã xoá/gỡ là 404 sạch, không phải lỗi 500.
- **Cửa sổ cũ:** `/treatments` được cache; sau khi gỡ liệu pháp, trang vẫn có thể chứa link cũ cho tới khi revalidate (tối đa 3600 giây hoặc webhook). Cùng tính chất với `/services`.
- **`/treatments` hiện chưa có `export const revalidate`** (`app/treatments/page.tsx` không khai báo; `/services` có `export const revalidate = 3600` ở `app/services/page.tsx:27`). Khi nối Sanity cần thêm `export const revalidate = 3600` và đổi component thành `async`.
- **Route revalidate:** `app/api/revalidate/route.ts` kiểm `x-sanity-secret` rồi gọi `revalidatePath("/", "layout")` và `revalidatePath("/sitemap.xml")`, không đọc body. Tài liệu Next: `revalidatePath('/', 'layout')` "will purge the Client Cache, and invalidate all cached data for revalidation on the next page visit". Tức mọi webhook hợp lệ làm mới `/treatments` ở lần truy cập kế tiếp, bất kể loại tài liệu.
- **Việc còn lại nằm ngoài repo:** filter của webhook Sanity quyết định sự kiện nào gọi route. Staging: `_type in ["servicesPage", "treatment", "sanity.imageAsset"]` (`docs/SERVICES_VERIFICATION.md`, mục "Authenticated Publish and automatic webhook"). **Cần thêm `"methodsPage"`**. Filter của webhook production `Revalidate` không được ghi trong repo, nên không biết sửa gì: UNVERIFIED. Tài liệu webhook: Create/Update/Delete là ba trigger riêng; bản draft/version mặc định bị bỏ qua ("By default, documents in the `drafts.` and `versions.` ID namespaces will be automatically ignored"), nên chỉ Publish gọi route.
- Sự kiện xoá/unpublish `treatment` sẽ qua trigger **Delete**. Filter `_type in [...]` có khớp trên sự kiện xoá hay không chưa được thử ở #8 (chỉ thử Publish). UNVERIFIED.
- **Tuỳ chọn rẻ để chặn link sai ngay cả khi cache lệch:** trong `getMethods()` lọc `treatments` theo `new Set((await getTreatments()).map(t => t.slug))`. Không khuyến nghị: cùng tập zod đã đảm bảo; chỉ thêm một phụ thuộc vào `getTreatments()`.

### 3.7 Fallback: bốn trạng thái

`getServices()` (`lib/sanity.ts:98-107`) xử lý như sau: `!enabled` (projectId = `missing-project-id`) trả `fallbackServices`; đã cấu hình thì dataset là nguồn duy nhất, singleton thiếu hoặc rỗng cho mảng rỗng và trang `/services` không có section (`tests/services-sanity.test.tsx`: "renders /services without sections before the singleton exists"); lỗi mạng thì `fetch` ném lỗi (ISR giữ trang cũ cho tới khi tái tạo thành công: "the last successfully generated data will continue to be served from the cache", ISR guide).

Với `/treatments` khuyến nghị **khác** ở một điểm: nhóm thiếu hoặc không hợp lệ rơi về bản viết cứng, vì footer có 5 link neo cố định và `tests/footer-links.test.ts` ghim chúng. Hơn nữa issue #9: "thiếu nội dung/ảnh không làm trang lỗi".

| Trạng thái                                 | `getServices()` (#8)               | `getMethods()` đề xuất                                                                                   |
| ------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Sanity chưa cấu hình (`projectId` thiếu)   | Dữ liệu viết cứng                  | Dữ liệu viết cứng `methods` (chuyển từ page sang `lib/content.ts`)                                        |
| Đã cấu hình, singleton chưa có (`null`)    | `[]`, không section                | Cả 5 nhóm từ bản viết cứng                                                                                 |
| Singleton có, thiếu một nhóm / nhóm không qua zod (không title hoặc body) | Nhóm đó biến mất | Nhóm đó rơi về bản viết cứng; các nhóm khác lấy từ CMS                                                   |
| Nhóm có nhưng thiếu ảnh / ảnh không phải `cdn.sanity.io` | Ảnh local của nhóm        | Như #8: ảnh local của nhóm (`methodFallbackImage`), alt dự phòng = `title`                                |
| Nhóm có nhưng không có `treatments` / reference chết | Bỏ mục `null`            | Không link (section vẫn hiện); không bao giờ bịa slug                                                    |

Sketch (thứ tự chuẩn theo `methodGroups`; `find` lấy bản đầu nên đồng thời khử trùng):

```ts
const methodSchema = z
  .object({
    group: z.enum(methodGroups),
    title: z.string().min(1),
    indexSubtitle: text,
    body: z.string().min(1),
    tags: z.array(z.string()).catch([]).transform((t) => [...new Set(t.map((s) => s.trim()).filter(Boolean))]),
    image: cdnImage.optional().catch(undefined),
    imageAlt: text,
    treatments: z
      .array(z.object(record).nullable().catch(null))
      .catch([])
      .transform((items) => items.filter((item) => item !== null)),
  })
  .transform((m) => ({
    ...m,
    image: m.image ?? methodFallbackImage[m.group],
    imageAlt: m.imageAlt || m.title,
  }));

export const getMethods = cache(async (): Promise<Method[]> => {
  if (!enabled) return fallbackMethods;
  const cms = await fetchRecords(`...query ở 3.5...`, methodSchema);
  // Fixed five groups in a fixed order: a missing or invalid group falls back, so footer anchors never dangle.
  return methodGroups.map((g) => cms.find((m) => m.group === g) ?? fallbackMethods.find((m) => m.group === g)!);
});
```

Điểm cần owner xác nhận: đây là chính sách khác `/services` ("dataset đã cấu hình là nguồn duy nhất", ghi ở `lib/sanity.ts:88` và plan #8 Global Constraints). Hệ quả tích cực: thứ tự deploy và seed không còn quan trọng (nếu giữ nguyên chính sách #8, deploy trước khi seed làm `/treatments` mất toàn bộ section). Hệ quả tiêu cực: editor không thể "ẩn" một nhóm (đúng với yêu cầu nhóm cố định), và nếu fallback lỗi thời so với CMS thì nội dung cũ có thể xuất hiện khi nhóm CMS bị hỏng (test seed ghim fallback = seed, như `tests/services-seed.test.ts`).

Nếu chọn thứ tự theo mảng thay vì thứ tự chuẩn, thay `methodGroups.map(...)` bằng `cms.filter(dedupe)` rồi bù nhóm thiếu ở cuối. Phức tạp hơn nên không khuyến nghị.

### 3.8 Neo và sticky nav

Hiện trạng:

- Sticky header: `components/holistic-nav.tsx:202` `<div className={styles.navRow}>`; CSS `components/holistic-chrome.module.css:87-98`: `position: sticky; top: 0; z-index: 40;`. Thanh utility phía trên không dính.
- Chiều cao: `>1000px` hàng nav cố định `height: 98px` (`holistic-chrome.module.css:127-141`), viên thuốc co từ 98px xuống 66px theo cuộn (`--nav-p`, `MORPH_RANGE = 120` ở `holistic-nav.tsx:20`). `≤1000px` hàng không cố định: trạng thái cuộn có `padding: 8px` hàng + `10px` hai đầu pill + nút `44px` (`.navCta` `min-height: 44px`, `.menuButton` `height: 44px`, `holistic-chrome.module.css:214,232`) + viền, ước tính khoảng 82px (701-1000px) và 65px (≤700px, hàng không padding: `holistic-chrome.module.css:347`). **Các số này tính từ CSS, chưa đo trên trình duyệt thật**. Ở đầu trang pill cao hơn (padding 26px), nên hàng thay đổi chiều cao khi `data-scrolled` bật (nội dung dịch lên cỡ 16px); lề an toàn nên ≥ 16px.
- **Không có `scroll-margin-top` hay `scroll-padding-top` nào** trong repo (`grep` trên `app/` và `components/`). Chỉ có `html { scroll-behavior: smooth; }` ở `app/globals.css:14-16`. Vậy hiện tại `/treatments#mtd-*` và `/services#svc-*` đều có thể đẩy heading dưới nav (kể cả chưa có lỗi nào được báo, đây là thiếu sót chưa ai xử lý).

Khuyến nghị: **một quy tắc `scroll-padding-top` trên `html`**, không phải `scroll-margin-top` từng section.

```css
/* app/globals.css */
html {
  scroll-behavior: smooth;
  /* Sticky nav: 98px on desktop. Keeps fragment targets (/treatments#mtd-*, /services#svc-*) below it. */
  scroll-padding-top: 7rem;
}
```

Căn cứ:

- Tài liệu Next.js trong repo khuyên đúng cách này: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md:964-972`: "You can account for its height using `scroll-padding-top` on the scroll container" kèm `html { scroll-padding-top: 64px; /* Match the height of your sticky header */ }`, và "It applies whenever Next.js uses the native `scrollIntoView()` API, including hash fragment (`#id`) navigation. Alternatively, you can use `scroll-margin-top` on individual target elements instead of setting a global offset." Footer dùng `Link` tới `/treatments#mtd-...` nên đi đường này.
- W3C CSS Scroll Snap §4.2: "This property specifies (for all scroll containers, not just scroll snap containers) offsets that define the optimal viewing region of a scrollport: the region used as the target region for placing things in view of the user." §5.1: UA "should use the element's scroll snap area, rather than just its border box" khi điều hướng tới fragment "even when snapping is off", tức `scroll-margin` cũng hợp lệ nhưng phải đặt cho từng đích.
- MDN `scroll-padding-top`: "This allows the author to exclude regions of the scrollport that are obscured by other content (such as fixed-positioned toolbars or sidebars)"; áp dụng cho "Scroll containers". MDN `scroll-margin-top`: áp dụng cho "all elements".
- `html` là scrollport của trang: `.page { overflow: clip }` (`app/globals.css:35`) không tạo scroll container (MDN `overflow`: giá trị `clip`: "The element box is not a scroll container"), nên quy tắc trên `html` vẫn hiệu lực.
- Một quy tắc phủ cả `/services` lẫn `/treatments` và mọi link neo khác (kể cả focus bằng bàn phím cuộn vào tầm nhìn), nên rẻ hơn `scroll-margin-top` trên `.method` rồi `.dive`.
- `7rem` (112px) là giá trị duy nhất vừa với desktop (98px + lề 14px) và hơi dư trên mobile (khoảng 47px trống ở ≤700px). Nếu thấy dư, tách theo breakpoint: `≤700px` 80px, `701-1000px` 96px, `>1000px` 112px (đều là số tính, cần đo). Phải chụp lại ở 320/768/1440 để làm bằng chứng cho tiêu chí "không che heading sau sticky nav".
- Phần tử đích là `div.method` (id), còn `h2` nằm giữa theo chiều dọc (`align-items: center` ở `.methodBody`). Cuộn cho đỉnh `div` hiện ra dưới nav là đủ để thấy heading.

### 3.9 Studio: singleton

`sanity.config.ts` hiện nối `servicesPage` bằng cách thủ công, không cần API beta:

- `sanity.config.ts:7`: `const singletonTypes = new Set(["siteSettings", "servicesPage"]);`
- `sanity.config.ts:26-29`: `S.listItem().title("Trang Dịch vụ").id("servicesPage").child(S.document().schemaType("servicesPage").documentId("servicesPage"))`
- `sanity.config.ts:31`: `S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? ""))`
- `sanity.config.ts:38-47`: `newDocumentOptions` ẩn singleton khỏi menu tạo toàn cục; `actions` chỉ giữ `publish`, `discardChanges`, `restore`.

Phải thêm cho `methodsPage`:

```ts
const singletonTypes = new Set(["siteSettings", "servicesPage", "methodsPage"]);
// sau mục servicesPage:
S.listItem()
  .title("Trang Phương pháp")
  .id("methodsPage")
  .child(S.document().schemaType("methodsPage").documentId("methodsPage")),
```

Hai bộ lọc còn lại tổng quát theo `singletonTypes`, không đổi. Trong `sanity/schemaTypes/index.ts` đăng ký `methodGroup` và `methodsPage` vào `schemaTypes`. Lưu ý: `ConfirmDeleteDialog` cho thấy Studio tự dựng danh sách "documents refer to it" khi Unpublish một `treatment` (mục 3.4); `methodsPage` sẽ có mặt trong danh sách đó, đó là tín hiệu hữu ích cho editor.

Cấu hình schema:

```ts
const methodsPage = defineType({
  name: "methodsPage",
  title: "Trang Phương pháp",
  type: "document",
  fields: [
    defineField({
      name: "groups",
      title: "Năm nhóm phương pháp",
      description: "Mỗi nhóm một lần. Thứ tự hiển thị cố định.",
      type: "array",
      of: [defineArrayMember({ type: "methodGroup" })],
      options: { sortable: false, disableActions: ["add", "addBefore", "addAfter", "remove", "duplicate"] },
      initialValue: methodGroups.map((group) => ({ _type: "methodGroup", group })),
      validation: (rule) =>
        rule.required().custom<Array<{ _key?: string; group?: string }>>(validateMethodGroups),
    }),
  ],
  preview: { prepare: () => ({ title: "Trang Phương pháp" }) },
});
```

Ghi chú: `disableActions` chỉ là chỉnh UI, không phải bảo vệ ghi dữ liệu (đã nêu ở `services-schema-research.md` 3.1), nên lớp zod và `find` ở `getMethods()` vẫn cần.

### 3.10 Seed và tính idempotent

Cách #8 làm (`docs/SERVICES_VERIFICATION.md`, mục "Seed, photos and references"): `scripts/seed/services-page.json` là **một object** với `_id: "servicesPage"`, `_key` cố định cho từng nhóm (`"therapy"`, ...), **không có `image` và `treatments`** (test `tests/services-seed.test.ts` ghim điều này); lệnh:

```bash
npx sanity documents create scripts/seed/services-page.json --missing \
  --project-id yjzexxml --dataset staging
```

Lần chạy lại in `Skipped (already exists): servicesPage` và giữ nội dung đã làm giàu. CLI cần `sanity.cli.ts` (đã có). `--missing` theo CLI doc: "On duplicate document IDs, don't modify the target document(s)", tức ngữ nghĩa `createIfNotExists`, nhưng ở mức **cả document**: chạy lại sau khi đã có document sẽ không thêm `treatments` hay `image` nào.

Tương đương cho `methodsPage`:

- `scripts/seed/methods-page.json`: `_id: "methodsPage"`, `_type: "methodsPage"`, `groups` gồm 5 item `{_key: "<group>", _type: "methodGroup", group, title, indexSubtitle, body, tags}` lấy từ `methods` đang viết cứng (`app/treatments/page.tsx:32-83`), theo thứ tự `methodGroups`. Không `image`, không `treatments`. `tests/methods-seed.test.ts` sao từ `tests/services-seed.test.ts`: `_id`, validator trả `true`, `_key` duy nhất, nội dung trùng fallback, không có `image`/`treatments`.
- **`_id` không được có dấu chấm.** Tài liệu IDs: "Any document ID containing a dot is considered private and has restricted accessibility" và "it is not possible to make documents under a sub-path (i.e. containing a `.` in the ID) publicly available". `methodsPage` thoả. Chỉ seed ID đã publish (không `drafts.`/`versions.`).
- **Reference tới `treatment`: repo không chứa `_id` của chúng.** Production: `scripts/migrate-legacy.mjs:28` giữ nguyên `_id` của dataset cũ (`"IDs stay intact so references and draft/published pairs stay connected"`); bản seed #8 (một tệp cục bộ bị gitignore trong `.context/acceptance/`, không có trong repo) cho thấy `_ref` production dạng UUID chứ không phải `treatment-<slug>`. `treatment-cupping` trong `tests/services-schema.test.ts` chỉ là dữ liệu giả cho validator (`getDocumentExists: async () => true`). Production hiện chỉ có `cupping`, `heat-light`, `cold-plunge` (`docs/SERVICES_VERIFICATION.md`); `dry-needling` và `iastm` chỉ có ở fallback `lib/content.ts:170-202`, **không có document** nên không thể link. Do đó:
  1. Cách ít script nhất: seed chỉ có nội dung, editor chọn reference trong Studio rồi Publish (đúng cách #8 làm cho staging).
  2. Nếu cần script: truy vấn chỉ-đọc `*[_type == "treatment"]{_id, "slug": slug.current}`, ánh xạ slug → `_id` đã publish, rồi **vá** (không `--missing`) bằng `client.patch("methodsPage").setIfMissing(...)` / `insert`. Tài liệu patch: "setIfMissing is like set, except existing keys will be preserved and not overwritten" và đường dẫn khớp `_key` kiểu `some.array[key == "abc-123"]`. Strong reference tới `_id` không tồn tại bị từ chối (theo tài liệu reference, mục 3.3). Chưa thử.
- Seed bằng API bỏ qua validation Studio ("Schema validation rules only run in Sanity Studio"), vì vậy test seed chạy `validateMethodGroups` thay cho Studio.

Gợi ý ánh xạ nhóm → liệu pháp (**cần owner duyệt**, mục 6): `manual` → `cupping`; `cold` → `cold-plunge`; `infrared` → `heat-light`; `electro`, `rehab` → không có document nên không link. Ở `/services`, `heat-light` đã thuộc nhóm `recovery`.

## 4. Test plan, ánh xạ vào test hiện có

Tất cả chạy được bằng vitest hiện tại, không cần Studio thật hay mạng.

| Test mới / sửa                                              | Sao từ                                  | Nội dung chính                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/method-groups.test.ts`                               | `tests/service-groups.test.ts`          | `methodGroups` bằng 5 khoá theo thứ tự; `Object.keys(methodAnchor)`, `Object.keys(methodFallbackImage)` và `methods.map(m => m.group)` đều bằng `[...methodGroups]`; fallback không có `numeral`/`imageLeft`/`id` lưu sẵn.                                         |
| `tests/service-groups-validation.test.ts` (mở rộng) hoặc `tests/method-groups-validation.test.ts` | cùng file                       | `validateMethodGroups`: đủ 5 nhóm theo thứ tự bất kỳ, trùng (lỗi trên item thứ hai theo `_key`), thiếu (báo đủ các nhóm thiếu), nhóm lạ/rỗng, `undefined`. Test hiện có của `validateServiceGroups` phải vẫn pass nguyên không sửa.                                |
| `tests/methods-schema.test.ts`                              | `tests/services-schema.test.ts`         | `initialValue` đúng 5 nhóm; `disableActions` chứa add/remove/duplicate; `sortable === false`; chấp nhận 5 nhóm đủ; chặn trùng, chặn thiếu, chặn `groups` rỗng; `title`, `body` bắt buộc; alt bắt buộc khi có asset; `tags` quá 5 hoặc trùng hoặc nhãn rỗng bị chặn; **cùng liệu pháp hai lần trong một nhóm bị chặn, nhưng cùng liệu pháp ở hai nhóm khác nhau được qua** (ghim quyết định mục 3.3). |
| `tests/methods-seed.test.ts`                                | `tests/services-seed.test.ts`           | `_id === "methodsPage"` (không dấu chấm); `validateMethodGroups(seed.groups) === true`; `_key` duy nhất; trùng fallback ở `title`, `indexSubtitle`, `body`, `tags`; không có `image`, `treatments`.                                                               |
| `tests/methods-sanity.test.tsx`                             | `tests/services-sanity.test.tsx`        | Query chứa `_id == "methodsPage"` và `.groups`; `fetch → null` trả cả 5 nhóm fallback (**khác** `[]` của services); nhóm không hợp lệ/trùng bị bỏ và nhóm thiếu rơi về fallback, luôn đủ 5 nhóm theo thứ tự chuẩn; ảnh thiếu hoặc không từ `cdn.sanity.io` dùng ảnh local; reference `null`/slug rỗng bị lọc; render: `id` neo từ `methodAnchor`, `numeral` `01`..`05` theo vị trí, ảnh trái ở vị trí 0/2/4, `href="/treatments/<slug>"`, không link khi `treatments` rỗng; `fetch.mockRejectedValue` thì ném lỗi (hành vi hiện tại, ISR giữ trang cũ). |
| `tests/methods-fallback.test.ts`                            | `tests/services-fallback.test.ts`       | `vi.mock("@/sanity/env", { projectId: "missing-project-id" })`: 5 nhóm theo thứ tự; mọi `id` neo và thẻ index có mặt; mọi `treatments[].slug` của fallback tồn tại trong `treatments` ở `lib/content.ts`; mọi ảnh bắt đầu bằng `/images/` và tồn tại trong `public/images`.                                  |
| `tests/studio-config.test.ts` (sửa)                         | cùng file                               | Chuyển hai test thành `it.each(["servicesPage", "methodsPage"])`: ẩn khỏi menu tạo toàn cục, chỉ giữ `publish`, `discardChanges`, `restore`.                                                                                                                       |
| `tests/footer-links.test.ts` (**sẽ hỏng, phải sửa**)        | cùng file                               | Test hiện đọc nguồn `app/treatments/page.tsx` và đòi `id: methodAnchor.<khoá>,` (`tests/footer-links.test.ts`: `expect(source).toContain(\`id: ${name}.${key},\`)`). Sau khi `methods` chuyển sang `lib/content.ts` và id suy ra, đổi sang nhánh giống services: `expect(source).toContain("methodAnchor[method.group]")`. |
| Tuỳ chọn: test CSS                                          | mẫu đọc nguồn của `footer-links.test.ts` | `readFileSync("app/globals.css")` chứa `scroll-padding-top`. Không thay được ảnh chụp 320/768/1440 làm bằng chứng nghiệm thu.                                                                                                                                       |

Kiểm tra tay trên staging (cần quyền Sanity, ngoài vitest): publish sửa một nhóm và một reference; webhook gọi `/api/revalidate` 200; index → section → detail; Unpublish thử một liệu pháp (câu 1 mục 5); keyboard/anchor ở 320/768/1440 và chụp để chứng minh heading không bị che.

## 5. Điều chưa kiểm chứng

1. **Unpublish một `treatment` đang được singleton tham chiếu bằng strong reference**: server có từ chối, cho qua, hay đổi reference? Tài liệu Sanity tôi đọc không nêu; Studio chỉ cảnh báo ("You may not be able to unpublish ... because the following documents refer to it", nút "Unpublish anyway"). Cách kiểm: thử trên dataset staging với một liệu pháp thử, rồi khôi phục. Kết quả chỉ ảnh hưởng thử nghiệm và tài liệu, không ảnh hưởng thiết kế (code đã chịu `null`).
2. **Filter webhook:** (a) filter của webhook production `Revalidate` không được ghi trong repo; (b) `_type in [...]` có khớp sự kiện **Delete** (xoá hoặc Unpublish `treatment`) không: ở #8 chỉ thử Publish. Phải thêm `methodsPage` ở cả staging và production.
3. **Cùng một liệu pháp ở hai nhóm:** kết luận "được" suy ra từ định nghĩa `unique()` (chỉ trong mảng của nó), chưa thử trong Studio; test schema sẽ ghim.
4. **Truy vấn `methodsPage` cụ thể** chưa chạy trong Vision (dạng tương đương của `servicesPage` đã chạy ở #8).
5. **Ô `tags` của Studio:** có `trim`, chặn nhãn rỗng hay sinh phần tử rỗng/`null` không. Hành vi `rule.unique()` trên string chỉ suy từ định nghĩa.
6. **Chiều cao nav ở ≤1000px** (82px và 65px) tính từ CSS, chưa đo bằng trình duyệt; giá trị `7rem` cần xác nhận bằng ảnh chụp ở 320/768/1440 khi cuộn tới từng neo. Chưa kiểm hành vi khi đầu trang `data-scrolled` đổi trạng thái lúc cuộn mượt.
7. **Ánh xạ UUID ↔ slug của `treatment` production và staging** chưa đọc được từ repo; `_id` thực tế phải truy vấn tại thời điểm vá reference. Chưa thử việc API từ chối strong reference tới `_id` không tồn tại.
8. **`initialValue` cấp mảng khi mở singleton lần đầu** tạo draft ngay hay chỉ sau lần sửa đầu: chưa thử riêng cho `methodsPage`; ở #8 chỉ có kiểm chứng gián tiếp qua Publish/Discard, không có bước ghi riêng cho điểm này.
9. **Production chưa có `methodsPage`**: chính sách fallback theo nhóm làm thứ tự deploy/seed không quan trọng, nhưng nếu owner giữ chính sách "nguồn duy nhất" của #8 thì phải seed trước khi deploy.
10. `sanity/src/structure/documentActions/UnpublishAction.tsx` và các tệp nguồn Studio khác được đọc từ nhánh `main` của `sanity-io/sanity` trên GitHub, không phải đúng tag 6.17.0; chuỗi giao diện ở trên thì được đọc từ bundle đã cài.

## 6. Câu hỏi cho owner

1. **Số nhóm.** Issue #9 trên GitHub vẫn ghi "bốn nhóm" và "Không tự thêm phương pháp thứ năm/sáu"; spec 2026-10-09 mục 1 ghi quyết định 5 nhóm và nói cần cập nhật #9. Xác nhận năm nhóm là chính thức để sửa issue.
2. **Liệu pháp nào ở nhóm nào có phải nội dung đã duyệt không?** Đề xuất `manual` → `cupping`, `cold` → `cold-plunge`, `infrared` → `heat-light`; `electro` và `rehab` chưa có document `treatment` nên không có link. `dry-needling` và `iastm` chỉ có ở fallback, chưa có trang. `heat-light` có đặt thêm ở `cold` không (trùng nhóm ở `/services`: nằm cùng `cold-plunge` ở `recovery`)?
3. **Giao diện khối link liệu pháp.** Bản comp hiện tại của `/treatments` không có chỗ hiển thị link tới liệu pháp (`app/treatments/page.tsx:129-157` chỉ có tiêu đề, đoạn mô tả, nhãn, ảnh). Cần quyết định vị trí và nhãn; nhóm không có link hiển thị thế nào.
4. **Nhãn `tags` và đoạn `body` là cách diễn đạt về triệu chứng/điều trị** (ví dụ "Viêm gân", "Hậu chấn thương", "giảm viêm"); issue #9 cấm "tuyên bố điều trị mới". Seed lấy nguyên văn hiện có; owner xác nhận đây là bản đã duyệt trước khi cho editor chỉnh sửa.
5. **Fallback theo nhóm** (mục 3.7) thay cho "dataset là nguồn duy nhất" của `/services`: đồng ý?
6. **Có cần kéo thả đổi thứ tự năm nhóm không?** Khuyến nghị: không (thứ tự cố định, khớp footer), `sortable: false`.
7. **Trường `group` trên `treatment` của spec 2026-10-09** (6 giá trị gồm `consult`) còn dùng để dẫn link carousel trang chủ không? Nếu còn, đó là việc riêng của carousel, không nên dùng làm nguồn cho trang này (tránh hai nguồn cho cùng liên kết).
8. **Webhook:** ai thêm `methodsPage` vào filter staging và production trong Sanity Manage?
