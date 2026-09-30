import { Link } from 'react-router-dom';
import { project, partners } from '../data/projectData';

// Footer shown on every page. It carries the two things the consortium asked
// for on every screen: a visible link back to the CREDIT project website, and
// the Erasmus+ funding statement.
export default function SiteFooter() {
  return (
    <footer className="app-footer no-print">
      <div className="app-footer__inner">
        <div className="app-footer__col">
          <p className="app-footer__brand">🌿 GreenMOOC</p>
          <p className="app-footer__text">
            The open training platform of the {project.acronym} project —{' '}
            {project.title}.
          </p>
          <a
            className="app-footer__link"
            href={project.website}
            target="_blank"
            rel="noreferrer"
          >
            {project.website.replace('https://', '')} ↗
          </a>
        </div>

        <div className="app-footer__col">
          <p className="app-footer__heading">Platform</p>
          <ul className="app-footer__list">
            <li>
              <Link to="/about">About the project</Link>
            </li>
            <li>
              <Link to="/" state={{ scrollTo: 'pilots' }}>
                Pilot activities
              </Link>
            </li>
            <li>
              <Link to="/dashboard">My learning</Link>
            </li>
            <li>
              <Link to="/certificate">Certificate</Link>
            </li>
            <li>
              <Link to="/verify">Verify a certificate</Link>
            </li>
          </ul>
        </div>

        <div className="app-footer__col">
          <p className="app-footer__heading">Consortium</p>
          <ul className="app-footer__list">
            {partners.map((p) => (
              <li key={p.name}>
                <span aria-hidden="true">{p.flag}</span> {p.name}
              </li>
            ))}
          </ul>
          <p className="app-footer__grant">{project.grantNumber}</p>
        </div>
      </div>

      <p className="app-footer__disclaimer">{project.disclaimer}</p>
    </footer>
  );
}
