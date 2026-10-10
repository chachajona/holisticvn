"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import styles from "@/app/page.module.css";
import { Reveal } from "@/components/reveal";

type Item = { title: string; copy: string; image: string; href: string; tag: string };

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}
function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  const d = dir === "left" ? "M10 4 6 8l4 4" : "M6 4l4 4-4 4";
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function ServicesCarousel({ items }: { items: Item[] }) {
  const [viewportRef, embla] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [state, setState] = useState({ canPrev: false, canNext: false });

  const update = useCallback((api: NonNullable<typeof embla>) => {
    const next = { canPrev: api.canScrollPrev(), canNext: api.canScrollNext() };
    setState((prev) =>
      prev.canPrev === next.canPrev && prev.canNext === next.canNext ? prev : next,
    );
  }, []);

  useEffect(() => {
    if (!embla) return;
    const sync = () => update(embla);
    sync();
    embla.on("select", sync).on("reInit", sync).on("resize", sync);
    return () => {
      embla.off("select", sync).off("reInit", sync).off("resize", sync);
    };
  }, [embla, update]);

  const scrollable = state.canPrev || state.canNext;
  const jump = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
      <div className={styles.servicesHead}>
        <div>
          <h2>Dịch vụ nổi bật</h2>
          <p>
            Trị liệu bằng tay, thiết bị hỗ trợ và tập luyện cá nhân hoá — kết hợp trong cùng một lộ
            trình.
          </p>
        </div>
        <Link href="/services" className={`${styles.outlineButton} ${styles.servicesAllDesktop}`}>
          Xem tất cả dịch vụ <ArrowIcon />
        </Link>
      </div>
      <div className={styles.servicesSlider}>
        {scrollable && (
          <>
            <button
              type="button"
              className={`${styles.carouselArrow} ${styles.carouselArrowPrev}`}
              onClick={() => state.canPrev && embla?.scrollPrev(jump())}
              aria-disabled={!state.canPrev}
              aria-label="Dịch vụ trước"
            >
              <ChevronIcon dir="left" />
            </button>
            <button
              type="button"
              className={`${styles.carouselArrow} ${styles.carouselArrowNext}`}
              onClick={() => state.canNext && embla?.scrollNext(jump())}
              aria-disabled={!state.canNext}
              aria-label="Dịch vụ tiếp theo"
            >
              <ChevronIcon dir="right" />
            </button>
          </>
        )}
        <div
          className={styles.servicesViewport}
          data-carousel-enhanced={embla ? true : undefined}
          ref={viewportRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Dịch vụ nổi bật"
        >
          <div className={styles.servicesGrid}>
            {items.map((item, i) => (
              <div
                key={item.title}
                className={styles.serviceSlide}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${items.length}`}
              >
                <Reveal className={styles.serviceReveal} style={{ "--i": i } as CSSProperties}>
                  <Link href={item.href} className={styles.serviceCard} draggable={false}>
                    <div className={styles.serviceCardImage}>
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 700px) 78vw, 400px"
                        draggable={false}
                      />
                      <span className={styles.serviceCardTag}>{item.tag}</span>
                    </div>
                    <strong>{item.title}</strong>
                    <span>{item.copy}</span>
                    <em className={styles.serviceCardCta}>
                      Xem chi tiết <ArrowIcon />
                    </em>
                  </Link>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.servicesFade} data-visible={state.canNext} aria-hidden="true" />
      </div>
      <Link href="/services" className={`${styles.outlineButton} ${styles.servicesAllMobile}`}>
        Xem tất cả dịch vụ <ArrowIcon />
      </Link>
    </>
  );
}
