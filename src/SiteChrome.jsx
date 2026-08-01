import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronDown, Globe2, Languages, Menu, MessageCircle, X } from 'lucide-react'
import { languages } from './content'
import { interfaceContent } from './interface-content'
import { privacyContent } from './privacy-content'
import { routePath } from './routes'

export function Brand({ light = false, homeHref = '/nl' }) {
  return (
    <a className={`brand ${light ? 'brand-light' : ''}`} href={homeHref} aria-label="Batumi Dental Clinic">
      <span className="brand-logo" aria-hidden="true" />
    </a>
  )
}

const serviceGroupIndexes = [[0, 1, 2, 3, 8, 9], [4, 5], [6, 7]]

export function SiteHeader({ lang, page, t, care, onLanguageChange, onServiceSelect }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const menuButton = useRef(null)
  const mobileNav = useRef(null)
  const servicesButton = useRef(null)
  const ui = interfaceContent[lang]
  const homePath = routePath(lang)
  const homeNav = t.nav.map(([label, href]) => [label, page === 'home' ? href : `${homePath}${href}`])
  const carePath = routePath(lang, 'aftercare')
  const contactPath = page === 'home' ? '#contact' : `${homePath}#contact`
  const whatsappPath = page === 'home' ? '#whatsapp' : `${homePath}#whatsapp`

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined

    const focusable = [...mobileNav.current.querySelectorAll('a[href], button:not([disabled])')]
    focusable[0]?.focus()

    function keepFocusInside(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        requestAnimationFrame(() => menuButton.current?.focus())
        return
      }
      if (event.key !== 'Tab' || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', keepFocusInside)
    return () => document.removeEventListener('keydown', keepFocusInside)
  }, [menuOpen])

  useEffect(() => {
    if (!servicesOpen) return undefined

    function closeServicesWithEscape(event) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setServicesOpen(false)
      requestAnimationFrame(() => servicesButton.current?.focus())
    }

    document.addEventListener('keydown', closeServicesWithEscape)
    return () => document.removeEventListener('keydown', closeServicesWithEscape)
  }, [servicesOpen])

  function closeMenu() {
    setMenuOpen(false)
    setMobileServicesOpen(false)
  }

  function selectService(event, index) {
    setServicesOpen(false)
    closeMenu()
    if (page === 'home' && onServiceSelect) {
      event.preventDefault()
      onServiceSelect(index)
    }
  }

  return (
    <div className="site-masthead">
      <div className="utility-bar">
        <span><Globe2 size={14} />{t.location}</span>
        <span>{ui.audience}</span>
        <a href={contactPath}>{ui.urgent}</a>
      </div>
      <header className="site-header">
        <Brand homeHref={homePath} />
        <nav className="desktop-nav" aria-label={t.mainNavLabel}>
          <div
            className="services-navigation"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false) }}
          >
            <button ref={servicesButton} type="button" aria-expanded={servicesOpen} aria-controls="services-menu" onClick={() => setServicesOpen((open) => !open)}>
              {homeNav[0][0]}<ChevronDown size={15} />
            </button>
            <div id="services-menu" className={`services-mega ${servicesOpen ? 'open' : ''}`}>
              <div className="services-mega-intro">
                <span>{ui.allTreatments}</span>
                <strong>{ui.serviceMenuIntro}</strong>
                <a href={page === 'home' ? '#behandelingen' : `${homePath}#behandelingen`} onClick={() => setServicesOpen(false)}>{ui.allTreatments}<ArrowRight size={16} /></a>
              </div>
              <div className="services-mega-groups">
                {serviceGroupIndexes.map((indexes, groupIndex) => (
                  <section key={ui.serviceGroups[groupIndex]}>
                    <h2>{ui.serviceGroups[groupIndex]}</h2>
                    {indexes.map((index) => t.treatments[index] && (
                      <a href={page === 'home' ? `#behandeling-${t.treatments[index].number}` : `${homePath}#behandeling-${t.treatments[index].number}`} onClick={(event) => selectService(event, index)} key={t.treatments[index].name}>
                        <span>{t.treatments[index].number}</span>{t.treatments[index].name}
                      </a>
                    ))}
                  </section>
                ))}
              </div>
            </div>
          </div>
          {homeNav.slice(1).map(([label, href]) => <a href={href} key={href}>{label}</a>)}
          <a href={carePath} aria-current={page === 'aftercare' ? 'page' : undefined}>{care.navLabel}</a>
        </nav>
        <div className="header-tools">
          <label className="language-picker">
            <Languages size={16} aria-hidden="true" />
            <span className="sr-only">{t.languageLabel}</span>
            <select value={lang} onChange={(event) => onLanguageChange(event.target.value)} aria-label={t.languageLabel}>
              {languages.map((language) => <option value={language.code} key={language.code}>{language.short}</option>)}
            </select>
          </label>
          <a className="header-whatsapp" href={whatsappPath}><MessageCircle size={17} /><span>{ui.whatsapp}</span></a>
          <a className="button header-button" href={contactPath}>{ui.appointment}<ArrowRight size={16} /></a>
          <button
            ref={menuButton}
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.close : t.menu}
          >
            {menuOpen ? <X /> : <Menu />}
            {!menuOpen && <span>{t.menu}</span>}
          </button>
        </div>
        <nav ref={mobileNav} id="mobile-menu" className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label={t.mobileNavLabel}>
          <div className="mobile-nav-inner">
            <div className="mobile-services-disclosure">
              <button type="button" className="mobile-service-toggle" aria-expanded={mobileServicesOpen} onClick={() => setMobileServicesOpen((open) => !open)}>
                <span>01</span><strong>{homeNav[0][0]}</strong><ChevronDown size={19} />
              </button>
              <div className={`mobile-service-list ${mobileServicesOpen ? 'open' : ''}`}>
                {t.treatments.map((treatment, index) => (
                  <a href={page === 'home' ? `#behandeling-${treatment.number}` : `${homePath}#behandeling-${treatment.number}`} onClick={(event) => selectService(event, index)} key={treatment.name}>
                    <span>{treatment.number}</span>{treatment.name}
                  </a>
                ))}
              </div>
            </div>
            {homeNav.slice(1).map(([label, href], index) => (
              <a onClick={closeMenu} href={href} key={href}><span>0{index + 2}</span>{label}<ArrowRight size={19} /></a>
            ))}
            <a onClick={closeMenu} href={carePath} aria-current={page === 'aftercare' ? 'page' : undefined}>
              <span>0{homeNav.length + 1}</span>{care.navLabel}<ArrowRight size={19} />
            </a>
            <div className="mobile-nav-actions">
              <a className="button button-light" onClick={closeMenu} href={contactPath}><CalendarDays size={18} />{ui.appointment}</a>
              <a className="button button-outline-light" onClick={closeMenu} href={whatsappPath}><MessageCircle size={18} />{ui.whatsapp}</a>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

