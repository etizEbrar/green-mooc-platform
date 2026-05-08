export default function ProgressBar({ value = 0, variant = 'default' }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className={`progress-bar progress-bar--${variant}`}>
      <div className="progress-bar__fill" style={{ width: `${safe}%` }} />
    </div>
  );
}
