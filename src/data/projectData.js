// CREDIT project facts — the single source of truth for everything that has to
// stay consistent between the introductory page, the footer, the certificate
// and the analytics export.
//
// Source: the CREDIT project website (https://erasmuscredit.eu) and the
// Erasmus+ grant agreement.

export const project = {
  acronym: 'CREDIT',
  title: 'Green & Circular Economy in Business by Digital Solutions',
  programme: 'Erasmus+ KA210-ADU — Small-scale partnerships in adult education',
  grantNumber: '2024-1-EL01-KA210-ADU-000251741',
  website: 'https://erasmuscredit.eu',
  summary:
    'CREDIT equips entrepreneurs and employees with the skills and tools to lead the green transition in Europe’s business landscape. It supports sustainable transformation in small and micro-enterprises through digital learning tools, hands-on training and practical resources.',
  disclaimer:
    'Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.'
};

export const partners = [
  {
    name: 'S.I.S.E.R.A. Greece',
    role: 'Coordinator',
    country: 'Greece',
    flag: '🇬🇷'
  },
  {
    name: 'Officine Europa APS',
    role: 'Partner',
    country: 'Italy',
    flag: '🇮🇹'
  },
  {
    name: 'Akdeniz Panorama Derneği',
    role: 'Partner',
    country: 'Türkiye',
    flag: '🇹🇷'
  }
];

// Who this MOOC is written for. Kept short and concrete — a visitor should be
// able to recognise themselves in one of these lines within a few seconds.
export const audiences = [
  {
    icon: '🏭',
    title: 'Owners of small & micro-enterprises',
    body: 'You run a business with limited time and budget, and you need sustainability steps that pay for themselves rather than a corporate strategy deck.'
  },
  {
    icon: '👷',
    title: 'Employees and team leads in SMEs',
    body: 'You want to turn a general wish to “be greener” into specific changes in the processes you already control.'
  },
  {
    icon: '🎓',
    title: 'Trainers, mentors and advisors',
    body: 'You support SMEs and want ready-made lessons, infographics and activities you can reuse with your own groups.'
  },
  {
    icon: '🌍',
    title: 'Adult education & support organisations',
    body: 'You work in adult education, a business network, a public authority or an NGO and need an open, free curriculum on the green and circular economy.'
  }
];

// The four things a learner actually does on the platform, in order.
export const howItWorks = [
  {
    step: 1,
    icon: '📝',
    title: 'Create a free account',
    body: 'Registration takes a minute and exists only so the platform can remember where you stopped and issue your certificate. The whole course is free.'
  },
  {
    step: 2,
    icon: '🧭',
    title: 'Work through the modules',
    body: 'Six modules, thirty short units. Take them in order or jump to the topic you need today — nothing is locked.'
  },
  {
    step: 3,
    icon: '🎬',
    title: 'Follow the unit sequence',
    body: 'Each unit gives you a video lesson, written lesson notes, the supporting material and infographic, and one hands-on activity applied to your own organisation.'
  },
  {
    step: 4,
    icon: '🏅',
    title: 'Earn your certificate',
    body: 'Your progress saves automatically. Complete at least 75% of the units and you can download a certificate of completion.'
  }
];
