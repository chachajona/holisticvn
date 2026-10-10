import Link from "next/link";
import Image from "next/image";
import { footerMethods, footerServices, mapsHref, noBreakAddress } from "@/lib/content";
import { getPublicSiteData } from "@/lib/sanity";
import { FacebookIcon, InstagramIcon, ZaloIcon } from "@/components/brand-icons";
import styles from "./holistic-chrome.module.css";

const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

export async function HolisticFooter() {
  const { site, branches } = await getPublicSiteData();
  const phoneDigits = site.phone.replace(/\s+/g, "");
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <Image
            src="/assets/logo/lockup-on-dark.svg"
            alt="holistic — rehab & performance"
            width={2103}
            height={470}
            className={styles.footerLogo}
          />
          <p className={styles.footerTagline}>
            Dịch vụ trị liệu &amp; huấn luyện thể chất. Cải thiện sức khoẻ vận động một cách khoa
            học &amp; bền vững.
          </p>
          <address className={styles.footerContact}>
            {branches.map((branch) => (
              <a key={branch.name} href={mapsHref(branch.address)}>
                <span className={styles.footerBranchName}>{branch.name}</span>
                {noBreakAddress(branch.address)}
              </a>
            ))}
            <a href={`tel:${phoneDigits}`}>{site.phone}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </address>
          <div className={styles.footerSocial}>
            <a href={site.facebookUrl} aria-label="Facebook Holistic">
              <FacebookIcon />
            </a>
            <a href={site.instagramUrl} aria-label="Instagram Holistic">
              <InstagramIcon />
            </a>
            {site.zaloId ? (
              <a
                href={`https://zalo.me/${site.zaloId}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo Holistic"
                data-brand="zalo"
              >
                <ZaloIcon />
              </a>
            ) : null}
          </div>
        </div>
        <div className={styles.footerGroup}>
          {(
            [
              ["DỊCH VỤ", footerServices],
              ["PHƯƠNG PHÁP", footerMethods],
            ] as const
          ).map(([label, links]) => (
            <div key={label} className={styles.footerCol}>
              <span className={styles.footerColLabel}>{label}</span>
              {links.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.footerCol}>
          <span className={styles.footerColLabel}>HOLISTIC</span>
          <Link href="/about">Câu chuyện</Link>
          <Link href="/blog">Kiến thức vận động</Link>
          <Link href="/contact">Liên hệ</Link>
        </div>
        <div className={styles.footerHours}>
          <span className={styles.footerColLabel}>GIỜ MỞ CỬA</span>
          {/* desktop lists every day; hours are the same all seven days (confirmed), so one value repeats */}
          <dl className={styles.footerHoursDays}>
            {weekdays.map((day) => (
              <div key={day}>
                <dt>{day}</dt>
                <dd>{site.hours}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.footerHoursRow}>
            <span>{site.hoursNote}</span>
            <span>{site.hours}</span>
          </p>
          <Link href="/booking" className={styles.footerCta}>
            Đặt lịch ngay
          </Link>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} Holistic Rehab &amp; Performance</span>
        <div>
          <Link href="/privacy-policy">Chính sách bảo mật</Link>
          <Link href="/terms-conditions">Điều khoản</Link>
          <Link href="/cookie-policy">Cookie</Link>
        </div>
      </div>
    </footer>
  );
}
