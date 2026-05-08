import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="empty-state">
        <h1 className="empty-state__code">404</h1>
        <h2>Page not found</h2>
        <p>The page you're looking for has wandered off the green path.</p>
        <Link className="btn btn--primary" to="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
