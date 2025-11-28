// Wiki/Glossary Configuration - SEO Informational Pages ("What is a X file?")

// Note: Locale type imported for potential future use
// import type { Locale } from './i18n';

export interface FormatDefinition {
  id: string;
  slug: string;
  extension: string;
  category: 'data' | 'document' | 'media' | 'image';
  icon: string; // Lucide icon name
  color: string;
}

export interface FormatContent {
  title: string;
  metaDescription: string;
  fullName: string;
  intro: string;
  technicalDetails: {
    developer: string;
    firstReleased: string;
    mimeType: string;
    fileExtension: string;
    type: string;
  };
  whatIs: string;
  characteristics: string[];
  howToOpen: {
    description: string;
    programs: string[];
  };
  commonUses: string[];
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  relatedFormats: string[];
}

// All formats with wiki pages
export const WIKI_FORMATS: Record<string, FormatDefinition> = {
  // Data formats
  json: {
    id: 'json',
    slug: 'json',
    extension: '.json',
    category: 'data',
    icon: 'Braces',
    color: 'bg-yellow-500',
  },
  csv: {
    id: 'csv',
    slug: 'csv',
    extension: '.csv',
    category: 'data',
    icon: 'Table',
    color: 'bg-green-500',
  },
  xml: {
    id: 'xml',
    slug: 'xml',
    extension: '.xml',
    category: 'data',
    icon: 'Code',
    color: 'bg-orange-500',
  },
  yaml: {
    id: 'yaml',
    slug: 'yaml',
    extension: '.yaml',
    category: 'data',
    icon: 'FileCode',
    color: 'bg-purple-500',
  },
  sql: {
    id: 'sql',
    slug: 'sql',
    extension: '.sql',
    category: 'data',
    icon: 'Database',
    color: 'bg-blue-500',
  },
  // Document formats
  pdf: {
    id: 'pdf',
    slug: 'pdf',
    extension: '.pdf',
    category: 'document',
    icon: 'FileText',
    color: 'bg-red-500',
  },
  markdown: {
    id: 'markdown',
    slug: 'markdown',
    extension: '.md',
    category: 'data',
    icon: 'FileText',
    color: 'bg-gray-700',
  },
  html: {
    id: 'html',
    slug: 'html',
    extension: '.html',
    category: 'data',
    icon: 'Globe',
    color: 'bg-orange-600',
  },
  // Media formats
  mp4: {
    id: 'mp4',
    slug: 'mp4',
    extension: '.mp4',
    category: 'media',
    icon: 'Video',
    color: 'bg-pink-500',
  },
  mp3: {
    id: 'mp3',
    slug: 'mp3',
    extension: '.mp3',
    category: 'media',
    icon: 'Music',
    color: 'bg-cyan-500',
  },
  gif: {
    id: 'gif',
    slug: 'gif',
    extension: '.gif',
    category: 'image',
    icon: 'Image',
    color: 'bg-indigo-500',
  },
  mov: {
    id: 'mov',
    slug: 'mov',
    extension: '.mov',
    category: 'media',
    icon: 'Film',
    color: 'bg-slate-600',
  },
  webm: {
    id: 'webm',
    slug: 'webm',
    extension: '.webm',
    category: 'media',
    icon: 'Video',
    color: 'bg-teal-500',
  },
  // Image formats
  png: {
    id: 'png',
    slug: 'png',
    extension: '.png',
    category: 'image',
    icon: 'Image',
    color: 'bg-sky-500',
  },
  jpg: {
    id: 'jpg',
    slug: 'jpg',
    extension: '.jpg',
    category: 'image',
    icon: 'Image',
    color: 'bg-amber-500',
  },
  webp: {
    id: 'webp',
    slug: 'webp',
    extension: '.webp',
    category: 'image',
    icon: 'Image',
    color: 'bg-lime-500',
  },
};

export const WIKI_FORMAT_IDS = Object.keys(WIKI_FORMATS);

export function getWikiFormatBySlug(slug: string): FormatDefinition | undefined {
  return WIKI_FORMATS[slug];
}

export function getAllWikiFormats(): FormatDefinition[] {
  return Object.values(WIKI_FORMATS);
}

export function getWikiFormatsByCategory(category: FormatDefinition['category']): FormatDefinition[] {
  return getAllWikiFormats().filter((format) => format.category === category);
}

