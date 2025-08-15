import { Hono } from "hono";

type Variables = {
  nonce: string;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// CSP Nonce middleware - runs on ALL requests
app.use('*', async (c, next) => {
  // Generate unique nonce for this request
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  
  // Store nonce for later use
  c.set('nonce', nonce);
  
  await next();
  
  // Only process HTML responses for nonce injection
  const contentType = c.res.headers.get('content-type');
  console.log('Request URL:', c.req.path);
  console.log('Content-Type:', contentType);
  console.log('Response status:', c.res.status);
  
  if (contentType && contentType.includes('text/html')) {
    // Read HTML content
    const html = await c.res.text();
    console.log('HTML contains placeholder:', html.includes('PLACEHOLDER_NONCE_VALUE'));
    console.log('Processing HTML for nonce injection...');
    
    // Inject nonce into script tags and add CSP meta tag
    const modifiedHtml = html
      // Replace Vite placeholder nonces with real nonces
      .replace(/nonce="PLACEHOLDER_NONCE_VALUE"/g, `nonce="${nonce}"`)
      // Add nonce to inline scripts that don't already have one
      .replace(/<script(?![^>]*nonce=)(?![^>]*src=)/g, `<script nonce="${nonce}"`)
      // Add nonce to inline styles that don't already have one  
      .replace(/<style(?![^>]*nonce=)(?![^>]*rel=)/g, `<style nonce="${nonce}"`)
      // Inject CSP nonce meta tag for client-side JavaScript access
      .replace(/<head>/, `<head>\n    <meta property="csp-nonce" content="${nonce}" />`);
    
    console.log('Generated nonce:', nonce);
    console.log('Modified HTML still has placeholder:', modifiedHtml.includes('PLACEHOLDER_NONCE_VALUE'));
    console.log('Modified HTML has real nonce:', modifiedHtml.includes(`nonce="${nonce}"`));
    
    // Build CSP header with nonce
    const cspHeader = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://assets.calendly.com https://static.cloudflareinsights.com https://*.fouanalytics.com https://api.fouanalytics.com https://sgtm.henriksoderlund.com https://load.sgtm.henriksoderlund.com https://tagmanager.google.com https://www.googletagmanager.com`,
      `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com https://www.googletagmanager.com`,
      "connect-src 'self' https://*.fouanalytics.com https://api.fouanalytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://sgtm.henriksoderlund.com https://stats.g.doubleclick.net ws: wss:",
      "img-src 'self' data: https://* *.google.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "frame-src 'self' https://sgtm.henriksoderlund.com https://calendly.com https://www.googletagmanager.com",
      "worker-src * blob: data:",
      "child-src * blob: data:",
      "manifest-src 'self'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    // Create response with modified HTML and security headers
    const headers = new Headers(c.res.headers);
    headers.set('Content-Security-Policy', cspHeader);
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin');
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    c.res = new Response(modifiedHtml, {
      status: c.res.status,
      headers: headers
    });
  }
});

// API routes
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// Embedded index.html content (will be replaced by build process)
const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/bot.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Henrik Söderlund | Digital Strategy Executive & Technology Leader</title>
    <meta name="description" content="The personal website of Henrik Söderlund, a Digital Strategy Executive & Technology Leader based in Perth, Australia." />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.henriksoderlund.com/" />
    <meta property="og:title" content="Henrik Söderlund | Digital Strategy Executive & Technology Leader" />
    <meta property="og:description" content="The personal website of Henrik Söderlund, a Digital Strategy Executive & Technology Leader based in Perth, Australia." />
    <meta property="og:image" content="https://www.henriksoderlund.com/henrik.jpg" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://www.henriksoderlund.com/" />
    <meta property="twitter:title" content="Henrik Söderlund | Digital Strategy Executive & Technology Leader" />
    <meta property="twitter:description" content="The personal website of Henrik Söderlund, a Digital Strategy Executive & Technology Leader based in Perth, Australia." />
    <meta property="twitter:image" content="https://www.henriksoderlund.com/henrik.jpg" />
    <meta property="csp-nonce" nonce="PLACEHOLDER_NONCE_VALUE">
    <script type="module" crossorigin src="/assets/index-CW1l79Lf.js" nonce="PLACEHOLDER_NONCE_VALUE"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-BADufKXd.css" nonce="PLACEHOLDER_NONCE_VALUE">
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>`;

// For now, we'll use Cloudflare Workers KV or a simple approach
// This is a temporary solution until we can properly integrate with the build process
app.get('*', async (c) => {
  const url = new URL(c.req.url);
  let path = url.pathname;
  
  // SPA fallback - serve index.html for client-side routes  
  if (path === '/' || (!path.includes('.') && !path.startsWith('/api'))) {
    return c.html(INDEX_HTML);
  }
  
  // For static assets, we need to use a different approach
  // Since we removed the assets binding, static files won't be served automatically
  // This is a limitation of our current test setup
  
  // Return 404 for all other requests for now
  return c.text('Asset not found - static file serving disabled for CSP nonce testing', 404);
});

export default app;