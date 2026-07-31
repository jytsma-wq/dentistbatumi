import Link from "next/link";
import { BrandMark } from "./BrandMark";
import type { Locale } from "../locales";
import type { SiteCopy } from "../content";
import { siteConfig } from "../site-config";
import { privacyContent } from "../privacy-content";
import { medicalUploadCopy } from "../upload-content";

export function SiteFooter({
  locale,
  copy,
}: {
  locale: Locale;
  copy: SiteCopy;
}) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <BrandMark locale={locale} />
          <p>{copy.footer.description}</p>
        </div>
        <div>
          <h3>{copy.footer.visit}</h3>
          <p>{siteConfig.address}</p>
          <p>{copy.footer.addressPending}</p>
        </div>
        <div>
          <h3>{copy.footer.navigate}</h3>
          <Link href={`/${locale}/treatments`}>{copy.nav.treatments}</Link>
          <Link href={`/${locale}/clinic`}>{copy.nav.clinic}</Link>
          <Link href={`/${locale}/international`}>
            {copy.nav.international}
          </Link>
          <Link href={`/${locale}/contact`}>{copy.nav.contact}</Link>
          <Link href={`/${locale}/privacy`}>
            {privacyContent[locale].link}
          </Link>
          <Link href={`/${locale}/upload`}>
            {medicalUploadCopy[locale].link}
          </Link>
        </div>
        <div>
          <h3>{copy.footer.contact}</h3>
          {siteConfig.whatsappNumber ? (
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp · +{siteConfig.whatsappNumber}
            </a>
          ) : (
            <button data-whatsapp type="button">
              WhatsApp
            </button>
          )}
          {siteConfig.phone && (
            <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
          )}
          {siteConfig.email && (
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          )}
          <button data-booking type="button">
            {copy.actions.appointment}
          </button>
          <button data-upload type="button">
            {medicalUploadCopy[locale].trigger}
          </button>
          {!siteConfig.whatsappNumber &&
            !siteConfig.phone &&
            !siteConfig.email && <p>{copy.footer.contactPending}</p>}
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} Marea Dental</span>
        <Link href={`/${locale}/privacy`}>
          {copy.footer.prototypeNote}
        </Link>
      </div>
    </footer>
  );
}
