import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { loadUserPrefs } from '@/lib/userPrefs';
import en from '@/locales/en.json';
import ptBR from '@/locales/pt-BR.json';

/**
 * Tiny i18n system — zero external deps. Provides:
 *   <I18nProvider>     — wraps the app, loads the saved language pref
 *   useTranslation()   — returns { t, language, setLanguage }
 *   t('a.b.c')         — dot-path lookup with EN fallback when missing
 *   t('a.b', { name }) — basic `{{var}}` interpolation
 *
 * Supported now: en, pt-BR. Other codes save the preference but fall
 * back to English for now.
 */

const BUNDLES = {
  en,
  'pt-BR': ptBR,
};

const I18nContext = createContext(null);

function resolveKey(bundle, key) {
  if (!bundle) return undefined;
  return key.split('.').reduce((acc, part) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    return acc[part];
  }, bundle);
}

function interpolate(template, params) {
  if (typeof template !== 'string') return template;
  if (!params) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) =>
    params[k] != null ? String(params[k]) : `{{${k}}}`
  );
}

export function I18nProvider({ children }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState('en');

  // Sync with saved user pref when the user changes (or boots logged-out)
  useEffect(() => {
    let alive = true;
    loadUserPrefs(user?.id)
      .then((p) => {
        if (alive && p?.language) setLanguageState(p.language);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [user?.id]);

  // Update <html lang> for screen readers / SEO
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback(
    (key, params) => {
      const primary = BUNDLES[language];
      const fallback = BUNDLES.en;
      const value = resolveKey(primary, key);
      if (value != null) return interpolate(value, params);
      const fallbackValue = resolveKey(fallback, key);
      if (fallbackValue != null) return interpolate(fallbackValue, params);
      return key; // last-resort: surface the key so missing strings are obvious
    },
    [language]
  );

  const value = useMemo(
    () => ({ t, language, setLanguage: setLanguageState }),
    [t, language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback: if a component renders outside the provider (e.g.
    // during a hot reload boundary), still return a usable t().
    return {
      t: (key, params) => {
        const v = resolveKey(BUNDLES.en, key);
        return v != null ? interpolate(v, params) : key;
      },
      language: 'en',
      setLanguage: () => {},
    };
  }
  return ctx;
}
