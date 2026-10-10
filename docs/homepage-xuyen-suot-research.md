# Research: phần “Xuyên suốt” trên Homepage

Method: dual-agent (A: `/root/continuity_design` · B: `/root/continuity_evidence`); nguồn bên ngoài: `/root/continuity_research`.

Ngày: 2026-10-09. Đối tượng: khối ba bước trong `app/page.tsx`, bản đang có trong workspace. Đã xem preview tại `http://localhost:3111` ở desktop 1440 × 1000 và mobile 390 × 844. Đây là nghiên cứu UX và đề xuất; chưa thay đổi giao diện, chưa có dữ liệu hành vi hoặc phỏng vấn khách HolisticVN.

## Đề xuất chính

Nên cải thiện. Khối hiện tại dễ đọc và hợp màu/font của website, nhưng chủ yếu nói ba lợi ích. Giá trị sản phẩm cần làm rõ là **tư vấn → trị liệu → tập luyện trong một chương trình**. Đề xuất ưu tiên: một tiêu đề rõ nghĩa, hoạt động cụ thể ở từng bước, bố cục thể hiện sự kết nối, và giảm nội dung lặp phía dưới.

## Những gì quan sát được

- Khối hiện có nhãn “Xuyên suốt” 11px, không có `h2`; ba tên bước dùng `strong`, không có heading hoặc danh sách tuần tự. Xem `app/page.tsx:440`.
- Ba thẻ lần lượt là “Hiểu rõ cơ thể”, “Giảm đau mỏi”, “Tăng cường lâu dài”. Chúng nêu lợi ích, còn tên giai đoạn Tư vấn / Trị liệu / Tập luyện chỉ hiện rõ ở hero.
- Ba thẻ có nền độc lập, gap 28px, không có dấu nối. Đây là quan sát thị giác; nhận định rằng khách có thể hiểu thành ba dịch vụ rời là giả thuyết thiết kế.
- CSS `.stepNumeral` khai báo 36px, nhưng `.stepCard span` có specificity cao hơn và ghi đè kích thước xuống 15px, line-height 1.7 và màu muted. Xem `app/page.module.css:774` và `:782`.
- Trên mobile 390px, khối cao 812px, gồm padding đầu khối; document không tràn ngang ở viewport này. Ba thẻ giữ padding 34px × 32px. Nhận định rằng có thể trình bày gọn hơn là đề xuất, không phải kết quả đo hành vi.
- Sau bảng so sánh là khối “Ba bước, một chương trình duy nhất”, tiếp tục giải thích cùng lộ trình. Hero và đoạn giới thiệu cũng đã nhắc thông điệp này.
- “Duy trì qua nhiều năm” đang được viết như một kết quả. `PRODUCT.md` và inventory chưa có bằng chứng để bảo đảm kết quả dài hạn cho mỗi khách.

Ảnh hiện trạng, có cookie banner và nút liên hệ nổi của trang:

![Xuyên suốt trên desktop](../.context/xuyen-suot-desktop.png)

![Xuyên suốt trên mobile](../.context/xuyen-suot-mobile.png)

## Cơ sở nghiên cứu

