# Frontend checklist — “Một lộ trình xuyên suốt.”

Kiểm tra ngày 2026-10-10 theo `docs/FRONTEND_CHECKLIST.md`, sau khi hoàn tác demo artwork và số phấn nâu.

## Phạm vi và kết luận

Khối ba bước trên homepage: `section[aria-labelledby="continuity-heading"]`, các heading/mô tả và số 01–02–03 bằng font gốc. Review working tree của branch `feat/7-homepage-improvements`, tại base commit `fc091da5ef8dd8f351be8b2c3457e6228aa0b5d8`; workspace có các thay đổi chưa commit từ những công việc khác.

**Không phát hiện lỗi cần sửa trong section.** Bố cục gốc được giữ nguyên. Lượt này bổ sung báo cáo checklist; không xác nhận toàn website đã sẵn sàng production/cutover. Hai cảnh báo CSS preload của trang được ghi riêng bên dưới.

Môi trường: Chromium qua Playwright và native Chromium accessibility tree qua CDP; Next.js 16.3.8; dev `localhost:3000`, production build kiểm tra tại `localhost:3137`.

## Semantics, responsive và bàn phím

- [x] Homepage có đúng một `h1`, một `main#main`; section có tên truy cập bằng `aria-labelledby="continuity-heading"`.
- [x] Heading của section là `h2`, ba bước dùng `h3`, không nhảy cấp trong section. Native accessibility tree giữ region và các heading.
- [x] Ba bước dùng `ol` với ba `li`; thứ tự DOM khớp thứ tự hiển thị. Ba số trang trí có `aria-hidden="true"`; CDP xác nhận cả ba node bị bỏ qua bởi `ariaHiddenElement`. Heading/mô tả vẫn truyền tải đầy đủ ý nghĩa.
- [x] Không tràn ngang ở 1440, 768, 390 và 320 CSS px: document width bằng viewport. Desktop ba cột; từ 980px trở xuống một cột.
- [x] Reflow tương đương zoom 200% của cửa sổ 1440×1100: viewport 720×550 CSS px, device scale factor 2; document width 720px; ba thẻ rộng 672px, nằm trong x24–696. Đây là mô phỏng reflow, chưa phải thao tác zoom native của trình duyệt.
- [x] Ở mobile 320px, cuộn heading và đoạn cuối vào giữa vùng đọc: không có fixed/sticky element giao với bounding box của các nội dung này. Header/chat vẫn hiển thị trong ảnh; không dùng CSS ẩn overlay để tạo bằng chứng pass.
- [x] Tab đầu tới “Bỏ qua điều hướng”, có outline nhìn thấy; Enter chuyển URL tới `#main`; Tab tiếp theo tới input “Số điện thoại” trong nội dung chính. Không khẳng định `main` nhận DOM focus: Chromium giữ active element là body sau Enter.
- [x] Section không có control, form, link hoặc tab stop; không tạo focus trap hay trạng thái tương tác cần kiểm mới.
- [x] Không có animation đang áp dụng trong section khi kiểm với reduced motion; production cũng có 0 animation trong section.

Sticky header hoặc widget có thể đi qua nội dung khi cuộn; kiểm tra vùng đọc không chứng minh rằng không bao giờ có giao nhau tại mọi scroll offset.

## Nội dung, accessibility và hiệu năng

- [x] Tương phản từ computed styles: heading sage trên nền trang **6,53:1**; số clay-deep trên nền thẻ **5,89:1**; heading thẻ ink **11,03:1**; body muted **6,66:1**. Đều vượt 4,5:1.
- [x] Số gốc hiển thị đúng 36px; không còn ảnh số phấn hoặc artwork trong section. Ý nghĩa không phụ thuộc vào màu/ảnh.
- [x] Copy mô tả hoạt động tư vấn → trị liệu → tập luyện và mục tiêu sinh hoạt/thể thao; không thêm cam kết khỏi bệnh, thời hạn kết quả, chứng chỉ hoặc thông tin liên hệ chưa xác nhận.
- [x] Section không thêm client JavaScript, font, tracker, origin, ảnh hoặc animation. Các mục `next/image`, alt, kích thước ảnh và LCP image không áp dụng cho section không có ảnh.
- [x] Production render ở 1440/320px giữ ba bước, số gốc, không tràn ngang; không có response HTTP ≥400 trong các lượt điều hướng đã theo dõi, không có console error.
- [x] Homepage giữ `lang="vi"`, title tiếng Việt, canonical `https://holisticvn.com/` và Open Graph URL cùng domain.

## Lệnh kiểm tra toàn workspace

| Lệnh                | Kết quả                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `npm run lint`      | PASS, exit 0                                                         |
| `npm run typecheck` | PASS, exit 0                                                         |
| `npm test`          | PASS, 13 files / 60 tests, exit 0                                    |
| `npm run build`     | PASS, 26 trang được tạo, exit 0; không có warning trong build output |
| `git diff --check`  | PASS                                                                 |

Các lệnh kiểm tra working tree tại thời điểm chạy, gồm cả những thay đổi khác trong workspace; báo cáo không đưa các thay đổi đó vào commit checklist. Section được đối chiếu lại với snapshot trước demo để xác nhận hoàn tác đầy đủ.

## Cảnh báo runtime ngoài section

Chrome production báo hai loại cảnh báo preload CSS chưa được dùng sau vài giây:

- `3p7kgmuf1-eqi.css` — 7.773 bytes, selector của trang services.
- `0li82rz223ugt.css` — 7.626 bytes, selector của trang treatments.

DOM ghi nhận hai link `rel="preload" as="style"`; stylesheet đang áp dụng cho homepage là hai chunk khác, trong đó chunk homepage chứa `.stepsGrid`. Các cảnh báo có thể lặp theo lượt điều hướng. Chưa kết luận nguyên nhân đầy đủ hoặc đo tác động của preload này; không gọi production console hoàn toàn sạch.

## Không áp dụng / chưa kiểm

- Form submit, validation, email, rate limiting, CMS/API permissions, analytics consent, redirects và các luồng cutover: ngoài phạm vi section này.
- Sanity thật: section dùng copy local cố định, không có binding CMS được thay đổi.
- Safari, thiết bị vật lý, ứng dụng screen reader, zoom native 200%, Lighthouse/Web Vitals và hiệu năng trên deployment thật: chưa kiểm; không dùng mô phỏng hoặc build local để đánh dấu những mục này đạt.

## Bằng chứng

Trong `.context/continuity-checklist/`:

- `section-{1440,768,390,320}.png`: section ở dev, với chrome giao diện giữ nguyên.
- `production-{1440,320}.png`: section trên production build.
- `reflow-200-equivalent.png`, `mobile-readable-320.png`, `keyboard-skip.png`: reflow, vùng đọc và bàn phím.
- `accessibility.md`: Playwright snapshot; các kết luận về `aria-hidden` còn được kiểm bằng native CDP vì snapshot DOM có thể vẫn hiển thị generic node trang trí.
- `lint.log`, `typecheck.log`, `test.log`, `build.log`: output các lệnh kiểm tra.

Ảnh/log trong `.context` là bằng chứng local, không được track trong Git.
