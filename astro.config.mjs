import { defineConfig, envField, passthroughImageService } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.henriksoderlund.com',
  output: 'server',
  adapter: cloudflare(),
  trailingSlash: 'never',

  integrations: [
    sitemap({
      serialize: (item) => {
        const priorities = {
          '/': 1.0,
          '/expertise': 0.9,
          '/consultancy': 0.8,
          '/work-experience': 0.8,
          '/contact': 0.8,
          '/education': 0.7,
          '/privacy': 0.3,
        };
        const path = new URL(item.url).pathname;
        return { ...item, priority: priorities[path] || 0.5 };
      },
      filter: (page) =>
        !page.includes('/api/') &&
        !page.endsWith('.md') &&
        !page.includes('llms'),
    }),
  ],

  image: {
    service: passthroughImageService(),
  },

  prefetch: false,

  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public' }),
    },
  },
});
