import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to={currentUser ? '/dashboard' : '/login'} className="navbar__brand">
          <span className="navbar__logo">🌿</span>
          <span className="navbar__title">GreenMOOC</span>
        </Link>

        {currentUser && (
          <div className="navbar__links">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
          </div>
        )}

        <div className="navbar__actions">
          {currentUser ? (
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
