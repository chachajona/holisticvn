# Cảm nhận khách hàng và điểm Google trong Sanity — thiết kế

Trạng thái: **bản nháp chờ owner duyệt** (2026-10-10). Chưa có code Sanity nào được viết theo spec này.
Issue: #38. Liên quan: #1 (tracking), #4 (xác nhận nội dung), #7 (nghiệm thu homepage), #15 (homepage singleton, có mục "nối testimonials"), #17 (cập nhật public pages sau publish), #20 (import legacy vào staging), #37 (danh mục dịch vụ; dùng lại thiết kế `image.credit`).

## 1. Bối cảnh

Section "Khách hàng nói gì" trên homepage hiện đọc dữ liệu cố định trong code:

| Thành phần                         | Nguồn hiện tại                                                          |
| ---------------------------------- | ----------------------------------------------------------------------- |
| 5 thẻ review (quote, tên, sao)     | mảng `testimonials` trong `lib/content.ts`, import thẳng vào `app/page.tsx` |
| Điểm 5.0, số review, link Google   | `reviewSummary` trong `lib/content.ts` (đọc tay ngày 2026-10-09: 645)   |
| Ảnh thẻ lớn                        | `/images/Studio.jpg` viết cứng trong `app/page.tsx`                     |
| Cụm nhấn mạnh trong quote          | trường `highlight` trong `lib/content.ts`, test kiểm tra là chuỗi con   |

Sanity đã có document `testimonial` (`quote`, `context`, `avatar`, `rating`) và `getTestimonials()` trong `lib/sanity.ts`, nhưng **trang chủ không gọi hàm này**: chỉnh testimonial trong Studio hiện không đổi gì trên site.

Quy tắc nội dung đã chốt (xem `docs/CONTENT_INVENTORY.md`, mục "Google review excerpts"):

- Chỉ dùng trích đoạn **nguyên văn** từ review thật trên Google; "…" đánh dấu chỗ cắt; mỗi review ghi nguồn và ngày đọc.
- Phần trích **hiển thị** không nói về kết quả điều trị (đau, hồi phục, cải thiện). Nếu review gốc có nói ở phần bị cắt (như thẻ lớn hiện tại), phải ghi lại trong `note` của document.
- Không dùng ảnh hay avatar của khách: quy tắc "không lộ mặt" của owner (2026-10-09) và quyền ảnh thuộc người đăng.
- Điểm số/số review chỉ là con số đã đọc từ listing, không suy ra từ vài review.

## 2. Mục tiêu và ngoài phạm vi

Mục tiêu: editor chọn, sắp xếp và chỉnh phần hiển thị của review trong Studio; homepage phản ánh sau publish mà không sửa code; không thể publish review thiếu nguồn hoặc có nội dung kết quả điều trị.

Ngoài phạm vi:

