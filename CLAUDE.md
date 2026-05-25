# CLAUDE.md - Operational Rules for Claude Code

Instructions, guardrails, and critical guidance for working with this codebase.

## Project Overview

Henrik Soderlund's professional portfolio website. Migrated from React SPA (Vite) to Astro 6 in March 2026.

- **Production**: <https://www.henriksoderlund.com/>
- **Stack**: Astro 6 + TypeScript 5.9 + Cloudflare Workers (check `package.json` for exact versions)
- **Rendering**: Hybrid - 5 prerendered pages (CDN edge) + 1 SSR page (contact form via Astro Actions)
- **Data Layer**: Centralised TypeScript data files in `src/data/`
- **Routing**: Astro file-based routing (`src/pages/`)
- **Analytics**: Server-side GTM on custom domain (`load.sgtm.henriksoderlund.com`) + Fou Analytics (`api.fouanalytics.com`)

## Critical Rules

### Content Preservation

**NEVER modify existing copywriting without explicit user approval.** Homepage copy and marketing content is carefully crafted. Technical fixes (SEO, structure, formatting) are allowed - content changes require permission. ASK first and explain exactly what you want to change.

### File Deletion Safety

**NEVER delete infrastructure files during cleanup operations.**

Critical files that must NEVER be deleted:

- `astro.config.mjs` - Astro configuration (output mode, adapter, integrations, env schema)
- `wrangler.json` - Cloudflare Workers configuration
- `package.json` - Dependencies and build scripts
- `src/layouts/BaseLayout.astro` - Main layout (sGTM, Fou Analytics, JSON-LD, view transitions, SEO, dataLayer)
- `src/worker.ts` - Custom Worker entry (CSP nonces, security headers, HTMLRewriter)
- `src/actions/index.ts` - Astro Actions (contact form with Turnstile + Resend + Zod)
- `src/styles/theme.css` - Dark/light mode design tokens (40+ CSS variables)
- `.github/workflows/deploy.yml` - CI/CD pipeline

**Before any cleanup**: run `pnpm run check`, never delete without explicit approval, review with `git status`.

> **History**: August 2025 - Accidental `index.html` deletion caused complete site outage in the previous Vite-based stack.

### Deployment

**Production deployment is automatic via GitHub Actions on push to `main`.** DO NOT use `pnpm run deploy` for production.

The CI pipeline: lint, build, verify artifacts (HTML pages + markdown + text with minimum size thresholds), deploy via `wrangler-action`, smoke test all pages (HTTP status + body size).

For local testing only: `pnpm run build`, `pnpm run deploy` (note: `pnpm run preview` is unsupported by the Cloudflare adapter - see "Local Dev Server and Redirect Testing").

## Content Standards

### Language and Style

- **British English only**: optimisation, specialising, organisation, utilising, realise, colour, behaviour, centre
- **Voice**: Professional, direct, technical without excessive formality
- **Punctuation**: Regular hyphens (-) instead of em-dashes, except for date ranges
- **Consistency**: Uniform terminology and spelling across all files

### Character Encoding

Apply consistent encoding across all generated files (llms.txt, markdown):

- `oe` for `ö`, straight quotes for smart quotes, hyphens for em-dashes
- Use `removeEmojis()` from `src/utils/removeEmojis.ts` on all generated text
- Test markdown endpoints by fetching in browser or via curl

### Markdown Linting

All markdown files must follow: MD022 (blank lines around headings), MD024 (no duplicate headings), MD031 (blank lines around code blocks), MD032 (blank lines around lists), MD034 (wrap URLs), MD040 (language for code blocks).

## Architecture

### Rendering Model

All visitors receive identical full HTML. No dual rendering or bot detection.

| Type | Pages | Delivery |
|------|-------|----------|
| Prerendered | index, expertise, consultancy, work-experience, education, 404 | CDN edge at build time |
| SSR | contact | Cloudflare Worker per-request (Astro Actions) |
| API endpoints | health.ts, metrics.ts, security.txt.ts, `*.md.ts`, llms.txt.ts, llms-full.txt.ts | Worker |

### Key Configuration Patterns

**Output mode**: Must be `output: 'server'` (Astro Actions require a server runtime). Pages opt into prerendering individually with `export const prerender = true`.

**Trailing slashes**: `trailingSlash: 'never'` in `astro.config.mjs` to match URL structure.

**Security headers and CSP**: Handled in `src/worker.ts`, NOT in Astro middleware. Astro middleware does not run for prerendered pages on Cloudflare (served via `env.ASSETS.fetch()`, bypassing the Astro render pipeline). The custom Worker wraps `@astrojs/cloudflare/handler` and applies headers to ALL responses.

