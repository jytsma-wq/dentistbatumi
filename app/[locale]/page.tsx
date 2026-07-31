import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ConversionBand,
  FaqSection,
  SectionIntro,
  TreatmentGrid,
} from "../components/PageElements";
import { siteCopy } from "../content";
import { isLocale } from "../locales";
import { createLocalizedMetadata } from "../metadata";

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
    title: `${copy.hero.title} ${copy.hero.emphasis}`,
    description: copy.hero.lead,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteCopy[locale];

  return (
    <>
      <section className="home-hero">
        <div className="hero-image-wrap">
          {/* The source is already resized and compressed; a plain image avoids
              requiring a runtime image-transform binding on the clinic host. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/marea-hero.webp"
            alt={copy.hero.imageAlt}
            width={1774}
            height={887}
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero-image-label">
            <span>BATUMI</span>
            <small>41.65° N · 41.64° E</small>
          </div>
        </div>
        <div className="hero-copy">
          <span className="eyebrow">{copy.hero.eyebrow}</span>
          <h1>
            {copy.hero.title}
            <em>{copy.hero.emphasis}</em>
          </h1>
          <p>{copy.hero.lead}</p>
          <div className="button-row">
            <button className="button button-coral" data-booking type="button">
              {copy.hero.localCta}
            </button>
            <button
              className="button button-whatsapp"
              data-whatsapp
              type="button"
            >
              <span className="wa-dot" aria-hidden="true">
                WA
              </span>
              {copy.actions.whatsapp}
            </button>
          </div>
          <Link
            className="hero-text-link"
            href={`/${locale}/international`}
          >
            {copy.hero.internationalLink}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="hero-proof">
          {copy.hero.proof.map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
        <div className="day-mark" aria-label={copy.stay21.eyebrow}>
          <span>≤</span>
          <strong>21</strong>
          <small>{copy.stay21.eyebrow}</small>
        </div>
      </section>

      <section className="route-section section-shell">
        <SectionIntro eyebrow={copy.routes.eyebrow} title={copy.routes.title} />
        <div className="route-grid">
          <article className="route-card route-local">
            <span className="route-index">A</span>
            <span className="eyebrow">{copy.routes.local.eyebrow}</span>
            <h3>{copy.routes.local.title}</h3>
            <p>{copy.routes.local.text}</p>
            <div className="route-actions">
              <button data-booking type="button">
                {copy.routes.local.cta} <span>→</span>
              </button>
              <Link
                href={`/${locale}/local`}
                aria-label={copy.routes.local.title}
              >
                ↗
              </Link>
            </div>
          </article>
          <article className="route-card route-international">
            <span className="route-index">B</span>
            <span className="eyebrow">
              {copy.routes.international.eyebrow}
            </span>
            <h3>{copy.routes.international.title}</h3>
            <p>{copy.routes.international.text}</p>
            <div className="route-actions">
              <button data-booking data-intent="international" type="button">
                {copy.routes.international.cta} <span>→</span>
              </button>
              <Link
                href={`/${locale}/international`}
                aria-label={copy.routes.international.title}
              >
                ↗
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="needs-section">
        <div className="needs-heading">
          <span className="eyebrow">{copy.needs.eyebrow}</span>
          <h2>{copy.needs.title}</h2>
        </div>
        <div className="needs-list">
          {copy.needs.items.map((item, index) => (
            <Link
              href={`/${locale}/treatments`}
              key={item}
              className="need-row"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item}</h3>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="treatments-section section-shell">
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

      <section className="process-section">
        <SectionIntro
          eyebrow={copy.process.eyebrow}
          title={copy.process.title}
          text={copy.process.intro}
          inverse
        />
        <div className="process-grid">
          {copy.process.steps.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stay-section section-shell">
        <div className="stay-art" aria-hidden="true">
          <span>21</span>
          <i />
          <b>BATUMI</b>
        </div>
        <div className="stay-copy">
          <span className="eyebrow">{copy.stay21.eyebrow}</span>
          <h2>{copy.stay21.title}</h2>
          <p>{copy.stay21.text}</p>
          <small>{copy.stay21.note}</small>
          <Link href={`/${locale}/international`}>
            {copy.stay21.link} <span>→</span>
          </Link>
        </div>
      </section>

      <section className="proof-section">
        <div className="proof-sticky">
          <span className="eyebrow">{copy.proof.eyebrow}</span>
          <h2>{copy.proof.title}</h2>
        </div>
        <div className="proof-list">
          {copy.proof.items.map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
              <i aria-hidden="true">✓</i>
            </div>
          ))}
          <Link href={`/${locale}/clinic`}>
            {copy.nav.clinic} <span>↗</span>
          </Link>
        </div>
      </section>

      <FaqSection copy={copy} />
      <ConversionBand copy={copy} />
    </>
  );
}
