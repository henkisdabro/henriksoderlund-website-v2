import { test, expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';

// The Google tag gateway measurement path, proxied to fps.goog by the Worker
// (or, while it is still on, answered by Cloudflare's integration ahead of it).
// Only the health check and the container are fetched: neither is a hit.
// Runs against the local build before deploy and against production after it.

// Before deploy, the local Worker calls the real fps.goog, which now and then
// answers with a fallback redirect to googletagmanager.com. That still proves
// the request was routed to Google rather than to a redirect or the 404 page,
// so it passes here instead of blocking a deploy on Google's state.
const googleFallback = (res: APIResponse) =>
  process.env.E2E_TARGET !== 'production' &&
  res.status() >= 300 &&
  res.status() < 400 &&
  new URL(res.headers().location ?? '', 'https://x.invalid').hostname === 'www.googletagmanager.com';

test('/wro1/healthy reaches Google rather than a redirect or the 404 page', async ({ request }) => {
  const res = await request.get('/wro1/healthy', { maxRedirects: 0 });
  if (googleFallback(res)) return;
  expect(res.status()).toBe(200);
  expect((await res.text()).trim()).toBe('ok');
});

test('/wro1/gtm.js serves the container with the measurement path built in', async ({ request }) => {
  const res = await request.get('/wro1/gtm.js?id=GTM-KM56HHS2', { maxRedirects: 0 });
  if (googleFallback(res)) return;
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('javascript');
  expect(await res.text()).toContain('"/wro1/"');
});
