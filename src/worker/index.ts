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
  
  // CSP for enhanced security - matches _headers file with GTM additions
  c.header('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.fouanalytics.com https://api.fouanalytics.com https://sgtm.henriksoderlund.com https://load.sgtm.henriksoderlund.com https://tagmanager.google.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://unpkg.com https://calendar.google.com; " +
    "connect-src 'self' https://*.fouanalytics.com https://api.fouanalytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://sgtm.henriksoderlund.com https://load.sgtm.henriksoderlund.com https://stats.g.doubleclick.net https://apix.b2c.com ws: wss:; " +
    "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com https://www.googletagmanager.com https://calendar.google.com; " +
    "img-src 'self' data: https://* *.google.com; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "frame-src 'self' https://sgtm.henriksoderlund.com https://www.googletagmanager.com https://calendar.google.com; " +
    "worker-src * blob: data:; " +
    "child-src * blob: data:; " +
    "manifest-src 'self'; " +
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

// Crawler detection function
const isCrawler = (userAgent: string): boolean => {
  const crawlerPatterns = [
    'AhrefsBot',
    'AhrefsSiteAudit',
    'Googlebot',
    'bingbot',
    'Baiduspider',
    'facebookexternalhit',
    'Twitterbot',
    'LinkedInBot',
    'WhatsApp',
    'Slackbot',
    'DuckDuckBot',
    'YandexBot',
    'SemrushBot',
    'MJ12bot',
    'DotBot',
    'rogerbot'
  ];
  
  const ua = userAgent.toLowerCase();
  return crawlerPatterns.some(pattern => ua.includes(pattern.toLowerCase()));
};

// Pre-rendered content for different routes
const getPrerenderedContent = (path: string): { title: string; content: string; links: string[] } => {
  const baseLinks = [
    '<a href="https://initiative.com/" target="_blank" rel="noopener noreferrer">Initiative</a>',
    '<a href="https://kinesso.com" target="_blank" rel="noopener noreferrer">KINESSO</a>',
    '<a href="https://www.interpublic.com/" target="_blank" rel="noopener noreferrer">Interpublic Group</a>',
    '<a href="https://www.cremedigital.com?utm_source=www.henriksoderlund.com&utm_medium=referral" target="_blank" rel="noopener noreferrer">Creme Digital</a>',
    '<a href="/expertise">Explore My Expertise</a>',
    '<a href="https://www.linkedin.com/in/henriksoderlund/" target="_blank" rel="noopener noreferrer">LinkedIn</a>',
    '<a href="https://github.com/henkisdabro" target="_blank" rel="noopener noreferrer">GitHub</a>'
  ];

  switch (path) {
    case '/':
    case '/index.html':
      return {
        title: 'Henrik Söderlund - Technology Leader & AI Innovator',
        content: `
          <h1>Henrik Söderlund</h1>
          <p class="lead">Digital Media Leader & AI Solutions Expert. Former agency founder now architecting performance marketing solutions through automation, advanced analytics, and strategic team development in enterprise environments.</p>
          
          <h2>Hello! 👋🏼</h2>
          <p>I'm Henrik Söderlund, a technology leader responsible for media activations at Initiative Perth (KINESSO, Interpublic Group). After founding and scaling the award-winning Creme Digital, I transitioned into senior leadership roles where I architect measurement solutions and guide high-performance teams across programmatic and performance marketing channels.</p>
          
          <p>With an inherent drive for optimisation and systematic thinking, I've built my career on developing sophisticated systems and automation workflows that transform how teams operate—from advanced analytics and server-side implementations to, more recently, intelligent AI-powered solutions that deliver measurable results at scale.</p>
          
          <p>Beyond technical innovation, my leadership approach centres on developing high-performing teams and cultivating lasting client relationships. Throughout my career, I've successfully rebuilt teams during challenging transitions, mentored 20+ professionals, and delivered compelling presentations that have secured major partnerships.</p>
        `,
        links: baseLinks
      };

    case '/expertise':
      return {
        title: 'Expertise - Henrik Söderlund',
        content: `
          <h1>Expertise</h1>
          
          <h2>🚀 Strategic Technology Leadership & AI Innovation</h2>
          <p>As a senior technology leader, I architect comprehensive solutions that bridge cutting-edge AI capabilities with practical business outcomes. My expertise spans building intelligent automation systems, developing advanced measurement frameworks, and leading cross-functional teams to implement scalable technology solutions.</p>
          
          <h2>👥 Executive Leadership & People Development</h2>
          <p>With extensive experience in executive leadership, I build, mentor, and guide high-performance teams while maintaining exceptional client relationships and stakeholder engagement. My leadership philosophy combines systematic people development with strategic business alignment.</p>
          
          <h2>🛠️ Technical Expertise & Platform Mastery</h2>
          <p>Comprehensive technical skills spanning analytics platforms, programming languages, cloud infrastructure, and AI/ML technologies. Expert in Google Analytics, Google Ads, Meta platforms, Python, React, and cloud computing solutions.</p>
          
          <h2>📊 Advanced Dashboard & Analytics Solutions</h2>
          <p>Specialist in creating sophisticated measurement and reporting solutions. Built advanced Campaign & Website Performance Dashboards in Looker Studio with real-time analytics and conversion tracking.</p>
        `,
        links: baseLinks.concat([
          '<a href="https://github.com/henkisdabro/claude-computer-use-macos" target="_blank" rel="noopener noreferrer">Claude Computer Use macOS</a>',
          '<a href="https://github.com/henkisdabro/aws-cost-allocation-automation" target="_blank" rel="noopener noreferrer">AWS Cost Allocation Automation</a>',
          '<a href="https://github.com/henkisdabro/ga4-server-side-tracking-gtm" target="_blank" rel="noopener noreferrer">GA4 Server-Side Tracking GTM</a>'
        ])
      };

    case '/work-experience':
      return {
        title: 'Work Experience - Henrik Söderlund',
        content: `
          <h1>Work Experience</h1>
          
          <h2>🇦🇺 Senior Media Activation Lead</h2>
          <p class="dates">May 2023–Present</p>
          <p>Initiative Perth, Kinesso, Interpublic Group - Perth, Australia</p>
          <p>Leading strategic technology initiatives and media activation solutions for enterprise clients. Architecting measurement frameworks and developing AI-powered automation systems.</p>
          
          <h2>🇦🇺 Founder & Managing Director</h2>
          <p class="dates">Jan 2018–Apr 2023</p>
          <p>Creme Digital - Perth, Australia</p>
          <p>Founded and scaled award-winning digital marketing agency to 15+ team members. Secured major enterprise clients and delivered innovative measurement solutions. Recognised as Advertising+Marketing AOTY Best Local Media Agency 2021.</p>
          
          <h2>🇸🇬 Digital Marketing Manager</h2>
          <p class="dates">Jul 2016–Dec 2017</p>
          <p>Envato - Singapore</p>
          <p>Led digital marketing initiatives for Southeast Asian markets. Implemented advanced analytics and attribution models across multiple product lines.</p>
        `,
        links: baseLinks
      };

    case '/education':
      return {
        title: 'Education - Henrik Söderlund',
        content: `
          <h1>Education</h1>
          
          <h2>🇸🇪 Tertiary Education</h2>
          <p class="dates">1999–2006</p>
          <p>Master of Music [M.Mus.] Instrument: Trombone at Lund University - Malmö, Sweden</p>
          
          <h2>🇸🇪 Secondary Education</h2>
          <p class="dates">1996–1999</p>
          <p>Natural Sciences at Kattegattgymnasiet - Malmö, Sweden</p>
          
          <h2>🇸🇪 Primary Education</h2>
          <p class="dates">1987–1996</p>
          <p>Elementary at Örjanskolan - Halmstad, Sweden</p>
        `,
        links: baseLinks
      };

    case '/consultancy':
      return {
        title: 'Strategic AI & Analytics Consultancy - Henrik Söderlund',
        content: `
          <h1>Strategic AI & Analytics Consultancy</h1>
          
          <h2>🤖 AI Strategy & Implementation Consulting</h2>
          <p>Comprehensive AI consultancy services designed to transform your business operations through intelligent automation and advanced analytics. From strategic feasibility assessments to full-scale implementation and training.</p>
          
          <h2>📊 Advanced Analytics & Measurement Solutions</h2>
          <p>Enterprise-grade analytics consulting specialising in attribution modeling, advanced reporting, and comprehensive measurement frameworks. Expert in Google Analytics 4, server-side tracking, and custom dashboard development.</p>
          
          <h2>💼 Proven Track Record</h2>
          <p>Successfully delivered AI automation solutions resulting in 73% efficiency improvements, 89% accuracy in predictive models, and comprehensive team upskilling programs.</p>
        `,
        links: baseLinks.concat([
          '<a href="https://calendly.com/henriksoederlund/30min" target="_blank" rel="noopener noreferrer">Book a consultation</a>'
        ])
      };

    default:
      return {
        title: 'Henrik Söderlund - Technology Leader & AI Innovator',
        content: `
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist. Return to the homepage to explore AI consulting, technology leadership, and professional expertise.</p>
        `,
        links: ['<a href="/">Return to Homepage</a>']
      };
  }
};

// Handle index.html with server-side data injection and crawler content
const handleIndexWithInjection = async (c: Context) => {
  try {
    const asset = await c.env.ASSETS.fetch(new URL("/index.html", c.req.url).toString());
    
    if (!asset.ok) {
      console.error('Failed to fetch index.html:', asset.status);
      return c.notFound();
    }
    
    let html = await asset.text();
    
    // Inject Cloudflare and server-side data
    const buildTimestamp = new Date().toISOString();
    const cfCountry = c.req.header('cf-ipcountry') || 'unknown';
    const cfColo = c.req.header('cf-ipcolo') || 'unknown';
    const cfRay = c.req.header('cf-ray') || 'unknown';
    
    console.log('Injecting CF data:', { cfCountry, cfColo, cfRay });
    
    // Replace placeholders with actual data
    html = html.replace(/%BUILD_TIMESTAMP%/g, buildTimestamp);
    html = html.replace(/%CF_COUNTRY%/g, cfCountry);
    html = html.replace(/%CF_COLO%/g, cfColo);
    html = html.replace(/%CF_RAY%/g, cfRay);
    
    // Check if this is a crawler request
    const userAgent = c.req.header('user-agent') || '';
    const crawlerDetected = isCrawler(userAgent);
    
    if (crawlerDetected) {
      console.log('Crawler detected:', userAgent);
      
      // Get the current path for content injection
      const url = new URL(c.req.url);
      const path = url.pathname;
      const prerendered = getPrerenderedContent(path);
      
      // Inject crawler-friendly content into the HTML
      const crawlerContent = `
        <div id="root">
          <div class="app">
            <main class="main-content">
              ${prerendered.content}
            </main>
            <nav class="crawler-nav">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/expertise">Expertise</a></li>
                <li><a href="/work-experience">Work Experience</a></li>
                <li><a href="/education">Education</a></li>
                <li><a href="/consultancy">Consultancy</a></li>
              </ul>
            </nav>
            <div class="external-links">
              ${prerendered.links.join(' ')}
            </div>
          </div>
        </div>
      `;
      
      // Replace the empty root div with crawler content
      html = html.replace('<div id="root"></div>', crawlerContent);
      
      // Update title for specific pages
      if (path !== '/' && path !== '/index.html') {
        html = html.replace(
          /<title>.*?<\/title>/,
          `<title>${prerendered.title}</title>`
        );
      }
      
      console.log('Serving pre-rendered content to crawler for path:', path);
    }
    
    // Use c.body instead of c.html to have full control over Content-Type header
    return c.body(html, 200, {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'text/html; charset=utf-8'
    });
  } catch (error) {
    console.error('Index.html processing error:', error);
    return c.text('Internal server error', 500);
  }
};

app.get("/", handleIndexWithInjection);
app.get("/index.html", handleIndexWithInjection);

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

// Catch-all route for SPA routing - must be last
app.all("*", async (c) => {
  const url = new URL(c.req.url);
  console.log('Catch-all route hit:', url.pathname);
  
  // Check if this is a static asset request
  const isAsset = url.pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|ico|txt|xml|md)$/i);
  
  if (isAsset) {
    // Try to serve as static asset first
    try {
      const asset = await c.env.ASSETS.fetch(c.req.url);
      if (asset.ok) {
        return asset;
      }
    } catch (error) {
      console.error('Asset fetch failed:', error);
      return c.notFound();
    }
  }
  
  // For page routes (SPA), serve index.html with data injection
  console.log('Serving SPA route with injection:', url.pathname);
  return handleIndexWithInjection(c);
});

export default app;

