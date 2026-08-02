import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronDown, Globe2, Menu, MessageCircle, X } from 'lucide-react'
import { languages } from './content'
import { FlagIcon } from './FlagIcon'
import { clinicProfile, getClinicContactUrl } from './clinic-profile'
import { interfaceContent } from './interface-content'
import { experienceContent } from './experience-content'
import { pricesContent } from './prices-content'
import { privacyContent } from './privacy-content'
import { routePath } from './routes'
import { ClinicSocialLinks } from './TrustSections'
import { trustContent } from './trust-content'

export function Brand({ light = false, homeHref = '/nl' }) {
  return (
    <a className={`brand ${light ? 'brand-light' : ''}`} href={homeHref} aria-label={clinicProfile.brand.name}>
      <span className="brand-logo" style={{ backgroundImage: `url(${clinicProfile.brand.wordmarkAsset})` }} aria-hidden="true" />
    </a>
  )
}

const serviceGroupIndexes = [[0, 1, 2, 3, 8, 9], [4, 5], [6, 7]]

function localizedPageHref(languageCode, page) {
  const hash = page !== 'notFound' && typeof window !== 'undefined' ? window.location.hash : ''
  return `${routePath(languageCode, page)}${hash}`
}

export function SiteHeader({ lang, page, t, care, onLanguageChange, onServiceSelect }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const menuButton = useRef(null)
  const mobileNav = useRef(null)
  const servicesButton = useRef(null)
  const servicesNavigation = useRef(null)
  const servicesCloseTimer = useRef(null)
  const languageButton = useRef(null)
  const languageNavigation = useRef(null)
  const ui = interfaceContent[lang]
  const experience = experienceContent[lang]
  const homePath = routePath(lang)
  const homeNav = t.nav.map(([label, href]) => [label, page === 'home' ? href : `${homePath}${href}`])
  const carePath = routePath(lang, 'aftercare')
  const pricesPath = routePath(lang, 'prices')
  const bookingUrl = getClinicContactUrl('booking')
  const whatsappUrl = getClinicContactUrl('whatsapp')
  const contactPath = bookingUrl || (page === 'home' ? '#contact' : `${homePath}#contact`)
  const whatsappPath = whatsappUrl || (page === 'home' ? '#whatsapp' : `${homePath}#whatsapp`)
  const currentLanguage = languages.find((language) => language.code === lang) || languages[0]

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

    function closeServicesOutside(event) {
      if (servicesNavigation.current?.contains(event.target)) return
      setServicesOpen(false)
    }

    document.addEventListener('pointerdown', closeServicesOutside)
    return () => document.removeEventListener('pointerdown', closeServicesOutside)
  }, [servicesOpen])

  useEffect(() => {
    if (!languageOpen) return undefined

    function closeLanguageOutside(event) {
      if (languageNavigation.current?.contains(event.target)) return
      setLanguageOpen(false)
    }

    function closeLanguageWithKeyboard(event) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setLanguageOpen(false)
      requestAnimationFrame(() => languageButton.current?.focus())
    }

    document.addEventListener('pointerdown', closeLanguageOutside)
    document.addEventListener('keydown', closeLanguageWithKeyboard)
    return () => {
      document.removeEventListener('pointerdown', closeLanguageOutside)
      document.removeEventListener('keydown', closeLanguageWithKeyboard)
    }
  }, [languageOpen])

  useEffect(() => () => {
    if (servicesCloseTimer.current) window.clearTimeout(servicesCloseTimer.current)
  }, [])

  function closeMenu() {
    setMenuOpen(false)
    setMobileServicesOpen(false)
  }

  function cancelServicesClose() {
    if (!servicesCloseTimer.current) return
    window.clearTimeout(servicesCloseTimer.current)
    servicesCloseTimer.current = null
  }

  function openServices() {
    cancelServicesClose()
    setServicesOpen(true)
  }

  function closeServices({ returnFocus = false } = {}) {
    cancelServicesClose()
    setServicesOpen(false)
    if (returnFocus) requestAnimationFrame(() => servicesButton.current?.focus())
  }

  function scheduleServicesClose() {
    cancelServicesClose()
    servicesCloseTimer.current = window.setTimeout(() => {
      setServicesOpen(false)
      servicesCloseTimer.current = null
    }, 220)
  }

  function selectService(event, index) {
    closeServices()
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
            ref={servicesNavigation}
            className="services-navigation"
            onPointerEnter={openServices}
            onPointerLeave={scheduleServicesClose}
            onFocus={cancelServicesClose}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) scheduleServicesClose() }}
          >
            <button
              ref={servicesButton}
              type="button"
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
              onClick={() => {
                cancelServicesClose()
                setServicesOpen((open) => !open)
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  openServices()
                  window.setTimeout(() => {
                    const firstService = servicesNavigation.current?.querySelector('#services-menu a[href]')
                    if (firstService instanceof HTMLElement) HTMLElement.prototype.focus.call(firstService)
                  }, 60)
                } else if (event.key === 'Escape' && servicesOpen) {
                  event.preventDefault()
                  closeServices({ returnFocus: true })
                }
              }}
            >
              {homeNav[0][0]}<ChevronDown size={15} />
            </button>
            <div
              id="services-menu"
              className={`services-mega ${servicesOpen ? 'open' : ''}`}
              onPointerEnter={cancelServicesClose}
              onPointerLeave={scheduleServicesClose}
              onKeyDown={(event) => {
                if (event.key !== 'Escape') return
                event.preventDefault()
                closeServices({ returnFocus: true })
              }}
            >
              <div className="services-mega-intro">
                <span>{ui.allTreatments}</span>
                <strong>{ui.serviceMenuIntro}</strong>
                <a href={page === 'home' ? '#behandelingen' : `${homePath}#behandelingen`} onClick={() => closeServices()}>{ui.allTreatments}<ArrowRight size={16} /></a>
              </div>
              <div className="services-mega-groups">
                {serviceGroupIndexes.map((indexes, groupIndex) => (
                  <section key={ui.serviceGroups[groupIndex]}>
                    <h2>{ui.serviceGroups[groupIndex]}</h2>
                    {indexes.map((index) => t.treatments[index] && (
                      <a href={page === 'home' ? `#behandeling-${t.treatments[index].number}` : `${homePath}#behandeling-${t.treatments[index].number}`} onClick={(event) => selectService(event, index)} key={t.treatments[index].name}>
                        {t.treatments[index].name}
                      </a>
                    ))}
                  </section>
                ))}
              </div>
            </div>
          </div>
          {homeNav[1] && <a href={homeNav[1][1]}>{experience.navTeam}</a>}
          <a href={pricesPath} aria-current={page === 'prices' ? 'page' : undefined}>{pricesContent[lang].navLabel}</a>
          {homeNav[2] && <a href={homeNav[2][1]}>{experience.navPatients}</a>}
          <a href={carePath} aria-current={page === 'aftercare' ? 'page' : undefined}>{experience.navAftercare}</a>
        </nav>
        <div className="header-tools">
          <div
            ref={languageNavigation}
            className={`language-menu ${languageOpen ? 'open' : ''}`}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setLanguageOpen(false)
            }}
          >
            <button
              ref={languageButton}
              type="button"
              className="language-trigger"
              aria-expanded={languageOpen}
              aria-controls="language-options"
              aria-label={`${t.languageLabel}: ${currentLanguage.label}`}
              onClick={() => {
                setMenuOpen(false)
                setLanguageOpen((open) => !open)
              }}
              onKeyDown={(event) => {
                if (event.key !== 'ArrowDown') return
                event.preventDefault()
                setLanguageOpen(true)
                window.setTimeout(() => languageNavigation.current?.querySelector('a')?.focus(), 40)
              }}
            >
              <FlagIcon code={currentLanguage.code} />
              <span className="language-code">{currentLanguage.short}</span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            <nav id="language-options" className="language-options" aria-label={t.languageLabel}>
              <span className="language-options-title">{t.languageLabel}</span>
              {languages.map((language) => (
                <a
                  href={localizedPageHref(language.code, page)}
                  hrefLang={language.code}
                  lang={language.code}
                  aria-current={lang === language.code ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    setLanguageOpen(false)
                    onLanguageChange(language.code)
                    requestAnimationFrame(() => languageButton.current?.focus())
                  }}
                  key={language.code}
                >
                  <FlagIcon code={language.code} />
                  <span>{language.label}</span>
                  <small>{language.short}</small>
                </a>
              ))}
            </nav>
          </div>
          <a className="header-whatsapp" href={whatsappPath} target={whatsappUrl ? '_blank' : undefined} rel={whatsappUrl ? 'noreferrer' : undefined}><MessageCircle size={17} /><span>{ui.whatsapp}</span></a>
          <a className="button header-button" href={contactPath} target={bookingUrl ? '_blank' : undefined} rel={bookingUrl ? 'noreferrer' : undefined}>{ui.appointment}<ArrowRight size={16} /></a>
          <button
            ref={menuButton}
            className="menu-button"
            type="button"
            onClick={() => {
              setLanguageOpen(false)
              setMenuOpen((open) => !open)
            }}
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
              <button type="button" className="mobile-service-toggle" aria-expanded={mobileServicesOpen} aria-controls="mobile-service-list" onClick={() => setMobileServicesOpen((open) => !open)}>
                <strong>{homeNav[0][0]}</strong><ChevronDown size={19} />
              </button>
              <div id="mobile-service-list" className={`mobile-service-list ${mobileServicesOpen ? 'open' : ''}`}>
                {t.treatments.map((treatment, index) => (
                  <a href={page === 'home' ? `#behandeling-${treatment.number}` : `${homePath}#behandeling-${treatment.number}`} onClick={(event) => selectService(event, index)} key={treatment.name}>
                    {treatment.name}
                  </a>
                ))}
              </div>
            </div>
            {homeNav[1] && <a onClick={closeMenu} href={homeNav[1][1]}>{homeNav[1][0]}<ArrowRight size={19} /></a>}
            <a onClick={closeMenu} href={pricesPath} aria-current={page === 'prices' ? 'page' : undefined}>
              {pricesContent[lang].navLabel}<ArrowRight size={19} />
            </a>
            {homeNav.slice(2).map(([label, href]) => (
              <a onClick={closeMenu} href={href} key={href}>{label}<ArrowRight size={19} /></a>
            ))}
            <a onClick={closeMenu} href={carePath} aria-current={page === 'aftercare' ? 'page' : undefined}>
              {care.navLabel}<ArrowRight size={19} />
            </a>
            <div className="mobile-nav-actions">
              <a className="button button-light" onClick={closeMenu} href={contactPath} target={bookingUrl ? '_blank' : undefined} rel={bookingUrl ? 'noreferrer' : undefined}><CalendarDays size={18} />{ui.appointment}</a>
              <a className="button button-outline-light" onClick={closeMenu} href={whatsappPath} target={whatsappUrl ? '_blank' : undefined} rel={whatsappUrl ? 'noreferrer' : undefined}><MessageCircle size={18} />{ui.whatsapp}</a>
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
  const pricesPath = routePath(lang, 'prices')
  const bookingUrl = getClinicContactUrl('booking')
  const whatsappUrl = getClinicContactUrl('whatsapp')
  const contactPath = bookingUrl || (page === 'home' ? '#contact' : `${homePath}#contact`)
  const whatsappPath = whatsappUrl || `${homePath}#whatsapp`

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <a className="footer-logo-art" href={homePath} aria-label={clinicProfile.brand.name} style={{ backgroundImage: `url(${clinicProfile.brand.wordmarkAsset})` }}>
            <strong>{clinicProfile.brand.shortName}</strong>
            <span>{clinicProfile.brand.descriptor}</span>
          </a>
          <p>{page === 'aftercare' ? care.footerLine : t.footerLine}</p>
          <span>{t.location}</span>
        </div>
        <nav className="footer-links" aria-label={t.footerNavLabel}>
          <span>{t.mainNavLabel}</span>
          <a href={homePath}>{t.homeLabel}</a>
          <a href={`${homePath}#behandelingen`}>{t.nav[0][0]}</a>
          <a href={pricesPath}>{pricesContent[lang].navLabel}</a>
          <a href={`${homePath}#kliniek`}>{t.nav[1][0]}</a>
          <a href={`${homePath}#reviews`}>{(trustContent[lang] || trustContent.en).reviews.eyebrow}</a>
          <a href={`${homePath}#patienten`}>{t.nav[2][0]}</a>
          <a href={carePath}>{care.navLabel}</a>
          <a href={privacyPath}>{privacyContent[lang].navLabel}</a>
        </nav>
        <div className="footer-contact">
          <span>{ui.audience}</span>
          <a className="footer-appointment" href={contactPath} target={bookingUrl ? '_blank' : undefined} rel={bookingUrl ? 'noreferrer' : undefined}>{t.cta}<ArrowRight size={18} /></a>
          <a href={whatsappPath} target={whatsappUrl ? '_blank' : undefined} rel={whatsappUrl ? 'noreferrer' : undefined}><MessageCircle size={17} />{ui.whatsapp}</a>
          <ClinicSocialLinks lang={lang} compact />
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 {clinicProfile.brand.name.toUpperCase()}</span>
        <div className="footer-languages" aria-label={t.languageLabel}>
          {languages.map((language) => (
            <a
              href={localizedPageHref(language.code, page)}
              hrefLang={language.code}
              lang={language.code}
              className={lang === language.code ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault()
                onLanguageChange(language.code)
              }}
              key={language.code}
              aria-label={language.label}
              aria-current={lang === language.code ? 'page' : undefined}
            >
              <FlagIcon code={language.code} />
              <span>{language.short}</span>
            </a>
          ))}
        </div>
        <small>{page === 'aftercare' ? care.prototypeNote : t.footerNote}</small>
      </div>
    </footer>
  )
}
