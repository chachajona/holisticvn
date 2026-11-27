# 02 — CTA cuối trang giữ đủ chỗ cho phần chữ ở desktop hẹp

Written against: `a5bd2debfdbc731421671a51b185cb631c7eb1b7`.

Trạng thái: đã triển khai local ngày 2026-11-14 theo yêu cầu người dùng; bằng chứng trong [verification note](../docs/services-layout-verification.md). Surface duy nhất: CTA cuối `/services`; theo dõi issue #41/#1.

## Evidence chain

- Problem: tại 1024px, `.ctaCopy` khoảng 247px; ba actions khoảng 577px; heading bị ép thành ba dòng. Baseline `.context/services-desktop-1024.png` (gitignored). Đây là mất cân đối quan sát được, không phải lỗi tràn ngang.
- Design evidence: `.ctaCard` flex row, padding 56px, gap 40px; `.ctaActions { flex:none }`; `.ctaCopy { max-width:480px }`. Hiện chỉ ≤980px mới stack. `page.tsx` có đúng ba đích booking/treatments/contact và ba cấp nút.
- Runtime: `ServicesPage` → `.cta` → `.ctaCard`/`.ctaCopy`/`.ctaActions` từ CSS Module local.
- Source: [GOV.UK Layout](https://design-system.service.gov.uk/styles/layout/) khuyên thiết kế theo không gian; nguồn không ấn định 1280px. Giữ Warm Clay, frame 1360px và `--dark-cta` của dự án.
- Owner/scope: `app/services/services.module.css`; chỉ cần sửa `page.tsx` nếu thực hiện thêm plan overlay. Không sửa CTA của `/treatments`.
- Uncertainty: breakpoint và cảm nhận cân đối cần chốt trên preview với font đã tải xong.

## Design decision

Mở rộng variant CTA đang có từ ≤980px lên **≤1280px**: copy trên, action group dưới. Ở >1280px giữ hai phần ngang. Ở ≤700px vẫn ba nút dọc full width. Không giảm font, bỏ mô tả, rút nhãn hoặc xoá một đích để ép vừa.

Tính trên layout hiện có: tổng bề ngang cần cho copy 480px + actions ~577px + gap 40px + padding 112px + gutter 48px ≈1257px. Chọn breakpoint có sẵn trong ma trận review là 1280px để có khoảng dư; đây là **đề xuất kích thước mới**, không phải token hiện hành.

## Reuse

- `.ctaCard` variant column hiện có: `flex-direction:column; align-items:flex-start; gap:24px`.
- `.ctaCopy` max 480px, `.ctaActions` wrap/gap16px; `.lightButton`, `.darkSolidButton`, `.darkOutlineButton` và thứ tự ưu tiên hiện có.
- Padding 56px desktop/28px mobile; radius18px/16px; `--dark-cta`, off-white, heading font và focus hiện có.
- Không tạo shared CTA component hoặc thay palette. CTA Methods có owner/garland riêng nên không dùng làm consumer của thay đổi này.

## Changes

1. `app/services/services.module.css`
   - Tách block `.ctaCard` ra khỏi media `max-width:980px` sang media `max-width:1280px`. Giữ `.processGrid`, `.panel`, `.panelMedia`, `.panelCopy` ở breakpoint cũ.
   - Trong variant ≤1280px, `.ctaCopy` width100%/max480px, `.ctaActions` max-width100%, cho wrap. Không fixed-width action group; các nhãn dài phải tăng chiều cao hoặc xuống hàng.
   - Giữ ≤700px `.ctaActions` column, stretch, nút full width. Dùng min-width:0/max-width:100% trên child cần thiết nếu label dài gây tràn; không dùng `white-space:nowrap` hoặc `overflow:hidden` để che lỗi.
   - Chỉ trong layout rộng >1280px, copy 480px và action group ngồi ngang khi nội dung hiện tại đủ chỗ; với label dài/font lớn cho parent wrap thay vì co chữ dưới 420px. Dùng `min-width:min(100%,420px)` cho copy và `flex-wrap:wrap` ở card; không bắt ngang bằng mọi giá. Variant column phải reset min-width về0 và không kế thừa flex-basis theo chiều dọc. 420px là measure đã có của `.introSide p`, không phải token chung.
   - Khi ghép plan 03, contact links nằm trong action-side wrapper local, không phải flex item thứ ba ngang hàng với copy và ba nút. Cho wrapper wrap/stack cùng breakpoint này.
2. `app/services/page.tsx`
   - Nếu chỉ chạy plan này, không cần đổi markup/copy/link. Nếu ghép plan 03, dùng một wrapper chứa `.ctaActions` và `.contactLinks` để card vẫn chỉ có copy-side/action-side.
   - Giữ heading, mô tả, ba link theo thứ tự `/booking` → `/treatments` → `/contact`.

## Scope

- Inherit: chỉ closing CTA Services.
- Verify: 980px vẫn stack; 1024/1280px copy trên, actions dưới; 1281/1440px copy/actions ngang khi đủ chỗ.
- Exclude: process layout, accordion, heading scale, màu CTA, form, CMS và CTA trang khác.

## Validation

- Product: tại 1024px, copy có measure tối đa480px thay vì bị ép còn247px; không có word bị cắt. Không quy định số dòng tuyệt đối khi font/zoom đổi.
- Interface: 320/390/700/701/768/980/1024/1280/1281/1440px, zoom200%; nhãn dài gấp đôi. Nút “Liên hệ” có thể wrap ở 701–736px, đây là hành vi hợp lệ; không cố giữ ba nút một hàng.
- System: mọi hành động vẫn có đích, primary booking giữ độ nổi; không thay toàn cục `.button`, không copy garland/shadow mới.
- Tests: không thêm unit test cho giá trị breakpoint/CSS; dùng screenshot và geometry thực. Tests link hiện có trong `tests/services-sanity.test.tsx` phải pass.
- Repository: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` phải đạt sau tổng hợp.

## Stop conditions

- Nếu width/font/copy source khác baseline, đo lại trước khi cố giữ breakpoint. Không giảm font để pass ảnh chụp.
- Nếu cần đổi nội dung hoặc bỏ CTA mới cân đối, quay lại quyết định thiết kế; không tự sửa wording y tế hay xoá lối liên hệ.

## Design documentation

Sau chấp nhận: ghi ngoại lệ breakpoint1280px chỉ cho CTA Services trong `DESIGN.md`, kèm cơ sở đo và ảnh1024/1440. Không đổi breakpoint của page body/chrome toàn site.
