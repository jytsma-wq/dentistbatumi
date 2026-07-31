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
    path: "clinic",
    title: copy.pages.clinicTitle,
    description: copy.pages.clinicLead,
  });
}

export default async function ClinicPage({
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
        eyebrow={copy.nav.clinic}
        title={copy.pages.clinicTitle}
        lead={copy.pages.clinicLead}
        marker="C"
      />
      <section className="principles-section section-shell">
        <SectionIntro
          eyebrow={copy.proof.eyebrow}
          title={copy.pages.clinicTitle}
        />
        <div className="principles-grid">
          {copy.pages.clinicPrinciples.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="team-section">
        <SectionIntro
          eyebrow={copy.nav.clinic}
          title={copy.pages.teamTitle}
          text={copy.pages.teamText}
          inverse
        />
        <div className="team-grid">
          {copy.pages.teamRoles.map((role, index) => (
            <article key={role}>
              <div className="portrait-placeholder" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i />
                <i />
              </div>
              <h3>{role}</h3>
              <p>{copy.pages.verification}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="clinic-spec section-shell">
        <span className="spec-number">01</span>
        <div>
          <span className="eyebrow">{copy.pages.verification}</span>
          <h2>{copy.proof.title}</h2>
        </div>
        <ul>
          {copy.proof.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <ConversionBand copy={copy} />
    </>
  );
}
