# Henrik Söderlund - Personal Website

[![Vite](https://img.shields.io/badge/vite-7.1.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/react-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/hono-4.9.1-FF6B00?style=flat&logo=hono&logoColor=white)](https://hono.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/cloudflare%20workers-deployed-F38020?style=flat&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![ESLint](https://img.shields.io/badge/eslint-9.33.0-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)

Henrik Söderlund's personal website built with modern web technologies and deployed on Cloudflare Workers.

## Tech Stack

- [**React**](https://react.dev/) - Modern UI library with TypeScript
- [**Vite**](https://vite.dev/) - Lightning-fast build tooling and development server  
- [**Hono**](https://hono.dev/) - Ultralight backend framework for Cloudflare Workers
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform for global deployment

## Project Status

✅ **Migration Complete**: Successfully migrated from Thulite/Hugo to Vite + React + Hono stack  
✅ **Main Branch**: Development moved to main branch (site-rebuild-vite merged)  
✅ **Content Migration**: All content migrated from old Markdown structure to React components  
✅ **Production Ready**: Site deployed and live on Cloudflare Workers

## Project Structure

```
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

## Key Features

- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript support out of the box
- 🛠️ ESLint configuration included
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing
- 🔄 Full-stack development setup
- 🧭 Fixed navigation box with dynamic heading detection
- 📱 Mobile-responsive design
- 🤖 AI-optimized content with llms.txt specification compliance
- 📊 Centralized data architecture for maintainable content
- ✨ Modern React patterns (optimized imports, clean component structure)

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
- **wrangler.json** - Cloudflare Workers deployment configuration
- **tsconfig.*.json** - TypeScript configurations for app, worker, and Node.js
- **eslint.config.js** - ESLint configuration for code quality

### Page Components
- **Home.tsx** - Homepage with technology leadership introduction and AI-focused messaging
- **Expertise.tsx** - Expertise page (accessible at `/expertise`) showcasing technical leadership and AI capabilities
- **WorkExperience.tsx** - Professional experience and achievements (data-driven from `data/workExperience.ts`)
- **Education.tsx** - Educational background
- **Consultation.tsx** - Services and consultation offerings (data-driven from `data/consultation.ts`)

### Data Architecture
- **data/consultation.ts** - Centralized consultation services and pricing data
- **data/expertise.ts** - Technical skills, platforms, and GitHub contributions data
- **data/workExperience.ts** - Professional experience and achievements data

### Verification & Redirects
- **public/_redirects** - Cloudflare Workers redirect rules (`/skills` → `/expertise`)
- **public/ahrefs_bc08e3a49...** - Ahrefs SEO verification
- **public/google52d2217b...** - Google Search Console verification

## Future Tasks and Site Improvements

### Analytics & Tracking
- [ ] Add Google Tag Manager (GTM) to header with support for dev environments
- [x] Confirm Ahrefs and Google Search Console verification files

### SEO & Site Configuration
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
- [ ] Revise and improve security.txt  
- [ ] Add CORS and CSP headers

### Content & Visual Updates
- [ ] Update content and project screenshots
- [x] Centralized data architecture for maintainable content

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
