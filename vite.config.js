import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'

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
    },
  }
}

export default defineConfig({
  plugins: [react(), sitesStaticWorker()],
})
