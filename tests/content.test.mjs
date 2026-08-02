import test from 'node:test'
import assert from 'node:assert/strict'
import { content, languages } from '../src/content.js'
import { aftercareContent } from '../src/aftercare-content.js'
import { interfaceContent } from '../src/interface-content.js'
import {
  getVisibleProductDocuments,
  getVisibleProductFacts,
  hasProductDetails,
  isSafeProductUrl,
  productCategoryIds,
  treatmentProductCatalog,
} from '../src/clinic-products.js'
import { materialsContent } from '../src/materials-content.js'
import { privacyContent } from '../src/privacy-content.js'
import { teamSectionContent } from '../src/team-content.js'
import { experienceContent } from '../src/experience-content.js'
import { diagnosticsContent } from '../src/diagnostics-content.js'
import {
  clinicPriceEntries,
  clinicPriceList,
  getVisiblePriceCategories,
  isVisiblePriceItem,
  priceCategoryOrder,
  priceServiceTemplates,
} from '../src/clinic-prices.js'
import { pricesContent } from '../src/prices-content.js'
import {
  clinicTrustData,
  getPublishedClinicCredentials,
  getPublishedDentists,
  getPublishedReviews,
  getPublishedSocials,
  isSafeSocialUrl,
  isSafeTrustUrl,
} from '../src/clinic-trust-data.js'
import { clinicProfile, getClinicContactUrl } from '../src/clinic-profile.js'
import { trustContent } from '../src/trust-content.js'
import { legacyRouteTarget, parseRoute, routePath, supportedLocales } from '../src/routes.js'
import worker from '../worker/index.js'

const localeCodes = languages.map(({ code }) => code)

