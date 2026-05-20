/**
 * FilterChip — small pill button used by Compare, Hot Deals, and any
 * other surface that needs an inline "All / Option1 / Option2" toggle.
 * Active state uses brand primary; inactive uses muted neutral.
 */
import { cn } from '@/lib/utils';

export function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default FilterChip;
