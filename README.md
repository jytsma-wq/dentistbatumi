# Marea Dental Batumi

Meertalige website voor één tandartskliniek in Batumi, gebouwd voor lokale en
internationale patiënten. De site ondersteunt:

- Georgisch (`/ka`)
- Engels (`/en`)
- Nederlands (`/nl`)
- Duits (`/de`)
- Frans (`/fr`)
- Luxemburgs (`/lb`)

## Lokaal starten

Node.js `>=22.13.0` is vereist.

```bash
npm install
npm run dev
npm test
```

## Centrale kliniekconfiguratie

De website verzint geen contact- of kliniekgegevens. Koppel vóór publieke
lancering de geverifieerde waarden via omgevingsvariabelen:

```text
NEXT_PUBLIC_WHATSAPP_NUMBER=995...
NEXT_PUBLIC_PHONE=+995...
NEXT_PUBLIC_EMAIL=...
NEXT_PUBLIC_ADDRESS=...
NEXT_PUBLIC_SITE_URL=https://...
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` gebruikt het internationale nummer zonder `+`,
spaties of streepjes. Alle WhatsApp-knoppen gebruiken daarna automatisch
dezelfde geverifieerde bestemming.

## Afspraak en privacy

In deze private beoordelingsversie blijft ingevulde formulierinformatie alleen
in de browser. De WhatsApp-overdracht bevat bewust uitsluitend een korte
introductie met de taal en, wanneer expliciet gekozen, de patiëntenroute.
Medische documenten horen niet in WhatsApp.

Voor een publieke patiëntenintake zijn eerst een passende beveiligde
verwerkingsroute, juridische kliniekidentiteit, privacyvoorwaarden,
bewaartermijnen en verantwoordelijke contactgegevens nodig.

## Publicatiecontrole

Vóór de site publiek en indexeerbaar wordt:

- voeg artsnamen, registraties en echte kliniekfotografie toe;
- koppel adres, openingstijden, telefoon, WhatsApp en e-mail;
- plaats uitsluitend geverifieerde cases en reviews met toestemming;
- laat Georgisch en Luxemburgs door moedertaalsprekers controleren;
- vervang de tijdelijke `robots.txt`-blokkade;
- test de volledige afspraakverwerking met de kliniek.
