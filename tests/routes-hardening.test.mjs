import assert from 'node:assert/strict'
import test from 'node:test'
import { browserUrlStateChangeEvent, pushBrowserUrl, replaceBrowserUrl } from '../src/browser-history.js'
import { notFoundContent } from '../src/not-found-content.js'
import { legacyRouteTarget, normalizePathname, supportedLocales } from '../src/routes.js'
import worker from '../worker/index.js'

const treatmentTargets = {
  'general-dentistry': '01',
  'emergency-dentist': '10',
  'dental-implants': '06',
  'crowns-bridges': '05',
  'full-mouth-rehabilitation': '05',
  'veneers-cosmetic-dentistry': '08',
}

function unusedAssets() {
  return {
    async fetch() {
      assert.fail('redirects must not fetch the application shell')
    },
  }
}

test('programmatic history writes notify localized links of URL-state changes', () => {
  const originalWindow = globalThis.window
  const events = new EventTarget()
  const historyCalls = []

  globalThis.window = {
    history: {
      pushState: (...args) => historyCalls.push(['pushState', ...args]),
      replaceState: (...args) => historyCalls.push(['replaceState', ...args]),
    },
    dispatchEvent: events.dispatchEvent.bind(events),
  }

  let notifications = 0
  events.addEventListener(browserUrlStateChangeEvent, () => {
    notifications += 1
  })

  try {
    replaceBrowserUrl('/nl?ref=mail#behandeling-06')
    pushBrowserUrl('/fr?ref=mail#behandeling-06')
    assert.deepEqual(historyCalls, [
      ['replaceState', {}, '', '/nl?ref=mail#behandeling-06'],
      ['pushState', {}, '', '/fr?ref=mail#behandeling-06'],
    ])
    assert.equal(notifications, 2)
  } finally {
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
  }
})

test('legacy treatment slugs select the matching current treatment in every locale', () => {
  for (const locale of supportedLocales) {
    for (const [slug, number] of Object.entries(treatmentTargets)) {
      assert.equal(
        legacyRouteTarget(`/${locale}/treatments/${slug}`),
        `/${locale}#behandeling-${number}`,
        `${locale}: ${slug}`,
      )
    }
  }

  assert.equal(legacyRouteTarget('/lu/treatments/dental-implants'), '/lb#behandeling-06')
  assert.equal(legacyRouteTarget('/nl/treatments/unknown-treatment'), '/nl#behandelingen')
})

test('path normalization removes repeated and trailing slashes', () => {
  assert.equal(normalizePathname('/'), '/')
  assert.equal(normalizePathname('//nl///prices//'), '/nl/prices')
  assert.equal(normalizePathname('/fr/aftercare/'), '/fr/aftercare')
})

test('308 redirects retain URL state and semantic treatment fragments', async () => {
  const root = await worker.fetch(
    new Request('https://clinic.example/?utm_source=directory#clinic'),
    { ASSETS: unusedAssets() },
  )
  assert.equal(root.status, 308)
  assert.equal(root.headers.get('location'), 'https://clinic.example/nl?utm_source=directory#clinic')

  const alias = await worker.fetch(
    new Request('https://clinic.example/lu/prices?utm_medium=referral#fees'),
    { ASSETS: unusedAssets() },
  )
  assert.equal(alias.status, 308)
  assert.equal(alias.headers.get('location'), 'https://clinic.example/lb/prices?utm_medium=referral#fees')

  const treatment = await worker.fetch(
    new Request('https://clinic.example/en/treatments/dental-implants?utm_campaign=legacy'),
    { ASSETS: unusedAssets() },
  )
  assert.equal(treatment.status, 308)
  assert.equal(treatment.headers.get('location'), 'https://clinic.example/en?utm_campaign=legacy#behandeling-06')
})

test('worker redirects repeated and trailing slashes to one canonical pathname', async () => {
  for (const [source, target] of [
    [
      'https://clinic.example//fr///prices//?utm_source=directory#fees',
      'https://clinic.example/fr/prices?utm_source=directory#fees',
    ],
    [
      'https://clinic.example/ka/aftercare/?ref=mail#recovery',
      'https://clinic.example/ka/aftercare?ref=mail#recovery',
    ],
  ]) {
    const response = await worker.fetch(new Request(source), { ASSETS: unusedAssets() })
    assert.equal(response.status, 308, source)
    assert.equal(response.headers.get('location'), target, source)
  }
})

test('invalid application shells return a localized 502 response', async () => {
  const invalidAssets = {
    async fetch() {
      return new Response('not an HTML shell', {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    },
  }

  for (const locale of supportedLocales) {
    const response = await worker.fetch(
      new Request(`https://clinic.example/${locale}`, { headers: { Accept: 'text/html' } }),
      { ASSETS: invalidAssets },
    )
    assert.equal(response.status, 502, locale)
    assert.equal(response.headers.get('content-language'), locale, locale)
    assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0', locale)
    assert.equal(await response.text(), notFoundContent[locale].shellUnavailable, locale)
  }

  const head = await worker.fetch(
    new Request('https://clinic.example/de', { method: 'HEAD', headers: { Accept: 'text/html' } }),
    { ASSETS: invalidAssets },
  )
  assert.equal(head.status, 502)
  assert.equal(head.headers.get('content-language'), 'de')
  assert.equal(await head.text(), '')
})
