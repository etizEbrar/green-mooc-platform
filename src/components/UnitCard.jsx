import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function UnitCard({ unit, progress, accent = '#2f8f6e' }) {
  const status = progress?.completed
    ? { label: 'Completed', cls: 'badge--success', icon: 'check' }
    : progress?.activityCompleted
    ? { label: 'In progress', cls: 'badge--warning', icon: 'clock' }
    : { label: 'Not started', cls: 'badge--muted', icon: 'incomplete' };

  return (
    <article className="unit-card" style={{ '--accent': accent }}>
      <div className="unit-card__head">
        <span className="unit-card__number">{unit.number}</span>
        <span className={`badge ${status.cls}`}>
          <Icon name={status.icon} size={13} /> {status.label}
        </span>
      </div>
      <h3 className="unit-card__title">{unit.title}</h3>
      <p className="unit-card__desc">{unit.description}</p>
      <div className="unit-card__meta">
        <span>
          <Icon name="clock" size={14} /> {unit.estimatedTime}
        </span>
        <span>· {prettyType(unit.activityType)}</span>
      </div>
      <Link
        to={`/modules/${unit.moduleId}/units/${unit.id}`}
        className="btn btn--secondary btn--block"
      >
        Open unit →
      </Link>
    </article>
  );
}

function prettyType(t) {
  switch (t) {
    case 'multiple-choice':
      return 'Quiz';
    case 'checklist':
      return 'Checklist';
    case 'reflection':
      return 'Reflection';
    case 'case-study':
      return 'Case study';
    case 'drag-drop':
      return 'Drag & drop';
    case 'action-plan':
      return 'Action plan';
    default:
      return 'Activity';
  }
}
