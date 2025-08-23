import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import type { Context } from "hono";

// Import data files that React components use
import { expertiseData } from "../react-app/data/expertise";
import { workExperienceData } from "../react-app/data/workExperience";
import { consultationData } from "../react-app/data/consultation";

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

// Enhanced crawler detection using Cloudflare's native bot management
const isCrawler = (c: Context): boolean => {
  // First try Cloudflare's native bot detection (most reliable)
  try {
    const cf = c.req.raw.cf as { botManagement?: { verifiedBot?: boolean } };
    if (cf?.botManagement?.verifiedBot === true) {
      console.log('Verified bot detected via Cloudflare bot management');
      return true;
    }
  } catch {
    console.log('Cloudflare bot management not available, falling back to User-Agent');
  }
  
  // Fallback to User-Agent string matching
  const userAgent = c.req.header('user-agent') || '';
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
  const isUserAgentCrawler = crawlerPatterns.some(pattern => ua.includes(pattern.toLowerCase()));
  
  if (isUserAgentCrawler) {
    console.log('Crawler detected via User-Agent:', userAgent);
  }
  
  return isUserAgentCrawler;
};

// Helper function to remove emojis from content
const removeEmojis = (text: string): string => {
  return text
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/gu, '')
    .replace(/🚀|🛠️|👥|📊|🔗|👋🏼|🇦🇺|🇸🇬|🇸🇪|🤖|💼|📈|📱|💻|⚡|🎯|🌟|📝|🔄|📄|✅/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

// Generate content from actual data files - DO NOT MODIFY COPYWRITING WITHOUT EXPLICIT APPROVAL
const generateHomepageContent = (): string => {
  return `
    <h1>Henrik Söderlund</h1>
    <p class="lead">Digital Media Leader & AI Solutions Expert. Former agency founder now architecting performance marketing solutions through automation, advanced analytics, and strategic team development in enterprise environments.</p>
    
    <h2>Hello!</h2>
    <p>I'm Henrik Söderlund, a technology leader responsible for media activations at <a href="https://initiative.com/" target="_blank" rel="noopener noreferrer">Initiative</a> Perth (<a href="https://kinesso.com" target="_blank" rel="noopener noreferrer">KINESSO</a>, <a href="https://www.interpublic.com/" target="_blank" rel="noopener noreferrer">Interpublic Group</a>). After founding and scaling the award-winning <a href="https://www.cremedigital.com?utm_source=www.henriksoderlund.com&utm_medium=referral" target="_blank" rel="noopener noreferrer">Creme Digital</a>, I transitioned into senior leadership roles where I architect measurement solutions and guide high-performance teams across programmatic and performance marketing channels. With an inherent drive for optimisation and systematic thinking, I've built my career on developing sophisticated systems and automation workflows that transform how teams operate—from advanced analytics and server-side implementations to, more recently, intelligent AI-powered solutions that deliver measurable results at scale.</p>
    
    <p>Beyond technical innovation, my leadership approach centres on developing high-performing teams and cultivating lasting client relationships. Throughout my career, I've successfully rebuilt teams during challenging transitions, mentored 20+ professionals, and delivered compelling presentations that have secured major partnerships. My exceptionally broad technical skillset combined with solutions-driven mindset enables me to solve complex, multi-faceted challenges that others find intractable—whether designing custom performance tracking systems or implementing intelligent automation workflows that transform team operations.</p>
    
    <div class="expertise-link-section">
      <a href="/expertise" class="expertise-link">Explore My Expertise →</a>
    </div>
  `;
};

const generateExpertiseContent = (): string => {
  let content = `<h1>Expertise</h1>`;
  
  // Add intro section
  content += `<section><h2>${removeEmojis(expertiseData.intro.title)}</h2>`;
  content += `<p>${expertiseData.intro.paragraph}</p></section>`;
  
  // Add leadership section
  content += `<section><h2>${removeEmojis(expertiseData.leadershipExpertise.title)}</h2>`;
  content += `<p>${expertiseData.leadershipExpertise.paragraph}</p>`;
  
  // Add leadership categories
  expertiseData.leadershipExpertise.categories.forEach(category => {
    content += `<div><h3>${category.category}</h3><ul>`;
    category.skills.forEach(skill => {
      content += `<li>${skill}</li>`;
    });
    content += `</ul></div>`;
  });
  content += `</section>`;
  
  // Add technical skills
  content += `<section><h2>Technical Expertise & Platform Mastery</h2>`;
  content += `<div>`;
  expertiseData.skillsGrid.forEach(category => {
    content += `<div><h3>${category.category}</h3><ul>`;
    category.skills.forEach(skill => {
      content += `<li>${skill}</li>`;
    });
    content += `</ul></div>`;
  });
  content += `</div></section>`;
  
  // Add platform experience
  content += `<section><h2>${removeEmojis(expertiseData.platformExperience.title)}</h2>`;
  content += `<p>${expertiseData.platformExperience.paragraph}</p>`;
  content += `<ul>`;
  expertiseData.platformExperience.platforms.forEach(platform => {
    content += `<li>${platform}</li>`;
  });
  content += `</ul></section>`;
  
  // Add GitHub contributions
  content += `<section><h2>${removeEmojis(expertiseData.githubContributions.title)}</h2>`;
  expertiseData.githubContributions.contributions.forEach(contrib => {
    content += `<div><h3><a href="${contrib.url}" target="_blank" rel="noopener noreferrer">${contrib.title}</a></h3>`;
    content += `<p>${contrib.description}</p></div>`;
  });
  content += `</section>`;
  
  return content;
};

const generateWorkExperienceContent = (): string => {
  let content = `<h1>Work Experience</h1>`;
  
  workExperienceData.forEach(job => {
    content += `<section>`;
    content += `<h2>${job.title}</h2>`;
    content += `<p class="dates">${job.dates}</p>`;
    job.description.forEach(desc => {
      content += `<p>${desc}</p>`;
    });
    content += `</section>`;
  });
  
  return content;
};

const generateConsultancyContent = (): string => {
  let content = `<h1>${consultationData.intro.title}</h1>`;
  content += `<p>${consultationData.intro.paragraph}</p>`;
  
  // AI Consultancy section
  content += `<section><h2>${removeEmojis(consultationData.aiConsultancy.title)}</h2>`;
  content += `<p>${consultationData.aiConsultancy.paragraph}</p>`;
  content += `<h3>${consultationData.aiConsultancy.services.title}</h3><ul>`;
  consultationData.aiConsultancy.services.items.forEach(item => {
    content += `<li><strong>${item.name}</strong> - ${item.description}</li>`;
  });
  content += `</ul></section>`;
  
  // Analytics Consultancy section
  content += `<section><h2>${removeEmojis(consultationData.analyticsConsultancy.title)}</h2>`;
  content += `<p>${consultationData.analyticsConsultancy.paragraph}</p>`;
  content += `<h3>${consultationData.analyticsConsultancy.services.title}</h3><ul>`;
  consultationData.analyticsConsultancy.services.items.forEach(item => {
    content += `<li>${item}</li>`;
  });
  content += `</ul></section>`;
  
  return content;
};

// Data-driven content generation using actual data files
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
        title: 'Henrik Söderlund | Technology Leader & AI Innovator',
        content: generateHomepageContent(),
        links: baseLinks
      };

    case '/expertise': {
      const expertiseLinks = expertiseData.githubContributions.contributions.map(contrib => 
        `<a href="${contrib.url}" target="_blank" rel="noopener noreferrer">${contrib.title}</a>`
      );
      return {
        title: 'Expertise - Henrik Söderlund',
        content: generateExpertiseContent(),
        links: baseLinks.concat(expertiseLinks)
      };
    }

    case '/work-experience':
      return {
        title: 'Work Experience - Henrik Söderlund',
        content: generateWorkExperienceContent(),
        links: baseLinks
      };

    case '/education':
      return {
        title: 'Henrik Söderlund | Technology Leader & AI Innovator',
        content: `
          <h1>Education</h1>
          
          <h2>Tertiary Education</h2>
          <p class="dates">1999–2006</p>
          <p>Master of Music [M.Mus.] Instrument: Trombone at Lund University - Malmö, Sweden</p>
          
          <h2>Secondary Education</h2>
          <p class="dates">1996–1999</p>
          <p>Natural Sciences at Kattegattgymnasiet - Malmö, Sweden</p>
          
          <h2>Primary Education</h2>
          <p class="dates">1987–1996</p>
          <p>Elementary at Örjanskolan - Halmstad, Sweden</p>
        `,
        links: baseLinks
      };

    case '/consultancy':
      return {
        title: 'Strategic AI & Analytics Consultancy - Henrik Söderlund',
        content: generateConsultancyContent(),
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

// Generate comprehensive SEO metadata for crawlers
const generateSEOMetadata = (path: string, title: string, fullUrl: string): string => {
  const ogTitle = path === '/' ? 'Henrik Söderlund | Digital Media Leader & AI Solutions Innovator' : title;
  const twitterTitle = ogTitle;
  
  return `
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/bot.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="The personal website of Henrik Söderlund, a Technology Leader & AI Innovator based in Perth, Australia." />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="profile" />
  <meta property="og:url" content="${fullUrl}" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="Technology Leader specialising in AI automation, digital marketing, and technology leadership. Expert in building intelligent systems, leading high-performance teams, and delivering enterprise-scale solutions." />
  <meta property="og:image" content="https://www.henriksoderlund.com/og_image.png" />
  <meta property="og:image:alt" content="Henrik Söderlund - Digital Media Leader & AI Solutions Innovator" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Henrik Söderlund" />
  <meta property="og:locale" content="en_AU" />
  <meta property="profile:first_name" content="Henrik" />
  <meta property="profile:last_name" content="Söderlund" />
  <meta property="profile:username" content="henkisdabro" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:site" content="@henkisdabro" />
  <meta property="twitter:creator" content="@henkisdabro" />
  <meta property="twitter:url" content="${fullUrl}" />
  <meta property="twitter:title" content="${twitterTitle}" />
  <meta property="twitter:description" content="Technology Leader specialising in AI automation, digital marketing, and technology leadership. Expert in building intelligent systems, leading high-performance teams, and delivering enterprise-scale solutions." />
  <meta property="twitter:image" content="https://www.henriksoderlund.com/og_image.png" />
  <meta property="twitter:image:alt" content="Henrik Söderlund - Digital Media Leader & AI Solutions Innovator" />

  <!-- SEO -->
  <meta name="google-site-verification" content="TVUdAh0RA_yjsXKKjybCDe7JsKnXBhYFbcRPoJy03rc" />
  <meta name="ahrefs-site-verification" content="bc08e3a49be838e1d8cfa2eabc5bf8e7d833c572e09db62742db9ed9917d6ada">
  <link rel="canonical" href="${fullUrl}" />

  <!-- Structured Data - Person Schema -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Henrik Söderlund",
      "url": "https://www.henriksoderlund.com/",
      "image": "https://www.henriksoderlund.com/og_image.png",
      "jobTitle": "Digital Media Leader & AI Solutions Innovator",
      "description": "Technology Leader specialising in AI automation, digital marketing, and technology leadership. Expert in building intelligent systems, leading high-performance teams, and delivering enterprise-scale solutions.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Perth",
        "addressRegion": "WA",
        "addressCountry": "AU"
      },
      "worksFor": {
        "@type": "Organization",
        "name": "KINESSO",
        "url": "https://kinesso.com/"
      },
      "affiliation": [
        {
          "@type": "Organization",
          "name": "Initiative Perth"
        }
      ],
      "knowsAbout": [
        "Artificial Intelligence",
        "Digital Marketing",
        "Technology Leadership",
        "Team Management",
        "Google Analytics",
        "Google Tag Manager",
        "Programmatic Advertising",
        "Marketing Technology",
        "Data Analytics",
        "Business Intelligence",
        "AI Automation",
        "Performance Marketing",
        "Server-Side Tracking",
        "React Development",
        "Python Programming",
        "Process Automation"
      ],
      "skills": [
        "Strategic Technology Leadership",
        "AI & Machine Learning Implementation",
        "Digital Advertising & Media Buying",
        "Advanced Analytics & Measurement",
        "Team Building & Mentoring",
        "Client Relationship Management",
        "Google Ads & Meta Advertising",
        "Marketing Technology Stack Management",
        "Data Pipeline Architecture",
        "Cross-Platform Attribution"
      ],
      "alumniOf": [
        {
          "@type": "EducationalOrganization",
          "name": "Malmö Academy of Music",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "SE"
          }
        }
      ],
      "knowsLanguage": [
        {
          "@type": "Language",
          "name": "English"
        },
        {
          "@type": "Language", 
          "name": "Swedish"
        }
      ],
      "sameAs": [
        "https://github.com/henkisdabro",
        "https://www.linkedin.com/in/henriksoderlund/"
      ],
      "award": [
        "MFA Changer Recognition 2024 (Initiative)",
        "Advertising+Marketing AOTY Best Local Media Agency 2021 (Creme Digital)"
      ],
      "memberOf": [
        {
          "@type": "Organization",
          "name": "Facebook Blueprint Certified Professional"
        }
      ]
    }
  </script>

  <!-- Structured Data - Professional Service Schema -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Henrik Söderlund - Strategic Technology Consultancy",
      "description": "AI automation, analytics implementation, and digital transformation consulting services for businesses seeking to leverage cutting-edge technology solutions.",
      "url": "https://www.henriksoderlund.com/",
      "founder": {
        "@type": "Person",
        "name": "Henrik Söderlund",
        "url": "https://www.henriksoderlund.com/"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Perth",
        "addressRegion": "WA",
        "addressCountry": "AU"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "Perth"
        },
        {
          "@type": "Country",
          "name": "Australia"
        },
        {
          "@type": "Place",
          "name": "Global"
        }
      ],
      "priceRange": "AUD 350 - 45,000",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer",
      "currenciesAccepted": "AUD",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Consulting Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI Strategy & Feasibility Assessment",
              "description": "Strategic roadmap, ROI analysis, technical specifications"
            },
            "price": "3500",
            "priceCurrency": "AUD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Workflow Automation System",
              "description": "End-to-end automation, integration, training, documentation"
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": "8500",
              "maxPrice": "15000",
              "priceCurrency": "AUD"
            }
          }
        ]
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "url": "https://calendly.com/henriksoederlund/30min",
        "availableLanguage": ["English", "Swedish"]
      }
    }
  </script>

  <!-- Structured Data - Website Schema -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Henrik Söderlund - Digital Media Leader & AI Solutions Innovator",
      "url": "https://www.henriksoderlund.com/",
      "description": "The personal website of Henrik Söderlund, a Digital Media Leader & AI Solutions Innovator based in Perth, Australia.",
      "author": {
        "@type": "Person",
        "name": "Henrik Söderlund"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.henriksoderlund.com/?s={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  </script>`;
};

// Handle index.html with server-side data injection and crawler content
const handleIndexWithInjection = async (c: Context) => {
  try {
    const url = new URL(c.req.url);
    const path = url.pathname;
    const crawlerDetected = isCrawler(c);
    
    console.log('HANDLER CALLED - Path:', path, 'Crawler:', crawlerDetected);
    
    // If crawler detected, return completely custom HTML
    if (crawlerDetected) {
      const prerendered = getPrerenderedContent(path);
      const fullUrl = `https://www.henriksoderlund.com${path === '/' ? '' : path}`;
      
      const crawlerHtml = `<!doctype html>
<html lang="en">
<head>
${generateSEOMetadata(path, prerendered.title, fullUrl)}
</head>
<body>
  <!-- Fathom Analytics noscript -->
  <noscript><img src="https://api.fouanalytics.com/api/noscript-6686ht0xp1ec4dc5q5z4.gif" alt="Fathom Analytics tracking pixel"></noscript>
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
</body>
</html>`;
      
      console.log('SERVING CUSTOM CRAWLER HTML for path:', path);
      return c.html(crawlerHtml);
    }
    
    // For regular users, serve the React SPA
    const asset = await c.env.ASSETS.fetch(new URL("/index.html", c.req.url).toString());
    
    if (!asset.ok) {
      console.error('Failed to fetch index.html:', asset.status);
      return c.notFound();
    }
    
    let html = await asset.text();
    
    // Basic data injection for regular users
    const buildTimestamp = new Date().toISOString();
    const cfCountry = c.req.header('cf-ipcountry') || 'unknown';
    const cfColo = c.req.header('cf-ipcolo') || 'unknown';
    const cfRay = c.req.header('cf-ray') || 'unknown';
    
    html = html.replace(/%BUILD_TIMESTAMP%/g, buildTimestamp);
    html = html.replace(/%CF_COUNTRY%/g, cfCountry);
    html = html.replace(/%CF_COLO%/g, cfColo);
    html = html.replace(/%CF_RAY%/g, cfRay);
    
    const fullUrl = `https://www.henriksoderlund.com${path === '/' ? '' : path}`;
    
    // Update canonical URL and Open Graph URL
    html = html.replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${fullUrl}" />`
    );
    
    html = html.replace(
      /<meta name="ahrefs-site-verification"/,
      `<link rel="canonical" href="${fullUrl}" />\n  <meta name="ahrefs-site-verification"`
    );
    
    return c.html(html);
  } catch (error) {
    console.error('Index.html processing error:', error);
    return c.text('Internal server error', 500);
  }
};

