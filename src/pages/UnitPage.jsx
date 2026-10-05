import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { getModule, getUnit, getUnitsForModule, units as allUnits } from '../data/courseData';
import { completionStats } from '../lib/certificate';
import LearningSidebar from '../components/LearningSidebar';
import LessonNotes from '../components/LessonNotes';
import VideoLesson from '../components/VideoLesson';
import MaterialCard from '../components/MaterialCard';
import MultipleChoiceActivity from '../components/MultipleChoiceActivity';
import ChecklistActivity from '../components/ChecklistActivity';
import ReflectionActivity from '../components/ReflectionActivity';
import CaseStudyActivity from '../components/CaseStudyActivity';
import ActionPlanActivity from '../components/ActionPlanActivity';
import MatchingActivity from '../components/MatchingActivity';
import SortingActivity from '../components/SortingActivity';
import BranchingScenarioActivity from '../components/BranchingScenarioActivity';
import ActivityFeedback from '../components/ActivityFeedback';
import useTimeOnUnit from '../hooks/useTimeOnUnit';
import { recordUnitVisit, recordInteraction } from '../lib/engagement';
import { trackUnitComplete, trackQuizAttempt } from '../lib/milestones';

// Activity types that produce a real score. Everything else saves score: 100
// simply to mark "submitted", so recording those as quiz scores would make the
// consortium's average-score metric meaningless.
const SCORED_TYPES = ['multiple-choice', 'matching', 'sorting', 'branching-scenario'];

