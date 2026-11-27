import Link from "next/link";
import styles from "./services.module.css";

export function ServicesIntro() {
  return (
    <section className={styles.intro}>
      <h1>Dịch vụ</h1>
      <div className={styles.introRail}>
        <span className={styles.introRule} aria-hidden="true" />
        <Link href="/treatments" className={`${styles.textLink} ${styles.introLink}`}>
          Khám phá phương pháp trị liệu <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
