# Nghiên cứu và đề xuất CTA theo vấn đề trên homepage

Ngày: 2026-10-09. Phạm vi: band “Bạn đang gặp một vấn đề cụ thể?”, sau carousel dịch vụ và trước phần lộ trình xuyên suốt. Tài liệu này trình bày phương án để owner chọn trước khi thay đổi UI.

## Hướng mới nhất từ owner — bố cục và pattern, bỏ dòng ví dụ

Motion theo yêu cầu tiếp theo: pattern được vẽ dần như các đường cọ khi cuộn tới CTA, không phải parallax. Owner báo không thấy hiệu ứng trên Firefox. Bản CSS view timeline trước đó có hỗ trợ trình duyệt hạn chế và hoàn tất ngay lúc CTA vừa vào màn hình. Preview đã đổi sang `IntersectionObserver`: khi ít nhất một nửa CTA hiện rõ, ba nét cọ được vẽ lần lượt, tổng khoảng 2.45 giây. Có nút “Xem lại hiệu ứng vẽ” bên ngoài CTA dành riêng cho demo. `prefers-reduced-motion` hiển thị pattern tĩnh. Nguồn kỹ thuật: [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline), [W3C animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). Link preview cập nhật: `http://127.0.0.1:8411/?v=paint2`; bản demo có khoảng trống trước/sau để cuộn. Owner đã duyệt bản preview; cùng cơ chế motion đã được áp dụng vào homepage. Kiểm tra browser Chromium: nét cọ tiến từ dash offset 1 tới 0, nút phát lại hoạt động và reduced motion tắt animation. Đã thử kiểm tra Firefox bằng Playwright nhưng browser không khởi động được trong môi trường Mac này (sandbox extension/RenderCompositorSWGL, launch timeout); không có kết quả kiểm tra tự động trên Firefox. Owner đã xem và xác nhận bản preview ổn sau khi đổi cơ chế motion. Nguồn [MDN compatibility data](https://github.com/mdn/browser-compat-data/blob/main/css/properties/animation-timeline.json) ghi scroll timeline trên Firefox ở mức preview, phù hợp với báo cáo nền tĩnh của owner.

Bản xem trước riêng tại `.context/cta-pattern-preview/index.html`, dùng font hiện có của Holistic, giữ tiêu đề và link `/treatments`, bỏ toàn bộ dòng liệt kê vấn đề theo yêu cầu mới nhất. Hình minh họa: `.context/concern-pattern-no-subtext-1440.png` và `.context/concern-pattern-no-subtext-390.png`. Mockup dùng SVG nét cong lớn tự dựng theo hướng của reference, không dùng ảnh pattern của Hawthorne. Desktop có mũi tên nét vẽ ở giữa; tablet/mobile ẩn mũi tên. Preview ở 320, 390, 768 và 1440 px không tràn ngang. Owner đã duyệt bản này và thiết kế đã được đưa vào homepage.

Owner đã xác nhận hài lòng với nội dung hiện tại; yêu cầu tập trung vào bố cục desktop/mobile và background pattern, tham khảo [Hawthorne Skin & Beauty](https://www.hawthorneskinandbeauty.com.au/). Vì vậy, **giữ câu hỏi, nhãn “Xem các phương pháp” và đích `/treatments`; bỏ cả dòng “Đau vai gáy · Đau lưng dưới · Lệch chậu” theo yêu cầu tiếp theo**. Các đề xuất A/B/C phía dưới được lưu như nghiên cứu trước quyết định này; đề xuất thêm câu, thay ví dụ hay đổi luồng CTA không còn là hướng triển khai hiện hành.

### Triển khai đã duyệt

Homepage dùng `components/concern-pattern.tsx` cho pattern và trigger khi cuộn; nội dung CTA vẫn được render từ server trong `app/page.tsx`. Bố cục và animation ở `app/page.module.css`. Hiệu ứng chạy một lần mỗi lần mount; trang thật không có nút phát lại của demo. Khi giảm chuyển động hoặc JavaScript không khả dụng, pattern hoàn chỉnh vẫn hiện.

Kiểm tra Chromium trên trang thật: animation đi từ trạng thái chờ đến vẽ rồi hoàn tất; reduced motion hiển thị tĩnh; nút nhận focus bàn phím và dẫn đúng tới `/treatments`. Không tràn ngang ở 320, 390, 768 và 1440 px. Lint, typecheck, 59 test và production build đều đạt. Ảnh triển khai: `.context/concern-implemented-1440.png`, `.context/concern-implemented-390.png`.

### Reference Hawthorne: điều đã xác nhận từ HTML/CSS

Band “Looking to address a specific concern?” của reference cũng nằm ngay sau carousel phương pháp. Panel xanh `#10584b`, bo góc 18 px, heading bên trái, một mũi tên trang trí ở giữa và một CTA nền trắng bên phải. CSS hiện tại dùng khoảng đệm dọc 120 px desktop; ở ≤768 px chuyển nội dung thành một cột căn giữa, khoảng đệm dọc 64 px, ẩn mũi tên và cho nút rộng toàn hàng. Đây là các giá trị của reference, không phải yêu cầu kích thước cho Holistic. Nguồn: HTML và inline CSS section `concern_banner_YBTP6H` từ [homepage Hawthorne](https://www.hawthorneskinandbeauty.com.au/), bản chụp mã tại `.context/hawthorne-reference.html`.

Pattern thực tế là **những vệt cọ cong rộng, mềm, tông xám trên nền sáng**, không phải họa tiết logo lặp lại. Ảnh phủ toàn panel bằng vị trí absolute, `object-fit: cover`, `mix-blend-mode: multiply`; nội dung được đặt ở lớp phía trên. Nhịp cong lớn và crop tạo bề mặt có chuyển động nhưng không chia thành ô nhỏ. Nguồn hình đã xem: [asset pattern chính xác](https://www.hawthorneskinandbeauty.com.au/cdn/shop/files/bg_image_1024x1024.png?v=1761219809), bản tham khảo tại `.context/hawthorne-concern-pattern.png`.

Reference tiếp tục dùng ảnh nền decorative phủ card ở “Gift Cards & Vouchers”, “Offers & Packages” và footer, cho thấy motif xuyên suốt nhiều panel. Asset tham khảo: [gift card](https://www.hawthorneskinandbeauty.com.au/cdn/shop/files/bg_900x.png?v=1761138047), [offer](https://www.hawthorneskinandbeauty.com.au/cdn/shop/files/w_900x.webp?v=1761138044), [footer](https://www.hawthorneskinandbeauty.com.au/cdn/shop/files/bg_9fb60210-e711-4532-a4b7-f95575c5ef06_1024x1024.png?v=1761188443). Các URL này ghi nguồn nghiên cứu; không đưa ảnh của reference vào sản phẩm Holistic.

### Đề xuất để dựng mẫu review

- **Desktop:** giữ band sage; gom headline và dòng ba vấn đề thành một khối bên trái, CTA ở bên phải. Có thể tăng chiều cao vừa phải để pattern được nhìn thấy; không cần lấy nguyên padding 120 px của reference. Giữ khoảng trống quanh nút và giới hạn độ rộng khối chữ để câu hỏi có điểm ngắt đẹp.
- **Mobile:** headline → ba vấn đề → CTA trong một cột; căn giữa như reference hoặc căn trái nếu phù hợp phần còn lại của homepage. Cho các vấn đề wrap tự nhiên ở 320 px thay vì clip; nút có vùng chạm thoải mái và không bị ép bởi dòng ví dụ. Không thêm câu mô tả hoặc thao tác mới.
- **Pattern:** dùng một hoặc hai hình cong lớn từ **biểu tượng Holistic đã có**, crop ở góc phải/dưới, phối sáng/tối nhẹ trên sage. Các nửa hình tròn đối nhau trong [symbol](../public/assets/logo/symbol-on-dark.svg) là nguồn hình của chính thương hiệu; có thể lấy cấu trúc đường cong từ đó thay vì dựng brush giống Hawthorne hoặc sao chép logo của họ. Ưu tiên watermark lớn thay vì lát nhiều logo nhỏ.
- Độ mờ thử nghiệm khoảng 8–12% là điểm bắt đầu của mẫu, không phải thông số đã kiểm chứng. Giảm hoặc dịch pattern ra khỏi vùng chữ nếu làm khó đọc. Giữ text và CTA đủ tương phản ở vùng nền sáng nhất/tối nhất; pattern chỉ trang trí, không nhận focus hoặc pointer. Với SVG trang trí, dùng `aria-hidden` hoặc ảnh alt rỗng.

Tài liệu này chỉ cập nhật nghiên cứu và nguồn. UI hiện tại chưa được thay đổi theo reference; chưa có mẫu được owner duyệt hoặc dữ liệu chuyển đổi cho pattern/bố cục.

---

**Nghiên cứu trước quyết định mới nhất:** A — hoàn thiện band khám phá hiện tại. Đề xuất khi đó là thêm câu nối giữa câu hỏi và nội dung trang phương pháp, chỉnh dòng ví dụ để dễ đọc và xuống dòng, giữ CTA “Xem các phương pháp” tới `/treatments`. Các thay đổi nội dung này đã được thay thế bởi chỉ dẫn giữ nội dung ở phần trên.

## 1. Điều đã quan sát

- Band có câu hỏi về vấn đề cụ thể, ba ví dụ “Đau vai gáy · Đau lưng dưới · Lệch chậu” và link `/treatments`. Trang đích trình bày các phương pháp; đây là đường tìm hiểu, không phải trang riêng cho từng tình trạng. Nguồn: [homepage](../app/page.tsx), [trang phương pháp](../app/treatments/page.tsx).
- Homepage đã có tư vấn/booking trong hero và navigation. Việc đổi band này thành đặt lịch thêm một lần là thay đổi vai trò của section; vị trí hiện tại vẫn có thể phục vụ người muốn hiểu thêm trước khi liên hệ. Nhận định về vai trò là suy luận thiết kế từ [homepage](../app/page.tsx) và [navigation](../components/holistic-nav.tsx).
- Owner muốn ba nhóm khách hàng được coi trọng ngang nhau: người làm văn phòng, người chơi thể thao và vận động viên chuyên nghiệp. Dòng ví dụ hiện tại chỉ thể hiện các vấn đề đau/tư thế; có thể mở rộng ví dụ để phản ánh phục hồi và tập luyện. Nguồn: [PRODUCT.md](../PRODUCT.md).
- CSS của dòng ví dụ dùng chữ hoa 12 px, màu trắng opacity 0.6, tracking 0.14em và `white-space: nowrap`. Quan sát browser của agent chính: tại viewport 320 px, band rộng 288 px nhưng dòng ví dụ rộng khoảng 346 px, từ x ≈ -13 đến x ≈ 333; nội dung bị cắt. Document vẫn rộng 320 px vì root clip che phần tràn; điều này không chứng minh nội dung hiển thị đầy đủ. Nguồn: [CSS](../app/page.module.css), [ảnh 320 px](../.context/concern-research-current-320.png).
- Tính từ màu CSS hiện tại: `rgba(247,243,240,0.6)` trên sage `#48614c` có tương phản khoảng 3.36:1, thấp hơn ngưỡng 4.5:1 cho chữ 12 px thường; dùng màu offwhite đặc có tỷ lệ khoảng 6.16:1. Đây là phép tính màu do agent chính cung cấp, không suy ra từ pixel ảnh. [Ngưỡng W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- Các kích thước band quan sát: 1360 × 186 ở desktop 1440 px; 720 × 277 ở 768 px; 358 × 256 ở 390 px; 288 × 256 ở 320 px. Đây là số đo của phiên bản hiện tại, không phải kích thước tối ưu. Nguồn: `.context/concern-research-current-{1440,768,390,320}.png`.

## 2. Nguồn UX và benchmark

| Nguồn gốc                                                                                         | Nội dung nguồn hỗ trợ                                                                                          | Hàm ý cho band                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [NNGroup — Information Scent](https://www.nngroup.com/articles/information-scent/)                | Người đọc dự đoán ích lợi của link từ nhãn, mô tả đi kèm và ngữ cảnh. Nhãn nên mô tả đúng nội dung trang đích. | Bổ sung câu cho biết trang phương pháp giúp tìm hiểu cách Holistic phối hợp trị liệu theo tình trạng; không hứa câu trả lời riêng cho từng triệu chứng nếu đích chưa có nội dung đó. |
| [NNGroup — Recognition and Recall](https://www.nngroup.com/articles/recognition-and-recall/)      | Lựa chọn hiển thị và ngữ cảnh có thể giúp người dùng nhận biết thay vì tự nhớ lại.                             | Có thể dùng mục tiêu quen thuộc để định hướng. Đây là cơ sở cho B, chưa chứng minh ba thẻ mục tiêu hiệu quả hơn band hiện tại.                                                       |
| [GOV.UK — Button](https://design-system.service.gov.uk/components/button/)                        | Nhiều CTA chính cùng mức nhấn làm khó chọn bước tiếp theo; nút/CTA nên mô tả hành động thực hiện.              | A dùng một CTA khám phá; C dùng một CTA liên hệ/booking. Nguồn không yêu cầu mọi band marketing phải chuyển sang booking.                                                            |
| [W3C — Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                           | Nội dung cần hiển thị đầy đủ tại bề ngang tương đương 320 CSS px, trừ trường hợp cần bố cục hai chiều.         | Cho dòng ví dụ xuống dòng; không giải quyết bằng cách clip phần tràn.                                                                                                                |
| [W3C — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)       | Chữ thường cần tương phản ít nhất 4.5:1, chữ lớn ít nhất 3:1.                                                  | Tăng tương phản của dòng ví dụ; kiểm tra riêng câu mô tả và nhãn CTA trên sage.                                                                                                      |
| [W3C — Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Mục tiêu thao tác cần đạt 24 × 24 CSS px hoặc đáp ứng ngoại lệ.                                                | Có thể chọn CTA cao 48 px cho mobile; 48 px là đề xuất thiết kế, không phải ngưỡng AA của tiêu chí này.                                                                              |

**ATI Physical Therapy:** homepage có “Where Does it Hurt?” với link Knee/Back/Shoulder/Pelvic tới các trang riêng, cùng CTA “Schedule Care Now”. Quan sát này cho thấy khám phá theo vấn đề và đặt lịch có thể cùng tồn tại. Điểm khác với Holistic: ATI có trang tình trạng thực sự, Holistic hiện có trang dịch vụ/phương pháp. Không sao chép cấu trúc triệu chứng khi chưa có nội dung đích tương ứng. [Nguồn ATI](https://www.atipt.com/).

**Pure Physio:** homepage có “Book online” và các đường khám phá “Our services”, “Treatment options”, “Our approach”; nội dung nói đến phục hồi chấn thương và nâng cao khả năng vận động. Đây là một ví dụ cho phép tìm hiểu song song với booking, không chứng minh cấu trúc đó làm tăng chuyển đổi. Chỉ tham khảo cách tổ chức, không nhập các tuyên bố về tốc độ/kết quả/chứng chỉ của họ vào Holistic. [Nguồn Pure Physio](https://www.purephysio.com.au/).

## 3. Ba phương án có thể chọn

### A. Hoàn thiện band khám phá hiện tại — đề xuất ưu tiên

**Copy nháp**

> **Bạn đang gặp một vấn đề cụ thể?**  
> Tìm hiểu cách Holistic kết hợp các phương pháp theo tình trạng và mục tiêu vận động của bạn.  
> Đau vai gáy, đau lưng · Phục hồi sau chấn thương · Tập luyện & thi đấu  
> **Xem các phương pháp →**

**Đích:** `/treatments`, giữ nguyên ý nghĩa của CTA hiện tại. Không diễn đạt “Tìm phương pháp phù hợp với bạn” theo cách ngụ ý website đã cá nhân hóa lựa chọn.

**Bố cục:** desktop đặt heading + câu mô tả + ví dụ ở bên trái, CTA ở bên phải; mobile theo thứ tự đó, một cột. Giữ band sage gọn và bo góc hiện tại. Đưa ví dụ xuống dưới copy, dùng chữ thường khoảng 14 px, tương phản rõ và wrap tự nhiên. Không thêm ảnh/selector/form.

**Lợi ích:** làm rõ quan hệ giữa câu hỏi và trang đích; ít thay đổi nhịp homepage; đáp ứng cả ba nhóm qua ví dụ mà không tạo ba luồng giả.

**Đánh đổi:** khách vẫn phải đọc trang phương pháp rồi chọn bước tiếp theo. Band chưa trả lời riêng cho từng vấn đề. Có phần giao thoa với carousel, nhưng chuyển từ cách gọi dịch vụ sang tình trạng/mục tiêu của khách.

### B. Điều hướng theo vấn đề/mục tiêu

**Copy nháp**

> **Bạn muốn cải thiện điều gì?**  
> Khám phá các hướng hỗ trợ tại Holistic theo nhu cầu vận động của bạn.

Ba hàng hoặc ba thẻ liên kết, với tên đích rõ ngay trên CTA:

| Mục tiêu gợi ý                   | Nội dung phụ/CTA nháp                       | Đích hiện có             |
| -------------------------------- | ------------------------------------------- | ------------------------ |
| Đau mỏi trong sinh hoạt          | “Tìm hiểu các phương pháp Holistic kết hợp” | `/treatments`            |
| Trở lại vận động sau chấn thương | “Tập luyện phục hồi & tăng cường →”         | `/services#svc-training` |
| Tập luyện và thi đấu             | “Tập luyện phục hồi & tăng cường →”         | `/services#svc-training` |

Nguồn mapping: [service anchors](../lib/content.ts), [nội dung dịch vụ](../app/services/page.tsx). Hai mục tiêu thể thao cùng dẫn tới section rộng đang có. Không giả định có trang riêng cho thể thao phong trào/chuyên nghiệp hoặc ghi nhận lựa chọn đó vào form.

**Bố cục:** desktop ba thẻ cùng mức nhấn; mobile ba hàng xếp dọc, mỗi hàng có mục tiêu + mô tả đích + mũi tên. Liên kết mở nội dung tìm hiểu, không phải chọn câu trả lời rồi nhận phác đồ. Có thể dùng hai nhóm rộng thay vì ba nếu muốn tránh hai link cùng đích; khi đó vẫn nêu thể thao/tập luyện/thi đấu trong nội dung.

**Lợi ích:** đặt ngôn ngữ nhu cầu của khách trước tên kỹ thuật; cho phép đi thẳng tới nội dung tập luyện thực sự có sẵn.

**Đánh đổi:** section cao hơn, có thể lặp cấu trúc khám phá của carousel; hai mục cùng đích làm giảm tính phân biệt. Nếu muốn các mục “Đau vai gáy / Đau lưng / Lệch chậu” có trang riêng như ATI thì cần tạo nội dung có nguồn trước. Không ánh xạ một triệu chứng thẳng tới một kỹ thuật như chỉ định trị liệu.

### C. Ưu tiên trao đổi/tư vấn

**Copy nháp**

> **Bạn chưa biết nên bắt đầu từ đâu?**  
> Chia sẻ tình trạng và mục tiêu vận động của bạn với Holistic.  
> **Để Holistic gọi lại →**  
> Nhân viên sẽ trao đổi, kiểm tra lịch và xác nhận với bạn.

**Đích đề xuất khi chọn hướng này:** `/booking`. Trang đích hiện có “Để Holistic gọi lại cho bạn”, form tên/số điện thoại và giải thích gửi yêu cầu chưa tạo lịch hẹn. Dùng nhãn gọi lại giúp phản ánh đúng bước thực hiện. [Nguồn booking](../app/booking/page.tsx), [PRODUCT.md](../PRODUCT.md).

Nếu owner ưu tiên trao đổi trực tiếp, có thể dùng “Nhắn Zalo” khi `site.zaloId` đã cấu hình hoặc “Gọi Holistic” với điện thoại đã xác nhận. Cần quyết định một kênh chính; Zalo chưa phải đích luôn khả dụng trong fallback. [Nguồn cấu hình](../lib/content.ts), [nguồn Sanity](../lib/sanity.ts).

**Bố cục:** một câu hỏi + một câu mô tả + một CTA + ghi chú quy trình; mobile xếp dọc. Giữ band nhỏ, không nhúng form hoặc nhiều nút cùng mức nhấn.

**Lợi ích:** khách chưa biết tên dịch vụ có đường trao đổi rõ; phù hợp nếu owner muốn band này dành riêng cho người đang phân vân.

**Đánh đổi:** thay vai trò từ khám phá sang thu yêu cầu/liên hệ; thêm một lời mời tư vấn bên cạnh các CTA đã có. Chưa có dữ liệu về mức sẵn sàng để lại điện thoại ở vị trí này, khả năng xử lý của nhân viên hoặc kênh khách ưu tiên.

## 4. Cách chọn và giới hạn

| Nếu mục tiêu của band là…                                                            | Hướng phù hợp |
| ------------------------------------------------------------------------------------ | ------------- |
| Làm câu hỏi hiện tại rõ ràng hơn, giữ nhịp trang và đường tìm hiểu                   | A             |
| Cho khách chọn nội dung theo mục tiêu, chấp nhận section lớn hơn và rà nội dung đích | B             |
| Dành một điểm liên hệ cho khách chưa biết bắt đầu từ đâu                             | C             |

Ưu tiên **A** với nguồn lực và nội dung hiện có. Việc chọn B/C nên xuất phát từ vai trò owner muốn section đảm nhiệm, không từ giả định mọi CTA cần dẫn thẳng tới booking. Cả ba là giả thuyết thiết kế; benchmark không cung cấp số liệu chuyển đổi của Holistic.

Trước khi triển khai, owner cần chọn hướng và duyệt copy. Nghiên cứu chưa xác định người đọc có nhận ra dòng ví dụ, hiểu “phương pháp” theo cách nào hoặc có thích gọi lại hơn tự tìm hiểu; có thể xem mẫu trong ngữ cảnh homepage và hỏi khách thực trước khi quyết định thay cấu trúc.

Không thêm lời hứa miễn phí, nhanh, kết quả y tế hay năng lực nhân viên chưa được xác nhận. Ràng buộc nguồn: [PRODUCT.md](../PRODUCT.md), [Frontend checklist](./FRONTEND_CHECKLIST.md). Tài liệu này không thay đổi app và không chạy test.
