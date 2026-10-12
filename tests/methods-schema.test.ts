import { Schema } from "@sanity/schema";
import { builtinTypes } from "@sanity/schema/_internal";
import { validateDocument } from "@sanity/validation";
import { describe, expect, it } from "vitest";
import { methodGroups } from "@/lib/content";
import { schemaTypes } from "@/sanity/schemaTypes";

const schema = Schema.compile({ name: "test", types: [...schemaTypes, ...builtinTypes] });
// Studio merges its built-in types (sanity.imageHotspot, ...) into the schema; do the same here.
const client = { withConfig: () => client, fetch: async () => 0 };
// validateDocument is @beta: keep this the only place in this file that calls it.
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
  _type: "methodGroup",
  group: name,
  title: `Tên ${name}`,
  body: "Nội dung",
  ...extra,
});
const page = (groups?: object[]) => ({ _id: "methodsPage", _type: "methodsPage", groups });
const five = () => methodGroups.map((name) => group(name));
const ref = (key: string) => ({ _key: key, _type: "reference", _ref: "treatment-cupping" });

describe("methodsPage schema", () => {
  const methodsPage = schemaTypes.find((t) => t.name === "methodsPage") as unknown as {
    fields: Array<{
      name: string;
      initialValue?: Array<{ group: string }>;
      options?: { disableActions?: string[]; sortable?: boolean };
    }>;
  };
  const groupsField = methodsPage?.fields.find((f) => f.name === "groups");

  it("has a methodsPage singleton type and a methodGroup object, and leaves treatment alone", () => {
    const names = schemaTypes.map((t) => t.name);
    expect(names).toContain("methodsPage");
    expect(names).toContain("methodGroup");
    const treatment = schemaTypes.find((t) => t.name === "treatment") as unknown as {
      fields: Array<{ name: string }>;
    };
    expect(treatment.fields.map((f) => f.name)).not.toContain("group");
  });

  it("pre-fills the five groups in canonical order and locks add/remove/reorder", () => {
    expect(groupsField?.initialValue?.map((g) => g.group)).toEqual([...methodGroups]);
    expect(groupsField?.options?.disableActions).toEqual(
      expect.arrayContaining(["add", "addBefore", "addAfter", "remove", "duplicate"]),
    );
    expect(groupsField?.options?.sortable).toBe(false);
  });

  it("accepts five complete groups", async () => {
    expect((await check(page(five()))).status).toBe("passed");
  });

  it("blocks a duplicated group, a missing group and no groups at all", async () => {
    const duplicated = [group("manual"), { ...group("manual"), _key: "again" }, ...five().slice(1)];
    const dup = await check(page(duplicated));
    expect(dup.status).toBe("failed");
    expect(dup.messages).toContain('Nhóm "manual" bị trùng.');
    expect((await check(page(five().slice(0, 4)))).messages).toContain('Thiếu nhóm "infrared".');
    expect((await check(page(undefined))).status).toBe("failed");
  });

  it("requires title and body for every group", async () => {
    for (const missing of ["title", "body"]) {
      const groups = [group("manual", { [missing]: undefined }), ...five().slice(1)];
      const result = await check(page(groups));
      expect(result.status, missing).toBe("failed");
    }
  });

  it("requires alt text once an image is chosen", async () => {
    const image = {
      _type: "image",
      asset: { _type: "reference", _ref: "image-abc123-100x100-jpg" },
    };
    const groups = [group("manual", { image }), ...five().slice(1)];
    expect((await check(page(groups))).messages).toContain("Cần alt text khi có ảnh.");
  });

  it("rejects the same treatment twice in one group but allows it in two groups", async () => {
    const twice = await check(
      page([group("manual", { treatments: [ref("1"), ref("2")] }), ...five().slice(1)]),
    );
    expect(twice.status).toBe("failed");
    expect(twice.messages).toContain("Không chọn cùng một liệu pháp nhiều lần.");

    const acrossGroups = await check(
      page([
        group("manual", { treatments: [ref("1")] }),
        group("electro", { treatments: [ref("2")] }),
        ...five().slice(2),
      ]),
    );
    expect(acrossGroups.status).toBe("passed");
  });

  it.each([
    ["more than five tags", ["a", "b", "c", "d", "e", "f"], "Tối đa 5 nhãn."],
    ["a repeated tag", ["Đau", "Đau"], "Không lặp nhãn."],
    ["a blank tag", ["Đau", "   "], "Mỗi nhãn dài 1 đến 40 ký tự."],
    ["a 41-character tag", ["ị".repeat(41)], "Mỗi nhãn dài 1 đến 40 ký tự."],
  ])("rejects %s", async (_label, tags, message) => {
    const result = await check(page([group("manual", { tags }), ...five().slice(1)]));
    expect(result.status).toBe("failed");
    expect(result.messages).toContain(message);
  });

  it("accepts up to five distinct tags", async () => {
    const tags = ["Đau vai gáy", "Đau lưng dưới", "Lệch chậu", "Cứng cổ", "Mỏi cơ"];
    expect((await check(page([group("manual", { tags }), ...five().slice(1)]))).status).toBe(
      "passed",
    );
  });
});
