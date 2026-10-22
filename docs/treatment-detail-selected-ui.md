# Treatment detail — bản UI đã chốt

## Nguồn quyết định

Owner chọn bản kết hợp ngày 20/10/2026 sau demo đối chiếu A/B, chọn thanh tư vấn C và yêu cầu dựng trên codebase thật ngày 21/10/2026. Phạm vi thuộc issue #10 (con của #1). Tài liệu spec ngày 15/10 còn hữu ích cho dữ liệu và luồng yêu cầu; phần hình thức hero, quy trình, FAQ, liên quan và dock được thay bằng lựa chọn mới này.

| Khối                                        | Thiết kế đã chọn                                             |
| ------------------------------------------- | ------------------------------------------------------------ |
| Hero                                        | Chữ trái, ảnh phải; breadcrumb, CTA và lộ trình              |
| Thông tin nhanh, mục lục                    | Dải thông tin theo dữ liệu; neo tới những phần đang hiển thị |
| Giới thiệu                                  | Giữ kiểu cũ: câu dẫn lớn trái, mô tả phải                    |
| Dành cho ai, hướng tới gì                   | Giữ kiểu cũ: nhãn và các pill                                |
| Một buổi diễn ra thế nào                    | Quy trình dọc, giải thích bên trái                           |
| Bạn có thể đang băn khoăn                   | FAQ theo hàng; câu đầu mở sẵn                                |
| Cùng nhóm                                   | Ảnh và thông tin liệu pháp; liên kết trang thật              |
| Muốn biết liệu pháp này có phù hợp với bạn? | Panel linen, liên hệ và form thật                            |
| Thanh tư vấn nổi                            | C: thumbnail, tên, giá/thời lượng, CTA; hai hàng trên mobile |

## Triển khai

Các component nằm tại `app/treatments/[slug]/`, CSS chỉ scope vào trang chi tiết. Giữ server components cho phần nội dung; dock và form sử dụng client components sẵn có. Không thêm thư viện, route public, schema hay phương thức gửi yêu cầu mới.

`buildTreatmentDetail` suy ra nhóm và các liệu pháp cùng nhóm từ dữ liệu hiện có; mỗi kết quả liên quan nay mang thêm ảnh, alt và mô tả ngắn của chính document đó. Theo rà soát nội dung ngày 22/10/2026, nhãn lọc cấp nhóm không còn được suy ra thành chỉ định của từng liệu pháp. Nút của form chi tiết dùng nhãn “Gửi yêu cầu tư vấn” qua prop tùy chọn; các trang dùng chung form giữ nhãn mặc định. Endpoint, treatment/source trong payload, honeypot, consent analytics và trạng thái thành công/thất bại vẫn do luồng hiện có xử lý.

## Nội dung và khả năng hiển thị

- Sanity vẫn là nguồn nội dung khi đã cấu hình. Bản local không có Sanity dùng catalogue từ bảng giá owner cung cấp.
- Catalogue hiện có mô tả dài và FAQ được nghiên cứu ngày 22/10/2026; nguồn và giới hạn nằm trong `docs/TREATMENT_CONTENT_AUDIT.md`. Thời lượng, lợi ích và quy trình riêng của phòng khám vẫn chờ xác nhận. Các phần chỉ hiện khi document có dữ liệu; không đưa nội dung mô phỏng vào catalogue.
- Mục lục theo cùng điều kiện render của từng phần, tránh neo trống.
- Ảnh hero/dock dùng ảnh của liệu pháp; Giác hơi local dùng crop ngang `HeroTreatments.jpg` của cùng ảnh clinic theo demo đã chọn; liệu pháp thiếu ảnh có bố cục chữ. Ảnh phòng trị liệu là asset clinic hiện có, được crop như bản demo.
- Metadata SEO, not-found, ISR và form yêu cầu tư vấn dùng logic hiện hành.

## Bằng chứng trong workspace

Bản demo đã chốt và phản hồi từng khối nằm tại `.context/treatment-demo/`. Bản chụp giao diện chạy từ production build nằm tại `.context/treatment-rebuild/`. Đây là artifact local, không đi vào public build.

## Kiểm tra đã thực hiện

- `npm run lint`: đạt.
- `npm run typecheck`: đạt; production build cũng hoàn tất bước TypeScript.
- `npm run build`: đạt, bao gồm prerender các trang liệu pháp từ catalogue local.
- Đã mở và chụp bản production local ở 320, 390, 768, 1440 px; các kích thước này không có tràn ngang hoặc lỗi JavaScript được ghi nhận. Có ảnh thanh C cùng cookie banner trên mobile.
- Các assertion hiện có bám vào hero/facts, heading, quy trình và trạng thái mở FAQ cũ được điều chỉnh theo thiết kế mới; không thêm test case và chưa chạy test suite.
- Chưa có dữ liệu Sanity thật trong workspace để xem các khối nội dung tùy chọn đầy đủ; chưa gửi form tới dịch vụ email. Việc publish, kiểm tra CMS/staging và đóng issue nằm ngoài bước triển khai local này.
