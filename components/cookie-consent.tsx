"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  consentChanged,
  hasConsentChoice,
  preferencesHash,
  resetConsent,
  writeConsent,
} from "@/lib/consent";

// Set when cookies are blocked: the choice cannot persist, so hide the banner for this page view only.
let dismissed = false;
const getVisible = () => !dismissed && !hasConsentChoice();
const getServerVisible = () => false;
const subscribe = (onChange: () => void) => {
  window.addEventListener(consentChanged, onChange);
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  const timer = window.setInterval(onChange, 30_000);
  return () => {
    window.removeEventListener(consentChanged, onChange);
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
    window.clearInterval(timer);
  };
};

function CookieBanner() {
  const ref = useRef<HTMLElement>(null);
  // Publish the banner height so the footer can reserve exactly that much room, even when text is enlarged.
  useEffect(() => {
    const banner = ref.current;
    if (!banner) return;
    const root = document.documentElement.style;
    const update = () => root.setProperty("--cookie-h", `${banner.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(banner);
    return () => {
      observer.disconnect();
      root.removeProperty("--cookie-h");
    };
  }, []);
  // Arriving from the footer control (reload with the hash) puts keyboard focus on the choice.
  useEffect(() => {
    if (window.location.hash !== `#${preferencesHash}`) return;
    ref.current?.querySelector("button")?.focus();
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);
  const setConsent = (value: "accepted" | "rejected") => {
    writeConsent(value);
    if (hasConsentChoice()) return window.location.reload();
    dismissed = true;
    window.dispatchEvent(new Event(consentChanged));
  };
  return (
    <aside ref={ref} id={preferencesHash} className="cookie" aria-label="Tùy chọn cookie">
      <p>
        Chúng tôi dùng cookie phân tích để cải thiện website, chỉ khi bạn đồng ý.{" "}
        <Link href="/cookie-policy">Chính sách cookie</Link>.
      </p>
      <div>
        <button className="button" onClick={() => setConsent("rejected")}>
          Từ chối
        </button>
        <button className="button" onClick={() => setConsent("accepted")}>
          Chấp nhận
        </button>
      </div>
    </aside>
  );
}

export function CookieConsent() {
  const visible = useSyncExternalStore(subscribe, getVisible, getServerVisible);
  return visible ? <CookieBanner /> : null;
}

/** Footer control: withdraw the saved choice and reload so the banner asks again and no tag stays loaded. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        resetConsent();
        window.location.hash = preferencesHash;
        window.location.reload();
      }}
    >
      Tùy chọn cookie
    </button>
  );
}
