import Image from "next/image";
import Link from "next/link";
import {
  methodStages,
  type MethodStageId,
  type Treatment,
  type TreatmentBadge,
} from "@/lib/content";
import { englishSubtitle, paragraphs } from "@/lib/treatment-display";
import styles from "./treatment-page.module.css";

const badgeText: Record<TreatmentBadge, string> = { popular: "Được chọn nhiều", new: "Mới" };

export function BadgeMark({
  badge,
  variant,
}: {
  badge: TreatmentBadge;
  variant: "stamp" | "chip";
}) {
  return (
    <span
      className={`${variant === "stamp" ? styles.badge : styles.badgeChip} ${badge === "new" ? styles.badgeNew : ""}`}
      data-badge={badge}
      data-variant={variant}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {badge === "popular" ? (
          <path d="M5 12.5 10 17.5 19 7" />
        ) : (
          <>
            <path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Z" />
            <path d="M4 20 14 10" />
          </>
        )}
      </svg>
      <span>{badgeText[badge]}</span>
    </span>
  );
}

type Props = {
  treatment: Treatment;
  stages: MethodStageId[];
  phone: string;
  showPrimaryCta: boolean;
};

export function TreatmentHero({ treatment, stages, phone, showPrimaryCta }: Props) {
  const subtitle = englishSubtitle(treatment);
  const lede = paragraphs(treatment.shortDescription || treatment.description);
  const { badge, image } = treatment;
  return (
    <>
      <Link className={styles.back} href="/treatments">
        ← Tất cả phương pháp
      </Link>
      <section
        className={styles.hero}
        aria-label={treatment.title}
        data-plain={image ? undefined : ""}
      >
        <div className={styles.heroCard}>
          {image ? (
            <>
              <div className={styles.heroPhoto}>
                <Image
                  src={image}
                  alt={treatment.imageAlt ?? treatment.title}
                  fill
                  priority
                  sizes="(max-width: 760px) 100vw, 1360px"
                />
              </div>
              <div className={styles.heroScrim} aria-hidden="true" />
            </>
          ) : null}
          <div className={styles.heroContent}>
            {badge && !image ? <BadgeMark badge={badge} variant="chip" /> : null}
            <h1>{treatment.title}</h1>
            {subtitle ? (
              <p className={styles.subtitle} lang="en">
                {subtitle}
              </p>
            ) : null}
            {lede.map((text, index) => (
              <p className={styles.lede} key={index}>
                {text}
              </p>
            ))}
            <div className={styles.heroActions} id="treatment-hero-actions">
              {showPrimaryCta ? (
                <a className={`${styles.btn} ${styles.btnLight}`} href="#yeu-cau">
                  Gửi yêu cầu tư vấn →
                </a>
              ) : null}
              <a
                className={`${styles.btn} ${styles.btnOutline}`}
                href={`tel:${phone.replaceAll(" ", "")}`}
              >
                Gọi {phone}
              </a>
            </div>
          </div>
          {badge && image ? <BadgeMark badge={badge} variant="stamp" /> : null}
          {stages.length ? (
            <div className={styles.ribbon} role="group" aria-label="Lộ trình">
              <span className={styles.ribbonLabel}>Lộ trình</span>
              {methodStages.map((stage, index) => (
                <span className={styles.ribbonStep} key={stage.id}>
                  {index > 0 ? <span className={styles.ribbonLine} aria-hidden="true" /> : null}
                  <span className={stages.includes(stage.id) ? styles.stageOn : styles.stage}>
                    <span className={styles.stageDot} aria-hidden="true" />
                    {stage.title}
                  </span>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
