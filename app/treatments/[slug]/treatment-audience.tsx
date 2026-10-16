import { audienceNote } from "@/lib/treatment-detail";
import { SectionHead } from "./section-head";
import styles from "./treatment-page.module.css";

function TagRow({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className={styles.tagRow}>
      <span className={styles.tagLabel}>{label}</span>
      <ul className={styles.tagPills} role="list">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

type Props = { conditions: string[]; benefits: string[]; groupNames: string[] };

export function TreatmentAudience({ conditions, benefits, groupNames }: Props) {
  if (!conditions.length && !benefits.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="danh-cho-ai">
      <SectionHead id="danh-cho-ai">Dành cho ai, hướng tới gì</SectionHead>
      <div>
        <TagRow label="Khi bạn gặp" items={conditions} />
        <TagRow label="Hướng tới" items={benefits} />
      </div>
      <p className={styles.note}>{audienceNote(groupNames, conditions.length > 0)}</p>
    </section>
  );
}
