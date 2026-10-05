# Front-end checklist — HolisticVN

Checklist này áp dụng cho website Next.js 16 của HolisticVN. Dùng nó khi review một
thay đổi giao diện, trước khi mở một tính năng công khai, và trước khi cutover domain.
Nó được điều chỉnh từ các chủ đề của
[Front-End Checklist](https://github.com/thedaviddias/front-end-checklist), không phải
bản sao toàn bộ checklist nguồn.

## Cách dùng

- Mỗi pull request chỉ cần đánh dấu các mục bị ảnh hưởng; không đánh dấu một mục nếu
  chưa kiểm chứng.
- Mục `Bắt buộc` phải đạt trước khi merge/ra mắt. Mục `Nên có` áp dụng khi phù hợp với
  phạm vi thay đổi.
- Với thay đổi public site, kiểm tra tối thiểu ở viewport 320 px, 768 px và desktop;
  kiểm tra bằng bàn phím; và dùng dữ liệu fallback lẫn dữ liệu Sanity thật nếu thay đổi
  liên quan nội dung.
- Với mọi thay đổi có giao diện, chạy trước khi merge:

  ```bash
  npm run lint
  npm run typecheck
  npm test
  npm run build
  ```

## Mỗi thay đổi giao diện

### Semantics, responsive và tương tác

- [ ] **Bắt buộc** Có đúng một `h1`; cấp heading không bị nhảy và vùng chính dùng
  `<main id="main">`.
- [ ] **Bắt buộc** Toàn bộ control tương tác dùng phần tử native phù hợp (`button`,
  `a`, `input`, ...), có tên truy cập được và dùng được chỉ bằng bàn phím.
- [ ] **Bắt buộc** Focus indicator vẫn thấy rõ, thứ tự Tab hợp lý, và skip link dẫn đến
  nội dung chính.
- [ ] **Bắt buộc** Không có scroll ngang tại 320 px, 768 px hay zoom 200%; nội dung và
  CTA không bị che bởi header, cookie banner hay chat widget.
- [ ] **Bắt buộc** Link có đích/phân biệt được trong ngữ cảnh; external link mở tab mới
  phải có `rel="noopener noreferrer"`.
- [ ] **Nên có** Hover, active, disabled, loading, success và error states rõ ràng;
  không chỉ truyền đạt trạng thái bằng màu.
- [ ] **Nên có** Tôn trọng `prefers-reduced-motion`; animation chỉ dùng `transform` và
  `opacity` khi có thể.

### Form và lead capture

- [ ] **Bắt buộc** Mỗi input có `<label>` hoặc accessible name; type, `inputMode`,
  `autocomplete`, `required`, `minLength`/`maxLength` phù hợp với dữ liệu cần thu.
- [ ] **Bắt buộc** Lỗi từ client/server hiển thị cạnh form, được screen reader thông báo
  (`role="alert"` hoặc live region), và vẫn giữ dữ liệu người dùng đã nhập.
- [ ] **Bắt buộc** Nút gửi chống gửi lặp khi request đang chạy; failure mạng được xử lý
  thay vì để promise bị lỗi im lặng.
- [ ] **Bắt buộc** Chỉ gửi dữ liệu tối thiểu cần thiết; honeypot và validation server-side
  vẫn hoạt động sau thay đổi.
- [ ] **Nên có** Sau khi gửi thành công, thông điệp nêu rõ bước tiếp theo và event
  analytics chỉ được ghi sau consent.

### Hình ảnh và nội dung

- [ ] **Bắt buộc** `next/image` (hoặc kích thước nội tại tương đương) được dùng cho ảnh
  nội dung; ảnh có `width`/`height` hoặc `fill` + `sizes` để tránh CLS.
- [ ] **Bắt buộc** Ảnh truyền tải thông tin có alt tiếng Việt mô tả đúng; ảnh trang trí
  dùng alt rỗng; không dùng tên file làm alt.
- [ ] **Bắt buộc** Ảnh từ Sanity/remote nằm trong `next.config.ts` `remotePatterns`; URL
  và placeholder vẫn an toàn khi CMS thiếu ảnh.
- [ ] **Bắt buộc** Không đưa số điện thoại, địa chỉ, giờ làm, đánh giá, tiểu sử/chứng chỉ
  hay tuyên bố y tế chưa được xác nhận vào UI. Xem `PRODUCT.md` để biết dữ liệu placeholder.
- [ ] **Nên có** Copy y tế là thông tin tham khảo, không hứa hẹn kết quả hay thay thế tư
  vấn cá nhân; nội dung dài dễ quét và có CTA đúng ngữ cảnh.

## Public pages: accessibility, SEO và hiệu năng

### Metadata và crawlability

- [ ] **Bắt buộc** Page public có title, description, canonical tuyệt đối và Open Graph
  phù hợp qua `createMetadata`; title/description mô tả chính xác trang.
- [ ] **Bắt buộc** Nội dung tiếng Việt giữ `lang="vi"`; link canonical, sitemap và robots
  cùng dùng `NEXT_PUBLIC_SITE_URL` của môi trường đích.
- [ ] **Bắt buộc** Route public mới được đưa vào `app/sitemap.ts`; route nội bộ
  (`/dashboard`, `/studio`, `/api`) không bị index.
- [ ] **Bắt buộc** Redirect legacy mới hoặc đổi URL là permanent, đúng một hop và được
  thêm vào `next.config.ts` trước cutover.
- [ ] **Nên có** Blog/treatment có metadata riêng theo nội dung Sanity; kiểm tra trang
  not-found cho slug không tồn tại.

### Khả năng tiếp cận

- [ ] **Bắt buộc** Text, icon và trạng thái focus đạt tương phản đủ; kiểm tra riêng CTA
  clay/sage, text muted và text trên ảnh/màu nền.
- [ ] **Bắt buộc** Menu mobile, banner cookie, modal/chat widget không bẫy focus; có thể
  đóng hoặc bỏ qua bằng bàn phím khi chúng che nội dung.
- [ ] **Bắt buộc** Không chỉ thị/giải thích bằng màu, vị trí hoặc hình ảnh; icon-only
  button có accessible label.
- [ ] **Nên có** Thứ tự đọc DOM khớp với thứ tự nhìn thấy; bảng, list, article và time
  dùng markup ngữ nghĩa.

### Hiệu năng

- [ ] **Bắt buộc** Không thêm JavaScript client-side, font, script tracker hay widget
  vào initial load nếu không cần cho lượt xem đầu.
- [ ] **Bắt buộc** GTM và chat widgets chỉ tải sau cookie consent; không đưa ID hoặc
  secret nhạy cảm vào biến `NEXT_PUBLIC_*`.
- [ ] **Bắt buộc** Không làm Largest Contentful Paint (LCP) image lazy-load; không preload
  nhiều ảnh/font không cần thiết.
- [ ] **Nên có** Component nặng, dashboard-only và widget bên thứ ba được dynamic import
  khi hợp lý; kiểm tra layout shift và console errors trên route thay đổi.

## Dashboard, CMS và bảo mật

- [ ] **Bắt buộc** Dashboard/Studio/API không render dữ liệu lead hoặc thông tin nội bộ
  trên public route, metadata, sitemap hay response lỗi.
- [ ] **Bắt buộc** Phân quyền được xác thực ở server/Supabase RLS, không chỉ dựa vào UI:
  Staff chỉ thấy/cập nhật lead được gán; Admin mới quản lý toàn bộ lead và team.
- [ ] **Bắt buộc** Route handler xác thực input bằng Zod, có phản hồi lỗi an toàn và không
  trả về stack trace, secrets hay dữ liệu cá nhân vượt nhu cầu.
- [ ] **Bắt buộc** Sanity revalidation endpoint yêu cầu secret hợp lệ; mọi secret chỉ nằm
  ở server env và `.env.local` không được commit.
- [ ] **Nên có** Nội dung từ CMS được render như text/structured content an toàn; không
  dùng `dangerouslySetInnerHTML` với dữ liệu không được sanitize.

## Privacy và analytics

- [ ] **Bắt buộc** GTM/GA, Zalo, Facebook hay third-party tracking không khởi chạy trước
  khi người dùng chấp nhận; trạng thái accept/reject tồn tại sau reload.
- [ ] **Bắt buộc** Cookie banner vẫn dễ đọc và thao tác được trên mobile, không che CTA
  hay chặn scroll lâu dài.
- [ ] **Bắt buộc** Không gửi tên, email, số điện thoại, nội dung triệu chứng hoặc URL có
  dữ liệu cá nhân vào analytics event/log.
- [ ] **Nên có** Mọi cookie/tracker mới được phản ánh ở cookie/privacy policy trước khi
  production release.

## Kiểm tra trước production/cutover

- [ ] **Bắt buộc** Chạy đủ lint, typecheck, test, build; đọc output để chắc không có warning
  liên quan route, metadata hoặc environment.
- [ ] **Bắt buộc** Smoke-test homepage, services, treatments, blog index/detail, about,
  contact, booking, policy pages, dashboard login và Studio.
- [ ] **Bắt buộc** Submit thử contact, booking và newsletter bằng môi trường staging;
  xác minh validation, record Supabase, email Resend và không có PII trong analytics.
- [ ] **Bắt buộc** Kiểm tra redirects legacy, `robots.txt`, `sitemap.xml`, canonical và
  OG preview trên domain production; đảm bảo staging không được index.
- [ ] **Bắt buộc** Thay tất cả placeholder/fabricated contact details, testimonials,
  credentials và Hà Nội/Hoàn Kiếm bằng thông tin đã được business xác nhận.
- [ ] **Bắt buộc** Kiểm tra các trang chủ chốt trên Chrome/Safari mobile và desktop, với
  keyboard-only; không có console/network error, broken image hay overflow.
- [ ] **Nên có** Chạy Lighthouse hoặc Web Vitals trên production preview và xem lại thay
  đổi LCP, CLS, accessibility, SEO trước launch.

## Tài liệu liên quan

- `README.md` — lệnh chạy và production setup.
- `PRODUCT.md` — phạm vi sản phẩm và các dữ liệu hiện là placeholder.
- `docs/MIGRATION.md` — runbook import/cutover và legacy redirects.
- [Front-End Checklist](https://github.com/thedaviddias/front-end-checklist) — nguồn quy
  tắc đầy đủ để tra cứu khi cần kiểm tra sâu hơn.
