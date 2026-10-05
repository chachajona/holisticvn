"use client";

import { usePathname } from "next/navigation";
import { HolisticNav } from "@/components/holistic-nav";
import { SiteFooter } from "@/components/site-footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const editorialPage = pathname === "/" || pathname === "/services" || pathname === "/treatments";
  return <>
    <HolisticNav />
    {editorialPage ? children : <><div className="page">{children}</div><SiteFooter /></>}
  </>;
}
