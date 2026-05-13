import React, { useMemo, useState } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PillMultiSelect — selected options shown as removable pills, with a
 * dropdown to pick from a catalog. Catalog-only (no free text), as
 * requested. Designed to match the SnapGain mockups.
 *
 * Props:
 *   options:        [{ id, label, sublabel? }]
 *   selectedIds:    Set<id>
 *   onAdd(id):      called when user picks an option
 *   onRemove(id):   called when user clicks the × on a pill
 *   placeholder:    string for the closed dropdown
 *   emptyHint:      string shown when no options remain
 *   busy:           disables interaction during async ops
 */
export function PillMultiSelect({
  options,
  selectedIds,
  onAdd,
  onRemove,
  placeholder = 'Select…',
  emptyHint = 'Nothing left to add',
  busy = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(
    () => options.filter((o) => selectedIds.has(o.id)),
    [options, selectedIds]
  );

  const available = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((o) => {
      if (selectedIds.has(o.id)) return false;
      if (!q) return true;
      return (
        o.label.toLowerCase().includes(q) ||
        (o.sublabel && o.sublabel.toLowerCase().includes(q))
      );
    });
  }, [options, selectedIds, query]);

  return (
    <div className="space-y-2">
      {/* Selected pills */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((o) => (
            <span
              key={o.id}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium"
            >
              {o.label}
              <button
                type="button"
                onClick={() => !busy && onRemove(o.id)}
                disabled={busy}
                className="rounded-full w-5 h-5 inline-flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
                aria-label={`Remove ${o.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={busy}
          className={cn(
            'w-full inline-flex items-center justify-between px-3 py-2.5 rounded-xl border bg-background text-sm transition-colors',
            'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40',
            open && 'border-primary',
            busy && 'opacity-60 cursor-not-allowed'
          )}
          aria-expanded={open}
        >
          <span className="text-muted-foreground">{placeholder}</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform text-muted-foreground',
              open && 'rotate-180'
            )}
          />
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-full rounded-xl border bg-popover shadow-lg overflow-hidden">
            {/* Search */}
            <div className="border-b px-3 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Options */}
            <ul className="max-h-64 overflow-y-auto py-1">
              {available.length === 0 ? (
                <li className="px-3 py-3 text-sm text-muted-foreground text-center">
                  {options.length === 0 ? 'Loading…' : emptyHint}
                </li>
              ) : (
                available.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onAdd(o.id);
                        setQuery('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{o.label}</span>
                      {o.sublabel && (
                        <span className="text-xs text-muted-foreground">
                          {o.sublabel}
                        </span>
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* Click outside to close */}
        {open && (
          <div
            className="fixed inset-0 z-20"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export default PillMultiSelect;
