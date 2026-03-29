// Adds run_worker_first to the built wrangler.json so the custom Worker
// entry (src/worker.ts) processes ALL requests including prerendered pages.
// This is only needed in the production build - not in wrangler.json source
// because it breaks Vite's dev server asset resolution.

import { readFileSync, writeFileSync } from 'node:fs';

const path = 'dist/server/wrangler.json';
const config = JSON.parse(readFileSync(path, 'utf-8'));
config.assets = { ...config.assets, run_worker_first: true };
writeFileSync(path, JSON.stringify(config));
