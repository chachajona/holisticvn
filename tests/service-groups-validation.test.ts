import { describe, expect, it } from "vitest";
import { validateServiceGroups } from "@/sanity/serviceGroups";

const item = (group: string | undefined, _key = group ?? "empty") => ({ _key, group });

describe("validateServiceGroups", () => {
  it("accepts the four groups in any order", () => {
    expect(
      validateServiceGroups([item("recovery"), item("manual"), item("training"), item("electro")]),
    ).toBe(true);
  });

  it("flags the second item of a duplicated group by _key", () => {
    const result = validateServiceGroups([
      item("manual", "a"),
      item("manual", "b"),
      item("electro"),
      item("training"),
      item("recovery"),
    ]);
    expect(result).toEqual([{ message: 'Nhóm "manual" bị trùng.', path: [{ _key: "b" }] }]);
  });

  it("reports every missing group", () => {
    expect(validateServiceGroups([item("manual")])).toEqual([
      { message: 'Thiếu nhóm "electro".' },
      { message: 'Thiếu nhóm "training".' },
      { message: 'Thiếu nhóm "recovery".' },
    ]);
  });

  it("rejects an unknown or empty group on that item", () => {
    const result = validateServiceGroups([
      item("nonsense", "u"),
      item(undefined, "e"),
      item("manual"),
      item("electro"),
      item("training"),
      item("recovery"),
    ]);
    expect(result).toEqual([
      { message: "Chọn một nhóm hợp lệ.", path: [{ _key: "u" }] },
      { message: "Chọn một nhóm hợp lệ.", path: [{ _key: "e" }] },
    ]);
  });

  it("treats a missing array as all groups missing", () => {
    expect(validateServiceGroups(undefined)).toHaveLength(4);
  });
});