// Homepage routes moved to end for debugging

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

// IndexNow configuration
const INDEXNOW_KEY = 'b17bc1cea33c519799f86d4e8d5d57ae587dd332361abff618a9dcd87a77ad15';
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow'
];

// IndexNow key validation endpoint
app.get(`/${INDEXNOW_KEY}.txt`, (c) => {
  return c.text(INDEXNOW_KEY, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=86400'
  });
});

// Helper function to submit URLs to IndexNow
const submitToIndexNow = async (urls: string[], host: string = 'www.henriksoderlund.com') => {
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
    urlList: urls.map(url => url.startsWith('http') ? url : `https://${host}${url}`)
  };

  const results: Array<{endpoint: string; success: boolean; status?: number; error?: string}> = [];

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'www.henriksoderlund.com IndexNow Client'
        },
        body: JSON.stringify(payload)
      });

      results.push({
        endpoint,
        success: response.ok,
        status: response.status
      });

      console.log(`IndexNow submission to ${endpoint}: ${response.status}`);
    } catch (error) {
      results.push({
        endpoint,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
      console.error(`IndexNow submission failed for ${endpoint}:`, error);
    }
  }

  return results;
};

// IndexNow single URL submission endpoint
app.get("/indexnow", async (c) => {
  const url = c.req.query('url');
  const key = c.req.query('key');
  
  if (!url) {
    return c.json({ error: 'URL parameter is required' }, 400);
  }
  
  if (!key || key !== INDEXNOW_KEY) {
    return c.json({ error: 'Invalid or missing key' }, 403);
  }

  // Validate URL belongs to this domain
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'www.henriksoderlund.com' && urlObj.hostname !== 'henriksoderlund.com') {
      return c.json({ error: 'URL must belong to this domain' }, 422);
    }
  } catch {
    return c.json({ error: 'Invalid URL format' }, 400);
  }

  const results = await submitToIndexNow([url]);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return c.json({
    success: successful > 0,
    submitted_url: url,
    results: {
      successful,
      failed,
      details: results
    },
    timestamp: new Date().toISOString()
  }, successful > 0 ? 200 : 207);
});

