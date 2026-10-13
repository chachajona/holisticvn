import { describe, expect, it } from "vitest";
import config from "@/sanity.config";

const document = config.document as {
  newDocumentOptions: (prev: Array<{ templateId: string }>, ctx: object) => unknown[];
  actions: (prev: Array<{ action: string }>, ctx: { schemaType: string }) => unknown[];
};

describe.each(["servicesPage", "methodsPage"])("studio singleton %s", (singleton) => {
  it("is hidden from the global create menu", () => {
    const prev = [{ templateId: singleton }, { templateId: "post" }];
    expect(document.newDocumentOptions(prev, { creationContext: { type: "global" } })).toEqual([
      { templateId: "post" },
    ]);
  });

  it("keeps only publish, discard and restore", () => {
    const all = ["publish", "unpublish", "delete", "duplicate", "discardChanges", "restore"].map(
      (action) => ({ action }),
    );
    expect(document.actions(all, { schemaType: singleton })).toEqual([
      { action: "publish" },
      { action: "discardChanges" },
      { action: "restore" },
    ]);
  });
});
