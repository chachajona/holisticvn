# Frontend checklist — homepage comparison

Ngày kiểm tra: 2026-10-09. Phạm vi: bảng “Holistic khác với những giải pháp khác ra sao?” trong `app/page.tsx` và `app/page.module.css`. Checklist nguồn: `docs/FRONTEND_CHECKLIST.md`.

Các lệnh và browser checks được chạy trên toàn workspace tại thời điểm audit, có những thay đổi song song ngoài bảng. Commit của bảng được stage riêng; báo cáo không khẳng định đã chạy lại toàn bộ checks trên snapshot riêng của commit đó. Screenshots và detector output trong `.context/` là artifacts local, không được đưa vào Git.

## Kết luận

Không phát hiện lỗi chức năng hoặc layout trong phần bảng vừa sửa trên Chromium. Các lệnh kiểm tra repo đều đạt. Đây là kiểm tra có phạm vi, không phải xác nhận toàn website đã sẵn sàng production hoặc chứng nhận WCAG.

## Automated checks

| Lệnh                | Kết quả                                              |
| ------------------- | ---------------------------------------------------- |
| `npm run lint`      | PASS, exit 0                                         |
| `npm run typecheck` | PASS, exit 0                                         |
| `npm test`          | PASS, 14 files / 61 tests                            |
| `npm run build`     | PASS, 26 static pages; không có warning trong output |
| `git diff --check`  | PASS                                                 |

Build lần đầu bị từ chối vì một build khác đang giữ khóa. Sau khi tiến trình đó kết thúc, chạy lại thành công; không xóa khóa hay dừng tiến trình của workspace khác.

## Responsive và scroll

Đã kiểm tra ở dev `localhost:3111` và production local `localhost:3112` bằng Chromium, chiều cao viewport 1000 px. Số đo dưới đây lấy từ production. `document.scrollWidth` luôn bằng viewport, nên không có scroll ngang toàn trang. Scroll ngang chỉ nằm trong bảng theo yêu cầu của owner.

| Viewport | Document width | Scroll tối đa của bảng | X cột Tiêu chí / Holistic, đầu → cuối |
| -------- | -------------- | ---------------------- | ------------------------------------- |
| 1440     | 1440           | 0                      | 41 / 394.08 → 41 / 394.08             |
| 768      | 768            | 82                     | 25 / 233 → 25 / 233                   |
| 640      | 640            | 748                    | 21 / 157 → 21 / 157                   |
| 390      | 390            | 248                    | 21 / 157 → 21 / 157                   |
| 320      | 320            | 172                    | 21 / 133 → 21 / 133                   |

- [x] Cuộn đến cả hai đầu bằng ArrowLeft/ArrowRight.
- [x] Hai cột đầu cố định, không đổi tọa độ khi cuộn.
- [x] Cuộn bằng wheel ngang trên dev 390 px: 0 → 248 px.
- [x] Nền cột cố định che nội dung chạy phía dưới; header đối thủ cuối đọc được trên screenshot.
- [x] Desktop và mobile dùng cùng một bảng, 5 cột và 6 tiêu chí.
- [x] Native scroll area; không có range slider riêng hoặc client component cho bảng.
- [ ] Zoom trình duyệt thật 200%: chưa kiểm chứng. Đã kiểm tra reflow tại 640 CSS px, tương đương bề ngang desktop 1280 px sau zoom 200%, nhưng không thay thế kiểm tra zoom thật. Phím zoom trong browser automation không thay đổi `innerWidth`/DPR nên không tính là đạt.
- [ ] Safari desktop và iPhone thật: chưa kiểm chứng; các viewport mobile ở trên là mô phỏng trong Chromium.

## Semantics, keyboard và accessibility

- [x] Homepage có đúng 1 `h1`, `main#main`, heading không nhảy cấp.
- [x] Caption của bảng có trong accessibility snapshot; có 5 `scope="col"`, 6 `scope="row"`.
- [x] Ô dữ liệu được đặt tên “Có” / “Không”; ký hiệu trang trí có `aria-hidden`.
- [x] Scroll region có accessible name, mô tả hướng dẫn, `tabIndex=0`.
- [x] Focus outline 2 px hiển thị; Tab/Shift+Tab vào và ra được. Link trước bảng là “Xem các phương pháp”, sau bảng là Google reviews; không bẫy focus.
- [x] Skip link hiện khi Tab, dẫn đến `#main`; Tab tiếp theo vào control trong main.
- [x] Tất cả external links mở tab mới được kiểm tra có `noopener noreferrer`.
- [x] Cookie banner ở 320 px có thể từ chối bằng focus + Enter; banner đóng, không khóa thao tác bảng lâu dài.
- [x] Với `prefers-reduced-motion: reduce`, bảng không có animation hay transition.

Tương phản tính từ màu computed trong trình duyệt theo công thức relative luminance sRGB:

