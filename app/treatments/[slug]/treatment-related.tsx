import Image from "next/image";
import Link from "next/link";
import type { RelatedTreatment, TreatmentDetail } from "@/lib/treatment-detail";
import { formatPrice } from "@/lib/treatment-display";
import { ArrowIcon } from "./treatment-icons";
import styles from "./treatment-page.module.css";

export function TreatmentRelated({
  related,
  groups = [],
}: {
  related: RelatedTreatment[];
  groups?: TreatmentDetail["groups"];
}) {
  if (!related.length) return null;
  const groupTitle = groups.length === 1 ? groups[0].title : undefined;
  const heading = groupTitle
    ? `Cùng nhóm ${groupTitle.charAt(0).toLocaleLowerCase("vi")}${groupTitle.slice(1)}`
    : "Liệu pháp cùng nhóm";
  return (
    <section className={styles.relatedSection} aria-labelledby="co-the-ban-quan-tam">
      <div className={styles.sectionTop}>
        <h2 id="co-the-ban-quan-tam">{heading}</h2>
        <Link className={styles.textLink} href="/treatments">
          Xem tất cả phương pháp <ArrowIcon />
        </Link>
      </div>
      <ul className={styles.relatedGrid} role="list">
        {related.map((item) => (
          <li key={item.slug}>
            <Link
              className={styles.related}
              href={`/treatments/${item.slug}`}
              data-plain={item.image ? undefined : ""}
            >
              {item.image ? (
                <figure className={styles.relatedMedia}>
                  <Image
                    src={item.image}
                    alt={item.imageAlt ?? item.title}
                    width={290}
                    height={290}
                    sizes="(max-width: 760px) 95px, (max-width: 1080px) 100px, 145px"
                  />
                  {item.image.startsWith("/images/stock/") ? (
                    <figcaption>Ảnh minh hoạ</figcaption>
                  ) : null}
                </figure>
              ) : null}
              <div>
                <h3>
                  {item.title} <ArrowIcon />
                </h3>
                {item.shortDescription ? <p>{item.shortDescription}</p> : null}
                {item.price ? (
                  <p className={styles.relatedPrice}>{formatPrice(item.price)}</p>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
