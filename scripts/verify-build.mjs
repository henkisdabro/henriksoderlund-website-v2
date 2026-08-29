// Verifies build output is valid - catches silent prerender failures
// (e.g. env var validation errors that produce 0-byte HTML files).
// Run after `npm run build` or as part of `npm run check`.

import { statSync, existsSync, readFileSync } from 'node:fs';

import { CLIENT_ROOT, NONCE_ATTR, htmlFiles } from './strip-prerender-nonce.mjs';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

const htmlPages = [
  { path: 'dist/client/index.html', minBytes: 10000 },
  { path: 'dist/client/expertise/index.html', minBytes: 10000 },
  { path: 'dist/client/consultancy/index.html', minBytes: 10000 },
  { path: 'dist/client/perth-analytics-consultant/index.html', minBytes: 10000 },
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
  { path: 'dist/client/perth-analytics-consultant.md', minBytes: 500 },
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

// No prerendered page may ship a baked-in CSP nonce. src/worker.ts runs
// inside workerd during prerendering and stamps one in; scripts/strip-
// prerender-nonce.mjs removes it again. If that step is skipped and
// assets.run_worker_first is ever lost, the asset binding would serve a
// stale nonce against a freshly issued CSP header and block every inline
// script on every prerendered page.
//
// Walks every HTML file in dist/client with the stripper's own walk and
// pattern, rather than the eight pages listed above: a page added later is
// stripped by that walk, and must be asserted by this one too.
console.log('\n=== Prerendered HTML has no baked-in CSP nonce ===');
let nonceChecked = 0;
if (!existsSync(CLIENT_ROOT)) {
  console.error(`${RED}FAIL${RESET}: ${CLIENT_ROOT} - not found`);
  failed++;
} else {
  for (const path of htmlFiles(CLIENT_ROOT)) {
    const matches = readFileSync(path, 'utf-8').match(NONCE_ATTR);
    if (matches) {
      console.error(
        `${RED}FAIL${RESET}: ${path} - ${matches.length} build-time nonce attribute(s); run scripts/strip-prerender-nonce.mjs`,
      );
      failed++;
    } else {
      nonceChecked++;
    }
  }
  console.log(`${GREEN}OK${RESET}:   ${nonceChecked} HTML file(s) carry no nonce attribute`);
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

// src/styles/theme.css declares the dark palette twice - once under
// @media (prefers-color-scheme: dark) for the unstamped state, once under
// :root[data-theme="dark"] for an explicit choice. The two must stay
// byte-identical: if they drift, a visitor whose OS is dark but who has never
// touched the toggle gets one block's text colours on the other's backgrounds.
// A source comment asks editors to keep them in sync; this enforces it. The
// key-set check across all three blocks catches a token added to only one.
const THEME_CSS = 'src/styles/theme.css';

function themeTokens(css, selector) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return null;
  const open = css.indexOf('{', start);
  let depth = 0;
  let end = -1;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) {
      end = i;
      break;
    }
  }
  if (end === -1) return null;
  const tokens = new Map();
  for (const [, name, value] of css.slice(open + 1, end).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens.set(name, value.trim());
  }
  return tokens;
}

console.log('\n=== Theme palette blocks in sync ===');
const themeFailures = failed;
if (!existsSync(THEME_CSS)) {
  console.error(`${RED}FAIL${RESET}: ${THEME_CSS} - not found`);
  failed++;
} else {
  // Comments name these selectors in prose, and would otherwise be found first.
  const css = readFileSync(THEME_CSS, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = [
    ['light', ':root[data-theme="light"]'],
    ['media-dark', ':root:not([data-theme="light"])'],
    ['attribute-dark', ':root[data-theme="dark"]'],
  ].map(([label, selector]) => [label, selector, themeTokens(css, selector)]);

  const missing = blocks.filter(([, , tokens]) => !tokens || tokens.size === 0);
  if (missing.length > 0) {
    for (const [label, selector] of missing) {
      console.error(`${RED}FAIL${RESET}: ${THEME_CSS} - no tokens found for ${label} block (${selector})`);
      failed++;
    }
  } else {
    // Every block must declare the same token keys.
    const [[, , reference]] = blocks;
    for (const [label, , tokens] of blocks.slice(1)) {
      const extra = [...tokens.keys()].filter((key) => !reference.has(key));
      const absent = [...reference.keys()].filter((key) => !tokens.has(key));
      for (const key of extra) {
        console.error(`${RED}FAIL${RESET}: ${THEME_CSS} - ${key} declared in ${label} but not in light`);
        failed++;
      }
      for (const key of absent) {
        console.error(`${RED}FAIL${RESET}: ${THEME_CSS} - ${key} declared in light but not in ${label}`);
        failed++;
      }
    }

    // The two dark blocks must additionally agree on every value.
    const [, [, , mediaDark], [, , attributeDark]] = blocks;
    for (const [key, value] of mediaDark) {
      const other = attributeDark.get(key);
      if (other !== undefined && other !== value) {
        console.error(
          `${RED}FAIL${RESET}: ${THEME_CSS} - ${key} differs between the dark blocks: media-dark "${value}" vs attribute-dark "${other}"`,
        );
        failed++;
      }
    }

    if (failed === themeFailures) {
      console.log(
        `${GREEN}OK${RESET}:   ${blocks.map(([label, , tokens]) => `${label} ${tokens.size}`).join(', ')} tokens, dark blocks identical`,
      );
    }
  }
}

console.log(
  `\n${failed === 0 ? GREEN : RED}${failed} failure(s)${RESET}\n`,
);
process.exit(failed > 0 ? 1 : 0);
