import type { APIRoute } from 'astro';
import { plainTextResponse } from '../utils/markdownResponse';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site?.origin ?? 'https://www.henriksoderlund.com';

  const content = `# Henrik Soederlund

> Technology Leader & AI Innovator based in Perth, Australia. Portfolio showcasing expertise in AI solutions, intelligent automation, advanced analytics, and high-performance team development.

\`\`\`text
    _  _ ____ _  _ ____ _ _  _
    |__| |___ |\\ | |__/ | |_/
    |  | |___ | \\| |  \\ | | \\_

    Technology meets strategy.
    Welcome to my corner of the web.
\`\`\`

## Pages

- [Home](${base}/index.html.md): Professional summary, background, and leadership philosophy
- [Expertise](${base}/expertise.md): Technical skills, showcase projects, platforms, and open source contributions
- [Consultancy](${base}/consultancy.md): Service offerings, engagement models, ideal client profiles, and case study
- [Work Experience](${base}/work-experience.md): Full career history from independent consulting to agency leadership
- [Contact](${base}/contact.md): Contact methods, booking link, and location
- [Education](${base}/education.md): Academic background including Master of Music

## Optional

- [Full Content](${base}/llms-full.txt): Complete site content concatenated into a single file
`;

  return plainTextResponse(content);
};
