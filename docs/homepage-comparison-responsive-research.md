# Research: giữ bảng so sánh đồng nhất trên desktop và mobile

Ngày: 2026-10-09. Yêu cầu mới của owner: giữ bảng so sánh hiện tại làm hướng chính; nghiên cứu bố cục hai kích thước và wording khi cần. Báo cáo này thay đề xuất chuyển thành ba ý giải thích trong `homepage-comparison-research.md`. Phần research được viết trước implementation; quyết định mới nhất ở ghi chú ngay sau. Các mẫu A/B/C trong `.context/` là nghiên cứu bố cục, không phải implementation production.

> Quyết định tiếp theo của owner và implementation: dùng hướng B, giữ bảng rộng, cố định tiêu chí và Holistic. Sau thảo luận về thanh kéo riêng, implementation dùng vùng cuộn ngang native và dòng gợi ý vuốt, không thêm client component. Bảng hiển thị cùng dữ liệu trên mobile/desktop. Đã xem 320, 390, 768 và 1440px; hai cột đầu giữ vị trí khi cuộn, document không tràn ngang và vùng bảng dùng được bằng phím mũi tên. Lint cho file page, typecheck và formatting đạt; không chạy unit test/build trong lượt thay đổi này. Các đề xuất A và mẫu dưới đây là nghiên cứu trước quyết định này. Ảnh implementation: `.context/comparison-native-390-start.png` và `.context/comparison-native-390-end.png`.

> Kiểm tra sau implementation theo yêu cầu owner: lint, typecheck, 61 tests và build đều đạt. Kết quả browser, warning ngoài bảng và các mục chưa kiểm chứng được ghi trong [homepage-comparison-checklist.md](homepage-comparison-checklist.md).

## Đề xuất chính

**Một bảng, cùng hàng/cột và cùng dữ liệu trên mọi màn hình. Desktop giữ ma trận hiện tại; mobile thu gọn ma trận, cuộn ngang khi thực sự thiếu chỗ.**

Với dữ liệu hiện tại chủ yếu là ký hiệu, một bảng năm cột vẫn hiển thị được tại 360–390px nếu giảm khoảng đệm và cho nhãn xuống dòng. Đây là suy luận từ nội dung cụ thể và đo mẫu, không phải quy tắc chung cho mọi bảng.

Tại 320px, giữ kích thước chữ và cho cuộn ngang một đoạn ngắn. Cố định cột tiêu chí và Holistic làm mốc. Giữ nguyên hướng hàng/cột khi đổi viewport; không lọc riêng lợi ích Holistic như code hiện tại.

## Các nguồn nghiên cứu và giới hạn

