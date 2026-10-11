import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/instagram/sync/route";
import { syncInstagramFeed } from "@/lib/instagram";
import { revalidatePath } from "next/cache";

vi.mock("@/lib/instagram", () => ({ syncInstagramFeed: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetAllMocks();
});

describe("Instagram scheduled sync", () => {
  it("rejects missing or incorrect credentials before contacting Meta", async () => {
    vi.stubEnv("CRON_SECRET", "scheduler-secret");
    for (const token of ["", "Bearer wrong", "Bearer scheduler-secrex"]) {
      const response = await GET(
        new Request("https://holisticvn.com/api/instagram/sync", {
          headers: { authorization: token },
        }),
      );
      expect(response.status).toBe(401);
    }
    expect(syncInstagramFeed).not.toHaveBeenCalled();
  });

  it("requires a configured secret", async () => {
    vi.stubEnv("CRON_SECRET", "");
    const response = await GET(
      new Request("https://holisticvn.com/api/instagram/sync", {
        headers: { authorization: "Bearer " },
      }),
    );
    expect(response.status).toBe(401);
    expect(syncInstagramFeed).not.toHaveBeenCalled();
  });

  it("invalidates the homepage after successful sync and exposes no connection details", async () => {
    vi.stubEnv("CRON_SECRET", "scheduler-secret");
    vi.mocked(syncInstagramFeed).mockResolvedValue(true);
    const response = await GET(
      new Request("https://holisticvn.com/api/instagram/sync", {
        headers: { authorization: "Bearer scheduler-secret" },
      }),
    );
    expect(await response.json()).toEqual({ synced: true });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("returns a generic failure without exposing provider errors", async () => {
    vi.stubEnv("CRON_SECRET", "scheduler-secret");
    vi.mocked(syncInstagramFeed).mockRejectedValue(new Error("private-token-in-provider-error"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const response = await GET(
      new Request("https://holisticvn.com/api/instagram/sync", {
        headers: { authorization: "Bearer scheduler-secret" },
      }),
    );
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private-token");
    expect(warn.mock.calls.flat().join(" ")).not.toContain("private-token");
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
