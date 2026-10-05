import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Roboto_Mono, Roboto_Serif, Roboto_Slab } from "next/font/google";
import { createMetadata } from "@/lib/seo";
import { site, testimonials, reviewSummary } from "@/lib/content";
import { HolisticFooter } from "@/components/holistic-footer";
import { HeroMobileStage } from "@/components/hero-mobile-stage";
import { HeroQuickConsult } from "@/components/hero-quick-consult";
import {
  QuickLinkIllustration,
  type QuickLinkIllustrationType,
} from "@/components/quick-link-illustrations";
import { ServicesCarousel } from "@/components/services-carousel";
import styles from "./page.module.css";

/*
DIRECTION CONTRACT (impeccable, brief-pinned — comp supplied as full desktop 1440 /
mobile 390 mock, no concept roll).
THESIS: Homepage v2 — the same Warm Clay Editorial world, restructured into a fuller
editorial rhythm: quick links, story, a services carousel, a symptom CTA, a
comparison table, a three-step path + pillars, founders, testimonials, two offers,
a social strip and a ticker.
OWN-WORLD: card #FDFAF6 ground, ink #3A2A24, clay #90776E/#744D40 for actions,
sage #48614C for the one green band + footer, warm bands #F6EFE6/#EDE6DC, a
dark #181F1A CTA reserved for the deepest close. Roboto Slab (200-400) carries
headings, Roboto Serif (300-400) carries body/buttons/nav, Roboto Mono marks
small caption labels only.
STORY: office workers, weekend athletes and pros see the full continuous path
(tư vấn → trị liệu → tập luyện → thư giãn) end to end and book a consult.
FIRST VIEWPORT: full-bleed 600px hero card, warm photo with a left-reading
scrim, headline + dual CTA at left:64px; a three-item discovery navigation strip
sits below the hero.
FORM: comp-led, brief-pinned (no seed key) — see .context/attachments.
ADAPTATIONS (fix round, cited per finish review): hero ships as a single real
photo with no slide arrows — the comp's ‹ › hero controls implied a second
slide with no second image to show, and a control with nothing to slide to
is a worse defect than its absence. Quick links now lead to the three existing
overview pages: services, methods and the Holistic story. Kickers directly
tagging a single heading below them (hero eyebrow, intro/path/team eyebrows,
per-section numerals on parallel Services categories) were removed per
craft-floor's unconditional ban, even though the comp used them throughout.
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
  title: "Trị liệu, tập luyện & thư giãn toàn diện",
  description:
    "Một chương trình xuyên suốt từ tư vấn, trị liệu đến tập luyện nâng cao — cá nhân hoá theo cơ thể bạn. Không thuốc, không phẫu thuật.",
});

// Hero triptych: the continuous pathway tư vấn → trị liệu → tập luyện. Trị liệu opens by default.
// Consultation.jpg, Therapy.jpg, Coaching.jpg: cropped from Holistic fanpage posts (facebook.com/vatlytrilieuganday.phuchoichucnangganday), supplied by the owner; headline text and watermark strips cropped off.
const heroPath = [
  {
    num: "01",
    title: "Tư vấn",
    copy: "Đánh giá tư thế và nguyên nhân gây đau.",
    href: "/booking",
    image: "/images/Consultation.jpg",
    alt: "Chuyên viên trao đổi và đánh giá cùng khách hàng trên máy tính bảng tại Holistic",
    position: "45% 50%",
    isDefault: false,
  },
  {
    num: "02",
    title: "Trị liệu",
    copy: "Đa phương pháp, không thuốc, không phẫu thuật.",
    href: "/treatments",
    image: "/images/Therapy.jpg",
    alt: "Chuyên viên trị liệu mô mềm vùng cổ cho khách hàng tại Holistic",
    position: "50% 50%",
    isDefault: true,
  },
  {
    num: "03",
    title: "Tập luyện",
    copy: "Corrective exercise và return-to-sport.",
    href: "/services#svc-training",
    image: "/images/Coaching.jpg",
    alt: "Chuyên viên Holistic hướng dẫn khách tập hạ tạ đơn đúng tư thế",
    position: "55% 50%",
    isDefault: false,
  },
];

const quickLinks: {
  title: string;
  detail: string;
  href: string;
  illustration: QuickLinkIllustrationType;
}[] = [
  {
    title: "Dịch vụ",
    detail: "Trị liệu, tập luyện & thư giãn",
    href: "/services",
    illustration: "services",
  },
  {
    title: "Phương pháp",
    detail: "Khám phá 6 phương pháp",
    href: "/treatments",
    illustration: "methods",
  },
  { title: "Về Holistic", detail: "Tìm hiểu về Holistic", href: "/about", illustration: "about" },
];

const carouselServices = [
  {
    title: "Trị liệu bằng tay",
    copy: "Giảm đau vai gáy, cột sống, khớp bằng kỹ thuật manual therapy chuyên sâu.",
    image: "/images/acupuncture.jpg",
    href: "/services#svc-therapy",
  },
  {
    title: "Corrective exercise 1-1",
    copy: "Bài tập điều chỉnh tư thế, ổn định lõi và tăng dần sức mạnh theo tuần.",
    image: "/images/Stretching.jpg",
    href: "/services#svc-training",
  },
  {
    title: "Ngâm lạnh & hồng ngoại",
    copy: "Giảm sưng, giảm đau nhức cơ và tăng cường hồi phục sau tập luyện nặng.",
    image: "/images/Exercise.jpg",
    href: "/services#svc-recovery",
  },
  {
    title: "Return-to-sport",
    copy: "Lộ trình trở lại thể thao cho VĐV sau chấn thương, hạn chế tái phát.",
    image: "/images/Massage.jpg",
    href: "/treatments#mtd-rehab",
  },
];

const compareRows: Array<{ label: string; values: [boolean, boolean, boolean, boolean] }> = [
  { label: "Tư vấn chuyên sâu", values: [true, true, false, false] },
  { label: "Trị liệu đa phương pháp", values: [true, false, false, false] },
  { label: "Phẫu thuật", values: [false, true, false, false] },
  { label: "Dùng thuốc", values: [false, true, false, false] },
  { label: "Thư giãn", values: [true, false, true, false] },
  { label: "Tập luyện tăng cường", values: [true, false, false, true] },
];
const compareColumns = [
  "Holistic",
  "Bệnh viện / phòng khám",
  "Spa",
  "Phòng tập với PT thông thường",
];

const pillars = [
  {
    title: "Toàn diện",
    copy: "Kết hợp kiến thức & thực nghiệm, xây dựng chương trình vận động cùng chế độ nghỉ ngơi hợp lý.",
    icon: "whole",
  },
  {
    title: "Xuyên suốt",
    copy: "Một lộ trình duy nhất từ tư vấn đến tập luyện lâu dài — không cần chạy nhiều nơi khác nhau.",
    icon: "thread",
  },
  {
    title: "Bền vững",
    copy: "Không dùng thuốc, không phẫu thuật. Sức khoẻ tăng tiến bền vững, tránh tái chấn thương.",
    icon: "root",
  },
];

const igImages = [
  "/images/acupuncture.jpg",
  "/images/Massage.jpg",
  "/images/Stretching.jpg",
  "/images/Exercise.jpg",
];
const tickerWords = [
  "TRỊ LIỆU",
  "TẬP LUYỆN",
  "THƯ GIÃN",
  "KHÔNG THUỐC",
  "KHÔNG PHẪU THUẬT",
  "BỀN VỮNG",
];

function PillarIcon({ type }: { type: string }) {
  const paths: Record<string, ReactNode> = {
    whole: (
      <>
        <circle cx="9" cy="12" r="6.5" />
        <circle cx="15" cy="12" r="6.5" />
      </>
    ),
    thread: <path d="M3 12c3-5 6 5 9 0s6-5 9 0" />,
    root: (
      <>
        <path d="M12 3v8" />
        <path d="M12 11c-3 0-5 2-5 5v4" />
        <path d="M12 11c3 0 5 2 5 5v4" />
        <path d="M12 11c0 2-1.5 3.5-3.5 4" />
      </>
    ),
  };
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
}

// Hand-drawn pen sketch around the intro photo frame: broken double outline, glow rays, leaf sprig.
// Drawn in the quick-link illustration palette (clay + sage contour lines) with a turbulence wobble so strokes read as pen, not vector.
const sketchRays = [
  "M135.3 -40.9Q124.1 -56.6 113.1 -72.3",
  "M158.8 -58.1Q155.2 -66.5 150.9 -76.7",
  "M186.2 -67.8Q181.8 -84.9 175.5 -103.2",
  "M221.7 -77Q221.5 -89.1 220.2 -102",
  "M250.2 -79.9Q250.2 -98.4 252.8 -115",
  "M281.1 -77.7Q283.8 -86 286.8 -96.2",
  "M312.3 -71.1Q320.7 -89 328.1 -106.7",
  "M343 -54.9Q351.5 -64.3 358 -75",
  "M365.3 -39.4Q376.6 -51.8 390.4 -65.8",
];
const sketchLeaves = [
  ["M-27.2 602.5Q-34.9 583.7 -55.1 583Q-47.5 601.8 -27.2 602.5Z", "M-27.2 602.5L-50.9 585.9"],
  ["M-34 577.6Q-15.1 577.1 -8.2 559.5Q-27.1 560 -34 577.6Z", "M-34 577.6L-12.1 562.2"],
  ["M-38 550.9Q-44.3 534.6 -61.8 534.3Q-55.5 550.6 -38 550.9Z", "M-38 550.9L-58.2 536.8"],
  ["M-39.4 522.4Q-23.3 522.3 -17.7 507.2Q-33.8 507.3 -39.4 522.4Z", "M-39.4 522.4L-20.9 509.5"],
  ["M-38 492.1Q-42.9 478.2 -57.7 478.3Q-52.8 492.3 -38 492.1Z", "M-38 492.1L-54.8 480.4"],
  ["M-34 460Q-20.6 460.4 -16.4 447.7Q-29.8 447.3 -34 460Z", "M-34 460L-19 449.5"],
];

// Pen-drawn check mark for the intro list; the stroke draws in as it scrolls into view (CSS scroll-driven, static fallback).
function IntroTick() {
  return (
    <svg className={styles.introTick} viewBox="0 0 22 18" aria-hidden="true" focusable="false">
      <path pathLength="1" d="M2 9.6C3.8 10.8 5.4 12.6 7 15.2C9.6 9.6 13.6 5.2 19.8 2.4" />
    </svg>
  );
}

function IntroSketch() {
  return (
    <svg
      className={styles.introSketch}
      viewBox="0 0 500 610"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id="introPen"
          filterUnits="userSpaceOnUse"
          x="-140"
          y="-120"
          width="780"
          height="860"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014"
            numOctaves="1"
            seed="4"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <g filter="url(#introPen)">
        <path
          className={styles.sketchClay}
          d="M-16 44Q-16 -16 44 -16L456 -16Q516 -16 516 44L516 566Q516 626 456 626L44 626Q-16 626 -16 566Z"
        />
        <path
          className={styles.sketchSage}
          d="M-9 50Q-9 -9 50 -10L448 -9Q508 -8 509 50L510 560Q509 618 450 619L50 620Q-8 619 -9 560Z"
          strokeDasharray="340 14 180 10 260 12"
        />
        <g className={styles.sketchOrnament}>
          <g transform="translate(0 14)">
            {sketchRays.map((d, i) => (
              <path key={d} className={i % 2 ? styles.sketchSage : styles.sketchClay} d={d} />
            ))}
          </g>
          <g transform="translate(-26 0)">
            <path className={styles.sketchSage} d="M-10 640Q-52 570 -34 460" />
            {sketchLeaves.map(([leaf, vein]) => (
              <g key={leaf}>
                <path className={styles.sketchSage} d={leaf} />
                <path className={styles.sketchClay} d={vein} />
              </g>
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className={styles.testimonialStars} aria-label={`${count} trên 5 sao`}>
      {"★".repeat(count)}
    </span>
  );
}

export default function HomePage() {
  return (
    <main
      id="main"
      className={`${styles.root} ${robotoSlab.variable} ${robotoSerif.variable} ${robotoMono.variable}`}
    >
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <HeroMobileStage steps={heroPath} />
          <div className={styles.heroContent}>
            <h1>
              Cải thiện sức khoẻ vận động một cách <em>toàn diện</em> &amp; <em>bền vững</em>.
            </h1>
            <HeroQuickConsult hours={site.hours.replace(" — ", "–")} phone={site.phone} />
          </div>
          <div className={styles.heroPanels}>
            {heroPath.map((step) => (
              <Link
                href={step.href}
                key={step.title}
                className={styles.heroPanel}
                data-default={step.isDefault || undefined}
              >
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  priority={step.isDefault}
                  sizes="(max-width: 700px) 100vw, 40vw"
                  style={{ objectPosition: step.position }}
                />
                <span className={styles.heroPanelTint} aria-hidden="true" />
                <span className={styles.heroPanelNum}>{step.num}</span>
                <span className={styles.heroPanelText}>
                  <span className={styles.heroPanelTitle}>{step.title}</span>
                  <span className={styles.heroPanelCopy}>{step.copy}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <nav className={styles.quickLinks} aria-label="Khám phá Holistic">
        {quickLinks.map((item) => (
          <Link href={item.href} key={item.title} className={styles.quickLink}>
            <span className={styles.quickIllustration} aria-hidden="true">
              <QuickLinkIllustration type={item.illustration} />
            </span>
            <span className={styles.quickCopy}>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </span>
            <svg
              className={styles.quickArrow}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14m-5-5 5 5-5 5" />
            </svg>
          </Link>
        ))}
      </nav>

      <section className={styles.intro}>
        <div className={styles.introGrid}>
          <div className={styles.introCopy}>
            <h2>
              Không chỉ hết&nbsp;đau, mà còn <em>vận động tự do trở lại</em>.
            </h2>
            <p>
              Holistic bắt đầu từ một phòng trị liệu nhỏ, do những người từng chấn thương lập nên.
              Với Holistic, hết đau lâu dài cần cả trị liệu lẫn tập luyện.
            </p>
            <ul className={styles.introList}>
              <li>
                <IntroTick />
                Tìm đúng nguyên nhân gây đau
              </li>
              <li>
                <IntroTick />
                Một chuyên viên theo sát từ đầu đến cuối
              </li>
              <li>
                <IntroTick />
                Không thuốc, không phẫu thuật
              </li>
            </ul>
            <Link href="/about" className={styles.primaryButton}>
              Tìm hiểu về Holistic
              <svg
                className={styles.buttonArrow}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
            </Link>
          </div>
          <div className={styles.introMedia}>
            <IntroSketch />
            <div className={styles.introPhoto}>
              <Image
                src="/images/Signage.jpg"
                alt="Bảng hiệu Holistic rehab & performance phát sáng trong phòng trị liệu"
                fill
                sizes="(max-width: 980px) 100vw, 40vw"
                style={{ objectPosition: "50% 25%" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.services}>
        <ServicesCarousel items={carouselServices} />
      </section>

      <section className={styles.concern}>
        <h2>Bạn đang gặp một vấn đề cụ thể?</h2>
        <div className={styles.concernRight}>
          <span className={styles.concernTag}>ĐAU VAI GÁY · LỆCH CHẬU · THOÁT VỊ</span>
          <Link href="/treatments" className={styles.lightButton}>
            Tìm theo triệu chứng
          </Link>
        </div>
      </section>

      <section className={styles.steps}>
        <div className={styles.stepsHead}>
          <span>Xuyên suốt</span>
          <i />
        </div>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <span className={styles.stepNumeral}>01</span>
            <strong>Hiểu rõ cơ thể</strong>
            <span>Xác định phương pháp trị liệu và tập luyện phù hợp với tình trạng của bạn.</span>
          </div>
          <div className={styles.stepCard}>
            <span className={styles.stepNumeral}>02</span>
            <strong>Giảm đau mỏi</strong>
            <span>Giảm căng thẳng và tăng cường hoạt động miễn dịch tức thời.</span>
          </div>
          <div className={styles.stepCard}>
            <span className={styles.stepNumeral}>03</span>
            <strong>Tăng cường lâu dài</strong>
            <span>
              Sức khoẻ, độ linh hoạt và độ dẻo dai của cơ &amp; khớp, duy trì qua nhiều năm.
            </span>
          </div>
        </div>
      </section>

      <section className={styles.compare}>
        <h2>Holistic khác với những giải pháp khác ra sao?</h2>
        <div className={styles.compareScroll}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th></th>
                {compareColumns.map((col, i) => (
                  <th
                    key={col}
                    className={i === 0 ? styles.compareHolistic : undefined}
                    scope="col"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((yes, i) => (
                    <td key={i} className={i === 0 && yes ? styles.compareYesCell : undefined}>
                      <span className={yes ? styles.compareYes : styles.compareNo}>
                        {yes ? "●" : "—"}
                      </span>
                      <span
                        className="sr-only"
                        style={{
                          position: "absolute",
                          width: 1,
                          height: 1,
                          overflow: "hidden",
                          clip: "rect(0 0 0 0)",
                        }}
                      >
                        {yes ? "Có" : "Không"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className={styles.compareMobileList}>
          {compareRows
            .filter((row) => row.values[0])
            .map((row) => (
              <li key={row.label}>
                <span className={styles.compareYes}>●</span>
                {row.label}
              </li>
            ))}
        </ul>
        <span className={styles.compareLegend}>● CÓ &nbsp;·&nbsp; — KHÔNG</span>
      </section>

      <section className={styles.path}>
        <div className={styles.pathPanel}>
          <div className={styles.pathTop}>
            <div className={styles.pathCopy}>
              <h2>Ba bước, một chương trình duy nhất.</h2>
              <p>
                Từ buổi đánh giá đầu tiên đến giai đoạn tập luyện nâng cao, bạn đi cùng một chuyên
                viên và một hồ sơ theo dõi duy nhất — không phải kể lại tình trạng của mình ở nhiều
                nơi khác nhau.
              </p>
              <p>
                Mục tiêu không chỉ là hết đau, mà là giữ được sức khoẻ vận động trong nhiều năm sau
                đó.
              </p>
            </div>
            <div className={styles.pathMedia}>
              <Image
                src="/images/Massage.jpg"
                alt="Chuyên viên đang trị liệu cho khách tại Holistic"
                fill
                sizes="(max-width: 980px) 100vw, 45vw"
              />
            </div>
          </div>
          <div className={styles.pillars}>
            <strong>Giá trị cốt lõi</strong>
            {pillars.map((p) => (
              <div className={styles.pillar} key={p.title}>
                <span className={styles.pillarIcon}>
                  <PillarIcon type={p.icon} />
                </span>
                <strong>{p.title}</strong>
                <span>{p.copy}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.team}>
        <div
          className={styles.teamMedia}
          style={{ display: "grid", placeItems: "center", background: "var(--warm-band-2)" }}
        >
          <span
            style={{
              font: "400 12px var(--font-mono)",
              color: "var(--clay)",
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            Ảnh đội ngũ &amp; founders — cần bổ sung
          </span>
        </div>
        <div className={styles.teamCopy}>
          <h2>Những người đã đi qua cơn đau.</h2>
          <p>
            Tất cả founder của Holistic đều từng trải qua chấn thương hoặc có kinh nghiệm trị liệu.
            Đội ngũ được đào tạo chuyên môn và tham gia giảng dạy trong ngành.
          </p>
          <Link href="/about" className={styles.outlineButton}>
            Gặp đội ngũ
          </Link>
        </div>
      </section>

      <section className={styles.testimonials}>
        <div className={styles.testimonialsHead}>
          <h2>Khách hàng nói gì</h2>
          <span>03 / {reviewSummary.count} ĐÁNH GIÁ</span>
        </div>
        <div className={styles.testimonialGrid}>
          {testimonials.map((item) => (
            <figure key={item.context} className={styles.testimonial}>
              <Stars count={item.rating ?? reviewSummary.average} />
              <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption>{item.context}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.offers}>
        <div className={`${styles.offer} ${styles.offerDark}`}>
          <strong>Buổi tư vấn &amp; đánh giá</strong>
          <span>60 phút đánh giá cơ thể và đề xuất lộ trình cá nhân hoá.</span>
          <Link href="/booking" className={styles.lightButton}>
            Đặt buổi đầu tiên
          </Link>
        </div>
        <div className={`${styles.offer} ${styles.offerLight}`}>
          <strong>Lộ trình 12 buổi</strong>
          <span>Trị liệu kết hợp tập luyện, theo sát bởi cùng một chuyên viên.</span>
          <Link href="/services" className={styles.primaryButton}>
            Xem bảng giá
          </Link>
        </div>
      </section>

      <section className={styles.social}>
        <h2>Theo dõi hành trình hồi phục @holistic.rehab</h2>
        <div className={styles.igGrid}>
          {igImages.map((src, i) => (
            <div className={styles.igItem} key={src + i}>
              <Image src={src} alt="" fill sizes="25vw" />
            </div>
          ))}
        </div>
      </section>

      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          <span>
            {tickerWords.map((w) => (
              <span key={w}>
                {w}
                <i>·</i>
              </span>
            ))}
          </span>
          <span>
            {tickerWords.map((w) => (
              <span key={`b-${w}`}>
                {w}
                <i>·</i>
              </span>
            ))}
          </span>
        </div>
      </div>

      <HolisticFooter
        column2Label="DỊCH VỤ"
        column2Links={[
          ["Trị liệu bằng tay", "/services#svc-therapy"],
          ["Corrective exercise", "/services#svc-training"],
          ["Ngâm lạnh & hồng ngoại", "/services#svc-recovery"],
          ["Xem tất cả phương pháp", "/treatments"],
        ]}
      />
    </main>
  );
}
