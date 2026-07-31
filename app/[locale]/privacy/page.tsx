import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "../../components/PageElements";
import { isLocale } from "../../locales";
import { createLocalizedMetadata } from "../../metadata";
import { privacyContent } from "../../privacy-content";
import { medicalUploadCopy } from "../../upload-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = privacyContent[locale];
  return createLocalizedMetadata({
    locale,
    path: "privacy",
    title: content.title,
    description: content.lead,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = privacyContent[locale];
  const upload = medicalUploadCopy[locale];
  const sections = [
    ...content.sections,
    {
      title: upload.privacy.sectionTitle,
      text: upload.privacy.sectionText,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        lead={content.lead}
        marker="P"
      />
      <section className="privacy-grid section-shell">
        {sections.map((section, index) => (
          <article
            id={index === sections.length - 1 ? "clinical-upload" : undefined}
            key={section.title}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </section>
      <section className="privacy-callout section-shell">
        <span className="eyebrow">{content.eyebrow}</span>
        <h2>{content.noteTitle}</h2>
        <p>{content.noteText}</p>
      </section>
    </>
  );
}
