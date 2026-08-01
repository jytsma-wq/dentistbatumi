import { handlePrivateIntakeRequest } from '../server/private-intakes.js'

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url)

    if (requestUrl.pathname === '/api/clinical-files') {
      return handlePrivateIntakeRequest(request, env.CLINICAL_UPLOADS ?? null, 'clinical')
    }

    if (requestUrl.pathname === '/api/appointment-requests') {
      return handlePrivateIntakeRequest(request, env.CLINICAL_UPLOADS ?? null, 'appointment')
    }

    const acceptsHtml = request.headers.get('accept')?.includes('text/html')
    if (request.method === 'GET' && acceptsHtml) {
      const fallbackUrl = new URL(request.url)
      fallbackUrl.pathname = '/'
      return env.ASSETS.fetch(new Request(fallbackUrl, request))
    }

    return env.ASSETS.fetch(request)
  },
}
