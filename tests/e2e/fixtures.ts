import { test as base, type Page } from '@playwright/test';

type Violation = { directive: string; blocked: string; script: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    __cspViolations?: Violation[];
  }
}

// Cloudflare's Google tag gateway injects its own loader at the edge, after
// the Worker, so it never gets a nonce and the CSP blocks it. "Set up tag" is
// off in the dashboard, but a known Cloudflare bug keeps injecting anyway
// (same on ascribe.to). Blocking it is harmless - the site loads GTM itself -
// so only those two scripts are ignored, recognised by content rather than a
// hash, which would pin bytes Cloudflare controls.
const CLOUDFLARE_GATEWAY_LOADER = /google_tags_first_party|'set', 'developer_id\./;

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

/** CSP violations on the page, minus Cloudflare's injected gateway loader. */
export const cspViolations = async (page: Page) =>
  (await page.evaluate(() => window.__cspViolations ?? []))
    .filter((v) => !(v.blocked === 'inline' && CLOUDFLARE_GATEWAY_LOADER.test(v.script)))
    .map((v) => `${v.directive} ${v.blocked}${v.script ? `: ${v.script.slice(0, 80)}` : ''}`);