| Nguồn | Điều nguồn hỗ trợ | Cách áp dụng |
| --- | --- | --- |
| [NNGroup — Comparison Tables](https://www.nngroup.com/articles/comparison-tables/) | Tiêu chí có ý nghĩa, nội dung nhất quán, bố cục dễ quét; số lựa chọn nhỏ phù hợp bảng tĩnh. | Giữ bốn nhóm và một thứ tự hàng/cột. Rút gọn tên cột trước khi thu chữ. |
| [NNGroup — Mobile Tables](https://www.nngroup.com/articles/mobile-tables/) | Bảng ký hiệu/số có thể dùng cột hẹp hơn bảng nhiều chữ; bảng cần cuộn phải có dấu hiệu và mốc nhận diện. | Mẫu A thu gọn; khi thiếu chỗ, giữ tiêu chí/Holistic và thêm gợi ý vuốt. Nguồn không quy định mốc 360px hoặc kích thước 12px. |
| [Tensmeyer et al., WWW 2023 — Web Table Formatting Affects Readability on Mobile Devices](https://thereadabilityconsortium.org/wp-content/uploads/2023/10/Tensmeyer_etal_2023_Web-Table-Formatting-Affects-Readability-on-Mobile-Devices.pdf) | Trong nghiên cứu của tác giả, giảm padding giúp hoàn thành tác vụ nhanh hơn trung bình; frozen headers hữu ích ở tập bảng cần cuộn. | Ưu tiên giảm khoảng đệm trước khi giảm chữ. Giữ mốc khi cuộn. Không suy rộng thành tăng conversion của homepage hoặc font-size tối ưu cho tiếng Việt. |
| [W3C WAI — Tables with Two Headers](https://www.w3.org/WAI/tutorials/tables/two-headers/) | `th` và `scope` liên kết hàng/cột với dữ liệu. | Giữ native table và scope trên cả desktop/mobile. |
| [W3C WAI — Caption & Summary](https://www.w3.org/WAI/tutorials/tables/caption-summary/) | Caption nhận diện bảng, summary giải thích khi cần. | Thêm caption/tên truy cập; tên vùng cuộn và hướng dẫn đọc rõ. |

## Ba phương án đã dựng

| Phương án | Desktop | Mobile | Lợi ích | Đánh đổi |
| --- | --- | --- | --- | --- |
| **A — Ma trận thu gọn, đề xuất ưu tiên** | Đủ năm cột, gần bố cục hiện tại. | Đủ bốn giải pháp ở 360–390px; tại 320px cuộn khoảng 34px. | Đồng nhất hình thức và dữ liệu; không cần thao tác chọn để xem đầy đủ. | Header 12px, tên tiêu chí 13px; tên cột dài xuống nhiều dòng. Cần kiểm tra đọc hiểu thực tế. |
| **B — Hai cột cố định và cuộn ngang** | Đủ năm cột. | Tiêu chí và Holistic cố định; ba cột đối chiếu cuộn. | Có thể dùng header 13px, nhãn 14px trong mẫu; đọc rõ hơn. | Không thấy đủ bốn nhóm cùng lúc; người đọc phải vuốt. Hai cột cố định chiếm phần lớn bề ngang. |
| **C — Holistic và một cột do khách chọn** | Đủ năm cột. | Ba cột: tiêu chí / Holistic / nhóm được chọn. | Có thể dùng chữ 14px; bảng gọn, dễ đọc. | Muốn xem đủ phải đổi lựa chọn; việc so giữa các nhóm khác nhau cần nhớ hoặc đổi qua lại. Thêm control. |

Không chọn phương án chuyển mỗi cơ sở thành một card dài: nó đổi hướng đọc và khiến việc đối chiếu cùng tiêu chí khó hơn. Hiện sáu tiêu chí và các ô ngắn đủ đơn giản để giữ bảng.

![Ba phương án mobile](../.context/comparison-options-mobile.png)

Các dấu trong mẫu dùng dữ liệu hiện có để so hình thức. Chúng không phải dữ liệu đối chiếu đã được nghiên cứu/xác nhận. Nội dung bảng public cần xử lý riêng những ô khẳng định về nhóm cơ sở quá rộng.

## Bố cục cụ thể của phương án A

### Những yếu tố chung

- Cùng thứ tự: tiêu chí → Holistic → bệnh viện/phòng khám → spa → phòng tập/PT.
- Cùng thứ tự các hàng, cùng nội dung và ý nghĩa ký hiệu.
- Header Holistic sage, thân cột có nền sage rất nhạt xuyên suốt cả cột, thay vì chỉ tô các ô “Có”. Điểm nhấn vì thế ổn định khi thu màn hình.
- Nền cream, border mảnh và bán kính như thiết kế đang có. Giữ mốc hàng bằng đường kẻ nhẹ.
- Tăng độ rõ của dấu “Không”; legend dùng chữ thường, không tracking rộng, khoảng 12–13px.
- Dùng SVG và nhãn văn bản cho trạng thái; hình ký hiệu `aria-hidden`, chữ trạng thái được screen reader đọc.

### Desktop

- Cột tiêu chí khoảng 25%; bốn cột giải pháp chia đều phần còn lại.
- Tên cột khoảng 16–17px, tên tiêu chí khoảng 15–16px; padding theo hàng khoảng 18–20px.
- Ghi “Dịch vụ” hoặc “Tiêu chí” ở góc đầu bảng hiện đang trống.
- Rút tên “Phòng tập với PT thông thường” thành “Phòng tập / PT” trên cả hai màn hình. Nếu cần giải thích PT, đặt một dòng ngắn bên dưới bảng: “PT: huấn luyện viên cá nhân”.
- Thêm một dòng giới thiệu ngắn chỉ khi nó giúp hiểu phạm vi so sánh. Không tăng chiều cao header bằng mô tả riêng từng cơ sở.

### Mobile 360–700px

- Giữ table và đầy đủ hàng/cột, bỏ việc thay bằng `.compareMobileList`.
- Gutter 20px như các section lân cận. Cột tiêu chí khoảng 112px; bốn cột còn lại chia đều.
- Tên tiêu chí 13px, header 12px; line-height khoảng 1.45–1.55. Nhãn được xuống dòng giữa các từ.
- Padding theo hàng khoảng 14px; padding ngang ô ký hiệu khoảng 4–5px. Ký hiệu là dữ liệu tĩnh, không phải vùng bấm cần 44px.
- Không viết tắt “BV/PK” chỉ để nhét bảng. “Bệnh viện / phòng khám” xuống dòng và giữ cùng tên ở desktop.
- Sáu hàng cuộn dọc cùng trang; không tạo thêm khung cuộn dọc.

### Mobile 320–359px, hoặc khi nội dung/phóng to làm thiếu chỗ

- Trong mẫu, table có min-width 312px; tại viewport 320px, vùng đọc rộng 278px, nên cần cuộn 34px.
- Cố định tiêu chí bên trái, cột Holistic ngay cạnh. Nền của các ô cố định phải đặc để nội dung phía sau không xuyên qua.
- Có gợi ý “Vuốt ngang để xem đầy đủ bảng” khi wrapper thực sự overflow. Cột cuối lộ một phần để gợi ý nội dung còn lại.
- Vùng cuộn có tên truy cập, focus indicator và sử dụng được với bàn phím khi triển khai.
- Breakpoint phải theo chiều rộng thực tế và copy đã chốt; không khóa theo một mẫu điện thoại. Khi có ô dài hơn hoặc trạng thái bằng chữ, cần chuyển sớm sang B.

![Mẫu desktop](../.context/comparison-proposed-1440.png)

![Mẫu mobile 390px](../.context/comparison-proposed-390.png)

![Mẫu mobile 320px](../.context/comparison-proposed-320.png)

## Số đo của mẫu A

Đo bằng browser sau khi font Roboto Slab/Roboto Serif hiện có tải xong. Mẫu độc lập chưa có nav, widget hoặc cookie banner của homepage.

| Viewport | Vùng bảng / table | Cuộn ngang | Header / nhãn hàng |
| --- | --- | --- | --- |
| 1440px | 1310 / 1310px | 0px | 16 / 15px |
| 768px | 718 / 718px | 0px | 16 / 15px |
| 390px | 348 / 348px | 0px | 12 / 13px |
| 360px | 318 / 318px | 0px | 12 / 13px |
| 320px | 278 / 312px | 34px trong bảng | 12 / 13px |

Document không tràn ngang ở các viewport đã xem. Đây là chứng cứ bố cục cho copy/symbol của mẫu, không phải chứng nhận dễ đọc, browser compatibility hay accessibility của implementation cuối.

## Wording từ nguồn của Holistic

Đã mở trực tiếp [bài fanpage ngày 1/3](https://web.facebook.com/vatlytrilieuganday.phuchoichucnangganday/posts/pfbid0fBkvWQDskEFAYT7hauyJAGYLvKX4jgEL6VLS3r2VQikFH6gYNHDSApyn1uxstd3ul) trong browser. Bài mô tả đánh giá vận động/thói quen/hạn chế vận động, trị liệu theo vấn đề và tập luyện/nghỉ ngơi phù hợp. Ngày hiển thị không kèm năm. Đây là nguồn về cách clinic tự mô tả dịch vụ, không xác minh độc lập các claim y khoa trong bài.

Đã mở trực tiếp [Google Maps của clinic](https://maps.app.goo.gl/9RmecBoycrAkhBE39). Listing nhận diện cơ sở phục hồi chức năng và địa chỉ Lê Quốc Hưng. Một review hiển thị trải nghiệm sau phẫu thuật, một review khác mô tả không gian thư giãn. Đây là trải nghiệm cá nhân, không đủ để xác nhận quy trình, hiệu quả, toàn bộ phạm vi dịch vụ hoặc năng lực của các cơ sở đối chiếu. Không đưa tên, lời review mới hay chỉ số mới vào UI từ nghiên cứu này.

Đề xuất chỉnh ít, giữ câu hỏi so sánh:

> **Holistic khác với các giải pháp khác như thế nào?**
>
> So sánh các dịch vụ và hướng tiếp cận để bạn cân nhắc theo nhu cầu của mình.

| Hiện tại | Đề xuất | Lý do |
| --- | --- | --- |
| Tư vấn chuyên sâu | Tư vấn & đánh giá | Cụ thể hơn, gần từ vựng fanpage; tránh để “chuyên sâu” là nhãn không giải thích. |
| Trị liệu đa phương pháp | Giữ nguyên | Rõ phạm vi; vẫn có thể xuống dòng tự nhiên trên mobile. |
| Phẫu thuật | Thực hiện phẫu thuật | Phân biệt việc cơ sở cung cấp phẫu thuật với khách tập phục hồi sau phẫu thuật. |
| Dùng thuốc | Điều trị bằng thuốc | Mô tả hướng điều trị thay vì suy rằng khách không được dùng thuốc đã kê từ nơi khác. |
| Thư giãn | Giữ nguyên | Ngắn, dễ hiểu; không bổ sung hiệu quả y khoa. |
| Tập luyện tăng cường | Tập sức mạnh | Gọn, cụ thể; phù hợp mục tiêu tập luyện đã có trong PRODUCT.md. Cần owner chốt nếu dịch vụ muốn bao phủ rộng hơn sức mạnh. |
| Phòng tập với PT thông thường | Phòng tập / PT | Ngắn hơn và trung tính; giải thích PT ở dưới bảng nếu cần. |

Nếu muốn đưa “Xuyên suốt” vào bảng, có thể thử thêm hàng “Tư vấn → trị liệu → tập luyện”, nhưng cần xem lại nhịp trang và chiều cao bảng. Đây không phải thay đổi bắt buộc để sửa responsive.

### Ý nghĩa các ô

Giữ bảng không đòi hỏi giữ các dấu “Không” thiếu cơ sở. Với nhóm “Bệnh viện / phòng khám”, dấu phủ nhận trị liệu đa phương pháp hoặc tập luyện chưa được chứng minh; [dịch vụ phục hồi của Vinmec](https://www.vinmec.com/vie/chuyen-khoa-chan-thuong-chinh-hinh-y-hoc-the-thao/) có phản ví dụ kết hợp vật lý trị liệu và bài tập.

Nếu tiếp tục so sánh các nhóm rộng, cần thêm trạng thái phù hợp như “Tùy cơ sở” cho những ô biến thiên, hoặc xác định phạm vi/dữ liệu đối chiếu cụ thể. “Chưa xác minh” cũng không được đổi thành “Không”. Dòng ghi chú chung chỉ giải thích phạm vi, không làm một dấu “Không” sai trở thành đúng.

Trạng thái thứ ba vẫn có thể dùng một ký hiệu đơn giản trong ô với legend rõ; không dùng chú thích dài trong từng ô của mẫu A. Phải phân biệt “tùy cơ sở” đã biết có biến thiên với “chưa có dữ liệu”. Chưa điền một matrix public mới trong nghiên cứu này.

## Tiêu chí chọn phương án và bước triển khai

- Chọn A nếu ưu tiên nhìn toàn bộ bảng và gần hình thức desktop nhất; chấp nhận header 12px trong mẫu.
- Chọn B nếu ưu tiên chữ 13–14px, giữ tên/ô dài hơn hoặc người đọc thấy A quá nhỏ.
- Chọn C nếu muốn chủ động đối chiếu từng nhóm và chấp nhận thêm thao tác.
- Khi triển khai: dùng chung một data model, native table, scope, caption và nhãn trạng thái; kiểm tra các viewport 320, 360, 390, 768 và desktop với copy cuối, zoom và bàn phím. Không bỏ bớt dữ liệu theo viewport.

Mẫu A là đề xuất ưu tiên cho yêu cầu hiện tại. Chưa có user test hoặc đo conversion. Đã xem hai lượt bố cục có giới hạn; chưa chạy test/lint/build vì không thay source homepage. Detector cho HTML mẫu báo các advisory về token/size và warning về note nghiên cứu 11px, wrapper table không có inset, cùng một nhận diện nhầm tên font `slab`; không dùng detector làm bằng chứng đạt production. Implementation cuối dùng token hiện có và typography đã chốt.

## Artifacts

- `.context/comparison-layouts.html`: ba variant A/B/C, chọn bằng query `?variant=a`, `b`, `c`; C có selector tương tác.
- `.context/comparison-layout-board.html`: ba mẫu mobile cạnh nhau.
- `.context/comparison-fonts.css` và `.context/comparison-fonts/`: bản sao font hiện có, để mẫu không cần truy cập mạng.
- Ảnh PNG trong `.context/` như trên. Server nghiên cứu port 3112 được dừng sau khi chụp; dev server có sẵn port 3111 được giữ nguyên.

Xem lại mẫu bằng `python3 -m http.server 3112 --bind 127.0.0.1 --directory .context`, rồi mở `http://127.0.0.1:3112/comparison-layout-board.html`.
