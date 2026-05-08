import { useMemo, useState } from 'react';

// One coherent quiz card. Inside it, all questions are listed together with a
// SINGLE submit button. After submit: a total score, and per-question feedback.
//
// Two data shapes supported:
//   1. quizQuestions: [{ question, options, correctIndex, explanation }, …]
//   2. quizSections:  [{ title, questions: [...] }, …]
// quizSections are rendered as inline section headings inside the SAME quiz —
// they are NOT separate activity cards.
//
// Result saved to Firestore via onSubmit:
//   { type: 'multiple-choice', score, correct, total, answers, completedAtClient }
export default function MultipleChoiceActivity({ unit, step, initialResult, onSubmit }) {
  const sections = useMemo(() => {
    if (Array.isArray(step?.quizSections)) return step.quizSections;
    if (Array.isArray(unit?.quizSections)) return unit.quizSections;
    const flat = step?.questions || step?.quizQuestions || unit?.quizQuestions || [];
    return flat.length ? [{ title: null, questions: flat }] : [];
  }, [unit, step]);

  // Flatten for index-based answer state.
  const flatQuestions = useMemo(
    () => sections.flatMap((s) => s.questions || []),
    [sections]
  );

  const [answers, setAnswers] = useState(
    initialResult?.answers || Array(flatQuestions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(!!initialResult);

  if (flatQuestions.length === 0) {
    return <p className="muted">No questions configured for this quiz.</p>;
  }

  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return;
    const next = [...answers];
    next[qIdx] = optIdx;
    setAnswers(next);
  };

  const calcScore = () => {
    let correct = 0;
    let scorable = 0;
    flatQuestions.forEach((q, i) => {
      if (typeof q.correctIndex === 'number' && q.correctIndex >= 0) {
        scorable += 1;
        if (answers[i] === q.correctIndex) correct += 1;
      }
    });
    const score = scorable ? Math.round((correct / scorable) * 100) : 100;
    return { correct, total: scorable, score };
  };

  const handleSubmit = () => {
    const r = calcScore();
    setSubmitted(true);
    onSubmit?.({
      type: 'multiple-choice',
      score: r.score,
      correct: r.correct,
      total: r.total,
      answers,
      completedAtClient: new Date().toISOString()
    });
  };

  const handleRetry = () => {
    setAnswers(Array(flatQuestions.length).fill(null));
    setSubmitted(false);
  };

  const allAnswered = answers.every((a) => a !== null);
  const result = submitted ? calcScore() : null;

  // Render: walk sections, but use a continuous question index across sections.
  let qIdx = 0;
  return (
    <div className="activity-card activity-card--quiz">
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="quiz-section">
          {section.title && <h3 className="quiz-section__title">{section.title}</h3>}
          {(section.questions || []).map((q) => {
            const myIdx = qIdx;
            qIdx += 1;
            return (
              <QuestionBlock
                key={myIdx}
                q={q}
                myIdx={myIdx}
                selected={answers[myIdx]}
                submitted={submitted}
                onSelect={(opt) => handleSelect(myIdx, opt)}
              />
            );
          })}
        </div>
      ))}

      {!submitted ? (
        <div className="activity-card__footer">
          <button className="btn btn--primary" onClick={handleSubmit} disabled={!allAnswered}>
            Submit answers
          </button>
          {!allAnswered && (
            <span className="muted activity-card__hint">
              Answer all {flatQuestions.length} questions to submit.
            </span>
          )}
        </div>
      ) : (
        <div className="activity-result">
          {result.total > 0 ? (
            <>
              <h4>
                {result.score >= 70
                  ? '🎉 Great job!'
                  : result.score >= 40
                  ? '👍 Good effort!'
                  : '💡 Keep going!'}
              </h4>
              <p>
                Total score: <strong>{result.score}%</strong> ({result.correct} of {result.total} correct).
              </p>
            </>
          ) : (
            <>
              <h4>📝 Recorded</h4>
              <p>Your selections have been saved. Review the explanations above.</p>
            </>
          )}
          <button className="btn btn--ghost" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

function QuestionBlock({ q, myIdx, selected, submitted, onSelect }) {
  return (
    <div className="quiz-question">
      <p className="quiz-question__text">{q.question}</p>
      <div className="quiz-options">
        {q.options.map((opt, optIdx) => {
          const isSelected = selected === optIdx;
          const isExpected =
            typeof q.correctIndex === 'number' && q.correctIndex >= 0 && optIdx === q.correctIndex;
          const isCorrect = submitted && isExpected;
          const isWrong = submitted && isSelected && !isExpected;
          return (
            <button
              key={optIdx}
              type="button"
              className={`quiz-option ${isSelected ? 'is-selected' : ''} ${
                isCorrect ? 'is-correct' : ''
              } ${isWrong ? 'is-wrong' : ''}`}
              onClick={() => onSelect(optIdx)}
              disabled={submitted}
            >
              <span className="quiz-option__bullet">{String.fromCharCode(65 + optIdx)}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {submitted && (q.explanation || q.feedback) && (
        <div className="quiz-question__explanation">
          <strong>💡 Explanation:</strong>{' '}
          {q.explanation || (Array.isArray(q.feedback) ? q.feedback[selected] : q.feedback)}
        </div>
      )}
    </div>
  );
}
