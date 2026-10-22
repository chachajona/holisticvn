import type { CSSProperties } from "react";
import { certifiedPractitionerNote, type FactCell } from "@/lib/treatment-display";
import styles from "./treatment-page.module.css";

export function TreatmentFacts({ cells }: { cells: FactCell[] }) {
  if (!cells.length) return null;
  return (
    <dl
      className={styles.facts}
      id="treatment-facts"
      aria-label="Thông tin nhanh"
      style={{ "--cells": cells.length } as CSSProperties}
    >
      {cells.map((cell) => (
        <div className={styles.factCell} key={cell.label}>
          <dt className={styles.factLabel}>{cell.label}</dt>
          <dd className={styles.factValue}>{cell.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CertifiedNote() {
  return <p className={styles.cert}>{certifiedPractitionerNote}</p>;
}
