import { test, expect } from './fixtures';

// Contextual body links into the pages we want to rank, with the anchor text
// each one carries. Nav and footer links are excluded on purpose: they appear
// on every page and say nothing about the target.
// Runs against the local build before deploy and against production after it.
const LINKS = [
  { from: '/', href: '/perth-analytics-consultant', text: 'GA4 & analytics in Perth' },
  { from: '/expertise', href: '/perth-analytics-consultant', text: 'GA4 and server-side tagging in Perth' },
  { from: '/consultancy', href: '/perth-analytics-consultant', text: 'GA4, server-side tagging and data modelling for Perth and WA businesses' },
  { from: '/consultancy', href: '/perth-analytics-consultant', text: 'analytics and data consulting for WA businesses' },
  { from: '/work-experience', href: '/perth-analytics-consultant', text: 'advanced analytics and measurement frameworks' },
];

for (const { from, href, text } of LINKS) {
  test(`${from} links to ${href} as "${text}"`, async ({ page }) => {
    await page.goto(from);
    const anchors = page.locator(`main a[href="${href}"]`);
    const texts = (await anchors.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').replace(/\s*→$/, '').trim());
    expect(texts).toContain(text);
  });
}
