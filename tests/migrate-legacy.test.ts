import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("scripts/migrate-legacy.mjs", () => {
  it("prepares only website content while preserving document references", () => {
    const dir = mkdtempSync(join(tmpdir(), "migrate-legacy-"));
    try {
      const sanityPath = join(dir, "sanity.ndjson");
      const outputDir = join(dir, "out");
      writeFileSync(
        sanityPath,
        [
          JSON.stringify({
            _id: "svc-1",
            _type: "service",
            title: "Old service",
            treatments: [{ _type: "reference", _ref: "treatment-1" }],
          }),
          JSON.stringify({ _id: "treatment-1", _type: "treatment", title: "Treatment" }),
          JSON.stringify({ _id: "usr-1", _type: "user", title: "Not migrated" }),
        ].join("\n"),
      );
      const output = execFileSync("node", ["scripts/migrate-legacy.mjs", sanityPath, outputDir], {
        encoding: "utf8",
      });
      expect(output).toContain("Prepared 2 Sanity documents");
      const report = JSON.parse(readFileSync(join(outputDir, "report.json"), "utf8"));
      expect(report.counts).toEqual({ sanity_documents: 2 });
      expect(readdirSync(outputDir).sort()).toEqual(["report.json", "sanity.ndjson"]);
      const documents = readFileSync(join(outputDir, "sanity.ndjson"), "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      expect(documents[0]._id).toBe("svc-1");
      expect(documents[0].treatments[0]._ref).toBe(documents[1]._id);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
