# Nghiệm thu bổ sung trang liệu pháp — 22/10/2026

Phạm vi PR #45 / issue #10: tương tác bàn phím và dock, nội dung đã biên tập,
liên kết catalogue và cập nhật CMS tự động. Kiểm tra form/email thủ công hoặc
end-to-end được miễn theo yêu cầu owner ngày 22/10; không ghi nhận là test đã đạt.

## Thay đổi sau lượt kiểm tra

- `87da759`: vùng `#yeu-cau` nhận focus khi kích hoạt link từ hero/dock, có outline
  nhìn thấy và tiếp tục Tab vào nội dung vùng tư vấn. `tabIndex=-1` không thêm một
  điểm dừng vào thứ tự Tab bình thường. Trước sửa, dock ẩn sau điều hướng khiến
  `document.activeElement` trở về body.
- `c66c775`: các truy vấn CMS có cache dùng chung tag `sanity`; webhook có secret
  hợp lệ hết hạn dữ liệu này ngay trước khi revalidate layout/sitemap. Request
  không xác thực vẫn trả 401 và không được xóa cache.
- `814eb20`: sitemap được tạo khi có request. Phép thử trước đó nhận webhook 200
  nhưng sitemap tĩnh trên Vercel vẫn giữ danh sách URL cũ. Việc hết hạn tag chưa
  đủ để giải quyết lớp cache output riêng này. Sitemap hiện đọc dữ liệu đã publish
  trực tiếp, với chi phí hai truy vấn CMS mỗi lượt gọi khi CMS được cấu hình.

