import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ getDashboardUser: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabaseClient: vi.fn() }));

import { getDashboardUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GET, PATCH } from "@/app/api/dashboard/leads/route";

const admin = {
  id: "admin-1",
  email: "admin@holisticvn.com",
  fullName: "Admin",
  role: "admin" as const,
};
const staff = {
  id: "staff-1",
  email: "staff@holisticvn.com",
  fullName: "Staff",
  role: "staff" as const,
};

function chainable(result: { data: unknown; error: unknown }) {
  const query: Record<string, unknown> = {};
  ["select", "order", "limit", "eq", "or"].forEach((method) => {
    query[method] = vi.fn().mockReturnValue(query);
  });
  query.then = (resolve: (value: typeof result) => unknown) => resolve(result);
  return query;
}

function getReq(url = "http://localhost/api/dashboard/leads") {
  return new Request(url);
}
function patchReq(body: unknown) {
  return new Request("http://localhost/api/dashboard/leads", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

describe("GET /api/dashboard/leads", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    vi.mocked(getDashboardUser).mockResolvedValue(null);
    vi.mocked(createServerSupabaseClient).mockResolvedValue(null);
    const res = await GET(getReq());
    expect(res.status).toBe(401);
  });

  it("returns leads and role for an authenticated user", async () => {
    vi.mocked(getDashboardUser).mockResolvedValue(admin);
    const from = vi.fn().mockReturnValue(chainable({ data: [{ id: "lead-1" }], error: null }));
    vi.mocked(createServerSupabaseClient).mockResolvedValue({ from } as never);
    const res = await GET(getReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("admin");
    expect(body.leads).toEqual([{ id: "lead-1" }]);
  });
});

describe("PATCH /api/dashboard/leads", () => {
  beforeEach(() => vi.clearAllMocks());

  const staffUuid = "11111111-1111-4111-8111-111111111111";

  it("rejects a staff member trying to reassign a lead", async () => {
    vi.mocked(getDashboardUser).mockResolvedValue(staff);
    vi.mocked(createServerSupabaseClient).mockResolvedValue({} as never);
    const res = await PATCH(patchReq({ id: "lead-1", assignedTo: staffUuid }));
    expect(res.status).toBe(403);
  });

  it("lets an admin reassign a lead", async () => {
    vi.mocked(getDashboardUser).mockResolvedValue(admin);
    const update = vi.fn().mockReturnValue(chainable({ data: null, error: null }));
    const from = vi.fn().mockReturnValue({ update: vi.fn().mockReturnValue({ eq: update }) });
    vi.mocked(createServerSupabaseClient).mockResolvedValue({ from } as never);
    const res = await PATCH(patchReq({ id: "lead-1", assignedTo: staffUuid }));
    expect(res.status).toBe(200);
    expect(from).toHaveBeenCalledWith("leads");
  });
});
