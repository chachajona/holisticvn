# Rà soát nội dung bốn liệu pháp dùng thiết bị

Ngày rà soát: 2026-10-22. Phạm vi: `shockwave`, `bio-electric`, `therapeutic-ultrasound`, `electroacupuncture`. Bản nội dung có cấu trúc nằm ở `.context/treatment-audit/devices.json`, gồm mô tả ngắn, hai đoạn giới thiệu, FAQ, SEO, nguồn và câu hỏi dành cho phòng khám. Không thay tên dịch vụ, giá, slug, tên tiếng Anh hay cờ yêu cầu chuyên viên có chứng nhận.

Đã đối chiếu `PRODUCT.md`, bản nháp nội dung, seed và bản kiểm tra staging. Giọng viết áp dụng humanizer ở chế độ embedded: thông tin cụ thể, câu ngắn vừa phải, không thêm trải nghiệm giả, không dùng cơ chế sinh học để hứa hẹn kết quả.

## Xung kích

Mô tả ngắn hiện tại hứa tái tạo mô và giảm đau nhanh. Giới thiệu nói mô “trì trệ” rồi được “kích hoạt lại”, trong khi tài liệu Oxford nói cơ chế chưa được hiểu đầy đủ. Bản sửa giải thích sóng cơ học, bối cảnh một số vấn đề gân/cân gan chân kéo dài và mục tiêu giảm đau để sinh hoạt, tập phục hồi dễ hơn. FAQ bổ sung cảm giác thực tế, giới hạn kỳ vọng và thông tin sức khỏe cần trao đổi.

