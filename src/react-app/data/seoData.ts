export interface SEOPageData {
  title: string;
  description: string;
  keywords: string[];
  ogType?: string;
  schemaData?: object | object[];
}

export const seoData: Record<string, SEOPageData> = {
  '/': {
    title: 'Henrik Söderlund | Technology Leader & AI Innovator',
    description: 'Henrik Söderlund is a Technology Leader & AI Innovator based in Perth, Australia. Expert in AI automation, digital marketing, and technology leadership with proven experience building high-performance teams and delivering enterprise-scale solutions.',
    keywords: [
      'Henrik Söderlund',
      'Technology Leader', 
      'AI Innovator',
      'Perth Australia',
      'AI Automation',
      'Digital Marketing',
      'Technology Leadership',
      'Enterprise Solutions',
      'High-performance Teams',
      'KINESSO',
      'Initiative Perth'
    ],
    ogType: 'profile',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Henrik Söderlund',
      url: 'https://www.henriksoderlund.com/',
      jobTitle: 'Technology Leader & AI Innovator',
      description: 'Technology Leader specialising in AI automation, digital marketing, and technology leadership. Expert in building intelligent systems, leading high-performance teams, and delivering enterprise-scale solutions.',
      image: 'https://www.henriksoderlund.com/og_image.png',
      sameAs: [
        'https://github.com/henkisdabro',
        'https://www.linkedin.com/in/henriksoderlund/'
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'KINESSO'
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Perth',
        addressRegion: 'WA',
        addressCountry: 'AU'
      }
    }
  },
  
  '/expertise': {
    title: 'Technical Expertise & Skills | Henrik Söderlund',
    description: 'Explore Henrik Söderlund\'s technical expertise including AI & machine learning, digital marketing platforms, analytics implementation, team leadership, and enterprise-scale technology solutions. View real project examples and GitHub contributions.',
    keywords: [
      'Technical Expertise',
      'AI Machine Learning',
      'Digital Marketing Platforms',
      'Google Analytics',
      'Google Tag Manager',
      'Python Programming',
      'React Development',
      'Team Leadership', 
      'Enterprise Analytics',
      'Marketing Technology',
      'Automation Workflows',
      'Business Intelligence',
      'GitHub Projects'
    ],
    ogType: 'article',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Technical Expertise & Skills',
      author: {
        '@type': 'Person',
        name: 'Henrik Söderlund',
        url: 'https://www.henriksoderlund.com/'
      },
      publisher: {
        '@type': 'Person',
        name: 'Henrik Söderlund',
        url: 'https://www.henriksoderlund.com/'
      },
      datePublished: '2025-08-18',
      dateModified: '2025-08-23',
      description: 'Comprehensive overview of technical expertise in AI, machine learning, digital marketing platforms, and enterprise technology solutions.',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://www.henriksoderlund.com/expertise'
      },
      image: 'https://www.henriksoderlund.com/og_image.png'
    }
  },
  
  '/work-experience': {
    title: 'Professional Work Experience | Henrik Söderlund',
    description: 'Henrik Söderlund\'s professional work experience including roles at KINESSO, Initiative Perth, and Creme Digital. Track record of technology leadership, team building, client relationship management, and measurable business results.',
    keywords: [
      'Work Experience',
      'Professional Experience',
      'KINESSO Perth',
      'Initiative Perth',
      'Creme Digital',
      'Technology Leadership',
      'Team Management',
      'Client Relationships',
      'Digital Marketing',
      'Business Results',
      'Career History',
      'Professional Background'
    ],
    ogType: 'article',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Professional Work Experience',
      author: {
        '@type': 'Person',
        name: 'Henrik Söderlund',
        url: 'https://www.henriksoderlund.com/'
      },
      publisher: {
        '@type': 'Person',
        name: 'Henrik Söderlund',
        url: 'https://www.henriksoderlund.com/'
      },
      datePublished: '2025-08-18',
      dateModified: '2025-08-23',
      description: 'Detailed professional work experience showcasing technology leadership, team management, and business impact across multiple organisations.',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://www.henriksoderlund.com/work-experience'
      },
      image: 'https://www.henriksoderlund.com/og_image.png'
    }
  },
  
  '/education': {
    title: 'Education & Qualifications | Henrik Söderlund',
    description: 'Henrik Söderlund\'s educational background including Master of Music from Lund University, Sweden. Academic foundation supporting analytical thinking and systematic approach to technology leadership.',
    keywords: [
      'Education',
      'Qualifications',
      'Master of Music',
      'Lund University',
      'Sweden',
      'Malmö Academy of Music',
      'Academic Background',
      'Analytical Thinking',
      'Systematic Approach',
      'Educational Background'
    ],
    ogType: 'article',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Education & Qualifications',
      author: {
        '@type': 'Person',
        name: 'Henrik Söderlund',
        url: 'https://www.henriksoderlund.com/'
      },
      publisher: {
        '@type': 'Person',
        name: 'Henrik Söderlund',
        url: 'https://www.henriksoderlund.com/'
      },
      datePublished: '2025-08-18',
      dateModified: '2025-08-23',
      description: 'Educational background and qualifications that support analytical thinking and systematic approach to technology leadership.',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://www.henriksoderlund.com/education'
      },
      image: 'https://www.henriksoderlund.com/og_image.png'
    }
  },
  
  '/consultancy': {
    title: 'AI Strategy & Technology Consultancy Services | Henrik Söderlund',
    description: 'Expert AI strategy and technology consultancy services by Henrik Söderlund. AI feasibility assessments, workflow automation systems, analytics implementation, and digital transformation consulting. Book a consultation today.',
    keywords: [
      'AI Strategy Consultancy',
      'Technology Consulting',
      'AI Feasibility Assessment',
      'Workflow Automation',
      'Analytics Implementation', 
      'Digital Transformation',
      'AI Solutions',
      'Business Process Automation',
      'Technology Advisory',
      'AI Implementation',
      'Consultation Services',
      'Expert Consulting Perth'
    ],
    ogType: 'service',
    schemaData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'AI Strategy & Technology Consultancy',
        provider: {
          '@type': 'Person',
          name: 'Henrik Söderlund',
          url: 'https://www.henriksoderlund.com/'
        },
        description: 'Expert AI strategy and technology consultancy services including feasibility assessments, workflow automation, and digital transformation consulting.',
        serviceType: 'Technology Consulting',
        areaServed: [
          {
            '@type': 'City',
            name: 'Perth'
          },
          {
            '@type': 'Country',
            name: 'Australia'
          },
          {
            '@type': 'Place',
            name: 'Global'
          }
        ],
        offers: {
          '@type': 'Offer',
          availability: 'InStock',
          price: '350-45000',
          priceCurrency: 'AUD',
          priceValidUntil: '2026-12-31',
          validFrom: '2025-01-01'
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': 'https://www.henriksoderlund.com/consultancy'
        },
        image: 'https://www.henriksoderlund.com/og_image.png'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What AI strategy consulting services do you offer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'I offer comprehensive AI strategy consulting including AI feasibility assessments, strategic roadmap development, ROI analysis, technical specifications, workflow automation system design, and implementation support. Services range from initial AI readiness evaluations to complete automation system delivery.'
            }
          },
          {
            '@type': 'Question',
            name: 'How much do AI consultancy services cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'AI strategy and feasibility assessments start at AUD 3,500. Workflow automation systems range from AUD 8,500 to 15,000. Traditional analytics implementation ranges from AUD 350 to 2,500. All pricing includes strategy, implementation, training, and documentation.'
            }
          },
          {
            '@type': 'Question',
            name: 'What areas do you serve for consultancy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'I serve clients in Perth, Australia, and globally. With experience at KINESSO, Initiative Perth, and previous roles, I work with both local Western Australian businesses and international clients remotely.'
            }
          },
          {
            '@type': 'Question',
            name: 'What is included in an AI feasibility assessment?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'An AI feasibility assessment includes current state analysis, AI readiness evaluation, strategic roadmap development, ROI projections, technical requirements specification, risk assessment, and implementation timeline. The assessment provides a clear path forward for AI adoption in your organization.'
            }
          },
          {
            '@type': 'Question',
            name: 'How long does a typical AI consultancy project take?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Project timelines vary by scope. AI feasibility assessments typically take 2-3 weeks. Workflow automation systems require 6-12 weeks depending on complexity. Analytics implementation projects range from 1-6 weeks. All projects include ongoing support and training.'
            }
          }
        ]
      }
    ]
  }
};

// Helper function to get SEO data for current route
export const getSEOData = (pathname: string): SEOPageData => {
  return seoData[pathname] || seoData['/'];
};