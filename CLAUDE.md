# CLAUDE.md - Operational Rules for Claude Code

Instructions, guardrails, and critical guidance for working with this codebase.

## Project Context

Henrik Soderlund's personal portfolio website. Astro 6 with server-side rendering, prerendered pages, and Cloudflare Workers deployment via `@astrojs/cloudflare` adapter.

- **Production**: <https://www.henriksoderlund.com/>
- **Stack**: Check `package.json` for current versions
- **Data Layer**: Business data centralised in `src/data/` (consultation.ts, expertise.ts, workExperience.ts)
- **Routing**: Astro file-based routing (`src/pages/`)
- **Rendering**: 5 of 6 pages prerendered at build time (CDN edge); contact page is SSR (Astro Actions for contact form)

## Critical Rules & Guardrails

### Content Preservation

**NEVER modify, change, or "improve" existing copywriting without explicit user approval.**

- Homepage copy and marketing content is carefully crafted and tested
- Technical fixes (SEO, structure, formatting) allowed - content changes require permission
- This includes content in Astro page components and layout files
- ASK first and explain exactly what you want to change

### File Deletion Safety

**NEVER DELETE INFRASTRUCTURE FILES DURING CLEANUP OPERATIONS**

**Critical Files (NEVER delete):**

- `astro.config.mjs` - Astro configuration (output mode, adapter, integrations, env schema)
- `wrangler.json` - Cloudflare Workers configuration
- `package.json` - Build configuration and dependencies
- `src/layouts/BaseLayout.astro` - Main layout with GTM, JSON-LD, view transitions, SEO metadata
- `src/worker.ts` - Custom Worker entry: CSP nonces, security headers, HTMLRewriter
- `src/actions/index.ts` - Astro Actions (contact form with Turnstile + Resend)
- `.github/workflows/` - CI/CD pipelines

**Safe Cleanup Protocol:**

1. Run `npm run check` BEFORE any cleanup commit
2. NEVER delete files without explicit user approval for each file
3. Use `git status` extensively to review what will be deleted
4. Focus cleanup on: Documentation files, debug logs, temporary files only
5. When in doubt, ASK the user first

**History**: August 2025 - Accidental `index.html` deletion caused complete website failure in the previous Vite-based stack.

### Deployment Process

**IMPORTANT**: Production deployment is automatic via GitHub Actions. DO NOT use `npm run deploy` directly.

**Production:**

1. Push to main branch - GitHub Actions workflow triggers
2. Automated CI/CD: Build, lint, verify artifacts, deploy to Cloudflare Workers
3. Live site updated at <https://www.henriksoderlund.com/>

**Development/Testing Only:**

- `npm run build` - Local build testing (`astro check && astro build`)
- `npm run preview` - Local production build preview
- `npm run deploy` - Manual deploy (development/testing only, NOT production)

## Content Standards

### Language & Style

- **British English only**: optimisation, specialising, organisation, utilising, realise, colour, behaviour, centre
- **Voice**: Professional, direct, technical without excessive formality
- **Punctuation**: Use regular hyphens (-) instead of em-dashes, except for date ranges (2023-2024)
- **Consistency**: Maintain uniform terminology and spelling across all files

### Character Encoding Standards

**CRITICAL**: Apply consistent character encoding across ALL generated files (llms.txt, markdown files).

**Key Replacements:**

- `oe` for `ö`
- Straight quotes for smart quotes
- Hyphens for em-dashes
- Remove emojis and Unicode symbols

**Implementation:**

- Use centralised `removeEmojis()` function from `src/utils/removeEmojis.ts`
- Apply to ALL generated text: titles, descriptions, project data
- Test generated markdown endpoints by fetching them in the browser or via curl

### Markdown Linting Rules

All markdown files must pass these linting rules:

- **MD022**: Blank lines around headings
- **MD024**: No duplicate heading text (rename with descriptive prefixes)
- **MD031**: Blank lines around code blocks
- **MD032**: Blank lines around lists
- **MD034**: Wrap URLs in angle brackets `<url>` or proper markdown links
- **MD040**: Specify language for code blocks (use `text` for generic content)

