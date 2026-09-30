import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { modules, units, totalUnitsCount } from '../data/courseData';
import { CERTIFICATE_THRESHOLD_PERCENT, completionStats } from '../lib/certificate';
import Certificate from '../components/Certificate';
import { downloadCertificatePdf, certificateFileName } from '../lib/certificatePdf';
import { trackCertificateDownload } from '../lib/milestones';
import LearningSidebar from '../components/LearningSidebar';
import ProgressBar from '../components/ProgressBar';

// Certificate of completion.
//
// The consortium set the threshold at 75% of the course. Below it, this page
// is a progress tracker that tells the learner exactly how many units are
// still missing; at or above it, the certificate is issued, recorded in
// Firestore and printable to PDF from the browser.
export default function CertificatePage() {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [downloading, setDownloading] = useState(false);

  // The off-screen, fixed-width copy of the certificate that html2canvas
  // photographs. The on-page copy stays responsive for reading.
  const captureRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    (async () => {
      try {
        const [progressSnap, certSnap] = await Promise.all([
          getDocs(collection(db, 'users', currentUser.uid, 'progress')),
          getDoc(doc(db, 'users', currentUser.uid, 'certificates', 'completion'))
        ]);
        if (cancelled) return;
        const map = {};
        progressSnap.forEach((d) => (map[d.id] = d.data()));
        setProgress(map);
        if (certSnap.exists()) {
          const data = certSnap.data();
          setCertificate(data);
          setName(data.learnerName || '');
        } else {
          setName(currentUser.displayName || '');
        }
      } catch (err) {
        console.error('Failed to load certificate data', err);
        if (!cancelled) setError('Could not load your progress. Please refresh and try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const stats = useMemo(
    () => completionStats(progress, totalUnitsCount),
    [progress]
  );

  // Which modules the learner actually finished — printed on the back of the
  // certificate as the list of covered content.
  const moduleBreakdown = useMemo(
    () =>
      modules.map((m) => {
        const moduleUnits = units.filter((u) => u.moduleId === m.id);
        const done = moduleUnits.filter((u) => progress[u.id]?.completed).length;
        return { module: m, done, total: moduleUnits.length };
      }),
    [progress]
  );

  // Issuing happens in the `issueCertificate` Cloud Function, never here.
  // The function recomputes completion from stored progress with the Admin
  // SDK, and firestore.rules denies clients any write to `certificates`, so
  // the numbers on the certificate cannot be set by the browser. The eligible
  // check below is only there to keep the button out of the way — the server
  // makes the real decision and will refuse if this page is out of date.
  const handleIssue = async () => {
    if (!currentUser || !stats.eligible) return;
    setIssuing(true);
    setError('');
    try {
      const issue = httpsCallable(functions, 'issueCertificateFn');
      const { data } = await issue({ learnerName: name });
      setCertificate(data.certificate);
    } catch (err) {
      console.error('Certificate issue failed', err);
      setError(issueErrorMessage(err));
    } finally {
      setIssuing(false);
    }
  };

  const handleDownload = async () => {
    if (!certificate) return;
    setDownloading(true);
    setError('');
    try {
      await downloadCertificatePdf(
        captureRef.current,
        certificateFileName(certificate.learnerName, certificate.code)
      );
      // Milestone recorded only after the PDF actually built — a failed
      // download must not inflate the completion figures.
      trackCertificateDownload(currentUser?.uid, certificate.code, certificate.percent);
    } catch (err) {
      console.error('Certificate PDF generation failed', err);
      setError(
        'Could not build the PDF in this browser. You can still use “Print” below and choose “Save as PDF”.'
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="learning-shell">
        <LearningSidebar />
        <div className="learning-content">
          <p className="muted">Loading your certificate…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-shell">
      <LearningSidebar />
      <div className="learning-content page--certificate">
        <header className="page-head no-print">
          <p className="hero__eyebrow">Certificate</p>
          <h1>Certificate of completion</h1>
          <p className="muted">
            Complete at least {CERTIFICATE_THRESHOLD_PERCENT}% of the course — that is{' '}
            {stats.requiredUnits} of {stats.total} units — to receive your certificate.
          </p>
        </header>

        {error && <div className="alert alert--error no-print">{error}</div>}

        <section className="cert-progress no-print">
          <div className="cert-progress__stat">
            <span className="cert-progress__value">{stats.percent}%</span>
            <span className="cert-progress__label">
              {stats.completedCount} of {stats.total} units completed
            </span>
          </div>
          <ProgressBar value={stats.percent} />
          <div className="cert-progress__threshold">
            <span
              className="cert-progress__marker"
              style={{ left: `${CERTIFICATE_THRESHOLD_PERCENT}%` }}
            >
              {CERTIFICATE_THRESHOLD_PERCENT}% threshold
            </span>
          </div>
        </section>

        {!stats.eligible && (
          <section className="cert-pending no-print">
            <h2>
              {stats.unitsRemaining === 1
                ? 'One more unit to go'
                : `${stats.unitsRemaining} units to go`}
            </h2>
            <p className="muted">
              Complete {stats.unitsRemaining} more{' '}
              {stats.unitsRemaining === 1 ? 'unit' : 'units'} to unlock your certificate. Your
              progress is saved automatically as you go.
            </p>
            <div className="cert-pending__modules">
              {moduleBreakdown.map(({ module, done, total }) => (
                <Link
                  key={module.id}
                  to={`/modules/${module.id}`}
                  className={`cert-module ${done === total ? 'is-done' : ''}`}
                >
                  <span className="cert-module__icon" style={{ background: module.color }}>
                    {module.icon}
                  </span>
                  <span className="cert-module__text">
                    <strong>Module {module.number}</strong>
                    <span className="muted">
                      {done}/{total} units
                    </span>
                  </span>
                  <span className="cert-module__check">{done === total ? '✓' : '→'}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {stats.eligible && !certificate && (
          <section className="cert-issue no-print">
            <h2>🎉 You have earned your certificate</h2>
            <p className="muted">
              Check the name below — it is printed exactly as written on your certificate.
            </p>
            <label className="form-field cert-issue__field">
              <span>Name on certificate</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                maxLength={80}
              />
            </label>
            <button className="btn btn--primary" onClick={handleIssue} disabled={issuing}>
              {issuing ? 'Issuing…' : 'Issue my certificate'}
            </button>
          </section>
        )}

        {certificate && (
          <>
            <div className="cert-actions no-print">
              <button className="btn btn--primary" onClick={handleDownload} disabled={downloading}>
                {downloading ? 'Building your PDF…' : '⬇ Download certificate (PDF)'}
              </button>
              <button className="btn btn--ghost" onClick={() => window.print()}>
                🖨 Print
              </button>
              <p className="muted cert-actions__hint">
                The PDF is generated in your browser — nothing is uploaded. Verification code{' '}
                <strong>{certificate.code}</strong>
              </p>
            </div>

            {/* On-page copy: responsive, for reading and for printing. */}
            <Certificate cert={certificate} moduleBreakdown={moduleBreakdown} />

            {/* Off-screen copy at a fixed A4-landscape width. This is the node
                html2canvas captures, so the PDF looks the same on every device.
                It must stay laid out — `display: none` would leave html2canvas
                nothing to measure — so it is parked outside the viewport. */}
            <div className="certificate-capture" aria-hidden="true">
              <div ref={captureRef} className="certificate-capture__inner">
                <Certificate cert={certificate} moduleBreakdown={moduleBreakdown} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// The callable returns HttpsError codes; `message` is written for the learner
// by the function itself, so pass it through where it is meaningful.
function issueErrorMessage(err) {
  switch (err?.code) {
    case 'functions/failed-precondition':
      return err.message;
    case 'functions/invalid-argument':
      return err.message;
    case 'functions/unauthenticated':
      return 'Your session has expired. Please sign in again.';
    case 'functions/unavailable':
    case 'functions/deadline-exceeded':
      return 'The certificate service is not responding. Please try again in a moment.';
    default:
      return 'Could not issue the certificate. Please check your connection and try again.';
  }
}
