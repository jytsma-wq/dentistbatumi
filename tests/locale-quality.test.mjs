import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { aftercareContent } from '../src/aftercare-content.js'
import { localizedValue } from '../src/clinic-prices.js'
import { getPublishedDentists, localizeTrustField } from '../src/clinic-trust-data.js'
import { content, languages } from '../src/content.js'
import { diagnosticsContent } from '../src/diagnostics-content.js'
import { experienceContent } from '../src/experience-content.js'
import { interfaceContent } from '../src/interface-content.js'
import { countryCodes, formatCountryName } from '../src/locale-formatting.js'
import { materialsContent } from '../src/materials-content.js'
import { notFoundContent } from '../src/not-found-content.js'
import { formatPrice } from '../src/price-formatting.js'
import { pricesContent } from '../src/prices-content.js'
import { privacyContent } from '../src/privacy-content.js'
import { teamSectionContent } from '../src/team-content.js'
import { trustContent } from '../src/trust-content.js'
import { localizeHtmlShell } from '../server/page-shell.js'

const localeCodes = languages.map(({ code }) => code)
const catalogs = {
  aftercareContent,
  content,
  diagnosticsContent,
  experienceContent,
  interfaceContent,
  materialsContent,
  notFoundContent,
  pricesContent,
  privacyContent,
  teamSectionContent,
  trustContent,
}

function valueType(value) {
  if (Array.isArray(value)) return 'array'
  if (value === null) return 'null'
  return typeof value
}

function collectShape(value, path = '$', output = []) {
  output.push([path, valueType(value)])
  if (Array.isArray(value)) {
    output.push([`${path}.length`, value.length])
    value.forEach((item, index) => collectShape(item, `${path}[${index}]`, output))
  } else if (value && typeof value === 'object') {
    Object.keys(value).sort().forEach((key) => collectShape(value[key], `${path}.${key}`, output))
  }
  return output
}

