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
  powerBi: {
    '@type': 'Thing',
    name: 'Microsoft Power BI',
    sameAs: [
      'https://www.wikidata.org/wiki/Q23542287',
      'https://en.wikipedia.org/wiki/Microsoft_Power_BI',
    ],
  },
  powerQuery: {
    '@type': 'Thing',
    name: 'Power Query',
    sameAs: [
      'https://www.wikidata.org/wiki/Q114876985',
      'https://en.wikipedia.org/wiki/Power_Query',
    ],
  },
  python: {
    '@type': 'ComputerLanguage',
    name: 'Python',
    sameAs: [
      'https://www.wikidata.org/wiki/Q28865',
      'https://en.wikipedia.org/wiki/Python_(programming_language)',
    ],
  },
  // AI tooling. "Claude" and "Codex" are the ambiguous ones: Wikidata's
  // "Claude" search leads with a given name and Claude Monet, and OpenAI Codex
  // has a separate item (Q108582200) for the 2021 model, not the agent.
  claudeCode: {
    '@type': 'Thing',
    name: 'Claude Code',
    sameAs: [
      'https://www.wikidata.org/wiki/Q138457287',
      'https://en.wikipedia.org/wiki/Claude_Code',
    ],
  },
  claude: {
    '@type': 'Thing',
    name: 'Claude',
    sameAs: [
      'https://www.wikidata.org/wiki/Q118876059',
      'https://en.wikipedia.org/wiki/Claude_(AI)',
    ],
  },
  openAiCodex: {
    '@type': 'Thing',
    name: 'OpenAI Codex',
    sameAs: [
      'https://www.wikidata.org/wiki/Q138940795',
      'https://en.wikipedia.org/wiki/OpenAI_Codex_(AI_agent)',
    ],
  },
  modelContextProtocol: {
    '@type': 'Thing',
    name: 'Model Context Protocol',
    sameAs: [
      'https://www.wikidata.org/wiki/Q133436854',
      'https://en.wikipedia.org/wiki/Model_Context_Protocol',
    ],
  },
  aiAssistedDevelopment: {
    '@type': 'Thing',
    name: 'AI-assisted software development',
    sameAs: [
      'https://www.wikidata.org/wiki/Q135423070',
      'https://en.wikipedia.org/wiki/AI-assisted_software_development',
    ],
  },
  promptEngineering: {
    '@type': 'Thing',
    name: 'Prompt engineering',
    sameAs: [
      'https://www.wikidata.org/wiki/Q108941486',
      'https://en.wikipedia.org/wiki/Prompt_engineering',
    ],
  },
  largeLanguageModel: {
    '@type': 'Thing',
    name: 'Large language model',
    sameAs: [
      'https://www.wikidata.org/wiki/Q115305900',
      'https://en.wikipedia.org/wiki/Large_language_model',
    ],
  },
  // Advertising and search.
  programmaticAdvertising: {
    '@type': 'Thing',
    name: 'Programmatic advertising',
    sameAs: [
      'https://www.wikidata.org/wiki/Q19720629',
      'https://en.wikipedia.org/wiki/Programmatic_advertising',
    ],
  },
  realTimeBidding: {
    '@type': 'Thing',
    name: 'Real-time bidding',
    sameAs: [
      'https://www.wikidata.org/wiki/Q2134714',
      'https://en.wikipedia.org/wiki/Real-time_bidding',
    ],
  },
  googleAds: {
    '@type': 'Thing',
    name: 'Google Ads',
    sameAs: [
      'https://www.wikidata.org/wiki/Q271982',
      'https://en.wikipedia.org/wiki/Google_Ads',
    ],
  },
  googleSearchConsole: {
    '@type': 'Thing',
    name: 'Google Search Console',
    sameAs: [
      'https://www.wikidata.org/wiki/Q328216',
      'https://en.wikipedia.org/wiki/Google_Search_Console',
    ],
  },
  googleAppsScript: {
    '@type': 'Thing',
    name: 'Google Apps Script',
    sameAs: [
      'https://www.wikidata.org/wiki/Q5583799',
      'https://en.wikipedia.org/wiki/Google_Apps_Script',
    ],
  },
  jsonLd: {
    '@type': 'Thing',
    name: 'JSON-LD',
    sameAs: [
      'https://www.wikidata.org/wiki/Q6108942',
      'https://en.wikipedia.org/wiki/JSON-LD',
    ],
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
