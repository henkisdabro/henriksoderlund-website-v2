# henriksoderlund-website-v2

Henrik Soderlund's professional portfolio site, live at <https://www.henriksoderlund.com>. Astro on Cloudflare Workers, with a custom Worker entry (`src/worker.ts`) wrapping the Astro handler.

Copy on this site is Henrik's own and is not yours to improve. SEO, structure and formatting fixes are fine; ask before changing wording.

## Build and deploy

`pnpm run build` and `pnpm run check` are the same script - run either, not both. `pnpm run preview` is a dead end: it is plain `astro preview`, which the Cloudflare adapter does not support under `output: 'server'`, and it exits without binding a port.

Production deploys from GitHub Actions on push to `main`. Do not deploy by hand: CI's artifact verification is the guard against the 0-byte-HTML failure below, and Cloudflare's own auto-build must stay disabled to avoid racing it.

**Server secrets must stay `optional: true` in the `astro.config.mjs` env schema.** The Cloudflare adapter's prerender subprocess reads secrets from `.dev.vars`, not from the process environment. CI has no `.dev.vars`, so a required secret throws `EnvInvalidVariables` inside prerendering, writes 0-byte HTML for every page, and still exits 0. Runtime validation for `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` belongs in `src/actions/index.ts` instead. This shipped an undetected full-site outage once already.

`output: 'server'` is likewise mandatory - Astro Actions need a server runtime, and the contact form is an Action. Pages opt into static delivery individually with `export const prerender = true`.

## The Worker is where the edges live

Astro middleware does not run for prerendered pages on Cloudflare: the asset binding serves them via `env.ASSETS.fetch()` and never enters the render pipeline. So anything that must apply to every response lives in `src/worker.ts`, not in middleware.

- **Redirects** go in the `REDIRECTS` map in `src/worker.ts`. Astro's `redirects` config and `public/_redirects` both produce a 200 rewrite here, not a 301, because the asset binding intercepts first.
- **`'unsafe-eval'` in the CSP is deliberate.** Fou Analytics' anti-adblock scripts use `eval()`/`new Function()` for integrity checks and break without it. Removing it is the obvious hardening move and the wrong one.
- **`/wf0q/*` is the Google tag gateway measurement path**, handled by Cloudflare at the edge, not by this Worker. Nothing in `src/worker.ts` may claim that prefix: a route matching it ahead of the gateway swallows real tracking traffic and `gtm.js` starts 404ing. Cloudflare's own tag injection must stay off - an edge-injected snippet carries no nonce, and `'strict-dynamic'` in the CSP makes the `'unsafe-inline'`/`https:` fallbacks inert, so it would be blocked. The snippet lives in `src/layouts/BaseLayout.astro` instead, which picks its source by hostname: the production zone loads `/wf0q/gtm.js`, and every other host - localhost, `*.workers.dev`, any PR preview - loads the GTM Staging environment (`env-8`) from `www.googletagmanager.com`, because the measurement path exists only on the zone. That check is an allowlist (`hostname === 'www.henriksoderlund.com'`) on purpose: a new preview hostname must not inherit the live container by default.
- **`run_worker_first` must not appear in the source `wrangler.json`.** The Cloudflare Vite plugin picks it up in dev and routes Vite's own assets through the Worker, 404ing everything. `scripts/patch-wrangler.mjs` adds it to the built config only.

Rate limiting is Cloudflare WAF dashboard configuration, not code - do not look for it in the repo.

## Generated text

`/llms.txt`, `/llms-full.txt` and the per-page `*.md` endpoints are plain-text contracts. Run generated text through `removeEmojis()` (`src/utils/removeEmojis.ts`) and transliterate rather than emit non-ASCII: `oe` for `ö`, straight quotes, hyphens.

## Deeper docs

- `docs/LOCAL-WORKER-TESTING.md` - running the Worker locally to check redirects, headers or CSP. Four traps make the obvious approaches fail, including a dev-server dep-optimizer one that 500s every route; read it before improvising.
- `docs/CONTENT-AND-SEO.md` - editing structured data, Open Graph, sitemap priorities, the llms.txt endpoints, or writing site copy.
- `docs/DEPLOYMENT.md` - changing the CI workflow or the Cloudflare-side deployment setup.
- `docs/UTM-TAXONOMY.md` - tagging any inbound link Henrik controls; `utm_medium` values outside GA4's recognised set land the session in Unassigned.
