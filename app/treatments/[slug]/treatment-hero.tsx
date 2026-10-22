import Image from "next/image";
import Link from "next/link";
import {
  methodAnchor,
  methodStages,
  type MethodStageId,
  type Treatment,
  type TreatmentBadge,
} from "@/lib/content";
import { englishSubtitle, paragraphs } from "@/lib/treatment-display";
import type { TreatmentDetail } from "@/lib/treatment-detail";
import { ArrowIcon, ChevronIcon } from "./treatment-icons";
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
  showPrimaryCta?: boolean;
  groups?: TreatmentDetail["groups"];
};

export function TreatmentHero({
  treatment,
  stages,
  phone,
  showPrimaryCta = true,
  groups = [],
}: Props) {
  const subtitle = englishSubtitle(treatment);
  const lede = paragraphs(treatment.shortDescription.trim() || treatment.description);
  const { badge, image } = treatment;
  const activeTitles = methodStages
    .filter((stage) => stages.includes(stage.id))
    .map((s) => s.title);
  return (
    <>
      <nav className={styles.breadcrumb} aria-label="Đường dẫn">
        <ol role="list">
          <li>
            <Link href="/treatments">Phương pháp</Link>
          </li>
          {groups.map((group) => (
            <li key={group.group}>
              <ChevronIcon />
              <Link href={`/treatments#${methodAnchor[group.group]}`}>{group.title}</Link>
            </li>
          ))}
          <li>
            <ChevronIcon />
            <span aria-current="page">{treatment.title}</span>
          </li>
        </ol>
      </nav>
      <section
        id="treatment-hero"
        className={styles.hero}
        aria-label={treatment.title}
        data-plain={image ? undefined : ""}
      >
        <div className={styles.heroCard}>
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
                <a className={`${styles.btn} ${styles.btnPrimary}`} href="#yeu-cau">
                  Nhận tư vấn <ArrowIcon />
                </a>
              ) : null}
              <a className={styles.textLink} href={`tel:${phone.replaceAll(" ", "")}`}>
                Gọi {phone}
              </a>
            </div>
            {stages.length ? (
              <div
                className={styles.ribbon}
                role="group"
                aria-label={`Lộ trình: ${activeTitles.join(", ")}`}
              >
                {methodStages.map((stage, index) => (
                  <span className={styles.ribbonStep} key={stage.id} aria-hidden="true">
                    {index > 0 ? <ArrowIcon /> : null}
                    <span className={stages.includes(stage.id) ? styles.stageOn : styles.stage}>
                      <span className={styles.stageDot} aria-hidden="true" />
                      {stage.title}
                    </span>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {image ? (
            <div className={styles.heroPhoto}>
              <Image
                src={image}
                alt={treatment.imageAlt ?? treatment.title}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1080px) 48vw, (max-width: 1440px) 44vw, 600px"
              />
              {badge ? <BadgeMark badge={badge} variant="stamp" /> : null}
              {image.startsWith("/images/") && (!badge || image.startsWith("/images/stock/")) ? (
                <span className={styles.heroCaption}>
                  {image.startsWith("/images/stock/") ? "Ảnh minh hoạ" : "Hình ảnh tại Holistic"}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
