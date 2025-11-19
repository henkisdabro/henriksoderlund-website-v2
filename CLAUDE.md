# CLAUDE.md - Operational Rules for Claude Code

Instructions, guardrails, and critical guidance for working with this codebase.

## Project Context

Henrik Söderlund's personal portfolio website. React SPA (Vite) with Cloudflare Workers backend (Hono.js).

- **Production**: <https://www.henriksoderlund.com/>
- **Stack**: Check `package.json` for current versions
- **Data Layer**: Business data centralized in `src/react-app/data/` (consultation.ts, expertise.ts, workExperience.ts)
- **Routing**: React Router (client-side) + Hono (worker-side)

## Critical Rules & Guardrails

### Content Preservation

⚠️ **NEVER modify, change, or "improve" existing copywriting without explicit user approval.**

- Homepage copy and marketing content is carefully crafted and tested
- Technical fixes (SEO, structure, formatting) allowed - content changes require permission
- This includes server-side generated content in Hono worker that mirrors React components
- ASK first and explain exactly what you want to change

### File Deletion Safety

⚠️ **NEVER DELETE INFRASTRUCTURE FILES DURING CLEANUP OPERATIONS**

**Critical Files (NEVER delete):**

- `index.html` - Essential Vite template with SEO metadata (305+ lines)
- `wrangler.json` - Cloudflare Workers configuration
- `package.json`, `vite.config.ts` - Build configuration
- `src/worker/index.ts`, `src/react-app/main.tsx` - Application entry points
- `.github/workflows/` - CI/CD pipelines

**Safe Cleanup Protocol:**

1. Run `npm run check` BEFORE any cleanup commit
2. NEVER delete files without explicit user approval for each file
3. Use `git status` extensively to review what will be deleted
4. Focus cleanup on: Documentation files, debug logs, temporary files only
5. When in doubt, ASK the user first

**History**: August 2025 - Accidental `index.html` deletion caused complete website failure. Vite build failed silently, GitHub Actions deployed broken workers.

### Deployment Process

⚠️ **IMPORTANT**: Production deployment is automatic via GitHub Actions. DO NOT use `npm run deploy` directly.

**Production:**

1. Push to main branch → GitHub Actions workflow triggers
2. Automated CI/CD: Build, lint, verify artifacts, deploy to Cloudflare Workers
3. Live site updated at <https://www.henriksoderlund.com/>

**Development/Testing Only:**

- `npm run build` - Local build testing
- `npm run preview` - Local production build preview
- `npm run deploy` - Manual deploy (development/testing only, NOT production)

## Content Standards

### Language & Style

- **British English only**: optimisation, specialising, organisation, utilising, realise, colour, behaviour, centre
- **Voice**: Professional, direct, technical without excessive formality
- **Punctuation**: Use regular hyphens (-) instead of em-dashes (—), except for date ranges (2023—2024)
- **Consistency**: Maintain uniform terminology and spelling across all files

### Character Encoding Standards

⚠️ **CRITICAL**: Apply consistent character encoding across ALL generated files (llms.txt, markdown files).

**Key Replacements:**

- `ö → oe`
- `" → "` (smart quotes to straight quotes)
- `— → -` (em-dash to hyphen)
- Remove emojis and Unicode symbols

**Implementation:**

- Use centralized `removeEmojis()` function from `jsx-to-markdown.js`
- Apply to ALL generated text: titles, descriptions, project data
- Test with `cat public/llms.txt` and `cat public/*.md` after generation

### Markdown Linting Rules

All markdown files must pass these linting rules:

- **MD022**: Blank lines around headings
- **MD024**: No duplicate heading text (rename with descriptive prefixes)
- **MD031**: Blank lines around code blocks
- **MD032**: Blank lines around lists
- **MD034**: Wrap URLs in angle brackets `<url>` or proper markdown links
- **MD040**: Specify language for code blocks (use `text` for generic content)

