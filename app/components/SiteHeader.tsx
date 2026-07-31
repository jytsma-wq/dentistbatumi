import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { type Locale } from "../locales";
import type { SiteCopy } from "../content";
import { LocaleMenu } from "./LocaleMenu";

export function SiteHeader({
  locale,
  copy,
}: {
  locale: Locale;
  copy: SiteCopy;
}) {
  const navItems = [
    ["treatments", copy.nav.treatments],
    ["results", copy.nav.results],
    ["clinic", copy.nav.clinic],
    ["local", copy.nav.local],
    ["international", copy.nav.international],
    ["contact", copy.nav.contact],
  ] as const;

  return (
    <header className="site-header">
      <div className="utility-bar">
        <span>Batumi · საქართველო</span>
        <span>{copy.utility}</span>
      </div>
      <div className="nav-shell">
        <BrandMark locale={locale} />
        <nav className="desktop-nav" aria-label={copy.nav.primaryLabel}>
          {navItems.map(([href, label]) => (
            <Link href={`/${locale}/${href}`} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LocaleMenu locale={locale} label={copy.nav.language} />
          <button
            className="button button-whatsapp header-whatsapp"
            data-whatsapp
            type="button"
          >
            <span className="wa-dot" aria-hidden="true">
              WA
            </span>
            {copy.actions.whatsapp}
          </button>
          <button
            className="button button-coral header-book"
            data-booking
            type="button"
          >
            {copy.actions.appointment}
          </button>
          <details className="mobile-menu">
            <summary aria-label={copy.nav.menu}>
              <span />
              <span />
            </summary>
            <nav aria-label={copy.nav.primaryLabel}>
              <Link href={`/${locale}`}>{copy.nav.home}</Link>
              {navItems.map(([href, label]) => (
                <Link href={`/${locale}/${href}`} key={href}>
                  {label}
                </Link>
              ))}
              <button data-whatsapp type="button">
                {copy.actions.whatsapp}
              </button>
              <button data-booking type="button">
                {copy.actions.appointment}
              </button>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
