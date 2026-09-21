# Active Context

> Update this file at the end of every session. Overwrite stale entries rather
> than letting them pile up — this file describes "now," not history (that's
> what `progress.md` is for).

## Current phase

Phase 1 implementation complete and fully built!
- Frontend scaffolded with Vite + React + TypeScript + Tailwind CSS.
- Video compressed and optimized (`public/hero-durga-puja.mp4`, 2.9 MB down from 11.5 MB with faststart + poster `public/hero-poster.jpg`).
- Hero section with looping muted background video, dark festive gradient overlay, and 3 CTAs with URL hash routing (`#contribute`, `#expenses`, `#performances`).
- Contribution flow: Form with client & server validation + honeypot, celebratory confetti animation, public contributor list with names and server-masked & blurred amounts (payment mode hidden as requested).
- Expenses tab: Read-only ledger mirroring Google Sheet records with committee transparency banner and category filtering.
- Performance registration flow: Form with honeypot + public participant list (contact numbers strictly excluded).
- Google Apps Script backend (`apps-script/Code.gs`): Complete with one-click `setupSheet()`, auto-sheet creation, server-side masking, honeypot protection, and GET/POST handlers.
- `DEPLOYMENT.md`: Step-by-step instructions for deploying the Web App and setting up the sheet.

## Decisions confirmed by Aditya

- Contributor list: Does NOT show payment mode (`Cash`/`UPI`/`Bank Transfer`) publicly; only shows contributor name with server-masked and blurred amount (`₹ ● ● ● ●`).
- Navigation: Hero buttons activate the respective section and sync with URL hash (`#contribute`, `#expenses`, `#performances`) for seamless page refreshes, direct bookmarking, and back/forward browser history navigation.
- Google Sheet: One-click setup function `setupSheet()` and automated sheet initialization embedded in `apps-script/Code.gs`.
- GitHub repository configured: `https://github.com/adiii0209/Bangur-Complex-Durgotsav.git`.

## Deployment Info & Live Credentials

- **Deployment ID**: `AKfycbxhA3e3POrMXGNj0PhlUEisa4bqfRb-hpA9xGNULCjl_nPBs_6pRbCECXCV4nOcTYgxIg`
- **Web App URL**: `https://script.google.com/macros/s/AKfycbxhA3e3POrMXGNj0PhlUEisa4bqfRb-hpA9xGNULCjl_nPBs_6pRbCECXCV4nOcTYgxIg/exec`
- **Status**: Live, verified 200 OK without login wall. Returns valid JSON for reads and writes directly to the Google Sheet.
