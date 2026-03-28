import type { APIRoute } from 'astro';
import { markdownResponse } from '../utils/markdownResponse';
import { expertiseData } from '../data/expertise';

export const prerender = true;

export const GET: APIRoute = () => {
  const { leadershipExpertise, skillsGrid, platformExperience, githubContributions } = expertiseData;

  const leadershipCategories = leadershipExpertise.categories
    .map(
      (cat) =>
        `### ${cat.category}\n\n${cat.skills.map((s) => `- ${s}`).join('\n')}`
    )
    .join('\n\n');

  const skillCategories = skillsGrid
    .map(
      (cat) =>
        `### ${cat.category}\n\n${cat.skills.map((s) => `- ${s}`).join('\n')}`
    )
    .join('\n\n');

  const platforms = platformExperience.platforms.join(', ');

  const projects = githubContributions.contributions
    .map((p) => `### ${p.title}\n\n${p.description}\n\nURL: ${p.url}`)
    .join('\n\n');

  return markdownResponse(`# Expertise - Henrik Soederlund

Strategic Technology Leadership & AI Innovation

As a senior technology leader, I architect comprehensive solutions that bridge cutting-edge AI capabilities with practical business outcomes. My expertise spans building intelligent automation systems, developing advanced measurement frameworks, and leading cross-functional teams to implement scalable technology solutions. I specialise in transforming complex technical challenges into competitive advantages through systematic innovation and AI-driven methodologies.

## Executive Leadership & People Development

${leadershipExpertise.paragraph}

${leadershipCategories}

## Technical Skills

${skillCategories}

## Advertising Platform Expertise

${platformExperience.paragraph}

Platforms: ${platforms}

## Open-Source Projects, Public Websites & Digital Initiatives

${projects}
`);
};
