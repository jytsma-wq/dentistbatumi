export const supportedLocales = ['nl', 'de', 'fr', 'lb', 'en', 'ka']

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
  const hasSupportedLocale = supportedLocales.includes(segments[0])
  const locale = hasSupportedLocale ? segments[0] : 'nl'
  const requestedPage = segments[1]
  const page = hasSupportedLocale && ['aftercare', 'privacy'].includes(requestedPage)
    ? requestedPage
    : 'home'

  return { locale, page }
}

export function routePath(locale, page = 'home') {
  const safeLocale = supportedLocales.includes(locale) ? locale : 'nl'
  return ['aftercare', 'privacy'].includes(page) ? `/${safeLocale}/${page}` : `/${safeLocale}`
}

export function legacyRouteTarget(pathname = '/') {
  const segments = pathname.split('/').filter(Boolean)
  if (!supportedLocales.includes(segments[0]) || ['aftercare', 'privacy'].includes(segments[1])) return null

  const section = legacySectionMap[segments[1]]
  return section ? `/${segments[0]}#${section}` : null
}
