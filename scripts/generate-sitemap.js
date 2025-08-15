#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Generate sitemap.xml for henriksoderlund.com
 * 
 * This script generates a sitemap.xml file based on the routes defined in the React app.
 * It uses static route definitions and current timestamp for lastmod dates.
 */

const DOMAIN = 'https://www.henriksoderlund.com';
const CURRENT_DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Define all routes from src/react-app/App.tsx
const routes = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    path: '/expertise',
    priority: '0.9',
    changefreq: 'monthly'
  },
  {
    path: '/work-experience',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/education',
    priority: '0.7',
    changefreq: 'yearly'
  },
  {
    path: '/consultancy',
    priority: '0.8',
    changefreq: 'monthly'
  }
];

/**
 * Generate XML sitemap content
 */
function generateSitemap() {
  const urls = routes.map(route => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Write sitemap to public directory
 */
function writeSitemap() {
  const sitemapContent = generateSitemap();
  const outputPath = join(process.cwd(), 'public', 'sitemap.xml');
  
  try {
    writeFileSync(outputPath, sitemapContent, 'utf8');
    console.log(`✅ Sitemap generated successfully: ${outputPath}`);
    console.log(`📊 Generated ${routes.length} URLs for ${DOMAIN}`);
    
    // Log generated URLs for verification
    console.log('📄 URLs included in sitemap:');
    routes.forEach(route => {
      console.log(`   - ${DOMAIN}${route.path} (priority: ${route.priority}, changefreq: ${route.changefreq})`);
    });
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the generator
writeSitemap();