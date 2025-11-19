# CLAUDE.md - Project Context for Claude Code

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Henrik Söderlund's personal website - a professional portfolio for a Technology Leader & AI Innovator. The site showcases technical expertise, leadership experience, and AI innovation focus through a modern web architecture.

**Production Site**: `https://www.henriksoderlund.com/`
**Deployment**: Automatic via GitHub Actions on push to main branch
**Target Audience**: Technical leaders, potential employers, collaboration partners, and AI practitioners

## Tech Stack

- **Runtime**: Node.js 24 LTS (with V8 13.6, npm 11)
- **Frontend**: React 19.2.0 with TypeScript 5.9.3, built with Vite 7.2.2
- **Backend**: Hono.js 4.10.6 (modern web framework)
- **Deployment**: Cloudflare Workers with observability enabled
- **Routing**: React Router 7.9.6 for client-side routing
- **Development**: ESLint 9.39.1, Wrangler 4.49.0

## Architecture

### Frontend (React SPA)

- **Location**: `src/react-app/`
- **Entry point**: `src/react-app/main.tsx`
- **Main component**: `src/react-app/App.tsx`
- **Routing**: React Router for client-side navigation
- **Pages**: Home, Expertise, Work Experience, Education, Consultation
- **Component Architecture**: Modern React patterns with optimized imports, clean component structure
- **Data Centralization**: Structured data files in `src/react-app/data/` for maintainable content
- **Navigation System**: Fixed navigation box (200px width) with dynamic heading detection and smooth scrolling
- **Responsive Design**: Mobile-first approach with navigation hidden on screens <1024px
- Built with Vite 7.2.2 for fast development and optimized builds
- Uses React 19.2.0 with TypeScript 5.9.3
- Node.js 24 LTS runtime for local development and CI/CD

### Backend (Cloudflare Worker)

- **Location**: `src/worker/index.ts`
- Built with Hono framework for lightweight API routes
- Runs on Cloudflare Workers runtime with global edge deployment
- **Hybrid Serving Architecture**:
  - **Regular Users**: React SPA with client-side routing and fast HMR
  - **Search Engine Crawlers**: Server-side rendered HTML with complete SEO metadata
  - **Crawler Detection**: Intelligent bot detection using Cloudflare's native `botManagement.verifiedBot`
  - **Worker-First Routing**: Homepage forced through worker code via `run_worker_first: ['/']` configuration
- **SEO Optimization**:
  - Complete Open Graph metadata (11+ tags)
  - Full Twitter Card implementation (8+ tags)
  - JSON-LD structured data (Person, ProfessionalService, WebSite schemas)
  - Dynamic canonical URLs and meta descriptions
- **IndexNow Protocol**: Complete implementation with API key validation and bulk submission support
- **Performance Features**: Source maps enabled, Node.js compatibility, real-time observability

### Project Structure

```text
src/
├── react-app/           # React frontend application
│   ├── components/      # React components (Home, Expertise, etc.)
│   ├── data/           # Centralized data files (consultation.ts, expertise.ts, workExperience.ts)
│   ├── assets/         # Static assets (SVG logos, flags, images)
│   ├── App.tsx         # Main App component with routing
│   ├── App.css         # Main component styles
│   ├── main.tsx        # React entry point
│   └── index.css       # Global styles
├── worker/             # Cloudflare Workers backend (Hono.js)
│   └── index.ts        # Worker entry point
public/                 # Static assets served directly
├── _redirects          # Cloudflare Workers redirects file
├── ahrefs_bc08e3a49... # Ahrefs verification file
├── google52d2217b...   # Google Search Console verification
└── bot.svg            # Custom favicon
```

## Development Commands

