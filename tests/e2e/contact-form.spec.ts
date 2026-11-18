import type { Page } from '@playwright/test';
import { test, expect, dataLayerEvents, cspViolations } from './fixtures';
import { watchEmails } from './email';
import { loadContainer, unforwardedKeys, type Container } from './gtm';
import { CONTACT_EMAIL } from '../../src/data/links';

// Pre-deploy: the built Worker under wrangler dev, three ways (see
// playwright.config.ts). A real browser fills the real form; the only
// stand-ins are Turnstile's official test keys and Email Service's local
// simulator, which records the message instead of delivering it.

const PASSES = 8801; // Turnstile always passes
const BOT = 8802; // Turnstile always rejects
const SEND_FAILS = 8803; // Turnstile passes, the email binding refuses to send

const visitor = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'We need help with our GA4 migration before Q4. Can we talk?',
};

let container: Container;
test.beforeAll(async () => {
  container = await loadContainer();
});

// The production site key is baked into the build and refuses to run on
// 127.0.0.1, so each page swaps it for Turnstile's always-solvable test key -
// one attribute, leaving the build under test otherwise identical to the
// deployed one. The server side still verifies against a real siteverify call.
test.beforeEach(async ({ page }) => {
  await page.route(/127\.0\.0\.1:\d+\/contact/, async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      /data-sitekey="[^"]*"/,
      'data-sitekey="1x00000000000000000000AA"'
    );
    await route.fulfill({ response, body });
  });
});

async function submitForm(page: Page, port: number, input = visitor) {
  await page.goto(`http://127.0.0.1:${port}/contact`);
  await page.getByLabel('Name').fill(input.name);
  await page.getByLabel('Email').fill(input.email);
  await page.getByLabel('Message').fill(input.message);
  // The test site key solves itself; wait for the token it writes into the form.
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, {
    timeout: 20_000,
  });
  await page.getByRole('button', { name: 'Send Message' }).click();
}

// A failed submit re-renders the form; what the visitor typed must survive it.
async function expectFieldsKept(page: Page, input = visitor) {
  await expect(page.getByLabel('Name')).toHaveValue(input.name);
  await expect(page.getByLabel('Email')).toHaveValue(input.email);
  await expect(page.getByLabel('Message')).toHaveValue(input.message);
}

async function pushed(page: Page, event: string) {
  const found = (await dataLayerEvents(page)).find((e) => e.event === event);
  expect(found, `${event} was not pushed to the dataLayer`).toBeTruthy();
  return found!;
}

test('a visitor message is emailed to Henrik and counted as a lead', async ({ page }) => {
  const emails = watchEmails(PASSES);
  await submitForm(page, PASSES);

  await expect(page.getByRole('heading', { name: 'Message sent successfully' })).toBeVisible();

  const email = await emails.one();
  expect(email.to).toBe(CONTACT_EMAIL);
  expect(email.from).toContain('<noreply@henriksoderlund.com>');
  expect(email.subject).toBe(`Website contact from ${visitor.name}`);
  expect(email.text).toContain(visitor.message);
  expect(email.text).toContain(visitor.email);

  const lead = await pushed(page, 'generate_lead');
  expect(lead).toMatchObject({ form_name: 'contact', form_location: '/contact' });
  expect(unforwardedKeys(container, lead), 'generate_lead keys GTM drops').toEqual([]);

  expect(await cspViolations(page)).toEqual([]);
});

test('a submission Turnstile rejects sends nothing and is logged as a bot block', async ({ page }) => {
  const emails = watchEmails(BOT);
  await submitForm(page, BOT);

  await expect(page.getByText('Verification failed.')).toBeVisible();
  expect(emails.sent()).toEqual([]);
  await expectFieldsKept(page);

  const error = await pushed(page, 'form_error');
  expect(error).toMatchObject({
    error_type: 'bot_check',
    error_code: 'FORBIDDEN',
    error_reason: 'Verification failed',
  });
  expect(unforwardedKeys(container, error), 'form_error keys GTM drops').toEqual([]);
});

