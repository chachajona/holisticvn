# Thiết kế lại trang chi tiết liệu pháp `/treatments/[slug]` — thiết kế

Trạng thái: **owner đã duyệt thiết kế trong hội thoại ngày 2026-10-15; chờ duyệt bản viết này** trước khi lập kế hoạch triển khai. Chưa có code nào được viết theo spec này.
Liên quan: #10 (issue này), #1 (tracking), #9 (nhóm phương pháp), #42 (trang Phương pháp). Nền: [`2026-10-15-treatment-catalog-design.md`](2026-10-15-treatment-catalog-design.md) (11 liệu pháp, giá, cờ `*`, đã triển khai trên nhánh `issue-10`), [`../../treatment-detail-schema-research.md`](../../treatment-detail-schema-research.md), `DESIGN.md`.
Thay thế: phần bố cục và chữ của `design-plans/treatment-detail-layout-and-wording.md` (không còn áp dụng).

Bản mockup đã duyệt nằm trong workspace, thư mục `.context/mockup/` (git bỏ qua): `unified.html` (trang đầy đủ), `facts-FB.html`, `dock.html`, `badge-lab.html`, `intro-ideas-2.html`. Spec này là nguồn chính; mockup chỉ để tham khảo hình thức.

## 1. Bối cảnh và mục tiêu

Trang hiện có hero, mô tả, giá, quy trình, form, nhưng:

- Nội dung CMS thật (mô tả ngắn và chi tiết, lợi ích, 6–7 bước quy trình) hiện thành các khối rời, thiếu thứ bậc và thiếu liên kết sang liệu pháp khác.
- Chưa có: liệu pháp liên quan, nhãn "dành cho ai", vị trí trong lộ trình, câu hỏi thường gặp, huy hiệu, và đường tắt gửi yêu cầu khi cuộn xa.
- Phong cách chưa khớp hệ thống (`DESIGN.md`).

**Mục tiêu:** trang đọc rõ từ trên xuống ("đây là gì → dành cho ai → hướng tới gì → diễn ra thế nào → còn gì khác → gửi yêu cầu"), dùng đúng ngôn ngữ thiết kế của site, mọi khối chỉ hiện khi có dữ liệu thật, và khách luôn gửi được yêu cầu tư vấn và thấy giá mà không phải cuộn ngược.

## 2. Quyết định đã chốt

| #   | Quyết định                                                                                                                                                                                                      | Nguồn             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 1   | Hero dùng thẻ như trang Phương pháp (ink, 18 px, ảnh + scrim, dải lộ trình). Không dùng ảnh vòm hay thẻ linen sáng.                                                                                             | Owner, 2026-10-15 |
| 2   | Huy hiệu: hai giá trị do owner chọn trong CMS: "Được chọn nhiều" (Clay, dấu tích) và "Mới" (Sage, lá). Hình dáng **tem tròn nghiêng**. Mặc định không có. Chỉ hiện ở trang chi tiết lần này.                    | Owner, 2026-10-15 |
| 3   | Dải thông tin nhanh dạng dải không khung (Giá, Thời lượng gợi ý, Quy trình), kèm nút "Gửi yêu cầu tư vấn". Không dùng thẻ nổi và số lớn.                                                                        | Owner, 2026-10-15 |
| 4   | Thanh dính ở **đáy**: hiện khi dải thông tin cuộn khỏi màn hình, ẩn khi tới form.                                                                                                                               | Owner, 2026-10-15 |
| 5   | Giới thiệu: hướng E (câu chủ đề bên trái, thân bài bên phải), nhấn mạnh bằng màu, không in nghiêng.                                                                                                             | Owner, 2026-10-15 |
| 6   | Gộp "Thường dành cho" và "Hướng tới" thành "Dành cho ai, hướng tới gì". Bỏ nhãn "Khi bạn muốn" của nhóm, các dòng phụ, câu kết, tên tiếng Anh và mô tả ở thẻ liên quan.                                         | Owner, 2026-10-15 |
| 7   | Các bước: lưới thẻ như trang chủ (`.stepsGrid`). Liệu pháp liên quan: thẻ chỉ mục như Services.                                                                                                                 | Owner, 2026-10-15 |
| 8   | Tiêu đề phần liên quan: "Có thể bạn quan tâm".                                                                                                                                                                  | Owner, 2026-10-15 |
| 9   | Thêm trường CMS `faqs` (câu hỏi thường gặp theo liệu pháp), chỉ hiện khi owner đã nhập. Spec này không soạn nội dung FAQ.                                                                                       | Owner, 2026-10-15 |
| 10  | Thống nhất với `DESIGN.md`: không in nghiêng, không bóng đổ, bán kính 14/16/18 px và pill, chỉ dùng token có sẵn, một kiểu tiêu đề phần, không vòng hoa hay nét lượn sóng ngoài CTA đóng của trang Phương pháp. | Owner, 2026-10-15 |

