# Kết nối feed Instagram tự động

Homepage có thể hiển thị tối đa 4 bài mới nhất từ tài khoản Instagram Business hoặc
Creator của Holistic. Ảnh đại diện của bài ảnh, Reel và album mở bài gốc khi bấm.
Không nhúng trình phát video hay script theo dõi Instagram. Ảnh đi qua bộ tối ưu
`next/image` của website, nên trình duyệt chỉ tải ảnh từ cùng origin và CSP không
cần cho phép CDN Instagram trên public page.

Đây là kết nối **Instagram API with Instagram Login**. Không cần liên kết Facebook
Page. Quyền đọc cần dùng là `instagram_business_basic`; không cần quyền đăng bài,
đọc tin nhắn hoặc quản lý bình luận. [Tài liệu Meta](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/).

## 1. Tạo ứng dụng và thêm tài khoản

Chủ tài khoản thực hiện bước này trên Meta, không đưa mật khẩu Instagram vào chat.

1. Mở [trang tạo app Meta](https://developers.facebook.com/apps/creation/), đăng ký
   developer nếu chưa có; nhập tên app **Holistic Website** và email liên hệ.
   Chọn use case **Manage messaging and content on Instagram** nếu được hiển thị.
   Nếu giao diện chỉ có **Other**, chọn mục này rồi loại app **Business** và thêm
   sản phẩm Instagram. Chọn business portfolio của Holistic nếu đã có; nếu chưa có,
   chọn **I don't want to connect a business portfolio yet** khi Meta cho phép.
   Hoàn tất các bước **Requirements / Overview → Go to dashboard**. Cấu hình đích
   là **Instagram API with Instagram Login**.
2. Mở **Instagram → API setup with Instagram business login**.
3. Thêm tài khoản **@holisticrep** (hoặc tài khoản Holistic thực sự dùng). Nếu Meta yêu
   cầu thêm Instagram Tester trong **App roles**, thêm tài khoản và chấp nhận lời mời
   ở phần **Apps and websites / Tester invites** trên Instagram.
4. Bấm **Generate token** cạnh tài khoản, đăng nhập Instagram và cấp quyền đọc.
   Token được tạo qua App Dashboard là long-lived, có hiệu lực 60 ngày. Dùng token
   **vừa tạo** để thiết lập: lần làm mới tự động đầu tiên diễn ra sau một tuần.
5. Ghi lại **Instagram User ID** và token. User ID là chuỗi số, khác với username.
   Nếu dashboard không hiện ID, dùng công cụ API trong Meta gọi
   `GET /v25.0/me?fields=user_id,username`; trường `user_id` là ID cần dùng.

Meta có hướng dẫn [tạo app](https://developers.facebook.com/documentation/development/create-an-app)
và [lấy token/User ID](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/).
Với tài khoản riêng, cấu hình vai trò/tester theo App Dashboard. Nếu Meta yêu cầu
Advanced Access trong phạm vi sử dụng thực tế, cần hoàn tất App Review tương ứng;
không coi việc có token là bằng chứng mọi bước xét duyệt đã hoàn thành.

## 2. Cấu hình website

Đặt biến trong `.env.local` để chạy local, và Environment Variables của deployment
production để chạy thật. Không đặt token vào Sanity, `NEXT_PUBLIC_*`, GitHub issue
hoặc chat.

```dotenv
INSTAGRAM_USER_ID=ID_DANG_SO_TU_META
INSTAGRAM_ACCESS_TOKEN=TOKEN_LONG_LIVED_VUA_TAO
INSTAGRAM_API_VERSION=v25.0
CRON_SECRET=CHUOI_NGAU_NHIEN_DAI_IT_NHAT_32_KY_TU
UPSTASH_REDIS_REST_URL=URL_REDIS_CUA_MOI_TRUONG
UPSTASH_REDIS_REST_TOKEN=TOKEN_REDIS_CUA_MOI_TRUONG
```

Redis đã dùng cho giới hạn gửi form; feed dùng namespace `holisticvn:instagram:`
riêng. Dùng Redis riêng cho local/staging và production. Khởi động lại dev server
hoặc triển khai lại sau khi đổi environment variables.

Token bootstrap chỉ nằm trong server env. Token được làm mới và metadata công khai
của 4 bài được lưu trong Redis; mỗi lần đồng bộ đặt hạn lưu 90 ngày. Redis và quyền
truy cập dashboard/env phải được quản lý như kho chứa secrets. Không lưu mật khẩu,
nội dung form hoặc hồ sơ khách hàng. Khi thay token bootstrap, một kết nối mới được
khởi tạo; namespace cũ tự hết hạn sau 90 ngày nếu không còn đồng bộ.

## 3. Cập nhật tự động

- Khi có người mở homepage, website kiểm tra Redis. Nếu dữ liệu đã cũ hơn một giờ,
  website lấy bài mới; các lượt xem trong cùng giờ dùng dữ liệu cache.
- `vercel.json` gọi `GET /api/instagram/sync` mỗi ngày lúc **03:00 UTC** (10:00 giờ
  Việt Nam), kể cả khi website không có người xem. Vercel truyền
  `Authorization: Bearer <CRON_SECRET>`; endpoint chỉ chấp nhận secret hợp lệ.
- Mỗi tuần, job làm mới token và lưu token/expiry trả về trước khi lấy bài.
  Token phải còn hạn và đã tồn tại ít nhất 24 giờ mới được làm mới.
  [Quy định làm mới token của Meta](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token/).
- Lịch daily phù hợp giới hạn cron của Vercel Hobby. Muốn cập nhật theo giờ ngay cả
  khi không có người xem, trên Vercel Pro đổi schedule thành `0 * * * *`.
  [Giới hạn Vercel Cron](https://vercel.com/docs/cron-jobs/usage-and-pricing).
- Hosting ngoài Vercel cần scheduler tương đương gọi endpoint bằng header xác thực.
  Cron chỉ chạy tự động trên deployment có cấu hình scheduler, không chạy ở local.

Nếu chưa có ID/token, giao diện dùng 4 ảnh hiện tại. Sau khi có kết nối, chỉ bài
thực sự đọc được từ Instagram mới xuất hiện. Khi lỗi, feed giữ kết quả gần nhất tối
đa 48 giờ; lâu hơn thì chỉ còn tiêu đề/link tài khoản vì URL ảnh CDN có hạn sử dụng.
Bài không có ảnh đại diện hợp lệ bị bỏ qua; feed có thể có ít hơn 4 ô. Album lấy
ảnh đầu tiên; Reel dùng thumbnail ngay cả khi API không trả video do hạn chế âm
thanh/bản quyền. [Các trường media của Meta](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/).

## 4. Nghiệm thu kết nối thật

1. Cấu hình biến và mở homepage: ảnh phải khớp bài từ tài khoản đã kết nối, bấm mỗi
   ảnh phải mở đúng bài gốc. Kiểm tra ảnh/Reel/album và keyboard ở 320, 768, 1440 px.
2. Trong Vercel → Cron Jobs, chạy job thủ công và kiểm tra response `{ "synced": true }`.
   Nếu dùng scheduler khác, kiểm tra cùng endpoint với header Authorization.
3. Đăng một bài mới rồi đợi chu kỳ cập nhật: bài phải xuất hiện đầu lưới. Xoá hoặc
   archive bài và kiểm tra biến mất sau lần đồng bộ tiếp theo.
4. Kiểm tra HTML/response public không chứa access token, Redis credential hay cron
   secret; token chỉ dùng ở máy chủ. Kiểm tra không có lỗi ảnh trong console/network.
5. Theo dõi job ngày hôm sau và sau lần token refresh đầu tiên. Mock tests không
   thay thế việc kiểm chứng quyền/tài khoản/token thật trên Meta.

## Khi cần kết nối lại

Đổi mật khẩu, thu hồi quyền hoặc một thay đổi bảo mật của Meta có thể vô hiệu hoá
token trước ngày hết hạn. Tạo token mới trong App Dashboard, thay
`INSTAGRAM_ACCESS_TOKEN`, triển khai lại và chạy sync. Nếu Redis bị xoá hoặc mất
state, tạo token mới thay cho bootstrap token cũ có thể đã hết hạn.

Response `401` từ endpoint sync nghĩa là scheduler thiếu/sai `CRON_SECRET`.
`503` nghĩa là Redis, cấu hình hoặc kết nối Meta chưa hoạt động. Log cố ý không ghi
URL/token/body lỗi của Meta. Khi xử lý, kiểm tra quyền `instagram_business_basic`,
User ID, token còn hiệu lực và môi trường Redis đúng, rồi chạy lại job.
