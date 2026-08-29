/**
 * Canonical entity references for structured data.
 *
 * Answer engines and Google's knowledge graph resolve a string like "GA4" far
 * more reliably when it is linked to a stable identifier. Every Wikidata QID
 * below was verified against the Wikidata search API rather than recalled -
 * linking to the wrong entity is worse than not linking at all, and there are
 * several "Perth" and several "Cloudflare" entities to get wrong.
 */

export interface EntityRef {
  '@type': string;
  name: string;
  sameAs: string[];
}

export const ENTITIES: Record<string, EntityRef> = {
  googleAnalytics: {
    '@type': 'SoftwareApplication',
    name: 'Google Analytics 4',
    sameAs: [
      'https://www.wikidata.org/wiki/Q220577',
      'https://en.wikipedia.org/wiki/Google_Analytics',
    ],
  },
  googleTagManager: {
    '@type': 'SoftwareApplication',
    name: 'Google Tag Manager',
    sameAs: [
      'https://www.wikidata.org/wiki/Q11775280',
      'https://developers.google.com/tag-platform/tag-manager',
    ],
  },
  serverSideTagging: {
    '@type': 'Thing',
    name: 'Server-side tagging',
    sameAs: ['https://developers.google.com/tag-platform/tag-manager/server-side'],
  },
  bigQuery: {
    '@type': 'SoftwareApplication',
    name: 'BigQuery',
    sameAs: [
      'https://www.wikidata.org/wiki/Q4904867',
      'https://en.wikipedia.org/wiki/BigQuery',
    ],
  },
  cloudflareWorkers: {
    '@type': 'SoftwareApplication',
    name: 'Cloudflare Workers',
    sameAs: [
      'https://www.wikidata.org/wiki/Q131417404',
      'https://developers.cloudflare.com/workers/',
    ],
  },
  lookerStudio: {
    '@type': 'SoftwareApplication',
    name: 'Looker Studio',
    sameAs: ['https://lookerstudio.google.com/'],
  },
  metaConversionsApi: {
    '@type': 'Thing',
    name: 'Meta Conversions API',
    sameAs: ['https://developers.facebook.com/docs/marketing-api/conversions-api/'],
  },
  perth: {
    '@type': 'City',
    name: 'Perth',
    sameAs: [
      'https://www.wikidata.org/wiki/Q3183',
      'https://en.wikipedia.org/wiki/Perth',
    ],
  },
  westernAustralia: {
    '@type': 'State',
    name: 'Western Australia',
    sameAs: [
      'https://www.wikidata.org/wiki/Q3206',
      'https://en.wikipedia.org/wiki/Western_Australia',
    ],
  },
};

/** Perth CBD, used as the centre of the service area rather than as a street address. */
export const PERTH_GEO = {
  latitude: -31.9523,
  longitude: 115.8613,
};
