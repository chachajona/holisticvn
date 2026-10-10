"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useHeroAutoplay } from "./use-hero-autoplay";
import { ViewportPreload } from "./viewport-preload";
import styles from "./hero-mobile-stage.module.css";

type Step = {
  num: string;
  title: string;
  href: string;
  linkLabel: string;
  image: string;
  alt: string;
  position: string;
  isDefault: boolean;
};

// Mobile-only swipeable photo carousel behind the hero copy.
// Native scroll-snap handles swipe; the chip indicator follows scroll progress through the --p CSS variable.
export function HeroMobileStage({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller || !scroller.clientWidth) return;
    const progress = scroller.scrollLeft / scroller.clientWidth;
    chipsRef.current?.style.setProperty("--p", progress.toFixed(3));
    setActive(Math.min(steps.length - 1, Math.max(0, Math.round(progress))));
  };

  const goTo = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }, []);
  const advance = useCallback(() => {
    goTo((active + 1) % steps.length);
  }, [active, goTo, steps.length]);
  const regionRef = useHeroAutoplay(advance, "(max-width: 700px)");

  return (
    <div className={styles.stage} ref={regionRef}>
      <ViewportPreload src={steps[0].image} sizes="200vw" media="(max-width: 700px)" />
      <div className={styles.photos}>
        <div className={styles.scroller} ref={scrollerRef} onScroll={onScroll}>
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={styles.slide}
              data-active={index === active || undefined}
            >
              <Image
                src={step.image}
                alt={step.alt}
                fill
                sizes="200vw"
                fetchPriority={index === 0 ? "high" : undefined}
                className={styles.photo}
                style={{ objectPosition: step.position }}
              />
            </div>
          ))}
        </div>
        <span className={styles.shade} aria-hidden="true" />
      </div>
      <div className={styles.top}>
        <div className={styles.chips} ref={chipsRef}>
          <span className={styles.indicator} aria-hidden="true" />
          {steps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              className={styles.chip}
              aria-pressed={index === active}
              onClick={() => goTo(index)}
            >
              {step.title}
            </button>
          ))}
        </div>
        <Link href={steps[active].href} className={styles.destination}>
          {steps[active].linkLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
