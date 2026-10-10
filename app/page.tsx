import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { createMetadata } from "@/lib/seo";
import { testimonials, reviewSummary } from "@/lib/content";
import { getPublicSiteData } from "@/lib/sanity";
import { getInstagramPosts } from "@/lib/instagram";
import { HeroMobileStage } from "@/components/hero-mobile-stage";
import { HeroPanels } from "@/components/hero-panels";
import { HeroQuickConsult } from "@/components/hero-quick-consult";
import { ConcernPattern } from "@/components/concern-pattern";
import { HighlightStage } from "@/components/highlight-stage";
import { BranchSway } from "@/components/branch-sway";
import { Reveal } from "@/components/reveal";
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
editorial rhythm: a hero triptych with quick consult, quick links, story, a services
carousel, a symptom CTA, a comparison table, a three-step path + pillars, testimonials,
two offers, a social strip and a ticker.
OWN-WORLD: card #FDFAF6 ground, ink #3A2A24, clay #90776E/#744D40 for actions,
sage #48614C for the one green band + footer, warm bands #F6EFE6/#EDE6DC, a
dark #181F1A CTA reserved for the deepest close. Roboto Slab (200-400) carries
headings, Roboto Serif (300-400) carries body/buttons/nav, Roboto Mono marks
small caption labels only.
STORY: office workers, weekend athletes and pros see the full continuous path
(tư vấn → trị liệu → tập luyện → thư giãn) end to end and book a consult.
FIRST VIEWPORT: full-bleed hero card — a three-panel triptych on desktop (Trị liệu open
by default) and a swipeable photo stage with chip indicator on mobile, each panel linking
to its destination — with a quick-consult phone form. Three discovery quick links
(services, methods, about) sit below the hero.
FORM: comp-led, brief-pinned (no seed key) — see .context/attachments.
ADAPTATIONS: hero carousels autoplay but pause on hover, focus, touch, hidden tab and
prefers-reduced-motion (owner decision 2026-10-09). Kickers directly tagging a single
heading below them were removed per craft-floor's unconditional ban, even though the
comp used them throughout.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

export const metadata = createMetadata({
  title: "Trị liệu, tập luyện & thư giãn toàn diện",
  description:
    "Một chương trình xuyên suốt từ tư vấn, trị liệu đến tập luyện nâng cao — cá nhân hoá theo cơ thể bạn. Không thuốc, không phẫu thuật.",
});

// Hero triptych: the continuous pathway tư vấn → trị liệu → tập luyện. Trị liệu opens by default.
// Intake.jpg, Iastm.jpg, Coaching.jpg: cropped from Holistic fanpage posts (facebook.com/vatlytrilieuganday.phuchoichucnangganday), supplied by the owner; headline text and watermark strips cropped off.
const heroPath = [
  {
    num: "01",
    title: "Tư vấn",
    copy: "Đánh giá tư thế và nguyên nhân gây đau.",
    href: "/booking",
    image: "/images/Intake.jpg",
    alt: "Chuyên viên trao đổi và đánh giá cùng khách hàng trên máy tính bảng tại Holistic",
    position: "45% 50%",
    isDefault: false,
  },
  {
    num: "02",
    title: "Trị liệu",
    copy: "Đa phương pháp, không thuốc, không phẫu thuật.",
    href: "/treatments",
    image: "/images/Iastm.jpg",
    alt: "Chuyên viên trị liệu mô mềm vùng cổ cho khách hàng tại Holistic",
    position: "50% 50%",
    isDefault: true,
  },
  {
    num: "03",
    title: "Tập luyện",
    copy: "Tập luyện tăng cường và phục hồi.",
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
    detail: "Khám phá các phương pháp",
    href: "/treatments",
    illustration: "methods",
  },
  { title: "Về Holistic", detail: "Tìm hiểu về Holistic", href: "/about", illustration: "about" },
];

