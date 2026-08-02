import {
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  Facebook,
  GraduationCap,
  Instagram,
  Languages,
  ShieldCheck,
} from 'lucide-react'
import {
  clinicTrustData,
  getPublishedClinicCredentials,
  getPublishedDentists,
  getPublishedReviews,
  getPublishedSocials,
  isSafeTrustImage,
  isSafeTrustUrl,
  localizeTrustField,
} from './clinic-trust-data'
import { trustContent } from './trust-content'
import './trust.css'

function formatTrustDate(value, locale) {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return ''

  try {
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', timeZone: 'UTC' }).format(date)
  } catch {
    return String(value)
  }
}

function localizedList(values, locale) {
  const localizedValues = Array.isArray(values)
    ? values
    : values && typeof values === 'object'
      ? values[locale] || values.en || values.nl || []
      : values
        ? [values]
        : []

  return (Array.isArray(localizedValues) ? localizedValues : [localizedValues])
    .map((value) => localizeTrustField(value, locale))
    .filter(Boolean)
}

function initials(name) {
  return String(name || '')
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function ContactAction({ label, href, onContact }) {
  if (typeof onContact === 'function') {
    return (
      <button className="trust-text-action" type="button" onClick={onContact}>
        {label}<ArrowRight size={17} aria-hidden="true" />
      </button>
    )
  }

  return (
    <a className="trust-text-action" href={href || '#contact'}>
      {label}<ArrowRight size={17} aria-hidden="true" />
    </a>
  )
}

function DentistProfile({ dentist, locale, copy }) {
  const name = localizeTrustField(dentist.name, locale)
  const role = localizeTrustField(dentist.role, locale)
  const bio = localizeTrustField(dentist.bio, locale)
  const imageSource = dentist.image?.src
  const imageAlt = localizeTrustField(dentist.image?.alt, locale) || name
  const languages = localizedList(dentist.languages, locale)
  const treatments = localizedList(dentist.treatments, locale)
  const registrationAuthority = localizeTrustField(dentist.registration?.authority, locale)
  const registrationNumber = String(dentist.registration?.number || '').trim()
  const registrationUrl = dentist.registration?.verificationUrl

  return (
    <article className="trust-dentist">
      <div className="trust-dentist-portrait">
        {isSafeTrustImage(imageSource) ? (
          <img src={imageSource} alt={imageAlt} loading="lazy" />
        ) : (
          <span aria-hidden="true">{initials(name)}</span>
        )}
      </div>

      <div className="trust-dentist-copy">
        <header>
          <p>{role}</p>
          <h3>{name}</h3>
        </header>
        {bio && <p className="trust-dentist-bio">{bio}</p>}

        <div className="trust-dentist-facts">
          {languages.length > 0 && (
            <div>
              <Languages size={18} aria-hidden="true" />
              <dl><dt>{copy.languages}</dt><dd>{languages.join(' · ')}</dd></dl>
            </div>
          )}
          {treatments.length > 0 && (
            <div>
              <BadgeCheck size={18} aria-hidden="true" />
              <dl><dt>{copy.treatments}</dt><dd>{treatments.join(' · ')}</dd></dl>
            </div>
          )}
        </div>

        {dentist.qualifications.length > 0 && (
          <div className="trust-qualifications">
            <h4><GraduationCap size={19} aria-hidden="true" />{copy.qualifications}</h4>
            <ul>
              {dentist.qualifications.map((qualification, qualificationIndex) => {
                const title = localizeTrustField(qualification.title, locale)
                const institution = localizeTrustField(qualification.institution, locale)
                const verificationUrl = qualification.verificationUrl
                return (
                  <li key={qualification.id || `${title}-${qualificationIndex}`}>
                    <span><strong>{title}</strong><small>{institution}{qualification.year ? ` · ${qualification.year}` : ''}</small></span>
                    {isSafeTrustUrl(verificationUrl) && (
                      <a href={verificationUrl} target="_blank" rel="noreferrer">
                        {copy.verify}<ExternalLink size={14} aria-hidden="true" />
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {(registrationAuthority || registrationNumber) && (
          <div className="trust-registration">
            <span>{copy.registration}</span>
            <strong>{[registrationAuthority, registrationNumber].filter(Boolean).join(' · ')}</strong>
            {isSafeTrustUrl(registrationUrl) && (
              <a href={registrationUrl} target="_blank" rel="noreferrer" aria-label={`${copy.verify}: ${name}`}>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export function TeamTrustSection({
  lang = 'en',
  data = clinicTrustData,
  id = 'team',
  contactHref = '#contact',
  onContact,
}) {
  const copy = (trustContent[lang] || trustContent.en).team
  const dentists = getPublishedDentists(data, lang)

  return (
    <section className="trust-team" id={id} aria-labelledby={`${id}-title`}>
      <div className="trust-wrap">
        <header className="trust-split-heading">
          <div>
            <p className="trust-eyebrow"><span />{copy.eyebrow}</p>
            <h2 id={`${id}-title`}>{copy.title}</h2>
          </div>
          <div className="trust-heading-aside">
            <p>{copy.intro}</p>
            <ContactAction label={copy.contact} href={contactHref} onContact={onContact} />
          </div>
        </header>

        {dentists.length > 0 ? (
          <div className="trust-dentists">
            {dentists.map((dentist, index) => (
              <DentistProfile key={dentist.id || `${localizeTrustField(dentist.name, lang)}-${index}`} dentist={dentist} locale={lang} copy={copy} />
            ))}
          </div>
        ) : (
          <div className="trust-team-empty" data-template-state="awaiting-verified-team">
            <div className="trust-empty-monogram" aria-hidden="true">
              <span>TEAM</span>
              <i />
            </div>
            <div className="trust-empty-copy">
              <p>{copy.emptyLabel}</p>
              <h3>{copy.emptyTitle}</h3>
              <div className="trust-empty-intro">{copy.emptyText}</div>
              <ul>
                {copy.emptySlots.map(([, title, text]) => (
                  <li key={title}>
                    <div><strong>{title}</strong><small>{text}</small></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function CredentialsTrustSection({ lang = 'en', data = clinicTrustData, id = 'quality' }) {
  const copy = (trustContent[lang] || trustContent.en).credentials
  const credentials = getPublishedClinicCredentials(data, lang)

  return (
    <section className="trust-credentials" id={id} aria-labelledby={`${id}-title`}>
      <div className="trust-wrap">
        <header className="trust-credentials-heading">
          <p className="trust-eyebrow trust-eyebrow-light"><span />{copy.eyebrow}</p>
          <h2 id={`${id}-title`}>{copy.title}</h2>
          <p>{copy.intro}</p>
        </header>

        {credentials.length > 0 ? (
          <div className="trust-credential-list">
            {credentials.map((credential, index) => {
              const title = localizeTrustField(credential.title, lang)
              const issuer = localizeTrustField(credential.issuer, lang)
              const verificationUrl = credential.verificationUrl || credential.documentUrl
              return (
                <article key={credential.id || `${title}-${index}`}>
                  <div>
                    <h3>{title}</h3>
                    <dl>
                      <div><dt>{copy.issuedBy}</dt><dd>{issuer}</dd></div>
                      {credential.identifier && <div><dt>{copy.identifier}</dt><dd>{credential.identifier}</dd></div>}
                      {formatTrustDate(credential.issuedOn, lang) && <div><dt>{copy.issuedOn}</dt><dd>{formatTrustDate(credential.issuedOn, lang)}</dd></div>}
                      {formatTrustDate(credential.expiresOn, lang) && <div><dt>{copy.validUntil}</dt><dd>{formatTrustDate(credential.expiresOn, lang)}</dd></div>}
                    </dl>
                  </div>
                  {isSafeTrustUrl(verificationUrl) && (
                    <a href={verificationUrl} target="_blank" rel="noreferrer" aria-label={`${copy.view}: ${title}`}>
                      {copy.view}<ExternalLink size={15} aria-hidden="true" />
                    </a>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <div className="trust-credential-empty" data-template-state="awaiting-verified-credentials">
            <article>
              <GraduationCap size={30} aria-hidden="true" />
              <span>{copy.emptyLabel}</span>
              <h3>{copy.dentistTitle}</h3>
              <p>{copy.dentistText}</p>
            </article>
            <article>
              <ShieldCheck size={30} aria-hidden="true" />
              <span>{copy.emptyLabel}</span>
              <h3>{copy.clinicTitle}</h3>
              <p>{copy.clinicText}</p>
            </article>
            <p><BadgeCheck size={18} aria-hidden="true" />{copy.emptyNote}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export function ReviewsTrustSection({ lang = 'en', data = clinicTrustData, id = 'reviews' }) {
  const copy = (trustContent[lang] || trustContent.en).reviews
  const reviews = getPublishedReviews(data, lang)

  return (
    <section className="trust-reviews" id={id} aria-labelledby={`${id}-title`}>
      <div className="trust-wrap">
        <header className="trust-reviews-heading">
          <p className="trust-eyebrow"><span />{copy.eyebrow}</p>
          <h2 id={`${id}-title`}>{copy.title}</h2>
          <p>{copy.intro}</p>
        </header>

        {reviews.length > 0 ? (
          <div className="trust-review-list">
            {reviews.map((review, index) => (
              <figure key={review.id || `${review.authorDisplay}-${index}`}>
                <blockquote>“{localizeTrustField(review.quote, lang)}”</blockquote>
                <figcaption>
                  <span><strong>{review.authorDisplay}</strong>{formatTrustDate(review.date, lang) && <small>{formatTrustDate(review.date, lang)}</small>}</span>
                  <a href={review.sourceUrl} target="_blank" rel="noreferrer">
                    {copy.source} · {review.sourceName}<ExternalLink size={14} aria-hidden="true" />
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="trust-review-empty" data-template-state="awaiting-verified-reviews">
            <span aria-hidden="true">“</span>
            <div><h3>{copy.emptyTitle}</h3><p>{copy.emptyText}</p></div>
          </div>
        )}
      </div>
    </section>
  )
}

export function ClinicSocialLinks({ lang = 'en', data = clinicTrustData, compact = false }) {
  const copy = (trustContent[lang] || trustContent.en).socials
  const socials = getPublishedSocials(data)
  const networks = [
    { key: 'facebook', label: copy.facebook, Icon: Facebook },
    { key: 'instagram', label: copy.instagram, Icon: Instagram },
  ]

  return (
    <aside
      className={`trust-socials${compact ? ' trust-socials-compact' : ''}`}
      aria-label={compact ? copy.title : undefined}
      aria-labelledby={compact ? undefined : 'trust-social-title'}
    >
      {!compact && (
        <div><h2 id="trust-social-title">{copy.title}</h2><p>{copy.text}</p></div>
      )}
      <ul>
        {networks.map(({ key, label, Icon }) => (
          <li key={key}>
            {socials[key] ? (
              <a href={socials[key]} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon aria-hidden="true" /><span>{label}</span><ExternalLink size={14} aria-hidden="true" />
              </a>
            ) : (
              <span className="trust-social-pending" aria-disabled="true" title={copy.pending}>
                <Icon aria-hidden="true" /><span>{label}</span><small>{copy.pending}</small>
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function TrustSections({
  lang = 'en',
  data = clinicTrustData,
  contactHref = '#contact',
  onContact,
  ids = {},
  showSocials = true,
}) {
  return (
    <div className="trust-sections">
      <TeamTrustSection lang={lang} data={data} id={ids.team || 'team'} contactHref={contactHref} onContact={onContact} />
      <CredentialsTrustSection lang={lang} data={data} id={ids.credentials || 'quality'} />
      <ReviewsTrustSection lang={lang} data={data} id={ids.reviews || 'reviews'} />
      {showSocials && <ClinicSocialLinks lang={lang} data={data} />}
    </div>
  )
}

export default TrustSections
