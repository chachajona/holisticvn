# Danh mục 11 liệu pháp và trang chi tiết `/treatments/[slug]` — thiết kế

Trạng thái: **đã được owner duyệt thiết kế và kế hoạch triển khai; code đã được triển khai trên nhánh `issue-10`, còn bước staging/production (cần token và xác nhận owner)**.
Liên quan: #10 (issue này), #1 (tracking), #8 (trang dịch vụ từ Sanity), #9 (nhóm phương pháp Sanity), #4 (kiểm kê nội dung). Nghiên cứu nền: [`treatment-detail-schema-research.md`](../../treatment-detail-schema-research.md), [`treatment-i18n-schema-research.md`](../../treatment-i18n-schema-research.md), [`methods-schema-research.md`](../../methods-schema-research.md), [`services-schema-research.md`](../../services-schema-research.md).

## 1. Bối cảnh và mục tiêu

Trang chi tiết liệu pháp đã render từ Sanity, nhưng:

- Chỉ có 5 liệu pháp trong dữ liệu fallback và 3 document trên production, trong khi bảng giá chính thức của owner (tiếng Việt và tiếng Anh, cấp 2026-10-09, ghi nhận ở `docs/CONTENT_INVENTORY.md`) có **11 liệu pháp**. Sáu liệu pháp chưa có document: Tapping, Xung kích, Điện xung, Sóng siêu âm, Điện châm, Nắn chỉnh cột sống.
- Ba document production có nội dung chưa ai duyệt: `seo.*` bằng tiếng Anh, cụm "lợi ích sức khỏe đã được chứng minh", "Tăng cường hệ miễn dịch", "An toàn và ít tác dụng phụ", và 6–7 bước quy trình mỗi document; `price` có đơn vị không nhất quán (99, 149000, 99000).
- Dữ liệu fallback trong `lib/content.ts` có tên tiếng Anh, `duration` và vài câu mô tả không có trong bảng giá (ví dụ "luôn được kết hợp cùng bài tập" ở IASTM, "Tăng tỉnh táo" ở Ngâm lạnh).
- Ba liệu pháp có dấu `*` (chỉ chuyên viên có chứng nhận thực hiện) chưa có chỗ hiển thị câu chú thích.

**Mục tiêu:** mỗi trong 11 liệu pháp có một trang chi tiết hiển thị đúng chữ và giá của owner, tên tiếng Việt làm `h1`, và vẫn đáp ứng ba tiêu chí chấp nhận của #10 (render an toàn khi thiếu optional fields và 404 thật; SEO từ CMS; form giữ đúng liệu pháp và `source`, thông báo thành công không xác nhận lịch).

**Thay đổi so với nội dung issue:** dòng "Không cần thêm giá chưa được owner xác nhận" của #10 được thay thế. Owner đã cho phép hiển thị giá theo đúng bảng giá (xác nhận trong hội thoại 2026-10-15). Phần "không có chức năng đặt khung giờ tự động" giữ nguyên.

## 2. Đã có sẵn trên nhánh `issue-10`

Không làm lại trong spec này:

- `protocols` render theo thứ tự `step`, step lỗi bị bỏ riêng; mục ẩn khi rỗng.
- `seo.title`, `seo.description`, `seo.ogImage` dùng cho metadata (`createMetadata` nhận thêm `image`).
- Ảnh tùy chọn: thiếu ảnh thì hero một cột, không dùng ảnh của liệu pháp khác; `imageAlt` lấy từ `image.alt`.
- Benefits, duration, description rỗng thì ẩn; slug lạ trả 404 thật.
- Tiêu đề liệu pháp giới hạn 120 ký tự (khớp `leadSchema.shape.treatment`).
- Test mapping trong `tests/sanity.test.ts`.

## 3. Quyết định đã chốt

