# Nghiệm thu email yêu cầu gọi lại — issue #5

GitHub issue #1 và các issue con vẫn là nguồn trạng thái công việc. File này ghi bằng chứng nghiệm thu; chưa điền đủ mục **Live** thì chưa đóng #5.

## Phạm vi và khái niệm

- **Provider acceptance:** Resend nhận yêu cầu gửi và trả message id. Website chỉ báo thành công ở bước này.
- **Nhân viên đã nhận/đọc:** khác với provider acceptance. Email có thể vào Spam hoặc chưa ai mở.
- **Lịch hẹn đã xác nhận:** chỉ xảy ra sau khi nhân viên gọi khách, nhập lịch vào hệ thống cửa hàng và xác nhận trực tiếp.
- Website không lưu dữ liệu khách (không còn Supabase hay CRM), không gửi Zalo OA tự động và không tạo lịch hẹn.
- Cơ sở duy nhất là Lê Quốc Hưng nên email không có trường chi nhánh (#4).
- Owner đã duyệt bỏ dòng "Nguồn" khỏi email thông báo. Loại yêu cầu (tiêu đề đầu thư) và dòng **Liệu pháp** vẫn phân biệt các form; nhân viên không còn thấy đường dẫn trang của yêu cầu.

## Failure paths — đã kiểm tra

Kiểm tra ngày 2026-10-07 bằng dev server cục bộ và Playwright. Dùng dữ liệu giả `Test Nguoi Kiem`, `0901234567`. Không có email thật nào được gửi và không có dữ liệu khách thật.

| Tình huống     | Cách tạo                  | API  | Booking form (`LeadForm`)                                               | Hero (`Tư vấn ngay`)                  |
| -------------- | ------------------------- | ---- | ----------------------------------------------------------------------- | ------------------------------------- |
| Thiếu cấu hình | Không có env Resend/Redis | 503  | Báo lỗi, giữ tên và số, có link `tel:`, không hiện thông báo thành công | Toast lỗi, giữ số, có link "Gọi ngay" |
| Resend từ chối | Giả lập phản hồi 502      | 502  | Như trên                                                                | Như trên                              |
| Mạng lỗi       | Chặn request `/api/leads` | none | Báo lỗi (`Chưa gửi được yêu cầu`), giữ dữ liệu, có link `tel:`          | Như trên                              |

`/contact` và trang liệu pháp dùng cùng `LeadForm` với `/booking`.

Code path đã có test: `tests/api-leads.test.ts` (400, honeypot, 503, 502, 429, limiter lỗi, chỉ báo 200 sau khi provider nhận) và `tests/email.test.ts` (nội dung email, escape HTML, cấu hình thiếu, provider từ chối). Repo không còn Supabase nên không có lead nào được ghi vào database.

## Live — cần người vận hành điền

Dùng email/số điện thoại do người kiểm tra kiểm soát. Không dán API key vào đây. Ảnh chụp hộp thư (đã che số điện thoại) nằm trong mô tả PR #36, không lưu trong repo.

Lượt gửi ngày 2026-10-08 từ `https://www.holisticvn.com` (production, chưa có staging riêng). Cả 4 form trả `200` và báo thành công, tức Resend đã nhận. Người nhận là hộp thư của người kiểm tra.

| Điều kiện                                   | Kết quả                                                                                                        |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Domain gửi **Verified** trên Resend         | Đạt: Resend nhận gửi từ `noreply@holisticvn.com`; DNS có DKIM và SPF. **Chưa có DMARC**                        |
| API key giới hạn quyền gửi; from, to đã đặt | Đạt: key chỉ gửi được (đọc log qua API bị từ chối `restricted_api_key`); from và to đã đặt ở Production        |
| Redis (`UPSTASH_REDIS_REST_*`)              | Đã đặt ở Production; Preview chưa đặt nên form ở bản preview trả 503. Chưa xác nhận database riêng cho staging |

| Nguồn           | Giờ gửi (VN)     | Resend message id                      | Inbox / Spam                          | Subject đúng | Có loại yêu cầu và liệu pháp (nếu có)        |
| --------------- | ---------------- | -------------------------------------- | ------------------------------------- | ------------ | -------------------------------------------- |
| Hero            | 08/10/2026 16:23 | Chưa ghi                               | **Spam** (Gmail: giống thư rác trước) | Chưa ghi     | Có: "Tư vấn nhanh"                           |
| `/booking`      | 08/10/2026 16:23 | `01a11ad3-3623-7ee5-b55b-945d06a33504` | Inbox                                 | Có           | Có: "Yêu cầu đặt lịch"                       |
| `/contact`      | 08/10/2026 16:23 | `01a11ad3-3c00-77e7-9f39-80fc46511709` | Inbox                                 | Có           | Có: "Yêu cầu tư vấn"                         |
| Trang liệu pháp | 08/10/2026 16:52 | `01a11aed-d97e-7b79-872d-ef343a5685c2` | **Không nhận được ở hộp thư thử**     | Chưa ghi     | Có: "Liệu pháp: Giác hơi" (xem trong Resend) |

Kết quả cần xử lý:

- **Provider acceptance không bảo đảm đã nhận thư.** Email trang liệu pháp được Resend nhận và có đúng nội dung nhưng không tới hộp thư thử. Có thể đã gửi tới hộp thư khác do cấu hình `LEAD_NOTIFICATION_EMAIL` đổi gần thời điểm gửi; chưa xác nhận. Cần xem cột To và Status của email này trong Resend.
- **Email hero vào Spam.** Nội dung chỉ có số điện thoại nên dễ bị coi là thư rác. Gmail cũng chặn ảnh trong Spam nên logo không hiện. Nhân viên cần kiểm tra cả thư mục Spam.
- **Chưa có bản ghi DMARC** cho `holisticvn.com` (`_dmarc`). Nên thêm, bắt đầu bằng `v=DMARC1; p=none; rua=mailto:<hộp thư theo dõi>`, rồi quan sát trước khi siết chính sách.
- **Logo** hiện ở các email vào Inbox (đầu và chân thư).
- **Chân thư:** Gmail tự gắn liên kết xanh dương lên tên miền, khó đọc trên nền xanh lá. Đã bọc tên miền bằng liên kết có màu khai báo; chưa kiểm chứng lại trong Gmail.

Ngày 2026-10-07, form cũng được thử từ dev server cục bộ với dữ liệu giả: cả 4 nguồn trả `200`. Trang liệu pháp khi đó dùng nội dung dự phòng vì chưa có dữ liệu Sanity.

## Quy trình nhân viên — cần xác nhận

Một lượt gọi lại mô phỏng, do nhân viên thực hiện:

- [ ] Có người theo dõi hộp thư `LEAD_NOTIFICATION_EMAIL` (kể cả Spam) trong giờ làm việc.
- [ ] Gọi lại khách thử từ link `tel:` hoặc số trong email.
- [ ] Kiểm tra lịch trong hệ thống cửa hàng và nhập lịch ở đó.
- [ ] Xác nhận trực tiếp với khách. Khách chưa có lịch hẹn cho đến bước này.

Người xác nhận và ngày: ______