- Tự động kéo review từ Google (Places API). Ghi ở mục 3 như hướng sau; cần key, chi phí và điều khoản hiển thị, nên là issue riêng.
- Ảnh khách. Spec chỉ chừa trường tùy chọn có khoá consent (mục 4); không bật cho tới khi owner đổi quy tắc "không lộ mặt".
- Trang `/reviews` hoặc review ở trang dịch vụ.
- Đa ngôn ngữ (#29).

## 3. Các hướng đã cân nhắc

**A. Mở rộng document `testimonial` hiện có (đề xuất).** Thêm trường nguồn, hiển thị và opt-in. Ít schema mới, giữ query, zod schema và script import hiện có.

**B. Tạo type mới `googleReview`.** Sạch về khái niệm nhưng để hai type testimonial song song, dễ lệch và thêm một chỗ cần dọn.

**C. Giữ dữ liệu trong code, chỉ viết quy trình.** Không rủi ro, nhưng owner không tự đổi review và tình trạng `getTestimonials()` không dùng vẫn còn.

**D. Kéo review qua Google Places API.** Luôn mới, nhưng cần API key và billing, thường chỉ trả vài review, phải tuân điều khoản hiển thị của Google, và không cho chọn review không có nội dung kết quả điều trị. Để sau.

Chọn **A**.

## 4. Schema

Mở rộng `testimonial` (`sanity/schemaTypes/index.ts`):

| Trường                | Kiểu                         | Ghi chú                                                                                                                    |
| --------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `quote`               | text (có sẵn)                | Trích đoạn nguyên văn, kể cả "…". Bắt buộc.                                                                                |
| `highlight`           | string                       | Tuỳ chọn. Validation: phải là chuỗi con của `quote` (Studio custom rule và zod refine).                                    |
| `displayName`         | string                       | Dạng "Tên H." (tên + chữ cái cuối), tối đa 24 ký tự. Bắt buộc khi `source.type = google`.                                   |
| `rating`              | number, nguyên 1–5 (có sẵn)  | Bắt buộc khi `source.type = google`; lấy từ chính review, không suy ra từ điểm tổng.                                       |
| `source`              | object                       | `type`: `google`, `owner-collected`, `legacy`. `url` (link listing hoặc review), `readAt` (ngày đọc, bắt buộc với `google`). |
| `containsOutcomeClaim`| boolean (bắt buộc, mặc định `false`) | Editor xác nhận về **phần trích hiển thị** (`quote`). `true` thì không bao giờ hiện trên homepage. Thêm `note` (text) để ghi nếu review gốc có nói về kết quả ở phần bị cắt. |
| `showOnHome`          | boolean (mặc định `false`)   | Opt-in. Chỉ document bật mới được homepage đọc.                                                                            |
| `homeOrder`           | number, nguyên ≥ 1           | Bắt buộc khi `showOnHome`; không trùng giữa các document đang bật. Số nhỏ nhất là thẻ lớn.                                 |
| `photo` (tuỳ chọn)    | image + `consent` + `credit` | Chừa chỗ, tắt mặc định. `consent` (`grantedBy`, `grantedAt`, `note`) và `credit` dùng cùng cấu trúc `image.credit` của #37. Cần `alt`. |
| `context`, `avatar`   | giữ nguyên                   | Đánh dấu deprecated; homepage không đọc. Code hiện tại đang nhét "Tên, Google" vào `context` để tách ra khi hiển thị; sau khi nối Sanity, tên và nguồn lấy từ `displayName` và `source.type`. |

Validation khi publish một review `showOnHome`: có `source.type`, `quote`, `displayName`, `rating` (nếu `google`), `homeOrder`; `containsOutcomeClaim = false`; `highlight` hợp lệ; nếu có `photo` thì bắt buộc có `consent` và `alt`.

Dữ liệu legacy (import từ site cũ qua `scripts/migrate-legacy.mjs` và `scripts/transform-legacy-content.mjs`) không có `source` và `showOnHome`, nên **mặc định không bao giờ hiện**. Không đổi script import; chỉ cần schema và query không coi chúng là hợp lệ.

### Điểm Google (`reviewSummary`)

Chuyển vào `siteSettings` (singleton đã có) thành object `googleRating`: `average`, `count`, `url`, `readAt`. Editor cập nhật tay khi đọc lại listing. Không có `readAt` hoặc thiếu trường thì dùng giá trị fallback trong `lib/content.ts`. Spec không xây tự cập nhật (mục 3, hướng D).

## 5. Query, zod và hiển thị

Query mới trong `lib/sanity.ts` (`getHomeTestimonials`), thay vai trò của `getTestimonials()` cho homepage:

```groq
*[_type == "testimonial" && showOnHome == true && source.type == "google"
  && containsOutcomeClaim != true] | order(homeOrder asc)[0...5]{
  quote, highlight, displayName, rating,
  "sourceType": source.type, "sourceUrl": source.url
}
```

Giới hạn 5 phần tử vì bố cục là một thẻ lớn và bốn thẻ nhỏ. zod chặn lần hai những gì GROQ không đảm bảo: `highlight` không phải chuỗi con của `quote` thì bỏ `highlight` (không bỏ cả thẻ); thiếu `displayName` hoặc `rating` thì bỏ thẻ; `source.type` khác `google` thì bỏ thẻ. Trường ảnh nếu bật phải khớp `^https://cdn\.sanity\.io/`, như `treatment`.

Hành vi theo trạng thái dữ liệu (theo quy ước của `fetchRecords`: dataset đã cấu hình là nguồn chuẩn):

| Trạng thái                                   | Kết quả                                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Sanity chưa cấu hình (dev local)             | Dùng mảng fallback trong `lib/content.ts` (5 review đã duyệt).                           |
| Dataset có đủ 1–5 review hợp lệ              | Thẻ đầu là thẻ lớn; số thẻ nhỏ theo số review (0–4); lưới tự co.                         |
| Dataset cấu hình nhưng **không có** review hợp lệ | Ẩn lưới thẻ; giữ tiêu đề và badge điểm Google. Không rơi về fallback, không hiện legacy. |
| Lỗi mạng hoặc phản hồi sai định dạng         | Giữ hành vi hiện tại của `fetchRecords` (lỗi rõ ràng); ISR giữ bản trang cũ đến lần revalidate kế. |

Ảnh thẻ lớn: dùng `photo` nếu có và hợp lệ, không thì `/images/Studio.jpg` (ảnh của clinic).

Revalidate: webhook hiện có gọi `revalidatePath("/", "layout")` nên đã phủ homepage (#17); không cần endpoint mới.

## 6. Seed và import

Script `scripts/seed-testimonials.mjs`, idempotent, chỉ chạy trên staging:

- `_id` cố định `testimonial.google.<slug>` (ví dụ `testimonial.google.giang-t`), `createIfNotExists` rồi patch các trường do script sở hữu; không ghi đè trường editor đã sửa (kiểm tra revision như script hiện có).
- Dữ liệu gốc: bảng "Google review excerpts" trong `docs/CONTENT_INVENTORY.md`, kèm `source.url`, `source.readAt = 2026-10-09`, `rating`, `homeOrder`, `containsOutcomeClaim = false`.
- Ba review đã gỡ (Thái Đ., Thanh X., Nhi L.) được nạp với `showOnHome = false` và `containsOutcomeClaim = true` để editor thấy lý do, không để mất.
- Cần token ghi Sanity do owner cấp (HITL); không đưa token vào repo. Production chờ #20 và #27.

## 7. Xử lý lỗi và kiểm thử

- Test vitest (kiểu `tests/footer-links.test.ts`):
  - Mảng fallback thoả cùng quy tắc: có `rating`, `displayName` dạng "Tên H.", `highlight` là chuỗi con, `context` hay khoá không trùng.
  - zod bỏ thẻ thiếu `rating`/`displayName`/`source.type`, và bỏ riêng `highlight` sai.
  - Dữ liệu legacy (không `source`, không `showOnHome`) bị loại.
  - Homepage với 0, 1 và 5 review không lỗi và không tràn bố cục.
- Thử trên staging: bật, tắt, đổi `homeOrder`, sửa `highlight`, đánh dấu `containsOutcomeClaim`; kiểm tra homepage 320/768/desktop và dataset trống.
- Checklist front-end: heading, link, tương phản và focus không đổi so với bản code hiện tại.

## 8. Câu hỏi cần owner trả lời

1. **Ảnh khách.** Có đổi quy tắc "không lộ mặt" cho riêng review có xin phép không? Nếu có, ai xin phép khách, lưu bằng chứng ở đâu (trường `consent.note`)?
2. **Ba quote cũ** (owner từng quyết "giữ"): giữ thành `source.type = owner-collected` kèm bằng chứng nguồn, hay bỏ hẳn? Hiện chúng đã gỡ khỏi homepage.
3. **Cách lấy review:** tiếp tục chọn tay từ listing (spec này), hay mở issue riêng cho Places API?
4. **Ai chọn và cập nhật review, bao lâu một lần?** Đề xuất: đọc lại listing và cập nhật `googleRating` mỗi tháng, mỗi lần kiểm lại `containsOutcomeClaim`.
5. **Định dạng tên:** "Tên H." (như hiện tại) có đủ ẩn danh, hay chỉ ghi "Khách hàng trên Google"?
6. **Câu lưu ý** kiểu "Trải nghiệm có thể khác nhau ở mỗi người" có cần ở gần các review hay không (kể cả khi đã lọc nội dung kết quả điều trị)?
7. **Ai cấp token ghi staging** và upload ban đầu?

## 9. Thứ tự thực hiện đề xuất

1. Owner trả lời mục 8 (câu 1, 2 và 3 ảnh hưởng schema).
2. Mở rộng schema `testimonial`, thêm validation và test (không cần token).
3. Thêm `getHomeTestimonials`, zod và trạng thái rỗng; nối homepage; chuyển điểm Google vào `siteSettings`.
4. Script seed, chạy dry-run rồi staging.
5. Nghiệm thu theo mục 7; phối hợp với #15 nếu homepage singleton đã có (dùng lại document đó thay vì tạo thêm).
