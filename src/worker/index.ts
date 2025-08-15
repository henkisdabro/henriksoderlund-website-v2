import { Hono } from "hono";
import { secureHeaders, NONCE } from "hono/secure-headers";

type Variables = {
  secureHeadersNonce: string;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Apply secure headers with CSP nonce for all requests
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'", 
      NONCE, 
      "https://assets.calendly.com",
      "https://static.cloudflareinsights.com",
      "https://*.fouanalytics.com",
      "https://api.fouanalytics.com",
      "https://sgtm.henriksoderlund.com",
      "https://load.sgtm.henriksoderlund.com",
      "https://tagmanager.google.com",
      "https://www.googletagmanager.com"
    ],
    styleSrc: [
      "'self'", 
      NONCE,
      "'unsafe-inline'", // Required for CSS-in-JS and inline styles
      "https://tagmanager.google.com",
      "https://fonts.googleapis.com",
      "https://www.googletagmanager.com"
    ],
    connectSrc: [
      "'self'",
      "https://*.fouanalytics.com",
      "https://api.fouanalytics.com",
      "https://*.google-analytics.com",
      "https://analytics.google.com",
      "https://*.analytics.google.com",
      "https://sgtm.henriksoderlund.com",
      "https://stats.g.doubleclick.net",
      "ws:",
      "wss:"
    ],
    imgSrc: ["'self'", "data:", "https://*", "*.google.com"],
    fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
    frameSrc: [
      "'self'",
      "https://sgtm.henriksoderlund.com",
      "https://calendly.com",
      "https://www.googletagmanager.com"
    ],
    workerSrc: ["*", "blob:", "data:"],
    childSrc: ["*", "blob:", "data:"],
    manifestSrc: ["'self'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  },
  crossOriginResourcePolicy: 'cross-origin',
  strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
  xFrameOptions: 'SAMEORIGIN',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin'
}));

// Transform HTML responses to inject nonce values
app.use('*', async (c, next) => {
  await next();
  
  // Only process HTML responses
  const contentType = c.res.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    const nonce = c.get('secureHeadersNonce');
    
    if (nonce) {
      const html = await c.res.text();
      
      // Inject nonce into scripts and styles, replace Vite placeholder nonces
      const transformedHtml = html
        // Replace Vite placeholder nonces with real nonces
        .replace(/nonce="PLACEHOLDER_NONCE_VALUE"/g, `nonce="${nonce}"`)
        // Add nonce to inline scripts without existing nonce
        .replace(/<script(?![^>]*nonce=)(?![^>]*src=)/g, `<script nonce="${nonce}"`)
        // Add nonce to inline styles without existing nonce
        .replace(/<style(?![^>]*nonce=)(?![^>]*rel=)/g, `<style nonce="${nonce}"`)
        // Inject CSP nonce meta tag for client-side access
        .replace(/<head>/, `<head>\n    <meta property="csp-nonce" content="${nonce}" />`);
      
      c.res = new Response(transformedHtml, {
        status: c.res.status,
        headers: c.res.headers
      });
    }
  }
});

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;
