import { en } from './en';
import { he } from './he';
import type { Translations } from './types';

export type Language = 'en' | 'he';

const translations: Record<Language, Translations> = { en, he };

// Default language
const DEFAULT_LANGUAGE: Language = 'en';

/**
 * Simple translation hook
 * Usage: const { t } = useTranslation();
 *        <h1>{t.hero.title}</h1>
 */
export const useTranslation = (lang: Language = DEFAULT_LANGUAGE) => {
  const t = translations[lang];

  return {
    t,
    lang,
    // Helper for dynamic key access: translate('hero.title')
    translate: (key: string): string => {
      const keys = key.split('.');
      let result: unknown = t;
      for (const k of keys) {
        result = (result as Record<string, unknown>)?.[k];
      }
      return (result as string) ?? key;
    },
  };
};

// Re-export types and translations
export type { Translations } from './types';
export { en } from './en';
export { he } from './he';
