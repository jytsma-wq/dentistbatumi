import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'

const siteLocales = ['nl', 'de', 'fr', 'lb', 'en', 'ka']
const sitePages = ['aftercare', 'privacy']
const legacyPages = [
  'treatments',
  'clinic',
  'contact',
  'international',
  'local',
  'results',
  'upload',
  'about',
  'team',
  'patients',
  'appointment',
  'whatsapp',
  'faq',
  'services',
  'treatment',
]
const legacyTreatmentSlugs = [
  'general-dentistry',
  'emergency-dentist',
  'dental-implants',
  'crowns-bridges',
  'full-mouth-rehabilitation',
  'veneers-cosmetic-dentistry',
]

function writeStaticRouteEntrypoints() {
  const routePaths = siteLocales.flatMap((locale) => [
    locale,
    ...sitePages.map((page) => `${locale}/${page}`),
    ...legacyPages.map((page) => `${locale}/${page}`),
    ...legacyTreatmentSlugs.map((slug) => `${locale}/treatments/${slug}`),
  ])

  for (const routePath of routePaths) {
    const destination = `dist/${routePath}.html`
    mkdirSync(destination.slice(0, destination.lastIndexOf('/')), { recursive: true })
    copyFileSync('dist/index.html', destination)
  }
}

function sitesStaticWorker() {
  return {
    name: 'sites-static-worker',
    closeBundle() {
      mkdirSync('dist/server', { recursive: true })
      copyFileSync('server/private-intakes.js', 'dist/server/private-intakes.js')
      writeFileSync('dist/server/index.js', `import { handlePrivateIntakeRequest } from './private-intakes.js'

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url)
    if (requestUrl.pathname === '/api/clinical-files') {
      return handlePrivateIntakeRequest(request, env.CLINICAL_UPLOADS ?? null, 'clinical')
    }
    if (requestUrl.pathname === '/api/appointment-requests') {
      return handlePrivateIntakeRequest(request, env.CLINICAL_UPLOADS ?? null, 'appointment')
    }
    if (!env.ASSETS?.fetch) return new Response('Site assets unavailable', { status: 503 })
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || request.method !== 'GET') return response
    const acceptsHtml = request.headers.get('accept')?.includes('text/html')
    if (!acceptsHtml) return response
    const url = new URL(request.url)
    url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  }
}\n`)
      writeStaticRouteEntrypoints()
    },
  }
}

export default defineConfig({
  plugins: [react(), sitesStaticWorker()],
})
