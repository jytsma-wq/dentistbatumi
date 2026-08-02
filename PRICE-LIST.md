# Clinic price list

The public price page is driven by `src/clinic-prices.js`. It intentionally ships without borrowed or invented amounts.

For each clinic installation:

1. Find the relevant treatment ID in `priceServiceTemplates`.
2. Add that ID to `clinicPriceEntries` and set `enabled: true` only when the clinic offers that treatment.
3. Enter the clinic-approved price in GEL and choose `fixed`, `from`, `range`, or `onRequest`.
4. Add translated inclusions, exclusions, material/system, visits, duration, diagnostics and notes where known.
5. Set `lastVerified` to the approval date and change `verified` to `true` only after the clinic signs off.

Example structure (illustrative fields only; do not copy an amount from another clinic):

```js
export const clinicPriceEntries = {
  zirconiaCrown: {
    enabled: true,
    verified: true,
    name: {},
    description: {},
    price: { mode: 'from', min: CLINIC_APPROVED_GEL_AMOUNT, max: null },
    unit: 'tooth',
    includes: [{ nl: '...', de: '...', fr: '...', lb: '...', en: '...', ka: '...' }],
    excludes: [],
    materialSystem: { nl: '...', de: '...', fr: '...', lb: '...', en: '...', ka: '...' },
    visits: { min: 2, max: 3 },
    duration: {},
    diagnostics: {},
    note: {},
    lastVerified: 'YYYY-MM-DD',
  },
}
```

The rendering contract fails closed: an item is public only when it is enabled, verified and has a valid price mode. GEL remains the primary currency. Any later EUR or CHF conversion must be clearly labelled indicative and dated.
