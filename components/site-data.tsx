"use client";

import { createContext, useContext } from "react";
import { site, branches } from "@/lib/content";
import type { PublicSiteData } from "@/lib/sanity";

const SiteDataContext = createContext<PublicSiteData>({ site, branches });

export function SiteDataProvider({
  data,
  children,
}: {
  data: PublicSiteData;
  children: React.ReactNode;
}) {
  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
}
export const useSiteData = () => useContext(SiteDataContext);
