import type { Treatment } from "@/lib/content";
import reviewedSeo from "@/lib/treatment-seo.json";

const defaults = new Map(Object.entries(reviewedSeo));
const nonblank = (value?: string) => value?.trim() || undefined;

export function resolveTreatmentSeo(treatment: Treatment) {
  const reviewed = defaults.get(treatment.slug);
  return {
    title: nonblank(treatment.seo?.title) ?? reviewed?.title ?? treatment.title,
    description:
      nonblank(treatment.seo?.description) ??
      reviewed?.description ??
      nonblank(treatment.shortDescription) ??
      nonblank(treatment.description) ??
      "",
    image: nonblank(treatment.seo?.ogImage) ?? treatment.image,
  };
}
