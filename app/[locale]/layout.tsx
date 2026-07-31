import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteShell } from "../components/SiteShell";
import { siteCopy } from "../content";
import { isLocale, localeNames, locales } from "../locales";
import { siteConfig } from "../site-config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = siteCopy[locale];

  return {
    metadataBase: new URL(siteConfig.publicUrl),
    title: {
      default: `${copy.hero.title} · Marea Dental`,
      template: "%s · Marea Dental",
    },
    description: copy.hero.lead,
    applicationName: "Marea Dental",
    openGraph: {
      type: "website",
      siteName: "Marea Dental",
      title: `${copy.hero.title} ${copy.hero.emphasis}`,
      description: copy.hero.lead,
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.hero.title} · Marea Dental`,
      description: copy.hero.lead,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f0e8",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body>
        <div
          lang={locale}
          data-locale={locale}
          data-language-name={localeNames[locale]}
        >
          <SiteShell locale={locale} copy={siteCopy[locale]}>
            {children}
          </SiteShell>
        </div>
      </body>
    </html>
  );
}
