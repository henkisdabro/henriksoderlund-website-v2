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

## Current Status
- ✅ **Migration Complete**: Successfully migrated from Thulite/Hugo to Vite + React + Hono stack
- ✅ **Main Branch**: Development moved to main branch (site-rebuild-vite merged)
- ✅ **Content Migration**: All content migrated from old Markdown structure to React components
- ✅ **Production Ready**: Site deployed and live on Cloudflare Workers

## Architecture

### Frontend (React SPA)
- **Location**: `src/react-app/`
- **Entry point**: `src/react-app/main.tsx`
- **Main component**: `src/react-app/App.tsx`
- **Routing**: React Router for client-side navigation
- **Pages**: Home, Expertise, Work Experience, Education, Consultation
- Built with Vite for fast development and optimized builds
- Uses React 19 with TypeScript

### Page Components
- **Location**: `src/react-app/components/`
- **Home**: Professional introduction with navigation to other sections
- **Expertise**: Technical leadership, AI capabilities, and people management skills (renamed from Skills)
- **Work Experience**: Professional history in reverse chronological order
- **Education**: Academic background (Tertiary, Secondary, Primary)
- **Consultation**: Services, pricing table, booking information
- **NavigationBox**: Fixed navigation menu with page and heading links

### Backend (Cloudflare Worker)
- **Location**: `src/worker/index.ts`
- Built with Hono framework for lightweight API routes
- Runs on Cloudflare Workers runtime
- Serves API endpoints at `/api/*` routes
- **Dual serving model**: 
  - Regular users get React SPA with client-side routing
  - Crawlers get server-side rendered content for SEO
- **IndexNow support**: Complete implementation for instant search engine indexing

### Project Structure
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

### Static Assets
- **Profile images**: `src/react-app/assets/images/henrik-profile-small.webp`
- **Dashboard screenshots**: `src/react-app/assets/images/screenshots/*.webp`
- **Verification files**: `public/google52d2217b2a4bc22f.html`, `public/ahrefs_*`
- **SEO files**: `public/.well-known/security.txt`

### Build System
- **Frontend build**: Vite compiles React SPA to `dist/client/`
- **Worker build**: TypeScript compiles worker to run on Cloudflare edge
- **Deployment**: Wrangler handles deployment to Cloudflare Workers
- **Assets**: Static assets served from `dist/client/` via Cloudflare Workers

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

## Configuration Files

- **wrangler.json**: Cloudflare Workers configuration, defines worker name and build settings
- **vite.config.ts**: Vite build configuration with React and Cloudflare plugins
- **tsconfig.json**: Root TypeScript config that references app, node, and worker configs
- **eslint.config.js**: ESLint configuration with React and TypeScript rules

## Development Workflow

1. Run `npm run dev` for local development with HMR at http://localhost:5173
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
**IMPORTANT**: Deployment is handled automatically via GitHub Actions. DO NOT use `npm run deploy` directly.

**Production Deployment Process:**
1. **Push to main branch** - Triggers GitHub Actions workflow
2. **Automated CI/CD Pipeline** (`.github/workflows/deploy.yml`):
   - Install dependencies and run linting
   - Build project (includes llms.txt generation + Vite build to `dist/`)
   - Verify all build artifacts (llms.txt, markdown files, sitemap.xml)
   - Deploy to Cloudflare Workers using stored secrets
3. **Live Site**: Available at `https://www.henriksoderlund.com/`
4. **Static assets** cached and served efficiently from Cloudflare edge

**Development/Testing Only:**
- `npm run build` - Local build for testing
- `npm run preview` - Local preview of production build
- `npm run deploy` - Manual deploy (only for development/testing, not production)

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

## Key Dependencies

- **Runtime**: React 19.1.1, Hono 4.9.1, React Router DOM 7.8.0
- **Build tools**: Vite 7.1.2, TypeScript 5.9.2
- **Deployment**: Wrangler 4.29.0, @cloudflare/vite-plugin
- **Linting**: ESLint 9.33.0 with React hooks and TypeScript support

## File Management & Cleanup

### Generated Files (Auto-Generated)
The following files are automatically generated during build and excluded from git:
- `public/llms.txt` - Main llms.txt file for AI/LLM consumption
- `public/*.md` - Individual page markdown files (index.html.md, expertise.md, etc.)
- `.llms-cache.json` - Build cache for content-based generation optimization

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

## Content Structure (Current Pages)

- **Home**: Henrik's professional introduction and summary with technology leadership focus
- **Expertise**: Technical expertise organized by categories (AI, Leadership, Advertising, Measurement, etc.)
- **Work Experience**: Professional history from 2006-present with leadership achievements
- **Education**: Academic background in Sweden
- **Consultation**: Services offered with pricing table and booking information

## Recent Improvements

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

