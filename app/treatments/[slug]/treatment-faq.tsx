import type { TreatmentFaq } from "@/lib/content";
import { paragraphs } from "@/lib/treatment-display";
import { SectionHead } from "./section-head";
import styles from "./treatment-page.module.css";

export function TreatmentFaqList({ faqs }: { faqs: TreatmentFaq[] }) {
  if (!faqs.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="cau-hoi">
      <SectionHead id="cau-hoi">Câu hỏi thường gặp</SectionHead>
      <div className={styles.faq}>
        {faqs.map((faq, index) => (
          <details key={index}>
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
