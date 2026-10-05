"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@/components/gtm";
import styles from "./hero-quick-consult.module.css";

type Props = { hours: string; phone: string };

export function HeroQuickConsult({ hours, phone }: Props) {
  const [sending, setSending] = useState(false);
  const [digits, setDigits] = useState(0);
  const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!toast || toast.kind === "error") return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    setSending(true);
    const form = new FormData(formEl);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // name is required by leadSchema; quick consult only collects a phone number
      body: JSON.stringify({ kind: "contact", name: "Khách tư vấn nhanh", phone: form.get("phone"), source: "home-hero", website: form.get("website") }),
    }).catch(() => null);
    setSending(false);
    if (response?.ok) {
      track("contact_submit", { source: "home-hero" });
      formEl.reset();
      setDigits(0);
      setToast({ kind: "success", text: "Đã nhận yêu cầu. Holistic sẽ gọi lại để tư vấn; lịch hẹn sẽ được xác nhận sau." });
      return;
    }
    const body = await response?.json().catch(() => null);
    setToast({ kind: "error", text: response?.status === 400 && body?.error ? body.error : "Chưa thể gửi yêu cầu. Vui lòng thử lại hoặc gọi Holistic." });
  };

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={submit}>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.honeypot} />
        <input required name="phone" type="tel" inputMode="tel" autoComplete="tel" aria-label="Số điện thoại" placeholder="Số điện thoại" className={styles.input} onChange={event => setDigits(event.target.value.replace(/\D/g, "").length)} />
        {/* on mobile the label collapses to an arrow once the user starts typing, giving the input more room */}
        <button type="submit" className={styles.button} disabled={sending} aria-label={sending ? "Đang gửi" : "Tư vấn ngay"} data-collapsed={(digits > 0 && !sending) || undefined} data-ready={(digits >= 10 && !sending) || undefined}>
          <span className={styles.labelWrap}><span className={styles.label}>{sending ? "Đang gửi…" : "Tư vấn ngay"}</span></span>
          <span className={styles.arrow} aria-hidden="true">→</span>
        </button>
      </form>
      <p className={styles.note}>Holistic gọi lại {hours}; lịch hẹn được xác nhận sau.</p>
      {mounted && createPortal(<div className={styles.toastRegion} role="status" aria-live={toast?.kind === "error" ? "assertive" : "polite"}>
        {toast && <div className={styles.toast} data-kind={toast.kind}>
          <span>{toast.text}</span>
          {toast.kind === "error" && <><a href={`tel:${phone.replaceAll(" ", "")}`}>Gọi ngay</a><button type="button" onClick={() => setToast(null)} aria-label="Đóng thông báo">×</button></>}
        </div>}
      </div>, document.body)}
    </div>
  );
}
