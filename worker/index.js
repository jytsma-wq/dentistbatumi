import { handlePrivateIntakeRequest } from '../server/private-intakes.js'
import { localizeHtmlShell, withHtmlSecurityHeaders } from '../server/page-shell.js'
import { notFoundContent } from '../src/not-found-content.js'
import { isSupportedRoutePath, legacyRouteTarget, normalizePathname, parseRoute, routePath } from '../src/routes.js'

function permanentRedirect(requestUrl, target) {
  const redirectUrl = new URL(target, requestUrl)
  redirectUrl.search = requestUrl.search
  if (!redirectUrl.hash) redirectUrl.hash = requestUrl.hash
  return Response.redirect(redirectUrl, 308)
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url)

    if (requestUrl.pathname === '/api/clinical-files') {
      return handlePrivateIntakeRequest(request, env.CLINICAL_UPLOADS ?? null, 'clinical')
    }

    if (requestUrl.pathname === '/api/appointment-requests') {
      return handlePrivateIntakeRequest(request, env.CLINICAL_UPLOADS ?? null, 'appointment')
    }

    const isDocumentMethod = request.method === 'GET' || request.method === 'HEAD'
    if (isDocumentMethod) {
      const canonicalPathname = normalizePathname(requestUrl.pathname)
      if (canonicalPathname !== requestUrl.pathname) {
        return permanentRedirect(requestUrl, canonicalPathname)
      }

      if (requestUrl.pathname === '/') {
        return permanentRedirect(requestUrl, '/nl')
      }

      const legacyTarget = legacyRouteTarget(requestUrl.pathname, requestUrl.hash)
      if (legacyTarget) return permanentRedirect(requestUrl, legacyTarget)

      const isSupportedRoute = isSupportedRoutePath(requestUrl.pathname)
      const acceptsHtml = request.headers.get('accept')?.toLowerCase().includes('text/html') ?? false
      if (!isSupportedRoute && !acceptsHtml) return env.ASSETS.fetch(request)

      const route = parseRoute(requestUrl.pathname)
      const fallbackUrl = new URL(request.url)
      fallbackUrl.pathname = isSupportedRoute ? routePath(route.locale, route.page) : '/'
      fallbackUrl.search = ''
      fallbackUrl.hash = ''
      let shell = await env.ASSETS.fetch(new Request(fallbackUrl, {
        method: 'GET',
        headers: { Accept: 'text/html' },
      }))
      const isLocalDevelopment = ['127.0.0.1', 'localhost'].includes(requestUrl.hostname)
      if (isSupportedRoute && !shell.ok && isLocalDevelopment) {
        fallbackUrl.pathname = '/'
        shell = await env.ASSETS.fetch(new Request(fallbackUrl, {
          method: 'GET',
          headers: { Accept: 'text/html' },
        }))
      }
      const shellContentType = shell.headers.get('content-type')?.toLowerCase() ?? ''
      if (!shell.ok) {
        if (request.method === 'GET') return shell
        return new Response(null, {
          status: shell.status,
          statusText: shell.statusText,
          headers: shell.headers,
        })
      }
      if (!shellContentType.includes('text/html')) {
        return new Response(request.method === 'HEAD' ? null : notFoundContent[route.locale].shellUnavailable, {
          status: 502,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Language': route.locale,
            'X-Content-Type-Options': 'nosniff',
          },
        })
      }
      const html = localizeHtmlShell(await shell.text(), { ...route, notFound: !isSupportedRoute })
      return new Response(request.method === 'HEAD' ? null : html, {
        status: isSupportedRoute ? 200 : 404,
        headers: withHtmlSecurityHeaders(shell.headers, {
          allowInlineScripts: ['127.0.0.1', 'localhost'].includes(requestUrl.hostname),
          locale: route.locale,
        }),
      })
    }

    return env.ASSETS.fetch(request)
  },
}
