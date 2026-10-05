"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import styles from "@/app/page.module.css";

type Item = { title: string; copy: string; image: string; href: string };

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}
function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  const d = dir === "left" ? "M10 4 6 8l4 4" : "M6 4l4 4-4 4";
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function ServicesCarousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 340) + 24;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <>
      <div className={styles.servicesHead}>
        <div>
          <h2>Dịch vụ được chọn nhiều nhất</h2>
          <p>
            Trị liệu bằng tay, thiết bị hỗ trợ và tập luyện cá nhân hoá — kết hợp trong cùng một lộ
            trình.
          </p>
        </div>
        <div className={styles.servicesControls}>
          <Link href="/services" className={styles.outlineButton}>
            Xem tất cả dịch vụ <ArrowIcon />
          </Link>
          <button
            type="button"
            className={styles.carouselArrow}
            onClick={() => scrollByCard(-1)}
            aria-label="Dịch vụ trước"
          >
            <ChevronIcon dir="left" />
          </button>
          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowActive}`}
            onClick={() => scrollByCard(1)}
            aria-label="Dịch vụ tiếp theo"
          >
            <ChevronIcon dir="right" />
          </button>
        </div>
      </div>
      <div className={styles.servicesGrid} ref={trackRef}>
        {items.map((item) => (
          <Link href={item.href} key={item.title} className={styles.serviceCard} data-card>
            <div className={styles.serviceCardImage}>
              <Image src={item.image} alt="" fill sizes="(max-width: 700px) 50vw, 340px" />
            </div>
            <strong>{item.title}</strong>
            <span>{item.copy}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
