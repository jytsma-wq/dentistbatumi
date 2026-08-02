import {
  ArrowRight,
  CalendarCheck,
  Check,
  ClipboardCheck,
  FileCheck2,
  HeartHandshake,
  PhoneCall,
  Printer,
  ShieldCheck,
  Stethoscope,
  TriangleAlert,
} from 'lucide-react'
import { interfaceContent } from './interface-content'
import { clinicImageProps, clinicProfile } from './clinic-profile'
import { SiteFooter, SiteHeader } from './SiteChrome'
import { routePath } from './routes'

const journeyIcons = [ClipboardCheck, FileCheck2, PhoneCall, CalendarCheck, Stethoscope]

export default function AftercarePage({ lang, t, care, onLanguageChange }) {
  const homePath = routePath(lang)
  const ui = interfaceContent[lang]

  return (
    <div className="site-shell aftercare-shell">
      <a className="skip-link" href="#aftercare-main">{t.skip}</a>
      <SiteHeader lang={lang} page="aftercare" t={t} care={care} onLanguageChange={onLanguageChange} />

      <main id="aftercare-main">
        <section className="care-hero" id="aftercare-top" aria-labelledby="care-title">
          <div className="care-hero-copy">
            <p className="eyebrow"><HeartHandshake size={17} />{care.hero.eyebrow}</p>
            <h1 id="care-title">{care.hero.title}</h1>
            <p className="care-hero-lede">{care.hero.lead}</p>
            <div className="care-hero-actions">
              <a className="button button-primary" href={`${homePath}#contact`}>{care.hero.primary}<ArrowRight size={18} /></a>
              <button className="text-button" type="button" onClick={() => window.print()}><Printer size={18} />{care.hero.secondary}</button>
            </div>
            <p className="care-hero-note"><ShieldCheck size={17} />{care.hero.note}</p>
            <strong className="care-support-line">{care.hero.supportLine}</strong>
          </div>

          <figure className="care-hero-media">
            <img src={clinicProfile.media.planning} alt={ui.photoAltPlanning} {...clinicImageProps(clinicProfile.media.planning, { priority: true })} />
            <figcaption className="care-passport" aria-label={care.passport.ariaLabel}>
              <span>{care.passport.label}</span>
              <strong>{care.passport.title}</strong>
              <p>{care.passport.text}</p>
              <small><Check size={15} />{care.passport.stamp}</small>
            </figcaption>
          </figure>
        </section>

        <div className="care-assurance" aria-label={care.assuranceLabel}>
          {care.assurances.map(([title, text]) => (
            <div key={title}><div><strong>{title}</strong><small>{text}</small></div></div>
          ))}
        </div>

        <section className="care-journey section" aria-labelledby="journey-title">
          <div className="care-journey-intro">
            <p className="eyebrow">{care.journey.eyebrow}</p>
            <h2 id="journey-title">{care.journey.title}</h2>
            <p>{care.journey.intro}</p>
            <figure><img src={clinicProfile.media.conversation} alt={ui.photoAltConsultation} {...clinicImageProps(clinicProfile.media.conversation)} /></figure>
          </div>
          <div className="care-journey-list">
            {care.journey.steps.map((step, index) => {
              const Icon = journeyIcons[index]
              return (
                <article key={step.title}>
                  <div className="journey-marker"><Icon size={20} /></div>
                  <div><span>{step.when}</span><h3>{step.title}</h3><p>{step.text}</p></div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="first-week section" aria-labelledby="first-week-title">
          <div className="first-week-heading">
            <div><p className="eyebrow light">{care.firstWeek.eyebrow}</p><h2 id="first-week-title">{care.firstWeek.title}</h2></div>
            <div><p>{care.firstWeek.intro}</p><strong>{care.firstWeek.personalAdvice}</strong></div>
          </div>
          <div className="symptom-grid">
            {care.firstWeek.cards.map((card) => (
              <article className={`symptom-card tone-${card.tone}`} key={card.title}>
                <div className="symptom-icon">
                  {card.tone === 'emergency' ? <TriangleAlert size={22} /> : card.tone === 'call' ? <PhoneCall size={22} /> : <HeartHandshake size={22} />}
                </div>
                <span>{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.intro}</p>
                <ul>{card.items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
                <strong className="symptom-action">{card.action}</strong>
              </article>
            ))}
          </div>
          <p className="channel-note"><PhoneCall size={18} />{care.firstWeek.channelNote}</p>
        </section>

        <section className="care-promise section" aria-labelledby="promise-title">
          <div className="promise-symbol"><ShieldCheck size={34} /></div>
          <div>
            <p className="eyebrow light">{care.promise.eyebrow}</p>
            <h2 id="promise-title">{care.promise.title}</h2>
            <blockquote>“{care.promise.quote}”</blockquote>
            <p>{care.promise.scope}</p>
          </div>
        </section>

        <section className="certainty section" aria-labelledby="certainty-title">
          <div className="certainty-heading">
            <p className="eyebrow">{care.certainty.eyebrow}</p>
            <h2 id="certainty-title">{care.certainty.title}</h2>
            <p>{care.certainty.intro}</p>
          </div>
          <div className="certainty-list">
            {care.certainty.items.map((item) => (
              <article key={item.title}>
                <div><small>{item.label}</small><h3>{item.title}</h3><p>{item.text}</p></div>
              </article>
            ))}
          </div>
          <p className="certainty-note"><TriangleAlert size={19} />{care.certainty.note}</p>
        </section>

        <section className="aftercare-handout section" id="first-seven-days-handout" aria-labelledby="handout-title">
          <div className="handout-toolbar">
            <div><p className="eyebrow">{care.handout.eyebrow}</p><h2 id="handout-title">{care.handout.title}</h2></div>
            <button className="button button-primary" type="button" onClick={() => window.print()}><Printer size={18} />{care.handout.printLabel}</button>
          </div>
          <p className="handout-intro">{care.handout.intro}</p>
          <div className="handout-paper">
            <div className="handout-paper-head">
              <div><strong>BATUMI DENTAL CLINIC</strong><span>{care.passport.title}</span></div>
              <div className="handout-seven">07</div>
            </div>
            <h3>{care.handout.documentTitle}</h3>
            <div className="handout-fields">
              {care.handout.fields.map((field) => <div key={field}><span>{field}</span><i /></div>)}
            </div>
            <p className="handout-priority">{care.handout.priority}</p>
            <div className="handout-columns">
              {care.handout.groups.map((group, index) => (
                <section key={group.title}>
                  <span>0{index + 1} · {group.label}</span><h4>{group.title}</h4>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              ))}
            </div>
            <div className="handout-contact">
              <strong>{care.handout.contactTitle}</strong>
              <p>{care.handout.contactClinic}</p>
              <p>{care.handout.contactEmergency}</p>
            </div>
            <p className="handout-confirmation">{care.handout.confirmation}</p>
            <div className="handout-signatures">
              {care.handout.signatures.map((label) => <div key={label}><i /><span>{label}</span></div>)}
            </div>
          </div>
        </section>

        <section className="care-closing" aria-labelledby="closing-title">
          <figure><img src={clinicProfile.media.clinic} alt={ui.photoAltClinic} {...clinicImageProps(clinicProfile.media.clinic)} /></figure>
          <div><p className="eyebrow light">{care.closing.eyebrow}</p><h2 id="closing-title">{care.closing.title}</h2><p>{care.closing.text}</p><a className="button button-light" href={`${homePath}#contact`}>{care.closing.cta}<ArrowRight size={18} /></a></div>
        </section>
      </main>

      <SiteFooter lang={lang} page="aftercare" t={t} care={care} onLanguageChange={onLanguageChange} />
    </div>
  )
}
