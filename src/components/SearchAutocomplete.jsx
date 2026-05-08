import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStores } from '@/hooks/useCatalog';
import { StoreLogo } from '@/components/StoreLogo';
import { cn } from '@/lib/utils';

/**
 * SearchAutocomplete — search input with a live store dropdown.
 *
 * Behaviour:
 *   - As user types, shows up to 8 matching stores (substring on name).
 *   - ↑ / ↓ navigate the list, Enter opens the highlighted store.
 *   - Submitting without highlighting any item calls onSubmit(query)
 *     so the caller can still navigate to a search results page.
 *   - Esc / outside-click closes the dropdown.
 *
 * @param {object} props
 * @param {string} [props.initialValue]  prefill text in the input
 * @param {(query: string) => void} [props.onSubmit]  free-form submit handler
 * @param {string} [props.placeholder]
 * @param {boolean} [props.autoFocus]
 * @param {string} [props.size]   'lg' renders larger inputs (home hero)
 */
export function SearchAutocomplete({
  initialValue = '',
  onSubmit,
  placeholder = 'Search a store…',
  autoFocus = false,
  size = 'lg',
}) {
  const navigate = useNavigate();
  const { stores } = useStores();
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync controlled value with prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    const exact = [];
    const prefix = [];
    const contains = [];
    for (const s of stores) {
      const name = s.name.toLowerCase();
      if (name === q) exact.push(s);
      else if (name.startsWith(q)) prefix.push(s);
      else if (name.includes(q)) contains.push(s);
    }
    return [...exact, ...prefix, ...contains].slice(0, 8);
  }, [value, stores]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const showDropdown = open && matches.length > 0;

  const submit = (e) => {
    e?.preventDefault?.();
    if (highlighted >= 0 && matches[highlighted]) {
      navigate(`/store/${matches[highlighted].slug}`);
      setOpen(false);
      return;
    }
    if (onSubmit) onSubmit(value.trim());
  };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => Math.min(h + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlighted(-1);
    } else if (e.key === 'Enter') {
      // submit handled by form
    }
  };

  const inputHeight = size === 'lg' ? 'h-12' : 'h-10';

  return (
    <form
      ref={containerRef}
      onSubmit={submit}
      className="relative flex flex-col sm:flex-row gap-3 max-w-2xl"
      role="search"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setHighlighted(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn('pl-10 text-base', inputHeight)}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="search-suggestions"
        />

        {showDropdown && (
          <ul
            id="search-suggestions"
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-lg z-50 max-h-80 overflow-auto py-1"
          >
            {matches.map((store, i) => (
              <li key={store.id} role="option" aria-selected={i === highlighted}>
                <Link
                  to={`/store/${store.slug}`}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 transition-colors',
                    i === highlighted ? 'bg-muted' : 'hover:bg-muted/60'
                  )}
                >
                  <StoreLogo store={store} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{store.name}</div>
                    {store.category?.[0] && (
                      <div className="text-xs text-muted-foreground capitalize truncate">
                        {store.category[0]}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="submit" size={size === 'lg' ? 'lg' : 'default'} className={size === 'lg' ? 'h-12 px-6' : ''}>
        Search
      </Button>
    </form>
  );
}

export default SearchAutocomplete;
