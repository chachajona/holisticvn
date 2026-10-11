# Schema Sanity cho trang Dịch vụ: singleton hay document riêng (#8)

Ngày 2026-10-11. Phạm vi: chọn cấu trúc cho ba nhóm cố định `therapy` / `training` / `recovery` của `/services` sao cho editor đổi được thứ tự, nội dung, ảnh (có alt) và liên kết liệu pháp, còn visitor không bao giờ gặp thiếu nhóm, trùng nhóm hay link chết.

Phiên bản đã cài (đọc từ `node_modules`): `sanity` 6.17.0, `@sanity/vision` 6.17.0, `next-sanity` 13.3.4, `@sanity/client` 8.9.0, `next` 16.3.8. `NEXT_PUBLIC_SANITY_API_VERSION` mẫu trong `.env.example` là `2025-01-01`. GitHub báo bản phát hành mới nhất của `sanity` là v6.18.0.

Nguồn: tài liệu chính thức sanity.io/docs (đọc qua bản markdown của chính trang đó, trích dẫn bằng URL HTML), repo `sanity-io/sanity`, template `sanity-io/template-nextjs-clean` (nay chuyển tên thành `sanity-io/sanity-template-nextjs-clean`, commit `2ad95bf` trên `main` ngày 2026-10-11), d.ts của gói đã cài, và tài liệu Next.js trong `node_modules/next/dist/docs`. Mọi điều chưa kiểm chứng được ở nguồn gốc được ghi ở mục 4. Không dùng blog hay mục "answers" làm căn cứ.

## 1. Kết luận ngắn

**Chọn A: một singleton `servicesPage` có mảng `groups` gồm ba object, mỗi object ghim một `group`.** Sao chép ba nhóm vào `initialValue` của mảng, kiểm tra tập nhóm bằng một `rule.custom` ở cấp mảng, và vẫn giữ lớp zod/dedupe ở frontend vì mọi validation chỉ chạy trong Studio.

Năm điều quyết định:

1. **Publish và thứ tự là nguyên tử.** Thứ tự là thứ tự mảng, kéo thả mặc định (`options.sortable` mặc định `true`), và một lần Publish cập nhật cả ba nhóm. Với B và C thứ tự nằm ở trường `order` của ba document, nên có khoảng giữa các lần publish mà site hiển thị thứ tự lai hoặc trùng `order`.
2. **Thiếu hoặc trùng nhóm kiểm được trong một document.** `rule.unique()` không đủ vì nó so sánh sâu cả object (chỉ bỏ `_key`), nên hai item cùng `group` nhưng khác nội dung vẫn qua. Cần `rule.custom` trên mảng, và có thể trả lỗi theo từng item bằng `path: [{_key}]`. Validator bất đồng bộ của C đọc dataset từ Studio, chạy ở phía client, nên không nguyên tử và có thể bị hai editor vượt qua cùng lúc.
3. **Hướng dẫn mô hình hoá chính thức khớp với trường hợp này.** Sanity chọn document type thay vì mảng cố định khi tập hợp sẽ lớn thêm (ví dụ gói đăng ký); ở đây tập hợp cố định ba phần tử, đúng trường hợp ngược lại.
4. **Singleton đã có sẵn trong repo.** `siteSettings` đã dùng khuôn `S.document().schemaType().documentId()` cộng với allowlist action (`publish`, `discardChanges`, `restore`), vốn cũng ẩn Unpublish và Delete, hai thao tác sẽ làm trang `/services` rỗng nếu thực hiện trên singleton đã publish.
5. **Chi phí dung lượng không đáng kể.** Giới hạn document là 32 MB và 1.000 thuộc tính; ba nhóm khoảng một trăm thuộc tính (ước lượng, mục 3.6).

Hai điều phải xử lý khi chọn A, nếu không trang sẽ vỡ:

- **Singleton chưa tồn tại thì truy vấn trả `null`**, không phải mảng rỗng. `fetchRecords` hiện ném lỗi nếu kết quả không phải mảng, nên `/services` sẽ lỗi trên dataset mới. Phải chuyển `null` thành `[]` trong code (và có test).
- **Không dùng `_id` có dấu chấm** như `service.therapy` hay `treatment.<slug>` trong spec 2026-10-09: tài liệu Sanity nói document có dấu chấm trong ID (sub-path) không thể công khai cho người chưa đăng nhập. Dùng `servicesPage`, hoặc nếu theo B thì `service-therapy`.

## 2. So sánh A / B / C

