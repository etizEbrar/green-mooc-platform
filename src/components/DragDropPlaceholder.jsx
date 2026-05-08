// Styled placeholder for the drag-and-drop / sorting activity.
// Replace this with a real implementation (e.g. react-dnd or @dnd-kit/core) when ready.
export default function DragDropPlaceholder({ unit }) {
  const items = unit.dragItems || [];
  return (
    <div className="activity activity--dragdrop">
      <div className="dragdrop-banner">
        <span className="dragdrop-banner__icon">🧲</span>
        <div>
          <h4>Interactive drag-and-drop coming soon</h4>
          <p>
            In the final version, you'll be able to drag the cards below and drop them into
            categories. For now, this is a styled preview.
          </p>
        </div>
      </div>
      <div className="dragdrop-grid">
        {items.map((it, i) => (
          <div key={i} className="dragdrop-tile" tabIndex={0}>
            <span className="dragdrop-tile__handle">⠿</span>
            <span>{it}</span>
          </div>
        ))}
      </div>
      <p className="muted dragdrop-hint">
        💡 Tip: while waiting for the interactive version, mentally sort these into the right
        groups, then mark the unit as completed.
      </p>
    </div>
  );
}
