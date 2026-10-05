// Feedback shown after an activity is submitted.
//
// The consortium asked that learners see results or receive meaningful
// feedback after assessments and interactive activities. Scored activities
// already show a score and per-question explanations inside their own card;
// this panel adds what was missing:
//
//   • a plain-language reading of the score, with what to do next
//   • for open-ended activities, the expert pointers authored for the unit
//     (`unit.expertFeedback`) and a short self-review checklist, since there
//     is no automatic right answer to compare against
//   • the learner's own submitted answers, played back for review
//
// Rendered by UnitPage once an activity result exists.
import QuizRemediation from './QuizRemediation';
import Icon from './Icon';
const SCORED_TYPES = ['multiple-choice', 'matching', 'sorting', 'branching-scenario'];

export default function ActivityFeedback({ unit, result, onReviewTopic }) {
  if (!result) return null;

  // Multiple-choice quizzes get the full remediation view (PA6 action 16):
  // a card per question showing what the answer is, why, and where to review
  // it — instead of a score and a pass/fail verdict.
  if (unit.activityType === 'multiple-choice' && Array.isArray(result.answers)) {
    return <QuizRemediation unit={unit} result={result} onReviewTopic={onReviewTopic} />;
  }

  const isScored = SCORED_TYPES.includes(unit.activityType) && typeof result.score === 'number'
    && typeof result.total === 'number' && result.total > 0;

  const band = isScored ? scoreBand(result.score) : null;
  const pointers = Array.isArray(unit.expertFeedback) ? unit.expertFeedback : [];
  // Self-check prompts belong only to open-ended work. A scored activity
  // already tells the learner what was wrong, question by question.
  const selfChecks =
    isScored || pointers.length ? [] : selfCheckPrompts(unit.activityType);
  const answers = playbackAnswers(result, unit);

  return (
    <section className="activity-feedback">
      <h3 className="activity-feedback__title">
        <Icon name="tip" size={18} /> Your Results &amp; Review
      </h3>

      {isScored ? (
        <div className={`activity-feedback__band activity-feedback__band--${band.tone}`}>
          <strong>{band.headline}</strong>
          <p>
            You scored <strong>{result.score}%</strong> ({result.correct} of {result.total}).{' '}
            {band.advice}
          </p>
        </div>
      ) : (
        <div className="activity-feedback__band activity-feedback__band--neutral">
          <strong>Recorded</strong>
          <p>
            There is no single right answer here — the value is in how well the response fits
            your own organisation. Compare what you wrote against the points below.
          </p>
        </div>
      )}

      {pointers.length > 0 && (
        <div className="activity-feedback__block">
          <h4>What a strong answer covers</h4>
          <ul>
            {pointers.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {selfChecks.length > 0 && (
        <div className="activity-feedback__block">
          <h4>Check your own answer</h4>
          <ul>
            {selfChecks.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {answers.length > 0 && (
        <details className="activity-feedback__playback">
          <summary>Review what you submitted ({answers.length})</summary>
          <ol>
            {answers.map((a, i) => (
              <li key={i}>
                {a.label && <span className="activity-feedback__label">{a.label}</span>}
                <p>{a.value}</p>
              </li>
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}

function scoreBand(score) {
  if (score >= 80) {
    return {
      tone: 'strong',
      headline: 'Strong result',
      advice: 'You can move on to the next unit with confidence.'
    };
  }
  if (score >= 60) {
    return {
      tone: 'ok',
      headline: 'Solid, with gaps',
      advice:
        'Re-read the explanations on the questions you missed before moving on — those points come back in later units.'
    };
  }
  return {
    tone: 'weak',
    headline: 'Worth another pass',
    advice:
      'Go back over the lesson notes above, then use “Try again”. Repeating the activity is expected, not a failure.'
  };
}

// Generic but concrete prompts, used when a unit has no authored
// `expertFeedback`. They ask the questions a trainer would ask.
function selfCheckPrompts(type) {
  switch (type) {
    case 'action-plan':
      return [
        'Is every action specific enough that someone else could carry it out without asking you what you meant?',
        'Does each action have a named owner and a date?',
        'Can you tell in three months whether it worked — is there a number, a bill or a document that would show it?',
        'Is at least one action something you can start this week with no budget?'
      ];
    case 'reflection':
      return [
        'Did you answer about your own organisation rather than in general terms?',
        'Did you name a concrete situation, process or product — not just a principle?',
        'Is there one thing in your answer you could turn into an action this month?'
      ];
    case 'case-study':
      return [
        'Did you identify the underlying cause, not only the visible symptom?',
        'Does your recommendation fit the size and budget of the business in the case?',
        'Would your answer change if the business had half the resources? If not, it may be too generic.'
      ];
    case 'checklist':
      return [
        'For every item you left unticked: is it not relevant, or not done yet? Those are different answers.',
        'Pick the two unticked items with the best effort-to-benefit ratio — those are your next actions.'
      ];
    default:
      return [
        'Is your answer specific to your own context?',
        'Could you act on it in the next month?'
      ];
  }
}

// Normalise the different result shapes into { label, value } rows, pairing
// each saved answer with the question it belongs to.
function playbackAnswers(result, unit) {
  // Reflection and case-study save a positional array of strings.
  if (Array.isArray(result.answers) && result.answers.some((a) => typeof a === 'string')) {
    const labels =
      unit.reflectionQuestions ||
      unit.caseStudy?.questions ||
      unit.caseStudy?.tasks ||
      [];
    return result.answers
      .map((value, i) => ({ label: labels[i] || null, value }))
      .filter((row) => typeof row.value === 'string' && row.value.trim());
  }

  // Action plan saves an object keyed field-0, field-1, … in field order.
  if (result.values && typeof result.values === 'object') {
    const labels = Array.isArray(unit.actionPlanFields) ? unit.actionPlanFields : [];
    return Object.entries(result.values)
      .filter(([, v]) => typeof v === 'string' && v.trim())
      .map(([key, value]) => {
        const idx = Number(String(key).replace('field-', ''));
        const label = labels[idx];
        return {
          label: typeof label === 'string' ? label : label?.label || null,
          value
        };
      });
  }

  return [];
}
