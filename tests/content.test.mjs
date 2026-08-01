import test from 'node:test'
import assert from 'node:assert/strict'
import { content, languages } from '../src/content.js'
import { aftercareContent } from '../src/aftercare-content.js'
import { interfaceContent } from '../src/interface-content.js'
import { privacyContent } from '../src/privacy-content.js'
import { legacyRouteTarget, parseRoute, routePath, supportedLocales } from '../src/routes.js'

const localeCodes = languages.map(({ code }) => code)

test('all six site languages have complete home and aftercare content', () => {
  assert.deepEqual(localeCodes, ['nl', 'de', 'fr', 'lb', 'en', 'ka'])
  assert.deepEqual(Object.keys(content), localeCodes)
  assert.deepEqual(Object.keys(aftercareContent), localeCodes)
  assert.deepEqual(Object.keys(privacyContent), localeCodes)

  for (const locale of localeCodes) {
    const home = content[locale]
    const care = aftercareContent[locale]
    const privacy = privacyContent[locale]

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
  }
})

test('Batumi Dental Clinic branding and care principles are complete', () => {
  assert.doesNotMatch(JSON.stringify({ content, aftercareContent, interfaceContent }), /Marea/i)
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
  assert.deepEqual(parseRoute('/unsupported/aftercare'), { locale: 'nl', page: 'home' })
  assert.equal(routePath('de', 'aftercare'), '/de/aftercare')
  assert.equal(routePath('ka', 'privacy'), '/ka/privacy')
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
})
