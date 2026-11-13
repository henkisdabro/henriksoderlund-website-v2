// Verifies build output is valid - catches silent prerender failures
// (e.g. env var validation errors that produce 0-byte HTML files).
// Run after `npm run build` or as part of `npm run check`.

import { statSync, existsSync, readFileSync } from 'node:fs';

import { CLIENT_ROOT, NONCE_ATTR, htmlFiles } from './strip-prerender-nonce.mjs';

// A pass prints one summary line; each check's OK line and section header show
// only in a terminal or with VERBOSE=1 (QUIET=1 forces the short form). Agents
// run this inside every build, and its output lands in their context in full.
// FAIL lines always print, and each one names the file it is about.
const tty = process.stdout.isTTY === true;
const verbose = process.env.VERBOSE === '1' || (tty && process.env.QUIET !== '1');
const RED = tty ? '\x1b[31m' : '';
const GREEN = tty ? '\x1b[32m' : '';
const RESET = tty ? '\x1b[0m' : '';

let passed = 0;
function ok(message) {
  passed++;
  if (verbose) console.log(`${GREEN}OK${RESET}:   ${message}`);
}
function section(label) {
  if (verbose) console.log(`\n=== ${label} ===`);
}

const htmlPages = [
  { path: 'dist/client/index.html', minBytes: 10000 },
  { path: 'dist/client/expertise/index.html', minBytes: 10000 },
  { path: 'dist/client/builds/index.html', minBytes: 10000 },
  { path: 'dist/client/consultancy/index.html', minBytes: 10000 },
  { path: 'dist/client/perth-analytics-consultant/index.html', minBytes: 10000 },
  { path: 'dist/client/work-experience/index.html', minBytes: 5000 },
  { path: 'dist/client/privacy/index.html', minBytes: 2000 },
  { path: 'dist/client/404.html', minBytes: 1000 },
];

const textEndpoints = [
  { path: 'dist/client/llms.txt', minBytes: 500 },
  { path: 'dist/client/llms-full.txt', minBytes: 5000 },
  { path: 'dist/client/expertise.md', minBytes: 500 },
  { path: 'dist/client/builds.md', minBytes: 500 },
  { path: 'dist/client/consultancy.md', minBytes: 500 },
  { path: 'dist/client/perth-analytics-consultant.md', minBytes: 500 },
  { path: 'dist/client/work-experience.md', minBytes: 500 },
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
  section(label);
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
      ok(`${path} (${size} bytes)`);
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
section('Prerendered HTML has no baked-in CSP nonce');
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
  ok(`${nonceChecked} HTML file(s) carry no nonce attribute`);
}

// src/worker.ts nonces only `script[data-csp]`. Under 'strict-dynamic' a
// script without the marker gets no nonce and is blocked in every browser, so
// an authored script that forgot it is a broken page, not a warning.
section('Every script carries the data-csp marker');
if (existsSync(CLIENT_ROOT)) {
  let marked = 0;
  for (const path of htmlFiles(CLIENT_ROOT)) {
    const tags = readFileSync(path, 'utf-8').match(/<script\b[^>]*>/g) ?? [];
    for (const tag of tags) {
      if (tag.includes('application/ld+json')) continue;
      if (/\bdata-csp\b/.test(tag)) {
        marked++;
      } else {
        console.error(`${RED}FAIL${RESET}: ${path} - unmarked script ${tag}`);
        failed++;
      }
    }
  }
  ok(`${marked} script(s) marked across the prerendered HTML`);
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
    ok('run_worker_first is patched');
  }
}

// src/styles/theme.css pairs every colour as light-dark(light, dark) on bare
// :root. The tokens light-dark() cannot carry - font stacks, RGB triplets,
// plain numbers - have their dark values declared twice: once under
// @media (prefers-color-scheme: dark) for the unstamped state, once under
// :root[data-theme="dark"] for an explicit choice. Those two must stay
// byte-identical: if they drift, a visitor whose OS is dark but who has never
// touched the toggle gets a different dark theme from one who has. A source
// comment asks editors to keep them in sync; this enforces it, and checks that
// neither block overrides a token the base block does not define and that
// every base token has a dark value one way or the other.
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

section('Theme palette blocks in sync');
const themeFailures = failed;
if (!existsSync(THEME_CSS)) {
  console.error(`${RED}FAIL${RESET}: ${THEME_CSS} - not found`);
  failed++;
} else {
  // Comments name these selectors in prose, and would otherwise be found first.
  const css = readFileSync(THEME_CSS, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = [
    ['base', ':root'],
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
    const [[, , base], [, , mediaDark], [, , attributeDark]] = blocks;

    // A dark override of a token the base never defines is a typo or a leftover.
    for (const [label, , tokens] of blocks.slice(1)) {
      for (const key of tokens.keys()) {
        if (!base.has(key)) {
          console.error(`${RED}FAIL${RESET}: ${THEME_CSS} - ${key} declared in ${label} but not in base`);
          failed++;
        }
      }
    }

    // A base token that is neither a light-dark() pair nor overridden for dark
    // would ship its light value into the dark theme.
    for (const [key, value] of base) {
      if (!value.startsWith('light-dark(') && !attributeDark.has(key)) {
        console.error(`${RED}FAIL${RESET}: ${THEME_CSS} - ${key} has no dark value: not a light-dark() pair and not in the dark blocks`);
        failed++;
      }
    }

    // The two dark blocks must declare the same tokens with the same values.
    for (const key of new Set([...mediaDark.keys(), ...attributeDark.keys()])) {
      const value = mediaDark.get(key);
      const other = attributeDark.get(key);
      if (value !== other) {
        console.error(
          `${RED}FAIL${RESET}: ${THEME_CSS} - ${key} differs between the dark blocks: media-dark "${value}" vs attribute-dark "${other}"`,
        );
        failed++;
      }
    }

    if (failed === themeFailures) {
      ok(`${blocks.map(([label, , tokens]) => `${label} ${tokens.size}`).join(', ')} tokens, dark blocks identical`);
    }
  }
}

console.log(
  `${verbose ? '\n' : ''}verify-build: ${failed === 0 ? GREEN : RED}${failed} failure(s)${RESET}, ${passed} check(s) passed`,
);
process.exit(failed > 0 ? 1 : 0);
