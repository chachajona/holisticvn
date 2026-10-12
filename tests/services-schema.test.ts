import { Schema } from "@sanity/schema";
import { builtinTypes } from "@sanity/schema/_internal";
import { validateDocument } from "@sanity/validation";
import { describe, expect, it } from "vitest";
import { serviceGroups } from "@/lib/content";
import { leadSchema } from "@/lib/validation";
import { schemaTypes } from "@/sanity/schemaTypes";

const schema = Schema.compile({ name: "test", types: [...schemaTypes, ...builtinTypes] });
// Studio merges its built-in types (sanity.imageHotspot, ...) into the schema; do the same here.
const client = { withConfig: () => client, fetch: async () => 0 };
// validateDocument is @beta: keep this the only place that calls it.
const check = async (document: object) => {
  const result = await validateDocument({
    document,
    schema,
    client,
    getDocumentExists: async () => true,
  } as never);
  return { status: result.status, messages: result.markers.map((m) => m.message) };
};
const group = (name: string, extra: object = {}) => ({
  _key: name,
  _type: "serviceGroup",
  group: name,
  title: `Tên ${name}`,
  summary: "Tóm tắt",
  body: "Nội dung",
  ...extra,
});
const page = (groups?: object[]) => ({ _id: "servicesPage", _type: "servicesPage", groups });
const three = () => serviceGroups.map((name) => group(name));

describe("servicesPage schema", () => {
  const servicesPage = schemaTypes.find((t) => t.name === "servicesPage") as unknown as {
    fields: Array<{
      name: string;
      initialValue?: Array<{ group: string }>;
      options?: { disableActions?: string[] };
    }>;
  };
  const groupsField = servicesPage?.fields.find((f) => f.name === "groups");

  it("has a servicesPage singleton type and no free-form service document", () => {
    const names = schemaTypes.map((t) => t.name);
    expect(names).toContain("servicesPage");
    expect(names).toContain("serviceGroup");
    expect(names).not.toContain("service");
  });

  it("pre-fills the three groups in pathway order and locks add/remove", () => {
    expect(groupsField?.initialValue?.map((g) => g.group)).toEqual([...serviceGroups]);
    expect(groupsField?.options?.disableActions).toEqual(
      expect.arrayContaining(["add", "addBefore", "addAfter", "remove", "duplicate"]),
    );
  });

  it("accepts three complete groups", async () => {
    expect((await check(page(three()))).status).toBe("passed");
  });

  it.each([
    ["Vietnamese title at 120 characters", "ị".repeat(120), true],
    ["Vietnamese title at 121 characters", "ị".repeat(121), false],
    ["emoji title at 120 code points", "😀".repeat(120), true],
    ["emoji title at 121 code points", "😀".repeat(121), false],
    ["120-character title surrounded by whitespace", `  ${"ị".repeat(120)}  `, true],
  ])("matches booking validation for %s", async (_label, title, accepted) => {
    const result = await check(
      page([group("therapy", { title }), group("training"), group("recovery")]),
    );
    expect(result.status).toBe(accepted ? "passed" : "failed");
    if (!accepted) expect(result.messages).toContain("Tên dịch vụ không được dài quá 120 ký tự.");
    expect(
      leadSchema.safeParse({
        kind: "booking",
        name: "Nguyễn An",
        phone: "0901234567",
        source: "/booking",
        treatment: title,
      }).success,
    ).toBe(accepted);
  });

  it("blocks publishing a duplicated group", async () => {
    const duplicated = [
      group("therapy"),
      { ...group("therapy"), _key: "again" },
      group("training"),
    ];
    const { status, messages } = await check(page([...duplicated, group("recovery")]));
    expect(status).toBe("failed");
    expect(messages).toContain('Nhóm "therapy" bị trùng.');
  });

  it("blocks publishing with a missing group or no groups at all", async () => {
    expect((await check(page([group("therapy"), group("training")]))).messages).toContain(
      'Thiếu nhóm "recovery".',
    );
    expect((await check(page(undefined))).status).toBe("failed");
  });

  it("requires title, summary and body for every group", async () => {
    const messages: Record<string, string> = {
      title: "Cần tên dịch vụ.",
      summary: "Cần mô tả ngắn trên thẻ chọn nhóm.",
      body: "Cần nội dung dịch vụ.",
    };
    for (const missing of ["title", "summary", "body"]) {
      const groups = [
        group("therapy", { [missing]: undefined }),
        group("training"),
        group("recovery"),
      ];
      const result = await check(page(groups));
      expect(result.status, missing).toBe("failed");
      expect(result.messages, missing).toContain(messages[missing]);
    }
  });

  it("requires alt text once an image is chosen", async () => {
    const image = {
      _type: "image",
      asset: { _type: "reference", _ref: "image-abc123-100x100-jpg" },
    };
    const groups = [group("therapy", { image }), group("training"), group("recovery")];
    expect((await check(page(groups))).messages).toContain("Cần alt text khi có ảnh.");
  });

  it("rejects the same treatment twice in one group", async () => {
    const ref = (key: string) => ({ _key: key, _type: "reference", _ref: "treatment-cupping" });
    const groups = [
      group("therapy", { treatments: [ref("1"), ref("2")] }),
      group("training"),
      group("recovery"),
    ];
    const result = await check(page(groups));
    expect(result.status).toBe("failed");
    expect(result.messages).toContain("Không chọn cùng một liệu pháp nhiều lần.");
  });
});
