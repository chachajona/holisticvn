import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { createMetadata } from "@/lib/seo";
import { getTreatments } from "@/lib/sanity";
import styles from "./treatment-detail.module.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getTreatments()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const treatment = (await getTreatments()).find((item) => item.slug === slug);
  return treatment
    ? createMetadata({
        title: treatment.seo?.title ?? treatment.title,
        description: treatment.seo?.description ?? treatment.shortDescription,
        path: `/treatments/${treatment.slug}`,
        image: treatment.seo?.ogImage ?? treatment.image,
      })
    : {};
}
export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const treatment = (await getTreatments()).find((item) => item.slug === slug);
  if (!treatment) notFound();
  const protocols = treatment.protocols ?? [];
  return (
    <main id="main" className={styles.root}>
      <section
        className={treatment.image ? styles.hero : `${styles.hero} ${styles.heroPlain}`}
        data-plain={treatment.image ? undefined : ""}
      >
        <div className={`shell ${styles.heroGrid}`}>
          <div>
            <Link className={styles.backLink} href="/treatments">
              ← Tất cả liệu pháp
            </Link>
            <p className={styles.eyebrow}>Liệu pháp</p>
            <h1>{treatment.title}</h1>
            {treatment.description ? <p>{treatment.description}</p> : null}
            {treatment.duration ? (
              <span className={styles.duration}>Thời lượng gợi ý · {treatment.duration}</span>
            ) : null}
          </div>
          {treatment.image ? (
            <div className={styles.heroImage}>
              <Image
                src={treatment.image}
                alt={treatment.imageAlt ?? treatment.title}
                fill
                priority
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
          ) : null}
        </div>
      </section>
      <section className={`section ${styles.band}`}>
        <div className={`shell ${styles.expect}`}>
          <div>
            <p className={styles.eyebrow}>Điều bạn có thể mong đợi</p>
            <h2>Một phiên trị liệu có chủ đích.</h2>
            <p>
              Chuyên gia sẽ trao đổi về tình trạng hiện tại, giải thích hướng can thiệp và điều
              chỉnh theo phản hồi của cơ thể trong suốt buổi trị liệu.
            </p>
          </div>
          {treatment.benefits.length ? (
            <ul className={styles.benefits}>
              {treatment.benefits.map((benefit, index) => (
                <li key={benefit}>
                  <span>0{index + 1}</span>
                  {benefit}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
      {protocols.length ? (
        <section className="section">
          <div className={`shell ${styles.protocol}`}>
            <p className={styles.eyebrow}>Quy trình</p>
            <h2>Các bước trong một buổi.</h2>
            <ol>
              {protocols.map((protocol) => (
                <li key={protocol.step}>
                  <span>{String(protocol.step).padStart(2, "0")}</span>
                  <div>
                    <h3>{protocol.title}</h3>
                    {protocol.description ? <p>{protocol.description}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}
      <section className="section">
        <div className={`shell ${styles.booking}`}>
          <div>
            <p className={styles.eyebrow}>Bắt đầu lộ trình</p>
            <h2>Muốn biết liệu pháp này có phù hợp với bạn?</h2>
            <p>Gửi yêu cầu, HolisticVN sẽ liên hệ để trao đổi trước khi xác nhận lịch hẹn.</p>
          </div>
          <LeadForm kind="booking" treatment={treatment.title} />
        </div>
      </section>
    </main>
  );
}
