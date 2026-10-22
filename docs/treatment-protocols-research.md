# Quy trình 11 liệu pháp — nghiên cứu và bản nháp cho Sanity

Ngày: 22/10/2026. Phạm vi: phần **“Một buổi diễn ra thế nào”** trên trang chi tiết liệu pháp. Mục tiêu là giúp người đọc hình dung trước, trong và sau buổi; không phải hướng dẫn tự thực hiện thủ thuật hoặc phác đồ chuyên môn.

**Cập nhật sau yêu cầu chọn lọc của chủ dự án:** chọn 4 liệu pháp/16 bước chung để đưa vào Sanity staging, bỏ qua 7 liệu pháp còn chưa rõ. Xem [quyết định lựa chọn, nguồn đối chiếu và kết quả](treatment-protocols-selection.md) cùng [nội dung được chọn](treatment-protocols-selected.json). Bộ 54 bước dưới đây vẫn là hồ sơ nghiên cứu ban đầu; không nhập toàn bộ nó vào CMS và không coi các bước chưa chọn là đã được chấp thuận.

**Kết quả:** bản nháp tiếng Việt gồm 54 bước của 11 liệu pháp trong [treatment-protocols-drafts.json](treatment-protocols-drafts.json), dùng đúng cấu trúc từng phần tử `protocols` hiện có. Trong đó Điện xung gồm bốn bước khung trao đổi, chưa mô tả thao tác kỹ thuật. Tất cả đang ở trạng thái `pending_clinic_verification`, chưa nhập hoặc xuất bản lên Sanity. Không có thời lượng, thông số máy, liều, lịch điều trị hoặc lời hứa kết quả được suy ra từ cơ sở khác.

## Căn cứ và cách đọc

Đã đọc `PRODUCT.md`, [lần rà soát nội dung 22/10](TREATMENT_CONTENT_AUDIT.md), schema `sanity/schemaTypes/index.ts`, bộ đọc `lib/sanity.ts`, giao diện `TreatmentSteps` và kế hoạch đồng bộ `scripts/lib/treatment-sync.mjs`. Các quy trình cũ của Giác hơi, Ngâm lạnh và Đèn hồng ngoại không được dùng lại.

Tài liệu nguồn theo nhóm:

- [Châm khô, Giác hơi, IASTM, Tapping](treatment-protocol-research-manual.md).
- [Xung kích, Điện xung, Sóng siêu âm, Điện châm](treatment-protocol-research-devices.md).
- [Ngâm lạnh, Đèn hồng ngoại, Nắn chỉnh cột sống](treatment-protocol-research-recovery-spinal.md).

Mỗi ghi chú nhóm chỉ rõ phần nguồn đã đọc, bước được hỗ trợ và điều chưa xác minh. Nguồn bệnh viện/cơ quan y tế hỗ trợ kiến thức chung; chúng không chứng minh Holistic đã thực hiện đúng những bước đó. Những điểm như đánh giá lại vận động, bài tập cuối buổi và cách liên hệ cũng cần xác nhận là có trong dịch vụ thật.

## Các điểm cần chốt theo liệu pháp

| Liệu pháp / slug                               | Điều cần chốt trước khi dùng bản nháp                                                     |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Châm khô / `dry-needling`                      | Người thực hiện, kỹ thuật, chuẩn bị vô khuẩn, hướng dẫn và liên hệ sau buổi               |
| Giác hơi / `cupping`                           | Loại giác thực tế; không tự thêm lửa, di chuyển cốc hoặc trích lể; vệ sinh và chăm sóc da |
| IASTM / `iastm`                                | Dụng cụ, chất bôi trơn, kiểm tra da/dị ứng và cách đánh giá đáp ứng                       |
| Đèn hồng ngoại / `heat-light`                  | Đúng là đèn tạo nhiệt, model, bảo vệ mắt, theo dõi da/cảm giác                            |
| Ngâm lạnh / `cold-plunge`                      | Sàng lọc, chuẩn bị bồn, người theo dõi/hỗ trợ, tiêu chí dừng và làm ấm                    |
| Tapping / `tapping`                            | Có đúng băng đàn hồi; loại băng, kiểm tra da, thời điểm và cách tháo                      |
| Xung kích / `shockwave`                        | Loại máy, chỉ định, vị trí, theo dõi và hướng dẫn vận động sau buổi                       |
| Điện xung / `bio-electric`                     | Hãng/model, TENS hay NMES/EMS hay loại khác, cách truyền điện; hiện chỉ có khung trao đổi |
| Sóng siêu âm / `therapeutic-ultrasound`        | Thiết bị, mục tiêu cho tình trạng cụ thể, kỹ thuật áp đầu phát và theo dõi                |
| Điện châm / `electroacupuncture`               | Người thực hiện, kim, máy kích thích, sàng lọc thiết bị cấy ghép và kết thúc buổi         |
| Nắn chỉnh cột sống / `chiropractic-adjustment` | Huy động chậm/lực đẩy nhanh/dụng cụ; vùng cột sống; giải thích nguy cơ và đồng ý          |

