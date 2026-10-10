# Thử skill `improve-ui` trên thay đổi hiện tại

Ngày: 2026-10-10. So sánh working tree (cả tracked và untracked có tham gia public UI) với `origin/main` (`aabee1aa86b085ed143e7f5f8c834fdc19822cec`); HEAD khi review: `fc091da5ef8dd8f351be8b2c3457e6228aa0b5d8`.

## Design language

- **Audited surface:** Homepage `/`, với navigation, utility bar, footer và chrome chung. Tác vụ: hiểu lộ trình tư vấn → trị liệu → tập luyện rồi gửi yêu cầu tư vấn/đặt lịch. Không mở rộng audit sang toàn bộ nội dung `/services` hoặc `/treatments`; chrome của chúng dùng cùng owner đã trace.
- **Design sources:** `AGENTS.md` yêu cầu đọc `PRODUCT.md` và `docs/FRONTEND_CHECKLIST.md`. `DESIGN.md:255`, `:259`, `:280` ghi rõ các quyết định hiện tại cho concern CTA, integrated care/core values và bảng so sánh. Chỉ dùng phần của tài liệu đã đối chiếu với source hiện tại; không coi toàn bộ mô tả “shipped build” cũ là một contract còn nguyên hiệu lực.
- **Documented decisions:** Warm Clay Editorial: ground `#fdfaf6`, ink `#3a2a24`, clay action `#744d40`, sage `#48614c`; Roboto Slab cho heading, Roboto Serif cho body/UI, Roboto Mono cho nhãn nhỏ. Homepage có nền section ấm, khối concern sage, một bảng so sánh native ở mọi viewport, ba giá trị với icon sage/clay trang trí. Ảnh clinic và icon AI có nguồn trong `PRODUCT.md`. Autoplay là quyết định owner 2026-10-09 (`app/page.tsx:40`), thay cho mô tả “No autoplay” cũ tại `DESIGN.md:160`.
- **Governing owners and consumers:** `app/layout.tsx:45` nạp các font variables rồi `SiteDataProvider`/`SiteChrome` tại `:49`; `components/site-chrome.tsx:20` render `HolisticNav`, children public page, footer, widgets và consent. Homepage `app/page.tsx:366` dùng `.root` của `app/page.module.css:1`, tự định nghĩa palette và heading rules (`:38`). Hero dùng `HeroMobileStage` (`app/page.tsx:369`) và `HeroPanels` (`:376`); carousel dùng `ServicesCarousel` (`:463`, component import chính CSS homepage); các icon pillar render từ `PillarIcon` (`:203`) qua `:639`. Navbar dùng `holistic-chrome.module.css` và `navMorphProgress`, không kế thừa palette `.root` của homepage.
- **Explicit exceptions:** Hai container frames 1240px cho chrome và 1360px cho page body (`DESIGN.md:219`, `:320`); hai closing treatments riêng clay-deep/homepage và near-black/Methods–Services (`:190`, `:327`); shadow của floating contact buttons được mô tả riêng (`:269`). Autoplay owner decision ở `app/page.tsx:40` vượt mô tả cũ về motion; không khuyến nghị tắt nó chỉ để khớp tài liệu cũ.
- **Evidence limits:** Review source, không chạy server/browser, không dùng screenshot cũ làm chứng cứ rendered của working tree hiện tại; không suy luận hierarchy, prominence, density hoặc conversion từ CSS. Không chạy test/build, cài dependency, sửa product source hay tạo implementation plan. Những check accessibility và motion/performance được giao cho các skill chuyên trách trong lượt thử này.

## Findings

No supported findings were found.

Không có candidate nào chứng minh đồng thời contract đang có hiệu lực, đường render hiện tại và một correction duy nhất đủ chắc chắn. Các candidate được mở lại và loại ở bước falsification:

| Candidate đã loại | Source và counterevidence | Vì sao không thành finding |
| --- | --- | --- |
| Hero autoplay khác “No autoplay” trong DESIGN | `DESIGN.md:160`, `:325`; `app/page.tsx:40` ghi quyết định owner giữ autoplay ngày 2026-10-09; `components/hero-panels.tsx:30`, `components/hero-mobile-stage.tsx:42` thực sự dùng hook mới. | Quyết định hiện tại đã thay mô tả motion cũ. Tắt autoplay sẽ trái evidence mới. |
| Navbar desktop morph theo scroll thay transition 320ms/past 48px | `DESIGN.md:288`; `components/holistic-nav.tsx:105` đặt progress, `components/holistic-chrome.module.css:127` giải thích giữ row height để tránh flicker, `:144` dùng progress cho width/height/radius. | Source hiện tại thay owner của motion một cách rõ ràng; không có bằng chứng rằng mô tả threshold/timing cũ còn ràng buộc lựa chọn mới. Không tự hoàn tác nó như một lỗi thiết kế. |
| Các số 01/02/03 dùng clay-deep thay numeral | `DESIGN.md:182`, `:205` mô tả numeral cũ; `app/page.module.css:891` hiện dùng Roboto Slab 200/36px và `--clay-deep`, render qua `app/page.tsx:510`, `:520`, `:530`. Diff đổi màu cùng việc loại override `.stepCard span`; `docs/homepage-xuyen-suot-research.md:5`, `:16`, `:67` là nghiên cứu/đề xuất về khối cũ, chưa phải acceptance cho một màu cụ thể. | Chứng minh được màu hiện tại khác tài liệu, nhưng chưa chứng minh được binding decision mới buộc section đã chỉnh phải quay về `--numeral`. Tài liệu từng mô tả 36px dù computed style của implementation cũ bị override xuống 15px; không đủ tin cậy để coi đây là contract còn nguyên hiệu lực cho thay đổi mới. Không khuyến nghị đổi màu khi intent chưa xác định. |
| Shadow của các mũi tên carousel | `app/page.module.css:589`, `:599`; các button render tại `components/services-carousel.tsx:90`, `:99`. `DESIGN.md:238`, `:324` cấm shadow trên content card/section band; `:269` đã có exception riêng cho floating control khác. | Các mũi tên là control phủ trên carousel, không phải card, section band hay grid item. Không mở rộng lệnh cấm của tài liệu sang một loại control chưa có contract rõ ràng. |

Các quyết định mới rõ nhất đã khớp source: concern CTA không còn symptom subtext và giữ link `/treatments` (`app/page.tsx:466`, `DESIGN.md:257`); integrated care dùng đúng panel, ảnh, icon và các nhánh responsive (`app/page.module.css:1028`, `:1060`, `:1070`, `:1298`, `:1483`; `DESIGN.md:263`, `:265`); bảng giữ cùng rows/header/state labels ở mobile và desktop (`app/page.tsx:553`, `app/page.module.css:1405`; `DESIGN.md:282`). Đây là đối chiếu source, không phải chứng nhận rằng UI đã đạt mọi kiểm tra frontend.

## Improve first

No supported recommendation.

Không tạo implementation plan khi chưa có finding qua proof gate và người dùng chưa chọn cải thiện cụ thể. Nếu mở rộng lượt thử sang visual audit, cần chứng cứ rendered mới của homepage để đánh giá các vấn đề skill này không thể kết luận chỉ bằng source.
