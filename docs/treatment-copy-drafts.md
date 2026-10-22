# Bản nháp nội dung liệu pháp trước lần rà soát 22/10/2026

Nội dung dưới đây được giữ để đối chiếu lịch sử biên tập. Bản đã duyệt trước đây đã nhập lên Sanity staging, sau đó được rà soát lại theo yêu cầu ngày 22/10/2026. Nguồn và nội dung đang dùng: [TREATMENT_CONTENT_AUDIT.md](TREATMENT_CONTENT_AUDIT.md), `lib/content.ts` và `scripts/seed/treatments.json`. Không dùng các đoạn nháp bên dưới để ghi đè bản đã nghiên cứu.

Thông tin giáo dục chung về Điện xung và các FAQ an toàn đã được đối chiếu nguồn ngoài. Loại máy, thông số, thời lượng, phác đồ và xác nhận chuyên môn riêng của phòng khám vẫn cần người phụ trách cung cấp; việc nghiên cứu nguồn chung không thay thế xác nhận đó.

Trạng thái cũ: **chưa duyệt, chưa đưa vào site hay Sanity.** Mỗi đoạn chỉ dựa trên bài fanpage và bảng giá đã đọc (xem `docs/treatment-fanpage-research.md`). Không có thời lượng, quy trình hay cam kết kết quả vì chưa có nguồn.

Cách duyệt: ghi **Duyệt**, **Sửa** (kèm câu sửa) hoặc **Bỏ** cho từng mục. Sau đó mình nhập vào Sanity.

Mỗi mục gồm "Giới thiệu" (trường `description`, hiện ở phần Giới thiệu của trang) và FAQ nếu có nguồn. Mô tả ngắn (`shortDescription`) giữ nguyên trừ khi có ghi chú.

---

## 1. Giác hơi (`cupping`)

**Cần quyết định trước:** mô tả ngắn hiện tại ghi "giải độc cơ thể", trái với bài fanpage (giác hơi không hút độc tố). Đề xuất đổi mô tả ngắn thành:

> Dùng ống giác hơi tạo áp suất âm trên da để kéo giãn mô, kích thích lưu thông máu và giảm căng cứng cơ.

Bảng giá cũng ghi "giải độc", nên chủ phòng khám cần chốt cách viết chung.

**Giới thiệu (nháp):**

> Khi cơ bắp căng và tuần hoàn kém, mô có thể thiếu oxy và co cứng. Giác hơi dùng ống hút tạo áp lực lên da, giúp kéo giãn lớp cân, giảm áp lực mô và kích thích lưu thông máu.
>
> Giác hơi không "hút độc tố" ra khỏi cơ thể. Giá trị của kỹ thuật nằm ở việc giúp những vùng đang co cứng được "mở khoá", và hiệu quả tốt hơn khi kết hợp với tập luyện đúng cách.

**FAQ (nháp):**

- **Giác hơi có hút độc không?** Không. Giác hơi giúp tăng tuần hoàn máu và giảm áp lực mô, chứ không đưa "độc tố" ra khỏi cơ thể như nhiều người vẫn nghĩ.
- **Vết đỏ hoặc tím sau khi giác hơi nghĩa là gì?** Đó là phản ứng sinh lý của các mạch máu nông tại vùng được giác, không phải "độc tố" được hút ra.

Nguồn: bài "CUPPING THERAPY" trên fanpage.

---

## 2. Xung kích (`shockwave`)

**Giới thiệu (nháp):**

> Sóng xung kích (Extracorporeal Shockwave Therapy – ESWT) là một liệu pháp cơ học. Sóng được truyền vào mô đang bị trì trệ để kích hoạt lại quá trình hồi phục tự nhiên của cơ thể.
>
> Đây không phải "máy bắn cho đỡ đau": mục tiêu là hỗ trợ mô phục hồi, kết hợp với cách vận động và tập luyện phù hợp.

Nguồn: bài về ESWT trên fanpage. Câu cuối về kết hợp với tập luyện là cách viết chung theo hướng của phòng khám; nếu không đúng với liệu trình thực tế, hãy **Bỏ**.

Không có FAQ vì chưa có nguồn.

---

## 3. Nắn chỉnh cột sống (`chiropractic-adjustment`)

**Giới thiệu (nháp):**

> Khớp là nơi các xương gặp nhau, và chất lượng vận động của khớp phụ thuộc vào mô mềm xung quanh, độ trượt khớp, khả năng chịu tải và sự phối hợp thần kinh – cơ.
>
> Kỹ thuật tác động khớp nhẹ nhàng, chính xác giúp giảm hạn chế ở mô mềm quanh khớp, tăng nhận thức cảm giác – vận động của khớp và cải thiện biên độ cũng như chất lượng chuyển động.

Nguồn: bài "Tác động khớp: vì sao chỉ 15 phút cũng có thể tạo khác biệt". Bài nói về "tác động khớp" nói chung, không ghi riêng "nắn chỉnh cột sống". Chủ phòng khám xác nhận đây là cùng một dịch vụ.

