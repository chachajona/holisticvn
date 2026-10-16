import { LeadForm } from "@/components/lead-form";
import styles from "./treatment-page.module.css";

export function BookingPanel({ title }: { title: string }) {
  return (
    <section className={styles.panel} id="yeu-cau" aria-labelledby="yeu-cau-title">
      <div>
        <h2 id="yeu-cau-title">Muốn biết liệu pháp này có phù hợp với bạn?</h2>
        <p>
          Để lại tên và số điện thoại. Holistic sẽ gọi lại để trao đổi và xác nhận thời gian; đây
          chưa phải lịch hẹn.
        </p>
      </div>
      <LeadForm kind="booking" treatment={title} />
    </section>
  );
}
