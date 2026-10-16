import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

// JetBrains Mono is the dark theme's font only (#36). Light mode must fetch no
// font file at all, so an unconditional preload cannot creep back in, and dark
// mode must still get the head preload rather than discovering the font late.
// Runs against the local build before deploy and against production after it.
const fontRequests = (page: Page) => {
  const fonts: string[] = [];
  page.on('request', (req) => {
    if (req.resourceType() === 'font' || /\.woff2?(\?|$)/.test(req.url())) fonts.push(new URL(req.url()).pathname);
  });
  return fonts;
};

for (const path of ['/', '/expertise']) {
  test.describe('light', () => {
    test.use({ colorScheme: 'light' });

    test(`${path} requests no font files`, async ({ page }) => {
      const fonts = fontRequests(page);
      await page.goto(path, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      await expect(page.locator('link[rel=preload][as=font]')).toHaveCount(0);
      expect(fonts).toEqual([]);
    });
  });

  test.describe('dark', () => {
    test.use({ colorScheme: 'dark' });

    test(`${path} preloads JetBrains Mono from <head>`, async ({ page }) => {
      const fonts = fontRequests(page);
      await page.goto(path, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(page.locator('head link[rel=preload][as=font]')).toHaveAttribute(
        'href',
        '/fonts/JetBrainsMono-Regular.woff2'
      );
      expect(fonts).toContain('/fonts/JetBrainsMono-Regular.woff2');
    });
  });
}
