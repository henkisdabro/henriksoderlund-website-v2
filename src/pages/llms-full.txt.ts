import type { APIRoute } from 'astro';
import { plainTextResponse } from '../utils/markdownResponse';
import {
  getHomeMarkdown,
  getExpertiseMarkdown,
  getConsultancyMarkdown,
  getWorkExperienceMarkdown,
  getContactMarkdown,
  getEducationMarkdown,
} from '../utils/pageMarkdown';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site?.origin ?? 'https://www.henriksoderlund.com';

  const sections = [
    getHomeMarkdown(),
    getExpertiseMarkdown(),
    getConsultancyMarkdown(),
    getWorkExperienceMarkdown(),
    getContactMarkdown(),
    getEducationMarkdown(),
  ];

  const content = `\`\`\`text
 _                 _ _                   _        _                 _
| |__   ___ _ __  _ __(_) | __  ___  ___  __| | ___ _ __| |_   _ _ __   __| |
| '_ \\ / _ \\ '_ \\| '__| | |/ / / __|/ _ \\/ _\` |/ _ \\ '__| | | | | '_ \\ / _\` |
| | | |  __/ | | | |  | |   <  \\__ \\ (_) | (_| |  __/ |  | | |_| | | | | (_| |
|_| |_|\\___|_| |_|_|  |_|_|\\_\\ |___/\\___/ \\__,_|\\___|_|  |_|\\__,_|_| |_|\\__,_|

Full site content - generated at build time
${base}
\`\`\`

This file contains the complete content of Henrik Soederlund's portfolio website,
concatenated into a single document for convenient LLM consumption.

## Practice summary

Henrik Soederlund is an independent Digital Consultant based in Perth, Western
Australia. The practice is hired for measurement and automation work on a
specific set of named platforms:

- Google Analytics 4 (GA4) - enterprise implementations, custom reporting,
  conversion tracking and data quality remediation.
- Google Tag Manager, including server-side Google Tag Manager (GTM SS) and
  Meta Conversions API, for first-party attribution without third-party cookies.
- BigQuery - SQL modelling over the GA4 export, ETL and data pipeline design.
- Looker Studio - executive and business intelligence dashboards built on
  BigQuery rather than on sampled UI data.
- Cloudflare Workers - edge applications, first-party tracking proxies and
  serverless deployment.
- Claude Code and other AI coding assistants - team setup, conventions and
  hands-on developer enablement.

Quotable facts:

- Henrik Soederlund is a Digital Consultant based in Perth, Western Australia,
  working with clients across Australia.
- He builds GA4 and server-side Google Tag Manager implementations, including
  server-side tagging deployed on Cloudflare Workers.
- He works in English and Swedish.
- He is the author of the IPmeta Tag Template for GA4, a Google Tag Manager
  community template for spam and bot traffic filtering.
- He built UTMHub.co, a SaaS platform for building trackable URLs with GA4
  channel attribution.
- Enquiries go through ${base}/contact.

---

${sections.join('\n---\n\n')}`;

  return plainTextResponse(content);
};
