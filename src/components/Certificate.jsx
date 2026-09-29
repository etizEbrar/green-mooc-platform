import { project } from '../data/projectData';
import { certificateVerifyUrl, formatIssueDate } from '../lib/certificate';

// The printable certificate itself. Presentational only — it receives an
// already-issued certificate record, so it can be rendered anywhere
// (certificate page, print preview, future PDF export).
export default function Certificate({ cert, moduleBreakdown }) {
  const completedModules = moduleBreakdown.filter((m) => m.done > 0);
  return (
    <article className="certificate" aria-label="Certificate of completion">
      <div className="certificate__border">
        <header className="certificate__head">
          <span className="certificate__logo" aria-hidden="true">
            🌿
          </span>
          <p className="certificate__programme">{project.programme}</p>
          <p className="certificate__project">
            {project.acronym} — {project.title}
          </p>
        </header>

        <p className="certificate__kicker">Certificate of Completion</p>
        <p className="certificate__awarded">This is to certify that</p>
        <h2 className="certificate__name">{cert.learnerName}</h2>
        <p className="certificate__body">
          has successfully completed <strong>{cert.unitsCompleted}</strong> of{' '}
          <strong>{cert.unitsTotal}</strong> units ({cert.percent}%) of the online course
        </p>
        <p className="certificate__course">Green &amp; Circular Economy for SMEs</p>
        <p className="certificate__body certificate__body--small">
          meeting the {cert.thresholdPercent}% completion requirement set by the {project.acronym}{' '}
          consortium.
        </p>

        {completedModules.length > 0 && (
          <ul className="certificate__modules">
            {completedModules.map(({ module, done, total }) => (
              <li key={module.id}>
                <span aria-hidden="true">{module.icon}</span> Module {module.number}:{' '}
                {module.title} <em>({done}/{total} units)</em>
              </li>
            ))}
          </ul>
        )}

        <footer className="certificate__foot">
          <div className="certificate__meta">
            <span className="certificate__meta-label">Date of issue</span>
            <strong>{formatIssueDate(cert.issuedAtISO)}</strong>
          </div>
          <div className="certificate__meta">
            <span className="certificate__meta-label">Verification code</span>
            <strong>{cert.code}</strong>
          </div>
          <div className="certificate__meta">
            <span className="certificate__meta-label">Grant agreement</span>
            <strong>{project.grantNumber}</strong>
          </div>
        </footer>

        {/* Printed on the document so a third party can check it without
            being told where to look. Rendered as text, not a link: this is
            rasterised into the PDF, where a link would not be clickable. */}
        <p className="certificate__verify">
          Verify this certificate at <strong>{certificateVerifyUrl(cert.code)}</strong>
        </p>

        <p className="certificate__disclaimer">{project.disclaimer}</p>
      </div>
    </article>
  );
}
