import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://holisticvn.vn";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/studio", "/api"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
