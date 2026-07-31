import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ConversionBand,
  PageHero,
  SectionIntro,
} from "../../components/PageElements";
import { siteCopy } from "../../content";
import { isLocale } from "../../locales";
import { createLocalizedMetadata } from "../../metadata";
import { medicalUploadCopy } from "../../upload-content";

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
    path: "international",
    title: copy.pages.internationalTitle,
    description: copy.pages.internationalLead,
  });
}

export default async function InternationalPatientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteCopy[locale];
  const upload = medicalUploadCopy[locale];

  return (
    <>
      <PageHero
        eyebrow={copy.routes.international.eyebrow}
        title={copy.pages.internationalTitle}
        lead={copy.pages.internationalLead}
        marker="21"
      />
      <section className="international-process section-shell">
        <SectionIntro
          eyebrow={copy.process.eyebrow}
          title={copy.pages.planTitle}
          text={copy.pages.internationalLead}
        />
        <div className="journey-list">
          {copy.pages.internationalSteps.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="international-upload section-shell">
        <div className="international-upload-mark" aria-hidden="true">
          <span>DX</span>
          <i />
          <i />
        </div>
        <div>
          <span className="eyebrow">{upload.eyebrow}</span>
          <h2>{upload.title}</h2>
          <p>{upload.lead}</p>
          <small>{upload.whatsappWarning}</small>
          <button
            className="button button-dark"
            data-upload
            type="button"
          >
            {upload.trigger}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
      <section className="twenty-one-manifesto">
        <div className="manifesto-number" aria-hidden="true">
          21
        </div>
        <div>
          <span className="eyebrow">{copy.stay21.eyebrow}</span>
          <h2>{copy.stay21.title}</h2>
          <p>{copy.stay21.text}</p>
          <small>{copy.stay21.note}</small>
        </div>
      </section>
      <section className="autonomy-section section-shell">
        <span aria-hidden="true">↗</span>
        <div>
          <h2>{copy.pages.autonomyTitle}</h2>
          <p>{copy.pages.autonomyText}</p>
        </div>
        <button
          className="button button-dark"
          data-booking
          data-intent="international"
          type="button"
        >
          {copy.actions.onlineAssessment}
        </button>
      </section>
      <ConversionBand copy={copy} international />
    </>
  );
}
