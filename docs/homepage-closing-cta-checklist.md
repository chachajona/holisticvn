# Frontend checklist — hai CTA cuối homepage

Kiểm tra ngày 2026-10-10 theo `docs/FRONTEND_CHECKLIST.md`, phạm vi hai thẻ “Bắt đầu từ tư vấn” và “Trị liệu & tập luyện”, sau testimonials và trước Instagram. Source: `app/page.tsx`, `app/page.module.css`, `public/assets/textures/brand-paper.webp`.

Chạy trên production build Next.js 16.3.8 bằng `next start` ở cổng 3100, Chromium 155, dữ liệu fallback. Kết quả thô: `.context/closing-cta-checklist-results.json`.

## Kết quả

Các mục bắt buộc liên quan trực tiếp đến cụm CTA đã đạt trong môi trường kiểm tra. Không có lỗi JavaScript, HTTP 4xx/5xx hoặc CSP. Trang có hai warning về CSS preload đã được ghi nhận trong `docs/HOMEPAGE_VERIFICATION.md`; vì vậy mục console không warning chưa đạt trên toàn homepage. Các giới hạn về trình duyệt, zoom và CMS được ghi bên dưới.

## Lệnh kiểm tra dự án

- [x] `npm run lint` — exit 0, không warning.
- [x] `npm run typecheck` — exit 0.
- [x] `npm test` — 13 file, 60 test đạt.
- [x] `npm run build` — exit 0; build và prerender hoàn tất, không warning.

## Semantics, responsive và tương tác

- [x] Homepage có đúng một `h1` và `<main id="main">`. Hai tiêu đề CTA là `h2`, không thêm cấp heading bị nhảy.
- [x] Cụm có accessible name “Bắt đầu cùng Holistic”; accessibility snapshot đọc hai heading và hai link đúng tên/đích.
- [x] Cả hai hành động dùng native `<a>`, có nhãn phân biệt được trong ngữ cảnh.
- [x] Tab đi từ “Đặt lịch tư vấn” tới “Xem dịch vụ”; Shift+Tab quay lại đúng nút tư vấn.
- [x] Focus là outline 2px, offset 4px: off-white trên thẻ nâu, clay-deep trên thẻ kem. Không bị clip.
- [x] Enter trên hai link mở đúng `/booking` và `/services`; trang đích có nội dung chính đúng. Không gửi form hoặc tạo yêu cầu thật.
- [x] Skip link nhận Tab đầu tiên; Enter dẫn tới `#main`; Tab tiếp theo đi vào control trong main.
- [x] Không tràn ngang hoặc nhãn nút xuống dòng tại 320, 390, 768, 1024 và 1440 px.
- [x] Desktop hai thẻ cao 140px, nội dung nằm ngang; mobile xếp dọc và chiều cao theo nội dung.
- [x] Hit-test ở 15%, 50%, 85% chiều ngang từng nút tại vị trí kiểm tra: không bị sticky header, cookie banner hoặc chat widget che.
- [x] Nút tư vấn khi hover có `transform: none`, `transition-duration: 0s`; chỉ đổi nền nhẹ.
- [x] Kiểm tra với `prefers-reduced-motion: reduce` và chế độ motion bình thường: cụm CTA không có animation hoặc chuyển động. Nút dịch vụ chỉ chuyển màu/viền.
- [x] Reflow tương đương desktop 1440px tại 200%: viewport CSS 720px, DPR 2, không tràn ngang, cả hai nút đọc được và hit-test đạt.
- [ ] Zoom 200% bằng control của trình duyệt thật — chưa kiểm tra; phép reflow phía trên không được ghi là phép zoom native.

## Tương phản

Đo màu computed trong browser cho màu phẳng, và lấy mẫu nền texture từ screenshot production 1440px khi ẩn chữ/control bằng stylesheet chỉ dùng để chụp. Đây là đo trên vùng texture lấy mẫu, không phải một audit từng pixel của toàn trang.

