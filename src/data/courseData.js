// Course data for the GreenMOOC / CREDIT platform.
// CREDIT — Circular Economy Transition for Sustainable Green Skills
// (Erasmus+ KA210 GA: 2024-1-EL01-KA210-ADU-000251741).
//
// Per-unit shape — ONE main activity per unit:
//   id, moduleId, number, title, description, estimatedTime
//   videoUrl, videoStatus       'available' | 'coming-soon'
//   materials[]                 only final learner-facing PDFs / images
//   lessonNotes[]               concise lesson summary (bullets or sections)
//   activityType                'multiple-choice' | 'checklist' | 'reflection'
//                               | 'case-study' | 'matching' | 'sorting'
//                               | 'action-plan'
//   activityTitle, activityDescription
//   …one of: quizQuestions / quizSections / checklistItems
//            / reflectionQuestions / caseStudy / matchingPairs
//            / sortingActivity / actionPlanFields

// -----------------------------------------------------------------------------
// MODULES
// -----------------------------------------------------------------------------
export const modules = [
  {
    id: 'module-1',
    number: 1,
    title: 'Foundations of Green & Circular Economy for SMEs',
    description:
      'Understand the core principles of the green and circular economy and why SMEs are at the heart of the sustainability transition.',
    color: '#2f8f6e',
    icon: '🌱'
  },
  {
    id: 'module-2',
    number: 2,
    title: 'From Green Awareness to Action',
    description:
      'Translate sustainability awareness into concrete daily practices, roles, behaviours and a real action plan.',
    color: '#3b82f6',
    icon: '💼'
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Strategy, Governance & Sustainable Business Models',
    description:
      'Move sustainability from operations to strategy: governance, business model innovation, the SCBMC and EU regulation.',
    color: '#f59e0b',
    icon: '🧭'
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Resource Efficiency: Energy, Carbon & Water',
    description:
      'Map where energy, carbon and water are spent in your SME, find quick wins and start tracking with simple indicators.',
    color: '#ef4444',
    icon: '⚡'
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Operations & Value Chain for Circularity',
    description:
      'Audit processes, eco-design products, engage suppliers, green logistics, and build circular value-chain partnerships.',
    color: '#8b5cf6',
    icon: '♻️'
  },
  {
    id: 'module-6',
    number: 6,
    title: 'Digital Tools, Nature, Reporting & Communication',
    description:
      'Use the digital tools you already own, recognise nature-related risks, build your first sustainability report and avoid greenwashing.',
    color: '#0ea5e9',
    icon: '📊'
  }
];

