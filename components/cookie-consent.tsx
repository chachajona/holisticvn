"use client";

import { useSyncExternalStore } from "react";

const key = "holisticvn-cookie-consent-v1";
const getVisible = () =>
  !document.cookie
    .split("; ")
    .some((cookie) => cookie === `${key}=accepted` || cookie === `${key}=rejected`);
const getServerVisible = () => false;
const subscribe = (onChange: () => void) => {
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  const timer = window.setInterval(onChange, 30_000);
  return () => {
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
    window.clearInterval(timer);
  };
};

export function CookieConsent() {
  const visible = useSyncExternalStore(subscribe, getVisible, getServerVisible);
  if (!visible) return null;
  const setConsent = (value: "accepted" | "rejected") => {
    document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };
  return (
    <aside className="cookie" aria-label="Tùy chọn cookie">
      <p>Chúng tôi chỉ dùng analytics khi bạn đồng ý, để hiểu các trang và CTA hữu ích hơn.</p>
      <div>
        <button className="cookie__text" onClick={() => setConsent("rejected")}>
          Từ chối
        </button>
        <button className="button" onClick={() => setConsent("accepted")}>
          Đồng ý analytics
        </button>
      </div>
    </aside>
  );
}
