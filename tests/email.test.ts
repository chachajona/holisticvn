import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.hoisted(() => vi.fn());
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { buildLeadEmail, sendLeadNotification } from "@/lib/email";

const request = {
  kind: "booking" as const,
  name: "Nguyễn An",
  phone: "0901234567",
  branch: "xom-chieu" as const,
  message: "Buổi chiều",
  treatment: "Dry Needling",
  source: "/booking",
  website: "",
};

describe("sendLeadNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("LEAD_NOTIFICATION_EMAIL", "clinic@example.com");
    vi.stubEnv("RESEND_FROM_EMAIL", "Holistic <hello@example.com>");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("sends a scannable email to the clinic for manual confirmation", async () => {
    send.mockResolvedValue({ data: { id: "email-1" }, error: null });
    expect(await sendLeadNotification(request)).toEqual({ ok: true });
    const mail = send.mock.calls[0][0];
    expect(mail.to).toBe("clinic@example.com");
    expect(mail.subject).toBe("Gọi lại · Nguyễn An · 0901 234 567 · Đặt lịch · Xóm Chiếu");
    expect(mail.replyTo).toBeUndefined();
    expect(mail.text).toContain("Chi nhánh: Xóm Chiếu");
    expect(mail.text).toContain("Ghi chú của khách: Buổi chiều");
    expect(mail.html).toContain('href="tel:0901234567"');
    expect(mail.html).toContain('href="https://zalo.me/84901234567"');
  });

  it("escapes customer input and replies to the customer's email", async () => {
    send.mockResolvedValue({ data: { id: "email-2" }, error: null });
    await sendLeadNotification({
      ...request,
      message: "<script>alert(1)</script>",
      email: "an@example.com",
    });
    const mail = send.mock.calls[0][0];
    expect(mail.replyTo).toBe("an@example.com");
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain("&lt;script&gt;");
  });

  it("handles the nameless quick-consult lead", async () => {
    const mail = await buildLeadEmail({
      ...request,
      kind: "contact",
      name: "Khách tư vấn nhanh",
      branch: "",
      treatment: "",
      message: "",
      source: "home-hero",
    });
    expect(mail.subject).toBe("Gọi lại · 0901 234 567 · Tư vấn");
    expect(mail.html).toContain("Tư vấn nhanh");
    expect(mail.html).not.toContain("Khách chưa để lại tên");
    expect(mail.html).not.toContain("Ghi chú của khách");
    expect(mail.text).toContain("0901 234 567");
  });

  it("fails closed when configuration is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(await sendLeadNotification(request)).toEqual({ ok: false, reason: "unconfigured" });
    expect(send).not.toHaveBeenCalled();
  });

  it("fails closed when the provider rejects the email", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error" } });
    expect(await sendLeadNotification(request)).toEqual({ ok: false, reason: "delivery_failed" });
  });
});
