export const localeCodes = {
  nl: 'nl-NL',
  de: 'de-DE',
  fr: 'fr-FR',
  lb: 'lb-LU',
  en: 'en-GB',
  ka: 'ka-GE',
}

export function formatAmount(value, currency, lang) {
  return new Intl.NumberFormat(localeCodes[lang] || lang, {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

export function formatPrice(item, currency, lang, labels) {
  const price = item.price
  if (price.mode === 'onRequest') return labels.onRequest

  const minimum = formatAmount(price.min, currency, lang)
  if (price.mode === 'from') return labels.from.replace('{price}', minimum)
  if (price.mode === 'range') return `${minimum} – ${formatAmount(price.max, currency, lang)}`
  return minimum
}
