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

Dùng email/số điện thoại do người kiểm tra kiểm soát. Không dán API key vào đây.

| Điều kiện                                                               | Kết quả |
| ----------------------------------------------------------------------- | ------- |
| Domain gửi ở trạng thái **Verified** trên Resend                        |         |
| API key (Sending access, giới hạn domain), from, to đã đặt trên staging |         |
| Redis (`UPSTASH_REDIS_REST_*`) riêng cho staging đã đặt                 |         |

| Nguồn              | Giờ gửi | Resend message id | Inbox / Spam | Subject đúng | Có loại yêu cầu và liệu pháp (nếu có) |
| ------------------ | ------- | ----------------- | ------------ | ------------ | ------------------------------------- |
| Hero (`home-hero`) |         |                   |              |              |                                       |
| `/booking`         |         |                   |              |              |                                       |
| `/contact`         |         |                   |              |              |                                       |
| Trang liệu pháp    |         |                   |              |              |                                       |

Điền cột Resend message id từ mục Emails trong Resend. Email trang liệu pháp phải có dòng **Liệu pháp**.

Lượt thử ngày 2026-10-07 từ dev server cục bộ, người nhận là hộp thư và số điện thoại của người kiểm tra (không phải hộp thư nhân viên): cả 4 nguồn trả `200` và form báo thành công, tức là Resend đã nhận. API key chỉ có quyền gửi nên không đọc được log qua API; message id, Inbox/Spam và nội dung email cần đối chiếu thủ công. Trang liệu pháp thử với `/treatments/dry-needling` (nội dung dự phòng, vì dataset Sanity production chưa có liệu pháp).

## Quy trình nhân viên — cần xác nhận

Một lượt gọi lại mô phỏng, do nhân viên thực hiện:

- [ ] Có người theo dõi hộp thư `LEAD_NOTIFICATION_EMAIL` (kể cả Spam) trong giờ làm việc.
- [ ] Gọi lại khách thử từ link `tel:` hoặc số trong email.
- [ ] Kiểm tra lịch trong hệ thống cửa hàng và nhập lịch ở đó.
- [ ] Xác nhận trực tiếp với khách. Khách chưa có lịch hẹn cho đến bước này.

Người xác nhận và ngày: ______
