// Aggregation for the consortium analytics dashboard.
//
// Pure functions over the raw Firestore documents, kept out of the page so the
// arithmetic can be exercised without a browser or a live database.

import { modules, units, totalUnitsCount } from '../data/courseData';
import { CERTIFICATE_THRESHOLD_PERCENT } from './certificate';

export const ACTIVE_WINDOW_DAYS = 30;

export function buildSummary({ users, progress, engagement, certificates }) {
  const cutoff = Date.now() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const activeUsers = users.filter((u) => toMillis(u.lastActiveAt) >= cutoff).length;

  // Progress and engagement documents carry the learner's uid so that
  // collection-group reads can be grouped per learner. Documents written
  // before that field existed simply do not contribute to distinct counts.
  const learnerIds = new Set(progress.map((p) => p.uid).filter(Boolean));
  const startedUsers = learnerIds.size;

  const totalCompletions = progress.filter((p) => p.completed).length;

  const scored = progress.filter((p) => typeof p.quizScore === 'number');
  const avgQuizScore = scored.length
    ? Math.round(scored.reduce((a, p) => a + p.quizScore, 0) / scored.length)
    : null;

  const totalSeconds = sum(engagement, 'timeSpentSeconds');

  // Completions per learner → how many are past the certificate threshold.
  const completionsPerLearner = {};
  progress.forEach((p) => {
    if (p.completed && p.uid) {
      completionsPerLearner[p.uid] = (completionsPerLearner[p.uid] || 0) + 1;
    }
  });
  const requiredUnits = Math.ceil((CERTIFICATE_THRESHOLD_PERCENT / 100) * totalUnitsCount);
  const eligibleLearners = Object.values(completionsPerLearner).filter(
    (n) => n >= requiredUnits
  ).length;

  const byUnit = units.map((u) => {
    const unitProgress = progress.filter((p) => (p.unitId || p.id) === u.id);
    const unitEngagement = engagement.filter((e) => (e.unitId || e.id) === u.id);
    const unitScored = unitProgress.filter((p) => typeof p.quizScore === 'number');
    return {
      id: u.id,
      number: u.number,
      title: u.title,
      moduleId: u.moduleId,
      completions: unitProgress.filter((p) => p.completed).length,
      learners: new Set(unitEngagement.map((e) => e.uid).filter(Boolean)).size,
      visits: sum(unitEngagement, 'visits'),
      seconds: sum(unitEngagement, 'timeSpentSeconds'),
      videoPlays: sum(unitEngagement, 'videoPlays'),
      materialOpens: sum(unitEngagement, 'materialOpens'),
      activityAttempts: sum(unitEngagement, 'activityAttempts'),
      avgScore: unitScored.length
        ? Math.round(unitScored.reduce((a, p) => a + p.quizScore, 0) / unitScored.length)
        : null
    };
  });

  const byModule = modules.map((m) => {
    const moduleUnitIds = new Set(units.filter((u) => u.moduleId === m.id).map((u) => u.id));
    const rows = byUnit.filter((r) => r.moduleId === m.id);
    const scoredRows = rows.filter((r) => r.avgScore !== null);
    const moduleLearners = new Set(
      engagement
        .filter((e) => moduleUnitIds.has(e.unitId || e.id))
        .map((e) => e.uid)
        .filter(Boolean)
    );
    return {
      id: m.id,
      icon: m.icon,
      title: `Module ${m.number}: ${m.title}`,
      unitCount: rows.length,
      completions: rows.reduce((a, r) => a + r.completions, 0),
      learners: moduleLearners.size,
      seconds: rows.reduce((a, r) => a + r.seconds, 0),
      avgScore: scoredRows.length
        ? Math.round(scoredRows.reduce((a, r) => a + r.avgScore, 0) / scoredRows.length)
        : null
    };
  });

  const totalUsers = users.length;
  const avgPercent = totalUsers
    ? Math.round((totalCompletions / (totalUsers * totalUnitsCount)) * 100)
    : 0;

  return {
    totalUsers,
    activeUsers,
    startedUsers,
    totalCompletions,
    avgUnitsPerLearner: startedUsers ? (totalCompletions / startedUsers).toFixed(1) : '0',
    avgPercent,
    avgQuizScore,
    scoredAttempts: scored.length,
    totalSeconds,
    certificatesIssued: certificates.length,
    eligibleLearners,
    byUnit,
    byModule
  };
}

export const sum = (rows, field) => rows.reduce((a, r) => a + (Number(r[field]) || 0), 0);

export const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);

export function toMillis(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (ts.seconds) return ts.seconds * 1000;
  const parsed = Date.parse(ts);
  return Number.isNaN(parsed) ? 0 : parsed;
}

