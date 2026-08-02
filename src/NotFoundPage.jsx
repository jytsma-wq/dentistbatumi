import { ArrowRight, SearchX } from 'lucide-react'
import { notFoundContent } from './not-found-content'
import { routePath } from './routes'
import { SiteFooter, SiteHeader } from './SiteChrome'

export default function NotFoundPage({ lang, t, care, onLanguageChange }) {
  const copy = notFoundContent[lang]

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">{t.skip}</a>
      <SiteHeader lang={lang} page="notFound" t={t} care={care} onLanguageChange={onLanguageChange} />
      <main id="main" className="not-found-page">
        <div>
          <SearchX size={56} aria-hidden="true" />
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.text}</p>
          <a className="button button-primary" href={routePath(lang)}>{copy.action}<ArrowRight size={18} /></a>
        </div>
      </main>
      <SiteFooter lang={lang} page="notFound" t={t} care={care} onLanguageChange={onLanguageChange} />
    </div>
  )
}
