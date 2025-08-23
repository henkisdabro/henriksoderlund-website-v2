# CLAUDE.md - Project Context for Claude Code

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Henrik Söderlund's personal website being rebuilt with modern technologies.

**Production Site**: `https://www.henriksoderlund.com/`
**Deployment**: Automatic via GitHub Actions on push to main branch

## Tech Stack

- **Frontend**: React 19.1.1 with TypeScript 5.9.2, built with Vite 7.1.2
- **Backend**: Hono.js 4.9.1 (modern web framework)
- **Deployment**: Cloudflare Workers with observability enabled
- **Routing**: React Router 7.8.0 for client-side routing
- **Development**: ESLint 9.33.0, Wrangler 4.29.0

## Architecture

### Frontend (React SPA)

- **Location**: `src/react-app/`
- **Entry point**: `src/react-app/main.tsx`
- **Main component**: `src/react-app/App.tsx`
- **Routing**: React Router for client-side navigation
- **Pages**: Home, Expertise, Work Experience, Education, Consultation
- Built with Vite for fast development and optimized builds
- Uses React 19 with TypeScript

### Backend (Cloudflare Worker)

- **Location**: `src/worker/index.ts`
- Built with Hono framework for lightweight API routes
- Runs on Cloudflare Workers runtime
- **Dual serving model**:
  - Regular users get React SPA with client-side routing
  - Crawlers get server-side rendered content for SEO
- **IndexNow support**: Complete implementation for instant search engine indexing

### Project Structure

```text
src/
├── react-app/           # React frontend application
│   ├── components/      # React components (Home, Expertise, etc.)
│   ├── data/           # Centralized data files (consultation.ts, expertise.ts, workExperience.ts)
│   ├── assets/         # Static assets (SVG logos, flags)
│   ├── App.tsx         # Main App component with routing
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
- `npm run build` - Build for production (includes smart llms.txt generation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run check` - Full check: TypeScript compilation, build, and dry-run deploy
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate Cloudflare Workers types
- `npm run generate-llms` - Force regenerate llms.txt and markdown files
- `npm run generate-llms-if-needed` - Smart generation (only if content changed)

**Note**: No test framework is currently configured. Tests can be added using Vitest or Jest if needed.

## Development Workflow

1. Run `npm run dev` for local development with HMR at <http://localhost:5173>
2. Navigate between pages using React Router (/, /expertise, /work-experience, /education, /consultation)
3. Content is served entirely from React components (no markdown processing)
4. Static assets are served from `/public/` directory
5. Use `npm run check` before deployment to validate build
6. Deploy with `npm run deploy` when ready for production

## Content Management

- **Page content**: Stored directly in React components in `src/react-app/components/`
- **Data files**: Centralized in `src/react-app/data/` (consultation.ts, expertise.ts, workExperience.ts)
- **Images**: Located in `src/react-app/assets/images/` directory
- **Static files**: SEO verification files in `/public/` root and `/.well-known/`
- **Styling**: All styles in `src/react-app/App.css` with component-specific classes

## Key Dependencies

- **Runtime**: React 19.1.1, Hono 4.9.1, React Router DOM 7.8.0
- **Build tools**: Vite 7.1.2, TypeScript 5.9.2
- **Deployment**: Wrangler 4.29.0, @cloudflare/vite-plugin
- **Linting**: ESLint 9.33.0 with React hooks and TypeScript support

## Content Standards

### **CRITICAL RULE - Content Preservation**

⚠️ **NEVER modify, change, or "improve" existing copywriting without explicit approval from the user.**

- The homepage copy, About sections, and all marketing content has been carefully crafted and tested
- Technical fixes (SEO, structure, formatting) are allowed, but content changes are NOT
- If copywriting improvements are needed, ASK for permission first and explain exactly what you want to change
- This includes server-side generated content in the Hono worker that mirrors React components

### Writing Style & Language

- **Language**: All content must use British English spelling and conventions
- **Common British spellings**: optimisation (not optimization), specialising (not specializing), organisation (not organization), utilising (not utilizing), realise (not realize), colour (not color), behaviour (not behavior), centre (not center)
- **Voice**: Professional, direct, and technical without being overly formal
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
- **Compatibility Date**: `2025-08-03` with Node.js compatibility
- **Assets**: Static files served from `./dist/client` with SPA routing
- **Observability**: Enabled for monitoring and debugging
- **Source Maps**: Uploaded for better error tracking

### Current Configuration Features

- ✅ **Single Page Application**: Proper SPA routing with `not_found_handling`
- ✅ **Source Maps**: Enabled for production debugging
- ✅ **Node.js Compatibility**: For modern JavaScript features
- ✅ **Observability**: Real-time monitoring and logs
- ✅ **Static Assets**: Optimized asset serving from Vite build output

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
npx https://github.com/google-gemini/gemini-cli --prompt "YOUR_DETAILED_ANALYSIS_REQUEST"
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

## Recent Technical Improvements

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
  - Updated dependencies to latest versions (React 19.1.1, Vite 7.1.2, Hono 4.9.1)