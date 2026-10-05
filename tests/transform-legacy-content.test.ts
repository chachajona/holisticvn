import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
describe("remote content patch guard", () => {
  it("does not read or mutate an implicit env target", () => {
    expect(() =>
      execFileSync("node", ["scripts/transform-legacy-content.mjs"], { stdio: "pipe" }),
    ).toThrow(/Explicit --project and --dataset/);
  });
  it("requires an exact target confirmation before applying", () => {
    expect(() =>
      execFileSync(
        "node",
        [
          "scripts/transform-legacy-content.mjs",
          "--project",
          "example",
          "--dataset",
          "production",
          "--apply",
          "--confirm",
          "example/staging",
        ],
        { stdio: "pipe" },
      ),
    ).toThrow(/Applying requires --confirm example\/production/);
  });
});
