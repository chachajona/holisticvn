import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { serviceAnchor, type ServiceGroup } from "@/lib/content";
import { getServices } from "@/lib/sanity";
import styles from "./services.module.css";

/*
Issue #41 (UX 1A/2A, approved): hero + 2x2 start-point grid, four deep-dive blocks on
alternating grounds (recovery splits into two sub-cards), 3-step process and a 3-exit CTA.
All blocks are always rendered so /, footer and #svc-* anchors land on the group heading.
DOM order is copy then image; the left/right swap is CSS grid only (no inline `order`).
*/

export const revalidate = 3600;

export const metadata = createMetadata({
  title: "Dịch vụ",
  description: "Trị liệu, tập luyện và thư giãn — kết hợp trên một lộ trình xuyên suốt.",
  path: "/services",
});

function CategoryIcon({ type }: { type: ServiceGroup }) {
  const paths = {
    manual: <path d="M12 5v14M5 12h14" />,
    electro: <path d="M13 3 6 14h5l-1 7 7-11h-5z" />,
    training: <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />,
    recovery: (
      <>
        <path d="M4 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
        <path d="M4 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      </>
    ),
  } as const;
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <main id="main" className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <Image
            src="/images/HeroBeds.jpg"
            alt="Chuyên viên chuẩn bị giường trị liệu tại phòng trị liệu Holistic"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div className={styles.heroScrim} />
          <div className={styles.heroContent}>
            <h1>Dịch vụ</h1>
            <p className={styles.heroBody}>
              Chọn chương trình dịch vụ theo nhu cầu — hoặc lọc kỹ thuật theo triệu chứng tại Phương
              pháp.
            </p>
            <Link href="/treatments" className={styles.heroLink}>
              Tìm theo triệu chứng ở Phương pháp <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {services.length ? (
        <nav className={styles.categories} aria-label="Các nhóm dịch vụ">
          <div className={styles.categoriesHead}>
            <h2>Chọn điểm bắt đầu phù hợp với bạn</h2>
          </div>
          <div className={styles.categoryGrid}>
            {services.map((service) => (
              <a
                href={`#${serviceAnchor[service.group]}`}
                key={service.group}
                className={styles.categoryCard}
              >
                <span className={styles.categoryIcon}>
                  <CategoryIcon type={service.group} />
                </span>
                <strong>{service.shortTitle}</strong>
                <span>{service.summary}</span>
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      {services.map((service, index) => (
        <section
          className={`${styles.dive} ${index % 2 === 0 ? styles.diveLight : styles.diveWarm}`}
          id={serviceAnchor[service.group]}
          key={service.group}
        >
          {/* Pre-#41 bookmarks (#svc-therapy) land on the first group; static so it works without JS. */}
          {service.group === "manual" ? <span id="svc-therapy" aria-hidden="true" /> : null}
          <div className={styles.diveInner}>
            <div className={styles.diveCopy}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <ul className={styles.diveList}>
                {service.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              {service.group === "recovery" && service.treatments.length ? (
                <ul className={styles.subCards}>
                  {service.treatments.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/treatments/${t.slug}`} className={styles.subCard}>
                        <strong>{t.title}</strong>
                        {t.shortDescription ? <span>{t.shortDescription}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className={styles.diveActions}>
                <Link
                  href={`/booking?service=${service.group}`}
                  className={styles.primaryButton}
                  aria-label={`Đặt lịch ${service.shortTitle}`}
                >
                  Đặt lịch <span aria-hidden="true">→</span>
                </Link>
                {service.group === "training" ? (
                  <Link href="/treatments#mtd-rehab" className={styles.textLink}>
                    Xem phương pháp tập luyện <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </div>
              {service.group !== "recovery" && service.treatments.length ? (
                <div className={styles.diveLinks}>
                  {service.treatments.map((t) => (
                    <Link key={t.slug} href={`/treatments/${t.slug}`}>
                      {t.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <div className={styles.diveMedia}>
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 980px) 100vw, 45vw"
              />
            </div>
          </div>
        </section>
      ))}

      <section className={styles.process}>
        <div className={styles.processHead}>
          <span>Cách chúng tôi làm việc</span>
          <i />
        </div>
        <div className={styles.processGrid}>
          <div className={styles.processCard}>
            <span className={styles.processNumeral}>01</span>
            <strong>Đánh giá</strong>
            <span>
              Tìm hiểu tình trạng cơ thể và mục tiêu của bạn trước khi đề xuất phương pháp.
            </span>
            <Link href="/booking" className={styles.textLink}>
              Đặt lịch đánh giá <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.processCard}>
            <span className={styles.processNumeral}>02</span>
            <strong>Trị liệu &amp; tập luyện</strong>
            <span>Kết hợp các dịch vụ phù hợp trên một lộ trình xuyên suốt.</span>
            <Link href="/treatments" className={styles.textLink}>
              Xem các phương pháp <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.processCard}>
            <span className={styles.processNumeral}>03</span>
            <strong>Duy trì &amp; hồi phục</strong>
            <span>Bài tập và thói quen giúp bạn giữ được sức khoẻ vận động lâu dài.</span>
            <Link href="/about" className={styles.textLink}>
              Cách Holistic đồng hành <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaCopy}>
            <h2>Tìm ngay liệu trình thích hợp dành cho bạn</h2>
            <p>Khám phá các dịch vụ vật lý trị liệu chuyên biệt của chúng tôi.</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/booking" className={styles.lightButton}>
              Đặt lịch đánh giá ban đầu
            </Link>
            <Link href="/treatments" className={styles.darkSolidButton}>
              Tìm theo triệu chứng
            </Link>
            <Link href="/contact" className={styles.darkOutlineButton}>
              Liên hệ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
