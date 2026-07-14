// Clean video player. Two modes:
//
//   1. YouTube (preferred): pass `youtubeUrl` in any common YouTube URL format
//      (watch?v=, youtu.be/, /embed/, /shorts/). We extract the video ID and
//      embed it via youtube-nocookie.com for privacy-enhanced playback.
//
//   2. Local file (legacy fallback): pass `videoUrl` pointing to a local mp4.
//      Used only if no `youtubeUrl` is provided.
//
// If neither URL is present, the component returns null — the parent (UnitPage)
// is expected to render the "video coming soon" card instead.
import { useEffect, useState } from 'react';

export default function VideoLesson({ youtubeUrl, youtubeUrlTr, videoUrl, title }) {
  const [lang, setLang] = useState('en');

  const activeUrl = lang === 'tr' && youtubeUrlTr ? youtubeUrlTr : youtubeUrl;
  const ytId = extractYouTubeId(activeUrl);

  // ----- YouTube embed (preferred) -----
  if (ytId) {
    const src = `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`;
    return (
      <div className="video-lesson">
        {youtubeUrlTr && (
          <div className="video-lesson__lang-toggle" style={{ marginBottom: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setLang('en')} 
              style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid #d1d5db', background: lang === 'en' ? '#f3f4f6' : 'white', cursor: 'pointer', fontSize: '14px', fontWeight: lang === 'en' ? '600' : '400', color: lang === 'en' ? '#111827' : '#6b7280' }}
            >
              English
            </button>
            <button 
              onClick={() => setLang('tr')} 
              style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid #d1d5db', background: lang === 'tr' ? '#f3f4f6' : 'white', cursor: 'pointer', fontSize: '14px', fontWeight: lang === 'tr' ? '600' : '400', color: lang === 'tr' ? '#111827' : '#6b7280' }}
            >
              Türkçe
            </button>
          </div>
        )}
        <div className="video-lesson__player video-lesson__player--youtube">
          <iframe
            key={ytId}
            src={src}
            title={title || 'Lesson video'}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        {title && <p className="video-lesson__caption">{title}</p>}
      </div>
    );
  }

  // ----- Local-file fallback -----
  return <LocalVideo videoUrl={videoUrl} title={title} />;
}

function LocalVideo({ videoUrl, title }) {
  const [errored, setErrored] = useState(false);
  useEffect(() => setErrored(false), [videoUrl]);

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

// Accepts any of:
//   https://www.youtube.com/watch?v=VIDEO_ID[&t=…]
//   https://youtu.be/VIDEO_ID[?t=…]
//   https://www.youtube.com/embed/VIDEO_ID
//   https://www.youtube.com/shorts/VIDEO_ID
//   https://www.youtube.com/live/VIDEO_ID
// Returns the 11-character video ID, or null.
function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
    /youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{11})/
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  // Bare 11-char ID (someone pastes just the ID)
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}
