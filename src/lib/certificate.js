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

// NOTE: verification codes are generated server-side by the `issueCertificate`
// Cloud Function (functions/certificate.js) and only displayed here. Keeping a
// second implementation in the browser would invite the two to drift apart,
// and the browser's answer would not be trusted anyway.

export function formatIssueDate(iso, locale = 'en-GB') {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Verification links
// ---------------------------------------------------------------------------

// The public page that checks a printed code. Derived from where the app is
// actually served so it stays right on localhost, GitHub Pages and a custom
// domain alike; set VITE_PUBLIC_URL to pin it (useful when certificates are
// generated somewhere other than the canonical host).
export function certificateVerifyUrl(code) {
  const configured = import.meta.env?.VITE_PUBLIC_URL;
  const base = configured
    ? String(configured).replace(/\/+$/, '') + '/'
    : typeof window !== 'undefined'
    ? window.location.origin + window.location.pathname
    : '/';
  return `${base}#/verify/${encodeURIComponent(code || '')}`;
}

// Accept what people actually paste: a bare code, a code in the wrong case,
// or the whole verification URL copied out of the address bar.
export function normaliseCode(input) {
  const raw = String(input || '').trim();
  if (!raw) return '';
  const fromUrl = raw.match(/verify\/([^/?#\s]+)/i);
  const candidate = fromUrl ? decodeURIComponent(fromUrl[1]) : raw;
  return candidate.trim().toUpperCase();
}