test('when sending fails the visitor gets the direct address and the failure is logged', async ({ page }) => {
  await submitForm(page, SEND_FAILS);

  await expect(page.getByText('Something went wrong.')).toBeVisible();
  await expect(page.getByRole('link', { name: CONTACT_EMAIL })).toHaveAttribute(
    'href',
    `mailto:${CONTACT_EMAIL}`
  );
  await expect(page.getByRole('heading', { name: 'Message sent successfully' })).toHaveCount(0);
  await expectFieldsKept(page);

  const error = await pushed(page, 'form_error');
  expect(error).toMatchObject({ error_type: 'server', error_code: 'INTERNAL_SERVER_ERROR' });
  expect(String(error.error_reason)).toMatch(/^Failed to send email/);
  expect((await dataLayerEvents(page)).some((e) => e.event === 'generate_lead')).toBe(false);
});

test('a message under 10 characters is stopped in the browser, and the server keeps the input when it rejects one', async ({ page }) => {
  // Quotes and angle brackets prove the kept values are escaped, not injected.
  const short = { name: 'Ada "Countess" <Lovelace>', email: visitor.email, message: 'Hi Henrik' };
  const emails = watchEmails(PASSES);
  const posts: string[] = [];
  page.on('request', (req) => {
    if (req.method() === 'POST') posts.push(req.url());
  });

  await submitForm(page, PASSES, short);
  const tooShort = await page
    .getByLabel('Message')
    .evaluate((el: HTMLTextAreaElement) => el.validity.tooShort);
  expect(tooShort, 'the browser did not flag the message as too short').toBe(true);
  expect(posts, 'the browser posted a message the server rejects').toEqual([]);

  // A client that skips the browser's check still gets the server's.
  const token = await page.locator('input[name="cf-turnstile-response"]').inputValue();
  await page.locator('form.contact-form').evaluate((form: HTMLFormElement) => {
    form.noValidate = true;
  });
  const response = page.waitForResponse((res) => res.request().method() === 'POST');
  await page.getByRole('button', { name: 'Send Message' }).click();
  expect(await (await response).text(), 'the Turnstile token was echoed').not.toContain(token);

  await expect(page.getByText('Please check your input.')).toBeVisible();
  await expect(page.getByText('Message must be at least 10 characters')).toBeVisible();
  expect(emails.sent()).toEqual([]);
  await expectFieldsKept(page, short);

  const error = await pushed(page, 'form_error');
  expect(error).toMatchObject({
    error_type: 'validation',
    error_code: 'BAD_REQUEST',
    error_fields: 'message',
  });
});

test.describe('the synthetic check used against production', () => {
  // Port 8802's always-fail secret answers siteverify exactly as a valid
  // production secret answers a dummy token: `invalid-input-response`.
  const post = (page: Page, headers: Record<string, string>) =>
    page.request.post(`http://127.0.0.1:${BOT}/_actions/contact`, {
      headers: { Origin: `http://127.0.0.1:${BOT}`, ...headers },
      form: { ...visitor, 'cf-turnstile-response': 'synthetic-check' },
    });

  test('is accepted with the token and emails only the filtered alias', async ({ page }) => {
    const emails = watchEmails(BOT);
    const res = await post(page, { 'X-Synthetic-Check': 'e2e-synthetic-token' });
    expect(res.status(), await res.text()).toBe(200);
    expect((await emails.one()).to).toBe('admin+synthetic@henriksoderlund.com');
  });

  test('is refused with a wrong token and sends nothing', async ({ page }) => {
    const emails = watchEmails(BOT);
    const res = await post(page, { 'X-Synthetic-Check': 'guessed' });
    expect(res.status()).toBe(403);
    expect(emails.sent()).toEqual([]);
  });
});
