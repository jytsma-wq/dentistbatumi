# Batumi Dental Clinic

Meertalige website voor een zelfstandige tandartspraktijk in Batumi, voor lokale patiënten en internationale bezoekers. De site is gebouwd als een React/Vite-app en ondersteunt Nederlands, Duits, Frans, Luxemburgs, Engels en Georgisch.

## Lokaal uitvoeren

Gebruik Node.js 22 of nieuwer en pnpm.

```powershell
pnpm install
pnpm dev
```

Kwaliteitscontroles:

```powershell
pnpm test
pnpm build
```

## Belangrijkste routes

- `/{taal}` — kliniek, behandelingen, lokale en internationale patiëntinformatie, afspraakaanvraag en WhatsApp-uitleg
- `/{taal}/aftercare` — nazorg, het eerste-weekprotocol en printbare patiënteninformatie
- `/{taal}/prices` — transparante prijslijst in GEL, met inbegrepen onderdelen, materialen en behandelduur
- `/{taal}/privacy` — gegevensverwerking en de voorwaarden voor activering van klinische uploads

Oude publieke routes zoals `/{taal}/treatments`, `/international`, `/local`, `/results` en `/upload` worden door de app naar de passende sectie geleid.

## Besloten klinische intake

De Sites-worker in `worker/index.js` verwerkt afspraakaanvragen en maximaal vijf klinische testbestanden via same-origin API-routes. Bestanden en manifesten worden niet openbaar in de gebonden R2-bucket `CLINICAL_UPLOADS` opgeslagen en kunnen met de eenmalige verwijdercode uit het ontvangstbewijs worden verwijderd.

Gebruik tot de publieke activering uitsluitend synthetische testgegevens. Voor echte patiëntgegevens moeten ten minste de juridische kliniekidentiteit, privacycontactpersoon, geauthenticeerde medewerkerstoegang, auditlogging, automatische verwijdering, rate limiting, malwarecontrole en internationale gegevensverwerking schriftelijk en technisch zijn geregeld.

## Openstaande praktijkgegevens

De website verzint geen medewerkers, erkenningen, adres, openingstijden, prijzen, reviews of telefoonnummer. Die onderdelen worden pas live gekoppeld nadat de kliniek ze heeft geverifieerd. Hetzelfde geldt voor het officiële WhatsApp-nummer en eventuele verzekerings- of garantievoorwaarden.

## Herbruikbaar per kliniek

Deze versie is zowel een Batumi Dental Clinic-demonstratie als een herbruikbare commerciële basis. Identiteit, kleuren, fotografie, booking en WhatsApp staan in `src/clinic-profile.js`; officiële producten in `src/clinic-products.js`; prijzen in `src/clinic-prices.js`; en artsen, diploma’s, reviews en sociale kanalen in `src/clinic-trust-data.js`. De verkoopdemo staat bewust op `noindex`; pas na gecontroleerde kliniek-onboarding wordt `templateMode` uitgezet. Zie `CLINIC-CUSTOMIZATION.md` voor de volledige opleverchecklist.
