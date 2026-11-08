"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { consentKey, hasAnalyticsConsent } from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push an event only while the visitor has accepted analytics. Never pass names, phone, email or messages. */
export function track(event: string, data: Record<string, string> = {}) {
  if (hasAnalyticsConsent()) window.dataLayer?.push({ event, ...data });
}

/**
 * Client navigations do not reload the page, so GTM never sees them. The first page view of a
 * document belongs to the GTM container; this pushes `page_view` for later route changes only.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const last = useRef(pathname);
  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    track("page_view", { page_path: pathname });
  }, [pathname]);
  return null;
}

export function GoogleTagManager() {
  const id = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
  if (!id) return null;
  return (
    <Script
      id="gtm"
      strategy="afterInteractive"
    >{`if(document.cookie.split('; ').includes('${consentKey}=accepted')){window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});(function(w,d,s,l,i){var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');}`}</Script>
  );
}
