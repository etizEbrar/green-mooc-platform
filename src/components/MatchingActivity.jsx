import { useState } from 'react';

// Click-based matching activity (also used for "drag-drop" content).
// Props:
//   step.items[]      = [{ label, category, feedback }]
//   step.categories[] = ['Linear', 'Circular'] | ['Manager', 'Employee', 'Shared'] | …
//   step.instructions  = optional intro text
// User clicks an item (selecting it) then a category (assigning it).
// On submit: shows score and per-item feedback.
export default function MatchingActivity({ step, unit, initialResult, onSubmit }) {
  const items = step?.items || unit?.items || [];
  const categories = step?.categories || unit?.categories || [];
  const instructions = step?.instructions || unit?.activityDescription;

  // Some categories may not have a single "correct" answer — when the source is
  // a self-positioning question we still want to display feedback. We treat the
  // chosen category as accepted regardless and only score those items where a
  // `category` is defined.
  const [assignments, setAssignments] = useState(initialResult?.assignments || {});
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitted, setSubmitted] = useState(!!initialResult);

  const handleSelectItem = (idx) => {
    if (submitted) return;
    setSelectedItem(idx === selectedItem ? null : idx);
  };

  const handlePickCategory = (cat) => {
    if (submitted || selectedItem === null) return;
    setAssignments((prev) => ({ ...prev, [selectedItem]: cat }));
    setSelectedItem(null);
  };

  const handleClear = (idx) => {
    if (submitted) return;
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  };

  const allAssigned = items.every((_, i) => assignments[i]);

  const handleSubmit = () => {
    let correct = 0;
    let scorable = 0;
    items.forEach((it, i) => {
      if (it.category) {
        scorable += 1;
        if (assignments[i] === it.category) correct += 1;
      }
    });
    const score = scorable ? Math.round((correct / scorable) * 100) : 100;
    setSubmitted(true);
    onSubmit?.({
      type: 'matching',
      score,
      correct,
      total: scorable,
      assignments
    });
  };

  const handleRetry = () => {
    setAssignments({});
    setSubmitted(false);
    setSelectedItem(null);
  };

  return (
    <div className="activity activity--matching">
      {instructions && <p className="muted">{instructions}</p>}

      <div className="matching-categories">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`matching-category ${selectedItem !== null ? 'is-active' : ''}`}
            onClick={() => handlePickCategory(c)}
            disabled={submitted || selectedItem === null}
          >
            <span className="matching-category__label">{c}</span>
            <span className="matching-category__count">
              {Object.values(assignments).filter((v) => v === c).length}
            </span>
          </button>
        ))}
      </div>

      {selectedItem === null && !submitted && (
        <p className="matching-hint muted">
          1️⃣ Click an item below — 2️⃣ then click a category to assign it.
        </p>
      )}

      <ul className="matching-items">
        {items.map((it, i) => {
          const assigned = assignments[i];
          const isSelected = selectedItem === i;
          const isCorrect = submitted && assigned === it.category;
          const isWrong = submitted && assigned && assigned !== it.category;
          return (
            <li
              key={i}
              className={`matching-item ${isSelected ? 'is-selected' : ''} ${
                isCorrect ? 'is-correct' : ''
              } ${isWrong ? 'is-wrong' : ''}`}
            >
              <button
                type="button"
                className="matching-item__btn"
                onClick={() => handleSelectItem(i)}
                disabled={submitted}
              >
                <span className="matching-item__label">{it.label}</span>
                {assigned && (
                  <span className="matching-item__assigned">
                    → <strong>{assigned}</strong>
                    {!submitted && (
                      <span
                        className="matching-item__clear"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClear(i);
                        }}
                      >
                        ✕
                      </span>
                    )}
                  </span>
                )}
              </button>
              {submitted && (
                <p className="matching-item__feedback">
                  {it.category ? (
                    <>
                      <strong>{isCorrect ? '✓' : '✗'}</strong> Correct category: <strong>{it.category}</strong>.
                      {it.feedback ? ` ${it.feedback}` : ''}
                    </>
                  ) : (
                    <>{it.feedback}</>
                  )}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {!submitted ? (
        <button className="btn btn--primary" onClick={handleSubmit} disabled={!allAssigned}>
          Submit
        </button>
      ) : (
        <div className="activity-result">
          <h4>Result</h4>
          <p>
            You got <strong>{items.filter((it, i) => it.category && assignments[i] === it.category).length}</strong> of{' '}
            <strong>{items.filter((it) => it.category).length}</strong> right.
          </p>
          <button className="btn btn--ghost" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
