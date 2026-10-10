import { createClient } from "@sanity/client";
import { cache } from "react";
import { z } from "zod";
import {
  posts as fallbackPosts,
  services as fallbackServices,
  testimonials as fallbackTestimonials,
  treatments as fallbackTreatments,
  site as fallbackSite,
  branches as fallbackBranches,
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
const serviceSchema = z.object({ ...record, description: text, treatments: strings });
const treatmentSchema = z.object({
  ...record,
  shortDescription: text,
  description: text,
  duration: text,
  image: z
    .string()
    .regex(/^https:\/\/cdn\.sanity\.io\//)
    .catch("/images/Iastm.jpg"),
  benefits: strings,
  price: z.number().nonnegative().optional().catch(undefined),
  isPopular: z.boolean().catch(false),
  protocols: z.array(z.object({ step: z.number(), title: text, description: text })).catch([]),
});
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
  const value: unknown = await client.fetch(query, {}, { next: { revalidate: 3600 } });
  if (!Array.isArray(value)) throw new Error("Invalid Sanity response");
  return value.flatMap((item) => {
    const parsed = schema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}
export const getServices = cache(async (): Promise<Service[]> => {
  if (!enabled) return fallbackServices;
  return fetchRecords(
    `*[_type == "service"] | order(title asc){"slug":slug.current,title,description,"treatments":treatments[]->slug.current}`,
    serviceSchema,
  );
});
export const getTreatments = cache(async (): Promise<Treatment[]> => {
  if (!enabled) return fallbackTreatments;
  return fetchRecords(
    `*[_type == "treatment"] | order(title asc){"slug":slug.current,title,shortDescription,description,duration,price,isPopular,"image":image.asset->url,benefits,protocols}`,
    treatmentSchema,
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
    { next: { revalidate: 3600 } },
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
