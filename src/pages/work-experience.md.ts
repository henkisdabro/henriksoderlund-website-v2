import type { APIRoute } from 'astro';
import { markdownResponse } from '../utils/markdownResponse';
import { workExperienceData } from '../data/workExperience';

export const prerender = true;

export const GET: APIRoute = () => {
  const entries = workExperienceData
    .map(
      (entry) =>
        `## ${entry.title}\n\n${entry.dates} - ${entry.location}\n\n${entry.description.join('\n\n')}`
    )
    .join('\n\n---\n\n');

  return markdownResponse(`# Work Experience - Henrik Soederlund

${entries}
`);
};