### Leadership Content Integration (August 2025)
- ✅ **Human Leadership Integration**: 
  - Added comprehensive leadership and people management content across homepage, expertise, and experience sections
  - Created new `leadershipExpertise` section in `expertise.ts` with team building, client service, and strategic communication skills
  - Enhanced work experience descriptions to highlight mentoring, team rebuilding, and stakeholder management achievements
  - Balanced technical expertise with people leadership positioning
- ✅ **Content Structure Enhancement**:
  - Homepage now includes third paragraph focusing on leadership approach and team development
  - Expertise page features dedicated leadership section with three skill categories
  - Work experience entries emphasize concrete leadership outcomes (team retention, promotions, client relationships)

### Project-Wide Modernization (feature/project-improvements)
- ✅ **Code Quality & Architecture**: 
  - Centralized hardcoded data into `src/react-app/data/` directory (consultation.ts, expertise.ts, workExperience.ts)
  - Removed unused `Navigation.tsx` component
  - Modernized component typing by removing `React.FC`
  - Optimized React imports (removed unnecessary imports, kept only required hooks)
  - Cleaned up CSS warnings (removed empty CSS rules)
- ✅ **SEO & Meta Improvements**:
  - Enhanced page title in `index.html`
  - Added comprehensive meta description and social media tags (Open Graph, Twitter cards)
  - Updated `package.json` with descriptive name and description
- ✅ **llms.txt Specification Compliance**:
  - Corrected markdown filename generation per official spec
  - Improved title extraction logic for data-driven components
  - Smart caching system for content-based generation optimization

### Brand Positioning Updates (August 2025)
- ✅ **Position Refinement**: Removed "executive" and "strategy" positioning across all content
  - Updated page titles from "Digital Strategy & Tech Executive" to "Technology Leader & AI Innovator"
  - Changed personal descriptions from "digital strategy executive" to "technology leader"
  - Modified llms.txt positioning from "Digital Strategy Executive" to "Technology Leader & AI Innovator"
  - Updated all meta descriptions, Open Graph, and Twitter Card metadata
- ✅ **Comprehensive SEO Enhancement**:
  - Enhanced structured data (JSON-LD) with comprehensive person and professional service schemas
  - Added detailed skills, awards, education, and professional affiliations in structured data
  - Implemented rich snippets for consulting services with pricing and contact information
  - Updated all social media metadata for consistent positioning across platforms

### Previous Foundation Work
- ✅ **Content Modernization**: Updated Homepage and Expertise page with technology leadership language and AI focus
- ✅ **Page Rebranding**: Renamed "Skills" to "Expertise" with SEO-friendly 301 redirects
- ✅ **AI Integration**: Added AI-related skills and capabilities throughout content
- ✅ **Redirect System**: Cloudflare Workers compatible `_redirects` file for URL changes
- ✅ **Updated Dependencies**: Latest versions of React 19.1.1, Vite 7.1.2, Hono 4.9.1, TypeScript 5.9.2
- ✅ **Updated .gitignore**: Added modern Vite/React/Cloudflare Workers patterns
- ✅ **Build Optimization**: Proper exclusion of build artifacts from version control
- ✅ **Legacy Cleanup**: Identified old Hugo/Thulite files for removal
- ✅ **Development Environment**: Complete VS Code workspace configuration
- ✅ **SEO Setup**: Ahrefs and Google Search Console verification files in place
- ✅ **Wrangler Configuration**: Modern wrangler.json with observability and source maps
- ✅ **AI-Optimized Content**: Complete llms.txt specification implementation for AI/LLM consumption
- ✅ **Automated CI/CD**: GitHub Actions workflow for build, verification, and deployment
- ✅ **Smart Generation**: Content-based caching system for efficient builds

## LinkedIn Profile Development Guidelines

### Overview
These guidelines ensure consistent, effective LinkedIn profile development for Henrik Söderlund, targeting Australian CTO and Head of Analytics positions. All content must reflect Australian market requirements and use British English spelling throughout.

### Target Positioning
- **Primary Role**: Chief Technology Officer (CTO)
- **Secondary Role**: Head of Analytics / Head of Data Science
- **Market Focus**: Australia (salary range AU$180k-$370k for CTO roles)
- **Industry Focus**: Technology, Digital Media, Analytics, AI/ML Leadership

### Core Messaging Framework

#### Essential Value Propositions
1. **Technology Leadership**: Proven ability to architect and lead technology solutions at scale
2. **AI & Automation**: Cutting-edge expertise in AI implementation and intelligent automation
3. **Team Development**: Track record of building, mentoring, and scaling high-performance teams
4. **Business Impact**: Quantifiable results in revenue growth, efficiency improvements, and digital transformation
5. **Cross-functional Excellence**: Bridge between technical teams and executive stakeholders

#### Australian Market Positioning
- Emphasise local market experience (Initiative Perth, KINESSO, Interpublic Group)
- Highlight understanding of Australian business culture and regulatory environment
- Position for both startup agility and enterprise scale
- Reference Australian technology ecosystem and innovation landscape

### Content Structure Guidelines