| #   | Quyết định                                                                                                                                                                                             | Nguồn                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| 1   | Hiển thị giá theo bảng giá, **chỉ trên 11 trang liệu pháp**; giá dịch vụ trên `/services` (tư vấn, massage nhiều mức, tập luyện) để issue riêng.                                                       | Owner, 2026-10-15         |
| 2   | Tạo 6 liệu pháp còn thiếu **trong #10**, không tách issue.                                                                                                                                             | Owner, 2026-10-15         |
| 3   | `h1` là tên tiếng Việt; dòng phụ là tên tiếng Anh (`englishTitle`), ẩn khi trùng tên tiếng Việt. Khi sau này có trang tiếng Anh, `h1` là tên tiếng Anh và **không có** dòng phụ.                       | Owner, 2026-10-15         |
| 4   | Ba document production (Giác hơi, Ngâm lạnh, Đèn hồng ngoại): **ghi đè** mô tả, SEO, benefits theo chữ bảng giá; bỏ `protocols` và benefits cũ; sửa giá về số nguyên VND.                              | Owner, 2026-10-15         |
| 5   | `duration` không hiển thị (bảng giá không có thời lượng cho liệu pháp). Trường giữ trong schema, để trống.                                                                                             | Mặc định nhỏ, owner duyệt |
| 6   | Điện châm: nhóm thiết bị trên `/treatments`, nhóm trị liệu trên `/services`.                                                                                                                           | Mặc định nhỏ, owner duyệt |
| 7   | Giác hơi giữ nguyên chữ "giải độc cơ thể" của owner.                                                                                                                                                   | Mặc định nhỏ, owner duyệt |
| 8   | Liệu pháp mới không có benefits và protocols (bảng giá không có nguồn); hai mục tự ẩn.                                                                                                                 | Mặc định nhỏ, owner duyệt |
| 9   | Câu chú thích `*` dùng đúng chữ của owner: "Các dịch vụ trị liệu này chỉ được thực hiện và theo dõi bởi chuyên viên có chứng nhận và chứng chỉ chuyên môn." (Châm khô, Điện châm, Nắn chỉnh cột sống.) | Bảng giá, bản tiếng Việt  |
| 10  | Không làm i18n/routing `/en` trong #10 (chỉ `englishTitle`). Khi có bản tiếng Anh, dùng phương án B2 trong `treatment-i18n-schema-research.md`.                                                        | Research + owner          |
| 11  | Giữ trường `step` của `protocols` (bỏ `step` hoãn sang issue riêng); JSON-LD hoãn sang issue riêng.                                                                                                    | Mặc định nhỏ, owner duyệt |

## 4. Dữ liệu: 11 liệu pháp

Chữ mô tả là nguyên văn bảng giá bản tiếng Việt. `shortDescription` và `description` dùng cùng một câu (bảng giá chỉ có một câu mỗi liệu pháp, không bịa thêm). `price` là VND, số nguyên. `*` = `requiresCertifiedPractitioner: true`.

| Slug                            | Tên (`title`)      | `englishTitle`          | Giá (VND) | `*` | Mô tả (nguyên văn bảng giá, tiếng Việt)                                                                                                |
| ------------------------------- | ------------------ | ----------------------- | --------- | --- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `dry-needling` (có sẵn)         | Châm khô           | Dry Needling            | 299000    | có  | Tác động vào các điểm co cứng (trigger point) để giải phóng căng thẳng, giảm đau và phục hồi chức năng thần kinh – cơ.                 |
| `cupping` (có sẵn)              | Giác hơi           | Cupping                 | 99000     |     | Dùng áp suất trong ống giác hơi gây xung huyết tại chỗ để giải độc cơ thể và giải quyết một số cơn đau.                                |
| `iastm` (có sẵn)                | IASTM              | (trùng, ẩn)             | 199000    |     | Dùng dụng cụ chuyên dụng tác động lên mô mềm nhằm giải phóng, tăng lưu thông máu và cải thiện độ đàn hồi của cơ – fascia.              |
| `heat-light` (có sẵn)           | Đèn hồng ngoại     | Heat Light              | 99000     |     | Thư giãn cơ, giảm căng thẳng, thúc đẩy quá trình tự chữa lành của cơ thể.                                                              |
| `cold-plunge` (có sẵn)          | Ngâm lạnh          | Cold Plunge             | 149000    |     | Giúp giảm viêm, sưng và phục hồi sau vận động cường độ cao và cải thiện khả năng chịu đựng của hệ thần kinh.                           |
| `tapping` (mới)                 | Tapping            | (trùng, ẩn)             | 99000     |     | Hỗ trợ giúp điều chỉnh trương lực cơ, giảm sưng, cải thiện cảm nhận vận động và ổn định khớp trong quá trình phục hồi.                 |
| `shockwave` (mới)               | Xung kích          | Shockwave Therapy       | 349000    |     | Tái tạo mô, giảm đau tại chỗ nhanh chóng.                                                                                              |
| `bio-electric` (mới)            | Điện xung          | Bio-electric            | 349000    |     | Kích thích thần kinh – cơ bằng xung điện nhẹ nhằm giảm đau, tăng kích hoạt cơ và phục hồi kiểm soát vận động.                          |
| `therapeutic-ultrasound` (mới)  | Sóng siêu âm       | Therapeutic Ultrasound  | 349000    |     | Giảm đau, giải toả căng cơ, tăng tuần hoàn máu và thúc đẩy quá trình tự chữa lành của cơ thể.                                          |
| `electroacupuncture` (mới)      | Điện châm          | Electroacupuncture      | 249000    | có  | Kết hợp châm kim với dòng điện nhẹ nhằm tăng hiệu quả giảm đau, thư giãn cơ và cải thiện lưu thông tuần hoàn.                          |
| `chiropractic-adjustment` (mới) | Nắn chỉnh cột sống | Chiropractic Adjustment | 299000    | có  | Kỹ thuật huy động và nắn chỉnh khớp cột sống giúp cải thiện cân bằng, giảm chèn ép, tăng khả năng linh hoạt và tối ưu cảm nhận cơ thể. |