| Nguồn gốc                                                                                                           | Điều nguồn hỗ trợ                                                                                          | Áp dụng đề xuất                                                                                         |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [NNGroup — Homepage Design: 5 Fundamental Principles](https://www.nngroup.com/articles/homepage-design-principles/) | Homepage cần nói rõ giá trị khác biệt, có ví dụ cụ thể và hướng hành động dễ hiểu.                         | Giải thích chương trình của Holistic bằng những gì khách sẽ trải qua.                                   |
| [NNGroup — Layer-Cake Pattern](https://www.nngroup.com/articles/layer-cake-pattern-scanning/)                       | Nghiên cứu eye tracking ghi nhận vai trò của tiêu đề nổi bật, mô tả đúng nội dung khi người dùng đọc lướt. | Tên bước cần nói rõ Tư vấn / Trị liệu / Tập luyện; headline cần đủ nổi bật để nhận ra thông điệp.       |
| [W3C WAI — Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)                                     | Heading truyền đạt cấu trúc và hỗ trợ điều hướng bằng công nghệ trợ giúp.                                  | Dùng `h2` cho phần, `h3` cho tên giai đoạn.                                                             |
| [W3C WAI — Content Structure](https://www.w3.org/WAI/tutorials/page-structure/content/)                             | Danh sách có thứ tự phù hợp với thông tin tuần tự.                                                         | Dùng `ol/li` nếu ba giai đoạn đúng là thứ tự chương trình muốn giới thiệu; dấu nối chỉ bổ trợ thị giác. |
| [GOV.UK — Step by step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation/)          | Cần giới thiệu mục đích và thứ tự hành trình; pattern tương tác này không dành cho nội dung chỉ để đọc.    | Học nguyên tắc giải thích quá trình; để cả ba bước hiển thị ngay trên Homepage.                         |

Ba benchmark từ chính đơn vị cung cấp dịch vụ:

- [Athletico — What to Expect](https://www.athletico.com/patients/what-to-expect/) giải thích buổi đầu, kế hoạch, theo dõi/điều chỉnh và hướng dẫn khi kết thúc. Bài học là mô tả hoạt động và mối liên hệ giữa các giai đoạn.
- [HSS — Rehabilitation and Performance](https://www.hss.edu/departments/rehabilitation) nối mục tiêu trở lại hoạt động với các dịch vụ đánh giá, trị liệu và tập luyện. Bài học là đi từ mục tiêu tới việc làm cụ thể.
- [PT Solutions — Return to Play](https://ptsolutions.com/therapies/sports-physical-therapy/return-to-play/) giải thích cầu nối rehab–performance. Bài học cho bước 3 là làm rõ tập luyện nhằm mục tiêu gì; Homepage Holistic cần giữ cả mục tiêu sinh hoạt lẫn thể thao.

Các benchmark chỉ cho biết cách những đơn vị đó trình bày dịch vụ của họ. Chúng không chứng minh hiệu quả bố cục hoặc xác nhận Holistic có cùng quy trình. Đường nối, gộp section và vị trí CTA dưới đây là suy luận từ nguồn và hiện trạng.

## Thứ tự cải thiện

### 1. Nâng thông điệp thành tiêu đề rõ nghĩa

Đề xuất `h2`: **“Từ tư vấn đến tập luyện, một lộ trình xuyên suốt.”** Có thể nâng nhãn hiện tại thành tiêu đề, vẫn giữ đường hairline của thiết kế. Cách này giữ từ thương hiệu “Xuyên suốt” và giải thích ngay điều nó có nghĩa.

Dòng mô tả: “Tư vấn, trị liệu và tập luyện tại Holistic, trong một chương trình phù hợp với tình trạng và mục tiêu của bạn.” Cơ sở là mô hình đã xác nhận trong `PRODUCT.md` và `docs/CONTENT_INVENTORY.md`.

### 2. Nói rõ hoạt động của từng giai đoạn

Bản nháp nội dung để review:

| Bước | Tiêu đề                       | Nội dung                                                                                   |
| ---- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| 01   | Tư vấn — Hiểu rõ cơ thể       | Trao đổi về tình trạng và mục tiêu vận động để xác định hướng trị liệu, tập luyện phù hợp. |
| 02   | Trị liệu — Hỗ trợ vận động    | Trị liệu bằng tay và các phương pháp phù hợp với tình trạng của bạn.                       |
| 03   | Tập luyện — Hướng đến lâu dài | Tập luyện phù hợp với mục tiêu vận động hằng ngày hoặc trở lại thể thao.                   |

Đây là bản nháp dựa trên mô hình đã có nguồn, không bổ sung số buổi, thời gian hồi phục hoặc quy trình theo dõi chưa được xác nhận. Tên giai đoạn nên nổi bật; lợi ích có thể là dòng giải thích phụ để tiêu đề ngắn hơn.

### 3. Thể hiện ba bước thuộc cùng một lộ trình

Desktop: một dải ba cột, mốc số nối bằng đường mảnh. Mobile: các mốc nối dọc bên trái, nội dung bên phải; giảm padding và khoảng cách của ba khối. Dùng đúng cream, clay, sage và hệ Roboto đang có. Sửa CSS numeral để số thể hiện đúng thứ bậc dự kiến.

Các số là sơ đồ giới thiệu chương trình, không đại diện ba buổi bắt buộc hoặc tiến trình đã hoàn tất của người dùng. Nội dung và thứ tự DOM phải tự giải thích được, kể cả khi không nhìn thấy dấu nối.

### 4. Gộp phần kể lại lộ trình phía dưới

Phương án ưu tiên cho vòng thiết kế tiếp theo: đưa ý riêng của “Ba bước, một chương trình duy nhất” vào phần Xuyên suốt, rồi rút gọn phần `.pathTop`. Hero giữ nhiệm vụ giới thiệu nhanh; phần Xuyên suốt giải thích chương trình; “Giá trị cốt lõi” giữ nhiệm vụ nói triết lý. Việc gộp cần review cả nhịp trang và vị trí ảnh, vì ảnh hưởng ngoài riêng ba thẻ.

### 5. Viết kết quả dài hạn thành mục tiêu và cân nhắc bước bắt đầu

Thay “duy trì qua nhiều năm” bằng mô tả tập luyện hoặc mục tiêu duy trì vận động. Inventory xác nhận lộ trình dịch vụ, chưa xác nhận kết quả dài hạn của từng khách.

CTA riêng là tùy chọn sau khi gộp: một nút **“Đặt lịch tư vấn”** tới `/booking` có thể giúp người đọc bắt đầu. Hiện đã có nút đặt lịch ở nav và CTA ở phần liền trước, nên cần review tổng thể để tránh tăng mật độ nút. Booking là gửi yêu cầu để nhân viên liên hệ xác nhận; copy đi kèm phải phù hợp luồng đó.

## Đánh giá thiết kế độc lập

Assessment A nhận thấy ưu điểm: nội dung ngắn, nhịp đọc bình tĩnh, đúng bản sắc editorial. Hạn chế: lời hứa còn chung, thứ bậc yếu, quan hệ giữa các bước chưa rõ. Với cả ba nhóm khách hàng, phần này nên giúp trả lời “Tôi sẽ trải qua gì?” và “Tập luyện nối tiếp trị liệu như thế nào?”.

| Nielsen heuristic                   | Điểm cho riêng phần tĩnh | Nhận xét                                                                    |
| ----------------------------------- | ------------------------ | --------------------------------------------------------------------------- |
| Visibility of system status         | n/a                      | Không có trạng thái xử lý.                                                  |
| Match between system and real world | 2/4                      | Gọi lợi ích thay vì giai đoạn thực tế.                                      |
| User control and freedom            | n/a                      | Không có tương tác trong phần.                                              |
| Consistency and standards           | 2/4                      | Tên giai đoạn khác hero; numeral bị ghi đè.                                 |
| Error prevention                    | n/a                      | Không có nhập liệu hoặc thao tác.                                           |
| Recognition rather than recall      | 2/4                      | Chưa gọi trực tiếp tư vấn, trị liệu, tập luyện.                             |
| Flexibility and efficiency          | n/a                      | Phần nội dung giới thiệu tĩnh.                                              |
| Aesthetic and minimalist design     | 3/4                      | Gọn, đúng thương hiệu; có lặp với phần sau.                                 |
| Error recovery                      | n/a                      | Không có lỗi tương tác.                                                     |
| Help and documentation              | n/a                      | Không phải luồng tác vụ cần trợ giúp.                                       |
| Tổng                                | 9/16                     | Đánh giá chủ quan của reviewer, không phải điểm conversion hoặc audit WCAG. |

Cognitive load: chỉ ba mục, không có điểm quyết định vượt bốn lựa chọn. Vấn đề là quan hệ giữa các ý và khả năng nhận ra chương trình. Emotion: tạo cảm giác bình tĩnh; giải thích trải nghiệm cụ thể có thể tăng sự an tâm. Persona: người làm văn phòng cần biết bắt đầu thế nào; người chơi thể thao và vận động viên cần thấy bước tập luyện gắn với mục tiêu trở lại hoạt động.

## Phạm vi chứng cứ và cách đánh giá tiếp

- Chứng cứ hiện có là source code, ảnh preview và tài liệu gốc. Không có user test hoặc dữ liệu conversion để khẳng định mức tăng hiệu quả.
- Không thêm tuyên bố cùng chuyên viên, cùng hồ sơ, đánh giá lại định kỳ, theo dõi giữa buổi, số buổi hoặc kết quả cụ thể nếu clinic chưa xác nhận.
- Vòng thiết kế tiếp theo có thể hỏi người thuộc cả ba nhóm sau khi đọc: họ kể được ba giai đoạn không; hiểu một chương trình hay ba dịch vụ rời; biết bắt đầu ở đâu. Đây là đề xuất đánh giá, chưa được thực hiện.
- Chưa chạy lint, typecheck, unit test hoặc build vì deliverable là research; không thay đổi code giao diện.

## Run notes

- Target: `homepage-xuyen-suot`; không có ignore list bổ sung.
- Assessment A và B chạy độc lập; A hoàn thành trước khi tổng hợp kết quả detector. Research nguồn chạy riêng.
- Detector chạy một lần cho `app/page.tsx`, exit 0, trả `[]`, không có finding. Detector sạch không thay thế quan sát về semantics hoặc CSS.
- Ảnh và ghi chú chi tiết nằm trong `.context/`, là dữ liệu làm việc gitignored. Nguồn chi tiết: `.context/xuyen-suot-sources.md`; detector: `.context/xuyen-suot-detector.json`.
- Assessment B dùng tab mới tại `http://localhost:3111`: xác nhận phần có 0 heading, 0 list, 0 link/button; cả ba số có computed font-size 15px, line-height 25.5px và màu `rgb(92,75,68)`. Desktop 1440px: ba thẻ khoảng 434.7 × 200.5px. Mobile 390px: ba thẻ rộng 350px, cao 200.5 / 200.5 / 226px, khối cao 812px, không có overflow ngang. Không có CTA trong phần không tự nó là lỗi accessibility.
- Chrome extension không có sẵn; fallback là tab mới trong Playwright browser đang hoạt động. Không có công cụ trình bày browser visibility. Mutation preflight thành công, nhưng script overlay `detect.js` bị CSP chặn, nên không có overlay hiển thị hoặc console findings từ overlay. Không sửa CSP để phục vụ research.
- Temporary live server ở port 8400 đã dừng; process đã được xác nhận không còn. Script preflight/injection đã được gỡ khỏi tab và title đã được khôi phục. Chứng cứ dùng trong báo cáo là DOM, computed CSS và ảnh preview, không phải overlay.