## 3. Cấu trúc trang (theo thứ tự)

1. Liên kết quay lại, hero, dải thông tin nhanh, chú thích `*` (khi có).
2. **Giới thiệu**
3. **Dành cho ai, hướng tới gì**
4. **Một buổi diễn ra thế nào**
5. **Câu hỏi thường gặp**
6. **Có thể bạn quan tâm**
7. Panel form (`id="yeu-cau"`), thanh dính đáy.

Mỗi phần 2–6 dùng một kiểu tiêu đề: `h2` màu sage kèm đường kẻ mảnh kéo dài (mẫu `.stepsHead` của trang chủ), khoảng cách dọc 80 px desktop (52 px mobile), khung trang 1360 px. Phần không có dữ liệu thì ẩn cả tiêu đề.

## 4. Các khối

### 4.1 Hero

- Thẻ 18 px, nền `--ink`, ảnh liệu pháp phủ kín, scrim như `treatments.module.css` (`.heroScrim`). Chiều cao tối thiểu 420 px (520 px mobile). Liên kết quay lại "← Tất cả phương pháp" phía trên (mono 11 px, màu clay-deep).
- Nội dung bên trái: `h1` là `title` (Display, tối đa 56 px, màu `#f7f3f0`); dưới là `englishTitle` bằng chữ **thẳng**, màu `--hero-emphasis`, cỡ 0.42 của `h1` (ẩn khi trùng `title`, so sánh không phân biệt hoa thường và khoảng trắng, dùng `englishSubtitle`). Đoạn dẫn: `shortDescription`, nếu không có thì `description` (tách đoạn bằng `paragraphs`).
- Hành động: liên kết điện thoại (nút viền sáng, `Gọi {site.phone}`). Nút chính "Gửi yêu cầu tư vấn →" nằm trong dải thông tin; **chỉ khi không có dải thông tin** thì nút chính nằm ở hero.
- Dải lộ trình (mẫu thread-and-dot của trang Phương pháp): nhãn mono "Lộ trình", ba chặng Trị liệu / Tập luyện / Hồi phục nối bằng đường kẻ mảnh; chặng chứa nhóm của liệu pháp được tô. Ẩn khi liệu pháp không thuộc nhóm nào.
- Huy hiệu (khi `badge` có giá trị): tem tròn 108 px (88 px mobile), góc trên phải của thẻ, xoay −8°, nền Clay (`popular`) hoặc Sage (`new`), icon dấu tích (`popular`) hoặc lá (`new`) cao 20 px màu `--hero-emphasis`, chữ Display 15.5 px (13 px mobile). Chữ là chữ thật, tên truy cập là chữ đó.
- **Hero không ảnh:** cùng thẻ `--ink` không có scrim; huy hiệu thành chip (pill) phía trên `h1`.

### 4.2 Dải thông tin nhanh

- Dải không khung: đường kẻ mảnh dưới (và trên khi không dính hero), vạch dọc giữa các ô, như quick-link strip; padding ô 20 px × 24 px. Mỗi ô gồm nhãn mono 11 px (màu `muted`) và giá trị Display 300, `clamp(1.5rem, 2.4vw, 32px)`:
  - **Giá**: khi `price` là số nguyên lớn hơn 0, `formatPrice`.
  - **Thời lượng gợi ý**: khi `duration` có chữ, hiển thị nguyên văn chuỗi CMS.
  - **Quy trình**: khi có `protocols`, "{N} bước".
