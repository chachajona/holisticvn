import { createClient } from "@sanity/client";
import { cache } from "react";
import { z } from "zod";
import { normalizeMethodTags } from "@/lib/method-tags";
import {
  methodFallbackImage,
  methodGroups,
  methods as fallbackMethods,
  posts as fallbackPosts,
  serviceFallbackImage,
  serviceGroups,
  services as fallbackServices,
  testimonials as fallbackTestimonials,
  treatments as fallbackTreatments,
  site as fallbackSite,
  branches as fallbackBranches,
  type Method,
  type Post,
  type Service,
  type Testimonial,
  type Treatment,
} from "@/lib/content";
import { apiVersion, dataset, projectId } from "@/sanity/env";

const enabled = projectId !== "missing-project-id";
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});
const text = z.string().catch("");
const strings = z.array(z.string()).catch([]);
const record = { slug: z.string().min(1), title: z.string().min(1) };
const cdnImage = z.string().regex(/^https:\/\/cdn\.sanity\.io\//);
// A deleted or unpublished reference resolves to null; drop it so no link points nowhere.
const treatmentLinks = z
  .array(z.object(record).nullable().catch(null))
  .catch([])
  .transform((items) => items.filter((item) => item !== null));
const serviceSchema = z
  .object({
    title: z.string().min(1),
    group: z.enum(serviceGroups),
    shortTitle: text,
    summary: text,
    body: text,
    bullets: strings,
    image: cdnImage.optional().catch(undefined),
    imageAlt: text,
    treatments: treatmentLinks,
  })
  .transform((service) => ({
    ...service,
    shortTitle: service.shortTitle || service.title,
    image: service.image ?? serviceFallbackImage[service.group],
    imageAlt: service.imageAlt || service.title,
  }));
const methodSchema = z
  .object({
    group: z.enum(methodGroups),
    title: z.string().min(1),
    indexSubtitle: text,
    body: z.string().min(1),
    tags: strings.transform((tags) => [...new Set(tags.map((t) => t.trim()).filter(Boolean))]),
    filterTags: z.array(z.string().catch("")).nullish().catch([]),
    image: cdnImage.optional().catch(undefined),
    imageAlt: text,
    treatments: treatmentLinks,
  })
  .transform((method) => ({
    ...method,
    filterTags: normalizeMethodTags(method.filterTags ?? method.tags),
    image: method.image ?? methodFallbackImage[method.group],
    imageAlt: method.image
      ? method.imageAlt || method.title
      : fallbackMethods.find((fallback) => fallback.group === method.group)!.imageAlt,
    treatments: method.treatments.filter(
      (treatment, i, links) => links.findIndex((link) => link.slug === treatment.slug) === i,
    ),
  }));
const optionalText = z.string().trim().min(1).optional().catch(undefined);
const protocolStepSchema = z.object({
  step: z.number(),
  title: z.string().trim().min(1),
  description: text,
});
const faqSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});
const treatmentSchema = z
  .object({
    ...record,
    englishTitle: optionalText,
    requiresCertifiedPractitioner: z.boolean().catch(false),
    shortDescription: text,
    description: text,
    duration: text,
    image: cdnImage.optional().catch(undefined),
    imageAlt: optionalText,
    benefits: strings,
    price: z.number().int().nonnegative().optional().catch(undefined),
    isPopular: z.boolean().catch(false),
    badge: z.enum(["popular", "new"]).optional().catch(undefined),
    // One malformed entry is dropped, not the whole list.
    faqs: z
      .array(z.unknown())
      .catch([])
      .transform((items) =>
        items.flatMap((item) => {
          const parsed = faqSchema.safeParse(item);
          return parsed.success ? [parsed.data] : [];
        }),
      ),
    // One malformed step is dropped, not the whole list; steps follow their CMS number.
    protocols: z
      .array(z.unknown())
      .catch([])
      .transform((items) =>
        items
          .flatMap((item) => {
            const parsed = protocolStepSchema.safeParse(item);
            return parsed.success ? [parsed.data] : [];
          })
          .sort((a, b) => a.step - b.step),
      ),
    seo: z
      .object({
        title: optionalText,
        description: optionalText,
        ogImage: cdnImage.optional().catch(undefined),
      })
      .nullish()
      .catch(undefined)
      .transform((seo) => seo ?? undefined),
  })
  .transform((treatment) => ({
    ...treatment,
    // The legacy isPopular flag reads as the "popular" badge until editors pick one.
    badge: treatment.badge ?? (treatment.isPopular ? ("popular" as const) : undefined),
  }));
const postSchema = z.object({
  ...record,
  excerpt: text,
  publishedAt: z
    .string()
    .refine((value) => Number.isFinite(Date.parse(value)))
    .nullable()
    .catch(null),
  category: text,
  body: text.transform((value) => value.split("\n\n").filter(Boolean)),
});
const testimonialSchema = z.object({
  quote: z.string().min(1),
  context: text,
  rating: z.number().int().min(1).max(5).optional().catch(undefined),
  avatar: z.string().optional().catch(undefined),
});

