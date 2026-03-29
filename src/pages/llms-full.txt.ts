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

---

${sections.join('\n---\n\n')}`;

  return plainTextResponse(content);
};
