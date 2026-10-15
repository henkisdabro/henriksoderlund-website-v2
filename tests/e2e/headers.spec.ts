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
