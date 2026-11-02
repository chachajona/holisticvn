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
  variant?: "page";
};

export function LeadForm({
  kind,
  treatment,
  submitLabel = "Gửi yêu cầu",
  successMessage,
  motion = false,
  variant,
}: Props) {
  const { site } = useSiteData();
  const id = useId();
  const [errors, setErrors] = useState<LeadErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const focusTarget = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [responseMessage, setResponseMessage] = useState("");
  const inFlight = useRef(false);
  const successFeedback = useRef<HTMLDivElement>(null);
  const errorFeedback = useRef<HTMLDivElement>(null);
  const [motionInput, setMotionInput] = useState<"pointer" | "keyboard">("keyboard");
  const sending = state === "sending";
  const isPage = variant === "page";
  // Page forms share the label fade; disclosure motion remains opt-in.
  const labelMotion = motion || isPage;
  const confirmation =
    successMessage ??
    (kind === "booking"
      ? "Đã gửi yêu cầu. Holistic sẽ gọi lại để xác nhận lịch hẹn tại cơ sở Lê Quốc Hưng."
      : "Đã gửi lời nhắn. Holistic sẽ gọi lại để trao đổi với bạn.");

  useLayoutEffect(() => {
    // Focus only after the error descriptions and ARIA attributes are in the DOM.
    if (isPage) {
      focusTarget.current?.focus({ preventScroll: true });
      focusTarget.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
    } else {
      focusTarget.current?.focus();
    }
    focusTarget.current = null;
  }, [errors, isPage]);

  useLayoutEffect(() => {
    if (!isPage) return;
    // An async result must not take focus back after the visitor has moved elsewhere.
    const active = document.activeElement;
    if (active !== document.body && !formRef.current?.contains(active)) return;
    const target =
      state === "sent"
        ? successFeedback.current
        : state === "error" && responseMessage
          ? errorFeedback.current
          : null;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [isPage, state, responseMessage]);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (inFlight.current) return;
    setResponseMessage("");
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
      if (firstInvalidField === "message") form.querySelector("details")?.setAttribute("open", "");
      focusTarget.current = target instanceof HTMLElement ? target : null;
      return;
    }
    inFlight.current = true;
    setState("sending");
    const result = await submitLead(payload);
    inFlight.current = false;
    if (result.ok) {
      setState("sent");
      track(kind === "booking" ? "booking_submit" : "contact_submit");
      form.reset();
      if (!isPage) leadToast.success(confirmation);
    } else {
      setState("error");
      setResponseMessage(result.message);
      if (!isPage) leadToast.error(result.message, site.phone);
    }
  };

  const fieldProps = (name: keyof LeadPayload, helper?: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby":
      [helper, errors[name] ? `${id}-${name}-error` : undefined].filter(Boolean).join(" ") ||
      undefined,
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
      ref={formRef}
      className={`lead-form${motion ? ` ${styles.motion}` : ""}${isPage ? ` ${styles.page}` : ""}`}
      data-state={state}
      data-motion-input={labelMotion ? motionInput : undefined}
      onPointerDownCapture={labelMotion ? () => setMotionInput("pointer") : undefined}
      onKeyDownCapture={labelMotion ? () => setMotionInput("keyboard") : undefined}
      onFocusCapture={
        isPage
          ? (event) => {
              // The existing consent banner publishes its measured height, including enlarged text.
              const cookieHeight =
                parseFloat(
                  getComputedStyle(document.documentElement).getPropertyValue("--cookie-h"),
                ) || 0;
              if (
                cookieHeight &&
                event.target.getBoundingClientRect().bottom > window.innerHeight - cookieHeight - 24
              ) {
                event.target.scrollIntoView({ block: "center", behavior: "instant" });
              }
            }
          : undefined
      }
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
      {isPage ? (
        <p className={styles.hint}>Họ và tên, số điện thoại là thông tin bắt buộc.</p>
      ) : null}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="honeypot"
        aria-hidden="true"
      />
      <div className={styles.field}>
        <label>
          Họ và tên
          <input
            required
            name="name"
            maxLength={100}
            autoComplete="name"
            placeholder={isPage ? undefined : "Tên của bạn"}
            readOnly={isPage && sending}
            {...fieldProps("name")}
          />
        </label>
        {fieldError("name")}
      </div>
      <div className={styles.field}>
        <label>
          Số điện thoại
          <input
            required
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="09xx xxx xxx"
            readOnly={isPage && sending}
            {...fieldProps("phone", isPage ? `${id}-phone-hint` : undefined)}
          />
        </label>
        {isPage ? (
          <p className={styles.hint} id={`${id}-phone-hint`}>
            Dùng số bắt đầu bằng 0 hoặc +84 để Holistic gọi lại.
          </p>
        ) : null}
        {fieldError("phone")}
      </div>
      {kind !== "booking" ? (
        <div className={styles.field}>
          <label>
            <span>
              Email <small>(không bắt buộc)</small>
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="ban@example.com"
              readOnly={isPage && sending}
              {...fieldProps("email")}
            />
          </label>
          {fieldError("email")}
        </div>
      ) : null}
      {kind === "booking" ? (
        <details className="lead-form__details">
          <summary>
            {motion ? <span className={styles.noteChevron} aria-hidden="true" /> : null}
            Thêm ghi chú <small>(không bắt buộc)</small>
          </summary>
          <div className={styles.field}>
            <label>
              Thời gian thuận tiện hoặc vấn đề bạn muốn trao đổi
              <textarea
                name="message"
                maxLength={1000}
                rows={3}
                placeholder="Ví dụ: muốn được gọi vào buổi chiều"
                readOnly={isPage && sending}
                {...fieldProps("message", isPage ? `${id}-message-hint` : undefined)}
              />
            </label>
            {isPage ? (
              <p className={styles.hint} id={`${id}-message-hint`}>
                Tối đa 1.000 ký tự.
              </p>
            ) : null}
            {fieldError("message")}
          </div>
        </details>
      ) : (
        <div className={styles.field}>
          <label>
            <span>Bạn đang cần hỗ trợ gì?{isPage ? <small> (không bắt buộc)</small> : null}</span>
            <textarea
              name="message"
              maxLength={1000}
              rows={4}
              placeholder="Chia sẻ ngắn về tình trạng hoặc mục tiêu của bạn"
              readOnly={isPage && sending}
              {...fieldProps("message", isPage ? `${id}-message-hint` : undefined)}
            />
          </label>
          {isPage ? (
            <p className={styles.hint} id={`${id}-message-hint`}>
              Tối đa 1.000 ký tự.
            </p>
          ) : null}
          {fieldError("message")}
        </div>
      )}
      <button className="button" type="submit" disabled={sending}>
        {labelMotion ? (
          <span className={styles.buttonLabels}>
            <span aria-hidden={sending}>{submitLabel}</span>
            <span aria-hidden={!sending}>Đang gửi…</span>
          </span>
        ) : (
          buttonLabel
        )}{" "}
        {isPage ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M4 12h16m-6-6 6 6-6 6" />
          </svg>
        ) : (
          <span aria-hidden="true">→</span>
        )}
      </button>
      {isPage ? (
        <>
          <div
            ref={successFeedback}
            tabIndex={-1}
            role="status"
            aria-atomic="true"
            className={styles.status}
          >
            {sending ? <p>Đang gửi yêu cầu. Vui lòng chờ…</p> : null}
            {state === "sent" ? (
              <div className={styles.success}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
                <p>{confirmation}</p>
              </div>
            ) : null}
          </div>
          <div
            ref={errorFeedback}
            tabIndex={-1}
            role="alert"
            aria-atomic="true"
            className={styles.status}
          >
            {responseMessage ? (
              <div className={styles.failure}>
                <p>{responseMessage}</p>
                <a href={`tel:${site.phone.replaceAll(" ", "")}`}>Gọi Holistic: {site.phone}</a>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </form>
  );
}
