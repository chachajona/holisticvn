import type { ProtocolStep } from "@/lib/content";
import { SectionHead } from "./section-head";
import styles from "./treatment-page.module.css";

export function TreatmentSteps({ protocols }: { protocols: ProtocolStep[] }) {
  if (!protocols.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="buoi-tri-lieu">
      <SectionHead id="buoi-tri-lieu">Một buổi diễn ra thế nào</SectionHead>
      <ol className={styles.stepsGrid} role="list">
        {protocols.map((protocol, index) => (
          <li className={styles.stepCard} key={`${protocol.step}-${index}`}>
            <span className={styles.stepNumeral} aria-hidden="true">
              {String(protocol.step).padStart(2, "0")}
            </span>
            <h3>{protocol.title}</h3>
            {protocol.description ? <p>{protocol.description}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
