import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { getModule, getUnitsForModule, modules as allModules } from '../data/courseData';
import LearningSidebar from '../components/LearningSidebar';
import UnitCard from '../components/UnitCard';
import ProgressBar from '../components/ProgressBar';
import { trackModuleStart } from '../lib/milestones';

export default function ModulePage() {
  const { moduleId } = useParams();
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const module = getModule(moduleId);
  const moduleUnits = useMemo(() => getUnitsForModule(moduleId), [moduleId]);

  // Milestone: this learner opened this module (once per session).
  useEffect(() => {
    if (!currentUser || !moduleId) return;
    trackModuleStart(currentUser.uid, moduleId);
  }, [currentUser, moduleId]);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'users', currentUser.uid, 'progress'));
        const map = {};
        snap.forEach((d) => (map[d.id] = d.data()));
        setProgress(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  if (!module) {
    return (
      <div className="learning-shell">
        <LearningSidebar />
        <div className="learning-content">
          <div className="empty-state">
            <h2>Module not found</h2>
            <Link className="btn btn--primary" to="/dashboard">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completed = moduleUnits.filter((u) => progress[u.id]?.completed).length;
  const total = moduleUnits.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  // Finishing a module should feel like finishing something, and point at
  // the obvious next step rather than leaving the learner on a done page.
  const isModuleComplete = total > 0 && completed === total;
  const moduleIndex = allModules.findIndex((m) => m.id === module.id);
  const nextModule = allModules[moduleIndex + 1];

  return (
    <div className="learning-shell">
      <LearningSidebar />
      <div className="learning-content page--module">
        <Link to="/dashboard" className="back-link">
          ← Back to dashboard
        </Link>
        <header
          className="module-header"
          style={{ background: gradient(module.color) }}
        >
          <div className="module-header__icon">{module.icon}</div>
          <p className="module-header__eyebrow">Module {module.number}</p>
          <h1>{module.title}</h1>
          <p className="module-header__desc">{module.description}</p>
          <div className="module-header__progress">
            <ProgressBar value={percent} variant="light" />
            <span>
              {completed}/{total} units · {percent}%
            </span>
          </div>
        </header>

        {!loading && isModuleComplete && (
          <section className="module-complete">
            <span className="module-complete__icon" aria-hidden="true">
              ✓
            </span>
            <div className="module-complete__text">
              <h2>Module {module.number} completed</h2>
              <p className="muted">
                You have finished all {total} units in this module.{' '}
                {nextModule
                  ? 'Continue to the next module to keep going.'
                  : 'That is the final module — check your certificate progress.'}
              </p>
            </div>
            {nextModule ? (
              <Link className="btn btn--primary" to={`/modules/${nextModule.id}`}>
                Continue to Module {nextModule.number} →
              </Link>
            ) : (
              <Link className="btn btn--primary" to="/certificate">
                View my certificate →
              </Link>
            )}
          </section>
        )}

        <section className="units-section">
          <div className="section-head">
            <h2>Units in this module</h2>
            <p>Complete units in any order. Your progress is saved automatically.</p>
          </div>
          {loading ? (
            <p className="muted">Loading units…</p>
          ) : (
            <div className="grid grid--units">
              {moduleUnits.map((u) => (
                <UnitCard key={u.id} unit={u} progress={progress[u.id]} accent={module.color} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function gradient(color) {
  return `linear-gradient(135deg, ${color} 0%, ${shade(color, -15)} 100%)`;
}
function shade(hex, amount) {
  const c = hex.replace('#', '');
  const num = parseInt(c, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return `#${(r * 0x10000 + g * 0x100 + b).toString(16).padStart(6, '0')}`;
}
