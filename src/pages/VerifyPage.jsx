import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { project } from '../data/projectData';
import { formatIssueDate, normaliseCode } from '../lib/certificate';
import Icon from '../components/Icon';

// Public certificate verification.
//
// Reached two ways: /verify to type a code in, or /verify/<code> straight from
// the link printed on the certificate. Deliberately outside ProtectedRoute —
// the people who need this (an employer, a National Agency, EACEA) will not
// have an account, and should not need one.
//
// Everything shown here comes back from verifyCertificateFn, which returns
// only what is already printed on the document. No uid, no email.

// Callable functions do not fail fast when the backend is unreachable — an
// undeployed or cold function can leave the request hanging. Without this the
// page would sit on "Checking…" indefinitely, which reads as a broken site
// rather than as a service problem.
const VERIFY_TIMEOUT_MS = 15000;
export default function VerifyPage() {
  const { code: codeFromUrl } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState(codeFromUrl || '');
  const [state, setState] = useState(codeFromUrl ? 'checking' : 'idle');
  const [result, setResult] = useState(null);
  const [checkedCode, setCheckedCode] = useState('');

  const runCheck = useCallback(async (rawCode) => {
    const code = normaliseCode(rawCode);
    if (!code) {
      setState('idle');
      return;
    }
    setState('checking');
    setCheckedCode(code);
    try {
      const verify = httpsCallable(functions, 'verifyCertificateFn', {
        timeout: VERIFY_TIMEOUT_MS
      });
      const { data } = await withTimeout(verify({ code }), VERIFY_TIMEOUT_MS);
      setResult(data);
      setState(data?.valid ? 'valid' : 'invalid');
    } catch (err) {
      console.error('Certificate verification failed', err);
      setResult({ message: serviceErrorMessage(err) });
      setState('error');
    }
  }, []);

  // A direct link should check immediately, and re-check if the visitor edits
  // the code in the address bar.
  useEffect(() => {
    if (codeFromUrl) {
      setInput(codeFromUrl);
      runCheck(codeFromUrl);
    }
  }, [codeFromUrl, runCheck]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = normaliseCode(input);
    if (!code) return;
    // Push the code into the URL so the result is shareable and refreshable;
    // the effect above performs the actual check.
    if (code === codeFromUrl) runCheck(code);
    else navigate(`/verify/${encodeURIComponent(code)}`);
  };

  return (
    <div className="page page--verify">
      <header className="verify-hero">
        <p className="hero__eyebrow">{project.acronym} · Certificate verification</p>
        <h1>Check a certificate</h1>
        <p className="verify-hero__lead">
          Every certificate issued by this platform carries a verification code. Enter it below to
          confirm the certificate is genuine and see what it covers.
        </p>
      </header>

      <form className="verify-form" onSubmit={handleSubmit}>
        <label className="form-field verify-form__field">
          <span>Verification code</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="CREDIT-2026-XXXX-XXX"
            autoComplete="off"
            spellCheck="false"
            aria-describedby="verify-hint"
          />
        </label>
        <button className="btn btn--primary" type="submit" disabled={state === 'checking'}>
          {state === 'checking' ? 'Checking…' : 'Verify certificate'}
        </button>
        <p className="muted verify-form__hint" id="verify-hint">
          You can paste the full verification link too.
        </p>
      </form>

      <VerifyResult state={state} result={result} code={checkedCode} />

      <section className="verify-about">
        <h2>About these certificates</h2>
        <p>
          Certificates are issued by the {project.acronym} MOOC to learners who complete at least
          75% of the course <em>Green &amp; Circular Economy for SMEs</em>. They are issued
          automatically by the platform, which recalculates the learner's completed units at the
          moment of issue — the figures on the certificate cannot be set by the learner.
        </p>
        <p>
          {project.acronym} is co-funded by the European Union under {project.programme}, grant
          agreement {project.grantNumber}.{' '}
          <a href={project.website} target="_blank" rel="noreferrer">
            Visit the project website ↗
          </a>
        </p>
      </section>
    </div>
  );
}

