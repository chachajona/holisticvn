import type { TreatmentFaq } from "@/lib/content";
import { paragraphs } from "@/lib/treatment-display";
import styles from "./treatment-page.module.css";

export function TreatmentFaqList({ faqs }: { faqs: TreatmentFaq[] }) {
  if (!faqs.length) return null;
  return (
    <section className={styles.faqSection} aria-labelledby="cau-hoi">
      <div className={styles.faqIntro}>
        <h2 id="cau-hoi">
          Bạn có thể
          <br />
          đang băn khoăn
        </h2>
        <p>Một vài thông tin để bạn chuẩn bị trước khi liên hệ với Holistic.</p>
      </div>
      <div className={styles.faq}>
        {faqs.map((faq, index) => (
          <details key={index} open={index === 0}>
            <summary>{faq.question}</summary>
            {paragraphs(faq.answer).map((text, line) => (
              <p key={line}>{text}</p>
            ))}
          </details>
        ))}
      </div>
    </section>
  );
}
