# Quy trình được chọn để cập nhật CMS

Ngày: 22/10/2026. Chủ dự án yêu cầu bỏ qua liệu pháp còn chưa chắc, chỉ cập nhật phần quy trình giống nhau giữa các cơ sở. Phần dưới áp dụng tiêu chí đó cho 11 bản nháp đã nghiên cứu.

## Kết quả lựa chọn

Chọn **4 liệu pháp, tổng cộng 16 bước**: Châm khô, IASTM, Xung kích, Điện châm. Nội dung chính xác ở [treatment-protocols-selected.json](treatment-protocols-selected.json). Đây là phần trải nghiệm thường gặp, đối chiếu giữa ít nhất hai cơ sở độc lập; không phải kết luận mọi phòng khám có cùng một phác đồ và không xác nhận đã khảo sát quy trình riêng của Holistic. Bước đầu mỗi liệu pháp nêu “thường bắt đầu” để giữ ngữ cảnh này.

Không nhập thời lượng, số buổi, nhiệt độ, lực, độ sâu, điểm châm, thông số máy, nhãn dụng cụ hoặc hướng dẫn thay đổi thuốc. Không suy ra hiệu quả từ thao tác. Các chi tiết và câu hỏi chuyên môn riêng của Holistic vẫn ở [tài liệu nghiên cứu ban đầu](treatment-protocols-research.md).

## Nguồn đối chiếu và phạm vi dùng

### Châm khô — `dry-needling`

