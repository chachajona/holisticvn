"use client";

import { track } from "@/components/gtm";
import type { PublicSiteData } from "@/lib/sanity";
import styles from "./services.module.css";

export function ServicesContactLinks({
  site,
  tone,
}: {
  site: PublicSiteData["site"];
  tone: "light" | "dark";
}) {
  return (
    <div className={styles.contactLinks} data-tone={tone}>
      <a
        className={styles.textLink}
        href={`tel:${site.phone.replace(/\s+/g, "")}`}
        onClick={() => track("chat_click", { channel: "dial" })}
      >
        Gọi {site.phone}
      </a>
      {site.zaloId ? (
        <a
          className={styles.textLink}
          href={`https://zalo.me/${site.zaloId}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("chat_click", { channel: "zalo" })}
        >
          Nhắn Zalo
        </a>
      ) : null}
      {site.messengerId ? (
        <a
          className={styles.textLink}
          href={`https://m.me/${site.messengerId}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("chat_click", { channel: "messenger" })}
        >
          Messenger
        </a>
      ) : null}
    </div>
  );
}
