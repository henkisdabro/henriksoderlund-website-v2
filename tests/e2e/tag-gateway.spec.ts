import { test, expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';

// The Google tag gateway measurement path, proxied to fps.goog by the Worker.
// Only the health check and the container are fetched: neither is a hit.
// Runs against the local build before deploy and against production after it.
// Redirects are followed: Google sometimes answers with a 302 back to the same
// /wro1/ URL plus an fps= parameter, which a browser simply follows.

// Before deploy, the local Worker calls the real fps.goog, which now and then
// falls back to googletagmanager.com. That still proves the request was routed
// to Google rather than to the 404 page, so it passes here instead of
// blocking a deploy on Google's state.
const googleFallback = (res: APIResponse) =>
  process.env.E2E_TARGET !== 'production' && new URL(res.url()).hostname === 'www.googletagmanager.com';

test('/wro1/healthy reaches Google rather than the 404 page', async ({ request }) => {
  const res = await request.get('/wro1/healthy');
  if (googleFallback(res)) return;
  expect(res.status()).toBe(200);
  expect((await res.text()).trim()).toBe('ok');
});

test('/wro1/gtm.js serves the container through the Worker', async ({ request }) => {
  const res = await request.get('/wro1/gtm.js?id=GTM-KM56HHS2');
  if (googleFallback(res)) return;
  expect(res.status()).toBe(200);
  expect(new URL(res.url()).pathname).toBe('/wro1/gtm.js');
  expect(res.headers()['content-type']).toContain('javascript');
  const body = await res.text();
  expect(body).toContain('"/wro1/"');
  // Field "60" marks who asked Google for the container: dY2FjZD is this
  // Worker's proxy, dNzQzZD is Cloudflare's dashboard integration, which
  // would mean it was switched back on and is answering ahead of the Worker.
  expect(body).toContain('"60":"dY2FjZD"');
});
