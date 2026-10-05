# HolisticVN

Website physical therapy bằng Next.js 15, với public site tiếng Việt, Sanity Studio, Supabase CRM phân quyền Admin/Staff và yêu cầu tư vấn/đặt lịch gửi qua Resend.

## Chạy local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Không có secrets, website vẫn render bằng dữ liệu fallback để review UI. Form tư vấn và đặt lịch chỉ báo thành công khi Resend nhận yêu cầu gửi email; nếu thiếu cấu hình, form hiện lỗi và hướng dẫn gọi trực tiếp. Studio và CRM cần cấu hình riêng.

## Production setup

1. Tạo Sanity project/dataset, Supabase project và xác minh domain gửi trong Resend; đặt các biến trong `.env.example` trên Vercel. Với form, cần `RESEND_API_KEY`, `RESEND_FROM_EMAIL` và `LEAD_NOTIFICATION_EMAIL` là hộp thư nhân viên Holistic theo dõi.
2. Chạy migration trong `supabase/migrations/` và bootstrap tài khoản Admin theo [Supabase setup](supabase/README.md).
3. Thêm webhook Sanity gọi `POST /api/revalidate` với header `x-sanity-secret`.
4. Cấu hình GA4/GTM, Zalo ID và Facebook Page ID; analytics chỉ tải sau cookie consent.
5. Theo [legacy migration runbook](docs/MIGRATION.md), xác minh import và redirect 301 trước cutover.

Form ở hero, `/booking`, `/contact` và trang liệu pháp gửi email cho Holistic, không ghi yêu cầu mới vào bảng `leads` của Supabase. Nhân viên gọi lại, nhập lịch trên hệ thống cửa hàng rồi xác nhận với khách. Dashboard Supabase hiện không nhận các yêu cầu mới từ website; newsletter vẫn dùng Supabase.
Nút Zalo trên website mở chat trực tiếp để khách chủ động nhắn; form chưa tự động gửi thông báo Zalo OA. Xem [các bước thiết lập email](docs/EMAIL_SETUP.md) trước khi dùng form thật.

## Kiểm tra

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Front-end review

Dùng [front-end checklist theo dự án](docs/FRONTEND_CHECKLIST.md) khi review thay đổi UI
và trước production/cutover.