function collectStrings(value, path = '$', output = new Map()) {
  if (typeof value === 'string') {
    output.set(path, value)
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${path}[${index}]`, output))
  } else if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => collectStrings(value[key], `${path}.${key}`, output))
  }
  return output
}

function tokens(value, pattern) {
  return [...String(value).matchAll(pattern)].map(([token]) => token).sort()
}

test('all locale catalogs keep identical recursive structure and non-empty copy', () => {
  for (const [catalogName, catalog] of Object.entries(catalogs)) {
    assert.deepEqual(Object.keys(catalog), localeCodes, `${catalogName}: locale order`)
    const referenceShape = collectShape(catalog.en)
    for (const locale of localeCodes) {
      assert.deepEqual(collectShape(catalog[locale]), referenceShape, `${catalogName}.${locale}: recursive shape`)
      for (const [path, value] of collectStrings(catalog[locale])) {
        assert.ok(value.trim(), `${catalogName}.${locale}${path}: non-empty string`)
      }
    }
  }
})

test('placeholders and numeric signatures remain aligned across translations', () => {
  const placeholderPattern = /\{[a-z][a-z0-9_]*\}/giu
  const numberPattern = /\d+/gu

  for (const [catalogName, catalog] of Object.entries(catalogs)) {
    const reference = collectStrings(catalog.en)
    for (const locale of localeCodes) {
      const localized = collectStrings(catalog[locale])
      for (const [path, referenceValue] of reference) {
        assert.deepEqual(tokens(localized.get(path), placeholderPattern), tokens(referenceValue, placeholderPattern), `${catalogName}.${locale}${path}: placeholders`)
        assert.deepEqual(tokens(localized.get(path), numberPattern), tokens(referenceValue, numberPattern), `${catalogName}.${locale}${path}: numbers`)
      }
    }
  }
})

test('known mistranslations and mixed-language fallbacks cannot return', () => {
  assert.deepEqual(languages.map(({ short }) => short), ['NL', 'DE', 'FR', 'LB', 'EN', 'KA'])
  for (const locale of localeCodes) assert.doesNotMatch(content[locale].consultFacts[1], /\bLU\b/u, `${locale}: no obsolete LU language code`)

  const serialized = JSON.stringify({ aftercareContent, content, interfaceContent, privacyContent, pricesContent, teamSectionContent })
  assert.doesNotMatch(serialized, /კერძოდ|საზღვრისპირა|Réckfallkontakt|Nach de selwechten|Behandelnden|Behandelnd Zänndoktesch|stored non-publicly/iu)
  assert.doesNotMatch(JSON.stringify(aftercareContent.nl), /contactroute|belroute|back-uproute/iu)
  assert.doesNotMatch(JSON.stringify(aftercareContent.de), /Telefonweg|Kontaktweg/iu)
  assert.doesNotMatch(JSON.stringify(aftercareContent.en), /contact route|telephone route|back-up route/iu)
  assert.doesNotMatch(JSON.stringify(privacyContent.fr), /contact confidentialité|Qui peut accéder \?/iu)

  const dutchPatientCopy = JSON.stringify({
    aftercare: aftercareContent.nl,
    content: content.nl,
    diagnostics: diagnosticsContent.nl,
    experience: experienceContent.nl,
    interface: interfaceContent.nl,
    materials: materialsContent.nl,
    prices: pricesContent.nl,
    privacy: privacyContent.nl,
    team: teamSectionContent.nl,
    trust: trustContent.nl,
  })
  assert.doesNotMatch(dutchPatientCopy, /(^|[^A-Za-zÀ-ÿ])(?:je|jij|jou|jouw)(?=$|[^A-Za-zÀ-ÿ])/iu)
})

test('clinic-entered locale objects fail closed instead of leaking English or Dutch', () => {
  assert.equal(localizedValue({ en: 'English only', nl: 'Alleen Nederlands' }, 'fr'), '')
  assert.equal(localizedValue({ en: 'English only' }, 'ka', 'Gelokaliseerde fallback'), 'Gelokaliseerde fallback')
  assert.equal(localizeTrustField({ en: 'English only', nl: 'Alleen Nederlands' }, 'fr'), '')
  assert.equal(localizeTrustField('Invariant clinic name', 'ka'), 'Invariant clinic name')

  const englishOnlyDentist = {
    dentists: [{
      id: 'verified-dentist',
      status: 'verified',
      published: true,
      name: { en: 'Verified name' },
      role: { en: 'Dentist' },
      qualifications: [],
    }],
  }
  assert.equal(getPublishedDentists(englishOnlyDentist, 'fr').length, 0)
  assert.equal(getPublishedDentists(englishOnlyDentist, 'en').length, 1)
})

test('country names and from-prices follow the active locale grammar', () => {
  for (const locale of localeCodes) {
    for (const countryCode of countryCodes) assert.ok(formatCountryName(countryCode, locale), `${locale}: ${countryCode}`)
  }
  assert.match(formatCountryName('GE', 'ka'), /[ა-ჰ]/u)
  assert.notEqual(formatCountryName('GE', 'fr'), formatCountryName('GE', 'en'))
  assert.equal(formatCountryName('LU', 'lb'), 'Lëtzebuerg')
  assert.equal(formatCountryName('CH', 'ka'), 'შვეიცარია')
  assert.equal(formatCountryName('XX', 'nl'), 'XX')

  const item = { price: { mode: 'from', min: 100 } }
  assert.match(formatPrice(item, 'GEL', 'nl', pricesContent.nl.labels), /^Vanaf /u)
  assert.match(formatPrice(item, 'GEL', 'de', pricesContent.de.labels), /^Ab /u)
  assert.match(formatPrice(item, 'GEL', 'fr', pricesContent.fr.labels), /^À partir de /u)
  assert.match(formatPrice(item, 'GEL', 'lb', pricesContent.lb.labels), /^Vun .* un$/u)
  assert.match(formatPrice(item, 'GEL', 'en', pricesContent.en.labels), /^From /u)
  assert.match(formatPrice(item, 'GEL', 'ka', pricesContent.ka.labels), /-დან$/u)
})

test('social image alternatives are localized in the server shell', () => {
  const shell = '<!doctype html><html lang="nl"><head><title>Test</title></head><body></body></html>'
  for (const locale of localeCodes) {
    const html = localizeHtmlShell(shell, { locale, page: 'home' })
    const expected = interfaceContent[locale].photoAltClinic
    assert.match(html, new RegExp(`<meta property="og:image:alt" content="${expected}" />`, 'u'), `${locale}: Open Graph alt`)
    assert.match(html, new RegExp(`<meta name="twitter:image:alt" content="${expected}" />`, 'u'), `${locale}: Twitter alt`)
  }
})

test('visible interface source contains no hardcoded language fallback', async () => {
  const [app, chrome, trust, index] = await Promise.all([
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/SiteChrome.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/TrustSections.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
  ])
  assert.doesNotMatch(app, /lang === 'ka' \? 'GE' : 'NL'/u)
  assert.match(app, /defaultValue="" required/u)
  assert.match(app, /window\.location\.search/u)
  assert.doesNotMatch(chrome, /clinicProfile\.brand\.descriptor|trustContent\[lang\] \|\|/u)
  assert.match(chrome, /window\.location\.search/u)
  assert.ok((chrome.match(/\binert=/gu) || []).length >= 4, 'hidden navigation surfaces are inert')
  assert.doesNotMatch(trust, />TEAM</u)
  assert.doesNotMatch(trust, /trustContent\[lang\] \|\|/u)
  assert.match(index, /property="og:image:alt" content="Moderne tandartsstoel/u)
  assert.match(index, /name="twitter:image:alt" content="Moderne tandartsstoel/u)
})
