import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { aftercareContent } from '../src/aftercare-content.js'
import { clinicProfile } from '../src/clinic-profile.js'
import { content } from '../src/content.js'
import { pricesContent } from '../src/prices-content.js'
import { privacyContent } from '../src/privacy-content.js'
import { routePath, supportedLocales, supportedPages } from '../src/routes.js'
import worker from '../worker/index.js'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const clientDirectory = resolve(projectRoot, 'dist/client')
const siteChromePath = resolve(projectRoot, 'src/SiteChrome.jsx')

function outputPath(locale, page) {
  return resolve(clientDirectory, `${routePath(locale, page).slice(1)}.html`)
}

function normalizeText(value) {
  return value
    .replace(/<[^>]+>/gu, ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/\s+/gu, ' ')
    .trim()
}

function expectedHeading(locale, page) {
  if (page === 'aftercare') return aftercareContent[locale].hero.title
  if (page === 'privacy') return privacyContent[locale].title
  if (page === 'prices') return pricesContent[locale].hero.title
  return `${content[locale].heroLine1} ${content[locale].heroAccent}`
}

test('build emits 24 localized canonical-route HTML documents with hydrated bodies', async () => {
  for (const locale of supportedLocales) {
    for (const page of supportedPages) {
      const pathname = routePath(locale, page)
      const html = await readFile(outputPath(locale, page), 'utf8')
      const canonical = `${clinicProfile.site.origin}${pathname}`
      const canonicalTags = html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/giu) || []
      const alternateTags = html.match(/<link\b(?=[^>]*\brel="alternate")[^>]*>/giu) || []
      const headingMatch = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/iu)

      assert.match(html, new RegExp(`<html\\s+lang="${locale}"`, 'u'), `${pathname}: html language`)
      assert.match(html, /<meta\b(?=[^>]*\bname="robots")(?=[^>]*\bcontent="noindex, nofollow")[^>]*>/iu, `${pathname}: template remains noindex`)
      assert.equal(canonicalTags.length, 1, `${pathname}: one canonical`)
      assert.match(canonicalTags[0], new RegExp(`href="${canonical.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}"`, 'u'), `${pathname}: canonical target`)
      assert.equal(alternateTags.length, 7, `${pathname}: reciprocal hreflang set`)

      for (const alternateLocale of [...supportedLocales, 'x-default']) {
        const targetLocale = alternateLocale === 'x-default' ? 'nl' : alternateLocale
        const alternatePath = `${clinicProfile.site.origin}${routePath(targetLocale, page)}`
        assert.ok(
          alternateTags.some((tag) => tag.includes(`hreflang="${alternateLocale}"`) && tag.includes(`href="${alternatePath}"`)),
          `${pathname}: ${alternateLocale} alternate`,
        )
      }

      assert.ok(headingMatch, `${pathname}: visible H1`)
      assert.equal(normalizeText(headingMatch[1]), normalizeText(expectedHeading(locale, page)), `${pathname}: localized H1`)
      assert.match(html, /<div id="root">[\s\S]*<main\b/iu, `${pathname}: prerendered application body`)
      assert.match(html, /<script\b[^>]*type="module"/iu, `${pathname}: client entry retained`)
    }
  }
})

test('build keeps the Sites hosting identity in the deployable artifact', async () => {
  const source = JSON.parse(await readFile(resolve(projectRoot, '.openai/hosting.json'), 'utf8'))
  const built = JSON.parse(await readFile(resolve(projectRoot, 'dist/.openai/hosting.json'), 'utf8'))
  assert.deepEqual(built, source)
})

test('language links start from SSR-stable empty URL state', async () => {
  const source = await readFile(siteChromePath, 'utf8')
  const hrefHelper = source.match(/function localizedPageHref[\s\S]*?\n\}/u)

  assert.ok(hrefHelper, 'localized href helper exists')
  assert.doesNotMatch(hrefHelper[0], /\bwindow\b/u, 'render-time href helper does not read window')
  assert.match(source, /useState\(\{ search: '', hash: '' \}\)/u, 'server and hydration start with the same URL state')
  assert.match(source, /useEffect\([\s\S]*syncUrlState/u, 'browser URL state is synchronized after hydration')
})

test('worker serves the canonical route asset and keeps the 404 shell body empty', async () => {
  const requestedPaths = []
  const assets = {
    async fetch(request) {
      const pathname = new URL(request.url).pathname
      requestedPaths.push(pathname)
      const filePath = pathname === '/'
        ? resolve(clientDirectory, 'index.html')
        : resolve(clientDirectory, `${pathname.slice(1)}.html`)

      try {
        return new Response(await readFile(filePath, 'utf8'), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      } catch {
        return new Response('missing asset', { status: 404 })
      }
    },
  }

  const supported = await worker.fetch(
    new Request('https://clinic.example/fr/aftercare?utm_source=test', { headers: { Accept: 'text/html' } }),
    { ASSETS: assets },
  )
  assert.equal(supported.status, 200)
  assert.equal(requestedPaths[0], '/fr/aftercare')
  assert.match(await supported.text(), /<h1\b[^>]*>[\s\S]*?<\/h1>/iu)

  const missing = await worker.fetch(
    new Request('https://clinic.example/fr/route-inconnue', { headers: { Accept: 'text/html' } }),
    { ASSETS: assets },
  )
  const missingHtml = await missing.text()
  assert.equal(missing.status, 404)
  assert.equal(requestedPaths[1], '/')
  assert.match(missingHtml, /<div id="root"><\/div>/u)
  assert.doesNotMatch(missingHtml, /<h1\b/iu)
  assert.doesNotMatch(missingHtml, /rel="canonical"|rel="alternate"/iu)
})

test('local development falls back to the empty client shell before route assets exist', async () => {
  const requestedPaths = []
  const clientShell = await readFile(resolve(clientDirectory, 'index.html'), 'utf8')
  const assets = {
    async fetch(request) {
      const pathname = new URL(request.url).pathname
      requestedPaths.push(pathname)
      if (pathname === '/') {
        return new Response(clientShell, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
      }
      return new Response('missing development asset', { status: 404 })
    },
  }

  const response = await worker.fetch(
    new Request('http://localhost:5173/de/privacy', { headers: { Accept: 'text/html' } }),
    { ASSETS: assets },
  )

  assert.equal(response.status, 200)
  assert.deepEqual(requestedPaths, ['/de/privacy', '/'])
  assert.match(await response.text(), /<div id="root"><\/div>/u)
})
