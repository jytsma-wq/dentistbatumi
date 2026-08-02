# Productgegevens invullen

Alle product-specifieke informatie staat op één plek: `src/clinic-products.js`.
De vormgeving, categorieën, zes talen en labels zijn al gereed.

Vul per product alleen de lege waarden in:

- `name`: exacte product- of productlijnnaam;
- `brand`: merk;
- `manufacturer`: fabrikant;
- `system`: systeem of serie;
- `material`: materiaalomschrijving;
- `origin`: tweecijferige landcode, bijvoorbeeld `DE`, `CH` of `IT`;
- `documentation`: één of meer gecontroleerde HTTPS-documentlinks;
- `warranty`: aanbieder, aantal maanden en eventueel een HTTPS-link naar de voorwaarden;
- `batchTraceability`: uitsluitend `true` wanneer lot- of batchregistratie werkelijk wordt vastgelegd.

Kopieer een volledig productobject wanneer binnen één categorie meerdere producten worden gebruikt. Geef ieder object een unieke `id` en laat de `category` ongewijzigd.

Lege of niet-bevestigde velden worden automatisch niet op de website getoond. Voeg geen patiëntgebonden batch- of lotnummers aan deze openbare catalogus toe; die horen uitsluitend in het individuele behandeldossier.

