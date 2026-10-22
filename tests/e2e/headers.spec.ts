import { test, expect } from './fixtures';

// Headers src/worker.ts adds on top of what the asset binding serves, which
// is a bare media type for prerendered pages and text endpoints.
// Runs against the local build before deploy and against production after it.
const HTML = ['/', '/contact', '/does-not-exist'];
const TEXT = ['/index.html.md', '/llms.txt'];

for (const path of [...HTML, ...TEXT]) {
  test(`${path} declares utf-8 and refuses framing`, async ({ request }) => {
    const headers = (await request.get(path)).headers();
    expect(headers['content-type']).toMatch(/;\s*charset=utf-8/i);
    expect(headers['x-frame-options']).toBe('DENY');
  });
}

for (const path of HTML) {
  test(`${path} CSP sets frame-ancestors 'none'`, async ({ request }) => {
    const headers = (await request.get(path)).headers();
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  });
}

for (const path of HTML) {
  test(`${path} lets the browser keep the page but never the edge`, async ({ request }) => {
    const headers = (await request.get(path)).headers();
    expect(headers['cache-control']).toBe('private, no-cache');
    expect(headers['cdn-cache-control']).toBe('no-store');
  });
}

test('/ points agents at its plain-text versions', async ({ request }) => {
  const link = (await request.get('/')).headers()['link'];
  expect(link).toContain('</llms.txt>; rel="describedby"');
  expect(link).toContain('</index.html.md>; rel="alternate"; type="text/markdown"');
});

test('a page with a markdown twin serves it on Accept: text/markdown', async ({ request }) => {
  const response = await request.get('/expertise', { headers: { Accept: 'text/markdown' } });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^text\/markdown/);
  expect(response.headers()['vary']).toMatch(/accept/i);
  expect(await response.text()).toBe(await (await request.get('/expertise.md')).text());
});

test('a page without a markdown twin stays HTML on Accept: text/markdown', async ({ request }) => {
  const response = await request.get('/privacy', { headers: { Accept: 'text/markdown' } });
  expect(response.headers()['content-type']).toMatch(/^text\/html/);
});

test('one banner landmark holds the theme toggle and social links', async ({ page }) => {
  await page.goto('/');
  const banner = page.getByRole('banner');
  await expect(banner).toHaveCount(1);
  await expect(banner.locator('#theme-toggle')).toHaveCount(1);
  await expect(banner.locator('a.social-link')).toHaveCount(3);
});
