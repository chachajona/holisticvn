import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({ createServiceSupabaseClient: vi.fn() }));

import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { POST } from "@/app/api/newsletter/route";

function req(body: unknown) {
  return new Request("http://localhost/api/newsletter", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/newsletter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects an invalid email", async () => {
    const res = await POST(req({ email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("silently accepts honeypot without hitting supabase", async () => {
    const res = await POST(req({ email: "hello@holisticvn.vn", website: "bot" }));
    expect(res.status).toBe(200);
    expect(createServiceSupabaseClient).not.toHaveBeenCalled();
  });

  it("returns 503 when supabase not configured", async () => {
    vi.mocked(createServiceSupabaseClient).mockReturnValue(null);
    const res = await POST(req({ email: "hello@holisticvn.vn" }));
    expect(res.status).toBe(503);
  });

  it("upserts subscriber by email", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ upsert });
    vi.mocked(createServiceSupabaseClient).mockReturnValue({ from } as never);
    const res = await POST(req({ email: "hello@holisticvn.vn" }));
    expect(res.status).toBe(201);
    expect(upsert).toHaveBeenCalledWith(
      { email: "hello@holisticvn.vn", status: "subscribed" },
      { onConflict: "email" },
    );
  });
});
