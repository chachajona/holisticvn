"use client";

import { useEffect, useRef, type ReactNode } from "react";

const SWAY = [
  { transform: "rotate(0)" },
  { transform: "rotate(-3deg)", offset: 0.3 },
  { transform: "rotate(2deg)", offset: 0.65 },
  { transform: "rotate(0)" },
];

// Sways once when the parent frame is hovered and finishes even if the pointer leaves.
export function BranchSway({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const group = ref.current;
    const host = group?.ownerSVGElement?.parentElement;
    if (!group || !host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sway = () => {
      if (reduced.matches || group.getAnimations().length) return;
      group.animate(SWAY, { duration: 2400, easing: "ease-in-out" });
    };
    host.addEventListener("pointerenter", sway);
    return () => host.removeEventListener("pointerenter", sway);
  }, []);

  return (
    <g ref={ref} className={className}>
      {children}
    </g>
  );
}
