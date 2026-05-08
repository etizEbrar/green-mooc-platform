import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';

export default function ModuleCard({ module, completed = 0, total = 0 }) {
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const status = completed === 0 ? 'Not started' : completed === total ? 'Completed' : 'In progress';
  const statusModifier =
    completed === 0 ? 'badge--muted' : completed === total ? 'badge--success' : 'badge--warning';

  return (
    <article className="module-card">
      <div
        className="module-card__top"
        style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}cc)` }}
      >
        <span className="module-card__icon">{module.icon}</span>
        <span className={`badge ${statusModifier}`}>{status}</span>
      </div>
      <div className="module-card__body">
        <p className="module-card__eyebrow">Module {module.number}</p>
        <h3 className="module-card__title">{module.title}</h3>
        <p className="module-card__desc">{module.description}</p>
        <div className="module-card__progress">
          <ProgressBar value={percent} />
          <span className="module-card__progress-meta">
            {completed}/{total} units · {percent}%
          </span>
        </div>
        <Link to={`/modules/${module.id}`} className="btn btn--primary btn--block">
          {completed === 0 ? 'Start learning' : completed === total ? 'Review module' : 'Continue learning'}
        </Link>
      </div>
    </article>
  );
}
