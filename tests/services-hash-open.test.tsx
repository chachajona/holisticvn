// @vitest-environment happy-dom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";
import { HashOpen } from "@/app/services/hash-open";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

it("keeps hash navigation working after a malformed fragment on first load", () => {
  history.replaceState(null, "", "/services#svc-%");
  const host = document.body.appendChild(document.createElement("div"));
  const root = createRoot(host);
  try {
    act(() =>
      root.render(
        <>
          <HashOpen />
          <details id="svc-recovery">
            <summary>Recovery</summary>
          </details>
        </>,
      ),
    );
    const row = host.querySelector("details")!;
    expect(row.open).toBe(false);
    history.replaceState(null, "", "#svc-%72ecovery");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(row.open).toBe(true);
  } finally {
    act(() => root.unmount());
    host.remove();
    history.replaceState(null, "", "/");
  }
});