// -----------------------------------------------------------------------------
// UNITS
// -----------------------------------------------------------------------------
export const units = [
  // ============================ MODULE 1 ===================================
  {
    id: '1.1',
    moduleId: 'module-1',
    number: '1.1',
    title: 'Introduction to Green and Circular Economy',
    description:
      'A high-level overview of the green economy, the difference between linear and circular models, and the three pillars of sustainability — applied through realistic SME scenarios.',
    estimatedTime: '15–20 min',
    videoUrl: null,
    youtubeUrl: "https://youtu.be/FzFZNhFe2CE",
    videoStatus: 'available',
    materials: [],
    lessonNotes: [
      'The **green economy** is an economic system that supports growth and jobs while respecting environmental limits — built on three interconnected pillars: **Environmental, Social and Economic** sustainability.',
      'A **linear economy** follows take → make → dispose. A **circular economy** keeps materials and products in use as long as possible through Reduce, Reuse, Repair, Remanufacture and Recycle.',
      'Sustainability is not a cost — it is a foundation for long-term **competitiveness, resilience and risk reduction**, especially for SMEs (over 99% of EU businesses).',
      'Practical SME examples: optimising energy in production, reducing material waste, redesigning products to last longer, sustainable sourcing, integrating sustainability into decision-making.',
      'It is not about radical transformation overnight — it is about gradual improvement and strategic alignment.'
    ],
    activityType: 'multiple-choice',
    activityTitle: 'Spot the Model — Linear or Circular?',
    activityDescription:
      'Read each SME scenario and decide whether the practice is primarily LINEAR (take–make–dispose) or CIRCULAR (reduce–reuse–recover). Per-question feedback explains the reasoning.',
    quizQuestions: [
      {
        question:
          'Q1. MediFabrics, a small textile workshop (18 employees), discards all unsold fabric rolls and offcuts as municipal waste. Every new cycle starts with 100% new raw materials. Linear or Circular?',
        options: ['Linear model', 'Circular model'],
        correctIndex: 0,
        explanation:
          'Classic take–make–dispose: all unused material discarded, no recovery or reuse. A circular alternative would collect offcuts for smaller products or partner with a recycler.'
      },
      {
        question:
          'Q2. WoodCraft Studio (12 employees) collects wood offcuts from production, sorts them by size and creates smaller products. Raw material purchases dropped 20% in one year. Linear or Circular?',
        options: ['Linear model', 'Circular model'],
        correctIndex: 1,
        explanation:
          'Production by-products become new products. Material costs drop 20%, waste decreases, and new revenue is generated from what would otherwise be scrap.'
      },
      {
        question:
          'Q3. FreshProcess Ltd sends ALL organic waste to landfill twice weekly. Packaging is discarded unsorted. Waste-management costs have risen for three years. Linear or Circular?',
        options: ['Linear model', 'Circular model'],
        correctIndex: 0,
        explanation:
          'Everything goes to landfill, no sorting/composting/recovery. Rising costs are a direct symptom. Alternatives: compost organics, recycle packaging, partner with animal-feed producers.'
      },
      {
        question:
          'Q4. SunBread Bakery partners with a nearby organic farm. Unsold bread becomes animal feed at no cost; the farm supplies flour and eggs at 15% discount. Food waste is virtually eliminated. Linear or Circular?',
        options: ['Linear model', 'Circular model'],
        correctIndex: 1,
        explanation:
          'Industrial symbiosis: bread waste becomes animal feed (value recovery), discounted flour returns to the bakery (economic benefit). Both partners benefit financially while waste disappears.'
      },
      {
        question:
          'Q5. Which is NOT one of the three pillars of sustainability that the green economy is built on?',
        options: ['Environmental', 'Social', 'Economic', 'Technological'],
        correctIndex: 3,
        explanation:
          'The three pillars are Environmental, Social and Economic. Technology is a tool used in service of the three pillars, not a pillar itself.'
      }
    ]
  },

  {
    id: '1.2',
    moduleId: 'module-1',
    number: '1.2',
    title: 'Circular Economy Principles and SME Readiness',
    description:
      'Recognise circular vs linear practices, self-position your SME on a Reactive → Strategic → Mature readiness scale, and sort barriers from enablers.',
    estimatedTime: '15–20 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Circular economy is operationalised through the **9R framework**: Refuse, Rethink, Reduce, Reuse, Repair, Refurbish, Remanufacture, Repurpose, Recycle — moving from prevention (highest value) to recycling (lowest).',
      '**SME readiness** typically falls into three levels: **Reactive** (compliance/client-driven), **Strategic** (planned but not systematic), **Mature** (circularity shapes design, procurement and innovation).',
      'Common **barriers**: limited finance, lack of technical expertise, resistance to change.',
      'Common **enablers**: strong leadership commitment, supplier collaboration, growing customer demand, clear culture and governance.',
      'Honest self-assessment is the foundation — you cannot improve what you have not first measured against reality.'
    ],
    activityType: 'sorting',
    activityTitle: 'Barriers and Enablers of the Circular Transition',
    activityDescription:
      'Sort each item into Barrier or Enabler. After submitting you’ll see per-item feedback explaining the behavioural mechanism.',
    sortingActivity: {
      categories: ['Barrier', 'Enabler'],
      items: [
        { label: 'Limited access to finance for green investments', category: 'Barrier' },
        { label: 'Strong leadership commitment to sustainability', category: 'Enabler' },
        { label: 'Lack of technical expertise on circular practices', category: 'Barrier' },
        { label: 'Active collaboration with suppliers on material reuse', category: 'Enabler' },
        { label: 'Growing customer demand for sustainable products', category: 'Enabler' },
        { label: 'Resistance to change among employees or management', category: 'Barrier' }
      ]
    }
  },

  {
    id: '1.3',
    moduleId: 'module-1',
    number: '1.3',
    title: 'Green Entrepreneurship and Innovation Ecosystems',
    description:
      'Recognise green entrepreneurial actions in a realistic SME case (EcoPrint Solutions) and reflect on how innovation ecosystems support green initiatives.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: "https://youtu.be/kOpzAcfpWYY",
    videoStatus: 'available',
    materials: [],
    lessonNotes: [
      '**Green entrepreneurship** turns sustainability challenges into business opportunities — through new products, processes or business models that create environmental and social value alongside profit.',
      'Green innovation rarely happens in isolation: it depends on an **innovation ecosystem** of universities, public funding programmes, suppliers, business support agencies, peer SMEs and customers.',
      'The most common **trigger** for green entrepreneurship is the intersection of **rising costs** and **changing client expectations**, not regulation alone.',
      '**Benefits**: access to sustainability-conscious customers, lower long-term material costs, stronger brand reputation, eligibility for green funding.',
      '**Challenges**: front-loaded investment, learning curves, supplier dependencies. These are real but addressable through phasing, ecosystem partnerships and grants.'
    ],
    activityType: 'case-study',
    activityTitle: 'EcoPrint’s Green Transition',
    activityDescription:
      'Read the case below and answer the questions to apply green-entrepreneurship thinking to a real SME scenario.',
    caseStudy: {
      title: 'EcoPrint Solutions — packaging at a turning point',
      story:
        'EcoPrint Solutions: 35 employees, mid-sized European city. Produces cardboard and plastic packaging for regional food producers. Raw material costs are up 18% over two years. Three major clients now require sustainability-sourcing evidence. Owner Maria is considering recycled-content and biodegradable packaging but has no R&D team. A nearby university offers material-testing collaboration; a business support agency mentions EU funding for green innovation.',
      questions: [
        'Q1. What is the main challenge EcoPrint faces? (Cost pressure? Regulation? Workforce? Export barriers?) Justify in 2–3 sentences.',
        'Q2. Identify TWO green entrepreneurial actions Maria could realistically take in the next 12 months. Why are they "green entrepreneurship" rather than just "operational improvement"?',
        'Q3. Which ecosystem partners (university, public funding, suppliers, business support agency) would you engage first, and what specific support would you ask each one for?',
        'Q4. What are TWO benefits and TWO challenges Maria should expect from this transition?'
      ]
    }
  },

  {
    id: '1.4',
    moduleId: 'module-1',
    number: '1.4',
    title: 'The Twin Transition: Digitalisation and Sustainability',
    description:
      'Take on the role of an SME decision-maker and use the quiz to design a digital sustainability plan: priority → tool → responsible practice → impact.',
    estimatedTime: '15–20 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'The **twin transition** is the simultaneous **green and digital** transformation: digital tools accelerate sustainability, and sustainability gives digital investment a clear purpose.',
      'Match the **right tool** to the **right goal**: smart energy meters for energy reduction, route optimisation for transport emissions, simple dashboards for reporting.',
      '**Responsible digitalisation** matters: digitalisation has its own footprint (e-waste, data centres, AI energy use). Choose energy-efficient hardware/software, extend device life and avoid over-engineering.',
      'Realistic outcomes from twin-transition projects: 10–20% efficiency gains, lower operational costs, better data transparency, gradual environmental performance improvement — not instant transformation.',
      'Start with what you have: simple monitoring on existing tools (Excel, energy app) often reveals 15–20% of consumption that happens during non-productive hours.'
    ],
    activityType: 'multiple-choice',
    activityTitle: 'Build Your Digital Sustainability Plan',
    activityDescription:
      'Answer the four questions below. Each one represents one step of building a realistic digital sustainability plan for an SME.',
    quizQuestions: [
      {
        question:
          'Q1. Which digital tool best supports an SME’s goal of reducing energy consumption?',
        options: [
          'Smart energy monitoring system',
          'Social media analytics tool',
          'Customer survey platform',
          'Payroll automation software'
        ],
        correctIndex: 0,
        explanation:
          'Smart energy monitoring gives real-time visibility. Basic monitoring often reveals 15–20% energy use during non-productive hours.'
      },
      {
        question:
          'Q2. Digitalisation has its own environmental footprint. Which practice keeps it sustainable?',
        options: [
          'Choose energy-efficient hardware and software, extend device life',
          'Upgrade all equipment every year for the latest features',
          'Add multiple overlapping systems for redundancy',
          'Ignore server and device energy use'
        ],
        correctIndex: 0,
        explanation:
          'Lower-impact tools, optimised cloud usage and conscious data management reduce digital footprint. Yearly upgrades create e-waste; over-digitalisation creates complexity.'
      },
      {
        question:
          'Q3. Which is a REALISTIC outcome of an SME’s first twin-transition project?',
        options: [
          'Immediate doubling of profits',
          'Complete elimination of environmental impact',
          '10–20% efficiency improvement and better data transparency',
          'No change unless a regulator requires it'
        ],
        correctIndex: 2,
        explanation:
          'The twin transition delivers gradual, measurable improvements — not instant transformation, and not zero impact.'
      },
      {
        question:
          'Q4. An SME with limited resources is starting digital sustainability. Best first step?',
        options: [
          'Buy a custom AI platform built specifically for sustainability',
          'Reuse existing tools (Excel, accounting, communication apps) to track sustainability data',
          'Hire a full-time sustainability data scientist',
          'Wait until government subsidies are available'
        ],
        correctIndex: 1,
        explanation:
          'The first step is reusing what you have. A spreadsheet that tracks costs can also track energy/water/waste — adding a column is enough to start.'
      }
    ]
  },

  {
    id: '1.5',
    moduleId: 'module-1',
    number: '1.5',
    title: 'Competitiveness, Resilience and Green Skills for SMEs',
    description:
      'Tick the green-skill areas where you feel improvement is needed in your organisation. The result is a personal Skills Readiness Snapshot.',
    estimatedTime: '15–20 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      '**Sustainability and competitiveness reinforce each other**: efficient resource use cuts costs, sustainability stimulates innovation, and green capabilities build resilience to shocks (energy prices, supply disruption).',
      '**Green skills** are role-specific: managers focus on strategic integration, employees on resource-saving practices, entrepreneurs on green markets and ecosystem partnerships.',
      'Common **skill gaps** in SMEs: sustainability knowledge, digital sustainability skills, strategic planning, innovation capability, structured training.',
      'Resilience scenario: when energy prices spike 40%, organisations with green skills respond faster — they have the awareness and adaptive thinking to make rapid, informed decisions.',
      'Three readiness profiles: **Developing** (awareness present, development needed), **Advancing** (skills exist, need integration), **Strategic** (aligned with competitiveness).'
    ],
    activityType: 'checklist',
    activityTitle: 'Green Skills Gap Check for Your SME',
    activityDescription:
      'Tick the skill areas where YOU feel improvement is most needed in your organisation. Unticked items are existing strengths; ticked items are your personal learning priorities.',
    checklistItems: [
      'Sustainability knowledge (concepts, frameworks, vocabulary)',
      'Digital sustainability skills (tracking energy, water, materials)',
      'Strategic planning that includes sustainability',
      'Innovation capability for green products/services',
      'Structured employee training on sustainability',
      'Ability to access green funding and grants',
      'Communicating sustainability credibly to stakeholders',
      'Leading green change without losing operational stability'
    ]
  },

  // ============================ MODULE 2 ===================================
  {
    id: '2.1',
    moduleId: 'module-2',
    number: '2.1',
    title: 'Green Skills and Competences for SMEs',
    description:
      'Recognise that green skills apply to all roles. The activity is a 10-question knowledge check covering definitions, role-based green skills, and SME barriers.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      '**Green skills** = the knowledge, abilities, values and attitudes needed to support a sustainable, resource-efficient economy. They apply to **every role**, not only environmental specialists.',
      'Three categories: **Technical** (energy monitoring, waste sorting), **Managerial** (sustainable decision-making, supplier selection), **Transversal** (problem-solving, communication).',
      '**Knowledge → Skill → Competence**: knowledge is theoretical, skill is doing, competence is doing autonomously and effectively in a professional setting.',
      'Sustainability is **everyone’s responsibility**: managers provide direction and resources, employees implement and provide frontline insights — both are essential.',
      'For SMEs specifically, green skills deliver: regulatory compliance, cost efficiency, innovation capacity in green markets, and resilience against external shocks.'
    ],
    activityType: 'multiple-choice',
    activityTitle: 'Knowledge Check — Green Skills',
    activityDescription:
      'Two parts in one quiz: Part A covers definitions and concepts, Part B covers true/false statements. Submit at the end for your total score.',
    quizSections: [
      {
        title: 'PART A — Definitions and concepts',
        questions: [
          {
            question: 'Q1. The most accurate definition of green skills?',
            options: [
              'Technical skills used only by environmental experts',
              'Knowledge, abilities, values and attitudes supporting sustainability',
              'Skills related only to recycling',
              'Administrative sustainability procedures'
            ],
            correctIndex: 1,
            explanation:
              'Green skills cover the full range of competences for a sustainable economy — applicable across all job roles and sectors.'
          },
          {
            question: 'Q2. What distinguishes a competence from a skill?',
            options: [
              'Competence is theoretical knowledge',
              'Competence is the autonomous application of skills in a professional setting',
              'Skills are more advanced than competences',
              'There is no difference'
            ],
            correctIndex: 1,
            explanation:
              'Knowledge → Skill → Competence (autonomous application). Competence sits at the highest proficiency level.'
          },
          {
            question: 'Q3. Which of the following is a TRANSVERSAL green skill?',
            options: ['Waste sorting', 'Energy monitoring', 'Problem-solving', 'Machine maintenance'],
            correctIndex: 2,
            explanation:
              'Problem-solving cuts across all roles, departments and situations. The others are technical or operational.'
          },
          {
            question: 'Q4. Why are green skills strategically important for SMEs?',
            options: [
              'Only to meet legal requirements',
              'To reduce workforce size',
              'To improve efficiency, competitiveness and resilience',
              'Only for environmental reporting'
            ],
            correctIndex: 2,
            explanation:
              'Green skills deliver compliance, cost efficiency, innovation in green markets, and resilience against external shocks.'
          },
          {
            question: 'Q5. Who is responsible for implementing green practices in an SME?',
            options: [
              'Only managers',
              'Only environmental experts',
              'All employees and management together',
              'External consultants'
            ],
            correctIndex: 2,
            explanation:
              'Top-down direction + bottom-up implementation. Both are essential — neither alone is enough.'
          }
        ]
      },
      {
        title: 'PART B — True or false',
        questions: [
          {
            question: 'Q6. Green skills are only relevant for technical roles.',
            options: ['True', 'False'],
            correctIndex: 1,
            explanation: 'Green skills apply to ALL roles — managerial, technical and transversal.'
          },
          {
            question: 'Q7. SMEs often face barriers in adopting sustainability practices.',
            options: ['True', 'False'],
            correctIndex: 0,
            explanation:
              'Common barriers: limited finance, expertise gaps, resistance to change, perception of cost.'
          },
          {
            question: 'Q8. Awareness alone is enough to achieve sustainability.',
            options: ['True', 'False'],
            correctIndex: 1,
            explanation:
              'Awareness must be paired with skills, supportive structures, clear roles and behavioural nudges.'
          },
          {
            question:
              'Q9. A "competence" requires the ability to apply skills independently in real work situations.',
            options: ['True', 'False'],
            correctIndex: 0,
            explanation:
              'Competence is autonomous, effective application — that’s exactly what distinguishes it from a raw skill.'
          },
          {
            question: 'Q10. Procurement decisions have no real impact on sustainability outcomes.',
            options: ['True', 'False'],
            correctIndex: 1,
            explanation:
              'Procurement decisions ripple through the supply chain — choosing suppliers on sustainability criteria multiplies impact beyond your own operations.'
          }
        ]
      }
    ]
  },

  {
    id: '2.2',
    moduleId: 'module-2',
    number: '2.2',
    title: 'Roles and Responsibilities in the Green Transition',
    description:
      'Diagnose why a real SME sustainability initiative failed and design a simple accountability structure.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Sustainability is a **shared responsibility** distributed across all organisational levels — manager, employee and shared accountabilities together create real change.',
      '**Managers**: setting goals, allocating budget, providing strategic direction. **Employees**: daily implementation, reporting frontline issues. **Shared**: building culture, communicating progress.',
      'The classic failure pattern: an email-only announcement, no designated owner, no follow-up — initiatives die quietly within weeks.',
      'Minimum accountability structure for SMEs: one designated coordinator (often a team leader), a monthly 5-minute review and a visible operational checklist at workstations.',
      '**Top-down + bottom-up** beats either alone: leadership signals priority and provides resources; staff turn intent into operational reality.'
    ],
    activityType: 'case-study',
    activityTitle: 'CleanBright Services — when good intentions fail',
    activityDescription:
      'Read the case below and answer all questions in one analysis. Submit when complete.',
    caseStudy: {
      title: 'CleanBright Services — the failed energy initiative',
      story:
        'CleanBright Services (20 employees, commercial cleaning) wants to reduce energy consumption. Management sends an email with new guidelines: turn off equipment at end of shift, use eco-friendly products, reduce water during cleaning. After two months, nothing has changed. Employees say: "We were told once but nobody follows up." The team leader says: "Sustainability is not my responsibility." There is no designated person, no reviews, and no feedback mechanism.',
      questions: [
        'Q1. Identify at least THREE reasons why the guidelines are not being followed. Move beyond individual blame — look for systemic issues.',
        'Q2. Which roles are involved in this failure (management, team leader, employees), and what did each fail to do?',
        'Q3. Propose a simple accountability structure that would have made these guidelines stick. Be specific: who, what, when, how often?',
        'Q4. What is one nudge or default change that could reinforce the desired behaviour without relying on memory or willpower?'
      ]
    }
  },

  {
    id: '2.3',
    moduleId: 'module-2',
    number: '2.3',
    title: 'Everyday Green Practices in the Workplace',
    description:
      'Run a quick self-audit of everyday workplace habits across energy, waste, materials and behaviour — then identify your top quick wins.',
    estimatedTime: '15–20 min',
    videoUrl: null,
    youtubeUrl: "https://youtu.be/R9izCctFiak",
    videoStatus: 'available',
    materials: [],
    lessonNotes: [
      'Many workplaces consume **20% or more of their energy when nobody is there** (nights, weekends, lunch). A simple "Last Out" checklist routinely cuts utility bills 10–15% within months.',
      'Green practices fall into 4 categories: **Energy** (turn off, sleep mode, no standby), **Waste** (recycle, double-sided, reusables), **Materials** (efficient use, reuse), **Behaviour** (end-of-day check).',
      'The **printing problem** is a classic default-trap: nobody questioned single-sided default. Change the default → change behaviour.',
      'Make the **green option the easiest choice** — that is the single most powerful behavioural lever in workplace sustainability.',
      'A good action plan answers: WHAT will I change · WHEN will I start · HOW will I maintain it · HOW will I measure it · WHO else must be involved.'
    ],
    activityType: 'checklist',
    activityTitle: 'Everyday Practices Checklist',
    activityDescription:
      'Tick every practice that is ALREADY consistent in your workplace. The unticked items are your easiest quick wins — start with one this week.',
    checklistItems: [
      'ENERGY: I turn off equipment and lights when leaving my workspace',
      'ENERGY: I use energy-saving mode on my computer and devices',
      'ENERGY: I avoid leaving machines or appliances on standby',
      'WASTE: I use recycling bins correctly and avoid contamination',
      'WASTE: I minimise printing and use double-sided when necessary',
      'WASTE: I avoid single-use items when reusable alternatives exist',
      'MATERIALS: I use materials efficiently and avoid unnecessary waste',
      'MATERIALS: I reuse items where possible before discarding',
      'DIGITAL: I use digital tools instead of paper for notes and communication',
      'BEHAVIOUR: I check lights, devices and taps before leaving at end of day'
    ]
  },

  {
    id: '2.4',
    moduleId: 'module-2',
    number: '2.4',
    title: 'Green Decision-Making and Behavioural Change',
    description:
      'Why we don’t always do what we know is right — analyse the GreenTech Solutions failed energy decision through the behavioural lens.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: "https://youtu.be/pMYkJijED2E",
    videoStatus: 'available',
    materials: [],
    lessonNotes: [
      'Awareness is necessary but **not sufficient** for sustainable behaviour — habits, peer norms, convenience and incentives often overpower good intentions.',
      'The most effective behavioural lever is **changing the default** (auto-sleep, double-sided, low standby thermostat). Most people stick with whatever the system gives them.',
      'Other strong **drivers**: visible leadership modelling, peer encouragement, clear "why" communication, recognition for green behaviour.',
      'Common **barriers**: entrenched habits, lack of incentives/recognition, extra-effort green options, one-time announcements with no reinforcement.',
      'When evaluating "cost vs sustainability", consider **total cost of ownership**: waste disposal, health/risk costs, reputational impact — the cheaper option often costs more in the long run.'
    ],
    activityType: 'case-study',
    activityTitle: 'GreenTech Solutions — the nudge blueprint',
    activityDescription:
      'Read the case and answer all questions in one analysis. Look for SYSTEMIC factors, not individual blame.',
    caseStudy: {
      title: 'GreenTech Solutions — the failed energy decision',
      story:
        'GreenTech Solutions (20 employees, IT services) introduced energy guidelines via email: turn off screens at end of day, use power-saving mode, reduce air conditioning. After two months, energy bills haven’t changed. Employees say: "I forget." "It’s not convenient." "Nobody else does it." The office layout has not changed, there are no reminders, and managers themselves leave their screens on.',
      questions: [
        'Q1. Why did this decision fail? Identify at least THREE behavioural reasons.',
        'Q2. What role did habits and peer norms play in preventing the change? Be specific.',
        'Q3. What role did leadership play? Did managers model the behaviour they expected — and why does that matter?',
        'Q4. Suggest TWO practical solutions that change the ENVIRONMENT (defaults, reminders, incentives), not just awareness.'
      ]
    }
  },

  {
    id: '2.5',
    moduleId: 'module-2',
    number: '2.5',
    title: 'From Skills to Action: Applying Green Practices in SMEs',
    description:
      'The Module 2 capstone — draft your own Green Action Plan with title, owner, KPI, deadline and priority for one realistic improvement.',
    estimatedTime: '30–40 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'A good first action plan is **specific, realistic and measurable** — vague intentions ("be more sustainable") rarely change anything.',
      'Prioritise opportunities on two axes: **impact** (environmental + operational benefit) and **feasibility** (cost, time, ease).',
      'A complete plan answers six questions: WHAT will I do · WHEN will I start · WHAT resources are needed · WHO is involved · WHAT result do I expect · HOW will I measure progress.',
      'Anticipate barriers (Unit 2.4) and design at least one **nudge** to make the change stick: change a default, add a visual reminder, use peer encouragement.',
      'Keep the plan **visible** and **review monthly**. Sustainability action dies in private notebooks; it grows in public dashboards and team conversations.'
    ],
    activityType: 'action-plan',
    activityTitle: 'Your Green Action Plan',
    activityDescription:
      'Pick ONE realistic improvement and complete every field. Add more actions if useful — your plan is saved to your private profile.',
    actionPlanFields: ['Action title', 'Owner', 'KPI', 'Deadline', 'Priority', 'Notes']
  },

  // ============================ MODULE 3 ===================================
  {
    id: '3.1',
    moduleId: 'module-3',
    number: '3.1',
    title: 'Sustainability Strategy in SMEs',
    description:
      'Read 8 SWOT-framed SME signals and choose the most strategic response to each. Best answers reflect strategic integration over short-term reaction.',
    estimatedTime: '30–35 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Sustainability sits on a spectrum: **operational improvement** (cost-saving) → **strategic integration** (long-term competitive positioning). Most SMEs start operational and gradually move strategic.',
      'Five **strategic drivers** to scan for: market & customer expectations, regulatory developments, stakeholder expectations, cost & resource pressures, risk management.',
      'Use the **SWOT lens** to interpret sustainability signals: 🟢 Strengths · 🟡 Weaknesses · 🔵 Opportunities · 🔴 Threats.',
      'The strongest strategic responses are **systemic** (integrate sustainability into business strategy / governance / product portfolio) — not single-issue tactical fixes.',
      'Four strategic profiles: **Operational Response** → **Adaptive Management** → **Strategic Integration** → **Strategic Sustainability Orientation**.'
    ],
    activityType: 'multiple-choice',
    activityTitle: 'Strategy Signal Dashboard — 8 SWOT scenarios',
    activityDescription:
      'Each question presents a real signal. Pick the option that best supports long-term strategic development. The "correct" answer is the most strategic option — read all explanations to compare.',
    quizQuestions: [
      {
        question:
          'Q1. Energy is 18% of your packaging SME’s costs (+27% in 2 yrs). Main machines consume 22% more than competitors. Most strategic response?',
        options: [
          'Replace two energy-intensive machines (~€420k), reducing electricity 18–20%',
          'Internal programme on maintenance, training and monitoring (10% reduction in 18 months)',
          'Long-term plan to transform toward low-carbon packaging materials',
          'Maintain equipment and shift to off-peak tariffs (~6–7% savings)'
        ],
        correctIndex: 2,
        explanation:
          'Treats the weakness as a trigger for strategic repositioning. Combines efficiency with new market opportunity. Equipment replacement (option A) is solid but doesn’t transform competitive positioning.'
      },
      {
        question:
          'Q2. Your largest retail client (32% of sales) announces suppliers will be evaluated on environmental performance. Best response?',
        options: [
          'Introduce specific operational adjustments requested by the client',
          'Prepare documentation confirming compliance with existing regulations',
          'Develop new products designed for sustainability-oriented retail supply chains',
          'Conduct a broader internal assessment to identify environmental improvements'
        ],
        correctIndex: 2,
        explanation:
          'Expands sustainability beyond a single client into product strategy — turns one client signal into a market direction.'
      },
      {
        question:
          'Q3. Employees propose ideas for 8–10% annual waste reduction (cross-departmental coordination required). Best response?',
        options: [
          'Create a structured employee-innovation programme',
          'Integrate employee-driven sustainability innovation into product development and business planning',
          'Assign a small team to test 1–2 improvements with existing budgets',
          'Encourage informal suggestion sharing and gradual implementation'
        ],
        correctIndex: 1,
        explanation:
          'Connects bottom-up innovation to strategic decision-making — leverages the strength systemically rather than as a side project.'
      },
      {
        question:
          'Q4. Single supplier in a flood-disrupted region adds 12% logistics cost. Analysts warn extreme weather will become more frequent. Best response?',
        options: [
          'Increase inventory to maintain 2-week safety stock',
          'Maintain current supplier and negotiate better logistics conditions',
          'Review sourcing strategy more broadly — materials, suppliers and logistics models',
          'Begin evaluating alternative suppliers in other regions'
        ],
        correctIndex: 2,
        explanation:
          'Comprehensive structural review addresses root cause. Diversifying suppliers (D) is also strong but tactical.'
      },
      {
        question:
          'Q5. Bank asks if you monitor environmental indicators (for a €1.2M loan). Currently you don’t track them systematically. Best response?',
        options: [
          'Integrate environmental indicators into broader performance monitoring',
          'Start collecting basic operational data (energy, waste)',
          'Explain that environmental indicators are not monitored because no regulations require it',
          'Develop a simple internal dashboard tracking environmental indicators'
        ],
        correctIndex: 0,
        explanation:
          'Systemic integration — makes sustainability data part of management infrastructure, supporting financing AND decision-making.'
      },
      {
        question:
          'Q6. Market reports show demand for environmentally responsible packaging. R&D believes a recycled-material product is feasible at 8–12% higher costs. Best response?',
        options: [
          'Conduct a feasibility study on costs and demand',
          'Launch a broader initiative to expand the product portfolio toward environmentally responsible packaging',
          'Develop a pilot product and test with selected existing clients',
          'Monitor market developments and revisit later'
        ],
        correctIndex: 1,
        explanation:
          'Treats the opportunity as a portfolio direction, not a single product — captures the market window.'
      },
      {
        question:
          'Q7. Internal survey shows employees want stronger sustainability commitments to improve reputation and attractiveness as an employer. Best response?',
        options: [
          'Acknowledge feedback but focus on operational priorities',
          'Communicate existing environmental practices to employees',
          'Invite employees to participate in sustainability discussions',
          'Integrate sustainability goals into organisational development initiatives'
        ],
        correctIndex: 3,
        explanation:
          'Strategic integration of HR, culture and sustainability — strongest long-term impact on retention and engagement.'
      },
      {
        question:
          'Q8. Industry associations report environmental reporting may gradually expand for your sector. SMEs not currently required. Best response?',
        options: [
          'Begin collecting basic environmental performance data',
          'Evaluate how sustainability performance could influence future competitiveness',
          'Monitor policy developments and stay informed',
          'Continue current practices until regulations formally apply'
        ],
        correctIndex: 1,
        explanation:
          'Reframes regulation as competitive intelligence. Building data (A) is solid preparation but stops short of strategic interpretation.'
      }
    ]
  },

  {
    id: '3.2',
    moduleId: 'module-3',
    number: '3.2',
    title: 'Governance, Leadership and Responsibility',
    description:
      'Act as sustainability consultant for a Southern European food manufacturing SME. Diagnose the governance structure and propose realistic interventions.',
    estimatedTime: '35–45 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [
      { title: 'Governance — visual map (PNG)', type: 'IMAGE', url: '/assets/module-3/unit-3-2/infographic.png' }
    ],
    lessonNotes: [
      '**Governance** = the structures, processes and decision rules that determine how sustainability gets resourced, prioritised and executed. Strategy without governance rarely sticks.',
      'Two distinct problems to diagnose: **accountability gaps** (nobody owns the issue) vs **coordination problems** (multiple owners pulling in different directions).',
      'Watch for **misalignments**: between external sustainability claims and internal practice, between procurement KPIs and sustainability KPIs, between strategic intent and operational decisions.',
      'Realistic SME governance interventions are **lightweight**: a designated coordinator, a quarterly sustainability review embedded in existing management meetings, simple cross-functional KPI cards.',
      'Every intervention has **trade-offs** — name them honestly. The strongest diagnostic identifies systemic issues, not individual blame.'
    ],
    activityType: 'case-study',
    activityTitle: 'Food Manufacturing SME — Governance Diagnostic',
    activityDescription:
      'Read the long case and answer all six questions in one analysis. Effective answers diagnose systemic governance dynamics and name trade-offs honestly.',
    caseStudy: {
      title: 'A 90-employee food manufacturing SME — “responsible producer”',
      story:
        'A ~90-employee food SME (ready-to-eat meals, ~6% growth) recently positioned itself as a "responsible producer". Implemented: reduced plastic packaging in some lines, energy-efficient equipment, supplier collaboration. Results uneven: profit margins still volatile, sustainability concentrated in a few product lines, some clients prioritise price. No formal sustainability structure. Functions: MANAGEMENT (recognises sustainability for competitiveness, prioritises margins), PROCUREMENT (cost control, sees sustainable sourcing as risky), OPERATIONS (technical optimisation, prioritises stability), MARKETING & SALES (promotes sustainability externally, also faces price pressure). A competitor gains share through aggressive pricing without sustainability emphasis. A major retail client may require structured sustainability reporting. CEO: "We are doing more than before, but we are not sure whether this is a coherent direction or a collection of initiatives."',
      questions: [
        'Q1. STRATEGIC POSITIONING — Is sustainability primarily operational, strategic or mixed in this company? Cite evidence and identify TWO concrete trade-offs between sustainability and competitiveness.',
        'Q2. GOVERNANCE DIAGNOSIS — How is decision-making authority on sustainability distributed? Identify TWO governance misalignments that aren’t immediately obvious and explain their effects.',
        'Q3. ACCOUNTABILITY & COORDINATION — Does the organisation exhibit accountability gaps, coordination problems, or both? Provide examples and name the function with greatest influence on outcomes.',
        'Q4. STRATEGIC RISK — What risks does the current governance structure carry over time? Is the competitor’s pricing-led growth a structural threat or temporary advantage? Why?',
        'Q5. INTERVENTIONS — Propose TWO realistic governance interventions. For each, name the problem it addresses, the trade-offs introduced, and why it is feasible for an SME.',
        'Q6. PROJECTION — If governance is not improved, how could the company’s position evolve over 3–5 years on competitiveness, client relationships, regulatory exposure and operational risks?'
      ]
    }
  },

  {
    id: '3.3',
    moduleId: 'module-3',
    number: '3.3',
    title: 'Sustainable and Circular Business Models',
    description:
      'Analyse 8 SME scenarios across sectors and identify the most realistic circular business-model strategy for each.',
    estimatedTime: '30–35 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Five core **circular business model patterns**: (1) **Circular inputs** (recycled/renewable materials), (2) **Product life extension** (repair, refurbish), (3) **Product-as-a-service** (sell access not ownership), (4) **Sharing platforms**, (5) **Resource recovery** (turn waste into new value).',
      '**Reuse, repair and service models retain more embedded value than recycling** — they preserve the energy, design and material investment already made.',
      'For SMEs, the most realistic circular strategies require **limited capital** but smart partnerships (industrial symbiosis, design-for-modularity, deposit-return systems).',
      '**Circular ≠ recycling**. Recycling is the lowest-value circular strategy. Prioritise prevention, design and reuse first.',
      'Circular strategies create value through: lower input costs, stronger customer relationships, new revenue streams, brand differentiation and resilience to material price shocks.'
    ],
    activityType: 'multiple-choice',
    activityTitle: 'Pick the Circular Strategy — 8 SME scenarios',
    activityDescription:
      'For each SME scenario, pick the option that best represents a circular approach while staying economically realistic.',
    quizQuestions: [
      {
        question:
          'Q1. THE BAKERY — A bakery transforms unsold bread into breadcrumbs, croutons or ingredients for other recipes. Which circular logic is most strongly reflected?',
        options: ['Circular inputs', 'Product life extension', 'Product-as-a-service', 'Resource recovery'],
        correctIndex: 3,
        explanation: 'Resource recovery: the bakery is recovering value from output that would otherwise be discarded.'
      },
      {
        question:
          'Q2. ELECTRONICS REPAIR — Most realistic circular strategy for a small electronics repair company in a region with no local recycling infrastructure?',
        options: [
          'Build a specialised local recycling facility',
          'Sell new devices with slightly improved energy efficiency',
          'Refurbish/upgrade commonly replaced components, extending lifespan',
          'Store used electronics until national recycling infrastructure exists'
        ],
        correctIndex: 2,
        explanation:
          'Highest-value circular strategy in this context: refurbishment requires limited infrastructure and preserves device value.'
      },
      {
        question: 'Q3. CARPET-CLEANING MACHINES — Most effective circular business-model option?',
        options: [
          'Simplify design and encourage more frequent replacement',
          'Modest discount for returning old equipment',
          'Service-based model: monthly fee covering use, maintenance and parts',
          'Heavy investment redesigning machines for full end-of-life recyclability'
        ],
        correctIndex: 2,
        explanation: 'Service model retains lifecycle responsibility — most transformative option.'
      },
      {
        question: 'Q4. CRAFT BREWERY — Most effective circular approach while economically realistic?',
        options: [
          'Switch to thinner disposable bottles (~12% less glass)',
          'Deposit-return system with restaurant clients (collect, clean, reuse)',
          'Encourage municipal recycling but still buy new bottles',
          'Replace glass entirely with aluminium cans (new equipment)'
        ],
        correctIndex: 1,
        explanation: 'Reuse preserves embedded value. Deposit-return is feasible for a small brewery.'
      },
      {
        question: 'Q5. FURNITURE MANUFACTURER — Most effective circular approach realistic for the company?',
        options: [
          'Invest €250k in equipment to make composite boards from offcuts',
          'Continue selling scraps but negotiate slightly higher price',
          'Partner with a local design studio that uses offcuts as raw material (revenue share)',
          'Stricter cutting procedures to reduce offcuts ~3–4%'
        ],
        correctIndex: 2,
        explanation: 'Industrial symbiosis: turns waste into a higher-value resource flow without major capital.'
      },
      {
        question: 'Q6. COSMETICS COMPANY — Most effective circular strategy while economically realistic?',
        options: [
          'Continue virgin plastic to keep costs lowest',
          'Switch entirely to glass containers (€400k new equipment)',
          'Adopt recycled-plastic containers and communicate the change',
          'Ask customers to recycle packaging through existing systems'
        ],
        correctIndex: 2,
        explanation:
          'Circular input strategy: aligned with retailer criteria and reputation, no major infrastructure change.'
      },
      {
        question: 'Q7. KITCHEN APPLIANCES — Most effective circular product design approach realistic for the company?',
        options: [
          'Redesign so key components can be removed and replaced (slightly higher cost)',
          'Reduce production cost by simplifying for cheaper, more frequent replacement',
          'Improve recyclability so appliances can be processed after disposal',
          'Promotional discounts encouraging replacement of older appliances'
        ],
        correctIndex: 0,
        explanation: 'Design for durability, repair and modularity — the highest-value design strategy.'
      },
      {
        question: 'Q8. CONSTRUCTION RENOVATION — Most effective circular approach realistic for the project?',
        options: [
          'Use new materials with certified sustainable sourcing',
          'Send existing materials to construction-waste recycling',
          'Carefully dismantle reusable materials and incorporate them in the renovation',
          'Dispose of materials and complete project quickly'
        ],
        correctIndex: 2,
        explanation:
          'Reuse preserves the most embedded value (manufacturing energy, structural integrity, character) — highest-value strategy in construction.'
      }
    ]
  },

  {
    id: '3.4',
    moduleId: 'module-3',
    number: '3.4',
    title: 'Strategic Tools for Sustainable Business (SCBMC)',
    description:
      'Apply the Social Circular Business Model Canvas to a 12-employee lifestyle design brand. Reframe value proposition, activities and partnerships.',
    estimatedTime: '30–40 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'The **Social Circular Business Model Canvas (SCBMC)** extends the classic Business Model Canvas with environmental and social dimensions — making sustainability a structural element, not an afterthought.',
      'Five SCBMC tasks: (1) Understand current model, (2) Diagnose sustainability gaps, (3) Map expanded stakeholders, (4) Surface trade-offs, (5) Reframe Value Proposition / Activities / Partnerships.',
      'Most lifestyle brands have **opaque sourcing** and **no end-of-life loop** — typical SCBMC gaps that can be closed without changing the entire model.',
      '**Trade-off analysis** is essential: aesthetics vs durability, cost vs material quality, novelty vs waste reduction. A canvas that hides trade-offs is a marketing exercise, not a strategy.',
      'Ask the customer-acceptance question early: would your customers tolerate refill systems, fewer launches or higher prices for more sustainable products?'
    ],
    activityType: 'case-study',
    activityTitle: 'Lifestyle SME — SCBMC Application',
    activityDescription:
      'Read the case and answer all five questions in one analysis. Reference SCBMC building blocks where relevant.',
    caseStudy: {
      title: 'Lifestyle design brand (12 employees)',
      story:
        'Designs and sells ceramics, candles, posters and decorative objects (online + concept shops). Brand promises "natural materials", "mindful living", "small-batch production". Actions: less plastic packaging, partial recyclables, small-scale producers. Gaps: opaque sourcing, products not designed for durability or reuse, unsold inventory occasionally discarded, no circular system. Pressures: similar "sustainable lifestyle" competitors, growing scrutiny of claims, rising materials & logistics costs, pressure to launch new designs constantly.',
      questions: [
        'Q1. CURRENT MODEL — Describe the current value proposition. What role does sustainability really play within it (vs how it is communicated)?',
        'Q2. SUSTAINABILITY GAPS — Identify TWO key environmental impact areas and TWO realistic circular opportunities (refill, longevity, reuse, less overproduction).',
        'Q3. STAKEHOLDERS — Beyond customers, who are the key stakeholders (workshops, retail partners, suppliers, communities) and how could sustainability create additional value for them?',
        'Q4. TRADE-OFFS — Name TWO trade-offs (aesthetics vs durability, cost vs quality, novelty vs waste reduction) and explain which is most critical and why.',
        'Q5. SCBMC RESHAPING — Reframe THREE building blocks: (a) revised VALUE PROPOSITION, (b) adjusted KEY ACTIVITIES, (c) new or strengthened PARTNERSHIPS.'
      ]
    }
  },

  {
    id: '3.5',
    moduleId: 'module-3',
    number: '3.5',
    title: 'Regulatory and Framework Context for SMEs',
    description:
      'A 10-question knowledge check on CSRD, double materiality, EU Taxonomy, ISO 14001 and strategic navigation of the sustainability ecosystem.',
    estimatedTime: '25–30 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [
      { title: 'Regulatory landscape — visual map (PNG)', type: 'IMAGE', url: '/assets/module-3/unit-3-5/infographic.png' }
    ],
    lessonNotes: [
      '**CSRD** (Corporate Sustainability Reporting Directive) reaches SMEs **indirectly**: large clients subject to CSRD must report on their value chain, so they push requirements through procurement contracts.',
      '**Double materiality** has two lenses: **Impact materiality** (inside-out: how the business affects the world) + **Financial materiality** (outside-in: how external sustainability factors affect cash flow and resilience).',
      'For SMEs, smart navigation = **functional adequacy**: identify your specific exposure points (value chain, financial, market, regulatory) and respond strategically — not exhaustive compliance with everything.',
      'Use the **three-tier prioritisation**: Tier 1 = non-negotiable (business continuity, mandatory client data); Tier 2 = strategic (competitive advantage); Tier 3 = selective (revisit later).',
      'Choose tools by **function**: ISO 14001 for repeatable internal processes; GRI / ESRS logic for standardised external communication; EU Taxonomy for green-financing alignment.'
    ],
    activityType: 'multiple-choice',
    activityTitle: 'Regulatory Knowledge Check (10 questions)',
    activityDescription:
      'Test your understanding of CSRD, double materiality, EU Taxonomy and ISO 14001. One submit, total score, per-question explanations.',
    quizQuestions: [
      {
        question: 'Q1. How does CSRD most directly affect SMEs not legally required to report?',
        options: [
          'Through direct fines from the EU',
          'Through contractual / supply-chain pressure from large clients',
          'No effect until they grow beyond 500 employees',
          'Through a mandatory federal sustainability tax'
        ],
        correctIndex: 1,
        explanation:
          'Supply-chain transmission is the main mechanism: large clients pass their reporting requirements down through procurement.'
      },
      {
        question: 'Q2. In double materiality, what does IMPACT MATERIALITY (inside-out) measure?',
        options: [
          'How rising energy costs affect margins',
          'How the company’s operations affect environment and society',
          'Impact of regulations on stock price',
          'Number of frameworks adopted'
        ],
        correctIndex: 1,
        explanation:
          'Inside-out: what we do to the world. Energy costs affecting margins is FINANCIAL materiality (outside-in).'
      },
      {
        question: 'Q3. FINANCIAL MATERIALITY (outside-in) is primarily concerned with…',
        options: [
          'Philanthropic donations',
          'How external sustainability factors create risks/opportunities for cash flow',
          'Reporting CEO salary',
          'Choice of accounting software'
        ],
        correctIndex: 1,
        explanation:
          'Outside-in: what does the world do to us? Costs, cash flows, operational risks, access to finance, market position.'
      },
      {
        question: 'Q4. Items categorised as NON-NEGOTIABLE in three-tier prioritisation are…',
        options: [
          'Voluntary actions improving brand reputation',
          'Complex projects requiring resources you don’t have',
          'Requirements essential for business continuity (e.g. mandatory client data)',
          'Adopting every available international standard'
        ],
        correctIndex: 2,
        explanation:
          'Non-negotiable = business continuity at stake. Lose a primary client without their data and you lose the contract.'
      },
      {
        question: 'Q5. Primary functional role of a management system like ISO 14001?',
        options: [
          'Marketing brochure template',
          'Turn sustainability into repeatable processes through internal organisation',
          'Define which activities are green',
          'Replace financial auditing'
        ],
        correctIndex: 1,
        explanation:
          'ISO 14001 turns sustainability into structured, repeatable processes with clear responsibilities and continuous improvement cycles.'
      },
      {
        question: 'Q6. Main purpose of the EU Taxonomy for SMEs?',
        options: [
          'List illegal manufacturing chemicals',
          'Define environmentally sustainable activities, influencing access to green financing',
          'Rank the most sustainable companies in Europe',
          'Set construction minimum wage'
        ],
        correctIndex: 1,
        explanation:
          'Classification system. Banks and investors use Taxonomy alignment to determine access to green financing and preferential rates.'
      },
      {
        question: 'Q7. Why is INACTION on sustainability a business risk for an SME?',
        options: [
          'Always a criminal offence',
          'Lose major clients, reduced finance access, reputational damage',
          'Immediate closure by authorities',
          'Prevents social media use'
        ],
        correctIndex: 1,
        explanation:
          'Three concrete consequences: lose clients who require data, reduced ESG-criteria financing, reputational damage in conscious markets.'
      },
      {
        question: 'Q8. When a large client asks an SME for carbon footprint data, which transmission mechanism is at work?',
        options: ['Financial', 'Value chain', 'Regulatory', 'Cultural'],
        correctIndex: 1,
        explanation: 'Value-chain transmission — the most common way regulations reach SMEs that aren’t directly subject to them.'
      },
      {
        question: 'Q9. A common SME mistake when dealing with sustainability frameworks?',
        options: [
          'Picking only the most relevant frameworks',
          'Focusing on operational improvements rather than paperwork',
          'Adopting multiple frameworks simultaneously without prioritisation',
          'Asking clients for clarification on data requests'
        ],
        correctIndex: 2,
        explanation:
          'Trying to comply with everything creates resource strain and process chaos. Prioritisation is the strategic answer.'
      },
      {
        question: 'Q10. Strategic navigation of the sustainability ecosystem means…',
        options: [
          'Comply with every regulation and standard available',
          'Functional adequacy: identify exposure points and respond aligned with long-term competitiveness',
          'Ignore requests until legally required',
          'Outsource everything to a consultant without internal involvement'
        ],
        correctIndex: 1,
        explanation: 'Selective, focused, strategic — not exhaustive. Navigate, don’t drown.'
      }
    ]
  },

  // ============================ MODULE 4 ===================================
  {
    id: '4.1',
    moduleId: 'module-4',
    number: '4.1',
    title: 'Introduction to Resource Efficiency in SMEs',
    description:
      'A short knowledge check on resource efficiency basics — what it means, why it’s both environmental and business, and where to start.',
    estimatedTime: '10–15 min',
    videoUrl: null,
    youtubeUrl: "https://youtu.be/Cg-KOSZB5oM",
    youtubeUrlTr: "https://youtu.be/ENu5ia89p3Q",
    videoStatus: 'available',
    materials: [
      { title: 'Learning material — Resource efficiency in SMEs', type: 'PDF', url: '/assets/module-4/unit-4-1/learning-material.pdf' }
    ],
    lessonNotes: [
      '**Resource efficiency** = achieving the same or better output with less waste. Smarter use, not less use.',
      'Three resource categories to map: **Energy** (electricity, gas, fuel), **Water** (process, sanitation, cleaning), **Materials** (raw materials, packaging, consumables).',
      'Three classic SME waste examples: heating an empty workshop on weekends, using running water for cleaning, discarding clean paper offcuts. Each can be fixed for €0–150 with payback under 2 months.',
      'The **first step** is awareness — you cannot improve what you do not understand. Mapping costs nothing and reveals where action will have the most impact.',
      'Best **quick wins** are: little or no investment, can start immediately, visible results within weeks, behavioural change rather than equipment purchase.'
    ],
    activityType: 'multiple-choice',
    activityTitle: 'Resource Efficiency Knowledge Check',
    activityDescription:
      'Five quick questions to lock in the basics of resource efficiency for SMEs.',
    quizQuestions: [
      {
        question: 'Q1. What does resource efficiency mean for an SME?',
        options: [
          'Using as few resources as possible, even if quality drops',
          'Using energy/water/materials in a way that minimises waste while maintaining or improving performance',
          'Only reducing electricity bills',
          'Buying the cheapest raw materials'
        ],
        correctIndex: 1,
        explanation: 'Smarter use, not less use. Quality is preserved; waste is removed.'
      },
      {
        question: 'Q2. Why is resource efficiency BOTH environmental and business?',
        options: [
          'Only environmental — no business impact',
          'Only a business issue — no environmental impact',
          'Reducing waste lowers operating costs AND environmental impact',
          'Only matters for large corporations'
        ],
        correctIndex: 2,
        explanation:
          'The business case and the environmental case reinforce each other. SMEs collectively cause ~40% of EU business emissions and ~60% of resource consumption.'
      },
      {
        question: 'Q3. The best first step to improve resource efficiency?',
        options: [
          'Buy expensive new equipment immediately',
          'Identify where resources are used most and where waste occurs',
          'Hire an external consultant',
          'Wait for regulations'
        ],
        correctIndex: 1,
        explanation: 'You can’t improve what you don’t understand. Mapping costs nothing.'
      },
      {
        question:
          'Q4. A metalworking SME runs heating at full capacity over weekends/holidays in an empty workshop. Why is this wasteful?',
        options: [
          'Heating an unoccupied building wastes energy with zero productive benefit',
          'Weekend heating is always necessary for equipment protection',
          'It improves staff morale on Monday mornings',
          'It is required by safety regulations'
        ],
        correctIndex: 0,
        explanation:
          'A programmable thermostat (€50–150) eliminates this with payback in <1 month. Frost protection (5–10 °C) is enough for equipment.'
      },
      {
        question: 'Q5. Which is the BEST kind of "quick win" resource-efficiency action?',
        options: [
          'Costly capital investment with payback in 5+ years',
          'Behavioural change with little or no investment, visible results within weeks',
          'A pilot that requires hiring three new staff',
          'A study that takes 12 months to complete'
        ],
        correctIndex: 1,
        explanation:
          'Best quick wins: zero/low cost, immediate start, visible results within weeks. Build capability for larger changes later.'
      }
    ]
  },

  {
    id: '4.2',
    moduleId: 'module-4',
    number: '4.2',
    title: 'Energy Efficiency and Renewable Energy Basics',
    description:
      'Run a 12-item energy efficiency self-audit across lighting, equipment, heating/cooling and behaviour. The unticked items are your quick wins.',
    estimatedTime: '15–20 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [
      { title: 'Learning material — Energy efficiency basics', type: 'PDF', url: '/assets/module-4/unit-4-2/learning-material.pdf' },
      { title: 'Infographic — Energy efficiency at a glance', type: 'PDF', url: '/assets/module-4/unit-4-2/infographic.pdf' }
    ],
    lessonNotes: [
      'The biggest energy savings come from **behaviour and operations**, not new equipment: turn things off, set thermostats correctly, use sleep modes, close doors when heating runs.',
      'Audit four areas: **Lighting, Equipment, Heating/Cooling, Behaviour**. Most SMEs find quick wins in all four within an hour of inspection.',
      'A "quick win" energy action is: zero-to-low cost, can start this week, measurable on the next monthly bill (e.g. timer switches on warehouse lighting → 10–15% saving on that zone).',
      'Designate **one person** to review energy bills monthly — most unusual patterns only show up in regular review.',
      'Renewables come **after** efficiency. Reducing what you use first makes renewable investment smaller and faster to pay back.'
    ],
    activityType: 'checklist',
    activityTitle: 'Energy Efficiency Self-Audit',
    activityDescription:
      'Tick every practice that is consistently in place at your workplace. Unticked items are your top quick-win opportunities.',
    checklistItems: [
      'LIGHTING: Lights switched off in unoccupied rooms, corridors and storage areas',
      'LIGHTING: Natural daylight maximised; artificial lighting only when necessary',
      'LIGHTING: Energy-efficient lighting (LED) installed in main work areas',
      'EQUIPMENT: Machinery fully turned off (not standby) when not in use',
      'EQUIPMENT: Computers, monitors and printers set to energy-saving / sleep mode',
      'EQUIPMENT: Regular maintenance ensures equipment operates at optimal efficiency',
      'HEATING/COOLING: Thermostats set to appropriate temperatures (not excessive)',
      'HEATING/COOLING: Windows and doors kept closed when heating/cooling runs',
      'HEATING/COOLING: Systems do not run in unoccupied areas or outside working hours',
      'BEHAVIOUR: Employees aware of energy-saving practices and actively encouraged',
      'BEHAVIOUR: A specific person/process is responsible for energy management',
      'BEHAVIOUR: Energy bills reviewed at least monthly to spot unusual patterns'
    ]
  },

  {
    id: '4.3',
    moduleId: 'module-4',
    number: '4.3',
    title: 'Carbon Emissions and Basic Carbon Management',
    description:
      'A short quiz on the basics of carbon awareness — the energy-carbon link, why awareness beats perfection, and where SMEs should start.',
    estimatedTime: '10–15 min',
    videoUrl: null,
    youtubeUrl: "https://youtu.be/ig4hazGi9kM",
    videoStatus: 'available',
    materials: [],
    lessonNotes: [
      'For most SMEs, **energy use is the largest emission source** — burning fossil fuels for electricity, heating, machinery and transport.',
      'Three categories to map: **Energy use, Transport & Logistics, Materials & Waste**. Materials carry "embedded" carbon from their extraction and processing — often underestimated.',
      'You don’t need precise CO₂ numbers to act. **Directional awareness** ("most of our footprint is heating") is enough to focus on the highest-impact actions.',
      'Best **starter actions**: switch to LED, install timers, optimise heating schedules, shut down equipment EOD, combine deliveries, replace travel with video calls.',
      'Avoid **carbon offsets without operational change** — that’s greenwashing. Real carbon management starts with reducing actual emissions first.'
    ],
    activityType: 'multiple-choice',
    activityTitle: 'Carbon Awareness Knowledge Check',
    activityDescription:
      'Three quick questions on the energy–carbon link and where SMEs should start.',
    quizQuestions: [
      {
        question: 'Q1. The main link between energy use and carbon emissions?',
        options: [
          'No connection',
          'Burning fossil fuels for energy produces CO₂; reducing energy reduces emissions',
          'Only renewable energy produces emissions',
          'Carbon emissions only come from factories'
        ],
        correctIndex: 1,
        explanation:
          'Direct and proportional link. Energy efficiency is the fastest path to emission reduction for most SMEs.'
      },
      {
        question: 'Q2. Why is awareness of emission sources important even WITHOUT precise measurement?',
        options: [
          'Not important — only exact data matters',
          'Awareness alone is sufficient — no action needed',
          'Knowing where emissions come from allows SMEs to focus actions where they matter most',
          'Only large corporations need to measure'
        ],
        correctIndex: 2,
        explanation:
          'Action beats perfection. Directional awareness ("most of our emissions are from heating") is enough to start.'
      },
      {
        question: 'Q3. Most realistic action type for an SME starting carbon reduction?',
        options: [
          'Install a large solar farm',
          'Simple behavioural and operational changes that reduce energy use and waste',
          'Purchase carbon offsets without changing operations',
          'Wait for government subsidies'
        ],
        correctIndex: 1,
        explanation: 'Low-cost, high-impact, immediate. Offsets without operational change is greenwashing.'
      }
    ]
  },

  {
    id: '4.4',
    moduleId: 'module-4',
    number: '4.4',
    title: 'Water Use, Efficiency and Water-Related Risks',
    description:
      'A quick quiz on water efficiency: why it matters beyond the environment, the right first step, and the four water-related business risks.',
    estimatedTime: '10–15 min',
    videoUrl: null,
    youtubeUrl: "https://youtu.be/fepiL-47boE",
    videoStatus: 'available',
    materials: [],
    lessonNotes: [
      'Water efficiency delivers on **four business dimensions**: lower costs, reduced supply vulnerability, regulatory preparedness, stakeholder trust.',
      'Map water use across **6 categories**: production, cleaning/sanitation, cooling, kitchen/canteen, landscaping, sanitary facilities.',
      'Common water-waste sources: dripping fixtures, running hoses for cleaning, no maintenance of cooling systems, no monitoring of bills, old fixtures, no awareness training.',
      '**Four water-related business risks** to assess: supply (drought, restrictions), cost (rising prices), regulatory (tightening discharge standards), reputational (community/media scrutiny).',
      'Best first step: same as energy — **understand current use** before investing in equipment. Daily users often know exactly where waste occurs.'
    ],
    activityType: 'multiple-choice',
    activityTitle: 'Water Efficiency Knowledge Check',
    activityDescription:
      'Three quick questions on the business case for water efficiency and where to start.',
    quizQuestions: [
      {
        question: 'Q1. Why is water efficiency important for SMEs beyond environmental reasons?',
        options: [
          'Only an environmental issue',
          'Reduces costs, manages supply risks and supports business continuity',
          'Water is free, efficiency doesn’t matter',
          'Only agricultural businesses need to worry'
        ],
        correctIndex: 1,
        explanation: 'Costs, supply, regulation, reputation — four business dimensions, not just environment.'
      },
      {
        question: 'Q2. Best first step for water efficiency?',
        options: [
          'Install expensive recycling equipment',
          'Hire a water engineer',
          'Identify where water is used most and where waste occurs',
          'Wait for water to become more expensive'
        ],
        correctIndex: 2,
        explanation: 'Mapping reveals where action has the most impact. Daily users often know where waste occurs.'
      },
      {
        question: 'Q3. What is a water-related BUSINESS risk?',
        options: [
          'Only affects businesses near rivers',
          'Risk from supply, costs, regulations or reputation',
          'Only applies to water utilities',
          'Theoretical concept with no practical implications'
        ],
        correctIndex: 1,
        explanation:
          'Four dimensions: supply (availability), cost (rising prices), regulatory (tightening standards), reputational (stakeholder expectations).'
      }
    ]
  },

  {
    id: '4.5',
    moduleId: 'module-4',
    number: '4.5',
    title: 'Monitoring, Measurement and Simple Indicators for SMEs',
    description:
      'A quick quiz on the principle that simple, consistent monitoring beats complex one-off measurement.',
    estimatedTime: '10–15 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Most SMEs **already collect more sustainability data than they realise** — utility bills, fuel receipts, waste invoices, purchase records. The barrier is habit, not data.',
      'A good SME indicator is: **simple, relevant, based on existing data, tracked consistently**. Tracking 2–3 indicators consistently beats tracking 10 inconsistently.',
      '**Trends matter more than precision**. "Electricity use +8% this quarter" is actionable. "14,287.456 kWh" without comparison is not.',
      'Suggested starter indicators: monthly electricity (kWh), gas, water (m³), fuel (litres), waste volume, energy cost per unit of output, material waste % of input.',
      'No expensive software needed: a spreadsheet + monthly bill review delivers the first 5–15% of identified savings.'
    ],
    activityType: 'multiple-choice',
    activityTitle: 'Monitoring Basics Knowledge Check',
    activityDescription:
      'Three quick questions on what makes a good SME indicator and why trends matter more than precision.',
    quizQuestions: [
      {
        question: 'Q1. Why is monitoring resource use important for SMEs?',
        options: [
          'Only required by regulation',
          'Identifies inefficiencies, tracks improvements and supports better decisions',
          'Too complex for SMEs',
          'Only useful with expensive software'
        ],
        correctIndex: 1,
        explanation:
          'Monitoring turns assumptions into evidence. A spreadsheet and monthly bill review is enough — no special software needed.'
      },
      {
        question: 'Q2. What makes a good indicator for an SME?',
        options: [
          'Specialised equipment required',
          'As complex and detailed as possible',
          'Simple, relevant, based on available data, tracked consistently',
          'Three decimal places of precision'
        ],
        correctIndex: 2,
        explanation:
          'Four qualities: simple, relevant, based on existing data, tracked consistently. Complexity kills consistency.'
      },
      {
        question: 'Q3. Should an SME wait for perfect data before starting to monitor?',
        options: [
          'No — start with available data and track trends; improve precision over time',
          'Yes — only precise data is useful',
          'Yes — monitoring without perfect data is meaningless',
          'SMEs should never monitor — too expensive'
        ],
        correctIndex: 0,
        explanation: 'Perfect is the enemy of good. Imperfect data tracked consistently reveals actionable trends.'
      }
    ]
  },

  // ============================ MODULE 5 ===================================
  {
    id: '5.1',
    moduleId: 'module-5',
    number: '5.1',
    title: 'Circular Operations in SMEs',
    description:
      'Pick one process from your work and turn it into a circular redesign action — INPUT → USE → OUTPUT, plus the change and its business case.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Every operational process has a **linear shape** by default: take inputs → use them → produce outputs (some intended, some waste). Mapping it is the first step to redesign.',
      'Three circular levers to apply to any process: **REUSE** (by-products as inputs), **REDUCE** (better cutting, less packaging, fewer defects), **IMPROVE** (more efficient steps).',
      'Start with **one simple process** (one batch, one delivery, one cleaning cycle). Don’t try to redesign the whole business at once.',
      'A good redesign is **specific** (who does what, when, how) and **realistic** (existing tools, existing partners, current budget).',
      'Connect every change to **business value**: reduced waste cost, reduced material spend, reduced energy use, improved efficiency, new revenue from by-products.'
    ],
    activityType: 'action-plan',
    activityTitle: 'Map and Redesign One Process',
    activityDescription:
      'Pick ONE simple process from your work. Map it as input → use → output, then propose ONE small circular change. Save your redesign to your private profile.',
    actionPlanFields: [
      'Process name (e.g. Producing one batch of bread)',
      'INPUT — materials/resources in',
      'USE — process steps',
      'OUTPUT — waste / unused materials',
      'Proposed change (specific: who, what, when, how)',
      'Circular principle applied (Reuse / Reduce / Extend product life)',
      'Business case in one sentence'
    ]
  },

  {
    id: '5.2',
    moduleId: 'module-5',
    number: '5.2',
    title: 'Eco-design and Sustainable Materials',
    description:
      'A 5-question reflection that walks you through an eco-design audit of one product across durability, reparability, materials and waste.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      '**Eco-design** = designing products and services so they have less environmental impact across their full life cycle: materials, production, use, repair, end-of-life.',
      'Audit four dimensions: **Durability** (built to last vs designed for replacement), **Reparability** (modular, spare parts, affordable repair), **Materials** (recycled, renewable, non-toxic), **Waste** (production + end-of-life).',
      '**Reparability often beats recyclability**: a repaired product preserves all the energy, design and material that went into it; a recycled product loses most of it.',
      'For SMEs, eco-design is bounded by **suppliers, costs and customer acceptance**. Smart proposals account for those constraints rather than ignoring them.',
      'Specific beats vague: "switch to recycled aluminium for the housing" is a real proposal; "use better materials" is not.'
    ],
    activityType: 'reflection',
    activityTitle: 'Eco-design Audit',
    activityDescription:
      'Pick one product or service from your organisation and answer all five questions in one reflection.',
    reflectionQuestions: [
      'Q1. DURABILITY — How long does your product last? Is it built to last or designed for replacement? What causes failure?',
      'Q2. REPARABILITY — Can it be fixed when broken? Are spare parts available and affordable? Is the design modular?',
      'Q3. MATERIALS — What materials are used? Recycled? Renewable? Toxic? Hard to source? Could any be improved?',
      'Q4. WASTE — How much waste is generated during production AND at end of life? Where could it be minimised?',
      'Q5. PROPOSAL — Propose ONE specific eco-design improvement: what changes, expected benefit, and is it realistic with current suppliers and costs?'
    ]
  },

  {
    id: '5.3',
    moduleId: 'module-5',
    number: '5.3',
    title: 'Sustainable Procurement and Supplier Engagement',
    description:
      'Compare two packaging suppliers in a real SME case and write a reasoned, criteria-based decision.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      '**Procurement decisions ripple through the value chain**: a supplier choice today shapes the environmental impact, cost structure and resilience of your business for years.',
      'Sustainability criteria for supplier evaluation: material type, waste generation, resource use, supplier practices (certifications), carbon footprint (transport, energy mix), working conditions, willingness to engage.',
      'There is no single "correct" supplier choice — the goal is **reasoned justification**, balancing cost, quality, sustainability and long-term value.',
      'Often **engaging existing suppliers** to improve is more strategic than switching to new ones. Ask for: smaller packaging, recycled content, lower-carbon transport.',
      'Embed sustainability in **tender criteria, supplier codes of conduct and annual reviews** — not just one-off conversations.'
    ],
    activityType: 'case-study',
    activityTitle: 'The Supplier Choice — Cost vs Sustainability',
    activityDescription:
      'Read the case and answer all questions in one analysis. Either supplier can be justified; the goal is reasoned thinking.',
    caseStudy: {
      title: 'A small food brand chooses a packaging supplier',
      story:
        'A small food brand (~25 employees) needs new product packaging. SUPPLIER A — €0.18/unit, virgin plastic single-use, low recyclability, reliable weekly delivery, standard market option. SUPPLIER B — €0.24/unit (33% higher), 70% recycled plastic OR fully reusable container, high recyclability (single-material certified), reliable weekly delivery, rising sustainability profile. At ~50,000 units/year, Supplier B costs ~€3,000/year more.',
      questions: [
        'Q1. Which supplier shows STRONGER sustainability performance, and why? Reference at least three sustainability criteria (material, recyclability, end-of-life, etc.).',
        'Q2. Which supplier would YOU choose, and why? List the top three factors that influenced your decision and where sustainability sits among them.',
        'Q3. Could the LESS sustainable supplier be ENGAGED to improve rather than replaced? What three simple changes would you ask for first?',
        'Q4. How would you embed sustainability criteria into your procurement process going forward (tender criteria, code of conduct, annual review)?'
      ]
    }
  },

  {
    id: '5.4',
    moduleId: 'module-5',
    number: '5.4',
    title: 'Green Logistics and Sustainable Mobility',
    description:
      'Audit ONE logistics activity and propose a specific improvement — connecting environmental impact, cost and operational efficiency.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Logistics is often the **largest source of preventable emissions** in service-sector SMEs — repeated trips, half-empty vehicles, unnecessary movements.',
      'Audit ONE logistics activity in depth (not all of them). Detail: frequency, routes, resource use, inefficiencies. Patterns invisible at high level appear in detail.',
      'Look for four common inefficiencies: **repeated trips** (multiple to the same area), **overlapping routes**, **underused vehicles** (large vehicle, small load), **unnecessary movements** (avoidable through coordination or video calls).',
      'Best green-logistics improvements are **operational, not vehicular**: combine deliveries, optimise routes, share logistics with neighbouring SMEs, replace travel with video calls.',
      'Strong business case = environmental + cost + efficiency. Less fuel + less driver time + less wear-and-tear + better customer service.'
    ],
    activityType: 'action-plan',
    activityTitle: 'Logistics Audit & Improvement Plan',
    activityDescription:
      'Pick ONE logistics activity and complete every field. Save your audit to your private profile.',
    actionPlanFields: [
      'Activity name (e.g. Daily delivery to retail clients in central city)',
      'Frequency (daily, multiple/day, weekly…)',
      'Route plan (optimised, fixed, ad hoc?)',
      'Top inefficiency observed',
      'Proposed improvement (specific: who, what, when, how)',
      'Required resources (software, training, coordination)',
      'Expected benefit (fuel saving, cost saving, time saving)'
    ]
  },

  {
    id: '5.5',
    moduleId: 'module-5',
    number: '5.5',
    title: 'Circular Value Chains and Collaboration',
    description: 'Map one circular collaboration with a real partner — making sure both sides benefit.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'A **circular value chain** isn’t built alone — it depends on suppliers, customers, partners and even waste collectors who can absorb your by-products as their inputs.',
      'Start by **mapping**: place your organisation at the centre, then list suppliers (left), customers (right), partners (top/bottom). For each connection, write what flows: materials, products, services, money, information.',
      'Look for three opportunity types: **Cross-actor reuse** (your waste = their input), **Waste-to-input flows** (food waste → animal feed; offcuts → craft maker), **Collaborative efficiency** (shared logistics, joint procurement).',
      'A collaboration only works when **both sides benefit** — answer "what’s in it for the partner?" before proposing anything.',
      'Start small: a single phone call, a pilot exchange, a 3-month trial. A perfect plan that never starts is worse than an imperfect plan that begins next week.'
    ],
    activityType: 'action-plan',
    activityTitle: 'Circular Collaboration Plan',
    activityDescription:
      'Identify ONE realistic collaboration with a named partner. Make sure both sides benefit. Save your plan to your private profile.',
    actionPlanFields: [
      'Partner — who would you collaborate with? (Specific name/type)',
      'Collaboration — concrete description of the exchange or joint action',
      'Benefit FOR YOU (cost savings, revenue, reputation, learning)',
      'Benefit FOR THE PARTNER (what’s in it for them?)',
      'Benefit FOR THE ENVIRONMENT (less waste, fewer emissions)',
      'First small step (meeting, pilot, formal proposal)',
      'Main challenge to anticipate'
    ]
  },

  // ============================ MODULE 6 ===================================
  {
    id: '6.1',
    moduleId: 'module-6',
    number: '6.1',
    title: 'Digital Tools for Sustainable SME Management',
    description:
      'Map one of your existing digital tools to a sustainability use — using what you already own, not buying new software.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Most SMEs **already own enough digital tools** for sustainability monitoring — Excel, accounting software, communication platforms, project apps. The barrier is wiring them to sustainability needs.',
      'A spreadsheet that already tracks costs can also track energy use, water volumes, waste — adding a column is enough to start.',
      'Communication tools (Teams, Slack, Zoom) are **the simplest carbon-reduction tool you already pay for**: virtual meetings replace travel.',
      'Most effective answers REUSE what already exists. New software is the option of last resort, not first.',
      'Frame each digital improvement as: TOOL × SUSTAINABILITY METRIC × EXPECTED VISIBILITY.'
    ],
    activityType: 'action-plan',
    activityTitle: 'Digital Tool Application Plan',
    activityDescription:
      'Pick ONE existing digital tool and design a simple sustainability application for it. No new software allowed.',
    actionPlanFields: [
      'Tool name (e.g. Excel, accounting software, Teams)',
      'Current function (what is it used for today?)',
      'Sustainability use (what new metric or process will it monitor?)',
      'Expected benefit (what becomes visible / measurable?)',
      'First step (set up a sheet, add a column, train one person)',
      'Cost (most digital improvements use existing licences = €0)'
    ]
  },

  {
    id: '6.2',
    moduleId: 'module-6',
    number: '6.2',
    title: 'AI, Data and Innovation for Sustainable SMEs',
    description:
      'A reflection on how SMEs can responsibly use AI and data to support sustainability decisions. Source materials are still being finalised by the CREDIT consortium.',
    estimatedTime: '15–20 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      '**This unit’s full source materials are still being finalised by the CREDIT consortium.** The reflection prompts below let you start thinking about responsible AI/data use until the full content is published.',
      'Realistic first AI use cases for SMEs: predictive maintenance, route optimisation, demand forecasting, document classification, energy-pattern detection.',
      'AI is **not free of footprint**: training and inference consume energy. Choose purposeful use, not "AI everywhere".',
      'Data quality matters more than tool sophistication. Start by collecting clean, consistent records of energy, water, material and waste data.',
      'Privacy, bias and transparency are not optional add-ons — they’re part of being a responsible SME using AI.'
    ],
    activityType: 'reflection',
    activityTitle: 'AI & Data for Sustainability — Reflection',
    activityDescription: 'Answer all four questions in one reflection. Save when complete.',
    reflectionQuestions: [
      'Q1. Where in your business could AI or data analysis realistically help reduce waste, energy or emissions?',
      'Q2. What sustainability data does your SME already collect that an AI tool could analyse for patterns?',
      'Q3. What risks does irresponsible AI/data use create (privacy, bias, energy footprint of AI itself)?',
      'Q4. What would be a small, low-risk first step to test data-driven sustainability in your SME?'
    ]
  },

  {
    id: '6.3',
    moduleId: 'module-6',
    number: '6.3',
    title: 'Nature, Biodiversity and Nature-Related Risks for SMEs',
    description:
      'A reflection that audits your "invisible" dependencies on nature — even office businesses depend on natural systems.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Even "indoor" office businesses depend on natural systems: energy from a grid, water for sanitation, food for staff, materials extracted from forests and mines.',
      'Identify your **3 key natural-resource dependencies** — name the resource, source region, and how it’s used in your operations.',
      'Three risk types to scan for: **Supply** (drought, biodiversity loss, regulation restricting extraction), **Operational** (heat waves, flooding, transport disruption), **Reputational** (sourcing scandals, water scarcity in your region).',
      'Nature-related risks operate on **two time horizons**: short-term (1–2 yrs, e.g. drought) and long-term (5–10+ yrs, e.g. biodiversity collapse). Both matter.',
      'The first action is awareness — a team conversation, a risk register entry, a supplier inquiry. You don’t need a TNFD-style report to start.'
    ],
    activityType: 'reflection',
    activityTitle: 'Nature Dependency Audit',
    activityDescription:
      'Answer all five questions in one reflection. Be specific — name the resource, the region, the risk, the impact.',
    reflectionQuestions: [
      'Q1. Identify your TOP 3 natural-resource dependencies (resource, source region, how used in operations).',
      'Q2. What happens if these resources become limited or disrupted? (Drought, biodiversity loss, regulation, extreme weather)',
      'Q3. How would these risks affect your COSTS, CUSTOMERS and REPUTATION?',
      'Q4. Are these risks short-term (1–2 years) or long-term (5–10+ years)? Explain why both matter.',
      'Q5. What is ONE simple awareness action you could take this month? (Team conversation, risk register entry, supplier inquiry)'
    ]
  },

  {
    id: '6.4',
    moduleId: 'module-6',
    number: '6.4',
    title: 'Sustainability Reporting and Transparency for SMEs',
    description:
      'Build the structure of your first one-page sustainability report — short summary, 3–5 key indicators, and 2–3 main messages.',
    estimatedTime: '25–30 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Most SMEs **already have more sustainability data than they realise** — energy bills, employee data, supplier lists, operational records — just scattered across functions.',
      'Three categories to organise data into: **Environmental** (energy, water, materials, waste), **Social** (employees, conditions, training, accidents, community), **Organisational** (policies, certifications, governance, ethics).',
      'Three uses of sustainability data: **Monitoring** (internal management) → **Reporting** (formal external) → **Communication** (informal external). Each step requires more rigour.',
      'A good first sustainability report is **honest, factual and brief**. "We are starting our journey and tracking these 5 indicators" is more credible than a glossy 50-page report with vague claims.',
      'Match reporting to **stakeholder needs**: customers want product impact, banks want governance + performance KPIs, employees want culture and conditions.'
    ],
    activityType: 'action-plan',
    activityTitle: 'Your One-Page Sustainability Report',
    activityDescription:
      'Draft the structure of your first one-page report. Honesty + brevity + verifiability beats a glossy 50-page document.',
    actionPlanFields: [
      'Short summary (3–5 sentences: what you do, why sustainability matters, your overall approach)',
      'Key indicator 1 (e.g. annual electricity kWh)',
      'Key indicator 2 (e.g. water m³)',
      'Key indicator 3 (e.g. employee training hours)',
      'Main message 1 (specific and verifiable, not vague)',
      'Main message 2 (specific and verifiable, not vague)',
      'Primary audience (customers, banks, employees, suppliers, community)'
    ]
  },

  {
    id: '6.5',
    moduleId: 'module-6',
    number: '6.5',
    title: 'Green Communication, Marketing and Avoiding Greenwashing',
    description:
      'Rewrite three classic vague claims using the CLEAR + SPECIFIC + EVIDENCE test, then your own current claim.',
    estimatedTime: '20–25 min',
    videoUrl: null,
    youtubeUrl: null, // PASTE_YOUTUBE_LINK_HERE — unlisted YouTube URL
    videoStatus: 'coming-soon',
    materials: [],
    lessonNotes: [
      'Most organisations communicate **more sustainability claims than they realise** — every "eco-friendly", "green", "natural" on packaging, website or sales materials counts.',
      'Test every claim against **three rules**: is it CLEAR (specific meaning), SPECIFIC (what / how much / where), and backed by EVIDENCE (data, certification, third-party verification)?',
      'Vague claims like "eco-friendly", "green solution", "sustainable materials" are **classic greenwashing** — vague today, reputational crisis tomorrow when scrutiny increases.',
      'Rewrite formula: vague claim → **specific material + specific percentage + specific certification**. "Eco-friendly product" → "Made with 60% recycled materials, certified by [body]".',
      'The most important rule: **alignment**. Communication must reflect real practice. If the practice does not match, change the practice — not just the message.'
    ],
    activityType: 'action-plan',
    activityTitle: 'Rewrite for Trust — Greenwashing Repair',
    activityDescription:
      'Rewrite each vague claim using CLARITY + EVIDENCE. Add specific material, specific percentage, specific certification. Then rewrite one of your own.',
    actionPlanFields: [
      'Rewrite of "Eco-friendly product" → specific material + percentage + certification',
      'Rewrite of "Green solution" → specific feature + data + evidence',
      'Rewrite of "Sustainable materials" → specific materials + sourcing + certification',
      'YOUR OWN current claim (copy it as is)',
      'YOUR OWN claim — rewritten for credibility',
      'Evidence you can actually show (data, audit, certificate)',
      'Where this rewritten claim will be used (website, packaging, sales)'
    ]
  }
];

// Utility helpers used by the pages and components.
export const getModule = (moduleId) => modules.find((m) => m.id === moduleId);
export const getUnitsForModule = (moduleId) => units.filter((u) => u.moduleId === moduleId);
export const getUnit = (unitId) => units.find((u) => u.id === unitId);
export const totalUnitsCount = units.length;
