import { useEffect, useRef, useState } from 'react';

// Clean native video player.
// - Uses `src` attribute directly (React updates this reliably when videoUrl changes).
// - The `key={videoUrl}` forces a fresh <video> mount when navigating between units,
//   so the player never holds a stale source.
// - Renders a small professional warning if the video file genuinely fails to load.
//   It does NOT render any placeholder overlay over a working video.
export default function VideoLesson({ videoUrl, title }) {
  const [errored, setErrored] = useState(false);
  const videoRef = useRef(null);

  // Reset error state when navigating to a different video.
  useEffect(() => {
    setErrored(false);
  }, [videoUrl]);

  if (!videoUrl) return null;

  if (errored) {
    return (
      <div className="video-lesson">
        <div className="video-warning">
          <span className="video-warning__icon">⚠️</span>
          <div>
            <strong>Video temporarily unavailable</strong>
            <p>
              We couldn't load this lesson video right now. Please continue with
              the lesson notes and activity below — your progress will still be saved.
            </p>
          </div>
        </div>
        {title && <p className="video-lesson__caption">{title}</p>}
      </div>
    );
  }

  return (
    <div className="video-lesson">
      <div className="video-lesson__player">
        <video
          key={videoUrl}
          ref={videoRef}
          controls
          preload="metadata"
          playsInline
          src={videoUrl}
          onError={() => setErrored(true)}
        >
          Your browser does not support inline video playback.{' '}
          <a href={videoUrl} target="_blank" rel="noreferrer">Open the video in a new tab</a>.
        </video>
      </div>
      {title && <p className="video-lesson__caption">{title}</p>}
    </div>
  );
}
