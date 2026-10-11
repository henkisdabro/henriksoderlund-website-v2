# henriksoderlund-website-v2

Henrik Soderlund's professional portfolio site, live at <https://www.henriksoderlund.com>. Astro on Cloudflare Workers, with a custom Worker entry (`src/worker.ts`) wrapping the Astro handler.

Copy on this site is Henrik's own and is not yours to improve. SEO, structure and formatting fixes are fine; ask before changing wording.

## Build and deploy

`pnpm run build` and `pnpm run check` are the same script - run either, not both. `pnpm run preview` is a dead end: it is plain `astro preview`, which the Cloudflare adapter does not support under `output: 'server'`, and it exits without binding a port.

Production deploys from GitHub Actions on push to `main`. Do not deploy by hand: CI's artifact verification is the guard against the 0-byte-HTML failure below, and Cloudflare's own auto-build must stay disabled to avoid racing it.

**Server secrets must stay `optional: true` in the `astro.config.mjs` env schema.** The Cloudflare adapter's prerender subprocess reads secrets from `.dev.vars`, not from the process environment. CI has no `.dev.vars`, so a required secret throws `EnvInvalidVariables` inside prerendering, writes 0-byte HTML for every page, and still exits 0. Runtime validation for `TURNSTILE_SECRET_KEY` and `CONTACT_SYNTHETIC_TOKEN` belongs in `src/actions/index.ts` instead. This shipped an undetected full-site outage once already.

`output: 'server'` is likewise mandatory - Astro Actions need a server runtime, and the contact form is an Action. Pages opt into static delivery individually with `export const prerender = true`.

## The Worker is where the edges live

Astro middleware does not run for prerendered pages on Cloudflare: the asset binding serves them via `env.ASSETS.fetch()` and never enters the render pipeline. So anything that must apply to every response lives in `src/worker.ts`, not in middleware.

- **Redirects** go in the `REDIRECTS` map in `src/worker.ts`. Astro's `redirects` config and `public/_redirects` both produce a 200 rewrite here, not a 301, because the asset binding intercepts first.
- **`'unsafe-eval'` in the CSP is deliberate.** Fou Analytics' anti-adblock scripts use `eval()`/`new Function()` for integrity checks and break without it. Removing it is the obvious hardening move and the wrong one.
- **`/wro1/*` is the Google tag gateway measurement path**, self-served: `tagGateway()` in `src/worker.ts` proxies it to Google's origin `fps.goog` (Google's manual setup), after the apex-to-www redirect and ahead of everything else, including the trailing-slash redirect and the HTML/CSP handling. Nothing else may run before it, and its responses pass through untouched and uncached. Cloudflare's dashboard integration for the gateway is off and must stay off: while on, its edge answers `/wro1/*` ahead of the Worker and injects two unnonced loader scripts into every page, even with "Set up tag" off. The CSP blocks those, and the E2E CSP checks then fail on them; do not allowlist them. Turning it back on is the emergency rollback if the proxy breaks. Field `"60"` in `/wro1/gtm.js?id=GTM-KM56HHS2` tells which side served the path: `dY2FjZD` is this Worker, `dNzQzZD` is Cloudflare's integration, and the E2E spec asserts the former in production. The page snippet lives in `src/layouts/BaseLayout.astro` and picks its source by hostname: the production zone loads `/wro1/gtm.js`, and every other host - localhost, `*.workers.dev`, any PR preview - loads the GTM Staging environment (`env-34`) from `www.googletagmanager.com`, so that no preview loads the Live container. That check is an allowlist (`hostname === 'www.henriksoderlund.com'`) on purpose: a new preview hostname must not inherit the live container by default.
- **`run_worker_first` must not appear in the source `wrangler.json`.** The Cloudflare Vite plugin picks it up in dev and routes Vite's own assets through the Worker, 404ing everything. `scripts/patch-wrangler.mjs` adds it to the built config only.

Rate limiting is Cloudflare WAF dashboard configuration, not code - do not look for it in the repo.

## Generated text

`/llms.txt`, `/llms-full.txt` and the per-page `*.md` endpoints are plain-text contracts. Run generated text through `removeEmojis()` (`src/utils/removeEmojis.ts`) and transliterate rather than emit non-ASCII: `oe` for `ö`, straight quotes, hyphens.

## Deeper docs

- `docs/LOCAL-WORKER-TESTING.md` - running the Worker locally to check redirects, headers or CSP. Four traps make the obvious approaches fail, including a dev-server dep-optimizer one that 500s every route; read it before improvising.
- `docs/CONTENT-AND-SEO.md` - editing structured data, Open Graph, sitemap priorities, the llms.txt endpoints, or writing site copy.
- `docs/DEPLOYMENT.md` - changing the CI workflow or the Cloudflare-side deployment setup.
- `docs/LEAD-CAPTURE-TESTS.md` - touching the contact form, its email sending, a CTA or any dataLayer event. The suite gates deploys and fails on GTM drift by design.
- `docs/UTM-TAXONOMY.md` - tagging any inbound link Henrik controls; `utm_medium` values outside GA4's recognised set land the session in Unassigned.
