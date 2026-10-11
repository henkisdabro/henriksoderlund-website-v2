import { test as base, type Page } from '@playwright/test';

type Violation = { directive: string; blocked: string; script: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    __cspViolations?: Violation[];
  }
}

export { expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Nothing reaches Google or Fou Analytics: every run would otherwise count
    // as a real visit, and the contact test as a real lead. The dataLayer
    // still fills, and that is what the assertions read.
    await page.route(
      /googletagmanager\.com|google-analytics\.com|fouanalytics\.com|cloudflareinsights\.com|\/wro1\//,
      (route) => route.abort()
    );
    await page.addInitScript(() => {
      window.__cspViolations = [];
      document.addEventListener('securitypolicyviolation', (e) => {
        window.__cspViolations?.push({
          directive: e.violatedDirective,
          blocked: e.blockedURI,
          script: e.target instanceof HTMLScriptElement ? (e.target.textContent ?? '') : '',
        });
      });
    });
    await use(page);
  },
});

/** Site-pushed dataLayer events, GTM's own `gtm.*` lifecycle events left out. */
export const dataLayerEvents = (page: Page) =>
  page.evaluate(() =>
    (window.dataLayer ?? []).filter(
      (e) => typeof e?.event === 'string' && !e.event.startsWith('gtm.')
    )
  );

/** CSP violations on the page. */
export const cspViolations = async (page: Page) =>
  (await page.evaluate(() => window.__cspViolations ?? []))
    .map((v) => `${v.directive} ${v.blocked}${v.script ? `: ${v.script.slice(0, 80)}` : ''}`);
