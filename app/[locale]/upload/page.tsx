import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, SectionIntro } from "../../components/PageElements";
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
  const copy = medicalUploadCopy[locale];
  return createLocalizedMetadata({
    locale,
    path: "upload",
    title: copy.title,
    description: copy.lead,
  });
}

export default async function ClinicalUploadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = medicalUploadCopy[locale];

  const cards = [
    {
      marker: "01",
      title: copy.page.acceptedTitle,
      text: copy.page.acceptedText,
    },
    {
      marker: "02",
      title: copy.page.privateTitle,
      text: copy.page.privateText,
    },
    {
      marker: "03",
      title: copy.page.nextTitle,
      text: copy.page.nextText,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        marker="DX"
      />
      <section className="upload-page-intro section-shell">
        <SectionIntro
          eyebrow={copy.eyebrow}
          title={copy.whatsappWarning}
          text={copy.urgentNote}
        />
        <div className="upload-principles">
          {cards.map((card) => (
            <article key={card.marker}>
              <span>{card.marker}</span>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="upload-launch section-shell">
        <div className="upload-launch-mark" aria-hidden="true">
          <span>DX</span>
          <i />
        </div>
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h2>{copy.trigger}</h2>
          <p>{copy.privatePreview}</p>
          <button
            className="button button-coral"
            data-upload
            type="button"
          >
            {copy.trigger}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </>
  );
}
