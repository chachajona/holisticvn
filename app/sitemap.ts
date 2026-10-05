import type { MetadataRoute } from "next";
import { getPosts, getTreatments } from "@/lib/sanity";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, treatments] = await Promise.all([getPosts(), getTreatments()]);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://holisticvn.vn";
  const paths = [
    "",
    "/services",
    "/treatments",
    "/about",
    "/blog",
    "/booking",
    "/contact",
    "/privacy-policy",
    "/terms-conditions",
    "/cookie-policy",
    ...treatments.map((item) => `/treatments/${item.slug}`),
    ...posts.map((item) => `/blog/${item.slug}`),
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/blog") ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
