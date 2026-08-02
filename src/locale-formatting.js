export const countryCodes = ['GE', 'NL', 'BE', 'DE', 'FR', 'CH', 'LU', 'GB', 'US', 'IT', 'ES']

const countryNames = {
  nl: { GE: 'Georgië', NL: 'Nederland', BE: 'België', DE: 'Duitsland', FR: 'Frankrijk', CH: 'Zwitserland', LU: 'Luxemburg', GB: 'Verenigd Koninkrijk', US: 'Verenigde Staten', IT: 'Italië', ES: 'Spanje' },
  de: { GE: 'Georgien', NL: 'Niederlande', BE: 'Belgien', DE: 'Deutschland', FR: 'Frankreich', CH: 'Schweiz', LU: 'Luxemburg', GB: 'Vereinigtes Königreich', US: 'Vereinigte Staaten', IT: 'Italien', ES: 'Spanien' },
  fr: { GE: 'Géorgie', NL: 'Pays-Bas', BE: 'Belgique', DE: 'Allemagne', FR: 'France', CH: 'Suisse', LU: 'Luxembourg', GB: 'Royaume-Uni', US: 'États-Unis', IT: 'Italie', ES: 'Espagne' },
  lb: { GE: 'Georgien', NL: 'Holland', BE: 'Belsch', DE: 'Däitschland', FR: 'Frankräich', CH: 'Schwäiz', LU: 'Lëtzebuerg', GB: 'Groussbritannien', US: 'Vereenegt Staaten', IT: 'Italien', ES: 'Spanien' },
  en: { GE: 'Georgia', NL: 'Netherlands', BE: 'Belgium', DE: 'Germany', FR: 'France', CH: 'Switzerland', LU: 'Luxembourg', GB: 'United Kingdom', US: 'United States', IT: 'Italy', ES: 'Spain' },
  ka: { GE: 'საქართველო', NL: 'ნიდერლანდები', BE: 'ბელგია', DE: 'გერმანია', FR: 'საფრანგეთი', CH: 'შვეიცარია', LU: 'ლუქსემბურგი', GB: 'გაერთიანებული სამეფო', US: 'ამერიკის შეერთებული შტატები', IT: 'იტალია', ES: 'ესპანეთი' },
}

export function formatCountryName(countryCode, locale) {
  const code = String(countryCode || '').trim().toUpperCase()
  if (!/^[A-Z]{2}$/u.test(code)) return code
  return countryNames[locale]?.[code] || code
}
