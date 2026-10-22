# Tham khảo Awwwards cho trang chi tiết liệu pháp

Ngày nghiên cứu: 18/10/2026. Phạm vi: đề xuất thiết kế cho [issue #10](https://github.com/chachajona/holisticvn/issues/10), `/treatments/[slug]`.

Đề xuất: **dùng Klearmind làm tham chiếu cấu trúc và Dhun làm tham chiếu cách phối ảnh/nội dung**, giữ hệ Warm Clay Editorial v2 của Holistic. Moxie bổ sung tham chiếu cho FAQ. Đây là nhận định thiết kế từ các ảnh chụp và nội dung trang hiện hành; không phải kết luận tự động của Awwwards.

## Căn cứ trong project

- `PRODUCT.md`, `DESIGN.md`, `docs/FRONTEND_CHECKLIST.md`.
- Source hiện hành: `app/treatments/[slug]/page.tsx`, `treatment-hero.tsx`, `treatment-audience.tsx`, `treatment-steps.tsx`, `booking-panel.tsx`.
- Ảnh đã có: `.context/evidence/redesign-cupping-1280.png`.
- Hai plan `design-plans/treatment-detail-layout-and-wording.md` và `design-plans/treatment-detail-warm-clay-tokens.md` là ngữ cảnh lịch sử; source hiện tại đã đi xa hơn hai plan này.

Trang hiện có hero, facts, giới thiệu khi có đoạn riêng, đối tượng/lợi ích, protocol, FAQ, liên quan, callback form và dock CTA. Các khối tùy chọn có điều kiện hiển thị. Nhu cầu hiện tại là cải thiện thứ bậc và nhịp đọc của những khối này.

## Ba nguồn được chọn

| Nguồn             | Hồ sơ Awwwards                                                                    | Trang con đã xem trực tiếp                                            | Vai trò                                                   |
| ----------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| Klearmind Clinics | [Honorable Mention, 30/08/2025](https://www.awwwards.com/sites/klearmind-clinics) | [Ketamine Therapy](https://www.klearmindclinics.com/ketamine-therapy) | Cấu trúc trang một liệu pháp và quy trình theo trục dọc   |
| Dhun Wellness     | [Nominee](https://www.awwwards.com/sites/dhun-wellness)                           | [Treatments](https://dhunwellness.com/pages/treatments)               | Nền kem, phối ảnh với nội dung, phân nhóm và card dịch vụ |
| Moxie             | [Honorable Mention, 13/02/2024](https://www.awwwards.com/sites/moxie)             | [Care](https://www.moxiecare.com/care)                                | Chữ serif, hàng hỏi đáp và nhịp phân tách nội dung        |

Các danh hiệu thuộc website trên Awwwards; chúng không xác nhận riêng từng trang con hay chất lượng nội dung y tế. Dhun là trang danh mục dịch vụ, hữu ích về hình thức trình bày và liên kết; Klearmind sát nhu cầu treatment detail nhất.

### 1. Klearmind: khung trang liệu pháp

Quan sát: trang bắt đầu bằng tên và giải thích liệu pháp, ảnh ngang lớn, sau đó trình bày một quy trình theo trục dọc với từng bước có ảnh và nội dung. Các phần tiếp theo gồm đối tượng, hình thức điều trị, FAQ và liên hệ. CTA tư vấn nằm trên navigation và xuất hiện ở những điểm chuyển đoạn.

Áp dụng cho Holistic:

- Giữ hero/facts hiện có nhưng phân biệt rõ hành động chính gửi yêu cầu và hành động gọi điện.
- Với liệu pháp có nhiều bước hoặc đoạn mô tả dài như Giác hơi, thử **quy trình theo các hàng nối tiếp** thay cho lưới bốn card ngang. Trục dọc phải thể hiện đúng thứ tự từ CMS. Trên mobile, số bước nằm cạnh tiêu đề, phần giải thích nằm ngay dưới.
- Điều chỉnh chiều cao mỗi bước theo lượng nội dung của Holistic; khoảng cách rất lớn của bản tham chiếu không phải yêu cầu phải sao chép.
- Ảnh từng bước chỉ dùng nếu phòng khám có ảnh phù hợp; có thể dựng quy trình bằng số, tiêu đề và đoạn văn hiện có.

### 2. Dhun: cách phối ảnh và nội dung

Quan sát: trang Treatments có nền kem, header màu đất, ảnh thao tác cơ thể, vùng ảnh và lời giới thiệu đặt cạnh nhau, các card dịch vụ thấp hơn và đường phân cách mảnh giữa nhóm. Khu vực liên hệ được tách rõ ở cuối trang.

Áp dụng cho Holistic:

- Dùng ảnh thật của phòng khám cùng phần giới thiệu để tạo nhịp chuyển giữa hero và các khối chữ; tuân thủ quy định ảnh không lộ mặt trong `PRODUCT.md`.
- Dùng card gọn cho phần liên quan: tên liệu pháp, mô tả ngắn nếu có, link rõ ràng; chỉ hiển thị dữ liệu thực sự có.
- Giữ màu `#fdfaf6`, `#744d40`, `#48614c` và bộ Roboto của Holistic. Chữ nghiêng ở Dhun là đặc điểm của nguồn, không phải thay đổi được đề xuất cho Holistic.
- Học cách tách hành động xem thêm và liên hệ, đồng thời giữ CTA gửi yêu cầu của Holistic đúng nghĩa callback.

### 3. Moxie: cách tổ chức FAQ

Quan sát: phần FAQ trên trang Care gồm câu hỏi theo hàng, đường phân cách mảnh, dấu cộng và vùng trả lời có chiều rộng giới hạn. Màu nâu tạo tương phản mạnh với chữ sáng. Trang Care hiện tại cũng dùng nhiều vàng; không nên suy ra toàn bộ trang chỉ có bảng màu nâu/kem từ metadata Awwwards.

Áp dụng cho Holistic:

- Dùng khoảng cách, độ tương phản và đường phân cách để câu hỏi dễ quét; đặt FAQ trước bước gửi yêu cầu.
- Chỉ hiển thị câu hỏi và trả lời từ CMS đã được phòng khám duyệt; trường rỗng không tạo khối placeholder.
- Trong hệ Holistic, có thể áp dụng cấu trúc hàng ngay trên nền kem và chữ sage/ink. Không cần thêm một khối tối lớn.
- Chưa kiểm tra trạng thái đóng/mở hoặc khả năng tiếp cận của FAQ nguồn; đề xuất này dựa trên hình thức và tổ chức nội dung đã quan sát.

## Hướng áp dụng vào issue #10

| Phần                | Hướng đề xuất                                                                | Nguồn                                 |
| ------------------- | ---------------------------------------------------------------------------- | ------------------------------------- |
| Hero và facts       | Tên + mô tả ngắn + ảnh; CTA gửi yêu cầu có ưu tiên rõ với gọi điện           | Klearmind; đối chiếu source hiện hành |
| Giới thiệu          | Đoạn ngắn có giới hạn chiều rộng, phối ảnh thật khi nội dung đủ              | Dhun                                  |
| Đối tượng / lợi ích | Phân biệt rõ hai loại thông tin; thử danh sách chữ thay cho nhiều pill dài   | Nhận định từ ảnh Holistic hiện có     |
| Quy trình           | Các hàng theo trục dọc cho liệu pháp nhiều bước; số và nội dung đi cùng nhau | Klearmind                             |
| FAQ                 | Hàng hỏi đáp, hairline, khoảng cách đọc rõ                                   | Moxie và Klearmind                    |
| Liên quan           | Card gọn dẫn đến liệu pháp thực sự có trong dữ liệu                          | Dhun                                  |
| Gửi yêu cầu         | Giữ callback form và lời giải thích bước tiếp theo; không ngầm xác nhận lịch | Yêu cầu project / issue #10           |

Đây là các đề xuất để lựa chọn trước khi triển khai, không thay thế acceptance criteria của issue. Từ các nguồn không suy ra giá, số buổi, chỉ định, hiệu quả hoặc dữ liệu y tế cho Holistic.

## Phương pháp và giới hạn

- Dùng Awwwards MCP: `list_categories`, `search_sites`, `get_site_details`, `create_design_brief`. Tìm bằng các bộ lọc và từ khóa clinic/wellness không trả kết quả phù hợp trong phần chỉ mục hiện có; dùng tìm kiếm web bổ sung để lấy slug rồi đối chiếu lại bằng MCP.
- Đã xem thêm MyHealthPrac và Memory Clinic. MyHealthPrac là sản phẩm phần mềm, Memory Clinic là tham chiếu rộng hơn; hai mẫu này ít sát nội dung treatment detail hơn ba nguồn trên.
- Metadata Awwwards của các mẫu được lưu trong cache của lượt nghiên cứu. Brief tự động thiếu tín hiệu chung và motion; trường design elements của Klearmind có nhiễu, không dùng làm căn cứ.
- Công cụ `capture_live_site` của MCP đóng kết nối trong lần thử. Đã chuyển sang Playwright trực tiếp để chụp trang con hiện hành; không xác nhận rằng công cụ capture MCP đã được sửa.
- Đã chụp desktop toàn trang và vùng cần tham khảo. Chưa nghiên cứu motion hoặc xác minh hành vi mobile; không đề xuất easing, thời lượng animation hay kết luận responsive từ ảnh desktop.
- Không sửa giao diện, không gửi form, không cập nhật trạng thái hay đăng bình luận lên issue.

## Ảnh và bằng chứng trong workspace

Ảnh nằm trong `.context/treatment-inspiration/` (gitignored):

- `inspiration-board.png` và `board.html`: bảng so sánh ba nguồn.
- `klearmind-treatment-full.png`, `klearmind-process.png`.
- `dhun-treatments-full.png`, `dhun-treatments-top.png`.
- `moxie-care-full.png`, `moxie-faq.png`.
- `*-page.json`: nội dung, heading và URL quan sát được ở các trang con.
- `moxie.json`, `klearmind-clinics.json`, `dhun-wellness.json`, `design-brief.json`: phản hồi của Awwwards MCP.

Ảnh chụp là bằng chứng nghiên cứu có nguồn, không phải tài sản được cấp quyền để dùng trên public site.
