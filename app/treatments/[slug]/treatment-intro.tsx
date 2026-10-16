import { introParts } from "@/lib/treatment-text";
import { SectionHead } from "./section-head";
import styles from "./treatment-page.module.css";

export function TreatmentIntro({ title, description }: { title: string; description: string }) {
  const { statement, rest } = introParts(description, title);
  if (!statement && !rest.length) return null;
  const body = rest.map((text, index) => <p key={index}>{text}</p>);
  return (
    <section className={styles.sec} aria-labelledby="gioi-thieu">
      <SectionHead id="gioi-thieu">Giới thiệu</SectionHead>
      {statement ? (
        <div className={styles.intro}>
          <p className={styles.statement}>
            {statement.map((part, index) =>
              part.emphasis ? <b key={index}>{part.text}</b> : <span key={index}>{part.text}</span>,
            )}
          </p>
          {rest.length ? <div className={styles.introText}>{body}</div> : null}
        </div>
      ) : (
        <div className={styles.introPlain}>{body}</div>
      )}
    </section>
  );
}
