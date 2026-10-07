import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/rate-limit", () => ({ checkLeadRateLimit: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendLeadNotification: vi.fn() }));

import { checkLeadRateLimit } from "@/lib/rate-limit";
import { sendLeadNotification } from "@/lib/email";
import { POST } from "@/app/api/leads/route";

function req(body: unknown) {
  return new Request("http://localhost/api/leads", { method: "POST", body: JSON.stringify(body) });
}

const validLead = {
  kind: "booking",
  name: "Nguyễn An",
  phone: "0901234567",
  source: "/booking",
};

describe("POST /api/leads", () => {
  afterEach(() => vi.restoreAllMocks());
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkLeadRateLimit).mockResolvedValue("allowed");
    vi.mocked(sendLeadNotification).mockResolvedValue({ ok: false, reason: "unconfigured" });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

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
  it("blocks email when the shared rate limit is exceeded", async () => {
    vi.mocked(checkLeadRateLimit).mockResolvedValue("limited");
    const response = await POST(req(validLead));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });
  it("fails closed if the production limiter is unavailable", async () => {
    vi.mocked(checkLeadRateLimit).mockResolvedValue("unavailable");
    expect((await POST(req(validLead))).status).toBe(503);
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });
});
