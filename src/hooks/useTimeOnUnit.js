import { useEffect, useRef } from 'react';
import { recordUnitTime, touchUserActivity } from '../lib/engagement';

const FLUSH_INTERVAL_MS = 30_000;

// Measures how long a unit page is actually *visible* to the learner and
// accumulates it in Firestore.
//
// Time stops counting when the tab is hidden, so leaving a unit open overnight
// does not report as ten hours of study. The buffer is flushed periodically,
// on tab hide, and on unmount — whichever comes first.
export default function useTimeOnUnit(uid, unitId) {
  // Refs, not state: none of this should trigger a re-render.
  const startedAt = useRef(null);
  const bufferedMs = useRef(0);

  useEffect(() => {
    if (!uid || !unitId) return undefined;

    startedAt.current = document.visibilityState === 'visible' ? Date.now() : null;
    bufferedMs.current = 0;

    const accumulate = () => {
      if (startedAt.current !== null) {
        bufferedMs.current += Date.now() - startedAt.current;
        startedAt.current = null;
      }
    };

    const flush = () => {
      accumulate();
      const seconds = bufferedMs.current / 1000;
      if (seconds >= 1) {
        bufferedMs.current = 0;
        recordUnitTime(uid, unitId, seconds);
      }
      // Resume counting if the page is still in front of the learner.
      if (document.visibilityState === 'visible') startedAt.current = Date.now();
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        startedAt.current = Date.now();
      } else {
        flush();
      }
    };

    const timer = setInterval(flush, FLUSH_INTERVAL_MS);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', flush);

    touchUserActivity(uid);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [uid, unitId]);
}
