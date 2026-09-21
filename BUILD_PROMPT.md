# Build Prompt — Bangur Complex Durga Puja 2026 Web App

Paste this as your first message to Antigravity in a fresh workspace that already
contains `CLAUDE.md`, `CRITICAL_INSTRUCTIONS.md`, `RULES.md`, and the `memory-bank/`
folder from this package. Drop those files into the repo root before you start.

---

## Prompt to paste

You are building **"Bangur Durga Puja 2026"**, a mobile-first web app for the Durga
Puja committee of Bangur Complex. Before writing any code:

1. Read `CLAUDE.md`, `CRITICAL_INSTRUCTIONS.md`, and `RULES.md` in the repo root.
2. Read every file in `memory-bank/` — `projectbrief.md`, `productContext.md`,
   `techContext.md`, `systemPatterns.md`, `activeContext.md`, `progress.md`.
3. Treat `memory-bank/activeContext.md` and `memory-bank/progress.md` as living
   documents — update them at the end of every work session, not just at the end
   of the project.

Then build **Phase 1** exactly as scoped in `memory-bank/projectbrief.md`:

1. **Project scaffold** — Vite + React + TypeScript, Tailwind, the folder structure
   in `systemPatterns.md`. No backend framework — Google Apps Script is the entire
   backend (see `techContext.md` for the endpoint contract).
2. **Hero section** — full-bleed background video (`/public/hero-durga-puja.mp4`,
   I will supply the file — use a placeholder poster image and a looping `<video>`
   tag until I drop the real one in) with a dark gradient overlay and three CTA
   buttons: **Contribute**, **Expenses**, **Register for Performance**. Mobile-first,
   buttons stack vertically on narrow screens, sit side by side from `sm:` up.
3. **Contribute flow**:
   - "Contribute" opens a form (Name, Amount, Mode — dropdown: Cash / UPI / Bank
     Transfer).
   - On submit, POST to the Apps Script Web App (`addContribution`), then play a
     short celebratory success animation ("Thank you for your contribution 🙏" —
     confetti or a simple scale/fade with the Durga Puja colour palette) before
     returning to the list.
   - Below the form, show the running list of contributors: name visible, amount
     rendered as a blurred/masked placeholder (see `CRITICAL_INSTRUCTIONS.md` for
     why the amount must never reach the client in plain form).
4. **Expenses tab**:
   - Read-only list pulled from the `Expenses` sheet tab via `getExpenses`.
   - No add/edit/delete UI anywhere on the site — this tab is strictly a mirror.
     State that clearly in the UI ("Maintained by the committee — updated
     directly in our records").
5. **Performance registration**:
   - "Register" opens a form (Name, Performance/Act Name, Category, Contact
     Number — optional).
   - On submit, POST to `addPerformanceRegistration`, confirm success, then show
     the running list of registered participants (name + act name + category —
     no contact numbers rendered on the public list).
6. **Google Apps Script backend**:
   - Build the `Code.gs` (or `.ts` if you use clasp) exactly to the endpoint
     contract in `techContext.md`.
   - Three sheet tabs: `Contributions`, `Expenses`, `Performances`, with the exact
     columns specified there.
   - Add the honeypot + basic validation described in `CRITICAL_INSTRUCTIONS.md`.
7. **Deployment notes**: write a short `DEPLOYMENT.md` explaining how I deploy the
   Apps Script as a Web App (execute as me, accessible to anyone) and how I wire
   the resulting URL into the frontend's `.env`.

Do **not** build any feature beyond what's listed above — later phases (payment
gateway, admin login, gallery, schedule, live donation leaderboard, etc.) are
intentionally deferred; note them in `memory-bank/progress.md` under "Backlog"
if you think of anything, but don't build them yet.

When a phase is done, update `memory-bank/progress.md` and `activeContext.md`
before stopping, and tell me what you need from me (real video file, real sheet
ID, colour/logo assets, etc.) to move forward.
