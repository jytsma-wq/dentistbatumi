import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "../../components/PageElements";
import { siteCopy } from "../../content";
import { isLocale } from "../../locales";
import { siteConfig } from "../../site-config";
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
    path: "contact",
    title: copy.pages.contactTitle,
    description: copy.pages.contactLead,
  });
}

export default async function ContactPage({
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
        eyebrow={copy.nav.contact}
        title={copy.pages.contactTitle}
        lead={copy.pages.contactLead}
        marker="@"
      />
      <section className="contact-options section-shell">
        {copy.pages.contactCards.map((card, index) => (
          <article key={card.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            {index === 0 && (
              <button
                className="button button-dark"
                data-booking
                type="button"
              >
                {copy.actions.appointment}
              </button>
            )}
            {index === 1 && (
              <button
                className="button button-whatsapp"
                data-whatsapp
                type="button"
              >
                {copy.actions.whatsapp}
              </button>
            )}
          </article>
        ))}
      </section>
      <section className="contact-map">
        <div className="map-art" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>BATUMI</span>
        </div>
        <div>
          <span className="eyebrow">{copy.footer.visit}</span>
          <h2>{siteConfig.address}</h2>
          <p>{copy.footer.addressPending}</p>
          <button className="button button-coral" data-booking type="button">
            {copy.actions.appointment}
          </button>
        </div>
      </section>
    </>
  );
}
