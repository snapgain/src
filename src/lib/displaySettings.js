/**
 * Apply display / accessibility preferences to <html>.
 *
 * Idempotent — call any time prefs change; previous classes are cleared
 * first so toggling values works correctly.
 *
 * Options:
 * - theme:        'light' | 'dark' | 'auto' | 'cream' | 'yellow' | 'peach' | 'calm'
 * - fontSize:     'sm' | 'md' | 'lg'
 * - fontFamily:   'default' | 'accessible'   (accessible = Lexend, designed for readability)
 * - lineSpacing:  'normal' | 'wide'          (wide ≈ 1.75 line-height, dyslexia-friendly)
 * - reduceMotion: boolean
 * - highContrast: boolean
 */
const THEME_CLASSES = [
  'dark',
  'theme-cream',
  'theme-yellow',
  'theme-peach',
  'theme-calm',
];

export function applyDisplaySettings({
  theme = 'light',
  fontSize = 'md',
  fontFamily = 'default',
  lineSpacing = 'normal',
  reduceMotion = false,
  highContrast = false,
} = {}) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;

  // ─── Theme ────────────────────────────────────────────────────
  // Clear any previously-set theme class then apply the new one.
  html.classList.remove(...THEME_CLASSES);

  if (theme === 'dark') {
    html.classList.add('dark');
  } else if (theme === 'auto') {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) html.classList.add('dark');
  } else if (theme === 'cream') {
    html.classList.add('theme-cream');
  } else if (theme === 'yellow') {
    html.classList.add('theme-yellow');
  } else if (theme === 'peach') {
    html.classList.add('theme-peach');
  } else if (theme === 'calm') {
    html.classList.add('theme-calm');
  }
  // 'light' = no extra class needed (defaults from :root apply)

  // ─── Font size ────────────────────────────────────────────────
  html.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
  html.classList.add(`font-scale-${fontSize}`);

  // ─── Font family ──────────────────────────────────────────────
  html.classList.toggle('font-family-accessible', fontFamily === 'accessible');

  // ─── Line spacing ─────────────────────────────────────────────
  html.classList.toggle('line-spacing-wide', lineSpacing === 'wide');

  // ─── Motion + contrast ────────────────────────────────────────
  html.classList.toggle('reduce-motion', !!reduceMotion);
  html.classList.toggle('high-contrast', !!highContrast);
}

/**
 * Watch the OS color-scheme so `theme: 'auto'` stays in sync without
 * a page refresh. Returns an unsubscribe.
 */
export function watchSystemTheme(onChange) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => onChange(mq.matches);
  mq.addEventListener?.('change', handler);
  return () => mq.removeEventListener?.('change', handler);
}
