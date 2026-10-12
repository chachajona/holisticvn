# Nhóm phương pháp trong Sanity — thiết kế (#9)

Trạng thái: **đã duyệt thiết kế trong chat (2026-10-12); owner xác nhận 5 nhóm và gửi bảng giá để ánh xạ (mục 10)**. Chưa có code nào được viết theo spec này.
Liên quan: #1 (tracking), #8 (mẫu `servicesPage`), #6 (blocker, đã xong). Căn cứ kỹ thuật: `docs/methods-schema-research.md`, `docs/services-schema-research.md`.

## 1. Bối cảnh và mục tiêu

`/treatments` ("Phương pháp") hiện hardcode `methods` trong `app/treatments/page.tsx` và không có link nào tới `/treatments/[slug]`. Mục tiêu: editor sửa được nhóm phương pháp và liệu pháp liên quan trong Sanity; visitor đọc nhóm phù hợp rồi xem liệu pháp cụ thể hoặc yêu cầu đánh giá; thiếu nội dung/ảnh không làm trang lỗi.

Quyết định đã chốt:

- **Năm nhóm, cố định** (`manual`, `electro`, `rehab`, `cold`, `infrared`), theo quyết định owner 2026-10-09 và `methodAnchor`. Mô tả #9 ghi "bốn nhóm" và cần được sửa theo.
- **Hướng A:** singleton `methodsPage`, mỗi nhóm chứa mảng reference mạnh tới `treatment` (cùng khuôn `servicesPage` của #8). Không thêm trường `group` vào `treatment`.
- Nhóm chưa có liệu pháp (hiện là `electro`, `rehab`) vẫn hiện nội dung và CTA đánh giá, không có link chi tiết.

Ngoài phạm vi: thêm phương pháp thứ sáu, tạo document `treatment` mới, tuyên bố điều trị mới, hiển thị giá, carousel homepage (#7/#15), đổi ngôn ngữ (#29).

## 2. Schema (`sanity/schemaTypes/index.ts`)

- Document singleton `methodsPage` với mảng `groups` gồm năm object `methodGroup`.
- `methodGroup`:
  - `group`: `manual | electro | rehab | cold | infrared`, bắt buộc, `readOnly` sau khi có giá trị.
  - `title`, `indexSubtitle`, `body`: bắt buộc.
  - `tags`: mảng chuỗi, tối đa 5, không trùng, không rỗng.
  - `image` kèm `alt`; bắt buộc `alt` khi có asset. Bỏ trống thì dùng ảnh mặc định của nhóm.
  - `treatments`: mảng reference mạnh tới `treatment`, `options.filter: "defined(slug.current)"`, `disableNew: true`, `rule.unique()`. Một liệu pháp được phép xuất hiện ở hai nhóm khác nhau, không được lặp trong cùng nhóm.
- Không lưu `numeral`, id anchor, `imageLeft`: suy ra từ thứ tự chuẩn của `methodGroups` và `methodAnchor`.
- `groups`: `initialValue` đủ năm nhóm, `sortable: false`, `disableActions` gồm add/addBefore/addAfter/remove/duplicate.
- Validation mảng: tổng quát hóa `validateServiceGroups` (`sanity/serviceGroups.ts`) thành hàm curried nhận tập nhóm, dùng cho cả hai trang. Test hiện có của `validateServiceGroups` phải pass nguyên. Không thêm tham số thứ hai vì Studio truyền `context` vào vị trí đó.
- Studio (`sanity.config.ts`): thêm `methodsPage` vào `singletonTypes`, Structure và allowlist action `publish`, `discardChanges`, `restore`.

## 3. Đọc dữ liệu và fallback

- `lib/content.ts`: thêm `methodGroups`, `methodFallbackImage` và `methods` (chuyển từ `app/treatments/page.tsx`, bỏ `numeral`, `id`, `imageLeft` lưu sẵn). `methodAnchor` giữ nguyên.
- `lib/sanity.ts`: `getMethods()` truy vấn `*[_id == "methodsPage"][0].groups[defined(group)]{…, "treatments": treatments[]->{"slug":slug.current,title}}`, parse bằng zod (cùng lớp `cdnImage`, `text`, `strings`).
  - Bỏ nhóm không hợp lệ hoặc trùng; bỏ reference `null` và liệu pháp thiếu `slug`/`title`.
  - Ảnh thiếu hoặc không thuộc `cdn.sanity.io` dùng `methodFallbackImage[group]`.
- Liên kết liệu pháp viết cứng chỉ dùng khi Sanity chưa cấu hình. Khi đã cấu hình, `dry-needling` và `iastm` chưa có document trong dataset, nên nhóm rơi về fallback không mang theo link nào (không dẫn tới slug không tồn tại).
- **Fallback theo từng nhóm**, khác `/services`: footer luôn có năm link neo (`footerMethods`), nên nhóm thiếu/lỗi rơi về nội dung viết cứng của chính nhóm đó và kết quả luôn đủ năm nhóm theo thứ tự chuẩn.

| Trạng thái                                    | Kết quả                                                          |
| --------------------------------------------- | ---------------------------------------------------------------- |
| Sanity chưa cấu hình                          | Toàn bộ fallback, kèm liên kết liệu pháp viết cứng               |
| Singleton chưa publish (`null`)               | Nội dung fallback của cả 5 nhóm, **không** có liên kết liệu pháp |
| Nhóm thiếu hoặc không hợp lệ                  | Nội dung fallback của nhóm đó, **không** có liên kết liệu pháp   |
| Reference trỏ liệu pháp bị gỡ hoặc thiếu slug | Mục bị bỏ; không link chết                                       |
| `client.fetch` ném lỗi                        | Ném lỗi (ISR giữ trang cũ), giống hành vi hiện tại               |

## 4. Trang `/treatments`

- Server component, `export const revalidate = 3600`.
- Index và section lấy `id` từ `methodAnchor[group]`; `numeral` `01`–`05` theo vị trí; `imageLeft = index % 2 === 0` (khớp bản hiện tại, khác `/services`).
- Ảnh qua `next/image`.
- **Khối "Liệu pháp liên quan" (mới):** dưới mỗi nhóm có liệu pháp, danh sách link `/treatments/<slug>`. Nhóm không có liệu pháp thì không hiện khối. Vị trí và nhãn cần owner duyệt (bản comp hiện tại không có chỗ này).
- CTA: giữ hai khối `note` và `cta` hiện có (nhấn mạnh chuyên viên đánh giá và phối hợp 2–3 phương pháp); đổi copy chỉ khi owner yêu cầu.
- Anchor: thêm `html { scroll-padding-top: 7rem }` vào `app/globals.css` (tài liệu Next.js khuyên cách này). Sửa luôn anchor của `/services`. Giá trị 7rem tính từ CSS, chốt bằng ảnh chụp ở 320/768/1440.

## 5. Seed và nội dung

- `scripts/seed/methods-page.json`: `_id: "methodsPage"` (không dấu chấm), `_key` duy nhất, nội dung nguyên văn hiện có (`title`, `indexSubtitle`, `body`, `tags`). Không seed `image` và `treatments`: `_id` production của `treatment` là UUID legacy, editor chọn reference trong Studio.
- Áp dụng bằng `createIfNotExists` (`--missing`), không ghi đè nội dung editor đã sửa. Staging trước.
- Không tự thêm nội dung điều trị mới. `tags` và `body` hiện có là cách diễn đạt về triệu chứng; owner cần xác nhận đó là bản đã duyệt.

## 6. Kiểm thử

Vitest, mỗi file sao từ file tương ứng của #8:

- Mới: `method-groups`, `method-groups-validation` (hoặc mở rộng file hiện có), `methods-schema`, `methods-seed`, `methods-sanity`, `methods-fallback`.
- Sửa: `footer-links.test.ts` (hiện đọc source trang và đòi `id: methodAnchor.<khoá>,`; đổi sang `methodAnchor[method.group]`), `studio-config.test.ts` (`it.each` cho hai singleton).
- Ghim: cùng liệu pháp ở hai nhóm khác nhau được qua, trong cùng nhóm bị chặn; `fetch → null` trả đủ năm nhóm fallback; mọi `treatments[].slug` của fallback tồn tại trong `treatments`; mọi ảnh fallback tồn tại trong `public/images`.

## 7. Nghiệm thu (staging, cần quyền Sanity)

- Publish sửa một nhóm và một treatment reference; demo index → section → detail; webhook `/api/revalidate` trả 200.
- Keyboard, anchor, responsive ở 320/768/1440 có ảnh chụp, heading không bị sticky nav che.
- Thử thiếu document, thiếu ảnh, reference tới liệu pháp bị gỡ.
- Ghi kết quả vào `docs/METHODS_VERIFICATION.md` theo mẫu `docs/SERVICES_VERIFICATION.md`. Chưa có evidence thì chưa đóng issue.

## 8. Rủi ro và việc ngoài code

- Filter webhook Sanity nằm ngoài repo: cần thêm `methodsPage` ở staging và production.
- Chưa kiểm chứng: Unpublish một `treatment` đang được tham chiếu (code đã chịu `null`, không ảnh hưởng thiết kế); `initialValue` cấp mảng khi mở singleton lần đầu; query `methodsPage` trong Vision; hành vi ô `tags` của Studio. Danh sách đầy đủ ở `docs/methods-schema-research.md` mục 5.

## 9. Câu hỏi cần owner

1. ~~Xác nhận năm nhóm~~ — đã xác nhận 2026-10-12. Còn lại: sửa mô tả #9 từ "bốn nhóm" thành năm nhóm.
2. ~~Duyệt ánh xạ liệu pháp theo nhóm~~ — đã gửi bảng giá, ánh xạ ở mục 10. Còn lại: tạo document `treatment` cho các dịch vụ chưa có trang (follow-up, ngoài #9).
3. Duyệt vị trí và nhãn khối "Liệu pháp liên quan".
4. Xác nhận `tags` và `body` hiện có là nội dung đã duyệt.
5. Ai thêm `methodsPage` vào filter webhook staging và production.

## 10. Ánh xạ bảng giá vào năm nhóm (owner gửi bảng giá 2026-10-12)

Căn cứ: ảnh bảng giá phòng khám (VN và EN). Chỉ dùng để xác định dịch vụ nào thuộc nhóm nào; không đổi nội dung nhóm, không tạo `treatment` mới.

| Nhóm         | Dịch vụ trong bảng giá                                                                             | `treatment` đã có document                                        |
| ------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `manual`     | Massage trị liệu toàn thân, massage cục bộ, nắn chỉnh cột sống, IASTM, tapping, giác hơi, châm khô | `cupping` (production); `iastm`, `dry-needling` chỉ có ở fallback |
| `electro`    | Xung kích, điện xung, sóng siêu âm, điện châm                                                      | không có                                                          |
| `rehab`      | Tập luyện phục hồi, tập luyện tăng cường                                                           | không có                                                          |
| `cold`       | Ngâm lạnh                                                                                          | `cold-plunge`                                                     |
| `infrared`   | Đèn hồng ngoại                                                                                     | `heat-light`                                                      |
| (không nhóm) | Tư vấn, đánh giá tình trạng sức khoẻ vận động (199k)                                               | trả lời bằng CTA đặt buổi đánh giá                                |

- Bốn dịch vụ ở `manual` không phải thao tác thuần tay (tapping, châm khô, IASTM dùng dụng cụ). Chúng ở đây vì mô tả của nhóm là "chuyên viên can thiệp trực tiếp lên khớp, cơ và mô mềm". Điện châm ở `electro` vì dùng dòng điện. Đây là phán đoán cần owner xác nhận.
- Dịch vụ chưa có `treatment` (massage, nắn chỉnh, tapping, xung kích, điện xung, siêu âm, điện châm, hai chương trình tập) không có link chi tiết cho tới khi owner tạo document. Tạo document nằm ngoài phạm vi #9.
- Liên kết trong seed fallback: `manual` → `dry-needling`, `cupping`, `iastm`; `cold` → `cold-plunge`; `infrared` → `heat-light`; `electro`, `rehab` → không có.
