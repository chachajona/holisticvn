# Frontend checklist — homepage concern CTA

Ngày kiểm tra: 2026-10-09. Checklist nguồn: [FRONTEND_CHECKLIST.md](./FRONTEND_CHECKLIST.md).

## Phạm vi và kết luận

Rà phần “Bạn đang gặp một vấn đề cụ thể?” vừa được owner duyệt: bỏ subtext, bố cục desktop/mobile, SVG pattern, mũi tên và motion khi cuộn. Source: `app/page.tsx`, `app/page.module.css`, `components/concern-pattern.tsx`.

**Không phát hiện lỗi cần sửa trong CTA qua các kiểm tra đã thực hiện.** Không thay đổi UI trong lần rà này. Kết quả này không thay thế checklist ra mắt toàn website.

Browser tự động: Chromium qua Playwright. Kiểm tra ban đầu trên dev `http://localhost:3111/`; xác nhận lại với production build chạy local tại `http://localhost:3112/`. Các mục chưa kiểm tra trực tiếp được ghi riêng bên dưới.

## Các mục đã kiểm chứng

- [x] Trang có đúng một `h1`, `main#main`, `lang="vi"`; CTA dùng `h2`, không gây nhảy cấp heading.
- [x] Section có accessible name qua `aria-labelledby="concern-heading"`; DOM đọc heading trước link, khớp bố cục hiển thị.
- [x] Link native có tên “Xem các phương pháp”, đích `/treatments`. Enter bằng bàn phím mở đúng trang.
- [x] Tab và Shift+Tab đi qua CTA theo thứ tự nội dung. SVG trang trí không nhận focus; cả ba SVG dùng `aria-hidden="true"`, `focusable="false"`.
- [x] Focus bàn phím có outline trắng 2 px, offset 5 px; thấy rõ và không bị cắt. Link trước CTA là nội dung dịch vụ; Shift+Tab rồi Tab trở lại CTA hoạt động.
- [x] Skip link xuất hiện ở lần Tab đầu và Enter dẫn đến `#main`, bỏ qua điều hướng khi tiếp tục Tab.
- [x] Không tràn ngang trang hoặc CTA ở các viewport đã đo. Heading, button không bị cắt; CTA được kiểm tra trong vùng nhìn thấy, kể cả khi cookie banner chưa được đóng ở phiên mobile mới.
- [x] Subtext đã được bỏ; heading, nhãn nút và đích link giữ đúng bản được duyệt. Không thêm thông tin liên hệ, chứng chỉ hay tuyên bố y tế.
- [x] Hover đổi nền nút và giữ tương phản; không có trạng thái loading/disabled/error vì đây là link điều hướng.
- [x] Motion đi qua `pending` → `painting` → `complete`, ba nét cọ vẽ lần lượt. Hoàn tất sau khoảng 2.45 giây; cuộn ra rồi trở lại không phát lại.
- [x] `prefers-reduced-motion: reduce` hiển thị pattern hoàn chỉnh, cả ba path có animation `none`, opacity `1`. Đổi sang reduced motion khi trang đang mở cũng chuyển pattern sang `complete`.
- [x] Tắt JavaScript: pattern hoàn chỉnh vẫn được server render, heading và link vẫn hiện. Không tràn ngang.
- [x] SVG không chiếm thêm layout; panel desktop giữ nguyên bounding box 1360 × 222 px trước/sau animation. Không ghi nhận layout shift trong khoảng motion được đo trên production local.
- [x] Không thêm font, bitmap, thư viện, tracker hoặc origin bên ngoài. Client component chỉ phục vụ motion được yêu cầu; heading/link vẫn ở server component. Observer, timer và listener được cleanup trong source.
- [x] Production local không ghi nhận lỗi console/page JavaScript, CSP, HTTP 4xx/5xx hay ảnh hỏng trong lượt kiểm tra. Hai request prefetch blog bị `ERR_ABORTED` khi điều hướng; không phải lỗi response hay resource thiếu.
- [x] Metadata homepage có title, description, canonical tuyệt đối `https://holisticvn.com/` và Open Graph title. Không tạo route mới hoặc đổi URL.

### Responsive

