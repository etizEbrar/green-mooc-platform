// Engagement tracking.
//
// The platform already knew who registered and which units they finished. The
// consortium asked for engagement metrics on top of that: how much time is
// actually spent in a unit, whether the video and the materials are opened,
// and how often activities are attempted.
//
// One document per learner per unit:  users/{uid}/engagement/{unitId}
// Kept out of the progress documents on purpose — progress stays a small,
// fast-to-read record of completion, engagement is append-only counters.
//
// Every write is best-effort. A learner must never see an error, or lose their
// place, because a metric failed to save.

import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const engagementRef = (uid, unitId) => doc(db, 'users', uid, 'engagement', unitId);

async function safeWrite(uid, unitId, payload) {
  if (!uid || !unitId) return;
  try {
    // uid is stored on the document itself so that consortium-level
    // collection-group queries can group metrics per learner.
    await setDoc(engagementRef(uid, unitId), { uid, ...payload }, { merge: true });
  } catch (err) {
    // Analytics must never break learning.
    console.warn('Engagement write failed', err);
  }
}

// Called once when a unit page opens.
export function recordUnitVisit(uid, unitId, moduleId) {
  return safeWrite(uid, unitId, {
    unitId,
    moduleId,
    visits: increment(1),
    lastVisitedAt: serverTimestamp(),
    // Only set on the very first write for this unit.
    firstVisitedAt: serverTimestamp()
  });
}

// Seconds the unit page was actually visible. Accumulated, not overwritten.
export function recordUnitTime(uid, unitId, seconds) {
  const rounded = Math.round(seconds);
  if (!rounded || rounded < 1) return Promise.resolve();
  return safeWrite(uid, unitId, {
    timeSpentSeconds: increment(rounded),
    lastVisitedAt: serverTimestamp()
  });
}

// Named interaction counters: 'videoPlays' | 'materialOpens' | 'activityAttempts'
export function recordInteraction(uid, unitId, metric) {
  if (!TRACKED_METRICS.includes(metric)) {
    console.warn(`Unknown engagement metric: ${metric}`);
    return Promise.resolve();
  }
  return safeWrite(uid, unitId, {
    [metric]: increment(1),
    lastVisitedAt: serverTimestamp()
  });
}

export const TRACKED_METRICS = ['videoPlays', 'materialOpens', 'activityAttempts'];

// Learner-level heartbeat, used by the analytics page to count active learners
// without reading every unit document.
export async function touchUserActivity(uid) {
  if (!uid) return;
  try {
    await setDoc(
      doc(db, 'users', uid),
      { lastActiveAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.warn('Activity heartbeat failed', err);
  }
}

export function formatDuration(seconds) {
  const s = Math.max(0, Math.round(Number(seconds) || 0));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}