| Tiêu chí                       | A. Singleton + mảng object                                                                                                                                   | B. Ba document ID cố định + `order`                                                                                             | C. Hiện tại: document tự do + `group` + `order` + validator async                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trạng thái sai bị chặn         | Trùng/thiếu nhóm: chặn publish bằng `rule.custom` (chỉ trong Studio). Không thể xoá một nhóm riêng lẻ khi publish xong vì Studio không cho Unpublish/Delete. | Trùng nhóm bất khả thi theo cấu trúc (ID là khoá). Thiếu nhóm vẫn xảy ra nếu document chưa được tạo. `group` phải suy ra từ ID. | Chỉ validator async, chạy trong Studio, đếm cả draft, có thể bị vượt qua bởi ghi qua API hoặc bởi publish đồng thời. Xoá document làm thiếu nhóm. |
| Trải nghiệm đổi thứ tự         | Kéo thả trong một form.                                                                                                                                      | Sửa số `order` ở ba document, ba lần publish.                                                                                   | Giống B, và `order` có thể trùng hoặc thiếu.                                                                                                      |
| Nguyên tử khi publish          | Một document, một lần publish. Nhược điểm: lỗi ở một nhóm chặn publish cả ba.                                                                                | Ba lần publish riêng. Có thể publish từng nhóm độc lập.                                                                         | Như B.                                                                                                                                            |
| Dataset trống / lần đầu        | Truy vấn trả `null` đến khi publish lần đầu. Studio mở form với `initialValue` (mục 3.2).                                                                    | Ba `null`/vắng; cần ba lần tạo. Structure cần ba mục.                                                                           | Truy vấn trả `[]`, code hiện tại đã xử lý.                                                                                                        |
| Độ đơn giản GROQ               | `*[_id == "servicesPage"][0].groups[...]{...}`; thứ tự là thứ tự mảng, không cần `order(...)`.                                                               | `*[_id in [...]] \| order(order asc)`; cần dedupe vì không có gì ép `order` khác nhau.                                          | `*[_type == "service"] \| order(order asc)` cộng dedupe bằng JS (đang có).                                                                        |
| Chi phí chuyển từ code hiện có | Trung bình: schema mới, bỏ `order` và validator async, đổi query, thêm xử lý `null`, đổi một test. Phần zod, trang, booking giữ nguyên.                      | Thấp đến trung bình: giữ trường, thay validator bằng ID, thêm 3 singleton vào Structure.                                        | Không.                                                                                                                                            |
| Rủi ro chính                   | Form dài; lỗi một nhóm chặn cả trang; trạng thái kẹt nếu tắt `add`/`remove` mà tài liệu hỏng (mục 3.1); singleton `@beta` nếu dùng API mới.                  | Cấu hình Structure/`newDocumentOptions` nhân ba; thứ tự không nguyên tử; dấu chấm trong ID làm ID private.                      | Mọi kiểm tra "đủ ba nhóm" chỉ nằm ở validator best-effort; trùng nhóm vẫn có thể lọt và chỉ còn zod chặn ở frontend.                              |

Nhận xét thẳng: B mạnh hơn A về một điểm, là trùng nhóm bất khả thi theo cấu trúc, nhưng thua ở đúng yêu cầu "editor đổi thứ tự". A mạnh hơn C ở mọi tiêu chí trừ chi phí chuyển đổi.

## 3. Phát hiện theo từng chủ đề

### 3.1 Validation cấp mảng và ghim giá trị cho item

