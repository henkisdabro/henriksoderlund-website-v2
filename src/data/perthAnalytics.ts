export const perthAnalyticsData = {
  hero: {
    title: 'Perth Analytics Consultant',
    subtitle: 'Measurement, data models and reporting that hold up - for businesses in Perth and Western Australia.',
    statement: 'I am an independent Digital Consultant in Perth. People call me when they have stopped believing their own Google Analytics. Conversions that will not reconcile with the CRM. Ad platforms all claiming the same sale. Traffic sitting in Unassigned with no explanation. A tracking setup nobody currently at the company actually built. I do the implementation myself.',
  },

  ladder: {
    title: 'How the work stacks up',
    intro: 'Four stages. Most engagements start at one and stop where the value runs out.',
    note: 'Stage one is where most Perth engagements begin, because nothing downstream is worth building on numbers nobody trusts. Plenty of clients stop at stage two.',
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
    intro: 'Anyone can write that they are experienced. These are things you can open and look at without asking me for anything.',
    items: [
      {
        kind: 'Open source',
        name: 'IPmeta Tag Template',
        description: 'A Google Tag Manager community template for spam and bot filtering, published in the public gallery. Anyone can read the code.',
      },
      {
        kind: 'SaaS platform',
        name: 'ascribe.to',
        description: 'Validates tracking links against your own GA4 channel definitions before launch. Built, shipped and running.',
      },
      {
        kind: 'Track record',
        name: 'Agency automation build',
        description: '75 per cent less administrative time and AUD 285,000 in recovered revenue, across a 150-person agency. The full case study is on the consultancy page.',
      },
    ],
    selfHosted: 'The page you are reading runs the stack. This site serves its own server-side container from a first-party subdomain, on Cloudflare Workers, with its own consent and payload rules. If you want to see what I would build for you, open the network tab.',
  },

  deliverables: {
    title: 'What you are left holding',
    intro: 'Consulting is easy to buy and hard to point at afterwards. These are the artefacts that exist at the end, and they are yours.',
    items: [
      { name: 'A measurement plan', description: 'the events, parameters and identifiers that matter, and what each reconciles against. Written down, in your language.' },
      { name: 'The container itself', description: 'running in your cloud account, on your domain, under your billing.' },
      { name: 'A reconciliation report', description: 'your GA4 numbers set against the cart or CRM, with whatever gap is left over named and explained.' },
      { name: 'Data models', description: 'the SQL or Power BI semantic layer your reporting sits on, documented and version-controlled.' },
      { name: 'Dashboards people open', description: 'built on modelled data, and short enough that people actually read them.' },
      { name: 'A runbook and a handover session', description: 'naming conventions, how to add a tag, what to check when something looks wrong.' },
    ],
  },

  objections: {
    title: 'The questions you are too polite to ask',
    intro: 'Hiring one person to build infrastructure raises fair objections. Here they are, answered before you have to raise them.',
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
    intro: 'Larger WA organisations cannot raise a purchase order without this, and asking for it is awkward. So it is here.',
    items: [
      { name: 'Registered Australian business', detail: 'ABN 96 522 684 594, based in Western Australia and registered for GST.' },
      { name: 'Professional indemnity insurance', detail: 'AUD 1 million per claim, AUD 2 million in the aggregate, underwritten by Berkley Insurance Australia.' },
      { name: 'Public liability insurance', detail: 'AUD 10 million per occurrence, for on-site work at client premises.' },
      { name: 'Standard services agreement', detail: 'Plain-language contract covering scope, intellectual property and termination, provided before any engagement begins.' },
      { name: 'Your data stays yours', detail: 'Intellectual property in everything built transfers to you on final payment, and infrastructure runs in your own accounts.' },
      { name: 'Onshore delivery', detail: 'All work performed in Australia. Nothing is subcontracted offshore.' },
    ],
    footnote: 'Certificates of currency, the services agreement and a mutual NDA are available on request, before any scoping conversation.',
  },

  localContext: {
    title: 'Working with a consultant in your own time zone',
    paragraph: 'Most Australian analytics work is sold out of Sydney and Melbourne, which puts the people doing it two to three hours ahead of Perth. That gap is felt on the days it matters: a tracking break found on Monday morning here is a Monday afternoon problem there, and a deployment window that suits the east coast lands in the middle of a WA trading day.',
    points: [
      {
        label: 'AWST hours',
        description: 'Based in Perth, working Australian Western Standard Time. Debugging happens while your site is live and your campaigns are spending, not the following morning.',
      },
      {
        label: 'On site when it helps',
        description: 'Workshops, migration planning and handover sessions can run in person across the Perth metropolitan area. Regional WA and interstate clients are supported remotely.',
      },
      {
        label: 'Reporting configured for WA',
        description: 'GA4 properties for WA businesses should report on Australia/Perth, not the Australia/Sydney default that a hurried setup inherits. A two-hour offset quietly moves conversions across day boundaries and distorts every day-of-week and hour-of-day report you build afterwards.',
      },
      {
        label: 'Australian privacy context',
        description: 'Implementations are built with the Privacy Act 1988 and the Australian Privacy Principles in mind, and with Consent Mode v2 configured for the European and UK traffic most WA exporters and tourism operators also receive. I am not a lawyer and this is not legal advice - where the answer turns on a legal question, I will say so and work alongside yours.',
      },
    ],
  },

  audience: {
    title: 'Who this is for',
    intro: 'The work suits organisations that already have traffic and spend, and now need the measurement underneath it to hold up.',
    profiles: [
      {
        label: 'WA ecommerce and retail',
        description: 'Shopify, WooCommerce and custom carts where purchase counts in GA4 no longer match the back end, and where iOS traffic has quietly stopped reporting.',
      },
      {
        label: 'Tourism, hospitality and events',
        description: 'Booking engines on a separate domain, where the session that produced the sale is attributed to the booking provider rather than to the campaign that paid for it.',
      },
      {
        label: 'Resources and industrial services',
        description: 'Long, high-value B2B enquiry cycles where the only meaningful conversion happens in a CRM weeks after the click, and needs to be sent back to the ad platforms to be useful.',
      },
      {
        label: 'Perth agencies',
        description: 'Agencies who need a technical partner to specify, build and document server-side tagging for their own clients without adding a permanent engineering hire.',
      },
    ],
  },

  services: {
    title: 'What the work covers',
    intro: 'Three related bodies of work. Most engagements start at the top and work down, because each one is only worth doing if the one above it is sound.',
    groups: [
      {
        name: 'GA4 implementation and remediation',
        description: 'Making a property measure the thing the business actually cares about, and making it agree with the systems of record.',
        items: [
          'Audit of an inherited property: data streams, internal traffic filters, cross-domain configuration, referral exclusions, key events and attribution settings',
          'Event and conversion design built around what the business actually gets paid for. Default enhanced measurement rarely covers it',
          'Ecommerce tracking to the GA4 specification, including item-scoped parameters that make product reporting usable',
          'Reconciliation against the source of truth - Shopify orders, the CRM, the invoicing system - with the remaining variance explained rather than ignored',
          'Bot and spam traffic filtering, including the IPmeta Tag Template I authored and maintain for the GTM community gallery',
          'BigQuery export configured, then modelled in SQL so reporting is built on complete event data instead of sampled interface reports',
          'Looker Studio dashboards built on those models, covering the few numbers a decision actually turns on',
        ],
      },
      {
        name: 'Server-side tagging',
        description: 'Moving tag execution off the browser and into a first-party server container, so less is lost to tracking prevention, ad blockers and short cookie lifetimes.',
        items: [
          'Server-side Google Tag Manager deployed on a first-party subdomain of your own domain, not a shared vendor hostname',
          'First-party cookies written server-side, which typically hold for longer than the equivalent cookie set in the browser and so keep more returning visitors identifiable across visits',
          'Meta Conversions API, Google Ads enhanced conversions, TikTok Events API and LinkedIn CAPI fed from the server container with hashed identifiers',
          'Offline and CRM conversion import, so an enquiry that closes six weeks later still reaches the platform that originated it',
          'Consent Mode v2 wired end to end, with the container checking consent state before it forwards anything',
          'Hosting on Google Cloud Run, Stape, or Cloudflare Workers depending on volume, budget and where the rest of your stack already lives',
          'Payload governance: what leaves the browser, what the server forwards, what is hashed, and what is dropped before it reaches a vendor',
        ],
      },
      {
        name: 'Data models, warehousing and reporting',
        description: 'Once collection is sound, the value moves to what sits on top of it. This is the work that lets somebody ask a real question on a Tuesday and have an answer before lunch.',
        items: [
          'Power BI semantic models with agreed measures, so finance, marketing and the board quote the same number',
          'DAX measures and Power Query transformations documented, so the logic survives the analyst who wrote it',
          'BigQuery schema and table design aimed at reporting, with partitioning that keeps cost sane',
          'Database and warehouse design, incremental loads, and version-controlled models so a definition change is reviewable',
          'API integrations to ad platforms, CRM and finance systems, scheduled in Python or on Cloudflare Workers',
          'Looker Studio and Power BI dashboards that read from the model, so two people asking the same question get the same answer',
          'Reconciliation jobs and anomaly alerting, so a tracking break is caught before it becomes a quarter of bad reporting',
        ],
      },
    ],
  },

  diagnostics: {
    title: 'Symptoms worth a conversation',
    intro: 'Most of these turn out to be a measurement fault, not a marketing one. Each usually has a technical cause worth chasing before anyone touches the media plan.',
    items: [
      {
        symptom: 'GA4 reports fewer conversions than the platform, the CRM or the cart',
        cause: 'Browser-side tags being blocked, a tag firing after the user has already navigated away, or a purchase event that never fires on a cart that renders client-side.',
        fix: 'Move the conversion tag server-side so the event originates from your own infrastructure, and validate it against order records rather than against another tag.',
      },
      {
        symptom: 'Google Ads, Meta and GA4 each claim the same sale',
        cause: 'Three attribution models measuring three different things, compounded by a shrinking cookie window that credits whichever platform got the last observable touch.',
        fix: 'Establish one server-side source of conversion truth, then read the platform numbers as what they are - each vendor marking its own homework.',
      },
      {
        symptom: 'A large share of traffic arrives as Direct or Unassigned',
        cause: 'Campaign links tagged with a utm_medium GA4 does not recognise, a cross-domain hop that starts a new session, or a redirect that strips the query string.',
        fix: 'Correct the tagging taxonomy against GA4 channel definitions, then fix the cross-domain and redirect handling. Validate links before launch, while a link can still be changed.',
      },
      {
        symptom: 'Safari and iPhone traffic behaves nothing like the rest',
        cause: 'Safari\'s Intelligent Tracking Prevention shortening the life of cookies set in the browser, so returning visitors are counted as new and campaign credit is lost sooner than the sales cycle takes to close.',
        fix: 'First-party cookies set server-side on your own domain, which are generally treated more favourably than their browser-set equivalents. The exact behaviour moves with each browser release, so I measure the improvement on your own traffic rather than quote a figure at you.',
      },
      {
        symptom: 'Nobody at the company knows how the current setup works',
        cause: 'Successive agencies layering containers on containers, with no documentation and no owner.',
        fix: 'A full audit and rebuild, delivered with a documented measurement plan your team can hand to the next person.',
      },
    ],
  },


  engagement: {
    title: 'How an engagement runs',
    intro: 'Most engagements start with a conversation and a paid diagnostic, because scoping a build on a setup nobody has read yet is guesswork. After that the commercial shape is up to you. These are the ones clients pick most often.',
    models: [
      {
        name: 'Diagnostic',
        description: 'A structured audit of the existing GA4 property, tag manager containers and data layer, delivered as a written report with prioritised findings.',
        details: 'Fixed scope and fixed price. The report is yours regardless of whether any build follows.',
      },
      {
        name: 'Project based',
        description: 'A defined build with agreed deliverables and a fixed quote: GA4 remediation, server-side tagging, conversion APIs, a Power BI or BigQuery model, or the lot, phased so each stage is validated before the next begins.',
        details: 'Priced against the measurement plan agreed in the diagnostic, with documentation and a handover session included rather than quoted as an extra.',
      },
      {
        name: 'Pooled hours',
        description: 'A block of hours bought up front and drawn down as you need them, across whatever comes up - a new conversion to wire in, a dashboard to extend, a tag that broke on Friday.',
        details: 'Suits teams with a steady trickle of work that never quite justifies its own project. Unused hours do not evaporate at the end of the month.',
      },
      {
        name: 'Retainer',
        description: 'A recurring monthly arrangement with agreed availability, for teams running server-side infrastructure and reporting without an in-house owner.',
        details: 'Covers platform changes, new campaign requirements, monitoring and the occasional broken tag. Common with Perth agencies who want the capability without the permanent hire.',
      },
      {
        name: 'Something else',
        description: 'Secondment for a migration, a fixed number of days a month embedded with your team, training and handover only, or a one-off second opinion on somebody else\'s build.',
        details: 'Not every job fits a template. If you have a shape in mind that is not listed here, propose it and I will tell you honestly whether it works.',
      },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'What does server-side tagging actually fix?',
        answer: 'It moves tag execution from the visitor\'s browser to a container running on a subdomain of your own domain. That recovers a share of the measurement otherwise lost to ad blockers and browser tracking prevention, allows first-party cookies with a longer useful life, reduces the number of third-party scripts slowing your pages, and gives you a single place to control what data each vendor receives. It is an improvement in capture, not a way to see everything - anyone promising the latter is overselling it.',
      },
      {
        question: 'Is server-side tagging worth it for a smaller WA business?',
        answer: 'Not always, and I will say so during the diagnostic. It earns its keep when you are spending enough on paid media that a gap between what converted and what got counted would change how you allocate budget, or when a meaningful share of your audience is on Safari or using content blockers. The diagnostic measures that gap on your own data first, so the decision rests on your numbers rather than on an industry average. Below that, fixing the GA4 implementation itself usually returns more than adding infrastructure to a setup that was not measuring the right events to begin with.',
      },
      {
        question: 'What does it cost to run?',
        answer: 'Hosting is billed by event volume, so it scales with your traffic instead of with a plan tier. I quote it separately from the build and size it to your actual volume, so the ongoing commitment is visible before you agree to anything. If you want a figure before we talk, send me your monthly session count and I will give you one.',
      },
      {
        question: 'Will this break what we already have?',
        answer: 'The migration runs in parallel. The existing setup keeps reporting while the server container is validated alongside it, and the changeover happens only once the two reconcile. No reporting gap, and a documented rollback if one is needed.',
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
