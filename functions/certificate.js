// Certificate issuing logic.
//
// Deliberately free of Firebase imports: everything here takes plain data or a
// small injected `db` shape, so the rules that decide whether someone has
// earned a certificate can be tested without a live project or an emulator.
// index.js is the thin layer that wires this to onCall + Firestore.

import { UNIT_IDS, TOTAL_UNITS } from './courseManifest.js';

// Agreed by the consortium at the 11th online meeting.
export const CERTIFICATE_THRESHOLD_PERCENT = 75;

// One certificate per learner, at a fixed document id, so issuing is naturally
// idempotent and a learner cannot accumulate certificates by clicking twice.
export const CERTIFICATE_DOC_ID = 'completion';

export const MAX_NAME_LENGTH = 80;

/** Errors carry a `code` matching the Cloud Functions HttpsError codes. */
export class CertificateError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/**
 * How many units are needed to reach the threshold. Rounded up, because a
 * partially finished unit does not count.
 */
export function requiredUnits(total = TOTAL_UNITS) {
  return Math.ceil((CERTIFICATE_THRESHOLD_PERCENT / 100) * total);
}

/**
 * Decide eligibility from the learner's progress documents.
 *
 * Only units that exist in the generated manifest are counted, and each unit
 * counts once — so neither a stale progress row for a deleted unit nor a
 * duplicate write can push someone over the line.
 *
 * @param {Array<{unitId?: string, id?: string, completed?: boolean}>} progressDocs
 */
export function evaluateCompletion(progressDocs) {
  const known = new Set(UNIT_IDS);
  const completed = new Set();

  for (const doc of progressDocs || []) {
    if (doc?.completed !== true) continue;
    const unitId = doc.unitId || doc.id;
    if (known.has(unitId)) completed.add(unitId);
  }

  const completedCount = completed.size;
  const percent = TOTAL_UNITS ? Math.round((completedCount / TOTAL_UNITS) * 100) : 0;
  const needed = requiredUnits(TOTAL_UNITS);

  return {
    completedCount,
    total: TOTAL_UNITS,
    percent,
    requiredUnits: needed,
    unitsRemaining: Math.max(0, needed - completedCount),
    eligible: TOTAL_UNITS > 0 && completedCount >= needed
  };
}

/**
 * Clean the name a learner asked to have printed. Rejects empty names and
 * strips control characters, which would otherwise corrupt the PDF text layer.
 */
export function sanitiseLearnerName(raw) {
  const cleaned = String(raw ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME_LENGTH);

  if (!cleaned) {
    throw new CertificateError(
      'invalid-argument',
      'Please provide the name that should appear on the certificate.'
    );
  }
  return cleaned;
}

/**
 * Deterministic, human-readable verification code. The same learner and the
 * same issue date always produce the same code, so re-running the issue call
 * is safe.
 *
 * This is a display code, not a secret: verification checks it against
 * Firestore rather than trusting the string itself.
 */
export function verificationCode(uid, issuedAtISO) {
  const day = String(issuedAtISO || '').slice(0, 10);
  const hash = fnv1a(`${uid || 'anonymous'}|${day}`)
    .toString(36)
    .toUpperCase()
    .padStart(7, '0')
    .slice(-7);
  const year = day.slice(0, 4) || String(new Date().getFullYear());
  return `CREDIT-${year}-${hash.slice(0, 4)}-${hash.slice(4)}`;
}

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Issue a certificate, or return the one already issued.
 *
 * @param {object}   args
 * @param {object}   args.store        injected persistence (see index.js)
 * @param {string}   args.uid
 * @param {string}   args.email
 * @param {string}   args.learnerName  name requested by the learner
 * @param {Date}     [args.now]
 * @returns {Promise<{certificate: object, alreadyIssued: boolean}>}
 */
export async function issueCertificate({ store, uid, email, learnerName, now = new Date() }) {
  if (!uid) {
    throw new CertificateError('unauthenticated', 'You must be signed in to request a certificate.');
  }

  const name = sanitiseLearnerName(learnerName);

  // Already issued? Return it unchanged. Re-issuing would hand the learner a
  // new code for the same achievement and invalidate anything already shared.
  const existing = await store.getCertificate(uid);
  if (existing) {
    return { certificate: existing, alreadyIssued: true };
  }

  // Completion is recomputed here from stored progress. Nothing the client
  // sends about its own progress is trusted.
  const progressDocs = await store.getProgress(uid);
  const stats = evaluateCompletion(progressDocs);

  if (!stats.eligible) {
    throw new CertificateError(
      'failed-precondition',
      `You have completed ${stats.completedCount} of ${stats.total} units (${stats.percent}%). ` +
        `${stats.requiredUnits} units (${CERTIFICATE_THRESHOLD_PERCENT}%) are required — ` +
        `${stats.unitsRemaining} to go.`
    );
  }

  const issuedAtISO = now.toISOString();
  const certificate = {
    learnerName: name,
    email: email || '',
    uid,
    unitsCompleted: stats.completedCount,
    unitsTotal: stats.total,
    percent: stats.percent,
    thresholdPercent: CERTIFICATE_THRESHOLD_PERCENT,
    code: verificationCode(uid, issuedAtISO),
    issuedAtISO
  };

  await store.saveCertificate(uid, certificate);
  return { certificate, alreadyIssued: false };
}

/**
 * Look up a certificate by its printed code.
 *
 * Returns only what a third party needs to confirm the document is genuine —
 * never the learner's email or uid.
 */
export async function verifyCertificate({ store, code }) {
  const trimmed = String(code || '').trim().toUpperCase();
  if (!trimmed) {
    throw new CertificateError('invalid-argument', 'Provide the verification code to check.');
  }

  const found = await store.findCertificateByCode(trimmed);
  if (!found) {
    return { valid: false };
  }

  return {
    valid: true,
    learnerName: found.learnerName,
    unitsCompleted: found.unitsCompleted,
    unitsTotal: found.unitsTotal,
    percent: found.percent,
    issuedAtISO: found.issuedAtISO,
    code: found.code
  };
}