- `npm run dev` - Start development server (Vite dev server on port 5173)
- `npm run build` - Build for production (includes smart llms.txt generation + sitemap generation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run check` - Full check: TypeScript compilation, build, and dry-run deploy
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate Cloudflare Workers types
- `npm run generate-llms` - Force regenerate llms.txt and markdown files
- `npm run generate-llms-if-needed` - Smart generation (only if content changed)
- `npm run generate-sitemap` - Generate XML sitemap for search engines

**Note**: No test framework is currently configured. Tests can be added using Vitest or Jest if needed.

## Development Workflow

### Local Development Process

1. **Start Development Server**: `npm run dev` - Launches Vite dev server at <http://localhost:5173> with HMR
2. **Component Development**: Edit React components in `src/react-app/components/` with instant hot reload
3. **Data Management**: Update centralized data in `src/react-app/data/` files (consultation.ts, expertise.ts, workExperience.ts)
4. **Navigation Testing**: Test client-side routing (/, /expertise, /work-experience, /education, /consultation)
5. **Build Validation**: Use `npm run check` for comprehensive validation (TypeScript + build + dry-run deploy)

### Content Development Workflow

1. **Component Updates**: Modify React components for presentation changes
2. **Data Updates**: Edit structured data files for content changes
3. **Asset Management**: Add images to `src/react-app/assets/images/`, SVGs to `src/react-app/assets/`
4. **Style Updates**: Global styles in `index.css`, component styles in `App.css`

### Testing & Validation

- **Local Preview**: `npm run preview` - Test production build locally
- **Lint Check**: `npm run lint` - Validate code quality and consistency
- **Type Check**: `tsc` - Ensure TypeScript compilation
- **Crawler Testing**: Use `curl -H "User-Agent: Googlebot/2.1" localhost:5173` to test bot detection
- **Build Verification**: `npm run check` - Complete validation pipeline

### Deployment Strategy

- **Development/Testing**: `npm run deploy` for manual deployment
- **Production**: Automatic deployment via GitHub Actions on push to main branch
- **Content Generation**: Automatic llms.txt and sitemap generation during build process

## Content Management

### Content Architecture

- **Page Components**: React components in `src/react-app/components/` handle presentation logic
- **Centralized Data Layer**: Business data separated into `src/react-app/data/` directory:
  - `consultation.ts` - Service offerings, pricing, and consultation data
  - `expertise.ts` - Technical skills, platforms, GitHub contributions
  - `workExperience.ts` - Professional experience and achievements
- **Asset Management**:
  - **Images**: `src/react-app/assets/images/` for component assets
  - **SVG Assets**: `src/react-app/assets/` for logos, flags, and icons
  - **Static Files**: `/public/` for SEO verification, favicons, redirects
- **Styling Architecture**:
  - **Global Styles**: `src/react-app/index.css` for base typography and layout
  - **Component Styles**: `src/react-app/App.css` for component-specific styling
  - **Design System**: Clean minimal design with standardized tech logos (20px) and grey hover states

### Data-Driven Components

- **Work Experience**: Fully data-driven from `workExperience.ts` with structured job data
- **Expertise**: Dynamic skill categorization and GitHub project showcase from `expertise.ts`
- **Consultation**: Service tiers, pricing, and contact information from `consultation.ts`
- **SEO Metadata**: Dynamic generation from component data for crawler serving

## Key Dependencies

- **Runtime**: Node.js 24 LTS, React 19.2.0, Hono 4.10.6, React Router DOM 7.9.6
- **Build tools**: Vite 7.2.2, TypeScript 5.9.3
- **Deployment**: Wrangler 4.49.0, @cloudflare/vite-plugin 1.15.0
- **Linting**: ESLint 9.39.1 with React hooks and TypeScript support

## Component Architecture

### Core Components

- **App.tsx** - Main application component with React Router setup and navigation integration
- **NavigationBox.tsx** - Fixed sidebar navigation with dynamic heading detection and smooth scrolling
- **Home.tsx** - Homepage component with professional introduction and AI innovation focus
- **Expertise.tsx** - Technical skills showcase with data-driven content from `data/expertise.ts`
- **WorkExperience.tsx** - Professional experience timeline with data from `data/workExperience.ts`
- **Education.tsx** - Educational background and qualifications
- **Consultation.tsx** - Service offerings and consultation approach from `data/consultation.ts`

### Utility Components

- **Footer.tsx** - Site footer with tech stack logos and social links
- **ScrollToTop.tsx** - React Router navigation helper for proper scroll behavior
- **GitHubLink.tsx** - Reusable GitHub repository link component
- **LinkedInLink.tsx** - LinkedIn profile integration component
- **GoogleCalendarWidget.tsx** - Embedded calendar for consultation scheduling
- **NotFound.tsx** - 404 error page component

### Modern React Patterns

- **Optimized Imports**: Direct imports without namespace pollution
- **Clean Component Structure**: Functional components without React.FC typing
- **TypeScript Integration**: Full type safety across all components
- **Data Separation**: Business logic separated into data files for maintainability

## Content Standards

### **CRITICAL RULE - Content Preservation**

⚠️ **NEVER modify, change, or "improve" existing copywriting without explicit approval from the user.**

- The homepage copy, About sections, and all marketing content has been carefully crafted and tested
- Technical fixes (SEO, structure, formatting) are allowed, but content changes are NOT
- If copywriting improvements are needed, ASK for permission first and explain exactly what you want to change
- This includes server-side generated content in the Hono worker that mirrors React components

### **Character Encoding Standards**

⚠️ **CRITICAL**: Apply consistent character encoding across ALL generated files (llms.txt, markdown files).

- **Key Replacements**: `ö → oe`, `" → "`, `— → -`, remove emojis and Unicode symbols
- **Implementation**: Use centralized `removeEmojis()` function from `jsx-to-markdown.js`
- **Scope**: ALL generated text content including titles, descriptions, project data
- **Testing**: Verify consistent encoding in `llms.txt` and `.md` files after generation

### Writing Style & Language

- **Language**: All content must use British English spelling and conventions
- **Common British spellings**: optimisation (not optimization), specialising (not specializing), organisation (not organization), utilising (not utilizing), realise (not realize), colour (not color), behaviour (not behavior), centre (not center)
- **Voice**: Professional, direct, and technical without being overly formal
- **Punctuation**: Never use em-dashes (—) in text content - use regular hyphens (-) instead for consistency with character encoding. The only exception is when used inbetween dates, such as e.g. 2023—2024.
- **Consistency**: Maintain consistent terminology and spelling across all content files

### Markdown Linting Standards

All markdown files in this project must pass the following linting rules:

- **MD022 (blanks-around-headings)**: All headings (## ### ####) must be surrounded by blank lines
- **MD024 (no-duplicate-heading)**: No duplicate heading text at any level (rename duplicates with descriptive prefixes)
- **MD031 (blanks-around-fences)**: Code blocks must be surrounded by blank lines
- **MD032 (blanks-around-lists)**: All lists (bullet and numbered) must be surrounded by blank lines
- **MD034 (no-bare-urls)**: URLs must be wrapped in angle brackets `<url>` or proper markdown links `[text](url)`
- **MD040 (fenced-code-language)**: Code blocks must specify a language (use `text` for generic content)

## File Management

### Generated Files (Auto-Generated)

The following files are automatically generated during build and excluded from git:

- `public/llms.txt` - Main llms.txt file for AI/LLM consumption
- `public/*.md` - Individual page markdown files (index.html.md, expertise.md, etc.)
- `.llms-cache.json` - Build cache for content-based generation optimization

### Build Artifacts

Always ensure these are properly ignored in git:

- `dist/` - Vite build output (auto-generated)
- `node_modules/` - NPM dependencies
- `.wrangler/` - Wrangler cache and temporary files

## AI/LLM Optimization Features

### llms.txt Implementation

Complete implementation of the [llms.txt specification](https://llmstxt.org/) for optimal AI/LLM consumption:

**Generated Files:**

- `/llms.txt` - Structured overview with site context, GitHub projects, and technical focus areas
- `/index.html.md` - Homepage content in clean markdown format
- `/expertise.md` - Technical skills and experience in markdown
- `/work-experience.md` - Professional background in markdown
- `/education.md` - Educational qualifications in markdown
- `/consultancy.md` - Consulting services and approach in markdown

**Generation System:**

- **Smart Caching**: Only regenerates when React component content actually changes
- **UTF-8 Encoding**: Proper handling of international characters (ö, etc.)
- **Build Integration**: Automatic generation during `npm run build`
- **CI/CD Ready**: GitHub Actions workflow handles generation and deployment

## Cloudflare Workers Configuration

The project uses **wrangler.json** for Cloudflare Workers configuration:

- **Name**: `henriksoderlund-website-v2`
- **Entry Point**: `./src/worker/index.ts` (Hono.js application)
- **Compatibility Date**: `2025-11-19` with Node.js compatibility
- **Assets**: Static files served from `./dist/client` with SPA routing
- **Observability**: Enabled for monitoring and debugging
- **Source Maps**: Uploaded for better error tracking

### Current Configuration Features

- ✅ **Hybrid Routing Architecture**: `run_worker_first: ["/"]` forces homepage through worker code for crawler detection
- ✅ **Source Maps**: Enabled for production debugging
- ✅ **Node.js Compatibility**: For modern JavaScript features
- ✅ **Observability**: Real-time monitoring and logs
- ✅ **Intelligent Asset Serving**: Static assets served optimally while preserving worker routing for critical paths

### Deployment

**IMPORTANT**: Deployment is handled automatically via GitHub Actions. DO NOT use `npm run deploy` directly.

**Production Deployment Process:**

1. **Push to main branch** - Triggers GitHub Actions workflow
2. **Automated CI/CD Pipeline**: Build, lint, verify artifacts, deploy to Cloudflare Workers
3. **Live Site**: Available at `https://www.henriksoderlund.com/`

**Development/Testing Only:**

- `npm run build` - Local build for testing
- `npm run preview` - Local preview of production build
- `npm run deploy` - Manual deploy (only for development/testing, not production)

## AI Collaboration Strategy for Complex Debugging

### Using Gemini CLI for Second Opinion Analysis

When facing complex technical issues that require deep analysis, Claude Code can collaborate with Google's Gemini AI for alternative perspectives. This strategy proved highly effective for debugging crawler detection issues.

**Command to use:**

```bash
gemini -p "YOUR_DETAILED_ANALYSIS_REQUEST"
```

**Best Practices for AI Collaboration:**

1. **Provide comprehensive context**: Include error symptoms, what works vs what doesn't, code snippets, and debugging attempts
2. **Request "ULTRATHINK" analysis**: Ask for deep analysis of potential root causes
3. **Compare approaches**: Different AI models may identify issues the other missed
4. **Cross-validate solutions**: Use insights from one AI to improve solutions from another

**Example successful collaboration:**

- **Issue**: Homepage crawler detection failing while other pages worked
- **Gemini's insight**: Identified unreliable User-Agent string matching as root cause
- **Solution**: Recommended Cloudflare's native `botManagement.verifiedBot` detection
- **Result**: More robust crawler detection implementation

This collaborative approach is particularly valuable for:

- Complex routing and middleware issues
- Cross-platform compatibility problems
- Performance optimization challenges
- Security implementation reviews

## Critical Debugging Learnings (August 2025)

### Cloudflare Workers Assets vs Worker Routing

**CRITICAL ISSUE PATTERN**: When using Cloudflare Workers with assets, static files served from the assets directory bypass worker code entirely. This creates SEO and crawler content issues.

**The Problem:**

- `wrangler.json` with basic `assets.directory: "./dist/client"` serves ALL files statically
- Homepage (`/`) requests get `index.html` served directly from assets, never reaching worker code
- This bypasses crawler detection, server-side content generation, and SEO metadata injection
- Result: Crawlers get empty React shell instead of proper content

**The Solution:**
Use `run_worker_first` in `wrangler.json` to force specific routes through worker code:

```json
{
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist/client",
    "run_worker_first": ["/"]
  }
}
```

**Key Learning**: Always test crawler behavior separately from regular user experience when implementing hybrid serving models.

### SEO Metadata for Crawler HTML Generation

**CRITICAL REQUIREMENT**: When generating custom HTML for crawlers, include COMPLETE SEO metadata, not just basic tags.

**Required Elements for Full SEO:**

- ✅ Complete Open Graph tags (11+ tags including image metadata)
- ✅ Full Twitter Card metadata (8+ tags)
- ✅ Site verification tags (Google, Ahrefs)
- ✅ ALL JSON-LD structured data schemas (Person, ProfessionalService, WebSite)
- ✅ Favicon, canonical links, proper meta descriptions
- ✅ Analytics tracking (noscript fallbacks)

**Implementation Pattern:**
Create a comprehensive `generateSEOMetadata()` function that extracts all metadata from the original static HTML and applies it to crawler-generated HTML.

**Testing Strategy:**

- Test crawlers: `curl -H "User-Agent: Googlebot/2.1" URL`
- Count SEO tags: `curl -H "User-Agent: Googlebot/2.1" URL | grep -c "og:"`
- Verify content: `curl -H "User-Agent: Googlebot/2.1" URL | grep "<h1>"`
- Test regular users: `curl URL` (should get React SPA)

### Character Encoding in Generated Files

**ISSUE**: International characters (ö, em dashes, smart quotes) cause encoding problems in generated text files.

**Solution**: Apply comprehensive character replacement across ALL generated files:

- Create centralized `removeEmojis()` function in `jsx-to-markdown.js`
- Export and reuse across all generation scripts (`generate-llms-txt.js`, etc.)
- Key replacements: `ö → oe`, `" → "`, `— → -`, remove emojis
- Apply to ALL text content: titles, descriptions, project data

**Testing**: Verify `llms.txt` and `.md` files have consistent character encoding.

### 🚨 CRITICAL OPERATIONAL SAFETY RULE (August 2025)

⚠️ NEVER DELETE INFRASTRUCTURE FILES DURING "CLEANUP" OPERATIONS

**The Emergency**: On August 25, 2025, a "cleanup" commit accidentally deleted the essential `index.html` file, causing complete website failure with all pages returning 404 errors.

**Critical Files That Must NEVER Be Deleted:**

- ✅ **`index.html`** - Essential HTML template for Vite build process (305+ lines of SEO metadata, structured data, analytics)
- ✅ **`wrangler.json`** - Cloudflare Workers deployment configuration
- ✅ **`package.json`** - Node.js dependencies and build scripts
- ✅ **`vite.config.ts`** - Vite build configuration
- ✅ **`src/worker/index.ts`** - Cloudflare Worker entry point
- ✅ **`src/react-app/main.tsx`** - React application entry point
- ✅ **`.github/workflows/`** - CI/CD deployment pipelines

**Safe Cleanup Protocol:**

1. **BEFORE any cleanup commit**: Run `npm run check` to verify build still works
2. **NEVER delete files** without explicit user approval for each file
3. **Use git status extensively** to review what will be deleted
4. **Focus cleanup on**: Documentation files, debug logs, temporary files only
5. **Test immediately after cleanup**: Verify website still functions

**Recovery Lessons:**

- The missing `index.html` caused Vite to fail generating client assets
- GitHub Actions deployments appeared "successful" but deployed broken workers
- All SEO metadata, structured data, and analytics integration was lost
- Complete site restoration required recreating 305+ lines of critical HTML

**Prevention:** When in doubt about deleting ANY file, ask the user first. Website availability is more important than clean repositories.

## Project Health Status

**Current Status: Excellent** (as of November 2025)

- ✅ **Zero Technical Debt**: All builds pass successfully with no errors
- ✅ **Modern Dependencies**: All packages updated to latest stable versions (November 2025)
- ✅ **Clean Codebase**: Zero ESLint errors or warnings across all files
- ✅ **Type Safety**: Perfect TypeScript compilation with no type errors
- ✅ **Security**: Zero vulnerabilities in dependency chain
- ✅ **Performance**: Optimal build output with proper minification and code splitting
- ✅ **SEO Ready**: Complete SEO metadata implementation with crawler detection
- ✅ **Production Ready**: Deployed and running smoothly on Cloudflare Workers
- ✅ **Latest Runtime**: Node.js 24 LTS for enhanced performance

**Development Experience:**

- Fast HMR during development
- Comprehensive linting and type checking
- Automated build validation with `npm run check`
- Smart content generation with caching
- Node.js 24 LTS with V8 13.6 engine improvements

## Recent Technical Improvements

### Dependency Upgrades & Node.js 24 Migration (November 2025)

- ✅ **Node.js 24 LTS Upgrade**: Successfully upgraded from Node.js 20 to 24 LTS
  - V8 engine upgraded to 13.6 for better performance
  - npm upgraded to version 11
  - Created `.nvmrc` file for version management
  - Updated all GitHub Actions workflows to use Node.js 24
- ✅ **GitHub Actions Updates**: All actions updated to latest versions
  - actions/checkout: v4 → v5.0.1
  - actions/setup-node: v4 → v6.0.0
  - cloudflare/wrangler-action: v3 → v3.14.1
- ✅ **Dependency Updates**: All npm packages updated to latest stable versions
  - React: 19.1.1 → 19.2.0
  - Vite: 7.1.3 → 7.2.2
  - Hono: 4.9.4 → 4.10.6
  - Wrangler: 4.32.0 → 4.49.0
  - ESLint: 9.34.0 → 9.39.1
  - React Router: 7.8.2 → 7.9.6
  - TypeScript ESLint: 8.40.0 → 8.47.0
  - All @types/* and @cloudflare/* packages updated
- ✅ **Security**: Fixed js-yaml vulnerability, zero vulnerabilities in dependency chain
- ✅ **Cloudflare Compatibility**: Updated compatibility_date from 2025-08-03 to 2025-11-19
- ✅ **Build Verification**: All builds passing with improved performance

### Homepage Crawler Content Resolution (August 2025)

- ✅ **Critical Fix**: Resolved missing H1 and content for search engine crawlers on homepage
- ✅ **Assets Routing**: Implemented `run_worker_first: ["/"]` in wrangler.json to force homepage through worker
- ✅ **Comprehensive SEO Restoration**: Added complete Open Graph, Twitter Cards, and structured data to crawler HTML
- ✅ **Hybrid Architecture Validation**: Verified crawlers get server-rendered content while users get React SPA
- ✅ **Character Encoding**: Applied consistent UTF-8 character replacement across all generated files

### SEO & IndexNow Implementation (August 2025)

- ✅ **Search Engine Optimization**:
  - Fixed Open Graph URL not matching canonical URLs across all pages
  - Added dynamic canonical link tags with proper URL generation
  - Enhanced crawler content with proper H1 tags for SEO visibility
  - Added alt attribute to Fathom Analytics noscript tracking pixel
- ✅ **IndexNow Protocol Support**:
  - Complete IndexNow implementation with API key validation
  - Three endpoints: single URL, bulk submission, and automatic submission
  - Submits to Bing, Yandex, and IndexNow API for instant search engine indexing
  - API key validation file hosted at `/b17bc1cea33c...txt`
- ✅ **Content Generation Improvements**:
  - Enhanced character replacement to handle em dashes, smart quotes, and emojis
  - Fixed content change detection to track correct files (Expertise.tsx, data files)
  - Improved markdown generation with better UTF-8 support

### Code Quality & Architecture

- ✅ **Modernization**:
  - Centralized hardcoded data into `src/react-app/data/` directory
  - Removed unused components
  - Modernized component typing by removing `React.FC`
  - Optimized React imports
  - Enhanced SEO meta tags and structured data
  - Dependencies continuously updated to latest versions
