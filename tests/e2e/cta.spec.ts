import { test, expect, dataLayerEvents } from './fixtures';
import { loadContainer, unforwardedKeys, type Container } from './gtm';
import { CALENDLY_URL } from '../../src/data/links';

// Runs against the local build before deploy and against production after it.

let container: Container;
test.beforeAll(async () => {
  container = await loadContainer();
});

for (const path of ['/consultancy', '/perth-analytics-consultant', '/contact']) {
  test(`${path}: the booking CTA opens Calendly and is measured`, async ({ page, context }) => {
    await page.goto(path);
    // The Calendly page itself is checked in production.spec.ts; here only
    // the click and its measurement matter.
    await context.route(/calendly\.com/, (route) => route.fulfill({ body: 'Calendly stub' }));

    const popup = page.waitForEvent('popup');
    await page.locator(`a[href="${CALENDLY_URL}"]`).first().click();
    expect((await popup).url()).toContain(new URL(CALENDLY_URL).pathname);

    const push = (await dataLayerEvents(page)).find((e) => e.event === 'booking_start');
    expect(push, 'booking_start was not pushed').toMatchObject({ link_url: CALENDLY_URL });
    expect(unforwardedKeys(container, push!), 'booking_start keys GTM drops').toEqual([]);
  });
}

for (const path of ['/consultancy', '/perth-analytics-consultant']) {
  test(`${path}: "Send a Message" reaches the contact form`, async ({ page }) => {
    await page.goto(path);
    await page.getByRole('link', { name: 'Send a Message' }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  });
}
