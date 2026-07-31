import type { Metadata } from "next";
import { locales, type Locale } from "./locales";
import { siteConfig } from "./site-config";

const openGraphLocales: Record<Locale, string> = {
  ka: "ka_GE",
  en: "en_GB",
  nl: "nl_NL",
  de: "de_DE",
  fr: "fr_FR",
  lb: "lb_LU",
};

export function createLocalizedMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const suffix = path ? `/${path.replace(/^\/+|\/+$/g, "")}` : "";
  const canonical = `${siteConfig.publicUrl}/${locale}${suffix}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          locales.map((item) => [
            item,
            `${siteConfig.publicUrl}/${item}${suffix}`,
          ]),
        ),
        "x-default": `${siteConfig.publicUrl}/en${suffix}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: openGraphLocales[locale],
      url: canonical,
      title,
      description,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} · Batumi`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
