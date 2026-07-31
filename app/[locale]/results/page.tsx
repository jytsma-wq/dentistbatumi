import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ConversionBand,
  PageHero,
  SectionIntro,
} from "../../components/PageElements";
import { siteCopy } from "../../content";
import { isLocale, type Locale } from "../../locales";
import { createLocalizedMetadata } from "../../metadata";

const labels: Record<
  Locale,
  { before: string; after: string; evidence: string }
> = {
  ka: { before: "მანამდე", after: "შემდეგ", evidence: "გამოგონილი შედეგების გარეშე" },
  en: { before: "Before", after: "After", evidence: "No fictional results" },
  nl: { before: "Voor", after: "Na", evidence: "Geen verzonnen resultaten" },
  de: { before: "Vorher", after: "Nachher", evidence: "Keine erfundenen Ergebnisse" },
  fr: { before: "Avant", after: "Après", evidence: "Aucun résultat fictif" },
  lb: { before: "Virdrun", after: "Duerno", evidence: "Keng erfonnt Resultater" },
};

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
    path: "results",
    title: copy.pages.resultsTitle,
    description: copy.pages.resultsLead,
  });
}

export default async function ResultsPage({
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
        eyebrow={copy.nav.results}
        title={copy.pages.resultsTitle}
        lead={copy.pages.resultsLead}
        marker="R"
      />
      <section className="results-principle section-shell">
        <SectionIntro
          eyebrow={copy.proof.eyebrow}
          title={copy.pages.resultsPrinciple}
          text={copy.pages.resultsPrincipleText}
        />
        <div className="case-grid">
          {copy.treatments.slice(2, 5).map((treatment, index) => (
            <article className="case-placeholder" key={treatment.slug}>
              <div className="case-visual">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i />
                <b>{labels[locale].before}</b>
                <b>{labels[locale].after}</b>
              </div>
              <span className="eyebrow">{treatment.title}</span>
              <h3>{copy.pages.casePending}</h3>
              <dl>
                {copy.pages.caseFields.map((field) => (
                  <div key={field}>
                    <dt>{field}</dt>
                    <dd>—</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>
      <section className="evidence-rule">
        <span>{labels[locale].evidence}</span>
        <p>{copy.pages.resultsPrincipleText}</p>
      </section>
      <ConversionBand copy={copy} />
    </>
  );
}
