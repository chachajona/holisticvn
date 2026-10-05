"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  ["Dịch vụ", "/services"],
  ["Liệu pháp", "/treatments"],
  ["Về chúng tôi", "/about"],
  ["Góc nhìn", "/blog"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href="/" className="brand" aria-label="HolisticVN trang chủ">
          <Image src="/assets/logo/lockup-on-light.svg" width={184} height={41} alt="holistic — rehab & performance" priority />
        </Link>
        <nav className={open ? "nav nav--open" : "nav"} aria-label="Điều hướng chính">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="nav__mobile-cta" href="/booking" onClick={() => setOpen(false)}>Đặt lịch tư vấn</Link>
        </nav>
        <Link href="/booking" className="header-cta">Đặt lịch <span>↗</span></Link>
        <button className="menu-button" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} onClick={() => setOpen(value => !value)}>
          <i /><i />
        </button>
      </div>
    </header>
  );
}
