"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useHeroAutoplay } from "./use-hero-autoplay";
import { ViewportPreload } from "./viewport-preload";
import styles from "@/app/page.module.css";

type Step = {
  num: string;
  title: string;
  copy: string;
  href: string;
  image: string;
  alt: string;
  position: string;
  isDefault: boolean;
};

const PANEL_SIZES = "(max-width: 700px) 100vw, 40vw";

export function HeroPanels({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      steps.findIndex((step) => step.isDefault),
    ),
  );
  const advance = useCallback(() => {
    setActive((index) => (index + 1) % steps.length);
  }, [steps.length]);
  const regionRef = useHeroAutoplay(advance, "(min-width: 701px)");

  const defaultStep = steps.find((step) => step.isDefault);

  return (
    <div className={styles.heroPanels} ref={regionRef}>
      {defaultStep ? (
        <ViewportPreload src={defaultStep.image} sizes={PANEL_SIZES} media="(min-width: 701px)" />
      ) : null}
      {steps.map((step, index) => (
        <Link
          href={step.href}
          key={step.title}
          className={styles.heroPanel}
          data-active={index === active || undefined}
          onPointerEnter={(event) => {
            if (event.pointerType !== "touch") setActive(index);
          }}
          onFocus={() => setActive(index)}
        >
          <Image
            src={step.image}
            alt={step.alt}
            fill
            sizes={PANEL_SIZES}
            loading={step.isDefault ? "eager" : undefined}
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
  );
}
