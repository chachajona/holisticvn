# Đưa trang chi tiết liệu pháp về màu, chữ và nút của hệ Warm Clay v2

Written against: `9a4f9c14a536d61e798c0de5a07005287748ead4` + working tree chưa commit trên nhánh `issue-10` (phần `.treatment-protocol`, hero `--plain`, `imageAlt`, `seo` đã có trong `app/treatments/[slug]/page.tsx` và `app/globals.css` nhưng chưa commit). Executor phải làm việc trên working tree này, không phải `main`.

Phạm vi plan này: **màu, thang chữ, nút/input**. Không đổi bố cục, spacing, container hay câu chữ. Phần đó nằm ở `design-plans/treatment-detail-layout-and-wording.md` và chạy **sau** plan này.

## Evidence chain

- Surface: `/treatments/[slug]` (render qua `app/treatments/[slug]/page.tsx`), xem ảnh `.context/treatment-detail-desktop.png`, `.context/treatment-detail-mobile.png`, so với `.context/treatments-index-desktop.png`.
- Problem: trang chi tiết dùng palette cũ của `app/globals.css:1-9` (`--ink #1b2520`, `--coral #d97052`, `--paper #e9e4d8`, `--milk #f4f2eb`, cộng hex gán cứng `#cdd9c6`, `#a9c292`, `#d4d7ce`). Nav, footer và trang `/treatments` dùng clay/sage. Hero xanh-đen lạnh, số bước và eyebrow coral, nút đen vuông trên cùng một hành trình `/treatments` → chi tiết.
- Design evidence:
  - `DESIGN.md:150` (palette, type stack, nút dùng chung), `:174` (h2 section là sage), `:181-182` (muted, numeral), `:204-207` (display ≤60px, headline ≤42px, title ink), `:248-251` (nút pill, primary clay-deep, hover clay-hover), `:242` (hairline `rgba(58,42,36,α)`, α .1–.25), `:344` (không shadow trên content).
  - Token và pattern nguồn: `app/treatments/treatments.module.css:1-35` (`.root` + heading rules), `:44-100` (hero), `:396-420` (`.stage` h2 sage), `:611-640` (nút).
  - Cỡ chữ hiện tại: `globals.css:772` (h1 tới 6.8rem), `:810`, `:841` (h2 tới 5rem), `:883` (booking h2 tới 5.2rem).
- Owner: CSS module mới `app/treatments/[slug]/treatment-detail.module.css`. Mỗi trang v2 tự khai báo token trong `.root` của module riêng (`DESIGN.md:150`), nên không import module khác.
- Scope and affected surfaces: `app/treatments/[slug]/page.tsx`, `app/globals.css` (xóa selector chỉ trang này dùng), `tests/sanity.test.ts`. Form `LeadForm` trên trang này.
- Uncertainty:
  - `DESIGN.md` chưa liệt kê trang chi tiết trong phạm vi v2. Plan này giả định owner muốn đưa vào (người dùng đã yêu cầu "giống màu với trang treatment").
  - `DESIGN.md` không có token cho màu lỗi/thành công của form. Plan dùng `--clay-deep` cho lỗi và `--sage` cho thành công; nội dung thông báo vẫn mang nghĩa bằng chữ, không chỉ bằng màu. Nếu owner muốn màu lỗi riêng thì dừng và hỏi, không tự thêm token.
  - Các tỉ lệ tương phản bên dưới là ước lượng; phải đo lại.

## Design decision

Chuyển toàn bộ lớp trình bày của trang chi tiết sang một CSS module có `.root` mang token Warm Clay, giữ nguyên hình học hiện tại (grid 2 cột, 110px padding, `.shell` 1180px). Chỉ thay: màu, cỡ/màu heading, nút và input của form. Form chỉ đổi trong phạm vi `.root` này, **không** sửa `.button`/`.lead-form` toàn cục vì `/contact` và `/booking` cũng dùng chúng và nằm ngoài phạm vi.

## Reuse

- Token: khối `.root` của `app/treatments/treatments.module.css:1-19` (`--card #fdfaf6`, `--ink #3a2a24`, `--muted #5c4b44`, `--clay-deep #744d40`, `--clay-hover #5f3d32`, `--sage #48614c`, `--numeral #ab917e`, `--warm-band #f6efe6`, `--hero-emphasis #e0c1af`), `::selection #ddb6af`, và rule `h1,h2,h3` (Roboto Slab 300, `-0.015em`).
- Pattern: `.primaryButton` (`treatments.module.css:611-622`), `.hero h1`/`.heroBody` (`:94-100`, 17px/1.6 `rgba(247,243,240,.82)`), `.stage > h2` (`:396-410`).
- Exemplar: `app/treatments/page.tsx` (`<main id="main" className={styles.root}>`).
- Không tạo primitive mới. Không thêm biến vào `globals.css`.

