import { useState } from 'react';

// One sorting card. User clicks an item, then a category to drop it in.
// One submit button at the bottom.
export default function SortingActivity({ unit, step, initialResult, onSubmit }) {
  const data = step?.sortingActivity || unit?.sortingActivity || {
    instructions: step?.instructions || unit?.activityDescription || '',
    categories: step?.categories || [],
    items: step?.items || []
  };
  const items = data.items || [];
  const categories = data.categories || [];
  const instructions = data.instructions || step?.instructions || unit?.activityDescription;

  const [assignments, setAssignments] = useState(initialResult?.assignments || {});
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitted, setSubmitted] = useState(!!initialResult);

  if (items.length === 0 || categories.length === 0) {
    return <p className="muted">No sorting items configured.</p>;
  }

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
    items.forEach((it, i) => {
      if (assignments[i] === it.category) correct += 1;
    });
    const score = items.length ? Math.round((correct / items.length) * 100) : 100;
    setSubmitted(true);
    onSubmit?.({
      type: 'sorting',
      score,
      correct,
      total: items.length,
      assignments,
      completedAtClient: new Date().toISOString()
    });
  };

  const handleRetry = () => {
    setAssignments({});
    setSubmitted(false);
    setSelectedItem(null);
  };

  return (
    <div className="activity-card activity-card--sorting">
      {instructions && <p className="activity-card__intro">{instructions}</p>}

      <div className="sorting-categories">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`sorting-category ${selectedItem !== null ? 'is-active' : ''}`}
            onClick={() => handlePickCategory(c)}
            disabled={submitted || selectedItem === null}
          >
            <span>{c}</span>
            <span className="sorting-category__count">
              {Object.values(assignments).filter((v) => v === c).length}
            </span>
          </button>
        ))}
      </div>

      {selectedItem === null && !submitted && (
        <p className="muted sorting-hint">
          1️⃣ Click an item — 2️⃣ then click a category to drop it in.
        </p>
      )}

      <ul className="sorting-items">
        {items.map((it, i) => {
          const assigned = assignments[i];
          const isSelected = selectedItem === i;
          const isCorrect = submitted && assigned === it.category;
          const isWrong = submitted && assigned && assigned !== it.category;
          return (
            <li
              key={i}
              className={`sorting-item ${isSelected ? 'is-selected' : ''} ${
                isCorrect ? 'is-correct' : ''
              } ${isWrong ? 'is-wrong' : ''}`}
            >
              <button
                type="button"
                className="sorting-item__btn"
                onClick={() => handleSelectItem(i)}
                disabled={submitted}
              >
                <span className="sorting-item__label">{it.label}</span>
                {assigned && (
                  <span className="sorting-item__assigned">
                    → <strong>{assigned}</strong>
                    {!submitted && (
                      <span
                        className="sorting-item__clear"
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
              {submitted && it.category && (
                <p className="sorting-item__feedback">
                  Correct: <strong>{it.category}</strong>
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {!submitted ? (
        <div className="activity-card__footer">
          <button className="btn btn--primary" onClick={handleSubmit} disabled={!allAssigned}>
            Submit
          </button>
          {!allAssigned && (
            <span className="muted activity-card__hint">Sort every item to submit.</span>
          )}
        </div>
      ) : (
        <div className="activity-result">
          <h4>
            {Math.round(
              (items.filter((it, i) => assignments[i] === it.category).length / Math.max(1, items.length)) * 100
            )}
            % correct
          </h4>
          <p>
            You sorted{' '}
            <strong>{items.filter((it, i) => assignments[i] === it.category).length}</strong> of{' '}
            <strong>{items.length}</strong> items into the right category.
          </p>
          <button className="btn btn--ghost" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