// Image sources for these cards: see "Image Provenance" in PRODUCT.md.
const carouselServices = [
  {
    title: "Massage trị liệu",
    copy: "Giảm căng cơ, cải thiện lưu thông máu và hỗ trợ phục hồi sau vận động hoặc stress kéo dài.",
    image: "/images/TreatmentBeds.jpg",
    tag: "Trị liệu",
    href: "/services#svc-therapy",
  },
  {
    title: "IASTM – cạo mạc",
    copy: "Dụng cụ chuyên dụng giải phóng mô mềm, tăng lưu thông máu và độ đàn hồi của cơ – fascia.",
    image: "/images/Iastm.jpg",
    tag: "Trị liệu",
    href: "/treatments#mtd-manual",
  },
  {
    title: "Giác hơi",
    copy: "Áp lực âm tại chỗ giúp thư giãn mô mềm và hỗ trợ tuần hoàn.",
    image: "/images/Cupping.jpg",
    tag: "Trị liệu",
    href: "/treatments#mtd-manual",
  },
  {
    title: "Điện xung",
    copy: "Xung điện nhẹ kích thích thần kinh – cơ, giúp giảm đau và hỗ trợ kiểm soát vận động.",
    image: "/images/ElectroPulse.jpg",
    tag: "Điện trị liệu",
    href: "/treatments#mtd-electro",
  },
  {
    title: "Đèn hồng ngoại",
    copy: "Thư giãn cơ, giảm căng thẳng và hỗ trợ quá trình tự chữa lành của cơ thể.",
    image: "/images/Infrared.jpg",
    tag: "Hồi phục",
    href: "/treatments#mtd-infrared",
  },
  {
    title: "Ngâm lạnh",
    copy: "Giảm viêm, giảm sưng và hỗ trợ phục hồi sau vận động cường độ cao.",
    image: "/images/ColdPlungeTub.jpg",
    tag: "Hồi phục",
    href: "/treatments#mtd-cold",
  },
  {
    title: "Tập luyện phục hồi",
    copy: "Chương trình cá nhân hoá cho chấn thương, đau mỏi hoặc hạn chế vận động — giảm nguy cơ tái phát.",
    image: "/images/Coaching.jpg",
    tag: "Tập luyện",
    href: "/services#svc-training",
  },
  {
    title: "Tập luyện tăng cường",
    copy: "Phát triển sức mạnh, kiểm soát và hiệu quả chuyển động để nâng cao thể lực và tư thế bền vững.",
    image: "/images/Studio.jpg",
    tag: "Tập luyện",
    href: "/services#svc-training",
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
  "/images/Facade.jpg",
  "/images/TreatmentBeds.jpg",
  "/images/Lobby.jpg",
  "/images/Studio.jpg",
];
const tickerWords = [
  "TƯ VẤN",
  "TRỊ LIỆU",
  "TẬP LUYỆN",
  "TOÀN DIỆN",
  "XUYÊN SUỐT",
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
        <mask id="introSageDraw">
          <path
            className={styles.sketchMaskDraw}
            pathLength={1}
            d="M-9 50Q-9 -9 50 -10L448 -9Q508 -8 509 50L510 560Q509 618 450 619L50 620Q-8 619 -9 560Z"
          />
        </mask>
      </defs>
      <g filter="url(#introPen)">
        <path
          className={`${styles.sketchClay} ${styles.sketchDraw}`}
          pathLength={1}
          d="M-16 44Q-16 -16 44 -16L456 -16Q516 -16 516 44L516 566Q516 626 456 626L44 626Q-16 626 -16 566Z"
        />
        <path
          className={styles.sketchSage}
          mask="url(#introSageDraw)"
          d="M-9 50Q-9 -9 50 -10L448 -9Q508 -8 509 50L510 560Q509 618 450 619L50 620Q-8 619 -9 560Z"
          strokeDasharray="340 14 180 10 260 12"
        />
        <g className={styles.sketchOrnament}>
          <g transform="translate(0 14)">
            {sketchRays.map((d, i) => (
              <path
                key={d}
                className={`${i % 2 ? styles.sketchSage : styles.sketchClay} ${styles.sketchDraw} ${styles.sketchRay}`}
                pathLength={1}
                style={{ "--i": i } as CSSProperties}
                d={d}
              />
            ))}
          </g>
          <g transform="translate(-26 0)">
            <BranchSway className={styles.sketchBranch}>
              <path
                className={`${styles.sketchSage} ${styles.sketchDraw} ${styles.sketchStem}`}
                pathLength={1}
                d="M-10 640Q-52 570 -34 460"
              />
              {sketchLeaves.map(([leaf, vein], i) => (
                <g key={leaf} style={{ "--i": i } as CSSProperties}>
                  <path
                    className={`${styles.sketchSage} ${styles.sketchDraw} ${styles.sketchLeaf}`}
                    pathLength={1}
                    d={leaf}
                  />
                  <path
                    className={`${styles.sketchClay} ${styles.sketchDraw} ${styles.sketchLeaf}`}
                    pathLength={1}
                    d={vein}
                  />
                </g>
              ))}
            </BranchSway>
          </g>
        </g>
      </g>
    </svg>
  );
}

