import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { modules, units, totalUnitsCount } from '../data/courseData';
import LearningSidebar from '../components/LearningSidebar';
import ModuleCard from '../components/ModuleCard';
import ProgressBar from '../components/ProgressBar';
import { CERTIFICATE_THRESHOLD_PERCENT, completionStats } from '../lib/certificate';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'users', currentUser.uid, 'progress'));
        const map = {};
        snap.forEach((d) => (map[d.id] = d.data()));
        setProgress(map);
      } catch (err) {
        console.error('Failed to load progress', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  const completedCount = useMemo(
    () => Object.values(progress).filter((p) => p.completed).length,
    [progress]
  );

  // Named certStats to avoid shadowing by the per-module `stats` map below.
  const certStats = useMemo(
    () => completionStats(progress, totalUnitsCount),
    [progress]
  );
  const overallPercent = certStats.percent;

  const moduleStats = useMemo(() => {
    const stats = {};
    modules.forEach((m) => {
      const moduleUnits = units.filter((u) => u.moduleId === m.id);
      const completed = moduleUnits.filter((u) => progress[u.id]?.completed).length;
      stats[m.id] = { completed, total: moduleUnits.length };
    });
    return stats;
  }, [progress]);

  // Find the next unit to continue with — first non-completed unit in module order.
  const nextUnit = useMemo(() => {
    for (const m of modules) {
      const list = units.filter((u) => u.moduleId === m.id);
      const next = list.find((u) => !progress[u.id]?.completed);
      if (next) return { unit: next, module: m };
    }
    return null;
  }, [progress]);

  const greetingName =
    currentUser?.displayName || currentUser?.email?.split('@')[0] || 'learner';

  return (
    <div className="learning-shell">
      <LearningSidebar />
      <div className="learning-content page--dashboard">
        <section className="hero">
          <div className="hero__text">
            <p className="hero__eyebrow">Dashboard</p>
            <h1 className="hero__title">
              Welcome back, <span className="hero__name">{greetingName}</span> 👋
            </h1>
            <p className="hero__subtitle">
              Continue building your green and circular economy expertise — one unit at a time.
            </p>
            {nextUnit && (
              <Link
                className="btn btn--primary hero__cta"
                to={`/modules/${nextUnit.module.id}/units/${nextUnit.unit.id}`}
              >
                {completedCount === 0
                  ? `Start with Unit ${nextUnit.unit.number}: ${nextUnit.unit.title} →`
                  : `Continue: Unit ${nextUnit.unit.number} — ${nextUnit.unit.title} →`}
              </Link>
            )}
          </div>
          <div className="hero__progress">
            <div className="hero__progress-stat">
              <span className="hero__progress-value">{overallPercent}%</span>
              <span className="hero__progress-label">Overall progress</span>
            </div>
            <ProgressBar value={overallPercent} />
            <p className="hero__progress-meta">
              {completedCount} of {totalUnitsCount} units completed
            </p>
          </div>
        </section>

        <section className={`cert-banner ${certStats.eligible ? 'is-earned' : ''}`}>
          <span className="cert-banner__icon" aria-hidden="true">
            {certStats.eligible ? '🏅' : '🎯'}
          </span>
          <div className="cert-banner__text">
            <h2>{certStats.eligible ? 'Your certificate is ready' : 'Certificate of completion'}</h2>
            <p className="muted">
              {certStats.eligible
                ? `You have completed ${certStats.percent}% of the course — above the ${CERTIFICATE_THRESHOLD_PERCENT}% requirement.`
                : `Complete ${certStats.requiredUnits} of ${certStats.total} units (${CERTIFICATE_THRESHOLD_PERCENT}%) to earn your certificate — ${certStats.unitsRemaining} to go.`}
            </p>
          </div>
          <Link className={`btn ${certStats.eligible ? 'btn--primary' : 'btn--ghost'}`} to="/certificate">
            {certStats.eligible ? 'Get my certificate →' : 'View progress →'}
          </Link>
        </section>

        <section className="modules-section">
          <div className="section-head">
            <h2>Your modules</h2>
            <p>Six themed modules · 30 hands-on units · CREDIT consortium curriculum</p>
          </div>
          {loading ? (
            <p className="muted">Loading your progress…</p>
          ) : (
            <div className="grid grid--modules">
              {modules.map((m) => (
                <ModuleCard
                  key={m.id}
                  module={m}
                  completed={moduleStats[m.id].completed}
                  total={moduleStats[m.id].total}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
