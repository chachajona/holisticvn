import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { serviceAnchor, type ServiceGroup } from "@/lib/content";
import { getServices } from "@/lib/sanity";
import { HashOpen } from "./hash-open";
import { ServicesIntro } from "./services-intro";
import styles from "./services.module.css";

// Owner-approved AI illustrations for this route; provenance: docs/services-ai-images.md.
const illustrations = {
  manual: {
    src: "/images/services/manual-ai-v2.webp",
    alt: "Thao tác bằng dụng cụ IASTM trên giường trị liệu",
  },
  electro: {
    src: "/images/services/electro-ai-v1.webp",
    alt: "Thiết bị điện trị liệu và hai miếng điện cực",
  },
  training: {
    src: "/images/services/training-ai-v2.webp",
    alt: "Tập với tạ đôi và nêm kê chân có người hướng dẫn",
  },
  recovery: {
    src: "/images/services/recovery-ai-v2.webp",
    alt: "Bồn ngâm lạnh mosaic xanh có nước và đá",
  },
} satisfies Record<ServiceGroup, { src: string; alt: string }>;

/*
Issue #41: typographic index. Each group is a native <details> row (first one open by default,
`name` makes the browser keep one open at a time). Summaries always show the group name and
summary, so the index works without JS; <HashOpen> only opens the row an #svc-* link points at.
DOM order is copy then image; there is no inline `order`.
*/

export const revalidate = 3600;

export const metadata = createMetadata({
  title: "Dịch vụ",
  description:
    "Trị liệu bằng tay, trị liệu bằng thiết bị, tập luyện và hồi phục thể chất tại HolisticVN. Tư vấn và lựa chọn phương pháp phù hợp với bạn.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <main id="main" className={styles.root}>
      <ServicesIntro />

      {services.length ? (
        <>
          <nav aria-label="Chọn nhóm dịch vụ" className={styles.groupNav}>
            <details className={styles.groupPicker}>
              <summary>Chọn nhóm dịch vụ</summary>
              <ul className={styles.groupNavLinks}>
                {services.map((service) => (
                  <li key={service.group}>
                    <a href={`#${serviceAnchor[service.group]}`}>{service.shortTitle}</a>
                  </li>
                ))}
              </ul>
            </details>
          </nav>
          <section className={styles.index} aria-label="Các nhóm dịch vụ">
            <HashOpen />
            {services.map((service, index) => (
              <details
                className={styles.row}
                id={serviceAnchor[service.group]}
                key={service.group}
                name="services"
                open={index === 0}
              >
                <summary>
                  {/* Pre-#41 bookmarks (#svc-therapy) land on the first group; static so it works without JS. */}
                  {service.group === "manual" ? (
                    <span id="svc-therapy" className={styles.legacyAnchor} aria-hidden="true" />
                  ) : null}
                  <h2>{service.shortTitle}</h2>
                  <span className={styles.rowSummary}>{service.summary}</span>
                </summary>
                <div className={styles.panel}>
                  <div className={styles.panelCopy}>
                    {service.title !== service.shortTitle ? (
                      <p className={styles.panelTitle}>{service.title}</p>
                    ) : null}
                    <p>{service.body}</p>
                    <ul className={styles.list}>
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
                    {service.group !== "recovery" && service.treatments.length ? (
                      <div className={styles.methods}>
                        {service.treatments.map((t) => (
                          <Link key={t.slug} href={`/treatments/${t.slug}`}>
                            {t.title}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                    <div className={styles.actions}>
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
                  </div>
                  <figure className={styles.panelFigure}>
                    <div className={styles.panelMedia} data-group={service.group}>
                      <Image
                        src={illustrations[service.group].src}
                        alt={illustrations[service.group].alt}
                        fill
                        loading={index === 0 ? "eager" : "lazy"}
                        // Measured LCP at 1440px; the rest load lazily inside closed rows.
                        fetchPriority={index === 0 ? "high" : undefined}
                        sizes="(max-width: 700px) calc(100vw - 32px), (max-width: 980px) calc(100vw - 48px), (max-width: 1408px) calc((100vw - 96px) / 2), 656px"
                      />
                    </div>
                  </figure>
                </div>
              </details>
            ))}
          </section>
        </>
      ) : null}

      <section className={styles.process} aria-labelledby="services-process-title">
        <div className={styles.processHead}>
          <h2 id="services-process-title">Các bước chăm sóc tại HolisticVN</h2>
          <i aria-hidden="true" />
        </div>
        <ol className={styles.processGrid}>
          <li className={styles.processCard}>
            <span className={styles.processNumeral} aria-hidden="true">
              01
            </span>
            <div>
              <h3>Đánh giá ban đầu</h3>
              <p>
                Chuyên viên tìm hiểu tình trạng cơ thể và mục tiêu của bạn để đề xuất phương pháp
                phù hợp.
              </p>
            </div>
          </li>
          <li className={styles.processCard}>
            <span className={styles.processNumeral} aria-hidden="true">
              02
            </span>
            <div>
              <h3>Trị liệu và tập luyện</h3>
              <p>
                Bạn được hướng dẫn trị liệu và tập luyện theo cùng một lộ trình, từ tư vấn đến hồi
                phục.
              </p>
            </div>
          </li>
          <li className={styles.processCard}>
            <span className={styles.processNumeral} aria-hidden="true">
              03
            </span>
            <div>
              <h3>Duy trì vận động</h3>
              <p>Duy trì các bài tập và thói quen vận động để chăm sóc sức khoẻ lâu dài.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <h2>Bạn cần tư vấn thêm?</h2>
          <Link href="/booking" className={styles.lightButton}>
            Đặt lịch tư vấn
          </Link>
        </div>
      </section>
    </main>
  );
}
