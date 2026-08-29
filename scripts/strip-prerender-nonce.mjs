// Removes CSP nonces baked into the prerendered HTML at build time.
//
// The Cloudflare adapter renders prerendered pages by running the built
// Worker inside workerd, so src/worker.ts's HTMLRewriter runs during the
// build too and stamps every <script> with a `nonce="<uuid>"` from that
// build-time request. At request time the Worker rewrites it again with a
// fresh nonce, so it is invisible in production - but the stale value is
// still sitting in dist/client/*.html. If `assets.run_worker_first` ever
// fell out of the built wrangler config the asset binding would serve those
// files directly, pairing a stale nonce with a freshly issued CSP header and
// blocking every inline script on every prerendered page.
//
// Stripping them makes the artifact self-consistent: no nonce and no CSP
// header (the header is Worker-issued too), so the page still works.
// scripts/verify-build.mjs asserts the result.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist/client';

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(path));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

const NONCE = /\s+nonce="[^"]*"/g;

let files = 0;
let removed = 0;
for (const path of htmlFiles(root)) {
  const html = readFileSync(path, 'utf-8');
  const matches = html.match(NONCE);
  if (!matches) continue;
  writeFileSync(path, html.replace(NONCE, ''));
  files++;
  removed += matches.length;
}

console.log(`Stripped ${removed} build-time nonce attribute(s) from ${files} file(s)`);
