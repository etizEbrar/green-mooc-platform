// Renders learner-facing lesson notes / transcript inline (no file download).
//
// Accepts two shapes for `notes`:
//
//   1. Legacy: array of plain strings — rendered as a single bulleted list
//      with **bold** keyword parsing.
//
//   2. Structured: array of section objects:
//      [{ heading, text, bullets: [...] }]
//      Each section is rendered as a titled block with optional paragraph
//      text and an optional bulleted list.
//
// Both shapes can mix in the same array. The component never crashes on
// missing or malformed entries.
export default function LessonNotes({ notes = [], transcript }) {
  const hasNotes = Array.isArray(notes) && notes.length > 0;
  if (!hasNotes && !transcript) return null;

  return (
    <div className="lesson-notes">
      {hasNotes && <NotesBody notes={notes} />}
      {transcript && (
        <details className="lesson-notes__transcript">
          <summary>📝 Full lesson transcript</summary>
          {transcript.split(/\n\n+/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </details>
      )}
    </div>
  );
}

function NotesBody({ notes }) {
  // If every entry is a string → render as one flat bullet list.
  const allStrings = notes.every((n) => typeof n === 'string');
  if (allStrings) {
    return (
      <ul className="lesson-notes__list">
        {notes.map((n, i) => (
          <li key={i} className="lesson-notes__item">{renderInline(n)}</li>
        ))}
      </ul>
    );
  }

  // Mixed / structured: render each entry as a section.
  return (
    <div className="lesson-notes__sections">
      {notes.map((entry, i) => {
        if (typeof entry === 'string') {
          return (
            <p key={i} className="lesson-notes__paragraph">{renderInline(entry)}</p>
          );
        }
        const { heading, text, bullets } = entry || {};
        return (
          <section key={i} className="lesson-notes__section">
            {heading && <h3 className="lesson-notes__heading">{heading}</h3>}
            {text && <p className="lesson-notes__paragraph">{renderInline(text)}</p>}
            {Array.isArray(bullets) && bullets.length > 0 && (
              <ul className="lesson-notes__list">
                {bullets.map((b, j) => (
                  <li key={j} className="lesson-notes__item">{renderInline(b)}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

// Minimal **bold** parser — splits on ** pairs.
function renderInline(text) {
  if (!text) return null;
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}
