import type { ReactNode } from "react";
import type { Locale } from "../locales";
import type { SiteCopy } from "../content";
import { siteConfig } from "../site-config";
import { medicalUploadCopy } from "../upload-content";
import { ActionDock } from "./ActionDock";
import { BookingExperience } from "./BookingExperience";
import { MedicalUploadExperience } from "./MedicalUploadExperience";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

const skipLabels: Record<Locale, string> = {
  ka: "მთავარ შინაარსზე გადასვლა",
  en: "Skip to main content",
  nl: "Ga naar de hoofdinhoud",
  de: "Zum Hauptinhalt springen",
  fr: "Aller au contenu principal",
  lb: "Bei den Haaptinhalt sprangen",
};

export function SiteShell({
  locale,
  copy,
  children,
}: {
  locale: Locale;
  copy: SiteCopy;
  children: ReactNode;
}) {
  return (
    <>
      <BookingExperience
        copy={copy}
        whatsappNumber={siteConfig.whatsappNumber}
        uploadLabel={medicalUploadCopy[locale].trigger}
      >
        <a className="skip-link" href="#main-content">
          {skipLabels[locale]}
        </a>
        <SiteHeader locale={locale} copy={copy} />
        <main id="main-content">{children}</main>
        <SiteFooter locale={locale} copy={copy} />
        <ActionDock copy={copy} />
      </BookingExperience>
      <MedicalUploadExperience
        locale={locale}
        languageName={copy.languageName}
        copy={medicalUploadCopy[locale]}
        whatsappNumber={siteConfig.whatsappNumber}
      />
    </>
  );
}