// IndexNow bulk URL submission endpoint
app.post("/indexnow", async (c) => {
  const body = await c.req.json().catch(() => null);
  
  if (!body || !Array.isArray(body.urlList) || !body.key) {
    return c.json({ error: 'Invalid request body. Expected JSON with urlList and key.' }, 400);
  }

  if (body.key !== INDEXNOW_KEY) {
    return c.json({ error: 'Invalid key' }, 403);
  }

  if (body.urlList.length > 10000) {
    return c.json({ error: 'Maximum 10,000 URLs per request' }, 400);
  }

  // Validate all URLs belong to this domain
  const invalidUrls = [];
  for (const url of body.urlList) {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== 'www.henriksoderlund.com' && urlObj.hostname !== 'henriksoderlund.com') {
        invalidUrls.push(url);
      }
    } catch {
      invalidUrls.push(url);
    }
  }

  if (invalidUrls.length > 0) {
    return c.json({ 
      error: 'Some URLs are invalid or do not belong to this domain',
      invalid_urls: invalidUrls.slice(0, 10) // Show first 10 invalid URLs
    }, 422);
  }

  const results = await submitToIndexNow(body.urlList);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return c.json({
    success: successful > 0,
    submitted_urls_count: body.urlList.length,
    results: {
      successful,
      failed,
      details: results
    },
    timestamp: new Date().toISOString()
  }, successful > 0 ? 200 : 207);
});

