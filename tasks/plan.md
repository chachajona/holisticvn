# Implementation Plan: HolisticVN Enhance & Rebuild

Tasks tracked in GitHub Issues: https://github.com/chachajona/holisticvn/issues/1. GitHub issue state/milestone là nguồn tiến độ chính; file này chỉ là index và kế hoạch.

## Overview

Hoàn tất bản rebuild đang có theo các phần có thể nghiệm thu độc lập, giữ public site tiếng Việt và luồng email yêu cầu gọi lại. Không làm lại các phần UI đã có; mỗi issue ghi trạng thái code hiện tại và phần cần kiểm chứng.

## Scope update — 2026-10-05

Theo quyết định của owner, website không lưu thông tin khách hàng. Form gửi email trực tiếp; khách cũng có thể gọi điện hoặc mở chat Zalo. Nhân viên tự nhập và xác nhận lịch trong hệ thống đặt lịch riêng. Đã gỡ CRM, tài khoản nội bộ, newsletter và import contacts/subscribers khỏi code.

Các issue #3, #13, #22–#26 và #28 thuộc phạm vi cũ và cần được owner điều chỉnh trong GitHub. File này loại chúng khỏi kế hoạch hiện tại; không tự thay đổi trạng thái issue remote. Owner tạm hoãn Zalo OA, chỉ dùng email thông báo; cần nghiệm thu gửi email thật trước launch.

## Architecture Decisions

- Giữ Next.js App Router/React, CSS modules/Warm Clay Editorial; không thêm Tailwind hay thay concept chỉ vì plan cũ từng đề xuất.
- Public forms → Resend → mailbox nhân viên → nhân viên gọi lại/xác nhận ở hệ thống lịch cửa hàng. Website không tự ghi leads/appointments mới.
- Sanity quản lý content/settings; code sở hữu layout. Fallback phục vụ local review; dataset thật rỗng không tự xuất bản bài mẫu.
- Analytics theo consent; phone/chat links vẫn dùng được khi từ chối, không gửi PII trong event.
- Production actions nằm sau review release candidate và owner approval; toàn bộ import nghiệm thu trên staging trước.

## Verified baseline — 2026-10-04

`origin/main`/HEAD chỉ có initial commit; implementation ở branch `rebuild-holistic-repo` đang untracked. Lint/typecheck/24 tests đạt; build đạt với CSS autoprefixer và Next ESLint plugin warnings. Chưa xác minh RLS database thật, email inbox thật, browser E2E hoặc cutover.

## Task List

### [Rebuild M0 — Baseline & blockers](https://github.com/chachajona/holisticvn/milestone/1)

Đưa code hiện có thành baseline tái tạo được; xác nhận nội dung và email vận hành.