Đã đọc guide của Next.js **16.3.8** cài trong repo cho `revalidatePath`,
`revalidateTag`, metadata sitemap và `force-dynamic`. Không dùng API một tham số
`revalidateTag` đã deprecated. Cấu hình webhook theo
[Sanity Webhooks API](https://www.sanity.io/docs/http-reference/webhooks).

## Trình duyệt và dock

Chromium, local website với Sanity staging. Sáu lượt kiểm tra Giác hơi:
320/390/768/1440 px với motion bình thường, thêm reduced motion ở 320/1440 px.
Ảnh ghi trạng thái của bản sửa focus `87da759`; các commit cache sau không đổi layout.

- Dock bắt đầu ẩn và `inert`; skip link là điểm Tab đầu tiên.
- FAQ đóng bằng Enter, mở bằng Space.
- Không cuộn ngang; dock xuất hiện sau facts, không chồng cookie hoặc chat.
- Enter trên CTA chuyển focus tới `#yeu-cau`, outline 2 px nhìn thấy; Tab kế tiếp
  tiếp tục bên trong vùng tư vấn. Không gửi biểu mẫu.
- Dock ẩn và trở lại `inert` khi tới vùng tư vấn; cuộn ngược lên không làm nó hiện lại.
- Reduced motion tắt transition; từ chối cookie vẫn có hiệu lực sau reload.
- Không có JavaScript exception trong sáu lượt thử.

Đã thử thêm Xung kích trên local production build, 768 px / DPR 2 / reduced motion:
trang không có ảnh vẫn có một h1, không overflow, dock không ảnh hoạt động và chuyển
focus đúng. DPR 2 là thiết lập mật độ điểm ảnh, không phải bằng chứng native zoom 200%.

Ba screenshot mới được upload trực tiếp vào description PR #45: dock/cookie ở
320 và 1440 px, focus đích ở 390 px. Không commit screenshot vào repo.
Log chi tiết ở `.context/treatment-acceptance/browser-matrix.json`.

## Nội dung và bảng giá

Đối chiếu lại hai ảnh bảng giá tiếng Việt/Anh owner cung cấp ngày 09/10, sau đó
so seed với 11 bản ghi staging: title, giá, dấu yêu cầu chuyên viên, mô tả,
35 FAQ và title/description SEO khớp bản biên tập.

| Liệu pháp          | Giá VNĐ | Có dấu yêu cầu chuyên viên |
| ------------------ | ------: | :------------------------: |
| Châm khô           |  299000 |             Có             |
| Giác hơi           |   99000 |                            |
| IASTM              |  199000 |                            |
| Đèn hồng ngoại     |   99000 |                            |
| Ngâm lạnh          |  149000 |                            |
| Tapping            |   99000 |                            |
| Xung kích          |  349000 |                            |
| Điện xung          |  349000 |                            |
| Sóng siêu âm       |  349000 |                            |
| Điện châm          |  249000 |             Có             |
| Nắn chỉnh cột sống |  299000 |             Có             |

Không khôi phục duration/protocols/benefits legacy chưa xác minh. Nội dung không
lấy filter của nhóm làm chỉ định của từng liệu pháp. Ảnh stock có nhãn minh họa;
Xung kích và Sóng siêu âm tiếp tục không có ảnh. Các khoảng trống này không được
lấp bằng ảnh sai kỹ thuật hoặc thông tin thực hành của nơi khác.

Đây là lượt duyệt biên tập và đối chiếu dữ liệu; không ghi nhận owner đã phê duyệt
thay owner. Các thông tin chỉ phòng khám xác nhận được vẫn nằm trong
[danh sách câu hỏi](TREATMENT_CONTENT_AUDIT.md#phòng-khám-cần-xác-nhận): thời lượng,
thiết bị/kỹ thuật, quy trình và phạm vi chuyên môn người thực hiện. Khi có nguồn
thực tế mới, cập nhật các trường liên quan và kiểm tra lại, không suy ra từ nghiên cứu chung.

## Preview và webhook staging

Preview của branch `feat/10-treatment-detail-page` trước đó dùng dataset production
và không có revalidation secret. Đã thêm override **riêng branch preview** để đọc
`yjzexxml/staging` và nhận webhook xác thực; không đổi env production.

Webhook staging `73iQNVV10WENgFmC` nay trỏ tới:

```text
https://holisticvn-git-feat-10-treatment-de-41343e-chachajonas-projects.vercel.app/api/revalidate
```

Giữ triggers Create/Update/Delete, filter treatment/methodsPage/servicesPage/imageAsset,
headers bảo vệ, và loại draft/release. Webhook production giữ nguyên.
Preview vẫn có Vercel Deployment Protection; HTTP checks dùng quyền truy cập đã cấu hình.
Các ảnh trình duyệt ở trên là local/staging, không giả là ảnh chụp preview đã đăng nhập.

## Kết quả CMS tự động trên `814eb20`

Thử bằng Sanity SDK trên một bản ghi staging tạm, không thay đổi 11 dịch vụ thật.
Sau request kiểm tra endpoint ban đầu, không gọi revalidation thủ công hoặc redeploy
trong vòng đời dưới đây; các thay đổi kích hoạt webhook tự động.

| Thao tác                    | Kết quả trang                                                          | Kết quả sitemap          |
| --------------------------- | ---------------------------------------------------------------------- | ------------------------ |
| Publish document tối thiểu  | 200, một h1; không ảnh/giá/thời lượng/quy trình; có CTA và marker hero | Thêm URL                 |
| Cập nhật title              | Hiển thị title mới                                                     | Giữ URL                  |
| Đổi slug                    | URL mới 200, URL cũ 404                                                | Thay URL cũ bằng URL mới |
| Gỡ xuất bản/xóa bản ghi tạm | URL cuối trả 404                                                       | Xóa URL                  |

Endpoint: thiếu secret **401**, secret hợp lệ **200**. Cả bốn lần giao webhook tự
động đều **200**; attempt IDs và transaction IDs được ghi ở phần evidence PR.
Hai singleton methodsPage/servicesPage đều tham chiếu đủ 11 liệu pháp và cả 11
trang thật trả 200 với metadata staging đã biên tập.

Bản ghi tạm đã xóa. Đọc lại 13 document gốc staging khớp hoàn toàn snapshot trước
thử; revisions production trước/sau không đổi. Backup và kết quả nằm trong
`.context/treatment-acceptance/` (gitignored, không chứa secret trong tài liệu công khai).

## Kiểm tra và ranh giới phát hành

Lint, typecheck, **353 tests / 48 files** và production build đạt sau các bản sửa.
Regression cho webhook đã thất bại trước sửa và đạt sau sửa: request được xác thực
phải hết hạn shared CMS tag; request không xác thực không được làm điều này.
CI cho code `814eb20` và commit tài liệu sau đó được liên kết riêng trong PR.

Owner acceptance cuối cùng vẫn cần được ghi nhận. Không deploy production hoặc
chuyển dữ liệu staging sang production trong lượt này. Nghiệm thu toàn website,
native browser zoom/Safari, canonical/redirect production và phát hành vẫn thuộc
phạm vi checklist/release tương ứng; không coi kết quả liệu pháp này là đóng #18/#27.
