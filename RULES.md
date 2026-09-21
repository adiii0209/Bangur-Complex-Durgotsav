# Rules — coding conventions for this repo

## Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS. No Next.js — there's
  no need for SSR/routing complexity here; it's a handful of sections on one
  page (or a very thin client-side router if tabs become real routes).
- **State**: plain React state + a small fetch layer (`src/lib/api.ts`). No
  Redux/Zustand — this app doesn't need it.
- **Backend**: Google Apps Script only. No Node/Express server. If you ever
  feel like you need a "real backend," that's a signal to check
  `techContext.md` and `CRITICAL_INSTRUCTIONS.md` before adding one — it's an
  explicit non-goal for v1.
- **Animation**: Framer Motion for the success animation and section
  transitions is fine (lightweight, common); don't add a heavier animation
  library.

## Structure

Follow the folder layout in `memory-bank/systemPatterns.md`. Don't reorganize
it without updating that file in the same commit.

## Style

- Functional components, hooks, TypeScript everywhere (no `.jsx`, no `any`
  unless truly unavoidable — comment why if you use it).
- Tailwind for styling; no separate CSS files except `index.css` for base
  styles/fonts and the video overlay gradient if it's cleaner as a utility
  class extension.
- Keep components small and named for what they show
  (`ContributeForm.tsx`, `ContributorList.tsx`, `ExpensesTab.tsx`,
  `PerformanceForm.tsx`, `ParticipantList.tsx`, `HeroSection.tsx`).
- Every form: client-side validation for UX (instant feedback), but never
  trust it as the only validation — the Apps Script endpoint validates again
  (see `CRITICAL_INSTRUCTIONS.md` #3).

## Environment & secrets

- The deployed Apps Script Web App URL goes in `.env` as
  `VITE_APPS_SCRIPT_URL`, never hardcoded in source.
- No API keys belong in this repo. Apps Script auth is handled by the
  deployment's own "who has access" setting, not by a key in the frontend.

## Commits / sessions

- One logical feature per session where possible (hero, then contribute flow,
  then expenses, then performance registration — matches the phase order in
  `projectbrief.md`).
- End every session by updating `memory-bank/activeContext.md` and
  `memory-bank/progress.md`.

## Accessibility & responsiveness

- Mobile-first is the actual target audience (residents opening a WhatsApp
  link on their phone) — design and test at 375px width first, then check
  desktop, not the other way round.
- Forms need visible labels (not placeholder-only), sufficient tap target
  size, and clear success/error states — many users will be non-technical.
- The hero video needs `muted`, `playsInline`, `autoPlay`, `loop` and a static
  poster fallback for slow connections/data-saver mode.
