import Link from "next/link";
import type { RelatedTreatment } from "@/lib/treatment-detail";
import { formatPrice } from "@/lib/treatment-display";
import { SectionHead } from "./section-head";
import styles from "./treatment-page.module.css";

export function TreatmentRelated({ related }: { related: RelatedTreatment[] }) {
  if (!related.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="co-the-ban-quan-tam">
      <SectionHead id="co-the-ban-quan-tam">Có thể bạn quan tâm</SectionHead>
      <ul className={styles.cards}>
        {related.map((item) => (
          <li key={item.slug}>
            <Link className={styles.cardLink} href={`/treatments/${item.slug}`}>
              <h3>{item.title}</h3>
              <span className={styles.cardMeta}>
                {item.price ? <b>{formatPrice(item.price)}</b> : <span />}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link className={styles.all} href="/treatments">
        Xem tất cả phương pháp →
      </Link>
    </section>
  );
}