## Astro Architecture

### Rendering Model

All visitors (users and crawlers alike) receive identical full HTML. No dual rendering or bot detection needed.

- **Prerendered pages** (built at deploy time, served from CDN edge): index, expertise, consultancy, work-experience, education, 404
- **SSR page** (processed by Cloudflare Worker on each request): contact (requires Astro Actions for contact form)
- **API endpoints**: health.ts, metrics.ts, security.txt.ts, per-page markdown endpoints (`*.md.ts`)

### Key Configuration Patterns

**Output mode**: Must use `output: 'server'` (not `'static'`) because Astro Actions require a server runtime. Individual pages opt into prerendering with `export const prerender = true`.

**Trailing slashes**: Set `trailingSlash: 'never'` in `astro.config.mjs` to match existing URL structure and avoid redirects.

**Security headers and CSP**: Handled at the Worker level in `src/worker.ts`, NOT in Astro middleware. Astro middleware does NOT run for prerendered pages on Cloudflare (they are served via `env.ASSETS.fetch()`, bypassing the Astro render pipeline). The custom Worker entry wraps `@astrojs/cloudflare/handler` and applies headers to ALL responses.

**CSP nonces**: Per-request nonces generated via `crypto.randomUUID()`. Cloudflare's `HTMLRewriter` injects `nonce=""` attributes on all executable `<script>` tags (excluding `type="application/ld+json"`). CSP uses `'strict-dynamic'` so GTM child scripts inherit trust automatically.

**`run_worker_first` and dev mode**: The `run_worker_first: true` assets config is required in production so the Worker processes prerendered pages. However, it MUST NOT be in the source `wrangler.json` because the Cloudflare Vite plugin picks it up in dev mode and routes Vite's own assets through the Worker, causing universal 404s. It is added only to the built output via `scripts/patch-wrangler.mjs` (post-build step).

**View transitions**: CSS `@view-transition { navigation: auto; }` requires `<style is:global>` in the layout, not a scoped `<style>` block.

### SEO Metadata

SEO metadata is handled in `src/layouts/BaseLayout.astro` and `src/components/SEO.astro`:

- Complete Open Graph tags (11+ tags including image metadata)
- Full Twitter Card metadata (8+ tags)
- Site verification tags (Google, Ahrefs)
- ALL JSON-LD structured data schemas (Person, ProfessionalService, WebSite)
- Favicon, canonical links, proper meta descriptions
- Analytics tracking (GTM, noscript fallbacks)

**Testing Commands:**

```bash
# All visitors get the same HTML - no need for User-Agent spoofing
curl http://localhost:4321

# Count SEO tags
curl http://localhost:4321 | grep -c "og:"

# Verify content
curl http://localhost:4321 | grep "<h1>"
```

## Generated Files Management

### Sitemap

- Generated automatically by `@astrojs/sitemap` integration during `astro build`
- Configuration (priorities, filtering) in `astro.config.mjs`

### llms.txt and Markdown Endpoints

- Per-page markdown available at `*.md.ts` endpoint files in `src/pages/`
- Character encoding applied via `removeEmojis()` from `src/utils/removeEmojis.ts`
- Markdown response utility in `src/utils/markdownResponse.ts`

## AI Collaboration Strategy

### Using Gemini CLI for Complex Debugging

When facing complex technical issues requiring deep analysis, collaborate with Google's Gemini AI:

```bash
gemini -p "YOUR_DETAILED_ANALYSIS_REQUEST"
```

**Best Practices:**

1. Provide comprehensive context: error symptoms, what works vs doesn't, code snippets, debugging attempts
2. Request "ULTRATHINK" analysis for deep root cause investigation
3. Compare approaches: different AI models may identify issues others missed
4. Cross-validate solutions: use insights from one AI to improve solutions from another

**Valuable for:**

