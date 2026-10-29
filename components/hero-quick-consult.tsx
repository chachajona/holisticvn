"use client";

import { FormEvent, useRef, useState } from "react";
import { track } from "@/components/gtm";
import { leadToast } from "@/components/lead-toast";
import { submitLead, validateLead } from "@/lib/lead-client";
import styles from "./hero-quick-consult.module.css";

type Props = { hours: string; phone: string };

export function HeroQuickConsult({ hours, phone }: Props) {
  const [sending, setSending] = useState(false);
  const [digits, setDigits] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    if (sending) return;
    const form = new FormData(formEl);
    // name is required by leadSchema; quick consult only collects a phone number
    const payload = {
      kind: "contact",
      name: "Khách tư vấn nhanh",
      phone: String(form.get("phone") ?? ""),
      source: "home-hero",
      website: String(form.get("website") ?? ""),
    };
    const problem = validateLead(payload).phone;
    setInvalid(Boolean(problem));
    if (problem) {
      leadToast.invalid(problem);
      input.current?.focus();
      return;
    }
    setSending(true);
    const result = await submitLead(payload);
    setSending(false);
    if (result.ok) {
      track("contact_submit", { source: "home-hero" });
      formEl.reset();
      setDigits(0);
      leadToast.success(
        "Đã nhận yêu cầu. Holistic sẽ gọi lại để tư vấn; lịch hẹn sẽ được xác nhận sau.",
      );
    } else {
      leadToast.error(result.message, phone);
    }
  };

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={submit} noValidate data-chat-exclusion>
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className={styles.honeypot}
        />
        <input
          ref={input}
          required
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          aria-label="Số điện thoại"
          placeholder="Số điện thoại"
          className={styles.input}
          aria-invalid={invalid || undefined}
          onChange={(event) => {
            setDigits(event.target.value.replace(/\D/g, "").length);
            setInvalid(false);
          }}
        />
        {/* on mobile the label collapses to an arrow once the user starts typing, giving the input more room */}
        <button
          type="submit"
          className={styles.button}
          disabled={sending}
          aria-label={sending ? "Đang gửi" : "Tư vấn ngay"}
          data-collapsed={(digits > 0 && !sending) || undefined}
          data-ready={(digits >= 10 && !sending) || undefined}
        >
          <span className={styles.labelWrap}>
            <span className={styles.label}>{sending ? "Đang gửi…" : "Tư vấn ngay"}</span>
          </span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </button>
      </form>
      <p className={styles.note}>Holistic gọi lại {hours}; lịch hẹn được xác nhận sau.</p>
    </div>
  );
}
