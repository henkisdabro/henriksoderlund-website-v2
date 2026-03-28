import type { APIRoute } from 'astro';
import { markdownResponse } from '../utils/markdownResponse';
import { consultationData } from '../data/consultation';

export const prerender = true;

export const GET: APIRoute = () => {
  const { intro, aiConsultancy, analyticsConsultancy, caseStudy } = consultationData;

  const aiServices = aiConsultancy.services.items
    .map((item) => `- ${item.name}: ${item.description}`)
    .join('\n');

  const aiPricingRows = aiConsultancy.pricing.rows
    .map((row) => `| ${row.join(' | ')} |`)
    .join('\n');

  const analyticsServices = analyticsConsultancy.services.items
    .map((item) => `- ${item}`)
    .join('\n');

  const analyticsPricingRows = analyticsConsultancy.pricing.rows
    .map((row) => `| ${row.join(' | ')} |`)
    .join('\n');

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

## ${intro.title}

${intro.paragraph}

## AI & Automation Consultancy

${aiConsultancy.paragraph}

### Core AI Services

${aiServices}

### AI Consultancy Pricing & Timelines

| ${aiConsultancy.pricing.headers.join(' | ')} |
| --- | --- | --- | --- |
${aiPricingRows}

## Analytics & Digital Intelligence

${analyticsConsultancy.paragraph}

### Core Analytics Services

${analyticsServices}

### Analytics Consultation Pricing

| ${analyticsConsultancy.pricing.headers.join(' | ')} |
| --- | --- | --- | --- |
${analyticsPricingRows}

## Real-World Success Story

### ${caseStudy.subtitle}

Client: ${caseStudy.client.type}
Team: ${caseStudy.client.team}
Challenge: ${caseStudy.client.challenge}

#### The Challenge

${caseStudy.challenge.description}

Pain points:

${painPoints}

#### The Solution

${caseStudy.solution.description}

Solution components:

${solutionComponents}

#### The Results

${caseStudy.results.description}

${results}
`);
};
