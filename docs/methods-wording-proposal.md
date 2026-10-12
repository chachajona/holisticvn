# Bản đề xuất wording năm nhóm phương pháp

Ngày: 2026-10-12. Trạng thái: **owner đã duyệt và yêu cầu cập nhật CMS/website ngày 2026-10-12**. Đây là câu chữ biên tập mới, không phải trích nguyên văn bảng dịch vụ. Nội dung các nhóm đã cập nhật đồng bộ fallback, seed và CMS staging; bộ lọc đã triển khai trên website và Preview. Nhánh vẫn giữ local, production chưa triển khai.

## Căn cứ và phạm vi

- Hai bảng dịch vụ Việt/Anh do owner cung cấp: `.context/attachments/MQH1KT/Screenshot 2026-10-09 at 12.13.02.png` và `.context/attachments/6Q7z5P/Screenshot 2026-10-09 at 12.12.47.png`. Đây là nguồn xác nhận danh mục và cách thương hiệu mô tả dịch vụ; không phải bằng chứng độc lập về hiệu quả điều trị.
- [PRODUCT.md](../PRODUCT.md): tiếng Việt trước, một lộ trình tư vấn → trị liệu → tập luyện; phục vụ cả sinh hoạt, làm việc và thể thao.
- [Nghiên cứu giọng fanpage](facebook-wording-research.md): ưu tiên tình huống và hoạt động người đọc hình dung được. Báo cáo đã đọc các bài gốc ngày 2026-10-09; lượt này sử dụng lại báo cáo, không tuyên bố đã đọc lại fanpage.
- [Đối chiếu nguồn chuyên môn](methods-wording-research.md): giải thích phương pháp và giới hạn của các phát biểu về lợi ích.
- Bản tinh chỉnh owner gửi tại `.context/attachments/sDp3ez/pasted_text_2026-10-12_16-07-06.txt`: đầu vào biên tập về giọng văn, nhãn và ánh xạ. Đã tiếp thu câu chủ động và cảm nhận đời thường; file này không tự xác nhận các cơ chế, quy trình tại phòng khám hay hiệu quả điều trị mới.

Giữ năm nhóm, mã nhóm, anchor, ánh xạ và vị trí “Liệu pháp liên quan” đã duyệt. Hai tên hiển thị mới đã được chấp thuận cùng yêu cầu cập nhật; không thay đổi phân nhóm kỹ thuật. Giá và thời lượng dịch vụ nằm ngoài bản nháp này.

## Câu dẫn đã duyệt

Holistic đánh giá khả năng vận động, rồi kết hợp trị liệu và bài tập phù hợp với nhu cầu của bạn.

Owner duyệt bản rút gọn trên ngày 2026-10-12 để mô tả hero ngắn và dễ đọc hơn. Câu dẫn được cập nhật trực tiếp tại `app/treatments/page.tsx`.

CTA: **Đặt lịch đánh giá ban đầu**.

## 1. Trị liệu thủ công — `manual`

**Mô tả**

Chuyên viên kết hợp massage, vận động khớp và các kỹ thuật tác động lên mô mềm để hỗ trợ giảm đau mỏi, giảm căng cứng và giúp bạn cử động dễ hơn. Kỹ thuật phù hợp tùy theo tình trạng vận động của bạn.

**Nhãn được gắn:** Đau mỏi cổ vai gáy · Đau lưng · Căng cứng cơ · Khó cử động · Giảm đau mỏi.

Tên này giữ cách gọi đã duyệt. Phần mô tả giải thích các hoạt động tiêu biểu, không coi mọi kỹ thuật trong nhóm là cùng một cơ chế hoặc có cùng mức bằng chứng. IASTM, châm khô, giác hơi và “Tapping” giữ ánh xạ đã duyệt; không mở rộng tuyên bố về hiệu quả của từng kỹ thuật.

