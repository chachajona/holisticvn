"use client";

import { useEffect, useRef } from "react";

const DOT = 59; // distance from a stage's top to the centre of its title (and its dot)

// A hairline that lengthens down the gutter as the visitor scrolls, with a dot that
// pops at each stage title once the line reaches it; the same thread-and-dot motif as the hero ribbon.
export function ScrollThread({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const host = node?.parentElement;
    if (!node || !host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const reach = reduced.matches
        ? host.offsetHeight
        : Math.min(
            host.offsetHeight,
            Math.max(0, window.innerHeight * 0.7 - host.getBoundingClientRect().top),
          );
      node.style.setProperty("--reach", `${reach}px`);
      host
        .querySelectorAll<HTMLElement>(":scope > section")
        .forEach((stage) => stage.toggleAttribute("data-reached", reach >= stage.offsetTop + DOT));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(host);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      resize.disconnect();
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
