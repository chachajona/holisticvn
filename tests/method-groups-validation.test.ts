import { describe, expect, it } from "vitest";
import { validateMethodGroups, validateServiceGroups } from "@/sanity/serviceGroups";

const item = (group: string | undefined, _key = group ?? "empty") => ({ _key, group });
const five = ["manual", "electro", "rehab", "cold", "infrared"];

describe("validateMethodGroups", () => {
  it("accepts the five groups in any order", () => {
    expect(validateMethodGroups([...five].reverse().map((g) => item(g)))).toBe(true);
  });

  it("flags the second item of a duplicated group by _key", () => {
    const result = validateMethodGroups([
      item("manual", "a"),
      item("manual", "b"),
      ...five.slice(1).map((g) => item(g)),
    ]);
    expect(result).toEqual([{ message: 'Nhóm "manual" bị trùng.', path: [{ _key: "b" }] }]);
  });

  it("reports every missing group", () => {
    expect(validateMethodGroups([item("manual")])).toEqual([
      { message: 'Thiếu nhóm "electro".' },
      { message: 'Thiếu nhóm "rehab".' },
      { message: 'Thiếu nhóm "cold".' },
      { message: 'Thiếu nhóm "infrared".' },
    ]);
  });

  it("rejects a service group on a method list and treats undefined as all missing", () => {
    expect(validateMethodGroups([item("therapy", "t"), ...five.map((g) => item(g))])).toEqual([
      { message: "Chọn một nhóm hợp lệ.", path: [{ _key: "t" }] },
    ]);
    expect(validateMethodGroups(undefined)).toHaveLength(5);
  });

  it("keeps the service validator unchanged", () => {
    expect(validateServiceGroups([item("therapy"), item("training"), item("recovery")])).toBe(true);
    expect(validateServiceGroups([item("manual")])).toHaveLength(4);
  });
});
