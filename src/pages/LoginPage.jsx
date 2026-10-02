import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';

export default function LoginPage() {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleForgotPassword = async () => {
    const address = email.trim();
    if (!address) {
      setError('Enter your email address above, then choose "Forgot password".');
      return;
    }
    setError('');
    setResetting(true);
    try {
      await resetPassword(address);
      setResetSent(true);
    } catch (err) {
      setError(prettifyAuthError(err));
    } finally {
      setResetting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(prettifyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand__logo"><Icon name="module-1" size={34} /></span>
          <h1 className="auth-brand__title">CREDIT MOOC</h1>
          <p className="auth-brand__tagline">Sustainable learning for tomorrow's leaders</p>
        </div>
        <h2 className="auth-card__heading">Welcome back</h2>
        <p className="auth-card__sub">Log in to continue your learning journey.</p>
        {error && <div className="alert alert--error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="form-field">
            <span>Email address</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {resetSent && (
          <p className="auth-notice" role="status">
            If an account exists for <strong>{email.trim()}</strong>, a password reset link is on
            its way. Check your inbox and your spam folder.
          </p>
        )}
        <p className="auth-footer">
          <button type="button" className="link-button" onClick={handleForgotPassword} disabled={resetting}>
            {resetting ? 'Sending reset link…' : 'Forgot your password?'}
          </button>
        </p>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
        <p className="auth-footer">
          <Link to="/about">What is this course? →</Link>
        </p>
      </div>
      <div className="auth-side">
        <h2>Learn. Apply. Transform.</h2>
        <p>
          Master the foundations of the green and circular economy with project-based modules
          designed for SMEs and entrepreneurs.
        </p>
        <ul>
          <li><Icon name="check" size={15} /> 6 modules · 30 hands-on units</li>
          <li><Icon name="check" size={15} /> Real activities, not just videos</li>
          <li><Icon name="check" size={15} /> Track your progress automatically</li>
        </ul>
      </div>
    </div>
  );
}

function prettifyAuthError(err) {
  const code = err?.code || '';
  if (code.includes('invalid-credential') || code.includes('wrong-password'))
    return 'Incorrect email or password.';
  if (code.includes('user-not-found')) return 'No account found with this email.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Try again later.';
  if (code.includes('invalid-email')) return 'That does not look like a valid email address.';
  if (code.includes('missing-email')) return 'Enter your email address first.';
  return err?.message || 'Could not sign in. Please try again.';
}
