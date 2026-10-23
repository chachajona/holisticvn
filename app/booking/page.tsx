import { LeadForm } from "@/components/lead-form";
import { createMetadata } from "@/lib/seo";
import { getBookingService } from "@/lib/sanity";

export const metadata = createMetadata({
  title: "Đặt lịch tư vấn",
  description: "Gửi yêu cầu đặt lịch với HolisticVN.",
  path: "/booking",
});
export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Context is optional: unknown/repeated ?service values and a CMS outage must not block booking.
  const { service: group } = await searchParams;
  const service = typeof group === "string" ? await getBookingService(group) : undefined;
  return (
    <main id="main">
      <section className="booking-page booking-page--compact">
        <div className="shell booking-page__grid">
          <div>
            <p className="eyebrow">Đặt lịch tư vấn</p>
            <h1 className="display">Để Holistic gọi lại cho bạn.</h1>
            <p>
              Để lại tên và số điện thoại. Nhân viên sẽ gọi lại, kiểm tra lịch tại cơ sở Lê Quốc
              Hưng rồi xác nhận với bạn. Gửi form chưa tạo lịch hẹn.
            </p>
            {service ? <p className="eyebrow">Dịch vụ: {service.title}</p> : null}
          </div>
          <div className="booking-page__form">
            <LeadForm kind="booking" treatment={service?.title} />
          </div>
        </div>
      </section>
    </main>
  );
}
