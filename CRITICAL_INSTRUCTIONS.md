# Critical Instructions — read before touching data flow or the public UI

These override convenience or "it's just a side project" shortcuts. If a
requested change would violate one of these, say so before implementing it.

## 1. Contribution amounts are never sent to the browser in plain form

The requirement is that the public list shows contributor **names**, with
**amounts hidden**. Don't implement this as "send the real amount, hide it with
CSS blur" — anyone can read the real number from the Network tab or by
inspecting the DOM. Instead:

- The `getContributions` endpoint should return amounts already masked
  server-side (e.g. `"₹ ● ● ● ●"`, or a bucketed range if you want the site to
  hint at scale without revealing the figure — confirm with Aditya which he
  wants).
- The **real amount only ever lives in the Google Sheet**, which only the
  committee can open.
- A CSS blur on top of the masked placeholder is fine as a visual treatment,
  but it is not the privacy mechanism — the masking is.

## 2. Expenses are read-only on the website, full stop

No form, no hidden admin route, no "edit" button anywhere in the shipped
product that writes to the `Expenses` tab. The only way expenses change is a
human editing the Google Sheet directly. If a future phase needs an in-app
expense editor, that's a deliberate scope change to raise with Aditya, not
something to add "for convenience."

## 3. Treat the Apps Script Web App as a public, unauthenticated endpoint

Because it will be deployed with "Anyone" access (required for a public
contribution form with no login), assume anyone can call it directly, not just
through the website. Guard against that:

- Validate every field server-side (required, type, length, amount is a
  positive number, mode is one of the allowed values) — never trust the
  client.
- Add a honeypot field (a hidden input real users never fill; if it's non-empty,
  silently drop the submission) to cut down on basic bots.
- Cap string lengths (e.g. name ≤ 100 chars, act name ≤ 150 chars) to stop
  abuse of the sheet as free storage.
- Do not expose an endpoint that returns raw row data with any field you
  wouldn't want public (e.g. contact numbers from `Performances` must never be
  in a GET response used by the public list — see `techContext.md`).

## 4. No real money moves through this app in v1

There is no payment gateway. "Contribute" records an intent/pledge (I gave
cash/UPI/bank transfer to the committee), it does not process a transaction.
Never phrase UI copy in a way that implies the app itself is handling money
("Pay now", "Payment successful") — use "Record your contribution" /
"Contribution recorded" language. If a payment gateway is added later, that's
a distinct phase with its own security review.

## 5. Don't silently add scope

If while building you think of a genuinely good feature (admin dashboard,
leaderboard, WhatsApp share card, etc.), note it in
`memory-bank/progress.md` under "Backlog / ideas" and move on. Don't build it
into v1 without being asked — the phase boundaries in `projectbrief.md` are
deliberate.

## 6. Real names, real numbers

This app will display real residents' names and (masked) contribution amounts
publicly. Don't invent placeholder "sample" contributors that ship to
production — use obviously fake seed data (`"Test User"`, amounts of `0`) only
in local development, and make sure there's an easy way to clear the sheet of
test rows before the real event.
