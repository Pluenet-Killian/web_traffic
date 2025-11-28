// Configuration i18n centralisée
export const locales = ['en', 'fr', 'es', 'de', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  pt: 'Português',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
  de: '🇩🇪',
  pt: '🇧🇷',
};

// Mapping pour les balises HTML lang
export const localeHtmlLang: Record<Locale, string> = {
  en: 'en',
  fr: 'fr',
  es: 'es',
  de: 'de',
  pt: 'pt-BR',
};

// Mapping pour OpenGraph locale
export const localeOG: Record<Locale, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  de: 'de_DE',
  pt: 'pt_BR',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
