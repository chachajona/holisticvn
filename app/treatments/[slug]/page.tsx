import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
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
  const lede = treatment.shortDescription || treatment.description;
  const showIntro = Boolean(treatment.description) && treatment.description.trim() !== lede.trim();
  const hasFacts = cells.length > 0;

  return (
    <main id="main" className={styles.root}>
      <TreatmentHero
        treatment={treatment}
        stages={detail.stages}
        phone={site.phone}
        showPrimaryCta={!hasFacts}
      />
      <TreatmentFacts cells={cells} />
      {treatment.requiresCertifiedPractitioner ? <CertifiedNote /> : null}
      {showIntro ? (
        <TreatmentIntro title={treatment.title} description={treatment.description} />
      ) : null}
      <TreatmentAudience
        conditions={detail.conditions}
        benefits={treatment.benefits}
      />
      <TreatmentSteps protocols={treatment.protocols ?? []} />
      <TreatmentFaqList faqs={treatment.faqs ?? []} />
      <TreatmentRelated related={detail.related} />
      <BookingPanel title={treatment.title} />
      <TreatmentDock
        markerId={hasFacts ? "treatment-facts" : "treatment-hero-actions"}
        title={treatment.title}
        price={treatment.price && treatment.price > 0 ? formatPrice(treatment.price) : undefined}
        duration={treatment.duration?.trim() || undefined}
      />
    </main>
  );
}
