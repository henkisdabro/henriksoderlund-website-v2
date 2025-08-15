# CLAUDE.md - Project Context for Claude Code

## Project Overview
This is Henrik Söderlund's personal website being rebuilt with modern technologies.

## Tech Stack
- **Frontend**: React 19.1.1 with TypeScript 5.9.2, built with Vite 7.1.2
- **Backend**: Hono.js 4.9.1 (modern web framework)
- **Deployment**: Cloudflare Workers with observability enabled
- **Routing**: React Router 7.8.0 for client-side routing
- **Development**: ESLint 9.33.0, Wrangler 4.29.0

## Current Status
- ✅ **Migration Complete**: Successfully migrated from Thulite/Hugo to Vite + React + Hono stack
- ✅ **Main Branch**: Development moved to main branch (site-rebuild-vite merged)
- ✅ **Content Migration**: All content migrated from old Markdown structure to React components
- ✅ **Production Ready**: Site deployed and live on Cloudflare Workers

## Project Structure
```
src/
├── react-app/           # React frontend application
│   ├── components/      # React components (Home, Skills, etc.)
│   ├── assets/         # Static assets (SVG logos, flags)
│   ├── App.tsx         # Main App component with routing
│   ├── main.tsx        # React entry point
│   └── index.css       # Global styles
├── worker/             # Cloudflare Workers backend (Hono.js)
│   └── index.ts        # Worker entry point
public/                 # Static assets served directly
├── images/             # Profile photos and screenshots
└── vite.svg           # Vite logo
```

## Key Components
- **App.tsx**: Main application with routing setup
- **NavigationBox.tsx**: Fixed navigation menu with page and heading links
- **Home.tsx**: Homepage component with hero section and navigation
- **Footer.tsx**: Footer with tech stack logos (Vite, Hono, Cloudflare Workers)

## Development Commands
- `npm run dev` - Start development server (Vite dev server on port 5173)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run check` - Full check: TypeScript compilation, build, and dry-run deploy
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate Cloudflare Workers types

**Note**: No test framework is currently configured. Tests can be added using Vitest or Jest if needed.

## Design System & Recent Fixes
- Clean, minimal design with proper typography
- **Layout**: App content horizontally centered using flexbox on body element
- **Navigation**: Fixed navigation box (200px width) on left side with grey hover states
- **Navigation Styling**: 
  - Hover color: #f5f5f5 (fresh grey, no blue)
  - Button borders: 0.5px for subtle appearance
  - No rounded borders on hover/focus states
  - Section headings "Pages" and "On This Page" visible but filtered from dynamic menu items
- **Footer**: Tech stack logos standardized to 20px with proper alignment
- **Responsive**: Navigation hidden on mobile (<1024px)
- **Text Alignment**: Content is left-aligned, only containers are centered

## Navigation Box Features
- Dynamic heading detection and navigation
- Collapsible with expand/collapse button
- Filters out headings named "Pages", "On This Page", "Navigation" from dynamic list
- Smooth scroll to headings on click

## Cloudflare Workers Configuration

### Wrangler Configuration (wrangler.json)
The project uses **wrangler.json** for Cloudflare Workers configuration:
- **Name**: `henriksoderlund-website-v2`
- **Entry Point**: `./src/worker/index.ts` (Hono.js application)
- **Compatibility Date**: `2025-08-03` with Node.js compatibility
- **Assets**: Static files served from `./dist/client` with SPA routing
- **Observability**: Enabled for monitoring and debugging
- **Source Maps**: Uploaded for better error tracking

### Current Configuration Features:
- ✅ **Single Page Application**: Proper SPA routing with `not_found_handling`
- ✅ **Source Maps**: Enabled for production debugging
- ✅ **Node.js Compatibility**: For modern JavaScript features
- ✅ **Observability**: Real-time monitoring and logs
- ✅ **Static Assets**: Optimized asset serving from Vite build output

### Deployment Flow:
1. `npm run build` - TypeScript compilation + Vite build to `dist/`
2. `npm run deploy` - Wrangler deploys worker + static assets
3. Cloudflare Workers serves app globally from edge locations
4. Static assets cached and served efficiently

## Development Environment

### Primary Development Setup
- **Platform**: Windows 11
- **Editor**: VS Code with comprehensive workspace configuration
- **Terminal**: PowerShell (default)
- **AI Assistant**: Claude Code (native VS Code extension)

### VS Code Configuration
The project includes a complete `.vscode/` workspace configuration:

#### Extensions (`.vscode/extensions.json`)
**Core Development:**
- TypeScript, ESLint, Prettier, TailwindCSS
- React snippets and auto-rename-tag
- Vite and Vitest extensions
- Cloudflare Workers official extension
- Claude Code extension (`anthropic.claude-dev`)

**Productivity:**
- GitLens, Error Lens, Path IntelliSense
- Spell checker with project-specific words
- Auto-formatting and import organization

#### Workspace Settings (`.vscode/settings.json`)
- **Auto-formatting**: Format on save/paste with Prettier
- **Code quality**: ESLint auto-fix and import organization on save
- **TypeScript**: Optimized for React development with auto-imports
- **File management**: Hide build artifacts, enable auto-save
- **Claude Code**: Configured with safe defaults for AI assistance

#### Debug Configuration (`.vscode/launch.json`)
- **"Launch Vite Dev Server"**: Debug Vite development server
- **"Debug Wrangler Dev"**: Debug Cloudflare Workers locally
- **"Launch via NPM Script"**: Alternative launcher using npm scripts
- **Windows-compatible**: Uses direct .js file paths instead of shell scripts

#### Tasks (`.vscode/tasks.json`)
- Build, lint, and typecheck tasks
- Wrangler deployment and development tasks
- Integrated with VS Code's task runner

### Development Workflow
1. Open project in VS Code
2. Install recommended extensions when prompted
3. Use `Ctrl+Shift+P` → "Tasks: Run Task" for common operations
4. Use debugger (F5) to launch development servers with breakpoint support
5. Claude Code extension available for AI-assisted development

### Windows-Specific Notes
- Debug configurations use direct JavaScript file paths for cross-platform compatibility
- PowerShell terminal configured as default
- CRLF line endings handled automatically by Git
- All paths use forward slashes for consistency

## File Management & Cleanup

### Legacy Files
The following directories are legacy from the old Hugo/Thulite setup and should be ignored:
- `content/` - Old Markdown content files (migrated to React components)
- `assets/` - Old Hugo assets (duplicated in `public/`)

### Build Artifacts
Always ensure these are properly ignored in git:
- `dist/` - Vite build output (auto-generated)
- `node_modules/` - NPM dependencies
- `.wrangler/` - Wrangler cache and temporary files

### Project Management
- `TASKS.md` - Optional task tracking (can be ignored if using other tools)
- `CLAUDE.md` - Project context for AI assistance (keep in repo)

## Recent Improvements
- ✅ **Updated Dependencies**: Latest versions of React 19.1.1, Vite 7.1.2, Hono 4.9.1, TypeScript 5.9.2
- ✅ **Updated .gitignore**: Added modern Vite/React/Cloudflare Workers patterns
- ✅ **Build Optimization**: Proper exclusion of build artifacts from version control
- ✅ **Legacy Cleanup**: Identified old Hugo/Thulite files for removal
- ✅ **Development Environment**: Complete VS Code workspace configuration
- ✅ **SEO Setup**: Ahrefs and Google Search Console verification files in place
- ✅ **Wrangler Configuration**: Modern wrangler.json with observability and source maps