| Viewport | Chiều cao nút | Tràn ngang |
| -------- | ------------- | ---------- |
| 320 px   | 52 px         | Không      |
| 390 px   | 52 px         | Không      |
| 700 px   | 52 px         | Không      |
| 768 px   | 54 px         | Không      |
| 1050 px  | 54 px         | Không      |
| 1051 px  | 54 px         | Không      |
| 1280 px  | 54 px         | Không      |
| 1440 px  | 54 px         | Không      |

Đã kiểm tra hai phía breakpoint 700 và 1050 px. Mũi tên giữa được ẩn ở ≤1050 px; ở ≤700 px nội dung xếp một cột và nút trải chiều rộng nội dung panel.

### Tương phản

Tính theo màu CSS thực tế và công thức relative luminance, không lấy màu pixel chữ đã anti-alias. Heading nhỏ nhất 27 px thuộc nhóm chữ lớn; yêu cầu AA là 3:1. Chữ nút 14 px dùng ngưỡng 4.5:1. Nguồn: [W3C Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Focus được đối chiếu với tương phản phi văn bản 3:1: [W3C Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

| Thành phần                                                      | Tỷ lệ   | Kết quả         |
| --------------------------------------------------------------- | ------- | --------------- |
| Heading trên sage gốc                                           | 6.16:1  | Đạt             |
| Heading trên nền sáng nhất theo mô hình hai nét sáng chồng nhau | 4.02:1  | Đạt cho chữ lớn |
| Chữ và icon trên nút mặc định                                   | 12.39:1 | Đạt             |
| Chữ và icon trên nút hover                                      | 11.03:1 | Đạt             |
| Focus outline trên nền sáng nhất theo mô hình trên              | 4.02:1  | Đạt             |

Nền sáng nhất được tính bằng hai lớp `#f7f3f0` alpha 0.11 và 0.09 trên sage `#48614c`. Đây là ước lượng bảo thủ, kể cả khi hai nét không chồng nhau tại vị trí chữ; nét tối chỉ tăng tương phản với chữ sáng.

### Kiểm tra code

| Lệnh                | Kết quả              |
| ------------------- | -------------------- |
| `npm run lint`      | Đạt, không warning   |
| `npm run typecheck` | Đạt                  |
| `npm test`          | 13 file, 59 test đạt |
| `npm run build`     | Đạt, sinh 26 trang   |

## Phạm vi chưa xác nhận trực tiếp

- [ ] Safari desktop/iOS và thiết bị mobile thật: chưa kiểm tra trong phiên này.
- [ ] Firefox tự động: lần trước browser không khởi động được trên Mac. Owner đã xem và duyệt preview sau khi đổi sang IntersectionObserver; đây không phải kết quả test tự động trên homepage.
- [ ] Zoom 200% bằng điều khiển trình duyệt thật: đã kiểm tra mô phỏng reflow của cửa sổ 1440 × 900 ở viewport CSS 720 × 450, device scale factor 2; không tràn ngang, CTA không bị che. Không đánh dấu mô phỏng này là test native zoom hoàn chỉnh.
- [ ] Screen reader thật và Lighthouse/Web Vitals trên production preview: chưa chạy. Kết quả layout shift ở trên chỉ áp dụng cho khoảng motion được đo, không chứng nhận CLS/LCP toàn trang.

Animation dùng `stroke-dashoffset` và opacity vì yêu cầu vẽ nét cọ. Đây là ngoại lệ có chủ đích với gợi ý ưu tiên transform/opacity: ba path, chạy một lần, không lặp; chưa đo CPU trên mobile thật.

Fallback khi thiếu IntersectionObserver có nhánh xử lý trong source; chưa kiểm chứng runtime độc lập. Việc xóa API toàn cục trước hydration không phải fixture riêng của CTA vì các component khác cũng có thể cần API này.

Các mục form/lead capture, Sanity thật/fallback, API, secrets, analytics consent mới, sitemap/redirect và cutover không áp dụng cho thay đổi CTA tĩnh này. Không đánh dấu chúng đạt dựa trên lần rà này.

## Hình kiểm tra

- Desktop, focus bàn phím: `.context/cta-checklist-keyboard.png`.
- Mobile 390 px, cookie banner còn hiển thị: `.context/cta-checklist-mobile.png`.

Ghi nhận ngoài phạm vi CTA: ở ảnh mobile, nút gọi nổi chồng lên phần bên phải cookie banner. CTA mới không bị che trong vị trí đã kiểm tra; sự chồng lấn của hai thành phần hiện có cần được rà riêng nếu thực hiện checklist toàn trang.
