import { methodStages, type Method, type MethodStageId, type Treatment } from "@/lib/content";

export type RelatedTreatment = Pick<
  Treatment,
  "slug" | "title" | "price" | "image" | "imageAlt"
> & {
  shortDescription?: string;
};
export type TreatmentDetail = {
  groups: Array<{ group: Method["group"]; title: string }>;
  stages: MethodStageId[];
  conditions: string[];
  related: RelatedTreatment[];
};

const MAX_RELATED = 6;

// Methods supply navigation context and siblings, not individual clinical indications.
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
        image: document.image,
        imageAlt: document.imageAlt,
        shortDescription: document.shortDescription,
      });
    }
  }
  return {
    groups: own.map(({ group, title }) => ({ group, title })),
    stages,
    // A group's discovery filters do not establish suitability for every treatment in it.
    conditions: [],
    related: related.slice(0, MAX_RELATED),
  };
}
