import { useEffect } from 'react'
import { routePath, supportedLocales } from './routes'

const SITE_ORIGIN = 'https://marea-dental-batumi.jytsma.chatgpt.site'

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

export function usePageMeta({ locale, page, title, description }) {
  useEffect(() => {
    const canonical = `${SITE_ORIGIN}${routePath(locale, page)}`
    document.documentElement.lang = locale
    document.title = title

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical })

    document.head.querySelectorAll('link[data-bdc-alternate]').forEach((element) => element.remove())
    supportedLocales.forEach((alternateLocale) => {
      const alternate = document.createElement('link')
      alternate.rel = 'alternate'
      alternate.hreflang = alternateLocale
      alternate.href = `${SITE_ORIGIN}${routePath(alternateLocale, page)}`
      alternate.dataset.bdcAlternate = 'true'
      document.head.appendChild(alternate)
    })
  }, [description, locale, page, title])
}
