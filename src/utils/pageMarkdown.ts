import { consultationData } from '../data/consultation';
import { perthAnalyticsData } from '../data/perthAnalytics';
import { expertiseData } from '../data/expertise';
import { buildsData, TEASER_COUNT } from '../data/builds';
import { workExperienceData, type Paragraph } from '../data/workExperience';
import { CALENDLY_URL, LINKEDIN_URL, GITHUB_URL, CONTACT_EMAIL } from '../data/links';

export function getHomeMarkdown(): string {
  return `# Henrik Soederlund - Independent Technology Consultant, Perth

Independent consultant in Perth. I work out what is slowing a business down, then build the fix - usually some mix of automation, data and software.

- [Book a discovery call](${CALENDLY_URL})

## What clients bring me

Usually some version of the same thing: numbers nobody trusts, reporting someone rebuilds by hand every month, or work that still runs on email and spreadsheets. I have fixed it for WA government, agencies, ad tech, entertainment and not-for-profit health. For one 150-person agency, automating project and billing workflows cut admin time by 75 per cent and recovered AUD 285,000 in unbilled work. I do the implementation myself.

## How I build

I build with AI coding agents, and I review and test everything they write. One workflow I built turns a signed proposal into a live project in seven minutes, down from 45-60. My own practice runs the same way, on agents I built to handle proposals and invoicing.

## Things I've built

[ascribe](https://www.henriksoderlund.com/builds#ascribe) checks marketing tracking links against an organisation's own GA4 channel definitions before launch. [Rotto Snorkel](https://www.henriksoderlund.com/builds#rotto-snorkel) turns live wind, wave and swell data into safety ratings for 36 snorkel spots around Rottnest.

## Background

Before going independent I spent more than ten years on the media side: I co-founded the award-winning [Creme Digital](https://www.cremedigital.com) in Kuala Lumpur, then led activation teams at Initiative Perth. Before that, I played trombone for a living.

- [How I work with clients](https://www.henriksoderlund.com/consultancy)
- [See what I build](https://www.henriksoderlund.com/builds)
- [GA4 & analytics in Perth](https://www.henriksoderlund.com/perth-analytics-consultant)
- [Full background](https://www.henriksoderlund.com/work-experience)
`;
}

export function getBuildsMarkdown(): string {
  const projects = buildsData.projects
    .map(
      (p) =>
        `### ${p.title}\n\n${p.type} - ${p.tagline}\n\n${p.description}\n\nBuilt with: ${p.tags.join(', ')}${p.url ? `\n\nURL: ${p.url}` : ''}${p.sourceUrl ? `\n\nSource: ${p.sourceUrl}` : ''}`
    )
    .join('\n\n');

  const opensourceProjects = buildsData.githubContributions.contributions
    .map((p) => `- [${p.title}](${p.url}) - ${p.description}`)
    .join('\n');

  return `# Builds - Henrik Soederlund

## ${buildsData.title}

${projects}

## ${buildsData.githubContributions.title}

${opensourceProjects}
`;
}

export function getExpertiseMarkdown(): string {
  const featuredBuilds = buildsData.projects
    .slice(0, TEASER_COUNT)
    .map((p) => `- [${p.title}](https://www.henriksoderlund.com/builds#${p.id}) - ${p.tagline}`)
    .join('\n');

  const skillGroups = expertiseData.skills.groups
    .map((g) => {
      const platforms = g.platforms
        ? `\n\n${g.platforms.map((set) => `- ${set.label}: ${set.names.join(', ')}`).join('\n')}`
        : '';
      return `### ${g.name}\n\n${g.description ? `${g.description}\n\n` : ''}${g.skills.map((skill) => `- ${skill}`).join('\n')}${platforms}`;
    })
    .join('\n\n');

  return `# Expertise - Henrik Soederlund

${expertiseData.intro.title}

${expertiseData.intro.paragraph}

## ${buildsData.title}

${featuredBuilds}

[See all builds](https://www.henriksoderlund.com/builds)

## ${expertiseData.skills.title}

${skillGroups}
`;
}

export function getConsultancyMarkdown(): string {
  const { hero, idealClients, services, performanceNote, engagementModels, caseStudy } = consultationData;

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

  return `# Consultancy - Henrik Soederlund

## ${hero.title}

${hero.subtitle}

${hero.statement}

## ${idealClients.title}

${clientProfiles}

## ${services.title}

${servicePillars}

### ${performanceNote.title}

${performanceNote.paragraph}

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
`;
}

