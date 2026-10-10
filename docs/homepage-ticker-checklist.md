# Frontend checklist — chữ chạy phía trên footer

Ngày kiểm tra: 2026-10-10. Checklist nguồn: [FRONTEND_CHECKLIST.md](./FRONTEND_CHECKLIST.md).

## Phạm vi và kết luận

Kiểm tra sáu cụm “TƯ VẤN · TRỊ LIỆU · TẬP LUYỆN · TOÀN DIỆN · XUYÊN SUỐT · BỀN VỮNG”, dấu chấm phân cách và chuyển động của dòng chữ phía trên footer. Source: `app/page.tsx`, `app/page.module.css`.

**Chưa đạt đầy đủ: còn hai vấn đề về chuyển động và khả năng đọc khi tắt chuyển động.** Đây là lần kiểm tra; không sửa giao diện trong lần rà này. Kết quả không thay thế checklist ra mắt toàn website.

Browser: Chromium 153.0.8010.12, profile kiểm tra riêng, production build chạy local tại `http://localhost:3123/`.

## Các mục đã kiểm chứng

- [x] Nội dung khớp lựa chọn của owner và ba giá trị trong `PRODUCT.md`; không thêm tuyên bố kết quả trị liệu hay thông tin chưa xác nhận.
- [x] Đúng sáu cụm và dấu `·`; hai bản nội dung có cùng chiều rộng để phục vụ vòng lặp.
- [x] Trang có một `h1`, `main#main`, `lang="vi"`. Ticker không thêm heading.
- [x] Không tràn ngang toàn trang ở 320, 768, 1440 px.
- [x] Ticker không bị header, cookie banner hay widget che trong vị trí kiểm tra.
- [x] Chữ màu `#744d40` trên nền `#ede6dc` đạt tương phản **5,89:1**, vượt ngưỡng 4,5:1 của checklist cho chữ nhỏ.
- [x] Animation dùng `transform`, không thêm JavaScript, font, ảnh hay tài nguyên bên thứ ba cho ticker.
- [x] Ticker có `aria-hidden="true"`, không chứa phần tử nhận focus; tránh đọc lặp nội dung trang trí vốn đã có trong nội dung chính. Chưa kiểm tra bằng screen reader thật.
- [x] Bàn phím: skip link đưa thứ tự Tab vào input tư vấn trong `main`; Tab từ link Instagram sang link đầu footer, focus hiển thị trong viewport và có outline. Ticker không tạo điểm Tab hay bẫy focus.
- [x] CSS tắt animation khi `prefers-reduced-motion: reduce`; còn lỗi cắt nội dung trong chế độ này, ghi bên dưới.
- [x] Lint, typecheck, test và build đều đạt.

| Viewport | Chiều cao ticker | Chiều rộng mỗi bản nội dung | Tràn ngang trang | Bị che |
| -------- | ---------------- | --------------------------- | ---------------- | ------ |
| 320 px   | 45 px            | 981,13 px                   | Không            | Không  |
| 768 px   | 45 px            | 981,13 px                   | Không            | Không  |
| 1440 px  | 45 px            | 1440 px                     | Không            | Không  |

Các cụm đang chạy được cắt ở biên ticker là hành vi của marquee. Lỗi bên dưới xảy ra khi dòng đã dừng hẳn và các cụm phía ngoài không còn cách xuất hiện.

## Những mục còn cần sửa

### 1. Chế độ giảm chuyển động làm mất các cụm phía ngoài khung

`app/page.module.css:1437` chỉ tắt animation; track vẫn có `width: max-content` và ticker vẫn `overflow: hidden`.

- 320 px: chỉ “TƯ VẤN” và “TRỊ LIỆU” xuất hiện đầy đủ; bốn cụm còn lại bị cắt.
- 768 px: bốn cụm đầu xuất hiện đầy đủ; “XUYÊN SUỐT” bị cắt một phần, “BỀN VỮNG” nằm ngoài khung.
- 1440 px: cả sáu cụm xuất hiện đầy đủ.

Đề xuất: khi bật giảm chuyển động, hiển thị một bản nội dung tĩnh, cho xuống dòng và ẩn bản lặp. Giữ dấu chấm phân cách.

### 2. Thiếu cơ chế dừng chuyển động cho người đọc

`app/page.module.css:1402` tự chạy vòng lặp 26 giây vô hạn. Ticker không có control dừng/chạy và không dừng khi hover. Đổi thiết lập giảm chuyển động của hệ điều hành chưa được coi là kiểm chứng một cơ chế dừng trực tiếp trên trang.

[WCAG 2.2.2 — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) yêu cầu có cơ chế dừng, tạm dừng hoặc ẩn cho nội dung tự chuyển động quá năm giây, xuất hiện cùng nội dung khác và không có chuyển động thiết yếu. Dòng chữ này có các đặc điểm đó; `aria-hidden` không loại bỏ sự phân tâm thị giác. Chỉ dừng trong lúc hover/focus cũng không đáp ứng đầy đủ yêu cầu này.

Đề xuất: bổ sung control dừng/chạy có tên truy cập được, hoạt động bằng bàn phím và cảm ứng, giữ trạng thái dừng khi người dùng chuyển focus sang phần khác. Hoặc hiển thị dòng tĩnh.

## Kiểm tra code

| Lệnh                | Kết quả              |
| ------------------- | -------------------- |
| `npm run lint`      | Đạt, không warning   |
| `npm run typecheck` | Đạt                  |
| `npm test`          | 14 file, 61 test đạt |
| `npm run build`     | Đạt, sinh 26 trang   |

## Giới hạn kiểm tra

- Zoom 200% thật chưa kiểm chứng. Đã kiểm tra mô phỏng reflow của viewport 1440 × 900 bằng viewport CSS 720 × 450: không tràn ngang và ticker không bị che. Không đánh dấu mô phỏng là native zoom.
- Chưa kiểm tra Safari/iOS, mobile thật, screen reader thật hoặc Lighthouse/Web Vitals.
- Không có exception JavaScript được ghi nhận. Browser có hai warning preload stylesheet của trang; chưa quy lỗi cho ticker. Một số request ảnh/prefetch bị `ERR_ABORTED` trong quá trình resize/navigation; không coi đây là bằng chứng endpoint hỏng.
- Lượt kiểm tra HTTP bổ sung không ghi nhận response có status từ 400 trở lên.
- Các mục form, CMS thật/fallback, API, secrets, consent mới, metadata mới, sitemap và redirect không áp dụng cho nội dung ticker tĩnh. Sáu cụm nằm trực tiếp trong source, không lấy từ Sanity.

## Bằng chứng

- `.context/ticker-checklist-results.json`: phép đo viewport, tương phản, chuyển động, overlay và console.
- `.context/ticker-checklist-followup-results.json`: kiểm tra bàn phím và HTTP bổ sung.
- `.context/ticker-checklist-{320,768,1440}.png`: giao diện khi chữ chạy.
- `.context/ticker-checklist-{320,768,1440}-reduced-motion.png`: giao diện khi giảm chuyển động.
- `.context/ticker-checklist-reduced-motion-detail.png`: cận cảnh lỗi cắt chữ ở 320 px.
- `.context/ticker-checklist-keyboard.png`: focus bàn phím ở footer.

Script kiểm tra nằm trong `.context/check-ticker.mjs` và `.context/check-ticker-followup.mjs`; không thêm dependency cho ứng dụng.
