export const perthAnalyticsData = {
  hero: {
    title: 'Perth Analytics Consultant',
    subtitle: 'Measurement, data models and reporting that hold up - for businesses in Perth and Western Australia.',
    statement: 'I am an independent Digital Consultant in Perth. People call me when they have stopped believing their own Google Analytics. I do the implementation myself.',
    signals: [
      'Conversions that will not reconcile with the CRM',
      'Ad platforms all claiming the same sale',
      'Traffic sitting in Unassigned',
      'A tracking setup nobody at the company built',
    ],
  },

  ladder: {
    title: 'How the work stacks up',
    intro: 'Four stages. Most engagements start at one and stop where the value runs out.',
    note: 'Most Perth engagements begin at stage one, because nothing downstream is worth building on numbers nobody trusts. Plenty stop at stage two.',
    stages: [
      {
        name: 'Measure',
        blurb: 'Collect it correctly, once.',
        items: [
          'GA4 implementation and repair',
          'Server-side tagging (GTM SS)',
          'Meta CAPI and offline conversions',
          'Consent Mode v2',
        ],
      },
      {
        name: 'Model',
        blurb: 'Turn events into something queryable.',
        items: [
          'BigQuery export and SQL models',
          'Power BI semantic models',
          'Warehouse and database design',
          'Power Query and ETL pipelines',
        ],
      },
      {
        name: 'Report',
        blurb: 'Answer the question, not the metric.',
        items: [
          'Power BI executive dashboards',
          'Looker Studio on modelled data',
          'Blended paid, CRM and finance sources',
          'Cohort, LTV and channel views',
        ],
      },
      {
        name: 'Automate',
        blurb: 'Stop assembling reports by hand.',
        items: [
          'Scheduled refresh and alerting',
          'Anomaly and tracking-break alerts',
          'Python and API data pipelines',
          'AI-assisted reporting workflows',
        ],
      },
    ],
  },

  proof: {
    title: 'Things you can go and check',
    intro: 'Open these without asking me for anything.',
    items: [
      {
        kind: 'Open source',
        name: 'IPmeta Tag Template',
        description: 'A GTM community template for spam and bot filtering, in the public gallery. Anyone can read the code.',
      },
      {
        kind: 'SaaS platform',
        name: 'ascribe.to',
        description: 'Validates tracking links against your own GA4 channel definitions before launch. Built, shipped and running.',
      },
      {
        kind: 'Track record',
        name: 'Agency automation build',
        description: '75 per cent less admin time and AUD 285,000 in recovered revenue across a 150-person agency. Case study on the consultancy page.',
      },
    ],
    selfHosted: 'This page runs the stack: its tag is served first-party from this domain through Cloudflare\'s Google tag gateway, under a nonced content security policy. Open the network tab to see what I would build for you.',
  },

  deliverables: {
    title: 'What you are left holding',
    intro: 'The artefacts that exist at the end. They are yours.',
    items: [
      { name: 'A measurement plan', description: 'the events, parameters and identifiers that matter, written down in your language.' },
      { name: 'The container itself', description: 'running in your cloud account, on your domain, under your billing.' },
      { name: 'A reconciliation report', description: 'GA4 set against the cart or CRM, with the remaining gap explained.' },
      { name: 'Data models', description: 'the SQL or Power BI semantic layer, documented and version-controlled.' },
      { name: 'Dashboards people open', description: 'built on modelled data, and short enough to read.' },
      { name: 'A runbook and a handover session', description: 'naming conventions, how to add a tag, what to check when something looks wrong.' },
    ],
  },

  objections: {
    title: 'The questions you are too polite to ask',
    intro: 'Fair objections to hiring one person, answered before you have to raise them.',
    items: [
      {
        question: 'What happens if you are unavailable?',
        answer: 'Everything runs in your accounts, not mine, and the runbook exists so a competent replacement can pick it up. No part of the build depends on me still being here.',
      },
      {
        question: 'Are we locked into you afterwards?',
        answer: 'No retainer is required to keep anything running. Support is available if you want it, and plenty of clients take the handover and run it themselves.',
      },
      {
        question: 'What if it turns out we do not need this?',
        answer: 'The diagnostic is designed to reach that conclusion where it is the right one, and I will say so. The written report is yours either way.',
      },
    ],
  },

  credentials: {
    title: 'Business practice',
    intro: 'Larger WA organisations cannot raise a purchase order without this. So it is here.',
    items: [
      { name: 'Registered Australian business', detail: 'ABN 96 522 684 594, based in Western Australia and registered for GST.' },
      { name: 'Professional indemnity insurance', detail: 'AUD 1 million per claim, AUD 2 million in the aggregate, underwritten by Berkley Insurance Australia.' },
      { name: 'Public liability insurance', detail: 'AUD 10 million per occurrence, for on-site work at client premises.' },
      { name: 'Standard services agreement', detail: 'Plain-language contract covering scope, intellectual property and termination.' },
      { name: 'Your data stays yours', detail: 'Intellectual property transfers to you on final payment, and infrastructure runs in your own accounts.' },
      { name: 'Onshore delivery', detail: 'All work performed in Australia. Nothing is subcontracted offshore.' },
    ],
    footnote: 'Certificates of currency, the services agreement and a mutual NDA are available on request, before any scoping conversation.',
  },

  localContext: {
    title: 'Working with a consultant in your own time zone',
    paragraph: 'Most Australian analytics work is sold out of Sydney and Melbourne, two to three hours ahead of Perth. A tracking break found on Monday morning here is a Monday afternoon problem there.',
    points: [
      {
        label: 'AWST hours',
        description: 'Debugging happens while your site is live and your campaigns are spending, not the following morning.',
      },
      {
        label: 'On site when it helps',
        description: 'Workshops, migration planning and handovers in person across the Perth metropolitan area. Regional WA and interstate clients are supported remotely.',
      },
      {
        label: 'Reporting configured for WA',
        description: 'GA4 should report on Australia/Perth, not the Australia/Sydney default. A two-hour offset moves conversions across day boundaries and distorts every day and hour report.',
      },
      {
        label: 'Australian privacy context',
        description: 'Built with the Privacy Act 1988 and the Australian Privacy Principles in mind, with Consent Mode v2 for European and UK traffic. I am not a lawyer and this is not legal advice.',
      },
    ],
  },

  audience: {
    title: 'Who this is for',
    intro: 'Organisations that already have traffic and spend, and need the measurement underneath to hold up.',
    profiles: [
      {
        label: 'WA ecommerce and retail',
        description: 'Shopify, WooCommerce and custom carts where GA4 purchases no longer match the back end, and iOS traffic has quietly stopped reporting.',
      },
      {
        label: 'Tourism, hospitality and events',
        description: 'Booking engines on a separate domain, where the sale is credited to the booking provider instead of the campaign that paid for it.',
      },
      {
        label: 'Resources and industrial services',
        description: 'Long B2B enquiry cycles where the real conversion happens in a CRM weeks after the click, and has to be sent back to the ad platforms.',
      },
      {
        label: 'Perth agencies',
        description: 'A technical partner to specify, build and document server-side tagging for your clients, without a permanent engineering hire.',
      },
    ],
  },

  services: {
    title: 'What the work covers',
    intro: 'Three bodies of work. Each is only worth doing if the one above it is sound.',
    groups: [
      {
        name: 'GA4 implementation and remediation',
        description: 'Making a property measure what the business cares about, and agree with the systems of record.',
        items: [
          'Audit of an inherited property: data streams, filters, cross-domain, referral exclusions, key events and attribution',
          'Event and conversion design around what the business gets paid for',
          'Ecommerce tracking to the GA4 specification, with item-scoped parameters',
          'Reconciliation against Shopify, the CRM or invoicing, with the remaining variance explained',
          'Bot and spam filtering, including the IPmeta Tag Template I maintain',
          'BigQuery export modelled in SQL, so reporting uses complete event data',
          'Looker Studio dashboards covering the few numbers a decision turns on',
        ],
      },
      {
        name: 'Server-side tagging',
        description: 'Moving tag execution off the browser into a first-party server container, so less is lost to tracking prevention, ad blockers and short cookie lifetimes.',
        items: [
          'Server-side Google Tag Manager on a first-party subdomain of your own domain',
          'First-party cookies written server-side, which keep returning visitors identifiable for longer',
          'Meta Conversions API, Google Ads enhanced conversions, TikTok Events API and LinkedIn CAPI, with hashed identifiers',
          'Offline and CRM conversion import, so an enquiry that closes six weeks later still reaches the platform',
          'Consent Mode v2 wired end to end',
          'Hosting on Cloudflare Workers, or Cloudflare\'s Google tag gateway where first-party GA4 delivery is all you need',
          'Payload governance: what is forwarded, hashed or dropped before it reaches a vendor',
        ],
      },
      {
        name: 'Data models, warehousing and reporting',
        description: 'Once collection is sound, the value moves to what sits on top of it.',
        items: [
          'Power BI semantic models with agreed measures, so finance, marketing and the board quote the same number',
          'DAX measures and Power Query transformations, documented',
          'BigQuery schema and table design, partitioned to keep cost sane',
          'Warehouse design, incremental loads and version-controlled models',
          'API integrations to ad platforms, CRM and finance, scheduled in Python or on Cloudflare Workers',
          'Looker Studio and Power BI dashboards that read from the model',
          'Reconciliation jobs and anomaly alerting, so a tracking break is caught early',
        ],
      },
    ],
  },

  diagnostics: {
    title: 'Symptoms worth a conversation',
    intro: 'Most of these are measurement faults, not marketing ones.',
    items: [
      {
        symptom: 'GA4 reports fewer conversions than the platform, the CRM or the cart',
        cause: 'Browser-side tags being blocked, a tag firing after the user has navigated away, or a purchase event that never fires on a client-side cart.',
        fix: 'Move the conversion tag server-side and validate it against order records, not against another tag.',
      },
      {
        symptom: 'Google Ads, Meta and GA4 each claim the same sale',
        cause: 'Three attribution models measuring three different things, plus a shrinking cookie window that credits the last observable touch.',
        fix: 'Establish one server-side source of conversion truth, and read platform numbers as each vendor marking its own homework.',
      },
      {
        symptom: 'A large share of traffic arrives as Direct or Unassigned',
        cause: 'A utm_medium GA4 does not recognise, a cross-domain hop that starts a new session, or a redirect that strips the query string.',
        fix: 'Correct the tagging taxonomy against GA4 channel definitions, fix cross-domain and redirect handling, and validate links before launch.',
      },
      {
        symptom: 'Safari and iPhone traffic behaves nothing like the rest',
        cause: 'Safari\'s Intelligent Tracking Prevention shortening browser-set cookies, so returning visitors count as new and campaign credit is lost early.',
        fix: 'First-party cookies set server-side on your own domain. Behaviour moves with each browser release, so I measure the improvement on your own traffic.',
      },
      {
        symptom: 'Nobody at the company knows how the current setup works',
        cause: 'Successive agencies layering containers on containers, with no documentation and no owner.',
        fix: 'A full audit and rebuild, with a documented measurement plan your team can hand to the next person.',
      },
    ],
  },


  engagement: {
    title: 'How an engagement runs',
    intro: 'Most engagements start with a conversation and a paid diagnostic. After that the commercial shape is up to you.',
    models: [
      {
        name: 'Diagnostic',
        description: 'A structured audit of the GA4 property, tag manager containers and data layer, delivered as a written report with prioritised findings.',
        details: 'Fixed scope, fixed price. The report is yours whether or not a build follows.',
      },
      {
        name: 'Project based',
        description: 'A defined build with agreed deliverables and a fixed quote, phased so each stage is validated before the next.',
        details: 'Documentation and a handover session are included.',
      },
      {
        name: 'Pooled hours',
        description: 'A block of hours bought up front and drawn down as you need them.',
        details: 'Unused hours do not evaporate at the end of the month.',
      },
      {
        name: 'Retainer',
        description: 'A monthly arrangement with agreed availability, for teams running server-side infrastructure without an in-house owner.',
        details: 'Common with Perth agencies who want the capability without the hire.',
      },
      {
        name: 'Something else',
        description: 'Secondment, embedded days, training only, or a second opinion on somebody else\'s build.',
        details: 'Propose a shape and I will tell you honestly whether it works.',
      },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'What does server-side tagging (or server-side tracking) actually fix?',
        answer: 'It moves tag execution from the visitor\'s browser to a container running on a subdomain of your own domain. That recovers a share of the measurement otherwise lost to ad blockers and browser tracking prevention, allows first-party cookies with a longer useful life, reduces the number of third-party scripts slowing your pages, and gives you a single place to control what data each vendor receives. It is an improvement in capture, not a way to see everything - anyone promising the latter is overselling it.',
      },
      {
        question: 'Is server-side tagging worth it for a smaller WA business?',
        answer: 'A full server container is not always the answer, and I will say so during the diagnostic. It earns its keep when you are spending enough on paid media that a gap between what converted and what got counted would change how you allocate budget, or when a meaningful share of your audience is on Safari or using content blockers. Below that there is a middle step: serving the tag first-party through a tag gateway, which recovers part of what is lost without a container to run or pay for. It carries no conversion APIs and no payload rules - those still need the container - but it is a fraction of the work, and this site runs that way, so you can see the shape of it before you buy it. The diagnostic measures the gap on your own data first and says which of the three you need, because fixing the GA4 implementation itself usually returns more than adding infrastructure to a setup that was not measuring the right events to begin with.',
      },
      {
        question: 'What does it cost to run?',
        answer: 'A container is billed by event volume, so it scales with your traffic instead of with a plan tier. The gateway route carries no event-based hosting bill at all - it runs on the Cloudflare zone your site already sits behind. I quote it separately from the build and size it to your actual volume, so the ongoing commitment is visible before you agree to anything. If you want a figure before we talk, send me your monthly session count and I will give you one.',
      },
      {
        question: 'Will this break what we already have?',
        answer: 'A container migration runs in parallel: the existing setup keeps reporting while the new one is validated beside it, and the changeover happens only once the two reconcile. A gateway cutover is a smaller thing - it changes where the tag is served from, not what runs the tags - so it is proved out on a staging container first and reversed by restoring the previous snippet. Either way, no reporting gap, and a documented rollback if one is needed.',
      },
      {
        question: 'Can you work with our existing agency?',
        answer: 'Yes, and it is a common arrangement. The agency keeps campaign strategy and delivery; I own the measurement infrastructure underneath it. I also work as the technical partner for Perth agencies delivering this for their own clients.',
      },
      {
        question: 'How does Australian privacy law affect this?',
        answer: 'It gives you more control over personal information, not less, because the fields leaving your infrastructure pass through rules you set rather than through whatever a vendor tag collects by default. I build with the Privacy Act 1988 and the Australian Privacy Principles in mind, configure Consent Mode v2 for visitors covered by GDPR or UK GDPR, and hash identifiers before they reach any advertising platform. What I do not do is give legal advice: compliance is a question for your own adviser, and I would rather work with them than around them.',
      },
      {
        question: 'How long does it take?',
        answer: 'A diagnostic is typically a week or two. A GA4 remediation runs a few weeks. A full server-side deployment with conversion APIs and validation against a full reporting cycle usually runs six to ten weeks, most of which is validation rather than build.',
      },
    ],
  },

  cta: {
    title: 'Start with a conversation',
    paragraph: 'Book a complimentary 30-minute call. Bring the number that does not reconcile, and you will leave with a view on what is causing it - whether or not we go any further.',
  },
};
