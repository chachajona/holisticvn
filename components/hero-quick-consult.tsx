"use client";

import { useRef, useState, type SubmitEvent } from "react";
import { track } from "@/components/gtm";
import { leadToast } from "@/components/lead-toast";
import { submitLead, validateLead, type LeadPayload } from "@/lib/lead-client";
import styles from "./hero-quick-consult.module.css";

type Props = { hours: string; phone: string };

export function HeroQuickConsult({ hours, phone }: Props) {
  const [sending, setSending] = useState(false);
  const [digits, setDigits] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const phoneInput = useRef<HTMLInputElement>(null);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (sending) return;
    const fields = new FormData(form);
    // name is required by leadSchema; quick consult only collects a phone number
    const payload = {
      kind: "contact",
      name: "Khách tư vấn nhanh",
      phone: String(fields.get("phone") ?? ""),
      source: "home-hero",
      website: String(fields.get("website") ?? ""),
    } satisfies LeadPayload;
    const phoneError = validateLead(payload).phone;
    setInvalid(Boolean(phoneError));
    if (phoneError) {
      leadToast.invalid(phoneError);
      phoneInput.current?.focus();
      return;
    }
    setSending(true);
    const result = await submitLead(payload);
    setSending(false);
    if (result.ok) {
      track("contact_submit", { source: "home-hero" });
      form.reset();
      setDigits(0);
      leadToast.success(
        "Đã gửi yêu cầu tư vấn. Holistic sẽ gọi lại để trao đổi và xác nhận lịch hẹn.",
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
          ref={phoneInput}
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
      <p className={styles.note}>
        Holistic gọi lại trong khung giờ {hours} để tư vấn và xác nhận lịch hẹn.
      </p>
    </div>
  );
}
