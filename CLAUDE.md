# CLAUDE.md — Bangur Durga Puja 2026

This file is read by the agent at the start of every session in this repo.
It is the standing context — don't wait to be re-told this.

## What this project is

A mobile-first web app for the Durga Puja celebration committee of **Bangur
Complex**, for the 2026 puja. It gives residents a simple, transparent way to
contribute money, see committee expenses, and register to perform, without the
committee having to maintain anything beyond a Google Sheet they already know
how to use.

Owner/client: Aditya (also the developer). He is both the person commissioning
this and the one reviewing/deploying it — talk to him directly, don't write as
if there's a separate client to loop in.

## Source of truth

- **Product scope**: `memory-bank/projectbrief.md`
- **Why features are shaped the way they are**: `memory-bank/productContext.md`
- **Stack, sheet schema, API contract**: `memory-bank/techContext.md`
- **Folder structure & architecture**: `memory-bank/systemPatterns.md`
- **What's being worked on right now**: `memory-bank/activeContext.md`
- **What's done / what's next**: `memory-bank/progress.md`
- **Non-negotiable guardrails**: `CRITICAL_INSTRUCTIONS.md`
- **Coding conventions**: `RULES.md`

Read the memory-bank before making product decisions. If something in a request
conflicts with `projectbrief.md`'s scope, flag it rather than silently expanding
scope.

## Working agreement

- Keep every session's changes small and shippable. This is a side project
  worked on in bursts — leave the repo in a state that runs, every time.
- Update `memory-bank/activeContext.md` and `memory-bank/progress.md` at the
  end of every session. This is not optional — it's how continuity across
  sessions works, since the agent has no memory between them.
- If you invent a new sheet column, API field, or route, add it to
  `techContext.md` in the same session. Undocumented surface area is the
  single biggest source of bugs in this kind of project.
- Ask before introducing a new dependency, a paid service, or an auth system.
  V1 is intentionally simple and free to run (Google Sheets + Apps Script +
  a static host).

## Tone of the product itself

Warm, festive, community-first — this is for neighbours celebrating together,
not a corporate donation platform. Copy should sound like a committee member
talking to the building, not a fintech app. Keep the Durga Puja colour palette
(deep red, gold/yellow, white, a touch of green) and avoid generic SaaS visual
language (no default blue gradients, no stock "dashboard" look).

## Deployment shape

- Frontend: static site (Vite build), deployable to Vercel/Netlify/GitHub Pages.
- Backend: Google Apps Script Web App, no server to maintain, no database
  beyond the Google Sheet.
- No user accounts in v1. Anyone with the link can contribute or register;
  only the committee (via direct sheet access) can edit expenses.
