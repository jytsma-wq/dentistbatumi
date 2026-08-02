import React from 'react'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import App from './App'

export function render({ locale, page }) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough()
    const chunks = []
    let renderError = null
    let settled = false

    const finishWithError = (error) => {
      if (settled) return
      settled = true
      reject(error)
    }

    output.on('data', (chunk) => chunks.push(chunk))
    output.on('error', finishWithError)
    output.on('end', () => {
      if (settled) return
      settled = true
      resolve(Buffer.concat(chunks).toString('utf8'))
    })

    const stream = renderToPipeableStream(
      <React.StrictMode>
        <App initialRoute={{ locale, page, notFound: false, hash: '' }} />
      </React.StrictMode>,
      {
        onAllReady() {
          clearTimeout(timeout)
          if (renderError) {
            stream.abort()
            finishWithError(renderError)
            return
          }
          stream.pipe(output)
        },
        onShellError(error) {
          clearTimeout(timeout)
          finishWithError(error)
        },
        onError(error) {
          renderError = renderError || error
        },
      },
    )

    const timeout = setTimeout(() => {
      stream.abort()
      finishWithError(new Error(`Timed out while prerendering ${locale}/${page}`))
    }, 10_000)
  })
}
