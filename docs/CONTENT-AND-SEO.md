# Content and SEO

Rules specific to this site. The house style rules that apply to all of Henrik's projects live in his global config and are not repeated here.

## Voice

Professional, direct, technical without excessive formality. This is a consulting shopfront, so claims are specific and evidenced rather than promotional. Terminology stays uniform across pages, structured data and the markdown endpoints - the same service should not be "consultancy" in one place and "consulting services" in another.

Henrik's positioning line varies by surface and each surface keeps the one it already uses:
**Technology Leader & Automation Architect** in the `Person` and `WebSite` structured data
(`BaseLayout.astro`), **Technology Leader & AI Innovator** in the markdown endpoints
(`pageMarkdown.ts`, `llms.txt.ts`), and the plain job title **Digital Consultant** in the prose of
`llms-full.txt.ts`. Do not swap one for another without asking - they are deliberate register
differences, not drift.

## Structured data and social metadata

Generated in `src/layouts/BaseLayout.astro` and `src/components/SEO.astro`:

- **JSON-LD** emits three sitewide nodes from `BaseLayout.astro`: `Person` (`#person` - Perth AU, English and Swedish, education, awards), `ProfessionalService` (`#practice` - address, `areaServed`, `sameAs`, and an offer catalog built from `src/data/consultation.ts`), and `WebSite` (`#website`, authored by `#person` and published by `#practice`).
- `/consultancy` adds two page-scoped nodes: a `Service` (`/consultancy#service`) whose `provider` points at `#practice`, and a `FAQPage` built from `consultationData.faq`. The offer catalog lives only on `#practice` - do not re-declare it on the page `Service`.
- Every node is `@id`-linked rather than repeated, so a change of entity name or service list happens in one place. Validate with the Rich Results Test after touching any of them.
- **Open Graph** uses `og:type: profile` on the homepage and `website` elsewhere, with a 1200x630 image.
- **Twitter cards** use summary_large_image with creator and site metadata.
- **Canonical links** are self-referential on every page, and the canonical `Link` header is set at the Worker level in `src/worker.ts` for 2xx responses. Both must agree.
- Google Search Console and Ahrefs verification tags live in the layout.

## Sitemap priorities

Set in the `serialize` callback in `astro.config.mjs`: home 1.0, expertise 0.9, consultancy / work-experience / contact 0.8, education 0.7, privacy 0.3, anything else 0.5. The `filter` excludes `/api/`, `.md` endpoints and the llms files. A new page with no entry in the priority map silently gets 0.5 - add it deliberately.

## Analytics

- **sGTM** container `GTM-FWR4`, loaded from the custom domain `load.sgtm.henriksoderlund.com`. A separate first-party proxy at `/sgtm/*` is implemented in `src/worker.ts`.
- **Fou Analytics** via `api.fouanalytics.com`, with a noscript pixel fallback. Its scripts require `'unsafe-eval'` in the CSP.
- **dataLayer** is initialised in `BaseLayout.astro` before GTM loads, with production/development detection based on hostname.
- **Contact form events** are pushed from `src/components/ContactForm.astro`, all of them carrying `form_name: 'contact'`:
  - **`generate_lead`** on a successful submit, with `form_location` (the pathname).
  - **`contact_form_start`** on the first focus or input, at most once per session. The guard is a `sessionStorage` flag behind a `window` flag, because a validation error is a full render cycle and a per-document flag alone would refire on every correction. It is deliberately not called `form_start`: that is GA4's automatically collected Enhanced Measurement event, and reusing the name commingles the two.
  - **`form_error`** on any rejected submit, with `error_type` (`validation`, `bot_check` or `server`), `error_code` and `error_fields` - a comma-joined list of field NAMES only. No submitted value ever reaches the dataLayer.
  - **`turnstile_outcome`** with `outcome` (`success`, `error`, `expired` or `timeout`) and, where the widget supplies one, `error_code`. The callbacks live in the contact form's own closure, which also listens for the `site:theme` CustomEvent and does the remove()/render() pair itself, so a theme-triggered re-render keeps them.
  - Duplicate conversions are prevented by Turnstile itself: its tokens are single-use, so a re-POST of the same form body fails verification before a second `generate_lead` can fire.
- Cloudflare Insights provides platform-level observability; the CSP allows `cloudflareinsights.com`.
- **Inbound links Henrik controls are UTM-tagged** to the convention in `docs/UTM-TAXONOMY.md`. `utm_medium` must be a value GA4's default channel grouping recognises, or the session lands in Unassigned.

## AI-readable endpoints

- `/llms.txt` - curated entry point with an ASCII logo and a page directory.
- `/llms-full.txt` - the whole site concatenated for LLM consumption.
- `/<page>.md` - per-page markdown, generated by the `*.md.ts` endpoints in `src/pages/` from the same `src/data/` sources the pages use.
- `robots.txt` carries explicit AI-crawler rules.

All of these are plain text. `removeEmojis()` in `src/utils/removeEmojis.ts` enforces that automatically - both `markdownResponse()` and `plainTextResponse()` run every endpoint through it, so it strips emoji, transliterates `ö` to `oe` and the other Scandinavian vowels to digraphs, folds smart quotes and dashes (em dash to a spaced hyphen, en dash to a plain one), and drops anything still outside printable ASCII. Rendered HTML pages keep Henrik's original typography; only generated text is folded, so fix encoding in that helper rather than in `src/data/`. Verify by fetching the endpoint rather than by reading the source, since the failure mode is encoding that only shows up over the wire.
