# Automated llms.txt Generation System

This directory contains scripts for automatically generating an `llms.txt` file and individual page Markdown versions for the website, following the [llms.txt specification](https://llmstxt.org/intro.html).

## Overview

The system generates two types of files to optimize AI/LLM consumption:

1. **llms.txt** - A structured context document that helps AI agents understand your website's content and purpose
2. **Page Markdown files** - Clean Markdown versions of each page (`.md` files) as recommended by the llms.txt spec

Both file types are automatically generated from your React components and website structure.

## Files

- **`generate-llms-txt.js`** - Main generation script that analyzes the website structure and creates both llms.txt and markdown files
- **`jsx-to-markdown.js`** - Utility module for converting React JSX components to clean Markdown format with UTF-8 character encoding
- **`check-content-changes.js`** - Smart caching script that detects content changes to avoid unnecessary regeneration
- **`generate-sitemap.js`** - XML sitemap generator for search engine optimization
- **`README.md`** - This documentation file

## How It Works

### Automatic Generation

The llms.txt file is automatically generated during the build process through the npm script in `package.json`:

```json
{
  "scripts": {
    "build": "npm run generate-llms-if-needed && npm run generate-sitemap && tsc -b && vite build",
    "generate-llms": "node scripts/generate-llms-txt.js",
    "generate-llms-if-needed": "node scripts/check-content-changes.js && npm run generate-llms || echo 'Skipping llms.txt generation - no content changes'",
    "generate-sitemap": "node scripts/generate-sitemap.js"
  }
}
```

### Manual Generation

You can also generate the file manually:

```bash
npm run generate-llms
```

Or run the script directly:

```bash
node scripts/generate-llms-txt.js
```

### Output Locations

The script generates files in the following locations:

**llms.txt file:**
1. **Root directory** (`./llms.txt`) - For local development and repository documentation
2. **Public directory** (`./public/llms.txt`) - Gets included in the build output and deployed to production

**Markdown page files** (all in `./public/` directory):
- `index.html.md` - Homepage markdown (per llms.txt spec for URLs without filenames)
- `expertise.md` - Expertise page markdown
- `work-experience.md` - Work Experience page markdown  
- `education.md` - Education page markdown
- `consultancy.md` - Consultancy page markdown

All files are automatically included in the Vite build output and deployed to production.

## Content Structure

The generated llms.txt file includes:

### Header
- Site title and executive summary
- Brief description of the website's purpose

### About Section
- All main pages with descriptions based on routing configuration
- Automatically extracted from the React Router setup in `App.tsx`

### GitHub Projects
- Notable technical contributions and open source projects
- Extracted from the Skills/Expertise component

### Technical Focus Areas
- Key expertise areas with links to relevant pages
- Organized by technical domain (AI, Measurement, Strategy, etc.)

## Configuration

The script is configured through constants at the top of `generate-llms-txt.js`:

```javascript
const BASE_URL = 'https://www.henriksoderlund.com';
const ROUTES = {
  '/': 'Home',
  '/expertise': 'Skills',
  '/work-experience': 'WorkExperience',
  '/education': 'Education',
  '/consultancy': 'Consultation'
};
```

To modify the generated content:

1. **Add new pages**: Update the `ROUTES` object with new route mappings
2. **Update GitHub projects**: Modify the `GITHUB_PROJECTS` array
3. **Change descriptions**: Update the `getPageDescription()` function
4. **Modify focus areas**: Edit the Technical Focus Areas section in `generateLlmsTxt()`

## Integration with Build Process

The system is integrated into the build process with smart content-based caching:

1. **Content Check**: `npm run generate-llms-if-needed` checks if React components changed
2. **Smart Generation**: Only regenerates files when content actually changes
3. **Build**: Vite processes the static files including generated llms.txt and markdown files
4. **Deploy**: Files included in Cloudflare Workers deployment

### CI/CD Integration

The project includes GitHub Actions for automated deployment:
- **Pull Requests**: Build verification only
- **Main Branch**: Full build, verification, and deployment to Cloudflare Workers
- **Smart Caching**: Skips generation when no content changes

The complete deployment process is documented in the main project documentation files (CLAUDE.md and README.md).

## Deployment

The generated files will be available at the following URLs:

**Main llms.txt file:**
- **Production**: `https://www.henriksoderlund.com/llms.txt`
- **Local development**: `http://localhost:5173/llms.txt`

**Individual page markdown files:**
- **Homepage**: `https://www.henriksoderlund.com/index.html.md`
- **Expertise**: `https://www.henriksoderlund.com/expertise.md`
- **Work Experience**: `https://www.henriksoderlund.com/work-experience.md`
- **Education**: `https://www.henriksoderlund.com/education.md`
- **Consultancy**: `https://www.henriksoderlund.com/consultancy.md`

This comprehensive setup enables AI agents and language models to access both:
1. **Structured overview** via the `/llms.txt` endpoint
2. **Detailed page content** via individual `.md` files for each page

This follows the complete [llms.txt specification](https://llmstxt.org/intro.html) recommendations for optimal AI/LLM consumption.