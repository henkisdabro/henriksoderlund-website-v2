import { handle } from '@astrojs/cloudflare/handler';

// 'unsafe-eval' in script-src is deliberate, not an oversight: Fou Analytics'
// anti-adblock and fraud-detection scripts (https://*.fouanalytics.com) run
// eval()/new Function() for runtime integrity checks, and fail with a "blocks
// the use of 'eval'" violation without it. 'strict-dynamic' still prevents
// unauthorised script injection, which is the separate attack surface.
const CSP_TEMPLATE = [
  "default-src 'self'",
  "script-src '%%NONCE%%' 'strict-dynamic' https://*.fouanalytics.com https://api.fouanalytics.com https://tagmanager.google.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https: 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https://*.fouanalytics.com https://api.fouanalytics.com wss://api.fouanalytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://apix.b2c.com https://cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com https://www.googletagmanager.com",
  "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://stats.g.doubleclick.net https://ssl.gstatic.com https://www.gstatic.com https://fonts.gstatic.com *.google.com *.google.com.au https://ghchart.rshah.org https://api.fouanalytics.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "object-src 'none'",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

function buildCSP(nonce: string): string {
  return CSP_TEMPLATE.replace('%%NONCE%%', `nonce-${nonce}`);
}

function setSecurityHeaders(headers: Headers): void {
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  headers.set('X-Permitted-Cross-Domain-Policies', 'none');
}

// Defunct feed endpoints (Hugo-era RSS/Atom). No content equivalent on Astro site,
// so return 410 Gone rather than 301-to-homepage. Avoids Google soft-404 classification
// (redirecting to clearly-different content can be treated as soft 404).
const GONE: Set<string> = new Set([
  '/index.xml',
  '/feed',
  '/feed.xml',
  '/rss.xml',
  '/atom.xml',
]);

// Redirect map: Astro redirects config and _redirects both produce 200 rewrites on
// Cloudflare Workers (the asset binding intercepts before Astro's SSR routes), so all
// redirects must be handled here in the Worker before calling handle().
const REDIRECTS: Record<string, string> = {
  '/sitemap.xml': '/sitemap-index.xml',
  '/skills': '/expertise',
  '/skill': '/expertise',
  '/blog': '/',
  '/content/skills': '/expertise',
  '/content/work-experience': '/work-experience',
  '/content/education': '/education',
  '/content/consultation': '/consultancy',
  '/consultation': '/consultancy',
  '/about': '/',
  '/skills.html': '/expertise',
  '/work-experience.html': '/work-experience',
  '/education.html': '/education',
  '/consultation.html': '/consultancy',
  '/index.md': '/index.html.md',
};

// Campaign parameters survive a redirect; everything else is dropped. A tagged
// link that lands on a legacy path (an old /skills/ URL in a CV, say) would
// otherwise arrive at the target with no utm_* at all and be counted as Direct.
const CAMPAIGN_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'gclid',
  'gbraid',
  'wbraid',
  'msclkid',
  'fbclid',
  'ttclid',
  'li_fat_id',
]);

