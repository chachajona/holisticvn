# Deep dive: “Holistic khác với những giải pháp khác ra sao?”

> Cập nhật theo owner: giữ bảng so sánh, tập trung làm desktop/mobile đồng nhất. Hướng mới và mẫu bố cục ở [homepage-comparison-responsive-research.md](homepage-comparison-responsive-research.md); đề xuất thay bảng thành ba ý bên dưới là phương án cũ.

Method: dual-agent (A: `/root/comparison_content` · B: `/root/comparison_evidence`).

Ngày 2026-10-09. Phạm vi: section so sánh trong bản homepage hiện tại, `app/page.tsx:170` và `:513`. Hai assessment độc lập: A đọc thiết kế/nội dung và tài liệu sản phẩm; B chạy detector và đọc implementation. Parent xem preview `http://localhost:3111` tại 1440 × 1000 và 390 × 844, rồi đối chiếu nguồn bên ngoài. Chỉ nghiên cứu; không sửa giao diện hoặc chạy test.

## Kết luận

Nên viết lại nội dung trước khi chỉnh hình thức. Bảng hiện làm nổi bật số dịch vụ Holistic có, nhưng chưa diễn đạt giá trị đã xác nhận: **tư vấn → trị liệu → tập luyện trong một lộ trình tại một nơi, phù hợp với tình trạng và mục tiêu vận động của khách**. Đây là định vị có cơ sở trong `PRODUCT.md` và `docs/CONTENT_INVENTORY.md`, chưa phải bằng chứng rằng chỉ Holistic cung cấp mô hình này.

Hình thức hợp hệ thiết kế hiện tại: sage, cream, đường kẻ nhẹ, bố cục dễ quét. Cấu trúc vẫn là một bảng tính năng phổ biến; cơ hội riêng của Holistic là cho khách thấy cách trị liệu nối với tập luyện và mục tiêu sinh hoạt/thể thao.

## Điểm đang làm tốt

- Tiêu đề đặt đúng câu hỏi của người đang lựa chọn nơi trị liệu.
- Desktop dễ đọc theo hàng; cột Holistic được nhấn bằng màu và nền nhẹ.
- Native table có `scope="col"`, `scope="row"` và chữ “Có/Không” cho screen reader. Section tĩnh, không có JavaScript hoặc ảnh bổ sung.

## Năm vấn đề ưu tiên

### P1 — Các dấu “Không” cho cả nhóm cơ sở chưa được chứng minh

Bảng gộp “Bệnh viện / phòng khám” thành một cột, rồi đánh dấu không có trị liệu đa phương pháp hoặc tập luyện tăng cường. Tài liệu nội bộ không có khảo sát cho các kết luận này. “PT thông thường” cũng chưa định nghĩa phạm vi so sánh.

