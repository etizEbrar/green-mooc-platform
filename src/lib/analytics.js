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

// ---------------------------------------------------------------------------
// Milestone summary (PA6 action 15)
// ---------------------------------------------------------------------------

/**
 * Aggregate the milestone event log into the three figures the consortium
 * asked for: completion rates, drop-off points, and active learner counts.
 *
 * @param {Array} events    documents from users/{uid}/events
 * @param {number} totalUsers registered learners, for rate denominators
 */
export function buildMilestoneSummary(events = [], totalUsers = 0) {
  const byType = (t) => events.filter((e) => e.type === t);

  const starts = byType('module_start');
  const completions = byType('unit_complete');
  const attempts = byType('quiz_attempt');
  const downloads = byType('certificate_download');

  const learnersWhoStarted = new Set(starts.map((e) => e.uid).filter(Boolean));
  const learnersWhoCompleted = new Set(completions.map((e) => e.uid).filter(Boolean));
  const learnersWithCertificate = new Set(downloads.map((e) => e.uid).filter(Boolean));

  // Distinct learners reaching each module — the shape of this series is the
  // drop-off curve.
  const reachByModule = {};
  starts.forEach((e) => {
    if (!e.moduleId || !e.uid) return;
    (reachByModule[e.moduleId] ||= new Set()).add(e.uid);
  });

  const funnel = modules.map((m) => {
    const reached = reachByModule[m.id]?.size || 0;
    const moduleUnitIds = new Set(units.filter((u) => u.moduleId === m.id).map((u) => u.id));
    const finishers = new Set(
      completions.filter((e) => moduleUnitIds.has(e.unitId) && e.uid).map((e) => e.uid)
    );
    return {
      id: m.id,
      number: m.number,
      title: m.title,
      icon: m.icon,
      reached,
      completedAny: finishers.size,
      reachRate: pct(reached, totalUsers)
    };
  });

  // Drop-off: the largest fall in learners between one module and the next.
  let dropOff = null;
  for (let i = 1; i < funnel.length; i += 1) {
    const before = funnel[i - 1].reached;
    const after = funnel[i].reached;
    const lost = before - after;
    if (before > 0 && lost > 0 && (!dropOff || lost > dropOff.lost)) {
      dropOff = {
        lost,
        percent: pct(lost, before),
        from: funnel[i - 1],
        to: funnel[i]
      };
    }
  }

  const scored = attempts.filter((e) => typeof e.score === 'number');

  return {
    totalEvents: events.length,
    learnersStarted: learnersWhoStarted.size,
    learnersCompletedAUnit: learnersWhoCompleted.size,
    certificatesDownloaded: downloads.length,
    learnersWithCertificate: learnersWithCertificate.size,
    quizAttempts: attempts.length,
    avgQuizScore: scored.length
      ? Math.round(scored.reduce((a, e) => a + e.score, 0) / scored.length)
      : null,
    // Completion rate: of those who started anything, how many earned a
    // certificate. Measuring against every registration would mostly report
    // sign-ups who never opened a lesson.
    completionRate: pct(learnersWithCertificate.size, learnersWhoStarted.size),
    activationRate: pct(learnersWhoStarted.size, totalUsers),
    funnel,
    dropOff
  };
}
