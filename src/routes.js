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

  const section = legacySectionMap[segments[1]]
  if (section) return `/${locale}#${section}`

  const safeHash = hash.startsWith('#') ? hash : ''
  return isLocaleAlias ? `/${locale}${safeHash}` : null
}
