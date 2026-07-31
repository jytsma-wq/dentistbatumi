import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ConversionBand,
  PageHero,
  SectionIntro,
} from "../../../components/PageElements";
import { siteCopy } from "../../../content";
import {
  isLocale,
  isTreatmentSlug,
  locales,
  treatmentSlugs,
} from "../../../locales";
import { createLocalizedMetadata } from "../../../metadata";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    treatmentSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isTreatmentSlug(slug)) return {};
  const treatment = siteCopy[locale].treatments.find(
    (item) => item.slug === slug,
  );
  return treatment
    ? createLocalizedMetadata({
        locale,
        path: `treatments/${slug}`,
        title: treatment.title,
        description: treatment.short,
      })
    : {};
}

export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isTreatmentSlug(slug)) notFound();
  const copy = siteCopy[locale];
  const treatment = copy.treatments.find((item) => item.slug === slug);
  if (!treatment) notFound();
  const mayNeedStayPlanning = [
    "dental-implants",
    "crowns-bridges",
    "full-mouth-rehabilitation",
    "veneers-cosmetic-dentistry",
  ].includes(slug);

  return (
    <>
      <PageHero
        eyebrow={`${copy.pages.treatmentDetailEyebrow} · ${treatment.number}`}
        title={treatment.title}
        lead={treatment.short}
        marker={treatment.number}
      />

      <section className="detail-intro section-shell">
        <div className="detail-lead">
          <span className="eyebrow">{copy.pages.forWhom}</span>
          <h2>{treatment.audience}</h2>
        </div>
        <div className="detail-note">
          <span aria-hidden="true">i</span>
          <p>{copy.pages.forWhomText}</p>
        </div>
      </section>

      <section className="detail-plan">
        <SectionIntro
          eyebrow={copy.process.eyebrow}
          title={copy.pages.planTitle}
          inverse
        />
        <div className="detail-step-list">
          {copy.pages.planSteps.map((step, index) => (
            <article key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step}</h3>
              <p>{copy.process.steps[index]?.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="timing-cost section-shell">
        <article>
          <span className="eyebrow">{copy.pages.timing}</span>
          <h2>{treatment.timing}</h2>
          <p>{copy.pages.timingNote}</p>
        </article>
        <article>
          <span className="eyebrow">{copy.pages.priceTitle}</span>
          <h2>{copy.pages.priceTitle}</h2>
          <p>{copy.pages.priceText}</p>
        </article>
      </section>

      {mayNeedStayPlanning && (
        <section className="clinical-caution section-shell">
          <span>21</span>
          <div>
            <h2>{copy.stay21.title}</h2>
            <p>{copy.stay21.text}</p>
            <small>{copy.stay21.note}</small>
          </div>
        </section>
      )}

      <ConversionBand copy={copy} />
    </>
  );
}
