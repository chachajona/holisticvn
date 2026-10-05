# Thiết lập email nhận yêu cầu tư vấn và đặt lịch

Form ở hero, `/booking`, `/contact` và trang liệu pháp gửi email cho nhân viên Holistic. Khách chỉ thấy thông báo thành công sau khi Resend nhận yêu cầu gửi. Nhân viên gọi lại, kiểm tra lịch trên hệ thống cửa hàng, nhập lịch ở đó rồi xác nhận với khách. Form không ghi lead mới vào Supabase.

## 1. Xác minh domain gửi trên Resend

Tạo tài khoản tại [Resend](https://resend.com/), vào [Domains](https://resend.com/domains) và thêm một subdomain gửi mail, chẳng hạn `notify.holisticvn.com`. Resend khuyên dùng subdomain để tách uy tín gửi mail khỏi domain chính.

Trong nơi quản lý DNS của `holisticvn.com`, thêm **đúng các bản ghi Resend cung cấp** ở tab Records. Tên, loại và giá trị bản ghi phụ thuộc tài khoản/domain nên không tự đoán. Chờ trạng thái domain thành **Verified** trước khi thử form. [Hướng dẫn domain của Resend](https://resend.com/docs/add-a-domain).

## 2. Tạo API key

Vào [API Keys](https://resend.com/api-keys), tạo key mới với quyền **Sending access**; nếu có lựa chọn, giới hạn key vào domain vừa xác minh. Resend chỉ hiển thị giá trị key lúc tạo. Không dán key vào chat, không commit và không đặt tên biến bắt đầu bằng `NEXT_PUBLIC_`. [Hướng dẫn API key của Resend](https://resend.com/docs/create-an-api-key).

## 3. Cấu hình website

Điền ba biến sau trong `.env.local` để thử local, rồi khởi động lại `npm run dev`:

```dotenv
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=HolisticVN <lichhen@notify.holisticvn.com>
LEAD_NOTIFICATION_EMAIL=Holisticrep9@gmail.com
```

Địa chỉ `RESEND_FROM_EMAIL` phải thuộc domain đã **Verified**. `LEAD_NOTIFICATION_EMAIL` là hộp thư nhân viên theo dõi và có thể là Gmail. Đặt cùng ba biến trong môi trường production của nơi triển khai (ví dụ Vercel Project Settings → Environment Variables), rồi triển khai lại. `.env.local` đã nằm trong `.gitignore`. [Hướng dẫn gửi từ Next.js của Resend](https://resend.com/docs/send-with-nextjs).

## 4. Kiểm tra trước khi dùng thật

1. Gửi một yêu cầu thử từ ô **Tư vấn ngay** và một yêu cầu từ `/booking`. Dùng số điện thoại thử mà bạn kiểm soát.
2. Kiểm tra hộp thư `Holisticrep9@gmail.com`, cả thư mục Spam, và mục Emails trong Resend. Email đặt lịch phải có tên, số, chi nhánh nếu chọn, ghi chú và nguồn trang.
3. Xác nhận website báo thành công chỉ khi Resend nhận email. Nếu thiếu cấu hình, API trả `503`; nếu Resend từ chối gửi, API trả `502` và form giữ thông tin khách để thử lại hoặc gọi trực tiếp.
4. Cho nhân viên thử quy trình: gọi khách, kiểm tra hệ thống lịch của cửa hàng, nhập lịch rồi xác nhận trực tiếp với khách. Nhân viên cần theo dõi hộp thư để không bỏ sót yêu cầu.

Nút Zalo trên website hiện mở chat trực tiếp cho khách; form chưa tự động gửi thông báo đến Zalo OA.
