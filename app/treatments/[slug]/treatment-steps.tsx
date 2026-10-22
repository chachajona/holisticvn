import Image from "next/image";
import type { ProtocolStep } from "@/lib/content";
import { paragraphs } from "@/lib/treatment-display";
import styles from "./treatment-page.module.css";

export function TreatmentSteps({
  protocols,
  duration,
}: {
  protocols: ProtocolStep[];
  duration?: string;
}) {
  if (!protocols.length) return null;
  return (
    <section className={styles.session} aria-labelledby="buoi-tri-lieu">
      <div className={styles.sessionAside}>
        <h2 id="buoi-tri-lieu">
          Một buổi
          <br />
          diễn ra thế nào
        </h2>
        <p>
          Từ trao đổi ban đầu đến hướng dẫn sau buổi, bạn được chuyên viên đồng hành qua từng bước.
        </p>
        <div className={styles.sessionMeta}>
          <span>{protocols.length} bước</span>
          {duration?.trim() ? <span>{duration.trim()}</span> : null}
        </div>
        <figure className={styles.sessionPhoto}>
          <Image
            src="/images/TreatmentBeds.jpg"
            alt="Không gian giường trị liệu tại Holistic"
            width={640}
            height={460}
            sizes="320px"
          />
          <figcaption>Không gian trị liệu tại Holistic.</figcaption>
        </figure>
      </div>
      <ol className={styles.steps} role="list">
        {protocols.map((protocol, index) => (
          <li className={styles.step} key={`${protocol.step}-${index}`}>
            <span className={styles.stepNumeral} aria-hidden="true">
              {String(protocol.step).padStart(2, "0")}
            </span>
            <h3>{protocol.title}</h3>
            {paragraphs(protocol.description).map((text, line) => (
              <p key={line}>{text}</p>
            ))}
          </li>
        ))}
      </ol>
    </section>
  );
}
