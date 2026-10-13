import Image from "next/image";
import Link from "next/link";
import { methodAnchor, methodStages } from "@/lib/content";
import { getMethods } from "@/lib/sanity";
import { createMetadata } from "@/lib/seo";
import { MethodArticle, MethodsExplorer, MethodTags } from "./methods-explorer";
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
              Holistic đánh giá khả năng vận động, rồi kết hợp trị liệu và bài tập phù hợp với nhu
              cầu của bạn.
            </p>
          </div>
        </div>
      </section>

      <noscript>
        <style>{`@media (max-width: 700px) { [id$="-body"] { display: flex !important; } button[aria-controls$="-body"] { display: none !important; } }`}</style>
      </noscript>

      <MethodsExplorer
        stages={methodStages.map(({ id, title }) => ({ id, title }))}
        items={methods.map((method) => ({
          group: method.group,
          stage: methodStages.find((stage) =>
            (stage.groups as readonly string[]).includes(method.group),
          )!.id,
          anchor: methodAnchor[method.group],
          filterTags: method.filterTags,
          content: (
            <MethodArticle
              key={method.group}
              id={methodAnchor[method.group]}
              title={method.title}
              media={
                <div className={styles.methodMedia}>
                  <Image
                    src={method.image}
                    alt={method.imageAlt}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 980px) 100vw, 40vw"
                  />
                </div>
              }
              head={
                <>
                  <h3>{method.title}</h3>
                  {method.indexSubtitle ? (
                    <p className={styles.methodSub}>{method.indexSubtitle}</p>
                  ) : null}
                </>
              }
            >
              <p className={styles.methodText}>{method.body}</p>
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
            </MethodArticle>
          ),
        }))}
      />

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
