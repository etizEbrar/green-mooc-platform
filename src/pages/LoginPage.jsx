import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
          <span className="auth-brand__logo">🌿</span>
          <h1 className="auth-brand__title">GreenMOOC</h1>
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
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
      <div className="auth-side">
        <h2>Learn. Apply. Transform.</h2>
        <p>
          Master the foundations of the green and circular economy with project-based modules
          designed for SMEs and entrepreneurs.
        </p>
        <ul>
          <li>✓ 6 modules · 30 hands-on units</li>
          <li>✓ Real activities, not just videos</li>
          <li>✓ Track your progress automatically</li>
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
  return err?.message || 'Could not sign in. Please try again.';
}
