import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ConversionBand,
  PageHero,
  SectionIntro,
  TreatmentGrid,
} from "../../components/PageElements";
import { siteCopy } from "../../content";
import { isLocale } from "../../locales";
import { createLocalizedMetadata } from "../../metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = siteCopy[locale];
  return createLocalizedMetadata({
    locale,
    path: "treatments",
    title: copy.pages.treatmentsTitle,
    description: copy.pages.treatmentsLead,
  });
}

export default async function TreatmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteCopy[locale];

  return (
    <>
      <PageHero
        eyebrow={copy.treatmentSection.eyebrow}
        title={copy.pages.treatmentsTitle}
        lead={copy.pages.treatmentsLead}
        marker="T"
      />
      <section className="section-shell page-section">
        <SectionIntro
          eyebrow={copy.needs.eyebrow}
          title={copy.needs.title}
        />
        <div className="intent-grid">
          {copy.needs.items.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>
      <section className="section-shell page-section soft-section">
        <SectionIntro
          eyebrow={copy.treatmentSection.eyebrow}
          title={copy.treatmentSection.title}
          text={copy.treatmentSection.intro}
        />
        <TreatmentGrid
          locale={locale}
          treatments={copy.treatments}
          actionLabel={copy.actions.learnMore}
        />
      </section>
      <ConversionBand copy={copy} />
    </>
  );
}
