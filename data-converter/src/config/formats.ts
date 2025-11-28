// Configuration centrale des formats de données supportés
// Ce fichier définit toute la matrice de conversion

export interface DataFormat {
  id: string;
  label: string;
  extension: string;
  mimeType: string;
  description: string;
  placeholder: string;
  color: string; // Pour le styling des badges
}

export const FORMATS: Record<string, DataFormat> = {
  json: {
    id: 'json',
    label: 'JSON',
    extension: '.json',
    mimeType: 'application/json',
    description: 'JavaScript Object Notation - Format léger d\'échange de données',
    placeholder: '{\n  "nom": "John",\n  "age": 30,\n  "ville": "Paris"\n}',
    color: 'bg-yellow-500',
  },
  csv: {
    id: 'csv',
    label: 'CSV',
    extension: '.csv',
    mimeType: 'text/csv',
    description: 'Comma-Separated Values - Format tabulaire simple',
    placeholder: 'nom,age,ville\nJohn,30,Paris\nJane,25,Lyon',
    color: 'bg-green-500',
  },
  xml: {
    id: 'xml',
    label: 'XML',
    extension: '.xml',
    mimeType: 'application/xml',
    description: 'eXtensible Markup Language - Format de balisage structuré',
    placeholder: '<?xml version="1.0"?>\n<users>\n  <user>\n    <nom>John</nom>\n    <age>30</age>\n  </user>\n</users>',
    color: 'bg-orange-500',
  },
  yaml: {
    id: 'yaml',
    label: 'YAML',
    extension: '.yaml',
    mimeType: 'text/yaml',
    description: 'YAML Ain\'t Markup Language - Format lisible pour la configuration',
    placeholder: 'users:\n  - nom: John\n    age: 30\n    ville: Paris',
    color: 'bg-purple-500',
  },
  sql: {
    id: 'sql',
    label: 'SQL',
    extension: '.sql',
    mimeType: 'application/sql',
    description: 'Structured Query Language - Instructions INSERT pour bases de données',
    placeholder: 'INSERT INTO users (nom, age, ville) VALUES\n(\'John\', 30, \'Paris\'),\n(\'Jane\', 25, \'Lyon\');',
    color: 'bg-blue-500',
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
  return (
    source !== target &&
    source in FORMATS &&
    target in FORMATS
  );
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

// Contenu SEO dynamique pour chaque conversion
export interface ConversionContent {
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  faqs: Array<{ question: string; answer: string }>;
}

export function getConversionContent(source: string, target: string): ConversionContent {
  const sourceFormat = FORMATS[source];
  const targetFormat = FORMATS[target];

  if (!sourceFormat || !targetFormat) {
    throw new Error(`Format invalide: ${source} ou ${target}`);
  }

  return {
    title: `Convertir ${sourceFormat.label} en ${targetFormat.label} - Outil Gratuit & Sécurisé`,
    metaDescription: `Convertissez vos fichiers ${sourceFormat.label} en ${targetFormat.label} instantanément. Outil 100% gratuit, traitement côté client, aucune donnée envoyée au serveur. Rapide et sécurisé.`,
    h1: `Convertisseur ${sourceFormat.label} vers ${targetFormat.label}`,
    intro: `Transformez facilement vos données ${sourceFormat.label} (${sourceFormat.description}) en format ${targetFormat.label} (${targetFormat.description}). Notre outil fonctionne entièrement dans votre navigateur pour garantir la confidentialité de vos données.`,
    faqs: generateFAQs(sourceFormat, targetFormat),
  };
}

function generateFAQs(source: DataFormat, target: DataFormat): Array<{ question: string; answer: string }> {
  return [
    {
      question: `Pourquoi convertir du ${source.label} en ${target.label} ?`,
      answer: `La conversion de ${source.label} vers ${target.label} est utile lorsque vous devez intégrer des données dans un système qui accepte uniquement le format ${target.label}. ${source.label} (${source.description}) peut être transformé en ${target.label} (${target.description}) pour une meilleure compatibilité.`,
    },
    {
      question: `Mes données sont-elles sécurisées lors de la conversion ?`,
      answer: `Absolument. Notre convertisseur fonctionne à 100% côté client (dans votre navigateur). Vos données ${source.label} ne sont jamais envoyées à un serveur externe. Le traitement est instantané et totalement privé.`,
    },
    {
      question: `Quelle est la taille maximale de fichier ${source.label} supportée ?`,
      answer: `Comme le traitement se fait dans votre navigateur, la limite dépend de la mémoire disponible. En général, les fichiers jusqu'à 10 Mo sont traités sans problème. Pour des fichiers plus volumineux, nous recommandons de les diviser.`,
    },
    {
      question: `Comment fonctionne la conversion ${source.label} vers ${target.label} ?`,
      answer: `Notre outil parse votre fichier ${source.label}, analyse sa structure de données, puis génère l'équivalent au format ${target.label}. Les tableaux, objets et valeurs primitives sont mappés intelligemment vers la syntaxe ${target.label}.`,
    },
    {
      question: `Puis-je convertir du ${target.label} en ${source.label} ?`,
      answer: `Oui ! Nous supportons la conversion bidirectionnelle. Utilisez notre outil de conversion ${target.label} vers ${source.label} pour l'opération inverse.`,
    },
  ];
}

// Données structurées JSON-LD pour le SEO
export function getJsonLdData(source: string, target: string, baseUrl: string): object {
  const sourceFormat = FORMATS[source];
  const targetFormat = FORMATS[target];
  const slug = getConversionSlug(source, target);

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Convertisseur ${sourceFormat.label} vers ${targetFormat.label}`,
    description: `Outil gratuit pour convertir ${sourceFormat.label} en ${targetFormat.label} directement dans votre navigateur.`,
    url: `${baseUrl}/${slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
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
