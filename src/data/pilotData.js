// Pilot activities, organised by country.
//
// Rendered as a card section on the landing page (see PilotActivities.jsx).
// There is deliberately no separate /pilots route — PA6 agreed the pilots
// belong in front of every visitor, not behind a link most people never click.
//
// HOW TO FILL THIS IN
// -------------------
// Each partner fills in their own entry and flips `published` to true.
// Until then the card shows its structure with a clearly marked "awaiting
// final figures" note — no invented numbers ever reach a visitor, which
// matters because this page is public and the project reports to EACEA.
//
// Photos: drop image files into  public/assets/pilots/<id>/  and reference
// them as './assets/pilots/<id>/<file>.jpg' (relative — Vite base is './').
// While `photos` is empty the card renders placeholder tiles so the layout
// is reviewable before the real photographs arrive.
//
// Field guide, matching the three headings agreed at PA6:
//   methodology — how the pilot was run: format, sessions, who delivered it
//   impact      — what changed for participants and their organisations
//   engagement  — how participants took part: attendance, completion, feedback
//   results     — measurable outcomes; each { value, label } renders as a stat
//   quote       — one short participant quote
//   photos      — { src, caption }

export const pilots = [
  {
    id: 'greece',
    country: 'Greece',
    flag: '🇬🇷',
    partner: 'S.I.S.E.R.A. Greece',
    partnerUrl: 'https://erasmuscredit.eu',
    published: false,
    dates: '',
    location: '',
    participants: null,
    methodology: '',
    impact: '',
    engagement: '',
    results: [],
    quote: '',
    photos: []
  },
  {
    id: 'italy',
    country: 'Italy',
    flag: '🇮🇹',
    partner: 'Officine Europa APS',
    partnerUrl: 'https://erasmuscredit.eu',
    published: false,
    dates: '',
    location: '',
    participants: null,
    methodology: '',
    impact: '',
    engagement: '',
    results: [],
    quote: '',
    photos: []
  },
  {
    id: 'turkiye',
    country: 'Türkiye',
    flag: '🇹🇷',
    partner: 'Akdeniz Panorama Derneği',
    partnerUrl: 'https://erasmuscredit.eu',
    published: false,
    dates: '',
    location: '',
    participants: null,
    methodology: '',
    impact: '',
    engagement: '',
    results: [],
    quote: '',
    photos: []
  }
];

// How many placeholder tiles to draw while a partner has supplied no photos.
export const PHOTO_PLACEHOLDER_COUNT = 3;

export const publishedPilots = () => pilots.filter((p) => p.published);

// Total participants across published pilots, or null when nothing is
// published yet — so the summary line hides instead of showing a zero.
export const totalPilotParticipants = () => {
  const published = publishedPilots();
  if (published.length === 0) return null;
  const sum = published.reduce((acc, p) => acc + (Number(p.participants) || 0), 0);
  return sum || null;
};