async function fetchRecords<T>(query: string, schema: z.ZodType<T>): Promise<T[]> {
  // A configured dataset (including an empty one) is authoritative; samples are local-only.
  const value: unknown = await client.fetch(
    query,
    {},
    { next: { revalidate: 3600, tags: ["sanity"] } },
  );
  // A singleton query returns null until the document is first published: no records, not an outage.
  if (value === null) return [];
  if (!Array.isArray(value)) throw new Error("Invalid Sanity response");
  return value.flatMap((item) => {
    const parsed = schema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}
export const getServices = cache(async (): Promise<Service[]> => {
  if (!enabled) return fallbackServices;
  // groups[] order is the editor's drag-and-drop order; defined(group) skips half-filled items.
  const services = await fetchRecords(
    `*[_id == "servicesPage"][0].groups[defined(group)]{group,title,shortTitle,summary,body,bullets,"image":image.asset->url,"imageAlt":image.alt,"treatments":treatments[]->{"slug":slug.current,title}}`,
    serviceSchema,
  );
  // One section per group: anchors and booking context are keyed by group.
  return services.filter((s, i) => services.findIndex((o) => o.group === s.group) === i);
});
export const getMethods = cache(async (): Promise<Method[]> => {
  if (!enabled) return fallbackMethods;
  const cms = await fetchRecords(
    `*[_id == "methodsPage"][0].groups[defined(group)]{group,title,indexSubtitle,body,tags,filterTags,"image":image.asset->url,"imageAlt":image.alt,"treatments":treatments[]->{"slug":slug.current,title}}`,
    methodSchema,
  );
  // Five fixed groups in canonical order: a missing or invalid group takes the bundled copy so footer
  // anchors never dangle. Bundled treatment links are dropped: some slugs have no CMS document.
  return methodGroups.map(
    (group) =>
      cms.find((method) => method.group === group) ?? {
        ...fallbackMethods.find((method) => method.group === group)!,
        treatments: [],
      },
  );
});
export const getTreatments = cache(async (): Promise<Treatment[]> => {
  if (!enabled) return fallbackTreatments;
  return fetchRecords(
    `*[_type == "treatment"] | order(title asc){"slug":slug.current,title,englishTitle,requiresCertifiedPractitioner,shortDescription,description,duration,price,isPopular,badge,"faqs":faqs[]{question,answer},"image":image.asset->url,"imageAlt":image.alt,benefits,protocols,"seo":seo{title,description,"ogImage":ogImage.asset->url}}`,
    treatmentSchema,
  ).then((records) =>
    // A treatment without a CMS photo uses the bundled one until an editor uploads its own.
    records.map((record) => {
      if (record.image) return record;
      const bundled = fallbackTreatments.find((item) => item.slug === record.slug);
      return bundled?.image
        ? { ...record, image: bundled.image, imageAlt: bundled.imageAlt }
        : record;
    }),
  );
});
export const getPosts = cache(async (): Promise<Post[]> => {
  if (!enabled) return fallbackPosts;
  return fetchRecords(
    `*[_type == "post"] | order(publishedAt desc){"slug":slug.current,title,excerpt,publishedAt,category,body}`,
    postSchema,
  );
});
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  if (!enabled) return fallbackTestimonials;
  return fetchRecords(
    `*[_type == "testimonial"]{quote,context,rating,"avatar":avatar.asset->url}`,
    testimonialSchema,
  );
});
export async function getFaqs() {
  if (!enabled) return [];
  return client.fetch(`*[_type == "faq"] | order(order asc){question,answer}`);
}
const settingsSchema = z.object({
  contactPhone: text,
  contactEmail: z.email().catch(""),
  locations: z
    .array(z.object({ name: z.string(), address: z.string(), isPrimary: z.boolean().catch(false) }))
    .catch([]),
  socialMedia: z
    .object({
      facebook: z
        .string()
        .url()
        .regex(/^https:\/\/(www\.)?facebook\.com\//)
        .catch(""),
      instagram: z
        .string()
        .url()
        .regex(/^https:\/\/(www\.)?instagram\.com\//)
        .catch(""),
      zalo: z.string().regex(/^\d+$/).catch(""),
    })
    .catch({ facebook: "", instagram: "", zalo: "" }),
});
export const getSiteSettings = cache(async () => {
  if (!enabled) return null;
  const value = await client.fetch(
    `*[_type == "siteSettings"][0]{contactPhone,contactEmail,locations,socialMedia}`,
    {},
    { next: { revalidate: 3600, tags: ["sanity"] } },
  );
  return value ? settingsSchema.parse(value) : null;
});
export type PublicSiteData = { site: typeof fallbackSite; branches: typeof fallbackBranches };
export const getPublicSiteData = cache(async (): Promise<PublicSiteData> => {
  const settings = await getSiteSettings();
  if (!settings) return { site: fallbackSite, branches: fallbackBranches };
  // Owner confirmed one clinic on 2026-10-07; stale CMS locations must not restore closed sites.
  const branches = fallbackBranches;
  return {
    branches,
    site: {
      ...fallbackSite,
      phone: settings.contactPhone || fallbackSite.phone,
      email: settings.contactEmail || fallbackSite.email,
      address: branches[0]?.address || fallbackSite.address,
      facebookUrl: settings.socialMedia.facebook || fallbackSite.facebookUrl,
      instagramUrl: settings.socialMedia.instagram || fallbackSite.instagramUrl,
      zaloId: settings.socialMedia.zalo || fallbackSite.zaloId,
    },
  };
});
