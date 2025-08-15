export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Generate unique nonce for this request
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
    
    // Handle API routes first
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/') {
        return Response.json({ name: "Cloudflare" });
      }
    }
    
    // Get the static asset response from Cloudflare Workers
    // This uses the assets configuration in wrangler.json
    const response = await env.ASSETS.fetch(request);
    
    // Only process HTML responses for nonce injection
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      
      // Read HTML content
      const html = await response.text();
      
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
      const headers = new Headers(response.headers);
      headers.set('Content-Security-Policy', cspHeader);
      headers.set('X-Frame-Options', 'SAMEORIGIN');
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('Referrer-Policy', 'strict-origin');
      headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      
      return new Response(modifiedHtml, {
        status: response.status,
        headers: headers
      });
    }
    
    // For non-HTML responses, return as-is
    return response;
  }
};
