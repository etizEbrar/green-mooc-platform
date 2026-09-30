import { useState } from 'react';
import { flattenQuizQuestions, gradeAnswers, feedbackFor } from '../lib/quiz';

// Post-quiz remediation (PA6 action 16).
//
// A score on its own tells a learner they failed but not what to do about it.
// This replaces that with one card per question they got wrong: what they
// chose, what the answer actually is, why, and a route back into the lesson
// material for the topic concerned. Questions they answered correctly are
// collapsed underneath — available for review, but not what the page leads
// with.
//
// `onReviewTopic` is supplied by the unit page and scrolls the learner to the
// lesson notes; a question can name its own `reviewTopic` for a sharper
// pointer, and `reviewNote` indexes the specific lesson-note bullet.
export default function QuizRemediation({ unit, result, onReviewTopic }) {
  const [showCorrect, setShowCorrect] = useState(false);

  const questions = flattenQuizQuestions(unit);
  if (questions.length === 0 || !Array.isArray(result?.answers)) return null;

  const graded = gradeAnswers(questions, result.answers);
  const scorable = graded.filter((g) => g.scorable);
  if (scorable.length === 0) return null;

  const wrong = scorable.filter((g) => g.correct === false);
  const right = scorable.filter((g) => g.correct === true);
  const score = Math.round((right.length / scorable.length) * 100);

  return (
    <section className="remediation">
      <header className="remediation__head">
        <div className="remediation__score" aria-hidden="true">
          <span className="remediation__score-value">{score}%</span>
        </div>
        <div>
          <h3>
            {wrong.length === 0
              ? 'Every answer correct'
              : wrong.length === 1
              ? 'One topic to review'
              : `${wrong.length} topics to review`}
          </h3>
          <p className="muted">
            {wrong.length === 0
              ? `You answered all ${scorable.length} questions correctly. The explanations are below if you want to check your reasoning.`
              : `You answered ${right.length} of ${scorable.length} correctly. Work through the cards below — each one shows what the answer is and where to review it.`}
          </p>
        </div>
      </header>

      {wrong.length > 0 && (
        <div className="remediation__cards">
          {wrong.map((g) => (
            <RemediationCard
              key={g.index}
              graded={g}
              unit={unit}
              onReviewTopic={onReviewTopic}
            />
          ))}
        </div>
      )}

      {right.length > 0 && (
        <div className="remediation__correct">
          <button
            type="button"
            className="remediation__toggle"
            onClick={() => setShowCorrect((v) => !v)}
            aria-expanded={showCorrect}
          >
            {showCorrect ? '▾' : '▸'} {right.length} you answered correctly
          </button>
          {showCorrect && (
            <div className="remediation__cards remediation__cards--correct">
              {right.map((g) => (
                <RemediationCard
                  key={g.index}
                  graded={g}
                  unit={unit}
                  onReviewTopic={onReviewTopic}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function RemediationCard({ graded, unit, onReviewTopic }) {
  const { question: q, selected, correct, index, answered } = graded;
  const options = q.options || [];
  const correctText = options[q.correctIndex];
  const chosenText = answered ? options[selected] : null;
  const why = feedbackFor(q, selected);

  // A question can point at its own topic; otherwise fall back to the unit.
  const topic = q.reviewTopic || unit.title;
  const note =
    typeof q.reviewNote === 'number' ? unit.lessonNotes?.[q.reviewNote] : null;

  return (
    <article className={`remediation-card ${correct ? 'is-correct' : 'is-wrong'}`}>
      <header className="remediation-card__head">
        <span className="remediation-card__badge" aria-hidden="true">
          {correct ? '✓' : '✕'}
        </span>
        <p className="remediation-card__question">
          <span className="sr-only">{correct ? 'Correct. ' : 'Incorrect. '}</span>
          {q.question}
        </p>
      </header>

      <dl className="remediation-card__answers">
        <div className={correct ? '' : 'is-wrong'}>
          <dt>Your answer</dt>
          <dd>{answered ? chosenText : <em>Not answered</em>}</dd>
        </div>
        {!correct && (
          <div className="is-correct">
            <dt>Correct answer</dt>
            <dd>{correctText}</dd>
          </div>
        )}
      </dl>

      {why && (
        <div className="remediation-card__why">
          <h4>{correct ? 'Why this is right' : 'Why'}</h4>
          <p>{why}</p>
        </div>
      )}

      {note && (
        <div className="remediation-card__note">
          <h4>From the lesson</h4>
          <p>{stripMarkdown(note)}</p>
        </div>
      )}

      <button
        type="button"
        className="remediation-card__review"
        onClick={() => onReviewTopic?.({ questionIndex: index, noteIndex: q.reviewNote })}
      >
        ↑ Review “{topic}” in the lesson notes
      </button>
    </article>
  );
}

// Lesson notes are authored with **bold** markers; the remediation card shows
// them as plain text.
function stripMarkdown(text) {
  return String(text || '').replace(/\*\*(.+?)\*\*/g, '$1');
}
