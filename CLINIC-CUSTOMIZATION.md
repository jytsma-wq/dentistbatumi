# Van demonstratie naar een unieke kliniekwebsite

De ontwerp- en patiëntreis blijven herbruikbaar; iedere verkochte installatie krijgt een eigen identiteit, inhoud en bewijs. Publiceer nooit voorbeeldgegevens als kliniekfeiten.

## Centrale invulpunten

1. `src/clinic-profile.js` — klinieknaam, woordmerk, social preview, kleurensysteem, fotografie, officiële booking-URL en WhatsApp-URL. Laat `templateMode: true` staan voor een verkoopdemo; zet dit pas na volledige onboarding op `false` zodat zoekmachines de kliniekwebsite mogen indexeren.
2. `src/content.js` en de `*-content.js`-bestanden — kliniektoon, locatie, lokale patiëntinformatie en alle zes talen.
3. `src/clinic-products.js` — door de kliniek bevestigde merken, materialen, documentatie, traceerbaarheid en garantie.
4. `src/clinic-prices.js` — officiële GEL-prijzen, inbegrepen en uitgesloten onderdelen, materiaal, bezoeken en verificatiedatum.
5. `src/clinic-trust-data.js` — echte tandartsen, kwalificaties, kliniekcertificaten, reviews en Facebook/Instagram.
6. `public/assets/` — eigen kliniek-, team- en behandelfoto’s met toestemming; vervang alle conceptbeelden.

## Voor iedere verkoop

- pas kleur, fotografie, typografische verhoudingen en contentritme aan de kliniek aan;
- laat de kliniek schriftelijk akkoord geven op teamprofielen, prijzen, materialen, certificaten en medische claims;
- activeer WhatsApp en contactgegevens alleen met officiële nummers en URL’s;
- controleer privacy, bewaartermijnen en medewerkerstoegang voordat echte patiëntfoto’s worden ontvangen;
- test alle talen, pagina’s, formulieren en mobiele menu’s opnieuw;
- publiceer pas daarna onder het eigen domein van de kliniek.

De afzonderlijke invulcontracten staan ook in `PRODUCTS.md`, `PRICE-LIST.md` en `CLINIC-TRUST.md`.
