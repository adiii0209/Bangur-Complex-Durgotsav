# System Patterns

## Architecture

```
┌────────────────────┐        fetch (GET/POST, JSON)        ┌───────────────────────┐
│   React frontend    │ ───────────────────────────────────▶ │  Apps Script Web App   │
│   (Vite, static)     │ ◀─────────────────────────────────── │  (doGet / doPost)      │
└────────────────────┘                                        └───────────┬───────────┘
                                                                            │ SpreadsheetApp
                                                                            ▼
                                                              ┌───────────────────────┐
                                                              │  Google Sheet          │
                                                              │  Contributions tab     │
                                                              │  Expenses tab (manual) │
                                                              │  Performances tab      │
                                                              └───────────────────────┘
```

One-directional exception: `Expenses` only ever flows Sheet → site. Everything
else is site → Sheet (writes) and Sheet → site (reads), i.e. the sheet is
always the single source of truth, the site is a read/write client to it.

## Frontend folder structure

```
src/
  components/
    HeroSection.tsx        # video bg, overlay, 3 CTA buttons
    ContributeForm.tsx
    ContributorList.tsx    # masked-amount list
    SuccessAnimation.tsx   # shared by contribute + performance flows
    ExpensesTab.tsx        # read-only list
    PerformanceForm.tsx
    ParticipantList.tsx
    ui/                    # small shared primitives (Button, Input, Select, Modal)
  lib/
    api.ts                 # fetch wrapper for the Apps Script endpoints
    types.ts                # shared TS types matching techContext.md's contract
    validation.ts           # client-side form validation helpers
  App.tsx                   # single-page layout: Hero + the three sections/tabs
  main.tsx
  index.css
public/
  hero-durga-puja.mp4       # supplied later by Aditya
  hero-poster.jpg           # fallback poster image
apps-script/
  Code.gs                   # backend source, kept in-repo for version control
                             # even though it's deployed via the Apps Script editor
.env.example
```

## Navigation pattern (Phase 1)

Single page, three sections below the hero, each corresponding to one hero
button (scroll-to or simple client-side tab switch — either is fine, pick
whichever is simpler to implement well; document the choice in
`activeContext.md` once made). No router library needed unless a later phase
adds real distinct pages.

## Data flow pattern for each form

1. User fills form → client-side validation (`validation.ts`) blocks obviously
   bad input before any network call.
2. `api.ts` POSTs to the relevant `action`.
3. On `{ success: true }`: clear form, show `SuccessAnimation`, then re-fetch
   the relevant list (`getContributions` / `getPerformances`) so the new entry
   appears without a full page reload.
4. On `{ success: false }` or network error: show an inline error, keep the
   user's input so they don't have to retype it.

## Styling pattern

Tailwind utility classes directly in components; a small `theme` section in
`tailwind.config` for the Durga Puja palette (deep red/maroon, gold, white,
accent green) so colours are referenced by name (`bg-puja-red`, `text-puja-gold`)
rather than raw hex values scattered through the codebase.
