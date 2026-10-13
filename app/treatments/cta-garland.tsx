"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./treatments.module.css";

// A pen-drawn garland along the top edge of the closing CTA. It draws once the first time the card
// scrolls into view, then keeps growing: each time a button is hovered or focused a new leaf or
// blossom sprouts on a free spot along the stem. When every spot is taken, the oldest one drops off
// and a new one grows in its place. Nothing runs on its own; without JavaScript, with reduced motion
// or on touch screens it is simply the finished garland (reduced motion swaps without animating).
type Pt = [number, number];
type Curve = [Pt, Pt, Pt, Pt];
type Kind = "leaf" | "bloom";
type Item = { id: number; slot: number; kind: Kind; falling?: boolean; grown?: boolean };

const STEM: Curve = [
  [1250, 4],
  [1080, 36],
  [850, -6],
  [540, 26],
];
const LEAF = "M0 0Q14-16 36-13Q24 6 0 0Z";
const VEIN = "M0 0L27-9";
const PETAL = "M0 0Q5.5-6 0-13Q-5.5-6 0 0Z";
const SLOTS = 15; // spots along the stem; even ones start with a leaf, odd ones are free
const GROW_GAP = 700; // ms between growths, so crossing from one button to the other adds one, not two
const FALL_MS = 1000;

// Rounded so the server and the browser print identical attribute strings (raw floats differ in the last digits).
const round = (n: number) => Math.round(n * 100) / 100;
const at = (t: number): Pt => {
  const u = 1 - t;
  const f = (i: 0 | 1) =>
    round(
      u ** 3 * STEM[0][i] +
        3 * u * u * t * STEM[1][i] +
        3 * u * t * t * STEM[2][i] +
        t ** 3 * STEM[3][i],
    );
  return [f(0), f(1)];
};
const spots = Array.from({ length: SLOTS }, (_, i) => {
  const [x, y] = at(0.06 + (i * 0.89) / (SLOTS - 1));
  return {
    leaf: `translate(${x} ${y}) rotate(${95 + (i % 2 ? 22 : -22)}) scale(${round(0.9 + (i % 3) * 0.12)})`,
    bloom: `translate(${x} ${round(y + 16)}) rotate(${(i * 25) % 70}) scale(0.85)`,
  };
});
const stemPath = `M${STEM[0]}C${STEM[1]} ${STEM[2]} ${STEM[3]}`;
const initial: Item[] = Array.from({ length: Math.ceil(SLOTS / 2) }, (_, n) => ({
  id: n,
  slot: n * 2,
  kind: "leaf",
}));

export function CtaGarland() {
  const ref = useRef<SVGSVGElement>(null);
  const [items, setItems] = useState<Item[]>(initial);
  const state = useRef({
    items: initial,
    nextId: initial.length,
    last: 0,
    timers: new Set<ReturnType<typeof setTimeout>>(),
  });

  const commit = (next: Item[]) => {
    state.current.items = next;
    setItems(next);
  };

  // Draw once, the first time the card is well in view; a card already on screen at load stays finished.
  useEffect(() => {
    const node = ref.current;
    const card = node?.parentElement;
    if (!node || !card) return;
    const { timers } = state.current;
    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      let first = true;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (first) {
            first = false;
            if (entry.isIntersecting) return observer?.disconnect();
            node.dataset.paint = "pending";
          } else if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            node.dataset.paint = "painting";
            timers.add(setTimeout(() => (node.dataset.paint = "complete"), 3200));
            observer?.disconnect();
          }
        },
        { threshold: 0.5 },
      );
      observer.observe(card);
    }

    const grow = () => {
      const s = state.current;
      const now = Date.now();
      if (node.dataset.paint === "pending" || node.dataset.paint === "painting") return;
      if (now - s.last < GROW_GAP || s.items.some((item) => item.falling)) return;
      s.last = now;
      const kind: Kind = Math.random() < 0.6 ? "leaf" : "bloom";
      const free = Array.from({ length: SLOTS }, (_, i) => i).filter(
        (i) => !s.items.some((item) => item.slot === i),
      );
      if (free.length) {
        const slot = free[Math.floor(Math.random() * free.length)];
        commit([...s.items, { id: s.nextId++, slot, kind, grown: true }]);
        return;
      }
      // Full: the oldest drops, then a new one grows where it was.
      const oldest = s.items[0];
      commit(s.items.map((item) => (item === oldest ? { ...item, falling: true } : item)));
      s.timers.add(
        setTimeout(() => {
          commit([
            ...s.items.filter((item) => item.id !== oldest.id),
            { id: s.nextId++, slot: oldest.slot, kind, grown: true },
          ]);
        }, FALL_MS),
      );
    };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target.matches(":focus-visible")) grow();
    };
    const links = Array.from(card.querySelectorAll("a"));
    links.forEach((link) => {
      link.addEventListener("pointerenter", grow);
      link.addEventListener("focus", onFocus);
    });
    return () => {
      observer?.disconnect();
      timers.forEach(clearTimeout);
      links.forEach((link) => {
        link.removeEventListener("pointerenter", grow);
        link.removeEventListener("focus", onFocus);
      });
    };
  }, []);

  return (
    <svg
      ref={ref}
      className={styles.ctaGarland}
      viewBox="540 -12 692 90"
      preserveAspectRatio="xMaxYMin meet"
      aria-hidden="true"
      focusable="false"
    >
      <path data-part="stem" pathLength={1} d={stemPath} />
      {items.map(({ id, slot, kind, falling, grown }) => (
        <g key={id} transform={spots[slot][kind]} style={{ "--i": slot } as CSSProperties}>
          <g
            data-item=""
            data-kind={kind}
            data-state={falling ? "falling" : undefined}
            data-grown={grown || undefined}
          >
            {kind === "leaf" ? (
              <>
                <path data-part="leaf" pathLength={1} d={LEAF} />
                <path data-part="leaf" pathLength={1} d={VEIN} />
              </>
            ) : (
              <g data-part="bloom">
                {[0, 72, 144, 216, 288].map((angle) => (
                  <path key={angle} pathLength={1} d={PETAL} transform={`rotate(${angle})`} />
                ))}
                <circle r="1.6" />
              </g>
            )}
          </g>
        </g>
      ))}
    </svg>
  );
}