**CSP nonces**: Per-request nonces via `crypto.randomUUID()`. Cloudflare HTMLRewriter injects `nonce=""` on all `<script>` tags except `type="application/ld+json"` (streaming, no buffering). `'strict-dynamic'` means GTM child scripts inherit trust automatically. `Cache-Control: no-store` on HTML responses ensures nonces always match the CSP header. Host allowlists in `script-src` are fallbacks for browsers without `'strict-dynamic'` support.

**`'unsafe-eval'` in script-src**: Required by Fou Analytics anti-adblock/fraud scripts (`https://*.fouanalytics.com`) which use `eval()`/`new Function()` for runtime integrity checks. Trade-off accepted: `'strict-dynamic'` still prevents unauthorised script *injection* (different attack surface from string evaluation). Without this, Fou Analytics fails with "blocks the use of 'eval'" CSP violations.

**CSP allowlisted domains** (in `src/worker.ts`): fouanalytics.com (Fou Analytics), sgtm.henriksoderlund.com (sGTM), tagmanager.google.com, google-analytics.com, static.cloudflareinsights.com, challenges.cloudflare.com, fonts.googleapis.com, fonts.gstatic.com, ghchart.rshah.org, and others.

**`run_worker_first` and dev mode**: Required in production so the Worker processes prerendered pages, but MUST NOT be in source `wrangler.json` (the Cloudflare Vite plugin picks it up in dev mode and routes Vite's assets through the Worker, causing 404s). Added only to built output via `scripts/patch-wrangler.mjs`.

**View transitions**: CSS `@view-transition { navigation: auto; }` requires `<style is:global>` in the layout.

### Analytics and Tracking

- **sGTM**: Container `GTM-FWR4` loaded from custom domain `load.sgtm.henriksoderlund.com`
- **Fou Analytics**: Pixel tracking via `api.fouanalytics.com` with noscript fallback
- **dataLayer**: Global `window.dataLayer` initialised before GTM with environment detection (production vs development based on hostname)
- **Custom events**: `contact_form_submission` event pushed on successful form submit, with session storage deduplication to prevent duplicates
- **Cloudflare Insights**: Platform-level observability (CSP configured for `cloudflareinsights.com`)

### Contact Form

- **Astro Actions**: Server-side handler with `ActionError` codes (FORBIDDEN, BAD_REQUEST, INTERNAL_SERVER_ERROR)
- **Zod validation**: Name (1-100 chars), email (valid format, max 200), message (10-2000 chars)
- **Cloudflare Turnstile**: Theme-aware widget that re-renders on dark/light mode toggle
- **Resend**: Sends to `admin@henriksoderlund.com` with reply-to from submitter
- **IP forwarding**: `CF-Connecting-IP` header passed to Turnstile for verification
- **Progressive enhancement**: Works with and without JavaScript

### Dark Mode and Theming

- **CSS custom properties**: 40+ design tokens in `src/styles/theme.css`
- **Toggle**: `src/components/ThemeToggle.astro` with sun/moon icons, fixed positioning
- **Persistence**: localStorage with key `theme`, system preference fallback via `prefers-color-scheme`
- **FOUC prevention**: Theme detection script runs before paint in BaseLayout
- **Fonts**: JetBrains Mono (6 weights: 400, 400i, 500, 600, 600i, 700) as primary dark mode font; serif system fonts in light mode
- **Turnstile integration**: Widget theme updates on toggle

### Interactive Features

- **Breathing animation** (homepage): Keywords glow with 3-second cubic-bezier animation, random selection every 4 seconds, cleanup on view transitions
- **Project carousel** (expertise): Auto-advance every 5s, arrow key navigation, dot indicators, pause on hover/focus, `inert` on inactive cards
- **Collapsible navigation**: Sidebar with dynamic heading scan (h2, h4, h5, h6), session-persisted state, auto-close on mobile after navigation
- **GitHub contribution chart**: 1-year heatmap from `ghchart.rshah.org`, CSS filter inversion in dark mode
- **All animations**: Respect `prefers-reduced-motion` media query

### SEO

Handled in `src/layouts/BaseLayout.astro` and `src/components/SEO.astro`:

- **JSON-LD**: Person (location Perth AU, languages English/Swedish, education, awards), ProfessionalService (with offer catalog), WebSite
- **Open Graph**: 11+ tags including profile metadata (og:type `profile` on home, `website` elsewhere), OG image 1200x630
- **Twitter Cards**: Summary large image, 8+ tags with creator/site metadata
- **Sitemap**: Auto-generated with priorities (home 1.0, expertise 0.9, consultancy/work-experience/contact 0.8, education 0.7)
- **Verification**: Google Search Console, Ahrefs
- **Canonical links**: Self-referential on all pages, Link header set at Worker level

### llms.txt and AI Content

- `/llms.txt` - Curated entry point with ASCII art logo and page directory
- `/llms-full.txt` - Complete site content concatenated for LLM consumption
- Per-page markdown at `*.md.ts` endpoints
- `robots.txt` includes explicit AI-friendly rules
- Character encoding normalised via `removeEmojis()` and `pageMarkdown.ts`

### Security Headers (Worker Level)

Applied to ALL responses by `src/worker.ts`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy` with per-request nonces (HTML responses only)
- Canonical `Link` header for `www.henriksoderlund.com`

### Environment Variables

Type-safe via `astro:env/server` (schema in `astro.config.mjs`):

- `RESEND_API_KEY` - Email delivery for contact form (optional at build, required at runtime)
- `TURNSTILE_SECRET_KEY` - Server-side Turnstile verification (optional at build, required at runtime)
- `TURNSTILE_SITE_KEY` - Client-side Turnstile widget (public)

**CRITICAL - Env vars and prerendering**: Server secrets (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`) MUST be `optional: true` in the env schema. The Cloudflare adapter's prerender subprocess reads secrets from `.dev.vars`, NOT from process environment variables. In CI (which has no `.dev.vars`), required secrets cause `EnvInvalidVariables` errors that silently produce 0-byte HTML files while the build still exits 0. The runtime validation for these secrets is in `src/actions/index.ts`.