export default function UnitPage() {
  const { moduleId, unitId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const unit = getUnit(unitId);
  const module = getModule(moduleId);
  const moduleUnits = module ? getUnitsForModule(module.id) : [];
  const unitIndex = moduleUnits.findIndex((u) => u.id === unitId);
  const nextUnit = moduleUnits[unitIndex + 1];

  const [progress, setProgress] = useState(null);
  const [activityResult, setActivityResult] = useState(null);
  const [savingComplete, setSavingComplete] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [certUnlocked, setCertUnlocked] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  // Bumping this remounts the activity with no initial result, which is the
  // only reliable reset given each activity owns its own submitted state.
  const [retryNonce, setRetryNonce] = useState(0);

  // Remediation cards send the learner back up to the lesson notes for the
  // topic they missed, so the notes section needs a scroll target.
  const notesRef = useRef(null);
  const handleReviewTopic = () => {
    notesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activityRef = useRef(null);
  const handleTryAgain = () => {
    setActivityResult(null);
    setRetryNonce((n) => n + 1);
    activityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!currentUser || !unit) return;
    setActivityResult(null);
    setProgress(null);
    setFeedback('');
    setCertUnlocked(false);
    setProgressLoaded(false);
    (async () => {
      try {
        const ref = doc(db, 'users', currentUser.uid, 'progress', unit.id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setProgress(data);
          if (data.activityResult) setActivityResult(data.activityResult);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProgressLoaded(true);
      }
    })();
  }, [currentUser, unit?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Engagement metrics: one visit per unit open, plus visible time on the page.
  useEffect(() => {
    if (!currentUser || !unit) return;
    recordUnitVisit(currentUser.uid, unit.id, module?.id);
  }, [currentUser, unit?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useTimeOnUnit(currentUser?.uid, unit?.id);

  if (!unit || !module) {
    return (
      <div className="learning-shell">
        <LearningSidebar />
        <div className="learning-content">
          <div className="empty-state">
            <h2>Unit not found</h2>
            <Link className="btn btn--primary" to="/dashboard">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleActivitySubmit = async (result) => {
    setActivityResult(result);
    if (!currentUser) return;
    recordInteraction(currentUser.uid, unit.id, 'activityAttempts');
    // Milestone: quiz attempts carry their score so the consortium can see
    // whether assessments are too hard, not just how often they are tried.
    if (SCORED_TYPES.includes(unit.activityType)) {
      trackQuizAttempt(currentUser.uid, module.id, unit.id, result?.score);
    }
    const ref = doc(db, 'users', currentUser.uid, 'progress', unit.id);
    await setDoc(
      ref,
      {
        uid: currentUser.uid,
        moduleId: module.id,
        unitId: unit.id,
        activityCompleted: true,
        activityResult: result,
        quizScore: scoreFor(unit, result),
        completed: progress?.completed ?? false,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  };

  const isPlaceholder = unit.activityType === 'drag-drop';
  const canMarkComplete = isPlaceholder || !!activityResult;

  const handleMarkComplete = async () => {
    if (!currentUser) return;
    setSavingComplete(true);
    setFeedback('');
    const wasCompleted = !!progress?.completed;
    try {
      const ref = doc(db, 'users', currentUser.uid, 'progress', unit.id);
      await setDoc(
        ref,
        {
          uid: currentUser.uid,
          moduleId: module.id,
          unitId: unit.id,
          completed: true,
          activityCompleted: !!activityResult,
          quizScore: scoreFor(unit, activityResult),
          updatedAt: serverTimestamp(),
          completedAt: serverTimestamp()
        },
        { merge: true }
      );
      setProgress((p) => ({ ...(p || {}), completed: true }));
      trackUnitComplete(currentUser.uid, module.id, unit.id);
      setFeedback('Unit marked as completed. Your progress has been saved.');

      // Tell the learner the moment this unit takes them over the certificate
      // threshold — not on every later unit, and never on a re-completion.
      if (!wasCompleted) {
        try {
          const snap = await getDocs(collection(db, 'users', currentUser.uid, 'progress'));
          const map = {};
          snap.forEach((d) => (map[d.id] = d.data()));
          const after = completionStats(map, allUnits.length);
          if (after.eligible && after.completedCount - 1 < after.requiredUnits) setCertUnlocked(true);
        } catch {
          // The notice is a courtesy; the dashboard shows eligibility anyway.
        }
      }
    } catch (err) {
      console.error(err);
      setFeedback('Could not save progress. Please check your connection and try again.');
    } finally {
      setSavingComplete(false);
    }
  };

  const renderActivity = () => {
    const common = {
      key: `${unit.id}:${retryNonce}`,
      unit,
      initialResult: retryNonce ? null : activityResult,
      onSubmit: handleActivitySubmit
    };
    switch (unit.activityType) {
      case 'multiple-choice': return <MultipleChoiceActivity {...common} />;
      case 'checklist': return <ChecklistActivity {...common} />;
      case 'reflection': return <ReflectionActivity {...common} />;
      case 'case-study': return <CaseStudyActivity {...common} />;
      case 'action-plan': return <ActionPlanActivity {...common} />;
      case 'matching': return <MatchingActivity {...common} />;
      case 'sorting': return <SortingActivity {...common} />;
      case 'branching-scenario': return <BranchingScenarioActivity {...common} />;
      default: return <ReflectionActivity {...common} />;
    }
  };

  const materials = Array.isArray(unit.materials) ? unit.materials : [];
  const isCompleted = progress?.completed;

  const completionGateMessage = () => {
    if (isCompleted) return 'You have already marked this unit as completed. You can revisit it any time.';
    if (!canMarkComplete) return 'Submit at least one activity step above before marking this unit as done.';
    return 'When you finish the lesson, materials and activity, mark this unit as completed to update your progress.';
  };

  return (
    <div className="learning-shell">
      <LearningSidebar />
      <div className="learning-content page--unit">
        <Link to={`/modules/${module.id}`} className="back-link">
          ← Back to {module.title}
        </Link>

        <header className="unit-header">
          <p className="unit-header__eyebrow">
            Module {module.number} · Unit {unit.number}
          </p>
          <h1>{unit.title}</h1>
          <p className="unit-header__desc">{unit.description}</p>
          <div className="unit-header__meta">
            <span className="chip">⏱ {unit.estimatedTime}</span>
            <span className="chip">
              <Icon name="target" size={15} /> {prettyActivityType(unit.activityType)}
            </span>
            {isCompleted ? (
              <span className="chip chip--success">
                <Icon name="complete" size={15} /> Completed
              </span>
            ) : activityResult ? (
              <span className="chip chip--warning">In progress</span>
            ) : (
              <span className="chip chip--muted">Not started</span>
            )}
          </div>
        </header>

        <section className="unit-section">
          <h2><Icon name="video" /> Video lesson</h2>
          {(unit.youtubeUrl || unit.videoUrl || unit.youtubeUrlTr) ? (
            <VideoLesson
              youtubeUrl={unit.youtubeUrl}
              youtubeUrlTr={unit.youtubeUrlTr}
              videoUrl={unit.videoUrl}
              title={unit.title}
              onEngage={() =>
                currentUser && recordInteraction(currentUser.uid, unit.id, 'videoPlays')
              }
            />
          ) : (
            <div className="video-coming-soon">
              <span className="video-coming-soon__icon">
                  <Icon name="video" size={28} />
                </span>
              <div>
                <strong>Video lesson will be added soon.</strong>
                <p>
                  Please continue with the lesson notes and activity below — your progress will still be saved.
                </p>
              </div>
            </div>
          )}
        </section>

        {(unit.lessonNotes?.length || unit.transcript) && (
          <section className="unit-section" ref={notesRef} id="lesson-notes">
            <h2><Icon name="notes" /> Lesson notes</h2>
            <LessonNotes notes={unit.lessonNotes} transcript={unit.transcript} />
          </section>
        )}

        {materials.length > 0 && (
          <section className="unit-section">
            <h2><Icon name="materials" /> Learning materials</h2>
            <p className="muted unit-section__sub">Final learner-facing resources for this unit.</p>
            <div className="materials-grid">
              {materials.map((m, i) => (
                <MaterialCard
                  key={i}
                  title={m.title}
                  description={m.description || materialTypeBlurb(m.type)}
                  url={m.url}
                  type={m.type || 'DOCUMENT'}
                  onOpen={() =>
                    currentUser && recordInteraction(currentUser.uid, unit.id, 'materialOpens')
                  }
                />
              ))}
            </div>
          </section>
        )}

        <section className="unit-section" ref={activityRef}>
          <h2>
            <Icon name="activity" /> Activity — {unit.activityTitle}
          </h2>
          {unit.activityDescription && <p className="muted">{unit.activityDescription}</p>}
          <div className="activity-wrapper">
            {progressLoaded ? renderActivity() : (
              <p className="muted">Loading activity…</p>
            )}
          </div>
          {progressLoaded && activityResult && (
            <ActivityFeedback
              unit={unit}
              result={activityResult}
              onReviewTopic={handleReviewTopic}
            />
          )}
        </section>

        <section className="unit-section unit-section--complete">
          <div className="complete-card">
            <div>
              <h3>{isCompleted ? 'Unit completed' : 'Ready to wrap up?'}</h3>
              <p className="muted">{completionGateMessage()}</p>
              {feedback && <p className="feedback">{feedback}</p>}
              {certUnlocked && (
                <div className="cert-unlocked" role="status">
                  <Icon name="certificate" size={20} />
                  <span>
                    <strong>Certificate unlocked.</strong> You have completed enough of the course to
                    receive your certificate.
                  </span>
                  <Link className="btn btn--primary" to="/certificate">
                    Get my certificate
                  </Link>
                </div>
              )}
            </div>
            <div className="complete-card__actions">
              <button
                className="btn btn--primary"
                onClick={handleMarkComplete}
                disabled={savingComplete || isCompleted || !canMarkComplete}
              >
                {isCompleted ? 'Completed' : savingComplete ? 'Saving…' : 'Mark as completed'}
              </button>
              {activityResult && (
                <button className="btn btn--ghost" onClick={handleTryAgain}>
                  <Icon name="retry" size={16} /> Try the activity again
                </button>
              )}
              {nextUnit && (
                <button
                  className="btn btn--ghost"
                  onClick={() => navigate(`/modules/${module.id}/units/${nextUnit.id}`)}
                >
                  Next unit →
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Only real assessments contribute a score.
function scoreFor(unit, result) {
  if (!result || !SCORED_TYPES.includes(unit.activityType)) return null;
  return typeof result.score === 'number' ? result.score : null;
}

function prettyActivityType(t) {
  switch (t) {
    case 'multiple-choice': return 'Quiz';
    case 'checklist': return 'Checklist';
    case 'reflection': return 'Reflection';
    case 'case-study': return 'Case study';
    case 'action-plan': return 'Action plan';
    case 'matching': return 'Matching';
    case 'sorting': return 'Sorting';
    case 'branching-scenario': return 'Scenario';
    default: return 'Activity';
  }
}

function materialTypeBlurb(t) {
  switch (t) {
    case 'PDF': return 'Final PDF — opens in your browser.';
    case 'IMAGE': return 'Infographic image — click to open.';
    default: return 'Final learner-facing resource.';
  }
}
