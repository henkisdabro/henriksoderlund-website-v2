// Serves the *built* Worker (dist/server) under `wrangler dev` for the local
// E2E suite: the same bundle CI deploys, including src/worker.ts and its CSP,
// which `astro dev` never runs. See docs/LOCAL-WORKER-TESTING.md for why the
// routes are stripped.
//
//   node tests/e2e/serve-worker.mjs <port> <turnstile-secret> [--send-fails]
//
// --send-fails restricts the email binding to a recipient the form never
// uses, so every send is refused the way a broken sending domain would be.
//
// Email Service sends are simulated locally: wrangler prints each message and
// writes its body to a file. That output is teed to test-results/ so the tests
// can read back exactly what would have been emailed.

import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const [port, turnstileSecret, mode] = process.argv.slice(2);
const dir = 'dist/server';
const config = JSON.parse(readFileSync(`${dir}/wrangler.json`, 'utf-8'));
delete config.routes;
if (mode === '--send-fails') {
  config.send_email[0].allowed_destination_addresses = ['nobody@example.invalid'];
}
writeFileSync(`${dir}/wrangler.e2e-${port}.json`, JSON.stringify(config));

mkdirSync('test-results', { recursive: true });
const log = createWriteStream(`test-results/wrangler-${port}.log`);

const child = spawn(
  'pnpm',
  [
    'exec', 'wrangler', 'dev',
    '-c', `${dir}/wrangler.e2e-${port}.json`,
    // Explicit vars win over the .dev.vars the build copies into dist/server,
    // so a developer's real secrets never reach a test run.
    '--var', `TURNSTILE_SECRET_KEY:${turnstileSecret}`,
    '--var', 'CONTACT_SYNTHETIC_TOKEN:e2e-synthetic-token',
    '--port', port, '--ip', '127.0.0.1', '--local',
    // Instances running side by side would otherwise share a state dir (and
    // lock each other out of it) and the default inspector port.
    '--persist-to', `${dir}/.wrangler/state-${port}`,
    '--inspector-port', String(Number(port) + 1000),
    '--show-interactive-dev-session=false',
  ],
  // Playwright sets FORCE_COLOR for its web servers; ANSI codes in the log
  // would break the tests' parsing of it.
  { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' } }
);
for (const stream of [child.stdout, child.stderr]) {
  stream.on('data', (chunk) => {
    process.stdout.write(chunk);
    log.write(chunk);
  });
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code) => process.exit(code ?? 0));
