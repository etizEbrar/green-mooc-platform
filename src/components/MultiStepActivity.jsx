import { useMemo, useState } from 'react';
import MultipleChoiceActivity from './MultipleChoiceActivity';
import ChecklistActivity from './ChecklistActivity';
import ReflectionActivity from './ReflectionActivity';
import MatchingActivity from './MatchingActivity';
import ActionPlanActivity from './ActionPlanActivity';
import BranchingScenarioActivity from './BranchingScenarioActivity';

// Composes a sequence of sub-activities into one paged "multi-step" activity.
// Each sub-step's result is collected into a `stepResults` array and persisted
// to Firestore via the parent `onSubmit` callback whenever any step completes.
//
// Step kinds supported:
//   intro / case-intro       - read-only narrative
//   mcq / mcq-multi          - MultipleChoiceActivity
//   matching                 - MatchingActivity
//   checklist                - ChecklistActivity
//   reflection               - ReflectionActivity
//   action-plan              - ActionPlanActivity
//   weighted-mcq             - BranchingScenarioActivity
export default function MultiStepActivity({ unit, initialResult, onSubmit }) {
  const steps = unit?.steps || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [stepResults, setStepResults] = useState(
    initialResult?.stepResults || Array(steps.length).fill(null)
  );

  const completedSteps = useMemo(() => stepResults.filter(Boolean).length, [stepResults]);

  const handleStepSubmit = (idx, result) => {
    const next = [...stepResults];
    next[idx] = result;
    setStepResults(next);

    // Aggregate score = average of scorable steps.
    const scored = next.filter((r) => r && typeof r.score === 'number');
    const avg = scored.length
      ? Math.round(scored.reduce((a, r) => a + r.score, 0) / scored.length)
      : null;

    onSubmit?.({
      type: 'multi-step',
      score: avg,
      stepResults: next,
      completedSteps: next.filter(Boolean).length,
      totalSteps: steps.length,
      submittedAt: new Date().toISOString()
    });
  };

  if (steps.length === 0) return null;

  const step = steps[activeIdx];

  return (
    <div className="multi-step">
      <div className="multi-step__progress">
        <div className="multi-step__progress-bar">
          <div
            className="multi-step__progress-fill"
            style={{ width: `${((activeIdx + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="multi-step__progress-label">
          Step {activeIdx + 1} of {steps.length} · {completedSteps} completed
        </span>
      </div>

      <ol className="multi-step__nav">
        {steps.map((s, i) => {
          const done = !!stepResults[i];
          return (
            <li
              key={i}
              className={`multi-step__nav-item ${i === activeIdx ? 'is-active' : ''} ${
                done ? 'is-done' : ''
              }`}
            >
              <button
                type="button"
                className="multi-step__nav-btn"
                onClick={() => setActiveIdx(i)}
              >
                <span className="multi-step__nav-num">{done ? '✓' : i + 1}</span>
                <span className="multi-step__nav-title">{s.title || stepKindLabel(s.kind)}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="multi-step__panel">
        <h3 className="multi-step__panel-title">{step.title || stepKindLabel(step.kind)}</h3>
        <StepRenderer
          step={step}
          unit={unit}
          initialResult={stepResults[activeIdx]}
          onSubmit={(r) => handleStepSubmit(activeIdx, r)}
        />
      </div>

      <div className="multi-step__pager">
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
          disabled={activeIdx === 0}
        >
          ← Previous
        </button>
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={() => setActiveIdx((i) => Math.min(steps.length - 1, i + 1))}
          disabled={activeIdx === steps.length - 1}
        >
          Next step →
        </button>
      </div>
    </div>
  );
}

function StepRenderer({ step, unit, initialResult, onSubmit }) {
  switch (step.kind) {
    case 'intro':
    case 'case-intro':
      return (
        <IntroStep
          step={step}
          initialResult={initialResult}
          onSubmit={onSubmit}
        />
      );
    case 'mcq':
    case 'mcq-multi':
      return (
        <MultipleChoiceActivity
          unit={unit}
          step={step}
          initialResult={initialResult}
          onSubmit={onSubmit}
        />
      );
    case 'matching':
      return (
        <MatchingActivity
          unit={unit}
          step={step}
          initialResult={initialResult}
          onSubmit={onSubmit}
        />
      );
    case 'checklist':
      return (
        <ChecklistActivity
          unit={unit}
          step={step}
          initialResult={initialResult}
          onSubmit={onSubmit}
        />
      );
    case 'reflection':
      return (
        <ReflectionActivity
          unit={unit}
          step={step}
          initialResult={initialResult}
          onSubmit={onSubmit}
        />
      );
    case 'action-plan':
      return (
        <ActionPlanActivity
          unit={unit}
          step={step}
          initialResult={initialResult}
          onSubmit={onSubmit}
        />
      );
    case 'weighted-mcq':
      return (
        <BranchingScenarioActivity
          unit={unit}
          step={step}
          initialResult={initialResult}
          onSubmit={onSubmit}
        />
      );
    default:
      return <p className="muted">Unknown step kind: {step.kind}</p>;
  }
}

function IntroStep({ step, initialResult, onSubmit }) {
  const acked = !!initialResult?.acknowledged;
  return (
    <div className="multi-step__intro">
      {step.body && <p>{step.body}</p>}
      {!acked ? (
        <button
          className="btn btn--primary"
          onClick={() => onSubmit({ type: 'intro', acknowledged: true, score: 100 })}
        >
          Got it — continue
        </button>
      ) : (
        <p className="muted">✓ Read.</p>
      )}
    </div>
  );
}

function stepKindLabel(kind) {
  switch (kind) {
    case 'intro': return 'Intro';
    case 'case-intro': return 'Case';
    case 'mcq': return 'Question';
    case 'mcq-multi': return 'Select all';
    case 'matching': return 'Matching';
    case 'checklist': return 'Checklist';
    case 'reflection': return 'Reflection';
    case 'action-plan': return 'Action plan';
    case 'weighted-mcq': return 'Scenario';
    default: return 'Step';
  }
}
