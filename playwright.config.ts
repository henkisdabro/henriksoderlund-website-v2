import { defineConfig, devices } from '@playwright/test';

// Two targets, one suite - see docs/LEAD-CAPTURE-TESTS.md.
//   pnpm run test:e2e   built Worker locally, before deploy
//   pnpm run test:prod  the live site, after deploy and daily
const production = process.env.E2E_TARGET === 'production';

const ALWAYS_PASSES = '1x0000000000000000000000000000000AA';
const ALWAYS_FAILS = '2x0000000000000000000000000000000AA';

const serve = (port: number, ...args: string[]) => ({
  command: `node tests/e2e/serve-worker.mjs ${port} ${args.join(' ')}`,
  url: `http://127.0.0.1:${port}/health`,
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
});

export default defineConfig({
  testDir: 'tests/e2e',
  testIgnore: production ? 'contact-form.spec.ts' : 'production.spec.ts',
  // The email assertions read shared per-instance logs; keep runs serial.
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: production ? 'https://www.henriksoderlund.com' : 'http://127.0.0.1:8801',
    trace: 'retain-on-failure',
  },
  webServer: production
    ? undefined
    : [
        serve(8801, ALWAYS_PASSES),
        serve(8802, ALWAYS_FAILS),
        serve(8803, ALWAYS_PASSES, '--send-fails'),
      ],
});
