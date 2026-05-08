import { useState } from 'react';

// One reflection card with all questions inside.
// One Save button. All answers saved together to Firestore.
export default function ReflectionActivity({ unit, step, initialResult, onSubmit }) {
  const questions = step?.questions || unit?.reflectionQuestions || step?.reflectionQuestions || [];
  const body = step?.body;

  const [answers, setAnswers] = useState(
    initialResult?.answers || Array(questions.length).fill('')
  );
  const [submitted, setSubmitted] = useState(!!initialResult);

  if (questions.length === 0) {
    return <p className="muted">No reflection questions configured.</p>;
  }

  const handleChange = (i, value) => {
    if (submitted) return;
    const next = [...answers];
    next[i] = value;
    setAnswers(next);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit?.({
      type: 'reflection',
      score: 100,
      answers,
      completedAtClient: new Date().toISOString()
    });
  };

  const allFilled = answers.every((a) => a.trim().length > 0);

  return (
    <div className="activity-card activity-card--reflection">
      {body && <p className="activity-card__intro">{body}</p>}

      <div className="reflection-list">
        {questions.map((q, i) => (
          <label key={i} className="reflection-field">
            <span className="reflection-field__label">{q}</span>
            <textarea
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder="Write your reflection here…"
              rows={4}
              disabled={submitted}
            />
          </label>
        ))}
      </div>

      {!submitted ? (
        <div className="activity-card__footer">
          <button className="btn btn--primary" onClick={handleSubmit} disabled={!allFilled}>
            Save my reflection
          </button>
          {!allFilled && (
            <span className="muted activity-card__hint">
              Answer every question to save your reflection.
            </span>
          )}
        </div>
      ) : (
        <div className="activity-result">
          <h4>📝 Reflection saved</h4>
          <p>Your reflection has been saved to your private profile.</p>
          <button className="btn btn--ghost" onClick={() => setSubmitted(false)}>
            Edit my reflection
          </button>
        </div>
      )}
    </div>
  );
}
