import { CERTIFICATE_THRESHOLD_PERCENT } from '../lib/certificate';

// Administrative summary of learner milestones (PA6 action 15).
//
// Built for the project monitoring report: the three things a reviewer asks
// are how many learners actually engaged, how far they got, and where the
// course loses them. Presentational only — `summary` comes from
// buildMilestoneSummary(), which is unit-tested.
export default function MilestoneSummary({ summary }) {
  if (!summary) return null;

  const { funnel, dropOff } = summary;
  const widest = Math.max(1, ...funnel.map((f) => f.reached));

  return (
    <section className="analytics-section milestones">
      <div className="section-head">
        <h2>Learner milestones</h2>
        <p>
          Derived from the milestone event log — module starts, unit completions, quiz attempts
          and certificate downloads.
        </p>
      </div>

      <div className="stat-grid">
        <Stat
          label="Activation rate"
          value={`${summary.activationRate}%`}
          hint={`${summary.learnersStarted} of the registered learners opened a module`}
        />
        <Stat
          label="Completion rate"
          value={`${summary.completionRate}%`}
          hint={`${summary.learnersWithCertificate} reached ${CERTIFICATE_THRESHOLD_PERCENT}% and took a certificate`}
        />
        <Stat
          label="Learners completing units"
          value={summary.learnersCompletedAUnit}
          hint="finished at least one unit"
        />
        <Stat
          label="Quiz attempts"
          value={summary.quizAttempts}
          hint={
            summary.avgQuizScore === null
              ? 'no scored attempts yet'
              : `${summary.avgQuizScore}% average score`
          }
        />
        <Stat
          label="Certificates downloaded"
          value={summary.certificatesDownloaded}
          hint={`${summary.learnersWithCertificate} distinct learners`}
        />
        <Stat label="Milestone events" value={summary.totalEvents} hint="total recorded" />
      </div>

      <div className="funnel">
        <h3>Progression and drop-off</h3>
        {summary.learnersStarted === 0 ? (
          <p className="muted">
            No milestone events recorded yet. Figures appear here once learners begin working
            through the modules.
          </p>
        ) : (
          <>
            <ol className="funnel__list">
              {funnel.map((f) => (
                <li key={f.id} className="funnel__row">
                  <span className="funnel__label">
                    <span aria-hidden="true">{f.icon}</span> Module {f.number}
                  </span>
                  <span className="funnel__bar-track">
                    <span
                      className="funnel__bar"
                      style={{ width: `${(f.reached / widest) * 100}%` }}
                    />
                  </span>
                  <span className="funnel__value">
                    <strong>{f.reached}</strong> reached
                  </span>
                </li>
              ))}
            </ol>

            {dropOff ? (
              <p className="funnel__dropoff">
                <strong>Largest drop-off:</strong> {dropOff.percent}% of learners ({dropOff.lost})
                did not continue from Module {dropOff.from.number} to Module {dropOff.to.number}.
                Worth reviewing the closing units of Module {dropOff.from.number}.
              </p>
            ) : (
              <p className="muted funnel__dropoff">
                No drop-off between modules so far — learner numbers hold or rise at every step.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div className="stat-card">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
      {hint && <span className="stat-card__hint">{hint}</span>}
    </div>
  );
}
