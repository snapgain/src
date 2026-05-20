// PasswordInput — reusable password field with:
//   - Show/hide toggle (eye icon) so users can read what they typed.
//   - Live policy checks (8+ chars, upper, lower, special) shown
//     under the input when `showValidation` is on.
//   - Match indicator vs another password field when `matchAgainst`
//     is provided (used by the "Confirm password" field).
//
// Used in:
//   - AuthForm signup (with validation + confirm)
//   - AuthForm login (just eye toggle)
//   - Reset / set-password flows (with validation + confirm)
//   - Settings → change password (same)

import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Single source of truth for the password policy.
export const PASSWORD_RULES = [
  { id: 'length',  test: (p) => p.length >= 8,             label: 'At least 8 characters' },
  { id: 'upper',   test: (p) => /[A-Z]/.test(p),           label: 'One uppercase letter (A-Z)' },
  { id: 'lower',   test: (p) => /[a-z]/.test(p),           label: 'One lowercase letter (a-z)' },
  { id: 'special', test: (p) => /[^A-Za-z0-9\s]/.test(p),  label: 'One special character (e.g. ! @ # ?)' },
];

export function isPasswordValid(p) {
  return PASSWORD_RULES.every((r) => r.test(p));
}

export function PasswordInput({
  id = 'password',
  label = 'Password',
  value,
  onChange,
  placeholder = '••••••••',
  required = true,
  autoComplete = 'current-password',
  showValidation = false,
  matchAgainst = null,
}) {
  const [visible, setVisible] = useState(false);
  const passes = PASSWORD_RULES.map((r) => r.test(value || ''));
  const matchesOther =
    matchAgainst !== null
      ? (value || '').length > 0 && value === matchAgainst
      : null;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showValidation && (value || '').length > 0 && (
        <ul className="space-y-1 text-xs">
          {PASSWORD_RULES.map((rule, i) => (
            <li
              key={rule.id}
              className={`flex items-center gap-1.5 ${
                passes[i] ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              {passes[i] ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{rule.label}</span>
            </li>
          ))}
        </ul>
      )}

      {matchAgainst !== null && (value || '').length > 0 && (
        <p
          className={`text-xs flex items-center gap-1.5 ${
            matchesOther ? 'text-green-600' : 'text-destructive'
          }`}
        >
          {matchesOther ? (
            <Check className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>
            {matchesOther ? 'Passwords match' : 'Passwords do not match'}
          </span>
        </p>
      )}
    </div>
  );
}

export default PasswordInput;
