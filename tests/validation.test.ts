import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/validation";

describe("public lead validation", () => {
  it("accepts a valid Vietnamese booking request", () =>
    expect(
      leadSchema.safeParse({
        kind: "booking",
        name: "Nguyễn An",
        phone: "0901 234 567",
        source: "/booking",
      }).success,
    ).toBe(true));
  it("rejects invalid requests", () => {
    expect(leadSchema.safeParse({ kind: "contact", name: "An", phone: "abc" }).success).toBe(false);
  });
  it("lets a filled honeypot field parse so the route can silently swallow the bot", () => {
    const result = leadSchema.safeParse({
      kind: "contact",
      name: "Nguyễn An",
      phone: "0901234567",
      website: "bot",
    });
    expect(result.success).toBe(true);
    expect(result.success && result.data.website).toBe("bot");
  });
});
