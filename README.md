# Henrik Soderlund - Personal Website

[![Deploy](https://img.shields.io/github/actions/workflow/status/henkisdabro/henriksoderlund-website-v2/deploy.yml?branch=main&label=deploy&logo=githubactions&logoColor=white)](https://github.com/henkisdabro/henriksoderlund-website-v2/actions/workflows/deploy.yml)
[![Astro](https://img.shields.io/badge/astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Cloudflare Workers](https://img.shields.io/badge/cloudflare%20workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

Professional portfolio site for Henrik Soderlund, an independent technology consultant based in Perth, Western Australia. Live at <https://www.henriksoderlund.com>.

Astro runs on Cloudflare Workers behind a custom Worker entry (`src/worker.ts`). Most pages are prerendered; the contact page and its Astro Action render on demand.

Copy on this site is Henrik's own. SEO, structure and formatting fixes are fine; ask before changing wording.

## Architecture

```mermaid
flowchart TD
    V([Visitor]) --> E[Cloudflare edge]
    E --> W["Worker entry: src/worker.ts"]

    W --> A{"Request path"}
    A -->|"apex host"| R1["301 to www"]
    A -->|"/wro1/*"| G["Google tag gateway proxy to fps.goog<br/>runs first after the apex redirect<br/>passed through untouched, never cached"]
    A -->|"trailing slash"| R2["301 to non-slash form"]
    A -->|"REDIRECTS map, /blog/*"| R3["301, campaign params kept"]
    A -->|"GONE set (old feeds)"| R4["410 Gone"]
    A -->|"everything else"| H["Prerendered pages and text endpoints<br/>env.ASSETS<br/>SSR routes: Astro handler"]

    H --> S["Security headers, charset, canonical Link,<br/>X-Robots-Tag on text/JSON endpoints"]
    S --> N["HTML only: per-request CSP nonce<br/>HTMLRewriter nonces script[data-csp]"]

    H --> C["/contact and /_actions/contact (SSR)"]
    C --> T["Turnstile siteverify"]
    T --> M["EMAIL binding: Cloudflare Email Service send_email"]
```

Bindings in `wrangler.json`: `EMAIL` (`send_email`) and the `TURNSTILE_SITE_KEY` var. The Astro Cloudflare adapter adds the `ASSETS` and `IMAGES` bindings at build time. `scripts/patch-wrangler.mjs` adds `run_worker_first` to the built config so the Worker sees prerendered pages too.

### CI/CD

```mermaid
flowchart LR
    P["PR or push to main"] --> B["Lint, build, verify-build"]
    B --> E["Playwright E2E against the built Worker"]
    E -->|"main only"| D["Deploy with wrangler-action"]
    D --> S["Post-deploy smoke test"]
    S --> PE["Playwright against production"]
    PE --> I["IndexNow for changed pages"]
    M["Daily lead-capture monitor"] --> PE2["Playwright against production"]
```

Pull requests stop after the E2E step. The daily monitor is `.github/workflows/lead-capture-monitor.yml`.

## Stack

| Area | Used |
|------|------|
| Framework | Astro 7 (`output: 'server'`, pages opt into prerendering), `@astrojs/cloudflare` 14, `@astrojs/sitemap` |
| Runtime | Cloudflare Workers, Wrangler 4 |
| Language | TypeScript 6 |
| Contact form | Astro Actions with Zod validation, Cloudflare Turnstile, Cloudflare Email Service |
| Analytics | GTM served first-party via the `/wro1/*` tag gateway, Fou Analytics |
| Lint | Oxlint |
| Tests | Playwright (E2E and lead-capture suite) |
| Tooling | Node 24 (`.nvmrc`), pnpm 12 (pinned by `packageManager`) |
| Font | JetBrains Mono (self-hosted) |

## Pages

Navigation order, as in `src/components/NavigationBox.astro`:

| Route | Rendering | Content |
|-------|-----------|---------|
| `/` | Prerendered | Home |
| `/consultancy` | Prerendered | Services and case studies |
| `/builds` | Prerendered | Products, client builds, open source |
| `/perth-analytics-consultant` | Prerendered | Perth analytics landing page |
| `/expertise` | Prerendered | Skills and tooling |
| `/work-experience` | Prerendered | Experience and education |
| `/contact` | SSR | Contact form |

Not in the navigation: `/privacy` and `/404` (prerendered), `/health`, `/metrics` and `/.well-known/security.txt` (SSR).

Machine-readable endpoints, all prerendered plain text or markdown:

- `/llms.txt` and `/llms-full.txt` - site index and full content for LLMs
- Markdown twins of the main pages: `/index.html.md`, `/consultancy.md`, `/builds.md`, `/perth-analytics-consultant.md`, `/expertise.md`, `/work-experience.md`, `/contact.md`

## Local development

Requires Node 24 and pnpm (`corepack enable` provisions the pinned version).

```bash
pnpm install
pnpm run dev          # http://localhost:4321
pnpm run lint         # oxlint
pnpm run build        # depth-grain bundle, astro check, build, wrangler patch, nonce strip, verify-build
pnpm run test:e2e     # build, then Playwright against the built Worker
```

`pnpm run check` is the same script as `pnpm run build`; run one, not both. `pnpm run preview` does not work: the Cloudflare adapter does not support `astro preview` under `output: 'server'`. To test redirects, headers or CSP locally, read [docs/LOCAL-WORKER-TESTING.md](docs/LOCAL-WORKER-TESTING.md) first.

Server secrets (`TURNSTILE_SECRET_KEY`, `CONTACT_SYNTHETIC_TOKEN`) go in a local `.dev.vars`. Both must stay `optional: true` in `astro.config.mjs`; see [AGENTS.md](AGENTS.md).

## Deployment

Production deploys from GitHub Actions on push to `main`. Do not deploy by hand, and keep Cloudflare's own auto-build disabled. The CI build verification guards against the 0-byte-HTML failure described in AGENTS.md.

## Deeper docs

- [AGENTS.md](AGENTS.md) - architecture rules and traps (Worker edges, CSP, tag gateway, secrets)
- [docs/LOCAL-WORKER-TESTING.md](docs/LOCAL-WORKER-TESTING.md) - running the Worker locally
- [docs/CONTENT-AND-SEO.md](docs/CONTENT-AND-SEO.md) - structured data, Open Graph, sitemap, llms.txt
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - CI workflow and Cloudflare setup
- [docs/LEAD-CAPTURE-TESTS.md](docs/LEAD-CAPTURE-TESTS.md) - contact form, CTA and dataLayer tests
- [docs/UTM-TAXONOMY.md](docs/UTM-TAXONOMY.md) - tagging inbound links
