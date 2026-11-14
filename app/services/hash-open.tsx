"use client";

import { useEffect } from "react";

/* Opens the <details> row an #svc-* link points at (browsers do not do this reliably). */
export function HashOpen() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const row = id ? document.getElementById(id)?.closest("details") : null;
      if (row && !row.open) {
        row.open = true;
        row.scrollIntoView();
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
