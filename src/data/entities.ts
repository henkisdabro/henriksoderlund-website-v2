/**
 * Canonical entity references for structured data.
 *
 * Answer engines and Google's knowledge graph resolve a string like "GA4" far
 * more reliably when it is linked to a stable identifier. Every Wikidata QID
 * below was verified against the Wikidata search API rather than recalled -
 * linking to the wrong entity is worse than not linking at all, and there are
 * several "Perth" and several "Cloudflare" entities to get wrong.
 *
 * Software is typed `Thing`, not `SoftwareApplication`: Google treats the latter
 * as a rich-result type and flags every node without `offers` and a rating or
 * review, which a passing mention of GA4 can never have.
 */

import { ASCRIBE_URL } from './links';

export interface EntityRef {
  '@type': string;
  '@id'?: string;
  name: string;
  url?: string;
  sameAs?: string[];
  founder?: { '@id': string };
}

export const ENTITIES: Record<string, EntityRef> = {
  googleAnalytics: {
    '@type': 'Thing',
    name: 'Google Analytics 4',
    sameAs: [
      'https://www.wikidata.org/wiki/Q220577',
      'https://en.wikipedia.org/wiki/Google_Analytics',
    ],
  },
  googleTagManager: {
    '@type': 'Thing',
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
    '@type': 'Thing',
    name: 'BigQuery',
    sameAs: [
      'https://www.wikidata.org/wiki/Q4904867',
      'https://en.wikipedia.org/wiki/BigQuery',
    ],
  },
  cloudflareWorkers: {
    '@type': 'Thing',
    name: 'Cloudflare Workers',
    sameAs: [
      'https://www.wikidata.org/wiki/Q131417404',
      'https://developers.cloudflare.com/workers/',
    ],
  },
  lookerStudio: {
    '@type': 'Thing',
    name: 'Looker Studio',
    sameAs: ['https://lookerstudio.google.com/'],
  },
  metaConversionsApi: {
    '@type': 'Thing',
    name: 'Meta Conversions API',
    sameAs: ['https://developers.facebook.com/docs/marketing-api/conversions-api/'],
  },
  // Henrik's own product. Typed Organization for the same reason software is
  // typed Thing above. The @id matches the Organization node on ascribe.to, so
  // the founder link is stated from both sides.
  ascribe: {
    '@type': 'Organization',
    '@id': 'https://ascribe.to/#organization',
    name: 'ascribe',
    url: ASCRIBE_URL,
    founder: { '@id': 'https://www.henriksoderlund.com/#person' },
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
