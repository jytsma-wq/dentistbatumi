import { useEffect } from 'react'
import { clinicProfile } from './clinic-profile'
import { routePath, supportedLocales } from './routes'

const SITE_ORIGIN = clinicProfile.site.origin

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

export function usePageMeta({ locale, page, title, description, imageAlt, noIndex = false, omitCanonical = false }) {
  useEffect(() => {
    const canonical = `${SITE_ORIGIN}${routePath(locale, page)}`
    document.documentElement.lang = locale
    document.title = title

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: imageAlt })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: imageAlt })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow' })
    document.head.querySelectorAll('link[data-bdc-alternate]').forEach((element) => element.remove())
    if (omitCanonical) {
      document.head.querySelector('meta[property="og:url"]')?.remove()
      document.head.querySelector('link[rel="canonical"]')?.remove()
      return
    }

    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical })
    supportedLocales.forEach((alternateLocale) => {
      const alternate = document.createElement('link')
      alternate.rel = 'alternate'
      alternate.hreflang = alternateLocale
      alternate.href = `${SITE_ORIGIN}${routePath(alternateLocale, page)}`
      alternate.dataset.bdcAlternate = 'true'
      document.head.appendChild(alternate)
    })

    const defaultAlternate = document.createElement('link')
    defaultAlternate.rel = 'alternate'
    defaultAlternate.hreflang = 'x-default'
    defaultAlternate.href = `${SITE_ORIGIN}${routePath('nl', page)}`
    defaultAlternate.dataset.bdcAlternate = 'true'
    document.head.appendChild(defaultAlternate)
  }, [description, imageAlt, locale, noIndex, omitCanonical, page, title])
}
