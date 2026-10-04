import { GITHUB_URL, ASCRIBE_URL, ROTTOSNORKEL_URL, SANDCASTLE_KIT_URL, SANDCASTLE_KIT_SITE_URL } from './links';

export interface Build {
  /** Anchor on /builds, so each build is linkable as /builds#<id>. */
  id: string;
  title: string;
  url?: string;
  sourceUrl?: string;
  type: string;
  tagline: string;
  description: string;
  tags: string[];
  image: string;
  /** Full-page capture. Scrolls inside the frame on hover and in the overlay. */
  tallImage?: string;
  /** Screen recording of the app in use. Loops in the frame and the overlay. */
  video?: string;
  /** Recording that fades in over the screenshot while the card is hovered. */
  hoverVideo?: string;
  /** Drawn illustration shown in place of a screenshot on /builds. */
  art?: 'workflow';
  accentColour: string;
  accentColourDark?: string;
}

/** Ordered by strength of proof. The first FEATURED_COUNT render large on /builds. */
export const FEATURED_COUNT = 4;

/** How many lead builds the Expertise teaser shows. */
export const TEASER_COUNT = 3;

export const buildsData = {
  title: 'What I Build',
  projects: [
    {
      id: 'ascribe',
      title: 'ascribe',
      url: ASCRIBE_URL,
      type: 'SaaS Platform',
      tagline: 'Validates every tracking link against your own GA4 channel definitions',
      description: 'SaaS platform for marketing teams building trackable URLs. Checks each link against your own GA4 channel groups and shows exactly which channel the traffic will land in before launch - because a GA4 session cannot be retagged afterwards.',
      tags: ['React', 'Cloudflare Workers', 'SaaS', 'GA4 Integration'],
      image: 'ascribeImage',
      tallImage: 'ascribeTallImage',
      // ascribe's own brand tokens, each on the ground it was designed for:
      // signal ink on white, signal amber on the dark theme.
      accentColour: '#9e7b00',
      accentColourDark: '#f2c230',
    },
    {
      id: 'workflow-automation',
      title: 'AI-Powered Workflow Automation',
      type: 'Automation Platform',
      tagline: 'From signed proposal to live project in 7 minutes',
      description: 'Intelligent automation connecting proposal platforms to project management systems using AI-assisted data mapping. Replaces 45-60 minutes of manual setup with a streamlined 7-minute workflow - including real-time team notifications and AI-powered project structure creation.',
      tags: ['Cloudflare Workers', 'AI Integration', 'API Orchestration', 'Chrome Extension'],
      image: 'automationDiagramImage',
      art: 'workflow',
      accentColour: '#14b8a6',
    },
    {
      id: 'sandcastle-kit',
      title: 'sandcastle-kit',
      url: SANDCASTLE_KIT_SITE_URL,
      sourceUrl: SANDCASTLE_KIT_URL,
      type: 'Open Source · AI Agents',
      tagline: 'Turns a ticket backlog into a software factory',
      description: "Unattended coding agents burn down GitHub issues in Docker sandboxes. One agent implements each ticket, a stronger one reviews it, the project's own lint, test and build gates decide, and green work merges while you are away. Built on Sandcastle by Matt Pocock.",
      tags: ['Claude Code', 'Codex', 'Docker', 'TypeScript'],
      image: 'sandcastleKitImage',
      tallImage: 'sandcastleKitTallImage',
      hoverVideo: 'sandcastleKitStatusVideo',
      accentColour: '#b45309',
      accentColourDark: '#f59e0b',
    },
    {
      id: 'rotto-snorkel',
      title: 'Rotto Snorkel',
      url: ROTTOSNORKEL_URL,
      type: 'Public Website',
      tagline: 'Real-time safety assessments across 39 snorkelling locations',
      description: 'Comprehensive snorkelling guide for Rottnest Island with live weather APIs, wave height data, and wind analysis delivering traffic light safety ratings.',
      tags: ['Astro', 'Cloudflare Workers', 'Live Weather API'],
      image: 'rottoSnorkelImage',
      video: 'rottoSnorkelVideo',
      accentColour: '#0ea5e9',
    },
    {
      id: 'dashboards',
      title: 'Business KPI & Campaign Performance Dashboards',
      type: 'Data Visualisation',
      tagline: 'Business KPIs and campaign performance in one executive view',
      description: 'Executive-level dashboards in Looker Studio and Microsoft Power BI that put business KPIs and campaign performance side by side. Multi-source data is modelled in BigQuery and Microsoft Fabric through ETL pipelines, custom APIs, and automated reporting.',
      tags: ['Looker Studio', 'Power BI', 'Microsoft Fabric', 'BigQuery', 'ETL'],
      image: 'dashboardImage',
      accentColour: '#059669',
    },
  ] as Build[],
  githubContributions: {
    title: 'Open Source & Community',
    contributions: [
      {
        title: 'sandcastle-kit',
        url: SANDCASTLE_KIT_URL,
        description: 'Unattended coding agents that burn down a GitHub issue backlog in Docker sandboxes - implemented, reviewed, gated and merged.',
      },
      {
        title: 'Cloudflare Workers React Boilerplate',
        url: `${GITHUB_URL}/cloudflare-workers-react-boilerplate`,
        description: 'Production-ready edge-native web app boilerplate with React 19, AI integration, and automated deployment.',
      },
      {
        title: 'Claude Code MCP Server Selector',
        url: `${GITHUB_URL}/Claude-Code-MCP-Server-Selector`,
        description: 'TUI for managing Model Context Protocol servers in Claude Code, optimising AI context window efficiency.',
      },
      {
        title: 'Collection of Platform Click ID Parameters',
        url: `${GITHUB_URL}/platform-url-click-id-parameters`,
        description: 'Global database of URL parameters for analytics filtering and ad platform pixel trigger optimisation.',
      },
      {
        title: 'IPmeta Tag Template for GA4',
        url: `${GITHUB_URL}/gtm-templates-ipmeta-ga4`,
        description: 'Official GTM Community template for advanced spam and bot traffic filtering with GA4.',
      },
      {
        title: 'Google Chat Tag Template',
        url: `${GITHUB_URL}/gtm-templates-web-google-chat-webhook`,
        description: 'GTM template for real-time conversion notifications through Google Workspace Chat.',
      },
      {
        title: 'GTM-integration-Hugo',
        url: `${GITHUB_URL}/GTM-integration-Hugo`,
        description: 'Google Tag Manager integration framework for Hugo static sites with environment-specific deployment.',
      },
    ],
  },
};
