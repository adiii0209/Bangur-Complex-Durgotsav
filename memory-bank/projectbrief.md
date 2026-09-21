# Project Brief

## What

A mobile-first web app for the **Bangur Complex Durga Puja 2026** committee,
built for residents to interact with three things the committee already tracks
in a Google Sheet: contributions, expenses, and performance registrations.

## Who it's for

Residents of Bangur Complex, opening a link (likely shared over WhatsApp/
community groups) on their phones during the puja season. Secondary audience:
the committee members, who keep using the Google Sheet exactly as before —
the website is a window into it, not a replacement workflow for them (except
that contributions and performance sign-ups now also arrive as sheet rows from
the website).

## Why (product goal)

Right now the committee tracks contributions, expenses, and performance
sign-ups in a Google Sheet with no resident-facing view. This app gives
residents:
- an easy way to record a contribution they've made (cash/UPI/bank transfer)
  without messaging a committee member,
- visibility into who's contributed (transparency/trust) without exposing
  exact amounts publicly,
- visibility into what the committee is spending money on,
- an easy way to register to perform at the event.

## Phase 1 scope (this build)

1. Hero section — Durga Puja video background, dark overlay, 3 CTA buttons.
2. Contribute — form (Name, Amount, Mode) → Google Sheet, success animation,
   public list of contributor names with amounts masked.
3. Expenses — read-only mirror of the Expenses sheet tab. Not editable from
   the website under any circumstance.
4. Performance registration — form (Name, Act Name, Category, optional
   Contact) → Google Sheet, public list of name/act/category (no contact
   numbers shown publicly).
5. Two-way sync via Google Apps Script Web App + Google Sheets, with the
   explicit exception that Expenses is one-way (sheet → site only).

## Explicitly out of scope for Phase 1 (backlog for later)

- Payment gateway / actual online payment.
- Admin login or any authenticated view.
- Editing expenses (or anything else) from the website.
- Photo gallery, event schedule, countdown timer, push notifications.
- A public donation "leaderboard" or total-raised counter (raise with Aditya
  before adding — may conflict with the amount-privacy requirement).

## Success criteria for Phase 1

- A resident can open the site on a phone, tap Contribute, submit a
  contribution, and see it (name only, amount masked) appear in the list.
- A resident can view the current expenses list without any way to alter it.
- A resident can register to perform and see themselves appear in the
  participant list.
- The committee's only ongoing maintenance is: edit the Expenses tab directly
  in Sheets when money is spent. Everything else stays in sync automatically.
