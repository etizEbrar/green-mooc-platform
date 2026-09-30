import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../lib/admins';

export default function Navbar() {
  const { currentUser, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <nav className="navbar no-print">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">🌿</span>
          <span className="navbar__titles">
            <span className="navbar__title">GreenMOOC</span>
            <span className="navbar__subtitle">a CREDIT project platform</span>
          </span>
        </Link>

        <div className="navbar__links">
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/" state={{ scrollTo: 'pilots' }} className={linkClass} end>
            Pilots
          </NavLink>
          {currentUser && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/certificate" className={linkClass}>
                Certificate
              </NavLink>
              {isAdmin(currentUser) && (
                <NavLink to="/analytics" className={linkClass}>
                  Analytics
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="navbar__actions">
          {loading ? null : currentUser ? (
            <>
              <span className="navbar__user">
                {currentUser.displayName || currentUser.email}
              </span>
              <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">
                Log in
              </Link>
              <Link to="/register" className="btn btn--primary btn--sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
