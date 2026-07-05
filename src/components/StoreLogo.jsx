import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * StoreLogo — renders a retailer's logo with a cascade of fallbacks.
 *
 * Order (each is tried until one loads):
 *   1. store.logo_url from DB (scraper output or admin upload)
 *   2. DuckDuckGo icon service (best for real brand logos)
 *   3. Google favicon at 128px (always returns something for any domain)
 *   4. Letter avatar with store name initial
 *
 * Why the fallbacks: scraper output from JamDoughnut S3 has a ~67 %
 * broken-link rate (verified 2026-07-05); Clearbit's free logo API was
 * discontinued 2023-24; and many stores in the DB have no `domain` set.
 * The cascade means we always show something recognisable rather than a
 * broken-image icon.
 *
 * When there's no `store.domain`, we guess one from the store name
 * (e.g. "Sainsbury's" → sainsburys.co.uk). Hit rate is high enough for
 * DuckDuckGo/Google favicon to work for the big UK retailers.
 */
export function StoreLogo({ store, size = 'md', className = '' }) {
  const [tierIndex, setTierIndex] = useState(0);

  const sizeClass =
    size === 'xs'
      ? 'w-6 h-6 text-xs'
      : size === 'sm'
      ? 'w-8 h-8 text-sm'
      : size === 'lg'
      ? 'w-16 h-16 text-2xl'
      : size === 'xl'
      ? 'w-20 h-20 text-3xl'
      : 'w-10 h-10 text-base';

  const tiers = useMemo(() => {
    const out = [];
    if (store?.logo_url) out.push(store.logo_url);
    const domain = store?.domain || guessDomain(store?.name);
    if (domain) {
      out.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
      out.push(
        `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
      );
    }
    return out;
  }, [store?.logo_url, store?.domain, store?.name]);

  const url = tiers[tierIndex] || null;

  if (!url) {
    return (
      <div
        className={cn(
          sizeClass,
          'rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0',
          className
        )}
        aria-hidden="true"
      >
        {store?.name?.[0]?.toUpperCase() || '?'}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={store?.name || ''}
      onError={() => setTierIndex((i) => i + 1)}
      className={cn(
        sizeClass,
        'rounded-lg bg-white object-contain p-1 shrink-0 border',
        className
      )}
    />
  );
}

/** Best-effort domain guess from a store display name. Not authoritative
 *  — it's only used to feed favicon services, so a miss just cascades to
 *  the next tier. Handles common UK retailer patterns. */
function guessDomain(name) {
  if (!name) return null;
  const cleaned = name
    .toLowerCase()
    .replace(/['’‘`"]/g, '')
    .replace(/&/g, 'and')
    .replace(/\.co\.uk$/, '')
    .replace(/\s+(uk|ltd|limited|shop|store|online)$/i, '')
    .replace(/[^a-z0-9]/g, '');
  if (!cleaned) return null;
  return `${cleaned}.co.uk`;
}

export default StoreLogo;
