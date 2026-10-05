# HolisticVN

Website physical therapy bằng Next.js 16, với public site tiếng Việt, Sanity Studio và yêu cầu tư vấn/đặt lịch gửi qua email Resend.

## Chạy local

Yêu cầu Node.js 24 (`nvm use`) và npm. Dependencies được ghim trong
`package.json`; `package-lock.json` là nguồn cho cài đặt tái tạo được.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Có thể bỏ qua bước tạo `.env.local` khi chỉ review fallback UI. Không có secrets, website vẫn render bằng dữ liệu fallback để review UI. Form tư vấn và đặt lịch chỉ báo thành công khi Resend nhận yêu cầu gửi email; nếu thiếu cấu hình, form hiện lỗi và hướng dẫn gọi trực tiếp. Studio cần cấu hình Sanity riêng. Website không có CRM, tài khoản nội bộ hay luồng lưu dữ liệu khách hàng.

## Production setup

1. Tạo Sanity project/dataset và xác minh domain gửi trong Resend; đặt các biến trong `.env.example` trên Vercel. Với form production, cần `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` và `LEAD_NOTIFICATION_EMAIL` là hộp thư nhân viên Holistic theo dõi.
2. Thêm webhook Sanity gọi `POST /api/revalidate` với header `x-sanity-secret`.
3. Cấu hình GA4/GTM, Zalo ID và Facebook Page ID; analytics chỉ tải sau cookie consent.
4. Theo [legacy migration runbook](docs/MIGRATION.md), xác minh import và redirect 301 trước cutover.

Form ở hero, `/booking`, `/contact` và trang liệu pháp gửi email cho nhân viên Holistic. Website không lưu dữ liệu khách hàng, không có CRM/dashboard và không có đăng ký newsletter. Nhân viên gọi lại, nhập lịch trên hệ thống của phòng khám rồi xác nhận với khách.
Nút Zalo trên website mở chat trực tiếp để khách chủ động nhắn. Thông báo form hiện chỉ gửi qua email. Xem [thiết lập email](docs/EMAIL_SETUP.md) trước khi dùng form thật. Redis chỉ giữ bộ đếm giới hạn gửi tự hết hạn sau một giờ, không giữ nội dung form.

## Quy ước editor

`.editorconfig` thống nhất UTF-8, indent 2 spaces, xuống dòng LF, newline cuối file
và xóa khoảng trắng cuối dòng. Markdown giữ khoảng trắng cuối dòng để hỗ trợ hard
line breaks. Editor cần hỗ trợ EditorConfig hoặc cài extension tương ứng.

Prettier được ghim version trong dự án và đọc `.editorconfig` cùng
`.prettierrc.json`. Chạy `npm run format` để format code và tài liệu;
`npm run format:check` chỉ kiểm tra, không ghi file. CI kiểm tra format trước lint.
Xem [hướng dẫn Prettier chính thức](https://prettier.io/docs/install).

## Kiểm tra

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

## Front-end review

Dùng [front-end checklist theo dự án](docs/FRONTEND_CHECKLIST.md) khi review thay đổi UI
và trước production/cutover.

## Baseline và CI

Pull request vào `main` chạy cài đặt sạch, format check, ESLint (không warnings), typecheck,
unit tests, production build và HTTP smoke test trên Node.js 24.
Next.js 16 không chạy lint trong build; CI chạy lint riêng.

```bash
npm run start -- --hostname 127.0.0.1 --port 3102
# Trong terminal khác:
npm run smoke
```

Smoke test dành cho bản build fallback không cấu hình Sanity hay Resend.
Xem [báo cáo baseline](docs/BASELINE_VERIFICATION.md) và
[ghi chú nâng dependencies](docs/DEPENDENCY_UPGRADE.md) để biết evidence và giới hạn.
