import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Switch — accessible toggle built on a hidden native checkbox.
 * Self-contained (no Radix dependency) so the offline build works
 * even without `@radix-ui/react-switch` installed.
 *
 * Usage:
 *   <Switch checked={value} onCheckedChange={setValue} id="…" />
 */
const Switch = React.forwardRef(
  (
    { className, checked, defaultChecked, onCheckedChange, id, disabled, ...props },
    ref
  ) => {
    const [internal, setInternal] = React.useState(!!defaultChecked);
    const isControlled = checked !== undefined;
    const isOn = isControlled ? !!checked : internal;

    const handleChange = (e) => {
      const next = e.target.checked;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };

    return (
      <label
        htmlFor={id}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors',
          isOn ? 'bg-primary' : 'bg-input',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <input
          id={id}
          ref={ref}
          type="checkbox"
          role="switch"
          checked={isOn}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-background shadow ring-0 transition-transform',
            isOn ? 'translate-x-[22px]' : 'translate-x-[2px]'
          )}
        />
        <span className="absolute inset-0 rounded-full ring-2 ring-transparent peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background pointer-events-none" />
      </label>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