| Issue                                                                                                                        | Priority | Mode | Dependencies                                            |
| ---------------------------------------------------------------------------------------------------------------------------- | -------- | ---- | ------------------------------------------------------- |
| [#2 — [Rebuild] Chốt baseline code có thể checkout và chạy lại](https://github.com/chachajona/holisticvn/issues/2)           | P0       | AFK  | None                                                    |
| [#4 — [Rebuild] Xác nhận nội dung và tài sản thương hiệu dùng cho launch](https://github.com/chachajona/holisticvn/issues/4) | P0       | HITL | [#2](https://github.com/chachajona/holisticvn/issues/2) |
| [#5 — [Rebuild] Nghiệm thu yêu cầu gọi lại qua email Resend thật](https://github.com/chachajona/holisticvn/issues/5)         | P0       | HITL | [#2](https://github.com/chachajona/holisticvn/issues/2) |

### [Rebuild M1 — Public experience](https://github.com/chachajona/holisticvn/milestone/2)

Nghiệm thu từng hành trình public theo Warm Clay Editorial, từ khám phá dịch vụ đến yêu cầu gọi lại.

| Issue                                                                                                                                    | Priority | Mode | Dependencies                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#6 — [Rebuild] Đồng bộ navigation, footer và typography trên public site](https://github.com/chachajona/holisticvn/issues/6)            | P1       | AFK  | [#2](https://github.com/chachajona/holisticvn/issues/2)                                                                                                                   |
| [#7 — [Rebuild] Nghiệm thu homepage từ hero đến CTA gọi lại](https://github.com/chachajona/holisticvn/issues/7)                          | P1       | AFK  | [#6](https://github.com/chachajona/holisticvn/issues/6), [#4](https://github.com/chachajona/holisticvn/issues/4)                                                          |
| [#8 — [Rebuild] Khám phá dịch vụ từ nội dung Sanity tới CTA tư vấn](https://github.com/chachajona/holisticvn/issues/8)                   | P1       | AFK  | [#6](https://github.com/chachajona/holisticvn/issues/6)                                                                                                                   |
| [#9 — [Rebuild] Liên kết nhóm phương pháp Sanity với liệu pháp cụ thể](https://github.com/chachajona/holisticvn/issues/9)                | P1       | AFK  | [#6](https://github.com/chachajona/holisticvn/issues/6)                                                                                                                   |
| [#10 — [Rebuild] Hoàn thiện trang liệu pháp và yêu cầu tư vấn đúng ngữ cảnh](https://github.com/chachajona/holisticvn/issues/10)         | P1       | AFK  | [#6](https://github.com/chachajona/holisticvn/issues/6)                                                                                                                   |
| [#11 — [Rebuild] Hoàn thiện trang Về Holistic bằng nội dung đã xác nhận](https://github.com/chachajona/holisticvn/issues/11)             | P1       | AFK  | [#6](https://github.com/chachajona/holisticvn/issues/6), [#4](https://github.com/chachajona/holisticvn/issues/4)                                                          |
| [#12 — [Rebuild] Hoàn thiện booking/contact với hai cơ sở và trạng thái gửi rõ ràng](https://github.com/chachajona/holisticvn/issues/12) | P0       | AFK  | [#6](https://github.com/chachajona/holisticvn/issues/6), [#5](https://github.com/chachajona/holisticvn/issues/5), [#4](https://github.com/chachajona/holisticvn/issues/4) |

### [Rebuild M2 — CMS, SEO & measurement](https://github.com/chachajona/holisticvn/milestone/3)

Nội dung chỉnh được qua Sanity, cập nhật sau publish, SEO dùng dữ liệu thật và analytics theo consent.

| Issue                                                                                                                            | Priority | Mode | Dependencies                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------- | -------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [#14 — [Rebuild] Dùng site settings Sanity thống nhất các kênh liên hệ](https://github.com/chachajona/holisticvn/issues/14)      | P1       | AFK  | [#6](https://github.com/chachajona/holisticvn/issues/6), [#4](https://github.com/chachajona/holisticvn/issues/4)                                                                                                                                                                                                                                             |
| [#15 — [Rebuild] Chỉnh nội dung homepage qua Sanity mà giữ layout đã chốt](https://github.com/chachajona/holisticvn/issues/15)   | P1       | AFK  | [#7](https://github.com/chachajona/holisticvn/issues/7)                                                                                                                                                                                                                                                                                                      |
| [#16 — [Rebuild] Nghiệm thu blog CMS từ danh sách tới bài viết](https://github.com/chachajona/holisticvn/issues/16)              | P1       | AFK  | [#6](https://github.com/chachajona/holisticvn/issues/6)                                                                                                                                                                                                                                                                                                      |
| [#17 — [Rebuild] Cập nhật public pages ngay sau Sanity publish](https://github.com/chachajona/holisticvn/issues/17)              | P0       | AFK  | [#8](https://github.com/chachajona/holisticvn/issues/8), [#9](https://github.com/chachajona/holisticvn/issues/9), [#10](https://github.com/chachajona/holisticvn/issues/10), [#14](https://github.com/chachajona/holisticvn/issues/14), [#15](https://github.com/chachajona/holisticvn/issues/15), [#16](https://github.com/chachajona/holisticvn/issues/16) |
| [#18 — [Rebuild] Đồng bộ canonical, sitemap và metadata theo nội dung thật](https://github.com/chachajona/holisticvn/issues/18)  | P0       | AFK  | [#10](https://github.com/chachajona/holisticvn/issues/10), [#16](https://github.com/chachajona/holisticvn/issues/16), [#14](https://github.com/chachajona/holisticvn/issues/14)                                                                                                                                                                              |
| [#19 — [Rebuild] Nghiệm thu consent, policy và đo conversion không chứa PII](https://github.com/chachajona/holisticvn/issues/19) | P0       | AFK  | [#2](https://github.com/chachajona/holisticvn/issues/2)                                                                                                                                                                                                                                                                                                      |

### [Rebuild M4 — Migration & launch](https://github.com/chachajona/holisticvn/milestone/5)

Import trên staging, bảo toàn URL cũ, nghiệm thu vận hành và chuẩn bị cutover có rollback.

| Issue                                                                                                                               | Priority | Mode | Dependencies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#20 — [Rebuild] Import nội dung legacy và media vào Sanity staging](https://github.com/chachajona/holisticvn/issues/20)            | P0       | HITL | [#8](https://github.com/chachajona/holisticvn/issues/8), [#9](https://github.com/chachajona/holisticvn/issues/9), [#10](https://github.com/chachajona/holisticvn/issues/10), [#14](https://github.com/chachajona/holisticvn/issues/14), [#15](https://github.com/chachajona/holisticvn/issues/15), [#16](https://github.com/chachajona/holisticvn/issues/16), [#4](https://github.com/chachajona/holisticvn/issues/4)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [#21 — [Rebuild] Bảo toàn URL legacy bằng mapping và permanent redirects](https://github.com/chachajona/holisticvn/issues/21)       | P0       | AFK  | [#20](https://github.com/chachajona/holisticvn/issues/20), [#18](https://github.com/chachajona/holisticvn/issues/18)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [#27 — [Rebuild] Nghiệm thu production preview và chuẩn bị cutover có rollback](https://github.com/chachajona/holisticvn/issues/27) | P0       | HITL | [#2](https://github.com/chachajona/holisticvn/issues/2), [#5](https://github.com/chachajona/holisticvn/issues/5), [#7](https://github.com/chachajona/holisticvn/issues/7), [#8](https://github.com/chachajona/holisticvn/issues/8), [#9](https://github.com/chachajona/holisticvn/issues/9), [#10](https://github.com/chachajona/holisticvn/issues/10), [#11](https://github.com/chachajona/holisticvn/issues/11), [#12](https://github.com/chachajona/holisticvn/issues/12), [#14](https://github.com/chachajona/holisticvn/issues/14), [#15](https://github.com/chachajona/holisticvn/issues/15), [#16](https://github.com/chachajona/holisticvn/issues/16), [#17](https://github.com/chachajona/holisticvn/issues/17), [#18](https://github.com/chachajona/holisticvn/issues/18), [#19](https://github.com/chachajona/holisticvn/issues/19), [#21](https://github.com/chachajona/holisticvn/issues/21) |

### [Rebuild M5 — Enhancements sau launch](https://github.com/chachajona/holisticvn/milestone/6)

Backlog cần chốt trước khi triển khai; không chặn bản public tiếng Việt v1.

| Issue                                                                                                                               | Priority | Mode | Dependencies                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------- | ---- | --------------------------------------------------------- |
| [#29 — [Enhance] Chốt phạm vi và làm chuyển ngôn ngữ Việt/Anh có nội dung thật](https://github.com/chachajona/holisticvn/issues/29) | P2       | HITL | [#27](https://github.com/chachajona/holisticvn/issues/27) |

## Order and Checkpoints

1. M0 baseline PR trước; content handoff, email staging, shell và consent có thể thực hiện độc lập sau baseline.
2. Shell unlock services/methods/detail/blog. Content handoff unlock home/about; email thật unlock nghiệm thu booking/contact.
3. CMS wiring unlock revalidation/SEO rồi staged content import và redirects. Checkpoint: một lượt publish/update/unpublish phản ánh trên page/sitemap.
4. Release candidate qua các P0/public gates; owner duyệt domain cutover với rollback cụ thể. Public v1 cần nghiệm thu đầy đủ email/manual-confirmation, CMS và bảo mật public API.
5. M5 là P2 backlog: pilot Việt/Anh cần quyết định nghiệp vụ/nội dung riêng, không chặn v1.

## Risks and Mitigations

| Risk                                         | Impact | Mitigation                                                                   |
| -------------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| App chưa tồn tại trong Git                   | High   | Baseline commit/PR, clean-checkout evidence                                  |
| Thiếu export/credentials/assets              | High   | HITL handoff cụ thể; không đoán hoặc đưa dữ liệu thật vào repo               |
| Email accepted nhưng không có người theo dõi | High   | Mailbox demo và owner xác nhận quy trình vận hành                            |
| Domain/SEO/media/slug mismatch               | High   | Inventory, reconciliation, sitemap thật, redirect HTTP tests                 |
| Plan cũ mâu thuẫn luồng website hiện tại     | Medium | Giữ email/manual-confirmation đã chốt trong Product/README                   |
| Nhiều sessions sửa cùng layout/schema        | Medium | Hoàn tất shared slice trước; nhận issue, ghi PR scope, tuân thủ dependencies |

## Open Questions / HITL inputs

- Domain production/canonical cuối cùng, người duyệt copy/assets và phần founder muốn đưa lên hoặc ẩn.
- Resend/DNS/inbox cùng người theo dõi, Sanity staging và nguồn legacy content exports.
- Phạm vi/bản dịch cho Việt/Anh pilot, chỉ cần chốt khi lấy P2 vào làm.
- Timeline/owner từng milestone chưa gán vì chưa có cam kết nhân sự; chọn từ dependency order, không giả định deadline.

## Definition of Done

Mỗi issue được nhận trước khi triển khai, có PR và evidence cho 3 acceptance criteria cùng verification trong issue body. AFK = độc lập sau blockers; HITL = cần đúng đầu vào/quyết định đã ghi. Với thay đổi UI dùng frontend checklist; với form phải nghiệm thu email thật và quy trình xử lý thủ công. Chỉ đóng khi nghiệm thu đủ; mọi child issue được publish ở trạng thái open. Không có tasks/todo.md vì GitHub Issues là tracker đã chọn.
