import type { Metadata } from "next";
import { Roboto_Mono, Roboto_Serif } from "next/font/google";
import "@/app/globals.css";
import { ChatWidgets } from "@/components/chat-widgets";
import { CookieConsent } from "@/components/cookie-consent";
import { GoogleTagManager } from "@/components/gtm";
import { SiteChrome } from "@/components/site-chrome";

const navSerif = Roboto_Serif({ subsets: ["vietnamese", "latin"], weight: ["300", "400", "500"], style: ["italic", "normal"], variable: "--font-accent", display: "swap" });
const navMono = Roboto_Mono({ subsets: ["vietnamese", "latin"], weight: ["300", "400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://holisticvn.vn"),
  title: { default: "HolisticVN | Phục hồi để sống trọn nhịp của bạn", template: "%s | HolisticVN" },
  description: "Physical therapy và trị liệu vận động theo lộ trình cá nhân hóa tại TP. Hồ Chí Minh.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={`${navSerif.variable} ${navMono.variable}`}><a className="skip" href="#main">Bỏ qua điều hướng</a><GoogleTagManager /><SiteChrome>{children}</SiteChrome><ChatWidgets /><CookieConsent /></body></html>;
}
