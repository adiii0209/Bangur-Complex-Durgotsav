# Tech Context

## Stack

- Frontend: Vite + React + TypeScript + Tailwind CSS, Framer Motion for the
  success animation.
- Backend: Google Apps Script, deployed as a Web App (`doGet` for reads,
  `doPost` for writes), bound to one Google Sheet.
- Data store: the Google Sheet itself — no separate database.
- Hosting: any static host (Vercel/Netlify/GitHub Pages) for the frontend; the
  Apps Script Web App is hosted by Google.

## Google Sheet schema

One spreadsheet, e.g. **"Bangur Durga Puja 2026 — Records"**, three tabs:

### `Contributions`
| Column | Type | Notes |
|---|---|---|
| Timestamp | datetime | set server-side on insert |
| Name | string | required, ≤ 100 chars |
| Amount | number | required, positive; **never returned in plain form by GET** |
| Mode | string | one of `Cash`, `UPI`, `Bank Transfer` |

### `Expenses`
| Column | Type | Notes |
|---|---|---|
| Date | date | entered manually by the committee |
| Item | string | what was bought/paid for |
| Category | string | e.g. `Decoration`, `Priest`, `Catering`, `Logistics`, `Cultural Programme`, `Misc` |
| Amount | number | |
| Paid To | string | optional |
| Notes | string | optional |

This tab is edited **only** in the Sheet by the committee. The website never
writes to it.

### `Performances`
| Column | Type | Notes |
|---|---|---|
| Timestamp | datetime | set server-side on insert |
| Name | string | required, ≤ 100 chars |
| Act Name | string | required, ≤ 150 chars |
| Category | string | e.g. `Dance`, `Song`, `Drama`, `Instrumental`, `Other` |
| Contact | string | optional, ≤ 20 chars — **never returned by any public GET endpoint** |

## Apps Script Web App — endpoint contract

Deployed with execute-as "Me", access "Anyone" (required for an
unauthenticated public form). All write endpoints validate server-side per
`CRITICAL_INSTRUCTIONS.md` #3, and all endpoints must handle CORS (Apps Script
Web Apps require returning `ContentService` output with the right MIME type;
confirm the exact CORS approach works with the deployed frontend origin during
setup — this can be fiddly with Apps Script and may need a `doOptions` handler
or a JSONP-style fallback if `fetch` POST runs into CORS trouble).

### `GET ?action=getContributions`
Returns:
```json
{
  "contributions": [
    { "name": "Aditya Sen", "amountMasked": "₹ ● ● ● ●", "mode": "UPI" }
  ]
}
```
Amount is masked **server-side** — see `CRITICAL_INSTRUCTIONS.md` #1. Decide
with Aditya whether `mode` should even be public before shipping; default to
including it since it's low-sensitivity, but flag it for confirmation.

### `POST action=addContribution`
Body: `{ "name": string, "amount": number, "mode": "Cash"|"UPI"|"Bank Transfer", "honeypot": "" }`
- Reject if `honeypot` is non-empty (bot).
- Reject if `name` empty or > 100 chars, `amount` not a positive number, `mode`
  not one of the three values.
- On success, append a row to `Contributions` with a server-set timestamp.
Returns: `{ "success": true }` or `{ "success": false, "error": "..." }`.

### `GET ?action=getExpenses`
Returns:
```json
{
  "expenses": [
    { "date": "2026-09-20", "item": "Marquee booking", "category": "Logistics", "amount": 15000, "paidTo": "XYZ Tents" }
  ]
}
```
Read-only mirror; no corresponding write endpoint exists at all.

### `GET ?action=getPerformances`
Returns:
```json
{
  "performances": [
    { "name": "Ritu Roy", "actName": "Rabindra Sangeet solo", "category": "Song" }
  ]
}
```
`contact` is never included here.

### `POST action=addPerformanceRegistration`
Body: `{ "name": string, "actName": string, "category": string, "contact": string (optional), "honeypot": "" }`
- Same honeypot/validation approach as `addContribution`.
Returns: `{ "success": true }` or `{ "success": false, "error": "..." }`.

## Environment & Deployment References

- **Google Sheet ID**: `1oLa7_OfSUHLGej-LQ0_Y3Q9ITyPA2CbnHSuQ0IGHDaE`
- **Apps Script Deployment ID**: `AKfycbzTeGCg-sVy2oVG1-nsm-6W6Lqq_GI_z-nKH8-gaZV2WfYvPCVEmBUEOGDQRjONd-qvJw`
- **Web App URL**: `https://script.google.com/macros/s/AKfycbzTeGCg-sVy2oVG1-nsm-6W6Lqq_GI_z-nKH8-gaZV2WfYvPCVEmBUEOGDQRjONd-qvJw/exec`
- `VITE_APPS_SCRIPT_URL` — set in `.env` to the Web App URL above.

## Known constraints / risks to keep in mind

- Apps Script Web Apps have a daily quota on executions/URL fetches per
  Google account (generous for a residential-complex-scale event, but don't
  design assuming unlimited calls — avoid polling; fetch lists on load and
  after a successful submit, not on an interval).
- Sheet writes from Apps Script are effectively single-threaded per script —
  fine at this scale, just don't over-engineer for concurrency.
- No real auth in v1 — the write endpoints are open. This is an accepted
  tradeoff for v1 given there's no payment processing (see
  `CRITICAL_INSTRUCTIONS.md` #4); validation + honeypot is the extent of the
  abuse mitigation.
