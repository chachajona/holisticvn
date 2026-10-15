# Đa ngôn ngữ (vi/en) cho trang chi tiết liệu pháp `/treatments/[slug]` và schema Sanity `treatment` (#10)

Ngày 2026-10-13. Phạm vi: nếu HolisticVN thêm tiếng Anh (`en`) bên cạnh tiếng Việt (`vi`), trang `/treatments/[slug]` và document `treatment` nên ra sao, và hệ quả lên `servicesPage`/`methodsPage`, form lead, sitemap, SEO/metadata, JSON-LD, revalidate. Nối tiếp [`treatment-detail-schema-research.md`](treatment-detail-schema-research.md) (schema và JSON-LD, không lặp lại), [`methods-schema-research.md`](methods-schema-research.md), [`services-schema-research.md`](services-schema-research.md). Tài liệu này không sửa mã sản phẩm.

Phiên bản repo (khớp `package-lock.json`): `sanity` 6.17.0, `next` 16.3.8, `next-sanity` 13.3.4, `react`/`react-dom` 19.3.0, `zod` 4.6.5, `styled-components` 6.5.3. Plugin (npm registry, đọc 2026-10-13, chưa cài vào repo): `@sanity/document-internationalization` 6.2.41, `sanity-plugin-internationalized-array` 5.3.4, `@sanity/language-filter` 5.0.21. Schema.org V30.1.

