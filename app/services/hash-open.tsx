"use client";

import { useEffect } from "react";

/*
Null state lets the App Router patch sync its URL (docs: Native History API); replaceState adds no
history entry and does not scroll. Closing the open row clears its hash.
*/
function syncHash(row: HTMLDetailsElement) {
  const hash = `#${row.id}`;
  if (row.open && location.hash !== hash) {
    history.replaceState(null, "", hash);
  } else if (!row.open && location.hash === hash) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}

/* Opens the <details> row an #svc-* link points at (browsers do not do this reliably). */
export function HashOpen() {
  useEffect(() => {
    const open = () => {
      let id: string;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      const row = id ? document.getElementById(id)?.closest("details") : null;
      if (row && !row.open) {
        // The exclusive row above may collapse; skip the height transition so the scroll target holds.
        const index = row.parentElement;
        index?.setAttribute("data-jump", "");
        row.open = true;
        row.scrollIntoView();
        requestAnimationFrame(() => index?.removeAttribute("data-jump"));
      }
    };
    // A click on a link whose hash is already current fires no hashchange, so re-check after clicks too.
    // A click on a row summary (Enter/Space also click) keeps the URL on the open row so it can be shared.
    // Only user clicks write the hash: the row open in the server HTML must not add #svc-manual.
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest?.('a[href*="#svc-"]')) setTimeout(open);
      const row = target.closest?.('details[id^="svc-"]');
      if (row instanceof HTMLDetailsElement && target.closest("summary")?.parentElement === row) {
        setTimeout(() => syncHash(row));
      }
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
