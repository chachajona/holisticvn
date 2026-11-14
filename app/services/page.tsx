import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { serviceAnchor } from "@/lib/content";
import { getServices } from "@/lib/sanity";
import { HashOpen } from "./hash-open";
import styles from "./services.module.css";

/*
Issue #41: typographic index. Each group is a native <details> row (first one open by default,
`name` makes the browser keep one open at a time). Summaries always show the group name and
summary, so the index works without JS; <HashOpen> only opens the row an #svc-* link points at.
DOM order is copy then image; there is no inline `order`.
*/

export const revalidate = 3600;

export const metadata = createMetadata({
  title: "Dịch vụ",
  description: "Trị liệu, tập luyện và thư giãn — kết hợp trên một lộ trình xuyên suốt.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <main id="main" className={styles.root}>
      <section className={styles.intro}>
        <h1>Dịch vụ</h1>
        <div className={styles.introSide}>
          <p>
            Chọn chương trình dịch vụ theo nhu cầu — hoặc lọc kỹ thuật theo triệu chứng tại Phương
            pháp.
          </p>
          <Link href="/treatments" className={styles.textLink}>
            Tìm theo triệu chứng ở Phương pháp <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {services.length ? (
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
                <div className={styles.panelMedia} data-group={service.group}>
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 980px) 100vw, 40vw"
                  />
                </div>
              </div>
            </details>
          ))}
        </section>
      ) : null}

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
