# Bố cục và câu chữ mới cho trang chi tiết liệu pháp

Written against: `9a4f9c14a536d61e798c0de5a07005287748ead4` + working tree chưa commit trên nhánh `issue-10` (xem plan 1).

**Phụ thuộc:** chạy sau `design-plans/treatment-detail-warm-clay-tokens.md` (plan đó tạo `app/treatments/[slug]/treatment-detail.module.css` và `.root`). Plan này sửa tiếp chính module đó và `page.tsx`.

## Evidence chain

- Surface: `/treatments/[slug]`; ảnh `.context/treatment-detail-desktop.png`, `.context/treatment-detail-mobile.png`; đối chiếu `.context/treatments-index-desktop.png`.
- Problem (quan sát từ ảnh và source):
  1. Hero không có CTA; form nằm sau hai section, trên mobile hero chiếm khoảng 1.5 màn hình (`page.tsx:36-67`).
  2. Khối "Điều bạn có thể mong đợi" là một đoạn copy chung cho mọi liệu pháp (`page.tsx:71-76`), cộng với danh sách lợi ích đánh số 01/02/03 (`page.tsx:80-84`). Khi `benefits` rỗng thì cột phải trống.
  3. Benefits và protocol dùng cùng một kiểu danh sách đánh số hairline, đặt liền nhau.
  4. Thuật ngữ lệch: nav và trang list gọi là "Phương pháp"; chi tiết ghi "← Tất cả liệu pháp" và eyebrow "Liệu pháp" (`page.tsx:46,48`). Chi tiết ghi "HolisticVN" (`page.tsx:114`), còn thông báo gửi form và toàn site ghi "Holistic" (`components/lead-form.tsx` đoạn thông báo thành công).
  5. Trang chưa dùng dữ liệu liên kết sẵn có: mỗi `Method` đã có nhãn "Khi bạn gặp / Khi bạn muốn" đã được owner duyệt và danh sách `treatments` liên quan (`lib/content.ts:51-61`, `:205-270`).
- Design evidence:
  - Pattern có sẵn: hero card 18px (`treatments.module.css:44-100`), hàng `.stage` (h2 sage trái, nội dung phải, hairline; `:396-415`, responsive `@media (max-width: 980px)` tại `:647`), `.tagRow`/`.tagPills` (`:476-492`), `.methodLinks` (`:493-523`), nút (`:611-640`), panel linen bo 18px của homepage (`DESIGN.md:269`).
  - Quy tắc: `DESIGN.md:219` (page body dùng khung 1360px, phải chọn một khung), `:221` (padding section 56–96px), `:338` (nhãn mono là marker đứng riêng, không kèm trực tiếp từng heading), `:347` (không đánh số/thứ tự các nhóm Methods).
  - Wording: `docs/methods-wording-proposal.md` (quy trình đề xuất → owner duyệt; CTA đã duyệt **"Đặt lịch đánh giá ban đầu"**; "không mở rộng tuyên bố hiệu quả từng kỹ thuật"), `lib/method-tags.ts` ("Exact approved labels only: legacy diagnoses are never inferred to be symptoms"), `docs/FRONTEND_CHECKLIST.md:69-70` (copy y tế chỉ tham khảo, không hứa kết quả), `PRODUCT.md` Product Principles (không giá chưa xác nhận, không hứa hẹn).
  - Nghiên cứu ngoài: truy vấn kho Inspo (`recommend` và `search_screens`, ngành health) không trả trang chi tiết liệu pháp nào dùng được (kết quả duy nhất là trang "about" của khách sạn; search trả 0). Không dùng làm căn cứ. Theo quy tắc "project wins", nguồn tham chiếu là các pattern đã chạy trong repo.
