// Certificate of completion — eligibility rules and verification codes.
//
// The consortium agreed a completion threshold of approximately 75% of the
// course. Keep the threshold here only: the About page, the dashboard, the
// sidebar and the certificate itself all read it from this module, so changing
// the number in one place changes it everywhere.

export const CERTIFICATE_THRESHOLD_PERCENT = 75;

// Turn a progress map ({ unitId: { completed, … } }) into the numbers every
// completion-aware screen needs.
export function completionStats(progressMap, totalUnits) {
  const values = Object.values(progressMap || {});
  const completedCount = values.filter((p) => p?.completed).length;
  const total = totalUnits || 0;
  const percent = total ? Math.round((completedCount / total) * 100) : 0;

  // Units still needed to cross the threshold — ceil, because a partial unit
  // does not count.
  const requiredUnits = Math.ceil((CERTIFICATE_THRESHOLD_PERCENT / 100) * total);
  const unitsRemaining = Math.max(0, requiredUnits - completedCount);

  return {
    completedCount,
    total,
    percent,
    requiredUnits,
    unitsRemaining,
    eligible: total > 0 && completedCount >= requiredUnits
  };
}

// Short, stable, human-readable code printed on the certificate so a third
// party can ask the consortium to verify it. Deterministic: the same learner
// and the same issue date always produce the same code.
export function verificationCode(uid, issuedAtISO) {
  const day = (issuedAtISO || '').slice(0, 10);
  const raw = `${uid || 'anonymous'}|${day}`;
  const hash = fnv1a(raw).toString(36).toUpperCase().padStart(7, '0').slice(-7);
  const year = day.slice(0, 4) || String(new Date().getFullYear());
  return `CREDIT-${year}-${hash.slice(0, 4)}-${hash.slice(4)}`;
}

// FNV-1a — small, dependency-free, and good enough for a display code.
// This is not a security primitive; verification is done against Firestore.
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function formatIssueDate(iso, locale = 'en-GB') {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}
