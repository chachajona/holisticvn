"use client";

import { useEffect, useRef } from "react";

export function ConcernPattern({ className }: { className: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let played = false;

    const watch = () => {
      observer?.disconnect();
      clearTimeout(timer);
      node.dataset.paint = "complete";
      if (motion.matches || played || !("IntersectionObserver" in window)) return;

      node.dataset.paint = "pending";
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
            return;
          }
          played = true;
          observer?.disconnect();
          node.dataset.paint = "painting";
          timer = setTimeout(() => {
            node.dataset.paint = "complete";
          }, 2500);
        },
        { threshold: 0.5, rootMargin: "0px 0px -10% 0px" },
      );
      observer.observe(node);
    };

    watch();
    motion.addEventListener("change", watch);
    return () => {
      observer?.disconnect();
      clearTimeout(timer);
      motion.removeEventListener("change", watch);
    };
  }, []);

  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 1440 390"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <path
        pathLength="1"
        d="M-170-160C170-250 282-180 510 34S845 416 1115 533"
        stroke="#f7f3f0"
        strokeOpacity=".11"
        strokeWidth="230"
      />
      <path
        pathLength="1"
        d="M874-410C1198-64 765 121 732 344S963 675 1190 703"
        stroke="#233d2c"
        strokeOpacity=".38"
        strokeWidth="180"
      />
      <path
        pathLength="1"
        d="M1200-249C1007 13 1367 141 1514 415"
        stroke="#f7f3f0"
        strokeOpacity=".09"
        strokeWidth="210"
      />
    </svg>
  );
}
