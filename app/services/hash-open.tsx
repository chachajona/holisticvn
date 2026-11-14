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
    // A click on a link whose hash is already current fires no hashchange, so re-check after clicks too.
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest?.('a[href*="#svc-"]')) setTimeout(open);
    };
    open();
    window.addEventListener("hashchange", open);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", open);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
