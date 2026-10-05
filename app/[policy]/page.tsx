import { notFound } from "next/navigation";

const documents: Record<string, { title: string; intro: string; body: string[] }> = {
  "privacy-policy": {
    title: "Chính sách quyền riêng tư",
    intro: "HolisticVN tôn trọng và bảo vệ thông tin cá nhân của bạn.",
    body: [
      "Chúng tôi chỉ thu thập thông tin bạn chủ động cung cấp qua form liên hệ, đặt lịch hoặc newsletter để phản hồi yêu cầu và cải thiện dịch vụ.",
      "Thông tin từ form tư vấn, liên hệ và đặt lịch được chuyển qua dịch vụ email đến hộp thư của HolisticVN để nhân viên liên hệ lại; form không tự tạo lịch hẹn. Newsletter được lưu riêng để quản lý đăng ký nhận tin.",
      "Chúng tôi không bán thông tin cá nhân cho bên thứ ba. Bạn có thể yêu cầu xem, cập nhật hoặc xóa thông tin bằng cách liên hệ với HolisticVN.",
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
      "Cookie thiết yếu giúp website hoạt động ổn định, bao gồm việc lưu lựa chọn cookie của bạn.",
      "Khi bạn đồng ý, Google Tag Manager có thể ghi nhận dữ liệu sử dụng ở dạng tổng hợp nhằm đánh giá hiệu quả nội dung và CTA.",
      "Bạn có thể thay đổi lựa chọn bằng cách xóa cookie của website trong trình duyệt.",
    ],
  },
};
export function generateStaticParams() {
  return Object.keys(documents).map((policy) => ({ policy }));
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
