"use client";

import Script from "next/script";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, data: Record<string, string> = {}) {
  if (document.cookie.split("; ").includes("holisticvn-cookie-consent-v1=accepted"))
    window.dataLayer?.push({ event, ...data });
}

export function GoogleTagManager() {
  const id = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
  if (!id) return null;
  return (
    <Script
      id="gtm"
      strategy="afterInteractive"
    >{`if(document.cookie.split('; ').includes('holisticvn-cookie-consent-v1=accepted')){window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});(function(w,d,s,l,i){var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');}`}</Script>
  );
}
