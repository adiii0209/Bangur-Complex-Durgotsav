# Progress

## Status: Phase 1 Complete

Frontend application built, styled, tested, and bundled. Apps Script backend written with automated Google Sheet setup. Hero video compressed and poster extracted.

## Done

- [x] Scope defined (`projectbrief.md`)
- [x] Sheet schema + API contract defined (`techContext.md`)
- [x] Architecture + folder structure defined (`systemPatterns.md`)
- [x] Vite + React + TS + Tailwind scaffold
- [x] Durga Puja palette configured in `tailwind.config.js` (`puja-red`, `puja-gold`, `puja-cream`, `puja-green`, `puja-dark`)
- [x] Hero video compressed from 11.5 MB to 2.9 MB with faststart (`public/hero-durga-puja.mp4`) and poster extracted (`public/hero-poster.jpg`)
- [x] `HeroSection.tsx` with video background, dark gradient overlay, and 3 CTA buttons
- [x] URL hash routing navigation (`#contribute`, `#expenses`, `#performances`) with refresh & back/forward support
- [x] `apps-script/Code.gs` — one-click `setupSheet()`, auto-sheet creation, `doGet`/`doPost`, honeypot, validation
- [x] `getContributions` / `addContribution` (with server-side amount masking and payment mode hidden from public list)
- [x] `ContributeForm.tsx` + `ContributorList.tsx` + `SuccessAnimation.tsx` (confetti celebration)
- [x] `getExpenses` + `ExpensesTab.tsx` (read-only mirror with committee integrity banner and category filter)
- [x] `getPerformances` / `addPerformanceRegistration` (contact numbers strictly excluded from public list)
- [x] `PerformanceForm.tsx` + `ParticipantList.tsx`
- [x] Honeypot spam defense + server-side & client-side validation on forms
- [x] `DEPLOYMENT.md` deployment guide written
- [x] Clean production build verified (`npm run build`)

## Backlog / ideas (not in scope for Phase 1 — do not build without sign-off)

- Payment gateway integration for online contributions.
- Admin-authenticated view (edit/delete a contribution or registration).
- Photo gallery / event schedule / countdown timer.
- Total-raised counter or leaderboard (conflicts with amount privacy — needs a product decision first).
- WhatsApp share card / social sharing for "I just contributed."

- **2026-09-21 (Session 2)**:
  - Removed all Bengali text in favor of clean English typography across Hero, header, footer, and index.html.
  - Redesigned Hero CTA buttons: smaller, compact size arranged in a balanced row with two buttons on either side (Contribute and Register) and Expenses centered between them.
  - Added total contributions count and aggregate total raised counter widget in small within the Contributors panel (`Code.gs`, `api.ts`, `ContributorList.tsx`, `App.tsx`).
- **2026-09-21 (Session 1)**:
  - Compressed `durgotsav.mp4` to `public/hero-durga-puja.mp4` with H.264 CRF 27, faststart, and audio stripped; extracted `public/hero-poster.jpg`.
  - Built complete Vite + React + TypeScript frontend with Tailwind CSS and Durga Puja theme.
  - Implemented HeroSection with responsive CTAs, sticky tab navigation, and hash routing.
  - Built Contribute flow with server-masked amounts, blurred display, and hidden payment modes.
  - Built ExpensesTab strictly as a read-only mirror with category filtering.
  - Built Performance registration flow with confidential contact handling.
  - Developed `apps-script/Code.gs` with one-click `setupSheet()` for the provided Google Sheet (`1oLa7_OfSUHLGej-LQ0_Y3Q9ITyPA2CbnHSuQ0IGHDaE`).
  - Added `DEPLOYMENT.md` and configured git remote for `https://github.com/adiii0209/Bangur-Complex-Durgotsav.git`.
  - Verified zero build errors via `npm run build`.
