import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'
import hostingConfig from './.openai/hosting.json' with { type: 'json' }

const r2Binding = hostingConfig.r2

const workerConfig = {
  name: 'batumi-dental-clinic',
  main: './worker/index.js',
  compatibility_date: '2026-08-01',
  assets: {
    binding: 'ASSETS',
    not_found_handling: 'single-page-application',
    run_worker_first: ['/api/*'],
  },
  r2_buckets: r2Binding
    ? [{ binding: r2Binding, bucket_name: 'site-creator-r2' }]
    : [],
}

export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      viteEnvironment: { name: 'server' },
      config: workerConfig,
    }),
  ],
})
