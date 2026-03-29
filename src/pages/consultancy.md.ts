import type { APIRoute } from 'astro';
import { markdownResponse } from '../utils/markdownResponse';
import { consultationData } from '../data/consultation';

export const prerender = true;

export const GET: APIRoute = () => {
  const { hero, idealClients, services, engagementModels, caseStudy } = consultationData;

  const clientProfiles = idealClients.profiles
    .map((p) => `- **${p.label}** ${p.description}`)
    .join('\n');

  const servicePillars = services.pillars
    .map((pillar) => {
      const outcomes = pillar.outcomes.map((o) => `  - ${o}`).join('\n');
      return `### ${pillar.name}\n\n${pillar.description}\n\n${outcomes}`;
    })
    .join('\n\n');

  const engagements = engagementModels.models
    .map((m) => `### ${m.name}\n\n${m.description}\n\n${m.details}`)
    .join('\n\n');

  const painPoints = caseStudy.challenge.painPoints
    .map((p) => `- ${p}`)
    .join('\n');

  const solutionComponents = caseStudy.solution.components
    .map((c) => `- ${c.name}: ${c.description}`)
    .join('\n');

  const results = caseStudy.results.metrics
    .map((m) => `- ${m.metric}: ${m.value} - ${m.description}`)
    .join('\n');

  return markdownResponse(`# Consultancy - Henrik Soederlund

## ${hero.title}

${hero.subtitle}

${hero.statement}

## ${idealClients.title}

${clientProfiles}

## ${services.title}

${servicePillars}

## ${engagementModels.title}

${engagementModels.intro}

${engagements}

## Success Story: ${caseStudy.title}

${caseStudy.headline}

Client: ${caseStudy.client.type}
Team: ${caseStudy.client.team}
Challenge: ${caseStudy.client.challenge}

### The Challenge

${caseStudy.challenge.description}

${painPoints}

### The Solution

${caseStudy.solution.description}

${solutionComponents}

### The Results

${caseStudy.results.description}

${results}

> "${caseStudy.testimonial.quote}" - ${caseStudy.testimonial.author}
`);
};
