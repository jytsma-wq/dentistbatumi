import { aftercareContent } from '../src/aftercare-content.js'
import { clinicProfile } from '../src/clinic-profile.js'
import { content } from '../src/content.js'
import { homeMetaDescriptions } from '../src/home-meta.js'
import { pricesContent } from '../src/prices-content.js'
import { privacyContent } from '../src/privacy-content.js'
import { notFoundContent } from '../src/not-found-content.js'
import { routePath, supportedLocales } from '../src/routes.js'

export const htmlSecurityHeaders = {
  'Cache-Control': 'no-cache, max-age=0',
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' https://fonts.gstatic.com data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; upgrade-insecure-requests",
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}

export function getPageMetadata(locale, page, { notFound = false } = {}) {
  const home = content[locale]
  const care = aftercareContent[locale]
  const prices = pricesContent[locale]
  const privacy = privacyContent[locale]

  if (notFound) return { title: notFoundContent[locale].metaTitle, description: notFoundContent[locale].text }
  if (page === 'aftercare') return { title: care.metaTitle, description: care.metaDescription }
  if (page === 'privacy') return { title: privacy.metaTitle, description: privacy.metaDescription }
  if (page === 'prices') {
    return {
      title: prices.metaTitle,
      description: clinicProfile.templateMode ? prices.templateMetaDescription : prices.metaDescription,
    }
  }

  return {
    title: `${clinicProfile.brand.name} — ${home.footerLine}`,
    description: homeMetaDescriptions[locale],
  }
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function upsertMeta(html, attribute, key, value) {
  const tag = `<meta ${attribute}="${escapeAttribute(key)}" content="${escapeAttribute(value)}" />`
  const pattern = new RegExp(`<meta\\b[^>]*\\b${attribute}=["']${escapePattern(key)}["'][^>]*>`, 'iu')
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function removeGeneratedLinks(html) {
  return html
    .replace(/\s*<link\b[^>]*\brel=["']canonical["'][^>]*>/giu, '')
    .replace(/\s*<link\b[^>]*\brel=["']alternate["'][^>]*>/giu, '')
}

export function localizeHtmlShell(html, { locale, page, notFound = false }) {
  const metadata = getPageMetadata(locale, page, { notFound })
  const origin = clinicProfile.site.origin
  const canonical = `${origin}${routePath(locale, page)}`
  const socialImage = `${origin}${clinicProfile.brand.socialAsset}`
  const robots = clinicProfile.templateMode || notFound ? 'noindex, nofollow' : 'index, follow'
  const alternates = [
    ...supportedLocales.map((alternateLocale) => (
      `<link rel="alternate" hreflang="${alternateLocale}" href="${origin}${routePath(alternateLocale, page)}" data-bdc-alternate="true" />`
    )),
    `<link rel="alternate" hreflang="x-default" href="${origin}${routePath('nl', page)}" data-bdc-alternate="true" />`,
  ].join('\n    ')

  let localized = html
    .replace(/<html\b[^>]*\blang=["'][^"']*["']/iu, `<html lang="${escapeAttribute(locale)}"`)
    .replace(/<title>[^<]*<\/title>/iu, `<title>${escapeAttribute(metadata.title)}</title>`)

  localized = upsertMeta(localized, 'name', 'description', metadata.description)
  localized = upsertMeta(localized, 'name', 'robots', robots)
  localized = upsertMeta(localized, 'property', 'og:title', metadata.title)
  localized = upsertMeta(localized, 'property', 'og:description', metadata.description)
  if (!notFound) localized = upsertMeta(localized, 'property', 'og:url', canonical)
  localized = upsertMeta(localized, 'property', 'og:image', socialImage)
  localized = upsertMeta(localized, 'name', 'twitter:title', metadata.title)
  localized = upsertMeta(localized, 'name', 'twitter:description', metadata.description)
  localized = upsertMeta(localized, 'name', 'twitter:image', socialImage)
  localized = removeGeneratedLinks(localized)

  if (notFound) return localized
  return localized.replace('</head>', `    <link rel="canonical" href="${canonical}" />\n    ${alternates}\n  </head>`)
}

export function withHtmlSecurityHeaders(headers = new Headers(), { allowInlineScripts = false, locale } = {}) {
  const secured = new Headers(headers)
  ;[
    'Accept-Ranges',
    'Content-Encoding',
    'Content-Length',
    'Content-Location',
    'Content-MD5',
    'Content-Range',
    'Digest',
    'ETag',
    'Last-Modified',
    'Trailer',
    'Transfer-Encoding',
  ].forEach((name) => secured.delete(name))
  Object.entries(htmlSecurityHeaders).forEach(([name, value]) => secured.set(name, value))
  if (allowInlineScripts) {
    secured.set(
      'Content-Security-Policy',
      htmlSecurityHeaders['Content-Security-Policy'].replace("script-src 'self'", "script-src 'self' 'unsafe-inline'"),
    )
  }
  secured.set('Content-Type', 'text/html; charset=utf-8')
  if (locale) secured.set('Content-Language', locale)
  return secured
}
