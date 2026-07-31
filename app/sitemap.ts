import type { MetadataRoute } from "next";
import { locales, treatmentSlugs } from "./locales";
import { siteConfig } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pagePaths = [
    "",
    "treatments",
    "results",
    "clinic",
    "local",
    "international",
    "contact",
    "privacy",
  ];

  return locales.flatMap((locale) => [
    ...pagePaths.map((path) => ({
      url: `${siteConfig.publicUrl}/${locale}${path ? `/${path}` : ""}`,
      changeFrequency: path ? ("monthly" as const) : ("weekly" as const),
      priority: path ? 0.75 : 1,
    })),
    ...treatmentSlugs.map((slug) => ({
      url: `${siteConfig.publicUrl}/${locale}/treatments/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]);
}
