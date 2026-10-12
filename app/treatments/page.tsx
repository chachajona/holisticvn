import Image from "next/image";
import Link from "next/link";
import { methodAnchor } from "@/lib/content";
import { getMethods } from "@/lib/sanity";
import { createMetadata } from "@/lib/seo";
import { MethodsExplorer, MethodTags } from "./methods-explorer";
import styles from "./treatments.module.css";

/*
DIRECTION CONTRACT (impeccable, brief-pinned — comp supplied as full desktop 1440 /
mobile 390 mock, no concept roll).
THESIS: Phương pháp (Methods) — a curated editorial index of the five technique
families Holistic draws from, presented as a numbered timeline rather than a raw
CMS treatment list, so a first-time visitor understands the "why" before the
"which."
OWN-WORLD: same Warm Clay Editorial v2 chrome as the homepage — card ground, ink
hero panel, sage/clay actions, Roboto Slab headings over Roboto Serif body.
STORY: a visitor unsure which technique fits reads five grouped families, sees
which symptoms each addresses, and books an assessment rather than guessing.
FIRST VIEWPORT: 340px full-bleed dark hero card, breadcrumb, "Phương pháp" title,
one clarifying line.
FORM: comp-led, brief-pinned (no seed key) — see .context/attachments.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

export const revalidate = 3600;

export const metadata = createMetadata({
  title: "Phương pháp",
  description:
    "Các phương pháp Holistic phối hợp theo tình trạng cụ thể của bạn: trị liệu thủ công, trị liệu bằng thiết bị, tập luyện phục hồi và tăng cường, ngâm lạnh, đèn hồng ngoại.",
  path: "/treatments",
});

export default async function TreatmentsPage() {
  const methods = await getMethods();
  return (
    <main id="main" className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <Image
            src="/images/HeroTreatments.jpg"
            alt="Dấu giác hơi trên vai sau buổi trị liệu"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div className={styles.heroScrim} />
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link href="/">Trang chủ</Link> &nbsp;/&nbsp; Phương pháp
            </div>
            <h1>Phương pháp</h1>
            <p className={styles.heroBody}>
              Mỗi người có thói quen sinh hoạt và khả năng vận động riêng. Holistic bắt đầu từ việc
              đánh giá cách bạn chuyển động, rồi kết hợp trị liệu và bài tập theo tình trạng và mục
              tiêu của bạn.
            </p>
          </div>
        </div>
      </section>

      <MethodsExplorer
        items={methods.map((method, i) => {
          const imageLeft = i % 2 === 0;
          return {
            group: method.group,
            anchor: methodAnchor[method.group],
            title: method.title,
            indexSubtitle: method.indexSubtitle,
            filterTags: method.filterTags,
            content: (
              <div
                className={styles.method}
                id={methodAnchor[method.group]}
                tabIndex={-1}
                key={method.group}
              >
                <div className={styles.methodRail}>
                  <span className={styles.methodNumeral}>{String(i + 1).padStart(2, "0")}</span>
                  {i < methods.length - 1 ? <div className={styles.methodLine} /> : null}
                </div>
                <div className={styles.methodBody}>
                  <div className={styles.methodCopy} style={{ order: imageLeft ? 2 : 1 }}>
                    <h2>{method.title}</h2>
                    <p>{method.body}</p>
                    <MethodTags ids={method.filterTags} />
                    {method.treatments.length ? (
                      <div className={styles.methodLinks}>
                        <span className={styles.methodLinksLabel}>Liệu pháp liên quan</span>
                        {method.treatments.map((t) => (
                          <Link key={t.slug} href={`/treatments/${t.slug}`}>
                            {t.title} ↗
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.methodMedia} style={{ order: imageLeft ? 1 : 2 }}>
                    <Image
                      src={method.image}
                      alt={method.imageAlt}
                      fill
                      sizes="(max-width: 980px) 100vw, 45vw"
                    />
                  </div>
                </div>
              </div>
            ),
          };
        })}
      />

      <section className={styles.note}>
        <div className={styles.noteCard}>
          <div className={styles.noteCopy}>
            <h2>Trị liệu và tập luyện kết nối trong một lộ trình phù hợp với bạn.</h2>
          </div>
          <Link href="/booking" className={styles.primaryButton}>
            Đặt lịch đánh giá ban đầu
          </Link>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaCopy}>
            <h2>Chưa chắc phương pháp nào phù hợp?</h2>
            <p>
              Buổi đánh giá ban đầu giúp bạn hiểu tình trạng vận động và trao đổi hướng trị liệu,
              tập luyện phù hợp.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/booking" className={styles.lightButton}>
              Đặt lịch đánh giá ban đầu
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
