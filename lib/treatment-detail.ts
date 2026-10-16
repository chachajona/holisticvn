import { methodStages, type Method, type MethodStageId, type Treatment } from "@/lib/content";
import { methodTagLabel, methodTags } from "@/lib/method-tags";

export type RelatedTreatment = { slug: string; title: string; price?: number };
export type TreatmentDetail = {
  groups: Array<{ group: Method["group"]; title: string }>;
  stages: MethodStageId[];
  conditions: string[];
  related: RelatedTreatment[];
};

const MAX_RELATED = 6;
const closing =
  "Mỗi người một khác: chuyên viên sẽ đánh giá tình trạng của bạn trước khi chọn kỹ thuật phù hợp.";

// Everything the page reads from the methods: groups, pathway stages, condition labels, siblings.
export function buildTreatmentDetail(
  treatment: Treatment,
  treatments: Treatment[],
  methods: Method[],
): TreatmentDetail {
  const own = methods.filter((method) => method.treatments.some((t) => t.slug === treatment.slug));
  const stages = methodStages
    .filter((stage) =>
      own.some((method) => (stage.groups as readonly string[]).includes(method.group)),
    )
    .map((stage) => stage.id);
  const conditions = [
    ...new Set(
      own
        .flatMap((method) => method.filterTags)
        .filter((id) => methodTags.find((tag) => tag.id === id)?.category === "condition"),
    ),
  ].map(methodTagLabel);

  const documents = new Map(treatments.map((item) => [item.slug, item]));
  const seen = new Set([treatment.slug]);
  const related: RelatedTreatment[] = [];
  for (const method of own) {
    for (const link of method.treatments) {
      if (seen.has(link.slug)) continue;
      seen.add(link.slug);
      const document = documents.get(link.slug);
      if (!document) continue;
      related.push({
        slug: document.slug,
        title: document.title,
        price: document.price && document.price > 0 ? document.price : undefined,
      });
    }
  }
  return {
    groups: own.map(({ group, title }) => ({ group, title })),
    stages,
    conditions,
    related: related.slice(0, MAX_RELATED),
  };
}

// Footnote under the "Khi bạn gặp" and "Hướng tới" rows (spec 4.5).
export function audienceNote(groupNames: string[], hasConditions: boolean) {
  if (!hasConditions || !groupNames.length) return closing;
  const source =
    groupNames.length === 1
      ? `nhóm ${groupNames[0]}`
      : `các nhóm ${groupNames.slice(0, -1).join(", ")} và ${groupNames.at(-1)}`;
  return `Nhãn "Khi bạn gặp" theo ${source}. ${closing}`;
}
