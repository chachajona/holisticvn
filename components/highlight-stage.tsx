"use client";

import { useEffect, useRef, type ReactNode } from "react";

const STAGGER_MS = 450;

// Draws each <mark> inside once it scrolls into view. Marks that become visible together are drawn
// one after another in DOM order instead of all at once. The CSS owns the animation and only hides
// marks when prefers-reduced-motion allows it, so reduced-motion users always see them drawn.
export function HighlightStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const marks = Array.from(root.querySelectorAll<HTMLElement>("mark"));
    if (!("IntersectionObserver" in window)) {
      marks.forEach((mark) => (mark.dataset.draw = "drawn"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) =>
            a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
          )
          .forEach((entry, order) => {
            const mark = entry.target as HTMLElement;
            mark.style.transitionDelay = `${order * STAGGER_MS}ms`;
            mark.dataset.draw = "drawn";
            observer.unobserve(mark);
          });
      },
      { threshold: 0.6, rootMargin: "0px 0px -12% 0px" },
    );
    marks.forEach((mark) => observer.observe(mark));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
