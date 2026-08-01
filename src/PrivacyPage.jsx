import { ArrowRight, Check, FileLock2, ShieldCheck } from 'lucide-react'
import { SiteFooter, SiteHeader } from './SiteChrome'
import { privacyContent } from './privacy-content'
import { routePath } from './routes'

export default function PrivacyPage({ lang, t, care, onLanguageChange }) {
  const privacy = privacyContent[lang]
  const homePath = routePath(lang)

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">{t.skip}</a>
      <SiteHeader lang={lang} page="privacy" t={t} care={care} onLanguageChange={onLanguageChange} />
      <main id="main" className="privacy-page">
        <section className="privacy-hero section">
          <div>
            <p className="eyebrow"><ShieldCheck size={17} />{privacy.eyebrow}</p>
            <h1>{privacy.title}</h1>
            <p>{privacy.lede}</p>
            <div className="privacy-actions">
              <a className="button button-primary" href={`${homePath}#contact`}>{privacy.contact}<ArrowRight size={17} /></a>
              <a className="text-button" href={homePath}>{privacy.back}<ArrowRight size={17} /></a>
            </div>
          </div>
          <aside><FileLock2 size={34} /><span>{privacy.statusTitle}</span><p>{privacy.statusText}</p></aside>
        </section>

        <section className="privacy-sections section" aria-label={privacy.eyebrow}>
          {privacy.sections.map(([title, text], index) => (
            <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{text}</p></article>
          ))}
        </section>

        <section className="privacy-checklist section">
          <div><p className="eyebrow">Batumi Dental Clinic</p><h2>{privacy.checklistTitle}</h2></div>
          <ul>{privacy.checklist.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul>
        </section>

        <section className="privacy-closing section">
          <ShieldCheck size={30} />
          <div><h2>{privacy.closingTitle}</h2><p>{privacy.closingText}</p></div>
        </section>
      </main>
      <SiteFooter lang={lang} page="privacy" t={t} care={care} onLanguageChange={onLanguageChange} />
    </div>
  )
}
