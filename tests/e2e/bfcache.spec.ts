import { test, expect, dataLayerEvents } from './fixtures';

// HTML is served private, no-cache rather than no-store so that Back and
// Forward restore pages from the back/forward cache (#37). A restore runs no
// script again, so the page has to catch up on what changed while it was
// away: the theme, and a GA4 page view through `page_restore`.
// Runs against the local build before deploy and against production after it.

// The headless shell the rest of the suite runs on has no bfcache at all
// (BackForwardCacheDisabledForDelegate), so this spec takes full Chrome,
// preinstalled on GitHub's runners, and drops the flag Playwright launches it
// with to turn the bfcache off.
test.use({ channel: 'chrome', launchOptions: { ignoreDefaultArgs: ['--disable-back-forward-cache'] } });

declare global {
  interface Window {
    __restored?: boolean;
  }
}

test('Back restores the page from the bfcache with the current theme and a page view', async ({ page }) => {
  await page.addInitScript(() => {
    window.addEventListener('pageshow', (e) => {
      window.__restored = e.persisted;
    });
  });
  await page.goto('/');
  // Chrome lets even a no-store page into the bfcache unless a cookie changes
  // while it is open. GA4 writes cookies on every page in production; the
  // fixtures block it, so this stands in for it.
  await page.evaluate(() => {
    document.cookie = 'bfcache_probe=1; path=/';
  });
  const before = await page.locator('html').getAttribute('data-theme');
  const after = before === 'dark' ? 'light' : 'dark';

  await page.goto('/expertise');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', after);

  // A restore fires pageshow but never load, which goBack() waits for by default.
  await page.goBack({ waitUntil: 'commit' });
  await expect
    .poll(() => page.evaluate(() => window.__restored), { message: 'Back was not served from the bfcache' })
    .toBe(true);
  await expect(page.locator('html')).toHaveAttribute('data-theme', after);
  await expect(page.locator('#theme-toggle')).toHaveAttribute('aria-label', `Switch to ${before} mode`);
  expect((await dataLayerEvents(page)).map((e) => e.event)).toContain('page_restore');
});
