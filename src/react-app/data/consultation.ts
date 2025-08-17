export const consultationData = {
  intro: {
    title: 'Strategic Technology Consultancy',
    paragraph: 'Transform your business with cutting-edge technology solutions. I provide strategic consultation and implementation services for AI automation, business intelligence, and digital transformation initiatives. From concept to deployment, I deliver enterprise-grade solutions that drive measurable results.',
  },
  aiConsultancy: {
    title: '🤖 AI & Automation Consultancy',
    paragraph: 'Leverage artificial intelligence to automate workflows, enhance decision-making, and create competitive advantages. I specialize in building intelligent systems that integrate seamlessly with your existing business processes.',
    services: {
      title: 'Core AI Services',
      items: [
        { name: 'AI-Enabled Automation Systems', description: 'Custom workflows that reduce manual tasks by 70-90%' },
        { name: 'Intelligent Process Migration', description: 'Seamless transition of business processes to AI-enhanced systems' },
        { name: 'Retrieval-Augmented Generation (RAG)', description: 'Knowledge systems that provide instant, accurate information access' },
        { name: 'AI Agent Development', description: 'Autonomous systems for customer service, data analysis, and task automation' },
        { name: 'Machine Learning Integration', description: 'Predictive analytics and intelligent decision support systems' },
        { name: 'Natural Language Processing', description: 'Document analysis, content generation, and communication automation' },
      ],
    },
    pricing: {
      title: 'AI Consultancy Pricing & Timelines',
      headers: ['Service', 'Timeline', 'Investment', 'Deliverables'],
      rows: [
        ['AI Strategy & Feasibility Assessment', '1-2 weeks', 'AUD 3,500', 'Strategic roadmap, ROI analysis, technical specifications'],
        ['Workflow Automation System', '3-6 weeks', 'AUD 8,500 - 15,000', 'End-to-end automation, integration, training, documentation'],
        ['RAG Knowledge System', '4-8 weeks', 'AUD 12,000 - 25,000', 'Custom RAG implementation, API integration, user interface'],
        ['AI Agent Development', '6-12 weeks', 'AUD 18,000 - 35,000', 'Multi-agent system, monitoring dashboard, performance analytics'],
        ['Enterprise AI Migration', '8-16 weeks', 'Starting at AUD 45,000', 'Full system migration, staff training, ongoing support'],
      ],
    },
  },
  analyticsConsultancy: {
    title: '📊 Analytics & Digital Intelligence',
    paragraph: 'Comprehensive analytics solutions that provide actionable insights and drive data-informed decision making across your organization.',
    services: {
      title: 'Core Analytics Services',
      items: [
        'Google Analytics - Advanced implementations, custom reporting, and conversion optimization',
        'Google Tag Manager - Enterprise-grade tracking solutions, server-side implementations',
        'Business Intelligence Dashboards - Real-time reporting and performance monitoring systems',
        'Data Pipeline Architecture - Scalable data collection and processing solutions',
        'Conversion Rate Optimisation - Data-driven testing and optimisation strategies',
      ],
    },
    pricing: {
      title: 'Analytics Consultation Pricing',
      headers: ['Service', 'Timeline', 'Investment', 'Deliverables'],
      rows: [
        ['Strategic Analytics Consultation', '1 hour', 'AUD 350', 'Expert guidance, Q&A, strategic recommendations'],
        ['GA4 Enterprise Audit', '1-2 weeks', 'AUD 2,800', 'Comprehensive audit report, optimisation roadmap'],
        ['Advanced Measurement Planning', '2-3 weeks', 'AUD 4,500', 'Custom measurement framework, KPI mapping, implementation guide'],
        ['GTM Server-Side Implementation', '3-4 weeks', 'AUD 6,500', 'Complete server-side setup, testing, documentation'],
        ['Meta CAPI & Advanced Tracking', '2-3 weeks', 'AUD 4,200', 'Full CAPI implementation, event validation, optimisation'],
        ['Enterprise Analytics Implementation', '4-8 weeks', 'Starting at AUD 12,000', 'Complete analytics ecosystem, training, ongoing support'],
      ],
    },
  },
  qualityGuarantee: {
    title: '🛡️ Quality Guarantee',
    paragraph: 'Every engagement is backed by my commitment to excellence. If the delivered solution doesn\'t meet the agreed specifications or your satisfaction, I\'ll work to resolve any issues at no additional cost.',
  },
  caseStudy: {
    title: '🎯 Real-World Success Story',
    subtitle: 'Transforming Advertising Agency Operations Through Intelligent Automation',
    client: {
      type: 'Global Advertising Agency',
      team: '150+ creative and account management professionals',
      challenge: 'Manual campaign workflows causing delays, errors, and team burnout',
    },
    challenge: {
      title: 'The Challenge',
      description: 'A leading advertising agency was struggling with complex, manual project workflows that involved multiple stakeholders, tight deadlines, and extensive documentation requirements. Their creative teams were spending 40% of their time on administrative tasks rather than strategic creative work.',
      painPoints: [
        'Manual project briefing process taking 2-3 days per campaign',
        'Inconsistent data entry across finance, creative, and client management systems',
        'No real-time visibility into project status or resource allocation',
        'Revenue leakage from unbilled hours and delayed invoicing',
        'High stress levels and overtime due to manual coordination tasks',
      ],
    },
    solution: {
      title: 'The Solution',
      description: 'I designed and implemented a comprehensive automation ecosystem centred around Asana as the primary workflow engine, with intelligent integrations across their entire technology stack.',
      components: [
        {
          name: 'Intelligent Project Initiation',
          description: 'Automated Asana project creation from client briefs with smart task assignment based on team availability and expertise',
        },
        {
          name: 'Financial System Integration',
          description: 'Custom API integrations connecting Asana to accounting software for automatic time tracking, expense allocation, and invoice generation',
        },
        {
          name: 'Real-Time Analytics Dashboard',
          description: 'Executive dashboard providing live insights into project profitability, team utilisation, and revenue pipeline',
        },
        {
          name: 'Smart Resource Management',
          description: 'AI-powered resource allocation system that prevents overbooking and optimises team capacity across projects',
        },
        {
          name: 'Automated Reporting',
          description: 'Weekly stakeholder reports automatically generated from Asana data with key performance metrics and alerts',
        },
      ],
    },
    results: {
      title: 'The Results',
      description: 'Within 12 weeks of implementation, the agency experienced transformational improvements across all key metrics:',
      metrics: [
        {
          metric: 'Administrative Time Reduction',
          value: '75%',
          description: 'Creative teams now spend 30+ hours per week on strategic work instead of admin tasks',
        },
        {
          metric: 'Project Delivery Speed',
          value: '60% faster',
          description: 'Campaign launches reduced from 3 weeks to 1.2 weeks average',
        },
        {
          metric: 'Revenue Recovery',
          value: 'AUD 285,000',
          description: 'Captured previously unbilled hours and improved invoicing accuracy',
        },
        {
          metric: 'Executive Visibility',
          value: 'Real-time',
          description: 'Leadership team now has instant access to project status and profitability data',
        },
        {
          metric: 'Team Satisfaction',
          value: '8.2/10',
          description: 'Employee satisfaction increased significantly with reduced manual workload',
        },
      ],
    },
    technologies: {
      title: 'Technology Stack',
      items: [
        'Asana API for workflow automation',
        'Python scripts for data processing and integration',
        'REST API integrations with finance and CRM systems',
        'Cloudflare Workers Functions for serverless automation',
        'Power BI for executive dashboard and reporting',
        'Zapier for rapid prototyping and non-technical integrations',
      ],
    },
    testimonial: {
      quote: 'The workflow automation Henrik implemented has significantly improved our project delivery times and reduced administrative overhead. The investment paid for itself within four months, and our ROI continues to grow as the system scales with our business.',
      author: 'Operations Manager, Global Advertising Agency',
    },
  },
  scheduling: {
    title: '📅 Schedule Your Strategic Session',
    paragraphs: [
      'Ready to transform your business with AI and advanced analytics? Let\'s discuss your specific needs and explore how we can accelerate your digital transformation.',
      '<strong>Book a complimentary 30-minute discovery call to get started.</strong>',
    ],
  },
};
