import { methodGroups, serviceGroups } from "@/lib/content";

type Item = { _key?: string; group?: string };
type Failure = { message: string; path?: [{ _key: string }] };

// Studio-only guard: exactly one item per allowed group. Content written through the API skips it, so the
// frontend getters still dedupe. Curried because Studio passes a context object as the validator's second
// argument; a second `allowed` parameter would be overwritten by it.
export const validateGroupSet =
  (allowed: readonly string[]) =>
  (items: Item[] | undefined): true | Failure[] => {
    const failures: Failure[] = [];
    const seen = new Set<string>();
    for (const item of items ?? []) {
      const path = item._key ? ([{ _key: item._key }] as [{ _key: string }]) : undefined;
      if (!item.group || !allowed.includes(item.group)) {
        failures.push({ message: "Chọn một nhóm hợp lệ.", path });
      } else if (seen.has(item.group)) {
        failures.push({ message: `Nhóm "${item.group}" bị trùng.`, path });
      } else {
        seen.add(item.group);
      }
    }
    for (const group of allowed) {
      if (!seen.has(group)) failures.push({ message: `Thiếu nhóm "${group}".` });
    }
    return failures.length ? failures : true;
  };

export const validateServiceGroups = validateGroupSet(serviceGroups);
export const validateMethodGroups = validateGroupSet(methodGroups);