## Cloudflare Workers Architecture

### Hybrid Serving Model

- **Regular Users**: React SPA with client-side routing (fast HMR)
- **Search Engine Crawlers**: Server-side rendered HTML with complete SEO metadata
- **Crawler Detection**: Use Cloudflare's native `botManagement.verifiedBot` (NOT User-Agent strings)

### Critical Configuration Pattern

**Problem**: Static files in assets directory bypass worker code entirely, breaking crawler detection.

**Solution**: Use `run_worker_first` in `wrangler.json` to force routes through worker:

```json
{
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist/client",
    "run_worker_first": ["/"]
  }
}
```

**Key Learning**: Always test crawler behavior separately from regular user experience.

### SEO Metadata Requirements

When generating custom HTML for crawlers, include COMPLETE SEO metadata:

- Complete Open Graph tags (11+ tags including image metadata)
- Full Twitter Card metadata (8+ tags)
- Site verification tags (Google, Ahrefs)
- ALL JSON-LD structured data schemas (Person, ProfessionalService, WebSite)
- Favicon, canonical links, proper meta descriptions
- Analytics tracking (noscript fallbacks)

**Testing Commands:**

```bash
# Test crawlers
curl -H "User-Agent: Googlebot/2.1" http://localhost:5173

# Count SEO tags
curl -H "User-Agent: Googlebot/2.1" http://localhost:5173 | grep -c "og:"

# Verify content
curl -H "User-Agent: Googlebot/2.1" http://localhost:5173 | grep "<h1>"

# Test regular users (should get React SPA)
curl http://localhost:5173
```

## Generated Files Management

### Auto-Generated Files (excluded from git)

- `public/llms.txt` - Main llms.txt file for AI/LLM consumption
- `public/*.md` - Individual page markdown files (index.html.md, expertise.md, etc.)
- `.llms-cache.json` - Build cache for content-based generation

### Generation Workflow

- **Smart Caching**: Only regenerates when React component content changes
- **Build Integration**: Automatic during `npm run build`
- **Manual Trigger**: `npm run generate-llms` (force regenerate), `npm run generate-llms-if-needed` (smart)
- **Character Encoding**: Apply consistent encoding via `removeEmojis()` function

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
- Performance optimization challenges
- Security implementation reviews

**Example Success**: Gemini identified unreliable User-Agent string matching as root cause for homepage crawler detection failure, recommended Cloudflare's native `botManagement.verifiedBot` detection.

## Development Workflow

### Validation Before Commits

- **Full Check**: `npm run check` - TypeScript compilation + build + dry-run deploy
- **Lint**: `npm run lint` - Code quality validation
- **Build**: `npm run build` - Includes llms.txt + sitemap generation

### Data-Driven Architecture

- **Component Presentation**: React components in `src/react-app/components/`
- **Business Data**: Centralized in `src/react-app/data/` directory
  - `consultation.ts` - Service offerings, pricing
  - `expertise.ts` - Technical skills, GitHub projects
  - `workExperience.ts` - Professional experience
- **Pattern**: Separate presentation logic from business data for maintainability

### File Locations

- **Frontend**: `src/react-app/` (React SPA)
- **Backend**: `src/worker/index.ts` (Hono.js worker)
- **Static Assets**: `/public/` (SEO verification, favicons, redirects)
- **Build Output**: `dist/` (auto-generated, git-ignored)

## Key Technical Patterns

### Modern React Architecture

- Direct imports without namespace pollution
- Functional components without `React.FC` typing
- Full TypeScript type safety
- Business logic separated into data files

### Testing

- No test framework currently configured
- Can add Vitest or Jest if needed
- Use `npm run preview` for local production build testing

## Notes

- Check `package.json` for dependency versions (not listed here to avoid staleness)
- File structure discoverable via `ls` and `tree` commands
- No test suite configured (suggest Vitest if needed)
