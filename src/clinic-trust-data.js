const supportedLocales = ['nl', 'de', 'fr', 'lb', 'en', 'ka']

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Resolve a field that may be a plain string or an object keyed by locale.
 * English and Dutch are conservative editorial fallbacks for clinic-entered data.
 */
export function localizeTrustField(value, locale = 'en') {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''

  const preferredLocales = [locale, 'en', 'nl', ...supportedLocales]
  for (const code of preferredLocales) {
    const localizedValue = cleanText(value[code])
    if (localizedValue) return localizedValue
  }

  return ''
}

/**
 * Public proof links must be HTTPS. Relative asset paths are handled separately.
 */
export function isSafeTrustUrl(value) {
  try {
    const url = new URL(String(value || ''))
    return url.protocol === 'https:' && Boolean(url.hostname)
  } catch {
    return false
  }
}

function isValidTrustDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(String(value || ''))) return false
  const parsed = new Date(`${value}T12:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function isSafeSocialUrl(value, network) {
  if (!isSafeTrustUrl(value)) return false
  const hostname = new URL(value).hostname.toLowerCase()
  const expectedHost = network === 'facebook' ? 'facebook.com' : network === 'instagram' ? 'instagram.com' : ''
  return Boolean(expectedHost) && (hostname === expectedHost || hostname.endsWith(`.${expectedHost}`))
}

export function isSafeTrustImage(value) {
  const source = cleanText(value)
  return /^\/assets\/[a-z0-9/_-]+\.(avif|gif|jpe?g|png|webp)$/iu.test(source) || isSafeTrustUrl(source)
}

function hasVerifiedStatus(entry) {
  return entry?.status === 'verified' && entry?.published === true
}

function visibleQualifications(dentist, locale) {
  return (dentist.qualifications || []).filter((qualification) => (
    qualification?.status === 'verified'
    && qualification?.published === true
    && Boolean(localizeTrustField(qualification.title, locale))
    && Boolean(localizeTrustField(qualification.institution, locale))
    && /^\d{4}$/u.test(String(qualification.year || ''))
    && isSafeTrustUrl(qualification.verificationUrl)
  ))
}

export function getPublishedDentists(data = clinicTrustData, locale = 'en') {
  return (data.dentists || [])
    .filter((dentist) => (
      hasVerifiedStatus(dentist)
      && Boolean(localizeTrustField(dentist.name, locale))
      && Boolean(localizeTrustField(dentist.role, locale))
    ))
    .map((dentist) => ({
      ...dentist,
      qualifications: visibleQualifications(dentist, locale),
    }))
}

export function getPublishedClinicCredentials(data = clinicTrustData, locale = 'en') {
  return (data.clinicCredentials || []).filter((credential) => (
    hasVerifiedStatus(credential)
    && Boolean(localizeTrustField(credential.title, locale))
    && Boolean(localizeTrustField(credential.issuer, locale))
    && Boolean(cleanText(credential.identifier))
    && isValidTrustDate(credential.issuedOn)
    && (isSafeTrustUrl(credential.verificationUrl) || isSafeTrustUrl(credential.documentUrl))
  ))
}

export function getPublishedReviews(data = clinicTrustData, locale = 'en') {
  return (data.reviews || []).filter((review) => (
    hasVerifiedStatus(review)
    && review.consent === true
    && Boolean(localizeTrustField(review.quote, locale))
    && Boolean(cleanText(review.authorDisplay))
    && Boolean(cleanText(review.sourceName))
    && isSafeTrustUrl(review.sourceUrl)
  ))
}

export function getPublishedSocials(data = clinicTrustData) {
  const socials = data.socials || {}
  return ['facebook', 'instagram'].reduce((visible, network) => {
    const entry = socials[network]
    if (hasVerifiedStatus(entry) && isSafeSocialUrl(entry.url, network)) visible[network] = entry.url
    return visible
  }, {})
}

/**
 * Single source of truth for clinic-specific proof.
 *
 * Nothing in these collections is rendered as evidence unless it is explicitly
 * marked `status: 'verified'` and `published: true`. Reviews additionally require
 * patient consent and a public HTTPS source. This keeps a sales demo attractive
 * without silently turning template content into medical or reputational claims.
 */
export const clinicTrustData = {
  schemaVersion: 1,
  dentists: [],
  clinicCredentials: [],
  reviews: [],
  socials: {
    facebook: {
      status: 'pending',
      published: false,
      url: '',
    },
    instagram: {
      status: 'pending',
      published: false,
      url: '',
    },
  },
}

export const trustDataRequirements = {
  dentist: [
    'id',
    'status',
    'published',
    'name',
    'role',
    'image',
    'bio',
    'languages',
    'qualifications',
    'registration',
  ],
  qualification: ['status', 'published', 'title', 'institution', 'year', 'verificationUrl'],
  clinicCredential: ['id', 'status', 'published', 'title', 'issuer', 'identifier', 'issuedOn', 'expiresOn', 'verificationUrl'],
  review: ['id', 'status', 'published', 'consent', 'quote', 'authorDisplay', 'date', 'sourceName', 'sourceUrl'],
  social: ['status', 'published', 'url'],
}
