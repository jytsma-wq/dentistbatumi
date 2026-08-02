// One sellable design, one clinic identity per installation.
// Replace the values here before a client site is published under its own domain.
export const clinicProfile = {
  templateMode: true,
  site: {
    origin: 'https://marea-dental-batumi.jytsma.chatgpt.site',
  },
  brand: {
    name: 'Batumi Dental Clinic',
    shortName: 'Batumi',
    descriptor: 'Dental Clinic',
    wordmarkAsset: '/assets/batumi-dental-clinic-logo-header.png',
    socialAsset: '/assets/batumi-dental-clinic-social-v2.jpg',
  },
  contact: {
    bookingUrl: '',
    whatsappUrl: '',
    phone: '',
    email: '',
    address: '',
  },
  media: {
    hero: '/assets/dental-conversation.jpg',
    clinic: '/assets/dental-clinic.jpg',
    care: '/assets/dental-care.jpg',
    conversation: '/assets/dental-conversation.jpg',
    planning: '/assets/dental-planning.jpg',
    radiology: '/assets/dental-planning.jpg',
    consultation: '/assets/dental-consultation.jpg',
    localPatient: '/assets/batumi-coast-patient.webp',
    treatments: [
      '/assets/dental-clinic.jpg',
      '/assets/dental-care.jpg',
      '/assets/dental-conversation.jpg',
      '/assets/dental-planning.jpg',
      '/assets/dental-clinic.jpg',
      '/assets/dental-planning.jpg',
      '/assets/dental-conversation.jpg',
      '/assets/dental-consultation.jpg',
      '/assets/dental-conversation.jpg',
      '/assets/dental-care.jpg',
    ],
  },
  theme: {
    ink: '#14211f',
    primary: '#174b43',
    primaryDeep: '#0e3934',
    accent: '#a96343',
    page: '#f7f7f4',
    surface: '#ffffff',
  },
}

const clinicImageDimensions = {
  '/assets/dental-care.jpg': { width: 2000, height: 1333 },
  '/assets/dental-clinic.jpg': { width: 1800, height: 1202 },
  '/assets/dental-consultation.jpg': { width: 1800, height: 2700 },
  '/assets/dental-conversation.jpg': { width: 1800, height: 2700 },
  '/assets/dental-planning.jpg': { width: 1800, height: 1200 },
  '/assets/batumi-coast-patient.webp': { width: 1536, height: 1024 },
}

export function clinicImageProps(source, { priority = false } = {}) {
  return {
    ...(clinicImageDimensions[source] || {}),
    decoding: 'async',
    loading: priority ? 'eager' : 'lazy',
    fetchpriority: priority ? 'high' : 'auto',
  }
}

const safeHex = /^#[0-9a-f]{6}$/iu

export function clinicThemeVariables(profile = clinicProfile) {
  const theme = profile?.theme || {}
  const candidates = {
    '--ink': theme.ink,
    '--green': theme.primary,
    '--green-deep': theme.primaryDeep,
    '--copper': theme.accent,
    '--page': theme.page,
    '--surface': theme.surface,
  }

  return Object.fromEntries(
    Object.entries(candidates).filter(([, value]) => safeHex.test(String(value || ''))),
  )
}

export function getClinicContactUrl(kind, profile = clinicProfile) {
  const rawValue = kind === 'whatsapp' ? profile?.contact?.whatsappUrl : profile?.contact?.bookingUrl
  try {
    const url = new URL(String(rawValue || ''))
    if (url.protocol !== 'https:') return ''
    if (kind === 'whatsapp') {
      const hostname = url.hostname.toLowerCase()
      if (!['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(hostname)) return ''
    }
    return url.href
  } catch {
    return ''
  }
}
