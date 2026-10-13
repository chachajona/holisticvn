# Research skill motion từ UI Skills

Ngày đối chiếu: **2026-10-13**. Phạm vi: skill giúp thiết kế, triển khai và đánh giá chuyển động của website. Đã đọc [catalog Motion](https://www.ui-skills.com/skills/motion), từng trang skill và `SKILL.md` trong repo tác giả; các nguồn GitHub bên dưới được ghim commit để ghi lại phiên bản đã đọc. Đây là research, chưa cài skill hoặc thư viện, chưa sửa hay đo hiệu năng UI.

## Lựa chọn đề xuất cho HolisticVN

**Nhận định áp dụng cho dự án:** ưu tiên **`animate` của Emil Kowalski** khi cần viết motion cho một component, **`improve-animations`** khi cần rà toàn site và lập kế hoạch, kết hợp **`fixing-motion-performance` đang có** để giới hạn chi phí render. Khi cần định hướng motion theo thương hiệu, có thể dùng **`animate` trong Impeccable đang có** trước khi cài thêm.

Cơ sở dự án: [package.json](../package.json) đang dùng Next.js 16 + React 19, không khai báo Motion/Framer Motion/GSAP; [branch-sway.tsx](../components/branch-sway.tsx) dùng Web Animations API và đã đọc `prefers-reduced-motion`. [PRODUCT.md](../PRODUCT.md) xác định mục tiêu tư vấn/đặt lịch, còn [research CTA thương hiệu](homepage-closing-cta-research.md) ghi nhận phong cách thư thái, tối giản. Vì vậy đề xuất bắt đầu từ feedback của menu, nút và trạng thái form, giữ nội dung và CTA dễ đọc; đây là lựa chọn thiết kế, chưa có dữ liệu chuyển đổi chứng minh.

## So sánh 7 skill đã xác minh

| Skill / tác giả                                                                                                         | Công việc phù hợp                                 | Điểm nổi bật trong nguồn                                                                                                                                                                 | Giới hạn cần hiểu                                                                                                                                                     | Mức ưu tiên cho dự án                                                                  |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [animate — emilkowalski](https://www.ui-skills.com/skills/emilkowalski/animate)                                         | Viết motion mới cho component                     | Quyết định mục đích, tần suất, công cụ, easing, interruption; ưu tiên CSS → WAAPI → Motion khi cần; giữ token của repo. [SKILL.md][emil-animate]                                         | Nhiều giá trị bắt buộc và quy tắc mạnh theo triết lý tác giả; có thể trả kết luận không cần animation.                                                                | **Ưu tiên để triển khai**, hợp CSS/WAAPI sẵn có.                                       |
| [improve-animations — emilkowalski](https://www.ui-skills.com/skills/emilkowalski/improve-animations)                   | Audit toàn codebase, tạo roadmap                  | Recon stack rồi đánh giá 8 nhóm: purpose, timing, physicality, interruption, performance, accessibility, cohesion, opportunities; viết kế hoạch tự đủ ngữ cảnh. [SKILL.md][emil-improve] | Luồng audit chỉ đọc source và ghi plans; biến thể `execute <plan>` giao triển khai cho executor riêng. Audit/plan có điểm chờ người dùng chọn findings.               | **Ưu tiên khi muốn nâng chất motion toàn site**.                                       |
| [review-animations — emilkowalski](https://www.ui-skills.com/skills/emilkowalski/review-animations)                     | Review diff motion                                | Findings theo vị trí code, bảng thay đổi đề xuất, kết luận Block/Approve. [SKILL.md][emil-review]                                                                                        | Là review chuyên motion, không sửa feature; frontmatter có `disable-model-invocation: true`, nên gọi chủ động khi cần.                                                | Bổ sung khi làm nhiều thay đổi motion; cùng hệ quy tắc với `animate`.                  |
| [fixing-motion-performance — ibelick](https://www.ui-skills.com/skills/ibelick/fixing-motion-performance)               | Rà và sửa giật, layout thrashing, scroll/blur     | Batch DOM reads/writes, dừng motion ngoài màn hình, `will-change` có giới hạn; áp dụng CSS/WAAPI/GSAP/Motion hiện có. [SKILL.md][performance]                                            | Cấm tự chuyển animation library; yêu cầu kiểm tra layer bằng tooling khi hiệu năng là vấn đề.                                                                         | **Đã có trong môi trường**, dùng cùng skill triển khai.                                |
| [12-principles-of-animation — raphaelsalaja](https://www.ui-skills.com/skills/raphaelsalaja/12-principles-of-animation) | Checklist motion của một số file                  | Findings `file:line` theo timing/easing/physics/staging; có quy tắc điểm tập trung và biến dạng nhẹ. [SKILL.md][principles]                                                              | Dù tên gợi giáo trình 12 nguyên lý, file hiện tại là bộ rule audit UI; một số rule khác Emil.                                                                         | Tham khảo nguyên lý hoặc một góc review thêm, chưa cần mặc định.                       |
| [interaction-design — wshobson](https://www.ui-skills.com/skills/wshobson/interaction-design)                           | Pattern loading, toggle, toast, gesture, feedback | Bao phủ purpose, timing, CSS transitions/keyframes và ví dụ Framer Motion. [SKILL.md][interaction]                                                                                       | Ví dụ là mẫu tổng quát; không thể coi wrapper page transition là giải pháp đã xác minh cho App Router của repo. Có mẫu đọc `window` trực tiếp và ví dụ animate width. | Hữu ích khi thiết kế trạng thái form/feedback; cần điều chỉnh theo stack và hiệu năng. |
| [better-ui — jakubkrehel](https://www.ui-skills.com/skills/jakubkrehel/better-ui)                                       | Polish motion cùng surfaces/icons                 | Press state, hover gating, enter/exit, static cue đi kèm motion; tôn trọng các quy ước có chủ đích trong dự án. [SKILL.md][better]                                                       | Prescription cụ thể như scale `0.96`, blur `4px`, stagger `100ms`; reduced motion tham chiếu cả `better-accessibility`.                                               | Tùy chọn nếu muốn polish cả hình thức; có phần giao với Impeccable.                    |

Các mức ưu tiên và đánh giá phù hợp trong bảng là **suy luận từ nội dung skill và bối cảnh repo**, không phải xếp hạng của UI Skills hay kết quả benchmark.

## Các rule không nên trộn tự động

| Quyết định      | Raphael               | Emil                      | Better UI                   |
| --------------- | --------------------- | ------------------------- | --------------------------- |
| Easing khi exit | `ease-in`             | `ease-out`                | `ease-out` cho recipe exit  |
| Stagger         | Không quá `50ms/item` | `30–80ms` trong checklist | `100ms` cho staged entrance |

Nguồn: [Raphael][principles], [Emil][emil-animate], [Better UI][better]. Đây là các quy tắc thiết kế của tác giả, không phải chuẩn chung của trình duyệt. Chọn một hệ làm chủ đạo cho task, giữ token và quyết định đã ghi của HolisticVN. Mốc `300ms` và các tuyên bố GPU trong skill cần được hiểu trong ngữ cảnh; riêng [skill performance][performance] yêu cầu xác minh layer, không mặc định mọi transform đều được composite.

**Nhận định cho HolisticVN:** hạn chế blur và bounce; animation không nên trì hoãn booking/đọc thông tin. CTA cuối homepage đã có quyết định chủ động dùng trạng thái tĩnh trong [tài liệu CTA](homepage-closing-cta-research.md), nên audit phải tôn trọng quyết định đó.

## Những lựa chọn liên quan

- **Impeccable / animate — pbakaus:** [catalog](https://www.ui-skills.com/skills/pbakaus/animate) có một skill `animate` khác. Trong môi trường hiện tại, `/Users/chachajona/.codex/skills/impeccable/SKILL.md` đã expose `animate [target]` và có `reference/animate.md`; có thể sử dụng qua Impeccable. Đây là quan sát cài đặt local; không cần cài standalone để có lệnh này.
- **GSAP React — greensock:** [catalog](https://www.ui-skills.com/skills/greensock/gsap-react) và [repo chính thức](https://github.com/greensock/gsap-skills) có hướng dẫn React/Next.js với `useGSAP`, scope và cleanup. **Suy luận:** chỉ ưu tiên nếu chọn GSAP cho một yêu cầu timeline/scroll choreography cụ thể, vì repo hiện chưa dùng GSAP.

## Lệnh cài tham khảo

Lệnh dưới đây được đối chiếu với mục Install trên các trang catalog liên kết trong bảng; **chưa thực thi**. `npx ui-skills` là CLI đọc/tìm catalog; việc cài skill dùng `npx skills add` theo [tài liệu CLI](https://www.ui-skills.com/cli). Cài skill hướng dẫn agent khác với thêm thư viện animation vào app.

```sh
# Triển khai / audit / review cùng hệ Emil — chọn theo nhu cầu
npx skills add https://github.com/emilkowalski/skills --skill animate
npx skills add https://github.com/emilkowalski/skills --skill improve-animations
npx skills add https://github.com/emilkowalski/skills --skill review-animations

# Các lựa chọn bổ sung
npx skills add https://github.com/raphaelsalaja/skill --skill 12-principles-of-animation
npx skills add https://github.com/wshobson/agents --skill interaction-design
npx skills add https://github.com/jakubkrehel/skills --skill better-ui

# Đã có trong môi trường này; chỉ lưu lệnh nguồn để tham khảo
npx skills add https://github.com/ibelick/ui-skills --skill fixing-motion-performance
```

Prompt dùng tiếp, sau khi skill tương ứng khả dụng:

- “Dùng improve-animations quick để rà menu, carousel, branch-sway và feedback form; tôn trọng các quyết định motion đã ghi, lập ưu tiên và kế hoạch.”
- “Dùng animate của Emil cho trạng thái mở/đóng menu; giữ CSS/WAAPI hiện có, reduced motion và keyboard/focus đúng conventions.”
- “Dùng fixing-motion-performance để rà branch-sway và chuyển động carousel; chỉ đề xuất tối ưu trong stack hiện tại.”

Các prompt trên là đề xuất để triển khai sau, chưa phải một audit đã hoàn tất.

[emil-animate]: https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/animate/SKILL.md
[emil-improve]: https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/improve-animations/SKILL.md
[emil-review]: https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/review-animations/SKILL.md
[performance]: https://github.com/ibelick/ui-skills/blob/f2264c30213a8a55bd0a6a7668d0438e4564e090/skills/fixing-motion-performance/SKILL.md
[principles]: https://github.com/raphaelsalaja/skill/blob/dc9eef22f13635df77d9b9e67c82aa85d52a97b7/skills/12-principles-of-animation/SKILL.md
[interaction]: https://github.com/wshobson/agents/blob/46891e7e60da0e52baf1050b7b6391b64e84c6d9/plugins/ui-design/skills/interaction-design/SKILL.md
[better]: https://github.com/jakubkrehel/skills/blob/4c66b1fa86e9ab70187b43d7da9b6fdb29f2ef63/skills/better-ui/SKILL.md