- Ô cuối cùng là nút chính "Gửi yêu cầu tư vấn →" (pill, `#yeu-cau`).
- Không có ô nào: ẩn cả dải (nút chính về hero). Mobile: hai ô mỗi hàng, ô thứ ba và nút chiếm cả hàng; nút rộng hết chiều ngang.
- **Chú thích `*`**: khi `requiresCertifiedPractitioner`, một dải `--warm-band` bo 14 px ngay dưới, chữ `certifiedPractitionerNote`, kể cả khi dải thông tin ẩn.

### 4.3 Thanh dính đáy

- Component client. Hiện khi phần tử mốc (dải thông tin; nếu không có thì khối hành động của hero) đã cuộn khỏi viền trên màn hình **và** panel form chưa tới (đỉnh panel còn dưới viền dưới màn hình trừ 40 px). Một khi đã tới form, không hiện lại.
- Hình dạng: viên thuốc bo tròn, nền `--card` 96%, viền mảnh, không bóng đổ. Desktop: giữa trang, rộng tối đa 820 px, cách đáy 16 px; mobile: cách mép 10 px.
- Nội dung: tên liệu pháp (ẩn trên mobile), giá lớn kèm thời lượng nhỏ (chỉ phần có dữ liệu), nút "Gửi yêu cầu tư vấn →" (link `#yeu-cau`). Không có giá và thời lượng: chỉ tên và nút.
- Né các thành phần nổi có sẵn: đặt biến CSS `--dock-h` (chiều cao + 12 px) lên `:root` khi hiện, bỏ khi ẩn; `bottom` của thanh = `16px + var(--cookie-h, 0px)` (nằm trên banner cookie); nút liên hệ (`components/chat-widgets.module.css`, hai chỗ `bottom`) cộng thêm `var(--dock-h, 0px)`.
- Truy cập: thẻ `aside` có `aria-label="Tóm tắt và gửi yêu cầu tư vấn"`, không bẫy tiêu điểm, nằm sau nội dung chính trong DOM; `padding-bottom: env(safe-area-inset-bottom)`. `prefers-reduced-motion`: hiện ngay, không trượt.

### 4.4 Giới thiệu (hướng E)

Điều kiện hiện: `description` khác đoạn dẫn ở hero (so sánh sau khi cắt khoảng trắng).

- Bố cục hai cột (1.05fr / .95fr, khoảng cách 64 px): trái là **câu chủ đề** (Display 300, `clamp(1.7rem, 3vw, 40px)`), phải là các đoạn còn lại (17 px, `muted`). Dưới 980 px thành một cột.
- Quy tắc tách (hàm thuần `introParts(description, title)`):
  1. Tách mô tả thành đoạn (`paragraphs`).
  2. Câu chủ đề là **câu đầu của đoạn đầu**: cắt ở dấu chấm đầu tiên theo sau là khoảng trắng và một chữ cái viết hoa (`\p{Lu}`), **không** cắt sau các từ viết tắt `TP.`, `TS.`, `BS.`, `PGS.`, `ThS.`, `Dr.`.
  3. Chỉ dùng kiểu câu chủ đề khi câu đầu dài từ 40 đến 220 ký tự. Ngoài khoảng đó, hoặc không tách được: không dùng kiểu câu chủ đề; hiển thị các đoạn ở một cột (tối đa khoảng 66 ký tự mỗi dòng), không cố làm đẹp.
  4. Phần còn lại của đoạn đầu (nếu có) mở đầu cột phải, theo sau là các đoạn khác. Câu chủ đề không lặp lại ở cột phải. Chỉ có một câu và không có đoạn khác: chỉ hiện câu chủ đề, không để cột phải trống.
  5. Nhấn mạnh: lần xuất hiện **đầu tiên** của `title` trong câu chủ đề (khớp không phân biệt hoa thường và dấu, chuẩn hoá NFC) được bọc `<b>` màu `--clay-deep`, `font-weight: 300`. Không tìm thấy thì không nhấn. Không in nghiêng.
- Tiêu đề phần: "Giới thiệu".

### 4.5 Dành cho ai, hướng tới gì

Điều kiện hiện: có ít nhất một nhãn "Khi bạn gặp" của nhóm, hoặc có `benefits`.

- Hai hàng tag y hệt trang Phương pháp (`.tagRow`, nhãn cột 104 px, pill `--warm-band` chữ `muted`, cao 40 px, bo pill):
  - **Khi bạn gặp**: nhãn điều kiện của nhóm (`filterTags` thuộc loại `condition`, dùng `methodTagLabel`), loại trùng khi liệu pháp thuộc nhiều nhóm. Bỏ nhãn "Khi bạn muốn".
  - **Hướng tới**: `benefits` từ CMS, theo thứ tự. Mỗi mục chỉ là chữ trong pill.
