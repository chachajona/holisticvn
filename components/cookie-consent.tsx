"use client";

import { useEffect, useState } from "react";

const key = "holisticvn-cookie-consent-v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(localStorage.getItem(key) === null), []);
  if (!visible) return null;
  const setConsent = (value: "accepted" | "rejected") => { localStorage.setItem(key, value); document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`; setVisible(false); window.location.reload(); };
  return <aside className="cookie" aria-label="Tùy chọn cookie"><p>Chúng tôi chỉ dùng analytics khi bạn đồng ý, để hiểu các trang và CTA hữu ích hơn.</p><div><button className="cookie__text" onClick={() => setConsent("rejected")}>Từ chối</button><button className="button" onClick={() => setConsent("accepted")}>Đồng ý analytics</button></div></aside>;
}