// Split out so every state can be rendered and reviewed on its own.
export function VerifyResult({ state, result, code }) {
  if (state === 'idle') return null;

  if (state === 'checking') {
    return (
      <section className="verify-result verify-result--checking" aria-live="polite">
        <span className="verify-result__icon" aria-hidden="true">
          ⏳
        </span>
        <div>
          <h2>Checking {code}…</h2>
          <p className="muted">Looking this code up against the certificate register.</p>
        </div>
      </section>
    );
  }

  if (state === 'error') {
    return (
      <section className="verify-result verify-result--error" aria-live="polite">
        <span className="verify-result__icon" aria-hidden="true">
          <Icon name="warning" size={30} />
        </span>
        <div>
          <h2>Could not check this code</h2>
          <p>{result?.message}</p>
          <p className="muted">
            This does not mean the certificate is invalid — the verification service could not be
            reached. Please try again shortly.
          </p>
        </div>
      </section>
    );
  }

  if (state === 'invalid') {
    return (
      <section className="verify-result verify-result--invalid" aria-live="polite">
        <span className="verify-result__icon" aria-hidden="true">
          <Icon name="close" size={30} />
        </span>
        <div>
          <h2>No certificate found</h2>
          <p>
            <strong>{code}</strong> does not match any certificate issued by this platform.
          </p>
          <ul className="verify-result__tips">
            <li>Check for a typo — codes look like <code>CREDIT-2026-XXXX-XXX</code>.</li>
            <li>
              The characters <code>0</code>/<code>O</code> and <code>1</code>/<code>I</code> are
              easy to confuse when copying by hand.
            </li>
            <li>
              If the code is definitely right, the document may not have come from this platform.
            </li>
          </ul>
        </div>
      </section>
    );
  }

  // state === 'valid'
  return (
    <section className="verify-result verify-result--valid" aria-live="polite">
      <span className="verify-result__icon" aria-hidden="true">
        <Icon name="check" size={30} />
      </span>
      <div className="verify-result__body">
        <h2>Certificate verified</h2>
        <p className="muted">
          This code matches a certificate issued by the {project.acronym} MOOC.
        </p>

        <dl className="verify-details">
          <div>
            <dt>Awarded to</dt>
            <dd className="verify-details__name">{result.learnerName}</dd>
          </div>
          <div>
            <dt>Course</dt>
            <dd>Green &amp; Circular Economy for SMEs</dd>
          </div>
          <div>
            <dt>Date of issue</dt>
            <dd>{formatIssueDate(result.issuedAtISO)}</dd>
          </div>
          <div>
            <dt>Completion</dt>
            <dd>
              {result.unitsCompleted} of {result.unitsTotal} units ({result.percent}%)
            </dd>
          </div>
          <div>
            <dt>Verification code</dt>
            <dd className="verify-details__code">{result.code}</dd>
          </div>
        </dl>

        <p className="verify-result__foot muted">
          Want the same training? <Link to="/about">The course is free and open →</Link>
        </p>
      </div>
    </section>
  );
}

// The SDK's own `timeout` option is honoured inconsistently across transports,
// so the promise is raced as well. Belt and braces, on a page whose whole job
// is to give a clear answer.
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error('Verification timed out.');
      err.code = 'functions/deadline-exceeded';
      reject(err);
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function serviceErrorMessage(err) {
  switch (err?.code) {
    case 'functions/invalid-argument':
      return err.message;
    case 'functions/unavailable':
    case 'functions/deadline-exceeded':
      return 'The verification service is not responding right now.';
    case 'functions/not-found':
    case 'functions/internal':
      return 'The verification service is unavailable. It may not be deployed yet.';
    default:
      return 'Something went wrong while contacting the verification service.';
  }
}
