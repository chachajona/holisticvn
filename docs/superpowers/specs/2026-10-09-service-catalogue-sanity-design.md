# Danh mục dịch vụ và phương pháp trong Sanity — thiết kế

Trạng thái: **bản nháp chờ owner duyệt** (2026-10-09). Chưa có code Sanity nào được viết theo spec này.
Liên quan: #1 (tracking), #8 (trang dịch vụ từ Sanity), #9 (nhóm phương pháp Sanity), #7 (nghiệm thu homepage), #15 (homepage singleton), #20 (import media vào Sanity staging).

## 1. Bối cảnh

Ba nơi đang tự giữ danh sách dịch vụ riêng, nên tên gọi và ảnh dễ lệch nhau:

| Nơi                               | Nguồn dữ liệu hiện tại                                          |
| --------------------------------- | --------------------------------------------------------------- |
| Carousel "Dịch vụ nổi bật" (home) | `carouselServices` viết cứng trong `app/page.tsx` (8 thẻ)       |
| `/services`                       | `categories` và `dives` viết cứng trong `app/services/page.tsx` |
| `/treatments`                     | `methods` viết cứng trong `app/treatments/page.tsx` (5 nhóm)    |
| Footer                            | `footerServices`, `footerMethods` trong `lib/content.ts`        |

Sanity đã có `service` (có `isPrimary`) và `treatment` (có `price`, `isPopular`, `image` kèm `alt`, `benefits`, `protocols`), nhưng chỉ điều khiển `/treatments/[slug]` và sitemap. `lib/sanity.ts` chỉ chấp nhận ảnh từ `cdn.sanity.io`, ảnh khác rơi về `/images/Iastm.jpg`. Khi Sanity đã cấu hình, dataset trống nghĩa là không có gì để hiển thị; dữ liệu mẫu chỉ dùng ở local.

Quyết định của owner ngày 2026-10-09, đã áp dụng vào code hardcode:

- Tên gọi theo bảng giá của phòng khám (16 mục, nhóm: tư vấn, trị liệu thủ thuật tay, tập luyện, trị liệu bổ sung).
- Ngâm lạnh và đèn hồng ngoại là hai dịch vụ khác nhau, nên `/treatments` có **5 nhóm** thay vì 4. Điều này trái với #9 ("giữ bốn nhóm", "không tự thêm phương pháp thứ năm"); cần cập nhật #9 theo quyết định này.
- Chỉ dùng ảnh của phòng khám hoặc ảnh có giấy phép; nguồn từng ảnh ghi ở "Image Provenance" trong `PRODUCT.md`.

## 2. Mục tiêu và ngoài phạm vi

Mục tiêu: một danh mục dịch vụ/liệu pháp duy nhất trong Sanity để carousel homepage, `/services`, `/treatments` và footer cùng đọc, kèm nguồn gốc ảnh nằm trong CMS.

Ngoài phạm vi:

