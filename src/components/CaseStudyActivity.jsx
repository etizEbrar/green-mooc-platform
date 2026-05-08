import { useState } from 'react';

// One case-study card. The story is shown at the top, all questions below.
// One submit button at the bottom — all answers saved together to Firestore.
export default function CaseStudyActivity({ unit, step, initialResult, onSubmit }) {
  const cs = step?.caseStudy || unit?.caseStudy || { title: '', story: '', questions: [] };
  const questions = cs.questions || [];

  const [answers, setAnswers] = useState(
    initialResult?.answers || Array(questions.length).fill('')
  );
  const [submitted, setSubmitted] = useState(!!initialResult);

  if (questions.length === 0) {
    return <p className="muted">No case-study questions configured.</p>;
  }

  const handleChange = (i, v) => {
    if (submitted) return;
    const next = [...answers];
    next[i] = v;
    setAnswers(next);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit?.({
      type: 'case-study',
      score: 100,
      answers,
      caseTitle: cs.title || null,
      completedAtClient: new Date().toISOString()
    });
  };

  const allFilled = answers.every((a) => a.trim().length > 0);

  return (
    <div className="activity-card activity-card--case">
      <div className="case-block">
        {cs.title && <h3 className="case-block__title">📌 {cs.title}</h3>}
        {cs.story && <p className="case-block__story">{cs.story}</p>}
      </div>

      <div className="reflection-list">
        {questions.map((q, i) => (
          <label key={i} className="reflection-field">
            <span className="reflection-field__label">{q}</span>
            <textarea
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder="Your analysis…"
              rows={3}
              disabled={submitted}
            />
          </label>
        ))}
      </div>

      {!submitted ? (
        <div className="activity-card__footer">
          <button className="btn btn--primary" onClick={handleSubmit} disabled={!allFilled}>
            Submit case analysis
          </button>
          {!allFilled && (
            <span className="muted activity-card__hint">
              Answer every question to submit your analysis.
            </span>
          )}
        </div>
      ) : (
        <div className="activity-result">
          <h4>💡 Case analysis submitted</h4>
          <p>Your analysis has been saved to your private profile.</p>
          <button className="btn btn--ghost" onClick={() => setSubmitted(false)}>
            Edit my analysis
          </button>
        </div>
      )}
    </div>
  );
}
