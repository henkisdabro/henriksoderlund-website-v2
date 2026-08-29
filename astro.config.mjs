import { defineConfig, envField } from 'astro/config';
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
          '/perth-analytics-consultant': 0.8,
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

  // Astro 7 changed the compressHTML default from `true` to `'jsx'`, which
  // applies JSX whitespace rules and drops the spaces between inline
  // elements. On these prose pages that silently joined adjacent text
  // ("at Lund University" + "Malmoe, Sweden"), so keep the v6 behaviour.
  compressHTML: true,

  build: {
    inlineStylesheets: 'always',
  },

  // `image.service` is not settable here: `cloudflare()` defaults its
  // `imageService` option to `"cloudflare-binding"`, and that branch returns
  // the workerd image service unconditionally, ignoring any user service. The
  // built wrangler.json already carries the `IMAGES` binding.
  // `layout` + `responsiveStyles` make `<Image>` emit a srcset and the
  // matching sizing CSS.
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },

  prefetch: false,

  // No page or action uses Astro sessions. Opting out stops the Cloudflare
  // adapter auto-wiring the KV session driver and drops the session runtime
  // from the Worker bundle. It also removes the auto-provisioned SESSION KV
  // binding from the generated wrangler config.
  session: false,

  vite: {
    // Server sourcemaps are required: the Cloudflare Vite plugin does not
    // generate them itself and wrangler.json sets `upload_source_maps: true`,
    // so without these Workers Observability stack traces stay minified.
    build: {
      sourcemap: true,
    },

    // ...but the browser bundle must not ship maps. The one client script
    // (expertise.astro's inline module) otherwise emits a .map carrying the
    // full annotated TypeScript in `sourcesContent`, referenced by a
    // sourceMappingURL comment in the built HTML.
    environments: {
      client: {
        build: {
          sourcemap: false,
        },
      },
    },
  },

  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public' }),
    },
  },
});