test('all six site languages have complete home and aftercare content', () => {
  assert.deepEqual(localeCodes, ['nl', 'de', 'fr', 'lb', 'en', 'ka'])
  assert.deepEqual(languages.map(({ flag }) => flag), ['🇳🇱', '🇩🇪', '🇫🇷', '🇱🇺', '🇬🇧', '🇬🇪'])
  assert.deepEqual(Object.keys(content), localeCodes)
  assert.deepEqual(Object.keys(aftercareContent), localeCodes)
  assert.deepEqual(Object.keys(privacyContent), localeCodes)
  assert.deepEqual(Object.keys(teamSectionContent), localeCodes)
  assert.deepEqual(Object.keys(materialsContent), localeCodes)
  assert.deepEqual(Object.keys(pricesContent), localeCodes)
  assert.deepEqual(Object.keys(trustContent), localeCodes)
  assert.deepEqual(Object.keys(experienceContent), localeCodes)
  assert.deepEqual(Object.keys(diagnosticsContent), localeCodes)

  for (const locale of localeCodes) {
    const home = content[locale]
    const care = aftercareContent[locale]
    const privacy = privacyContent[locale]
    const team = teamSectionContent[locale]
    const materials = materialsContent[locale]
    const prices = pricesContent[locale]
    const trust = trustContent[locale]
    const experience = experienceContent[locale]
    const diagnostics = diagnosticsContent[locale]

    assert.equal(home.nav.length, 4, `${locale}: home navigation`)
    assert.equal(home.treatments.length, 10, `${locale}: treatments`)
    assert.deepEqual(home.treatments.map(({ number }) => number), ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'], `${locale}: universal treatment order`)
    assert.equal(home.days.length, 5, `${locale}: treatment journey`)
    assert.match(home.consultFacts[1], /EN.*KA/, `${locale}: six-language service line`)
    assert.equal(care.journey.steps.length, 5, `${locale}: aftercare journey`)
    assert.deepEqual(care.firstWeek.cards.map(({ tone }) => tone), ['normal', 'call', 'emergency'])
    assert.equal(care.handout.groups.length, 3, `${locale}: printable handout groups`)
    assert.ok(care.hero.supportLine.length > 4, `${locale}: support promise`)
    assert.ok(care.certainty.note.length > 40, `${locale}: insurance boundary`)
    assert.ok(care.prototypeNote.length > 40, `${locale}: prototype boundary`)
    assert.equal(privacy.sections.length, 6, `${locale}: privacy topics`)
    assert.equal(privacy.checklist.length, 5, `${locale}: launch checklist`)
    assert.equal(team.profiles.length, 3, `${locale}: team roles`)
    assert.ok(team.title.length > 8, `${locale}: team title`)
    assert.ok(team.verification.length > 40, `${locale}: team verification boundary`)
    assert.ok(team.profiles.every(({ role, status, text }) => role && status && text), `${locale}: complete team profiles`)
    assert.deepEqual(materials.categories.map(({ id }) => id), productCategoryIds, `${locale}: universal material category order`)
    assert.ok(materials.categories.every(({ title, text }) => title.length > 3 && text.length > 40), `${locale}: complete material explanations`)
    assert.ok(materials.transparencyNote.length > 60, `${locale}: material transparency promise`)
    assert.ok(materials.verifiedOnly.length > 30, `${locale}: verified-product boundary`)
    assert.ok(prices.navLabel.length > 3, `${locale}: price navigation`)
    assert.equal(Object.keys(prices.categories).length, priceCategoryOrder.length, `${locale}: price categories`)
    assert.equal(Object.keys(prices.services).length, Object.values(priceServiceTemplates).flat().length, `${locale}: price service labels`)
    assert.ok(trust.team.title.length > 10, `${locale}: team trust title`)
    assert.ok(trust.credentials.title.length > 10, `${locale}: credential title`)
    assert.ok(trust.reviews.title.length > 10, `${locale}: review title`)
    assert.ok(experience.priceTitle.length > 10, `${locale}: price invitation`)
    assert.equal(diagnostics.principles.length, 3, `${locale}: diagnostic principles`)
    assert.ok(diagnostics.title.length > 12, `${locale}: diagnostic title`)
  }
})

test('clinic-specific prices and proof fail closed until verified', () => {
  assert.deepEqual(clinicPriceEntries, {})
  assert.deepEqual(getVisiblePriceCategories(clinicPriceList), [])
  assert.deepEqual(getPublishedDentists(clinicTrustData, 'nl'), [])
  assert.deepEqual(getPublishedClinicCredentials(clinicTrustData, 'nl'), [])
  assert.deepEqual(getPublishedReviews(clinicTrustData, 'nl'), [])
  assert.deepEqual(getPublishedSocials(clinicTrustData), {})
  assert.equal(isSafeTrustUrl('https://example.com/profile'), true)
  assert.equal(isSafeTrustUrl('http://example.com/profile'), false)
  assert.equal(isSafeTrustUrl('javascript:alert(1)'), false)
  assert.equal(isSafeSocialUrl('https://www.facebook.com/verified-clinic', 'facebook'), true)
  assert.equal(isSafeSocialUrl('https://example.com/verified-clinic', 'facebook'), false)
  assert.equal(isVisiblePriceItem({ enabled: true, verified: true, price: { mode: 'fixed', min: 100 } }), false, 'a visible fee requires a verification date')
  assert.equal(isVisiblePriceItem({ enabled: true, verified: true, lastVerified: '2026-08-02', price: { mode: 'fixed', min: 100 } }), true)
  assert.equal(getClinicContactUrl('whatsapp'), '', 'demo does not invent a WhatsApp destination')
  assert.equal(getClinicContactUrl('booking'), '', 'demo does not invent a booking destination')
  assert.equal(clinicProfile.templateMode, true, 'sales demo stays noindex until onboarding is complete')
})

test('clinic product catalog is ready for verified facts without showing empty claims', () => {
  const products = treatmentProductCatalog.products
  assert.deepEqual(products.map(({ category }) => category), productCategoryIds)
  assert.equal(new Set(products.map(({ id }) => id)).size, products.length, 'unique product ids')
  assert.ok(products.every((product) => !hasProductDetails(product)), 'empty catalog templates stay hidden')
  assert.ok(products.every((product) => getVisibleProductFacts(product).length === 0), 'empty facts stay hidden')
  assert.ok(products.every((product) => getVisibleProductDocuments(product).length === 0), 'empty documents stay hidden')

  const verifiedProduct = {
    ...products[0],
    brand: 'Verified brand',
    origin: 'DE',
    documentation: [
      { title: 'Unsafe', url: 'http://example.com/file.pdf' },
      { title: 'Product sheet', url: 'https://example.com/file.pdf' },
    ],
    warranty: { provider: '', durationMonths: 24, termsUrl: 'https://example.com/warranty' },
  }

  assert.equal(hasProductDetails(verifiedProduct), true)
  assert.deepEqual(getVisibleProductFacts(verifiedProduct).map(({ key }) => key), ['brand', 'origin'])
  assert.deepEqual(getVisibleProductDocuments(verifiedProduct).map(({ title }) => title), ['Product sheet'])
  assert.equal(isSafeProductUrl('https://example.com/file.pdf'), true)
  assert.equal(isSafeProductUrl('javascript:alert(1)'), false)
})

test('Batumi Dental Clinic branding and care principles are complete', () => {
  assert.doesNotMatch(JSON.stringify({ content, aftercareContent, interfaceContent, teamSectionContent }), /Marea/i)
  for (const locale of localeCodes) {
    assert.equal(interfaceContent[locale].principles.length, 6, `${locale}: care principles`)
    assert.ok(interfaceContent[locale].bookNow.length > 4, `${locale}: booking action`)
    assert.ok(interfaceContent[locale].whatsappPrompt.includes('WhatsApp'), `${locale}: WhatsApp action`)
  }
})

test('localized routes resolve and preserve the requested page', () => {
  assert.deepEqual(supportedLocales, localeCodes)
  assert.deepEqual(parseRoute('/fr/aftercare'), { locale: 'fr', page: 'aftercare' })
  assert.deepEqual(parseRoute('/ka'), { locale: 'ka', page: 'home' })
  assert.deepEqual(parseRoute('/fr/privacy'), { locale: 'fr', page: 'privacy' })
  assert.deepEqual(parseRoute('/ka/prices'), { locale: 'ka', page: 'prices' })
  assert.deepEqual(parseRoute('/unsupported/aftercare'), { locale: 'nl', page: 'home' })
  assert.equal(routePath('de', 'aftercare'), '/de/aftercare')
  assert.equal(routePath('ka', 'privacy'), '/ka/privacy')
  assert.equal(routePath('fr', 'prices'), '/fr/prices')
  assert.equal(routePath('lb'), '/lb')
  assert.equal(legacyRouteTarget('/nl/treatments'), '/nl#behandelingen')
  assert.equal(legacyRouteTarget('/nl/treatments/implants'), '/nl#behandelingen')
  assert.equal(legacyRouteTarget('/de/results'), '/de#behandelingen')
  assert.equal(legacyRouteTarget('/fr/international'), '/fr#patienten')
  assert.equal(legacyRouteTarget('/ka/local'), '/ka#patienten')
  assert.equal(legacyRouteTarget('/en/upload'), '/en#contact')
  assert.equal(legacyRouteTarget('/fr/contact'), '/fr#contact')
  assert.equal(legacyRouteTarget('/ka/aftercare'), null)
  assert.equal(legacyRouteTarget('/en/privacy'), null)
  assert.equal(legacyRouteTarget('/nl/prices'), null)
  assert.equal(legacyRouteTarget('/de/fees'), '/de/prices')
})

test('aftercare copy avoids invented emergency contacts or insurance prices', () => {
  const serialized = JSON.stringify(aftercareContent)
  assert.doesNotMatch(serialized, /\+995[\s-]?\d{3}/)
  assert.doesNotMatch(serialized, /€\s?\d+/)
  assert.doesNotMatch(serialized, /24\/?7 English|English-speaking emergency number/i)
})

test('Georgian pages contain Georgian script', () => {
  assert.match(content.ka.heroText, /[ა-ჰ]/)
  assert.match(aftercareContent.ka.metaDescription, /[ა-ჰ]/)
  assert.match(teamSectionContent.ka.title, /[ა-ჰ]/)
  assert.match(pricesContent.ka.metaDescription, /[ა-ჰ]/)
  assert.match(trustContent.ka.team.title, /[ა-ჰ]/)
  assert.match(content.ka.introText, /ბათუმის მცხოვრებლებს/, 'Georgian residents are named as a primary audience')
  assert.match(interfaceContent.ka.careFeatureText, /ადგილობრივი/, 'aftercare explicitly includes local patients')
})

test('worker serves the SPA shell for localized deep links', async () => {
  const requestedPaths = []
  const assets = {
    async fetch(request) {
      const pathname = new URL(request.url).pathname
      requestedPaths.push(pathname)
      if (pathname === '/') {
        return new Response('<!doctype html><title>Batumi Dental Clinic</title>', {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      }
      return new Response(null, { status: 404 })
    },
  }

  const response = await worker.fetch(
    new Request('https://clinic.example/fr/aftercare', {
      headers: { Accept: 'text/html' },
    }),
    { ASSETS: assets },
  )

  assert.equal(response.status, 200)
  assert.match(await response.text(), /Batumi Dental Clinic/)
  assert.deepEqual(requestedPaths, ['/'])
})