Căn cứ: bảng dịch vụ mô tả massage và can thiệp mô mềm; [NHS](https://www.nhs.uk/tests-and-treatments/physiotherapy/) giải thích manual therapy bằng massage và hỗ trợ chuyển động. Bỏ các phát biểu “nắn chỉnh tư thế lệch”, “giải độc”, “giảm chèn ép” khỏi mô tả ngắn. [NCCIH](https://www.nccih.nih.gov/health/cupping) nhận định bằng chứng giảm đau của giác hơi còn yếu và chưa đủ nghiên cứu chất lượng cho các lợi ích khác.

## 2. Trị liệu bằng thiết bị — `electro`

**Mô tả**

Holistic kết hợp điện xung, siêu âm hoặc xung kích với trị liệu và bài tập khi phù hợp. Mỗi kỹ thuật có cách tác động riêng, hướng đến giảm đau và giúp bạn vận động dễ dàng hơn.

**Nhãn được gắn:** Căng cứng cơ · Giảm đau mỏi.

**Tên hiển thị đã cập nhật:** “Điện trị liệu” → “Trị liệu bằng thiết bị”. Đây là tên bao quát các dịch vụ đã xếp vào `electro`, không có nghĩa mọi thiết bị của phòng khám đều chuyển vào nhóm này. Ngâm lạnh và hồng ngoại vẫn là hai nhóm riêng. Điện châm giữ ánh xạ đã duyệt; các kỹ thuật nêu trong mô tả là ví dụ, không phải danh sách đầy đủ.

Căn cứ: [NHS](https://www.nhs.uk/tests-and-treatments/physiotherapy/) phân biệt dòng điện của TENS và sóng âm của siêu âm; [Kent Community Health](https://www.kentcht.nhs.uk/leaflet/extracorporealshockwavetherapy/) mô tả xung kích bằng sóng âm. Không gọi cả nhóm là điện tần số thấp, không thêm “kháng viêm” hay “tái tạo mô nhanh”. Không suy từ tên “Điện xung” rằng thiết bị Holistic là TENS/NMES; chưa xác nhận chế độ cụ thể.

## 3. Tập luyện phục hồi & tăng cường — `rehab`

**Mô tả**

Bắt đầu từ khả năng vận động hiện tại, chuyên viên hướng dẫn các bài tập giúp bạn từng bước phục hồi sau chấn thương, tăng sức mạnh và kiểm soát chuyển động. Mức độ tập thay đổi theo mục tiêu sinh hoạt, công việc và thể thao của bạn.

**Nhãn được gắn:** Khó cử động · Giảm đau mỏi · Phục hồi sau chấn thương · Tăng sức mạnh · Kiểm soát chuyển động tốt hơn.

**Tên hiển thị đã cập nhật:** “Tập luyện phục hồi” → “Tập luyện phục hồi & tăng cường”, phản ánh cả hai chương trình trong bảng dịch vụ. Không đặt ranh giới cứng rằng phục hồi không có tập sức mạnh hoặc tăng cường chỉ dành cho vận động viên.

Căn cứ: bảng dịch vụ xác nhận chương trình cá nhân hóa và tập luyện tăng cường; [NHS](https://www.nhs.uk/tests-and-treatments/physiotherapy/) mô tả bài tập hỗ trợ chuyển động khớp và sức mạnh cơ. Nhu cầu sinh hoạt/làm việc/thể thao theo PRODUCT.md và chủ đề fanpage đã nghiên cứu. Bỏ hứa hẹn không tái chấn thương, thời gian hồi phục và kết quả cố định.

## 4. Ngâm lạnh — `cold`

**Mô tả**

Ngâm nước lạnh có thể giúp dịu cảm giác đau nhức cơ sau buổi tập hoặc vận động cường độ cao. Chuyên viên đánh giá sự phù hợp và hướng dẫn bạn trong buổi ngâm.

**Nhãn được gắn:** Hồi phục sau tập luyện.

Căn cứ: bảng dịch vụ xác nhận ngâm lạnh tại Holistic; [Cleveland Clinic](https://health.clevelandclinic.org/what-to-know-about-cold-plunges) mô tả khả năng làm dịu đau nhức cơ sau vận động và yêu cầu cân nhắc sức khỏe, mục tiêu tập luyện. “Có thể” giữ tính tùy trường hợp; không đồng nghĩa chữa chấn thương hoặc luôn hồi phục nhanh hơn. Không lặp lại “cải thiện khả năng chịu đựng của hệ thần kinh”. Không đưa nhiệt độ/thời lượng áp dụng chung lên website.

## 5. Đèn hồng ngoại — `infrared`

**Mô tả**

Đèn hồng ngoại làm ấm vùng được chiếu. Holistic sử dụng sức ấm này để hỗ trợ cảm giác thư giãn, dễ chịu và phối hợp với các phương pháp khác khi phù hợp.

**Nhãn được gắn:** Căng cứng cơ.

Căn cứ: [MOHW/TFDA](https://www.mohw.gov.tw/cp-16-67526-1.html) mô tả đèn hồng ngoại cung cấp nhiệt tại chỗ. “Thư giãn” là mục tiêu được nêu trong bảng dịch vụ của thương hiệu; bản nháp không khẳng định hiệu quả lâm sàng đã được chứng minh riêng cho đèn Holistic. Bỏ “thúc đẩy tự chữa lành”, không suy rộng bằng chứng của laser, sauna hay siêu âm sang đèn hồng ngoại. Không ấn định đây luôn là bước cuối buổi trị liệu.

## Bộ lọc theo tình trạng và nhu cầu — bản triển khai

Owner yêu cầu tag có thể nhấn để lọc theo tình trạng và nhu cầu, rồi chấp thuận cập nhật CMS/website. `/treatments` dùng nút chọn nhãn; CMS lưu mã cố định trong `filterTags`. Trường `tags` cũ giữ nhãn tiếng Việt tại thời điểm chuyển đổi cho bản website cũ và chỉ đọc trong Studio mới; các lần sửa bộ lọc sau đó dùng `filterTags`, không đồng bộ ngược trường lịch sử.

Danh mục dùng chung (website chỉ hiện nhãn đã gắn vào nội dung):

| Nhóm nhãn          | Lựa chọn                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Tình trạng của bạn | Đau mỏi cổ vai gáy · Đau lưng · Đau vùng hông/chậu · Căng cứng cơ · Khó cử động                                  |
| Mục tiêu của bạn   | Giảm đau mỏi · Phục hồi sau chấn thương · Hồi phục sau tập luyện · Tăng sức mạnh · Kiểm soát chuyển động tốt hơn |

Đây là nhãn người dùng tự nhận biết triệu chứng hoặc mục tiêu, không phải chẩn đoán. Danh mục dựa trên nhu cầu trong PRODUCT.md và bảng dịch vụ. Các nhãn đã gắn được ghi ngay dưới mô tả từng nhóm; “Đau vùng hông/chậu” chưa gắn vào nhóm nào nên chưa xuất hiện trong bộ lọc website. Không tự gán mọi nhãn đau cho mọi phương pháp hoặc đồng nhất đau nhức sau tập với đau do chấn thương.

“Làm ấm”, “Hỗ trợ trị liệu” mô tả thao tác thay vì nhu cầu; bỏ khỏi danh mục lọc. Giữ “Kiểm soát chuyển động tốt hơn” như một mục tiêu riêng theo bản tinh chỉnh owner gửi, vì đây là chủ đề đã ghi nhận trong nghiên cứu fanpage. Khi triển khai có thể thêm giải thích ngắn “vận động vững vàng, dễ điều khiển hơn” cho khách mới. Không đặt hạn mức ba tag cho mỗi nhóm nếu không có lý do về nội dung.

Tách “Đau lưng” và “Đau vùng hông/chậu” để khách chọn vùng họ muốn tìm hiểu, thay vì gộp các vùng thành một tag. Rút “Khớp cử động khó / không mượt” thành “Khó cử động” để nhãn ngắn và không mặc định khó khăn đó bắt nguồn từ khớp. Giữ “Phục hồi sau chấn thương” thay vì chỉ chấn thương thể thao để bao phủ cả người không chơi thể thao. Giảm đau mỏi có thể là mục tiêu trong sinh hoạt hoặc tập luyện; không dùng hoàn cảnh đó để tự phân loại nguyên nhân đau.

Ánh xạ trong file owner gửi là bản gợi ý, chưa xem là chỉ định điều trị đã được xác nhận. Bản triển khai chọn ánh xạ thận trọng:

- Rà lại nhóm `rehab` cho nhu cầu giảm đau/cải thiện vận động, để bộ lọc không vô tình chỉ đưa khách đang đau tới trị liệu tay hoặc thiết bị. PRODUCT.md mô tả một lộ trình có tập luyện, nhưng không đủ để tự gán mọi tag vùng đau vào nhóm này.
- Không suy từ “Căng cứng cơ” rằng ngâm lạnh phù hợp; bản mô tả có nguồn hiện giới hạn ở đau nhức cơ sau vận động. Nếu cần lọc theo cảm giác này, dùng một nhãn riêng “Đau nhức cơ sau tập” sau khi xác nhận danh mục, thay vì trộn mọi loại căng cứng.
- Nhãn cổ vai gáy/hông chậu cho từng thiết bị hoặc đèn hồng ngoại vẫn cần căn cứ dịch vụ thực tế. Ảnh một vùng cơ thể hay một bài về một ca không tự xác nhận phạm vi áp dụng chung.

Luồng đã triển khai:

1. Đặt bộ lọc ở đầu phần nội dung với tiêu đề **Bạn đang gặp vấn đề gì hoặc muốn cải thiện điều gì?**; mặc định hiển thị đủ năm nhóm.
2. Cho chọn nhiều nhãn. Trong phiên bản đầu với chỉ năm nhóm, hiển thị các nhóm có **ít nhất một** nhãn đang chọn, kể cả khi chọn ở cả hai hàng. Lời dẫn: **Chọn một hoặc nhiều mục. Kết quả liên quan đến ít nhất một mục bạn chọn.** Quy tắc này là đề xuất biên tập cho Holistic, không phải quy tắc được suy ra từ nguồn UX hay công cụ chẩn đoán.
3. Tag trên từng nhóm dùng cùng danh mục và có thể nhấn để chọn/bỏ chọn; trạng thái đồng bộ với bộ lọc phía trên.
4. Hiện **Đang hiển thị X phương pháp**, các lựa chọn đang bật và nút **Xóa bộ lọc**. Không tự cuộn trang khi chọn ở bộ lọc đầu trang. Nếu bỏ chọn tag làm nhóm đang xem bị ẩn, control tương ứng được đưa vào vùng nhìn thấy để giữ focus bàn phím.
5. Khi không có kết quả: **Chưa có phương pháp được gắn với lựa chọn này. Bạn có thể xóa bộ lọc hoặc đặt buổi đánh giá để trao đổi với Holistic.** Không diễn giải thành phòng khám không hỗ trợ tình trạng đó.

Tham khảo UX: [MOJ Design System — Filter](https://design-patterns.service.justice.gov.uk/components/filter/) hỗ trợ chọn nhiều bộ lọc, hiển thị lựa chọn đang áp dụng, bỏ từng lựa chọn và xóa toàn bộ. Bộ nhãn, lọc tức thời và quy tắc khớp ít nhất một nhãn là đề xuất riêng cho trang này; nguồn không xác nhận ánh xạ y khoa.

Bản triển khai dùng mã nhãn ổn định và danh mục quản lý tập trung; CMS chọn từ danh mục thay vì nhập nhiều biến thể như “Đau lưng”/“Đau lưng dưới”. Chuyển tag hiển thị sang control native dùng được bằng bàn phím, thể hiện trạng thái chọn bằng chữ/dấu chọn cùng màu và thông báo số kết quả. Neo từ footer/link trực tiếp vẫn phải mở được nhóm đích dù trạng thái lọc đang ẩn nhóm đó; không đánh lại số thứ tự nhóm khi lọc.

CMS staging đã cập nhật `filterTags`; các nhãn tiếng Việt tương ứng cũng được lưu vào `tags` để giữ tương thích. Phần tương tác mở rộng #9 theo yêu cầu owner trong phiên này. Mục lục đầy đủ giải thích rằng nhấn một nhóm sẽ xóa bộ lọc. Bộ lọc giúp tìm nội dung để đọc; chuyên viên vẫn lựa chọn phương pháp qua đánh giá. Muốn mở rộng nhãn theo vùng đau cần đối chiếu dịch vụ thực tế trước khi gắn.

## Nguyên tắc đọc và trạng thái

Bản tinh chỉnh owner gửi giúp giọng văn chủ động hơn, nhưng không sử dụng kết luận “100% tuân thủ nguyên tắc y khoa”. Các lựa chọn biên tập cụ thể:

- Bỏ “phù hợp nhất”, “tối ưu hiệu quả”, “trúng đích vào điểm đau sâu”: chưa có căn cứ cho toàn bộ nhóm kỹ thuật hoặc kết quả của Holistic.
- Giữ “có thể” ở ngâm lạnh để không biến lợi ích tùy trường hợp thành kết quả chắc chắn. Chưa đưa hướng dẫn nhịp thở hay thời gian ngâm vào copy như một quy trình đã xác nhận của phòng khám.
- Đèn hồng ngoại: chỉ khẳng định làm ấm tại chỗ; thư giãn là mục tiêu thương hiệu. Chưa thêm tăng tuần hoàn, làm mềm cơ hay giúp cơ thể tiếp nhận can thiệp tốt hơn như hiệu quả đã chứng minh.
- Ba đối tượng trong PRODUCT.md vẫn là người làm văn phòng, người chơi thể thao phong trào và vận động viên chuyên nghiệp. “Cử động không ổn” là cảm nhận có thể gặp ở các nhóm này, không thay thế một nhóm đối tượng đã xác nhận.

Tag dùng chung sẽ giúp người mới lọc và quét nhanh triệu chứng hoặc mục tiêu, không phải danh sách chẩn đoán hay chỉ định tự chọn phương pháp. Câu dẫn và CTA đặt đánh giá trước việc lựa chọn kỹ thuật. Chưa kiểm chứng độ dễ hiểu bằng người dùng thật hoặc đo conversion.

“Tapping” xuất hiện đúng như vậy trong cả hai bảng giá. Nội dung gợi liên tưởng tới taping nhưng chưa xác nhận kỹ thuật; giữ nguyên trong hồ sơ ánh xạ, chưa tự đổi tên thành dán băng/kinesiology taping.

Các câu “tự chữa lành” và “khả năng chịu đựng của hệ thần kinh” thực sự có trong bảng dịch vụ owner vừa cung cấp. Bản mới giản lược để người đọc hiểu hành động và mục tiêu, đồng thời không chuyển lời quảng bá thành bảo đảm kết quả. Chưa sử dụng dòng chứng chỉ/chuyên viên có giấy phép trong bảng giá vì PRODUCT.md vẫn ghi credentials chưa xác nhận.

- [x] Owner duyệt mô tả năm nhóm.
- [x] Owner duyệt bộ nhãn dùng chung, ánh xạ nhãn vào nhóm và hành vi lọc.
- [x] Owner duyệt hai tên hiển thị mới.
- [x] Owner duyệt câu dẫn rút gọn; đã cập nhật trong mã nguồn trang ngày 2026-10-12.
- [x] Owner duyệt CTA mới nếu thay “Đặt buổi đánh giá”.

Đã cập nhật đồng bộ CMS staging, fallback và seed; `indexSubtitle` dùng mô tả kỹ thuật/mục tiêu ngắn, không lặp tuyên bố cũ. Nguồn thật và fallback đều được kiểm tra. Bằng chứng: [METHODS_FILTERS_VERIFICATION.md](METHODS_FILTERS_VERIFICATION.md). Giữ nhánh local theo yêu cầu của owner.
