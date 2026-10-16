import type { ReactNode } from "react";
import styles from "./treatment-page.module.css";

// One section heading everywhere on the page: sage h2 with a hairline that runs on (homepage `.stepsHead`).
export function SectionHead({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className={styles.head}>
      <h2 id={id}>{children}</h2>
      <span className={styles.rule} aria-hidden="true" />
    </div>
  );
}
