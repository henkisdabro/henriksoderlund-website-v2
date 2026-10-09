// Bundles the homepage depth field (src/scripts/depth-grain.js plus Paper
// Shaders) into one IIFE that index.astro inlines in a data-csp script, so the
// Worker's per-request nonce covers it like every other script on the site.
// Runs before `astro dev` and `astro build`; the output is gitignored.
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const notice = readFileSync('node_modules/@paper-design/shaders/NOTICE', 'utf8').trim();

await build({
  entryPoints: ['src/scripts/depth-grain.js'],
  outfile: 'src/generated/depth-grain.js',
  bundle: true,
  format: 'iife',
  minify: true,
  target: 'es2022',
  legalComments: 'none',
  // Apache-2.0 section 4(d): the library's NOTICE travels with the copy.
  banner: { js: `/*! ${notice.replace(/\*\//g, '* /').replace(/\n+/g, ' - ')} (Apache-2.0) */` },
  logLevel: 'warning',
});