Căn cứ: [Array type §Validation](https://www.sanity.io/docs/studio/array-type) và [Validation §Validating children](https://www.sanity.io/docs/studio/validation).

- Mảng có `required()`, `unique()`, `min`, `max`, `length(n)`, `custom(fn)`. Trích `unique()`: "Requires all values within the array to be unique. Does a deep comparison, only excluding the _key property when comparing objects." Nghĩa là `unique()` và `length(3)` riêng lẻ không bắt được "ba item đều `therapy`" khi nội dung khác nhau. Phải dùng `custom`.
- `custom` ở cấp mảng được trả về mảng lỗi `{message, path}`, trong đó `path` có thể là `[{_key}]`. Tài liệu viết: "preferably" dùng `_key` thay vì chỉ số.
- Giá trị khởi tạo: tài liệu cho phép `initialValue` ở mức mảng, ví dụ trong [Initial Value Templates §field](https://www.sanity.io/docs/studio/initial-value-templates) mảng có `initialValue: [{ _type: 'mySecondObject', stringField: '...' }]`. `_type` là bắt buộc. Cảnh báo ở [Array type §Why array items have a `_key`](https://www.sanity.io/docs/studio/array-type): đặt `_key` thủ công trong `initialValue` không có tác dụng, Studio sinh `_key` ngẫu nhiên.
- Có thể gỡ nút thêm/xoá/nhân bản: `options.disableActions` nhận `add`, `addBefore`, `addAfter`, `remove`, `duplicate`, `copy`. Tài liệu ghi rõ: "These changes are only about UI affordances, and doesn't imply any form of write protection for the actual data. Items can still be added or removed to an array by sending mutations to the API." Tắt `add` cũng tắt `addBefore`/`addAfter`, nhưng vẫn có thể chèn bằng `duplicate`.
- Chặn sửa `group` sau khi đã đặt: `readOnly` nhận callback có `value` ([Conditional fields](https://www.sanity.io/docs/studio/conditional-fields)). Dùng `readOnly: ({ value }) => Boolean(value)` thay vì `readOnly: true` cố định, để item mới (nếu có) vẫn chọn được nhóm.
- Cảnh báo kẹt: nếu tắt cả `add` lẫn `remove` mà tài liệu ở trạng thái hỏng (ví dụ ghi qua API), editor không tự sửa được trong Studio. Đường thoát là "Discard changes" về bản đã publish hợp lệ, hoặc dev ghi lại bằng CLI. Chưa thử trên Studio thật (mục 4).

Mẫu validator, hàm thuần để test được bằng vitest (không cần Studio):

```ts
const GROUPS = ["therapy", "training", "recovery"] as const;

export function validateServiceGroups(items: Array<{ _key?: string; group?: string }> | undefined) {
  const errors: Array<{ message: string; path?: [{ _key: string }] }> = [];
  const seen = new Set<string>();
  for (const item of items ?? []) {
    const at = item._key ? ([{ _key: item._key }] as [{ _key: string }]) : undefined;
    if (!item.group || !GROUPS.includes(item.group as (typeof GROUPS)[number]))
      errors.push({ message: "Chọn một nhóm hợp lệ.", path: at });
    else if (seen.has(item.group))
      errors.push({ message: `Nhóm "${item.group}" bị trùng.`, path: at });
    else seen.add(item.group);
  }
  for (const g of GROUPS) if (!seen.has(g)) errors.push({ message: `Thiếu nhóm "${g}".` });
  return errors.length ? errors : true;
}
```

### 3.2 Singleton: Structure, actions, newDocumentOptions, tạo lần đầu

Căn cứ: [Structure Builder cheat sheet §Singleton documents](https://www.sanity.io/docs/studio/structure-builder-cheat-sheet), [Create a link to a single edit page…](https://www.sanity.io/docs/studio/create-a-link-to-a-single-edit-page-in-your-main-document-type-list), [New document options §Hide a singleton from the create menu](https://www.sanity.io/docs/studio/new-document-options), changelog [Studio v6.17.0](https://www.sanity.io/docs/changelog/studio-Ni4xNi4w.md), và `sanity-io/sanity` `.agents/skills/sanity-singletons/SKILL.md` (nhánh `main`).

- **Có hai cách, cả hai đều được hỗ trợ ở Studio 6.17.0.**
  - Thủ công (cách repo đang dùng cho `siteSettings`): `S.listItem().child(S.document().schemaType(x).documentId(x))`, lọc `newDocumentOptions` theo `templateId`, lọc `document.actions`. Hướng dẫn mới nói: "Wiring a pane by hand with `S.document().schemaType('siteSettings').documentId('siteSettings')` is still fully supported".
  - API mới `document.singletons` + `defineSingleton` + `S.listItem().singleton(id)`. Đây là **beta**: changelog 6.17.0 viết "The API launches in beta today, and we'll stabilise it in an upcoming Studio release"; d.ts của bản cài ghi `@hidden @beta` (`node_modules/sanity/lib/types-DRvdW1u0.d.ts:7833`, `sanity@6.17.0`; hàm `defineSingleton` ở `node_modules/sanity/lib/useDocumentOperationEvent-DK7DiiZT.d.ts:2942`). Tôi không tìm thấy bằng chứng 6.18.0 đã ổn định nó. Hướng dẫn trong `SKILL.md` cũng cho phép giữ cách thủ công khi di chuyển.
- **API mới làm gì tự động:** tự sinh initial value template cho singleton, ẩn khỏi mọi chỗ tạo mới, bỏ action `duplicate`, thêm badge "Singleton". **Không** ẩn Delete/Unpublish/Discard: "Deleting a singleton is a legitimate 'reset'". Muốn chặt như plugin cũ thì tự thêm allowlist theo `context.singleton` (`SKILL.md`, mục "Migrating from sanity-plugin-singleton-management").
- **Cho `servicesPage` nên giữ allowlist** (`publish`, `discardChanges`, `restore`) như `siteSettings`, vì Unpublish/Delete bản đã publish làm `/services` rỗng.
- **Template chính thức** đi cách thủ công: `studio/src/structure/index.ts` trong `sanity-io/template-nextjs-clean` dùng `S.document().schemaType('settings').documentId('siteSettings')`, loại `settings` khỏi `S.documentTypeListItems()`, và truy vấn `*[_type == "settings"][0]` (`frontend/sanity/lib/queries.ts`, commit `2ad95bf`).
- **Khi singleton chưa tồn tại:** Structure vẫn mở form tại ID cố định; theo `SKILL.md` "opening the singleton before it exists still applies its initial value", và "editing recreates the document". Draft nằm ở `drafts.<id>`, bản publish ở `<id>` ([Drafts and versions](https://www.sanity.io/docs/content-lake/drafts-and-versions)). Truy vấn dưới perspective `published` chỉ thấy `<id>`, nên **trước lần publish đầu tiên, frontend nhận `null`** ([Perspectives §published](https://www.sanity.io/docs/content-lake/perspectives)).
- **Tạo sẵn (seed):**
  - `sanity documents create --missing file.json` cho phép "On duplicate document IDs, don't modify the target document(s)", tức ngữ nghĩa createIfNotExists ([Documents CLI](https://www.sanity.io/docs/cli-reference/documents)); `--replace` là ghi đè.
  - `client.createIfNotExists({_id, _type, ...})` cho script ([Creating and updating documents with @sanity/client §createIfNotExists](https://www.sanity.io/docs/apis-and-sdks/js-client-mutations)).
  - Chỉ seed ID đã publish; tài liệu khuyên không tạo ID tiền tố `drafts.`/`versions.` bằng API ([IDs](https://www.sanity.io/docs/content-lake/ids)).
  - Tài liệu ghi seed bằng API ghi thẳng bản publish, bỏ qua validation Studio ("Schema validation rules only run in Sanity Studio", [Validation](https://www.sanity.io/docs/studio/validation)); mỗi item cần `_key` do script tự đặt.
  - Cách không cần script: để editor mở singleton, Studio tự điền `initialValue` (3 nhóm), editor điền nội dung rồi Publish.

### 3.3 Reference, GROQ `->` và null

Căn cứ: [Reference type](https://www.sanity.io/docs/studio/reference-type), [GROQ operators §`->`](https://www.sanity.io/docs/specifications/groq-operators), [GROQ functions §`array::compact`](https://www.sanity.io/docs/specifications/groq-functions), [GROQ joins §Left Outer Join](https://www.sanity.io/docs/specifications/groq-joins), [Drafts and versions](https://www.sanity.io/docs/content-lake/drafts-and-versions), [Presenting and previewing content](https://www.sanity.io/docs/content-lake/presenting-and-previewing-content).

- **Mặc định là strong reference**, và đó là biện pháp cấu trúc mạnh nhất chống link chết: "A strong reference will enforce that the document it points to actually exists, and will not allow deletion of a document that any other document refers to." Studio chặn publish document tham chiếu tới khi đích đã publish ([Reference type](https://www.sanity.io/docs/studio/reference-type), đoạn mở đầu); "A published document can't hold a strong reference to unpublished content" ([Drafts and versions](https://www.sanity.io/docs/content-lake/drafts-and-versions)). **Đừng đặt `weak: true`.** Với weak, tài liệu nói: "dereferencing a weak reference whose target is not visible returns `null`… on the `published` perspective the value stays `null` until the target is published".
- Hệ quả cho code hiện tại: với strong reference, `null` trong `treatments[]->` chủ yếu đến từ ghi qua API/import (validation chỉ ở Studio), từ treatment thiếu `slug`, hoặc từ cache. Lớp lọc `null` của zod vẫn đáng giữ nhưng là lưới an toàn, không phải đường chính. **Bước demo "unpublish treatment thì link biến mất" ở Task 6 của kế hoạch có thể không làm được** vì strong reference có thể chặn Unpublish (chưa xác minh, mục 4). Đổi bước đó thành "gỡ reference khỏi nhóm".
- **Tài liệu về `->` trên mục không tồn tại:** "If the reference points to a non-existent document (for a weak reference), it returns `null`" ([GROQ operators](https://www.sanity.io/docs/specifications/groq-operators)); left outer join: "or `null` if the referenced document does not exist" ([GROQ joins](https://www.sanity.io/docs/specifications/groq-joins)). Dưới perspective `drafts`, tham chiếu tới draft "resolved/dereferenced normally"; dưới `published` thì không có draft nào được nhìn thấy ([Presenting and previewing content §drafts, §published](https://www.sanity.io/docs/content-lake/presenting-and-previewing-content)).
- **Lọc `null`:** `array::compact(<array>)` "Returns a copy of the original array with all `null` values removed" ([GROQ functions](https://www.sanity.io/docs/specifications/groq-functions)). Dạng `treatments[defined(@->slug.current)]->{...}` ghép từ toán tử có tài liệu (bộ lọc `[expr]` chạy trong phạm vi từng phần tử; `@`; `->`), nhưng tôi không thấy ví dụ chính thức nguyên dạng, nên coi là **cần thử trong Vision**. Hướng dẫn chính thức khuyên bọc `coalesce(..., [])` để thuộc tính luôn trả mảng ([An opinionated guide to Sanity Studio §GROQ](https://www.sanity.io/docs/developer-guides/an-opinionated-guide-to-sanity-studio)).
- **Giới hạn lựa chọn khi chọn reference:** `options.filter` (chuỗi hoặc hàm trả `{filter, params}`) và `filterParams`. Cảnh báo chính thức: "The filter only constrains the list of documents returned at the time you search. It does not guarantee that the referenced document will always match the filter provided." Nên `defined(slug.current)` trong `filter` chỉ giúp editor, không thay thế lọc ở GROQ. Mẫu "ẩn mục đã chọn trong mảng" có sẵn (hàm `filter` nhận `parent` là mảng các item). `options.disableNew: true` tắt tạo inline.
- `rule.unique()` trên mảng reference chặn chọn trùng liệu pháp (so sánh sâu, chỉ bỏ `_key`; hai reference tới cùng `_ref` bằng nhau). Đây là suy ra từ định nghĩa `unique()`, chưa thử.

```ts
defineField({
  name: "treatments",
  type: "array",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "treatment" }],
      options: { filter: "defined(slug.current)", disableNew: true },
    }),
  ],
  validation: (rule) => rule.unique(),
});
```

### 3.4 Ảnh: hotspot, alt, credit

Căn cứ: [Image type](https://www.sanity.io/docs/studio/image-type), [Presenting images §The crop and hot-spot](https://www.sanity.io/docs/apis-and-sdks/presenting-images), [Rendering images in Next.js with next-sanity](https://www.sanity.io/docs/nextjs/next-sanity-image-component), template `sanity-io/template-nextjs-clean` `studio/src/schemaTypes/documents/post.ts`.

- `options.hotspot: true` bật công cụ crop/hotspot và lưu `hotspot`/`crop` trên chính trường ảnh. Chúng chỉ có hiệu lực khi truyền **cả object ảnh** vào `@sanity/image-url` hoặc `Image` của `next-sanity/image` (tài liệu: "The URL builder respects crop and hotspot settings when you pass the full image object"). Truy vấn hiện tại chỉ lấy `image.asset->url`, nên hotspot đang **không tác dụng** ở frontend: hoặc chiếu `image{asset, hotspot, crop}` và dùng builder (hoặc `object-position` từ hotspot), hoặc tắt `hotspot` để editor không tưởng nó hoạt động. Ràng buộc `cdn.sanity.io` của zod vẫn dùng được nếu lấy URL từ builder.
- **Alt:** mẫu chính thức là thêm `fields: [{name: 'alt', type: 'string', validation: custom}]` và chỉ bắt buộc khi có asset. Template làm bằng `context.document?.coverImage?.asset?._ref`, chỉ đúng với trường cấp cao nhất; **trong item của mảng phải dùng `context.parent`** (repo đã làm đúng). Validator có thể trả `warning()` nếu không muốn chặn publish ([Image type §Validation](https://www.sanity.io/docs/studio/image-type): `assetRequired()`, `custom`, `warning`).
- **Hướng dẫn chính thức về alt chỉ ở mức khuyến nghị.** Không có trang chuẩn về ảnh trang trí hay độ dài alt; chỉ có mẹo "Make sure your images have alt text" trong trang "Preview and page building" của Sanity Docs (không xác minh được URL chính xác của trang này; mức khuyến nghị) và ví dụ ảnh có alt trong [Overlays and click-to-edit](https://www.sanity.io/docs/visual-editing/visual-editing-overlays). Phần "ảnh không lộ mặt người" là quy tắc riêng của repo (`PRODUCT.md`), không phải của Sanity.
- **`media.credit`: tôi không tìm thấy trường hay tuỳ chọn này trên kiểu `image`.** Có `creditLine` trên **tài liệu asset** (ví dụ "John Doe by Instragram" trong [Asset Source API](https://www.sanity.io/docs/studio/asset-source-api-reference)) và mẫu aspect Media Library có `altText` và `creditLine`. Nếu cần ghi nguồn ảnh, giữ thiết kế `image.credit` của spec 2026-10-09 (đối tượng riêng của repo). Đây là UNVERIFIED với cụm "media.credit" nếu nó ám chỉ thứ khác.

### 3.5 Preview và Draft Mode

Căn cứ: [Perspectives](https://www.sanity.io/docs/content-lake/perspectives), [Presenting and previewing content §Best practice](https://www.sanity.io/docs/content-lake/presenting-and-previewing-content), [Visual Editing with Next.js App Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router), [Sanity Live with Next.js Cache Components](https://www.sanity.io/docs/nextjs/cache-components), [Caching and revalidation in Next.js](https://www.sanity.io/docs/nextjs/caching-and-revalidation-in-nextjs), `node_modules/next/dist/docs/01-app/02-guides/draft-mode.md` (next@16.3.8).

- **"Preview" trong tiêu chí của #8 gần như chắc chắn là kết quả đã publish hiển thị trên bản preview/staging** ("Publish thay đổi … phản ánh đúng trên preview"), không phải xem bản nháp chưa publish. Với ý đó, repo đã đủ: `perspective: "published"`, ISR `revalidate = 3600`, và `POST /api/revalidate` có secret. Việc còn lại là kiểm tra webhook Sanity trỏ vào `/api/revalidate` trên staging; nếu không, thay đổi có thể trễ tới một giờ (mục 4).
- **Draft Mode là đường chính thức cho nội dung chưa publish**, không bắt buộc cho #8. Khuyến nghị chính thức: "In your production environment, queries use the `published` perspective. In preview environments, queries use the `drafts` perspective". Perspective `drafts` trước đây gọi là `previewDrafts`; "They both work, but … you should transition to `drafts`". Dùng `drafts` phải đặt `useCdn: false`.
- Với Next.js: `next-sanity` v13 cung cấp `defineLive` (`next-sanity/live`), `defineEnableDraftMode` (`next-sanity/draft-mode`) và `VisualEditing` (`next-sanity/visual-editing`); các export này có trong `node_modules/next-sanity/package.json` ở bản 13.3.4. Hướng dẫn yêu cầu next-sanity ≥ 13.1.5 và Presentation tool trong `sanity.config.ts` (`sanity/presentation` có trong `sanity@6.17.0`). Repo hiện chưa có `defineLive`, route `/api/draft-mode/enable`, Presentation tool hay `serverToken`. Next.js 16 mô tả Draft Mode là cookie bỏ qua cache cho riêng editor.
- **Trong template chính thức:** `frontend/sanity/lib/client.ts` đặt `perspective: 'published'`, `useCdn: true`; `live.ts` dùng `defineLive` với `serverToken`/`browserToken` (commit `2ad95bf`).
- Chi phí nếu bật sau này: thay `fetchRecords` bằng `sanityFetch` của `defineLive` ("If you're using `defineLive`… you probably don't need" cách cache thủ công), bỏ `next: { revalidate }` thủ công, và thêm token đọc cho `serverToken`. Không nên làm trong PR #8.

### 3.6 Khi nào singleton + mảng object, khi nào document riêng; giới hạn

Căn cứ: [Deciding on fields and relationships](https://www.sanity.io/docs/developer-guides/deciding-fields-and-relationships), [Connected content](https://www.sanity.io/docs/studio/connected-content), [Attribute limit §Use arrays for page building](https://www.sanity.io/docs/content-lake/attribute-limit), [Technical limits §Documents](https://www.sanity.io/docs/content-lake/technical-limits), [Array type §Limitations](https://www.sanity.io/docs/studio/array-type).

- Quy tắc từ hướng dẫn chính thức: "We could build a fixed array of subscription plans containing the small and large sizes we need. But using a document type is better in this case as it lets CandiCorp add more plans … later on." Tức là **mảng cố định cho tập đóng, document type cho tập mở**. Ba nhóm của `/services` thuộc về tập đóng. Liệu pháp (`treatment`) là tập mở nên đúng là document riêng được tham chiếu, đúng thiết kế hiện tại.
- Tham chiếu hay nhúng: nhúng khi nội dung chỉ thuộc một ngữ cảnh (copy của nhóm), tham chiếu khi dùng lại hoặc cần toàn vẹn (liệu pháp có trang riêng). [Connected content](https://www.sanity.io/docs/studio/connected-content) nói reference luôn trỏ tới document và Content Lake giữ toàn vẹn.
- `_key`: mỗi item object trong mảng có `_key` ổn định để "one user edit an array item while another user simultaneously reorders the array" (Array type). Seed bằng script phải tự đặt `_key`.
- Giới hạn: tối đa 32 MB mỗi document JSON, 1.000 thuộc tính mỗi document (gói Free/Growth), độ sâu tối đa 20; "arrays may not currently contain arrays"; một mảng không trộn object với kiểu nguyên thủy. Tôi ước lượng ba nhóm × khoảng 35 giá trị lá = khoảng 105, rất xa giới hạn; cách đếm thuộc tính theo document chưa xác minh (mục 4).
- Trang "Attribute limit" khuyên dùng mảng để dựng trang (ít thuộc tính duy nhất hơn so với nhân đôi trường).

## 4. Không xác minh được / cần thử trên staging

1. **`document.singletons` có ổn định không.** Beta trong 6.17.0 (changelog + d.ts); không thấy dấu hiệu ổn định ở 6.18.0. Quyết định hiện tại: giữ cách thủ công.
2. **Khi mở singleton chưa tồn tại, `initialValue` cấp mảng (với `_type` từng item) có được ghi vào draft ngay hay chỉ sau lần sửa đầu**, và lỗi `required`/`custom` có hiện ngay không.
3. **Strong reference có chặn Unpublish treatment đang được nhóm tham chiếu không** (tài liệu chỉ nói chặn Delete và chặn publish document tham chiếu khi đích chưa publish). Ảnh hưởng đến Task 6 bước 3.
4. **GROQ:** (a) `treatments[defined(@->slug.current)]->{...}` có parse và cho kết quả như mong đợi; (b) `array::compact(treatments[]->{...})` khi `treatments` là `null`; (c) `*[_id == "servicesPage"][0].groups[defined(group)]{...}` với `coalesce(..., [])` ngoài cùng. Thử trong Vision.
5. **Trạng thái kẹt:** `disableActions: ["add","remove","duplicate"]` cộng `readOnly` theo `value` có để lại đường sửa cho editor khi tài liệu hỏng không, và Discard changes có đủ.
6. **Webhook Sanity → `/api/revalidate` trên staging** đã được cấu hình với `SANITY_REVALIDATE_SECRET`? Không có thì tiêu chí "phản ánh trên preview" có thể trễ tới 3600 giây.
7. **Nghĩa của "preview" trong #8** là suy ra từ câu chữ tiêu chí; cần owner xác nhận nếu muốn bản nháp.
8. **Cách đếm thuộc tính theo document** (giới hạn 1.000): chỉ ước lượng.
9. **`media.credit`**: không tìm thấy trong tài liệu `image`; `creditLine` thuộc asset document.
10. **Ghi hai editor cùng lúc trên một singleton:** tài liệu nói thao tác theo `_key` an toàn, nhưng chưa thử với ảnh, reference và thay đổi thứ tự đồng thời.
11. **Studio chặn Publish khi validator mảng lỗi** đã được tài liệu mô tả ("these will block the draft from being published"), nhưng thông điệp lỗi theo `path: [{_key}]` trên item trong mảng chưa nhìn thấy trong giao diện.
12. **Seed bằng `--missing` ở ID đã publish:** chưa chạy; kiểm tra Studio hiển thị đúng trạng thái "published, không có draft" và Publish tiếp theo hoạt động.

## 5. Hệ quả cho repo

### 5.1 Schema đề xuất

`sanity/schemaTypes/index.ts`: bỏ document `service`, `order`, validator `getClient` (và import `apiVersion` nếu không còn dùng, để lint không báo), thêm hai type dưới đây và đăng ký `serviceGroup`, `servicesPage` trong `schemaTypes`.

```ts
const serviceGroup = defineType({
  name: "serviceGroup",
  title: "Nhóm dịch vụ",
  type: "object",
  fields: [
    defineField({
      name: "group",
      title: "Nhóm",
      type: "string",
      options: { list: serviceGroups, layout: "radio" },
      readOnly: ({ value }) => Boolean(value),
      validation: (rule) => rule.required(),
    }),
    // title (required), shortTitle, summary (required), body (required), bullets: giữ nguyên như document service hiện tại
    defineField({
      name: "image",
      title: "Ảnh",
      type: "image",
      options: { hotspot: true }, // chỉ giữ nếu query lấy hotspot/crop (3.4)
      fields: [/* alt: custom theo context.parent, như hiện tại */],
    }),
    // treatments: mảng reference strong, options.filter + disableNew + rule.unique() (3.3)
  ],
  preview: { select: { title: "title", subtitle: "group", media: "image" } },
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
      initialValue: [
        { _type: "serviceGroup", group: "therapy" },
        { _type: "serviceGroup", group: "training" },
        { _type: "serviceGroup", group: "recovery" },
      ],
      validation: (rule) => rule.required().custom(validateServiceGroups),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Trang Dịch vụ" }) },
});
```

`slug` và `seo` của từng `service` không được trang `/services` dùng (không có route chi tiết, `createMetadata` ở trang là cố định), nên A bỏ chúng; chỉ giữ `seo` ở cấp trang nếu muốn.

Đặt `validateServiceGroups` (mục 3.1) trong một file riêng, ví dụ `sanity/serviceGroups.ts`, để vitest import được mà không kéo cả Studio.

### 5.2 Truy vấn GROQ

```groq
coalesce(
  *[_id == "servicesPage"][0].groups[defined(group)]{
    group,
    title,
    shortTitle,
    summary,
    body,
    bullets,
    "image": image.asset->url,
    "imageAlt": image.alt,
    "treatments": coalesce(array::compact(treatments[]->{ "slug": slug.current, title }), [])
  },
  []
)
```

Ghi chú: thứ tự mảng chính là thứ tự hiển thị nên không còn `order(order asc)`; `_id == "servicesPage"` thay cho `_type == "servicesPage"` của template để chỉ đọc đúng document cố định; xem mục 4 về việc phải thử trong Vision.

### 5.3 `sanity.config.ts`

Mở rộng cách thủ công đang dùng, không cần chuyển sang API beta:

```ts
const singletonTypes = new Set(["siteSettings", "servicesPage"]);
// trong structure, sau mục siteSettings:
S.listItem()
  .title("Trang Dịch vụ")
  .id("servicesPage")
  .child(S.document().schemaType("servicesPage").documentId("servicesPage")),
```

`newDocumentOptions` và allowlist `document.actions` hiện đã lọc theo `singletonTypes`, nên chỉ cần thêm tên vào tập. Đồng thời cân nhắc `document.productionUrl`/Presentation chỉ khi bật Draft Mode (3.5), chưa cần cho #8.

### 5.4 Code đã viết sẽ đổi thế nào

- `lib/sanity.ts` `getServices`: thay chuỗi GROQ bằng 5.2; vì truy vấn đã `coalesce(..., [])`, mảng luôn hợp lệ nhưng **vẫn nên chịu được `null`** (`fetchRecords` ném lỗi nếu không phải mảng, test bằng `fetch.mockResolvedValue(null)` để chứng minh `/services` không vỡ). Vẫn giữ dedupe theo `group`, lọc nhóm sai và lọc `null` của zod (lớp bảo vệ vì validation chỉ chạy trong Studio). `serviceSchema` bỏ `...record` (yêu cầu `slug`), chỉ cần `title`; `Service` trong `lib/content.ts` bỏ hoặc để tuỳ chọn `slug` (grep cho thấy `app/services/page.tsx` không dùng).
- `tests/services-sanity.test.tsx`: đổi test đầu ("asks Sanity for services in editor order") sang kiểm tra truy vấn chứa `_id == "servicesPage"` và `groups`; thêm test `null` → `[]`. Các test dedupe, ảnh fallback, bỏ reference `null`, render trang và booking vẫn đúng vì dạng kết quả (mảng nhóm phẳng) không đổi. Thêm test thuần cho `validateServiceGroups` (đủ ba nhóm, trùng, thiếu, nhóm lạ, mảng `undefined`).
- `tests/services-fallback.test.ts`: không đổi (đường fallback chạy khi `projectId === "missing-project-id"`).
- Kế hoạch `docs/superpowers/plans/2026-10-11-services-sanity-cta.md`: Task 6 bước 1 đổi thành "mở `Trang Dịch vụ`, điền nội dung ba nhóm, Publish" (một document thay vì ba); bước 3 đổi "unpublish treatment" thành "gỡ reference"; Task 7 (seed) thành `sanity documents create --missing servicesPage.json` với `_id: "servicesPage"` (không chấm), mỗi item có `_key`, `treatments` chỉ thêm sau khi biết `_ref`.
- Tài liệu spec 2026-10-09 (mục 6) nên bỏ ID dạng `treatment.<slug>` hoặc ghi rõ rủi ro "ID chứa dấu chấm không công khai được"; dùng `treatment-<slug>`.
- Tồn tại quyết định chưa được chốt: nếu singleton thiếu nhóm (hoặc chưa tồn tại) thì `/services` rỗng (hành vi hiện tại, "dataset đã cấu hình là nguồn duy nhất") hay bù theo nhóm từ `lib/content.ts`. Giữ hành vi hiện tại cho tới khi owner quyết, vì validation Studio và seed sẽ bảo đảm đủ nhóm.
