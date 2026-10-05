"use client";

import { usePathname } from "next/navigation";
import { ChatWidgets } from "@/components/chat-widgets";
import { CookieConsent } from "@/components/cookie-consent";
import { HolisticNav } from "@/components/holistic-nav";

export function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  // Studio is an internal tool: no marketing nav, footer, chat or consent banner around it.
  if (pathname.startsWith("/studio")) return children;
  return (
    <>
      <HolisticNav />
      <div className="page">{children}</div>
      {footer}
      <ChatWidgets />
      <CookieConsent />
    </>
  );
}