- Chú thích (15 px, `muted`): `Nhãn "Khi bạn gặp" theo nhóm {tên nhóm}. Mỗi người một khác: chuyên viên sẽ đánh giá tình trạng của bạn trước khi chọn kỹ thuật phù hợp.` Nhiều nhóm: `theo các nhóm {A} và {B}`. Không có nhãn "Khi bạn gặp": chỉ `Mỗi người một khác: chuyên viên sẽ đánh giá tình trạng của bạn trước khi chọn kỹ thuật phù hợp.`
- Mobile: nhãn nằm trên pill.

### 4.6 Một buổi diễn ra thế nào

- Điều kiện: có ít nhất một bước hợp lệ. Bước sắp theo `step` (đã có trong `lib/sanity.ts`).
- Lưới thẻ y hệt trang chủ (`.stepsGrid`, `.stepCard`): thẻ bo 14 px nền `--warm-band-2`, padding 30 px × 28 px; số thứ tự Display 200, 36 px, màu `--clay-deep` (hai chữ số, `padStart(2, "0")`); `h3` 21 px 400; mô tả 15 px `muted`. 4 cột trên 1100 px, 2 cột từ 700 đến 1100 px, 1 cột dưới 700 px; khoảng cách 20 px. Hàng cuối được phép thiếu ô.
- `ol` có thứ tự thật; `h3` là tiêu đề bước. Mô tả rỗng thì không có `<p>`.

### 4.7 Câu hỏi thường gặp

- Điều kiện: `faqs` có ít nhất một mục hợp lệ (cả câu hỏi và trả lời không rỗng).
- Danh sách `<details>`/`<summary>` có đường kẻ trên và dưới mỗi mục; câu hỏi Display 300 `clamp(1.15rem, 1.8vw, 22px)`, dấu "+" và "–" bên phải (màu clay-deep). Tất cả đóng mặc định. Câu trả lời tách đoạn bằng `paragraphs`.

### 4.8 Có thể bạn quan tâm

- Điều kiện: có ít nhất một liệu pháp khác trong cùng nhóm (loại trừ chính nó và các liệu pháp không còn tồn tại). Nhiều nhóm: gộp, bỏ trùng, giữ thứ tự theo nhóm. Tối đa 6.
- Lưới thẻ chỉ mục (như Services): thẻ 16 px nền trắng, viền mảnh `rgba(58,42,36,.14)`, padding 24 px, hover nền `--warm-band` (không nhấc, không bóng); tên Display 300 `clamp(1.3rem, 1.8vw, 24px)`; hàng dưới: giá (khi có) và mũi tên. 4 cột trên 980 px, 2 cột đến 480 px, 1 cột dưới. Toàn thẻ là một liên kết `/treatments/{slug}`.
- Liên kết "Xem tất cả phương pháp →" tới `/treatments`.

### 4.9 Panel form

- Panel `--warm-band`, bo 18 px, padding 48 px (28 × 20 px mobile), hai cột trên 980 px. Trái: `h2` sage và đoạn `muted`; phải: `LeadForm kind="booking" treatment={title}` (giữ nguyên hành vi hiện có: `source`, honeypot, thông báo chỉ nói đã gửi yêu cầu).
- Không có vòng hoa vẽ tay (họa tiết đó chỉ dành cho CTA đóng của trang Phương pháp).

## 5. Dữ liệu

### 5.1 Schema Sanity (`treatment`)

- `badge`: `string`, `options.list` = `[{ title: "Được chọn nhiều", value: "popular" }, { title: "Mới", value: "new" }]`, `layout: "radio"`, `options.direction: "horizontal"`, không bắt buộc. Mô tả: "Chỉ bật khi có căn cứ thực tế (ví dụ số liệu lượt đặt). Chữ hiển thị cố định, không nhập tự do."
- `isPopular`: ẩn khỏi form (`hidden: true`), giữ để tương thích.
- `faqs`: mảng `treatmentFaq` (đối tượng mới, `question: string` bắt buộc, `answer: text` bắt buộc, `rows: 4`), `validation: (rule) => rule.max(10).warning("Nên giữ tối đa 10 câu hỏi.")`. Tiêu đề trong Studio: "Câu hỏi thường gặp".

