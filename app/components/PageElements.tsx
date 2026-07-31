import Link from "next/link";
import type { Locale } from "../locales";
import type { SiteCopy, TreatmentContent } from "../content";

export function PageHero({
  eyebrow,
  title,
  lead,
  marker = "M",
}: {
  eyebrow: string;
  title: string;
  lead: string;
  marker?: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{lead}</p>
      </div>
      <div className="page-hero-mark" aria-hidden="true">
        <span>{marker}</span>
        <i />
        <i />
      </div>
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  text,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  inverse?: boolean;
}) {
  return (
    <header className={`section-intro ${inverse ? "inverse" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </header>
  );
}

export function TreatmentGrid({
  locale,
  treatments,
  actionLabel,
}: {
  locale: Locale;
  treatments: TreatmentContent[];
  actionLabel: string;
}) {
  return (
    <div className="treatment-grid">
      {treatments.map((treatment) => (
        <Link
          className="treatment-card"
          href={`/${locale}/treatments/${treatment.slug}`}
          key={treatment.slug}
        >
          <span className="card-number">{treatment.number}</span>
          <div>
            <h3>{treatment.title}</h3>
            <p>{treatment.short}</p>
          </div>
          <span className="card-link">
            {actionLabel} <b aria-hidden="true">↗</b>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function FaqSection({ copy }: { copy: SiteCopy }) {
  return (
    <section className="faq-section section-shell">
      <SectionIntro eyebrow={copy.faq.eyebrow} title={copy.faq.title} />
      <div className="faq-list">
        {copy.faq.items.map((item, index) => (
          <details key={item.question}>
            <summary>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.question}
              <b aria-hidden="true">+</b>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ConversionBand({
  copy,
  international = false,
}: {
  copy: SiteCopy;
  international?: boolean;
}) {
  return (
    <section className="conversion-band">
      <div>
        <span className="eyebrow">
          {international ? copy.stay21.eyebrow : copy.footer.eyebrow}
        </span>
        <h2>
          {international ? copy.stay21.title : copy.footer.title}
        </h2>
      </div>
      <div className="button-row">
        <button
          className="button button-coral"
          data-booking
          data-intent={international ? "international" : "local"}
          type="button"
        >
          {international
            ? copy.actions.onlineAssessment
            : copy.actions.appointment}
        </button>
        <button
          className="button button-outline-light"
          data-whatsapp
          data-intent={international ? "international" : "local"}
          type="button"
        >
          {copy.actions.whatsapp}
        </button>
      </div>
    </section>
  );
}

