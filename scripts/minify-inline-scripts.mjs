// Minifies the authored inline scripts in the prerendered HTML.
//
// `is:inline` scripts reach the page exactly as written, comments and all -
// about 20 KB raw on every page, most of it the explanations in
// BaseLayout.astro. Those comments belong in the source, not in every
// response, so they are stripped here instead.
//
// Safe under the CSP because it is nonce-based: the Worker stamps a nonce at
// request time, so a script's bytes can change freely. Hashes would not
// survive this step. JSON blocks (ld+json, speculationrules) are left alone.
// The SSR /contact page is not prerendered, so its scripts ship as written.

import { readFileSync, writeFileSync } from 'node:fs';
import { transformSync } from 'esbuild';
import { CLIENT_ROOT, htmlFiles } from './strip-prerender-nonce.mjs';

// HTML comments are matched first and passed through, so a comment that
// mentions a <script> tag is never mistaken for one.
const INLINE_SCRIPT = /<!--[\s\S]*?-->|<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;

let before = 0;
let after = 0;
for (const path of htmlFiles(CLIENT_ROOT)) {
  const html = readFileSync(path, 'utf-8');
  const out = html.replace(INLINE_SCRIPT, (tag, attrs = '', body) => {
    if (body === undefined) return tag;
    const type = /\stype="([^"]*)"/.exec(attrs)?.[1];
    if (!body.trim() || /\ssrc=/.test(attrs) || (type && type !== 'module' && type !== 'text/javascript')) return tag;
    const { code } = transformSync(body, {
      minify: true,
      target: 'es2022',
      format: type === 'module' ? 'esm' : undefined,
      legalComments: 'none',
    });
    return `<script${attrs}>${code.trim()}</script>`;
  });
  before += html.length;
  after += out.length;
  writeFileSync(path, out);
}

console.log(`Minified inline scripts: ${before} -> ${after} bytes across the prerendered HTML`);