### 5.2 Kiểu và đọc dữ liệu

- `Treatment`: thêm `badge?: "popular" | "new"` và `faqs?: Array<{ question: string; answer: string }>`.
- `treatmentSchema` (zod): `badge` nhận `"popular"` hoặc `"new"`, giá trị lạ thành `undefined`; **kết quả** là `badge ?? (isPopular ? "popular" : undefined)`. `faqs`: từng mục kiểm tra riêng (bỏ mục thiếu câu hỏi hoặc trả lời), `.catch([])` cho cả mảng; `question` và `answer` cắt khoảng trắng.
- GROQ: thêm `badge` và `"faqs": faqs[]{question, answer}` vào truy vấn `getTreatments`.

### 5.3 Hàm thuần

- `lib/treatment-text.ts`: `introParts(description, title) → { statement?: Array<{ text: string; emphasis?: boolean }>; rest: string[] }` theo mục 4.4 (`statement` là các đoạn chữ của câu chủ đề, đoạn chứa tên liệu pháp được đánh dấu `emphasis`; `rest` là các đoạn còn lại của cột phải). Kèm `emphasize(text, title)`. Không phụ thuộc React.
- `lib/treatment-detail.ts`: `buildTreatmentDetail(treatment, treatments, methods) → { groups: { group, title }[]; stages: MethodStageId[]; conditions: string[]; related: { slug, title, price? }[] }` theo các mục 4.1, 4.5, 4.8. Dùng `methodStages`, `methodTagLabel`, dữ liệu từ `getMethods()` và `getTreatments()`.
- `lib/treatment-display.ts` giữ `formatPrice`, `englishSubtitle`, `paragraphs`, `certifiedPractitionerNote`.

### 5.4 Truy vấn trong trang

`page.tsx` gọi `getTreatments()` và `getMethods()` (đều có `cache`). Khi Sanity không cấu hình, dùng dữ liệu bundled (nhóm và liên kết có sẵn trong `lib/content.ts`). Khi Sanity đã cấu hình, chỉ dùng liên kết của CMS (không liên kết slug bundled không có document).

## 6. Hệ thống thiết kế (bắt buộc)

- **Màu:** chỉ token có sẵn (`--card`, `--ink`, `--muted`, `--clay`, `--clay-deep`, `--clay-hover`, `--sage`, `--numeral`, `--warm-band`, `--warm-band-2`, `--hero-emphasis`). Không thêm tông nhạt mới.
- **Chữ:** Display (Roboto Slab) cho `h1`/`h2`/`h3` và số; Roboto Serif 300 cho thân; Roboto Mono chỉ cho nhãn chú thích nhỏ (nhãn trong dải thông tin, dải lộ trình, liên kết quay lại), **không** làm eyebrow kèm tiêu đề. Không in nghiêng; nhấn bằng màu.
- **Bán kính:** 14 px (thẻ bước), 16 px (thẻ liên quan), 18 px (hero, panel), pill (nút, tag, thanh dính), tròn (tem huy hiệu).
- **Phẳng:** không `box-shadow`. Chấm sợi chỉ chỉ là chấm 9 px đặc, không vầng sáng.
- **Nút:** pill; chính = `--clay-deep` (hover `--clay-hover`), sáng trên nền tối, viền sáng cho liên kết điện thoại.
- **Khung:** nội dung trang 1360 px (`max(24px, calc((100vw - 1360px) / 2))`).
- **Điểm ngắt:** 980 px (hai cột thành một, lưới 2 cột) và 700 px (mobile).
- CSS nằm trong `app/treatments/[slug]/treatment-detail.module.css`; không đụng `globals.css` ngoài hai dòng `bottom` của nút liên hệ trong `components/chat-widgets.module.css`.

## 7. Chữ (owner duyệt)

