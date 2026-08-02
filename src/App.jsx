import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  FileImage,
  FileText,
  Globe2,
  MessageCircle,
  MapPin,
  Pause,
  Plane,
  Play,
  ScanLine,
  ShieldCheck,
  Stethoscope,
  Upload,
  X,
} from 'lucide-react'
import { content, languages } from './content'
import { aftercareContent } from './aftercare-content'
import {
  getVisibleProductDocuments,
  getVisibleProductFacts,
  hasProductDetails,
  hasVisibleWarranty,
  isSafeProductUrl,
  treatmentProductCatalog,
} from './clinic-products'
import { interfaceContent } from './interface-content'
import { clinicProfile, clinicThemeVariables, getClinicContactUrl } from './clinic-profile'
import { experienceContent } from './experience-content'
import { diagnosticsContent } from './diagnostics-content'
import { materialsContent } from './materials-content'
import { privacyContent } from './privacy-content'
import { pricesContent } from './prices-content'
import AftercarePage from './AftercarePage'
import PrivacyPage from './PrivacyPage'
import PricesPage from './PricesPage'
import { ClinicSocialLinks, CredentialsTrustSection, ReviewsTrustSection, TeamTrustSection } from './TrustSections'
import { SiteFooter, SiteHeader } from './SiteChrome'
import { legacyRouteTarget, parseRoute, routePath } from './routes'
import { usePageMeta } from './usePageMeta'

const treatmentImages = clinicProfile.media.treatments

const clinicThemeStyle = clinicThemeVariables(clinicProfile)