Điện xung chưa rõ loại máy nên bản nháp không khẳng định điện cực dán, đầu cầm hay găng. Nắn chỉnh cột sống chưa rõ kỹ thuật nên không viết một thao tác nhanh cụ thể. Giác hơi chưa rõ loại nên không mô tả lửa hoặc trích lể. Đây là những khoảng trống cần thông tin thực tế, không thể giải quyết chỉ bằng thêm nguồn trên mạng.

## Cấu trúc bản nháp

JSON là **hồ sơ biên tập**, không phải file để import toàn bộ vào Sanity. Nó không chứa mutation, token hay `_id` lấy từ seed. Mỗi phần tử `treatments` gồm:

| Trường                           | Ý nghĩa                                                         |
| -------------------------------- | --------------------------------------------------------------- |
| `slug`, `title`                  | Nhận diện liệu pháp bằng catalogue hiện tại                     |
| `reviewStatus`, `clinicVerified` | Trạng thái biên tập; các cờ này không thuộc schema CMS hiện tại |
| `researchNote`                   | Ghi chú nhóm với nguồn và giới hạn                              |
| `protocols`                      | Phần nội dung dự kiến đưa vào trường Quy trình thực hiện        |
| `stepSources`                    | Ánh xạ số bước với nguồn/giới hạn; giữ ở tài liệu nghiên cứu    |
| `clinicQuestions`                | Câu hỏi xác nhận thực tế, không phải nội dung công khai         |

Mỗi bước trong `protocols` có `_type: "protocolStep"`, `_key`, `step`, `title`, `description`. `step` là số nguyên liên tiếp từ 1 vì schema yêu cầu và bộ đọc sắp xếp theo số này; `_key` ổn định trong mảng. Không cần thay schema để nhập các bước đã xác nhận. `duration` được bỏ khỏi bản nháp vì chưa có thời lượng thực tế.

## Cách dùng khi chuẩn bị CMS

1. Người phụ trách chuyên môn đối chiếu từng liệu pháp với cách đang làm: sửa/bỏ các bước không đúng, trả lời `clinicQuestions`. Không duyệt chung cả 11 chỉ vì cùng có bước trao đổi và theo dõi.
2. Chốt các nhánh còn chưa rõ (đặc biệt Điện xung, Giác hơi, Tapping, Đèn hồng ngoại, Nắn chỉnh cột sống), rồi sửa câu mô tả thành kỹ thuật thật. Ghi người xác nhận và ngày xác nhận trong hồ sơ biên tập.
3. Trong Studio, mở đúng liệu pháp theo slug và chỉ đưa các phần tử đã xác nhận của `protocols` vào **Quy trình thực hiện**. Không nhập metadata nghiên cứu, `stepSources` hay câu hỏi nội bộ vào nội dung website. Không ghi đè giới thiệu, FAQ, giá, ảnh hoặc SEO đã rà soát.
4. Kiểm tra bản nháp CMS và trang xem trước: đúng liệu pháp, thứ tự, không hứa kết quả, không xuất hiện thời lượng cũ; xử lý các draft đang mở trước khi xuất bản.

**Lưu ý đồng bộ:** lúc nghiên cứu ban đầu, `scripts/lib/treatment-sync.mjs` có `UNSET = ["benefits", "protocols", "duration"]`. Sau yêu cầu cập nhật chọn lọc của chủ dự án, `protocols` đã được bỏ khỏi danh sách xóa để giữ nội dung biên tập trong CMS; có test tái hiện và kiểm tra việc giữ nội dung khi đồng bộ lại. Seed vẫn không chứa quy trình. `benefits` và `duration` tiếp tục theo chính sách cũ.

## Các giới hạn cần giữ khi biên tập

- Không chuyển số phút, nhiệt độ, lực, độ sâu kim, số xung, vị trí điện cực hoặc lịch buổi của tài liệu tham khảo thành cách làm Holistic.
- Không sao chép hướng dẫn thuốc từ bệnh viện khác; mọi thay đổi thuốc cần được trao đổi với người điều trị.
- Không dùng câu “giải độc”, “phá mô sẹo”, “đưa xương về chỗ”, “tái tạo mô” hoặc “phục hồi nhanh” để giải thích các bước.
- Không coi bằng chứng về tác dụng là bằng chứng về quy trình tại cơ sở, hoặc suy từ ảnh ra model máy/chuyên môn người thực hiện.
- Phần an toàn trong quy trình chỉ giúp hình dung trải nghiệm; FAQ và hướng dẫn trực tiếp vẫn cần giữ những thông tin riêng của từng phương pháp. Quy trình rút gọn không phải danh sách sàng lọc đầy đủ.

## Xác minh phạm vi bàn giao

Trong giai đoạn nghiên cứu ban đầu: đối chiếu đủ 11 slug với `scripts/seed/treatments.json`; kiểm tra cấu trúc bước, thứ tự và khóa duy nhất; kiểm tra JSON/Markdown bằng Prettier. Giai đoạn đó chỉ bổ sung tài liệu và dữ liệu nháp. Lần cập nhật chọn lọc tiếp theo được ghi riêng tại [treatment-protocols-selection.md](treatment-protocols-selection.md).