| Thành phần                            | Tỉ lệ   |
| ------------------------------------- | ------- |
| Header thường                         | 7.23:1  |
| Header Holistic                       | 6.16:1  |
| Nhãn hàng                             | 13.13:1 |
| Ký hiệu Có trên nền Holistic          | 5.92:1  |
| Ký hiệu Không / outline trên nền card | 7.01:1  |
| Hint / legend                         | 7.93:1  |

Các mẫu trên đều vượt ngưỡng 4.5:1. Chưa chạy VoiceOver trên thiết bị thật; snapshot accessibility không thay thế trải nghiệm screen reader.

## Console và hiệu năng

- Production local: 0 console errors, không có pageerror khi thao tác bảng. Sau khi chờ lâu hơn, có 2 warning về CSS preload chưa được sử dụng (`0li82rz223ugt.css`, `3p7kgmuf1-eqi.css`). DOM xác nhận chúng là `rel="preload" as="style"`, chưa có trong `document.styleSheets`; không phải stylesheet đang áp dụng cho bảng. Chưa kết luận nguyên nhân hoặc ảnh hưởng Web Vitals.
- Dev: 0 errors; xuất hiện 1 cảnh báo Next Image về `/images/Iastm.jpg` bị nhận diện là LCP sau lượt điều hướng/skip link. Ảnh này thuộc phần khác của homepage, không phải bảng. Không tái hiện warning trên production (production có thể không phát cảnh báo dev); chưa có phép đo Web Vitals để kết luận hiệu năng ảnh.
- Không thêm JS client, font, ảnh, tracker hoặc third-party origin cho bảng; không đổi forms, API, metadata, CMS, consent logic.
- Detector gần nhất của cùng implementation: `.context/comparison-implementation-detector.json` chứa `[]`; không có deterministic findings.

## Đánh giá kỹ thuật có phạm vi

| Dimension     | Điểm / 4 | Ghi chú                                                             |
| ------------- | -------- | ------------------------------------------------------------------- |
| Accessibility | 3        | Keyboard, semantics, contrast đạt; chưa VoiceOver thật              |
| Performance   | 4        | Bảng native HTML/CSS, không thêm client JS                          |
| Responsive    | 3        | Các viewport đạt; Safari và zoom thật còn thiếu                     |
| Theming       | 3        | Dùng brand tokens; còn màu literal cho border/header                |
| Integrity     | 3        | Một bảng nhất quán; claims đối thủ là nội dung kế thừa cần theo dõi |
| Tổng          | 16 / 20  | Good; điểm chỉ áp dụng phần bảng đã kiểm tra                        |

Implementation integrity: PASS cho cấu trúc responsive — cùng dữ liệu và markup giữa desktop/mobile, hai cột neo theo quyết định owner, không có UI điều khiển dư thừa. Điểm số không phải chứng nhận accessibility hoặc release gate cho toàn site.

## Follow-up ngoài thay đổi responsive

1. **P2 — Cảnh báo LCP ảnh Iastm.** Vị trí: ảnh nội dung ngoài bảng trên `app/page.tsx`. Cần đo LCP với lượt tải đầu trên production preview, xác định ảnh thực sự above-the-fold trước khi đổi loading. Không nên eager-load chỉ dựa vào cảnh báo sau điều hướng/scroll. Chưa chứng minh đây là hồi quy của bảng.
2. **P2 — Nội dung so sánh nhóm đối thủ.** Vị trí: `compareRows` trong `app/page.tsx`. Ma trận Có/Không hiện tại được giữ theo quyết định owner; các nhận định khái quát về bệnh viện/spa/PT chưa có bằng chứng cho mọi cơ sở. Có thể diễn đạt theo loại hình thường gặp hoặc bổ sung giới hạn áp dụng sau khi owner duyệt wording. Tham khảo `docs/homepage-comparison-research.md`.
3. **P2 — CSS preload chưa dùng trên production local.** Vị trí: hai CSS chunks do Next sinh trong `.next/static/chunks`, nội dung xác nhận thuộc treatments và services; không phải CSS bảng homepage. Không thay đổi preload trong lượt sửa bảng. Cần kiểm tra có phải route prefetch hay preload không cần thiết trên production preview, rồi đo tác động trước khi sửa. Có warning xác minh được; chưa thấy lỗi render hoặc chức năng.

Không sửa code trong lượt audit này. Nếu xử lý follow-up, dùng `$impeccable optimize` cho LCP, `$impeccable clarify` cho wording, rồi `$impeccable polish` và audit lại.

## Không áp dụng / chưa chạy

Không kiểm tra gửi email, staging forms, Studio, domain cutover, Lighthouse production, CMS live/fallback variants của các section khác. Bảng này dùng dữ liệu static `compareRows`, không có hai biến thể Sanity/fallback. Các mục toàn website trong checklist gốc vẫn giữ nguyên trạng thái.

## Screenshots

- `comparison-checklist-production-mobile-start.png`: mobile 390 px, đầu bảng.
- `comparison-checklist-production-mobile-end.png`: mobile 390 px, cuối bảng.
- `comparison-checklist-320-end.png`: 320 px, cuối bảng.
- `comparison-checklist-1440.png`: desktop.
