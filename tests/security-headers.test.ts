import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function csp(environment: string) {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("VERCEL_ENV", environment);
  const { default: config } = await import("../next.config");
  const rules = await config.headers!();
  return rules.find((rule) => rule.source === "/((?!studio(?:/|$)).*)")!.headers[0].value;
}

describe("preview toolbar CSP", () => {
  it("allows the documented toolbar sources only on preview deployments", async () => {
    const policy = await csp("preview");
    expect(policy).toContain("https://vercel.live");
    expect(policy).toContain("https://assets.vercel.com");
    expect(policy).toContain("wss://ws-us3.pusher.com");
    expect(policy).toContain("frame-src 'self' https://vercel.live");
    expect(policy).not.toContain("'unsafe-eval'");
  });

  it.each(["production", "development"])("keeps toolbar origins out of %s CSP", async (env) => {
    const policy = await csp(env);
    expect(policy).not.toContain("vercel");
    expect(policy).not.toContain("pusher");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-ancestors 'self'");
  });
});