| Vị trí                            | Chữ                                                                                                                                      | Nguồn                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Liên kết quay lại                 | ← Tất cả phương pháp                                                                                                                     | Cố định                               |
| Nút chính (dải, hero, thanh dính) | Gửi yêu cầu tư vấn →                                                                                                                     | Cố định                               |
| Liên kết điện thoại               | Gọi {số điện thoại của site}                                                                                                             | Dữ liệu site                          |
| Nhãn dải lộ trình                 | Lộ trình                                                                                                                                 | Cố định                               |
| Chặng                             | Trị liệu / Tập luyện / Hồi phục                                                                                                          | `methodStages` (đã duyệt)             |
| Nhãn dải thông tin                | Giá / Thời lượng gợi ý / Quy trình                                                                                                       | Cố định                               |
| Giá trị quy trình                 | {N} bước                                                                                                                                 | Cố định + CMS                         |
| Chú thích `*`                     | Các dịch vụ trị liệu này chỉ được thực hiện và theo dõi bởi chuyên viên có chứng nhận và chứng chỉ chuyên môn.                           | Bảng giá owner                        |
| Huy hiệu                          | Được chọn nhiều / Mới                                                                                                                    | Cố định                               |
| Tiêu đề phần                      | Giới thiệu · Dành cho ai, hướng tới gì · Một buổi diễn ra thế nào · Câu hỏi thường gặp · Có thể bạn quan tâm                             | Cố định                               |
| Nhãn tag                          | Khi bạn gặp · Hướng tới                                                                                                                  | Cố định / nhãn nhóm đã duyệt          |
| Chú thích tag                     | Nhãn "Khi bạn gặp" theo nhóm {tên nhóm}. Mỗi người một khác: chuyên viên sẽ đánh giá tình trạng của bạn trước khi chọn kỹ thuật phù hợp. | Cố định, ý lấy từ mô tả nhóm đã duyệt |
| Liên kết phần liên quan           | Xem tất cả phương pháp →                                                                                                                 | Cố định                               |
| Tiêu đề panel form                | Muốn biết liệu pháp này có phù hợp với bạn?                                                                                              | Giữ từ trang hiện tại                 |
| Đoạn panel form                   | Để lại tên và số điện thoại. Holistic sẽ gọi lại để trao đổi và xác nhận thời gian; đây chưa phải lịch hẹn.                              | Khớp thông báo sau khi gửi            |
| Nhãn thanh dính                   | Tóm tắt và gửi yêu cầu tư vấn                                                                                                            | Cố định (chỉ cho trình đọc màn hình)  |

Mô tả, lợi ích, các bước và FAQ là chữ do owner nhập trong CMS.

## 8. Trạng thái và trường hợp biên

- **Thiếu ảnh:** hero không ảnh (4.1). **Thiếu mô tả ngắn:** mô tả chi tiết làm đoạn dẫn và Giới thiệu ẩn. **Thiếu giá, thời lượng hay quy trình:** ô tương ứng ẩn; cả ba thiếu thì ẩn dải và nút chính về hero.
- **Không thuộc nhóm nào:** ẩn dải lộ trình, nhãn "Khi bạn gặp" và phần liên quan.
- **Nhiều nhóm:** gộp nhãn, tên nhóm, liệu pháp liên quan (4.5, 4.8); dải lộ trình tô tất cả chặng liên quan.
- **Slug lạ:** giữ `notFound()` (404 thật).
- **Văn bản CMS có `\n`:** tách đoạn (đã có `paragraphs`).
- **Giá:** chỉ hiện khi lớn hơn 0. Dữ liệu production hiện có giá `99` (sai đơn vị) sẽ hiện "99 ₫" cho tới khi sync sửa (xem mục 11).
- **Chữ rất dài:** tiêu đề và tên liệu pháp được phép xuống dòng; không cắt (trừ mô tả hai dòng đã bỏ).

## 9. Truy cập và chuyển động

- Một `h1`; `h2` theo từng phần; `h3` cho bước và tên thẻ liên quan; `<main id="main">`; thứ tự Tab: liên kết quay lại → hành động hero → nút trong dải → các liên kết trong nội dung → thẻ liên quan → form → thanh dính (nằm cuối DOM, trước footer).
- Tương phản: chữ trên Clay (`#744d40`) và Sage (`#48614c`) với `#f7f3f0` hoặc `#fff` đạt AA; kiểm chứng bằng phép đo khi triển khai.
- `prefers-reduced-motion`: tắt trượt của thanh dính, tắt chuyển động hover (`transform`) và chuyển nền; không có chuyển động nào ở lần hiển thị đầu của trang.
- Neo `#yeu-cau` cuộn mượt khi không có reduced-motion.

