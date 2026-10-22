import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { resolveTreatmentSeo } from "@/lib/treatment-seo";
import { getMethods, getPublicSiteData, getTreatments } from "@/lib/sanity";
import { buildTreatmentDetail } from "@/lib/treatment-detail";
import { factCells, formatPrice } from "@/lib/treatment-display";
import { BookingPanel } from "./booking-panel";
import { TreatmentAudience } from "./treatment-audience";
import { TreatmentDock } from "./treatment-dock";
import { TreatmentFaqList } from "./treatment-faq";
import { CertifiedNote, TreatmentFacts } from "./treatment-facts";
import { TreatmentHero } from "./treatment-hero";
import { TreatmentIntro } from "./treatment-intro";
import { TreatmentRelated } from "./treatment-related";
import { TreatmentSteps } from "./treatment-steps";
import styles from "./treatment-page.module.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getTreatments()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const treatment = (await getTreatments()).find((item) => item.slug === slug);
  return treatment
    ? createMetadata({
        ...resolveTreatmentSeo(treatment),
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
  const [treatments, methods, { site }] = await Promise.all([
    getTreatments(),
    // The groups only add context; the page must not go down with them.
    getMethods().catch(() => []),
    getPublicSiteData(),
  ]);
  const treatment = treatments.find((item) => item.slug === slug);
  if (!treatment) notFound();

  const detail = buildTreatmentDetail(treatment, treatments, methods);
  const cells = factCells(treatment);
  const lede = treatment.shortDescription.trim() || treatment.description.trim();
  const showIntro = Boolean(treatment.description.trim()) && treatment.description.trim() !== lede;
  const hasFacts = cells.length > 0;
  const sections = [
    { id: "gioi-thieu", label: "Giới thiệu", visible: showIntro },
    {
      id: "danh-cho-ai",
      label: "Dành cho ai",
      visible: detail.conditions.length > 0 || treatment.benefits.length > 0,
    },
    { id: "buoi-tri-lieu", label: "Quy trình", visible: Boolean(treatment.protocols?.length) },
    { id: "cau-hoi", label: "Câu hỏi thường gặp", visible: Boolean(treatment.faqs?.length) },
    { id: "co-the-ban-quan-tam", label: "Liệu pháp liên quan", visible: detail.related.length > 0 },
    { id: "yeu-cau", label: "Gửi yêu cầu tư vấn", visible: true },
  ].filter((section) => section.visible);

  return (
    <main id="main" className={styles.root}>
      <TreatmentHero
        treatment={treatment}
        stages={detail.stages}
        phone={site.phone}
        groups={detail.groups}
      />
      <TreatmentFacts cells={cells} />
      {treatment.requiresCertifiedPractitioner ? <CertifiedNote /> : null}
      <nav className={styles.pageNav} aria-label="Nội dung trang">
        <ul role="list">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      {showIntro ? (
        <TreatmentIntro title={treatment.title} description={treatment.description} />
      ) : null}
      <TreatmentAudience conditions={detail.conditions} benefits={treatment.benefits} />
      <TreatmentSteps protocols={treatment.protocols ?? []} duration={treatment.duration} />
      <TreatmentFaqList faqs={treatment.faqs ?? []} />
      <TreatmentRelated related={detail.related} groups={detail.groups} />
      <BookingPanel title={treatment.title} phone={site.phone} />
      <TreatmentDock
        key={treatment.slug}
        markerId={hasFacts ? "treatment-facts" : "treatment-hero-actions"}
        title={treatment.title}
        image={treatment.image}
        price={treatment.price && treatment.price > 0 ? formatPrice(treatment.price) : undefined}
        duration={treatment.duration?.trim() || undefined}
      />
    </main>
  );
}
