import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";

describe("next.config redirects (#41)", () => {
  it("sends both heat-light URLs to infrared-heat in one hop, before the generic Vietnamese rule", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const sources = redirects.map((r) => r.source);
    for (const source of ["/treatments/heat-light", "/phuong-phap/heat-light"]) {
      const rule = redirects.find((r) => r.source === source);
      expect(rule).toMatchObject({ destination: "/treatments/infrared-heat", permanent: true });
    }
    expect(sources.indexOf("/phuong-phap/heat-light")).toBeLessThan(
      sources.indexOf("/phuong-phap/:slug"),
    );
  });
});
