import { handle } from '@astrojs/cloudflare/handler';

const SGTM_ORIGIN = 'https://sgtm.henriksoderlund.com';
const SGTM_HOST = 'sgtm.henriksoderlund.com';
const SGTM_PROXY_PREFIX = '/sgtm/';

// 'unsafe-eval' in script-src is deliberate, not an oversight: Fou Analytics'
// anti-adblock and fraud-detection scripts (https://*.fouanalytics.com) run
// eval()/new Function() for runtime integrity checks, and fail with a "blocks
// the use of 'eval'" violation without it. 'strict-dynamic' still prevents
// unauthorised script injection, which is the separate attack surface.
const CSP_TEMPLATE = [
  "default-src 'self'",
  "script-src '%%NONCE%%' 'strict-dynamic' https://*.fouanalytics.com https://api.fouanalytics.com https://load.sgtm.henriksoderlund.com https://tagmanager.google.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https: 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https://*.fouanalytics.com https://api.fouanalytics.com wss://api.fouanalytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://load.sgtm.henriksoderlund.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://apix.b2c.com https://cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com https://www.googletagmanager.com",
  "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://load.sgtm.henriksoderlund.com https://stats.g.doubleclick.net https://ssl.gstatic.com https://www.gstatic.com https://fonts.gstatic.com *.google.com *.google.com.au https://ghchart.rshah.org https://api.fouanalytics.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self' https://load.sgtm.henriksoderlund.com https://www.googletagmanager.com https://challenges.cloudflare.com",
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

// Defensive, not observed: probing the proxied endpoints (/sgtm/healthy,
// /sgtm/gtm.js, /sgtm/gtag/js) in production returned no Set-Cookie at all, and
// this is a no-op if none is ever set. Should the container start emitting one
// scoped to sgtm.henriksoderlund.com, a browser would silently reject it when
// served back from www.henriksoderlund.com/sgtm/* - nothing errors, measurement
// just degrades. Strip the Domain attribute rather than widening it to
// .henriksoderlund.com: widening sends the cookie to every subdomain, including
// load.sgtm.henriksoderlund.com, which this file's own CSP allows as a direct
// unproxied script/connect source, and lets any subdomain shadow it. With no
// Domain the cookie defaults to host-only on www.henriksoderlund.com, which is
// what a first-party proxy wants. getSetCookie() splits per header, so the comma
// in Expires cannot mis-split; the leading ';' anchor keeps a cookie VALUE
// containing "Domain=" from matching; the global flag clears a malformed
// duplicate Domain. Cookies with no Domain (including __Host- prefixed ones) pass
// through byte-identical.
function stripCookieDomain(source: Headers, headers: Headers): void {
  const cookies = source.getSetCookie();
  if (cookies.length === 0) return;
  headers.delete('Set-Cookie');
  for (const cookie of cookies) {
    headers.append('Set-Cookie', cookie.replace(/;\s*Domain\s*=[^;]*/gi, ''));
  }
}

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

    // Proxy sGTM requests for same-origin tracking and service worker registration.
    // Strips /sgtm/ prefix and forwards to the sGTM server container with Stape headers.
    if (url.pathname.startsWith(SGTM_PROXY_PREFIX)) {
      const targetPath = '/' + url.pathname.slice(SGTM_PROXY_PREFIX.length);
      const proxyRequest = new Request(SGTM_ORIGIN + targetPath + url.search, request);
      proxyRequest.headers.set('Host', SGTM_HOST);
      proxyRequest.headers.set('X-From-Cdn', 'cf-stape');
      const clientIP = request.headers.get('CF-Connecting-IP');
      if (clientIP) {
        proxyRequest.headers.set('X-Forwarded-For', clientIP);
      }

      const proxyResponse = await fetch(proxyRequest);

      // nosniff only. The full setSecurityHeaders() set (CORP/COOP and the rest)
      // would break the tracking endpoints; without nosniff, a mistyped response
      // from the container executes as same-origin script against site cookies.
      const headers = new Headers(proxyResponse.headers);
      headers.set('X-Content-Type-Options', 'nosniff');
      stripCookieDomain(proxyResponse.headers, headers);

      if (targetPath.startsWith('/_/service_worker/')) {
        headers.set('Service-Worker-Allowed', '/');
      }

      return new Response(proxyResponse.body, {
        status: proxyResponse.status,
        statusText: proxyResponse.statusText,
        headers,
      });
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

    try {
      const response = await handle(request, env, ctx);
      const contentType = response.headers.get('content-type') || '';
      const headers = new Headers(response.headers);
      setSecurityHeaders(headers);
      headers.delete('speculation-rules');

      // Prevent search engines from indexing text/markdown and text/plain endpoints
      if (contentType.includes('text/markdown') || contentType.includes('text/plain')) {
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

        return new HTMLRewriter()
          .on('script:not([type="application/ld+json"])', {
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
  },
};