Nguồn chính đã đọc: [Oxford University Hospitals, tài liệu người bệnh về gân Achilles, 2025](https://www.ouh.nhs.uk/patient-guide/leaflets/files/86722shockwave.pdf), [Royal Devon, ESWT, 2024](https://www.royaldevon.nhs.uk/media/ktffxirh/extracorporeal-shockwave-therapy-eswt-rd-e-20-022-005.pdf). Hai nguồn hỗ trợ cách thực hiện, cảm giác và sàng lọc, không xác nhận quy trình riêng của Holistic.

Riêng đau cân gan chân dai dẳng, [NICE HTG200, thông tin cho người bệnh](https://www.nice.org.uk/guidance/htg200/resources/treating-chronic-plantar-fasciitis-using-shockwave-therapy-pdf-312696253) nêu hiệu quả chưa chắc chắn và nghiên cứu không nhất quán. Không mở rộng kết luận này thành “ESWT không hiệu quả với mọi bệnh”, cũng không biến các giải thích tuần hoàn/tế bào thành lời hứa tái tạo mô.

Phòng khám cần xác nhận thiết bị hướng tâm hay hội tụ, chỉ định và cách theo dõi. Chưa có ảnh thực tế. Không mượn số buổi, lịch điều trị hay hướng dẫn thuốc của NHS để đặt vào trang Holistic.

## Điện xung

“Bio-electric” chưa xác định loại máy hay chế độ. Mô tả hiện tại gộp giảm đau, kích hoạt cơ và kiểm soát vận động thành một tác dụng. Bản sửa phân biệt các mục tiêu này ở mức kiến thức chung, rồi đề nghị người bệnh hỏi rõ loại thiết bị trước khi lựa chọn. Không khẳng định máy ở Holistic là TENS hoặc NMES, không kể vị trí điện cực hay mô tả cách truyền điện khi chưa có dữ liệu.

[NHS, TENS](https://www.nhs.uk/tests-and-treatments/transcutaneous-electrical-nerve-stimulation-tens/) nói về giảm đau tạm thời, cảm giác râm ran, khác biệt đáp ứng và các lưu ý của riêng TENS. [Royal National Orthopaedic Hospital, EMS, tháng 7/2026](https://www.rnoh.nhs.uk/patients-and-visitors/patient-information-guides/electrical-muscle-stimulation-ems) phân biệt EMS với TENS và giải thích mục tiêu co cơ trong phục hồi một số tổn thương thần kinh ngoại biên. Trang RNOH đã được đọc đầy đủ qua HTTP khi công cụ web gặp 403.

Hai tài liệu không chứng minh thiết bị ở phòng khám thuộc nhóm nào. FAQ về cảm giác và sàng lọc vì thế được viết có điều kiện. Ảnh `ElectroPulse.jpg` và cách gọi “điện sinh học” không đủ để suy ra cơ chế. Hãng/model, chế độ, cách truyền điện, chỉ định và tiêu chí sàng lọc vẫn là câu hỏi riêng cho phòng khám.

## Sóng siêu âm

Bản cũ suy ra rằng năng lượng giảm theo độ sâu nên phương pháp thường dành cho tổn thương nông. Suy luận đó không đủ: tần số và cài đặt ảnh hưởng đến độ sâu tác động. Bản sửa bỏ nhận định về độ sâu, cũng bỏ chuỗi khẳng định giảm đau, tăng tuần hoàn và thúc đẩy tự chữa lành cho mọi tình trạng.

[South Tees Hospitals, electrotherapy](https://www.southtees.nhs.uk/services/physiotherapy/community-outpatient-physiotherapy-middlesbrough-redcar-and-cleveland/what-treatments-are-available/what-is-electrotherapy/) hỗ trợ giải thích sóng cơ học tần số cao, gel truyền sóng và cảm giác rất ít khi máy hoạt động. [Health Canada, hướng dẫn sử dụng siêu âm an toàn](https://www.canada.ca/en/health-canada/services/environmental-workplace-health/reports-publications/radiation/guidelines-safe-use-ultrasound-part-medical-paramedical-applications-excerpt-safety-code-23-1989-health-canada.html) hỗ trợ các câu hỏi về thai kỳ, cảm giác nóng/đau, tuần hoàn, nhiễm trùng và khối u. Đây là tài liệu an toàn vật lý cũ, không dùng để tuyên bố hiệu quả hay thông số hiện tại.

FAQ nêu đúng phạm vi [NICE NG59, mục 1.2.9](https://www.nice.org.uk/guidance/ng59/chapter/recommendations): không khuyến nghị siêu âm cho đau thắt lưng, có hay không có đau thần kinh tọa. [NICE NG226, mục 1.3.9](https://www.nice.org.uk/guidance/NG226/chapter/recommendations) cũng không khuyến nghị siêu âm cho thoái hóa khớp vì chưa đủ bằng chứng lợi ích; dùng để kiểm tra giới hạn tuyên bố, không làm câu kết luận cho mọi bệnh.

Không dùng bằng chứng về siêu âm chẩn đoán, HIFU, siêu âm làm liền xương hay ESWT để suy ra hiệu quả siêu âm vật lý trị liệu. Máy, chỉ định, cách theo dõi và ảnh thực tế tại Holistic cần xác nhận riêng.

## Điện châm

Bản cũ nói “tăng hiệu quả” giảm đau và cải thiện tuần hoàn mà không có bằng chứng đủ để khẳng định điện châm tốt hơn châm thủ công. Bản sửa giải thích kích thích điện qua kim và giới hạn nghiên cứu theo bệnh lý. Không lấy nghiên cứu đau zona hay bằng chứng châm cứu nói chung làm bằng chứng hiệu quả riêng cho điện châm cơ xương khớp.

[Royal Wolverhampton NHS, tài liệu người bệnh về châm cứu](https://www.royalwolverhampton.nhs.uk/wp-content/uploads/2025/05/Accupuncture.pdf) được dùng cho cảm giác châm/tê râm ran khi điện châm và rủi ro liên quan đến kim. Không dùng phần lợi ích của châm cứu nói chung để chứng minh hiệu quả điện châm. [East London NHS, hướng dẫn thực hành an toàn, 2025](https://www.elft.nhs.uk/sites/default/files/2026-05/DA6391%20Appendix%201.pdf) có phần riêng về điện châm và thiết bị tim cấy ghép. Chính sách của Trust không xác nhận Holistic đã sàng lọc hay thông qua bất kỳ người bệnh nào.

Một [RCT đa trung tâm về điện châm cho thoái hóa khớp gối, 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13223986/) ghi nhận lợi ích triệu chứng/chức năng. Các kết quả MRI là thăm dò; không đủ để viết “tái tạo sụn”. Một [thử nghiệm thăm dò nhỏ, 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7414333/) không chứng minh ưu thế nhất quán trên các tiêu chí chức năng. Hai nghiên cứu đều được đọc ở toàn văn qua Europe PMC khi PMC hiển thị CAPTCHA: [XML RCT 2026](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC13223986/fullTextXML), [XML thử nghiệm 2020](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7414333/fullTextXML). Không chuyển lịch, cường độ hay số buổi trong nghiên cứu thành phác đồ của phòng khám.

FAQ về máy tạo nhịp, thai kỳ, thuốc chống đông và rủi ro là giáo dục chung có nguồn. Phần riêng về chuyên viên, thiết bị, sàng lọc và kim vô khuẩn dùng một lần vẫn ở `clinicQuestions`. Ảnh stock hiện tại là kim châm thông thường, không chứng minh có bộ kích thích điện; cần giữ nhãn ảnh minh họa.

## Giới hạn truy cập và xác minh

Các PDF Oxford, Royal Devon, Royal Wolverhampton và East London, cùng trang NHS TENS, South Tees và Health Canada đã được mở đọc phần nội dung liên quan. RNOH đọc qua HTTP trực tiếp. Toàn văn hai RCT điện châm đọc qua Europe PMC như liên kết trên.

NICE trả 403 khi mở trực tiếp HTML/PDF ở phiên này. Đã đọc văn bản khuyến nghị và ngữ cảnh tương ứng từ bản chính thức được công cụ tìm kiếm trả về, gồm HTG200 thông tin cho người bệnh, NG59 mục 1.2.9 và NG226 mục 1.3.9. Không ghi nhận đã đọc toàn văn các trang NICE qua HTTP. Royal Berkshire có kết quả tìm kiếm nhưng PDF trả 404; không dùng làm nguồn chính cho bản đề xuất.

Nội dung đã rà soát không bổ sung thời lượng, thông số, liệu trình hay thông tin chứng chỉ. Câu hỏi còn thiếu tách khỏi phần nội dung dành cho bệnh nhân để tránh biến điều cần hỏi thành thông tin đã được xác nhận.
