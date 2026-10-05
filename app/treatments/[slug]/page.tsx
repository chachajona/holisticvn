import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { createMetadata } from "@/lib/seo";
import { getTreatments } from "@/lib/sanity";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getTreatments()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const treatment = (await getTreatments()).find((item) => item.slug === slug);
  return treatment
    ? createMetadata({
        title: treatment.title,
        description: treatment.shortDescription,
        path: `/treatments/${treatment.slug}`,
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
  return (
    <main id="main">
      <section className="treatment-detail-hero">
        <div className="shell treatment-detail-hero__grid">
          <div>
            <Link className="back-link" href="/treatments">
              ← Tất cả liệu pháp
            </Link>
            <p className="eyebrow">Liệu pháp</p>
            <h1 className="display">{treatment.title}</h1>
            <p>{treatment.description}</p>
            <span className="treatment-duration">Thời lượng gợi ý · {treatment.duration}</span>
          </div>
          <div className="treatment-detail-hero__image">
            <Image
              src={treatment.image}
              alt={treatment.title}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
      <section className="section section--paper">
        <div className="shell treatment-detail-grid">
          <div>
            <p className="eyebrow">Điều bạn có thể mong đợi</p>
            <h2 className="display">Một phiên trị liệu có chủ đích.</h2>
            <p>
              Chuyên gia sẽ trao đổi về tình trạng hiện tại, giải thích hướng can thiệp và điều
              chỉnh theo phản hồi của cơ thể trong suốt buổi trị liệu.
            </p>
          </div>
          <ul>
            {treatment.benefits.map((benefit, index) => (
              <li key={benefit}>
                <span>0{index + 1}</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="shell booking-split">
          <div>
            <p className="eyebrow">Bắt đầu lộ trình</p>
            <h2 className="display">Muốn biết liệu pháp này có phù hợp với bạn?</h2>
            <p>Gửi yêu cầu, HolisticVN sẽ liên hệ để trao đổi trước khi xác nhận lịch hẹn.</p>
          </div>
          <LeadForm kind="booking" treatment={treatment.title} />
        </div>
      </section>
    </main>
  );
}
