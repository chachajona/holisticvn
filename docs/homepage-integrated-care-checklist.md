# Frontend checklist — section lộ trình và giá trị cốt lõi

Kiểm tra ngày 2026-10-09 theo `docs/FRONTEND_CHECKLIST.md`.

## Phạm vi và kết luận

Section “Trị liệu và tập luyện, cùng một lộ trình.” trên homepage: nội dung giới thiệu, ảnh `ManualTherapy.jpg`, ba giá trị Toàn diện / Xuyên suốt / Bền vững và bộ icon mới (Xuyên suốt dùng `thread-linked-v2.webp`).

**Các mục áp dụng cho section đều đạt trong môi trường kiểm tra.** Không phát hiện lỗi cần sửa trong section. Đây là kiểm tra cục bộ, không xác nhận toàn bộ website sẵn sàng cutover. Không thay đổi giao diện trong lượt kiểm tra này.

Môi trường: Chromium qua Playwright; Next.js 16.3.8; dev tại localhost:3111 và bản production build tại localhost:3112. Không có Chrome DevTools MCP trong workspace nên dùng Playwright cho DOM, accessibility tree, bàn phím, console và network.

## Semantics, responsive và bàn phím

- [x] Homepage có đúng một `h1` và một `main#main`. Section có tên truy cập qua `aria-labelledby="path-heading"`; heading theo thứ tự `h2 → h3`.
- [x] Giá trị cốt lõi là `ul` có tên truy cập và ba `li`. Accessibility tree giữ đủ ba heading/mô tả; icon trang trí được loại khỏi cây đọc.
- [x] Không có scroll ngang tại 1440, 768, 390 và 320 CSS px: document width bằng viewport tại cả bốn kích thước. Desktop/tablet hiển thị ba cột, mobile ba hàng.
- [x] Kiểm tra reflow tương đương zoom 200% của cửa sổ 1440×1100: viewport 720×550 CSS px, device scale factor 2. Document width 720px; nội dung vẫn đọc được. Đây là mô phỏng reflow, không phải thao tác zoom native của trình duyệt.
- [x] Tại mobile 320px, cuộn đưa heading và đoạn cuối vào vùng đọc giữa màn hình; không bị phần tử fixed/sticky che trong các vị trí này. Thanh điều hướng/chat vẫn tồn tại trong ảnh kiểm tra, không bị ẩn để che lỗi.
- [x] Skip link “Bỏ qua điều hướng” nhận Tab, có focus outline nhìn thấy, Enter chuyển đến `#main`; Tab tiếp theo tới input “Số điện thoại” trong nội dung chính. Input hiện có dùng viền form sáng qua `:focus-within`.
- [x] Section không có control tương tác, link, form hay tab stop mới, nên không tạo focus trap.
- [x] Với `prefers-reduced-motion: reduce`, không có animation hoặc transition đang áp dụng trong section.

## Ảnh, nội dung và accessibility

- [x] Ảnh chính dùng `next/image` với `fill`, `sizes` và khung có chiều cao cố định; các icon có `width/height`, `sizes` và kích thước CSS cố định.
- [x] Alt ảnh chính: “Chuyên viên dùng dụng cụ trị liệu mô mềm vùng lưng tại Holistic”. Ba icon dùng `alt=""`, nằm trong wrapper `aria-hidden="true"`.
- [x] Ảnh/icon tải thành công ở dev và production; bốn request tối ưu ảnh trả HTTP 200. Icon được chọn ở 64px cho kích thước hiển thị 48–56px; ảnh chính desktop được chọn ở 640px cho khung rộng 604px.
- [x] Tương phản đo từ computed styles trên nền `#F6EFE6`: heading sage **5,96:1**, nội dung muted **7,23:1**, nhãn ink **11,98:1**. Đều vượt 4,5:1. Sage/clay của icon lần lượt 5,96:1 / 3,65:1; icon trang trí có nội dung chữ tương đương.
- [x] Không phụ thuộc vào màu/icon để truyền tải ý nghĩa: mỗi giá trị có heading và mô tả bằng chữ.
- [x] Nội dung không bổ sung cam kết khỏi bệnh, tỷ lệ thành công, chứng chỉ hay dữ liệu liên hệ chưa xác nhận. Nguồn ảnh fanpage và tính chất minh hoạ AI được ghi ở `PRODUCT.md` và `docs/core-value-icons.md`.
- [x] Không thêm client JavaScript, font, tracker, script bên ngoài, animation hay origin mới. Section dưới màn hình đầu dùng lazy loading phù hợp.
- [x] Production console của lượt kiểm tra không có error hoặc warning; các tài nguyên ảnh của section trả 200.
- [x] Homepage giữ `lang="vi"`, title/description tiếng Việt, canonical `https://holisticvn.com/` và Open Graph URL cùng domain.

Không dùng số CLS/Lighthouse để kết luận: kiểm tra này xác nhận kích thước ảnh được giữ chỗ và ảnh tải đúng, chưa đo Web Vitals trên deployment thật.

## Lệnh kiểm tra toàn workspace

| Lệnh                | Kết quả                                                |
| ------------------- | ------------------------------------------------------ |
| `npm run lint`      | PASS, exit 0                                           |
| `npm run typecheck` | PASS, exit 0                                           |
| `npm test`          | PASS, 13 files / 59 tests                              |
| `npm run build`     | PASS, 26 trang được tạo; không có warning trong output |
| `git diff --check`  | PASS                                                   |

## Ghi nhận ngoài phạm vi

Trong lượt điều hướng dev, Next.js cảnh báo ảnh hero `/images/Iastm.jpg` là LCP và đề nghị `loading="eager"`. Ảnh này thuộc hero, không phải ảnh section vừa chỉnh. Không sửa hero trong lượt kiểm tra này. Production console không phát cảnh báo đó; điều này không thay thế việc kiểm tra tải ảnh LCP của hero trước launch.

## Không áp dụng / chưa kiểm tra

- Form submit, validation, email, rate limiting, CMS permissions, API security, analytics consent và redirects: không thuộc thay đổi section này.
- Dữ liệu Sanity thật: section dùng nội dung/ảnh local cố định, không có binding Sanity thay đổi.
- Safari, thiết bị vật lý, zoom native 200%, screen reader ứng dụng và Lighthouse trên production deployment: chưa kiểm tra. Accessibility tree đã được kiểm tra trong Chromium.
- Các trang/luồng khác và staging form submission của checklist cutover: không được xác nhận bởi báo cáo này.

## Bằng chứng

Ảnh trong `.context/path-checklist/`:

- `section-{1440,768,390,320}.png`: responsive ở dev, có chrome giao diện đang hiển thị.
- `reflow-200-equivalent.png`: mô phỏng reflow 200%.
- `keyboard-skip.png`, `production-keyboard-after-skip.png`: bàn phím/skip link.
- `mobile-readable-320.png`: đoạn cuối trong vùng đọc, không bị chat che.
- `production-desktop.png`, `production-mobile.png`: section trên production build.
