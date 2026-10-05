"use client";

import { useSyncExternalStore } from "react";

const key = "holisticvn-cookie-consent-v1";
const getVisible = () => localStorage.getItem(key) === null;
const getServerVisible = () => false;
const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

export function CookieConsent() {
  const visible = useSyncExternalStore(subscribe, getVisible, getServerVisible);
  if (!visible) return null;
  const setConsent = (value: "accepted" | "rejected") => { localStorage.setItem(key, value); document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`; window.location.reload(); };
  return <aside className="cookie" aria-label="Tùy chọn cookie"><p>Chúng tôi chỉ dùng analytics khi bạn đồng ý, để hiểu các trang và CTA hữu ích hơn.</p><div><button className="cookie__text" onClick={() => setConsent("rejected")}>Từ chối</button><button className="button" onClick={() => setConsent("accepted")}>Đồng ý analytics</button></div></aside>;
}
