import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { createServer as createViteServer } from 'vite'
import { localizeHtmlShell } from '../server/page-shell.js'
import { routePath, supportedLocales, supportedPages } from '../src/routes.js'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const clientDirectory = resolve(projectRoot, 'dist/client')
const hostingManifestSource = resolve(projectRoot, '.openai/hosting.json')
const hostingManifestOutput = resolve(projectRoot, 'dist/.openai/hosting.json')
const templatePath = resolve(clientDirectory, 'index.html')
const rootOutlet = '<div id="root"></div>'

const template = await readFile(templatePath, 'utf8')
if (!template.includes(rootOutlet)) {
  throw new Error(`Prerender outlet not found in ${templatePath}`)
}

const vite = await createViteServer({
  root: projectRoot,
  appType: 'custom',
  configFile: false,
  logLevel: 'error',
  plugins: [react()],
  server: { middlewareMode: true },
})

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
  let renderedRouteCount = 0

  for (const locale of supportedLocales) {
    for (const page of supportedPages) {
      const pathname = routePath(locale, page)
      const appHtml = render({ locale, page })
      const localizedHtml = localizeHtmlShell(
        template.replace(rootOutlet, `<div id="root">${appHtml}</div>`),
        { locale, page },
      )
      const outputPath = resolve(clientDirectory, `${pathname.slice(1)}.html`)

      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, `${localizedHtml.trimEnd()}\n`, 'utf8')
      renderedRouteCount += 1
    }
  }

  const expectedRouteCount = supportedLocales.length * supportedPages.length
  if (renderedRouteCount !== expectedRouteCount) {
    throw new Error(`Expected ${expectedRouteCount} prerendered routes, wrote ${renderedRouteCount}`)
  }

  await mkdir(dirname(hostingManifestOutput), { recursive: true })
  await copyFile(hostingManifestSource, hostingManifestOutput)
} finally {
  await vite.close()
}