export function SiteFooter({ lang, page, t, care, onLanguageChange }) {
  const ui = interfaceContent[lang]
  const homePath = routePath(lang)
  const carePath = routePath(lang, 'aftercare')
  const privacyPath = routePath(lang, 'privacy')
  const contactPath = page === 'home' ? '#contact' : `${homePath}#contact`

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <a className="footer-logo-art" href={homePath} aria-label="Batumi Dental Clinic" />
          <p>{page === 'aftercare' ? care.footerLine : t.footerLine}</p>
          <span>{t.location}</span>
        </div>
        <nav className="footer-links" aria-label={t.footerNavLabel}>
          <span>{t.mainNavLabel}</span>
          <a href={homePath}>{t.homeLabel}</a>
          <a href={`${homePath}#behandelingen`}>{t.nav[0][0]}</a>
          <a href={`${homePath}#patienten`}>{t.nav[2][0]}</a>
          <a href={carePath}>{care.navLabel}</a>
          <a href={privacyPath}>{privacyContent[lang].navLabel}</a>
        </nav>
        <div className="footer-contact">
          <span>{ui.audience}</span>
          <a className="footer-appointment" href={contactPath}>{t.cta}<ArrowRight size={18} /></a>
          <a href={`${homePath}#whatsapp`}><MessageCircle size={17} />{ui.whatsapp}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 BATUMI DENTAL CLINIC</span>
        <div className="footer-languages" aria-label={t.languageLabel}>
          {languages.map((language) => (
            <button type="button" className={lang === language.code ? 'active' : ''} onClick={() => onLanguageChange(language.code)} key={language.code}>{language.short}</button>
          ))}
        </div>
        <small>{page === 'aftercare' ? care.prototypeNote : t.footerNote}</small>
      </div>
    </footer>
  )
}
