import { LeadForm } from "@/components/lead-form";
import { PhoneIcon } from "./treatment-icons";
import styles from "./treatment-page.module.css";

export function BookingPanel({ title, phone }: { title: string; phone?: string }) {
  return (
    <section className={styles.panel} id="yeu-cau" aria-labelledby="yeu-cau-title" tabIndex={-1}>
      <div className={styles.panelCopy}>
        <h2 id="yeu-cau-title">Bạn cần trao đổi thêm?</h2>
        <p>Để lại số điện thoại. Holistic sẽ gọi lại để trao đổi và xác nhận lịch hẹn với bạn.</p>
        {phone ? (
          <a className={styles.bookingContact} href={`tel:${phone.replaceAll(" ", "")}`}>
            <PhoneIcon />
            {phone}
          </a>
        ) : null}
      </div>
      <div>
        <LeadForm
          kind="booking"
          treatment={title}
          submitLabel="Gọi lại cho tôi"
          successMessage="Đã gửi yêu cầu. Holistic sẽ gọi lại cho bạn."
          motion
        />
        <p className={styles.formContext}>Phương pháp: {title}</p>
      </div>
    </section>
  );
}
