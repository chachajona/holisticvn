"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/components/gtm";
import { site } from "@/lib/content";
import { ZALO_PATH } from "@/components/brand-icons";
import styles from "./chat-widgets.module.css";

const zalo = process.env.NEXT_PUBLIC_ZALO_ID;
const messenger = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;

// Messenger glyph reused from the previous holisticvn.com site; phone is a Lucide-style outline.
const MESSENGER_PATH = "M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23A19.92 19.92 0 0 0 122 502.31c52.91-23.3 53.59-25.14 62.56-22.7C337.85 521.8 504 423.7 504 248.57 504 110.34 396.59 8 256.55 8zm149.24 185.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z";

export function ChatWidgets() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [nearFooter, setNearFooter] = useState(false);
  const [observedForm, setObservedForm] = useState({ pathname: "", visible: false });
  const formVisible = observedForm.pathname === pathname && observedForm.visible;
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    const form = document.querySelector(".lead-form");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setObservedForm({ pathname, visible: entry.isIntersecting }), { threshold: 0.15 });
    observer.observe(form);
    return () => observer.disconnect();
  }, [pathname]);
  // on mobile the home hero already has its own CTA, which the floating buttons would cover until the user scrolls;
  // the footer lists the same contact channels, so they step aside there too
  const hold = (pathname === "/" && !scrolled) || nearFooter;
  return (
    <div className={styles.widgets} aria-label="Kênh tư vấn nhanh" data-hold={hold || undefined} data-form-visible={formVisible || undefined}>
      <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className={`${styles.button} ${styles.dial}`} aria-label={`Gọi ${site.phone}`} title={`Gọi ${site.phone}`} onClick={() => track("chat_click", { channel: "dial" })}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
      </a>
      {zalo ? (
        <a href={`https://zalo.me/${zalo}`} target="_blank" rel="noreferrer" className={`${styles.button} ${styles.zalo}`} aria-label="Mở chat Zalo" title="Chat Zalo" onClick={() => track("chat_click", { channel: "zalo" })}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={ZALO_PATH} /></svg>
        </a>
      ) : null}
      {messenger ? (
        <a href={`https://m.me/${messenger}`} target="_blank" rel="noreferrer" className={`${styles.button} ${styles.messenger}`} aria-label="Mở chat Messenger" title="Chat Messenger" onClick={() => track("chat_click", { channel: "messenger" })}>
          <svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d={MESSENGER_PATH} /></svg>
        </a>
      ) : null}
    </div>
  );
}
