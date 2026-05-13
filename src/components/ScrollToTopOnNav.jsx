// ScrollToTopOnNav — fixes the classic React Router quirk where the
// scroll position is preserved across navigation. Whenever the route
// changes, we snap back to the top so every page is read from the
// start. Exception: if the URL has a #hash, we scroll to that anchor
// instead (so /#travel still lands in the Travel section).

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTopOnNav() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Defer one frame so the section IDs are mounted before scrolling.
      requestAnimationFrame(() => {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        // Fallback if the anchor target isn't rendered yet
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
      return;
    }
    // No hash → always start at the top of the new page.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
