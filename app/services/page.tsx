import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { serviceAnchor, type ServiceGroup } from "@/lib/content";
import { getServices } from "@/lib/sanity";
import styles from "./services.module.css";

/*
DIRECTION CONTRACT (impeccable, brief-pinned — comp supplied as full desktop 1440 /
mobile 390 mock, no concept roll).
THESIS: Dịch vụ (Services) — three entry categories (trị liệu / tập luyện / thư
giãn), each opened into a deep-dive section, so a visitor picks a starting point
by what they need rather than browsing an undifferentiated list.
OWN-WORLD: same Warm Clay Editorial v2 chrome as the homepage and Methods page —
card ground, ink hero panel, sage/clay actions, Roboto Slab headings over
Roboto Serif body.
STORY: a visitor picks the category matching their need, reads the specific
technique and its outcomes, and books that service — or follows a real
treatment link into CMS-backed detail.
FIRST VIEWPORT: 340px full-bleed dark hero card, "Dịch vụ" title, one clarifying line.
FORM: comp-led, brief-pinned (no seed key) — see .context/attachments.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

export const revalidate = 3600;

export const metadata = createMetadata({
  title: "Dịch vụ",
  description: "Trị liệu, tập luyện và thư giãn — kết hợp trên một lộ trình xuyên suốt.",
  path: "/services",
});

function CategoryIcon({ type }: { type: ServiceGroup }) {
  const paths = {
    therapy: <path d="M12 5v14M5 12h14" />,
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
              Trị liệu, tập luyện và thư giãn — kết hợp trên một lộ trình xuyên suốt.
            </p>
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

      {services.map((service, index) => {
        const imageLeft = index % 2 === 1;
        return (
          <section className={styles.dive} id={serviceAnchor[service.group]} key={service.group}>
            <div className={styles.diveCopy} style={{ order: imageLeft ? 2 : 1 }}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <ul className={styles.diveList}>
                {service.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link
                href={`/booking?service=${service.group}`}
                className={styles.primaryButton}
                aria-label={`Đặt lịch ${service.shortTitle}`}
              >
                Đặt lịch <span aria-hidden="true">→</span>
              </Link>
              {service.treatments.length ? (
                <div className={styles.diveLinks}>
                  {service.treatments.map((t) => (
                    <Link key={t.slug} href={`/treatments/${t.slug}`}>
                      {t.title} ↗
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <div className={styles.diveMedia} style={{ order: imageLeft ? 1 : 2 }}>
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 980px) 100vw, 45vw"
              />
            </div>
          </section>
        );
      })}

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
          </div>
          <div className={styles.processCard}>
            <span className={styles.processNumeral}>02</span>
            <strong>Trị liệu &amp; tập luyện</strong>
            <span>Kết hợp các dịch vụ phù hợp trên một lộ trình xuyên suốt.</span>
          </div>
          <div className={styles.processCard}>
            <span className={styles.processNumeral}>03</span>
            <strong>Duy trì</strong>
            <span>Bài tập và thói quen giúp bạn giữ được sức khoẻ vận động lâu dài.</span>
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
              Đặt lịch hẹn
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
