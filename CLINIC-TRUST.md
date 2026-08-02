# Clinic trust data

The team, credentials, reviews and social links are deliberately separated from the presentation layer. Configure one clinic in `src/clinic-trust-data.js`; the components in `src/TrustSections.jsx` then render only publishable, verified information.

## Publication rule

An entry is visible as proof only when both fields are set:

```js
status: 'verified',
published: true,
```

Reviews additionally require `consent: true`, a display name and a public HTTPS source. Social links require a public HTTPS URL. Until then, the template shows a polished and explicitly honest preparation state.

## Dentist example

```js
{
  id: 'unique-id',
  status: 'verified',
  published: true,
  name: 'Verified full name',
  role: {
    nl: 'Tandarts',
    de: 'Zahnarzt',
    fr: 'Dentiste',
    lb: 'Zänndokter',
    en: 'Dentist',
    ka: 'სტომატოლოგი',
  },
  image: {
    src: '/assets/verified-team-photo.webp',
    alt: { en: 'Verified full name in the clinic' },
  },
  bio: { en: 'Clinic-approved biography.' },
  languages: ['ქართული', 'English'],
  treatments: { en: ['Restorative dentistry'] },
  registration: {
    authority: 'Verified authority',
    number: 'Verified number',
    verificationUrl: 'https://official-source.example/record',
  },
  qualifications: [
    {
      id: 'qualification-id',
      status: 'verified',
      published: true,
      title: { en: 'Verified qualification' },
      institution: { en: 'Verified institution' },
      year: 2025,
      verificationUrl: 'https://official-source.example/document',
    },
  ],
}
```

## Clinic credential example

```js
{
  id: 'credential-id',
  status: 'verified',
  published: true,
  title: { en: 'Verified clinic credential' },
  issuer: { en: 'Verified issuing organisation' },
  identifier: 'Verified reference',
  issuedOn: '2026-01-01',
  expiresOn: '2027-01-01',
  verificationUrl: 'https://official-source.example/record',
}
```

## Review example

```js
{
  id: 'review-id',
  status: 'verified',
  published: true,
  consent: true,
  quote: { en: 'An approved excerpt from a real review.' },
  authorDisplay: 'Approved display name',
  date: '2026-01-01',
  sourceName: 'Official review platform',
  sourceUrl: 'https://review-platform.example/review',
}
```

Do not add aggregate ratings or review totals unless the source, retrieval date and continued accuracy can be maintained. Keep dental qualifications attached to the individual clinician; keep licences and clinic-wide certificates under `clinicCredentials`.
