import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";

const documents: Record<string, { title: string; intro: string; body: string[] }> = {
  "privacy-policy": {
    title: "Chính sách quyền riêng tư",
    intro: "HolisticVN tôn trọng và bảo vệ thông tin cá nhân của bạn.",
    body: [
      "Chúng tôi chỉ thu thập thông tin bạn chủ động cung cấp qua form liên hệ hoặc đặt lịch để phản hồi yêu cầu và cải thiện dịch vụ.",
      "Thông tin từ form tư vấn, liên hệ và đặt lịch được chuyển qua dịch vụ email Resend đến hộp thư nhân viên của HolisticVN để liên hệ lại; form không tự tạo lịch hẹn. Website không lưu yêu cầu vào cơ sở dữ liệu riêng; nhân viên xử lý và xác nhận lịch thủ công trên hệ thống đặt lịch của phòng khám.",
      "Nếu bạn đồng ý cookie phân tích, Google nhận các sự kiện sử dụng nêu trong Chính sách cookie; những sự kiện này không gồm nội dung bạn gửi qua form. Chúng tôi không bán thông tin cá nhân cho bên thứ ba. Bạn có thể yêu cầu xem, cập nhật hoặc xóa thông tin bằng cách liên hệ với HolisticVN.",
    ],
  },
  "terms-conditions": {
    title: "Điều khoản sử dụng",
    intro: "Các nội dung trên website nhằm cung cấp thông tin tổng quan về dịch vụ HolisticVN.",
    body: [
      "Thông tin trên website không thay thế cho chẩn đoán hoặc tư vấn y tế cá nhân.",
      "Mọi lịch hẹn chỉ được xác nhận sau khi HolisticVN liên hệ trực tiếp với khách hàng.",
      "HolisticVN có thể cập nhật nội dung website và các điều khoản này để phản ánh hoạt động thực tế.",
    ],
  },
  "cookie-policy": {
    title: "Chính sách cookie",
    intro: "Website sử dụng cookie thiết yếu và chỉ kích hoạt analytics khi bạn đồng ý.",
    body: [
      "Cookie thiết yếu giúp website hoạt động ổn định, bao gồm cookie holisticvn-cookie-consent-v1 lưu lựa chọn cookie của bạn trong 12 tháng.",
      "Chỉ khi bạn chọn Chấp nhận, website mới tải Google Tag Manager. Dịch vụ này ghi nhận lượt xem trang, lượt bấm gọi, Zalo hoặc Messenger và lượt gửi form thành công để đánh giá hiệu quả nội dung và CTA. Các sự kiện này không chứa họ tên, số điện thoại, email hoặc nội dung bạn nhập. Google là bên nhận dữ liệu và các thẻ Google có thể đặt cookie phân tích.",
      "Nếu bạn Từ chối hoặc chưa chọn, website không tải Google Tag Manager và không gửi sự kiện phân tích. Các liên kết gọi điện, Zalo và Messenger vẫn dùng được bình thường.",
      "Bạn có thể thay đổi hoặc rút lại lựa chọn bất cứ lúc nào bằng nút Tùy chọn cookie ở cuối trang. Nút này xóa lựa chọn đã lưu cùng cookie phân tích của Google rồi hỏi lại bạn.",
    ],
  },
};
export function generateStaticParams() {
  return Object.keys(documents).map((policy) => ({ policy }));
}
export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const document = documents[policy];
  if (!document) notFound();
  return createMetadata({ title: document.title, description: document.intro, path: `/${policy}` });
}
export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const document = documents[(await params).policy];
  if (!document) notFound();
  return (
    <main id="main">
      <article className="policy">
        <div className="shell">
          <p className="eyebrow">HolisticVN</p>
          <h1 className="display">{document.title}</h1>
          <p className="policy__intro">{document.intro}</p>
          <div>
            {document.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
