# Product Context

## The problem today

The committee's contribution, expense, and performance data lives in a Google
Sheet that residents never see. That means:
- Residents contributing cash/UPI have no confirmation trail beyond a verbal
  "noted" from whoever collected it.
- No one outside the committee can see contributor names (a mild social proof/
  transparency gap — "who's already pitched in") or how money is being spent
  (a trust gap, especially in a residential complex where everyone knows
  everyone).
- Performance sign-ups for the cultural evening are presumably handled ad hoc
  (WhatsApp messages, a physical list) with no shared visibility into who's
  already registered or what acts are lined up.

## Why a masked-amount contributor list, not a hidden one and not an open one

Fully hiding the list loses the transparency/trust benefit. Showing exact
amounts publicly creates social pressure and privacy discomfort (a residential
complex is a small, repeat-interaction community — showing "Mr. Sharma gave
₹500 vs. Mr. Roy gave ₹5000" is the kind of thing that causes real friction
between neighbours). Masking the amount while showing the name is the middle
ground: "yes, this person contributed" (encourages participation, low-key
social nudge) without turning it into a comparison table.

## Why expenses are read-only on the site

Trust runs the other way for expenses: residents want to see what's being
spent, but the committee needs to remain the sole source of truth (for
accountability and to avoid disputes about who's allowed to log an expense).
Mirroring the sheet read-only gets transparency without creating a second
place expenses could be entered incorrectly or disputed.

## Why Google Sheets/Apps Script instead of a "real" database

The committee already works in a spreadsheet and will keep doing so after the
puja ends — there's no appetite for them to learn a new admin tool. Apps
Script + Sheets means:
- zero hosting cost for the backend,
- the committee can eyeball/export/filter the data with tools they already
  know,
- no separate admin UI needs to be built for Phase 1 (the sheet *is* the admin
  UI for expenses, and a perfectly fine one for reviewing contributions/
  registrations too).

## Tone/voice

Community event, not a fintech product. Warm, a little festive, written the
way a committee member would talk to residents they know personally — not
corporate donation-platform copy. Avoid words like "transaction," "payment
processed," "donor" (prefer "contributor") unless there's a specific reason.

## Hero section intent

The three buttons (Contribute / Expenses / Register for Performance) are the
entire nav for Phase 1 — there's no separate menu. The hero's job is to get a
first-time visitor, most likely arriving from a WhatsApp link on their phone,
to understand in one glance what they can do here and pick one of the three
paths immediately.
