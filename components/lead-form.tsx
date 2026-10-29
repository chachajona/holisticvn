"use client";

import { useId, useLayoutEffect, useRef, useState, type SubmitEvent } from "react";
import { track } from "@/components/gtm";
import { leadToast } from "@/components/lead-toast";
import { useSiteData } from "@/components/site-data";
import { submitLead, validateLead, type LeadErrors, type LeadPayload } from "@/lib/lead-client";
import styles from "./lead-form.module.css";

type Props = {
  kind: LeadPayload["kind"];
  treatment?: string;
  submitLabel?: string;
  successMessage?: string;
  motion?: boolean;
};

export function LeadForm({
  kind,
  treatment,
  submitLabel = "Gửi yêu cầu",
  successMessage,
  motion = false,
}: Props) {
  const { site } = useSiteData();
  const id = useId();
  const [errors, setErrors] = useState<LeadErrors>({});
  const focusTarget = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [motionInput, setMotionInput] = useState<"pointer" | "keyboard">("keyboard");
  const sending = state === "sending";

  useLayoutEffect(() => {
    // Focus only after the error descriptions and ARIA attributes are in the DOM.
    focusTarget.current?.focus();
    focusTarget.current = null;
  }, [errors]);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (sending) return;
    const fields = new FormData(form);
    const text = (name: string) => String(fields.get(name) ?? "");
    const payload = {
      kind,
      name: text("name"),
      phone: text("phone"),
      email: text("email"),
      message: text("message"),
      treatment,
      source: window.location.pathname,
      website: text("website"),
    } satisfies LeadPayload;
    const validationErrors = validateLead(payload);
    setErrors(validationErrors);
    const firstInvalidField = Object.keys(validationErrors)[0];
    if (firstInvalidField) {
      setState("error");
      const target = form.elements.namedItem(firstInvalidField);
      focusTarget.current = target instanceof HTMLElement ? target : null;
      return;
    }
    setState("sending");
    const result = await submitLead(payload);
    if (result.ok) {
      setState("sent");
      track(kind === "booking" ? "booking_submit" : "contact_submit");
      form.reset();
      leadToast.success(
        successMessage ??
          (kind === "booking"
            ? "Đã gửi yêu cầu. Holistic sẽ gọi lại để xác nhận lịch hẹn tại cơ sở Lê Quốc Hưng."
            : "Đã gửi lời nhắn. Holistic sẽ gọi lại để trao đổi với bạn."),
      );
    } else {
      setState("error");
      leadToast.error(result.message, site.phone);
    }
  };

  const fieldProps = (name: keyof LeadPayload) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });
  const fieldError = (name: keyof LeadPayload) =>
    errors[name] ? (
      <p className="lead-form__error" id={`${id}-${name}-error`}>
        {errors[name]}
      </p>
    ) : null;
  const buttonLabel = sending ? "Đang gửi…" : submitLabel;

  return (
    <form
      className={`lead-form${motion ? ` ${styles.motion}` : ""}`}
      data-state={state}
      data-motion-input={motion ? motionInput : undefined}
      onPointerDownCapture={motion ? () => setMotionInput("pointer") : undefined}
      onKeyDownCapture={motion ? () => setMotionInput("keyboard") : undefined}
      noValidate
      onSubmit={submit}
      onChange={(event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
          const { name } = target;
          setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
        }
        if (!sending) setState("idle");
      }}
    >
      <span role="alert" aria-atomic="true" className={styles.validationStatus}>
        {Object.values(errors).filter(Boolean).join(". ")}
      </span>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="honeypot"
        aria-hidden="true"
      />
      <label>
        Họ và tên
        <input
          required
          name="name"
          maxLength={100}
          autoComplete="name"
          placeholder="Tên của bạn"
          {...fieldProps("name")}
        />
      </label>
      {fieldError("name")}
      <label>
        Số điện thoại
        <input
          required
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="09xx xxx xxx"
          {...fieldProps("phone")}
        />
      </label>
      {fieldError("phone")}
      {kind !== "booking" ? (
        <>
          <label>
            <span>
              Email <small>(không bắt buộc)</small>
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ban@example.com"
              {...fieldProps("email")}
            />
          </label>
          {fieldError("email")}
        </>
      ) : null}
      {kind === "booking" ? (
        <details className="lead-form__details">
          <summary>
            {motion ? <span className={styles.noteChevron} aria-hidden="true" /> : null}
            Thêm ghi chú <small>(không bắt buộc)</small>
          </summary>
          <label>
            Thời gian thuận tiện hoặc vấn đề bạn muốn trao đổi
            <textarea
              name="message"
              maxLength={1000}
              rows={3}
              placeholder="Ví dụ: muốn được gọi vào buổi chiều"
            />
          </label>
        </details>
      ) : (
        <label>
          Bạn đang cần hỗ trợ gì?
          <textarea
            name="message"
            maxLength={1000}
            rows={4}
            placeholder="Chia sẻ ngắn về tình trạng hoặc mục tiêu của bạn"
          />
        </label>
      )}
      <button className="button" disabled={sending}>
        {motion ? (
          <span className={styles.buttonLabels}>
            <span aria-hidden={sending}>{submitLabel}</span>
            <span aria-hidden={!sending}>Đang gửi…</span>
          </span>
        ) : (
          buttonLabel
        )}{" "}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