- Complex routing and middleware issues
- Cross-platform compatibility problems
- Performance optimisation challenges
- Security implementation reviews

## Development Workflow

### Validation Before Commits

- **Full Check**: `npm run check` - Astro type check + build + wrangler patch
- **Lint**: `npm run lint` - ESLint code quality validation
- **Build**: `npm run build` - `astro check && astro build` + post-build wrangler patch (includes sitemap generation)

### Data-Driven Architecture

- **Page Components**: Astro pages in `src/pages/`
- **Reusable Components**: Astro components in `src/components/`
- **Business Data**: Centralised in `src/data/` directory
  - `consultation.ts` - Service offerings, pricing
  - `expertise.ts` - Technical skills, GitHub projects
  - `workExperience.ts` - Professional experience
- **Pattern**: Separate presentation logic from business data for maintainability

### File Locations

- **Pages**: `src/pages/` (Astro file-based routing)
- **Components**: `src/components/` (Astro components)
- **Layouts**: `src/layouts/BaseLayout.astro` (main layout)
- **Actions**: `src/actions/index.ts` (contact form)
- **Worker Entry**: `src/worker.ts` (CSP nonces, security headers, HTMLRewriter)
- **Build Scripts**: `scripts/patch-wrangler.mjs` (post-build wrangler config patch)
- **Data**: `src/data/` (business data files)
- **Assets**: `src/assets/` (images, logos, flags, icons)
- **Styles**: `src/styles/` (App.css, index.css)
- **Utilities**: `src/utils/` (removeEmojis.ts, markdownResponse.ts)
- **Static Assets**: `public/` (SEO verification, favicons, redirects)
- **Build Output**: `dist/` (auto-generated, git-ignored)

## Key Technical Patterns

### Astro Component Architecture

- File-based routing with `.astro` page components
- Astro components for reusable UI (NavigationBox, Footer, ContactForm, SEO)
- Vanilla JavaScript for interactivity (breathing animation, navigation scroll)
- Native `<details>/<summary>` for accordion UI (case studies)
- CSS View Transitions for smooth page navigation (zero-JS)
- Astro prefetch for near-instant navigation

### Content Security Policy (CSP)

- Per-request cryptographic nonces replace `'unsafe-inline'` in `script-src`
- `src/worker.ts` is the custom Worker entry point (set via `"main"` in `wrangler.json`)
- Wraps `@astrojs/cloudflare/handler`'s `handle()` function
- `HTMLRewriter` injects `nonce=""` on all `<script>` tags except `type="application/ld+json"` (streaming, no buffering)
- `'strict-dynamic'` in CSP means scripts loaded by nonced scripts (e.g., GTM child scripts) are auto-trusted
- `Cache-Control: no-store` on HTML responses ensures nonces in HTML always match the CSP header
- Host allowlists in `script-src` are kept as fallbacks for browsers not supporting `'strict-dynamic'`
- Adapter's `config.main` uses nullish coalescing (`??`), so setting `main` in `wrangler.json` is safe

### Environment Variables

- Type-safe secrets via `astro:env/server` (configured in `astro.config.mjs` env schema)
- `RESEND_API_KEY` - Email delivery for contact form
- `TURNSTILE_SECRET_KEY` - Server-side Turnstile verification
- `TURNSTILE_SITE_KEY` - Client-side Turnstile widget (public)

### Spam Protection

- Cloudflare Turnstile widget on contact form (replaces reCAPTCHA)
- Server-side token verification in Astro Action
- Rate limiting configured via Cloudflare WAF dashboard rules (not in code)

### Testing

- No test framework currently configured
- Can add Vitest if needed
- Use `npm run preview` for local production build testing

## Notes

- Check `package.json` for dependency versions (not listed here to avoid staleness)
- File structure discoverable via `ls` and `tree` commands
- Dev server runs on port 4321 (Astro default)
- Cloudflare acquired Astro in January 2026 - the `@astrojs/cloudflare` adapter is first-party
- No test suite configured (suggest Vitest if needed)
