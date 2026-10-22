# SEO cho 11 liệu pháp — OpenSEO

Ngày nghiên cứu: 22/10/2026. Project: [HolisticVN](https://app.openseo.so/p/565dc43f-e982-4218-bac0-fa1ec7965903).

## Kết luận và giới hạn

Ưu tiên làm rõ tên liệu pháp, ngữ cảnh dịch vụ tại TP.HCM và đường dẫn tư vấn trên 11 URL hiện có. Nghiên cứu không chứng minh sẽ tăng thứ hạng hoặc lượt đặt lịch; cần số liệu Search Console sau khi website mới ra mắt để đo hiệu quả.

- OpenSEO đã tra 48 từ khóa cố định: trả về 19 dòng, 15 dòng có volume; 29 từ không được trả về và 4 dòng không có volume. Thiếu dữ liệu được ghi là `unknown`, không đổi thành 0.
- Đã nghiên cứu thêm ba seed Châm khô, Ngâm lạnh và IASTM, trả 256 gợi ý. Phần lớn hai seed đầu sai ngữ cảnh; IASTM chủ yếu tiếng Anh/dụng cụ. Không dùng các cụm này để lấp dữ liệu hoặc đổi phạm vi dịch vụ.
- Đã kiểm tra thành công 11 SERP, depth 10 phần tử kết quả/truy vấn, vị trí `Ho Chi Minh City,Ho Chi Minh,Vietnam`, mã quốc gia 2704, tiếng Việt. Depth bao gồm AI overview/local pack/hình ảnh, không có nghĩa đủ 10 kết quả organic.
- Volume trong bảng là ước tính tìm kiếm toàn Việt Nam, không phải TP.HCM, traffic thật hay số người cần dịch vụ. CPC là USD; KD là chỉ số của nhà cung cấp, KD=0 không bảo đảm dễ xếp hạng. Không cộng volume biến thể.
- Project chưa có tài khoản Google/Search Console kết nối; chưa có dữ liệu clicks, impressions, CTR, conversions hoặc index status của HolisticVN. Không kết luận website đang mất traffic hoặc không xếp hạng.
- Tài khoản bắt đầu 500 credits, sau nghiên cứu còn 327: dùng 173 credits. Không bật tracking định kỳ; chưa lưu từ khóa vào Saved Keywords.
- Không crawl legacy production để coi đó là nghiệm thu bản Next.js mới. Thực hiện kiểm tra bản rebuild riêng bằng dữ liệu fallback và Sanity staging.

## Ánh xạ từng trang

| Liệu pháp / URL                                            | Cụm nghiên cứu          | Volume VN / tháng |      KD |
| ---------------------------------------------------------- | ----------------------- | ----------------: | ------: |
| Châm khô — `/treatments/dry-needling`                      | châm khô                |           unknown | unknown |
| Giác hơi — `/treatments/cupping`                           | giác hơi                |             12100 |       0 |
| IASTM — `/treatments/iastm`                                | IASTM                   |           unknown | unknown |
| Đèn hồng ngoại — `/treatments/heat-light`                  | chiếu đèn hồng ngoại    |               140 |       0 |
| Ngâm lạnh — `/treatments/cold-plunge`                      | ngâm lạnh               |           unknown | unknown |
| Tapping — `/treatments/tapping`                            | kinesio taping          |               880 |       4 |
| Xung kích — `/treatments/shockwave`                        | sóng xung kích trị liệu |                70 | unknown |
| Điện xung — `/treatments/bio-electric`                     | điện xung trị liệu      |               170 |       0 |
| Sóng siêu âm — `/treatments/therapeutic-ultrasound`        | siêu âm trị liệu        |               320 |       0 |
| Điện châm — `/treatments/electroacupuncture`               | điện châm               |               390 |       0 |
| Nắn chỉnh cột sống — `/treatments/chiropractic-adjustment` | nắn chỉnh cột sống      |           unknown |       0 |

Các cụm thiếu volume vẫn có thể phù hợp với trang dịch vụ khi SERP khớp. Tapping giữ tên công khai; kinesio taping là truy vấn nghiên cứu cho khái niệm dán băng, không xác nhận thương hiệu băng của phòng khám.

## Quyết định biên tập

### Châm khô

- Title: **Châm khô (Dry Needling) tại TP.HCM** (layout thêm ` | HolisticVN` một lần).
- Description: Châm khô dùng kim không chứa thuốc, có thể hỗ trợ giảm đau cơ. Xem giá, lưu ý và gửi yêu cầu tư vấn tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: SERP có kim khô/dry needling nhưng gợi ý từ khóa lẫn nấm, thực phẩm và ắc quy; giữ tên dịch vụ kèm Dry Needling để phân biệt.

### Giác hơi

- Title: **Giác hơi tại TP.HCM: giá và lưu ý** (layout thêm ` | HolisticVN` một lần).
- Description: Giác hơi tạo lực hút trên da, có thể hỗ trợ giảm đau. Xem giá, ý nghĩa vết giác và các lưu ý trước khi tư vấn tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: Có local pack lẫn bài kiến thức; thêm địa phương, giá và lưu ý, không nhập claims thải độc từ đối thủ.

### IASTM

- Title: **IASTM: trị liệu mô mềm bằng dụng cụ** (layout thêm ` | HolisticVN` một lần).
- Description: IASTM là trị liệu mô mềm bằng dụng cụ. Tìm hiểu giới hạn hiệu quả, lưu ý an toàn và giá dịch vụ tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: SERP trộn tài liệu chuyên môn và mua dụng cụ; giải nghĩa tiếng Việt, không nhắm iastm tools.

### Đèn hồng ngoại

- Title: **Chiếu đèn hồng ngoại tại TP.HCM** (layout thêm ` | HolisticVN` một lần).
- Description: Chiếu đèn hồng ngoại làm ấm tại chỗ, có thể giúp giảm căng cơ tạm thời. Xem giá và các lưu ý khi tư vấn tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: SERP vẫn thiên về thiết bị; dùng động từ chiếu và ngữ cảnh dịch vụ tại TP.HCM, không coi volume bán đèn là nhu cầu đặt lịch.

### Ngâm lạnh

- Title: **Ngâm lạnh sau tập luyện tại TP.HCM** (layout thêm ` | HolisticVN` một lần).
- Description: Ngâm lạnh có thể giúp bớt đau mỏi cơ sau vận động. Tìm hiểu giới hạn hiệu quả, lưu ý an toàn và giá dịch vụ tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: SERP trộn ngâm chân/tắm nước đá; thêm ngữ cảnh sau tập luyện, không khẳng định ngủ ngon hoặc giảm stress.

### Tapping

- Title: **Tapping: dán băng đàn hồi tại TP.HCM** (layout thêm ` | HolisticVN` một lần).
- Description: Tìm hiểu dán băng đàn hồi (kinesio taping), giới hạn hiệu quả và lưu ý cho da. Xem giá Tapping và tư vấn tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: SERP kinesio taping có thông tin, đại lý và khóa học; dán băng đàn hồi là cách giải nghĩa, không đổi tên Tapping hoặc dùng EFT.

### Xung kích

- Title: **Sóng xung kích trị liệu tại TP.HCM** (layout thêm ` | HolisticVN` một lần).
- Description: Tìm hiểu sóng xung kích trị liệu (ESWT), giới hạn hiệu quả và cảm giác khi thực hiện. Xem giá và tư vấn tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: Cụm rộng sóng xung kích có 590, cụm trị liệu có 70; chọn cụm đúng dịch vụ, không tự gán loại máy hướng tâm/hội tụ.

### Điện xung

- Title: **Điện xung trị liệu tại TP.HCM** (layout thêm ` | HolisticVN` một lần).
- Description: Điện xung có mục tiêu giảm đau hoặc kích thích cơ tùy phương pháp. Xem giá, giới hạn hiệu quả và lưu ý tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: Cụm điện xung có 320, cụm trị liệu có 170; SERP còn có bán máy nên nhấn tư vấn/giá dịch vụ, không tự gán TENS/EMS.

### Sóng siêu âm

- Title: **Siêu âm trị liệu tại TP.HCM** (layout thêm ` | HolisticVN` một lần).
- Description: Siêu âm trị liệu dùng sóng âm trong vật lý trị liệu, khác siêu âm chẩn đoán. Xem giới hạn hiệu quả, lưu ý và giá tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: SERP khớp vật lý trị liệu; dùng cụm siêu âm trị liệu và phân biệt siêu âm chẩn đoán.

### Điện châm

- Title: **Điện châm tại TP.HCM: giá và lưu ý** (layout thêm ` | HolisticVN` một lần).
- Description: Điện châm kết hợp châm kim với dòng điện. Xem giới hạn hiệu quả, rủi ro cần trao đổi và giá dịch vụ tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: SERP thiên kiến thức; giữ giải thích và lưu ý trước khi yêu cầu tư vấn, không hứa hiệu quả vượt trội.

### Nắn chỉnh cột sống

- Title: **Nắn chỉnh cột sống tại TP.HCM** (layout thêm ` | HolisticVN` một lần).
- Description: Nắn chỉnh cột sống có thể hỗ trợ giảm đau và vận động ở một số người. Xem giá, giới hạn hiệu quả và lưu ý tại HolisticVN, TP.HCM.
- Cơ sở lựa chọn: SERP có cơ sở trị liệu và bài kiến thức; giữ đúng tên dịch vụ, không suy ra chuyên môn chiropractic, HVLA hoặc giải phóng chèn ép.

## Thay đổi và nghiệm thu

- Nguồn mặc định dùng `lib/treatment-seo.json`, resolver riêng trong `lib/treatment-seo.ts`: CMS từng trường → bản biên tập → nội dung liệu pháp. Title không kèm thương hiệu để tránh lặp suffix; ảnh SEO vẫn do CMS quản lý.
- Catalogue seed giữ SEO thuộc quyền biên tập. Script đồng bộ catalogue đã sửa để bảo toàn SEO thay vì xóa trường này.
- Sanity chỉ cập nhật `seo.title`/`seo.description` trên staging, có backup, kiểm tra revision, đối chiếu các trường còn lại và revision production. Bằng chứng áp dụng và kiểm tra runtime được ghi bên dưới.

## Đo hiệu quả sau khi ra mắt

1. Kết nối Google Search Console vào project OpenSEO và chọn property của holisticvn.com.
2. Khi bản Next.js mới được deploy, kiểm tra canonical, sitemap, redirect legacy và index của 11 URL; xác định ngày bắt đầu để so sánh.
3. So sánh truy vấn phù hợp, impressions, CTR và yêu cầu tư vấn/đặt lịch sau một khoảng quan sát đủ dài. Chỉ đổi thêm copy khi có bằng chứng, không đánh giá hiệu quả qua KD hoặc volume đơn lẻ.

## Nguồn và bằng chứng

- [OpenSEO Keyword Research](https://openseo.so/docs/skills/keyword-research) và [SEO Report](https://openseo.so/docs/skills/seo-report): workflow đã áp dụng.
- [OpenSEO MCP](https://openseo.so/docs/mcp): nguồn metrics/SERP. Các trang xuất hiện trong SERP là bằng chứng ý định tìm kiếm, không được dùng làm nguồn xác nhận y tế của HolisticVN.
- `PRODUCT.md` và `docs/TREATMENT_CONTENT_AUDIT.md`: phạm vi, facts và ranh giới nội dung y tế đã được duyệt trước lượt SEO này.
- Raw results và snapshot nằm dưới `.context/openseo/` (gitignored): `keyword-metrics.json`, `keyword-metrics-complete.csv`, `keyword-discovery.json`, `serps-treatments-10.json`, `serps-spinal.json`, `publish-plan.json`. Các file này không chứa OAuth token.

Báo cáo không khẳng định ưu tiên keyword theo chuyển đổi thực tế vì chưa có dữ liệu chuyển đổi. Ba việc cụ thể được đề xuất là chỉnh snippet đúng dịch vụ, giữ SEO khi đồng bộ, và kết nối Search Console để đo sau deploy.

## Bằng chứng SERP có thể đối chiếu

Các URL sau do OpenSEO trả trong lượt kiểm tra tại TP.HCM. Đây là bằng chứng về loại kết quả tìm kiếm, không phải nguồn để sao chép claims hoặc xác nhận phương pháp tại HolisticVN.

| Cụm tìm kiếm            | Kết quả đại diện                                                                                                                                                           | Quan sát                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| giác hơi                | [Giác hơi có tác dụng gì? Một số lưu ý khi giác hơi](https://tiemchunglongchau.com.vn/kien-thuc-tiem-chung/giac-hoi-co-tac-dung-gi-mot-so-luu-y-khi-giac-hoi)              | Organic 1; chỉ phản ánh SERP trong snapshot |
| châm khô                | [Châm Khô cho Tình Trạng Cứng Cơ và Co Thắt Cơ](https://www.saigonholistic.com/vi/cham-kho-cho-tinh-trang-cung-co-co-that/)                                                | Organic 3; chỉ phản ánh SERP trong snapshot |
| IASTM                   | [Instrument Assisted Soft Tissue Mobilization](https://www.physio-pedia.com/Instrument_Assisted_Soft_Tissue_Mobilization)                                                  | Organic 1; chỉ phản ánh SERP trong snapshot |
| chiếu đèn hồng ngoại    | [TOP 8 bóng đèn hồng ngoại trị liệu và sưởi ấm tốt hiện nay](https://chiaki.vn/tin-tuc/bong-den-hong-ngoai-tri-lieu-va-suoi-am-tot-nhat)                                   | Organic 1; chỉ phản ánh SERP trong snapshot |
| ngâm lạnh               | [Ngâm chân nước đá: lợi ích và hướng dẫn thực hiện tại nhà](https://www.pharmacity.vn/tac-dung-ky-dieu-va-cach-ngam-chan-nuoc-da-dung-chuan-cho-suc-khoe.htm)              | Organic 1; chỉ phản ánh SERP trong snapshot |
| kinesio taping          | [Băng dán cơ Kinesio tap là gì? Công dụng & cách dùng](https://hellobacsi.com/benh-co-xuong-khop/dau-co-xuong-khop/bang-dan-co-kinesio-la-gi/)                             | Organic 1; chỉ phản ánh SERP trong snapshot |
| sóng xung kích trị liệu | [Máy sóng xung kích điều trị những bệnh lý gì](https://www.vinmec.com/vie/bai-viet/may-song-xung-kich-dieu-tri-nhung-benh-ly-gi-vi)                                        | Organic 1; chỉ phản ánh SERP trong snapshot |
| điện xung trị liệu      | [Lợi ích của máy trị liệu xung điện](https://baominhmedical.com.vn/loi-ich-cua-may-dien-xung-may-xung-dien-tri-lieu-1-2-52559.html)                                        | Organic 1; chỉ phản ánh SERP trong snapshot |
| siêu âm trị liệu        | [sóng siêu âm trong điều trị vật lý trị liệu](https://bvquan8.medinet.gov.vn/chuyen-muc/song-sieu-am-trong-dieu-tri-vat-ly-tri-lieu-cmobile1498-33582.aspx)                | Organic 1; chỉ phản ánh SERP trong snapshot |
| điện châm               | [Những điều cần biết về tác dụng của châm cứu điện](https://tytphuong3q6.medinet.gov.vn/dong-y/nhung-dieu-can-biet-ve-tac-dung-cua-cham-cuu-dien-cmobile12845-164298.aspx) | Organic 1; chỉ phản ánh SERP trong snapshot |
| nắn chỉnh cột sống      | [LỢI ÍCH CỦA NẮN CHỈNH XƯƠNG KHỚP ĐỊNH KỲ](https://acc.vn/workshop-loi-ich-cua-nan-chinh-xuong-khop-dinh-ky/)                                                              | Organic 1; chỉ phản ánh SERP trong snapshot |

## Từ phụ và ranh giới giữa các trang

| Trang liệu pháp    | Từ phụ phù hợp nội dung đã có                   | Không mở rộng sang                                        |
| ------------------ | ----------------------------------------------- | --------------------------------------------------------- |
| Châm khô           | dry needling, kim khô, lưu ý trước khi châm     | Nấm kim châm, ắc quy, phác đồ châm cứu suy diễn           |
| Giác hơi           | vết giác hơi, rủi ro giác hơi, giá giác hơi     | Thải độc, giác hơi tại nhà nếu phòng khám không cung cấp  |
| IASTM              | trị liệu mô mềm bằng dụng cụ                    | Bán dụng cụ, khóa học, thương hiệu kỹ thuật chưa xác nhận |
| Đèn hồng ngoại     | chiếu hồng ngoại, lưu ý khi chiếu đèn           | Mua bóng đèn, sauna, laser, thông số thiết bị             |
| Ngâm lạnh          | cold plunge, ngâm nước lạnh sau tập             | Ngâm chân, bảo quản thực phẩm, bán bồn                    |
| Tapping            | kinesio taping, dán băng đàn hồi                | EFT tapping, bán băng hoặc chứng nhận thương hiệu         |
| Xung kích          | ESWT, sóng xung kích trị liệu                   | Cam kết tái tạo mô hoặc loại máy chưa xác nhận            |
| Điện xung          | điện xung trị liệu, lưu ý trước buổi hẹn        | Bán máy hoặc tự gán TENS/EMS                              |
| Siêu âm            | siêu âm trị liệu, siêu âm trong vật lý trị liệu | Siêu âm chẩn đoán/thai sản/thẩm mỹ                        |
| Điện châm          | lưu ý điện châm, cảm giác khi điện châm         | Kết quả vượt trội, hồ sơ người thực hiện chưa xác nhận    |
| Nắn chỉnh cột sống | lưu ý trước khi nắn chỉnh, giá dịch vụ          | Chứng chỉ chiropractic, HVLA hoặc điều trị tận gốc        |

Từ phụ là định hướng biên tập theo nội dung, không đồng nghĩa đều có volume được xác nhận. `/treatments` giữ vai trò mục lục khám phá; `/services` trình bày lộ trình và nhóm dịch vụ. Trang chi tiết giữ ý định tìm hiểu và tư vấn đúng liệu pháp. Chưa thêm bài blog hoặc trang đích mới, nên không tạo URL mới trùng mục tiêu trong lượt này. Khi thêm bài blog, kiểm tra truy vấn Search Console và dùng link về trang liệu pháp cho ý định dịch vụ.

IASTM ưu tiên giải nghĩa tên viết tắt trong title; TP.HCM xuất hiện trong description. Không cần ép mọi title thành cùng một mẫu để thể hiện địa phương.

## Cách giữ CMS và bản mặc định đồng nhất

1. Sửa title/description trong Sanity Studio trên staging cho đúng liệu pháp; kiểm tra nội dung, giá và các phần mà snippet mô tả vẫn tồn tại. Không sửa ảnh SEO nếu không có nhu cầu riêng.
2. Nếu quyết định dùng copy mới làm bản dự phòng, sửa đúng slug trong `lib/treatment-seo.json`, rồi chạy các test SEO và kiểm tra HTML render. CMS có quyền ưu tiên từng trường; sửa JSON một mình không ghi đè nội dung CMS.
3. Đối chiếu title cuối có thương hiệu một lần, description, canonical và OG của cả fallback và staging. Khi thay đổi nội dung khiến mô tả SEO không còn đúng (ví dụ bỏ giá hoặc FAQ), biên tập SEO cùng lúc thay vì dựa vào template cũ.
4. Với cập nhật hàng loạt, lưu toàn bộ bản ghi trước khi ghi; chỉ patch `seo.title`/`seo.description` dưới revision guard; dừng nếu có draft/release hoặc revision thay đổi. Đọc lại toàn bộ bản ghi và đối chiếu ảnh, giá, FAQ, slug sau ghi. Tránh chạy sync catalogue để thay cho biên tập SEO.
5. Chỉ chuyển lên production trong quy trình release đã được chủ dự án cho phép; bản dự phòng và SEO staging không tự deploy website.

## Kế hoạch đo sau deploy

Lưu ngày deploy của bản mới là D0. Nếu có đủ dữ liệu, dùng 28 ngày trước D0 làm baseline và 28 ngày sau D0 làm kỳ đầu, đồng thời ghi annotation về chuyển website, redirect và ngày được index. Với trang mới không có baseline tương đương, dùng kỳ 28 ngày đầu làm mốc rồi so với 28 ngày tiếp theo; không quy toàn bộ thay đổi cho metadata.

Search Console: theo từng URL/query và thiết bị, so impressions, clicks, CTR và vị trí trung bình. Ghi thay đổi truy vấn, ngày crawl/index và ngày cập nhật copy. Kết quả tìm kiếm theo vị trí không được đọc như vị trí của HolisticVN nếu chưa kiểm tra URL/domain thực tế.

Chuyển đổi: dùng event thành công của biểu mẫu tư vấn/đặt lịch và click điện thoại/Zalo đã được đo hợp lệ sau consent, nếu hệ thống analytics đã cấu hình chúng. Kiểm tra tên event thực trong tracking plan trước khi lập baseline; không tạo hoặc bịa một event mới trong báo cáo SEO. Form gửi thành công là yêu cầu tư vấn, không phải lịch khám đã xác nhận. Nếu chưa có analytics/consent hợp lệ, ghi thiếu dữ liệu chuyển đổi thay vì báo tỷ lệ chuyển đổi bằng 0.

## Kết quả áp dụng đã xác minh

- Sanity staging `yjzexxml/staging`: transaction `99Fs6oltvVcm55dsWzmlaM`; cập nhật và đọc lại đủ 11 bản ghi. Chỉ `seo.title` và `seo.description` thay đổi; giá, nội dung, FAQ, slug, ảnh và media SEO giữ nguyên. Revision các bản ghi treatment production trước/sau không đổi.
- Backup trước khi ghi: `.context/openseo/before-staging-2026-10-21T19-59-04-700Z.json`; kết quả đối chiếu đầy đủ: `.context/openseo/publish-result.json`.
- 351 tests / 48 files đạt; lint, typecheck, production build, định dạng và diff checks đạt. Build dùng fallback; không dùng kết quả đó để giả định staging đúng.
- Đã kiểm tra browser riêng cho 11 trang × 3 viewport (320/768/1440px) × 2 chế độ fallback/Sanity staging = 66 lượt. Title cuối có thương hiệu đúng một lần; description, canonical, OG title/description đúng; có một h1 và không cuộn ngang. Staging kiểm tra OG image khớp từng bản ghi. Slug không tồn tại trên fallback trả 404.
- Next dev có cache HMR cũ sau cập nhật CMS. Kiểm tra staging dùng hard-refresh tương đương header `Cache-Control: no-cache` theo guide Next cài trong repo, để lấy dữ liệu trực tiếp. Website production khi phát hành cần webhook revalidation hoạt động hoặc chờ ISR; không coi thay đổi CMS là tự deploy code.
- Website chưa deploy production; chưa có số liệu về tăng thứ hạng hoặc lượt tư vấn. Không tạo tracking định kỳ hoặc ghi Saved Keywords.
- [Báo cáo OpenSEO riêng tư](https://app.openseo.so/p/565dc43f-e982-4218-bac0-fa1ec7965903/reports/6d1f27ef-f52d-48f8-b1ba-f8cb400253dd) đã lưu và đọc lại; research log và 11 key pages đã ghi vào project để tái sử dụng bằng chứng.

## Search Console sau khi xác minh — 22/10/2026

Đã xác minh `sc-domain:holisticvn.com` với quyền `siteOwner` và liên kết thành công vào project OpenSEO. Bản ghi TXT đúng hiện ở domain gốc. Đây là thay đổi sau nghiên cứu ban đầu; phần ghi chưa kết nối ở trên mô tả thời điểm trước xác minh.

- Search Analytics trả thành công nhưng không có dòng `query+page` trong kỳ 22/09–19/10/2026, dữ liệu `final`. Không diễn giải thành tổng lượt truy cập/click/impression bằng 0.
- URL Inspection cho 11 URL không www trả trạng thái Google chưa xác định URL. Sau khi kiểm tra hostname canonical thực tế, homepage www và Đèn hồng ngoại www đã được Google lập chỉ mục; Giác hơi và Ngâm lạnh www chưa có thông tin URL. Không kết luận toàn website chưa index. API này đọc kết quả Google đã có, không crawl live.
- GET trực tiếp production xác nhận chỉ Giác hơi, Ngâm lạnh và Đèn hồng ngoại trả 200; 8 đường dẫn còn lại trả 404. Sitemap hiện chỉ có ba URL liệu pháp này. Metadata vẫn là bản cũ, chưa phải bộ 11 trang SEO của staging.
- Production đang chuyển domain gốc sang www và khai báo canonical www. PRODUCT.md đã chốt domain/canonical không www. Khi release cần triển khai đồng nhất redirect, metadata, sitemap theo quyết định đã chốt; không đổi quyết định domain dựa trên hiện trạng production cũ.
- Bước tiếp theo là phát hành đủ trang và metadata đã chuẩn bị trong quy trình production được chủ dự án cho phép, kiểm tra 200/robots/sitemap/canonical rồi gửi sitemap và đo hiệu quả. Không gửi yêu cầu index cho các URL đang 404. Lượt kiểm tra này không deploy, không gửi sitemap/index request và không dùng thêm credits nghiên cứu.

Bằng chứng: `.context/openseo/search-console-verified.json` và `.context/openseo/production-url-check.json`. Báo cáo OpenSEO hiện có đã được cập nhật cùng kết quả này.
