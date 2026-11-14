# Plan cải thiện bố cục trang Dịch vụ

Written against: `a5bd2debfdbc731421671a51b185cb631c7eb1b7`.

Ngày: 2026-11-14. **Trạng thái: đã triển khai local theo yêu cầu ngày 2026-11-14; chờ người dùng xem giao diện cuối.**

Kết quả triển khai và kiểm chứng: [services-layout-verification.md](../docs/services-layout-verification.md).

## Mục tiêu và căn cứ

Người xem thấy các lựa chọn dịch vụ trước khi đọc sâu, đọc được nội dung không bị lớp nổi che, và gặp khối đặt lịch cân đối ở cả màn hình hẹp lẫn rộng. Giữ nhận diện Warm Clay Editorial và cấu trúc accordion đang chạy.

- Yêu cầu hiện tại: nghiên cứu cách cải thiện desktop/mobile và chuyển thành plan cụ thể.
- Nguồn sản phẩm: `PRODUCT.md`; quy chuẩn: `docs/FRONTEND_CHECKLIST.md`.
- `DESIGN.md` thực sự quản lý palette/font/container, nhưng đoạn mô tả hero ảnh và dive xen kẽ của Services đã khác runtime. Không dùng đoạn cũ để hoàn tác typographic index.
- [Issue #41](https://github.com/chachajona/holisticvn/issues/41) thuộc [tracking #1](https://github.com/chachajona/holisticvn/issues/1); cả hai OPEN khi đọc ngày 2026-11-14. Body #41 còn nói ba nhóm/layout cũ, trong khi source và test đã dùng bốn nhóm. Đây là lệch trạng thái tài liệu, không phải lý do sửa domain về ba nhóm. Không thay trạng thái issue bằng trạng thái file này.
- Nghiên cứu nguồn ngoài và so sánh phương án: [services-layout-research.md](./services-layout-research.md). Hướng dẫn nguồn ngoài hỗ trợ lựa chọn; không chứng minh tăng conversion của Holistic.

## Design language

- Surface: `/services`, intro → nhóm dịch vụ → quy trình → CTA; chrome chung chỉ đổi cách trình bày trên route này trong plan 03.
- Owners: `app/services/page.tsx`, `services.module.css`, `hash-open.tsx`; `app/layout.tsx` → `SiteChrome` → nav/footer/chat/cookie. `getServices()` là nguồn nhóm, `getPublicSiteData()` là nguồn thông tin liên hệ.
- Giữ: Roboto Slab/Serif/Mono; paper `#fdfaf6`, ink `#3a2a24`, clay-deep `#744d40`, sage `#48614c`; CTA cuối `--dark-cta: #181f1a`; body frame 1360px, gutter 24px/16px, hairline, pill, ảnh hiện có và crop từng nhóm.
- Ngoại lệ đã có: chrome 1240px khác page body 1360px; CTA cuối Services có màu riêng so với homepage. Ngoại lệ overlay riêng `/services` dưới đây là **đề xuất mới**, không phải quyết định đã được ghi nhận trong DESIGN.

## Các điểm cần chỉnh

| Điểm                           | Bằng chứng hiện trạng                                                                                                                                     | Quyết định đề xuất                                                           | Mức chắc chắn                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Nội dung bị overlay che        | 390×844: phone/Zalo giao dòng mô tả và link Tapping sau khi đóng cookie; banner cookie còn che nội dung lúc chưa chọn. Checklist cấm nội dung/CTA bị che. | Chuyển liên hệ và cookie vào flow riêng route; bỏ chat nổi trên `/services`. | Cao về lỗi; cần xem preview để duyệt bố cục thay thế.                            |
| Khó nhìn tổng quan trên mobile | Panel manual mở sẵn cao khoảng 862px ở 390px; summary nhóm thứ hai bắt đầu khoảng y=1250.                                                                 | Mục lục nhóm nhỏ trước panel, giữ first-open.                                | Quan sát chắc chắn; cải thiện khả năng tìm nhóm là giả thuyết UX cần kiểm chứng. |
| CTA bị ép chữ ở desktop hẹp    | 1024px: copy khoảng 247px, actions khoảng 577px; tiêu đề xuống ba dòng. Không tràn ngang.                                                                 | Cho CTA stack từ ≤1280px; giữ hàng ngang >1280px.                            | Quan sát chắc chắn; 1280px là giá trị đề xuất từ độ rộng nội dung.               |

Các số trên là baseline local với copy đang render, không phải giới hạn áp dụng cho mọi dữ liệu CMS. Không gọi partial overlap là kết luận fail WCAG 2.4.11 AA.

## Bố cục đích

```text
Mobile / tablet hẹp ≤860px
  Nav hiện có
  Cookie trong flow, chỉ khi chưa có lựa chọn                 [03]
  Dịch vụ + mô tả + link Phương pháp
  Link gọi / Zalo / Messenger nếu có                         [03]
  Đi nhanh đến nhóm dịch vụ: lưới link 2 cột, wrap            [01]
  Accordion: summary → copy + booking → ảnh
  Quy trình ba bước hiện có
  CTA: heading + copy → ba hành động xếp dọc ở ≤700px        [02]
       → link liên hệ trong flow                            [03]
  Footer hiện có

Desktop >1280px
  Intro hai cột + link liên hệ trong flow                    [03]
  Accordion chữ/ảnh hiện có; không thêm mục lục trùng
  Quy trình ba cột hiện có
  CTA: copy trái / actions + link liên hệ phải               [02,03]
```

Không đặt mục tiêu “mọi lựa chọn phải nằm trong màn hình đầu” khi cookie hiện, font lớn hoặc CMS title dài. Điều kiện cần là mục lục nằm **trước nội dung mở rộng**, không phải ép chiều cao hoặc cắt chữ.

## Thứ tự thực hiện

| Bước | Plan tự đủ ngữ cảnh                                            | Kết quả kiểm chứng trước bước tiếp                                              |
| ---- | -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1    | [01 — chọn nhóm trên mobile](./services-mobile-discovery.md)   | Link đúng nhóm, hash/Back/Forward/native details còn hoạt động.                 |
| 2    | [02 — CTA responsive](./services-responsive-cta.md)            | 1024px không còn cột chữ 247px; không cắt nội dung hai phía breakpoint.         |
| 3    | [03 — nội dung không bị che](./services-unobscured-content.md) | Không chat nổi trên route; có liên hệ thay thế; cookie flow và route khác đúng. |
| 4    | Review tổng hợp                                                | Ảnh before/after và các check repo đạt; ghi rõ dữ liệu thật/fallback đã kiểm.   |

Ba plan cùng chạm `page.tsx`/CSS, thực hiện tuần tự trên cùng nhánh. Không cần tách thành ba PR; không đổi tên nhánh, commit, push hay mở PR trong lượt lập plan.

## Phạm vi và giới hạn

- Giữ bốn nhóm, thứ tự CMS, summary/body/bullets, mọi treatment link, ảnh/crop, recovery sub-cards và training link phụ. Không sửa schema, seed, migration, giá hoặc copy y tế.
- Không thay first-open theo `matchMedia`, không tạo tabs/state accordion mới, không thêm sticky dock, animation hay dependency.
- Giữ quy trình ba bước và nhịp ảnh hiện tại. Không thu nhỏ chữ/ảnh chỉ để giảm chiều cao; chưa có căn cứ chọn thay đổi đó.
- Các ảnh baseline nằm dưới `.context/` (gitignored): `services-mobile-top.png`, `services-mobile-full.png`, `services-desktop-full.png`, `services-desktop-1024.png`. Người review ngoài workspace không có các file này; executor cần đính kèm before/after khi mở PR.
- Tài liệu này được lập trước khi code. Kết quả thực tế và các giới hạn kiểm chứng sau triển khai nằm trong verification note được liên kết ở đầu file.

## Cổng nghiệm thu chung

- Viewports: 320, 390, 768, 860/861, 980, 1024, 1280/1281 và 1440px; zoom 200%, reduced motion, keyboard; xem cả bounding boxes vì `overflow: clip` có thể giấu lỗi.
- Đủ bốn nhóm và từng nhóm mở; CMS đổi thứ tự/thiếu nhóm/title dài; thiếu ảnh/reference theo reader hiện hành; trường hợp services rỗng không có mục lục rỗng.
- JS bật/tắt; hash trực tiếp, cùng hash, alias `#svc-therapy`, links từ homepage/footer; booking giữ `?service=<group>`.
- Cookie chưa chọn/accepted/rejected/block storage/mở lại preferences; hai hoặc ba kênh liên hệ; điều hướng vào/ra `/services` không để lại trạng thái layout.
- Dữ liệu fallback **và** Sanity staging thật khi có cấu hình. Nếu chưa kiểm được staging, ghi rõ khoảng trống bằng chứng, không đánh dấu đã hoàn tất.
- Chạy `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Không tự hạ quality gate khi có lỗi không liên quan; ghi tách lỗi nền và lỗi mới.
- Sau nghiệm thu, cập nhật mô tả Services/ngoại lệ overlay trong `DESIGN.md` và ghi bằng chứng vào issue/PR #41 theo quyền thao tác của phiên triển khai. Plan không tự đóng issue.
