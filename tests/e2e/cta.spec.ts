import { test, expect, dataLayerEvents, cspViolations } from './fixtures';
import { loadContainer, unforwardedKeys, type Container } from './gtm';
import { CALENDLY_URL } from '../../src/data/links';

// Runs against the local build before deploy and against production after it.

let container: Container;
test.beforeAll(async () => {
  container = await loadContainer();
});

for (const path of ['/consultancy', '/perth-analytics-consultant', '/contact']) {
  test(`${path}: the booking CTA opens Calendly and both steps are measured`, async ({ page, context }) => {
    await page.goto(path);
    // The Calendly page itself is checked in production.spec.ts. This stub
    // stands in for it and reports a booking the way the real embed does: a
    // postMessage from the calendly.com origin, which the site checks.
    await context.route(/calendly\.com/, (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: `<script>parent.postMessage({ event: 'calendly.event_scheduled', payload: {} }, '*')</script>`,
      })
    );

    await page.locator(`a[href="${CALENDLY_URL}"]`).first().click();
    const dialog = page.locator('#booking-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('iframe')).toHaveAttribute('src', new RegExp(new URL(CALENDLY_URL).pathname));

    const start = (await dataLayerEvents(page)).find((e) => e.event === 'booking_start');
    expect(start, 'booking_start was not pushed').toMatchObject({ link_url: CALENDLY_URL });
    expect(unforwardedKeys(container, start!), 'booking_start keys GTM drops').toEqual([]);

    await expect
      .poll(async () => (await dataLayerEvents(page)).find((e) => e.event === 'booking_complete'), {
        message: 'booking_complete was not pushed',
      })
      .toMatchObject({ link_url: CALENDLY_URL, cta_location: start!.cta_location });
    const complete = (await dataLayerEvents(page)).find((e) => e.event === 'booking_complete');
    expect(unforwardedKeys(container, complete!), 'booking_complete keys GTM drops').toEqual([]);

    expect(await cspViolations(page), 'the Calendly frame is blocked by the CSP').toEqual([]);
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
