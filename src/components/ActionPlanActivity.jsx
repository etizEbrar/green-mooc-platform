import { useState } from 'react';

// Single-card action plan. One submit, one saved object.
//
// Three data shapes supported (priority: actionPlanFields > step.fields > legacy):
//
//   1. Simple — array of label strings (preferred per latest spec):
//      actionPlanFields: ["Action title", "Owner", "KPI", "Deadline", "Priority", "Notes"]
//
//   2. Structured — array of {name, label, placeholder} objects:
//      step.fields: [{ name: 'what', label: 'WHAT', placeholder: '…' }, …]
//
// The component normalises both into a uniform {name, label} list and renders
// labelled textareas. On submit it saves all answers in one Firestore record.
export default function ActionPlanActivity({ unit, step, initialResult, onSubmit }) {
  const fields = normaliseFields(
    unit?.actionPlanFields || step?.actionPlanFields || step?.fields || unit?.fields
  );
  const instructions = step?.instructions || unit?.activityDescription;

  const seed = {};
  fields.forEach((f) => {
    seed[f.name] = initialResult?.values?.[f.name] || '';
  });
  const [values, setValues] = useState(seed);
  const [submitted, setSubmitted] = useState(!!initialResult);

  if (fields.length === 0) {
    return <p className="muted">No action-plan fields configured.</p>;
  }

  const handleChange = (name, v) => {
    if (submitted) return;
    setValues((prev) => ({ ...prev, [name]: v }));
  };

  const allFilled = fields.every((f) => values[f.name]?.trim().length > 0);

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit?.({
      type: 'action-plan',
      score: 100,
      values,
      completedAtClient: new Date().toISOString()
    });
  };

  return (
    <div className="activity-card activity-card--actionplan">
      {instructions && <p className="muted activity-card__intro">{instructions}</p>}

      <div className="action-plan-grid">
        {fields.map((f) => (
          <label key={f.name} className="action-plan-field">
            <span className="action-plan-field__label">{f.label}</span>
            <textarea
              rows={2}
              value={values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
              placeholder={f.placeholder || ''}
              disabled={submitted}
            />
          </label>
        ))}
      </div>

      {!submitted ? (
        <div className="activity-card__footer">
          <button className="btn btn--primary" onClick={handleSubmit} disabled={!allFilled}>
            Save my action plan
          </button>
          {!allFilled && (
            <span className="muted activity-card__hint">Complete every field to save.</span>
          )}
        </div>
      ) : (
        <div className="activity-result">
          <h4>📋 Action plan saved</h4>
          <p>Your plan has been saved to your private profile. Keep it visible — review it weekly until each action is in motion.</p>
          <button className="btn btn--ghost" onClick={() => setSubmitted(false)}>
            Edit my plan
          </button>
        </div>
      )}
    </div>
  );
}

// Convert any of the supported shapes into [{ name, label, placeholder }, …]
function normaliseFields(input) {
  if (!Array.isArray(input)) return [];
  return input.map((entry, i) => {
    if (typeof entry === 'string') {
      return { name: `field-${i}`, label: entry, placeholder: '' };
    }
    if (entry && typeof entry === 'object') {
      return {
        name: entry.name || `field-${i}`,
        label: entry.label || entry.name || `Field ${i + 1}`,
        placeholder: entry.placeholder || ''
      };
    }
    return { name: `field-${i}`, label: `Field ${i + 1}`, placeholder: '' };
  });
}