| Thành phần | Tỷ lệ | Ngưỡng | Kết quả |
| --- | --- | --- | --- |
| Heading 28px và focus off-white trên vùng texture nâu được lấy mẫu | tối thiểu 4.13:1 | 3:1 | Đạt |
| Chữ nút tư vấn mặc định | 13.13:1 | 4.5:1 | Đạt |
| Chữ nút tư vấn khi hover | 11.03:1 | 4.5:1 | Đạt |
| Heading sage trên nền kem | 5.49:1 | 3:1 | Đạt |
| Chữ nút dịch vụ trên nền kem | 11.03:1 | 4.5:1 | Đạt |
| Focus clay-deep trên nền kem | 5.89:1 | 3:1 | Đạt |

## Hình ảnh, nội dung, SEO và tải trang

- [x] Texture có nguồn owner trong brand guideline; asset local trả HTTP 200, 21,214 bytes. Không có ảnh người hoặc tuyên bố y tế mới.
- [x] Texture là CSS background trang trí, không được đọc trong accessibility tree, không nhận pointer; không cần alt hoặc kích thước của ảnh nội dung.
- [x] Các nhãn ngắn, khớp trang đích; không đưa ưu đãi, kết quả điều trị hoặc thông tin chưa xác nhận.
- [x] `lang="vi"`, title, canonical và Open Graph có trong HTML production; canonical dùng `https://holisticvn.com/`.
- [x] Không thêm route, redirect, external origin, font, client component, JavaScript hoặc tracker cho cụm CTA.
- [x] Trong lượt browser kiểm tra, homepage trả HTTP 200; không request thất bại, lỗi JavaScript hoặc lỗi CSP.
- [x] CLS của lượt tải toàn homepage trong các viewport kiểm tra nằm từ 0.0018 đến 0.0222; đây là số đo local một lượt, không phải dữ liệu người dùng thực hoặc kết luận riêng cho CTA.
- [ ] Console toàn homepage không warning: có hai warning “preloaded but not used within a few seconds” cho CSS chunks. Đã đọc file build: `0li82rz223ugt.css` thuộc `/treatments`, `3p7kgmuf1-eqi.css` thuộc `/services`; cả hai không chứa selector CTA. Warning tương tự đã được ghi trong `docs/HOMEPAGE_VERIFICATION.md`; không phát sinh từ texture hoặc CSS của hai thẻ. Chưa xử lý preload của các route khác trong phạm vi này.

## Cookie, CMS và mục ngoài phạm vi

- [x] Kiểm tra với cookie banner hiện ở mọi viewport; ở 320 và 1440px có thêm screenshot khi banner ẩn.
- [x] Dùng bàn phím chọn “Từ chối”: banner ẩn và lựa chọn được giữ sau khi tải lại trang.
- [x] Không có request tới GTM/GA, Facebook hoặc Zalo trong lượt chưa chấp nhận. Local không cấu hình GTM, nên không ghi đây là kiểm chứng cấu hình analytics production.
- [ ] Dữ liệu Sanity thật: local chưa cấu hình project. Hai tiêu đề và đích CTA là nội dung server tĩnh, không phụ thuộc CMS; chưa xác nhận một lượt chạy với Sanity thật.
- [ ] Safari, thiết bị thật và screen reader thật: chưa kiểm tra. Snapshot accessibility và keyboard ở trên dùng Chromium.

Không áp dụng cho thay đổi này: validation form, pending/success/error của lead capture, email Resend, API/CMS authorization, thay đổi sitemap/redirect và cutover domain. Chỉ mở trang đích, không submit form thật.

## Screenshot

- `.context/closing-cta-checklist-320-banner.png`
- `.context/closing-cta-checklist-1440-banner.png`
- `.context/closing-cta-checklist-320-clean.png`
- `.context/closing-cta-checklist-1440-clean.png`
- `.context/closing-cta-checklist-texture-background.png` — nền để đo tương phản.
