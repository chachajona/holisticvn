import { LeadForm } from "@/components/lead-form";
import { PhoneIcon } from "./treatment-icons";
import styles from "./treatment-page.module.css";

export function BookingPanel({ title, phone }: { title: string; phone?: string }) {
  return (
    <section className={styles.panel} id="yeu-cau" aria-labelledby="yeu-cau-title" tabIndex={-1}>
      <div className={styles.panelCopy}>
        <h2 id="yeu-cau-title">Muốn biết liệu pháp này có phù hợp với bạn?</h2>
        <p>
          Để lại tên và số điện thoại. Holistic sẽ gọi lại để trao đổi và xác nhận thời gian; đây
          chưa phải lịch hẹn.
        </p>
        {phone ? (
          <a className={styles.bookingContact} href={`tel:${phone.replaceAll(" ", "")}`}>
            <PhoneIcon />
            {phone}
          </a>
        ) : null}
      </div>
      <div>
        <LeadForm kind="booking" treatment={title} submitLabel="Gửi yêu cầu tư vấn" />
        <p className={styles.formContext}>Liệu pháp: {title}</p>
      </div>
    </section>
  );
}
