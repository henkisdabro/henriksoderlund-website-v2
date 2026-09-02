import { consultationData } from '../data/consultation';
import { perthAnalyticsData } from '../data/perthAnalytics';
import { expertiseData } from '../data/expertise';
import { workExperienceData } from '../data/workExperience';
import { CALENDLY_URL, LINKEDIN_URL, GITHUB_URL, CONTACT_EMAIL } from '../data/links';

export function getHomeMarkdown(): string {
  return `# Henrik Soederlund - Technology Leader & Automation Architect

Technology Leader & Automation Architect. I build automation, analytics infrastructure, and digital products that free teams to focus on higher-value work - and give them the systems thinking to keep improving long after the engagement ends.

## Hello!

Businesses come to me when manual work is consuming hours that should go toward growth, when reporting can't keep pace with decision-making, and when teams need someone who can see the full picture and fix it properly. I work across the full surface - workflow automation with AI, server-side tracking, measurement frameworks, custom reporting, security hardening - and what I leave behind goes beyond the deliverables: working systems, full documentation, streamlined operations, and teams that have started thinking in systems themselves. Staff who were buried in repetitive processes start identifying their own efficiencies. That compounding effect is where the real value sits.

The range comes from building on both sides. I founded and grew the award-winning [Creme Digital](https://www.cremedigital.com), then moved into enterprise media at [Initiative](https://initiative.com/) Perth ([KINESSO](https://kinesso.com), [Interpublic Group](https://www.interpublic.com/)), where I built measurement systems for large-scale programmatic campaigns and led teams through difficult transitions. Agency founder and enterprise operator - that combination means I know what is technically possible and what is actually worth doing. I don't stop at implementation. I keep going until the operation runs the way it should, and the team has learned to spot the next automation themselves.

- [See the full picture](https://www.henriksoderlund.com/expertise)
- [GA4 & analytics in Perth](https://www.henriksoderlund.com/perth-analytics-consultant)
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
