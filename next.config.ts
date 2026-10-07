import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Public-site CSP. Pages are static/ISR, so no per-request nonce: inline scripts (Next bootstrap,
// consent-gated GTM) rely on 'unsafe-inline'. Origins mirror what the site actually loads.
// Sanity Studio (/studio) is excluded: it needs far broader sources and is noindex + auth-gated.
// ponytail: upgrade to nonce CSP (proxy.ts + dynamic rendering) only if script-src 'unsafe-inline' becomes a compliance need.
const isDev = process.env.NODE_ENV === "development";
const googleAnalytics = "https://*.google-analytics.com https://*.analytics.google.com";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://images.unsplash.com https://cdn.sanity.io https://www.googletagmanager.com ${googleAnalytics}`,
  "font-src 'self'",
  `connect-src 'self' https://www.googletagmanager.com ${googleAnalytics}${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/((?!studio(?:/|$)).*)",
        headers: [{ key: "Content-Security-Policy", value: contentSecurityPolicy }],
      },
      ...["/studio/:path*", "/api/:path*"].map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      })),
    ];
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
