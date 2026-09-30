// Milestone event tracking (PA6 action 15).
//
// The engagement counters in engagement.js answer "how much" — visits, time,
// opens. They cannot answer "when did this learner start Module 3" or "how
// many people got as far as downloading a certificate", because a counter has
// no timeline. This module appends one document per milestone so the
// consortium can measure progression and drop-off over the pilot period.
//
//   users/{uid}/events/{autoId}
//
// Every write is best-effort and must never block or break the learner's
// journey — a monitoring feature that can fail a lesson is worse than no
// monitoring feature.

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const MILESTONES = {
  MODULE_START: 'module_start',
  UNIT_COMPLETE: 'unit_complete',
  QUIZ_ATTEMPT: 'quiz_attempt',
  CERTIFICATE_DOWNLOAD: 'certificate_download'
};

const VALID = new Set(Object.values(MILESTONES));

// Per-session de-duplication. A learner who reopens Module 3 four times in one
// sitting has started it once; without this the "module start" count measures
// browser refreshes rather than learners.
const seenThisSession = new Set();

/**
 * Append a milestone event.
 *
 * @param {string} uid
 * @param {string} type     one of MILESTONES
 * @param {object} payload  small, flat, and free of anything identifying
 * @param {object} [opts]   { once: true } to record at most once per session
 */
export async function recordMilestone(uid, type, payload = {}, opts = {}) {
  if (!uid || !VALID.has(type)) {
    if (type && !VALID.has(type)) console.warn(`Unknown milestone: ${type}`);
    return;
  }

  if (opts.once) {
    const key = `${type}:${JSON.stringify(payload)}`;
    if (seenThisSession.has(key)) return;
    seenThisSession.add(key);
  }

  try {
    await addDoc(collection(db, 'users', uid, 'events'), {
      uid,
      type,
      ...payload,
      at: serverTimestamp(),
      atISO: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Milestone write failed', err);
  }
}

// Convenience wrappers — these read better at the call sites and keep the
// payload shape consistent, which the analytics aggregation depends on.
export const trackModuleStart = (uid, moduleId) =>
  recordMilestone(uid, MILESTONES.MODULE_START, { moduleId }, { once: true });

export const trackUnitComplete = (uid, moduleId, unitId) =>
  recordMilestone(uid, MILESTONES.UNIT_COMPLETE, { moduleId, unitId });

export const trackQuizAttempt = (uid, moduleId, unitId, score) =>
  recordMilestone(uid, MILESTONES.QUIZ_ATTEMPT, {
    moduleId,
    unitId,
    score: typeof score === 'number' ? score : null
  });

export const trackCertificateDownload = (uid, code, percent) =>
  recordMilestone(uid, MILESTONES.CERTIFICATE_DOWNLOAD, { code, percent });