## 10. Kiểm thử và bằng chứng

- **Đơn vị:** `introParts` (đoạn đầu dài, ngắn, một câu, viết tắt, không có chữ hoa sau dấu chấm, nhấn mạnh có và không có tên); `buildTreatmentDetail` (một nhóm, nhiều nhóm, không nhóm, trùng, loại trừ chính nó, giới hạn 6, nhãn điều kiện); zod (`badge` hợp lệ/lạ/`isPopular`, `faqs` hợp lệ/thiếu mục).
- **Render (`renderToStaticMarkup`):** từng khối khi đủ và khi thiếu dữ liệu; hai huy hiệu; hero không ảnh; có `*` và không có giá; dải thông tin 0–3 ô và vị trí nút chính; `<details>` FAQ; liên kết thẻ liên quan.
- **Schema:** `badge` chỉ nhận hai giá trị; `faqs` yêu cầu cả hai trường, cảnh báo khi quá 10.
- **Thanh dính (client):** logic hiện/ẩn tách thành hàm thuần (nhận vị trí mốc, vị trí panel, chiều cao màn hình) và được test; hiệu ứng DOM kiểm trong trình duyệt.
- **Trình duyệt (1280, 768, 375 px):** bộ dữ liệu: Giác hơi (CMS thật, đủ), Tapping (tối thiểu, không ảnh), Châm khô (có `*`), có huy hiệu `popular` và `new`, không nhóm, hai nhóm. Kiểm tra: không cuộn ngang, một `h1`, bàn phím, thanh dính hiện/ẩn và né banner cookie cùng nút liên hệ, focus nhìn thấy, reduced-motion. Ảnh trước/sau lưu `.context/evidence/`.
- **Kho mã:** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` sạch; `docs/FRONTEND_CHECKLIST.md` cho các mục bị ảnh hưởng.

## 11. Ngoài phạm vi và câu hỏi cho owner

**Ngoài phạm vi:** carousel "Dịch vụ nổi bật" ở trang chủ đọc từ CMS (trường `badge` được để sẵn cho việc đó); nội dung FAQ thật; i18n và route `/en`; JSON-LD; chạy sync lên Sanity (xem `2026-10-15-treatment-catalog-design.md` và `docs/TREATMENTS_VERIFICATION.md`); giá nhiều mức của `/services`.

**Câu hỏi cho owner:**

1. Duyệt toàn bộ chữ ở mục 7, đặc biệt "Dành cho ai, hướng tới gì", "Có thể bạn quan tâm" và chú thích tag.
2. Mục "An toàn và ít tác dụng phụ" trong `benefits` của Giác hơi (CMS production): giữ hay bỏ? Trang sẽ hiển thị nguyên chữ CMS, không lọc.
3. Bước "Số lần điều trị" thực ra là lời dặn sau buổi: giữ ở vị trí bước 7 hay đổi?
4. Đặt huy hiệu cho liệu pháp nào, với căn cứ nào ("Được chọn nhiều" cần số liệu nội bộ).
5. **Chưa quyết (liên quan sync production):** script đồng bộ hiện ghi đè mô tả, và xoá `benefits`, `protocols`, `duration`, `seo` của ba liệu pháp production. Trang mới hiển thị các nội dung này. Chọn: giữ nội dung CMS và chỉ cập nhật tên, giá, cờ `*`; hay ghi đè theo bảng giá.

## 12. Rủi ro

- **Tách câu đầu bằng quy tắc:** tiếng Việt có viết tắt và số; quy tắc thận trọng (độ dài 40–220, danh sách viết tắt, rơi về hiển thị thường) giảm rủi ro nhưng không loại bỏ; có test cho từng trường hợp.
- **Thanh dính và các thành phần nổi:** ba lớp cố định ở đáy (thanh dính, banner cookie, nút liên hệ); mobile có banner cookie là trạng thái tạm cho tới khi khách chọn. Biến `--dock-h` và `--cookie-h` phải đồng bộ.
- **Hero tối:** chữ trắng cần ảnh đủ tối ở bên trái; scrim đã bao, nhưng ảnh mới nên kiểm tra tương phản.
- **Nội dung CMS chưa duyệt** (benefits, bước, FAQ) hiển thị nguyên văn; trách nhiệm duyệt thuộc owner.
