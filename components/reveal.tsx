"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function Reveal({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    node.dataset.revealEnhanced = "true";
    observer.observe(node);
    return () => {
      observer.disconnect();
      delete node.dataset.revealEnhanced;
    };
  }, []);

  return (
    <div ref={ref} data-in-view={inView} className={className} style={style}>
      {children}
    </div>
  );
}
