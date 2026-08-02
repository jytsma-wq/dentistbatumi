import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export function render({ locale, page }) {
  return renderToString(
    <React.StrictMode>
      <App initialRoute={{ locale, page, notFound: false, hash: '' }} />
    </React.StrictMode>,
  )
}
