import type { Locale } from '@/config/i18n';

// Type pour le dictionnaire
export interface Dictionary {
  meta: {
    siteName: string;
    siteDescription: string;
    titleTemplate: string;
    descriptionTemplate: string;
  };
  common: {
    home: string;
    allConverters: string;
    popularConversions: string;
    relatedConversions: string;
    supportedFormats: string;
    learnMore: string;
    backToHome: string;
    previousPage: string;
    pageNotFound: string;
    pageNotFoundDesc: string;
  };
  converter: {
    input: string;
    output: string;
    convert: string;
    converting: string;
    copy: string;
    copied: string;
    download: string;
    clear: string;
    loadExample: string;
    importFile: string;
    pasteHere: string;
    resultHere: string;
    conversionError: string;
    securityNotice: string;
    conversionSuccess: string;
    rows: string;
    copiedToClipboard: string;
    downloadStarted: string;
    fileLoaded: string;
    fileReadError: string;
    dropFile: string;
    dragDropHint: string;
    exampleLoaded: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    possibleConversions: string;
    instantProcessing: string;
    privacyFirst: string;
    chooseConversion: string;
    chooseConversionDesc: string;
    whyUseUs: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    allConversions: string;
  };
  formats: Record<string, { label: string; description: string }>;
  faq: {
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
    q5: string;
    a5: string;
  };
  seo: {
    h1Template: string;
    introTemplate: string;
    reverseConversion: string;
    convertReverse: string;
    useCasesTitle: string;
    benefitsTitle: string;
    technicalNoteTitle: string;
  };
  footer: {
    aboutText: string;
    info: string;
    privacyPolicy: string;
    termsOfService: string;
    contact: string;
    copyright: string;
    securityNote: string;
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./en.json').then((module) => module.default),
  fr: () => import('./fr.json').then((module) => module.default),
  es: () => import('./es.json').then((module) => module.default),
  de: () => import('./de.json').then((module) => module.default),
  pt: () => import('./pt.json').then((module) => module.default),
  it: () => import('./it.json').then((module) => module.default),
  nl: () => import('./nl.json').then((module) => module.default),
  sv: () => import('./sv.json').then((module) => module.default),
  da: () => import('./da.json').then((module) => module.default),
  no: () => import('./no.json').then((module) => module.default),
  fi: () => import('./fi.json').then((module) => module.default),
  pl: () => import('./pl.json').then((module) => module.default),
  tr: () => import('./tr.json').then((module) => module.default),
  id: () => import('./id.json').then((module) => module.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

// Fonction utilitaire pour remplacer les placeholders
export function t(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (str, [key, value]) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
    template
  );
}