- [Cleveland Clinic](https://my.clevelandclinic.org/health/treatments/16542-dry-needling), Treatment Details: đánh giá trước châm, chuẩn bị da/kim, đưa kim, rút kim và kiểm tra phản ứng.
- [Ohio State Wexner Medical Center](https://wexnermedical.osu.edu/orthopedics/sports-medicine/treatments/dry-needling), How is dry needling done: đánh giá, bộc lộ vùng cần châm, làm sạch da, kim dùng một lần, cảm giác cơ và hướng dẫn vận động sau buổi. Đọc toàn văn qua tải HTML trực tiếp khi lần mở web thứ hai timeout.
- [Mobility Physiotherapy, phiếu đồng ý](https://mobilityphysiotherapy.co.uk/wp-content/uploads/2021/10/Acupuncture-and-Dry-Needling-Consent-form.pdf): trao đổi sức khỏe, rủi ro, kim dùng một lần và quyền từ chối; không lấy tỷ lệ tai biến hoặc cơ chế từ phiếu này.

Phần chung dùng cho bước 1–3 là đánh giá → chuẩn bị → châm và nhận phản hồi. Bước 4 gộp rút kim/kết thúc, hướng dẫn theo phản ứng. Cảnh báo khó thở/đau ngực theo Cleveland và FAQ đã rà soát; không coi đó là tỷ lệ rủi ro đã đo tại Holistic. Không chọn giữa châm nông/sâu hoặc lưu kim/di chuyển kim.

### IASTM — `iastm`

- [Northwestern Medicine](https://www.nm.org/conditions-and-care-areas/rehabilitation-services/physical-therapy/instrument-assisted-graston-technique), How It Works / How Can I Get This Treatment: quyết định phù hợp, chuẩn bị da bằng lotion, dụng cụ trên da và bài tập theo nhu cầu.
- [Daviess Community Hospital](https://www.dchosp.org/our-services/rehabilitation-therapies-outpatient-/manual-therapy/graston-technique-/), Evaluation / Treatment / Home plan / FAQs: đánh giá triệu chứng và vận động, lotion, dụng cụ di chuyển trên da, phản hồi cảm giác và bài tập.

Hai nguồn cùng trình tự tổng quát: đánh giá → chuẩn bị da → dụng cụ → vận động. Graston là một dạng IASTM; không nhập tên thương hiệu hoặc vật liệu thép để mô tả dụng cụ Holistic. Sản phẩm bôi da được diễn đạt có điều kiện. Không ghi một bước kiểm tra da hoặc aftercare cố định khi hai trang chưa mô tả cùng cách đó. Không dùng các lời hứa phá mô sẹo/phá dính hoặc chữa lành của nguồn.

### Xung kích — `shockwave`

- [Royal Devon, PDF 11/2024](https://www.royaldevon.nhs.uk/media/ktffxirh/extracorporeal-shockwave-therapy-eswt-rd-e-20-022-005.pdf), Prior to ESWT / How is ESWT carried out / What happens after: trao đổi sức khỏe, đồng ý, xác định vùng, gel, đầu cầm và theo dõi sau.
- [Oxford University Hospitals, PDF 02/2025](https://www.ouh.nhs.uk/patient-guide/leaflets/files/86722shockwave.pdf), trang 3 và 5: gel, đầu máy cầm tay, tiếng máy, cảm giác và hướng dẫn vận động sau buổi.

Thao tác chính phù hợp: vùng được lựa chọn → gel → đầu máy trên da. Cách sàng lọc và hướng dẫn theo dõi được rút gọn, không chuyển danh sách loại trừ hay chính sách thuốc của từng bệnh viện thành quy định Holistic. Hai nguồn khác thời gian và lịch hẹn, nên không nhập các con số đó. Không chọn máy hội tụ/hướng tâm, không hứa đáp ứng tức thì.

### Điện châm — `electroacupuncture`

- [Royal Wolverhampton, Acupuncture](https://www.royalwolverhampton.nhs.uk/wp-content/uploads/2025/05/Accupuncture.pdf), trang in 1–3: trao đổi lựa chọn, tư thế, kim vô khuẩn dùng một lần, đoạn riêng về electroacupuncture/râm ran, rút kim và phản ứng sau.
- [North Tees and Hartlepool, Acupuncture](https://www.nth.nhs.uk/resources/acupunture/), Can anyone have Acupuncture / What will happen at my appointment / What is Electro-Acupuncture: sức khỏe và đồng ý, châm kim, nối kim với bộ kích thích điện, kết thúc và hướng dẫn theo phản ứng.

Phần điện được xác nhận riêng ở cả hai nguồn; không lấy châm cứu thông thường hoặc châm khô làm bằng chứng cho bước kích thích điện. Giữ trình tự chung trao đổi → kim → điện → kết thúc; không ghi vị trí nối, tần số, cường độ hoặc cách vận hành máy. Yêu cầu kim vô khuẩn dùng một lần được Royal Wolverhampton nêu, bổ trợ bởi tài liệu East Kent đã đọc trong [nghiên cứu thiết bị](treatment-protocol-research-devices.md); không gán đó là kết quả kiểm tra vật tư tại Holistic.

## Bỏ qua 7 liệu pháp

| Liệu pháp          | Lý do                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| Giác hơi           | Chưa xác định giác khô, lửa, di chuyển hay xuyên da; thao tác khác nhau.                                  |
| Đèn hồng ngoại     | Chưa xác định loại đèn và điều kiện sử dụng theo thiết bị.                                                |
| Ngâm lạnh          | Điều kiện ngâm, mức ngập, theo dõi và hỗ trợ khác nhau; chưa biết quy trình cơ sở.                        |
| Tapping            | Tên dịch vụ chưa xác nhận chắc băng đàn hồi hay loại/kỹ thuật khác.                                       |
| Điện xung          | Chưa xác định máy, chế độ và cách truyền điện.                                                            |
| Sóng siêu âm       | Nhánh tiếp xúc trực tiếp phù hợp giữa các nguồn nhưng có cách áp khác; chưa biết Holistic dùng nhánh nào. |
| Nắn chỉnh cột sống | Chưa xác định huy động chậm, lực đẩy nhanh hay dụng cụ và vùng tác động.                                  |

Riêng siêu âm đã đọc [South Tees](https://www.southtees.nhs.uk/services/physiotherapy/community-outpatient-physiotherapy-middlesbrough-redcar-and-cleveland/what-treatments-are-available/what-is-electrotherapy/), [Royal Berkshire, PDF 08/2026](https://www.royalberkshire.nhs.uk/media/xkwpdakp/ultrasound-therapy-patient-guide_aug26.pdf) và [PhysiPro](https://www.physipro.co.uk/services/ultrasound-therapy). Berkshire nêu có cách áp khác theo vùng, nên không nhập nhánh gel/đầu phát trên da trong lần này. Ghi chú đối chiếu bổ sung lưu trong `.context/treatment-protocols/convergence-extra.md`.

## Cập nhật và kiểm chứng

Đích duy nhất là **`yjzexxml/staging`**. Kế hoạch mutation chỉ đặt `protocols` trên bốn bản ghi theo slug thực tế, có điều kiện revision. Bản sao lưu, kế hoạch, kết quả đọc lại và transaction nằm trong `.context/treatment-protocols/`. Không dùng ID seed để đoán bản ghi.

Sau khi áp dụng, kiểm tra toàn bộ tài liệu liên quan: bốn mảng quy trình phải khớp nội dung chọn, bảy liệu pháp bỏ qua giữ nguyên, không thay trường giá/giới thiệu/FAQ/SEO/ảnh/thời lượng hoặc các trang nhóm. Đọc revision production trước/sau để kiểm tra không có thay đổi.

**Đã áp dụng và đọc lại thành công** trên staging, transaction `szuRqBFUY0ugfQTzBJDXO2`: đúng bốn bản ghi, 16 bước; bảy liệu pháp bỏ qua và các trường khác giữ nguyên; revision production không đổi. Kết quả chi tiết ở `.context/treatment-protocols/publish-result.json`.

Kiểm tra mã: 362 tests đạt, lint/typecheck/production build đạt. Trình duyệt kiểm tra 38 lượt với dữ liệu staging thật và fallback ở 320, 768, 1440 px: bốn trang được chọn có đủ bước đúng nội dung/thứ tự, bảy trang bỏ qua không có quy trình, fallback không tự thêm quy trình, không cuộn ngang hoặc lỗi JavaScript; skip link và FAQ dùng được bằng bàn phím ở 320 px. Dev server từng giữ phản hồi trước mutation; đã kiểm tra lại bằng yêu cầu `Cache-Control: no-cache` để đọc dữ liệu mới. Không sửa cache production. Báo cáo ở `.context/treatment-protocols/browser-verification.json`.

Ảnh ở `.context/treatment-protocols/screenshots/`; các ảnh có hậu tố `-content` chụp riêng phần quy trình, đã đóng cookie bằng nút Từ chối và chỉ ẩn thanh tư vấn/nút nổi trong lúc chụp để đọc đủ các bước. Không thay giao diện ứng dụng cho việc chụp này.

Luồng đồng bộ catalogue đã được sửa để **giữ `protocols` trong CMS**; seed vẫn không chứa quy trình. Test tái hiện việc mất nội dung trước bản sửa và kiểm tra nội dung được giữ sau bản sửa. `benefits` và `duration` vẫn theo chính sách cũ. Đây là thay đổi theo quyền biên tập mới mà chủ dự án vừa cho phép, thay cho việc luôn xóa quy trình ở kế hoạch catalogue ban đầu.

## Giới hạn truy cập

Các nguồn chính được mở đọc phần đã chỉ rõ. Ohio đọc qua `curl` và HTML parser sau lỗi timeout; không dựa riêng đoạn tìm kiếm. CHOA trả 403 qua web và tải trực tiếp nên không dùng. East Kent timeout trong lần đối chiếu mới; đã dùng North Tees làm nguồn độc lập đọc được, không nói đã đọc lại East Kent lần này. Các nguồn có đoạn quảng bá/lợi ích hoặc phác đồ riêng được giới hạn vào mô tả thao tác nêu trên.