Nguồn (đọc 2026-10-13): [Localization](https://www.sanity.io/docs/studio/localization.md) (bản `.md`); README, `docs/`, `CHANGELOG.md`, `package.json` và source của hai plugin trong `sanity-io/plugins` (qua `gh api`); npm registry (`npm view`); `node_modules/next/dist/docs/` (đường dẫn ở 3.4); developers.google.com/search/docs; schema.org; ogp.me; MDN (`lang`, `Intl.NumberFormat`); đặc tả JSON-LD (`w3c/json-ld-syntax`, qua `gh api`). Mọi câu trong ngoặc kép đã `grep` lại từ bản thô tải về (chuẩn hoá khoảng trắng). Không dùng blog, answers hay StackOverflow. Ngoài ra có bốn thứ tôi tự chạy, đều nằm ngoài repo (`/tmp`) và không thay thế công cụ chính thức: (1) `npm install --package-lock-only` trong thư mục sạch để xem phân giải peer; (2) vài truy vấn GROQ chỉ-đọc vào dataset `production` công khai; (3) vitest với `@sanity/schema`/`@sanity/validation` 6.17.0 để biên dịch và validate schema đề xuất, cùng zod và hàm chọn bản dịch ở mục 4; (4) `Intl.NumberFormat` trên Node 24.21.0 (ICU 78.3). Điều không kiểm chứng được nằm ở mục 7.

## 1. Kết luận ngắn

**Trong #10: chỉ làm mức 1 (phương án C): thêm `englishTitle` tùy chọn và cờ `requiresCertifiedPractitioner`, không routing `/en`, không plugin.** Khi owner quyết định có bản tiếng Anh thật, **ưu tiên phương án B2: giữ nguyên các trường `vi` hiện có và thêm một object `en` cùng tài liệu**, không dùng `@sanity/document-internationalization` cho `treatment`.

Sáu điều quyết định:

1. **Chưa có gì để dịch ngoài tên và mô tả.** Owner chỉ cung cấp tên, mô tả, giá bằng cả hai ngôn ngữ (bảng giá). Toàn bộ chữ của giao diện (nav, footer, form, thông báo lỗi, tiêu đề "Điều bạn có thể mong đợi") đang là tiếng Việt cứng và chưa có bản tiếng Anh do owner duyệt (3.1, 3.6). Một trang `/en/treatments/cupping` với phần thân tiếng Anh nhưng khung tiếng Việt đi ngược lời khuyên Google: "You can help Google determine the language correctly by using a single language for content and navigation on each page" (3.5).
2. **Theo tiêu chí chính thức của Sanity, `treatment` nghiêng về field-level.** Trang Localization ghi document-level là "Best for documents that have unique, language-specific fields and no common content across languages" và field-level là "Best for documents that have a mix of language-specific and common fields". `treatment` dùng chung `slug`, `price`, `image`, `isPopular`, `requiresCertifiedPractitioner` và chỉ khác nhau ở chữ. Với document-level, `price` bị nhân bản vào mỗi bản ngôn ngữ và có nguy cơ lệch (3.2).
3. **Document-level (A) làm đổi nhiều thứ nhất mà lợi ích ít nhất ở quy mô này:** 11 liệu pháp thành 22 document cộng 11 `translation.metadata`; `servicesPage`/`methodsPage` vẫn trỏ về bản `vi`, nên danh sách liên kết trên trang tiếng Anh cần thêm một phép nối GROQ qua `translation.metadata` (3.2); slug trùng giữa hai bản bị chặn bởi `isUnique` mặc định (3.3); bản dịch mới được tạo bằng cách nhân bản cả nội dung tiếng Việt (3.2).
4. **B2 không cần migration dữ liệu và không đụng strong reference.** Ba document production (`cupping`, `cold-plunge`, `heat-light`) giữ nguyên `_id`, các trường `vi` và sáu tham chiếu trong `servicesPage`/`methodsPage`. Chỉ thêm trường `en` (tùy chọn). Nếu #10 làm `englishTitle` thì chuyển sang `en.title` là một lệnh `patch` cho tối đa 11 document (mục 5).
5. **Routing là phần tốn nhất của mức 2, không phải schema.** Hiện `app/layout.tsx:49` đặt cứng `<html lang="vi">`; có 15 tệp chứa đường dẫn nội bộ viết cứng; chưa có `proxy.ts`. Hai cách có tài liệu chính thức (3.4): `app/[lang]` (đụng mọi tệp trong `app/`), hoặc route group với hai root layout (giữ URL tiếng Việt, chỉ thêm cây `en/`).
6. **Không dùng dịch tự động.** Mọi chữ tiếng Anh phải do owner cung cấp (bảng giá). Google nói "It is critical to manually factcheck and review all AI-generated content for accuracy and trustworthiness before publishing" (3.5). Cụm "Don't use automatic translation without review" không có nguyên văn trong các trang tôi đọc (mục 7).

Quyết định cần owner (đầy đủ ở mục 8): có làm trang tiếng Anh không và khi nào; ai cung cấp chữ giao diện tiếng Anh; tên hiển thị (VI làm `h1`, EN làm dòng phụ); chữ chú thích dấu `*` bằng tiếng Anh; chính sách URL (`/en` hay khác).

## 2. So sánh

Bảng 1: bốn hướng cho dữ liệu `treatment`. Phương án D (chỉ trường `language` thuần, không plugin) là cách được mô tả trong trang Localization ("The simplest way to achieve this is to have a language field on documents"); nó gặp cùng các vấn đề của A (nhiều document, tham chiếu, slug) mà không có giao diện dịch, nên tôi gộp vào A.

| Tiêu chí                       | A. Document-level (`@sanity/document-internationalization`)                                                                         | B1. Field-level, `sanity-plugin-internationalized-array`                                                              | B2. Field-level, object `en` cùng tài liệu, không plugin (thiết kế của tôi)                                  | C. Chỉ `englishTitle`                       |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| Migration 3 document production | Nhẹ: `patch` `language: "vi"` vào 3 document, `_id` giữ nguyên; thêm 11 document `en` và 11 `translation.metadata`                  | Nặng: `title` (string) thành mảng `{language, value}`; sửa GROQ, zod, `slug.source`, `preview`, quy tắc 120 ký tự      | Không: trường `vi` giữ nguyên; `en` là trường mới                                                             | Không                                       |
| Strong reference trong 2 trang  | Vẫn trỏ về bản `vi`; trang `en` phải nối qua `translation.metadata`                                                                 | Không đổi (cùng document)                                                                                              | Không đổi                                                                                                    | Không đổi                                   |
| Mức đụng `app/` (routing)       | Như B; thêm `$lang` vào mọi truy vấn                                                                                                | Như A, B2 nếu có trang `en`                                                                                            | Chỉ khi có trang `en` (3.4)                                                                                  | Không                                       |
| SEO/hreflang                    | Tồn tại bản `en` = có document `en` đã publish                                                                                      | Tồn tại bản `en` = có giá trị `en` đầy đủ                                                                             | Tồn tại bản `en` = `en.title` và `en.description` có chữ                                                      | Không áp dụng                               |
| Chi phí editor                  | Cao nhất: hai document mỗi liệu pháp, sửa `price` hai lần; được hỗ trợ giao diện "Translations" và badge                            | Vừa: một form, có nút thêm ngôn ngữ; nhưng phải publish mọi ngôn ngữ cùng lúc                                         | Thấp: một form, nhóm "Tiếng Anh" thu gọn; cũng publish cùng lúc                                              | Rất thấp                                    |
| Rủi ro thiếu/lệch bản dịch      | Bản dịch mới nhân bản chữ tiếng Việt (xem `exclude`); giá lệch giữa hai bản                                                         | Giá trị `en` thiếu thì trống; cần quy tắc                                                                              | Cần quy tắc "đủ tên và mô tả hoặc để trống" (đã thử, mục 4)                                                  | Không có                                    |
| Khớp zod `treatmentSchema`      | Thêm `language`; `getTreatments` lọc theo `language`                                                                                | Phải viết lại gần hết schema zod                                                                                       | Thêm `en` tùy chọn; hàm `localizeTreatment` (mục 4)                                                          | Thêm `englishTitle` tùy chọn                |
| Nâng cấp từ C                   | Tạo 11 document, đổi nhiều                                                                                                          | Đổi kiểu trường, migration                                                                                             | `englishTitle` thành `en.title`: `patch` tối đa 11 document. Nếu #10 làm `en: { title }` ngay thì không cần gì | Chính nó                                    |
| Phụ thuộc mới                   | 2 plugin + `@sanity/language-filter`                                                                                                | 1 plugin + `@sanity/language-filter`                                                                                   | Không                                                                                                        | Không                                       |
| Khuyến nghị                     | Hoãn; chỉ chọn nếu cần publish độc lập từng ngôn ngữ, từ 3 ngôn ngữ trở lên, dịch qua dịch vụ ngoài, hoặc nội dung dài kiểu Portable Text | Hoãn                                                                                                                   | **Chọn cho mức 2**                                                                                           | **Chọn cho #10**                            |

Bảng 2: routing Next.js khi có trang `en` (chi tiết 3.4).

| Tiêu chí                    | R0. Không routing (C)  | R1. `app/[lang]` + `proxy.ts` rewrite                                              | R2. Route group, hai root layout (`(vi)` và `en/`)                                          |
| --------------------------- | ---------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| URL tiếng Việt hiện có      | Giữ nguyên             | Giữ nếu rewrite `/x` thành `/vi/x` nội bộ; nếu tiền tố `/vi` thì đổi mọi URL        | Giữ nguyên                                                                                  |
| `html lang`                 | `vi` cố định           | Động theo `lang` ở root layout                                                     | Mỗi root layout có `lang` riêng                                                             |
| Tệp phải di chuyển          | 0                      | Mọi trang công khai (10 `page.tsx`, `layout.tsx`, `not-found.tsx`); tách `studio`   | Chuyển trang `vi` vào `(vi)`; thêm `en/` chỉ với các trang đã dịch                            |
| `proxy.ts`                  | Không                  | Cần                                                                                | Không                                                                                       |
| Bám guide chính thức        | Không áp dụng          | Có (`internationalization.md`), trừ phần redirect theo `Accept-Language` (3.4)     | Dùng tính năng route group chính thức; không phải mẫu i18n trong guide                       |
| Chuyển ngôn ngữ             | Không có               | Điều hướng client trong cùng layout                                                | Tải lại toàn trang giữa hai root layout (docs nêu rõ)                                        |

## 3. Phát hiện theo chủ đề

### 3.1 Hiện trạng repo và dữ liệu production

Số dòng tính trên cây làm việc `issue-10` (đã gồm diff chưa commit).

- Chưa có plugin i18n: `sanity.config.ts` chỉ có `structureTool` và `visionTool`. `app/layout.tsx:49` là `<html lang="vi">`; `lib/seo.ts:25` đặt cứng `locale: "vi_VN"`; không có `proxy.ts` hay `middleware.ts`.
- Dataset `production` (truy vấn chỉ-đọc 2026-10-13): 3 document `treatment`, `_id` là UUID, **không document nào có trường `language`**, không có type `translation.metadata`. Sáu strong reference (`_weak` rỗng): `servicesPage` trỏ `cupping`, `heat-light`, `cold-plunge`; `methodsPage` trỏ cũng ba document đó (nhóm `manual`, `infrared`, `cold`). Tham chiếu theo `_id`, nên việc đổi nội dung hay thêm trường không làm gãy chúng; đổi `_id` thì gãy.
- Giá production: `heat-light` = 99, `cold-plunge` = 149000, `cupping` = 99000. Bảng giá owner ghi Đèn hồng ngoại 99k, Ngâm lạnh 149k, Giác hơi 99k, nên **`heat-light` = 99 sai đơn vị**. Việc này thay thế khuyến nghị cũ ở [`treatment-detail-schema-research.md`](treatment-detail-schema-research.md) mục 3.6 (bỏ `price` khỏi frontend): owner đã cho phép hiển thị giá, một mức mỗi liệu pháp, VND, số nguyên.
- Hai nơi còn giả định tiếng Việt: `lib/validation.ts:6` (số điện thoại chỉ nhận `+84` hoặc `0` đầu, khách nước ngoài không gửi được số của họ) và `app/api/leads/route.ts` cùng `lib/validation.ts` trả thông báo lỗi tiếng Việt cố định, form hiển thị nguyên chuỗi `data.error` (`components/lead-form.tsx:43`).
- `lib/email.ts:61` phân biệt "Liệu pháp" và "Dịch vụ" bằng `input.source?.startsWith("/treatments")`; `source` là `window.location.pathname` (`lead-form.tsx:31`). Với `/en/treatments/cupping`, email nhân viên sẽ ghi sai nhãn "Dịch vụ" (`tests/email.test.ts:32-34` ghim hành vi hiện tại).
- Có khoảng 15 tệp chứa đường dẫn nội bộ viết cứng (`app/*/page.tsx`, `app/sitemap.ts`, `components/holistic-nav.tsx`, `holistic-footer.tsx`, `services-carousel.tsx`, `lib/email.ts`...; đếm bằng `grep`, có thể lệch vài tệp).
- Quy tắc nội dung (`docs/CONTENT_INVENTORY.md` hàng 22): tên và mô tả liệu pháp theo bảng giá của owner "(Vietnamese and English)". `PRODUCT.md` mô tả site là "Vietnamese-language" và không nhắc bản tiếng Anh; chứng chỉ nhân sự còn "unconfirmed".

### 3.2 Hai kiểu i18n chính thức của Sanity

Căn cứ: [Localization](https://www.sanity.io/docs/studio/localization.md); README, `docs/`, `CHANGELOG.md`, source của hai plugin.

**Cách Sanity mô tả.** "Localization in Sanity is performed by storing language data as a value of a field in a document." Hai hướng: field-level ("A single document with content in many languages", "Requires you to publish content in all languages simultaneously") và document-level ("A unique document version for every language", "Allows the option to publish each language version independently"). Trang này ghi dự án có thể dùng cả hai ("you may use both in a single project").

**A. Document-level (`@sanity/document-internationalization` 6.2.41).**

- Cấu hình bắt buộc: `supportedLanguages` (mảng `{id, title}` hoặc hàm async nhận client) và `schemaTypes`. Tùy chọn có trong README/`types.ts`: `languageField` (mặc định `language`), `weakReferences` (mặc định `false`), `bulkPublish` (cần Scheduling API), `metadataFields`, `apiVersion`, `allowCreateMetaDoc`, `callback`, `hideLanguageFilter`, `addTemplates`. Với `supportedLanguages` async, README ghi "Async language configuration cannot create templates for new documents".
- Mô hình dữ liệu: mỗi bản ngôn ngữ là một document riêng có trường `language`; các bản liên kết với nhau qua document `translation.metadata` (`liveEdit: true`, mảng `translations` gồm `{_key, language, value: reference}`; `src/schema/translation/metadata.ts`). Tham chiếu trong metadata mặc định tạo yếu rồi "strengthen on publish" (`createReference.ts`); `weakReferences: true` giữ chúng yếu. Docs `03-deleting-translated-documents.md`: "By default, this plugin creates a strong reference between a document and its connected translation metadata document" nên không xoá được document còn bản dịch trừ khi dùng action của plugin.
- Tạo bản dịch (`LanguageOption.tsx`): nhân bản document nguồn thành **bản nháp mới có `_id` là UUID mới**, đặt `language`, thêm vào metadata. README: "The default behaviour of this plugin when creating a new translation is to duplicate the originating document"; có thể loại trường bằng `options.documentInternationalization.exclude`. Nghĩa là bản `en` mới chứa nguyên văn tiếng Việt cho tới khi biên tập viên thay; với nội dung y tế, đây là rủi ro đăng nhầm chữ sai ngôn ngữ.
- **Document đã có sẵn (chưa có `language`)**: `DocumentInternationalizationMenu.tsx` hiện cảnh báo "Choose a language to apply to this Document" và dùng `LanguagePatch` để `patch` trường `language` vào chính document đó. `_id` không đổi nên 6 strong reference còn nguyên. Chưa thử trong Studio thật.
- **Thiếu bản dịch**: không có ràng buộc; document `en` chỉ tồn tại khi ai đó tạo và publish. Truy vấn theo `language` sẽ không trả gì cho liệu pháp chưa dịch. README về quota: "if you have 100 documents and they are all translated into 3 languages, you will have 400 documents"; với đây 11 document và 2 ngôn ngữ là 33 document.
- **Tương thích Sanity 6**: `peerDependencies` = `react ^19.2`, `react-dom ^19.2`, `sanity ^5 || ^6.0.0-0`, `sanity-plugin-internationalized-array ^5.3.4`; không có `peerDependenciesMeta` nên cả bốn là bắt buộc. `CHANGELOG.md`: "Widen `sanity` peer-dependency range to `^5 || ^6.0.0-0` to support Sanity Studio v6 (including v6 pre-releases)." và một mục khác nhắc "Sanity 6.6". Engines `node >=20.19 <22 || >=22.12` (repo yêu cầu Node `>=24`). Phụ thuộc trực tiếp `@sanity/util ^6.18.0`, `@sanity/mutator ^6.18.0`, trong khi repo khoá `sanity` 6.17.0.
- **Phép thử phân giải peer** (thư mục sạch trong `/tmp`, `sanity` 6.17.0, `react` 19.3.0, `styled-components` 6.5.3, hai plugin, `npm install --package-lock-only`): không báo `ERESOLVE`. Kết quả khoá: `@sanity/util` 6.19.0 được kéo lên gốc, còn `sanity` và `@sanity/validation` giữ bản lồng 6.17.0 (hai bản cùng tồn tại); `@sanity/language-filter` 5.0.21 được cài tự động (peer bắt buộc của plugin mảng); `@sanity/assist` không cài (peer tùy chọn). Chưa kiểm tra Studio chạy được với hai bản `@sanity/util`. `docs/DEPENDENCY_UPGRADE.md` ghim chính xác mọi phụ thuộc trực tiếp, nên nếu cài thì phải ghim phiên bản chính xác.
- **Tham chiếu từ `servicesPage`/`methodsPage`**: kiểu `reference` trỏ `_id` cụ thể, tức bản `vi` (document gốc). Trang `en` cần lấy bản dịch của mỗi liệu pháp. Cú pháp nối đã gửi lên `production` (trả `null` vì chưa có dữ liệu, nhưng truy vấn hợp lệ): `treatments[]->{"slug":slug.current, "t": *[_type=="translation.metadata" && references(^._id)][0].translations[language==$lang][0].value->{title}}`. Là mười một truy vấn con mỗi trang; chấp nhận được ở quy mô này, nhưng là chi phí mà B2 không có.

**B1. Field-level bằng `sanity-plugin-internationalized-array` 5.3.4.**

- Cấu hình: `internationalizedArray({ languages, defaultLanguages, fieldTypes: ['string'] })` đăng ký các type như `internationalizedArrayString`; dữ liệu lưu `{ "_key": "...", "language": "en", "value": "hello" }` (từ v5 ngôn ngữ nằm ở `language`, không còn ở `_key`; có công cụ migration v4 sang v5). Truy vấn: `greeting[language == "en"][0].value`; có `coalesce` cho fallback (trang Localization).
- Peer: `sanity ^5 || ^6.0.0-0`, `react ^19.2`, `@sanity/language-filter ^5.0.21` (bắt buộc), `@sanity/assist ^6.2.4` (tùy chọn).
- Giới hạn liên quan: với kiểu object/mảng phải đăng ký "alias type" trong `fieldTypes` và README nêu "Nested internationalized arrays are not yet supported" (cho vị trí nút `document`). `benefits` (mảng chuỗi) và `protocols` (mảng object) cần kiểu tùy chỉnh; **chưa thử** `benefits`/`protocols` với plugin này.
- Lý do chọn mảng thay vì object: "This plugin's arrays will use fewer attributes than an object once you have more than three languages." Với hai ngôn ngữ, lý lẽ này không áp dụng; trang Localization còn đếm cùng ví dụ: object cho 3 ngôn ngữ cần 4 đường dẫn, mảng cần 5.
- Migration 3 document production: `title` đang là chuỗi; B1 buộc đổi kiểu trường, di chuyển giá trị sang `[{language:"vi", value}]`, và sửa mọi chỗ đọc `title` (GROQ ở `lib/sanity.ts:155,164,181`, zod, `slug.options.source: "title"` vốn là đường dẫn chuỗi, `preview.select`, quy tắc `leadSchema.shape.treatment` ở `sanity/schemaTypes/index.ts`). Strong reference không đổi (cùng document).

**B2. Object `en` cùng tài liệu, không plugin (thiết kế của tôi, không phải mẫu chính thức).** Giữ các trường tiếng Việt ở cấp gốc (chúng là bản `vi`), thêm một object `en` chứa các trường cần dịch. Lý do ghi rõ: README của plugin mảng gọi object theo kiểu `@sanity/language-filter` là "the most popular way to store field-level translated content"; B2 là biến thể của kiểu đó nhưng bỏ migration. Đánh đổi: không có giao diện thêm ngôn ngữ, badge hay AI Assist của plugin; ngôn ngữ thứ ba phải thêm object `fr`... (chấp nhận được tới 2-3 ngôn ngữ; sau đó xem lại, B1/A hợp hơn); `vi` là ngôn ngữ mặc định bất đối xứng, khớp thực tế site "Vietnamese-language". Giống mọi field-level, hai bản được publish cùng lúc.

### 3.3 Slug theo ngôn ngữ

- **Khuyến nghị: dùng chung slug, tiền tố locale** (`/treatments/cupping` và `/en/treatments/cupping`). Slug hiện có và sắp thêm đều là tiếng Anh không dấu (`dry-needling`, `iastm`, `therapeutic-ultrasound`...). Google: "It's fine to use localized words in the URL" nhưng không bắt buộc; đổi slug đang tồn tại đòi redirect 301 (`docs/MIGRATION.md:8`). Với B2/B1/C chỉ có một trường `slug` nên không có vấn đề unique.
- **Với A**: trường `slug` nằm trong từng document; `isUnique` mặc định chỉ so cùng type và cùng đường dẫn trường (doc trước mục 3.2), nên bản `en` nhân bản từ bản `vi` sẽ trùng slug và bị cảnh báo. Plugin có docs `05-allowing-the-same-slug-for-translations.md`: "Often your translated documents will share the same slug." với hàm `isUniqueOtherThanLanguage` (so thêm `language == $language`) hoặc chuyển `slug` sang `metadataFields`. Slug riêng theo ngôn ngữ (`/en/treatments/dry-needling` so với `/treatments/cham-kho`) cũng khả thi nhưng thêm bảng chuyển đổi và redirect, không có lợi ích đã nguồn hoá.
- **`generateStaticParams`**: với `[lang]`, cho mỗi liệu pháp chỉ phát cặp `(lang, slug)` mà `localizeTreatment` trả khác `null` (mục 4). Giữ `dynamicParams` mặc định `true`: `generateStaticParams` "will not be called again" khi ISR revalidate (`generate-static-params.md`), nên `false` sẽ 404 liệu pháp mới thêm cho tới lần build kế. Dùng `notFound()` khi bản dịch là `null`.
- **Canonical và hreflang**: mỗi bản có canonical tự trỏ chính nó; không phục vụ nội dung tiếng Việt ở URL `/en/...` (Google coi bản địa hoá là trùng lặp chỉ khi "the main content of the page remains untranslated"). Chỉ phát hreflang `en` cho liệu pháp có bản `en` đầy đủ.

### 3.4 Next.js 16.3.8 (App Router)

Tệp docs đã đọc (trong `node_modules/next/dist/docs/01-app/`): `02-guides/internationalization.md`; `03-api-reference/04-functions/next-root-params.md`; `04-functions/generate-metadata.md` (mục `alternates`, `openGraph`); `04-functions/generate-static-params.md`; `03-file-conventions/proxy.md`; `03-file-conventions/route-groups.md`; `03-file-conventions/01-metadata/sitemap.md`; `04-functions/revalidatePath.md`; `03-file-conventions/02-route-segment-config/dynamicParams.md`. Kiểu `alternates.languages` và `alternateLocale` đã đối chiếu thêm trong `node_modules/next/dist/lib/metadata/types/`.

- **Guide chính thức**: định tuyến i18n bằng sub-path (`/fr/products`) hoặc domain; "ensure all special files inside `app/` are nested under `app/[lang]`" (dòng 74); root layout có thể nằm trong `app/[lang]/layout.tsx` và đặt `<html lang={(await params).lang}>` (dòng 258-272; `params` là Promise); `hasLocale` + `notFound()` ("It also ensures a 404 is returned if a translation is missing, rather than a runtime error", dòng 153); `generateStaticParams` ở layout trả `[{ lang: 'en-US' }, ...]`. `next/root-params` (`lang()`) chỉ hoạt động khi segment động nằm **trên** root layout.
- **Tên tệp proxy**: trong Next.js này là `proxy.ts` (export hàm `proxy`); `middleware` "is deprecated and has been renamed to proxy" (`proxy.md`). Repo hiện không có.
- **Không sao chép phần redirect theo `Accept-Language` của guide.** Guide chọn locale từ `Accept-Language` rồi `NextResponse.redirect`. Google: "Avoid automatically redirecting users from one language version of a site to a different language version of a site", và Googlebot "sends HTTP requests without setting Accept-Language in the request header" (3.5). Nếu cần `proxy.ts`, chỉ dùng `NextResponse.rewrite` (proxy.md nêu rewrite là khả năng của proxy) để `/x` phục vụ từ `/vi/x` nội bộ, không redirect theo ngôn ngữ trình duyệt. Khi dùng rewrite, `revalidatePath` phải nhận **đường dẫn đích** (`revalidatePath.md`, mục rewrites).
- **Mức đụng chạm `app/`** (không sửa, chỉ đo): R1 dời mọi trang công khai vào `app/[lang]/` và dời root layout; `app/studio` và `app/api` không thể nằm dưới `[lang]`, nên `studio` cần root layout riêng (route group). `app/[policy]/page.tsx` hiện ở gốc sẽ xung đột khái niệm với `[lang]` nên phải dời. `robots.ts`, `sitemap.ts`, `icon.svg` là tệp metadata ở gốc, có thể ở lại. Route group cho nhiều root layout là tính năng chính thức ("Defining multiple root layouts"); docs nêu hai hệ quả: "If you navigate between routes that use different root layouts, it'll trigger a full page reload" và với nhiều root layout không có `layout.js` cấp trên cùng, trang chủ `/` phải nằm trong một route group. R2 (`(vi)` giữ URL cũ, cây `en/` có root layout `lang="en"` riêng, chỉ chứa trang đã dịch) ít tệp đụng hơn R1 nhưng nhân đôi phần khung trang; không phải mẫu trong guide i18n.
- **`generateMetadata`**: `alternates: { canonical, languages: { vi: ..., en: ..., 'x-default': ... } }` sinh `<link rel="alternate" hreflang>`; kiểu `Languages` có khoá `x-default`. `openGraph.locale` và `alternateLocale` có trong kiểu; ogp.me: `og:locale` "Of the format language_TERRITORY. Default is en_US." nên tiếng Anh là `en_US`, tiếng Việt `vi_VN` (như `lib/seo.ts:25`). `createMetadata` hiện nhận `title/description/path/image` và cố định `locale`; mức 2 cần thêm tham số `locale` và `alternates`.
- **Sitemap**: `MetadataRoute.Sitemap` hỗ trợ `alternates.languages` (`sitemap.md`, ví dụ `es`/`de`). **Ví dụ của docs không có mục tự tham chiếu**, trong khi Google yêu cầu (3.5); phải tự thêm.
- **Revalidate**: `app/api/revalidate/route.ts:9` gọi `revalidatePath("/", "layout")`; docs: "Revalidating all data ... invalidate all cached data for revalidation on the next page visit". Với `[lang]` một root layout, không cần đổi. Với R2 (hai root layout) chưa kiểm chứng việc "/" có phủ cả cây `en/`; an toàn là gọi thêm `revalidatePath("/en", "layout")`. Webhook phía Sanity (ngoài repo, không xem được) nếu lọc theo `_type` thì với A phải thêm `translation.metadata`.

### 3.5 Google Search Central (đọc 2026-10-13)

- [Tell Google about localized versions of your page](https://developers.google.com/search/docs/specialty/international/localized-versions) (cập nhật 2026-09-21): "Each language version must list itself as well as all other language versions."; "If two pages don't both point to each other, the tags will be ignored."; hreflang qua HTML, header HTTP hoặc sitemap, "The three methods are equivalent from Google's perspective" và "there's no benefit in Search" khi dùng cả ba, nên chọn một (khuyến nghị `generateMetadata`, cùng dữ liệu với nút đổi ngôn ngữ). "Consider adding a fallback page for unmatched languages" với `x-default`; chỉ cần khi có trang chọn ngôn ngữ hoặc trang chủ tự chuyển hướng, còn trang liệu pháp thì tuỳ chọn. URL phải đầy đủ giao thức. "Google doesn't use hreflang or the HTML lang attribute to detect the language of a page".
- [Managing multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) (2025-12-10): "Google recommends using different URLs for each language version of a page rather than using cookies or browser settings to adjust the content language on the page."; "Google uses the visible content of your page to determine its language."; nên "using a single language for content and navigation on each page, and by avoiding side-by-side translations"; "Avoid automatically redirecting users from one language version of a site to a different language version of a site."; "Consider adding hyperlinks to other language versions of a page."; cấu trúc thư mục con `example.com/de/` được liệt kê (dễ cài, một host, "Users might not recognize geotargeting from the URL alone"). Không dùng IP để thích ứng nội dung.
- **Dịch tự động**: [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies) (2026-08-28), mục Scaled content abuse, liệt kê "automated transformations like synonymizing, translating, or other obfuscation techniques" khi tạo nhiều trang mà giá trị cho người dùng thấp; [generative AI content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content) (2026-10-01): "It is critical to manually factcheck and review all AI-generated content for accuracy and trustworthiness before publishing." và việc rà này áp dụng cho `<title>`, meta description, structured data, văn bản thay thế ảnh. Mười một trang chữ do owner cung cấp không nằm trong mô tả "scaled content abuse", nhưng chữ máy dịch ngoài bảng giá cần người duyệt, trùng quy tắc nội dung y tế của repo.
- **`inLanguage`/`@language`**: schema.org `inLanguage` "The language of the content or performance or used in an action. Please use one of the language codes from the IETF BCP 47 standard." Danh sách "Used on these types": `BroadcastService`, `CommunicateAction`, `CreativeWork`, `Event`, `LinkRole`, `PronounceableText`, `WriteAction`. Vậy **đặt `inLanguage` trên `WebPage` (là `CreativeWork`), không đặt trên `Service`**. `availableLanguage` chỉ dùng trên `ContactPoint`, `Course`, `LodgingBusiness`, `ServiceChannel`, `TouristAttraction`. `Service` có `alternateName` (kế thừa từ `Thing`), dùng được cho tên ở ngôn ngữ còn lại. `@language` là từ khoá JSON-LD cho chuỗi gắn ngôn ngữ (đặc tả: "Used to specify the language for a particular string value or the default language of a JSON-LD document"), nhưng tôi không thấy trang Google nào nói họ xử lý nó: không dùng, chỉ dùng `inLanguage`.
- HTML: MDN `lang`: WCAG 3.1.2 "requires that pages with parts in different languages have the languages of those parts specified too". Dòng phụ tiếng Anh trên trang tiếng Việt cần `lang="en"`.

### 3.6 Các điểm tích hợp khác

- **Lead form**: gửi `treatment` là tên tiếng Việt chuẩn của liệu pháp (`title` gốc), không phải tên đã dịch, để email nhân viên (tiếng Việt) và `leadSchema.shape.treatment` (`max(120)`, `lib/validation.ts:20`) không đổi; slug đã đi trong `source`. Cần: sửa `lib/email.ts:61` thành so khớp có tiền tố (ví dụ `/^\/(en\/)?treatments/`); thêm `locale` tuỳ chọn vào `leadSchema` để nhân viên biết khách dùng tiếng Anh (đề xuất, chưa thử); thông báo lỗi và chữ thành công trả theo mã lỗi cộng từ điển phía client, vì `lead-form.tsx:43` hiển thị nguyên chuỗi tiếng Việt từ API; xem lại regex số điện thoại.
- **Giá VND**: lưu số nguyên VND (mức 1 sửa schema). Trên Node 24.21.0 (ICU 78.3) `new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND",maximumFractionDigits:0}).format(299000)` ra `299.000 ₫`; locale `en` mặc định ra `₫299,000`; với `currencyDisplay:"code"` ra `VND 299,000`. Khuyến nghị bản tiếng Anh dùng mã `VND` cho rõ ràng; MDN đã nêu mặc định chữ số thập phân của tiền tệ lấy từ ISO 4217, nên đặt `maximumFractionDigits: 0`. Định dạng ở server component để tránh lệch hydrate; chưa so sánh các trình duyệt.
- **Chú thích dấu `*`**: không đặt `*` vào `title` (nó sẽ lọt vào slug nguồn, JSON-LD `name`, `treatment` của lead, email). Lưu thành boolean `requiresCertifiedPractitioner`, giao diện thêm `*` sau tên và một dòng chú thích theo locale. Chữ tiếng Việt do owner nêu: dấu * = chỉ chuyên viên có chứng nhận thực hiện. Chữ tiếng Anh của dòng chú thích chưa được cung cấp, **không tự dịch**. Câu này là tuyên bố về chứng chỉ nhân sự trong khi `PRODUCT.md` ghi chứng chỉ "unconfirmed": owner xác nhận được đăng.
- **Nút đổi ngôn ngữ**: chỉ hiện khi bản đích tồn tại (đúng điều kiện `localizeTreatment` khác `null`); nếu thiếu, ẩn nút hoặc dẫn về `/en/treatments` (trang danh sách), không dẫn tới URL `en` chứa chữ Việt. Link chéo là cách Google khuyến nghị (3.5), không tự chuyển hướng.
- **`servicesPage`/`methodsPage`**: schema giữ nguyên ở mức 1 và B2. Chữ của chính hai trang này (`title`, `body`, `bullets`) cũng cần dịch khi có trang `/en/services`, `/en/treatments`: đây là quyết định riêng và nặng hơn `treatment`. Chúng là singleton `_id` cố định; document-level cho singleton đòi script tạo tài liệu và sửa structure (docs `01-singleton-documents.md` của plugin), thêm một lý do chọn field-level.
- **Nội dung y tế**: bản tiếng Anh chỉ dùng chữ owner đã cung cấp; chưa có tiếng Anh cho `benefits`, `protocols` và chữ mẫu trang nên trang `en` ban đầu chỉ có tên, mô tả, giá, ảnh, nút liên hệ. Hai mục `benefits`/`protocols` đã ẩn khi rỗng (`page.tsx` render có điều kiện).

## 4. Schema đề xuất

Tất cả đoạn mã dưới đây (mức 1, mức 2, hàm chọn bản dịch) đã được biên dịch và chạy test trong `/tmp`, không nằm trong repo. Các trường giữ nguyên từ repo ghi chú `// giữ nguyên`.

### 4.1 Mức 1: `treatment` trong #10

```ts
const treatment = defineType({
  name: "treatment",
  title: "Liệu pháp",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tên liệu pháp (tiếng Việt)",
      description: "Tên chính: hiện ở h1 và gửi cùng yêu cầu gọi lại. Không ghi dấu * vào tên.",
      type: "string",
      validation: (rule) => [
        rule.required(),
        rule.custom((v) => (leadSchema.shape.treatment.safeParse(v).success ? true : "Tên liệu pháp không được dài quá 120 ký tự.")),
        rule.custom((v) => (v?.includes("*") ? "Bỏ dấu *, dùng ô chọn bên dưới." : true)),
      ],
    }),
    defineField({
      name: "englishTitle",
      title: "Tên tiếng Anh (dòng phụ)",
      description: "Chỉ dùng tên owner đã cung cấp trong bảng giá. Bỏ trống để ẩn dòng phụ.",
      type: "string",
      validation: (rule) => [rule.max(80), rule.custom((v) => (v?.includes("*") ? "Bỏ dấu *." : true))],
    }),
    defineField({
      name: "requiresCertifiedPractitioner",
      title: "Chỉ chuyên viên có chứng nhận thực hiện (dấu * trong bảng giá)",
      type: "boolean",
      initialValue: false,
    }),
    // slug: như doc trước 3.2 (regex a-z0-9 và gạch ngang, maxLength 96)
    defineField({
      name: "price",
      title: "Giá (VNĐ)",
      description: "Số nguyên VND đầy đủ, một mức cho mỗi liệu pháp. Ví dụ: 299000.",
      type: "number",
      validation: (rule) => [
        rule.integer().min(0),
        rule.min(1000).warning("Giá ghi bằng VND đầy đủ, ví dụ 99000 (không phải 99)."),
      ],
    }),
    // shortDescription, description, duration, isPopular, image, benefits, protocols, seo: giữ nguyên
  ],
});
```

- Giao diện: `h1` = `title`; dưới nó `<span lang="en">{englishTitle}</span>` khi có; dấu `*` và dòng chú thích khi `requiresCertifiedPractitioner`. Không thêm `englishDescription` (một đoạn tiếng Anh cạnh đoạn tiếng Việt là kiểu "side-by-side translations" Google khuyên tránh).
- JSON-LD (doc trước 3.11): thêm `Service.alternateName` = `englishTitle` khi có; `WebPage.inLanguage` giữ `"vi"`.
- Khoá thử nghiệm: `price` 99 ra `warning`, 1000.5 ra `error`; `title` có `*` ra `error`; dữ liệu Giác hơi hợp lệ không có marker nào.
- Nếu owner dự kiến có bản tiếng Anh trong một hai quý, bắt đầu luôn bằng `en: { title }` (xem 4.2) thay cho `englishTitle`; chi phí hôm nay như nhau và không cần `patch` đổi tên sau này. Mặc định tôi giữ `englishTitle` (YAGNI) theo gợi ý ban đầu.

### 4.2 Mức 2: thêm bản tiếng Anh cùng tài liệu (B2)

```ts
// Đã điền bất kỳ ô nào của bản dịch thì bắt buộc có tên và mô tả.
const requiredOnceFilled = (message: string) => (rule: StringRule | TextRule) =>
  rule.custom((value, context) => {
    const { _type, ...rest } = (context.parent ?? {}) as Record<string, unknown>;
    const filled = Object.values(rest).some((v) => (Array.isArray(v) ? v.length : Boolean(v)));
    return !filled || value ? true : message;
  });

const treatmentTranslation = defineType({
  name: "treatmentTranslation",
  title: "Bản dịch",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Tên", type: "string", validation: requiredOnceFilled("Cần tên tiếng Anh.") }),
    defineField({ name: "shortDescription", title: "Mô tả ngắn", type: "text", rows: 3 }),
    defineField({ name: "description", title: "Mô tả chi tiết", type: "text", rows: 5, validation: requiredOnceFilled("Cần mô tả tiếng Anh.") }),
    defineField({ name: "duration", title: "Thời lượng", type: "string" }),
    defineField({ name: "imageAlt", title: "Alt text của ảnh chính", type: "string" }),
    defineField({ name: "benefits", title: "Lợi ích", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "protocols", title: "Quy trình thực hiện", type: "array", of: [defineArrayMember({ type: "protocolStep" })] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
// Trong `treatment` (thay `englishTitle` bằng trường này; mọi trường mức 1 khác giữ nguyên):
defineField({
  name: "en",
  title: "Tiếng Anh (English)",
  description: "Chỉ điền chữ owner đã cung cấp. Cần có cả tên và mô tả; để trống hoàn toàn nếu chưa có.",
  type: "treatmentTranslation",
}),
```

- Quan sát khi thử: trong `@sanity/validation` 6.17.0, `rule.custom()` gắn trực tiếp lên trường kiểu **object** trả marker mức `warning`, kể cả khi gọi `.error()`; lỗi mức `error` chỉ có khi gắn lên trường `string`/`text`. Vì vậy quy tắc đặt ở `en.title` và `en.description` và đọc `context.parent`. Chưa kiểm tra trong Studio thật.
- Trường `protocolStep` dùng lại nguyên kiểu hiện có (doc trước 3.5 đề xuất bỏ `step`; áp dụng thì áp dụng chung cho cả `protocols` và `en.protocols`).
- `servicesPage`/`methodsPage`: **không đổi schema**. Hai trang giữ `reference` tới `treatment`.

### 4.3 GROQ, zod và hàm chọn bản dịch (B2)

GROQ chỉ cần lấy thêm `en`; chọn ngôn ngữ trong JS (11 document, `getTreatments` đã `cache`). Danh sách liên kết trên trang `en` lọc bỏ liệu pháp chưa có bản dịch ngay trong GROQ (đã chạy thử trên production, trả `[]` vì chưa có `en`):

```groq
// getTreatments: thêm vào phép chiếu hiện có
requiresCertifiedPractitioner, en{title,shortDescription,description,duration,"imageAlt":imageAlt,benefits,protocols,"seo":seo{title,description,"ogImage":ogImage.asset->url}}

// servicesPage/methodsPage, danh sách liên kết cho trang en
treatments[defined(@->en.title)]->{"slug":slug.current,"title":en.title}
```

Lưu ý: dạng `treatments[]->[điều kiện]{...}` hoặc `treatments[]->{...}[điều kiện]` **không** lọc đúng trong thử nghiệm (mỗi phần tử trả `null`); điều kiện phải đứng trước `->`.

```ts
export type Locale = "vi" | "en";
export const defaultLocale: Locale = "vi";

const translationSchema = z.object({
  title: optionalText, shortDescription: text, description: text, duration: text,
  imageAlt: optionalText, benefits: strings, protocols, seo,
});
// thêm vào treatmentSchema hiện có:
//   requiresCertifiedPractitioner: z.boolean().catch(false),
//   price: z.number().int().nonnegative().optional().catch(undefined),
//   en: translationSchema.nullish().catch(undefined),

// Trang tiếng Anh chỉ dùng chữ trong `en`; không rơi về chữ tiếng Việt.
export function localizeTreatment(raw: RawTreatment, locale: Locale) {
  const { en, ...shared } = raw;
  if (locale === defaultLocale) return shared;
  if (!en?.title || !en.description) return null; // thiếu bản dịch: không có trang /en/...
  return { ...shared, title: en.title, shortDescription: en.shortDescription, description: en.description,
    duration: en.duration, imageAlt: en.imageAlt, benefits: en.benefits, protocols: en.protocols, seo: en.seo };
}

export const formatVnd = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en", {
    style: "currency", currency: "VND", maximumFractionDigits: 0,
    ...(locale === "en" ? { currencyDisplay: "code" } : {}),
  }).format(value);
```

Với phương án A (nếu sau này chọn), truy vấn thay bằng `*[_type == "treatment" && language == $lang && slug.current == $slug][0]`, và `generateStaticParams` lặp theo từng `lang`; cấu hình tối thiểu theo README:

```ts
documentInternationalization({
  supportedLanguages: [{ id: "vi", title: "Tiếng Việt" }, { id: "en", title: "English" }],
  schemaTypes: ["treatment"],
  weakReferences: true, // cho phép xoá một bản mà không gỡ metadata
  addTemplates: false,
})
// treatment cần thêm: defineField({ name: "language", type: "string", readOnly: true, hidden: true })
// và slug.options.isUnique = isUniqueOtherThanLanguage (docs/05 của plugin);
// price, benefits, protocols, seo, description: options.documentInternationalization.exclude = true
```

### 4.4 Dữ liệu mẫu (chỉ chữ do owner cung cấp)

Mức 1, Giác hơi/Cupping (document production `dd0ea224-...`, `_id` thật) và Châm khô*/Dry Needling (chưa có document, `_id` minh hoạ):

```json
[
  {
    "_id": "dd0ea224-8a3d-4cdc-9b99-bd97b47d13a0",
    "_type": "treatment",
    "title": "Giác hơi",
    "englishTitle": "Cupping",
    "requiresCertifiedPractitioner": false,
    "slug": { "_type": "slug", "current": "cupping" },
    "price": 99000,
    "description": "Dùng áp suất trong ống giác hơi gây xung huyết tại chỗ để giải độc cơ thể và giải quyết một số cơn đau."
  },
  {
    "_id": "dry-needling-doc-id",
    "_type": "treatment",
    "title": "Châm khô",
    "englishTitle": "Dry Needling",
    "requiresCertifiedPractitioner": true,
    "slug": { "_type": "slug", "current": "dry-needling" },
    "price": 299000,
    "description": "Tác động vào các điểm co cứng (trigger point) để giải phóng căng thẳng, giảm đau và phục hồi chức năng thần kinh – cơ."
  }
]
```

Mức 2: bỏ `englishTitle`, thêm `en` (cùng document, không đổi `_id`):

```json
{
  "_id": "dd0ea224-8a3d-4cdc-9b99-bd97b47d13a0",
  "_type": "treatment",
  "title": "Giác hơi",
  "slug": { "_type": "slug", "current": "cupping" },
  "price": 99000,
  "requiresCertifiedPractitioner": false,
  "description": "Dùng áp suất trong ống giác hơi gây xung huyết tại chỗ để giải độc cơ thể và giải quyết một số cơn đau.",
  "en": {
    "_type": "treatmentTranslation",
    "title": "Cupping",
    "description": "Uses gentle suction to stimulate circulation, support detoxification, and ease discomfort."
  }
}
```

Dry Needling mức 2 tương tự với `en.title` = "Dry Needling" và `en.description` = "Targets muscle trigger points to release tension, relieve pain, and restore neuromuscular function." Trường `description` hiện có của production là nội dung cũ đang chờ owner duyệt (doc trước 3.1); việc dùng chữ bảng giá làm `description` là lựa chọn của biên tập viên, tôi không quyết.

## 5. Kế hoạch migration

**Mức 1, làm ngay trong #10 (rủi ro thấp, không đụng `app/` ngoài trang liệu pháp):**

1. Schema: thêm `englishTitle`, `requiresCertifiedPractitioner`; chặn `*` trong `title`; `price` thành số nguyên kèm cảnh báo `< 1000`.
2. Mã: zod thêm hai trường; `getTreatments` lấy thêm; trang hiển thị dòng phụ có `lang="en"` và chú thích `*`; định dạng giá bằng `Intl.NumberFormat("vi-VN", ...)`.
3. Dữ liệu: nhập `englishTitle` cho 3 document hiện có, sửa `heat-light` từ 99 thành 99000 (owner xác nhận); nhập tám liệu pháp mới theo bảng giá (nằm trong phạm vi seed của #10, không bàn ở đây). Sao lưu trước bằng `sanity dataset export production` (README plugin). 3 document thì làm trong Studio được, không cần script.
4. Không thêm routing, hreflang, hay `/en` vào sitemap.

**Mức 2, khi owner quyết định có tiếng Anh:**

1. Quyết định với owner: các trang nào có `/en`, ai cung cấp chữ giao diện tiếng Anh, chính sách URL (R1 hay R2, mục 2).
2. Mở rộng schema (expand): thêm `treatmentTranslation` và `en`; giữ `englishTitle` thêm một lượt triển khai. Chạy `patch` đổi `englishTitle` thành `en.title` cho các document đã có, rồi triển khai lại bỏ `englishTitle` (contract). Thứ tự này theo khuôn "mở rộng rồi thu hẹp" của doc trước 3.5.
3. Dữ liệu: nhập `en.title` và `en.description` cho từng liệu pháp từ bảng giá; tuyệt đối không dịch chỗ owner chưa cung cấp.
4. Mã: `localizeTreatment`; routing R1 hoặc R2; `html lang`; metadata `alternates.languages` có mục tự tham chiếu; sitemap; JSON-LD `inLanguage`; sửa `lib/email.ts:61`; từ điển giao diện; ẩn nút đổi ngôn ngữ khi thiếu bản dịch.
5. Kiểm tra: hreflang hai chiều (mục 6), thử trên `staging`.

**Nếu chọn A thay B2 (không khuyến nghị):** cài hai plugin cùng `@sanity/language-filter` với phiên bản ghim chính xác; `patch` `language: "vi"` cho document hiện có (hoặc dùng nút ngôn ngữ trong Studio); đặt `isUnique` tuỳ chỉnh cho `slug`; đặt `exclude` cho các trường không được nhân bản; tạo document `en` bằng menu Translations (bản nháp có `_id` mới) hoặc script theo docs `02-importing-and-creating-documents.md`; đổi mọi truy vấn sang `language == $lang`; nối bản dịch trong danh sách liên kết; thêm `translation.metadata` vào webhook nếu có lọc `_type`.

## 6. Test và xác minh đề xuất

Dùng vitest hiện có; không cần Studio hay mạng trừ dòng cuối.

| Test                                      | Nội dung chính                                                                                                                                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/treatment-schema.test.ts` (mức 1)  | `validateDocument` (khuôn `tests/methods-schema.test.ts`, đọc `markers[].level`): `price` 99 là `warning`, 1000.5 là `error`; `title`/`englishTitle` có `*` là `error`; dữ liệu Giác hơi hợp lệ                                                      |
| `tests/treatment-i18n.test.ts` (mức 2)    | `localizeTreatment`: `vi` không lộ `en`; `en` dùng `en.*` và giữ `price`/`slug` chung; `en` thiếu mô tả hoặc không có thì `null`; `benefits`/`protocols` không rơi về tiếng Việt; `formatVnd` ra `299.000 ₫` và `VND 299,000` (NBSP)                  |
| `tests/treatment-schema.test.ts` (mức 2)  | `en` đủ tên và mô tả hợp lệ; `en` chỉ có tên thì `error` ở `en.description`; `en` rỗng hợp lệ                                                                                                                                                       |
| `tests/sanity.test.ts` (render trang)     | Mức 1: dòng phụ có `lang="en"`, chú thích `*` khi cờ bật, không `*` trong `<h1>`. Mức 2: `generateStaticParams` chỉ phát `(en, slug)` cho liệu pháp có bản dịch; `notFound()` khi `null`; `alternates.languages` có `vi`, `en` (tự tham chiếu) chỉ khi đủ bản dịch |
| `tests/email.test.ts`                     | `source` `/en/treatments/cupping` vẫn ra nhãn "Liệu pháp"; `treatment` là tên tiếng Việt                                                                                                                                                             |
| Sitemap                                   | Mỗi URL có đủ mục `vi`/`en` và mục tự tham chiếu; liệu pháp chưa dịch không có `en`                                                                                                                                                                  |
| Kiểm tay trên staging                     | Google Search Console (báo cáo quốc tế hoá) hoặc kiểm hreflang hai chiều bằng `curl`; mở `/en/treatments/<slug>` của liệu pháp chưa dịch phải 404; nút đổi ngôn ngữ ẩn đúng                                                                        |

## 7. Điều chưa kiểm chứng

1. **Cụm "Don't use automatic translation without review"**: không có nguyên văn trong các trang Google đã đọc (localized-versions, managing-multi-regional-sites, spam-policies, using-gen-ai-content, creating-helpful-content). Tôi chỉ trích những câu có thật ở 3.5. Nếu cần, phải tìm đúng trang, không suy diễn.
2. **Studio thật với hai plugin**: chưa cài vào repo; mới chỉ phân giải peer trong `/tmp`. Chưa biết hai bản `@sanity/util` (6.19.0 và 6.17.0 lồng) có gây lỗi lúc chạy Studio không.
3. **`LanguagePatch` gán `language` cho document có sẵn**: đọc từ source, chưa chạy.
4. **`benefits` (mảng chuỗi) và `protocols` (mảng object) với `sanity-plugin-internationalized-array`**: chưa thử.
5. **Marker mức `warning` cho `custom` trên trường object**: quan sát của `@sanity/validation` 6.17.0 qua `validateDocument` (`@beta`), chưa xem Studio có chặn publish hay không.
6. **`revalidatePath("/", "layout")` với hai root layout (R2)**: docs chỉ nói "Revalidating all data"; chưa chạy.
7. **Webhook phía Sanity** (bộ lọc `_type`) nằm ngoài repo; không xem được.
8. **`@language` trong JSON-LD với Google**: không có trang Search Central nào nêu; khuyến nghị chỉ dùng `inLanguage`.
9. **Cách Google xử lý `x-default` cho trang không có bộ chọn ngôn ngữ**: docs chỉ nêu cho "language/country selectors or auto-redirecting home pages"; đặt hay không là tuỳ chọn.
10. **Bộ định dạng giá trên trình duyệt**: `Intl.NumberFormat` chỉ chạy trên Node 24.21.0 (ICU 78.3); trình duyệt có thể khác, nên định dạng ở server.
11. **Số tệp đường dẫn nội bộ viết cứng (15)**: đếm bằng `grep`, có thể lệch vài tệp.
12. **Nội dung chú thích dấu `*` bằng tiếng Anh, chữ giao diện tiếng Anh**: chưa có từ owner.

## 8. Câu hỏi cho owner

1. Có làm bản tiếng Anh của website không, và khi nào? Nếu "chưa", #10 chỉ làm mức 1.
2. Tên hiển thị: tên tiếng Việt làm `h1`, tên tiếng Anh làm dòng phụ (khuyến nghị)? Hay cách khác?
3. Nếu có trong một hai quý tới, có muốn #10 dùng luôn `en: { title }` thay cho `englishTitle` (4.1)?
4. Chữ chú thích dấu `*` bằng tiếng Anh là gì (owner cung cấp)? Câu "chỉ chuyên viên có chứng nhận thực hiện" có được đăng không, khi `PRODUCT.md` ghi chứng chỉ nhân sự chưa xác nhận?
5. Ai cung cấp chữ giao diện tiếng Anh (nav, footer, form, thông báo lỗi, tiêu đề mục trên trang liệu pháp)? Chỉ mô tả bảng giá thì trang `en` sẽ rất mỏng.
6. Các trang nào có bản `en`: chỉ liệu pháp, hay cả trang chủ, dịch vụ, phương pháp, đặt lịch, ba trang pháp lý?
7. `heat-light` đang ghi giá 99: sửa thành 99000 theo bảng giá?
8. Chính sách URL cho tiếng Anh: `/en/...` (khuyến nghị, tiếng Việt giữ nguyên URL), hay tên miền con?
9. Khách nước ngoài gửi form: có chấp nhận số điện thoại ngoài `+84`/`0` (`lib/validation.ts:6`)?