Liệu pháp này cần chuyên viên có chứng nhận; trang đã có ghi chú đó, không thêm vào nháp.

Không có FAQ vì chưa có nguồn.

---

## 4. Ngâm lạnh (`cold-plunge`)

**Giới thiệu (nháp):**

> Ngâm mình trong nước lạnh làm các mạch máu co lại, giảm lưu lượng máu đến vùng đang ngâm và giúp giảm sưng, nhờ đó có thể giảm đau mỏi cơ. Cơ bắp phục hồi nhanh hơn sau buổi tập nặng.
>
> Nước lạnh cũng tác động lên hệ thần kinh trung ương, hỗ trợ giấc ngủ và giảm căng thẳng, mệt mỏi. Vì vậy ngâm lạnh được nhiều vận động viên và người tập luyện lựa chọn, nhất là khi mùa thi đấu đến gần.

Nguồn: bài Ngâm lạnh (15/8/2024) và các bài cùng chủ đề.

**Cố ý không đưa vào:** đốt mỡ, làm đẹp da/collagen, tăng miễn dịch, combo 375k, địa chỉ và giờ cũ. Đây là các tuyên bố mạnh hơn hoặc thông tin đã lỗi thời. Nếu muốn thêm, hãy ghi rõ.

Không có FAQ vì chưa có nguồn.

---

## Nguồn ngoài fanpage

Các mục 5–11 không có bài fanpage nên dựa trên nguồn y khoa công khai (bảng ở cuối). Mình chỉ viết điều các nguồn nêu, dùng "có thể", "hỗ trợ" và không cam kết kết quả. Mô tả một câu trong bảng giá của phòng khám vẫn là mốc chính; phần dưới chỉ giải thích thêm. **Cần chuyên viên của phòng khám đọc lại**, nhất là các mục an toàn.

---

## 5. IASTM (`iastm`)

**Giới thiệu (nháp):**

> IASTM là kỹ thuật trị liệu thủ công, trong đó chuyên viên dùng dụng cụ cứng, được thiết kế chuyên dụng, vuốt trên da để tác động lên cơ và lớp cân (fascia).
>
> Dụng cụ giúp chuyên viên tác động sâu hơn và chính xác hơn so với chỉ dùng tay. Kỹ thuật có thể hỗ trợ tăng biên độ vận động và giảm cảm giác đau ở một số tình trạng cơ xương khớp, và thường được kết hợp với bài tập hoặc các liệu pháp khác thay vì dùng riêng lẻ.

Không có FAQ vì chưa có nguồn đủ chắc.

## 6. Châm khô (`dry-needling`)

**Giới thiệu (nháp):**

> Châm khô dùng kim mảnh, đặc, không chứa thuốc, đưa vào các điểm co cứng (trigger point) hoặc mô cơ lân cận. Mục tiêu là giảm căng cứng cơ và đau cơ xương khớp.
>
> Cơ chế chưa được hiểu hết. Một số giải thích cho rằng kim giúp phục hồi lưu thông máu tại điểm co cứng, tạo một co giật nhẹ tại chỗ làm cơ bớt căng, hoặc kích thích cơ thể tiết chất giảm đau tự nhiên. Châm khô thường là một phần của kế hoạch trị liệu có kết hợp bài tập và giãn cơ.

**FAQ (nháp):**

- **Châm khô có an toàn không?** Khi do chuyên viên được đào tạo thực hiện, tác dụng phụ thường nhẹ và ngắn hạn, như đau nhức, bầm hoặc chảy máu nhẹ tại chỗ. Biến cố nghiêm trọng được ghi nhận là rất hiếm và thường liên quan đến người thực hiện chưa được đào tạo đầy đủ.

Liệu pháp cần chuyên viên có chứng nhận; trang đã có ghi chú đó.

## 7. Đèn hồng ngoại (`heat-light`)

**Giới thiệu (nháp):**

> Đèn hồng ngoại làm ấm mô ở vùng được chiếu. Hơi ấm có thể giúp cơ thư giãn, bớt căng và tăng lưu thông máu tại chỗ.
>
> Bằng chứng rõ nhất là với tình trạng đau nhức cơ sau tập nặng; với đau mạn tính, nghiên cứu còn ít và chưa thống nhất. Đèn hồng ngoại thường được dùng như một bước bổ trợ trong buổi trị liệu.

**FAQ (nháp):**

- **Đèn hồng ngoại có gây bỏng không?** Chiếu quá lâu hoặc quá gần có thể gây bỏng da cục bộ, vì vậy thời gian chiếu cần được giới hạn và da được kiểm tra thường xuyên.

## 8. Tapping (`tapping`)

**Giới thiệu (nháp):**

> Tapping dùng băng dính đàn hồi dán lên da quanh cơ hoặc khớp. Băng đủ co giãn để vẫn cho phép vận động, khác với nẹp cố định.
>
> Tapping có thể hỗ trợ cảm nhận vị trí khớp trong lúc vận động và giúp bạn dễ chịu hơn trong quá trình phục hồi. Các nghiên cứu cho thấy lợi ích thường nhỏ và ngắn hạn, nên tapping phù hợp nhất khi kết hợp với tập luyện phục hồi.

