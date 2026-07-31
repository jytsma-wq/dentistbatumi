export const locales = ["ka", "en", "nl", "de", "fr", "lb"] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  ka: "ქართული",
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  fr: "Français",
  lb: "Lëtzebuergesch",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const treatmentSlugs = [
  "general-dentistry",
  "emergency-dentist",
  "dental-implants",
  "crowns-bridges",
  "full-mouth-rehabilitation",
  "veneers-cosmetic-dentistry",
] as const;

export type TreatmentSlug = (typeof treatmentSlugs)[number];

export function isTreatmentSlug(value: string): value is TreatmentSlug {
  return treatmentSlugs.includes(value as TreatmentSlug);
}

