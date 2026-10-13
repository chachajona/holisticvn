export const methodTags = [
  { id: "neck-pain", label: "Đau mỏi cổ vai gáy", category: "condition" },
  { id: "back-pain", label: "Đau lưng", category: "condition" },
  { id: "hip-pain", label: "Đau vùng hông/chậu", category: "condition" },
  { id: "muscle-stiffness", label: "Căng cứng cơ", category: "condition" },
  { id: "limited-movement", label: "Khó cử động", category: "condition" },
  { id: "pain-relief", label: "Giảm đau mỏi", category: "goal" },
  { id: "injury-rehab", label: "Phục hồi sau chấn thương", category: "goal" },
  { id: "post-workout-recovery", label: "Hồi phục sau tập luyện", category: "goal" },
  { id: "strength", label: "Tăng sức mạnh", category: "goal" },
  { id: "movement-control", label: "Kiểm soát chuyển động tốt hơn", category: "goal" },
] as const;

export type MethodTagId = (typeof methodTags)[number]["id"];

// Exact approved labels only: legacy diagnoses are never inferred to be symptoms.
export function normalizeMethodTags(values: readonly string[]): MethodTagId[] {
  return [
    ...new Set(
      values.flatMap((value) => {
        const tag = methodTags.find((tag) => tag.id === value.trim() || tag.label === value.trim());
        return tag ? [tag.id] : [];
      }),
    ),
  ];
}

export function matchesMethodTags(tags: readonly MethodTagId[], selected: readonly MethodTagId[]) {
  return selected.length === 0 || tags.some((tag) => selected.includes(tag));
}

export function methodTagLabel(id: MethodTagId) {
  return methodTags.find((tag) => tag.id === id)!.label;
}
