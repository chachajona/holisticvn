// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ServicesContactLinks } from "@/app/services/services-contact-links";
import { consentKey } from "@/lib/consent";
import { site } from "@/lib/content";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const contacts = { ...site, phone: "090 123 4567", zaloId: "123456789", messengerId: "clinic" };
let host: HTMLElement;
let root: Root;
beforeEach(() => {
  document.cookie = `${consentKey}=; path=/; max-age=0`;
  window.dataLayer = [];
  host = document.body.appendChild(document.createElement("div"));
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("services inline contact links", () => {
  it("keeps native contact destinations in server HTML, including configured optional channels", () => {
    const html = renderToStaticMarkup(<ServicesContactLinks site={contacts} tone="dark" />);
    expect(html).toContain('href="tel:0901234567"');
    expect(html).toContain('href="https://zalo.me/123456789"');
    expect(html).toContain('href="https://m.me/clinic"');
    expect(html.match(/target="_blank" rel="noopener noreferrer"/g)).toHaveLength(2);
    const phoneOnly = renderToStaticMarkup(
      <ServicesContactLinks
        site={{ ...contacts, zaloId: "", messengerId: undefined }}
        tone="light"
      />,
    );
    expect(phoneOnly.match(/<a /g)).toHaveLength(1);
    expect(phoneOnly).toContain("Gọi 090 123 4567");
  });

  it.each([undefined, "rejected", "accepted"])(
    "preserves channel events with analytics consent %s",
    (consent) => {
      if (consent) document.cookie = `${consentKey}=${consent}; path=/`;
      act(() => root.render(<ServicesContactLinks site={contacts} tone="light" />));
      // Prevent native external navigation while exercising React's actual click handlers.
      host.addEventListener("click", (event) => event.preventDefault());
      for (const link of host.querySelectorAll("a")) act(() => link.click());
      expect(window.dataLayer).toEqual(
        consent === "accepted"
          ? ["dial", "zalo", "messenger"].map((channel) => ({ event: "chat_click", channel }))
          : [],
      );
    },
  );
});