- Page builder hoặc route chi tiết dịch vụ mới (giữ như #8).
- Hiển thị giá. Trường `price` có sẵn nhưng không render cho tới khi owner duyệt (đồng nhất với #10).
- Nội dung nhóm phương pháp (tiêu đề, thân bài, tag, ảnh nhóm). Phần này thuộc #9; spec này chỉ cung cấp trường `group` để liên kết.
- Chuyển ngôn ngữ Việt/Anh (#29).

## 3. Các hướng đã cân nhắc

**A. Mở rộng document `treatment` hiện có (đề xuất).** Thêm vài trường, dùng chung cho 16 mục trong bảng giá. Ít schema mới nhất, tận dụng query, zod schema và trang `/treatments/[slug]` đã có.

**B. Tạo type mới `catalogueItem`.** Sạch về khái niệm nhưng trùng dữ liệu với `treatment` (tên, mô tả, ảnh) và tạo thêm một nơi để lệch.

**C. Giữ hardcode, chỉ ghi tài liệu.** Không rủi ro, nhưng owner không tự thay ảnh/tên được và tình trạng lệch tên sẽ lặp lại.

Chọn **A**.

## 4. Schema

Mở rộng `treatment` (`sanity/schemaTypes/index.ts`):

| Trường          | Kiểu                      | Ghi chú                                                                                                                  |
| --------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `group`         | string, danh sách cố định | `consult`, `manual`, `electro`, `rehab`, `cold`, `infrared`; bắt buộc. Khớp `methodAnchor`.                              |
| `isFeatured`    | boolean (mặc định false)  | Thay vai trò của `isPopular` cho carousel; `isPopular` giữ nguyên, không đổi nghĩa.                                      |
| `featuredOrder` | number, nguyên, ≥ 1       | Chỉ bắt buộc khi `isFeatured`; không trùng giữa các mục nổi bật (validation).                                            |
| `image.credit`  | object                    | `sourceType` (`clinic-photo`, `fanpage`, `customer-licensed`, `stock`), `sourceUrl`, `author`, `license`, `retrievedAt`. |
| `image.alt`     | string (có sẵn)           | Bắt buộc khi `isFeatured`.                                                                                               |

Quy tắc validation: mục nổi bật phải có ảnh, `alt` và `image.credit.sourceType`. `sourceType = stock` hoặc `customer-licensed` bắt buộc có `license`. Không cho publish ảnh chưa ghi nguồn.

`service` (ba nhóm của `/services`) do #8 xử lý; spec này không đổi nó.

## 5. Luồng dữ liệu

```
Sanity treatment ──GROQ──▶ zod (lib/sanity.ts) ──▶ getFeaturedTreatments()
                                                      ├─▶ carousel homepage (theo featuredOrder)
                                                      ├─▶ /services (liên kết liệu pháp, qua #8)
                                                      └─▶ footer / /treatments (qua #9)
```

- Query: `*[_type == "treatment" && isFeatured == true] | order(featuredOrder asc){…}`.
- Link của thẻ suy ra từ `group`: `/treatments#mtd-<group>`; riêng `consult` trỏ `/booking`. Bảng ánh xạ này nằm ở một nơi trong `lib/content.ts`. Hiện homepage còn trộn `/services#svc-therapy` và `/treatments#mtd-manual` cho cùng nhóm thủ công; quy tắc mới bỏ sự lệch đó.
- Fallback khi Sanity chưa cấu hình: danh sách 8 thẻ hiện tại chuyển từ `app/page.tsx` sang `lib/content.ts` (cùng chỗ với `treatments` fallback), dùng ảnh trong `public/images`.
- Khi Sanity đã cấu hình nhưng trả về 0 mục nổi bật: ẩn section carousel thay vì hiển thị khung trống.
- Ảnh từ Sanity đi qua `next/image` (đã có `cdn.sanity.io` trong `remotePatterns`); ảnh thiếu dùng ảnh fallback của chính mục đó, không dùng `Iastm.jpg` chung.

## 6. Nạp dữ liệu và ảnh

- Script `scripts/seed-catalogue.mjs`, theo mẫu `transform-legacy-content.mjs`: dry-run mặc định, bắt buộc `--project` và `--dataset`, ghi thật cần `--apply --confirm PROJECT_ID/dataset`.
- Idempotent: `_id` cố định dạng `treatment.<slug>`, dùng `createOrReplace` chỉ cho các trường do script sở hữu, không ghi đè nội dung biên tập viên đã sửa (kiểm tra revision như script hiện có).
- Dữ liệu gốc: bảng giá 16 mục (tên, mô tả, nhóm, thời lượng). `price` được nạp nhưng không render.
- Ảnh: script tải `public/images/<file>` lên Sanity assets, gán `alt` và `image.credit` theo bảng provenance. Chỉ chạy trên staging trước; production chờ #20/#27.
- Cần token ghi Sanity do owner cấp (HITL); không đưa token vào repo.

## 7. Xử lý lỗi và kiểm thử

- zod giữ cách hiện tại: trường lỗi rơi về giá trị mặc định, mục thiếu `slug`/`title` bị bỏ qua, không làm hỏng trang.
- Kiểm thử (vitest, theo kiểu `tests/footer-links.test.ts`):
  - Mỗi `group` trừ `consult` có anchor tương ứng trong `methodAnchor` và mục footer.
  - Danh sách fallback của carousel khớp dữ liệu seed (cùng slug, cùng thứ tự).
  - Mapping `group` → href đều dẫn tới id có thật trên `/services` hoặc `/treatments`.
  - Validation: mục nổi bật thiếu ảnh/alt/nguồn bị từ chối.
- Thử trên staging: publish đổi tên, đổi thứ tự và thay ảnh một mục; kiểm tra homepage, `/treatments`, footer, và dataset trống/sai reference.

## 8. Câu hỏi cần owner trả lời

1. "Corrective exercise 1-1" đã bị thay bằng "Tập luyện phục hồi & tăng cường" theo bảng giá. Giữ tên mới hay dùng lại tên cũ?
2. Năm nhóm phương pháp (tách ngâm lạnh và hồng ngoại) có được duyệt chính thức không, để cập nhật #9?
3. Có công khai giá trên website không? Nếu có, hiển thị ở đâu (thẻ, trang liệu pháp, hay không)?
4. Ảnh cần bổ sung, theo thứ tự ưu tiên: ảnh massage trị liệu đang diễn ra; ảnh gốc bồn ngâm lạnh (ảnh hiện tại chỉ ~550 px); ảnh dry needling; ảnh hero cho `/services` và `/treatments` (hiện là ảnh stock).
5. Ai upload ảnh lên Sanity và cấp token ghi cho staging?

## 9. Thứ tự thực hiện đề xuất

1. Owner trả lời mục 8.
2. Mở rộng schema `treatment`, thêm validation và test (không cần token).
3. Chuyển fallback carousel sang `lib/content.ts`, thêm `getFeaturedTreatments()`, nối homepage.
4. Script seed + upload ảnh, chạy dry-run rồi staging.
5. Nối `/services`, `/treatments` và footer vào danh mục (hoàn tất cùng #8 và #9).
