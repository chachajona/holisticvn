import { createElement } from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { LeadNotificationEmail, type LeadEmailProps } from "@/emails/lead-notification";
import type { LeadInput } from "@/lib/validation";

const timeZone = "Asia/Ho_Chi_Minh";
// the hero form has no name field, so it submits this placeholder
const placeholderName = "Khách tư vấn nhanh";

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return /^0\d{9}$/.test(digits)
    ? `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
    : phone.trim();
}

function zaloLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://zalo.me/${digits.startsWith("0") ? `84${digits.slice(1)}` : digits}`;
}

export async function buildLeadEmail(input: LeadInput, now = new Date()) {
  const isBooking = input.kind === "booking";
  const hasName = input.name !== placeholderName;
  const phone = formatPhone(input.phone);
  const received = new Intl.DateTimeFormat("vi-VN", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(now);

  // the subject leads with the action and the number so staff know who to call before opening the email
  const subject = ["Gọi lại", hasName ? input.name : "", phone, isBooking ? "Đặt lịch" : "Tư vấn"]
    .filter(Boolean)
    .join(" · ");

  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://holisticvn.com";
  const props: LeadEmailProps = {
    eyebrow:
      input.source === "home-hero"
        ? "Tư vấn nhanh"
        : isBooking
          ? "Yêu cầu đặt lịch"
          : "Yêu cầu tư vấn",
    name: hasName ? input.name : null,
    phone,
    tel: input.phone.replace(/[^\d+]/g, ""),
    zalo: zaloLink(input.phone),
    received,
    rows: [
      ...(input.email ? [["Email", input.email] as [string, string]] : []),
      ...(input.treatment ? [["Liệu pháp", input.treatment] as [string, string]] : []),
      ["Nguồn", input.source],
    ],
    note: input.message?.trim() || null,
    emptyNote: input.source === "home-hero" ? null : "Không có ghi chú.",
    // PNG, not the SVG used on the site: Gmail does not render SVG images
    logoUrl: `${site}/assets/logo/email-lockup.png`,
    logoOnDarkUrl: `${site}/assets/logo/email-lockup-on-dark.png`,
  };
  const email = createElement(LeadNotificationEmail, props);
  // hand-written: the auto-converted text runs the call and Zalo links together
  const text = [
    `${props.eyebrow.toUpperCase()} · ${received}`,
    "",
    ...(props.name ? [`Khách hàng: ${props.name}`] : []),
    `Số điện thoại: ${phone}`,
    ...props.rows.map(([key, value]) => `${key}: ${value}`),
    "",
    ...((props.note ?? props.emptyNote) !== null
      ? [`Ghi chú của khách: ${props.note ?? props.emptyNote}`, ""]
      : []),
    `Zalo: ${props.zalo}`,
  ].join("\n");
  return { subject, html: await render(email), text };
}

export async function sendLeadNotification(
  input: LeadInput,
): Promise<{ ok: true } | { ok: false; reason: "unconfigured" | "delivery_failed" }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !to || !from) return { ok: false, reason: "unconfigured" };

  try {
    const { data, error } = await new Resend(apiKey).emails.send(
      {
        from,
        to,
        // lets staff reply straight to the customer when they left an email
        ...(input.email ? { replyTo: input.email } : {}),
        ...(await buildLeadEmail(input)),
      },
      { signal: AbortSignal.timeout(10000) },
    );
    if (error || !data?.id) {
      console.error("Lead email delivery failed", error?.name || "missing_message_id");
      return { ok: false, reason: "delivery_failed" };
    }
    return { ok: true };
  } catch (error) {
    console.error(
      "Lead email delivery failed",
      error instanceof Error ? error.name : "unknown_error",
    );
    return { ok: false, reason: "delivery_failed" };
  }
}
