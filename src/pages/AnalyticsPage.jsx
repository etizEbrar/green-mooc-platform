import { useEffect, useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { Link } from 'react-router-dom';
import { collection, collectionGroup, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { totalUnitsCount } from '../data/courseData';
import { isAdmin, adminListConfigured } from '../lib/admins';
import { CERTIFICATE_THRESHOLD_PERCENT } from '../lib/certificate';
import { formatDuration } from '../lib/engagement';
import { ACTIVE_WINDOW_DAYS, buildSummary, buildMilestoneSummary, pct } from '../lib/analytics';
import MilestoneSummary from '../components/MilestoneSummary';

// Consortium-facing analytics.
//
// Answers the questions asked in the meeting: how many learners registered,
// how far they get, how much time they spend, which units lose them, and how
// many certificates were issued. Everything is derived from documents the
// platform already writes — there is no third-party tracker.
//
// Access is gated twice: the allowlist in src/lib/admins.js hides the page,
// and firestore.rules decides who may actually read the data.
// The arithmetic lives in src/lib/analytics.js.

export default function AnalyticsPage() {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const allowed = isAdmin(currentUser);

  useEffect(() => {
    if (!allowed) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const [usersSnap, progressSnap, engagementSnap, certsSnap, eventsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collectionGroup(db, 'progress')),
          getDocs(collectionGroup(db, 'engagement')),
          getDocs(collectionGroup(db, 'certificates')),
          getDocs(collectionGroup(db, 'events'))
        ]);
        if (cancelled) return;
        setData({
          users: usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          progress: progressSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          engagement: engagementSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          certificates: certsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          events: eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        });
      } catch (err) {
        console.error('Analytics load failed', err);
        if (!cancelled) {
          setError(
            err?.code === 'permission-denied'
              ? 'Firestore refused the query. Deploy the admin rules in firestore.rules and make sure your account is listed there.'
              : 'Could not load analytics. Check the browser console for details.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [allowed]);

  const summary = useMemo(() => (data ? buildSummary(data) : null), [data]);
  const milestones = useMemo(
    () => (data ? buildMilestoneSummary(data.events, data.users.length) : null),
    [data]
  );

  if (!allowed) {
    return (
      <div className="page page--analytics">
        <div className="empty-state">
          <h2>Analytics is restricted</h2>
          <p className="muted">
            {adminListConfigured
              ? 'This dashboard is available to consortium administrators only.'
              : 'No administrators are configured yet. Add VITE_ADMIN_EMAILS to .env.local and rebuild.'}
          </p>
          <Link className="btn btn--primary" to="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--analytics">
      <header className="page-head">
        <p className="hero__eyebrow">Consortium</p>
        <h1>Platform analytics</h1>
        <p className="muted">
          Registration, progression and engagement across the whole MOOC. Figures update on every
          page load.
        </p>
      </header>

      {loading && <p className="muted">Loading analytics…</p>}
      {error && <div className="alert alert--error">{error}</div>}

      {milestones && <MilestoneSummary summary={milestones} />}
      {summary && <AnalyticsView summary={summary} />}
    </div>
  );
}

// Presentation only — takes an already-aggregated summary. Separated from the
// page so the tables can be rendered from fixture data without Firestore.
export function AnalyticsView({ summary }) {
  return (
    <>
      <section className="stat-grid">
        <StatCard label="Registered learners" value={summary.totalUsers} />
        <StatCard
          label={`Active (last ${ACTIVE_WINDOW_DAYS} days)`}
          value={summary.activeUsers}
          hint={`${pct(summary.activeUsers, summary.totalUsers)}% of registrations`}
        />
        <StatCard
          label="Learners who started"
          value={summary.startedUsers}
          hint={`${pct(summary.startedUsers, summary.totalUsers)}% of registrations`}
        />
        <StatCard
          label="Units completed"
          value={summary.totalCompletions}
          hint={`${summary.avgUnitsPerLearner} per active learner`}
        />
        <StatCard
          label="Average course progress"
          value={`${summary.avgPercent}%`}
          hint={`of ${totalUnitsCount} units`}
        />
        <StatCard
          label={`Past ${CERTIFICATE_THRESHOLD_PERCENT}% threshold`}
          value={summary.eligibleLearners}
          hint={`${summary.certificatesIssued} certificate${
            summary.certificatesIssued === 1 ? '' : 's'
          } issued`}
        />
        <StatCard label="Total learning time" value={formatDuration(summary.totalSeconds)} />
        <StatCard
          label="Average quiz score"
          value={summary.avgQuizScore === null ? '—' : `${summary.avgQuizScore}%`}
          hint={`${summary.scoredAttempts} scored attempts`}
        />
      </section>

      <section className="analytics-section">
        <div className="section-head">
          <h2>Engagement by module</h2>
          <p>Where learners spend their time, and where they stop.</p>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Units</th>
                <th>Completions</th>
                <th>Learners reached</th>
                <th>Time spent</th>
                <th>Avg. quiz</th>
              </tr>
            </thead>
            <tbody>
              {summary.byModule.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Icon name={row.icon} size={16} /> {row.title}
                  </td>
                  <td>{row.unitCount}</td>
                  <td>{row.completions}</td>
                  <td>{row.learners}</td>
                  <td>{formatDuration(row.seconds)}</td>
                  <td>{row.avgScore === null ? '—' : `${row.avgScore}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="analytics-section">
        <div className="section-head">
          <h2>Engagement by unit</h2>
          <p>
            Visits count page opens; completions count learners who marked the unit done. A
            large gap between the two is a unit worth reviewing.
          </p>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Learners</th>
                <th>Visits</th>
                <th>Activity attempts</th>
                <th>Video plays</th>
                <th>Material opens</th>
                <th>Avg. time</th>
                <th>Completions</th>
              </tr>
            </thead>
            <tbody>
              {summary.byUnit.map((row) => (
                <tr key={row.id}>
                  <td>
                    {row.number} · {row.title}
                  </td>
                  <td>{row.learners}</td>
                  <td>{row.visits}</td>
                  <td>{row.activityAttempts}</td>
                  <td>{row.videoPlays}</td>
                  <td>{row.materialOpens}</td>
                  <td>{row.visits ? formatDuration(row.seconds / row.visits) : '—'}</td>
                  <td>{row.completions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn--ghost" onClick={() => downloadUnitCsv(summary.byUnit)}>
          <Icon name="download" size={16} /> Export unit data as CSV
        </button>
      </section>
    </>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
      {hint && <span className="stat-card__hint">{hint}</span>}
    </div>
  );
}

function downloadUnitCsv(rows) {
  const header = [
    'unit_id',
    'unit_number',
    'title',
    'module_id',
    'learners',
    'visits',
    'completions',
    'activity_attempts',
    'video_plays',
    'material_opens',
    'time_spent_seconds',
    'avg_quiz_score'
  ];
  const body = rows.map((r) =>
    [
      r.id,
      r.number,
      `"${String(r.title).replace(/"/g, '""')}"`,
      r.moduleId,
      r.learners,
      r.visits,
      r.completions,
      r.activityAttempts,
      r.videoPlays,
      r.materialOpens,
      r.seconds,
      r.avgScore ?? ''
    ].join(',')
  );
  const csv = [header.join(','), ...body].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `credit-mooc-units-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
