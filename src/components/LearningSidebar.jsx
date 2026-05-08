import { useEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { modules, units, totalUnitsCount } from '../data/courseData';
import ProgressBar from './ProgressBar';

// Persistent left sidebar: lists modules, expands the active module's units,
// shows completion ticks and overall course progress.
// On mobile, it collapses behind a "Browse course" toggle.
export default function LearningSidebar() {
  const { currentUser } = useAuth();
  const { moduleId, unitId } = useParams();

  const [progress, setProgress] = useState({});
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set([moduleId].filter(Boolean)));

  // Reload progress whenever the URL changes (cheap and keeps ticks current
  // when a learner finishes a unit).
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'users', currentUser.uid, 'progress'));
        if (cancelled) return;
        const map = {};
        snap.forEach((d) => (map[d.id] = d.data()));
        setProgress(map);
      } catch (e) {
        // Stay silent — sidebar still renders without ticks.
        console.warn('Sidebar progress load failed', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser, moduleId, unitId]);

  // Always expand the current module.
  useEffect(() => {
    if (!moduleId) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      next.add(moduleId);
      return next;
    });
  }, [moduleId]);

  const completedCount = useMemo(
    () => Object.values(progress).filter((p) => p.completed).length,
    [progress]
  );
  const overallPercent = totalUnitsCount
    ? Math.round((completedCount / totalUnitsCount) * 100)
    : 0;

  const toggleModule = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        ☰ Browse course
      </button>

      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar__header">
          <p className="sidebar__title">Course path</p>
          <p className="sidebar__progress-label">
            <strong>{overallPercent}%</strong> · {completedCount}/{totalUnitsCount} units
          </p>
          <ProgressBar value={overallPercent} />
        </div>

        <nav className="sidebar__nav">
          {modules.map((m) => {
            const moduleUnits = units.filter((u) => u.moduleId === m.id);
            const completedHere = moduleUnits.filter((u) => progress[u.id]?.completed).length;
            const isExpanded = expanded.has(m.id);
            const isActive = moduleId === m.id;
            return (
              <div key={m.id} className={`sidebar-module ${isActive ? 'is-active' : ''}`}>
                <button
                  type="button"
                  className="sidebar-module__head"
                  onClick={() => toggleModule(m.id)}
                  aria-expanded={isExpanded}
                >
                  <span
                    className="sidebar-module__icon"
                    style={{ background: m.color }}
                    aria-hidden="true"
                  >
                    {m.icon}
                  </span>
                  <span className="sidebar-module__text">
                    <span className="sidebar-module__eyebrow">Module {m.number}</span>
                    <span className="sidebar-module__title">{m.title}</span>
                    <span className="sidebar-module__progress">
                      {completedHere}/{moduleUnits.length} units
                    </span>
                  </span>
                  <span className="sidebar-module__chev">{isExpanded ? '▾' : '▸'}</span>
                </button>

                {isExpanded && (
                  <ul className="sidebar-units">
                    <li>
                      <NavLink
                        to={`/modules/${m.id}`}
                        className={({ isActive: a }) =>
                          `sidebar-unit sidebar-unit--module ${a ? 'is-active' : ''}`
                        }
                        onClick={() => setOpen(false)}
                        end
                      >
                        <span className="sidebar-unit__num">★</span>
                        <span className="sidebar-unit__label">Module overview</span>
                      </NavLink>
                    </li>
                    {moduleUnits.map((u) => {
                      const done = !!progress[u.id]?.completed;
                      const inProgress = !done && !!progress[u.id]?.activityCompleted;
                      return (
                        <li key={u.id}>
                          <NavLink
                            to={`/modules/${m.id}/units/${u.id}`}
                            className={({ isActive: a }) =>
                              `sidebar-unit ${a ? 'is-active' : ''} ${done ? 'is-done' : ''} ${
                                inProgress ? 'is-progress' : ''
                              }`
                            }
                            onClick={() => setOpen(false)}
                          >
                            <span className="sidebar-unit__num">
                              {done ? '✓' : inProgress ? '•' : u.number}
                            </span>
                            <span className="sidebar-unit__label">{u.title}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {open && (
        <div className="sidebar-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
    </>
  );
}
