# 03 — Đọc và chọn dịch vụ không bị chat/cookie che

Written against: `a5bd2debfdbc731421671a51b185cb631c7eb1b7`.

Trạng thái: đã triển khai local ngày 2026-11-14 theo yêu cầu người dùng; bằng chứng trong [verification note](../docs/services-layout-verification.md). Phạm vi hiển thị mới chỉ `/services`; issue #41/#1 quản lý trạng thái.

## Evidence chain

- Surface: `/services` 390×844 sau đóng cookie; phone tại x326/y720 và Zalo tại x326/y780 giao nội dung/link Tapping. `.context/services-mobile-top.png` lưu hiện trạng. Banner cookie còn che nội dung ở lần đầu (`services-mobile-full.png`, local/gitignored).
- Contract: `docs/FRONTEND_CHECKLIST.md:37-38` yêu cầu nội dung/CTA không bị header, cookie hoặc chat che. Mục tiêu repo rộng hơn WCAG AA chỉ cấm che toàn bộ control có focus; không suy diễn partial overlap thành kết luận WCAG fail.
- Runtime: `app/layout.tsx` → `SiteChrome` render page rồi `ChatWidgets` và `CookieConsent`; chat fixed bên phải z100; cookie fixed bên trái z60 trong globals. `.root { overflow:clip }` không chữa được overlap này.
- Owner: `components/site-chrome.tsx`, `chat-widgets.tsx`/CSS, `cookie-consent.tsx`, `app/globals.css`; contact data từ `getPublicSiteData()`/provider.
- Evidence reuse: `/contact` dùng contact links trong flow từ `getPublicSiteData()`. Chat có `[data-chat-exclusion]`, nhưng đó là ẩn theo giao viewport, không phát hiện va chạm; đặt lên cả main còn cho widget trở lại ở footer desktop. Không coi marker là giải pháp route-wide.
- External source: [GOV.UK Cookie banner](https://design-system.service.gov.uk/components/cookie-banner/) khuyên banner trong flow và tránh fixed che focus. Vị trí dưới nav ở đây là quyết định giới hạn theo chrome Holistic, không chép toàn bộ thứ tự DOM/GOV.UK consent UX.
- Uncertainty: link inline giảm khả năng chat luôn hiện khi cuộn. Giữ liên hệ ở intro, CTA cuối và footer; cần task review trên preview. Không hứa cải thiện conversion.

## Design decision

Trên `/services`, dùng liên hệ trong flow thay cho floating chat ở **mọi viewport**; banner cookie nằm trong flow dưới nav khi cần hiện. Không thêm sticky dock, gutter lớn hay logic dò va chạm. Route khác tiếp tục dùng chat/cookie mặc định.

Đây là một thay đổi cách bố trí overlay của route; phải làm đồng bộ liên hệ thay thế và cookie, không chỉ ẩn chat rồi bỏ kênh liên hệ.

## Reuse

- `getPublicSiteData()` đã được React cache dùng ở layout/contact: lấy site phone/Zalo/Messenger đã resolve; không đọc env hay viết cứng số/ID.
- Cách tạo link phone/Zalo/Messenger ở `components/chat-widgets.tsx`; xác minh `site.messengerId` có thể vắng. Labels tiếng Việt và brand data hiện hành.
- Mẫu contact trong flow ở `app/contact/page.tsx`; Services dùng `.textLink` thay vì sao chép toàn bộ contact-card.
- Toàn bộ state/logic của `CookieConsent`, `CookiePreferencesButton`, `lib/consent`, GTM hiện có; chỉ thêm variant trình bày.
- Palette, font, hairline, gutter hiện có. Thêm `app/services/services-contact-links.tsx` local nhận `site` đã resolve và tone light/dark qua prop, render hai lần. Cần adapter client để giữ tracking; `ChatWidgets` hiện gắn với fixed controls/visibility observers nên không tái dùng markup đó làm inline. Không tạo primitive dùng chung toàn site hoặc kéo toàn trang sang client.

## Changes

1. `app/services/page.tsx` và `services.module.css`
   - Đọc services và public site data song song. Giữ `getServices()`/query/schema hoàn toàn như hiện tại.
   - Sau intro-side link sang Phương pháp, thêm hàng contact links: “Gọi {site.phone}”, “Nhắn Zalo” nếu có zaloId, “Messenger” nếu có messengerId. Lặp hàng tương tự dưới action group của CTA cuối; không thêm nút primary thứ hai.
   - Phone là `tel:` normalized như widget; Zalo/Messenger giữ đích, `target="_blank"` và `rel="noopener noreferrer"`. Không thêm email/lead form mới.
   - Dùng wrapper flow `display:flex;flex-wrap:wrap`, gap12px24px từ `.actions`, accent14.5px, min-height44px cho link. Intro dùng `.textLink`; trên CTA dùng off-white và underline, focus off-white như CTA hiện có để không kế thừa chữ clay khó đọc trên nền tối. `min-width:0`, chữ dài wrap; không overlay icon/badge.
   - Contact block cuối nằm trong action-side wrapper chứa ba CTA hiện có, như plan02. Block intro nằm trước nav chọn nhóm của plan01. Không chèn thành item thứ ba trên flex row CTA.
   - Giữ số liên hệ/footer/nav booking hiện hành; không duplicate ID. Đây là nhãn chức năng đề xuất, không sửa medical copy.
2. `components/site-chrome.tsx`
   - Sau nhánh `/studio`, xác định `pathname === "/services"` (route config hiện không dùng trailing slash; nếu đổi, chuẩn hóa theo router hiện hành).
   - Services: render `HolisticNav`, một `CookieConsent layout="inline"`, `.page` children, footer, PageViewTracker; **không mount ChatWidgets** và không mount cookie lần hai ở cuối.
   - Route khác: giữ thứ tự/nav/page/footer/chat/cookie/tracker hiện tại. Không route-match `/services-other` hoặc `/treatments` bằng startsWith thiếu giới hạn.
   - Không sửa visibility logic của ChatWidgets và không dùng main-wide `data-chat-exclusion` làm công tắc route.
3. `components/cookie-consent.tsx`
   - Thêm prop optional `layout: "floating" | "inline"`, default `"floating"`, truyền xuống CookieBanner; thêm `data-layout` cho aside `.cookie`.
   - Variant inline vẫn dùng cùng visible state, accept/reject, persistence, blocked-storage dismissal, preferences focus/hash, label và policy link. Không đổi thời hạn consent hay analytics gates; không thêm auto-consent hoặc modal.
   - Chỉ variant floating publish `--cookie-h` bằng ResizeObserver. Inline không chiếm vùng fixed: remove/không publish biến; cleanup khi đổi variant/unmount. Effect phụ thuộc layout để điều hướng services↔route khác không để lại height cũ.
   - Giữ SSR/hydration gate hiện hành. Inline có thể làm nội dung dịch khi banner xuất hiện sau hydrate; không xử lý bằng cách tự nhận diện consent trên server hoặc đoán chiều cao. Kiểm chứng load với hash, không để banner xuất hiện làm summary đích bị sticky nav che. Ghi lại layout shift trong preview để đánh giá, không tuyên bố zero shift.
4. `app/globals.css`
   - Thêm selector `.cookie[data-layout="inline"]` đủ specificity để thắng cả media mobile: position static, inset auto, width auto, margin0, shadow none, z-index auto; nền paper, chữ ink, hairline dưới; padding ngang theo frame body1360px (24px, mobile16px), padding dọc20px desktop/12px mobile.
   - Nội dung/choice group wrap theo không gian; dùng font/labels hiện tại và giữ hai lựa chọn ngang cấp. Không fixed height/ellipsis hoặc giảm chữ để giữ một hàng.
   - Đổi rule dành padding footer từ `body:has(.cookie)` thành `body:has(.cookie:not([data-layout="inline"]))` để inline không tạo khoảng trống đáy giả.
   - Không đổi base `.cookie` của route khác hoặc mở rộng selector sang mọi aside. Không cần sửa chat CSS vì Services không mount widget; `--cookie-h` không còn khi inline.
5. Tests hành vi
   - `tests/services-sanity.test.tsx`: mock public settings theo query riêng vì trước đây fetch mock thường trả service array cho mọi request. Verify contact values/optional channels lấy từ resolved data, CTA/anchor còn đúng; không bypass public-settings validation chỉ để pass fixture.
   - `tests/consent.test.tsx`: verify default floating và inline cùng accept/reject/preference flow; inline không publish fixed height; đổi layout cleanup height. Giữ toàn bộ tracking/blocked-storage tests.
   - Thêm test integration nhỏ cho SiteChrome route switching nếu harness phù hợp: services có một banner inline/không floating widget; route khác phục hồi default; Studio không marketing chrome. Ưu tiên test hành vi, không snapshot cả markup.
6. `app/services/services-contact-links.tsx`
   - Client adapter mỏng, nhận `site: PublicSiteData["site"]` cùng `tone: "light" | "dark"`; render các native anchor đã mô tả, vẫn có HTML khi server render/no-JS.
   - Giữ `track("chat_click", { channel: "dial" | "zalo" | "messenger" })` trên đúng link tương ứng, import cùng `track` của widget. Không track mount/viewport, không tạo event mới hoặc tự đọc consent; `track` hiện có quản lý consent gate.
   - Test hành vi click dùng dữ liệu đã resolve và đúng channel; giữ test consent gate hiện có. Helper không đọc Sanity/env, không sở hữu form/accordion/cookie state.

## Scope

- Inherit: presentation mới chỉ `/services`; consent component API có default giữ mọi consumer khác.
- Verify: `/`, `/contact`, `/booking`, `/treatments`, treatment detail có dock, và `/studio`; điều hướng client qua lại để thấy cleanup.
- Exclude: sửa tracking event contract, booking flow, consent chính sách/persistence, đổi liên hệ thật, widget toàn site hoặc redesign footer/nav.
- Bảo toàn event contract là phần bắt buộc khi chuyển link: dùng client adapter local ở trên, giữ consent gate trong `track`, không đưa nguyên ServicesPage thành client.

## Validation

- Product: phone/Zalo/(Messenger có cấu hình) truy cập được đầu/cuối trang và footer; không còn floating chat trên route, cả desktop footer. Cookie không che body, method link hoặc booking CTA khi cuộn tự do.
- Interface: 320/390/768/1024/1440px, zoom200%; cookie dài và font lớn tự tăng chiều cao; route chuyển đi không còn blank gap/height variable/inline selector rò rỉ.
- States: chưa chọn, accepted, rejected, storage blocked, mở lại từ footer preferences; cùng consent behavior như trước. Không có hai banner cùng ID; keyboard order/nav/focus visible; direct links không cần analytics consent.
- Hash: cookie hiện khi load `#svc-recovery`; summary đích phải đọc được sau hydrate, không nằm dưới nav. Không tắt scroll-margin hiện có để chữa jump.
- No-JS: inline contact links vẫn có trong HTML; native details còn dùng được. Không hứa consent banner hoạt động no-JS vì baseline hiện đã client-gated; không mở rộng sang consent rewrite.
- System: không overlay detector mới, không thêm event taxonomy; public settings fallback/CMS thật phải khớp mọi contact link.
- Repository: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` đạt; ảnh before/after320/768/desktop kèm PR. Chưa chạy các check này trong lượt viết plan.

## Stop conditions

- Nếu phải đổi consent storage/policy hoặc global widget logic mới làm được layout, tách đề xuất đó ra; không âm thầm đưa vào plan UI.
- Nếu contact data resolver hoặc tracking khác baseline, đọc lại owner và giữ contract thực; không viết cứng fallback mới.
- Nếu inline consent gây lỗi hash/focus thực tế, ghi reproduction và sửa trong variant/định vị đích; không che banner, tự consent hay ngắt analytics tests.

## Design documentation

Sau chấp nhận và kiểm chứng: ghi ngoại lệ Services không có floating chat, có contact inline và cookie flow trong `DESIGN.md`; ghi các route không bị đổi và các state đã thử vào bằng chứng issue/PR #41. Tài liệu nghiên cứu không tự coi ngoại lệ này đã được duyệt.
