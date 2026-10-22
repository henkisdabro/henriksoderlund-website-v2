import { handle } from '@astrojs/cloudflare/handler';
import { markdownTwinPath } from './utils/pageUrl';

// 'unsafe-eval' in script-src is deliberate, not an oversight: the GTM
// container has a Custom JavaScript variable (cjs - hit timestamp), and GTM
// evaluates those with eval, so without it they resolve to undefined
// (https://developers.google.com/tag-platform/security/guides/csp). Rebuilding
// that variable as a custom template is what would let this go. 'strict-dynamic'
// still prevents unauthorised script injection, the separate attack surface.
//
// img-src names only what loads images: GA4 and GTM image fallbacks, the
// gstatic hosts Tag Assistant preview needs, and the GitHub contribution chart
// on /builds. It was briefly any https: origin, for the Google Signals /
// personalised-ads beacon (/ads/ga-audiences on the visitor's regional Google
// domain, which CSP cannot wildcard). Signals and the Ads link's personalised
// advertising are both off in GA4, so that beacon should not be sent; if it
// comes back it is blocked here, which is the intended outcome.
const CSP_TEMPLATE = [
  "default-src 'self'",
  "script-src '%%NONCE%%' 'strict-dynamic' https://tagmanager.google.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https: 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://*.g.doubleclick.net https://*.google.com https://cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com https://www.googletagmanager.com",
  "img-src 'self' data: https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://ghchart.rshah.org",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com https://calendly.com",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "object-src 'none'",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
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
  '/content/education': '/work-experience',
  '/content/consultation': '/consultancy',
  '/consultation': '/consultancy',
  '/about': '/',
  '/skills.html': '/expertise',
  '/work-experience.html': '/work-experience',
  '/education.html': '/work-experience',
  '/education': '/work-experience',
  '/education.md': '/work-experience.md',
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

// Google tag gateway, self-served (Google's manual setup). /wro1/ is the
// measurement path for GTM-KM56HHS2: the container loads from it and GA4 hits
// post to it, and this forwards both to Google's origin, fps.goog, which reads
// the measurement path from the URL, so path and query stay as they are.
// Cloudflare's dashboard integration for the gateway must stay off: when on,
// its edge answers /wro1/ ahead of this Worker and injects unnonced scripts.
const TAG_PATH = '/wro1/';
const TAG_ID = 'GTM-KM56HHS2';

const isAscii = (v: unknown): v is string => typeof v === 'string' && /^[\x20-\x7e]+$/.test(v);

function tagGateway(request: Request, url: URL): Promise<Response> {
  const target = new URL(url.pathname + url.search, 'https://fps.goog');
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('X-Gtg-Implementation', 'Snippet');
  headers.set('X-Gtg-Tag-Id', TAG_ID);
  // Set rather than appended, so a client-sent chain is dropped.
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) headers.set('X-Forwarded-For', ip);
  else headers.delete('X-Forwarded-For');
  // Google prefers X-Forwarded-CountryRegion over the country/region pair
  // below, so a client-sent copy would override the real location.
  headers.delete('X-Forwarded-CountryRegion');
  // Every geo value is optional, and a header value must be ASCII, so a city
  // like Zürich is left out rather than sent mangled. XX is an unknown
  // country and T1 is Tor.
  const { country, regionCode, latitude, longitude, city } = request.cf ?? ({} as Partial<IncomingRequestCfProperties>);
  const knownCountry = isAscii(country) && country !== 'XX' && country !== 'T1';
  const geo = [
    isAscii(latitude) && isAscii(longitude) && `latlong=${latitude},${longitude}`,
    isAscii(city) && `city=${city.replace(/[;,]/g, ' ')}`,
  ]
    .filter(Boolean)
    .join(';');
  for (const [name, value] of [
    ['X-Forwarded-Country', knownCountry && country],
    ['X-Forwarded-Region', knownCountry && regionCode],
    ['X-Forwarded-Geolocation', geo],
  ] as const) {
    if (isAscii(value)) headers.set(name, value);
    else headers.delete(name);
  }
  // Passed straight through: Google's status, redirects (it sometimes falls
  // back to googletagmanager.com), encoding and cookies all reach the browser
  // untouched. Never cached here - the container is per-region - and a POST is
  // never retried, as a failed hit may already have been counted.
  return fetch(target, {
    method: request.method,
    headers,
    body: request.body,
    redirect: 'manual',
    cache: 'no-store',
  }).catch((error) => {
    // Without this an unreachable fps.goog surfaces as Cloudflare's 1101 page.
    console.error('Tag gateway fetch failed', url.pathname, error);
    return new Response(null, { status: 502 });
  });
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

    // Ahead of everything below: the trailing-slash redirect would bounce
    // /wro1/ itself, and the HTML handling must not touch Google's responses.
    if (url.pathname.startsWith(TAG_PATH)) return tagGateway(request, url);

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

    // Markdown for Agents: a page with a markdown twin serves that twin at its
    // own URL to a request whose Accept names text/markdown. Browsers never
    // send it, so they still get HTML.
    const twin = markdownTwinPath(url.pathname);
    const wantsMarkdown =
      twin !== null &&
      (request.method === 'GET' || request.method === 'HEAD') &&
      /text\/markdown/i.test(request.headers.get('accept') ?? '');

    let response: Response;
    try {
      response = await handle(wantsMarkdown ? new Request(new URL(twin, url), request) : request, env, ctx);
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
    if (twin) headers.append('Vary', 'Accept');

    // Prerendered pages and text endpoints come from the asset binding, which
    // sends a bare media type and drops the charset their source set.
    if (/^text\/(html|plain|markdown)\s*$/i.test(contentType)) {
      headers.set('Content-Type', `${contentType}; charset=utf-8`);
    }

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
      // describedby and the markdown alternate point agents at the plain-text
      // versions (RFC 8288).
      if (response.status >= 200 && response.status < 300) {
        const links = ['</llms.txt>; rel="describedby"; type="text/plain"'];
        if (twin) links.push(`<${twin}>; rel="alternate"; type="text/markdown"`);
        if (request.headers.get('host') === 'www.henriksoderlund.com') {
          links.unshift(`<https://www.henriksoderlund.com${url.pathname}>; rel="canonical"`);
        }
        headers.set('Link', links.join(', '));
      }

      const nonce = crypto.randomUUID();
      headers.set('Content-Security-Policy', buildCSP(nonce));
      // HTML carries a per-request nonce, so no cache may ever answer a
      // request for it. CDN-Cache-Control: no-store keeps Cloudflare's edge
      // from storing it. The browser gets private, no-cache instead of
      // no-store: it may keep the page, which is what the back/forward cache
      // needs, but must come back here before reusing it. HTML has no ETag or
      // Last-Modified, so that trip is always a full 200 with a fresh nonce,
      // never a 304 onto an old body. A bfcache restore re-parses nothing,
      // so the restored page's nonce is no more exposed than it was in use.
      headers.set('Cache-Control', 'private, no-cache');
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
