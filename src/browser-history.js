export const browserUrlStateChangeEvent = 'batumi-dental:url-state-change'

function writeBrowserUrl(method, url) {
  if (typeof window === 'undefined') return
  window.history[method]({}, '', url)
  window.dispatchEvent(new Event(browserUrlStateChangeEvent))
}

export function pushBrowserUrl(url) {
  writeBrowserUrl('pushState', url)
}

export function replaceBrowserUrl(url) {
  writeBrowserUrl('replaceState', url)
}