export function getPerthAnalyticsMarkdown(): string {
  const {
    hero, ladder, proof, deliverables, objections, credentials,
    localContext, audience, services, diagnostics, engagement, faq,
  } = perthAnalyticsData;

  const stages = ladder.stages
    .map((s, i) => `${i + 1}. **${s.name}** - ${s.blurb}\n${s.items.map((it) => `   - ${it}`).join('\n')}`)
    .join('\n\n');

  const proofItems = proof.items
    .map((p) => `- **${p.name}** (${p.kind}): ${p.description}`)
    .join('\n');

  const deliverableItems = deliverables.items
    .map((d) => `- **${d.name}** - ${d.description}`)
    .join('\n');

  const objectionItems = objections.items
    .map((o) => `### ${o.question}\n\n${o.answer}`)
    .join('\n\n');

  const credentialItems = credentials.items
    .map((c) => `- **${c.name}**: ${c.detail}`)
    .join('\n');

  const localPoints = localContext.points
    .map((p) => `- **${p.label}**: ${p.description}`)
    .join('\n');

  const profiles = audience.profiles
    .map((p) => `- **${p.label}**: ${p.description}`)
    .join('\n');

  const serviceGroups = services.groups
    .map((g) => `### ${g.name}\n\n${g.description}\n\n${g.items.map((i) => `- ${i}`).join('\n')}`)
    .join('\n\n');

  const symptoms = diagnostics.items
    .map((i) => `### ${i.symptom}\n\nUsual cause: ${i.cause}\n\nFix: ${i.fix}`)
    .join('\n\n');

  const models = engagement.models
    .map((m) => `### ${m.name}\n\n${m.description}\n\n${m.details}`)
    .join('\n\n');

  const faqItems = faq.items
    .map((i) => `### ${i.question}\n\n${i.answer}`)
    .join('\n\n');

  return `# ${hero.title} - Henrik Soederlund

${hero.subtitle}

${hero.statement}

${hero.signals.map((sig) => `- ${sig}`).join('\n')}

## ${ladder.title}

${ladder.intro}

${stages}

${ladder.note}

## ${proof.title}

${proof.intro}

${proofItems}

${proof.selfHosted}

## ${audience.title}

${audience.intro}

${profiles}

## ${services.title}

${services.intro}

${serviceGroups}

## ${diagnostics.title}

${diagnostics.intro}

${symptoms}

## ${deliverables.title}

${deliverables.intro}

${deliverableItems}

## ${localContext.title}

${localContext.paragraph}

${localPoints}

## ${objections.title}

${objections.intro}

${objectionItems}

## ${credentials.title}

${credentials.intro}

${credentialItems}

${credentials.footnote}

## ${engagement.title}

${engagement.intro}

${models}

## ${faq.title}

${faqItems}
`;
}

function paragraphMarkdown(p: Paragraph): string {
  if (typeof p === 'string') return p;
  return p
    .map((part) => (typeof part === 'string' ? part : `[${part.text}](https://www.henriksoderlund.com${part.href})`))
    .join('');
}

export function getWorkExperienceMarkdown(): string {
  const entries = workExperienceData
    .map(
      (entry) =>
        `## ${entry.title}\n\n${entry.dates} - ${entry.location}\n\n${entry.description.map(paragraphMarkdown).join('\n\n')}`
    )
    .join('\n\n---\n\n');

  return `# Work Experience - Henrik Soederlund

${entries}
`;
}

export function getContactMarkdown(): string {
  return `# Contact - Henrik Soederlund

Whether you have a specific project in mind or simply want to explore how technology can drive your business forward, I'd love to hear from you.

## Get in Touch

- **Email**: ${CONTACT_EMAIL}
- **Book a Call**: [Complimentary 30-minute discovery call](${CALENDLY_URL})
- **LinkedIn**: [henriksoderlund](${LINKEDIN_URL})
- **GitHub**: [henkisdabro](${GITHUB_URL})

## What to Expect

Fill out the contact form on the website and I'll get back to you within one business day. For a more in-depth conversation, book a complimentary 30-minute discovery call via Calendly.

## Based In

Perth, Western Australia
`;
}
