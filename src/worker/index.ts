import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

// CSP Nonce implementation using Scott Helme's proven pattern
// This middleware intercepts all requests and injects nonces into static HTML
app.use('*', async (c, next) => {
  // Generate unique nonce for this request
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  
  // Continue to next handler (static assets or API routes)
  await next();
  
  // Only process HTML responses
  const contentType = c.res.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    
    // Read HTML content
    const html = await c.res.text();
    
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

export default app;
