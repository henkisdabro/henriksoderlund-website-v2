import { test, expect, cspViolations } from './fixtures';
import { CALENDLY_URL } from '../../src/data/links';

// Post-deploy and daily: the live site and the live services behind it. The
// failure this exists for is drift nobody deployed - a DNS record removed, a
// secret rotated, a Calendly event paused - which no pre-deploy test can see.

test('the live contact form loads its Turnstile challenge under the site CSP', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  await expect
    .poll(() => page.frames().some((f) => f.url().startsWith('https://challenges.cloudflare.com/')), {
      message: 'Turnstile iframe never loaded',
      timeout: 20_000,
    })
    .toBe(true);
  expect(await cspViolations(page)).toEqual([]);
});

test('a synthetic submission gets through Turnstile verification and Email Service', async ({ request }) => {
  const token = process.env.CONTACT_SYNTHETIC_TOKEN;
  test.skip(!token && !process.env.CI, 'CONTACT_SYNTHETIC_TOKEN not set locally');
  expect(token, 'CONTACT_SYNTHETIC_TOKEN secret missing in CI').toBeTruthy();

  // 200 proves: the Turnstile secret is valid, the send_email binding exists,
  // the sending domain is verified, and Email Service accepted the message
  // (to the filtered admin+synthetic alias). Any failure carries its reason,
  // e.g. "Failed to send email (E_SENDER_NOT_VERIFIED)".
  const res = await request.post('/_actions/contact', {
    headers: { Origin: 'https://www.henriksoderlund.com', 'X-Synthetic-Check': token! },
    form: {
      name: 'Synthetic check',
      email: 'synthetic-check@henriksoderlund.com',
      message: `Automated check from GitHub Actions run ${process.env.GITHUB_RUN_ID ?? 'local'}.`,
      'cf-turnstile-response': 'synthetic-check',
    },
  });
  expect(res.status(), await res.text()).toBe(200);
});

test('the Calendly event behind the booking CTA has bookable times', async ({ page }) => {
  await page.goto(CALENDLY_URL);
  const days = page.getByRole('button', { name: /- (No )?[Tt]imes available$/ });
  await expect(days.first(), 'Calendly booking calendar did not render').toBeVisible({ timeout: 30_000 });

  // Late in a month the remaining days can all be full; look one month ahead.
  // Availability arrives after the grid renders, so give it a moment first.
  const available = page.getByRole('button', { name: /- Times available$/ });
  const thisMonth = await available
    .first()
    .waitFor({ timeout: 5_000 })
    .then(() => true, () => false);
  if (!thisMonth) {
    await page.getByRole('button', { name: 'Go to next month' }).click();
  }
  await expect(available.first(), 'no bookable day this month or next').toBeVisible();

  await available.first().click();
  await expect(page.getByRole('button', { name: /^\d{1,2}:\d{2}(am|pm)$/ }).first()).toBeVisible();
});
