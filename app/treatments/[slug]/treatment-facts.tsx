import type { CSSProperties } from "react";
import { certifiedPractitionerNote, type FactCell } from "@/lib/treatment-display";
import styles from "./treatment-page.module.css";

export function TreatmentFacts({ cells }: { cells: FactCell[] }) {
  if (!cells.length) return null;
  return (
    <section
      className={styles.facts}
      id="treatment-facts"
      aria-label="Thông tin nhanh"
      style={{ "--cells": cells.length } as CSSProperties}
    >
      {cells.map((cell) => (
        <div className={styles.factCell} key={cell.label}>
          <span className={styles.factLabel}>{cell.label}</span>
          <span className={styles.factValue}>{cell.value}</span>
        </div>
      ))}
      <div className={styles.factCta}>
        <a className={`${styles.btn} ${styles.btnPrimary}`} href="#yeu-cau">
          Gửi yêu cầu tư vấn →
        </a>
      </div>
    </section>
  );
}

export function CertifiedNote() {
  return <p className={styles.cert}>{certifiedPractitionerNote}</p>;
}