function keepCampaignParams(url: URL): void {
  const kept = new URLSearchParams();
  for (const [key, value] of url.searchParams) {
    if (CAMPAIGN_PARAMS.has(key)) kept.append(key, value);
  }
  url.search = kept.toString();
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Built by hand rather than with Response.redirect(): that helper returns a
    // bare response with no Strict-Transport-Security, and the HSTS preload
    // submission checker requires the base domain to emit the header on its own
    // https apex-to-www redirect. (On an http:// response the header would be
    // ignored anyway - RFC 6797 section 8.1 - so this is about preload
    // eligibility, not the first insecure visit.)
    if (url.hostname === 'henriksoderlund.com') {
      const headers = new Headers({
        Location: `https://www.henriksoderlund.com${url.pathname}${url.search}`,
      });
      setSecurityHeaders(headers);
      return new Response(null, { status: 301, headers });
    }

    // Enforce trailingSlash: 'never' (astro.config.mjs). The Cloudflare asset
    // binding serves the slash variant as 200, creating a duplicate URL with a
    // conflicting self-referential canonical Link header. 301 to the non-slash
    // form so search engines see a single canonical URL.
    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.replace(/\/+$/, '');
      // Resolve a legacy path in the same hop so /skills/ goes straight to
      // /expertise rather than chaining a second 301 through /skills.
      const slashTarget = REDIRECTS[url.pathname];
      if (slashTarget) {
        url.pathname = slashTarget;
        keepCampaignParams(url);
      }
      const headers = new Headers({ Location: url.toString() });
      setSecurityHeaders(headers);
      return new Response(null, { status: 301, headers });
    }

    // 410 Gone for defunct feed endpoints (no content equivalent)
    if (GONE.has(url.pathname)) {
      const headers = new Headers({ 'Content-Type': 'text/plain; charset=utf-8' });
      setSecurityHeaders(headers);
      headers.set('X-Robots-Tag', 'noindex');
      return new Response('410 Gone\n', { status: 410, headers });
    }

    // Handle redirects before Astro routing
    const redirectTarget = REDIRECTS[url.pathname];
    if (redirectTarget || url.pathname.startsWith('/blog/')) {
      url.pathname = redirectTarget || '/';
      keepCampaignParams(url);
      const headers = new Headers({ Location: url.toString() });
      setSecurityHeaders(headers);
      return new Response(null, { status: 301, headers });
    }

    let response: Response;
    try {
      response = await handle(request, env, ctx);
    } catch (error) {
      // Synchronous and pre-stream failures only - routing errors and anything
      // that throws before handle() resolves. Under output: 'server' Astro
      // streams, so a component throwing during render throws inside the body
      // stream, after these headers have gone out; HTMLRewriter parse/handler
      // errors surface the same way while workerd pumps the body. Neither lands
      // here, and a throw after the body starts streaming still terminates the
      // response mid-flight. What this does buy is that the failures it does
      // catch return a proper 500 with security headers instead of Cloudflare's
      // Error 1101 page. Note it also turns a Worker exception into a normal
      // response, so alerts keyed on the Workers exception metric go quiet -
      // console.error plus observability.enabled keeps the signal in the logs.
      console.error('Worker fetch handler error', url.pathname, error);
      const headers = new Headers({ 'Content-Type': 'text/plain; charset=utf-8' });
      setSecurityHeaders(headers);
      return new Response('500 Internal Server Error\n', { status: 500, headers });
    }

    const contentType = response.headers.get('content-type') || '';
    const headers = new Headers(response.headers);
    setSecurityHeaders(headers);
    headers.delete('speculation-rules');

    // Machine-readable endpoints (markdown twins, llms.txt, /health, /metrics)
    // are never search results.
    if (
      contentType.includes('text/markdown') ||
      contentType.includes('text/plain') ||
      contentType.includes('application/json')
    ) {
      headers.set('X-Robots-Tag', 'noindex');
    }

    if (contentType.includes('text/html')) {
      // Canonical Link header on HTML only: pairing it with the X-Robots-Tag
      // noindex on the .md and .txt endpoints is a contradictory signal, and on
      // static assets it is merely noise. Pathname only, no query params.
      const host = request.headers.get('host');
      if (host === 'www.henriksoderlund.com' && response.status >= 200 && response.status < 300) {
        headers.set('Link', `<https://www.henriksoderlund.com${url.pathname}>; rel="canonical"`);
      }

      const nonce = crypto.randomUUID();
      headers.set('Content-Security-Policy', buildCSP(nonce));
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      headers.set('CDN-Cache-Control', 'no-store');

      const prepared = new Response(response.body, {
        status: response.status,
        headers,
      });

      // Only scripts the site authored carry `data-csp`. Noncing every script
      // element would also nonce an injected one, leaving 'strict-dynamic'
      // with nothing to enforce. The marker is left in place: this Worker
      // also runs inside workerd during prerendering, and stripping it there
      // would leave the built HTML with no scripts to nonce at runtime.
      // scripts/verify-build.mjs fails the build on any unmarked script.
      return new HTMLRewriter()
        .on('script[data-csp]', {
          element(el) {
            el.setAttribute('nonce', nonce);
          },
        })
        .transform(prepared);
    }

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
