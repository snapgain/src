import React, { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * StoreLogo — renders a retailer's logo using:
 *   1. store.logo_url if explicitly set (admin upload)
 *   2. Clearbit's logo API at https://logo.clearbit.com/<domain> (no key required)
 *   3. fallback: rounded square with the first letter of the store name
 *
 * `key` should be set to store.id by the parent if the same component
 * instance might display different stores, so the errored state resets.
 */
export function StoreLogo({ store, size = 'md', className = '' }) {
  const [errored, setErrored] = useState(false);

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

  const url = !errored
    ? store?.logo_url ||
      (store?.domain ? `https://logo.clearbit.com/${store.domain}` : null)
    : null;

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
      onError={() => setErrored(true)}
      className={cn(
        sizeClass,
        'rounded-lg bg-white object-contain p-1 shrink-0 border',
        className
      )}
    />
  );
}

export default StoreLogo;
