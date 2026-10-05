import { createClient } from "@sanity/client";
import { posts as fallbackPosts, services as fallbackServices, testimonials as fallbackTestimonials, treatments as fallbackTreatments, type Post, type Service, type Testimonial, type Treatment } from "@/lib/content";
import { apiVersion, dataset, projectId } from "@/sanity/env";

const enabled = projectId !== "missing-project-id";
const client = createClient({ projectId, dataset, apiVersion, useCdn: true, token: process.env.SANITY_API_READ_TOKEN });
const image = 'image.asset->url';
export async function getServices(): Promise<Service[]> { if (!enabled) return fallbackServices; return client.fetch(`*[_type == "service"] | order(title asc){"slug":slug.current,title,description,"treatments":treatments[]->slug.current}`).then(value => value?.length ? value : fallbackServices).catch(() => fallbackServices); }
export async function getTreatments(): Promise<Treatment[]> { if (!enabled) return fallbackTreatments; return client.fetch(`*[_type == "treatment"] | order(title asc){"slug":slug.current,title,shortDescription,description,duration,price,isPopular,"image":${image},benefits,protocols}`).then(value => value?.length ? value : fallbackTreatments).catch(() => fallbackTreatments); }
export async function getPosts(): Promise<Post[]> { if (!enabled) return fallbackPosts; return client.fetch(`*[_type == "post"] | order(publishedAt desc){"slug":slug.current,title,excerpt,publishedAt,category,body}`).then(value => value?.length ? value.map((post: { body?: string }) => ({ ...post, body: post.body?.split("\n\n").filter(Boolean) ?? [] })) : fallbackPosts).catch(() => fallbackPosts); }
export async function getTestimonials(): Promise<Testimonial[]> { if (!enabled) return fallbackTestimonials; return client.fetch(`*[_type == "testimonial"]{quote,context,rating,"avatar":avatar.asset->url}`).then(value => value?.length ? value : fallbackTestimonials).catch(() => fallbackTestimonials); }
export async function getFaqs() { if (!enabled) return []; return client.fetch(`*[_type == "faq"] | order(order asc){question,answer}`).catch(() => []); }
export async function getSiteSettings() {
  if (!enabled) return null;
  return client.fetch(`*[_type == "siteSettings"][0]{siteUrl,contactPhone,contactEmail,locations,socialMedia,seo}`).catch(() => null);
}
