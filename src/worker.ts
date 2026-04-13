import { handle } from '@astrojs/cloudflare/handler';

const CSP_TEMPLATE = [
  "default-src 'self'",
  "script-src '%%NONCE%%' 'strict-dynamic' https://*.fouanalytics.com https://api.fouanalytics.com https://sgtm.henriksoderlund.com https://load.sgtm.henriksoderlund.com https://tagmanager.google.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https: 'unsafe-inline'",
  "connect-src 'self' https://*.fouanalytics.com https://api.fouanalytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://sgtm.henriksoderlund.com https://load.sgtm.henriksoderlund.com https://stats.g.doubleclick.net https://apix.b2c.com https://cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com https://www.googletagmanager.com",
  "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://ssl.gstatic.com https://www.gstatic.com *.google.com *.google.com.au https://ghchart.rshah.org https://api.fouanalytics.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self' https://sgtm.henriksoderlund.com https://load.sgtm.henriksoderlund.com https://www.googletagmanager.com https://challenges.cloudflare.com",
  "worker-src 'self' blob: https://sgtm.henriksoderlund.com",
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

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Wildcard redirect for legacy blog paths (Astro redirects can't use [...slug] on Cloudflare)
    if (url.pathname.startsWith('/blog/')) {
      url.pathname = '/';
      const redirectResponse = Response.redirect(url.toString(), 301);
      const redirectHeaders = new Headers(redirectResponse.headers);
      setSecurityHeaders(redirectHeaders);
      return new Response(null, { status: 301, headers: redirectHeaders });
    }

    const response = await handle(request, env, ctx);
    const contentType = response.headers.get('content-type') || '';
    const headers = new Headers(response.headers);
    setSecurityHeaders(headers);
    headers.delete('speculation-rules');

    // Canonical Link header: pathname only (no query params), skip for non-2xx responses
    const host = request.headers.get('host');
    if (host === 'www.henriksoderlund.com' && response.status >= 200 && response.status < 300) {
      headers.set('Link', `<https://www.henriksoderlund.com${url.pathname}>; rel="canonical"`);
    }

    // Prevent search engines from indexing text/markdown and text/plain endpoints
    if (contentType.includes('text/markdown') || contentType.includes('text/plain')) {
      headers.set('X-Robots-Tag', 'noindex');
    }

    if (contentType.includes('text/html')) {
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
  },
};
