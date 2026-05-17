# Henrik Soderlund - Personal Website

[![Live Site](https://img.shields.io/badge/live-henriksoderlund.com-0ea5e9?style=flat&logo=googlechrome&logoColor=white)](https://www.henriksoderlund.com/)
[![Astro](https://img.shields.io/badge/astro-6-BC52EE?style=flat&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/typescript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/cloudflare%20workers-deployed-F38020?style=flat&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![CI/CD](https://img.shields.io/github/actions/workflow/status/henkisdabro/henriksoderlund-website-v2/deploy.yml?branch=main&label=deploy&logo=githubactions&logoColor=white)](https://github.com/henkisdabro/henriksoderlund-website-v2/actions)
[![Node.js](https://img.shields.io/badge/node.js-24_LTS-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![ESLint](https://img.shields.io/badge/eslint-10-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![License](https://img.shields.io/badge/licence-private-lightgrey?style=flat)](#)

Professional portfolio website for Henrik Soderlund - technology leader and AI innovation specialist. Built with Astro 6, deployed globally on Cloudflare Workers with hybrid rendering, per-request CSP nonces, server-side GTM, and dark mode theming.

> Migrated from a React SPA (Vite) to Astro 6 in March 2026 for better performance, SEO, and maintainability.

## Architecture

```text
                    +-------------------+
                    |   Cloudflare CDN  |
                    | (prerendered HTML)|
                    +--------+----------+
                             |
              +--------------+--------------+
              |                             |
     +--------v--------+          +--------v--------+
     |  Static Pages   |          |  SSR Contact    |
     |  (6 pages, CDN) |          |  (Astro Actions)|
     +--------+--------+          +--------+--------+
              |                             |
              +--------------+--------------+
                             |
                    +--------v--------+
                    |  Custom Worker   |
                    |  (src/worker.ts) |
                    |  CSP nonces,     |
                    |  security headers|
                    +--------+--------+
                             |
                    +--------v--------+
                    |  HTMLRewriter    |
                    |  (nonce inject)  |
                    +-----------------+
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | [Astro 6](https://astro.build/) | Hybrid rendering (prerendered + SSR) |
| Adapter | [@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) | First-party Cloudflare Workers adapter |
| Runtime | [Cloudflare Workers](https://developers.cloudflare.com/workers/) | Edge computing with global deployment |
| Language | [TypeScript 6.0](https://www.typescriptlang.org/) | Strict type safety across all code |
| Security | Custom Worker + HTMLRewriter | Per-request CSP nonces, security headers |
| Spam Protection | [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) | Privacy-preserving contact form protection |
| Email | [Resend](https://resend.com/) | Contact form email delivery |
| Form Validation | [Zod](https://zod.dev/) (via Astro Actions) | Schema-based input validation |
| Analytics | Server-side GTM + [Fou Analytics](https://fouanalytics.com/) | Privacy-focused analytics on custom sGTM domain |
| SEO | [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) + JSON-LD | Automatic sitemap, structured data |
| Fonts | [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | Coding font for dark mode (6 weights) |
| Linting | [ESLint 10](https://eslint.org/) | Code quality with TypeScript support |
| Package Manager | [pnpm 11](https://pnpm.io/) | Pinned via `packageManager`, used by CI |
| CI/CD | [GitHub Actions](https://github.com/features/actions) | Automated build, lint, deploy, smoke tests |
| CLI | [Wrangler 4](https://developers.cloudflare.com/workers/wrangler/) | Cloudflare Workers development toolkit |

## Key Features

### Performance

- **Hybrid rendering** - 6 of 7 content pages prerendered at build time (sub-10ms TTFB from CDN edge); contact page SSR for form handling
- **Zero-JS page transitions** - CSS View Transitions (`@view-transition { navigation: auto; }`)
- **Identical HTML for all visitors** - No dual rendering or crawler detection
- **Optimised images** - WebP format, lazy loading, `decoding="async"`, proper dimensions

### Analytics and Tracking

- **Server-side Google Tag Manager (sGTM)** - Custom domain (`load.sgtm.henriksoderlund.com`) for first-party data collection
- **Fou Analytics** - Privacy-focused analytics via `api.fouanalytics.com` with noscript fallback
- **dataLayer** - Global `window.dataLayer` with environment detection (production vs development)
- **Custom events** - `contact_form_submission` event with session-based deduplication
- **Cloudflare Insights** - Platform-level observability

### Contact Form

- **Astro Actions** - Server-side form handling with progressive enhancement
- **Zod validation** - Schema-based: name (1-100 chars), email (valid, max 200), message (10-2000 chars)
- **Cloudflare Turnstile** - Privacy-preserving CAPTCHA with theme-aware re-rendering on dark/light mode toggle
- **Resend integration** - Email delivery to `admin@henriksoderlund.com` with reply-to from submitter
- **IP forwarding** - `CF-Connecting-IP` header passed to Turnstile for verification
- **Error handling** - Typed `ActionError` codes (FORBIDDEN, BAD_REQUEST, INTERNAL_SERVER_ERROR)

### Security

- **CSP nonces** - Per-request cryptographic nonces via custom Worker entry using Cloudflare HTMLRewriter (streaming, no buffering)
- **`'strict-dynamic'`** - GTM child scripts inherit trust automatically
- **Security headers** - X-Frame-Options (DENY), HSTS (1 year + preload), Referrer-Policy, Permissions-Policy (camera/mic/geo/payment disabled), X-Content-Type-Options
- **security.txt** - RFC 9116 compliant at `/.well-known/security.txt` with contact, policy, and expiration
- **Turnstile** - Server-side token verification in Astro Actions
- **Rate limiting** - Cloudflare WAF dashboard rules
- **Canonical Link header** - Set at Worker level for `www.henriksoderlund.com`

### SEO and AI

- **JSON-LD structured data** - Person (with location, languages, education, awards), ProfessionalService, WebSite schemas
- **Open Graph** (11+ tags including profile metadata), **Twitter Cards** (summary large image, 8+ tags)
- **Automatic sitemap** via `@astrojs/sitemap` with per-page priorities (1.0 for home down to 0.7 for education)
- **Site verification** - Google Search Console and Ahrefs
- **AI-optimised content** - Per-page markdown endpoints following the [llms.txt](https://llmstxt.org/) specification
- **robots.txt** - Explicit AI-friendly rules ("AI systems are welcome")
- **Cloudflare Crawler Hints** - Enabled via dashboard
- **Canonical links** - Self-referential on all pages

### Design and UX

- **Dark mode** with JetBrains Mono coding font (6 weights) and theme toggle with sun/moon icons
- **Light mode** with clean, minimal serif typography
- **Theme persistence** - localStorage with system preference detection via `prefers-color-scheme`
- **FOUC prevention** - Theme detection script runs before paint
- **Breathing animation** - Homepage keywords glow with 3-second cubic-bezier animation, random selection every 4 seconds
- **Project carousel** - Expertise page showcase with auto-advance (5s), keyboard navigation (arrow keys), dot indicators, pause on hover/focus
- **Collapsible navigation** - Sidebar with "On This Page" heading scan, session-persisted state, auto-close on mobile after navigation
- **Mobile-responsive** - Navigation hidden on <1024px
- **Native accordions** - `<details>/<summary>` for case study content
- **GitHub contribution chart** - 1-year heatmap from `ghchart.rshah.org` with dark mode CSS filter inversion
- **Smooth scrolling** - Dynamic heading detection with scroll-to-section

### Accessibility

- **ARIA labels** - Comprehensive on buttons (carousel, navigation, theme toggle)
- **Keyboard navigation** - Arrow keys for carousel, tab/enter for navigation
- **Reduced motion** - `prefers-reduced-motion` compliance across all animations
- **Inert attribute** - Inactive carousel cards properly marked inert
- **External links** - `rel="noopener noreferrer"` on all external links
- **Semantic HTML** - Proper heading hierarchy, section tags, main content areas
- **Alt text** - Descriptive alt text on all images

## Project Structure

```text
src/
  actions/index.ts              # Astro Actions (contact form with Turnstile + Resend + Zod)
  assets/                       # Images, logos, icons, flags
    flags/                      #   Country flags (Swedish flag on education)
    icons/                      #   UI icons
    images/screenshots/         #   Project screenshots (WebP)
    logos/                      #   Brand logos (Cloudflare, Claude - SVG/PNG)
  components/                   # Astro components
    ContactForm.astro           #   Form with Turnstile, validation, dataLayer tracking
    Footer.astro                #   Site footer with tech stack logos
    GitHubLink.astro            #   GitHub profile link
    LinkedInLink.astro          #   LinkedIn profile link
    NavigationBox.astro         #   Collapsible sidebar with heading scan
    SEO.astro                   #   Open Graph, Twitter Cards, verification tags
    ThemeToggle.astro           #   Dark/light mode toggle with sun/moon icons
  data/                         # Centralised business data
    consultation.ts             #   Service offerings, methodology, case studies
    expertise.ts                #   Technical skills, GitHub projects, AI tooling
    links.ts                    #   External URLs (Calendly, LinkedIn, GitHub)
    workExperience.ts           #   Professional experience with achievements
  layouts/BaseLayout.astro      # Main layout: sGTM, Fou Analytics, JSON-LD, view transitions, SEO
  pages/                        # File-based routing
    index.astro                 #   Homepage with breathing animation
    expertise.astro             #   Skills and project carousel
    consultancy.astro           #   Service offerings and case studies
    work-experience.astro       #   Professional experience timeline
    education.astro             #   Educational background
    privacy.astro               #   Privacy policy
    contact.astro               #   Contact form (SSR)
    404.astro                   #   Custom not-found page with ASCII art
    *.md.ts                     #   Per-page markdown endpoints (llms.txt)
    llms.txt.ts                 #   AI entry point with ASCII art logo
    llms-full.txt.ts            #   Complete site content for LLMs
    health.ts                   #   Service status endpoint
    metrics.ts                  #   Worker metrics (CF-Ray, CF-IPCountry, CF-IPColo)
    .well-known/security.txt.ts #   RFC 9116 security contact
  styles/
    App.css                     #   Main application styles (~44KB)
    index.css                   #   Base/reset styles
    theme.css                   #   Light/dark mode design tokens (40+ CSS variables)
  utils/
    markdownResponse.ts         #   Markdown HTTP response helper
    pageMarkdown.ts             #   Page content to markdown converter
    removeEmojis.ts             #   Character encoding normalisation
  worker.ts                     # Custom Worker entry: CSP nonces, security headers, HTMLRewriter, 301 redirects
scripts/
  patch-wrangler.mjs            # Post-build: injects run_worker_first into built wrangler config
  verify-build.mjs              # Build artifact verification (size thresholds, completeness)
public/
  fonts/                        # JetBrains Mono WOFF2 files (6 weights)
  robots.txt                    # AI-friendly crawler rules
  og_image.png                  # Open Graph / Twitter card image
  favicon.svg                   # HS monogram favicon
  google*.html, ahrefs*         # Search Console / Ahrefs site verification
.github/workflows/deploy.yml   # CI/CD: lint, build, verify, deploy, smoke test
```

## Pages

| Page | Path | Rendering | Description |
|------|------|-----------|-------------|
| Home | `/` | Prerendered | Landing page with breathing keyword animation |
| Expertise | `/expertise` | Prerendered | Technical skills, project carousel, GitHub chart |
| Consultancy | `/consultancy` | Prerendered | Service offerings, case studies, Calendly booking |
| Work Experience | `/work-experience` | Prerendered | Professional experience timeline |
| Education | `/education` | Prerendered | Educational background |
| Privacy | `/privacy` | Prerendered | Privacy policy |
| Contact | `/contact` | SSR | Contact form with Turnstile + Resend |
| 404 | `/404` | Prerendered | Custom not-found page with ASCII art |

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/health` | Service status |
| `/metrics` | Worker metrics (CF-Ray, CF-IPCountry, CF-IPColo) |
| `/.well-known/security.txt` | RFC 9116 security contact |
| `/llms.txt` | AI entry point with page directory |
| `/llms-full.txt` | Complete site content for LLMs |
| `/*.md` | Per-page markdown versions |

## Getting Started

### Prerequisites

- [Node.js 24 LTS](https://nodejs.org/)
- [pnpm 11](https://pnpm.io/) (pinned via `packageManager`; `corepack enable` will provision it)

### Development

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server at http://localhost:4321
```

### Build and Validate

```bash
pnpm run build        # Production build (astro check + astro build + wrangler patch + verify)
pnpm run lint         # ESLint code quality check
pnpm run check        # Full validation (type check + build + wrangler patch + verify)
pnpm run cf-typegen   # Generate Cloudflare Workers types
```

> `pnpm run preview` (`astro preview`) does **not** work with the Cloudflare `output: 'server'` adapter. To test Worker behaviour (redirects, headers, CSP) locally, run the built bundle under Wrangler:
>
> ```bash
> pnpm run build
> npx wrangler dev -c dist/server/wrangler.json --port 8801 --local --ip 127.0.0.1
> ```

### Deployment

Production deployment is **fully automated** via GitHub Actions on push to `main`:

1. Checkout, setup pnpm + Node 24, `pnpm install --frozen-lockfile`, lint
2. Build with artifact verification (markdown endpoints, llms.txt)
3. Deploy to Cloudflare Workers via `wrangler-action`
4. Post-deploy smoke tests: 7 pages (HTTP status + body size), API endpoints (`/health`, `/llms.txt`, sitemaps), and 301 redirects (`/skills`, `/blog`, `/about`)

Manual deploy for development/testing only:

```bash
pnpm run deploy       # Build + deploy to Cloudflare Workers
npx wrangler tail     # Live log streaming
```

## Environment Variables

| Variable | Context | Description |
|----------|---------|-------------|
| `RESEND_API_KEY` | Server secret | Email delivery for contact form |
| `TURNSTILE_SECRET_KEY` | Server secret | Server-side Turnstile verification |
| `TURNSTILE_SITE_KEY` | Client public | Turnstile widget site key |

Configured via `astro:env` schema in `astro.config.mjs` for type-safe access.

CI/CD secrets (GitHub Actions):

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Wrangler deploy authentication |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier |

## Redirects

Permanent (301) redirects are handled in `src/worker.ts` (the `REDIRECTS` map plus a `/blog/*` prefix rule and a naked-domain to `www` canonicalisation), since Cloudflare's asset binding intercepts before Astro routing:

- **Naked domain**: `henriksoderlund.com/*` to `https://www.henriksoderlund.com/*`
- **Rebranding**: `/skills`, `/skill`, `/skills.html` to `/expertise`
- **Legacy Hugo/Thulite paths**: `/content/*` and `*.html` to current clean URLs
- **Removed sections**: `/blog`, `/blog/*`, `/about` to `/`
- **Legacy feeds**: `/feed`, `/feed.xml`, `/rss.xml`, `/atom.xml`, `/index.xml` to `/`
- **Sitemap/markdown**: `/sitemap.xml` to `/sitemap-index.xml`, `/index.md` to `/index.html.md`

## Additional Resources

- [Astro Documentation](https://docs.astro.build/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [Resend Documentation](https://resend.com/docs)
- [llms.txt Specification](https://llmstxt.org/)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
