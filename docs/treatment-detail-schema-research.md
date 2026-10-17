# Schema Sanity và JSON-LD cho trang chi tiết liệu pháp `/treatments/[slug]` (#10)

Ngày 2026-10-13. Phạm vi: chọn cách chỉnh schema `treatment` trong Sanity để editor nhập đúng và trang không vỡ khi thiếu dữ liệu, và chọn structured data (schema.org JSON-LD) nên phát ra trên trang chi tiết, kèm ánh xạ từ trường Sanity. Tài liệu này nối tiếp [`methods-schema-research.md`](methods-schema-research.md) (#9) và [`services-schema-research.md`](services-schema-research.md) (#8). Những điều đã nghiên cứu ở đó (`initialValue`/`_key`, `disableActions`, `unique()` so sánh sâu, `readOnly` callback, singleton, seed `--missing`, strong reference, GROQ `->`/`array::compact`, `hotspot` không tác dụng khi query chỉ lấy URL) chỉ được nhắc khi khác. Issue #10 không có JSON-LD trong tiêu chí nghiệm thu; phần JSON-LD dưới đây là đề xuất follow-up, không phải điều kiện đóng #10.

Phiên bản (khớp `package-lock.json`, đã đối chiếu `node_modules` của worktree `kyoto`): `sanity` 6.17.0, `@sanity/types` 6.17.0, `@sanity/validation` 6.17.0, `next-sanity` 13.3.4, `next` 16.3.8, `zod` 4.6.5; `speakingurl` 14.0.1 (phụ thuộc của `sanity`, dùng cho slugify). Từ vựng schema.org: V30.1 (2026-09-16), tải `schemaorg-current-https.jsonld` ngày 2026-10-13.

Nguồn: tài liệu sanity.io/docs (bản `.md` của chính trang), repo `sanity-io/orderable-document-list` (đọc qua `gh api`), d.ts và bundle trong `node_modules`; schema.org (trang type chính thức); developers.google.com/search/docs (đọc ngày 2026-10-13); tài liệu Next.js trong `node_modules/next/dist/docs`; MDN. Mọi câu đặt trong dấu ngoặc kép đã được kiểm lại từ văn bản thô tải về (trừ thông báo của validator lấy từ thử nghiệm và chuỗi đề xuất của tôi). Không dùng blog, answers hay StackOverflow. Ngoài ra có ba thứ do tôi tạo ra: (1) truy vấn chỉ-đọc vào API công khai của dataset `production` ngày 2026-10-13; (2) hai script thử `validateDocument` với schema mẫu (không đụng schema thật); (3) script tự viết kiểm từng thuộc tính JSON-LD ví dụ với từ vựng V30.1. Cả ba nằm ngoài repo (`/tmp`), không phải thay thế cho công cụ chính thức. Điều không kiểm chứng được nằm ở mục 5.

Hiện trạng đọc từ repo: `sanity/schemaTypes/index.ts:7-58` (`seo`, `image`, `protocolStep`), `:353-410` (`treatment`), `lib/sanity.ts:84-120` (`treatmentSchema`), `:177-183` (`getTreatments`), `lib/content.ts:3-22` (`ProtocolStep`, `Treatment`), `:275-331` (bản dự phòng), `lib/seo.ts`, `app/treatments/[slug]/page.tsx`, `tests/sanity.test.ts`, các thay đổi chưa commit trên `issue-10` (`git diff`; số dòng trong tài liệu tính trên cây làm việc đã gồm diff này, nên `page.tsx:50/59/97` không khớp `main`), `PRODUCT.md`, `docs/CONTENT_INVENTORY.md`, `docs/MIGRATION.md`, `scripts/migrate-legacy.mjs`.

## 1. Kết luận ngắn

**Schema: chọn A + C, hoãn B.** Vá nhỏ schema `treatment` (A), bỏ trường `step` để dùng thứ tự mảng (C), chưa thêm nhóm trường "đối tượng / lưu ý / FAQ" (B) cho tới khi owner và người có chuyên môn duyệt. **JSON-LD: một khối `@graph` gồm `WebPage` + `Service`** (thêm `BreadcrumbList` chỉ khi trang có breadcrumb hiển thị), `provider` là `LocalBusiness` viết thẳng trong khối. Không dùng `MedicalProcedure`/`MedicalTherapy`/`PhysicalTherapy`, không `HowTo`, không `FAQPage`, không `offers`, không `aggregateRating`.

Sáu điều quyết định:

1. **Dữ liệu production nặng ký hơn lý thuyết (mục 3.1).** Dataset production công khai và có 3 liệu pháp, cả ba đều có `price` (99, 149000, 99000), không cái nào có `alt`, `seo.title`/`seo.description` toàn tiếng Anh và có tuyên bố lợi ích (ví dụ "boosts immunity" ở `cold-plunge`), mô tả có cụm "lợi ích sức khỏe đã được chứng minh", `benefits` có "Tăng cường hệ miễn dịch" và "An toàn và ít tác dụng phụ". Hai nhóm cần tách. (a) Thân trang: `main` đã render `description` và `benefits` (`git show HEAD:app/treatments/[slug]/page.tsx` dòng 42, 67), nên các chuỗi vượt ngoài nội dung đã duyệt (xem 3.1) nằm ở mã đã commit; tôi không kiểm xem bản production đang chạy có hiển thị chúng hay không. Nên duyệt ngay. (b) Diff `issue-10` mới đưa `seo.*` lên `<title>`, mô tả, OG và thêm khối `protocols`; nên duyệt trước khi merge diff. Việc duyệt không phụ thuộc chuyện có JSON-LD hay không.
2. **`price` công khai qua API dù UI không hiển thị (mục 3.6).** Giấu trên Studio không giấu dữ liệu. Khuyến nghị: bỏ `price` khỏi GROQ/zod/`Treatment`, đặt trường `readOnly` + `deprecated`, và để owner quyết `unset` giá trị hiện có. JSON-LD không đọc `price`, test ghim điều đó.
3. **Chọn `Service`, không chọn `Medical*` (mục 3.10).** `MedicalProcedure` và các con của nó không có `provider`, `offers`, `areaServed`, `availableChannel` (đã kiểm từ từ vựng V30.1), còn định nghĩa `PhysicalTherapy` là "aimed at improving a health condition", mâu thuẫn quy tắc không tuyên bố kết quả. Google không có rich result nào cho `Service` hay `Medical*`, nên chọn type hẹp hơn cũng không đem lại lợi ích tìm kiếm.
4. **Không đánh dấu `protocols` là `HowTo`, không phát `FAQPage` (mục 3.10).** Google gỡ tài liệu How-to ngày 2023-09-14 và ngừng hiển thị FAQ rich result từ 2026-05-07 (tài liệu bị gỡ 2026-06-15). Thêm nữa `HowTo` là hướng dẫn người đọc tự thực hiện để đạt kết quả, không phải quy trình của chuyên viên.
5. **Bỏ `step` (C) vì rủi ro có thật, chi phí thấp (mục 3.5).** `rule.unique()` không bắt hai bước cùng `step` khác tiêu đề (đã thử), trang dùng `key={protocol.step}`, và ở 3/3 liệu pháp production thứ tự mảng đã trùng thứ tự `step` nên chuyển sang thứ tự mảng không đổi gì trên màn hình.
6. **Tích hợp nhỏ (mục 3.12-3.13):** một hàm thuần `lib/treatment-jsonld.ts`, một thẻ `<script type="application/ld+json">` trong `page.tsx` (server component), `<` thay bằng `<` như docs Next.js yêu cầu. Cần xuất `siteUrl` từ `lib/seo.ts` (đang lặp ở ba nơi).

Quyết định cần owner (đầy đủ ở mục 6): duyệt nội dung production; số phận trường `price`; loại `provider` (mặc định `LocalBusiness` cho tới khi có bằng chứng giấy phép); có thêm breadcrumb hiển thị không; có làm B không.

## 2. So sánh

Bảng 1: ba hướng cho schema.

| Tiêu chí                | A. Giữ schema, vá nhỏ                                                                               | B. Thêm nhóm trường nội dung (đối tượng / lưu ý / FAQ)                           | C. Bỏ `step`, dùng thứ tự mảng                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Phạm vi                 | Slug regex, `alt` bắt buộc khi có ảnh, `warning` cho trường nên có, SEO `warning`, `price` readOnly | Thêm 2-4 trường, có thể thêm `groups`                                            | Xoá `step`, đổi key và số thứ tự hiển thị                               |
| Rủi ro nội dung y khoa  | Không                                                                                               | **Cao** với chống chỉ định/lưu ý (thiếu hoặc sai là gây hại); trung bình với FAQ | Không                                                                   |
| Đụng dữ liệu production | Không bắt buộc; `alt` thiếu ở 3/3 nên editor phải điền khi sửa lần tới                              | Không (trường mới tuỳ chọn)                                                      | Có: `unset` `step` ở 3 tài liệu (nên làm sau khi code đã bỏ qua `step`) |
| Chi phí code            | Thấp: schema + 1-2 test `validateDocument`                                                          | Vừa: GROQ, zod, UI, test, nội dung duyệt                                         | Thấp: bỏ sort, `key={_key}`, số = `index + 1`                           |
| Lợi ích                 | Bắt lỗi nhập; hết "slug viết hoa/có khoảng trắng lọt qua"                                           | Trang "đủ" hơn cho người đọc                                                     | Hết `step` trùng/nhảy số; kéo thả là cách sắp xếp duy nhất              |
| Hạn chế                 | Không sửa được `step` trùng                                                                         | Không có lợi ích tìm kiếm (FAQ rich result đã ngừng); cần duyệt chuyên môn       | Preview của item không hiển thị số thứ tự (`prepare` không nhận index)  |
| Khuyến nghị             | **Làm**                                                                                             | **Hoãn**, bật từng trường khi có người duyệt                                     | **Làm cùng A**                                                          |

Bảng 2: type schema.org cho trang chi tiết (định nghĩa trích từ trang type, đọc 2026-10-13, V30.1).

| Type                               | Có `provider`, `offers`, `areaServed`, `availableChannel` | Ngụ ý                                                                                                                 | Đánh giá                                                                        |
| ---------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Service`                          | Có đủ bốn thuộc tính                                      | "A service provided by an organization, e.g. delivery service, print services, etc."; trung tính về y khoa            | **Chọn**                                                                        |
| `MedicalProcedure`                 | Không (27 thuộc tính, không có bốn thuộc tính này)        | "A process of care used in either a diagnostic, therapeutic, preventive or palliative capacity ..."                   | Loại: thuộc tính `howPerformed`, `followup`, `bodyLocation` mời nội dung y khoa |
| `MedicalTherapy`/`PhysicalTherapy` | Không                                                     | `PhysicalTherapy`: "A process of progressive physical care and rehabilitation aimed at improving a health condition." | Loại: đóng khung cold plunge, hồng ngoại như điều trị bệnh                      |
| `MedicalWebPage`                   | Không áp dụng (là trang)                                  | "A web page that provides medical information."                                                                       | Loại; `lastReviewed`/`reviewedBy` có sẵn ở `WebPage`                            |
| `WebPage` + `mainEntity`           | Không áp dụng                                             | Trang mô tả thực thể chính                                                                                            | **Chọn** làm khung                                                              |
| `HowTo`                            | Không áp dụng                                             | "Instructions that explain how to achieve a result by performing a sequence of steps."                                | Loại (mục 3.10)                                                                 |
| `FAQPage`                          | Không áp dụng                                             | "A FAQPage is a WebPage presenting one or more "Frequently asked questions" ..."                                      | Loại (mục 3.10)                                                                 |
| `LocalBusiness` (provider)         | Không áp dụng                                             | Cơ sở; con `HealthAndBeautyBusiness`, `MedicalBusiness` (con: `MedicalClinic`, `Physiotherapy`)                       | `LocalBusiness` mặc định; con y khoa là quyết định owner (mục 3.10)             |

## 3. Phát hiện theo từng chủ đề

### 3.1 Dữ liệu production ngày 2026-10-13

Truy vấn GROQ chỉ-đọc vào `https://yjzexxml.apicdn.sanity.io/v2025-01-01/data/query/production` (không cần token, vì `docs/SERVICES_VERIFICATION.md` đã ghi dataset công khai). Kết quả: 3 tài liệu `treatment` đã publish (`_updatedAt` 2026-08-31), 0 `post`, 5 `faq` cấp site.

| slug          | title          | `price` | `image.alt` | `seo.title` (độ dài GROQ) | `seo.description` | `benefits` | `protocols` (`step`) |
| ------------- | -------------- | ------- | ----------- | ------------------------- | ----------------- | ---------- | -------------------- |
| `heat-light`  | Đèn hồng ngoại | 99      | thiếu       | 59, tiếng Anh             | 137, tiếng Anh    | 4          | 6 (1..6)             |
| `cold-plunge` | Ngâm lạnh      | 149000  | thiếu       | 45, tiếng Anh             | 148, tiếng Anh    | 4          | 7 (1..7)             |
| `cupping`     | Giác hơi       | 99000   | thiếu       | 51, tiếng Anh             | 150, tiếng Anh    | 5          | 7 (1..7)             |

Hệ quả:

- **`price` tồn tại và công khai**, đơn vị không nhất quán (99 so với 149000), gợi ý dữ liệu chưa được rà soát. Trang không render nó: `grep` trong `app/` và `components/` không thấy chỗ đọc `price`; nó chỉ được lấy ở `lib/sanity.ts:180` và khai báo ở `lib/content.ts:18`.
- **`alt` thiếu ở 3/3**: trang hiện rơi về `treatment.title` (`app/treatments/[slug]/page.tsx:59`). Không có `post` nào, nên nâng chuẩn `alt` ở khối `image` dùng chung không ảnh hưởng ai.
- **SEO CMS là bản của site cũ**: tiếng Anh, trong khi `lang="vi"`, và có cụm như "boosts immunity" (`cold-plunge`). Diff hiện tại (`page.tsx:18-21`) làm chúng thành `<title>`, mô tả và OG của ba trang. Tiêu đề còn bị thêm hậu tố `" | HolisticVN"` (13 ký tự, `app/layout.tsx:41`).
- **Thân trang có tuyên bố cần duyệt.** Phân biệt hai loại. Chuỗi vượt ngoài hàng 24 của `docs/CONTENT_INVENTORY.md` ("Positioning and benefit claims", owner duyệt cụm như "giảm viêm, giảm sưng", "hỗ trợ quá trình tự chữa lành") và không thấy ở chỗ nào khác của tệp đó (đã `grep`): mô tả `heat-light` có "lợi ích sức khỏe đã được chứng minh"; `benefits` của `cold-plunge` có "Tăng cường hệ miễn dịch", của `cupping` có "An toàn và ít tác dụng phụ"; bước 1 của `cold-plunge` là "Kiểm tra y lệnh điều trị, vị trí và thời gian điều trị." (trong khi `PRODUCT.md` mô tả quy trình là yêu cầu gọi lại tới nhân viên); toàn bộ `seo.*` tiếng Anh. Chuỗi có thể trùng tinh thần với hàng 24, như "Giảm đau và viêm" hay "Hỗ trợ phục hồi": owner xác nhận lại. Hàng 22 nói nội dung `/treatments` theo bảng giá của owner nhưng không nói có bao gồm văn bản chi tiết trong CMS hay không. `description` và `benefits` đã được `main` render từ trước diff; `seo.*` và `protocols` là phần diff mới đưa lên trang. Bản dự phòng ở `lib/content.ts:275-331` đã được viết lại thận trọng hơn nhưng chỉ dùng khi chưa cấu hình Sanity.
- **Chuỗi `\n` literal**: `description` của `cold-plunge` và `cupping` mỗi cái chứa hai chuỗi ký tự `\` `n` thật (không phải xuống dòng), tức trang `<p>{treatment.description}</p>` (`page.tsx:50`) sẽ in "\n\n" ra màn hình. Suy ra từ dữ liệu và mã, chưa xem trang đã render.
- **Thứ tự và `step`**: cả ba tài liệu có `step` liên tục 1..n và thứ tự mảng trùng thứ tự `step`.
- **Liên kết**: `methodsPage` đã trỏ `cupping`, `cold-plunge`, `heat-light`; `servicesPage` trỏ `cupping` và `heat-light`, `cold-plunge`. `dry-needling`, `iastm` chỉ có ở bản dự phòng.

### 3.2 `slug`

Căn cứ: [Slug](https://www.sanity.io/docs/studio/slug-type); d.ts `@sanity/types/lib/index.d.ts:1503-1509` (`SlugOptions`: `source`, `maxLength`, `slugify`, `isUnique`), `:690` (`SlugIsUniqueValidator`).

- `maxLength`: "Maximum number of characters the slug may contain when generating it from a source (like a title field) with the default slugify function. Defaults to 200. If you include your own slugify function, or manually enter your slug this option will be ignored." Vậy nó chỉ giới hạn ký tự sinh tự động, không chặn gõ tay.
- **Gõ tay lọt qua `required()`**: thử `validateDocument` với `slug.current = "Giác Hơi"` (viết hoa, có khoảng trắng, có dấu) cho kết quả hợp lệ. Cần một `custom` kiểm `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Ba slug production (`cupping`, `cold-plunge`, `heat-light`) đều thoả.
- **Slugify mặc định xử lý tiếng Việt**: `PerspectiveProvider-qJFIbsuW.js:29025-29031` gọi `speakingurl` với `truncate` 200 và `symbols: true`; chạy `speakingurl` 14.0.1 đã cài cho kết quả `Đèn hồng ngoại` -> `den-hong-ngoai`, `Giác hơi` -> `giac-hoi`, và `&` -> `and` (tiếng Anh). Slug production là tiếng Anh nên đặt tay, không sinh từ `title` tiếng Việt: mô tả trường phải nói rõ.
- **`isUnique` mặc định đủ dùng**: "By default, `isUnique` checks for uniqueness among documents of the same type that hold the slug at the same field path." Chỉ có một type có route `/treatments/`, nên không cần `isUnique` tuỳ biến (khác ví dụ "across all documents" trong doc).
- **Đổi slug đổi URL**: `docs/MIGRATION.md:8` yêu cầu redirect vĩnh viễn trong `next.config.ts` cho path đổi. Reference trong `methodsPage`/`servicesPage` theo `_ref` nên vẫn đúng, nhưng liên kết ngoài và trang đã lập chỉ mục thì không. Ghi cảnh báo này vào `description` của trường; không cần khoá `readOnly`.

```ts
defineField({
  name: "slug",
  title: "URL slug",
  description: "Chữ thường không dấu, nối bằng gạch ngang. Đổi slug đổi URL, cần redirect 301.",
  type: "slug",
  options: { source: "title", maxLength: 96 },
  validation: (rule) => [
    rule.required(),
    rule.custom((slug) =>
      !slug?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current)
        ? true
        : "Chỉ dùng a-z, 0-9 và dấu gạch ngang.",
    ),
  ],
}),
```

### 3.3 Ảnh và `alt`

Căn cứ: [Image](https://www.sanity.io/docs/studio/image-type), [Validation](https://www.sanity.io/docs/studio/validation) ("You can also access the closest `parent` from the context"), d.ts `:522-527` (`ValidationContext.parent`), `:1464` (`assetRequired`).

- Khối `image` dùng chung (`sanity/schemaTypes/index.ts:28-34`) có trường `alt` không validation, và được `post` dùng (`:432`). Bản bắt buộc-khi-có-ảnh đã có ở `serviceGroup` (`:150-157`) và `methodGroup`. Nên rút thành một hằng `imageWithAlt` dùng chung cho `treatment`, `post`, `serviceGroup`, `methodGroup` thay vì thêm bản sao thứ tư.
- **`context.parent` đúng cho ảnh cấp cao nhất**: parent của `alt` chính là object ảnh. Thử `validateDocument`: có `asset` mà không `alt` cho lỗi tại `image.alt`; có `alt` thì qua; không `asset` và không `alt` thì qua (ảnh tuỳ chọn). Không cần `context.document`.
- `assetRequired()` không dùng vì ảnh tuỳ chọn ("Must be used together with required").
- **Mức độ**: dùng `error` (quy tắc chung của repo), kèm điền `alt` cho ba liệu pháp production khi sửa lần tới. Nếu muốn không khoá việc sửa nội dung khác, dùng `warning` trong một đợt rồi nâng lên.
- **`hotspot`**: `GROQ` chỉ lấy `image.asset->url` nên `hotspot: true` không tác dụng ở frontend (cùng kết luận `services-schema-research.md` 3.4). Giữ hoặc tắt là việc của issue riêng.
- **`ogImage` và `alt`**: OG không cần `alt`; bỏ qua (YAGNI). Điều đáng làm hơn là kích thước: [Image transformations](https://www.sanity.io/docs/apis-and-sdks/image-urls) nói URL gốc "If you fetch this, you will be served the original asset" và khuyên "pin the format with `fm`" cho thẻ metadata, ví dụ `?w=1200&h=630&fit=crop&fm=jpg`. Hiện `createMetadata` truyền URL gốc (`lib/seo.ts`, diff). Nên thêm tham số khi host là `cdn.sanity.io` (thay đổi mã, chưa thử với trình thu thập mạng xã hội).

### 3.4 Mô tả: `text` hay Portable Text

- Giữ `text`. Portable Text ([Block](https://www.sanity.io/docs/studio/block-type)) cần thêm projection, bộ render (`next-sanity` đã re-export `PortableText` từ `@portabletext/react` ^7.0.1, `node_modules/next-sanity/package.json:61`), chuyển sang văn bản thuần cho JSON-LD, và mở thêm bề mặt định dạng/liên kết mà ba liệu pháp hiện tại không cần.
- **Vấn đề thật là xuống dòng**: dữ liệu có `\n` literal (mục 3.1) và trang in một `<p>`. Sửa tối thiểu: migration thay `\n` literal bằng xuống dòng thật ở hai tài liệu, và trang tách đoạn theo dòng trống. Chưa thử.
- `shortDescription` chỉ dùng làm mô tả meta dự phòng (`page.tsx:19`), không hiển thị trên trang chi tiết. `isPopular` không được trang nào đọc. Cả hai giữ nguyên, không thêm việc.
- `benefits` (mảng `string`): thêm `rule.unique().error()` vì trang dùng `key={benefit}` (`page.tsx:81`) và `rule.max(8).warning()`. `unique()` trên chuỗi so khớp nguyên văn.

### 3.5 `protocols`, thứ tự bước và `step`

Căn cứ: [Array type](https://www.sanity.io/docs/studio/array-type) ("Does a deep comparison, only excluding the _key property when comparing objects."), d.ts `:802` (`sortable`), `:714-718` (`PrepareViewOptions` chỉ có `ordering`), [orderable-document-list](https://github.com/sanity-io/orderable-document-list).

Rủi ro của `step` thủ công, đã thử bằng `validateDocument` trên schema mẫu có `unique()`:

| Trường hợp                        | Kết quả `validateDocument`             |
| --------------------------------- | -------------------------------------- |
| Hai bước cùng `step` khác tiêu đề | **Hợp lệ** (`unique()` không bắt)      |
| Hai bước giống hệt, khác `_key`   | Lỗi "Can't be a duplicate"             |
| `step` nhảy số 1, 3               | **Hợp lệ**; trang hiện "01", "03"      |
| `step` = 1.5                      | Lỗi "Must be an integer" (`integer()`) |

Kéo theo: `<li key={protocol.step}>` (`page.tsx:97`) sinh key trùng; sắp theo `step` với bước trùng thì thứ tự giữa chúng không xác định; `protocolStepSchema` (`lib/sanity.ts:85-89`) bỏ `_key` nên không có khoá ổn định để dùng thay.

`orderRankField` không giải bài toán này. README của plugin: "Drag-and-drop Document Ordering without leaving the Editing surface", với ghi chú "The ability to only sort across _all_ Documents of a `type`" và "The `name` of the `orderRank` field is constant". Nó sắp **tài liệu** cùng type, không sắp phần tử trong mảng; plugin lại nằm trong monorepo `sanity-io/plugins` (2.0.27) và chưa cài ở đây. Thứ tự giữa các liệu pháp cũng không cần: nó đã do mảng `treatments` trong `methodsPage`/`servicesPage` quyết định; `order(title asc)` (`lib/sanity.ts:180`) chỉ phục vụ `generateStaticParams` và sitemap.

**Phương án C**, bỏ `step`:

- Schema: xoá trường `step`; số hiển thị = `index + 1`; key = `_key` (zod giữ `_key`). Mảng giữ `sortable` mặc định `true` để kéo thả.
- Hạn chế: preview của item không hiện số (`prepare` không nhận chỉ số); editor thấy số qua thứ tự trực quan.
- **Thứ tự triển khai (mở rộng rồi thu hẹp)**: (1) triển khai mã bỏ qua `step` và dùng thứ tự mảng. Vì ba tài liệu production có thứ tự mảng trùng `step`, bước này không đổi hiển thị; (2) `unset` `protocols[].step` ở ba tài liệu; (3) triển khai schema không còn `step`. Nếu làm (3) trước (2), Studio có thể báo trường lạ ở dữ liệu cũ: chưa thử, nên đặt đúng thứ tự trên.
- **Tham chiếu migration**: `scripts/migrate-legacy.mjs` là bước chuyển NDJSON ngoại tuyến, giữ nguyên `_id` ("IDs stay intact so references and draft/published pairs stay connected", dòng 28) và không ghi vào dataset. Cho `unset`, hoặc dùng cùng khuôn NDJSON (xuất, biến đổi, nhập lại) hoặc `client.patch(id).unset([...])` với đường dẫn theo `_key` (tài liệu patch đã trích ở `methods-schema-research.md` 3.10). Chưa chạy cả hai; nên xuất bản sao trước (`production-before-seed.json` là tiền lệ ở #8) và chạy thử trên `staging`.
- Nếu owner muốn giữ `step`: thêm `rule.custom` cấp mảng kiểm `step` duy nhất và liên tục, trả lỗi theo `_key` (khuôn `validateGroupSet` ở `methods-schema-research.md` 3.1). Tốn hơn C mà lợi ích ít hơn.

### 3.6 `price`

- **Công khai**: ba giá trị đang nằm trong dataset đọc được không cần token (mục 3.1). `hidden: true` chỉ giấu trên Studio. Tài liệu validation: "The `context.hidden` property indicates whether the field is hidden by a condition on itself or an ancestor", nghĩa là trường ẩn vẫn bị validate nếu không `rule.skip()`; thử với `readOnly` + `deprecated` cũng vẫn báo lỗi `min(0)` khi giá trị âm.
- `deprecated` có trong d.ts (`:2125`, `:2503`, `DeprecatedProperty { reason }`); changelog Studio v3.26.0: "This can be used to gently steer Studio users towards updated schemas or to phase out legacy fields without abrupt changes."
- Khuyến nghị theo mức:

| Mức                              | Việc                                                                                                                                                                  | Cần owner |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1. Ngừng kéo dữ liệu về frontend | Bỏ `price` khỏi GROQ (`lib/sanity.ts:180`), zod (`:98`), `Treatment` (`lib/content.ts:18`); test truyền `price: 500000` và khẳng định không có trong HTML lẫn JSON-LD | Không     |
| 2. Chặn nhập mới                 | `readOnly: true` + `deprecated: { reason: "Giá chưa được owner xác nhận để đăng. Không nhập." }`                                                                      | Không     |
| 3. Gỡ giá trị đã có (`unset`)    | Xoá 3 giá trị khỏi dataset công khai                                                                                                                                  | **Có**    |

- Nếu sau này owner xác nhận giá để đăng thì `offers` khi đó cần `priceCurrency: "VND"` và phải khớp giá hiển thị trên trang (quy tắc "Don't mark up content that is not visible to readers of the page."). Chưa có, nên `offers` bị bỏ.

### 3.7 Khối `seo`

- `seo.title` dùng `rule.max(60)` và `seo.description` `rule.max(160)` (`sanity/schemaTypes/index.ts:16,23`). Mặc định: "values that do not pass the validation rules are considered errors - these will block the draft from being published". Hai con số này là quy ước thường gặp; **tôi không có nguồn chính thức của Google hay Sanity cho 60/160 trong những trang đã đọc**, nên không gán chúng cho Google. Khuyến nghị đổi thành `.warning()`: "Warnings do not prevent publishing."
- **Cách đếm**: Studio đếm theo đơn vị UTF-16 (thử: 60 emoji, mỗi cái 2 đơn vị, bị cảnh báo; "ệ" dạng dựng sẵn 60 ký tự thì qua; cùng chữ ở dạng tổ hợp NFD thì 3 đơn vị mỗi chữ nên bị cảnh báo). Khớp ghi chú ở `services-schema-research.md` mục 4 (follow-up 2026-10-12). Với tiếng Việt, đây là cảnh báo gần đúng chứ không phải phép đo độ dài hiển thị.
- Hậu tố `" | HolisticVN"` (`app/layout.tsx:40-42`) cộng thêm 13 ký tự, nên 60 ký tự CMS thành 73 ký tự hiển thị. Ba giá trị production hiện 45-59 ký tự (độ dài GROQ).
- Mô tả trường nên nói rõ chuỗi dự phòng (bỏ trống thì dùng `title` và `shortDescription`, như `page.tsx:18-19`).
- `ogImage` có `hotspot: true` nhưng query chỉ lấy URL; xem 3.3.

### 3.8 Cấu trúc form, cảnh báo, `preview`, `initialValue`

- **`groups`/`fieldsets`**: form `treatment` có 11 trường, thêm vài trường vẫn ngắn. Chỉ cần `groups: [{ name: "seo", title: "SEO" }]` và `group: "seo"` cho trường `seo` (đúng ví dụ doc [Field groups](https://www.sanity.io/docs/studio/field-groups), có `default: true` nếu muốn nhóm mặc định). `fieldsets` không cần. **Chưa kiểm chứng**: lỗi/cảnh báo của trường nằm ở tab không đang mở có hiện trên tab hay không; doc Field groups không nói. Nên để nhóm nội dung chính ở tab mặc định để cảnh báo thiếu trường không bị khuất.
- **Cảnh báo thiếu trường khuyến nghị**: `rule.required().warning("...")` hoạt động đúng: thử cho `duration` thiếu cho marker mức `warning`; `benefits` rỗng với `rule.min(1).warning()` cũng vậy. Danh sách nên dùng: `shortDescription`, `description`, `duration`, `image`, `benefits`, `protocols`. Bài test phải đọc `markers[].level` chứ không đọc `status`: trong thử nghiệm `validateDocument(...).status` là `"failed"` kể cả khi chỉ có cảnh báo. Test hiện có ở `tests/methods-schema.test.ts` trả về `status` cùng `messages`; trường hợp có cảnh báo cần đọc `markers[].level`.
- **`preview`**: hiện `title`/`subtitle: shortDescription`/`media: image` (`index.ts:409`). Nên đổi `subtitle` thành `slug.current` kèm cờ thiếu (ví dụ "thiếu ảnh") qua `prepare`; `select` hỗ trợ đường dẫn có dấu chấm ([Previews](https://www.sanity.io/docs/studio/previews-list-views)).
- **`initialValue`**: đã có `isPopular: false`. Không thêm `initialValue` cho mảng `protocols`/`benefits`.
- **Structure**: `treatment` là type nhiều tài liệu nên giữ trong `S.documentTypeListItems()`; không singleton.

### 3.9 Trường còn thiếu cho trang "đủ"

| Trường                                            | Có cần thật không                                             | Rủi ro nội dung y khoa                                    | UI                          | JSON-LD                                                           | Mức                          |
| ------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------- | ---------------------------- |
| `image.alt` (đã có)                               | Có: 3/3 đang thiếu                                            | Không                                                     | `alt` của hero              | Không                                                             | **Tối thiểu**                |
| Slug regex, `warning` thiếu trường, SEO `warning` | Có                                                            | Không                                                     | -                           | `url`                                                             | **Tối thiểu**                |
| Nội dung duyệt lại ba liệu pháp production        | Có (mục 3.1)                                                  | **Cao**                                                   | Toàn trang                  | `Service.description`                                             | **Tối thiểu, owner quyết**   |
| `lastReviewed` (ngày) + dòng hiển thị             | Chỉ nếu có quy trình duyệt thật                               | Trung bình: tuyên bố "đã rà soát" không có thật           | "Nội dung rà soát lần cuối" | `WebPage.lastReviewed` (có trên `WebPage`)                        | Mở rộng, owner               |
| `reviewedBy`                                      | Không                                                         | Cao: cần danh tính/chứng chỉ chưa xác nhận (`PRODUCT.md`) | -                           | Không                                                             | Bỏ                           |
| "Dành cho ai" (`audience`, văn bản ngắn)          | Chưa                                                          | Trung bình-cao                                            | Một khối                    | `Service.audience` chỉ khi có `Audience` đã duyệt                 | Mở rộng, owner + chuyên môn  |
| "Lưu ý / chống chỉ định" (`cautions`)             | Chưa                                                          | **Cao**: thiếu hoặc sai là gây hại                        | Một khối                    | Không ánh xạ (`contraindication` thuộc `MedicalTherapy`, đã loại) | Mở rộng, người có chuyên môn |
| FAQ theo liệu pháp                                | Chưa                                                          | Trung bình ("có đau không", "có tác dụng phụ không")      | Accordion                   | Không (bỏ `FAQPage`)                                              | Mở rộng, owner               |
| Liệu pháp liên quan                               | Không thêm trường                                             | Thấp                                                      | Danh sách liên kết          | Không                                                             | Hoãn                         |
| Thứ tự hiển thị                                   | Không (mảng trong `methodsPage`/`servicesPage` đã quyết định) | -                                                         | -                           | -                                                                 | Không                        |

- **FAQ**: `faq` (`index.ts:470-488`) là type cấp site, 5 tài liệu production, `getFaqs` (`lib/sanity.ts`) không được trang nào gọi. Nếu làm FAQ theo liệu pháp, tái dùng bằng mảng reference `faq` thay vì tạo type nhúng thứ hai.
- **Liệu pháp liên quan, không cần trường mới**: truy vấn suy ra từ nhóm đã chạy thật trên production (chỉ-đọc, 2026-10-13) cho `heat-light`: `*[_type=="treatment" && slug.current==$slug][0]{title,"related":*[_id=="servicesPage"][0].groups[references(^._id)][0].treatments[@._ref != ^._id]->{"slug":slug.current,title}}` trả `cold-plunge`. Với 3 liệu pháp, giá trị gần như bằng không; ghi lại để khỏi thêm trường.
- Chống chỉ định là trường rủi ro cao nhất trong các trường đề xuất. Nếu cần nhắc an toàn trước khi có nội dung duyệt, dùng một câu cố định trong mẫu trang, không qua CMS.

### 3.10 schema.org và Google: type nào, có gì được hỗ trợ

Nguồn: trang type trên schema.org (V30.1, đọc 2026-10-13) và các trang Search Central đọc cùng ngày: [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) (cập nhật 2026-07-10), [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) (2026-09-08), [Local business](https://developers.google.com/search/docs/appearance/structured-data/local-business) (2026-09-08), [Review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) (2026-09-08), [Documentation updates](https://developers.google.com/search/updates) (cập nhật 2026-10-08), [Optimizing for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (2026-07-10), [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) (2026-10-05).

**Google chỉ cho rich result với một số feature**: danh mục "All structured data features" có Breadcrumb, Local business, Organization, Review snippet..., không có `Service` hay `Medical*`. Vậy JSON-LD cho `Service` chỉ giúp hiểu trang, không mở rich result nào; "Google does not guarantee that your structured data will show up in search results". Google còn nói: "Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add." Quy mô đầu tư nên tương xứng: một khối nhỏ, không mở rộng theo mốt.

**Quy tắc áp dụng** (General guidelines): "Don't mark up content that is not visible to readers of the page."; "Don't use structured data to deceive or mislead users."; "Try to use the most specific applicable type and property names defined by schema.org for your markup."; JSON-LD "(recommended)". Ngoài ra có nhắc tới nội dung sức khoẻ: "our systems give even more weight to content that aligns with strong E-E-A-T for topics that could significantly impact the health," (Creating helpful content), tức nội dung y khoa là vùng bị soi kỹ hơn. Tôi không tìm thấy chính sách structured data riêng cho y tế ngoài hạn chế đã gỡ của FAQ (bên dưới).

**`HowTo` cho `protocols`: không.**

- Ngày 2023-09-14, mục Documentation updates ghi: "Removed the How-to structured data documentation , as this rich result is no longer shown in search results, on both desktop and mobile devices." Hiện danh mục feature không có How-to; trang `.../structured-data/how-to` chuyển hướng về `/search/updates` (kiểm ngày 2026-10-13).
- Schema.org vẫn giữ type: "Instructions that explain how to achieve a result by performing a sequence of steps." Nhưng `protocols` là các bước chuyên viên thực hiện trong buổi, không phải hướng dẫn tự làm; gắn `HowTo` là gán "kết quả" mà site cố ý không hứa, và trái ví dụ về độ liên quan ("A woodworking site labeling instructions as recipes"). Danh sách `<ol>` hiển thị trên trang đã đủ về ngữ nghĩa.

**`FAQPage`: không phát.** Ngày 2023-09-14 Google cập nhật tài liệu FAQ: "the feature is only shown for well-known, authoritative government and health websites." Ngày 2026-05-08: "This feature will no longer appear in Google Search starting May 7, 2026." Ngày 2026-06-15: "The FAQ rich result feature is no longer shown in Google Search results, as announced in the changelog entry in May 2026." và tài liệu bị gỡ. Trang `.../faqpage` cũng chuyển hướng về `/search/updates`.

**`aggregateRating`/`review`: không gắn vào liệu pháp.** Điểm 5.0 và 645 đánh giá là của cơ sở trên Google Maps (`reviewSummary`, `lib/content.ts:128-132`), không phải của từng liệu pháp. Google còn ghi: "If the entity that's being reviewed controls the reviews about itself, their pages that use LocalBusiness or any other type of Organization structured data are ineligible for star review feature." và nêu trực tiếp trường hợp nhúng "Google Business reviews or Facebook reviews widget".

**`provider`, `areaServed`, `availableChannel`, `offers`:**

| Thuộc tính         | Quyết định                     | Lý do                                                                                                                                                                              |
| ------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provider`         | Có, `LocalBusiness` viết thẳng | Repo chưa có nút Organization/LocalBusiness toàn site (`grep` không thấy JSON-LD); `@id` tham chiếu sẽ treo. Nhúng đủ `name`, `url`, `telephone`, `address` đang hiển thị ở footer |
| `areaServed`       | Bỏ                             | Địa chỉ trong `provider.address` đã nói nơi phục vụ; thêm vùng dễ ngụ ý dịch vụ tận nơi                                                                                            |
| `availableChannel` | Bỏ                             | `ServiceChannel` gợi ý kênh đăng ký trực tuyến; `/booking` chỉ gửi yêu cầu gọi lại tới nhân viên, không có đặt lịch tự động                                                        |
| `offers`           | Bỏ                             | Chưa có giá được owner xác nhận; trang không hiển thị giá                                                                                                                          |
| `potentialAction`  | Bỏ                             | `ReserveAction` ngụ ý đặt lịch tự động                                                                                                                                             |

**Loại cơ sở (`provider`)**: `Physiotherapy` ("The practice of treatment of disease, injury, or deformity by physical methods such as massage, heat treatment, and exercise rather than by drugs or surgery.") và `MedicalClinic` ("A facility, often associated with a hospital or medical school, that is devoted to the specific diagnosis and/or healthcare.") ngụ ý tư cách cơ sở y tế; `PRODUCT.md` ghi chứng chỉ nhân sự chưa xác nhận và repo không có giấy phép hoạt động. Google khuyên dùng "the most specific LocalBusiness sub-type possible", nhưng cũng cần đúng sự thật. Mặc định `LocalBusiness`; nâng lên `Physiotherapy` hoặc `HealthAndBeautyBusiness` khi owner xác nhận loại hình. Đây là quyết định của owner.

**`BreadcrumbList`**: Google yêu cầu tối thiểu hai `ListItem`, mục cuối không cần `item` ("If the breadcrumb is the last item in the breadcrumb trail", `item` không bắt buộc), và "This feature is available on desktop in all regions and languages where Google Search is available." Trang hiện **không có breadcrumb hiển thị**, chỉ có liên kết "← Tất cả liệu pháp" (`page.tsx:45-47`), trong khi menu gọi `/treatments` là "Phương pháp" (`components/holistic-nav.tsx:14`). Gắn `BreadcrumbList` mà không có breadcrumb thấy được đi ngược nguyên tắc "không đánh dấu nội dung không hiển thị". Hai lựa chọn: thêm breadcrumb hiển thị (kèm quyết định tên nhãn) hoặc bỏ nút này. Ví dụ dưới đây có nút, ghi rõ điều kiện.

### 3.11 Ánh xạ Sanity sang JSON-LD và ví dụ

| JSON-LD                                 | Nguồn              | Quy tắc                                                                                                               |
| --------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `WebPage.url`, `Service.url`            | `slug`             | `new URL("/treatments/" + slug, siteUrl)`, trùng `canonical` ở `generateMetadata`                                     |
| `WebPage.name`, `Service.name`          | `title`            | Đúng chữ ở `<h1>`, không dùng `seo.title`                                                                             |
| `inLanguage`                            | hằng `"vi"`        | BCP 47; `<html lang="vi">`                                                                                            |
| `isPartOf`                              | hằng               | `WebSite` viết thẳng (`name` "HolisticVN", `url` gốc)                                                                 |
| `Service.description`                   | `description`      | Chỉ khi có chữ; đúng đoạn đang hiển thị, không dùng `shortDescription`/`seo.description` (không có trong thân trang)  |
| `Service.image`                         | `image` (ảnh hero) | Chỉ khi hero có ảnh; chuyển đường dẫn tương đối `/images/...` thành URL tuyệt đối; không dùng `seo.ogImage`           |
| `Service.provider`                      | hằng cơ sở         | `LocalBusiness` viết thẳng; `telephone` suy từ `site.phone`; `address` từ giá trị đã xác nhận, không bịa `postalCode` |
| `WebPage.breadcrumb` + `BreadcrumbList` | `slug`, `title`    | Chỉ khi có breadcrumb hiển thị                                                                                        |
| `duration`, `benefits`, `protocols`     | -                  | Không ánh xạ: `Service` không có thuộc tính tương ứng, `benefits` là tuyên bố lợi ích                                 |
| `price`                                 | -                  | Không bao giờ                                                                                                         |
| `lastReviewed`                          | (trường mở rộng)   | Chỉ khi có trường và dòng hiển thị                                                                                    |

Hai ví dụ dưới đây do hàm mẫu trong `/tmp` sinh ra từ dữ liệu có thật của bản dự phòng (`cupping`) và một tài liệu CMS chỉ có `slug`+`title` (`iastm`); cả hai được kiểm thuộc tính với từ vựng V30.1 (mục 3.14). `cupping` mẫu không dùng `seo` vì bản dự phòng không có. Địa chỉ viết đúng như `site.address`, giữ "P. Xóm Chiếu" nguyên văn.

Liệu pháp đủ dữ liệu (`cupping`):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://holisticvn.com/treatments/cupping#webpage",
      "url": "https://holisticvn.com/treatments/cupping",
      "name": "Cupping Therapy",
      "inLanguage": "vi",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://holisticvn.com/#website",
        "url": "https://holisticvn.com",
        "name": "HolisticVN"
      },
      "breadcrumb": { "@id": "https://holisticvn.com/treatments/cupping#breadcrumb" },
      "mainEntity": { "@id": "https://holisticvn.com/treatments/cupping#service" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://holisticvn.com/treatments/cupping#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Trang chủ",
          "item": "https://holisticvn.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Phương pháp",
          "item": "https://holisticvn.com/treatments"
        },
        { "@type": "ListItem", "position": 3, "name": "Cupping Therapy" }
      ]
    },
    {
      "@type": "Service",
      "@id": "https://holisticvn.com/treatments/cupping#service",
      "name": "Cupping Therapy",
      "url": "https://holisticvn.com/treatments/cupping",
      "description": "Liệu pháp áp lực âm được sử dụng có mục tiêu, phù hợp trong lộ trình hồi phục và chăm sóc cơ thể sau vận động.",
      "image": "https://holisticvn.com/images/Cupping.jpg",
      "provider": {
        "@type": "LocalBusiness",
        "@id": "https://holisticvn.com/#clinic",
        "name": "HolisticVN",
        "url": "https://holisticvn.com",
        "telephone": "+84828959598",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "109/15 Lê Quốc Hưng",
          "addressLocality": "P. Xóm Chiếu",
          "addressRegion": "TP. Hồ Chí Minh",
          "addressCountry": "VN"
        }
      }
    }
  ]
}
```

Liệu pháp thiếu optional (trạng thái giả định: tài liệu CMS `iastm`, vốn chưa có trên production, chỉ có `slug` và `title`; `price: 500000` có trong đầu vào nhưng không xuất hiện; không có `description`, `image`):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://holisticvn.com/treatments/iastm#webpage",
      "url": "https://holisticvn.com/treatments/iastm",
      "name": "IASTM",
      "inLanguage": "vi",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://holisticvn.com/#website",
        "url": "https://holisticvn.com",
        "name": "HolisticVN"
      },
      "breadcrumb": { "@id": "https://holisticvn.com/treatments/iastm#breadcrumb" },
      "mainEntity": { "@id": "https://holisticvn.com/treatments/iastm#service" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://holisticvn.com/treatments/iastm#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Trang chủ",
          "item": "https://holisticvn.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Phương pháp",
          "item": "https://holisticvn.com/treatments"
        },
        { "@type": "ListItem", "position": 3, "name": "IASTM" }
      ]
    },
    {
      "@type": "Service",
      "@id": "https://holisticvn.com/treatments/iastm#service",
      "name": "IASTM",
      "url": "https://holisticvn.com/treatments/iastm",
      "provider": {
        "@type": "LocalBusiness",
        "@id": "https://holisticvn.com/#clinic",
        "name": "HolisticVN",
        "url": "https://holisticvn.com",
        "telephone": "+84828959598",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "109/15 Lê Quốc Hưng",
          "addressLocality": "P. Xóm Chiếu",
          "addressRegion": "TP. Hồ Chí Minh",
          "addressCountry": "VN"
        }
      }
    }
  ]
}
```

(Nếu không có breadcrumb hiển thị thì cả hai ví dụ bỏ nút `BreadcrumbList` và khoá `breadcrumb` của `WebPage`.)

### 3.12 Nhúng JSON-LD trong Next.js 16.3.8 (App Router)

Đã đọc `node_modules/next/dist/docs/01-app/02-guides/json-ld.md` và `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`.

- **Cách làm**: "Our current recommendation for JSON-LD is to render structured data as a `<script>` tag in your `layout.js` or `page.js` components." Ví dụ (`json-ld.md:15-41`) đặt `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />` bên trong phần tử bao của một `page` async. Với repo: đặt trong `app/treatments/[slug]/page.tsx`, ngay trong `<main id="main">`.
- **Chống XSS**: "The following snippet uses `JSON.stringify`, which does not sanitize malicious strings used in XSS injection." Cách chữa của docs là thay `<` bằng `<`. Chuỗi trong JSON-LD đến từ Sanity (editor), nên vẫn phải thay. Thử mẫu: tiêu đề `</script><script>alert(1)</script>` sau khi thay không còn chuỗi `</script` trong khối, và `JSON.parse` trả lại đúng tiêu đề gốc.
- **Không dùng `next/script`**: "The `next/script` component is optimized for loading and executing JavaScript. Since JSON-LD is structured data, not executable code, a native `<script>` tag is the right choice here."
- **CSP**: `next.config.ts:22` có `script-src 'self' 'unsafe-inline' ...` và không có nonce theo yêu cầu. Khối `application/ld+json` là khối dữ liệu: theo MDN (`<script type>`), với giá trị kiểu khác "The embedded content is treated as a data block, and won't be processed by the browser." nên không cần nonce. Không kiểm bằng trình duyệt thật.
- **Tương tác với `generateMetadata`**: độc lập. Metadata ra `<head>`, JSON-LD ra thân trang. Docs nêu `fetch` được memoize giữa `generateMetadata`, `generateStaticParams`, layout, page, và React `cache` dùng được khi không có `fetch`; `getTreatments` đã bọc `cache` (`lib/sanity.ts:177`) nên không gọi Sanity thêm. Để `name`/URL không lệch nhau, dùng chung một hàm dựng URL (xuất `siteUrl` từ `lib/seo.ts`; hiện lặp ở `lib/seo.ts:3`, `app/layout.tsx:38`, `app/sitemap.ts:8`).
- **Thời điểm sinh**: trang có `generateStaticParams` và `revalidate = 3600` (`page.tsx:8-12`), nên JSON-LD nằm trong HTML tĩnh/ISR, không cần JavaScript. Google: "If the rendered HTML contains the structured data, Google Search will be able to process it."
- **Không thêm `schema-dts`**: docs gợi ý như gói cộng đồng, chưa cài; một `Record<string, unknown>` cùng test đủ cho khối nhỏ này.

### 3.13 Hàm thuần `lib/treatment-jsonld.ts` (chỉ phác, không ghi vào repo)

```ts
import type { Treatment } from "@/lib/content";

export function treatmentJsonLd(
  treatment: Treatment,
  siteUrl: string,
): Record<string, unknown> | null;
export const serializeJsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
```

Quy tắc:

1. Trả `null` nếu `slug` hoặc `title` rỗng sau `trim()`; page không phát thẻ `<script>` khi `null`.
2. Bỏ khoá khi giá trị là `undefined`, `null`, chuỗi rỗng sau `trim()`; xử lý đệ quy một lần cuối, không để khoá rỗng nào lọt ra.
3. Chỉ đọc `slug`, `title`, `description`, `image`. **Không đọc** `price`, `benefits`, `protocols`, `duration`, `shortDescription`, `seo.*`.
4. `image`: tuyệt đối hoá bằng `new URL(image, siteUrl)`; chỉ khi trang thật sự hiển thị ảnh (cùng điều kiện `treatment.image` ở `page.tsx`).
5. Hằng của cơ sở (tên, URL, điện thoại, địa chỉ) lấy từ `lib/content.ts`: thêm một đối tượng `siteAddress` có các phần đã tách (`streetAddress`, `addressLocality`, `addressRegion`, `addressCountry`) cạnh `site`, đừng tách chuỗi `site.address` bằng `split`. `telephone`: bỏ ký tự không phải số, đổi số 0 đầu thành `+84` (giả định số Việt Nam, owner xác nhận).
6. Không có nhánh cho `offers`, `aggregateRating`, `review`, `HowTo`, `FAQPage`, `potentialAction`.

### 3.14 Xác thực: công cụ nào kiểm được gì

- **Rich Results Test** (`search.google.com/test/rich-results`): chỉ kiểm các feature Google hỗ trợ (ở đây là `BreadcrumbList`, và `LocalBusiness` nếu được nhận dạng). Trang Generate with JavaScript nói: "If you are testing a structured data type that is not supported by the Rich Results test, check the rendered HTML." Với `WebPage` và `Service`, bước kiểm là đọc HTML đã render.
- **Schema Markup Validator** (`validator.schema.org`): kiểm cú pháp và từ vựng schema.org tổng quát, không nói gì về điều kiện rich result của Google.
- **Tôi không chạy được cả hai**: cả hai cần trình duyệt, và trang production chưa có khối JSON-LD để kiểm bằng URL; lấy `validator.schema.org` bằng `curl` chỉ trả vỏ giao diện. Thay vào đó tôi chạy script tự viết kiểm từng thuộc tính của hai ví dụ với `schemaorg-current-https.jsonld` V30.1: mọi thuộc tính thuộc đúng type (hoặc tổ tiên), mọi giá trị object khớp `rangeIncludes`. Script chỉ gắn cờ `ListItem.item` dạng chuỗi URL (từ vựng ghi `Thing`); đó là dạng mà tài liệu Breadcrumb của Google dùng ở ví dụ, nên chấp nhận. Script cũng xác nhận `MedicalProcedure` và `PhysicalTherapy` không có `provider`, `offers`, `areaServed`, `availableChannel`, còn `Service` có. Đây là kiểm tra từ vựng, không thay thế hai công cụ trên.

## 4. Test và xác minh đề xuất

Chạy bằng vitest hiện có, không cần Studio hay mạng (trừ dòng cuối).

| Test                                         | Sao từ                               | Nội dung chính                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/treatment-jsonld.test.ts` (hàm thuần) | mẫu `tests/sanity.test.ts`           | Đủ dữ liệu: khớp ví dụ 3.11; thiếu optional: không còn khoá rỗng; `slug`/`title` rỗng trả `null`; `price: 500000`, `benefits`, `protocols` không xuất hiện; không có chuỗi `offers`, `HowTo`, `FAQPage`, `aggregateRating`; tiêu đề `</script>` được thay `<` và `JSON.parse` trả lại nguyên văn; URL tuyệt đối; ảnh tương đối thành tuyệt đối |
| `tests/sanity.test.ts` (mở rộng)             | khối `treatment detail page` hiện có | HTML của `TreatmentPage` có đúng một thẻ `script[type="application/ld+json"]` parse được; thiếu `title`/`slug` không phát thẻ; truyền `price` không xuất hiện ở HTML lẫn JSON-LD; `description` trong JSON-LD bằng đoạn hiển thị                                                                                                               |
| `tests/treatment-schema.test.ts` (mới)       | `tests/methods-schema.test.ts`       | Dùng `validateDocument` như hai file kia nhưng **đọc `markers[].level`**: slug viết hoa/khoảng trắng lỗi; có `asset` thiếu `alt` lỗi, không `asset` thì qua; SEO quá dài ra `warning` và không phải `error`; trường nên có thiếu ra `warning`; `price` có `readOnly` và `deprecated`                                                           |
| `tests/sanity.test.ts` (nếu làm C)           | `orders protocol steps...` hiện có   | Bước theo thứ tự mảng; `step` trong dữ liệu bị bỏ qua; key theo `_key`; trộn có và không có `step` vẫn đúng thứ tự mảng                                                                                                                                                                                                                        |
| Kiểm tay trên staging (cần quyền)            | `docs/SERVICES_VERIFICATION.md`      | Mở một liệu pháp có ảnh không `alt` thấy lỗi tại `image.alt`; xem HTML thật của trang đã triển khai; chạy Rich Results Test và Schema Markup Validator với URL staging; chạy `unset` `step` trên staging trước production                                                                                                                      |

## 5. Điều chưa kiểm chứng

1. **Rich Results Test và Schema Markup Validator**: không chạy được (mục 3.14).
2. **Nút `BreadcrumbList` khi không có breadcrumb hiển thị**: quy tắc "Don't mark up content that is not visible" gợi ý không nên; không có nguồn nói liên kết "← Tất cả liệu pháp" có thoả hay không. Owner quyết.
3. **Cảnh báo ở tab `groups` không mở** có hiện trên tab không: Field groups doc không nói; chưa thử trong Studio.
4. **Studio khi gặp trường `step` còn dữ liệu nhưng schema đã bỏ**: chưa thử; vì vậy thứ tự triển khai ở 3.5 đặt `unset` trước khi xoá trường.
5. **`unset` `protocols[]._key.step` và NDJSON import**: chưa chạy, chưa thử trên `staging`.
6. **Hiển thị `\n` literal ở trang đã render**: suy ra từ dữ liệu và mã (`page.tsx:50`), chưa xem trang.
7. **Con số 60/160**: không có nguồn chính thức trong những trang đã đọc; chỉ là quy ước. Cách Google hiển thị `<title>` dài không được kiểm.
8. **Loại cơ sở và giấy phép**: repo không có bằng chứng về giấy phép hoạt động; `LocalBusiness` mặc định là lựa chọn thận trọng, không phải khẳng định.
9. **Đơn vị `price`** (99 so với 149000): không biết ý định của người nhập; không suy diễn.
10. **Trình thu thập mạng xã hội với tham số ảnh** (`w`, `h`, `fit`, `fm`): chỉ theo tài liệu Image transformations, chưa thử.
11. **Số điện thoại E.164**: `+84828959598` suy từ `082 895 9598` theo quy tắc bỏ 0 đầu; chưa đối chiếu với nguồn nào khác.
12. **Cách Google dùng `Service`/`WebPage`**: không có trang chính thức nêu nó được đọc ra sao ngoài lời "no special schema.org markup" và guideline chung; không khẳng định lợi ích xếp hạng.
13. **Phạm vi truy vấn production**: chỉ ba tài liệu `treatment` đã publish đọc được qua API công khai; bản nháp không thấy.

## 6. Câu hỏi cho owner

1. **Duyệt nội dung 3 liệu pháp production** (mục 3.1): tuyên bố "đã được chứng minh", "Tăng cường hệ miễn dịch", "An toàn và ít tác dụng phụ", bước "Kiểm tra y lệnh điều trị", cùng SEO tiếng Anh. Viết lại, hay cho giữ? Phần thân trang nên duyệt sớm vì `main` đã render; phần SEO và `protocols` phải xong trước khi merge diff `issue-10`.
2. **`price`**: đồng ý bỏ khỏi frontend và khoá nhập (mức 1-2)? `unset` ba giá trị khỏi dataset công khai (mức 3)? Nếu có giá chính thức để đăng thì định dạng nào, đơn vị nào?
3. **Loại `provider`**: giữ `LocalBusiness`, hay có bằng chứng về giấy phép để dùng `Physiotherapy`/`HealthAndBeautyBusiness`?
4. **Breadcrumb hiển thị**: thêm (nhãn "Phương pháp" hay "Liệu pháp"?) để bật `BreadcrumbList`, hay bỏ nút này?
5. **C (bỏ `step`)**: đồng ý, và cho chạy `unset` trên staging rồi production sau khi có bản sao dự phòng?
6. **Làm B** (đối tượng, lưu ý/chống chỉ định, FAQ theo liệu pháp, `lastReviewed`): ai là người duyệt nội dung có chuyên môn, và khi nào? Nếu chưa có người thì hoãn.
7. **`alt` cho 3 ảnh production**: ai viết và khi nào (ảnh không lộ mặt người theo quy tắc `PRODUCT.md`)?
8. **Số điện thoại / địa chỉ** dùng trong `provider`: xác nhận quy tắc +84 và việc giữ "P. Xóm Chiếu" nguyên văn.
9. **Có làm JSON-LD ngay** hay để follow-up sau khi #10 đóng (khuyến nghị: follow-up, vì tiêu chí #10 không yêu cầu)?
