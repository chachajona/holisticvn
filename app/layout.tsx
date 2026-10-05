import type { Metadata } from "next";
import { Roboto_Mono, Roboto_Serif, Roboto_Slab } from "next/font/google";
import "@/app/globals.css";
import { GoogleTagManager } from "@/components/gtm";
import { HolisticFooter } from "@/components/holistic-footer";
import { SiteChrome } from "@/components/site-chrome";
import { SiteDataProvider } from "@/components/site-data";
import { getPublicSiteData } from "@/lib/sanity";

const navDisplay = Roboto_Slab({
  subsets: ["vietnamese", "latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});
const navSerif = Roboto_Serif({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500"],
  style: ["italic", "normal"],
  variable: "--font-accent",
  display: "swap",
});
const navMono = Roboto_Mono({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://holisticvn.vn"),
  title: {
    default: "HolisticVN | Phục hồi để sống trọn nhịp của bạn",
    template: "%s | HolisticVN",
  },
  description:
    "Physical therapy và trị liệu vận động theo lộ trình cá nhân hóa tại TP. Hồ Chí Minh.",
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
