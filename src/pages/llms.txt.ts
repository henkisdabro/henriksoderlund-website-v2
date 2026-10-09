import type { APIRoute } from 'astro';
import { plainTextResponse } from '../utils/markdownResponse';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site?.origin ?? 'https://www.henriksoderlund.com';

  const content = `# Henrik Soederlund

> Independent technology consultant based in Perth, Australia. Works out what is slowing a business down, then builds the fix - usually some mix of automation, data and software - and builds products of his own.

\`\`\`text
    _  _ ____ _  _ ____ _ _  _
    |__| |___ |\\ | |__/ | |_/
    |  | |___ | \\| |  \\ | | \\_

    Technology meets strategy.
    Welcome to my corner of the web.
\`\`\`

## Pages

- [Home](${base}/index.html.md): Professional summary, background, and leadership philosophy
- [Expertise](${base}/expertise.md): Technical skills, leadership, AI tooling, and advertising platforms
- [Builds](${base}/builds.md): Products, client builds, and open source contributions
- [Consultancy](${base}/consultancy.md): Service offerings, engagement models, ideal client profiles, and case study
- [Perth Analytics Consultant](${base}/perth-analytics-consultant.md): GA4 and server-side tagging services for Perth and Western Australia
- [Work Experience](${base}/work-experience.md): Full career history from independent consulting to agency leadership
- [Contact](${base}/contact.md): Contact methods, booking link, and location

## Optional

- [Full Content](${base}/llms-full.txt): Complete site content concatenated into a single file
`;

  return plainTextResponse(content);
};
