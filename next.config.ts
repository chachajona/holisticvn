import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return ["/studio/:path*", "/api/:path*"].map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      { source: "/treatment", destination: "/treatments", permanent: true },
      { source: "/service", destination: "/services", permanent: true },
      // Legacy WordPress site (holisticvn.com, pre-2025) Vietnamese slugs
      { source: "/dich-vu", destination: "/services", permanent: true },
      { source: "/dich-vu/:slug*", destination: "/services", permanent: true },
      { source: "/gioi-thieu", destination: "/about", permanent: true },
      { source: "/doi-ngu", destination: "/about", permanent: true },
      { source: "/doi-ngu/:slug*", destination: "/about", permanent: true },
      { source: "/phuong-phap", destination: "/treatments", permanent: true },
      { source: "/phuong-phap/:slug", destination: "/treatments/:slug", permanent: true },
      { source: "/kien-thuc", destination: "/blog", permanent: true },
      { source: "/kien-thuc/:slug*", destination: "/blog", permanent: true },
      { source: "/dat-lich", destination: "/booking", permanent: true },
    ];
  },
};

export default nextConfig;