## Changes

1. `app/treatments/[slug]/treatment-detail.module.css` (mới)
   - Change: khai báo `.root` (token như trên, `color: var(--ink); background: var(--card); font-family: var(--font-accent); font-weight: 300; overflow: clip`), rule `h1,h2,h3` và `::selection`. Thêm các class dưới đây, mỗi class thay đúng một selector cũ:

     | Class mới                            | Thay                               | Giá trị                                                                                        |
     | ------------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
     | `hero` (+ `heroPlain` khi không ảnh) | `.treatment-detail-hero`           | nền `--ink`, chữ `#f7f3f0`, giữ `padding: 42px 0 0`                                            |
     | `backLink`                           | `.back-link` (chỉ trong trang này) | mono 500 11px, `letter-spacing .16em`, uppercase, màu `--hero-emphasis`                        |
     | `eyebrow`                            | `.eyebrow`                         | mono 500 11px, `.16em`, uppercase; trên nền tối `--hero-emphasis`, trên nền sáng `--clay-deep` |
     | `title` (h1)                         | `.treatment-detail-hero h1`        | `clamp(2rem, 4.4vw, 60px)`, line-height 1.1, `#f7f3f0`                                         |
     | `lead`                               | `.treatment-detail-hero p`         | 17px/1.65, `rgba(247,243,240,.82)`, max-width 540px                                            |
     | `duration`                           | `.treatment-duration`              | giữ hình học; viền trên `rgba(247,243,240,.25)`; mono 11px                                     |
     | `band`                               | `.section--paper`                  | nền `--warm-band`                                                                              |
     | `expect`, `protocol`, `booking` h2   | h2 các section                     | `clamp(1.5rem, 3vw, 42px)`, line-height 1.2, màu `--sage`                                      |
     | đoạn thân                            | `p` muted                          | màu `--muted`, 16px/1.75                                                                       |
     | hairline                             | `var(--line)`                      | `rgba(58, 42, 36, 0.16)`                                                                       |
     | số lợi ích                           | `.treatment-detail-grid li span`   | mono 11px, màu `--clay-deep` (nhãn, không phải numeral)                                        |
     | số bước                              | `.treatment-protocol li > span`    | Roboto Slab 200, `clamp(28px, 3vw, 36px)/1`, màu `--numeral`; cột số rộng 72px                 |
     | h3 bước                              | `.treatment-protocol h3`           | giữ 1.2rem/400, màu ink (vai trò title)                                                        |

   - Form (trong `.root`, dùng `:global` vì `LeadForm` là client component dùng class toàn cục):
     - `.root :global(.lead-form) :global(.button)`: `border-radius: 999px; background: var(--clay-deep); border-color: var(--clay-deep); color: #f7f3f0`; hover `background/border: var(--clay-hover)`; giữ lift 2px chỉ khi `(hover: hover) and (pointer: fine)` như `treatments.module.css:617-621`; trạng thái `:disabled` giữ `opacity` hiện có.
     - `input, textarea, select`: `border-radius: 10px` (`rounded.sm`), `border: 1px solid rgba(58,42,36,.25)`, nền `#fff`; `:focus` → `border-color: var(--clay-deep)` và `outline: 2px solid var(--clay-deep); outline-offset: 2px` (thay vòng coral, giữ focus nhìn thấy).
     - `summary:focus-visible` outline `--clay-deep`.
     - `.form-message` lỗi → `--clay-deep`; `.form-message--success` → `--sage`; link trong thông báo giữ underline.
   - Preserve: toàn bộ markup ngữ nghĩa (một `h1`, `h2`, `h3`, `<ol>`, `<ul>`), `next/image` + `fill` + `sizes` + `priority`, grid 2 cột và breakpoint 760px hiện tại (sao chép `@media (max-width: 760px)` tương ứng từ `globals.css:960-1010` cho các selector đã chuyển), hero `--plain` khi không có ảnh.
   - Verify: không còn giá trị `#1b2520`, `#d97052`, `#e9e4d8`, `#cdd9c6`, `#a9c292`, `#d4d7ce` trong module; không có `box-shadow` mới ngoài outline focus.