#### Headlines (220 character limit)
**Format**: `[Role] | [Key Expertise] | [Unique Value] | [Market Focus]`

**Essential Elements**:
- Clear role identification (CTO, Technology Leader, Head of Analytics)
- AI/automation positioning for 2025 market
- Leadership and team development emphasis
- Business impact focus
- Australian market relevance

**Keyword Strategy**:
- Leadership, Technology, AI, Automation, Analytics, Team Building
- Cloud Computing, Digital Transformation, Strategy
- Australia, Perth, Enterprise, Scale

#### About Section (2,600 character limit)

**Structure**:
1. **Opening Hook** (1-2 sentences): Immediate value proposition and current role
2. **Core Expertise** (3-4 sentences): Technical depth with business context
3. **Leadership Philosophy** (2-3 sentences): People development and team building approach
4. **Quantifiable Achievements** (2-3 sentences): Specific results and business impact
5. **Market Positioning** (1-2 sentences): Australian focus and industry recognition
6. **Call to Action** (1 sentence): Clear next step for interested parties

**Writing Guidelines**:
- Use first person implied (avoid "I" where possible)
- Include 2-3 quantifiable metrics
- Balance technical expertise with executive presence
- Emphasise transformation and innovation
- Maintain conversational yet professional tone

#### Experience Descriptions

**Structure per Role**:
1. **Impact Statement** (1-2 sentences): Overall contribution and transformation achieved
2. **Leadership Achievements** (2-3 bullet points): Team development, stakeholder management
3. **Technical Implementation** (2-3 bullet points): Specific solutions and innovations
4. **Business Results** (1-2 bullet points): Quantifiable outcomes and metrics

**Content Guidelines**:
- Lead with business impact, support with technical detail
- Quantify wherever possible (percentages, dollar amounts, team sizes)
- Emphasise leadership progression and increasing responsibility
- Highlight innovation and transformation initiatives
- Use action verbs: architected, transformed, scaled, mentored, optimised

### Australian Market Considerations

#### Cultural Fit Elements
- Collaborative leadership style (Australian workplace culture values)
- Cross-functional communication skills
- Stakeholder management across diverse teams
- Practical, results-oriented approach
- Innovation balanced with commercial pragmatism

#### Industry-Specific Requirements

**For CTO Roles**:
- Cloud computing and infrastructure modernisation
- Cybersecurity and compliance framework knowledge
- Digital transformation leadership
- Product development and technical strategy
- Vendor management and technology partnerships

**For Head of Analytics Roles**:
- AI/ML implementation and governance
- Data strategy and architecture
- Advanced analytics and business intelligence
- Stakeholder education and communication
- Regulatory compliance (Australian data privacy laws)

### Content Review Process

#### Evaluation Criteria (1-10 scale)
1. **Role Alignment**: How well content matches target position requirements
2. **Market Relevance**: Alignment with Australian business environment
3. **Competitive Differentiation**: Unique value vs. other candidates
4. **Executive Presence**: Leadership credibility and strategic thinking
5. **Technical Credibility**: Depth and currency of technical expertise
6. **Communication Clarity**: Accessibility to both technical and business audiences
7. **Quantifiable Impact**: Specific, measurable achievements
8. **Career Progression**: Clear trajectory and increasing responsibility
9. **Cultural Fit**: Alignment with Australian workplace expectations
10. **Call to Action**: Clear next steps for interested parties

#### Review Process
1. **Initial Draft**: Create content following guidelines
2. **Subagent Review**: Submit to specialist CTO and Analytics recruitment experts
3. **Scoring**: Receive detailed feedback and numerical scores
4. **Revision**: Implement feedback and improve based on recommendations
5. **Final Review**: Confirm improved scores before publication
6. **Market Testing**: Monitor engagement and adjust based on results

### Keyword Optimisation

#### Primary Keywords
- Chief Technology Officer, CTO, Technology Leader
- Head of Analytics, Data Science Leader, Analytics Director
- AI, Automation, Machine Learning, Digital Transformation
- Leadership, Team Building, Mentoring, Strategy

#### Secondary Keywords
- Cloud Computing, DevOps, Security, Architecture
- Python, SQL, Analytics, Business Intelligence
- Perth, Australia, KINESSO, Initiative, Enterprise
- Innovation, Scale, Growth, Optimisation

#### Long-tail Keywords
- "AI-driven digital transformation"
- "high-performance technology teams"
- "enterprise analytics strategy"
- "cross-functional leadership Australia"

### Quality Assurance

#### Language Standards
- Exclusive use of British English spelling
- Professional tone appropriate for executive positions
- Industry-standard terminology and frameworks
- Clear, concise communication style

#### Technical Accuracy
- Current technology trends and tools
- Accurate representation of achievements and metrics
- Realistic positioning for experience level
- Compliance with LinkedIn platform requirements

#### Legal and Ethical Considerations
- No confidential client information
- Accurate representation of achievements
- Appropriate attribution for team successes
- Compliance with professional standards