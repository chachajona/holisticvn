"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mapsHref, noBreakAddress } from "@/lib/content";
import { useSiteData } from "@/components/site-data";
import { navMorphProgress } from "@/lib/nav-morph";
import styles from "./holistic-chrome.module.css";

const links: Array<[string, string]> = [
  ["Dịch vụ", "/services"],
  ["Phương pháp", "/treatments"],
  ["Về chúng tôi", "/about"],
  ["Góc nhìn", "/blog"],
];

// Scroll distance (px) over which the desktop bar morphs into the pill.
const MORPH_RANGE = 120;

function ClockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function HolisticNav() {
  const { site, branches } = useSiteData();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const utilityRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const directionsRef = useRef<HTMLDetailsElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const phoneDigits = site.phone.replace(/\s+/g, "");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const updateScroll = () => {
      setScrolled(window.scrollY > 48);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // --nav-p drives the desktop pill morph (see holistic-chrome.module.css); it starts once the
        // utility bar has scrolled away and the nav sticks.
        const start = utilityRef.current?.offsetHeight ?? 0;
        const p = navMorphProgress(window.scrollY, start, MORPH_RANGE, reduceMotion.matches);
        navRef.current?.style.setProperty("--nav-p", p.toFixed(3));
      });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  useEffect(() => {
    const details = directionsRef.current;
    if (!details) return;
    const closeOutside = (event: PointerEvent) => {
      if (details.open && !details.contains(event.target as Node)) details.open = false;
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && details.open) {
        details.open = false;
        details.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1001px)");
    const closeAtDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeAtDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeAtDesktop);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div ref={utilityRef} className={styles.utility}>
        <span className={styles.utilityItem}>
          <ClockIcon />
          MỞ CỬA {site.hours}
          <span className={styles.utilityNote}> · {site.hoursNote.toUpperCase()}</span>
        </span>
        <span className={styles.utilityRight}>
          <a
            href={`tel:${phoneDigits}`}
            className={`${styles.utilityItem} ${styles.utilityHotline}`}
          >
            <PhoneIcon />
            HOTLINE {site.phone}
          </a>
          <details ref={directionsRef} className={styles.directions}>
            <summary className={styles.utilityItem}>
              <PinIcon />
              CHỈ ĐƯỜNG
              <ChevronIcon />
            </summary>
            <div className={styles.directionsMenu}>
              {branches.map((branch) => (
                <a key={branch.name} href={mapsHref(branch.address)}>
                  <strong>{branch.name}</strong>
                  <span>{noBreakAddress(branch.address)}</span>
                </a>
              ))}
            </div>
          </details>
        </span>
      </div>

      <div ref={navRef} className={styles.navRow} data-scrolled={scrolled || undefined}>
        <header className={styles.navPill}>
          <Link
            href="/"
            className={styles.navBrand}
            aria-label="HolisticVN trang chủ"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/assets/logo/lockup-on-light.svg"
              alt="holistic — rehab & performance"
              width={2103}
              height={470}
              className={styles.navLogoFull}
            />
            <Image
              src="/assets/logo/symbol-on-light.svg"
              alt=""
              width={690}
              height={470}
              aria-hidden="true"
              className={styles.navLogoSymbol}
            />
          </Link>
          <nav className={styles.navLinks} aria-label="Điều hướng chính">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                data-active={isActive(href)}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className={styles.navRight}>
            <span className={styles.navLang} title="Tiếng Việt">
              VI
            </span>
            <Link href="/booking" className={styles.navCta} onClick={() => setOpen(false)}>
              <span className={styles.ctaDesktop}>Đặt lịch ngay</span>
              <span className={styles.ctaCompact}>Đặt lịch</span>
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              aria-label={open ? "Đóng menu" : "Mở menu"}
              aria-expanded={open}
              aria-controls="mobile-site-navigation"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>
        <nav
          id="mobile-site-navigation"
          className={
            open ? `${styles.mobileDrawer} ${styles.mobileDrawerOpen}` : styles.mobileDrawer
          }
          aria-label="Điều hướng di động"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              data-active={isActive(href)}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
