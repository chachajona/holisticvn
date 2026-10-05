import { afterEach, describe, expect, it, vi } from "vitest";
import { checkLeadRateLimit } from "@/lib/rate-limit";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("shared email rate limiter", () => {
  it("requires shared storage in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    expect(await checkLeadRateLimit("0901234567")).toBe("unavailable");
  });
  it("normalizes phone variants and checks the global quota atomically", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: 1 })));
    vi.stubGlobal("fetch", fetch);
    await checkLeadRateLimit("+84 901 234 567");
    fetch.mockResolvedValue(new Response(JSON.stringify({ result: 0 })));
    expect(await checkLeadRateLimit("0901234567")).toBe("limited");
    const first = JSON.parse(fetch.mock.calls[0][1].body);
    const second = JSON.parse(fetch.mock.calls[1][1].body);
    expect(first[0]).toBe("EVAL");
    expect(first[3]).toBe(second[3]);
    expect(first[4]).toBe("holisticvn:leads:total");
    expect(first.join(" ")).not.toContain("0901234567");
  });
  it("does not send when Redis errors", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Redis unavailable")));
    expect(await checkLeadRateLimit("0901234567")).toBe("unavailable");
  });
});
