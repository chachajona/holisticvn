import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { getPublicSiteData } from "@/lib/sanity";
import { mapsHref, noBreakAddress } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = createMetadata({
  title: "Liên hệ",
  description:
    "Gọi điện, nhắn Zalo hoặc để lại lời nhắn cho HolisticVN. Xem địa chỉ và giờ mở cửa phòng khám tại Lê Quốc Hưng, TP. Hồ Chí Minh.",
  path: "/contact",
});

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}

export default async function ContactPage() {
  const { site, branches } = await getPublicSiteData();
  return (
    <main id="main" className={styles.root}>
      <div className={styles.shell}>
        <div className={styles.marker}>Liên hệ Holistic</div>

        <section className={styles.contact} aria-labelledby="contact-heading">
          <div className={styles.intro}>
            <h1 id="contact-heading">
              Bắt đầu từ một <span>cuộc trò chuyện.</span>
            </h1>
            <p className={styles.description}>
              Bạn muốn hỏi về trị liệu, tập luyện hay lịch hẹn? Chia sẻ với Holistic qua cách thuận
              tiện nhất cho bạn.
            </p>

            <div className={styles.channels} data-chat-exclusion>
              <a className={styles.channel} href={`tel:${site.phone.replaceAll(" ", "")}`}>
                <span>
                  <span className={styles.channelLabel}>Gọi cho Holistic</span>
                  <span className={styles.channelValue}>{site.phone}</span>
                </span>
                <Arrow />
              </a>
              {site.zaloId ? (
                <a
                  className={styles.channel}
                  href={`https://zalo.me/${site.zaloId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <span className={styles.channelLabel}>Bạn thích nhắn tin hơn?</span>
                    <span className={styles.channelValue}>Trò chuyện qua Zalo</span>
                  </span>
                  <Arrow />
                </a>
              ) : null}
              <a className={styles.channel} href={`mailto:${site.email}`}>
                <span>
                  <span className={styles.channelLabel}>Gửi email</span>
                  <span className={`${styles.channelValue} ${styles.email}`}>{site.email}</span>
                </span>
                <Arrow />
              </a>
            </div>
            <a className={styles.visitLink} href="#visit">
              Địa chỉ & giờ mở cửa <span aria-hidden="true">↓</span>
            </a>
          </div>

          <section className={styles.formPanel} aria-labelledby="callback-heading">
            <h2 id="callback-heading">Để Holistic gọi lại</h2>
            <p>
              Để lại thông tin cùng điều bạn muốn trao đổi. Nhân viên Holistic sẽ gọi lại cho bạn.
            </p>
            <LeadForm kind="contact" submitLabel="Gửi lời nhắn" />
            <p className={styles.privacy}>
              Thông tin được gửi đến đội ngũ Holistic để liên hệ lại.{" "}
              <Link href="/privacy-policy">Chính sách bảo mật</Link>.
            </p>
          </section>
        </section>

        <section id="visit" className={styles.visit} aria-labelledby="visit-heading">
          <div className={styles.photo}>
            <Image
              src="/images/HeroAbout.jpg"
              alt="Lối vào phòng khám Holistic với cổng mở và biển hiệu Holi bên trong"
              fill
              loading="eager"
              sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1440px) 52vw, 700px"
            />
          </div>
          <div className={styles.visitCopy}>
            <h2 id="visit-heading">Hẹn gặp bạn tại Holistic.</h2>
            {branches.map((branch) => (
              <div key={branch.address} className={styles.location}>
                <h3>{branch.name}</h3>
                <address>{noBreakAddress(branch.address)}</address>
                <a className={styles.mapLink} href={mapsHref(branch.address)}>
                  Chỉ đường trên Google Maps <Arrow />
                </a>
              </div>
            ))}
            <div className={styles.hours}>
              <span>Giờ mở cửa · {site.hoursNote}</span>
              <p>{site.hours}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
