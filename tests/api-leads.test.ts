import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/email", () => ({ sendLeadNotification: vi.fn() }));

import { sendLeadNotification } from "@/lib/email";
import { POST } from "@/app/api/leads/route";

function req(body: unknown) {
  return new Request("http://localhost/api/leads", { method: "POST", body: JSON.stringify(body) });
}

const validLead = {
  kind: "booking",
  name: "Nguyễn An",
  phone: "0901234567",
  branch: "ban-co",
  source: "/booking",
};

describe("POST /api/leads", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects invalid payload without sending email", async () => {
    const res = await POST(req({ kind: "contact", name: "A" }));
    expect(res.status).toBe(400);
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot without sending email", async () => {
    const res = await POST(req({ ...validLead, website: "bot" }));
    expect(res.status).toBe(200);
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("returns 503 when email is not configured", async () => {
    vi.mocked(sendLeadNotification).mockResolvedValue({ ok: false, reason: "unconfigured" });
    const res = await POST(req(validLead));
    expect(res.status).toBe(503);
  });

  it("does not acknowledge a request when delivery fails", async () => {
    vi.mocked(sendLeadNotification).mockResolvedValue({ ok: false, reason: "delivery_failed" });
    const res = await POST(req(validLead));
    expect(res.status).toBe(502);
    expect((await res.json()).success).not.toBe(true);
  });

  it("acknowledges only after the email provider accepts it", async () => {
    vi.mocked(sendLeadNotification).mockResolvedValue({ ok: true });
    const res = await POST(req(validLead));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(sendLeadNotification).toHaveBeenCalledWith(expect.objectContaining(validLead));
  });
});
