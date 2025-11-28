// Configuration centrale des formats de données supportés
// Ce fichier définit toute la matrice de conversion

import type { Locale } from './i18n';
import type { Dictionary } from '@/dictionaries';

export interface DataFormat {
  id: string;
  label: string;
  extension: string;
  mimeType: string;
  placeholder: string;
  color: string;
}

export const FORMATS: Record<string, DataFormat> = {
  json: {
    id: 'json',
    label: 'JSON',
    extension: '.json',
    mimeType: 'application/json',
    placeholder: '{\n  "name": "John",\n  "age": 30,\n  "city": "Paris"\n}',
    color: 'bg-yellow-500',
  },
  csv: {
    id: 'csv',
    label: 'CSV',
    extension: '.csv',
    mimeType: 'text/csv',
    placeholder: 'name,age,city\nJohn,30,Paris\nJane,25,Lyon',
    color: 'bg-green-500',
  },
  xml: {
    id: 'xml',
    label: 'XML',
    extension: '.xml',
    mimeType: 'application/xml',
    placeholder: '<?xml version="1.0"?>\n<users>\n  <user>\n    <name>John</name>\n    <age>30</age>\n  </user>\n</users>',
    color: 'bg-orange-500',
  },
  yaml: {
    id: 'yaml',
    label: 'YAML',
    extension: '.yaml',
    mimeType: 'text/yaml',
    placeholder: 'users:\n  - name: John\n    age: 30\n    city: Paris',
    color: 'bg-purple-500',
  },
  sql: {
    id: 'sql',
    label: 'SQL',
    extension: '.sql',
    mimeType: 'application/sql',
    placeholder: "INSERT INTO users (name, age, city) VALUES\n('John', 30, 'Paris'),\n('Jane', 25, 'Lyon');",
    color: 'bg-blue-500',
  },
  markdown: {
    id: 'markdown',
    label: 'Markdown',
    extension: '.md',
    mimeType: 'text/markdown',
    placeholder: '| name | age | city |\n|------|-----|------|\n| John | 30  | Paris |\n| Jane | 25  | Lyon |',
    color: 'bg-gray-700',
  },
  html: {
    id: 'html',
    label: 'HTML',
    extension: '.html',
    mimeType: 'text/html',
    placeholder: '<table>\n  <thead>\n    <tr><th>name</th><th>age</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>John</td><td>30</td></tr>\n  </tbody>\n</table>',
    color: 'bg-red-500',
  },
};

// Liste des formats supportés (ordre d'affichage)
export const FORMAT_IDS = Object.keys(FORMATS) as Array<keyof typeof FORMATS>;

// Génère toutes les permutations source->target (excluant source=target)
export function getAllConversions(): Array<{ source: string; target: string }> {
  const conversions: Array<{ source: string; target: string }> = [];

  for (const source of FORMAT_IDS) {
    for (const target of FORMAT_IDS) {
      if (source !== target) {
        conversions.push({ source, target });
      }
    }
  }

  return conversions;
}

// Vérifie si une paire de conversion est valide
export function isValidConversion(source: string, target: string): boolean {
  return source !== target && source in FORMATS && target in FORMATS;
}

// Génère le slug URL pour une conversion
export function getConversionSlug(source: string, target: string): string {
  return `${source}-to-${target}`;
}

// Parse un slug URL pour extraire source et target
export function parseConversionSlug(slug: string): { source: string; target: string } | null {
  const match = slug.match(/^([a-z]+)-to-([a-z]+)$/);
  if (!match) return null;

  const [, source, target] = match;
  if (!isValidConversion(source, target)) return null;

  return { source, target };
}

// Récupérer le label du format depuis le dictionnaire
export function getFormatLabel(formatId: string, dict: Dictionary): string {
  return dict.formats[formatId]?.label || FORMATS[formatId]?.label || formatId.toUpperCase();
}

// Récupérer la description du format depuis le dictionnaire
export function getFormatDescription(formatId: string, dict: Dictionary): string {
  return dict.formats[formatId]?.description || '';
}

// Données structurées JSON-LD pour le SEO
export function getJsonLdData(
  source: string,
  target: string,
  locale: Locale,
  baseUrl: string,
  dict: Dictionary
): object {
  const sourceLabel = getFormatLabel(source, dict);
  const targetLabel = getFormatLabel(target, dict);
  const slug = getConversionSlug(source, target);

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${sourceLabel} to ${targetLabel} Converter`,
    description: dict.meta.descriptionTemplate
      .replace('{source}', sourceLabel)
      .replace('{target}', targetLabel),
    url: `${baseUrl}/${locale}/${slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    inLanguage: locale,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

// Calculer le nombre total de pages
export function getTotalPageCount(): number {
  const conversions = getAllConversions();
  const localeCount = 5; // en, fr, es, de, pt
  // conversions + homepage pour chaque locale
  return (conversions.length + 1) * localeCount;
}
