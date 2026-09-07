// Pilot activity results, organised by country.
//
// HOW TO FILL THIS IN
// -------------------
// Each partner replaces the placeholder text in their own entry and flips
// `published` to true. Until `published` is true the country is shown on the
// page as "results being finalised" — no invented numbers are ever displayed.
//
// Photos: drop the image files into  public/assets/pilots/<country-id>/
// and reference them as './assets/pilots/<country-id>/<file>.jpg'
// (relative paths — the site is built with Vite `base: './'`).
//
// Field guide, matching the agreed structure:
//   implementation — how the pilot was organised (dates, venue, format, who ran it)
//   impact         — what changed for the participants and their organisations
//   results        — measurable outcomes; each { value, label } renders as a stat
//   feedback       — one or two short participant quotes
//   photos         — { src, caption }

export const pilots = [
  {
    id: 'greece',
    country: 'Greece',
    flag: '🇬🇷',
    partner: 'S.I.S.E.R.A. Greece',
    published: false,
    dates: '',
    location: '',
    participants: null,
    implementation: '',
    impact: '',
    results: [],
    feedback: [],
    photos: []
  },
  {
    id: 'italy',
    country: 'Italy',
    flag: '🇮🇹',
    partner: 'Officine Europa APS',
    published: false,
    dates: '',
    location: '',
    participants: null,
    implementation: '',
    impact: '',
    results: [],
    feedback: [],
    photos: []
  },
  {
    id: 'turkiye',
    country: 'Türkiye',
    flag: '🇹🇷',
    partner: 'Akdeniz Panorama Derneği',
    published: false,
    dates: '',
    location: '',
    participants: null,
    implementation: '',
    impact: '',
    results: [],
    feedback: [],
    photos: []
  }
];

export const publishedPilots = () => pilots.filter((p) => p.published);

// Total participants across every published pilot, or null when nothing is
// published yet (so the page can hide the summary instead of showing a zero).
export const totalPilotParticipants = () => {
  const published = publishedPilots();
  if (published.length === 0) return null;
  const sum = published.reduce((acc, p) => acc + (Number(p.participants) || 0), 0);
  return sum || null;
};
