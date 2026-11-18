import { test, expect } from './fixtures';

// Redirect, trailing-slash and 410 handling in src/worker.ts. Each legacy URL
// must resolve in one hop, keeping campaign parameters and dropping the rest.
// Runs against the local build before deploy and against production after it.
const REDIRECTS: [string, string][] = [
  ['/skills', '/expertise'],
  ['/skills/', '/expertise'],
  ['/blog/x', '/'],
  ['/blog/x/', '/'],
  ['/education.md', '/work-experience.md'],
  ['/index.md', '/index.html.md'],
  ['/skills?utm_source=a&junk=1', '/expertise?utm_source=a'],
  ['/skills/?utm_source=a&junk=1', '/expertise?utm_source=a'],
  ['/blog/x?utm_source=a&junk=1', '/?utm_source=a'],
  ['/blog/x/?utm_source=a&junk=1', '/?utm_source=a'],
];

for (const [path, target] of REDIRECTS) {
  test(`${path} 301s straight to ${target}`, async ({ request, baseURL }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers()['location']).toBe(new URL(target, baseURL).toString());
  });
}

for (const path of ['/feed', '/feed/']) {
  test(`${path} is 410 Gone with no redirect first`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(410);
    expect(response.headers()['x-robots-tag']).toBe('noindex');
  });
}