- Owner: `app/treatments/[slug]/page.tsx` (cấu trúc), `app/treatments/[slug]/treatment-detail.module.css` (style), `lib/sanity.ts` `getMethods` (dữ liệu nhóm).
- Scope and affected surfaces: `page.tsx`, module CSS, `tests/sanity.test.ts`, tài liệu wording mới.
- Uncertainty:
  - Mọi chuỗi chữ mới là **đề xuất chờ owner duyệt** (tương tự #42 là HITL). Chưa được duyệt thì giữ chuỗi "Hiện tại" của bảng.
  - Nhãn "Khi bạn gặp/Khi bạn muốn" là của **nhóm** phương pháp, không phải từng kỹ thuật. Plan chỉ hiển thị chúng ở cấp nhóm, kèm câu nói rõ điều đó. Nếu owner không muốn hiển thị nhãn nhóm trên trang từng liệu pháp thì bỏ hàng này (các hàng khác vẫn đứng được).
  - Pill tĩnh 40px có thể trông như bấm được; phải xem ảnh render.
  - Test hiện mock một `fetch` trả cùng mảng cho mọi truy vấn (`tests/sanity.test.ts`); thêm `getMethods` vào trang có thể làm test cần mock theo truy vấn.

## Research: các phương án bố cục

| Phương án                                      | Mô tả                                                                                                                                                                     | Kết luận |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| A. Giữ hero chia đôi, chỉ đổi màu              | Ít việc nhất; không giải quyết hero thiếu CTA, copy chung, hai danh sách đánh số trùng kiểu                                                                               | Loại     |
| B. **Hero card + hàng `.stage` + panel form**  | Dùng đúng hero `treatments`, đúng hàng stage, đúng pill/link của Methods; thêm CTA vào hero; đổi danh sách đánh số thành nội dung có nghĩa                                | **Chọn** |
| C. Bài dài với cột form dính (sticky) bên phải | Nội dung quá mỏng (3 lợi ích, vài bước tùy chọn) để cần cột dính; xung đột với nút liên hệ nổi dưới phải và banner cookie; thêm trạng thái sticky mà `DESIGN.md` không có | Loại     |

## Research: wording

Nguyên tắc rút từ nguồn trong repo: câu chủ động nói về điều người đọc làm hoặc gặp; không hứa kết quả; không suy diễn triệu chứng cho từng kỹ thuật; dùng "Holistic" nhất quán; CTA phải khớp điều thực sự xảy ra (form là yêu cầu gọi lại, chưa phải lịch hẹn: `lead-form.tsx` thông báo "đây chưa phải lịch hẹn").

| Vị trí                                     | Hiện tại                                                                      | Đề xuất                                                                                                                                                                   | Lý do                                                                                                                                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Link quay lại                              | "← Tất cả liệu pháp"                                                          | "← Tất cả phương pháp"                                                                                                                                                    | Khớp nav, `<h1>` và tiêu đề trang đích `/treatments` ("Phương pháp")                                                                                                                         |
| Eyebrow hero                               | "Liệu pháp"                                                                   | Tên nhóm cha, ví dụ "Trị liệu thủ công" (không có nhóm cha: "Liệu pháp")                                                                                                  | Cho biết liệu pháp thuộc chặng nào của lộ trình; dùng dữ liệu đã duyệt                                                                                                                       |
| CTA hero (mới)                             | không có                                                                      | "Gửi yêu cầu tư vấn" → `#yeu-cau`                                                                                                                                         | Khớp đúng hành động của form; không dùng "Đặt lịch…" vì form không tạo lịch. Phương án thay nếu owner muốn đồng bộ với trang Methods: "Đặt lịch đánh giá ban đầu" (nhưng nên trỏ `/booking`) |
| Section 1 (heading + đoạn chung + lợi ích) | "Điều bạn có thể mong đợi" / "Một phiên trị liệu có chủ đích." / đoạn chung   | Tách làm hai hàng (xem dưới); bỏ đoạn chung                                                                                                                               | "Mong đợi" dễ đọc thành cam kết; đoạn chung lặp cho mọi liệu pháp                                                                                                                            |
| Hàng "Thường dành cho" (mới)               | không có                                                                      | h2 "Thường dành cho"; dòng dẫn: "Theo nhóm {tên nhóm}. Chuyên viên đánh giá tình trạng của bạn trước khi chọn kỹ thuật." rồi hai hàng nhãn "Khi bạn gặp" / "Khi bạn muốn" | Cấp nhóm, không cấp kỹ thuật; câu đánh giá trước khớp mô tả nhóm đã duyệt ("Kỹ thuật phù hợp tùy theo tình trạng vận động của bạn")                                                          |
| Hàng lợi ích                               | "Điều bạn có thể mong đợi" + số 01–03                                         | h2 "Hướng tới", danh sách không đánh số                                                                                                                                   | Lợi ích không phải chuỗi thứ tự (`DESIGN.md:347` cùng tinh thần); giọng mềm hơn "mong đợi". Nội dung từng mục vẫn do CMS quyết                                                               |
| Quy trình                                  | eyebrow "Quy trình" + h2 "Các bước trong một buổi."                           | h2 "Một buổi diễn ra thế nào", bỏ eyebrow                                                                                                                                 | Hỏi-đáp tự nhiên theo giọng fanpage; bỏ nhãn mono kèm heading (`DESIGN.md:338`)                                                                                                              |
| Liên quan (mới)                            | không có                                                                      | h2 "Cùng nhóm", nhãn "Liệu pháp liên quan" (đã dùng ở `page.tsx` Methods)                                                                                                 | Dùng lại nhãn đã duyệt                                                                                                                                                                       |
| Heading form                               | "Muốn biết liệu pháp này có phù hợp với bạn?"                                 | giữ                                                                                                                                                                       | Đã đúng giọng, câu hỏi cụ thể                                                                                                                                                                |
| Eyebrow form                               | "Bắt đầu lộ trình"                                                            | bỏ                                                                                                                                                                        | Tránh nhãn kèm heading                                                                                                                                                                       |
| Đoạn form                                  | "Gửi yêu cầu, HolisticVN sẽ liên hệ để trao đổi trước khi xác nhận lịch hẹn." | "Để lại tên và số điện thoại. Holistic sẽ gọi lại để trao đổi và xác nhận thời gian; đây chưa phải lịch hẹn."                                                             | Thống nhất tên thương hiệu và khớp thông báo sau khi gửi                                                                                                                                     |
| "Thời lượng gợi ý · {x}"                   | giữ                                                                           | giữ                                                                                                                                                                       | Đã có test và đã đúng giọng                                                                                                                                                                  |

Không thêm: giá, số buổi, thời gian hồi phục, tuyên bố hiệu quả, bằng cấp (chưa được xác nhận; `PRODUCT.md`).

## Design decision

Dựng lại trang theo phương án B: hero card có CTA; các section là hàng `.stage` (h2 sage bên trái, nội dung bên phải, hairline) chỉ hiện khi có dữ liệu; form nằm trong panel linen bo 18px có `id="yeu-cau"`. Container chuyển sang khung 1360px của page body. Đổi câu chữ theo bảng trên sau khi owner duyệt.

## Reuse

- Hero card: sao chép cấu trúc `.hero`, `.heroCard`, `.heroPhoto`, `.heroScrim`, `.heroContent` từ `app/treatments/treatments.module.css:44-100` (module riêng, giữ token độc lập). Chiều cao 340px, 372px ở ≤980px (`:648`). Không ảnh: thẻ `--ink` không scrim.
- Hàng: `.stage`, `.stage > h2`, `.tagRow`, `.tagRowLabel`, `.tagPills`, `.methodLinks`, `.methodLinksLabel` (`treatments.module.css:396-523`).
- Nút: `.primaryButton` (`:611-622`).
- Panel linen: mô tả `DESIGN.md:269-271` (`warm-band`, bo 18px, padding 48px desktop / 28px × 20px mobile).
- Dữ liệu: `getMethods()` (`lib/sanity.ts:161`), `methodTagLabel`, `methodTags` (`lib/method-tags.ts`); `Method.treatments`, `Method.filterTags`.
- Exemplar: `app/treatments/page.tsx` (cách dựng hero) và `app/treatments/methods-explorer.tsx:60-100` (hàng nhãn).
- Primitive mới: **không**. Pill tĩnh dùng cùng visual với `.tagPills` nhưng là `<li>` trong `<ul>` (không phải `button`), vì bản Methods là nút lọc có state; module riêng khai báo lại style, không import module khác.

## Changes

1. `app/treatments/[slug]/page.tsx`
   - Change:
     - Gọi thêm `getMethods()`; tìm `method = methods.find((m) => m.treatments.some((t) => t.slug === slug))`. Không tìm thấy thì `method = undefined`.
     - Hero: `<section>` chứa thẻ bo 18px; ảnh (nếu có) làm nền kèm scrim; nội dung gồm link quay lại "← Tất cả phương pháp", eyebrow (tên nhóm hoặc "Liệu pháp"), `<h1>`, mô tả, dòng "Thời lượng gợi ý · …", và `<a href="#yeu-cau" className=primaryButton>Gửi yêu cầu tư vấn</a>`. Giữ `Image` với `fill`, `priority`, `sizes`, `alt={treatment.imageAlt ?? treatment.title}`.
     - Body: một vùng `.stages` với tối đa 4 hàng, mỗi hàng chỉ render khi có dữ liệu, theo thứ tự: "Thường dành cho" (cần `method` có `filterTags`; hai hàng nhãn "Khi bạn gặp"/"Khi bạn muốn" phân theo `methodTags[].category`, chỉ hàng có nhãn mới hiện); "Hướng tới" (`benefits.length`, `<ul>` không số); "Một buổi diễn ra thế nào" (`protocols.length`, `<ol>`, số bước giữ `padStart(2, "0")`); "Cùng nhóm" (các `method.treatments` khác slug hiện tại, dạng link pill tới `/treatments/{slug}`).
     - Form: panel linen, `id="yeu-cau"`, hai cột (h2 + đoạn trái, `LeadForm` phải), heading và đoạn theo bảng wording. Giữ `<LeadForm kind="booking" treatment={treatment.title} />`.
     - Chuỗi chữ: chỉ dùng cột "Đề xuất" khi owner đã duyệt, nếu chưa thì dùng cột "Hiện tại" (không áp dụng dòng "(mới)" nếu chưa duyệt).
   - Preserve: `generateStaticParams`, `generateMetadata`, `notFound()` cho slug lạ, `revalidate`, một `h1`, cấp heading `h2` → `h3` không nhảy, `<main id="main">`, hero không ảnh vẫn hợp lệ (`data-plain`), không render danh sách rỗng, nội dung từ Sanity chỉ render như text.
   - Verify: tài liệu thiếu `benefits`, `protocols`, ảnh, hoặc không có nhóm cha vẫn ra một trang hợp lệ (hero + form), không có khối trống.

2. `app/treatments/[slug]/treatment-detail.module.css`
   - Change: thay container `.shell` toàn cục bằng khung 1360px như `treatments.module.css:37-42` (`max-width: 1360px; padding: 0 max(24px, calc((100vw - 1360px) / 2))`); thêm class hero card, `stage` và các class nhãn/pill/link/pane form như bảng Reuse; nhịp dọc section theo `DESIGN.md:221` (stage `padding: 40px 0 48px` như `.stage`; hero cách nav 6px như `.hero`; vùng form `padding: 56px … 72px` như `.cta`). Breakpoint ở 980px và 700px: hàng stage thành 1 cột `gap: 24px`; panel form 1 cột, padding 28px 20px.
   - Preserve: toàn bộ token, nút, form override từ plan 1.
   - Verify: không scroll ngang ở 320px; không `box-shadow` mới; pill tĩnh không có `cursor: pointer` và không có hover.

3. `tests/sanity.test.ts`
   - Change: cập nhật assertion cho chuỗi đổi ("Quy trình" → heading mới; "Thời lượng gợi ý" giữ); thêm một test: liệu pháp thuộc một nhóm có `filterTags` thì render nhãn "Khi bạn gặp"; liệu pháp không thuộc nhóm nào thì không render "Thường dành cho". Nếu `fetch` mock chung làm `getMethods` nhận dữ liệu sai dạng, mock theo truy vấn hoặc `vi.mock("@/lib/sanity")` cho `getMethods`, theo mẫu của `tests/methods-render.test.tsx`.
   - Preserve: các test 404, SEO, `LeadForm` nhận `treatment`.
   - Verify: `npm test` xanh.

4. `docs/treatment-detail-wording-proposal.md` (mới)
   - Change: chép bảng wording, ghi nguồn, trạng thái "chờ owner duyệt", theo khuôn `docs/methods-wording-proposal.md`.
   - Verify: owner xác nhận từng dòng trước khi áp dụng cột "Đề xuất".

## Scope

- Inherit: mọi `/treatments/[slug]`.
- Verify: `/treatments` (hero và pill gốc không đổi), `/treatments#mtd-*` vẫn nhảy đúng, `/booking` và `/contact` không đổi, sitemap và metadata của trang chi tiết không đổi.
- Exclude: sửa schema Sanity hoặc thêm trường CMS (câu hỏi thường gặp, ai nên tránh, giá), liên kết nhãn tới bộ lọc `/treatments` (bộ lọc không có state trong URL), thay ảnh, hoạt ảnh/garland, `/contact`, `/booking`.

## Validation

- Product: người xem mở một liệu pháp, thấy CTA ngay trong hero, hiểu nhóm của nó và các bước của buổi, gửi yêu cầu; form vẫn giữ treatment đúng và thông báo thành công không nói đã có lịch.
- Interface: kiểm tra 390px / 768px / 1440px với: (a) tài liệu đủ (`protocols`, ảnh, thuộc nhóm có nhãn); (b) thiếu ảnh; (c) thiếu `benefits` và `protocols`; (d) liệu pháp không thuộc nhóm nào (ví dụ `heat-light` trong fallback, vì nhóm `infrared` có `treatments: []`); (e) tiêu đề dài. Kiểm tra bàn phím theo thứ tự: link quay lại → CTA hero → link "Cùng nhóm" → form; CTA hero cuộn tới form và đưa focus vào vùng form hợp lý. Một `h1`, không nhảy cấp.
- System: hero, hàng stage, pill và nút giống trang `/treatments`; không thêm màu, bóng đổ, font hay token ngoài `.root`; panel form không tạo "dark close" thứ ba (`DESIGN.md:190`).
- Repository: `npm run lint` → 0 warning; `npm run typecheck` → pass; `npm test` → pass; `npm run build` → pass; `npm run format:check` → pass.

## Stop conditions

- Dừng nếu owner chưa duyệt wording: giữ chuỗi "Hiện tại", bỏ CTA hero và hàng "Thường dành cho"; chỉ phần bố cục được merge.
- Dừng nếu owner không muốn hiển thị nhãn cấp nhóm trên trang từng liệu pháp: bỏ hàng "Thường dành cho".
- Dừng nếu pill tĩnh trông như bấm được trong ảnh render: đổi sang chữ thường phân tách bằng dấu chấm giữa, hoặc hỏi owner.
- Dừng nếu cần thêm trường CMS hoặc đổi schema Sanity để đủ nội dung.
- Dừng nếu `getMethods()` làm trang chi tiết chậm hoặc lỗi build với dữ liệu Sanity thật (không mở rộng sang kiến trúc dữ liệu).

## Design documentation

- Sau khi owner chấp nhận và validation xong: bổ sung mục "Treatment detail" vào `DESIGN.md` phần Components (hero card kèm CTA, hàng stage, pill tĩnh, panel form linen, khung 1360px, danh sách hàng và điều kiện hiển thị) và ghi quyết định wording đã duyệt vào `docs/treatment-detail-wording-proposal.md` (trạng thái "owner đã duyệt" + ngày).
