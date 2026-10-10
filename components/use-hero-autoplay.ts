"use client";

import { useEffect, useRef } from "react";

const AUTOPLAY_DELAY = 4500;

export function useHeroAutoplay(advance: () => void, viewport: string) {
  const regionRef = useRef<HTMLDivElement>(null);
  const touchingRef = useRef(false);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visibleViewport = window.matchMedia(viewport);
    let timer: ReturnType<typeof setInterval> | undefined;
    let hovered = region.matches(":hover") && window.matchMedia("(hover: hover)").matches;

    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };
    const resume = () => {
      stop();
      if (
        reducedMotion.matches ||
        !visibleViewport.matches ||
        document.hidden ||
        hovered ||
        touchingRef.current ||
        region.contains(document.activeElement)
      )
        return;
      timer = setInterval(advance, AUTOPLAY_DELAY);
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      hovered = true;
      stop();
    };
    const leave = () => {
      hovered = false;
      resume();
    };
    const touchStart = () => {
      touchingRef.current = true;
      stop();
    };
    const touchEnd = () => {
      touchingRef.current = false;
      resume();
    };
    const blur = (event: FocusEvent) => {
      if (!region.contains(event.relatedTarget as Node | null)) resume();
    };

    region.addEventListener("pointerenter", enter);
    region.addEventListener("pointerleave", leave);
    region.addEventListener("touchstart", touchStart, { passive: true });
    region.addEventListener("touchend", touchEnd);
    region.addEventListener("touchcancel", touchEnd);
    region.addEventListener("focusin", stop);
    region.addEventListener("focusout", blur);
    document.addEventListener("visibilitychange", resume);
    reducedMotion.addEventListener("change", resume);
    visibleViewport.addEventListener("change", resume);
    resume();

    return () => {
      stop();
      region.removeEventListener("pointerenter", enter);
      region.removeEventListener("pointerleave", leave);
      region.removeEventListener("touchstart", touchStart);
      region.removeEventListener("touchend", touchEnd);
      region.removeEventListener("touchcancel", touchEnd);
      region.removeEventListener("focusin", stop);
      region.removeEventListener("focusout", blur);
      document.removeEventListener("visibilitychange", resume);
      reducedMotion.removeEventListener("change", resume);
      visibleViewport.removeEventListener("change", resume);
    };
  }, [advance, viewport]);

  return regionRef;
}
