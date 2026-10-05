import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("scripts/migrate-legacy.mjs", () => {
  it("transforms legacy exports without writing to any live database", () => {
    const dir = mkdtempSync(join(tmpdir(), "migrate-legacy-"));
    const contactsPath = join(dir, "contacts.json");
    const sanityPath = join(dir, "sanity.ndjson");
    const outputDir = join(dir, "out");

    writeFileSync(
      contactsPath,
      JSON.stringify([
        { id: 1, contact_type: "contact", name: "Nguyễn An", phone: "0901234567", status: "new" },
        {
          id: 2,
          contact_type: "booking",
          name: "Trần Bình",
          phone: "0912345678",
          status: "unknown-status",
        },
        { id: 3, contact_type: "newsletter", email: "Old@Holisticvn.vn" },
      ]),
    );
    writeFileSync(
      sanityPath,
      [
        JSON.stringify({ _id: "svc-1", _type: "service", title: "Old service" }),
        JSON.stringify({ _id: "usr-1", _type: "user", title: "Not migrated" }),
      ].join("\n"),
    );

    const output = execFileSync(
      "node",
      ["scripts/migrate-legacy.mjs", contactsPath, sanityPath, outputDir],
      { encoding: "utf8" },
    );
    expect(output).toContain("Prepared 2 leads, 1 subscribers and 1 Sanity documents");

    const report = JSON.parse(readFileSync(join(outputDir, "report.json"), "utf8"));
    expect(report.counts).toEqual({
      legacy_contacts: 3,
      leads: 2,
      subscribers: 1,
      sanity_documents: 1,
    });

    const leads = JSON.parse(readFileSync(join(outputDir, "leads.json"), "utf8"));
    expect(leads[1].status).toBe("new");

    const subscribers = JSON.parse(
      readFileSync(join(outputDir, "newsletter-subscribers.json"), "utf8"),
    );
    expect(subscribers[0].email).toBe("old@holisticvn.vn");
  });
});
