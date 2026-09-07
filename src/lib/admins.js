// Who may open the analytics dashboard.
//
// Configure with a comma-separated list in .env.local (not committed):
//   VITE_ADMIN_EMAILS=maria@example.org,luca@example.org
//
// IMPORTANT — this is a UI gate, not a security boundary. Vite inlines env
// values into the public bundle, so anyone can read the list and any
// determined visitor can render the page. What actually protects learner data
// is the matching admin list in firestore.rules; keep the two in sync.
const RAW = import.meta.env.VITE_ADMIN_EMAILS || '';

export const adminEmails = RAW.split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const adminListConfigured = adminEmails.length > 0;

export function isAdmin(user) {
  const email = user?.email?.toLowerCase();
  return !!email && adminEmails.includes(email);
}
