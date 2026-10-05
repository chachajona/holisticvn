import { LeadForm } from "@/components/lead-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Đặt lịch tư vấn", description: "Gửi yêu cầu đặt lịch với HolisticVN.", path: "/booking" });
export default function BookingPage() {
  return <main id="main">
    <section className="booking-page booking-page--compact">
      <div className="shell booking-page__grid">
        <div>
          <p className="eyebrow">Đặt lịch tư vấn</p>
          <h1 className="display">Để Holistic gọi lại cho bạn.</h1>
          <p>Để lại tên và số điện thoại. Nhân viên sẽ gọi lại, kiểm tra lịch tại chi nhánh phù hợp rồi xác nhận với bạn. Gửi form chưa tạo lịch hẹn.</p>
        </div>
        <div className="booking-page__form"><LeadForm kind="booking" /></div>
      </div>
    </section>
  </main>;
}
