// Bundles the homepage depth field (src/scripts/depth-grain.js plus Paper
// Shaders) into one IIFE. index.astro imports it with ?url, so Vite emits it as
// a hashed /_astro file, and a nonced data-csp loader inserts it.
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
