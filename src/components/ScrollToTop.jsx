import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Reset scroll position on navigation.
//
// Without this, two reported bugs appear that look unrelated but share this
// cause:
//
//   * "About" lands on the Pilots section — `/` and `/about` render the same
//     AboutPage, so React Router never remounts it and the browser keeps the
//     old scroll offset.
//   * "Next unit" seems not to respond until you refresh — the route does
//     change, but the viewport stays at the bottom of the previous unit, so
//     nothing appears to happen. Refreshing resets scroll, which is why it
//     looked like a reload fixed it.
//
// A link that deliberately targets a section passes `state.scrollTo`; that
// case is left alone so the Pilots link still works.
export default function ScrollToTop() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (state?.scrollTo) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, state]);

  return null;
}