> **History**: March 2026 - Required env vars in the schema caused all prerendered pages to deploy as empty files. The build exited 0, smoke tests only checked HTTP status (not body size), so the outage went undetected until manual inspection.

### Redirects

Permanent (301) redirects are handled in `src/worker.ts` (the `REDIRECTS` map, plus a `/blog/*` prefix rule and a naked-domain to `www` canonicalisation), NOT in `public/_redirects` (no such file - Cloudflare's asset binding intercepts before Astro routing, so redirects must run in the Worker). Covers: legacy Hugo/Thulite `/content/*` paths, `/skills`+`/skill`+`*.html` to `/expertise`, `/blog`+`/blog/*`+`/about` to `/`, `/sitemap.xml` to `/sitemap-index.xml`, `/index.md` to `/index.html.md`.

Defunct feed endpoints (`/index.xml`, `/feed`, `/feed.xml`, `/rss.xml`, `/atom.xml`) return **410 Gone** via the `GONE` set in `src/worker.ts`, NOT 301. Rationale: no content equivalent exists (Astro site has no blog/feed), and 301-to-homepage risks Google soft-404 classification per Search Central guidance. 410 signals permanent removal explicitly. Response includes `X-Robots-Tag: noindex` to accelerate deindexing.

## File Locations

```text
src/
  actions/index.ts              # Contact form (Turnstile + Resend + Zod validation)
  components/                   # NavigationBox, Footer, ContactForm, SEO, ThemeToggle, GitHubLink, LinkedInLink
  data/                         # Business data (consultation, expertise, links, workExperience)
  layouts/BaseLayout.astro      # Main layout (sGTM, Fou Analytics, dataLayer, JSON-LD, view transitions)
  pages/                        # File-based routing (pages, API endpoints, markdown endpoints)
  styles/                       # App.css (~44KB), index.css, theme.css (design tokens)
  utils/                        # removeEmojis, markdownResponse, pageMarkdown
  worker.ts                     # Custom Worker entry (CSP nonces, security headers, HTMLRewriter, 301 redirects)
scripts/patch-wrangler.mjs      # Post-build wrangler config patch (run_worker_first)
scripts/verify-build.mjs        # Build artifact verification (size thresholds, completeness)
public/fonts/                   # JetBrains Mono WOFF2 (6 weights)
.github/workflows/deploy.yml   # CI/CD: lint, build, verify, deploy, smoke test
```

### API Endpoints

- `/health` - Service status
- `/metrics` - Worker metrics (CF-Ray, CF-IPCountry, CF-IPColo headers)
- `/.well-known/security.txt` - RFC 9116 security contact
- `/llms.txt`, `/llms-full.txt` - AI content endpoints
- `/*.md` - Per-page markdown versions

## Development Workflow

### Validation Commands

- `pnpm run check` - Full validation: Astro type check + build + wrangler patch + artifact verification
- `pnpm run build` - Production build: `astro check && astro build` + wrangler patch + artifact verification
- `pnpm run lint` - ESLint code quality
- `pnpm run dev` - Dev server on port 4321
- `pnpm run preview` - UNSUPPORTED by the Cloudflare adapter (see "Local Dev Server and Redirect Testing")
- `pnpm run cf-typegen` - Generate Cloudflare Workers types
- `node scripts/verify-build.mjs` - Standalone build artifact verification (checks HTML pages, markdown endpoints, text files, server bundle, and `run_worker_first` patch)

### Local Dev Server and Redirect Testing

Spinning up a local server to verify Worker behaviour (redirects, headers, CSP) has three known traps. Follow this exact approach instead of improvising.

**1. `pnpm run preview` does NOT work for this project.** The script is `astro preview`, which the `@astrojs/cloudflare` adapter does not support with `output: 'server'`. It exits without binding a port (no error in some shells). Do not use it to test Worker logic. For Worker-level testing, run the built bundle under Wrangler:

```bash
pnpm run build
npx wrangler dev -c dist/server/wrangler.json --port 8801 --local --ip 127.0.0.1
```

**2. Stale `.wrangler/deploy/config.json` blocks `wrangler dev`.** If a prior deploy left this cache, Wrangler errors with "Found both a user configuration file ... and a deploy configuration file ... do not share the same base path". The file is gitignored and regenerated on deploy - safe to delete:

```bash
rm -f .wrangler/deploy/config.json
```

**3. `routes`/`zone_name` makes `wrangler dev` 301 every request to `https://www.<host>`.** `wrangler.json` has `routes: [{ pattern: "henriksoderlund.com/*", zone_name: "henriksoderlund.com" }]`. In `wrangler dev` this emulates the Cloudflare zone and canonicalises **every** request (including `/` and static assets) to `https://www.<host><path>` with a bare 301 and no Worker headers. This is a dev-tooling artifact, NOT a code bug, and masks all real Worker redirect/header behaviour. To test redirects locally, strip `routes` from the **built** config only (never edit source `wrangler.json` for this):

```bash
node -e "const f='dist/server/wrangler.json',w=require('./'+f);delete w.routes;require('fs').writeFileSync(f,JSON.stringify(w))"
```

Then restart `wrangler dev`. A correct local result: `/` returns 200, `/index.xml` 301s to `/`, `/skills` 301s to `/expertise`. Note the redirect `Location` host will be the local `127.0.0.1:<port>` (the naked-domain to-www branch in `src/worker.ts` only fires for `hostname === 'henriksoderlund.com'`); in production the host resolves to `https://www.henriksoderlund.com`. Restore the built config (or rebuild) afterwards. The authoritative redirect/header check remains the CI smoke test in `.github/workflows/deploy.yml` against the deployed site.

### Data-Driven Architecture

Business data is centralised in `src/data/` and consumed by page components:

- `consultation.ts` - Service offerings, engagement models, case studies with metrics
- `expertise.ts` - Technical skills, platform expertise, AI tooling, GitHub project showcase
- `workExperience.ts` - Professional experience with achievements and technologies
- `links.ts` - Centralised external URLs (Calendly, LinkedIn, GitHub)

This separates presentation from data for maintainability and type safety.

### Cloudflare-Specific Details

- **Compatibility date**: `2026-03-01` with `nodejs_compat` flag
- **Observability**: Enabled in `wrangler.json` with source map uploads
- **CF request headers used**: `CF-Connecting-IP` (Turnstile), `CF-Ray` (metrics), `CF-IPCountry` (metrics), `CF-IPColo` (metrics)
- **Rate limiting**: Configured via Cloudflare WAF dashboard rules (not in code)
- **Crawler Hints**: Enabled via Cloudflare dashboard

## AI Collaboration

### Using Gemini CLI for Complex Debugging

For complex issues requiring deep analysis:

```bash
gemini -p "YOUR_DETAILED_ANALYSIS_REQUEST"
```

Valuable for: complex routing issues, cross-platform compatibility, performance optimisation, security reviews. Provide comprehensive context and request "ULTRATHINK" for deep root cause analysis.

## Notes

- Dev server: port 4321 (Astro default)
- Cloudflare acquired Astro in January 2026 - `@astrojs/cloudflare` is first-party
- Build verification via `scripts/verify-build.mjs` (runs automatically in `pnpm run build`)
- Local Worker testing: see "Local Dev Server and Redirect Testing" (do NOT use `pnpm run preview` - unsupported by the Cloudflare adapter)
- Check `package.json` for dependency versions (not listed here to avoid staleness)
- Image format: WebP for screenshots, SVG/PNG for logos, with lazy loading and `decoding="async"`
- 404 page includes ASCII art and navigation links
