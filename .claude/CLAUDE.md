# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Henrik Söderlund's personal website, migrated from Hugo to a modern React + Vite + Hono + Cloudflare Workers stack. It's a professional portfolio showcasing Henrik's expertise in digital media, AdTech, and analytics consulting.

## Architecture

### Frontend (React SPA)
- **Location**: `src/react-app/`
- **Entry point**: `src/react-app/main.tsx`
- **Main component**: `src/react-app/App.tsx`
- **Routing**: React Router for client-side navigation
- **Pages**: Home, Skills, Work Experience, Education, Consultation
- Built with Vite for fast development and optimized builds
- Uses React 19 with TypeScript

### Page Components
- **Location**: `src/react-app/components/`
- **Home**: Professional introduction with navigation to other sections
- **Skills**: Comprehensive technical skills, advertising platforms, GitHub contributions
- **Work Experience**: Professional history in reverse chronological order
- **Education**: Academic background (Tertiary, Secondary, Primary)
- **Consultation**: Services, pricing table, booking information
- **Navigation**: Shared component for bottom navigation across pages

### Backend (Cloudflare Worker)
- **Location**: `src/worker/index.ts`
- Built with Hono framework for lightweight API routes
- Runs on Cloudflare Workers runtime
- Serves API endpoints at `/api/*` routes

### Static Assets
- **Profile images**: `/images/henrik.png`, `/images/henrik_profile_beard-modified_small.png`
- **Dashboard screenshots**: `/images/screely-*.png` (from Skills page)
- **Verification files**: `/google52d2217b2a4bc22f.html`, `/ahrefs_*`, `/.well-known/security.txt`

### Build System
- **Frontend build**: Vite compiles React SPA to `dist/client/`
- **Worker build**: TypeScript compiles worker to run on Cloudflare edge
- **Deployment**: Wrangler handles deployment to Cloudflare Workers
- **Assets**: Static assets served from `dist/client/` via Cloudflare Workers

## Common Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run cf-typegen   # Generate Cloudflare Worker types
```

### Build and Test
```bash
npm run build        # Build both frontend and worker for production
npm run check        # Full check: TypeScript + build + dry-run deploy
npm run lint         # Run ESLint on all files
```

### Deployment
```bash
npm run preview      # Preview production build locally
npm run deploy       # Deploy to Cloudflare Workers
npx wrangler tail    # Monitor deployed worker logs
```

## Configuration Files

- **wrangler.json**: Cloudflare Workers configuration, defines worker name and build settings
- **vite.config.ts**: Vite build configuration with React and Cloudflare plugins
- **tsconfig.json**: Root TypeScript config that references app, node, and worker configs
- **eslint.config.js**: ESLint configuration with React and TypeScript rules

## Development Workflow

1. Run `npm run dev` for local development with HMR at http://localhost:5173
2. Navigate between pages using React Router (/, /skills, /work-experience, /education, /consultation)
3. Content is served entirely from React components (no markdown processing)
4. Static assets are served from `/public/` directory
5. Use `npm run check` before deployment to validate build
6. Deploy with `npm run deploy` when ready for production

## Content Management

- **Page content**: Stored directly in React components in `src/react-app/components/`
- **Images**: Located in `/public/images/` directory
- **Static files**: SEO verification files in `/public/` root and `/.well-known/`
- **Styling**: All styles in `src/react-app/App.css` with component-specific classes

## Key Dependencies

- **Runtime**: React 19, Hono 4.8.2, React Router DOM 7.8.0
- **Build tools**: Vite 6.0, TypeScript 5.8.3
- **Deployment**: Wrangler 4.28.1, @cloudflare/vite-plugin
- **Linting**: ESLint 9.27.0 with React hooks and TypeScript support

## Content Structure (Migrated from Hugo)

- **Home**: Henrik's professional introduction and summary
- **Skills**: Technical expertise organized by categories (Advertising, Measurement, SEO, etc.)
- **Work Experience**: Professional history from 2006-present
- **Education**: Academic background in Sweden
- **Consultation**: Services offered with pricing table and booking information