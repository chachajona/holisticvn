"use client";

import { useEffect, useRef, useState } from "react";
import { nextDockState } from "@/lib/dock-visibility";
import styles from "./treatment-page.module.css";

type Props = { markerId: string; title: string; price?: string; duration?: string };

export function TreatmentDock({ markerId, title, price, duration }: Props) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const marker = document.getElementById(markerId);
    const panel = document.getElementById("yeu-cau");
    if (!marker || !panel) return;
    let frame = 0;
    let reached = false; // once the form was reached the dock stays hidden until the page reloads
    const update = () => {
      frame = 0;
      const next = nextDockState({
        reached,
        markerBottom: marker.getBoundingClientRect().bottom,
        panelTop: panel.getBoundingClientRect().top,
        viewportHeight: window.innerHeight,
      });
      reached = next.reached;
      setShown(next.visible);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [markerId]);

  // Other fixed widgets (chat buttons) read the dock's height to stay clear of it.
  useEffect(() => {
    const root = document.documentElement;
    const dock = ref.current;
    if (!shown || !dock) {
      root.style.removeProperty("--dock-h");
      return;
    }
    const measure = () => root.style.setProperty("--dock-h", `${dock.offsetHeight + 12}px`);
    measure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(dock);
    return () => {
      observer?.disconnect();
      root.style.removeProperty("--dock-h");
    };
  }, [shown]);

  return (
    <aside
      ref={ref}
      className={`${styles.dock} ${shown ? styles.dockShown : ""}`}
      aria-label="Tóm tắt và gửi yêu cầu tư vấn"
      inert={!shown}
    >
      <span className={styles.dockTitle}>{title}</span>
      {price || duration ? (
        <span className={styles.dockPrice}>
          {price ?? duration}
          {price && duration ? <small>{duration}</small> : null}
        </span>
      ) : null}
      <a className={`${styles.btn} ${styles.btnPrimary}`} href="#yeu-cau">
        Gửi yêu cầu tư vấn →
      </a>
    </aside>
  );
}
