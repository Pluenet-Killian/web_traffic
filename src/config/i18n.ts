// Configuration i18n centralisée
export const locales = ['en', 'fr', 'es', 'de', 'pt', 'it', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'tr', 'id'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  pt: 'Português',
  it: 'Italiano',
  nl: 'Nederlands',
  sv: 'Svenska',
  da: 'Dansk',
  no: 'Norsk',
  fi: 'Suomi',
  pl: 'Polski',
  tr: 'Türkçe',
  id: 'Indonesia',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
  de: '🇩🇪',
  pt: '🇧🇷',
  it: '🇮🇹',
  nl: '🇳🇱',
  sv: '🇸🇪',
  da: '🇩🇰',
  no: '🇳🇴',
  fi: '🇫🇮',
  pl: '🇵🇱',
  tr: '🇹🇷',
  id: '🇮🇩',
};

// Mapping pour les balises HTML lang
export const localeHtmlLang: Record<Locale, string> = {
  en: 'en',
  fr: 'fr',
  es: 'es',
  de: 'de',
  pt: 'pt-BR',
  it: 'it',
  nl: 'nl',
  sv: 'sv',
  da: 'da',
  no: 'no',
  fi: 'fi',
  pl: 'pl',
  tr: 'tr',
  id: 'id',
};

// Mapping pour OpenGraph locale
export const localeOG: Record<Locale, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  de: 'de_DE',
  pt: 'pt_BR',
  it: 'it_IT',
  nl: 'nl_NL',
  sv: 'sv_SE',
  da: 'da_DK',
  no: 'no_NO',
  fi: 'fi_FI',
  pl: 'pl_PL',
  tr: 'tr_TR',
  id: 'id_ID',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
