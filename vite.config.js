import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, writeFileSync } from 'node:fs'

function sitesStaticWorker() {
  return {
    name: 'sites-static-worker',
    closeBundle() {
      mkdirSync('dist/server', { recursive: true })
      writeFileSync('dist/server/index.js', `export default {
  async fetch(request, env) {
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
