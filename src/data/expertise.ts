export interface SkillGroup {
  id: string;
  name: string;
  description?: string;
  skills: string[];
  core?: string[];
  platforms?: { label: string; names: string[] }[];
  /** A build or page where the group's skills can be seen in use. */
  proof?: { text: string; href: string };
}

export const expertiseData = {
  intro: {
    title: 'What I work with',
    paragraph: 'I build with AI coding agents, so I choose tools for the job rather than out of habit. These are the platforms I know well. Most are where your data and your team already live, which is where the finished work has to run. The ones in bold I use every day.',
  },
  skills: {
    title: 'Technical Expertise & Platforms',
    // `core` names the tools in daily use, shown in bold.
    groups: [
      {
        id: 'measurement',
        name: 'Measurement',
        skills: ['GA4', 'Google Tag Manager', 'Server-Side Tagging (sGTM)', 'Meta Conversions API', 'Consent Mode v2', 'Adobe Analytics', 'Amplitude', 'AppsFlyer', 'UTM & Tracking Templates', 'Google Search Console', 'Screaming Frog', 'JSON-LD Structured Data'],
        core: ['GA4', 'Google Tag Manager', 'Server-Side Tagging (sGTM)'],
        proof: { text: 'ascribe', href: '/builds#ascribe' },
      },
      {
        id: 'data',
        name: 'Data & Reporting',
        skills: ['SQL & BigQuery', 'Power BI & Power Query', 'Microsoft Fabric', 'Looker Studio', 'Python & R', 'ETL Pipelines', 'Google Apps Script', 'Regular Expressions (RegEx)'],
        core: ['SQL & BigQuery', 'Power BI & Power Query'],
        proof: { text: 'the dashboards build', href: '/builds#dashboards' },
      },
      {
        id: 'ai',
        name: 'AI & Agents',
        description: 'Hands-on expertise setting up teams with AI coding assistants and building personal knowledge systems powered by AI. I help developers and professionals adopt these tools effectively - from configuring Claude Code with best practices and conventions, to designing Life OS architectures that turn AI assistants into genuine productivity multipliers.',
        skills: ['Claude Code', 'OpenAI Codex', 'Antigravity', 'OpenClaw', 'MCP Server Integration', 'Unattended Coding Agent Orchestration', 'Sandboxed Agent Workflows (Docker)', 'LLM API Integration', 'Team Onboarding & Convention Files', 'Personal Knowledge Systems (Life OS)'],
        core: ['Claude Code'],
        proof: { text: 'sandcastle-kit', href: '/builds#sandcastle-kit' },
      },
      {
        id: 'web',
        name: 'Web & Edge',
        skills: ['Cloudflare Workers', 'React / Vite / Hono', 'Astro', 'Git & GitHub Actions CI/CD', 'Security Headers & CSP'],
        core: ['Cloudflare Workers'],
        proof: { text: 'Rotto Snorkel', href: '/builds#rotto-snorkel' },
      },
      {
        id: 'advertising',
        name: 'Advertising & Programmatic',
        description: 'Extensive hands-on experience across addressable and programmatic media buying, supply path optimisation (SPO), and bid request analysis across major advertising platforms. Specialising in cross-platform attribution, server-side tracking implementations, and martech solution architecture - combining AI-driven optimisation strategies with deep technical expertise in enterprise-scale campaign operations.',
        skills: ['RTB Programmatic Buying', 'Supply Path Optimisation', 'Impression, Click & Ad Tags', 'Google Ads Scripts', 'Merchant Center & Product Feeds'],
        platforms: [
          { label: 'Google stack', names: ['Google Ads', 'DV360', 'CM360', 'SA360'] },
          { label: 'Social', names: ['Meta', 'TikTok Ads', 'Snapchat', 'LinkedIn', 'Reddit', 'X Ads'] },
          { label: 'Programmatic', names: ['The Trade Desk', 'Yahoo DSP', 'Teads', 'Vistar Media', 'Outbrain DSP'] },
          { label: 'Native & audio', names: ['Taboola', 'Outbrain', 'Spotify'] },
        ],
        proof: { text: 'Work Experience', href: '/work-experience' },
      },
      {
        id: 'leadership',
        name: 'Leadership & Strategy',
        description: 'I build, mentor, and lead high-performance teams while driving exceptional client relationships and stakeholder engagement. My approach combines systematic people development with strategic business alignment - growing teams and businesses together.',
        skills: ['Team Building, Restructuring & Scaling', 'Mentoring & Coaching (20+)', 'Hiring & Interview Process Design', 'Performance Management', 'Change Management & Training Programs', 'Executive Stakeholder Communication', 'Client Pitches & Presentations', 'Conference Speaking'],
        proof: { text: 'the consultancy case study', href: '/consultancy' },
      },
      {
        id: 'range',
        name: 'Technical Range',
        skills: ['Domain & DNS Management', 'Google Workspace & Microsoft 365 Administration', 'Email Security (DKIM, SPF, DMARC)', 'Server Administration & VPS', 'Network Architecture & Security', 'Docker & Kubernetes', 'Zero-Trust Security', 'Private Lab Infrastructure', 'Blockchain Node Operations', 'Audio/Video Technical Standards'],
      },
    ] as SkillGroup[],
  },
};
