# Deployment Guide

This document outlines the automated deployment process for the website using GitHub Actions and Cloudflare Workers.

## Automated Deployment

### Overview

The website uses GitHub Actions for automated building and deployment to Cloudflare Workers. The workflow includes:

1. **Build Process**: Dependencies, linting, Astro check, and Astro build
2. **Verification**: Ensures all required files are generated
3. **Deployment**: Deploys to Cloudflare Workers (main branch only)

### Workflow Triggers

- **Push to `main`**: Full build, verification, and deployment
- **Pull Requests**: Build and verification only (no deployment)

### Required Setup

#### 1. Disable Cloudflare Automatic Builds

**IMPORTANT**: Cloudflare Workers has automatic builds when connected to GitHub. You must disable this to avoid conflicts:

1. Go to your Cloudflare Workers dashboard
2. Select your worker (`henriksoderlund-website-v2`)
3. Go to **Settings** > **Triggers**
4. Under **Deploy Hooks**, disable "Automatic deployments"
5. Or disconnect the GitHub integration if present

#### 2. GitHub Repository Secrets

Add these secrets to your GitHub repository settings (`Settings` > `Secrets and variables` > `Actions`):

1. **`CLOUDFLARE_API_TOKEN`**
   - Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Create token with "Custom token" template
   - Permissions needed:
     - `Account:Cloudflare Workers:Edit`
     - `Zone:Zone Settings:Read`
     - `Zone:Zone:Read`

2. **`CLOUDFLARE_ACCOUNT_ID`**
   - Found in Cloudflare dashboard sidebar
   - Or run: `wrangler whoami`

### Workflow Features

#### Build Verification

- Dependency installation with npm cache
- ESLint code quality checks
- Astro check (type checking)
- Astro build process
- Markdown endpoint generation
- File existence verification
- Build artifact inspection

#### Deployment Safety

- Only deploys on successful builds
- Main branch protection
- Separate PR workflow (build-only)
- Detailed deployment summaries

## Generated Files

The following files are automatically generated during `astro build`:

### Per-Page Markdown Endpoints

Generated from Astro `.md.ts` endpoint files in `src/pages/`:

- **Homepage**: `/index.html.md`
- **Expertise**: `/expertise.md`
- **Work Experience**: `/work-experience.md`
- **Education**: `/education.md`
- **Consultancy**: `/consultancy.md`

All files follow the [llms.txt specification](https://llmstxt.org/) for optimal AI consumption.

### Sitemap

Generated automatically by the `@astrojs/sitemap` integration.

## Manual Deployment

If needed, you can deploy manually:

```bash
# Install dependencies
npm ci

# Build (includes Astro check + build)
npm run build

# Deploy to Cloudflare Workers
npm run deploy
```

## Troubleshooting

### Build Failures

1. **Astro check fails**
   - Run `npm run check` locally
   - Fix type errors before pushing

2. **Markdown endpoint generation fails**
   - Verify `.md.ts` files in `src/pages/` are correctly structured
   - Check data imports from `src/data/` directory

3. **Deployment fails**
   - Verify Cloudflare secrets are set correctly
   - Check `wrangler.json` configuration
   - **Most common**: Ensure Cloudflare automatic builds are disabled

### Conflicting Deployments

If you see duplicate deployments or build conflicts:

1. **Check Cloudflare Workers Dashboard**
   - Look for automatic deployments happening simultaneously
   - Disable automatic builds if they're still enabled

2. **GitHub Actions Logs**
   - Check if deployment step completed successfully
   - Look for wrangler command output

3. **Wrangler CLI Debug**

   ```bash
   # Test deployment locally
   npm run build
   npx wrangler deploy --dry-run
   ```

### File Verification Errors

The workflow verifies these files exist in build output:

- `dist/expertise.md`
- `dist/work-experience.md`
- `dist/education.md`
- `dist/consultancy.md`
- `dist/index.html.md`

If verification fails, check the `.md.ts` endpoint files in `src/pages/`.

## Monitoring

### GitHub Actions Dashboard

- View workflow runs in the "Actions" tab
- Each run shows detailed build logs
- Deployment summaries include file sizes and URLs

### Cloudflare Dashboard

- Monitor deployment status
- View worker analytics
- Check for runtime errors

## Development Workflow

1. **Feature Development**

   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git push origin feature/new-feature
   ```

2. **Pull Request**
   - GitHub Actions runs build verification
   - Review build summary in PR checks
   - No deployment occurs

3. **Merge to Main**
   - Automatic deployment triggered
   - Files generated and deployed
   - Available at production URLs

This ensures a safe, automated deployment process with proper verification at every step.
