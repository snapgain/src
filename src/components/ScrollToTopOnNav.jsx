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
      // Try to hit the anchor across a few animation frames — some
      // sections mount lazily (framer-motion viewport check, dynamic
      // imports), so the first rAF may fire before the id is in the
      // DOM. We retry a handful of times, then give up SILENTLY.
      //
      // Deliberately do NOT fall back to scrollTo(top: 0). Earlier
      // versions did that and it produced "clicking Travel throws me
      // back to the top of the page" for Bárbara on mobile whenever
      // the retry raced the mount.
      let cancelled = false;
      let tries = 0;
      const MAX_TRIES = 8;
      const tick = () => {
        if (cancelled) return;
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        tries += 1;
        if (tries < MAX_TRIES) requestAnimationFrame(tick);
        // Else: leave the scroll where the user was. Not scrolling is
        // less confusing than being teleported to the top.
      };
      requestAnimationFrame(tick);
      return () => {
        cancelled = true;
      };
    }
    // No hash → always start at the top of the new page.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
