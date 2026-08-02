/**
 * CLINIC PRODUCT CATALOG
 *
 * This is the only file that needs product-specific information.
 * Fill the empty values after the clinic has verified them in writing.
 * Duplicate an object when a category uses more than one product.
 * Empty values are never shown on the website.
 *
 * `origin` uses a two-letter country code, for example DE, CH or IT.
 * Documentation URLs must start with https://.
 * Documentation titles are locale objects, for example { en: 'Product sheet', fr: 'Fiche produit' }.
 */

export const treatmentProductCatalog = {
  products: [
    {
      id: 'crowns-1',
      category: 'crowns',
      name: '',
      brand: '',
      manufacturer: '',
      system: '',
      material: '',
      origin: '',
      documentation: [],
      warranty: { provider: '', durationMonths: null, termsUrl: '' },
      batchTraceability: null,
    },
    {
      id: 'fillings-1',
      category: 'fillings',
      name: '',
      brand: '',
      manufacturer: '',
      system: '',
      material: '',
      origin: '',
      documentation: [],
      warranty: { provider: '', durationMonths: null, termsUrl: '' },
      batchTraceability: null,
    },
    {
      id: 'implant-components-1',
      category: 'implantComponents',
      name: '',
      brand: '',
      manufacturer: '',
      system: '',
      material: '',
      origin: '',
      documentation: [],
      warranty: { provider: '', durationMonths: null, termsUrl: '' },
      batchTraceability: null,
    },
    {
      id: 'temporary-work-1',
      category: 'temporaryWork',
      name: '',
      brand: '',
      manufacturer: '',
      system: '',
      material: '',
      origin: '',
      documentation: [],
      warranty: { provider: '', durationMonths: null, termsUrl: '' },
      batchTraceability: null,
    },
  ],
}

export const productCategoryIds = Object.freeze([
  'crowns',
  'fillings',
  'implantComponents',
  'temporaryWork',
])

export function isProductValueFilled(value) {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export function isSafeProductUrl(value) {
  if (!isProductValueFilled(value)) return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function getVisibleProductFacts(product) {
  return ['brand', 'manufacturer', 'system', 'material', 'origin']
    .filter((key) => isProductValueFilled(product[key]))
    .map((key) => ({ key, value: product[key] }))
}

export function getVisibleProductDocuments(product, locale = 'en') {
  return (product.documentation || [])
    .filter((document) => isSafeProductUrl(document?.url))
    .map((document) => ({
      ...document,
      title: document?.title && typeof document.title === 'object' && !Array.isArray(document.title)
        ? String(document.title[locale] || '').trim()
        : '',
    }))
}

export function hasVisibleWarranty(product) {
  return isProductValueFilled(product.warranty?.provider)
    || Number.isFinite(product.warranty?.durationMonths)
    || isSafeProductUrl(product.warranty?.termsUrl)
}

export function hasProductDetails(product) {
  return isProductValueFilled(product.name)
    || getVisibleProductFacts(product).length > 0
    || getVisibleProductDocuments(product).length > 0
    || hasVisibleWarranty(product)
    || product.batchTraceability === true
}
