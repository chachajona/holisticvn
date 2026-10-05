"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "@/app/page.module.css";

const links: Array<[string, string]> = [
  ["Dịch vụ", "/services"],
  ["Liệu pháp", "/treatments"],
  ["Về chúng tôi", "/about"],
  ["Góc nhìn", "/blog"],
];

export function HomeNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.nav}>
      <Link href="/" aria-label="HolisticVN trang chủ">
        <img src="/assets/wordmark-tight-dark.svg" alt="holistic — rehab & performance" height={26} style={{ display: "block" }} />
      </Link>
      <nav className={open ? `${styles.navLinks} ${styles.navLinksOpen}` : styles.navLinks} aria-label="Điều hướng chính">
        {links.map(([label, href]) => (
          <Link key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </Link>
        ))}
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/booking" className={styles.navCta}>
          Đặt lịch ngay
        </Link>
        <button
          type="button"
          className={styles.menuButton}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </div>
  );
}
