import Image from "next/image";
import Link from "next/link";
import { Roboto_Mono, Roboto_Serif, Roboto_Slab } from "next/font/google";
import { createMetadata } from "@/lib/seo";
import { treatments } from "@/lib/content";
import { HolisticFooter } from "@/components/holistic-footer";
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
FIRST VIEWPORT: 340px full-bleed dark hero card, breadcrumb, "Dịch vụ" title,
one clarifying line.
FORM: comp-led, brief-pinned (no seed key) — see .context/attachments.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

const robotoSlab = Roboto_Slab({
  subsets: ["vietnamese", "latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});
const robotoSerif = Roboto_Serif({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500"],
  style: ["italic", "normal"],
  variable: "--font-accent",
  display: "swap",
});
const robotoMono = Roboto_Mono({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = createMetadata({
  title: "Dịch vụ",
  description:
    "Trị liệu, tập luyện và thư giãn — kết hợp trong cùng một lộ trình, theo sát bởi một chuyên viên.",
  path: "/services",
});

function CategoryIcon({ type }: { type: "therapy" | "training" | "recovery" }) {
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

const categories = [
  {
    id: "svc-therapy",
    icon: "therapy" as const,
    title: "Trị liệu",
    copy: "Giảm đau và điều chỉnh cấu trúc bằng tay và thiết bị hỗ trợ chuyên sâu.",
  },
  {
    id: "svc-training",
    icon: "training" as const,
    title: "Tập luyện",
    copy: "Bài tập điều chỉnh tư thế và tăng sức mạnh, cá nhân hoá theo cơ thể bạn.",
  },
  {
    id: "svc-recovery",
    icon: "recovery" as const,
    title: "Thư giãn & hồi phục",
    copy: "Ngâm lạnh, hồng ngoại và thư giãn cơ bắp sau tập luyện nặng.",
  },
];

function treatmentLinks(slugs: string[]) {
  return slugs
    .map((slug) => treatments.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
}

const dives = [
  {
    id: "svc-therapy",
    title: "Trị liệu bằng tay",
    body: "Kỹ thuật manual therapy chuyên sâu giúp giảm đau vai gáy, cột sống và khớp — kết hợp đánh giá tư thế và vận động trước khi can thiệp.",
    bullets: [
      "Đánh giá tư thế và biên độ vận động",
      "Nắn chỉnh và giải phóng mô mềm",
      "Hướng dẫn bài tập duy trì tại nhà",
    ],
    cta: "Đặt lịch trị liệu",
    image: "/images/acupuncture.jpg",
    imageLeft: false,
    related: treatmentLinks(["dry-needling", "cupping", "iastm"]),
  },
  {
    id: "svc-training",
    title: "Corrective exercise 1-1",
    body: "Chương trình tập cá nhân hoá, tăng dần cường độ theo tuần — điều chỉnh tư thế, ổn định lõi và xây dựng sức mạnh bền vững.",
    bullets: [
      "Một chuyên viên theo sát toàn bộ lộ trình",
      "Kế hoạch tập điều chỉnh theo tiến độ hồi phục",
      "Phù hợp cả người mới bắt đầu và vận động viên",
    ],
    cta: "Đặt lịch tập",
    image: "/images/Stretching.jpg",
    imageLeft: true,
    related: [],
  },
  {
    id: "svc-recovery",
    title: "Ngâm lạnh & hồng ngoại",
    body: "Giảm sưng, giảm đau nhức cơ và tăng tốc hồi phục sau các buổi tập nặng hoặc thi đấu — thường kết hợp sau buổi trị liệu hoặc tập luyện.",
    bullets: [
      "Ngâm lạnh toàn thân hoặc cục bộ",
      "Liệu pháp hồng ngoại giảm căng cơ",
      "Kết hợp linh hoạt trong lộ trình cá nhân",
    ],
    cta: "Đặt lịch thư giãn",
    image: "/images/Exercise.jpg",
    imageLeft: false,
    related: treatmentLinks(["heat-light", "cold-plunge"]),
  },
];

export default function ServicesPage() {
  return (
    <main
      id="main"
      className={`${styles.root} ${robotoSlab.variable} ${robotoSerif.variable} ${robotoMono.variable}`}
    >
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <Image
            src="/images/Massage.jpg"
            alt="Chuyên viên đang thực hiện trị liệu tại Holistic"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div className={styles.heroScrim} />
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link href="/">Trang chủ</Link> &nbsp;/&nbsp; Dịch vụ
            </div>
            <h1>Dịch vụ</h1>
            <p className={styles.heroBody}>
              Trị liệu, tập luyện và thư giãn — kết hợp trong cùng một lộ trình, theo sát bởi một
              chuyên viên.
            </p>
          </div>
        </div>
      </section>

      <nav className={styles.categories} aria-label="Ba nhóm dịch vụ">
        <div className={styles.categoriesHead}>
          <h2>Chọn điểm bắt đầu phù hợp với bạn</h2>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <a href={`#${cat.id}`} key={cat.id} className={styles.categoryCard}>
              <span className={styles.categoryIcon}>
                <CategoryIcon type={cat.icon} />
              </span>
              <strong>{cat.title}</strong>
              <span>{cat.copy}</span>
            </a>
          ))}
        </div>
      </nav>

      {dives.map((dive) => (
        <section className={styles.dive} id={dive.id} key={dive.id}>
          <div className={styles.diveCopy} style={{ order: dive.imageLeft ? 2 : 1 }}>
            <h3>{dive.title}</h3>
            <p>{dive.body}</p>
            <ul className={styles.diveList}>
              {dive.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Link href="/booking" className={styles.primaryButton}>
              {dive.cta}
            </Link>
            {dive.related.length ? (
              <div className={styles.diveLinks}>
                {dive.related.map((t) => (
                  <Link key={t.slug} href={`/treatments/${t.slug}`}>
                    {t.title} ↗
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <div className={styles.diveMedia} style={{ order: dive.imageLeft ? 1 : 2 }}>
            <Image src={dive.image} alt={dive.title} fill sizes="(max-width: 980px) 100vw, 45vw" />
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
          </div>
          <div className={styles.processCard}>
            <span className={styles.processNumeral}>02</span>
            <strong>Trị liệu &amp; tập luyện</strong>
            <span>
              Kết hợp các dịch vụ phù hợp trong một lộ trình duy nhất, theo sát bởi một chuyên viên.
            </span>
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

      <HolisticFooter
        column2Label="DỊCH VỤ"
        column2Links={dives.map((d) => [d.title, `/services#${d.id}`] as [string, string])}
      />
    </main>
  );
}