// Content for each format in each language
export const WIKI_CONTENT: Record<string, Record<string, FormatContent>> = {
  json: {
    en: {
      title: 'What is a JSON File? Complete Guide',
      metaDescription: 'Learn what JSON files are, how to open them, and when to use them. Complete guide to JavaScript Object Notation format.',
      fullName: 'JavaScript Object Notation',
      intro: 'JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format that is easy for humans to read and write, and easy for machines to parse and generate.',
      technicalDetails: {
        developer: 'Douglas Crockford',
        firstReleased: '2001',
        mimeType: 'application/json',
        fileExtension: '.json',
        type: 'Data interchange format',
      },
      whatIs: `JSON is a text format for storing and transporting data. It originated from JavaScript but is now language-independent and used across virtually all programming languages.

JSON represents data as key-value pairs and ordered lists, making it intuitive to understand. Its simplicity and flexibility have made it the de facto standard for web APIs and configuration files.`,
      characteristics: [
        'Human-readable text format',
        'Lightweight and minimal syntax',
        'Language-independent',
        'Supports nested data structures',
        'Native JavaScript support',
        'UTF-8 encoding by default',
      ],
      howToOpen: {
        description: 'JSON files can be opened with any text editor, but specialized tools provide syntax highlighting and validation:',
        programs: [
          'VS Code (free, cross-platform)',
          'Notepad++ (free, Windows)',
          'Sublime Text (cross-platform)',
          'Any web browser (drag & drop)',
          'Online JSON viewers',
        ],
      },
      commonUses: [
        'Web API responses and requests',
        'Configuration files for applications',
        'Data storage in NoSQL databases',
        'Package management (package.json)',
        'Data exchange between services',
      ],
      prosAndCons: {
        pros: [
          'Easy to read and write',
          'Widely supported',
          'Compact compared to XML',
          'Fast parsing',
        ],
        cons: [
          'No comments allowed',
          'No date type (uses strings)',
          'No schema validation built-in',
          'Limited data types',
        ],
      },
      ctaTitle: 'Need to Convert JSON?',
      ctaDescription: 'Convert your JSON files to CSV, XML, YAML, and more formats instantly.',
      ctaButtonText: 'Convert JSON Now',
      relatedFormats: ['xml', 'yaml', 'csv'],
    },
    fr: {
      title: 'Qu\'est-ce qu\'un fichier JSON ? Guide Complet',
      metaDescription: 'Découvrez ce que sont les fichiers JSON, comment les ouvrir et quand les utiliser. Guide complet du format JavaScript Object Notation.',
      fullName: 'JavaScript Object Notation',
      intro: 'JSON (JavaScript Object Notation) est un format d\'échange de données léger, basé sur du texte, facile à lire et écrire pour les humains, et facile à analyser et générer pour les machines.',
      technicalDetails: {
        developer: 'Douglas Crockford',
        firstReleased: '2001',
        mimeType: 'application/json',
        fileExtension: '.json',
        type: 'Format d\'échange de données',
      },
      whatIs: `JSON est un format texte pour stocker et transporter des données. Il est né de JavaScript mais est maintenant indépendant du langage et utilisé dans pratiquement tous les langages de programmation.

JSON représente les données sous forme de paires clé-valeur et de listes ordonnées, ce qui le rend intuitif à comprendre. Sa simplicité et sa flexibilité en ont fait le standard de facto pour les APIs web et les fichiers de configuration.`,
      characteristics: [
        'Format texte lisible par l\'humain',
        'Léger et syntaxe minimale',
        'Indépendant du langage',
        'Supporte les structures imbriquées',
        'Support natif JavaScript',
        'Encodage UTF-8 par défaut',
      ],
      howToOpen: {
        description: 'Les fichiers JSON peuvent être ouverts avec n\'importe quel éditeur de texte, mais des outils spécialisés offrent la coloration syntaxique et la validation :',
        programs: [
          'VS Code (gratuit, multiplateforme)',
          'Notepad++ (gratuit, Windows)',
          'Sublime Text (multiplateforme)',
          'N\'importe quel navigateur web (glisser-déposer)',
          'Visualiseurs JSON en ligne',
        ],
      },
      commonUses: [
        'Réponses et requêtes d\'APIs web',
        'Fichiers de configuration d\'applications',
        'Stockage de données dans les bases NoSQL',
        'Gestion de packages (package.json)',
        'Échange de données entre services',
      ],
      prosAndCons: {
        pros: [
          'Facile à lire et écrire',
          'Largement supporté',
          'Compact comparé à XML',
          'Parsing rapide',
        ],
        cons: [
          'Pas de commentaires autorisés',
          'Pas de type date (utilise des chaînes)',
          'Pas de validation de schéma intégrée',
          'Types de données limités',
        ],
      },
      ctaTitle: 'Besoin de Convertir du JSON ?',
      ctaDescription: 'Convertissez vos fichiers JSON en CSV, XML, YAML et plus de formats instantanément.',
      ctaButtonText: 'Convertir JSON',
      relatedFormats: ['xml', 'yaml', 'csv'],
    },
  },
  csv: {
    en: {
      title: 'What is a CSV File? Complete Guide',
      metaDescription: 'Learn what CSV files are, how to open them in Excel, and when to use them. Complete guide to Comma-Separated Values format.',
      fullName: 'Comma-Separated Values',
      intro: 'CSV (Comma-Separated Values) is a simple file format used to store tabular data, such as spreadsheets or databases. Each line represents a data record, with fields separated by commas.',
      technicalDetails: {
        developer: 'Various (standardized by RFC 4180)',
        firstReleased: '1972 (early implementations)',
        mimeType: 'text/csv',
        fileExtension: '.csv',
        type: 'Tabular data format',
      },
      whatIs: `CSV is one of the oldest and most widely used formats for data exchange. Its simplicity makes it universally compatible - virtually every spreadsheet application, database, and programming language can read and write CSV files.

Despite its name, CSV files can use different delimiters (semicolons, tabs) depending on regional settings. This flexibility, while useful, can sometimes cause compatibility issues.`,
      characteristics: [
        'Plain text format',
        'One record per line',
        'Fields separated by delimiter',
        'Optional header row',
        'Universal compatibility',
        'Human-readable',
      ],
      howToOpen: {
        description: 'CSV files can be opened with spreadsheet applications or text editors:',
        programs: [
          'Microsoft Excel',
          'Google Sheets (free)',
          'LibreOffice Calc (free)',
          'Apple Numbers',
          'Any text editor',
        ],
      },
      commonUses: [
        'Exporting data from databases',
        'Importing contacts to email clients',
        'Data analysis and statistics',
        'Bank statement exports',
        'E-commerce product catalogs',
      ],
      prosAndCons: {
        pros: [
          'Universal compatibility',
          'Simple and lightweight',
          'Human-readable',
          'Easy to generate',
        ],
        cons: [
          'No data type information',
          'No standard for encoding',
          'Delimiter conflicts possible',
          'No support for hierarchical data',
        ],
      },
      ctaTitle: 'Need to Convert CSV?',
      ctaDescription: 'Convert your CSV files to JSON, XML, SQL, and more formats instantly.',
      ctaButtonText: 'Convert CSV Now',
      relatedFormats: ['json', 'xml', 'sql'],
    },
    fr: {
      title: 'Qu\'est-ce qu\'un fichier CSV ? Guide Complet',
      metaDescription: 'Découvrez ce que sont les fichiers CSV, comment les ouvrir dans Excel, et quand les utiliser. Guide complet du format Comma-Separated Values.',
      fullName: 'Comma-Separated Values (Valeurs Séparées par des Virgules)',
      intro: 'CSV (Comma-Separated Values) est un format de fichier simple utilisé pour stocker des données tabulaires, comme des feuilles de calcul ou des bases de données. Chaque ligne représente un enregistrement, avec des champs séparés par des virgules.',
      technicalDetails: {
        developer: 'Divers (standardisé par RFC 4180)',
        firstReleased: '1972 (premières implémentations)',
        mimeType: 'text/csv',
        fileExtension: '.csv',
        type: 'Format de données tabulaires',
      },
      whatIs: `Le CSV est l'un des formats les plus anciens et les plus utilisés pour l'échange de données. Sa simplicité le rend universellement compatible - pratiquement toute application tableur, base de données et langage de programmation peut lire et écrire des fichiers CSV.

Malgré son nom, les fichiers CSV peuvent utiliser différents délimiteurs (point-virgule, tabulation) selon les paramètres régionaux. Cette flexibilité, bien qu'utile, peut parfois causer des problèmes de compatibilité.`,
      characteristics: [
        'Format texte brut',
        'Un enregistrement par ligne',
        'Champs séparés par délimiteur',
        'Ligne d\'en-tête optionnelle',
        'Compatibilité universelle',
        'Lisible par l\'humain',
      ],
      howToOpen: {
        description: 'Les fichiers CSV peuvent être ouverts avec des tableurs ou des éditeurs de texte :',
        programs: [
          'Microsoft Excel',
          'Google Sheets (gratuit)',
          'LibreOffice Calc (gratuit)',
          'Apple Numbers',
          'N\'importe quel éditeur de texte',
        ],
      },
      commonUses: [
        'Export de données depuis des bases de données',
        'Import de contacts dans les clients email',
        'Analyse de données et statistiques',
        'Exports de relevés bancaires',
        'Catalogues de produits e-commerce',
      ],
      prosAndCons: {
        pros: [
          'Compatibilité universelle',
          'Simple et léger',
          'Lisible par l\'humain',
          'Facile à générer',
        ],
        cons: [
          'Pas d\'information sur les types de données',
          'Pas de standard pour l\'encodage',
          'Conflits de délimiteurs possibles',
          'Pas de support pour données hiérarchiques',
        ],
      },
      ctaTitle: 'Besoin de Convertir du CSV ?',
      ctaDescription: 'Convertissez vos fichiers CSV en JSON, XML, SQL et plus de formats instantanément.',
      ctaButtonText: 'Convertir CSV',
      relatedFormats: ['json', 'xml', 'sql'],
    },
  },
  pdf: {
    en: {
      title: 'What is a PDF File? Complete Guide',
      metaDescription: 'Learn what PDF files are, how to open and edit them, and why they\'re the standard for document sharing. Complete PDF guide.',
      fullName: 'Portable Document Format',
      intro: 'PDF (Portable Document Format) is a file format developed by Adobe to present documents consistently across all devices and platforms, preserving fonts, images, and layout.',
      technicalDetails: {
        developer: 'Adobe Systems',
        firstReleased: '1993',
        mimeType: 'application/pdf',
        fileExtension: '.pdf',
        type: 'Document format',
      },
      whatIs: `PDF was created to solve a fundamental problem: sharing documents that look the same regardless of the software, hardware, or operating system used to view them.

Today, PDF is an open standard (ISO 32000) and the universal format for official documents, contracts, manuals, and any content that needs to maintain its exact appearance.`,
      characteristics: [
        'Platform-independent',
        'Preserves exact formatting',
        'Supports images, fonts, vectors',
        'Can include interactive forms',
        'Supports digital signatures',
        'Searchable text (when not scanned)',
      ],
      howToOpen: {
        description: 'PDFs can be opened with many free applications:',
        programs: [
          'Adobe Acrobat Reader (free)',
          'Web browsers (Chrome, Firefox, Edge)',
          'Preview (Mac)',
          'Foxit Reader (free)',
          'SumatraPDF (free, Windows)',
        ],
      },
      commonUses: [
        'Official documents and contracts',
        'Ebooks and manuals',
        'Invoices and receipts',
        'Print-ready designs',
        'Government forms',
      ],
      prosAndCons: {
        pros: [
          'Consistent appearance everywhere',
          'Widely supported',
          'Can be secured and signed',
          'Compact file size',
        ],
        cons: [
          'Difficult to edit without special software',
          'Not ideal for responsive content',
          'Can be large with many images',
          'Accessibility can be limited',
        ],
      },
      ctaTitle: 'Need to Work with PDFs?',
      ctaDescription: 'Use our free PDF tools to add dark mode, flatten forms, or secure your documents.',
      ctaButtonText: 'Try PDF Tools',
      relatedFormats: ['html', 'markdown'],
    },
    fr: {
      title: 'Qu\'est-ce qu\'un fichier PDF ? Guide Complet',
      metaDescription: 'Découvrez ce que sont les fichiers PDF, comment les ouvrir et les modifier, et pourquoi ils sont le standard pour le partage de documents.',
      fullName: 'Portable Document Format (Format de Document Portable)',
      intro: 'Le PDF (Portable Document Format) est un format de fichier développé par Adobe pour présenter des documents de manière cohérente sur tous les appareils et plateformes, en préservant les polices, images et mise en page.',
      technicalDetails: {
        developer: 'Adobe Systems',
        firstReleased: '1993',
        mimeType: 'application/pdf',
        fileExtension: '.pdf',
        type: 'Format de document',
      },
      whatIs: `Le PDF a été créé pour résoudre un problème fondamental : partager des documents qui ont la même apparence quel que soit le logiciel, le matériel ou le système d'exploitation utilisé pour les visualiser.

Aujourd'hui, le PDF est un standard ouvert (ISO 32000) et le format universel pour les documents officiels, contrats, manuels, et tout contenu qui doit conserver son apparence exacte.`,
      characteristics: [
        'Indépendant de la plateforme',
        'Préserve le formatage exact',
        'Supporte images, polices, vecteurs',
        'Peut inclure des formulaires interactifs',
        'Supporte les signatures numériques',
        'Texte recherchable (si non scanné)',
      ],
      howToOpen: {
        description: 'Les PDFs peuvent être ouverts avec de nombreuses applications gratuites :',
        programs: [
          'Adobe Acrobat Reader (gratuit)',
          'Navigateurs web (Chrome, Firefox, Edge)',
          'Aperçu (Mac)',
          'Foxit Reader (gratuit)',
          'SumatraPDF (gratuit, Windows)',
        ],
      },
      commonUses: [
        'Documents officiels et contrats',
        'Ebooks et manuels',
        'Factures et reçus',
        'Designs prêts à imprimer',
        'Formulaires administratifs',
      ],
      prosAndCons: {
        pros: [
          'Apparence cohérente partout',
          'Largement supporté',
          'Peut être sécurisé et signé',
          'Taille de fichier compacte',
        ],
        cons: [
          'Difficile à modifier sans logiciel spécial',
          'Pas idéal pour le contenu responsive',
          'Peut être volumineux avec beaucoup d\'images',
          'L\'accessibilité peut être limitée',
        ],
      },
      ctaTitle: 'Besoin de Travailler avec des PDFs ?',
      ctaDescription: 'Utilisez nos outils PDF gratuits pour ajouter le mode sombre, aplatir les formulaires ou sécuriser vos documents.',
      ctaButtonText: 'Essayer les Outils PDF',
      relatedFormats: ['html', 'markdown'],
    },
  },
  mp4: {
    en: {
      title: 'What is an MP4 File? Complete Guide',
      metaDescription: 'Learn what MP4 files are, how to play and convert them. Complete guide to the most popular video format.',
      fullName: 'MPEG-4 Part 14',
      intro: 'MP4 is the most widely used video container format, capable of storing video, audio, subtitles, and images in a single file. It\'s the standard for online video.',
      technicalDetails: {
        developer: 'Moving Picture Experts Group (MPEG)',
        firstReleased: '2001',
        mimeType: 'video/mp4',
        fileExtension: '.mp4',
        type: 'Multimedia container format',
      },
      whatIs: `MP4 is a digital multimedia container format that can store video, audio, and other data like subtitles and still images. It's based on the Apple QuickTime container format.

The format supports various codecs, with H.264 (AVC) and H.265 (HEVC) being the most common for video, and AAC for audio. This flexibility makes MP4 compatible with virtually all devices.`,
      characteristics: [
        'Supports multiple video codecs',
        'Includes audio tracks',
        'Can contain subtitles',
        'Streaming-friendly',
        'Universal device support',
        'Good compression ratio',
      ],
      howToOpen: {
        description: 'MP4 files play on virtually any device:',
        programs: [
          'VLC Media Player (free, all platforms)',
          'Windows Media Player',
          'QuickTime Player (Mac)',
          'Any web browser',
          'All smartphones and tablets',
        ],
      },
      commonUses: [
        'YouTube and social media videos',
        'Streaming services',
        'Video downloads',
        'Video editing projects',
        'Screen recordings',
      ],
      prosAndCons: {
        pros: [
          'Universal compatibility',
          'Excellent quality-to-size ratio',
          'Supports HD and 4K',
          'Streaming-optimized',
        ],
        cons: [
          'Quality loss in compression',
          'Not ideal for editing (use MOV)',
          'Patent licensing concerns',
          'Large files for high quality',
        ],
      },
      ctaTitle: 'Need to Work with MP4?',
      ctaDescription: 'Extract audio from videos, remove sound tracks, or create GIFs from your MP4 files.',
      ctaButtonText: 'Try Video Tools',
      relatedFormats: ['mp3', 'gif', 'mov'],
    },
    fr: {
      title: 'Qu\'est-ce qu\'un fichier MP4 ? Guide Complet',
      metaDescription: 'Découvrez ce que sont les fichiers MP4, comment les lire et les convertir. Guide complet du format vidéo le plus populaire.',
      fullName: 'MPEG-4 Part 14',
      intro: 'Le MP4 est le format conteneur vidéo le plus utilisé, capable de stocker vidéo, audio, sous-titres et images dans un seul fichier. C\'est le standard pour la vidéo en ligne.',
      technicalDetails: {
        developer: 'Moving Picture Experts Group (MPEG)',
        firstReleased: '2001',
        mimeType: 'video/mp4',
        fileExtension: '.mp4',
        type: 'Format conteneur multimédia',
      },
      whatIs: `Le MP4 est un format conteneur multimédia numérique qui peut stocker vidéo, audio et autres données comme les sous-titres et images fixes. Il est basé sur le format conteneur Apple QuickTime.

Le format supporte divers codecs, H.264 (AVC) et H.265 (HEVC) étant les plus courants pour la vidéo, et AAC pour l'audio. Cette flexibilité rend le MP4 compatible avec pratiquement tous les appareils.`,
      characteristics: [
        'Supporte plusieurs codecs vidéo',
        'Inclut des pistes audio',
        'Peut contenir des sous-titres',
        'Optimisé pour le streaming',
        'Support universel des appareils',
        'Bon ratio de compression',
      ],
      howToOpen: {
        description: 'Les fichiers MP4 se lisent sur pratiquement tout appareil :',
        programs: [
          'VLC Media Player (gratuit, toutes plateformes)',
          'Windows Media Player',
          'QuickTime Player (Mac)',
          'N\'importe quel navigateur web',
          'Tous les smartphones et tablettes',
        ],
      },
      commonUses: [
        'Vidéos YouTube et réseaux sociaux',
        'Services de streaming',
        'Téléchargements vidéo',
        'Projets de montage vidéo',
        'Enregistrements d\'écran',
      ],
      prosAndCons: {
        pros: [
          'Compatibilité universelle',
          'Excellent ratio qualité/taille',
          'Supporte HD et 4K',
          'Optimisé pour le streaming',
        ],
        cons: [
          'Perte de qualité à la compression',
          'Pas idéal pour le montage (utiliser MOV)',
          'Préoccupations de licence de brevets',
          'Fichiers volumineux en haute qualité',
        ],
      },
      ctaTitle: 'Besoin de Travailler avec des MP4 ?',
      ctaDescription: 'Extrayez l\'audio des vidéos, supprimez les pistes sonores, ou créez des GIFs à partir de vos fichiers MP4.',
      ctaButtonText: 'Essayer les Outils Vidéo',
      relatedFormats: ['mp3', 'gif', 'mov'],
    },
  },
  mp3: {
    en: {
      title: 'What is an MP3 File? Complete Guide',
      metaDescription: 'Learn what MP3 files are, how to play them, and why they revolutionized digital music. Complete guide to the MP3 audio format.',
      fullName: 'MPEG Audio Layer III',
      intro: 'MP3 is the most popular audio format that revolutionized how we consume music. It uses lossy compression to dramatically reduce file sizes while maintaining acceptable sound quality.',
      technicalDetails: {
        developer: 'Fraunhofer Society, MPEG',
        firstReleased: '1993',
        mimeType: 'audio/mpeg',
        fileExtension: '.mp3',
        type: 'Audio compression format',
      },
      whatIs: `MP3 changed the world of digital music by making it possible to store thousands of songs on portable devices. It achieves this by removing audio frequencies that humans can't easily hear.

At 128 kbps, an MP3 file is about 1/10th the size of the original CD audio. Higher bitrates (256-320 kbps) offer near-CD quality while still being compact enough for portable use.`,
      characteristics: [
        'Lossy compression',
        'Adjustable quality (bitrate)',
        'Universal compatibility',
        'Supports ID3 tags (metadata)',
        'Small file sizes',
        'Good for voice and music',
      ],
      howToOpen: {
        description: 'MP3 files play on virtually any device:',
        programs: [
          'Any music player app',
          'Web browsers',
          'Windows Media Player',
          'iTunes/Apple Music',
          'VLC Media Player',
        ],
      },
      commonUses: [
        'Music distribution',
        'Podcasts',
        'Audiobooks',
        'Voice recordings',
        'Sound effects',
      ],
      prosAndCons: {
        pros: [
          'Universal compatibility',
          'Small file sizes',
          'Good quality at high bitrates',
          'Streaming-friendly',
        ],
        cons: [
          'Lossy (quality loss)',
          'Not ideal for archiving',
          'No lossless option',
          'Outdated compared to AAC',
        ],
      },
      ctaTitle: 'Extract Audio from Video?',
      ctaDescription: 'Convert your video files to MP3 audio instantly with our free tool.',
      ctaButtonText: 'Extract MP3',
      relatedFormats: ['mp4', 'mov'],
    },
    fr: {
      title: 'Qu\'est-ce qu\'un fichier MP3 ? Guide Complet',
      metaDescription: 'Découvrez ce que sont les fichiers MP3, comment les lire, et pourquoi ils ont révolutionné la musique numérique. Guide complet du format audio MP3.',
      fullName: 'MPEG Audio Layer III',
      intro: 'Le MP3 est le format audio le plus populaire qui a révolutionné notre façon de consommer la musique. Il utilise une compression avec perte pour réduire drastiquement la taille des fichiers tout en maintenant une qualité sonore acceptable.',
      technicalDetails: {
        developer: 'Fraunhofer Society, MPEG',
        firstReleased: '1993',
        mimeType: 'audio/mpeg',
        fileExtension: '.mp3',
        type: 'Format de compression audio',
      },
      whatIs: `Le MP3 a changé le monde de la musique numérique en permettant de stocker des milliers de chansons sur des appareils portables. Il y parvient en supprimant les fréquences audio que les humains ne peuvent pas facilement entendre.

À 128 kbps, un fichier MP3 fait environ 1/10ème de la taille de l'audio CD original. Des bitrates plus élevés (256-320 kbps) offrent une qualité proche du CD tout en restant assez compacts pour un usage portable.`,
      characteristics: [
        'Compression avec perte',
        'Qualité ajustable (bitrate)',
        'Compatibilité universelle',
        'Supporte les tags ID3 (métadonnées)',
        'Petite taille de fichier',
        'Bon pour la voix et la musique',
      ],
      howToOpen: {
        description: 'Les fichiers MP3 se lisent sur pratiquement tout appareil :',
        programs: [
          'N\'importe quelle application de musique',
          'Navigateurs web',
          'Windows Media Player',
          'iTunes/Apple Music',
          'VLC Media Player',
        ],
      },
      commonUses: [
        'Distribution de musique',
        'Podcasts',
        'Livres audio',
        'Enregistrements vocaux',
        'Effets sonores',
      ],
      prosAndCons: {
        pros: [
          'Compatibilité universelle',
          'Petite taille de fichier',
          'Bonne qualité à haut bitrate',
          'Optimisé pour le streaming',
        ],
        cons: [
          'Avec perte (perte de qualité)',
          'Pas idéal pour l\'archivage',
          'Pas d\'option sans perte',
          'Dépassé comparé à AAC',
        ],
      },
      ctaTitle: 'Extraire l\'Audio d\'une Vidéo ?',
      ctaDescription: 'Convertissez vos fichiers vidéo en audio MP3 instantanément avec notre outil gratuit.',
      ctaButtonText: 'Extraire MP3',
      relatedFormats: ['mp4', 'mov'],
    },
  },
  gif: {
    en: {
      title: 'What is a GIF File? Complete Guide',
      metaDescription: 'Learn what GIF files are, how to create animated GIFs, and when to use them. Complete guide to the Graphics Interchange Format.',
      fullName: 'Graphics Interchange Format',
      intro: 'GIF is an image format that supports both static and animated images. While limited to 256 colors, GIFs remain hugely popular for short animations, memes, and reaction images.',
      technicalDetails: {
        developer: 'CompuServe',
        firstReleased: '1987',
        mimeType: 'image/gif',
        fileExtension: '.gif',
        type: 'Raster image format',
      },
      whatIs: `GIF (pronounced "gif" or "jif") is one of the oldest image formats still in widespread use. Its killer feature is the ability to create looping animations without any video player.

Despite being over 35 years old, GIFs dominate social media and messaging for short, expressive animations. They work everywhere without plugins or special software.`,
      characteristics: [
        'Supports animation',
        'Lossless compression',
        'Limited to 256 colors',
        'Transparent background support',
        'Loop infinitely',
        'No audio support',
      ],
      howToOpen: {
        description: 'GIFs open in any image viewer or browser:',
        programs: [
          'Any web browser',
          'Windows Photos',
          'Preview (Mac)',
          'Any image viewer',
          'Social media apps',
        ],
      },
      commonUses: [
        'Memes and reactions',
        'Short tutorials',
        'Product demos',
        'Social media content',
        'Email marketing',
      ],
      prosAndCons: {
        pros: [
          'Universal support',
          'No player needed',
          'Works in emails',
          'Easy to share',
        ],
        cons: [
          'Limited colors (256)',
          'Large file sizes',
          'No audio',
          'Lower quality than video',
        ],
      },
      ctaTitle: 'Create GIFs from Video',
      ctaDescription: 'Convert your video clips to optimized GIFs instantly with our free tool.',
      ctaButtonText: 'Make a GIF',
      relatedFormats: ['mp4', 'png', 'webp'],
    },
    fr: {
      title: 'Qu\'est-ce qu\'un fichier GIF ? Guide Complet',
      metaDescription: 'Découvrez ce que sont les fichiers GIF, comment créer des GIFs animés, et quand les utiliser. Guide complet du Graphics Interchange Format.',
      fullName: 'Graphics Interchange Format',
      intro: 'Le GIF est un format d\'image qui supporte les images statiques et animées. Bien que limité à 256 couleurs, les GIFs restent très populaires pour les animations courtes, les mèmes et les images de réaction.',
      technicalDetails: {
        developer: 'CompuServe',
        firstReleased: '1987',
        mimeType: 'image/gif',
        fileExtension: '.gif',
        type: 'Format d\'image raster',
      },
      whatIs: `Le GIF (prononcé "guif" ou "jif") est l'un des formats d'image les plus anciens encore largement utilisés. Sa fonctionnalité clé est la capacité de créer des animations en boucle sans lecteur vidéo.

Bien qu'ayant plus de 35 ans, les GIFs dominent les réseaux sociaux et la messagerie pour les animations courtes et expressives. Ils fonctionnent partout sans plugins ni logiciel spécial.`,
      characteristics: [
        'Supporte l\'animation',
        'Compression sans perte',
        'Limité à 256 couleurs',
        'Supporte le fond transparent',
        'Boucle infinie',
        'Pas de support audio',
      ],
      howToOpen: {
        description: 'Les GIFs s\'ouvrent dans n\'importe quel visualiseur d\'images ou navigateur :',
        programs: [
          'N\'importe quel navigateur web',
          'Photos Windows',
          'Aperçu (Mac)',
          'N\'importe quel visualiseur d\'images',
          'Applications de réseaux sociaux',
        ],
      },
      commonUses: [
        'Mèmes et réactions',
        'Tutoriels courts',
        'Démos de produits',
        'Contenu réseaux sociaux',
        'Marketing par email',
      ],
      prosAndCons: {
        pros: [
          'Support universel',
          'Pas de lecteur nécessaire',
          'Fonctionne dans les emails',
          'Facile à partager',
        ],
        cons: [
          'Couleurs limitées (256)',
          'Grande taille de fichier',
          'Pas d\'audio',
          'Qualité inférieure à la vidéo',
        ],
      },
      ctaTitle: 'Créer des GIFs depuis une Vidéo',
      ctaDescription: 'Convertissez vos clips vidéo en GIFs optimisés instantanément avec notre outil gratuit.',
      ctaButtonText: 'Créer un GIF',
      relatedFormats: ['mp4', 'png', 'webp'],
    },
  },
  xml: {
    en: {
      title: 'What is an XML File? Complete Guide',
      metaDescription: 'Learn what XML files are, how to open and edit them. Complete guide to Extensible Markup Language.',
      fullName: 'Extensible Markup Language',
      intro: 'XML (Extensible Markup Language) is a markup language designed to store and transport data in a format that is both human-readable and machine-readable.',
      technicalDetails: {
        developer: 'W3C (World Wide Web Consortium)',
        firstReleased: '1998',
        mimeType: 'application/xml',
        fileExtension: '.xml',
        type: 'Markup language',
      },
      whatIs: `XML is a flexible text format that lets you define your own tags to structure data. Unlike HTML which has predefined tags, XML allows you to create meaningful names for your data elements.

XML was designed to be self-descriptive - the tags explain what the data means. This makes it excellent for data exchange between different systems that need to understand each other's data.`,
      characteristics: [
        'Self-descriptive tags',
        'Hierarchical structure',
        'Platform-independent',
        'Unicode support',
        'Schema validation available',
        'Extensible and flexible',
      ],
      howToOpen: {
        description: 'XML files can be opened with text editors or specialized tools:',
        programs: [
          'VS Code with XML extension',
          'Notepad++',
          'Web browsers',
          'Microsoft Excel',
          'XMLSpy (professional)',
        ],
      },
      commonUses: [
        'Configuration files',
        'Data exchange (SOAP APIs)',
        'RSS and Atom feeds',
        'Office documents (DOCX, XLSX)',
        'SVG graphics',
      ],
      prosAndCons: {
        pros: [
          'Self-documenting',
          'Strict validation possible',
          'Industry standard',
          'Good for complex structures',
        ],
        cons: [
          'Verbose syntax',
          'Larger file sizes than JSON',
          'Slower to parse',
          'Complex to write manually',
        ],
      },
      ctaTitle: 'Need to Convert XML?',
      ctaDescription: 'Convert your XML files to JSON, CSV, and more formats instantly.',
      ctaButtonText: 'Convert XML Now',
      relatedFormats: ['json', 'yaml', 'html'],
    },
    fr: {
      title: 'Qu\'est-ce qu\'un fichier XML ? Guide Complet',
      metaDescription: 'Découvrez ce que sont les fichiers XML, comment les ouvrir et les modifier. Guide complet du Extensible Markup Language.',
      fullName: 'Extensible Markup Language (Langage de Balisage Extensible)',
      intro: 'XML (Extensible Markup Language) est un langage de balisage conçu pour stocker et transporter des données dans un format lisible à la fois par les humains et les machines.',
      technicalDetails: {
        developer: 'W3C (World Wide Web Consortium)',
        firstReleased: '1998',
        mimeType: 'application/xml',
        fileExtension: '.xml',
        type: 'Langage de balisage',
      },
      whatIs: `XML est un format texte flexible qui vous permet de définir vos propres balises pour structurer les données. Contrairement au HTML qui a des balises prédéfinies, XML vous permet de créer des noms significatifs pour vos éléments de données.

XML a été conçu pour être auto-descriptif - les balises expliquent ce que signifient les données. Cela le rend excellent pour l'échange de données entre différents systèmes qui doivent comprendre les données de l'autre.`,
      characteristics: [
        'Balises auto-descriptives',
        'Structure hiérarchique',
        'Indépendant de la plateforme',
        'Support Unicode',
        'Validation par schéma disponible',
        'Extensible et flexible',
      ],
      howToOpen: {
        description: 'Les fichiers XML peuvent être ouverts avec des éditeurs de texte ou des outils spécialisés :',
        programs: [
          'VS Code avec extension XML',
          'Notepad++',
          'Navigateurs web',
          'Microsoft Excel',
          'XMLSpy (professionnel)',
        ],
      },
      commonUses: [
        'Fichiers de configuration',
        'Échange de données (APIs SOAP)',
        'Flux RSS et Atom',
        'Documents Office (DOCX, XLSX)',
        'Graphiques SVG',
      ],
      prosAndCons: {
        pros: [
          'Auto-documenté',
          'Validation stricte possible',
          'Standard de l\'industrie',
          'Bon pour structures complexes',
        ],
        cons: [
          'Syntaxe verbeuse',
          'Fichiers plus gros que JSON',
          'Plus lent à parser',
          'Complexe à écrire manuellement',
        ],
      },
      ctaTitle: 'Besoin de Convertir du XML ?',
      ctaDescription: 'Convertissez vos fichiers XML en JSON, CSV et plus de formats instantanément.',
      ctaButtonText: 'Convertir XML',
      relatedFormats: ['json', 'yaml', 'html'],
    },
  },
  yaml: {
    en: {
      title: 'What is a YAML File? Complete Guide',
      metaDescription: 'Learn what YAML files are, how to read and write them. Complete guide to YAML Ain\'t Markup Language.',
      fullName: 'YAML Ain\'t Markup Language',
      intro: 'YAML is a human-friendly data serialization language commonly used for configuration files. It emphasizes readability with minimal syntax.',
      technicalDetails: {
        developer: 'Clark Evans, Ingy döt Net, Oren Ben-Kiki',
        firstReleased: '2001',
        mimeType: 'text/yaml',
        fileExtension: '.yaml, .yml',
        type: 'Data serialization format',
      },
      whatIs: `YAML was designed to be the most human-readable data format possible. It uses indentation instead of brackets, making it feel more like a document outline than code.

YAML is a superset of JSON (valid JSON is valid YAML), but its clean syntax makes it the preferred choice for configuration files in modern DevOps tools like Docker, Kubernetes, and CI/CD pipelines.`,
      characteristics: [
        'Human-readable syntax',
        'Indentation-based structure',
        'Supports comments',
        'Superset of JSON',
        'Multi-document support',
        'Complex data types',
      ],
      howToOpen: {
        description: 'YAML files can be opened with any text editor:',
        programs: [
          'VS Code (excellent YAML support)',
          'Sublime Text',
          'Atom',
          'Any text editor',
          'Online YAML validators',
        ],
      },
      commonUses: [
        'Docker Compose files',
        'Kubernetes configurations',
        'CI/CD pipelines (GitHub Actions, GitLab CI)',
        'Ansible playbooks',
        'Application configuration',
      ],
      prosAndCons: {
        pros: [
          'Very readable',
          'Supports comments',
          'Clean syntax',
          'Popular in DevOps',
        ],
        cons: [
          'Indentation-sensitive',
          'Can be error-prone',
          'Complex specifications',
          'Security concerns with parsing',
        ],
      },
      ctaTitle: 'Need to Convert YAML?',
      ctaDescription: 'Convert your YAML files to JSON, XML, and more formats instantly.',
      ctaButtonText: 'Convert YAML Now',
      relatedFormats: ['json', 'xml'],
    },
    fr: {
      title: 'Qu\'est-ce qu\'un fichier YAML ? Guide Complet',
      metaDescription: 'Découvrez ce que sont les fichiers YAML, comment les lire et les écrire. Guide complet de YAML Ain\'t Markup Language.',
      fullName: 'YAML Ain\'t Markup Language',
      intro: 'YAML est un langage de sérialisation de données convivial couramment utilisé pour les fichiers de configuration. Il met l\'accent sur la lisibilité avec une syntaxe minimale.',
      technicalDetails: {
        developer: 'Clark Evans, Ingy döt Net, Oren Ben-Kiki',
        firstReleased: '2001',
        mimeType: 'text/yaml',
        fileExtension: '.yaml, .yml',
        type: 'Format de sérialisation de données',
      },
      whatIs: `YAML a été conçu pour être le format de données le plus lisible possible. Il utilise l'indentation au lieu des crochets, ce qui le fait ressembler à un plan de document plutôt qu'à du code.

YAML est un surensemble de JSON (un JSON valide est un YAML valide), mais sa syntaxe propre en fait le choix préféré pour les fichiers de configuration dans les outils DevOps modernes comme Docker, Kubernetes et les pipelines CI/CD.`,
      characteristics: [
        'Syntaxe lisible par l\'humain',
        'Structure basée sur l\'indentation',
        'Supporte les commentaires',
        'Surensemble de JSON',
        'Support multi-documents',
        'Types de données complexes',
      ],
      howToOpen: {
        description: 'Les fichiers YAML peuvent être ouverts avec n\'importe quel éditeur de texte :',
        programs: [
          'VS Code (excellent support YAML)',
          'Sublime Text',
          'Atom',
          'N\'importe quel éditeur de texte',
          'Validateurs YAML en ligne',
        ],
      },
      commonUses: [
        'Fichiers Docker Compose',
        'Configurations Kubernetes',
        'Pipelines CI/CD (GitHub Actions, GitLab CI)',
        'Playbooks Ansible',
        'Configuration d\'applications',
      ],
      prosAndCons: {
        pros: [
          'Très lisible',
          'Supporte les commentaires',
          'Syntaxe propre',
          'Populaire en DevOps',
        ],
        cons: [
          'Sensible à l\'indentation',
          'Peut être source d\'erreurs',
          'Spécifications complexes',
          'Préoccupations de sécurité au parsing',
        ],
      },
      ctaTitle: 'Besoin de Convertir du YAML ?',
      ctaDescription: 'Convertissez vos fichiers YAML en JSON, XML et plus de formats instantanément.',
      ctaButtonText: 'Convertir YAML',
      relatedFormats: ['json', 'xml'],
    },
  },
};

export function getWikiContent(formatId: string, lang: string): FormatContent | undefined {
  const formatContent = WIKI_CONTENT[formatId];
  if (!formatContent) return undefined;
  return formatContent[lang] || formatContent['en'];
}
