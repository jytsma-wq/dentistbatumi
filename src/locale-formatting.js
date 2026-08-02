export const countryCodes = ['GE', 'NL', 'BE', 'DE', 'FR', 'CH', 'LU', 'GB', 'US', 'IT', 'ES']

export function formatCountryName(countryCode, locale) {
  const code = String(countryCode || '').trim().toUpperCase()
  if (!/^[A-Z]{2}$/u.test(code)) return code

  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}
