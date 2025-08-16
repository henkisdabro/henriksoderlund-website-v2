import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import type { Context } from "hono";

const app = new Hono<{ Bindings: Env }>();

// Enhanced security headers middleware
app.use('*', async (c, next) => {
  await next();
  
  // Security headers
  c.header('X-Frame-Options', 'DENY');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  c.header('X-XSS-Protection', '1; mode=block');
  
  // HSTS for HTTPS (only set on HTTPS to avoid warnings)
  const requestUrl = new URL(c.req.url);
  if (requestUrl.protocol === 'https:' || c.req.header('cf-visitor')?.includes('https')) {
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // CSP for enhanced security
  c.header('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );
  
  // Add canonical URL for SEO
  if (requestUrl.hostname === 'www.henriksoderlund.com') {
    c.header('Link', `<${c.req.url}>; rel="canonical"`);
  }
});

// Request timing and logging
app.use('*', timing());
app.use('*', logger());

// CORS configuration
app.use('*', cors({
  origin: ['https://www.henriksoderlund.com', 'https://henriksoderlund.com'],
  allowMethods: ['GET', 'HEAD', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Accept'],
  maxAge: 86400
}));

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// Helper function for error handling with improved caching
const handleAssetFetch = async (c: Context, url: string, contentType: string, cacheControl: string = 'public, max-age=3600') => {
  try {
    const asset = await c.env.ASSETS.fetch(url);
    
    if (!asset.ok) {
      if (asset.status === 404) {
        return c.notFound();
      }
      console.error(`Asset fetch failed: ${asset.status} for ${url}`);
      return c.text('Service temporarily unavailable', 503, {
        'Retry-After': '300'
      });
    }
    
    // Get original asset headers for better caching
    const assetLastModified = asset.headers.get('last-modified');
    const assetETag = asset.headers.get('etag');
    
    // Check client cache headers
    const ifNoneMatch = c.req.header('if-none-match');
    const ifModifiedSince = c.req.header('if-modified-since');
    
    // Return 304 if client has current version
    if ((ifNoneMatch && ifNoneMatch === assetETag) || 
        (ifModifiedSince && assetLastModified && ifModifiedSince === assetLastModified)) {
      return c.body(null, 304);
    }
    
    const content = contentType.includes('text') || contentType.includes('json') 
      ? await asset.text() 
      : await asset.arrayBuffer();
    
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': cacheControl
    };
    
    // Add cache validation headers
    if (assetLastModified) {
      headers['Last-Modified'] = assetLastModified;
    }
    if (assetETag) {
      headers['ETag'] = assetETag;
    } else {
      // Generate stable ETag based on content hash
      const contentStr = typeof content === 'string' ? content : 'binary';
      const hash = btoa(url + contentStr.length).slice(0, 16);
      headers['ETag'] = `"${hash}"`;
    }
    
    return contentType.includes('text') || contentType.includes('json')
      ? c.text(content, 200, headers)
      : c.body(content, 200, headers);
      
  } catch (error) {
    console.error('Asset fetch error:', error);
    return c.text('Internal server error', 500);
  }
};

// Handle favicon.ico redirect to bot.svg with enhanced error handling
app.get("/favicon.ico", async (c) => {
  const url = new URL(c.req.url);
  url.pathname = "/bot.svg";
  return handleAssetFetch(c, url.toString(), 'image/svg+xml', 'public, max-age=31536000');
});

// Handle robots.txt with proper headers
app.get("/robots.txt", async (c) => {
  return handleAssetFetch(c, c.req.url, 'text/plain; charset=utf-8', 'public, max-age=86400');
});

// Handle llms.txt specifically to ensure correct encoding
app.get("/llms.txt", async (c) => {
  return handleAssetFetch(c, c.req.url, 'text/plain; charset=utf-8', 'public, max-age=3600');
});

// Handle other text files with proper UTF-8 encoding
app.get("*.txt", async (c) => {
  return handleAssetFetch(c, c.req.url, 'text/plain; charset=utf-8');
});

// Handle markdown files with proper UTF-8 encoding
app.get("*.md", async (c) => {
  return handleAssetFetch(c, c.req.url, 'text/markdown; charset=utf-8');
});

// Handle sitemap.xml with proper headers
app.get("/sitemap.xml", async (c) => {
  return handleAssetFetch(c, c.req.url, 'application/xml; charset=utf-8', 'public, max-age=86400');
});

// Handle index.html with server-side data injection
app.get("/", async (c) => {
  try {
    const asset = await c.env.ASSETS.fetch(new URL("/index.html", c.req.url).toString());
    
    if (!asset.ok) {
      return c.notFound();
    }
    
    let html = await asset.text();
    
    // Inject Cloudflare and server-side data
    const buildTimestamp = new Date().toISOString();
    const cfCountry = c.req.header('cf-ipcountry') || 'unknown';
    const cfColo = c.req.header('cf-ipcolo') || 'unknown';
    const cfRay = c.req.header('cf-ray') || 'unknown';
    
    // Replace placeholders with actual data
    html = html.replace(/%BUILD_TIMESTAMP%/g, buildTimestamp);
    html = html.replace(/%CF_COUNTRY%/g, cfCountry);
    html = html.replace(/%CF_COLO%/g, cfColo);
    html = html.replace(/%CF_RAY%/g, cfRay);
    
    return c.html(html, 200, {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'text/html; charset=utf-8'
    });
  } catch (error) {
    console.error('Index.html processing error:', error);
    return c.text('Internal server error', 500);
  }
});

// Handle static assets with long cache times
app.get("*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}", async (c) => {
  const url = new URL(c.req.url);
  const ext = url.pathname.split('.').pop()?.toLowerCase();
  
  let contentType = 'application/octet-stream';
  switch (ext) {
    case 'js': contentType = 'application/javascript'; break;
    case 'css': contentType = 'text/css'; break;
    case 'svg': contentType = 'image/svg+xml'; break;
    case 'png': contentType = 'image/png'; break;
    case 'jpg': case 'jpeg': contentType = 'image/jpeg'; break;
    case 'gif': contentType = 'image/gif'; break;
    case 'webp': contentType = 'image/webp'; break;
    case 'woff': contentType = 'font/woff'; break;
    case 'woff2': contentType = 'font/woff2'; break;
    case 'ttf': contentType = 'font/ttf'; break;
    case 'eot': contentType = 'application/vnd.ms-fontobject'; break;
    case 'ico': contentType = 'image/x-icon'; break;
  }
  
  return handleAssetFetch(c, c.req.url, contentType, 'public, max-age=31536000, immutable');
});

// Add health check endpoint for monitoring
app.get("/health", (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'henriksoderlund-website-v2',
    version: '2.0.0',
    uptime: 'available'
  }, 200, {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
});

// Add metrics endpoint for basic monitoring
app.get("/metrics", (c) => {
  const metrics = {
    worker_name: 'henriksoderlund-website-v2',
    timestamp: new Date().toISOString(),
    cf_ray: c.req.header('cf-ray') || 'unknown',
    cf_country: c.req.header('cf-ipcountry') || 'unknown',
    cf_colo: c.req.header('cf-ipcolo') || 'unknown',
    user_agent: c.req.header('user-agent')?.substring(0, 100) || 'unknown',
    request_id: crypto.randomUUID()
  };
  
  return c.json(metrics, 200, {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
});

// Add security.txt endpoint for security researchers
app.get("/.well-known/security.txt", (c) => {
  const securityTxt = `Contact: https://www.henriksoderlund.com/consultancy
Expires: 2026-01-01T00:00:00.000Z
Preferred-Languages: en, sv
Canonical: https://www.henriksoderlund.com/.well-known/security.txt
Policy: https://www.henriksoderlund.com/
`;
  
  return c.text(securityTxt, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=86400'
  });
});

// Rate limiting helper (simple implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const rateLimit = (c: Context, limit: number = 100, windowMs: number = 60000) => {
  const clientIP = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const existing = rateLimitMap.get(clientIP);
  
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
    return false; // Not rate limited
  }
  
  if (existing.count >= limit) {
    return true; // Rate limited
  }
  
  existing.count++;
  return false; // Not rate limited
};

// Apply rate limiting to API endpoints
app.use('/api/*', async (c, next) => {
  if (rateLimit(c, 60, 60000)) { // 60 requests per minute
    return c.text('Rate limit exceeded', 429, {
      'Retry-After': '60',
      'X-RateLimit-Limit': '60',
      'X-RateLimit-Window': '60'
    });
  }
  await next();
});

app.use('/health', async (c, next) => {
  if (rateLimit(c, 30, 60000)) { // 30 requests per minute for health checks
    return c.text('Rate limit exceeded', 429, {
      'Retry-After': '60'
    });
  }
  await next();
});

app.use('/metrics', async (c, next) => {
  if (rateLimit(c, 10, 60000)) { // 10 requests per minute for metrics
    return c.text('Rate limit exceeded', 429, {
      'Retry-After': '60'
    });
  }
  await next();
});

export default app;