Có phản ví dụ công khai: [Vinmec mô tả gói kết hợp vật lý trị liệu và bài tập phục hồi chức năng](https://www.vinmec.com/vie/chuyen-khoa-chan-thuong-chinh-hinh-y-hoc-the-thao/). [Motion Lab của Vinmec](https://www.vinmec.com/vie/bai-viet/phong-thi-nghiem-phan-tich-van-dong-motion-lab-vi) mô tả đánh giá vận động, liệu trình tập cá thể hóa và ứng dụng cho mục tiêu thể thao. Các nguồn này đủ để bác bỏ cách phủ nhận tuyệt đối cả nhóm; không chứng minh mọi bệnh viện có cùng dịch vụ hoặc chất lượng.

Đề xuất: bỏ các kết luận nhị phân về nhóm cơ sở. Nếu muốn so sánh thật, phải xác định dịch vụ/cơ sở cụ thể, tiêu chí, nguồn và thời điểm.

### P1 — Tiêu chí chưa thể hiện điểm khác biệt cốt lõi

Sáu hàng hiện tại: tư vấn, đa phương pháp, phẫu thuật, dùng thuốc, thư giãn, tập tăng cường. Không có tiêu chí về kết nối các giai đoạn, cá nhân hóa hoặc mục tiêu sinh hoạt/thể thao.

“Có” cũng không mang một ý nghĩa ưu tiên thống nhất: thêm dịch vụ và có thuốc/phẫu thuật cùng dùng dấu chấm xanh. Có thể tạo cách đọc lẫn lộn giữa phạm vi dịch vụ và cách tiếp cận điều trị. Việc có dịch vụ phẫu thuật không đồng nghĩa khách nào cũng nhận phẫu thuật.

Đề xuất: nói rõ mô hình và giá trị đối với khách. Giữ “không thuốc, không phẫu thuật” như mô tả hướng tiếp cận của Holistic; không suy thành tuyên bố tốt hơn hoặc thay thế mọi lựa chọn khác.

### P2 — Mobile mất ý nghĩa so sánh

Tại ≤700px, CSS ẩn bảng. Code lấy riêng bốn hàng Holistic có `true`; các cột đối chiếu và hai hàng thuốc/phẫu thuật biến mất. Tiêu đề so sánh và legend “— KHÔNG” vẫn còn. Quan sát này đã được xác nhận ở preview 390px.

Mobile dễ đọc nhưng không trả lời “khác ra sao?”. Cần giữ cùng ý nghĩa nội dung trên desktop/mobile. Nếu giữ bảng, [NNGroup về mobile tables](https://www.nngroup.com/articles/mobile-tables/) hướng dẫn giữ header/cột nhận diện và thể hiện việc cuộn rõ ràng. Đây là hướng dẫn UX, chưa phải bằng chứng phương án đó tăng conversion tại Holistic.

### P2 — Nhịp trang đang lặp cùng định vị

Ngay trước là “Một lộ trình xuyên suốt”; ngay sau là “Ba bước, một chương trình duy nhất”. Section so sánh cần thêm một lớp ý nghĩa để khách lựa chọn, thay vì tiếp tục liệt kê dịch vụ.

Đề xuất phân vai: phần lộ trình trả lời “Tôi sẽ trải qua gì?”; phần khác biệt trả lời “Cách tổ chức này giúp gì cho tôi?”; phần giá trị cốt lõi nói triết lý. Khi triển khai cần xem lại cả phần `.pathTop` để giảm lặp.

### P2 — Chưa nối với nhu cầu của ba nhóm khách

Các tiêu chí chưa giúp nhân viên văn phòng, người chơi thể thao và vận động viên nhận ra mục tiêu của mình. Các câu hỏi giả định đáng kiểm tra:

- Nhân viên văn phòng: “Chương trình liên quan gì đến sinh hoạt và cách tôi vận động mỗi ngày?”
- Người chơi thể thao: “Tập luyện phục hồi nối với việc quay lại môn thể thao thế nào?”
- Vận động viên: “Sau trị liệu, chương trình tiếp tục phục vụ mục tiêu vận động ra sao?”

Đây là giả thuyết từ định nghĩa khán giả trong `PRODUCT.md`, không phải trích dẫn phỏng vấn.

## Hướng nội dung đề xuất

Ưu tiên một khối giải thích gồm ba hàng; cùng nội dung trên desktop và mobile. Không viết thêm một timeline vì phần trước đã giải thích trình tự.

> **Điểm khác biệt nằm ở cách kết nối trị liệu và tập luyện.**
>
> Holistic kết hợp tư vấn, trị liệu và tập luyện tại một nơi, trong một lộ trình phù hợp với tình trạng và mục tiêu vận động của bạn.

| Điều khách cần hiểu | Nội dung dự thảo |
| --- | --- |
| Một nơi cho cả lộ trình | Từ tư vấn đến trị liệu và tập luyện tại Holistic, giúp bạn thuận tiện hơn khi tiếp tục chương trình. |
| Chương trình phù hợp với bạn | Hướng trị liệu và tập luyện được lựa chọn theo tình trạng, những hạn chế vận động và mục tiêu của bạn. |
| Mục tiêu cho sinh hoạt và thể thao | Trị liệu hướng đến giảm đau mỏi, cải thiện vận động; tập luyện hướng đến tăng sức mạnh và kiểm soát chuyển động cho sinh hoạt, thể thao. |

Đây là bản nháp để thảo luận, chưa đưa lên UI. Không bổ sung cam kết cùng chuyên viên/cùng hồ sơ, lịch đánh giá lại, tiết kiệm chi phí, số buổi, thời gian hồi phục hoặc bảo đảm kết quả. Các chi tiết đó chưa được xác nhận.

Một phương án khác là giữ bảng, nhưng chuyển thành “nhu cầu của bạn / cách Holistic đáp ứng”, dùng mô tả thay dấu Có/Không. Việc so sánh trực tiếp các cơ sở chỉ phù hợp khi đã có dữ liệu đối chiếu thực. [NNGroup về comparison tables](https://www.nngroup.com/articles/comparison-tables/) nhấn mạnh tiêu chí hữu ích, nội dung nhất quán và khả năng quét; không quy định rằng mọi homepage phải có bảng so sánh.

## Đánh giá độc lập và giới hạn

Điểm của Assessment A cho riêng section tĩnh, dựa trên source. Đây là đánh giá chủ quan, không phải điểm conversion hoặc chứng nhận accessibility.

| Nielsen heuristic | Điểm /4 | Cơ sở |
| --- | --- | --- |
| 1. Hiển thị trạng thái | n/a | Không có trạng thái xử lý. |
| 2. Ngôn ngữ gần thực tế | 2 | Nhóm so sánh quá rộng; “PT” chưa giải thích. |
| 3. Quyền kiểm soát | n/a | Không có luồng thao tác. |
| 4. Nhất quán | 2 | Desktop/mobile khác ý nghĩa. |
| 5. Ngăn hiểu nhầm | 1 | Có/Không khiến người đọc suy rộng. |
| 6. Nhận biết thay vì nhớ | 3 | Desktop dễ tra; mobile mất đối chiếu. |
| 7. Linh hoạt/hiệu quả | n/a | Nội dung marketing tĩnh. |
| 8. Tối giản | 3 | Khối gọn; còn lặp với phần kế cận. |
| 9. Khôi phục lỗi | n/a | Không có lỗi tương tác. |
| 10. Trợ giúp | n/a | Không có nhiệm vụ cần hướng dẫn. |
| **Tổng** | **11/20** | **Ưu tiên sửa nội dung.** |

Tải nhận thức: bốn cột không phải bốn hành động phải chọn; vấn đề là tự diễn giải các nhóm cơ sở và dấu chấm. Cảm xúc: section lộ trình tạo cảm giác được hướng dẫn; bảng chuyển sang tuyên bố ưu thế; phần sau quay lại đồng hành. Khả năng giảm niềm tin ở đoạn giữa là giả thuyết thiết kế, chưa đo bằng hành vi.

Persona red flags: người mới có thể hiểu bệnh viện đồng nghĩa thuốc/phẫu thuật; người đọc thận trọng sẽ hỏi nguồn của các dấu “Không”; người dùng mobile chỉ thấy danh sách quảng bá dưới tiêu đề so sánh.

Assessment B: detector chạy một lần với `app/page.tsx`, exit 0 và JSON `[]`, không có finding hoặc false positive. Detector không kiểm tra tính đúng của claim hoặc chứng minh accessibility. Source cho thấy dấu “Không” có contrast khoảng 1.76:1 trên nền section; legend 11px khoảng 4.00:1. Đây là tính từ màu khai báo, chưa đo màu render từng cell. Cần tăng độ rõ nếu giữ bảng. Table đã có scope, nhưng chưa có caption/aria-labelledby; ký hiệu chưa `aria-hidden`, nên có thể bị đọc cùng nhãn Có/Không. Tablet hẹp có khả năng cần cuộn ngang do table min-width 720px; chưa xác nhận thao tác bàn phím ở viewport đó.

## Ảnh hiện trạng

![Desktop](../.context/comparison-desktop.png)

![Mobile](../.context/comparison-mobile.png)

## Câu hỏi để chốt hướng tiếp theo

1. Chọn khối ba ý giải thích giá trị, hay bảng “nhu cầu / cách Holistic đáp ứng”?
2. Chỉ thay section so sánh, hay đồng thời rút phần lặp “Ba bước, một chương trình duy nhất” phía dưới?

Các đề xuất và câu hỏi chưa được triển khai. Chưa có dữ liệu phỏng vấn, hành vi hoặc conversion để khẳng định phương án hiệu quả hơn.
