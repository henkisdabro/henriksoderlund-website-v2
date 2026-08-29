import { consultationData } from '../data/consultation';
import { perthAnalyticsData } from '../data/perthAnalytics';
import { expertiseData } from '../data/expertise';
import { workExperienceData } from '../data/workExperience';
import { CALENDLY_URL, LINKEDIN_URL, GITHUB_URL, CONTACT_EMAIL } from '../data/links';

export function getHomeMarkdown(): string {
  return `# Henrik Soederlund - Technology Leader & AI Innovator

Technology Leader & AI Solutions Expert. Accomplished agency founder and enterprise leader specialising in automation, advanced analytics, and high-performance team development.

## Hello

Technology leader with proven expertise in both entrepreneurial and enterprise environments. After founding and scaling the award-winning Creme Digital, led media activations at Initiative Perth (KINESSO, Interpublic Group).

Architected measurement solutions and guided high-performance teams across programmatic and performance marketing channels. Built career on developing sophisticated systems and automation workflows.

Leadership approach centres on developing high-performing teams and cultivating lasting client relationships. Successfully rebuilt teams during challenging transitions, mentored 20+ professionals, and delivered compelling presentations that have secured major partnerships.
`;
}

export function getExpertiseMarkdown(): string {
  const { showcase, leadershipExpertise, skillsGrid, platformExperience, githubContributions } = expertiseData;

  const showcaseProjects = showcase.projects
    .map((p) => `### ${p.title}\n\n${p.type} - ${p.tagline}\n\n${p.description}${p.url ? `\n\nURL: ${p.url}` : ''}`)
    .join('\n\n');

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

  const opensourceProjects = githubContributions.contributions
    .map((p) => `- [${p.title}](${p.url}) - ${p.description}`)
    .join('\n');

  return `# Expertise - Henrik Soederlund

Strategic Technology Leadership & AI Innovation

${expertiseData.intro.paragraph}

## What I Build

${showcaseProjects}

## Leadership & Strategy

${leadershipExpertise.paragraph}

${leadershipCategories}

## Technical Skills

${skillCategories}

## Advertising Platform Expertise

${platformExperience.paragraph}

Platforms: ${platforms}

## Open Source & Community

${opensourceProjects}
`;
}

export function getConsultancyMarkdown(): string {
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

  return `# Consultancy - Henrik Soederlund

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

export function getWorkExperienceMarkdown(): string {
  const entries = workExperienceData
    .map(
      (entry) =>
        `## ${entry.title}\n\n${entry.dates} - ${entry.location}\n\n${entry.description.join('\n\n')}`
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

export function getEducationMarkdown(): string {
  return `# Education - Henrik Soederlund

## Tertiary Education

1999-2006 - Sweden

Master of Music [M.Mus.] Instrument: Trombone at Lund University

Malmoe, Sweden

## Secondary Education

1996-1999 - Sweden

Natural Sciences at Kattegattgymnasiet

Malmoe, Sweden

## Primary Education

1987-1996 - Sweden

Elementary at Oerjanskolan

Halmstad, Sweden
`;
}
