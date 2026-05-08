import { useState } from 'react';

// One checklist card. All items inside the same card with a single Save button.
export default function ChecklistActivity({ unit, step, initialResult, onSubmit }) {
  const items = step?.items || unit?.checklistItems || step?.checklistItems || [];
  const instructions = step?.instructions || unit?.activityDescription;

  const [checked, setChecked] = useState(
    initialResult?.checked || Array(items.length).fill(false)
  );
  const [submitted, setSubmitted] = useState(!!initialResult);

  if (items.length === 0) {
    return <p className="muted">No checklist items configured.</p>;
  }

  const toggle = (i) => {
    if (submitted) return;
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  const handleSubmit = () => {
    const ticked = checked.filter(Boolean).length;
    const score = items.length ? Math.round((ticked / items.length) * 100) : 0;
    setSubmitted(true);
    onSubmit?.({
      type: 'checklist',
      score,
      checked,
      tickedCount: ticked,
      total: items.length,
      completedAtClient: new Date().toISOString()
    });
  };

  const ticked = checked.filter(Boolean).length;

  return (
    <div className="activity-card activity-card--checklist">
      {instructions && step && <p className="activity-card__intro">{instructions}</p>}

      <ul className="checklist">
        {items.map((label, i) => (
          <li key={i} className={`checklist__item ${checked[i] ? 'is-checked' : ''}`}>
            <label>
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                disabled={submitted}
              />
              <span>{label}</span>
            </label>
          </li>
        ))}
      </ul>

      {!submitted ? (
        <div className="activity-card__footer">
          <button className="btn btn--primary" onClick={handleSubmit}>
            Save checklist
          </button>
          <span className="muted activity-card__hint">
            {ticked} of {items.length} items currently ticked.
          </span>
        </div>
      ) : (
        <div className="activity-result">
          <h4>✅ Checklist saved</h4>
          <p>
            You ticked <strong>{ticked}</strong> of <strong>{items.length}</strong> items.
            {ticked < items.length && ' The unticked ones can become priorities for your action plan.'}
          </p>
          <button className="btn btn--ghost" onClick={() => setSubmitted(false)}>
            Edit my checklist
          </button>
        </div>
      )}
    </div>
  );
}