// Automatic IndexNow submission for common pages (can be called after deployments)
app.post("/indexnow/submit-all", async (c) => {
  const key = c.req.query('key');
  
  if (!key || key !== INDEXNOW_KEY) {
    return c.json({ error: 'Invalid or missing key' }, 403);
  }

  const commonUrls = [
    'https://www.henriksoderlund.com/',
    'https://www.henriksoderlund.com/expertise',
    'https://www.henriksoderlund.com/work-experience',
    'https://www.henriksoderlund.com/education',
    'https://www.henriksoderlund.com/consultancy',
    'https://www.henriksoderlund.com/llms.txt',
    'https://www.henriksoderlund.com/sitemap.xml'
  ];

  const results = await submitToIndexNow(commonUrls);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return c.json({
    success: successful > 0,
    message: 'Submitted all common pages to search engines',
    submitted_urls: commonUrls,
    results: {
      successful,
      failed,
      details: results
    },
    timestamp: new Date().toISOString()
  }, successful > 0 ? 200 : 207);
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

// Catch-all route for SPA routing - handles all routes including homepage
app.all("*", async (c) => {
  const url = new URL(c.req.url);
  console.log('CATCH-ALL ROUTE HIT:', url.pathname, 'User-Agent:', c.req.header('user-agent')?.substring(0, 50));
  
  // Handle homepage paths explicitly
  if (url.pathname === '/' || url.pathname === '/index.html') {
    console.log('HANDLING HOMEPAGE PATH in catch-all:', url.pathname);
    return handleIndexWithInjection(c);
  }
  
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
  
  // For other page routes (SPA), serve index.html with data injection
  console.log('Serving SPA route with injection:', url.pathname);
  return handleIndexWithInjection(c);
});

export default app;