2. `app/treatments/[slug]/page.tsx`
   - Change: `import styles from "./treatment-detail.module.css"`; `<main id="main" className={styles.root}>`; thay mọi `className` cũ (`treatment-detail-*`, `treatment-protocol`, `treatment-duration`, `booking-split`, `display`, `eyebrow`, `section--paper`) bằng class module tương ứng; giữ `shell` và `section` toàn cục cho container và padding. Hero không ảnh đặt thêm `data-plain` trên `<section>`.
   - Preserve: `generateStaticParams`, `generateMetadata`, `notFound()`, `revalidate`, thứ tự section, mọi chuỗi chữ, `<LeadForm kind="booking" treatment={treatment.title} />`.
   - Verify: HTML không còn class `treatment-detail-*`.

3. `app/globals.css`
   - Change: xóa các selector `.treatment-detail-hero*`, `.treatment-duration`, `.treatment-detail-grid*`, `.treatment-protocol*`, `.booking-split*` và các dòng tương ứng trong khối `@media (max-width: 760px)` (khoảng dòng 750–890 và 960–1010).
   - Preserve: `.back-link` và `.back-link--dark` (dùng ở `app/blog/[slug]/page.tsx:26`), `.eyebrow`, `.display`, `.section`, `.shell`, `.button`, `.lead-form*` (còn dùng ở `/contact`, `/booking`), mọi `.treatment-index*` (không thuộc phạm vi, dọn riêng).
   - Verify: `grep -rn "treatment-detail\|treatment-protocol\|treatment-duration\|booking-split" app components` không còn kết quả.

4. `tests/sanity.test.ts`
   - Change: assertion `toContain("treatment-detail-hero--plain")` (dòng ~154) đổi thành `toContain("data-plain")`.
   - Preserve: mọi assertion về chữ ("Thời lượng gợi ý", "Quy trình", thứ tự bước, `<img`, `<ul`).
   - Verify: `npm test` xanh.

## Scope

- Inherit: `/treatments/[slug]` mọi slug (fallback `dry-needling`, `cupping`, `iastm`, `heat-light`, `cold-plunge` và dữ liệu Sanity).
- Verify: `/blog/[slug]` (còn dùng `.back-link`), `/contact`, `/booking` (còn dùng `.button`, `.lead-form` — phải **không đổi** so với trước), `/treatments`, trang chủ.
- Exclude: bố cục, spacing, container 1180/1360px, chữ, hero có CTA, bỏ số lợi ích (thuộc plan layout-and-wording); `/contact` và `/booking` vẫn giữ palette cũ (follow-up riêng); `.treatment-index*` mồ côi.

## Validation

- Product: từ `/treatments` bấm vào một liệu pháp; hero, h2, số bước và nút gửi cùng họ màu nâu/sage với nav và footer. Gửi form thành công và thất bại vẫn hiện đúng thông báo.
- Interface: chụp ở 390px, 768px, 1440px cho 3 trạng thái: đủ dữ liệu (có `protocols`, ví dụ dựng qua Sanity thật hoặc fixture), thiếu ảnh (hero `--plain`), thiếu `benefits`/`protocols`. Kiểm tra bằng bàn phím: focus nhìn thấy trên input, `summary`, nút gửi. Đo tương phản: `--hero-emphasis` trên `--ink`, `--clay-deep` trên `--warm-band` và `--card`, `--muted` trên `--warm-band`, `--sage` trên `--card`, chữ nút `#f7f3f0` trên `--clay-deep` (ước lượng đều ≥ 4.5:1, phải đo thật). Không scroll ngang ở 320px.
- System: không thêm token ngoài khối `.root` đã có; không tạo `.button` thứ hai toàn cục; `/contact` và `/booking` render giống trước (so ảnh).
- Repository: `npm run lint` → 0 warning; `npm run typecheck` → pass; `npm test` → pass; `npm run build` → pass; `npm run format:check` → pass.

## Stop conditions

- Dừng nếu `LeadForm` cần đổi markup hoặc thêm prop để theo style (nghĩa là override `:global` không đủ).
- Dừng nếu owner muốn `/contact` và `/booking` đổi theo; khi đó mở rộng sang sửa `.button`/`.lead-form` toàn cục và đưa các trang đó vào phạm vi.
- Dừng nếu không đạt tương phản ≥ 4.5:1 cho chữ thường với bất kỳ cặp màu nào ở trên; không tự chế màu mới.
- Dừng nếu owner muốn màu lỗi riêng cho form.

## Design documentation

- Sau khi owner chấp nhận và validation xong: thêm mục "Treatment detail" vào `DESIGN.md` phần Components (hero ink, h2 sage, numeral cho số bước, nút primary clay-deep qua override trong `.root`) và sửa câu phạm vi ở `DESIGN.md:150` để nêu rõ trang chi tiết thuộc hệ v2. Không cập nhật trước khi được chấp nhận.
