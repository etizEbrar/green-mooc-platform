import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await register(email, password, name);
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
          <p className="auth-brand__tagline">Start your sustainability journey</p>
        </div>
        <h2 className="auth-card__heading">Create your account</h2>
        <p className="auth-card__sub">Free for the prototype phase.</p>
        {error && <div className="alert alert--error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="form-field">
            <span>Full name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </label>
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </label>
          <label className="form-field">
            <span>Confirm password</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
            />
          </label>
          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
      <div className="auth-side">
        <h2>Why GreenMOOC?</h2>
        <p>
          Built for entrepreneurs, students and SME teams who want practical knowledge to drive
          the sustainability transition.
        </p>
        <ul>
          <li>✓ Hands-on activities &amp; reflections</li>
          <li>✓ Self-paced modules</li>
          <li>✓ Progress saved across devices</li>
        </ul>
      </div>
    </div>
  );
}

function prettifyAuthError(err) {
  const code = err?.code || '';
  if (code.includes('email-already-in-use'))
    return 'This email is already registered. Try signing in instead.';
  if (code.includes('invalid-email')) return 'Please enter a valid email address.';
  if (code.includes('weak-password')) return 'Password is too weak. Use at least 6 characters.';
  return err?.message || 'Could not create account. Please try again.';
}
