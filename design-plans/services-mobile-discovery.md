# 01 — Thấy các nhóm dịch vụ trước nội dung mở rộng trên mobile

Written against: `a5bd2debfdbc731421671a51b185cb631c7eb1b7`.

Trạng thái: đã triển khai local ngày 2026-11-14 theo yêu cầu người dùng; bằng chứng trong [verification note](../docs/services-layout-verification.md). Yêu cầu: cải thiện bố cục `/services` desktop/mobile, giữ nhận diện và dữ liệu hiện hành. Theo dõi ở issue #41 thuộc #1; không coi file này là task status.

## Evidence chain

- Surface: `/services` ở 390×844, không hash, nhóm đầu mở. Baseline `.context/services-mobile-top.png` và `services-mobile-full.png` (chỉ local).
- Problem: panel đầu khoảng 862px; summary nhóm thứ hai tới khoảng y=1250px. Tổng quan lựa chọn nằm sau ảnh và nội dung của lựa chọn đầu.
- Design evidence: `page.tsx` render `open={index === 0}`; CSS stack panel ở 980px, intro/summary ở 860px. `PRODUCT.md` đặt vai trò services là các nhóm trong một lộ trình; không tạo thêm phân loại triệu chứng. [GOV.UK Accordion](https://design-system.service.gov.uk/components/accordion/) đề cập danh sách anchor đầu trang; áp dụng vào đây là đề xuất UX, không phải bug do sai token.
- Owner/runtime: `getServices()` → `services.map` → `serviceAnchor[group]` → native details; `HashOpen` mở row khi hash đổi/click lại.
- Scope: `app/services/page.tsx`, `services.module.css`, `tests/services-sanity.test.tsx`. `hash-open.tsx` chỉ xác minh, không dự kiến sửa.
- Uncertainty: chưa usability-test với khách hàng; không hứa số lần cuộn hoặc tăng conversion.

## Design decision

Thêm mục lục link gọn trong flow, chỉ hiện ở ≤860px, nằm sau intro và trước `.index`. Giữ nhóm đầu mở từ server. Mục lục dùng cùng mảng dữ liệu với details để người xem tới nhóm khác trước khi phải đọc panel đầu. Không sticky hoặc dùng state active.

## Reuse

- `getServices()`, `serviceAnchor`, `service.shortTitle`, `HashOpen`, tên nhóm và thứ tự CMS.
- `.textLink` làm mẫu typography: accent 400/14.5px, clay-deep; `.methods` làm mẫu khoảng cách/border 8px và `rgba(116,77,64,.3)`.
- Frame `.index`: gutter 16px dưới 700px, còn lại body 1360px/24px. `--font-accent`, `--clay-deep`, `--sage`, `--card` của `.root`.
- Exemplar hành vi: `app/treatments/page.tsx` dùng anchor navigation; không chép gallery, filters hoặc motion của Methods.
- Chỉ thêm composition/class local `groupNav`, `groupNavLabel`, `groupNavLinks`; không trích shared component. Giải quyết điều hướng toàn trang, khác chip treatment con nên không dùng trực tiếp class `.methods` cho tất cả thuộc tính.

## Changes

1. `app/services/page.tsx`
   - Trong điều kiện `services.length > 0`, trước `.index`, render một `<nav aria-label="Đi nhanh đến nhóm dịch vụ">` cùng nhãn nhìn thấy được.
   - Render `<ul>`/`<li>` từ chính `services` theo thứ tự nhận được; mỗi item là `<a href={\`#${serviceAnchor[service.group]}\`}>`chứa`shortTitle`và mũi tên trang trí`aria-hidden`.
   - Không viết cứng bốn link, không sinh nav cho service rỗng, không tạo ID thứ hai trùng `svc-*`, không thêm `role="tab"` hay `aria-current` khi không theo dõi trạng thái.
   - Giữ một bộ details duy nhất, `name="services"`, chỉ nhóm đầu open, alias manual, DOM copy + CTA trước ảnh. Native anchor cùng trang dùng được bởi click listener của `HashOpen` hiện tại.
2. `app/services/services.module.css`
   - `groupNav` mặc định `display:none`; trong media ≤860px hiện thành block. Không render nhánh mobile bằng JS.
   - List lưới `repeat(2,minmax(0,1fr))`, gap 8px, không bullet/default padding; margin dưới 24px, gutter giống `.index`.
   - Link tối thiểu cao 44px, padding 12px; accent 14.5px/1.6 weight 400; border 1px như `.methods`, radius 14px như `.subCard`, nền paper. Cho wrap và tăng chiều cao theo chữ; `min-width:0`, không ellipsis/fixed height/scroll ngang. Hover/focus theo clay hiện có.
   - Nhãn nav dùng cùng body/link typography, margin dưới 12px. Không thêm mono kicker cho heading hoặc shadow mới.
3. `tests/services-sanity.test.tsx`
   - Bổ sung hành vi: reordered/partial services tạo nav đúng thứ tự và chỉ link tới ID có thật; rỗng không có nav; long shortTitle không bị thay bằng nhãn viết cứng.
   - Giữ test first-open/exclusivity/alias/booking/recovery. Không snapshot CSS hoặc viết test chỉ khẳng định class mới tồn tại.

## Scope

- Inherit: `/services` ở ≤860px; desktop >860px giữ intro/index cũ.
- Verify: hash từ homepage/footer; các CTA booking; nav browser Back/Forward; 860/861px.
- Exclude: schema/CMS, thay thứ tự nhóm, mặc định đóng mọi nhóm, đổi nội dung, clone accordion, ảnh mới hoặc sticky controls.

## Validation

- Product: ở 390px, thấy đủ các link nhóm trước khi vào body panel đầu; chọn recovery mở đúng row và đóng row trước. Không bắt đủ mọi thứ vừa viewport đầu khi có cookie/zoom.
- Interface: 320/390/768/860/861/1440px; labels dài ít nhất gấp đôi; nhóm thiếu, đổi thứ tự, rỗng. Check link không ra ngoài khung dù root có `overflow:clip`.
- Interaction: load hash trực tiếp; cùng hash sau khi đóng row; `#svc-therapy`; Back/Forward; Tab/Enter/Space. JS tắt: nav tới summary tồn tại, summary vẫn mở tay được; không hứa tự mở row qua hash khi không JS.
- System: giữ một `h1`, một accordion, IDs không trùng, không có state active/nav mới phải đồng bộ.
- Repository: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` phải đạt sau tổng hợp.

## Stop conditions

- Nếu source không còn first-open/native details hoặc nhóm do reader khác sở hữu, cập nhật trace trước khi code.
- Nếu link không tới đúng summary vì cơ chế hash thay đổi, ghi bằng chứng rồi sửa đúng owner; không thay whole accordion để chữa điều hướng.

## Design documentation

Sau chấp nhận và xác minh: ghi mục lục ≤860px, dữ liệu/anchor source, first-open và giới hạn no-JS vào mục Services của `DESIGN.md`. Không coi mô tả hero/dive cũ là source của layout mới.
