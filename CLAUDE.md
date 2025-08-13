# CLAUDE.md - Project Context for Claude Code

## Project Overview
This is Henrik Söderlund's personal website being rebuilt with modern technologies.

## Tech Stack
- **Frontend**: React with TypeScript, built with Vite
- **Backend**: Hono.js (modern web framework)
- **Deployment**: Cloudflare Workers
- **Routing**: React Router for client-side routing

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
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run check` - TypeScript check, build, and dry-run deploy
- `npm run deploy` - Deploy to Cloudflare Workers

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

### Wrangler Configuration
The project uses **wrangler.json** (not wrangler.toml) for configuration:
- **Purpose**: Used by both local development AND Cloudflare Workers deployment
- **GitHub Integration**: When you push to GitHub, Cloudflare Workers uses this file to understand how to build and deploy your app
- **Build Process**: The `wrangler.json` tells Workers which files to include, build commands, and routing rules

### Key Wrangler Settings Needed:
1. **Entry Point**: Defines the main server file (usually Hono app)
2. **Build Commands**: How to compile TypeScript and bundle assets
3. **Route Configuration**: URL patterns and handling
4. **Environment Variables**: Any secrets or config needed

### Deployment Flow:
1. Push code to GitHub
2. Cloudflare Workers detects changes via GitHub integration
3. Workers reads `wrangler.json` for build instructions
4. Automatically builds and deploys the app
5. Your site goes live on Cloudflare's edge network

The wrangler file is ESSENTIAL for both local dev and production deployment.

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
- ✅ **Updated .gitignore**: Added modern Vite/React/Cloudflare Workers patterns
- ✅ **Build Optimization**: Proper exclusion of build artifacts from version control
- ✅ **Legacy Cleanup**: Identified old Hugo/Thulite files for removal
- ✅ **Development Environment**: Complete VS Code workspace configuration