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
    path: "local",
    title: copy.pages.localTitle,
    description: copy.pages.localLead,
  });
}

export default async function LocalPatientsPage({
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
        eyebrow={copy.routes.local.eyebrow}
        title={copy.pages.localTitle}
        lead={copy.pages.localLead}
        marker="L"
      />
      <section className="local-cards section-shell">
        {copy.pages.localCards.map((card, index) => (
          <article key={card.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </section>
      <section className="section-shell page-section">
        <SectionIntro
          eyebrow={copy.treatmentSection.eyebrow}
          title={copy.treatmentSection.title}
          text={copy.treatmentSection.intro}
        />
        <TreatmentGrid
          locale={locale}
          treatments={copy.treatments.slice(0, 4)}
          actionLabel={copy.actions.learnMore}
        />
      </section>
      <ConversionBand copy={copy} />
    </>
  );
}
