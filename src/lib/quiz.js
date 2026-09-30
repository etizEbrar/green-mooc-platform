// Shared quiz helpers.
//
// Questions may be authored flat (`quizQuestions`) or grouped into sections
// (`quizSections`). The activity flattens them to index the learner's answers
// positionally, and the remediation view must flatten them *identically* or
// every answer would be matched to the wrong question. Hence one helper,
// used by both.

export function flattenQuizQuestions(unit, step) {
  const sections = Array.isArray(step?.quizSections)
    ? step.quizSections
    : Array.isArray(unit?.quizSections)
    ? unit.quizSections
    : null;

  if (sections) {
    return sections.flatMap((section) =>
      (section.questions || []).map((q) => ({ ...q, sectionTitle: section.title || null }))
    );
  }

  const flat = step?.questions || step?.quizQuestions || unit?.quizQuestions || [];
  return flat.map((q) => ({ ...q, sectionTitle: null }));
}

/** True when the question has a gradeable correct answer. */
export const isScorable = (q) =>
  typeof q?.correctIndex === 'number' && q.correctIndex >= 0;

/**
 * Pair each question with the learner's answer and whether they got it right.
 * Unscorable questions (opinion polls inside a quiz) are marked `scorable:false`
 * so they are never reported as mistakes.
 */
export function gradeAnswers(questions, answers = []) {
  return questions.map((q, index) => {
    const selected = answers[index];
    const scorable = isScorable(q);
    return {
      index,
      question: q,
      selected: typeof selected === 'number' ? selected : null,
      scorable,
      correct: scorable ? selected === q.correctIndex : null,
      answered: typeof selected === 'number'
    };
  });
}

/**
 * Per-question feedback text. Authors may supply one `explanation` for the
 * question, or a `feedback` array giving a different line per option — in
 * which case the line matching what the learner actually chose is the useful
 * one.
 */
export function feedbackFor(q, selected) {
  if (Array.isArray(q?.feedback)) {
    return q.feedback[selected] ?? q.explanation ?? null;
  }
  return q?.explanation ?? q?.feedback ?? null;
}
