// Verifies build output is valid - catches silent prerender failures
// (e.g. env var validation errors that produce 0-byte HTML files).
// Run after `npm run build` or as part of `npm run check`.

import { statSync, existsSync, readFileSync } from 'node:fs';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

const htmlPages = [
  { path: 'dist/client/index.html', minBytes: 10000 },
  { path: 'dist/client/expertise/index.html', minBytes: 10000 },
  { path: 'dist/client/consultancy/index.html', minBytes: 10000 },
  { path: 'dist/client/work-experience/index.html', minBytes: 5000 },
  { path: 'dist/client/education/index.html', minBytes: 2000 },
  { path: 'dist/client/privacy/index.html', minBytes: 2000 },
  { path: 'dist/client/404.html', minBytes: 1000 },
];

const textEndpoints = [
  { path: 'dist/client/llms.txt', minBytes: 500 },
  { path: 'dist/client/llms-full.txt', minBytes: 5000 },
  { path: 'dist/client/expertise.md', minBytes: 500 },
  { path: 'dist/client/consultancy.md', minBytes: 500 },
  { path: 'dist/client/work-experience.md', minBytes: 500 },
  { path: 'dist/client/education.md', minBytes: 100 },
  { path: 'dist/client/contact.md', minBytes: 100 },
  { path: 'dist/client/index.html.md', minBytes: 100 },
];

const sitemapFiles = [
  { path: 'dist/client/sitemap-index.xml', minBytes: 100 },
  { path: 'dist/client/sitemap-0.xml', minBytes: 500 },
];

const serverFiles = [
  { path: 'dist/server/entry.mjs', minBytes: 50 },
  { path: 'dist/server/wrangler.json', minBytes: 100 },
];

let failed = 0;

function check(label, files) {
  console.log(`\n=== ${label} ===`);
  for (const { path, minBytes } of files) {
    if (!existsSync(path)) {
      console.error(`${RED}FAIL${RESET}: ${path} - not found`);
      failed++;
      continue;
    }
    const size = statSync(path).size;
    if (size < minBytes) {
      console.error(
        `${RED}FAIL${RESET}: ${path} - ${size} bytes (expected >= ${minBytes}) - likely empty render`,
      );
      failed++;
    } else {
      console.log(`${GREEN}OK${RESET}:   ${path} (${size} bytes)`);
    }
  }
}

check('Prerendered HTML pages', htmlPages);
check('Text/markdown endpoints', textEndpoints);
check('Sitemap files', sitemapFiles);
check('Server bundle', serverFiles);

// Guard against stale sitemap.xml returning (must not exist in build output)
if (existsSync('dist/client/sitemap.xml')) {
  console.error(
    `\n${RED}FAIL${RESET}: dist/client/sitemap.xml exists - stale static file must be removed from public/`,
  );
  failed++;
}

// Check wrangler.json has run_worker_first patched in
const wranglerPath = 'dist/server/wrangler.json';
if (existsSync(wranglerPath)) {
  const config = JSON.parse(readFileSync(wranglerPath, 'utf-8'));
  if (!config.assets?.run_worker_first) {
    console.error(
      `\n${RED}FAIL${RESET}: ${wranglerPath} missing assets.run_worker_first`,
    );
    failed++;
  } else {
    console.log(`\n${GREEN}OK${RESET}:   run_worker_first is patched`);
  }
}

console.log(
  `\n${failed === 0 ? GREEN : RED}${failed} failure(s)${RESET}\n`,
);
process.exit(failed > 0 ? 1 : 0);
