import { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  FileText,
  Globe2,
  Languages,
  Menu,
  MessageCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Waves,
  X,
} from 'lucide-react'
import { content, languages } from './content'

const treatmentIcons = [Sparkles, ScanLine, CircleCheck, ShieldCheck]

function goTo(id) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Brand({ light = false }) {
  return (
    <a className={`brand ${light ? 'brand-light' : ''}`} href="#top" aria-label="Marea Dental home">
      <span className="brand-symbol" aria-hidden="true"><span>M</span></span>
      <span className="brand-words"><strong>MAREA</strong><small>DENTAL · BATUMI</small></span>
    </a>
  )
}

function App() {
  const [lang, setLang] = useState('nl')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTreatment, setActiveTreatment] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const t = content[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = `Marea Dental Batumi — ${t.footerLine}`
  }, [lang, t.footerLine])

  function navigate(id) {
    setMenuOpen(false)
    goTo(id)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">{t.skip}</a>

      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Hoofdnavigatie">
          {t.nav.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <div className="header-tools">
          <label className="language-picker">
            <Languages size={16} aria-hidden="true" />
            <span className="sr-only">Language</span>
            <select value={lang} onChange={(event) => setLang(event.target.value)}>
              {languages.map((language) => <option value={language.code} key={language.code}>{language.short}</option>)}
            </select>
          </label>
          <button className="button header-button" onClick={() => goTo('#contact')}>{t.cta}<ArrowRight size={17} /></button>
          <button
            className="menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.close : t.menu}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobiele navigatie">
            {t.nav.map(([label, href], index) => (
              <button onClick={() => navigate(href)} key={href}><span>0{index + 1}</span>{label}<ArrowDownRight size={20} /></button>
            ))}
            <button className="button" onClick={() => navigate('#contact')}>{t.cta}<ArrowRight size={17} /></button>
          </nav>
        )}
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="pulse" />{t.heroEyebrow}</div>
            <h1><span>{t.heroLine1}</span><em>{t.heroAccent}</em></h1>
            <p className="hero-lede">{t.heroText}</p>
            <div className="hero-actions">
              <button className="button button-coral" onClick={() => goTo('#contact')}>{t.heroPrimary}<ArrowRight size={19} /></button>
              <button className="button-ghost" onClick={() => goTo('#kliniek')}>{t.heroSecondary}<ArrowDownRight size={18} /></button>
            </div>
            <p className="hero-note"><ShieldCheck size={16} />{t.heroNote}</p>
          </div>

          <div className="hero-image">
            <img src="/assets/marea-batumi-hero.png" alt="Zelfverzekerde vrouw op een terras aan de Zwarte Zee in Batumi" />
            <div className="hero-photo-overlay" />
            <div className="availability-pill"><span className="pulse" />{t.availability}</div>
            <div className="hero-location"><Globe2 size={18} /><span>{t.location}</span></div>
            <p className="hero-caption">{t.photoCaption}</p>
            <div className="twenty-one" aria-hidden="true"><span>MAX</span><strong>21</strong><small>DAYS</small></div>
          </div>

          <div className="hero-stats">
            {t.stats.map(([value, label], index) => (
              <article key={label}>
                <span>0{index + 1}</span><div><strong>{value}</strong><small>{label}</small></div>
              </article>
            ))}
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div>
            {[...t.ticker, ...t.ticker].map((item, index) => <span key={`${item}-${index}`}>{item}<i>✦</i></span>)}
          </div>
        </div>

        <section className="intro section" aria-labelledby="intro-title">
          <div className="section-index">01 / 05</div>
          <div className="intro-main">
            <p className="eyebrow">{t.introEyebrow}</p>
            <h2 id="intro-title">{t.introTitle}</h2>
            <blockquote>“{t.introQuote}”</blockquote>
          </div>
          <div className="intro-aside">
            <div className="sun-mark" aria-hidden="true"><span /><span /><span /></div>
            <p>{t.introText}</p>
            <button className="round-link" onClick={() => goTo('#contact')} aria-label={t.cta}><ArrowDownRight size={28} /></button>
          </div>
        </section>

        <section className="treatments section" id="behandelingen" aria-labelledby="treatments-title">
          <div className="section-topline">
            <div><span className="section-index">02 / 05</span><p className="eyebrow">{t.treatmentsEyebrow}</p></div>
            <p>{t.treatmentsText}</p>
          </div>
          <h2 id="treatments-title">{t.treatmentsTitle}</h2>

          <div className="treatment-stage">
            <div className="treatment-tabs" role="tablist" aria-label={t.treatmentsEyebrow}>
              {t.treatments.map((treatment, index) => {
                const Icon = treatmentIcons[index]
                return (
                  <button
                    key={treatment.name}
                    type="button"
                    role="tab"
                    aria-selected={activeTreatment === index}
                    aria-controls="treatment-panel"
                    className={activeTreatment === index ? 'active' : ''}
                    onClick={() => setActiveTreatment(index)}
                  >
                    <span className="treatment-number">{treatment.number}</span>
                    <span className="treatment-name">{treatment.name}<small>{treatment.time}</small></span>
                    <span className="treatment-arrow"><ArrowRight size={20} /></span>
                    <Icon className="treatment-watermark" strokeWidth={1} aria-hidden="true" />
                  </button>
                )
              })}
            </div>

            <article className="treatment-panel" id="treatment-panel" role="tabpanel">
              <div className="panel-orbit" aria-hidden="true"><span /><span /><Sparkles /></div>
              <span className="panel-number">{t.treatments[activeTreatment].number}</span>
              <h3>{t.treatments[activeTreatment].name}</h3>
              <p>{t.treatments[activeTreatment].desc}</p>
              <ul>{t.treatments[activeTreatment].tags.map((tag) => <li key={tag}><Check size={15} />{tag}</li>)}</ul>
              <button className="text-link" onClick={() => goTo('#contact')}>{t.cta}<ArrowRight size={18} /></button>
            </article>
          </div>
        </section>

        <section className="clinic" id="kliniek" aria-labelledby="clinic-title">
          <div className="clinic-art" aria-hidden="true">
            <div className="clinic-art-copy"><span>ONE</span><strong>TEAM</strong><em>BATUMI</em></div>
            <div className="clinic-arch arch-a" />
            <div className="clinic-arch arch-b" />
            <div className="clinic-dot dot-a" />
            <div className="clinic-dot dot-b" />
            <Waves className="clinic-wave" />
          </div>
          <div className="clinic-copy section">
            <span className="section-index light">03 / 05</span>
            <p className="eyebrow light">{t.clinicEyebrow}</p>
            <h2 id="clinic-title">{t.clinicTitle}</h2>
            <p className="clinic-lede">{t.clinicText}</p>
            <div className="clinic-cards">
              {t.clinicCards.map(([number, title, text]) => (
                <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>
              ))}
            </div>
            <div className="clinic-promise"><span>{t.promiseLabel}</span><strong>{t.promise}</strong></div>
          </div>
        </section>

        <section className="stay section" id="verblijf" aria-labelledby="stay-title">
          <div className="stay-heading">
            <div><span className="section-index">04 / 05</span><p className="eyebrow">{t.stayEyebrow}</p></div>
            <h2 id="stay-title">{t.stayTitle}</h2>
            <p>{t.stayText}</p>
          </div>
          <div className="day-track">
            {t.days.map(([label, text], index) => (
              <article key={label}>
                <span className="day-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="day-line"><span /></div>
                <h3>{label}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="batumi" aria-labelledby="batumi-title">
          <div className="batumi-photo">
            <img src="/assets/marea-batumi-hero.png" alt="Uitzicht over de kustlijn en moderne architectuur van Batumi" />
            <div className="batumi-word" aria-hidden="true">BATUMI</div>
          </div>
          <div className="batumi-copy">
            <p className="eyebrow light">{t.batumiEyebrow}</p>
            <h2 id="batumi-title">{t.batumiTitle}</h2>
            <p>{t.batumiText}</p>
            <ul>{t.batumiPoints.map((point) => <li key={point}><ArrowRight size={17} />{point}</li>)}</ul>
          </div>
        </section>

        <section className="consult section" id="contact" aria-labelledby="consult-title">
          <div className="consult-copy">
            <span className="section-index">05 / 05</span>
            <p className="eyebrow">{t.consultEyebrow}</p>
            <h2 id="consult-title">{t.consultTitle}</h2>
            <p>{t.consultText}</p>
            <div className="consult-facts">
              <span><Clock3 size={18} />{t.consultFacts[0]}</span>
              <span><MessageCircle size={18} />{t.consultFacts[1]}</span>
              <span><FileText size={18} />{t.consultFacts[2]}</span>
            </div>
          </div>

          <div className="form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <label><span>{t.fields.name}</span><input name="name" autoComplete="name" required /></label>
                  <label><span>{t.fields.email}</span><input name="email" type="email" autoComplete="email" required /></label>
                  <label><span>{t.fields.country}</span><select name="country" defaultValue="NL"><option value="NL">Nederland</option><option value="BE">België / Belgique</option><option value="DE">Deutschland</option><option value="FR">France</option><option value="CH">Schweiz / Suisse</option><option value="LU">Luxembourg</option><option value="IT">Italia</option><option value="ES">España</option></select></label>
                  <label><span>{t.fields.language}</span><select name="language" value={lang} onChange={(event) => setLang(event.target.value)}>{languages.map((language) => <option key={language.code} value={language.code}>{language.label}</option>)}</select></label>
                </div>
                <label className="full-field"><span>{t.fields.wish}</span><textarea name="wish" rows="4" placeholder={t.fields.placeholder} /></label>
                <label className="consent"><input type="checkbox" name="consent" required /><span>{t.fields.consent}</span></label>
                <button className="button button-form" type="submit">{t.fields.submit}<ArrowRight size={19} /></button>
                <small>{t.fields.note}</small>
              </form>
            ) : (
              <div className="form-success" role="status" aria-live="polite">
                <div className="success-icon"><CircleCheck size={40} /></div>
                <p className="eyebrow">Marea Dental</p>
                <h3>{t.fields.successTitle}</h3>
                <p>{t.fields.successText}</p>
                <button className="text-link" onClick={() => setSubmitted(false)}>{t.fields.again}<ArrowRight size={18} /></button>
              </div>
            )}
          </div>
        </section>

        <section className="faq section" id="vragen" aria-labelledby="faq-title">
          <div className="faq-heading"><p className="eyebrow">{t.faqEyebrow}</p><h2 id="faq-title">{t.faqTitle}</h2></div>
          <div className="faq-list">
            {t.faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index
              return (
                <article className={isOpen ? 'open' : ''} key={question}>
                  <button onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}>
                    <span>0{index + 1}</span><strong>{question}</strong><ChevronDown size={22} />
                  </button>
                  <div id={`faq-answer-${index}`} className="faq-answer" hidden={!isOpen}><p>{answer}</p></div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-top"><Brand light /><p>{t.footerLine}</p><button className="round-link light" onClick={() => goTo('#top')} aria-label="Naar boven"><ArrowRight size={24} /></button></div>
        <div className="footer-bottom">
          <span>© 2026 MAREA DENTAL · BATUMI</span>
          <div>{languages.map((language) => <button className={lang === language.code ? 'active' : ''} onClick={() => setLang(language.code)} key={language.code}>{language.short}</button>)}</div>
          <small>{t.footerNote}</small>
        </div>
      </footer>
    </div>
  )
}

export default App