function goTo(id) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function formatProductOrigin(origin, locale) {
  const code = String(origin || '').trim().toUpperCase()
  if (!/^[A-Z]{2}$/u.test(code)) return origin

  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

function formatWarranty(product, copy, locale) {
  const parts = []
  const provider = String(product.warranty?.provider || '').trim()
  const months = product.warranty?.durationMonths

  if (provider) parts.push(provider)
  if (Number.isFinite(months)) {
    const value = new Intl.NumberFormat(locale).format(months)
    parts.push(`${value} ${months === 1 ? copy.monthOne : copy.monthOther}`)
  }

  return parts.join(' · ')
}

function ClinicalTicker({ items, copy, running, onToggle }) {
  return (
    <section className="clinical-motion-band" data-running={running ? 'true' : 'false'} aria-label={copy.motionLabel}>
      <p className="sr-only">{items.join(' · ')}</p>
      <div className="clinical-motion-window" aria-hidden="true">
        <div className="clinical-motion-track">
          {[0, 1].map((group) => (
            <div className="clinical-motion-group" key={group}>
              {items.map((item) => <span key={`${group}-${item}`}>{item}<i /></span>)}
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="clinical-motion-toggle" onClick={onToggle} aria-label={running ? copy.pauseMotion : copy.startMotion}>
        {running ? <Pause size={15} /> : <Play size={15} />}
        <span>{running ? copy.pauseMotion : copy.startMotion}</span>
      </button>
    </section>
  )
}

function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname))
  const [activeTreatment, setActiveTreatment] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState([])
  const [intakeState, setIntakeState] = useState('idle')
  const [intakeReceipt, setIntakeReceipt] = useState(null)
  const [intakeError, setIntakeError] = useState('')
  const [whatsappOpen, setWhatsappOpen] = useState(false)
  const [motionRunning, setMotionRunning] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const fileInput = useRef(null)
  const intakeStartedAt = useRef(Date.now())
  const { locale: lang, page } = route
  const t = content[lang]
  const care = aftercareContent[lang]
  const privacy = privacyContent[lang]
  const prices = pricesContent[lang]
  const ui = interfaceContent[lang]
  const materials = materialsContent[lang]
  const experience = experienceContent[lang]
  const diagnostics = diagnosticsContent[lang]

  useEffect(() => {
    Object.entries(clinicThemeStyle).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value)
    })
  }, [])

  useEffect(() => {
    const legacyTarget = legacyRouteTarget(window.location.pathname, window.location.hash)
    if (legacyTarget) {
      window.history.replaceState({}, '', legacyTarget)
      setRoute(parseRoute(new URL(legacyTarget, window.location.origin).pathname))
    }

    function handlePopState() {
      setRoute(parseRoute(window.location.pathname))
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (page !== 'home' || !window.location.hash) return undefined

    const treatmentMatch = window.location.hash.match(/^#behandeling-(\d{2})$/)
    const treatmentIndex = treatmentMatch
      ? t.treatments.findIndex((item) => item.number === treatmentMatch[1])
      : -1
    const target = treatmentIndex >= 0 && window.matchMedia('(max-width: 1020px)').matches
      ? '#treatment-panel'
      : treatmentIndex >= 0
        ? '#behandelingen'
        : window.location.hash

    if (treatmentIndex >= 0) setActiveTreatment(treatmentIndex)

    let cancelled = false
    let settleFrame = 0
    const scrollToTarget = () => {
      if (cancelled) return
      document.querySelector(target)?.scrollIntoView({ block: 'start' })
    }
    const timer = window.setTimeout(scrollToTarget, 0)

    document.fonts?.ready.then(() => {
      if (!cancelled) settleFrame = window.requestAnimationFrame(scrollToTarget)
    })

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.cancelAnimationFrame(settleFrame)
    }
  }, [lang, page, t.treatments])

  usePageMeta({
    locale: lang,
    page,
    noIndex: clinicProfile.templateMode,
    title: page === 'aftercare'
      ? care.metaTitle
      : page === 'privacy'
        ? privacy.metaTitle
        : page === 'prices'
          ? prices.metaTitle
          : `${clinicProfile.brand.name} — ${t.footerLine}`,
    description: page === 'aftercare'
      ? care.metaDescription
      : page === 'privacy'
        ? privacy.metaDescription
        : page === 'prices'
          ? (clinicProfile.templateMode ? prices.templateMetaDescription : prices.metaDescription)
          : t.heroText,
  })

  function changeLanguage(nextLanguage) {
    const hash = page === 'home' ? window.location.hash : ''
    window.history.pushState({}, '', `${routePath(nextLanguage, page)}${hash}`)
    setRoute({ locale: nextLanguage, page })
  }

  function handleFiles(event) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/dicom']
    const allowedExtension = /\.(jpe?g|png|webp|pdf|dcm)$/iu
    const selected = Array.from(event.target.files || []).filter((file) => (
      allowedTypes.includes(file.type) || allowedExtension.test(file.name)
    ))
    setFiles((current) => [...current, ...selected].slice(0, 5))
    setIntakeError('')
    event.target.value = ''
  }

  function removeFile(index) {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formValues = new FormData(form)
    const hasClinicalFiles = files.length > 0
    const payload = new FormData()
    payload.set('name', String(formValues.get('name') || ''))
    payload.set('email', String(formValues.get('email') || ''))
    payload.set('country', String(formValues.get('country') || ''))
    payload.set('locale', lang)
    payload.set('context', String(formValues.get('wish') || ''))
    payload.set('startedAt', String(intakeStartedAt.current))
    payload.set('contactConsent', formValues.get('consent') === 'on' ? 'yes' : 'no')
    payload.set('website', '')

    if (hasClinicalFiles) {
      const clinicalConsent = formValues.get('fileConsent') === 'on'
      payload.set('ownershipConsent', clinicalConsent ? 'yes' : 'no')
      payload.set('healthConsent', clinicalConsent ? 'yes' : 'no')
      files.forEach((file) => payload.append('files', file, file.name))
    }

    setIntakeState('sending')
    setIntakeError('')

    try {
      const endpoint = hasClinicalFiles ? '/api/clinical-files' : '/api/appointment-requests'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
        body: payload,
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.ok) throw new Error(result?.code || 'REQUEST_FAILED')

      setIntakeReceipt({ ...result, endpoint })
      setIntakeState('success')
      setSubmitted(true)
      setFiles([])
      form.reset()
    } catch (error) {
      setIntakeState('idle')
      setIntakeError(error instanceof Error ? error.message : 'REQUEST_FAILED')
      intakeStartedAt.current = Date.now()
    }
  }

  async function deleteIntake() {
    if (!intakeReceipt) return
    setIntakeState('deleting')
    setIntakeError('')
    try {
      const response = await fetch(intakeReceipt.endpoint, {
        method: 'DELETE',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          reference: intakeReceipt.reference,
          deletionToken: intakeReceipt.deletionToken,
        }),
      })
      if (!response.ok) throw new Error('DELETE_FAILED')
      setIntakeReceipt(null)
      setIntakeState('deleted')
    } catch (error) {
      setIntakeState('success')
      setIntakeError(error instanceof Error ? error.message : 'DELETE_FAILED')
    }
  }

  function resetIntake() {
    setSubmitted(false)
    setFiles([])
    setIntakeReceipt(null)
    setIntakeState('idle')
    setIntakeError('')
    intakeStartedAt.current = Date.now()
  }

  if (page === 'aftercare') {
    return <AftercarePage lang={lang} t={t} care={care} onLanguageChange={changeLanguage} />
  }

  if (page === 'privacy') {
    return <PrivacyPage lang={lang} t={t} care={care} onLanguageChange={changeLanguage} />
  }

  if (page === 'prices') {
    return <PricesPage lang={lang} t={t} care={care} onLanguageChange={changeLanguage} />
  }

  const treatment = t.treatments[activeTreatment]
  const treatmentAlts = [
    ui.photoAltClinic,
    ui.photoAltCare,
    ui.photoAltConsultation,
    ui.photoAltPlanning,
    ui.photoAltClinic,
    ui.photoAltPlanning,
    ui.photoAltConsultation,
    ui.photoAltClinic,
    ui.photoAltConsultation,
    ui.photoAltCare,
  ]
  const materialGroups = materials.categories.map((category) => ({
    ...category,
    products: treatmentProductCatalog.products.filter((product) => (
      product.category === category.id && hasProductDetails(product)
    )),
  }))
  const officialWhatsAppUrl = getClinicContactUrl('whatsapp')

  return (
    <div className="site-shell" style={clinicThemeStyle}>
      <a className="skip-link" href="#main">{t.skip}</a>
      <SiteHeader
        lang={lang}
        page="home"
        t={t}
        care={care}
        onLanguageChange={changeLanguage}
        onServiceSelect={(index) => {
          setActiveTreatment(index)
          window.history.replaceState({}, '', `${window.location.pathname}#behandeling-${t.treatments[index].number}`)
          requestAnimationFrame(() => goTo(window.matchMedia('(max-width: 1020px)').matches ? '#treatment-panel' : '#behandelingen'))
        }}
      />

      <main id="main">
        <section className="clinical-hero" id="top" aria-labelledby="home-title">
          <div className="clinical-hero-copy">
            <p className="eyebrow"><span />{t.heroEyebrow}</p>
            <h1 id="home-title">{t.heroLine1} <em>{t.heroAccent}</em></h1>
            <p className="hero-lede">{t.heroText}</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => goTo('#contact')}><CalendarDays size={18} />{ui.bookNow}<ArrowRight size={18} /></button>
              <button className="text-button" onClick={() => goTo('#whatsapp')}><MessageCircle size={18} />{ui.whatsappPrompt}<ArrowRight size={17} /></button>
            </div>
            <p className="hero-note"><ShieldCheck size={17} />{t.heroNote}</p>
          </div>

          <figure className="clinical-hero-media">
            <img src={clinicProfile.media.hero} alt={ui.photoAltConsultation} />
            <figcaption>
              <span>{ui.heroMediaLabel}</span>
              <small>{ui.heroMediaNote}</small>
            </figcaption>
            <div className="hero-location"><Globe2 size={17} /><span>{t.location}</span></div>
          </figure>

          <div className="clinical-trust-row" aria-label={t.heroNote}>
            {t.stats.map(([value, label]) => (
              <div key={label}><strong>{value}</strong><span>{label}</span></div>
            ))}
          </div>
        </section>

        <ClinicalTicker items={t.ticker} copy={experience} running={motionRunning} onToggle={() => setMotionRunning((value) => !value)} />

        <section className="audience-paths" id="patienten" aria-label={ui.audience}>
          <a href="#behandelingen">
            <MapPin size={22} />
            <div><span>{ui.localPathEyebrow}</span><h2>{ui.localPathTitle}</h2><p>{ui.localPathText}</p><strong>{ui.localPathCta}<ArrowRight size={16} /></strong></div>
          </a>
          <a href="#verblijf">
            <Plane size={22} />
            <div><span>{ui.travelPathEyebrow}</span><h2>{ui.travelPathTitle}</h2><p>{ui.travelPathText}</p><strong>{ui.travelPathCta}<ArrowRight size={16} /></strong></div>
          </a>
        </section>

        <section className="care-principles" aria-label={ui.principlesLabel}>
          <p>{ui.principlesLabel}</p>
          <ul>{ui.principles.map((principle) => <li key={principle}>{principle}</li>)}</ul>
        </section>

        <section className="opening-statement section" aria-labelledby="intro-title">
          <div className="opening-copy">
            <p className="eyebrow">{t.introEyebrow}</p>
            <h2 id="intro-title">{t.introTitle}</h2>
            <blockquote>“{t.introQuote}”</blockquote>
            <p>{t.introText}</p>
          </div>
          <div className="opening-gallery" aria-label={ui.galleryLabel}>
            <figure className="opening-gallery-main">
              <img src={clinicProfile.media.clinic} alt={ui.photoAltClinic} loading="lazy" />
            </figure>
            <figure className="opening-gallery-detail">
              <img src={clinicProfile.media.planning} alt={ui.photoAltPlanning} loading="lazy" />
              <figcaption>{ui.galleryCaption}</figcaption>
            </figure>
          </div>
        </section>

        <div className="trust-sections">
          <TeamTrustSection lang={lang} id="kliniek" contactHref="#contact" onContact={() => goTo('#contact')} />
        </div>

        <section className="radiology-section" id="diagnostiek" aria-labelledby="radiology-title">
          <figure>
            <img src={clinicProfile.media.radiology} alt={diagnostics.imageAlt} loading="lazy" />
            <figcaption><ScanLine size={18} aria-hidden="true" />{diagnostics.eyebrow}</figcaption>
          </figure>
          <div className="radiology-copy">
            <p className="eyebrow light"><span />{diagnostics.eyebrow}</p>
            <h2 id="radiology-title">{diagnostics.title}</h2>
            <p className="radiology-intro">{diagnostics.text}</p>
            <dl>
              {diagnostics.principles.map(([title, text], index) => (
                <div key={title}><dt><span>0{index + 1}</span>{title}</dt><dd>{text}</dd></div>
              ))}
            </dl>
            <p className="radiology-status"><ShieldCheck size={17} aria-hidden="true" />{diagnostics.status}</p>
            <a className="radiology-upload" href="#contact"><Upload size={17} aria-hidden="true" /><span><small>{diagnostics.uploadEyebrow}</small>{diagnostics.uploadText}</span><strong>{diagnostics.uploadCta}<ArrowRight size={16} /></strong></a>
          </div>
        </section>

        <section className="treatments section" id="behandelingen" aria-labelledby="treatments-title">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">{t.treatmentsEyebrow}</p><h2 id="treatments-title">{t.treatmentsTitle}</h2></div>
            <p>{t.treatmentsText}</p>
          </div>
          <div className="treatment-composer">
            <div className="treatment-list" role="tablist" aria-label={t.treatmentsEyebrow}>
              {t.treatments.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  id={`treatment-tab-${item.number}`}
                  aria-selected={activeTreatment === index}
                  aria-controls="treatment-panel"
                  tabIndex={activeTreatment === index ? 0 : -1}
                  className={activeTreatment === index ? 'active' : ''}
                  onClick={() => setActiveTreatment(index)}
                  onKeyDown={(event) => {
                    const keyTargets = {
                      ArrowDown: (index + 1) % t.treatments.length,
                      ArrowRight: (index + 1) % t.treatments.length,
                      ArrowUp: (index - 1 + t.treatments.length) % t.treatments.length,
                      ArrowLeft: (index - 1 + t.treatments.length) % t.treatments.length,
                      Home: 0,
                      End: t.treatments.length - 1,
                    }
                    const nextIndex = keyTargets[event.key]
                    if (nextIndex === undefined) return
                    event.preventDefault()
                    setActiveTreatment(nextIndex)
                    requestAnimationFrame(() => document.getElementById(`treatment-tab-${t.treatments[nextIndex].number}`)?.focus())
                  }}
                >
                  <strong>{item.name}</strong>
                  <small>{item.time}</small>
                  <ArrowRight size={18} />
                </button>
              ))}
            </div>
            <article className="treatment-panel" id="treatment-panel" role="tabpanel" aria-labelledby={`treatment-tab-${treatment.number}`} key={treatment.number}>
              <div className="treatment-panel-image">
                <img src={treatmentImages[activeTreatment]} alt={treatmentAlts[activeTreatment]} />
              </div>
              <div className="treatment-panel-copy">
                <span>{treatment.time}</span>
                <h3>{treatment.name}</h3>
                <p>{treatment.desc}</p>
                <ul>{treatment.tags.map((tag) => <li key={tag}><Check size={15} />{tag}</li>)}</ul>
                <button className="text-button" onClick={() => goTo('#contact')}>{t.cta}<ArrowRight size={17} /></button>
              </div>
            </article>
          </div>
        </section>

        <section className="price-invitation section" aria-labelledby="price-invitation-title">
          <div>
            <p className="eyebrow">{experience.priceEyebrow}</p>
            <h2 id="price-invitation-title">{experience.priceTitle}</h2>
          </div>
          <div className="price-invitation-copy">
            <p>{clinicProfile.templateMode ? experience.priceTemplateText : experience.priceText}</p>
            <a className="text-button" href={routePath(lang, 'prices')}>{experience.priceCta}<ArrowRight size={17} /></a>
            <small><ShieldCheck size={15} />{experience.priceNote}</small>
          </div>
        </section>

        <section className="materials-section section" id="materialen" aria-labelledby="materials-title">
          <header className="materials-heading split-heading">
            <div>
              <p className="eyebrow">{materials.eyebrow}</p>
              <h2 id="materials-title">{materials.title}</h2>
            </div>
            <p>{materials.intro}</p>
          </header>

          <div className="materials-list">
            {materialGroups.map((category) => (
              <article className="material-entry" key={category.id}>
                <h3>{category.title}</h3>
                <div className="material-entry-detail">
                  <p>{category.text}</p>

                  {category.products.map((product) => {
                    const facts = getVisibleProductFacts(product).map((fact) => ({
                      ...fact,
                      value: fact.key === 'origin' ? formatProductOrigin(fact.value, lang) : fact.value,
                    }))
                    const warranty = hasVisibleWarranty(product) ? formatWarranty(product, materials, lang) : ''
                    const documents = getVisibleProductDocuments(product)
                    const productTitle = product.name || product.brand || product.system

                    return (
                      <div className="material-product" key={product.id}>
                        {productTitle && <h4>{productTitle}</h4>}
                        {(facts.length > 0 || warranty || product.batchTraceability === true || documents.length > 0 || isSafeProductUrl(product.warranty?.termsUrl)) && (
                          <dl className="material-facts">
                            {facts.map((fact) => (
                              <div key={fact.key}><dt>{materials.factLabels[fact.key]}</dt><dd>{fact.value}</dd></div>
                            ))}
                            {warranty && <div><dt>{materials.factLabels.warranty}</dt><dd>{warranty}</dd></div>}
                            {product.batchTraceability === true && <div><dt>{materials.factLabels.traceability}</dt><dd>{materials.traceabilityValue}</dd></div>}
                            {documents.map((document, index) => (
                              <div key={`${document.url}-${index}`}>
                                <dt>{materials.factLabels.documentation}</dt>
                                <dd><a href={document.url} target="_blank" rel="noreferrer">{document.title || materials.viewDocument}<ArrowRight size={14} /></a></dd>
                              </div>
                            ))}
                            {isSafeProductUrl(product.warranty?.termsUrl) && (
                              <div><dt>{materials.factLabels.warranty}</dt><dd><a href={product.warranty.termsUrl} target="_blank" rel="noreferrer">{materials.viewWarranty}<ArrowRight size={14} /></a></dd></div>
                            )}
                          </dl>
                        )}
                      </div>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>

          <div className="materials-note">
            <FileText size={25} aria-hidden="true" />
            <div><strong>{materials.transparencyTitle}</strong><p>{materials.transparencyNote}</p><small>{materials.verifiedOnly}</small></div>
          </div>
        </section>

        <div className="trust-sections">
          <CredentialsTrustSection lang={lang} id="kwaliteit" />
          <ReviewsTrustSection lang={lang} id="reviews" />
          <ClinicSocialLinks lang={lang} />
        </div>

        <section className="clinic-section section" id="werkwijze" aria-labelledby="clinic-title">
          <div className="clinic-visual">
            <img src={clinicProfile.media.consultation} alt={ui.photoAltConsultation} loading="lazy" />
            <div className="clinic-visual-note"><Stethoscope size={19} /><span>{t.promise}</span></div>
          </div>
          <div className="clinic-content">
            <p className="eyebrow">{t.clinicEyebrow}</p>
            <h2 id="clinic-title">{t.clinicTitle}</h2>
            <p className="clinic-lede">{t.clinicText}</p>
            <div className="clinic-process">
              {t.clinicCards.map(([number, title, text]) => (
                <article key={number}><div><h3>{title}</h3><p>{text}</p></div></article>
              ))}
            </div>
          </div>
        </section>

        <section className="stay-section section" id="verblijf" aria-labelledby="stay-title">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">{t.stayEyebrow}</p><h2 id="stay-title">{t.stayTitle}</h2></div>
            <p>{t.stayText}</p>
          </div>
          <div className="stay-timeline">
            {t.days.map(([label, text]) => (
              <article key={label}>
                <div><h3>{label}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="care-feature" aria-labelledby="care-feature-title">
          <div className="care-feature-image"><img src={clinicProfile.media.planning} alt={ui.photoAltPlanning} loading="lazy" /></div>
          <div className="care-feature-copy">
            <p className="eyebrow light">{ui.careFeatureEyebrow}</p>
            <h2 id="care-feature-title">{ui.careFeatureTitle}</h2>
            <p>{ui.careFeatureText}</p>
            <blockquote>“{care.promise.quote}”</blockquote>
            <a className="button button-light" href={routePath(lang, 'aftercare')}>{ui.careFeatureCta}<ArrowRight size={18} /></a>
          </div>
        </section>

        <section className="batumi-section" aria-labelledby="batumi-title">
          <figure><img src={clinicProfile.media.localPatient} alt={t.batumiImageAlt} loading="lazy" /></figure>
          <div>
            <p className="eyebrow light">{t.batumiEyebrow}</p>
            <h2 id="batumi-title">{t.batumiTitle}</h2>
            <p>{t.batumiText}</p>
            <ul>{t.batumiPoints.map((point) => <li key={point}><ArrowRight size={17} />{point}</li>)}</ul>
          </div>
        </section>

        <section className="consult-section section" id="contact" aria-labelledby="consult-title">
          <div className="consult-intro">
            <p className="eyebrow">{t.consultEyebrow}</p>
            <h2 id="consult-title">{t.consultTitle}</h2>
            <p>{t.consultText}</p>
            <div className="consult-facts">
              <span><Clock3 size={18} />{t.consultFacts[0]}</span>
              <span><MessageCircle size={18} />{t.consultFacts[1]}</span>
              <span><FileText size={18} />{t.consultFacts[2]}</span>
            </div>
          </div>

          <div className="consult-layout">
            <div className="form-card">
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <label><span>{t.fields.name}</span><input name="name" autoComplete="name" required /></label>
                    <label><span>{t.fields.email}</span><input name="email" type="email" autoComplete="email" required /></label>
                    <label><span>{t.fields.country}</span><select name="country" defaultValue={lang === 'ka' ? 'GE' : 'NL'}><option value="GE">საქართველო</option><option value="NL">Nederland</option><option value="BE">België / Belgique</option><option value="DE">Deutschland</option><option value="FR">France</option><option value="CH">Schweiz / Suisse</option><option value="LU">Luxembourg</option><option value="IT">Italia</option><option value="ES">España</option></select></label>
                    <label><span>{t.fields.language}</span><select name="language" value={lang} onChange={(event) => changeLanguage(event.target.value)}>{languages.map((language) => <option key={language.code} value={language.code}>{language.label}</option>)}</select></label>
                  </div>
                  <label className="full-field"><span>{t.fields.wish}</span><textarea name="wish" rows="4" placeholder={t.fields.placeholder} /></label>

                  <div className="upload-field">
                    <div className="upload-field-copy"><FileImage size={21} /><div><strong>{ui.uploadTitle}</strong><p>{ui.uploadText}</p></div></div>
                    <input ref={fileInput} id="medical-files" name="files" className="sr-only" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.dcm,image/jpeg,image/png,image/webp,application/pdf,application/dicom" multiple onChange={handleFiles} />
                    <button className="upload-button" type="button" onClick={() => fileInput.current?.click()}><Upload size={17} />{ui.uploadChoose}</button>
                    <small>{ui.uploadHelp}</small>
                    {files.length > 0 && (
                      <ul className="file-list" aria-live="polite">
                        {files.map((file, index) => (
                          <li key={`${file.name}-${index}`}><span><FileText size={15} />{file.name}</span><button type="button" onClick={() => removeFile(index)} aria-label={`${ui.uploadRemove}: ${file.name}`}><X size={15} />{ui.uploadRemove}</button></li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {files.length > 0 && (
                    <label className="consent clinical-consent"><input type="checkbox" name="fileConsent" required /><span>{ui.uploadConsent}</span></label>
                  )}
                  <label className="consent"><input type="checkbox" name="consent" required /><span>{t.fields.consent}</span></label>
                  {intakeError && <p className="form-error" role="alert">{ui.intakeError}</p>}
                  {intakeState === 'sending' && <p className="form-progress" role="status">{ui.intakeSending}</p>}
                  <button className="button button-primary form-submit" type="submit" disabled={intakeState === 'sending'}>{intakeState === 'sending' ? ui.intakeSending : t.fields.submit}<ArrowRight size={18} /></button>
                  <small className="form-note">{t.fields.note}</small>
                </form>
              ) : (
                <div className="form-success" role="status" aria-live="polite">
                  <CircleCheck size={42} />
                  <p className="eyebrow">{clinicProfile.brand.name}</p>
                  <h3>{intakeState === 'deleted' ? ui.intakeDeletedTitle : intakeReceipt?.kind === 'clinical' ? ui.uploadSuccessTitle : ui.appointmentSuccessTitle}</h3>
                  <p>{intakeState === 'deleted' ? ui.intakeDeletedText : intakeReceipt?.kind === 'clinical' ? ui.uploadSuccessText : ui.appointmentSuccessText}</p>
                  {intakeReceipt && (
                    <div className="intake-reference"><span>{ui.referenceLabel}</span><code>{intakeReceipt.reference}</code></div>
                  )}
                  {intakeError && <p className="form-error" role="alert">{ui.deleteError}</p>}
                  {intakeReceipt && (
                    <button className="text-button delete-intake" type="button" disabled={intakeState === 'deleting'} onClick={deleteIntake}>{intakeState === 'deleting' ? ui.intakeDeleting : ui.deleteIntake}</button>
                  )}
                  <button className="text-button" type="button" onClick={resetIntake}>{t.fields.again}<ArrowRight size={17} /></button>
                </div>
              )}
            </div>

            <aside className="whatsapp-card" id="whatsapp">
              <div className="whatsapp-icon"><MessageCircle size={26} /></div>
              <p className="eyebrow light">WhatsApp</p>
              <h3>{ui.whatsappTitle}</h3>
              <p>{ui.whatsappText}</p>
              {officialWhatsAppUrl ? (
                <a className="button button-light" href={officialWhatsAppUrl} target="_blank" rel="noreferrer">{ui.whatsappAction}<ArrowRight size={17} /></a>
              ) : (
                <button className="button button-light" type="button" onClick={() => setWhatsappOpen((open) => !open)} aria-expanded={whatsappOpen}>{ui.whatsappAction}<ArrowRight size={17} /></button>
              )}
              {!officialWhatsAppUrl && whatsappOpen && <div className="whatsapp-status" role="status"><ShieldCheck size={18} /><span>{ui.whatsappStatus}</span></div>}
              <small>{care.firstWeek.channelNote}</small>
            </aside>
          </div>
        </section>

        <section className="faq-section section" id="vragen" aria-labelledby="faq-title">
          <div className="faq-heading"><p className="eyebrow">{t.faqEyebrow}</p><h2 id="faq-title">{t.faqTitle}</h2></div>
          <div className="faq-list">
            {t.faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index
              return (
                <article className={isOpen ? 'open' : ''} key={question}>
                  <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}>
                    <strong>{question}</strong><ChevronDown size={21} />
                  </button>
                  <div id={`faq-answer-${index}`} className="faq-answer" hidden={!isOpen}><p>{answer}</p></div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <div className="mobile-action-bar" aria-label={t.cta}>
        <a href={officialWhatsAppUrl || '#whatsapp'} target={officialWhatsAppUrl ? '_blank' : undefined} rel={officialWhatsAppUrl ? 'noreferrer' : undefined}><MessageCircle size={18} />{ui.whatsapp}</a>
        <a href="#contact"><CalendarDays size={18} />{ui.appointment}</a>
      </div>
      <SiteFooter lang={lang} page="home" t={t} care={care} onLanguageChange={changeLanguage} />
    </div>
  )
}

export default App
