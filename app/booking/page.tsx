import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { createMetadata } from "@/lib/seo";
import { getBookingService } from "@/lib/sanity";
import styles from "./page.module.css";

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
    <main id="main" className={styles.root}>
      <div className={styles.shell}>
        <div className={styles.marker}>Đặt lịch tư vấn</div>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <h1>
              Để Holistic <span>gọi lại cho bạn.</span>
            </h1>
            <p className={styles.description}>
              Để lại tên và số điện thoại. Nhân viên sẽ gọi lại, kiểm tra lịch tại cơ sở Lê Quốc
              Hưng rồi xác nhận với bạn.
            </p>
            <p className={styles.notice}>Gửi yêu cầu chưa tạo lịch hẹn.</p>
          </div>
          <section className={styles.formPanel} aria-labelledby="booking-form-heading">
            <h2 id="booking-form-heading">Thông tin liên hệ</h2>
            {service ? (
              <p className={styles.service}>
                Dịch vụ: <strong>{service.title}</strong>
              </p>
            ) : null}
            <LeadForm kind="booking" treatment={service?.title} variant="page" />
            <p className={styles.privacy}>
              Thông tin được gửi đến đội ngũ Holistic để liên hệ lại.{" "}
              <Link href="/privacy-policy">Chính sách bảo mật</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
