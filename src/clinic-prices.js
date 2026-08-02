// One clinic, one source of truth. Copy this file per installation and replace
// only facts supplied and approved by that clinic. No competitor or demo rates
// belong in the public catalogue.

export const priceCategoryOrder = [
  'diagnostics',
  'prevention',
  'restorative',
  'endodontics',
  'surgery',
  'prosthetics',
  'implants',
  'aesthetic',
  'orthodontics',
  'children',
]

export const priceServiceTemplates = {
  diagnostics: ['consultation', 'smallXray', 'panoramicXray', 'cbctScan', 'treatmentPlan'],
  prevention: ['hygiene', 'deepCleaning', 'fluoride'],
  restorative: ['compositeFilling', 'inlayOnlay', 'toothBuildUp'],
  endodontics: ['rootCanalFront', 'rootCanalPremolar', 'rootCanalMolar', 'retreatment'],
  surgery: ['simpleExtraction', 'surgicalExtraction', 'wisdomTooth', 'boneGraft'],
  prosthetics: ['ceramicCrown', 'zirconiaCrown', 'implantCrown', 'bridgeUnit', 'partialDenture', 'fullDenture'],
  implants: ['implantPlacement', 'healingAbutment', 'implantBundle', 'allOnFour'],
  aesthetic: ['whitening', 'ceramicVeneer', 'compositeVeneer', 'gumContouring'],
  orthodontics: ['orthodonticConsultation', 'fixedBraces', 'clearAligners', 'retainer'],
  children: ['childConsultation', 'childFilling', 'fissureSealant', 'milkToothExtraction'],
}

// Add clinic-approved entries here. The treatment ID determines the category;
// everything else is specific to this installation. See PRICE-LIST.md.
export const clinicPriceEntries = {}

function createPriceTemplate(id) {
  const entry = clinicPriceEntries[id] || {}
  return {
    id,
    enabled: false,
    verified: false,
    name: {},
    description: {},
    unit: 'treatment',
    includes: [],
    excludes: [],
    materialSystem: {},
    duration: {},
    diagnostics: {},
    note: {},
    lastVerified: '', // YYYY-MM-DD
    ...entry,
    price: {
      mode: 'fixed', // fixed | from | range | onRequest
      min: null,
      max: null,
      ...(entry.price || {}),
    },
    visits: {
      min: null,
      max: null,
      ...(entry.visits || {}),
    },
  }
}

export const clinicPriceList = {
  clinicId: 'batumi-dental-clinic',
  currency: 'GEL',
  lastVerified: '',
  showIndicativeConversions: false,
  categories: priceCategoryOrder.map((id) => ({
    id,
    items: priceServiceTemplates[id].map(createPriceTemplate),
  })),
}

export function localizedValue(value, locale, fallback = '') {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback

  const candidate = value[locale] ?? value.en ?? value.nl ?? fallback
  return typeof candidate === 'string' ? candidate.trim() : fallback
}

export function localizedList(values, locale) {
  if (!Array.isArray(values)) return []
  return values.map((value) => localizedValue(value, locale)).filter(Boolean)
}

function isValidAmount(value) {
  return Number.isFinite(value) && value >= 0
}

function hasPublishablePrice(price) {
  if (!price || typeof price !== 'object') return false
  if (price.mode === 'onRequest') return true
  if (price.mode === 'fixed' || price.mode === 'from') return isValidAmount(price.min)
  return price.mode === 'range'
    && isValidAmount(price.min)
    && isValidAmount(price.max)
    && price.max >= price.min
}

export function isVisiblePriceItem(item) {
  return item?.enabled === true
    && item?.verified === true
    && /^\d{4}-\d{2}-\d{2}$/u.test(item.lastVerified || '')
    && hasPublishablePrice(item.price)
}

export function getVisiblePriceCategories(priceList = clinicPriceList) {
  if (!priceList || !Array.isArray(priceList.categories)) return []

  return priceList.categories
    .map((category) => ({
      ...category,
      items: Array.isArray(category.items) ? category.items.filter(isVisiblePriceItem) : [],
    }))
    .filter((category) => category.items.length > 0)
}

export function getPriceListVerificationDate(priceList = clinicPriceList) {
  const itemDates = getVisiblePriceCategories(priceList)
    .flatMap((category) => category.items)
    .map((item) => item.lastVerified)
    .filter((value) => /^\d{4}-\d{2}-\d{2}$/u.test(value || ''))

  const listDate = /^\d{4}-\d{2}-\d{2}$/u.test(priceList?.lastVerified || '')
    ? priceList.lastVerified
    : ''

  // The oldest item date is the honest date on which the complete visible list
  // was last known to be checked, rather than borrowing freshness from one row.
  return [listDate, ...itemDates].filter(Boolean).sort().at(0) || ''
}

export function hasPriceDetail(item) {
  if (!item) return false
  const hasLocalizedListValue = (values) => Array.isArray(values) && values.some((value) => (
    typeof value === 'string' ? Boolean(value.trim()) : value && Object.values(value).some(Boolean)
  ))

  return hasLocalizedListValue(item.includes)
    || hasLocalizedListValue(item.excludes)
    || Object.values(item.materialSystem || {}).some(Boolean)
    || Number.isFinite(item.visits?.min)
    || Number.isFinite(item.visits?.max)
    || Object.values(item.duration || {}).some(Boolean)
    || Object.values(item.diagnostics || {}).some(Boolean)
    || Object.values(item.note || {}).some(Boolean)
}
