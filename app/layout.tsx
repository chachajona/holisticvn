import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { GoogleTagManager } from "@/components/gtm";
import { HolisticFooter } from "@/components/holistic-footer";
import { SiteChrome } from "@/components/site-chrome";
import { SiteDataProvider } from "@/components/site-data";
import { getPublicSiteData } from "@/lib/sanity";

// A failed settings read may prerender approved contacts without a successful cached fetch.
// Keep that HTML on the same finite recovery schedule as published settings.
export const revalidate = 3600;

const navDisplay = localFont({
  src: "./fonts/RobotoSlab.woff2",
  weight: "200 500",
  style: "normal",
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
const navSerif = localFont({
  src: [
    { path: "./fonts/RobotoSerif.woff2", weight: "300 500", style: "normal" },
    { path: "./fonts/RobotoSerif-Italic.woff2", weight: "300 500", style: "italic" },
  ],
  variable: "--font-accent",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  preload: false,
});
const navMono = localFont({
  src: "./fonts/RobotoMono.woff2",
  weight: "300 500",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://holisticvn.com"),
  title: {
    default: "HolisticVN | Phục hồi để sống trọn nhịp của bạn",
    template: "%s | HolisticVN",
  },
  description: "Vật lý trị liệu theo lộ trình cá nhân hóa tại TP. Hồ Chí Minh.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const data = await getPublicSiteData();
  return (
    <html lang="vi">
      <body className={`${navDisplay.variable} ${navSerif.variable} ${navMono.variable}`}>
        <a className="skip" href="#main">
          Bỏ qua điều hướng
        </a>
        <SiteDataProvider data={data}>
          <GoogleTagManager />
          <SiteChrome footer={<HolisticFooter />}>{children}</SiteChrome>
        </SiteDataProvider>
      </body>
    </html>
  );
}
