# Henrik Söderlund - Personal Website

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
│   ├── components/      # React components (Home, Skills, etc.)
│   ├── assets/         # Static assets (SVG logos, flags)
│   ├── App.tsx         # Main App component with routing
│   ├── main.tsx        # React entry point
│   └── index.css       # Global styles
├── worker/             # Cloudflare Workers backend (Hono.js)
│   └── index.ts        # Worker entry point
public/                 # Static assets served directly
├── images/             # Profile photos and screenshots
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

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run check` - TypeScript check, build, and dry-run deploy
- `npm run deploy` - Deploy to Cloudflare Workers

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

## Future Tasks and Site Improvements

### Analytics & Tracking
- [ ] Add Google Tag Manager (GTM) to header with support for dev environments
- [ ] Confirm Ahrefs and Google Search Console support

### SEO & Site Configuration
- [ ] Revise and improve security.txt
- [ ] Add robots.txt
- [ ] Add CORS and CSP headers

### Content & Visual Updates
- [ ] Update content and project screenshots

## File Management

### Legacy Files (Can be ignored/removed)
- `content/` - Old Markdown content files (migrated to React components)
- `assets/` - Old Hugo assets (duplicated in `public/`)

### Build Artifacts (Auto-generated)
- `dist/` - Vite build output
- `node_modules/` - NPM dependencies  
- `.wrangler/` - Wrangler cache and temporary files

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