Đối chiếu từng chữ với ảnh bảng giá là bước kiểm tra bắt buộc khi viết `treatments.json` (mục 10).

Ghi chú: tên tiếng Việt của IASTM trong bảng giá là "IASTM - cạo mạc"; tiêu đề trang dùng "IASTM", cụm "cạo mạc" không đưa vào tiêu đề vì chữ mô tả đã đủ nghĩa. Owner có thể đổi.

## 5. Schema `treatment` (Sanity)

Chỉ thay đổi trong `sanity/schemaTypes/index.ts`:

- `price`: `number`, `rule.integer().min(0)`, Mô tả trong Studio: "VND, nhập số nguyên, ví dụ 149000".
- `englishTitle`: `string`, tùy chọn, mô tả: "Tên quốc tế của kỹ thuật, hiện làm dòng phụ dưới tên tiếng Việt; bỏ trống nếu trùng".
- `requiresCertifiedPractitioner`: `boolean`, `initialValue: false`, mô tả: "Hiện câu chú thích chỉ chuyên viên có chứng nhận thực hiện".
- `slug`: thêm `rule.custom` kiểm `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- `image.alt`: bắt buộc khi đã có `asset` (đọc `parent`), không bắt buộc khi chưa có ảnh.
- `seo.title`, `seo.description`: đổi `max()` thành `warning()` ở 60 và 160 ký tự (không có nguồn chính thức cho hai con số; xem `treatment-detail-schema-research.md`).
- Giữ nguyên: `isPopular`, `duration`, `benefits`, `protocols`, `seo.ogImage`.

`lib/sanity.ts` và `lib/content.ts`:

- `Treatment` thêm `englishTitle?: string`, `requiresCertifiedPractitioner: boolean`; `price?: number` giữ.
- `treatmentSchema` (zod): `price` là `z.number().int().nonnegative().optional().catch(undefined)`; `englishTitle` là `optionalText`; `requiresCertifiedPractitioner` là `z.boolean().catch(false)`.
- GROQ thêm `englishTitle`, `requiresCertifiedPractitioner`; `price` giữ trong projection.

## 6. Trang chi tiết

Trong `app/treatments/[slug]/page.tsx` (và CSS module hiện có, nếu đã được tách):

- `h1`: `title`. Ngay dưới (hoặc trong khối tiêu đề): `englishTitle` làm dòng phụ khi có và khác `title` (so sánh không phân biệt hoa thường, bỏ khoảng trắng đầu cuối).
- Dòng giá khi `price` có: `new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })`, ví dụ "149.000 ₫". Nhãn: "Giá". Không có nhãn "từ", không có "ưu đãi".
- Chú thích `*` khi `requiresCertifiedPractitioner`: dòng chữ nguyên văn mục 3 #9, đặt gần dòng giá, không chỉ dựa vào màu hay dấu `*` đơn lẻ.
- Thời lượng: **không hiển thị**, kể cả khi trường `duration` có giá trị (bỏ dòng "Thời lượng gợi ý").
- Phần "Điều bạn có thể mong đợi" giữ như hiện nay; chữ nền tĩnh này không có nguồn riêng nên kiểm lại ở mục 9.
- Metadata: không đổi so với nhánh `issue-10`.
- Form: `LeadForm kind="booking" treatment={treatment.title}`, giữ nguyên hành vi. Email nhân viên nhận tên tiếng Việt.

## 7. Seed, liên kết và production

Theo quy ước của #8 và #9 (`docs/SERVICES_VERIFICATION.md`, `docs/METHODS_VERIFICATION.md`): staging trước, sao lưu trước khi ghi production, tham chiếu gắn sau khi seed có kiểm tra phiên bản.

1. **Seed gồm 11 document** trong `scripts/seed/treatments.json` (nguồn dữ liệu duy nhất), mỗi document `_id: "treatment-<slug>"`. `scripts/sync-treatments.mjs` tạo document chưa có (`createIfNotExists`, `_id: treatment-<slug>`), patch document đã có theo slug (điểm 2) và gắn tham chiếu nhóm (điểm 3) trong một giao dịch, mặc định dry-run, theo quy ước `--project/--dataset/--apply/--confirm` của `scripts/transform-legacy-content.mjs`. Lý do thay lệnh CLI `npx sanity documents create ... --missing`: một công cụ, có dry-run và kiểm tra phiên bản; CLI không có dry-run và chưa kiểm chứng việc nhận mảng nhiều document.
2. **Ba document production có sẵn** (`cupping`, `cold-plunge`, `heat-light`) giữ nguyên `_id`: script chỉ patch chúng theo slug và không bao giờ tạo mới (tạo mới sẽ sinh bản trùng slug). Patch theo slug: đặt `title`, `englishTitle`, `shortDescription`, `description`, `price`, `requiresCertifiedPractitioner`, `seo` (xoá), `benefits` và `protocols` (xoá), mỗi patch kèm `ifRevisionID`. Sao lưu document trước khi patch vào `.context/treatments-before-<dataset>-<UTC timestamp>.json` (một file cho mỗi lần apply, không bao giờ ghi đè; chỉ sao lưu các document mà lần chạy đó thay đổi; không commit nếu chứa nội dung riêng).
3. **Tham chiếu nhóm** (gắn sau seed, bằng script tìm `_id` theo slug rồi patch `methodsPage` và `servicesPage` với revision guard):
   - `methodsPage`: `manual` = dry-needling, cupping, iastm, tapping, chiropractic-adjustment; `electro` = shockwave, bio-electric, therapeutic-ultrasound, electroacupuncture; `cold` = cold-plunge; `infrared` = heat-light.
   - `servicesPage`: `therapy` = dry-needling, cupping, iastm, tapping, chiropractic-adjustment, shockwave, bio-electric, therapeutic-ultrasound, electroacupuncture; `recovery` = heat-light, cold-plunge; `training` = rỗng.
4. **Ghi lên production chỉ sau khi owner xác nhận lại ở bước triển khai** (kết quả staging và bản sao lưu được đính kèm). Spec này không cấp quyền ghi production.
5. Revalidate: webhook hiện có đã bao `treatment`; kiểm lại filter webhook trên Sanity Manage có `treatment`, `methodsPage`, `servicesPage` (xem `methods-schema-research.md`), vì filter nằm ngoài repo.

## 8. Dữ liệu fallback (`lib/content.ts`)

- `treatments` mở rộng thành 11 mục theo bảng mục 4: đổi `title` sang tiếng Việt, thêm `englishTitle`, `price`, `requiresCertifiedPractitioner`, bỏ `duration`, `benefits` và mô tả cũ không có nguồn (thay bằng chữ bảng giá); ảnh dùng ảnh clinic hiện có (`TreatmentBeds`, `Cupping`, `Iastm`, `Infrared`, `ColdPlungeTub`) hoặc bỏ trống nếu chưa có ảnh phù hợp (không dùng ảnh nhận diện được mặt người; xem `docs/CONTENT_INVENTORY.md`). Liệu pháp mới không có ảnh thì trang chi tiết hiển thị hero một cột.
- `serviceGroups` và `methods` fallback: cập nhật danh sách `treatments` theo mục 7 điểm 3.
- Các test hiện có kiểm liên kết fallback (`tests/methods-fallback.test.tsx`, `tests/services-fallback.test.ts`, `tests/methods-render.test.tsx`) được cập nhật theo danh sách mới.

## 9. Ngoài phạm vi

- i18n và routing `/en` (chỉ `englishTitle`); xem `treatment-i18n-schema-research.md`.
- JSON-LD cho trang liệu pháp (hoãn; nếu làm sau, không đọc `price` và dùng `WebPage` + `Service` theo `treatment-detail-schema-research.md`).
- Giá dịch vụ trên `/services` (tư vấn 199k, massage 650k/850k, nắn chỉnh, tập luyện 450k/650k): cần schema nhiều mức giá; issue riêng.
- Bỏ trường `step` của `protocols`.
- Đặt khung giờ tự động.
- Hiển thị thời lượng liệu pháp (chờ nguồn từ owner).
- Review sao/aggregate trên từng trang liệu pháp.

## 10. Test và xác minh

**Test tự động** (mẫu `tests/sanity.test.ts`, `tests/methods-schema.test.ts`):

- Mapping và mặc định: `price` số nguyên được giữ; `price` âm hoặc không phải số bị bỏ; `englishTitle` rỗng bị bỏ; `requiresCertifiedPractitioner` mặc định `false`.
- Trang: dòng phụ chỉ hiện khi `englishTitle` khác `title`; dòng giá hiển thị đúng ("149.000 ₫"); không có dòng giá khi thiếu `price`; chú thích `*` hiện đúng chữ owner khi cờ bật và không hiện khi tắt; `duration` có giá trị cũng không hiển thị.
- Schema: `validateDocument` với slug sai định dạng báo lỗi; `alt` thiếu khi có `asset` báo lỗi; SEO dài chỉ báo `warning`; `price` thập phân hoặc âm báo lỗi.
- Seed: `treatments.json` có đúng 11 document với slug duy nhất, giá và cờ `*` khớp bảng ở mục 4, `_id` đúng định dạng.
- Fallback: mọi `slug` trong liên kết nhóm tồn tại trong `treatments`; 11 slug duy nhất.

**Xác minh thủ công và bằng chứng** (đính kèm PR, theo tiêu chí #10):

- Đối chiếu từng chữ và giá trong `treatments.json` và trang với ảnh bảng giá (tiếng Việt và tiếng Anh).
- Staging: document đầy đủ, thiếu optional fields, slug lạ; dry run lần hai không lập kế hoạch tạo mới nào và chỉ còn các patch idempotent; trang `/treatments` và `/services` liên kết đủ 11 trang.
- Giá và chú thích `*` hiển thị đúng ở desktop 1280, 768 và mobile 375; bàn phím; không cuộn ngang.
- Gửi form thật trên staging cho một liệu pháp có dấu `*` và một liệu pháp không có; email có dòng "Liệu pháp" đúng tên tiếng Việt.
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

## 11. Rủi ro và điểm mở

- **Ghi đè production** (mục 7 điểm 2 và 4) là thay đổi ngoài repo và khó đảo ngược nếu thiếu sao lưu; vì vậy bắt buộc staging trước, sao lưu và xác nhận riêng.
- **Câu chú thích `*`** và **chữ "giải độc cơ thể"** (Giác hơi) là tuyên bố của owner chép nguyên văn; không có nguồn độc lập. Owner đã duyệt hiển thị nhưng nên ghi nhận vào `docs/CONTENT_INVENTORY.md` khi triển khai.
- **Thay đổi ngoài ý định trên worktree:** `app/treatments/[slug]/page.tsx` đã import `treatment-detail.module.css`, và CSS `.treatment-*` đã bị xoá khỏi `app/globals.css` (không do spec này); cần xác nhận đây là việc của một phiên khác trước khi triển khai, để tránh ghi đè lẫn nhau. Hai tài liệu `design-plans/treatment-detail-*.md` chưa theo dõi có thể ảnh hưởng bố cục mục 6.
- **Tên của IASTM** trong bảng giá là "IASTM - cạo mạc"; tiêu đề dùng "IASTM" (mục 4); owner có thể đổi.
- **Sức nặng nội dung của trang** khi liệu pháp mới chỉ có một câu mô tả và giá: trang sẽ mỏng hơn ba trang production cũ. Chấp nhận trong #10; bổ sung nội dung đã duyệt là việc của owner.
- **Tham chiếu nhóm** phụ thuộc `_id` production chưa biết; script tìm theo slug và dừng nếu không tìm thấy hoặc tìm thấy hơn một document cho cùng slug.
