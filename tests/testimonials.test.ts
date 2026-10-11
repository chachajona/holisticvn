import { describe, expect, it } from "vitest";
import { testimonials } from "@/lib/content";

describe("homepage testimonials", () => {
  it("only highlights text that appears verbatim in its testimonial", () => {
    for (const { quote, highlight } of testimonials) {
      if (highlight) expect(quote).toContain(highlight);
    }
  });

  it("keeps a unique context per card, used as the React key", () => {
    const contexts = testimonials.map((item) => item.context);
    expect(new Set(contexts).size).toBe(contexts.length);
  });
});
