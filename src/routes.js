export const supportedLocales = ['nl', 'de', 'fr', 'lb', 'en', 'ka']
export const supportedPages = ['home', 'aftercare', 'privacy', 'prices']

const localeAliases = {
  lu: 'lb',
}

const legacySectionMap = {
  treatments: 'behandelingen',
  treatment: 'behandelingen',
  services: 'behandelingen',
  results: 'behandelingen',
  clinic: 'kliniek',
  about: 'kliniek',
  team: 'kliniek',
  patients: 'patienten',
  international: 'patienten',
  local: 'patienten',
  contact: 'contact',
  appointment: 'contact',
  upload: 'contact',
  whatsapp: 'whatsapp',
  faq: 'vragen',
}

const legacyTreatmentMap = {
  'general-dentistry': '01',
  'emergency-dentist': '10',
  'dental-implants': '06',
  'crowns-bridges': '05',
  'full-mouth-rehabilitation': '05',
  'veneers-cosmetic-dentistry': '08',
}

export function normalizePathname(pathname = '/') {
  const segments = pathname.split('/').filter(Boolean)
  return segments.length > 0 ? `/${segments.join('/')}` : '/'
}

export function parseRoute(pathname = '/') {
  const segments = pathname.split('/').filter(Boolean)
  const requestedLocale = localeAliases[segments[0]] || segments[0]
  const hasSupportedLocale = supportedLocales.includes(requestedLocale)
  const locale = hasSupportedLocale ? requestedLocale : 'nl'
  const requestedPage = segments[1]
  const page = hasSupportedLocale && ['aftercare', 'privacy', 'prices'].includes(requestedPage)
    ? requestedPage
    : 'home'

  return { locale, page }
}

export function routePath(locale, page = 'home') {
  const safeLocale = supportedLocales.includes(locale) ? locale : 'nl'
  return ['aftercare', 'privacy', 'prices'].includes(page) ? `/${safeLocale}/${page}` : `/${safeLocale}`
}

export function isSupportedRoutePath(pathname = '/') {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 1) return supportedLocales.includes(segments[0])
  return segments.length === 2
    && supportedLocales.includes(segments[0])
    && ['aftercare', 'privacy', 'prices'].includes(segments[1])
}

export function legacyRouteTarget(pathname = '/', hash = '') {
  const segments = pathname.split('/').filter(Boolean)
  const requestedLocale = segments[0]
  const locale = localeAliases[requestedLocale] || requestedLocale
  const isLocaleAlias = locale !== requestedLocale
  if (!supportedLocales.includes(locale)) return null

  if (['aftercare', 'privacy', 'prices'].includes(segments[1])) {
    return isLocaleAlias ? `/${locale}/${segments[1]}` : null
  }

  if (['fees', 'fee-list', 'pricing', 'pricelist'].includes(segments[1])) return `/${locale}/prices`

  const treatmentNumber = segments.length === 3 && segments[1] === 'treatments'
    ? legacyTreatmentMap[segments[2]]
    : null
  if (treatmentNumber) return `/${locale}#behandeling-${treatmentNumber}`

  const section = legacySectionMap[segments[1]]
  if (section) return `/${locale}#${section}`

  const safeHash = hash.startsWith('#') ? hash : ''
  return isLocaleAlias && segments.length === 1 ? `/${locale}${safeHash}` : null
}
