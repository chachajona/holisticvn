# Hai CTA cuối homepage — tối giản

Yêu cầu owner ngày 2026-10-10: giảm chữ, research recommended screens, thêm background pattern theo brand guideline đã gửi. Phạm vi là hai thẻ sau đánh giá khách hàng, trước Instagram.

## Màn hình tham khảo

Đã dùng Inspo `recommend`, `search_screens` và xem hồ sơ của ba màn hình dưới đây. Các capture là tài liệu tham khảo về bố cục; trang nguồn được mở lại để đối chiếu nội dung. Đây là lựa chọn thiết kế cho Holistic, chưa phải kết quả đo chuyển đổi.

| Nguồn                                                    | Chi tiết tham khảo                                                                                                           | Áp dụng                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Frequency Breathwork](https://frequencybreathwork.com/) | Phần chốt “Take your practice with you” đi cùng một link tải app; hai hành động ở hero có cách trình bày sáng/tối khác nhau. | Thẻ cuối trang chỉ cần tiêu đề ngắn và hành động. |
| [Allia Health](https://alliahealth.co/)                  | Tiêu đề serif nhẹ, khoảng trống thoáng; phần liên hệ cuối trang có lời mời ngắn và hành động rõ.                             | Giữ typography và nhịp thoáng của Holistic.       |
| [Menkind](https://menkind.co/haarverlies)                | Capture ngày 2026-09-10 có nền kem, typography editorial và CTA viền “STARTEN”.                                              | Dùng nút viền cho hướng xem dịch vụ.              |

Không sao chép palette, font, hình ảnh hoặc tuyên bố y tế của các trang tham khảo.

## Brand guideline

Nguồn owner: `.context/attachments/OdHqYf/drive-download-20260825T092937Z-1-001.zip`, gồm 13 PDF; đã đọc nội dung và xem các trang render.

- `HoliBrandBrief_11.pdf`: nâu là màu chủ đạo, gồm `#744D40` và `#90776E`; các màu earth tone bổ trợ được phép.
- `HoliBrandBrief_12.pdf`: không khí thư thái, tối giản, chân thành; bố cục đơn giản, ít chi tiết rối mắt.
- `HoliBrandBrief_13.pdf`: Roboto Slab, Serif và Mono là các font của thương hiệu.
- Trang 2 và 9 dùng texture giấy/tường mịn; guideline không quy định một pattern logo lặp riêng.
- Đã tách raster nền xref 105 từ `HoliBrandBrief_9.pdf`, không có chữ hoặc logo, kích thước 626×417. Bản gốc ở `.context/brand-cta/slide-9-image-105.jpeg`; bản WebP ở `public/assets/textures/brand-paper.webp`, 21,214 bytes. Chỉ đổi định dạng, không dựng texture giả.

## Quyết định triển khai

- Bỏ hai câu mô tả vì lặp nội dung của tiêu đề và các section phía trên.
- Thẻ nâu: “Bắt đầu từ tư vấn” → “Đặt lịch tư vấn” → `/booking`.
- Thẻ kem: “Trị liệu & tập luyện” → “Xem dịch vụ” → `/services`.
- Dùng `h2` cho tiêu đề, giữ native links; không thêm JavaScript hoặc animation.
- Nút tư vấn sáng, nút dịch vụ viền; mobile giữ nút rộng hết phần nội dung.
- Texture chỉ nằm trên nền thẻ nâu, soft-light 60%, không nhận pointer, nội dung ở lớp trên.
- Lần chỉnh tiếp theo theo yêu cầu owner: desktop đặt tiêu đề bên trái, nút bên phải, căn giữa theo chiều dọc. Padding 28px × 32px, chiều cao tối thiểu 140px (giảm từ 200px). Dưới 980px hai thẻ thành hai hàng; dưới 700px nội dung từng thẻ xếp dọc, padding 28px × 20px và chiều cao theo nội dung. Nút tư vấn không có transition hoặc dịch chuyển khi hover.

## Kiểm tra

- Browser local ở 320, 390, 768 và 1440 px: không tràn ngang, nhãn nút một dòng, đích link đúng.
- `tests/home-copy.test.ts`: 4 test hiện có đạt, gồm kiểm tra không thêm tuyên bố chưa xác nhận.
- ESLint trên `app/page.tsx`, `npm run typecheck`, Prettier trên CSS và kiểm tra whitespace của diff đều đạt. Prettier trên toàn bộ `app/page.tsx` báo hai đoạn testimonial đã có từ trước; không sửa định dạng ngoài phạm vi CTA.
- Tab đi từ nút tư vấn sang nút dịch vụ; cả hai có focus outline 2px. Tiêu đề 28px trên texture đạt tỷ lệ tương phản tối thiểu 4.23:1 trong vùng nền được lấy mẫu (yêu cầu chữ lớn: 3:1).
- Screenshot local: `.context/homepage-ctas-minimal-320.png` và `.context/homepage-ctas-minimal-1440.png`.
- Chưa đo chuyển đổi hoặc kiểm tra với người dùng thực tế.
