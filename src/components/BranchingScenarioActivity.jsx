import { useState } from 'react';

// Branching / weighted-MCQ scenario activity.
// Props:
//   step.scenarios[] = [{ title, story, options: [{ text, points, feedback }] }]
//   step.tiers[]     = [{ min, max, label, body }]  -> determines final profile
export default function BranchingScenarioActivity({ step, unit, initialResult, onSubmit }) {
  const scenarios = step?.scenarios || unit?.scenarios || [];
  const tiers = step?.tiers || unit?.tiers || [];
  const instructions = step?.instructions || unit?.activityDescription;

  const [choices, setChoices] = useState(
    initialResult?.choices || Array(scenarios.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(!!initialResult);

  const handleChoose = (sIdx, oIdx) => {
    if (submitted) return;
    const next = [...choices];
    next[sIdx] = oIdx;
    setChoices(next);
  };

  const totalPoints = choices.reduce((acc, c, i) => {
    if (c === null) return acc;
    return acc + (scenarios[i]?.options?.[c]?.points || 0);
  }, 0);

  const matchedTier = tiers.find((t) => totalPoints >= t.min && totalPoints <= t.max);

  const allAnswered = choices.every((c) => c !== null);

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit?.({
      type: 'branching-scenario',
      score: totalPoints,
      tier: matchedTier?.label || null,
      choices
    });
  };

  const handleRetry = () => {
    setChoices(Array(scenarios.length).fill(null));
    setSubmitted(false);
  };

  return (
    <div className="activity activity--branching">
      {instructions && <p className="muted">{instructions}</p>}

      {scenarios.map((s, sIdx) => (
        <div key={sIdx} className="branching-card">
          <h4 className="branching-card__title">{s.title}</h4>
          {s.story && <p className="branching-card__story">{s.story}</p>}
          <div className="branching-options">
            {s.options.map((opt, oIdx) => {
              const isSelected = choices[sIdx] === oIdx;
              const isBest =
                submitted && opt.points === Math.max(...s.options.map((o) => o.points));
              return (
                <button
                  key={oIdx}
                  type="button"
                  className={`branching-option ${isSelected ? 'is-selected' : ''} ${
                    submitted && isBest ? 'is-best' : ''
                  } ${submitted && isSelected && !isBest ? 'is-suboptimal' : ''}`}
                  onClick={() => handleChoose(sIdx, oIdx)}
                  disabled={submitted}
                >
                  <span className="branching-option__bullet">{String.fromCharCode(65 + oIdx)}</span>
                  <div>
                    <p className="branching-option__text">{opt.text}</p>
                    {submitted && (
                      <p className="branching-option__feedback">
                        <strong>{opt.points} pts</strong> — {opt.feedback}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button className="btn btn--primary" onClick={handleSubmit} disabled={!allAnswered}>
          Submit answers
        </button>
      ) : (
        <div className="activity-result activity-result--branching">
          <h4>Your final score: {totalPoints} points</h4>
          {matchedTier && (
            <div className="branching-tier">
              <span className="branching-tier__label">{matchedTier.label}</span>
              <p>{matchedTier.body}</p>
            </div>
          )}
          <button className="btn btn--ghost" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
