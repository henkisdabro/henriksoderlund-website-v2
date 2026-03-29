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

function setSecurityHeaders(headers: Headers, request: Request): void {
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  const host = request.headers.get('host');
  if (host === 'www.henriksoderlund.com') {
    headers.set('Link', `<${request.url}>; rel="canonical"`);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const response = await handle(request, env, ctx);
    const contentType = response.headers.get('content-type') || '';
    const headers = new Headers(response.headers);
    setSecurityHeaders(headers, request);

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
