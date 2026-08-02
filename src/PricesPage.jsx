import {
  ArrowRight,
  CalendarDays,
  Check,
  FileCheck2,
  MessageCircle,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import {
  clinicPriceList,
  getPriceListVerificationDate,
  getVisiblePriceCategories,
  localizedList,
  localizedValue,
} from './clinic-prices'
import { clinicProfile } from './clinic-profile'
import { pricesContent } from './prices-content'
import { SiteFooter, SiteHeader } from './SiteChrome'
import { routePath } from './routes'
import './prices.css'

const localeCodes = {
  nl: 'nl-NL',
  de: 'de-DE',
  fr: 'fr-FR',
  lb: 'lb-LU',
  en: 'en-GB',
  ka: 'ka-GE',
}

function formatAmount(value, currency, lang) {
  return new Intl.NumberFormat(localeCodes[lang] || lang, {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

function formatPrice(item, currency, lang, labels) {
  const price = item.price
  if (price.mode === 'onRequest') return labels.onRequest

  const minimum = formatAmount(price.min, currency, lang)
  if (price.mode === 'from') return `${labels.from} ${minimum}`
  if (price.mode === 'range') return `${minimum} – ${formatAmount(price.max, currency, lang)}`
  return minimum
}

function formatVisits(visits, labels, lang) {
  const minimum = Number.isFinite(visits?.min) ? visits.min : null
  const maximum = Number.isFinite(visits?.max) ? visits.max : null
  if (minimum === null && maximum === null) return ''
  if ((minimum ?? maximum) === 1 && (maximum ?? minimum) === 1) return labels.oneVisit

  const numberFormat = new Intl.NumberFormat(localeCodes[lang] || lang)
  const minLabel = numberFormat.format(minimum ?? maximum)
  const maxLabel = numberFormat.format(maximum ?? minimum)
  if (minLabel === maxLabel) return labels.exactVisits.replace('{count}', minLabel)
  return labels.multipleVisits.replace('{min}', minLabel).replace('{max}', maxLabel)
}

function formatVerificationDate(value, lang) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(localeCodes[lang] || lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function PriceDetails({ item, lang, copy }) {
  const includes = localizedList(item.includes, lang)
  const excludes = localizedList(item.excludes, lang)
  const materialSystem = localizedValue(item.materialSystem, lang)
  const visits = formatVisits(item.visits, copy.labels, lang)
  const duration = localizedValue(item.duration, lang)
  const diagnostics = localizedValue(item.diagnostics, lang)
  const note = localizedValue(item.note, lang)
  const details = [
    [copy.labels.materialSystem, materialSystem],
    [copy.labels.visits, visits],
    [copy.labels.duration, duration],
    [copy.labels.diagnostics, diagnostics],
    [copy.labels.note, note],
  ].filter(([, value]) => value)

  if (!includes.length && !excludes.length && !details.length) return null

  return (
    <div className="price-item-details">
      {details.length > 0 && (
        <dl>
          {details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      )}
      {(includes.length > 0 || excludes.length > 0) && (
        <div className="price-scope">
          {includes.length > 0 && (
            <section>
              <h4>{copy.labels.includes}</h4>
              <ul>{includes.map((value) => <li key={value}><Check size={15} aria-hidden="true" />{value}</li>)}</ul>
            </section>
          )}
          {excludes.length > 0 && (
            <section>
              <h4>{copy.labels.excludes}</h4>
              <ul>{excludes.map((value) => <li key={value}>{value}</li>)}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

export default function PricesPage({ lang, t, care, onLanguageChange }) {
  const copy = pricesContent[lang] || pricesContent.en
  const homePath = routePath(lang)
  const contactPath = `${homePath}#contact`
  const whatsappPath = `${homePath}#whatsapp`
  const uploadPath = `${homePath}#contact`
  const categories = getVisiblePriceCategories(clinicPriceList)
  const verificationDate = formatVerificationDate(getPriceListVerificationDate(clinicPriceList), lang)

  return (
    <div className="site-shell prices-shell">
      <a className="skip-link" href="#prices-main">{t.skip}</a>
      <SiteHeader lang={lang} page="prices" t={t} care={care} onLanguageChange={onLanguageChange} />

      <main id="prices-main">
        <section className="prices-hero" aria-labelledby="prices-title">
          <div className="prices-hero-copy">
            <p className="eyebrow"><ReceiptText size={17} aria-hidden="true" />{copy.hero.eyebrow}</p>
            <h1 id="prices-title">{copy.hero.title}</h1>
            <p className="prices-hero-lede">{categories.length > 0 ? copy.hero.lead : copy.hero.emptyLead}</p>
            <div className="prices-hero-actions">
              <a className="button button-primary" href={contactPath}><CalendarDays size={18} />{copy.hero.primary}<ArrowRight size={18} /></a>
              <a className="text-button" href={whatsappPath}><MessageCircle size={18} />{copy.hero.secondary}</a>
            </div>
            <p className="prices-hero-note"><ShieldCheck size={17} />{copy.hero.note}</p>
          </div>

          <div className="prices-hero-composition" aria-hidden="true">
            <span>GEL</span>
            <strong>₾</strong>
            <div><ReceiptText /><i>01</i></div>
            <div><ScanLine /><i>02</i></div>
            <div><FileCheck2 /><i>03</i></div>
          </div>
        </section>

        <section className="price-principles" aria-label={copy.principlesLabel}>
          <p>{copy.principlesLabel}</p>
          <div>
            {copy.principles.map(([title, text], index) => (
              <article key={title}><span>0{index + 1}</span><strong>{title}</strong><small>{text}</small></article>
            ))}
          </div>
        </section>

        <section className="price-catalogue section" aria-labelledby="price-list-title">
          <header className="price-catalogue-heading split-heading">
            <div><p className="eyebrow">{copy.list.eyebrow}</p><h2 id="price-list-title">{copy.list.title}</h2></div>
            <div>
              <p>{copy.list.intro}</p>
              {verificationDate && <small><FileCheck2 size={15} />{copy.list.verified}: <time dateTime={getPriceListVerificationDate(clinicPriceList)}>{verificationDate}</time></small>}
            </div>
          </header>

          {categories.length > 0 ? (
            <div className="price-category-list">
              {categories.map((category, categoryIndex) => (
                <section className="price-category" key={category.id} aria-labelledby={`price-category-${category.id}`}>
                  <header>
                    <span>{String(categoryIndex + 1).padStart(2, '0')}</span>
                    <h3 id={`price-category-${category.id}`}>{copy.categories[category.id] || category.id}</h3>
                  </header>
                  <div className="price-items">
                    {category.items.map((item) => {
                      const name = localizedValue(item.name, lang, copy.services[item.id] || item.id)
                      const description = localizedValue(item.description, lang)
                      const unit = copy.labels.unit[item.unit]
                      return (
                        <article className="price-item" key={item.id}>
                          <div className="price-item-summary">
                            <div><h4>{name}</h4>{description && <p>{description}</p>}</div>
                            <p className="price-amount">
                              <strong>{formatPrice(item, clinicPriceList.currency, lang, copy.labels)}</strong>
                              {item.price.mode !== 'onRequest' && unit && <small>{unit}</small>}
                            </p>
                          </div>
                          <PriceDetails item={item} lang={lang} copy={copy} />
                        </article>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="price-empty-state">
              <figure><img src={clinicProfile.media.planning} alt="" loading="lazy" /></figure>
              <div>
                <p className="eyebrow">{copy.list.emptyEyebrow}</p>
                <h3>{copy.list.emptyTitle}</h3>
                <p>{copy.list.emptyText}</p>
                <strong>{copy.list.emptyAction}</strong>
                <a className="button button-primary" href={contactPath}>{copy.hero.primary}<ArrowRight size={18} /></a>
              </div>
            </div>
          )}
        </section>

        <section className="price-transparency" aria-labelledby="price-transparency-title">
          <div className="price-transparency-intro">
            <p className="eyebrow light">{copy.transparency.eyebrow}</p>
            <h2 id="price-transparency-title">{copy.transparency.title}</h2>
            <p>{copy.transparency.intro}</p>
          </div>
          <div className="price-transparency-steps">
            {copy.transparency.steps.map(([number, title, text]) => (
              <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>
            ))}
          </div>
        </section>

        <section className="price-closing" aria-labelledby="price-closing-title">
          <div>
            <p className="eyebrow">{copy.closing.eyebrow}</p>
            <h2 id="price-closing-title">{copy.closing.title}</h2>
            <p>{copy.closing.text}</p>
            <div>
              <a className="button button-primary" href={contactPath}>{copy.closing.primary}<ArrowRight size={18} /></a>
              <a className="text-button" href={uploadPath}><Upload size={18} />{copy.closing.secondary}</a>
            </div>
          </div>
          <figure><img src={clinicProfile.media.consultation} alt="" loading="lazy" /></figure>
        </section>
      </main>

      <SiteFooter lang={lang} page="prices" t={t} care={care} onLanguageChange={onLanguageChange} />
    </div>
  )
}
