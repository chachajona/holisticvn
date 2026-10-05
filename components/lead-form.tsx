"use client";

import { FormEvent, useState } from "react";
import { track } from "@/components/gtm";
import { site } from "@/lib/content";

type Props = { kind: "contact" | "booking"; treatment?: string };

export function LeadForm({ kind, treatment }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setState("sending");
    const fields = new FormData(form);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        name: fields.get("name"),
        phone: fields.get("phone"),
        email: fields.get("email") || "",
        branch: fields.get("branch") || "",
        message: fields.get("message") || "",
        treatment,
        source: window.location.pathname,
        website: fields.get("website"),
      }),
    }).catch(() => null);

    if (response?.ok) {
      setState("sent");
      track(kind === "booking" ? "booking_submit" : "contact_submit");
      form.reset();
    } else {
      setState("error");
    }
  };

  return (
    <form
      className="lead-form"
      onSubmit={submit}
      onChange={() => {
        if (state !== "sending") setState("idle");
      }}
    >
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="honeypot"
        aria-hidden="true"
      />
      <label>
        Họ và tên
        <input required name="name" minLength={2} autoComplete="name" placeholder="Tên của bạn" />
      </label>
      <label>
        Số điện thoại
        <input
          required
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="09xx xxx xxx"
        />
      </label>
      {kind === "booking" ? (
        <label>
          <span>
            Chi nhánh mong muốn <small>(không bắt buộc)</small>
          </span>
          <select name="branch" defaultValue="">
            <option value="">Trao đổi khi gọi lại</option>
            <option value="ban-co">Bàn Cờ</option>
            <option value="xom-chieu">Xóm Chiếu</option>
          </select>
        </label>
      ) : (
        <label>
          <span>
            Email <small>(không bắt buộc)</small>
          </span>
          <input name="email" type="email" autoComplete="email" placeholder="ban@example.com" />
        </label>
      )}
      {kind === "booking" ? (
        <details className="lead-form__details">
          <summary>
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
      <button className="button" disabled={state === "sending"}>
        {state === "sending" ? "Đang gửi…" : "Gửi yêu cầu"} <span>→</span>
      </button>
      <div
        aria-live="polite"
        className={state === "sent" ? "form-message form-message--success" : "form-message"}
      >
        {state === "sent"
          ? kind === "booking"
            ? "Đã gửi yêu cầu. Holistic sẽ gọi lại để xác nhận thời gian và chi nhánh; đây chưa phải lịch hẹn."
            : "Đã gửi lời nhắn. Holistic sẽ liên hệ lại với bạn."
          : null}
        {state === "error" ? (
          <>
            Chưa gửi được yêu cầu. Vui lòng thử lại hoặc{" "}
            <a href={`tel:${site.phone.replaceAll(" ", "")}`}>gọi Holistic</a>.
          </>
        ) : null}
      </div>
    </form>
  );
}
