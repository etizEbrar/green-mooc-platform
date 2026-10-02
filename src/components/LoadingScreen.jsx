import Icon from './Icon';
export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-screen__content">
        <div className="loading-screen__spinner" />
        <span className="loading-screen__logo"><Icon name="module-1" size={38} /></span>
        <h2 className="loading-screen__title">CREDIT MOOC</h2>
        <p className="loading-screen__text">Loading your learning environment…</p>
      </div>
    </div>
  );
}
