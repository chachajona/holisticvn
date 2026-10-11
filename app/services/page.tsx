import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { serviceAnchor, treatments } from "@/lib/content";
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

export const metadata = createMetadata({
  title: "Dịch vụ",
  description: "Trị liệu, tập luyện và thư giãn — kết hợp trên một lộ trình xuyên suốt.",
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
    id: serviceAnchor.therapy,
    icon: "therapy" as const,
    title: "Trị liệu",
    copy: "Massage trị liệu, nắn chỉnh và các phương pháp hỗ trợ giảm đau, thư giãn cơ.",
  },
  {
    id: serviceAnchor.training,
    icon: "training" as const,
    title: "Tập luyện",
    copy: "Tập luyện phục hồi và tăng cường, cá nhân hoá theo cơ thể bạn.",
  },
  {
    id: serviceAnchor.recovery,
    icon: "recovery" as const,
    title: "Thư giãn & hồi phục",
    copy: "Ngâm lạnh, đèn hồng ngoại và thư giãn cơ bắp sau tập luyện nặng.",
  },
];

function treatmentLinks(slugs: string[]) {
  return slugs
    .map((slug) => treatments.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
}

const dives = [
  {
    id: serviceAnchor.therapy,
    title: "Trị liệu bằng tay",
    body: "Massage trị liệu toàn thân hoặc cục bộ, nắn chỉnh cột sống và IASTM giúp giảm căng cơ, giảm đau và phục hồi biên độ vận động.",
    bullets: [
      "Massage trị liệu toàn thân hoặc cục bộ",
      "Nắn chỉnh cột sống và IASTM – cạo mạc",
      "Giác hơi, tapping và các phương pháp bổ trợ",
    ],
    cta: "Đặt lịch trị liệu",
    image: "/images/Iastm.jpg",
    imageLeft: false,
    related: treatmentLinks(["dry-needling", "cupping", "iastm"]),
  },
  {
    id: serviceAnchor.training,
    title: "Tập luyện phục hồi & tăng cường",
    body: "Hai chương trình tập cá nhân hoá: tập luyện phục hồi cho chấn thương, đau mỏi hoặc hạn chế vận động; tập luyện tăng cường để phát triển sức mạnh, kiểm soát và hiệu quả chuyển động.",
    bullets: [
      "Đồng hành xuyên suốt từ tư vấn đến tập luyện",
      "Chương trình cá nhân hoá theo tình trạng của bạn",
      "Phù hợp cả người mới bắt đầu và vận động viên",
    ],
    cta: "Đặt lịch tập",
    image: "/images/Coaching.jpg",
    imageLeft: true,
    related: [],
  },
  {
    id: serviceAnchor.recovery,
    title: "Ngâm lạnh & đèn hồng ngoại",
    body: "Ngâm lạnh giúp giảm viêm, giảm sưng và phục hồi sau vận động cường độ cao; đèn hồng ngoại giúp thư giãn cơ, giảm căng thẳng — thường kết hợp sau buổi trị liệu hoặc tập luyện.",
    bullets: [
      "Ngâm lạnh phục hồi sau vận động cường độ cao",
      "Đèn hồng ngoại thư giãn cơ, giảm căng thẳng",
      "Kết hợp linh hoạt trong lộ trình cá nhân",
    ],
    cta: "Đặt lịch thư giãn",
    image: "/images/Infrared.jpg",
    imageLeft: false,
    related: treatmentLinks(["heat-light", "cold-plunge"]),
  },
];

export default function ServicesPage() {
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
            <div className={styles.breadcrumb}>
              <Link href="/">Trang chủ</Link> &nbsp;/&nbsp; Dịch vụ
            </div>
            <h1>Dịch vụ</h1>
            <p className={styles.heroBody}>
              Trị liệu, tập luyện và thư giãn — kết hợp trên một lộ trình xuyên suốt.
            </p>
          </div>
        </div>
      </section>

      <nav className={styles.categories} aria-label="Các nhóm dịch vụ">
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
