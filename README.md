# Henrik Söderlund - Personal Website

[![Vite](https://img.shields.io/badge/vite-7.1.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/react-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/hono-4.9.4-FF6B00?style=flat&logo=hono&logoColor=white)](https://hono.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/cloudflare%20workers-deployed-F38020?style=flat&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![ESLint](https://img.shields.io/badge/eslint-9.34.0-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)

Henrik Söderlund's professional portfolio website showcasing technology leadership and AI innovation expertise. Built with modern web technologies and deployed globally on Cloudflare Workers.

## Tech Stack

- [**React 19.1.1**](https://react.dev/) - Modern UI library with TypeScript 5.9.2, optimized imports and clean component structure
- [**Vite 7.1.3**](https://vite.dev/) - Lightning-fast build tooling and development server with HMR
- [**Hono 4.9.4**](https://hono.dev/) - Ultralight backend framework for Cloudflare Workers with elegant API routing
- [**React Router 7.8.2**](https://reactrouter.com/) - Client-side routing with dynamic navigation detection
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform with global deployment and observability
- [**ESLint 9.34.0**](https://eslint.org/) - Code quality and consistency with TypeScript support

## Project Status

✅ **Migration Complete**: Successfully migrated from Thulite/Hugo to Vite + React + Hono stack  
✅ **Main Branch**: Development moved to main branch (site-rebuild-vite merged)  
✅ **Content Migration**: All content migrated from old Markdown structure to React components  
✅ **Production Ready**: Site deployed and live on Cloudflare Workers

### Project Health: Excellent ⭐

- **Zero Technical Debt**: All builds pass with no errors or warnings
- **Modern Stack**: Latest stable versions of all dependencies
- **Clean Code**: Zero ESLint issues and perfect TypeScript compilation
- **Performance Optimized**: Fast builds, efficient bundle sizes
- **SEO Complete**: Full crawler detection and metadata implementation

## Project Structure

```
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

## Key Features

### Development Experience
- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript 5.9.2 support with perfect compilation
- 🛠️ ESLint 9.34.0 configuration with zero errors/warnings
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing system
- 🔄 Full-stack development setup with unified tooling

### User Experience
- 🧭 Fixed navigation box (200px width) with dynamic heading detection and smooth scrolling
- 📱 Mobile-responsive design (navigation hidden on <1024px screens)
- ✨ Modern React 19 patterns with optimized imports and clean component structure
- 🎨 Clean minimal design with standardized tech logos (20px) and consistent hover states

### Architecture & Performance
- 📊 **Centralized Data Architecture**: Structured data files for maintainable content management
- 🕷️ **Hybrid Serving Model**: React SPA for users, server-rendered HTML for search engine crawlers
- 🤖 **Intelligent Crawler Detection**: Cloudflare's native `botManagement.verifiedBot` for reliable bot detection
- ⚡ **Worker-First Routing**: Homepage forced through worker code via `run_worker_first: ["/"]` configuration

### SEO & AI Optimization
- 🌐 **Complete SEO Implementation**: Open Graph (11+ tags), Twitter Cards (8+ tags), JSON-LD structured data
- 🔍 **IndexNow Protocol**: Instant search engine indexing with API key validation and bulk submission
- 🤖 **AI-Optimized Content**: Full llms.txt specification compliance with smart caching
- 📄 **Auto-Generated Markdown**: Individual page markdown files for optimal AI/LLM consumption

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

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npm run deploy
```

Monitor your workers:

```bash
npx wrangler tail
```

## Design System

- Clean, minimal design with proper typography
- Fixed navigation box (200px width) on left side with grey hover states
- Mobile-responsive (navigation hidden on <1024px)
- Tech stack logos standardized to 20px in footer
- Dynamic heading detection and smooth scroll navigation

## Configuration Files

### Build & Development
- **vite.config.ts** - Vite configuration with React and Cloudflare plugins
- **wrangler.json** - Cloudflare Workers deployment configuration with `run_worker_first: ["/"]` for homepage routing
- **tsconfig.*.json** - TypeScript configurations for app, worker, and Node.js
- **eslint.config.js** - ESLint configuration for code quality

### Page Components
- **Home.tsx** - Homepage with technology leadership introduction and AI-focused messaging
- **Expertise.tsx** - Expertise page (accessible at `/expertise`) showcasing technical leadership and AI capabilities
- **WorkExperience.tsx** - Professional experience and achievements (data-driven from `data/workExperience.ts`)
- **Education.tsx** - Educational background
- **Consultation.tsx** - Services and consultation offerings (data-driven from `data/consultation.ts`)

### Data Architecture

The project uses a centralized data architecture pattern for maintainable content:

- **data/consultation.ts** - Service offerings, pricing tiers, and consultation methodology
- **data/expertise.ts** - Technical skills categorization, platform expertise, and GitHub project showcase
- **data/workExperience.ts** - Structured professional experience with achievements and technologies

This separation enables:
- Clean component-data separation
- Easy content updates without touching presentation logic
- Type-safe data structures with TypeScript
- Consistent data formatting across components

### Verification & Redirects
- **public/_redirects** - Cloudflare Workers redirect rules (`/skills` → `/expertise`)
- **public/ahrefs_bc08e3a49...** - Ahrefs SEO verification
- **public/google52d2217b...** - Google Search Console verification

## Future Tasks and Site Improvements

### Recent Technical Improvements (August 2025)

**✅ Crawler Detection & SEO Optimization**
- [x] **Fixed Homepage Crawler Content Issue**: Resolved missing H1 and content for search engine crawlers
- [x] **Assets Routing Configuration**: Implemented `run_worker_first: ["/"]` to ensure homepage goes through worker code
- [x] **Comprehensive SEO Metadata**: Restored complete Open Graph, Twitter Cards, and structured data for crawlers
- [x] **Character Encoding Fix**: Applied consistent UTF-8 character replacement across llms.txt and markdown generation
- [x] **Hybrid Serving Architecture**: Crawlers get server-rendered content, users get React SPA

**✅ Analytics & Tracking**
- [x] Google Tag Manager (GTM) integration with development environment support
- [x] Comprehensive dataLayer implementation for client-side and server-side metrics
- [x] Ahrefs and Google Search Console verification files confirmed
- [x] Fathom Analytics noscript tracking pixel with proper alt attribute
- [ ] **Outstanding Issue**: Cloudflare Variables Injection - CF placeholders (%CF_COUNTRY%, %CF_COLO%, %CF_RAY%) not being replaced with actual values in dataLayer

**✅ SEO & Site Configuration**
- [x] Enhanced meta description and social media tags (Open Graph, Twitter cards)
- [x] Improved page titles and descriptions
- [x] **Comprehensive Structured Data Implementation**:
  - Person schema with detailed professional information
  - Professional service schema with pricing and contact info
  - Website schema with search functionality
  - Skills, awards, education, and affiliations metadata
- [x] **Brand Positioning Refinement**:
  - Updated from "Digital Strategy & Tech Executive" to "Technology Leader & AI Innovator"
  - Consistent positioning across all meta tags, social media cards, and structured data
- [x] robots.txt with AI assistant messaging
- [x] **IndexNow Protocol Implementation**: Complete API with key validation and bulk submission support
- [ ] Revise and improve security.txt  
- [x] Enhanced CORS and CSP headers with comprehensive security policies

**✅ Content & Architecture**
- [x] Centralized data architecture for maintainable content
- [x] **Character Encoding Fixes**: Proper ö → oe replacement across all generated files
- [x] **Enhanced llms.txt Generation**: Smart caching and comprehensive AI/LLM optimization

## File Management

### Legacy Files (Can be ignored/removed)
- `content/` - Old Markdown content files (migrated to React components)
- `assets/` - Old Hugo assets (duplicated in `public/`)

### Generated Files (Auto-Generated)
- `public/llms.txt` - Main llms.txt file for AI/LLM consumption
- `public/*.md` - Individual page markdown files (index.html.md, expertise.md, etc.)
- `.llms-cache.json` - Build cache for content-based generation optimization

### Build Artifacts (Auto-generated)
- `dist/` - Vite build output
- `node_modules/` - NPM dependencies  
- `.wrangler/` - Wrangler cache and temporary files

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