**FAQ (nháp):**

- **Tapping có tác dụng phụ không?** Một số người có thể bị ngứa hoặc kích ứng da tại chỗ dán.

## 9. Điện xung (`bio-electric`)

**Giới thiệu (nháp):**

> Điện xung dùng các xung điện nhẹ truyền qua miếng dán trên da để tác động lên dây thần kinh và cơ. Tùy chế độ cài đặt, xung điện có thể được dùng để giảm đau hoặc để kích hoạt cơ co lại, hỗ trợ lấy lại khả năng kiểm soát vận động.
>
> Điện xung thường được kết hợp với massage trị liệu và các bài tập, thay vì dùng riêng lẻ.

**Cần xác nhận:** loại thiết bị và chế độ phòng khám dùng (giảm đau kiểu TENS hay kích hoạt cơ kiểu NMES). Đoạn trên viết chung cho cả hai; nếu biết chính xác, mình sẽ sửa cho cụ thể. Fanpage gọi liệu pháp này là "điện sinh học" trong bài combo với massage.

## 10. Sóng siêu âm (`therapeutic-ultrasound`)

**Giới thiệu (nháp):**

> Sóng siêu âm trị liệu dùng đầu phát đặt trên da, có bôi gel để sóng truyền tốt hơn. Sóng làm ấm mô bên dưới và có tác động cơ học nhẹ lên tế bào, qua đó có thể giúp giảm đau, giảm căng cơ và hỗ trợ quá trình hồi phục.
>
> Năng lượng giảm dần khi đi sâu vào mô, nên liệu pháp thường nhắm vào vùng tổn thương nông và được kết hợp với các phương pháp khác.

## 11. Điện châm (`electroacupuncture`)

**Giới thiệu (nháp):**

> Điện châm kết hợp châm kim với dòng điện nhẹ truyền qua một cặp kim. So với châm thủ công, chuyên viên có thể điều chỉnh cường độ kích thích chính xác hơn.
>
> Dòng điện kích thích các dây thần kinh, từ đó có thể giúp giảm đau và thư giãn cơ. Cường độ được điều chỉnh sao cho bạn chịu được thoải mái.

**FAQ (nháp):**

- **Ai cần báo trước với chuyên viên?** Người đang dùng máy tạo nhịp tim cần báo trước, vì dòng điện có thể ảnh hưởng đến thiết bị. **Chuyên viên của phòng khám cần xác nhận câu này.**

Liệu pháp cần chuyên viên có chứng nhận; trang đã có ghi chú đó.

---

## Nguồn tham khảo

- Châm khô: [Cleveland Clinic](https://my.clevelandclinic.org/health/treatments/16542-dry-needling), [PMC – biến cố bất lợi](https://pmc.ncbi.nlm.nih.gov/articles/PMC7015026/), [APTA](https://www.apta.org/article/2025/12/14/apta-statement-on-the-safe-use-of-dry-needling-by-physical-therapists)
- IASTM: [PMC – cơ chế và ứng dụng](https://pmc.ncbi.nlm.nih.gov/articles/PMC5331993/), [PMC – tác động lên đặc tính cơ xương](https://pmc.ncbi.nlm.nih.gov/articles/PMC6798743/)
- Tapping: [Harvard Health](https://www.health.harvard.edu/bones-and-joints/kinesio-taping-offers-only-modest-relief-for-musculoskeletal-disorders), [PMC – tổng quan trong y học thể thao](https://pmc.ncbi.nlm.nih.gov/articles/PMC7028772/)
- Sóng siêu âm: [PMC – ứng dụng và an toàn](https://pmc.ncbi.nlm.nih.gov/articles/PMC3810427/), [PubMed – các phản ứng sinh lý](https://pubmed.ncbi.nlm.nih.gov/36115728/)
- Điện châm: [PMC – điện châm giảm đau zona](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9273388/), [PMC – an toàn của kim](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6819646/)
- Điện xung (TENS/NMES): [PMC – kích thích điện cho tổn thương thần kinh ngoại biên](https://pmc.ncbi.nlm.nih.gov/articles/PMC9998520/), [PubMed – TENS khi tập kháng lực](https://pubmed.ncbi.nlm.nih.gov/29978261)
- Đèn hồng ngoại: [PubMed – đèn hồng ngoại xa sau tập nặng](https://pubmed.ncbi.nlm.nih.gov/36825876/), [Cleveland Clinic – xông hơi hồng ngoại](https://health.clevelandclinic.org/infrared-sauna-benefits)

## Còn thiếu

- Thời lượng và quy trình từng bước của cả 11 liệu pháp: không có nguồn công khai áp dụng được cho phòng khám này, cần chủ phòng khám cung cấp.
- Ảnh cho Tapping, Xung kích, Sóng siêu âm, Điện châm, Nắn chỉnh cột sống.
