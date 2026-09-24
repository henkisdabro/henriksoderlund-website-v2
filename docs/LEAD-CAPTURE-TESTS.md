# Lead-capture tests

The contact form and the booking CTAs are the site's only conversions, and both have failed silently before. The mail provider's sending domain lost its DKIM record and every submission was refused for months. At the same time, a dataLayer rename left GA4 without a single lead or form error. The deploy smoke test passed throughout: it proved the route existed, not that a message arrived.

This suite checks the outcome instead. It is Playwright, in `tests/e2e/`, with one config and two targets.

## What runs where

| When | Command | Target | Specs |
|---|---|---|---|
| Every PR and push, **gates the deploy** | `pnpm run test:e2e` | built Worker under `wrangler dev` | `contact-form`, `cta`, `gtm-contract` |
| After every deploy | `pnpm run test:prod` | www.henriksoderlund.com | `production`, `cta`, `gtm-contract` |
| Daily, 06:00 Perth (`lead-capture-monitor.yml`) | `pnpm run test:prod` | www.henriksoderlund.com | same |

The daily run exists because neither of those failures came from a deploy.

## Local target: the real form, three ways

`serve-worker.mjs` runs the production build (`dist/server`, including `src/worker.ts` and its CSP) three times over:

| Port | Turnstile secret | Proves |
|---|---|---|
| 8801 | always passes | a message reaches `CONTACT_EMAIL` with the right sender, subject and body; the success UI shows; `generate_lead` fires |
| 8802 | always fails | a bot block sends nothing and logs `form_error` as `bot_check`; the synthetic-check path works |
| 8803 | passes, send refused | a send failure shows the mailto fallback, never success, and logs `error_reason` |

A real browser fills the real form. The stand-ins are Turnstile's official test keys and the Email Service local simulator, which records each message in the wrangler log instead of delivering it (`email.ts` reads it back). The server still makes a real siteverify call. The page's built-in site key is swapped for the test key in-flight, because the production key refuses `127.0.0.1`.

Reply-To is the one field the simulator does not record, so no local test covers it.

## Production target

- **Synthetic submission.** A POST carrying `X-Synthetic-Check: <CONTACT_SYNTHETIC_TOKEN>` skips the human challenge but nothing else. The Action still calls siteverify and requires the exact `invalid-input-response` rejection, which a valid secret gives a dummy token (a bad secret gives `invalid-input-secret`). It then sends through the real `send_email` binding and sending domain, to `admin+synthetic@henriksoderlund.com` instead of the inbox. A leaked token can reach only that alias, which a Gmail filter archives. The binding's `allowed_destination_addresses` enforces the same limit at the platform level.
- **Live CSP.** `/contact` loads the Turnstile iframe with zero CSP violations, apart from Cloudflare's injected tag-gateway loader. Cloudflare keeps injecting it even with "Set up tag" off (a known bug), and the CSP blocks it harmlessly; `fixtures.ts` ignores those two scripts by content and nothing else.
- **Calendly.** The event behind every booking CTA renders and has a bookable time this month or next.

Analytics requests are blocked in every test (`fixtures.ts`), so runs never count as visits or leads. The dataLayer still fills, and that is what the tests read.

## The GTM contract

`gtm.ts` downloads the published container (`gtm.js?id=GTM-KM56HHS2`) and resolves which GA4 tags fire on each event, and which dataLayer keys they forward. The checks:

- every `event:` pushed anywhere in `src/` fires a GA4 tag, unless it is in `UNTRACKED_EVENTS` with a reason
- no trigger waits for an event nothing in `src/` pushes, which is how a rename shows up
- every key the lead flows actually push at runtime (`generate_lead`, `form_error`, `booking_start`) is forwarded by the tag

So a new or renamed event fails CI until GTM is published to match. Publish GTM first; a trigger can match both names during the switch.

## Secrets

`CONTACT_SYNTHETIC_TOKEN` must hold the same value in two places: as a Worker secret (`wrangler secret put CONTACT_SYNTHETIC_TOKEN`) and as a GitHub Actions secret. The production synthetic test fails in CI if the GitHub one is missing. It skips locally unless you export it.