function QuoteText({ quote, highlight }: { quote: string; highlight?: string }) {
  const at = highlight ? quote.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{quote}</>;
  return (
    <>
      {quote.slice(0, at)}
      <mark>{highlight}</mark>
      {quote.slice(at + highlight.length)}
    </>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className={styles.testimonialStars} role="img" aria-label={`${count} trên 5 sao`}>
      {"★".repeat(count)}
    </span>
  );
}

export default async function HomePage() {
  const [{ site }, instagramPosts] = await Promise.all([getPublicSiteData(), getInstagramPosts()]);
  return (
    <main id="main" className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <HeroMobileStage steps={heroPath} />
          <div className={styles.heroContent}>
            <h1>
              Cải thiện sức khoẻ vận động một cách <em>toàn diện</em> &amp; <em>bền vững</em>.
            </h1>
            <HeroQuickConsult hours={site.hours.replace(" — ", "–")} phone={site.phone} />
          </div>
          <HeroPanels steps={heroPath} />
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
            <p>Với Holistic, hết đau lâu dài cần cả trị liệu lẫn tập luyện.</p>
            <ul className={styles.introList}>
              <li>
                <IntroTick />
                Tìm đúng nguyên nhân gây đau
              </li>
              <li>
                <IntroTick />
                Đồng hành xuyên suốt từ tư vấn đến tập luyện
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
          <Reveal className={styles.introMedia}>
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
          </Reveal>
        </div>
      </section>

      <section className={styles.services}>
        <ServicesCarousel items={carouselServices} />
      </section>

      <section className={styles.concern} aria-labelledby="concern-heading">
        <ConcernPattern className={styles.concernPattern} />
        <h2 id="concern-heading">Bạn đang gặp một vấn đề cụ thể?</h2>
        <svg
          className={styles.concernArrow}
          viewBox="0 0 120 80"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M5 58C16 35 54 27 72 42C83 52 60 58 58 39C55 18 88 24 108 41M93 23L109 41L86 44"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Link href="/treatments" className={styles.concernButton}>
          Xem các phương pháp
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 12h16M14 6l6 6-6 6" />
          </svg>
        </Link>
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

      <section className={styles.compare} aria-labelledby="comparison-heading">
        <h2 id="comparison-heading">Holistic khác với những giải pháp khác ra sao?</h2>
        <div className={styles.compareViewport}>
          <div className={styles.compareFrame}>
            <div
              className={styles.compareScroll}
              role="region"
              aria-labelledby="comparison-heading"
              aria-describedby="comparison-scroll-hint"
              tabIndex={0}
            >
              <table className={styles.compareTable}>
                <caption className={styles.compareCaption}>
                  So sánh dịch vụ của Holistic và các giải pháp khác
                </caption>
                <colgroup>
                  <col className={styles.compareLabelColumn} />
                  <col className={styles.compareHolisticColumn} />
                  <col className={styles.compareClinicColumn} />
                  <col className={styles.compareSpaColumn} />
                  <col className={styles.compareGymColumn} />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">Tiêu chí</th>
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
                          <span
                            className={yes ? styles.compareYes : styles.compareNo}
                            aria-hidden="true"
                          >
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
          </div>
          <p id="comparison-scroll-hint" className={styles.compareHint}>
            Vuốt ngang để xem các giải pháp khác.
          </p>
        </div>
        <span className={styles.compareLegend}>● CÓ &nbsp;·&nbsp; — KHÔNG</span>
      </section>

      <section className={styles.path}>
        <div className={styles.pathPanel}>
          <div className={styles.pathTop}>
            <div className={styles.pathCopy}>
              <h2>Ba bước, một chương trình duy nhất.</h2>
              <p>
                Từ buổi đánh giá đầu tiên đến giai đoạn tập luyện nâng cao, bạn đi trên một lộ trình
                xuyên suốt — không phải kể lại tình trạng của mình ở nhiều nơi khác nhau.
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

      <section className={styles.testimonials}>
        <div className={styles.testimonialsHead}>
          <h2>Khách hàng nói gì</h2>
          <a href={reviewSummary.url} target="_blank" rel="noopener noreferrer">
            <span className={styles.ratingTop}>
              <strong>{reviewSummary.average.toFixed(1)}</strong>
              <Stars count={reviewSummary.average} />
            </span>
            <span className={styles.ratingSub}>{reviewSummary.count} đánh giá Google</span>
          </a>
        </div>
        <HighlightStage className={styles.quotes}>
          {testimonials.map((item, i) => (
            <figure
              key={item.context}
              className={i === 0 ? `${styles.testimonial} ${styles.testimonialLead}` : styles.testimonial}
            >
              {i === 0 ? (
                <div className={styles.leadMedia}>
                  <Image src="/images/Studio.jpg" alt="" fill sizes="(max-width: 980px) 100vw, 300px" />
                </div>
              ) : null}
              <span className={styles.quoteMark} aria-hidden="true">
                &ldquo;
              </span>
              <blockquote>
                <QuoteText quote={item.quote} highlight={item.highlight} />
              </blockquote>
              <figcaption>
                <span className={styles.captionAvatar} aria-hidden="true">
                  {item.context.charAt(0)}
                </span>
                {item.context.split(", ").map((part, n) => (
                  <span key={part} className={n === 0 ? styles.captionRole : styles.captionDetail}>
                    {part}
                  </span>
                ))}
                {item.rating ? <Stars count={item.rating} /> : null}
              </figcaption>
            </figure>
          ))}
        </HighlightStage>
      </section>

      <section className={styles.offers} aria-label="Bắt đầu cùng Holistic">
        <div className={`${styles.offer} ${styles.offerDark}`}>
          <h2>Bắt đầu từ tư vấn</h2>
          <Link href="/booking" className={styles.lightButton}>
            Đặt lịch tư vấn
          </Link>
        </div>
        <div className={`${styles.offer} ${styles.offerLight}`}>
          <h2>Trị liệu &amp; tập luyện</h2>
          <Link href="/services" className={styles.outlineButton}>
            Xem dịch vụ
          </Link>
        </div>
      </section>

      <section className={styles.social}>
        <h2>
          <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
            Theo dõi hành trình hồi phục trên Instagram
          </a>
        </h2>
        <div className={styles.igGrid}>
          {instagramPosts === null
            ? igImages.map((src, i) => (
                <div className={styles.igItem} key={src + i}>
                  <Image src={src} alt="" fill sizes="25vw" />
                </div>
              ))
            : instagramPosts.map((post) => (
                <a
                  className={styles.igItem}
                  key={post.id}
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Xem bài Instagram ngày ${new Date(post.timestamp).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} (mở tab mới)`}
                >
                  <Image src={post.image} alt="" fill sizes="(max-width: 700px) 45vw, 250px" />
                </a>
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
    </main>
  );
}
