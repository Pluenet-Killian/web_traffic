// Guides Configuration - SEO Long-Tail "How To" Articles

export interface Guide {
  id: string;
  slug: string;
  toolId?: string; // Link to a tool
  conversionSlug?: string; // Link to a converter
  category: 'pdf' | 'image' | 'data';
}

export interface GuideContent {
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  introduction: string;
  problemTitle: string;
  problemDescription: string;
  solutionTitle: string;
  solutionSteps: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  tips: string[];
  relatedTitle: string;
}

export const GUIDES: Record<string, Guide> = {
  'how-to-convert-pdf-dark-mode': {
    id: 'how-to-convert-pdf-dark-mode',
    slug: 'how-to-convert-pdf-dark-mode',
    toolId: 'pdf-dark-mode',
    category: 'pdf',
  },
  'how-to-flatten-pdf-forms': {
    id: 'how-to-flatten-pdf-forms',
    slug: 'how-to-flatten-pdf-forms',
    toolId: 'pdf-flatten',
    category: 'pdf',
  },
  'how-to-add-watermark-to-image': {
    id: 'how-to-add-watermark-to-image',
    slug: 'how-to-add-watermark-to-image',
    toolId: 'image-watermark',
    category: 'image',
  },
  'how-to-convert-json-to-csv': {
    id: 'how-to-convert-json-to-csv',
    slug: 'how-to-convert-json-to-csv',
    conversionSlug: 'json-to-csv',
    category: 'data',
  },
  'how-to-protect-photos-online': {
    id: 'how-to-protect-photos-online',
    slug: 'how-to-protect-photos-online',
    toolId: 'image-watermark',
    category: 'image',
  },
};

export const GUIDE_IDS = Object.keys(GUIDES) as Array<keyof typeof GUIDES>;

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES[slug];
}

export function getAllGuides(): Guide[] {
  return Object.values(GUIDES);
}

export function getGuidesByCategory(category: 'pdf' | 'image' | 'data'): Guide[] {
  return getAllGuides().filter((guide) => guide.category === category);
}

// Guide content for SEO
export const GUIDE_CONTENT: Record<string, Record<string, GuideContent>> = {
  'how-to-convert-pdf-dark-mode': {
    en: {
      title: 'How to Convert PDF to Dark Mode (Free Online Tool)',
      metaDescription: 'Learn how to convert any PDF to dark mode for comfortable night reading. Free online tool, no registration required, 100% private.',
      heroTitle: 'How to Convert PDF to Dark Mode',
      heroSubtitle: 'Read PDFs comfortably at night without straining your eyes',
      introduction: `Reading PDFs at night can be exhausting for your eyes. The bright white background creates harsh contrast that leads to eye strain, headaches, and difficulty sleeping. Dark mode solves this problem by inverting colors, making your documents much easier on the eyes.

In this guide, we'll show you how to convert any PDF to dark mode instantly using our free online tool. No software installation, no registration - just upload and download.`,
      problemTitle: 'The Problem with Regular PDFs',
      problemDescription: `Standard PDFs are designed for printing on white paper, which means they have a bright white background. When you read these on a screen, especially at night:

• The bright light strains your eyes
• It can disrupt your sleep cycle (blue light exposure)
• Long reading sessions become uncomfortable
• OLED screens consume more battery with white backgrounds

Many e-readers and PDF apps offer dark mode, but what about those times when you need to share a dark version, or the app you're using doesn't support it?`,
      solutionTitle: 'The Solution: Convert Your PDF',
      solutionSteps: [
        'Open our PDF Dark Mode tool (link below)',
        'Drag and drop your PDF file into the upload zone',
        'Adjust the darkness intensity using the slider',
        'Click "Convert to Dark Mode" and wait a few seconds',
        'Download your new dark-mode PDF',
      ],
      ctaTitle: 'Ready to Convert Your PDF?',
      ctaDescription: 'Use our free PDF Dark Mode converter - no registration required, 100% private (your files never leave your browser).',
      ctaButtonText: 'Convert PDF to Dark Mode Now',
      tips: [
        'Start with 85% intensity for most documents',
        'Lower intensity (70-80%) works better for PDFs with images',
        'The conversion preserves all text - you can still search and copy',
        'Works great with academic papers, ebooks, and documentation',
      ],
      relatedTitle: 'Related Guides',
    },
    fr: {
      title: 'Comment Convertir un PDF en Mode Sombre (Outil Gratuit)',
      metaDescription: 'Apprenez comment convertir n\'importe quel PDF en mode sombre pour une lecture nocturne confortable. Outil gratuit, sans inscription, 100% privé.',
      heroTitle: 'Comment Convertir un PDF en Mode Sombre',
      heroSubtitle: 'Lisez vos PDFs confortablement la nuit sans fatiguer vos yeux',
      introduction: `Lire des PDFs la nuit peut être épuisant pour vos yeux. Le fond blanc brillant crée un contraste agressif qui provoque fatigue oculaire, maux de tête et difficultés d'endormissement. Le mode sombre résout ce problème en inversant les couleurs.

Dans ce guide, nous vous montrons comment convertir n'importe quel PDF en mode sombre instantanément avec notre outil gratuit. Pas d'installation, pas d'inscription - uploadez et téléchargez.`,
      problemTitle: 'Le Problème des PDFs Standards',
      problemDescription: `Les PDFs standards sont conçus pour l'impression sur papier blanc, ce qui signifie un fond très lumineux. Quand vous lisez sur écran, surtout la nuit :

• La lumière intense fatigue vos yeux
• Elle peut perturber votre cycle de sommeil (exposition à la lumière bleue)
• Les longues sessions de lecture deviennent inconfortables
• Les écrans OLED consomment plus de batterie avec les fonds blancs

Beaucoup de liseuses offrent un mode sombre, mais que faire quand vous devez partager une version sombre, ou que l'app utilisée ne le supporte pas ?`,
      solutionTitle: 'La Solution : Convertir Votre PDF',
      solutionSteps: [
        'Ouvrez notre outil PDF Mode Sombre (lien ci-dessous)',
        'Glissez-déposez votre fichier PDF dans la zone d\'upload',
        'Ajustez l\'intensité de l\'obscurité avec le curseur',
        'Cliquez sur "Convertir en Mode Sombre" et attendez quelques secondes',
        'Téléchargez votre nouveau PDF en mode sombre',
      ],
      ctaTitle: 'Prêt à Convertir Votre PDF ?',
      ctaDescription: 'Utilisez notre convertisseur PDF Mode Sombre gratuit - sans inscription, 100% privé (vos fichiers ne quittent jamais votre navigateur).',
      ctaButtonText: 'Convertir en Mode Sombre',
      tips: [
        'Commencez avec 85% d\'intensité pour la plupart des documents',
        'Une intensité plus basse (70-80%) fonctionne mieux pour les PDFs avec images',
        'La conversion préserve tout le texte - vous pouvez toujours rechercher et copier',
        'Fonctionne très bien avec les articles académiques, ebooks et documentation',
      ],
      relatedTitle: 'Guides Connexes',
    },
  },
  'how-to-flatten-pdf-forms': {
    en: {
      title: 'How to Flatten PDF Form Fields (Free & Secure)',
      metaDescription: 'Learn how to flatten PDF forms to make them non-editable. Remove metadata and secure your documents with our free online tool.',
      heroTitle: 'How to Flatten PDF Form Fields',
      heroSubtitle: 'Make your filled forms permanent and secure',
      introduction: `PDF forms are great for collecting information, but once filled, you often need to share them in a non-editable format. Flattening a PDF converts all form fields into static content, preventing any modifications.

This guide shows you how to flatten PDF forms instantly and optionally remove sensitive metadata like author name and creation dates.`,
      problemTitle: 'Why Flatten PDF Forms?',
      problemDescription: `When you fill out a PDF form, the data remains editable. This creates several problems:

• Anyone can modify the form data after you've signed it
• PDF metadata reveals who created the document and when
• Form fields can look different on different PDF readers
• Some systems don't accept PDFs with active form fields

Flattening solves all these issues by "burning in" the form data, making it part of the page itself.`,
      solutionTitle: 'How to Flatten Your PDF',
      solutionSteps: [
        'Open our PDF Flatten tool (link below)',
        'Upload your filled PDF form',
        'Choose your options: flatten forms, remove metadata, or both',
        'Click "Flatten & Secure"',
        'Download your protected PDF',
      ],
      ctaTitle: 'Secure Your PDF Now',
      ctaDescription: 'Use our free PDF Flatten tool to secure your documents. 100% private - processing happens in your browser.',
      ctaButtonText: 'Flatten PDF Now',
      tips: [
        'Always keep a backup of the original editable form',
        'Use "Remove Metadata" to strip author information before sharing',
        'Flattened PDFs are perfect for official submissions',
        'This works great for contracts, applications, and tax forms',
      ],
      relatedTitle: 'Related Guides',
    },
    fr: {
      title: 'Comment Aplatir les Formulaires PDF (Gratuit & Sécurisé)',
      metaDescription: 'Apprenez comment aplatir les formulaires PDF pour les rendre non-éditables. Supprimez les métadonnées et sécurisez vos documents.',
      heroTitle: 'Comment Aplatir les Formulaires PDF',
      heroSubtitle: 'Rendez vos formulaires remplis permanents et sécurisés',
      introduction: `Les formulaires PDF sont pratiques pour collecter des informations, mais une fois remplis, vous devez souvent les partager dans un format non-éditable. L'aplatissement convertit tous les champs en contenu statique.

Ce guide vous montre comment aplatir vos formulaires PDF instantanément et supprimer optionnellement les métadonnées sensibles.`,
      problemTitle: 'Pourquoi Aplatir les Formulaires PDF ?',
      problemDescription: `Quand vous remplissez un formulaire PDF, les données restent éditables. Cela crée plusieurs problèmes :

• N'importe qui peut modifier les données après votre signature
• Les métadonnées PDF révèlent qui a créé le document et quand
• Les champs de formulaire peuvent s'afficher différemment selon les lecteurs PDF
• Certains systèmes n'acceptent pas les PDFs avec des champs actifs

L'aplatissement résout tous ces problèmes en "gravant" les données dans la page elle-même.`,
      solutionTitle: 'Comment Aplatir Votre PDF',
      solutionSteps: [
        'Ouvrez notre outil PDF Aplatir (lien ci-dessous)',
        'Uploadez votre formulaire PDF rempli',
        'Choisissez vos options : aplatir les formulaires, supprimer les métadonnées, ou les deux',
        'Cliquez sur "Aplatir & Sécuriser"',
        'Téléchargez votre PDF protégé',
      ],
      ctaTitle: 'Sécurisez Votre PDF Maintenant',
      ctaDescription: 'Utilisez notre outil PDF Aplatir gratuit pour sécuriser vos documents. 100% privé - le traitement se fait dans votre navigateur.',
      ctaButtonText: 'Aplatir le PDF',
      tips: [
        'Gardez toujours une sauvegarde du formulaire original éditable',
        'Utilisez "Supprimer les métadonnées" pour enlever les informations d\'auteur avant le partage',
        'Les PDFs aplatis sont parfaits pour les soumissions officielles',
        'Fonctionne très bien pour les contrats, candidatures et formulaires fiscaux',
      ],
      relatedTitle: 'Guides Connexes',
    },
  },
  'how-to-add-watermark-to-image': {
    en: {
      title: 'How to Add Watermark to Images Online (Free)',
      metaDescription: 'Protect your photos with watermarks before sharing online. Free tool for Vinted, eBay, Airbnb sellers. No registration required.',
      heroTitle: 'How to Add Watermark to Images',
      heroSubtitle: 'Protect your photos before sharing them online',
      introduction: `Whether you're selling on Vinted, eBay, or listing on Airbnb, protecting your photos from theft is essential. A watermark prevents others from stealing and reusing your images without permission.

This guide shows you how to add professional watermarks to your images in seconds using our free online tool.`,
      problemTitle: 'Why Watermark Your Images?',
      problemDescription: `Sharing photos online exposes them to theft. Without protection:

• Competitors can steal your product photos
• Scammers can use your images for fake listings
• Your hard work can be claimed by others
• You have no proof of ownership in disputes

A watermark acts as your signature - it's visible enough to deter theft but doesn't ruin the image quality.`,
      solutionTitle: 'How to Add Your Watermark',
      solutionSteps: [
        'Open our Image Watermark tool (link below)',
        'Upload your image (JPG, PNG, or WebP)',
        'Enter your watermark text (e.g., your username or "© YourName")',
        'Adjust opacity, size, and tiled pattern as needed',
        'Download your protected image',
      ],
      ctaTitle: 'Protect Your Images Now',
      ctaDescription: 'Add professional watermarks to your photos - free, fast, and 100% private.',
      ctaButtonText: 'Add Watermark to Image',
      tips: [
        'Use 30% opacity for a subtle but visible watermark',
        'Enable "Tiled pattern" to cover the entire image',
        'Include your username or website for brand recognition',
        'Keep the original unwatermarked version for yourself',
      ],
      relatedTitle: 'Related Guides',
    },
    fr: {
      title: 'Comment Ajouter un Filigrane sur vos Images (Gratuit)',
      metaDescription: 'Protégez vos photos avec des filigranes avant de les partager. Outil gratuit pour les vendeurs Vinted, eBay, Airbnb.',
      heroTitle: 'Comment Ajouter un Filigrane sur vos Images',
      heroSubtitle: 'Protégez vos photos avant de les partager en ligne',
      introduction: `Que vous vendiez sur Vinted, eBay, ou que vous soyez sur Airbnb, protéger vos photos du vol est essentiel. Un filigrane empêche les autres de voler et réutiliser vos images.

Ce guide vous montre comment ajouter des filigranes professionnels à vos images en quelques secondes avec notre outil gratuit.`,
      problemTitle: 'Pourquoi Mettre un Filigrane ?',
      problemDescription: `Partager des photos en ligne les expose au vol. Sans protection :

• Les concurrents peuvent voler vos photos de produits
• Les arnaqueurs peuvent utiliser vos images pour de fausses annonces
• Votre travail peut être revendiqué par d'autres
• Vous n'avez aucune preuve de propriété en cas de litige

Un filigrane agit comme votre signature - assez visible pour dissuader le vol mais sans ruiner la qualité de l'image.`,
      solutionTitle: 'Comment Ajouter Votre Filigrane',
      solutionSteps: [
        'Ouvrez notre outil Filigrane Image (lien ci-dessous)',
        'Uploadez votre image (JPG, PNG, ou WebP)',
        'Entrez votre texte de filigrane (ex: votre pseudo ou "© VotreNom")',
        'Ajustez l\'opacité, la taille et le motif en tuiles selon vos besoins',
        'Téléchargez votre image protégée',
      ],
      ctaTitle: 'Protégez Vos Images Maintenant',
      ctaDescription: 'Ajoutez des filigranes professionnels à vos photos - gratuit, rapide et 100% privé.',
      ctaButtonText: 'Ajouter un Filigrane',
      tips: [
        'Utilisez 30% d\'opacité pour un filigrane subtil mais visible',
        'Activez "Motif en tuiles" pour couvrir toute l\'image',
        'Incluez votre pseudo ou site web pour la reconnaissance de marque',
        'Gardez la version originale sans filigrane pour vous',
      ],
      relatedTitle: 'Guides Connexes',
    },
  },
  'how-to-convert-json-to-csv': {
    en: {
      title: 'How to Convert JSON to CSV (Free Online Converter)',
      metaDescription: 'Convert JSON data to CSV format instantly. Free online tool for developers and data analysts. No registration required.',
      heroTitle: 'How to Convert JSON to CSV',
      heroSubtitle: 'Transform your JSON data into spreadsheet-ready CSV format',
      introduction: `JSON is great for APIs and web applications, but when you need to analyze data in Excel or Google Sheets, CSV is the format you need. Converting JSON to CSV manually is tedious and error-prone.

This guide shows you how to convert JSON to CSV instantly using our free online converter.`,
      problemTitle: 'Why Convert JSON to CSV?',
      problemDescription: `JSON and CSV serve different purposes:

• JSON is hierarchical - great for nested data structures
• CSV is flat - perfect for spreadsheets and databases
• Most business tools expect CSV format
• Data analysis in Excel/Sheets requires CSV

Manual conversion means copying, reformatting, and hoping you don't make mistakes. Our tool handles all the complexity automatically.`,
      solutionTitle: 'How to Convert Your Data',
      solutionSteps: [
        'Open our JSON to CSV converter (link below)',
        'Paste your JSON data or drag a .json file',
        'Click "Convert" to transform your data',
        'Preview the result and download your CSV file',
      ],
      ctaTitle: 'Convert Your JSON Now',
      ctaDescription: 'Use our free JSON to CSV converter - instant results, no registration required.',
      ctaButtonText: 'Convert JSON to CSV',
      tips: [
        'Make sure your JSON is an array of objects for best results',
        'Nested objects will be flattened with dot notation',
        'The converter handles special characters and encoding automatically',
        'You can also convert back from CSV to JSON',
      ],
      relatedTitle: 'Related Guides',
    },
    fr: {
      title: 'Comment Convertir JSON en CSV (Convertisseur Gratuit)',
      metaDescription: 'Convertissez vos données JSON en format CSV instantanément. Outil gratuit pour développeurs et analystes. Sans inscription.',
      heroTitle: 'Comment Convertir JSON en CSV',
      heroSubtitle: 'Transformez vos données JSON en format CSV pour tableurs',
      introduction: `JSON est excellent pour les APIs et applications web, mais quand vous devez analyser des données dans Excel ou Google Sheets, le CSV est le format qu'il vous faut.

Ce guide vous montre comment convertir JSON en CSV instantanément avec notre convertisseur gratuit.`,
      problemTitle: 'Pourquoi Convertir JSON en CSV ?',
      problemDescription: `JSON et CSV ont des usages différents :

• JSON est hiérarchique - idéal pour les structures de données imbriquées
• CSV est plat - parfait pour les tableurs et bases de données
• La plupart des outils métier attendent du CSV
• L'analyse de données dans Excel/Sheets nécessite du CSV

La conversion manuelle signifie copier, reformater, et espérer ne pas faire d'erreurs. Notre outil gère toute la complexité automatiquement.`,
      solutionTitle: 'Comment Convertir Vos Données',
      solutionSteps: [
        'Ouvrez notre convertisseur JSON vers CSV (lien ci-dessous)',
        'Collez vos données JSON ou glissez un fichier .json',
        'Cliquez sur "Convertir" pour transformer vos données',
        'Prévisualisez le résultat et téléchargez votre fichier CSV',
      ],
      ctaTitle: 'Convertissez Votre JSON',
      ctaDescription: 'Utilisez notre convertisseur JSON vers CSV gratuit - résultats instantanés, sans inscription.',
      ctaButtonText: 'Convertir JSON en CSV',
      tips: [
        'Assurez-vous que votre JSON est un tableau d\'objets pour de meilleurs résultats',
        'Les objets imbriqués seront aplatis avec une notation à points',
        'Le convertisseur gère automatiquement les caractères spéciaux et l\'encodage',
        'Vous pouvez aussi convertir de CSV vers JSON',
      ],
      relatedTitle: 'Guides Connexes',
    },
  },
  'how-to-protect-photos-online': {
    en: {
      title: 'How to Protect Your Photos Online (Vinted, eBay, Airbnb)',
      metaDescription: 'Protect your product photos from theft when selling online. Essential guide for Vinted, eBay, and Airbnb sellers.',
      heroTitle: 'How to Protect Your Photos When Selling Online',
      heroSubtitle: 'Stop photo theft on marketplaces with watermarks',
      introduction: `Selling on Vinted, eBay, or Airbnb? Your photos are your most valuable asset - and also the most vulnerable. Scammers regularly steal product photos to create fake listings. This complete guide shows you how to protect your images.`,
      problemTitle: 'The Photo Theft Problem',
      problemDescription: `Photo theft is rampant on online marketplaces:

• Scammers copy your product photos for fake listings
• Competitors use your images without credit
• Your hard work gets stolen in seconds
• Reporting stolen photos rarely gets results
• Buyers can't tell original from fake listings

The solution? Watermark your photos before uploading them anywhere.`,
      solutionTitle: 'How to Protect Your Photos',
      solutionSteps: [
        'Take high-quality photos of your products',
        'Open our Image Watermark tool (link below)',
        'Add your username, website, or "©" mark',
        'Use a tiled pattern for maximum protection',
        'Download and use for your listings',
      ],
      ctaTitle: 'Protect Your Photos Now',
      ctaDescription: 'Add watermarks in seconds - free, fast, and works with any marketplace.',
      ctaButtonText: 'Add Watermark Now',
      tips: [
        'Include your marketplace username in the watermark',
        'Keep opacity at 25-35% - visible but not distracting',
        'Watermark before uploading anywhere, not after',
        'Save originals separately - you might need them for disputes',
        'Use consistent watermarks across all your listings',
      ],
      relatedTitle: 'Related Guides',
    },
    fr: {
      title: 'Comment Protéger vos Photos en Ligne (Vinted, eBay, Airbnb)',
      metaDescription: 'Protégez vos photos de produits du vol quand vous vendez en ligne. Guide essentiel pour les vendeurs Vinted, eBay et Airbnb.',
      heroTitle: 'Comment Protéger vos Photos pour la Vente en Ligne',
      heroSubtitle: 'Stoppez le vol de photos sur les marketplaces avec les filigranes',
      introduction: `Vous vendez sur Vinted, eBay, ou Airbnb ? Vos photos sont votre atout le plus précieux - et aussi le plus vulnérable. Les arnaqueurs volent régulièrement des photos de produits pour créer de fausses annonces. Ce guide complet vous montre comment protéger vos images.`,
      problemTitle: 'Le Problème du Vol de Photos',
      problemDescription: `Le vol de photos est endémique sur les marketplaces :

• Les arnaqueurs copient vos photos pour de fausses annonces
• Les concurrents utilisent vos images sans crédit
• Votre travail est volé en quelques secondes
• Signaler les photos volées donne rarement des résultats
• Les acheteurs ne peuvent pas distinguer l'original du faux

La solution ? Ajoutez un filigrane à vos photos avant de les uploader.`,
      solutionTitle: 'Comment Protéger vos Photos',
      solutionSteps: [
        'Prenez des photos de qualité de vos produits',
        'Ouvrez notre outil Filigrane Image (lien ci-dessous)',
        'Ajoutez votre pseudo, site web, ou marque "©"',
        'Utilisez un motif en tuiles pour une protection maximale',
        'Téléchargez et utilisez pour vos annonces',
      ],
      ctaTitle: 'Protégez vos Photos Maintenant',
      ctaDescription: 'Ajoutez des filigranes en secondes - gratuit, rapide, fonctionne avec toutes les plateformes.',
      ctaButtonText: 'Ajouter un Filigrane',
      tips: [
        'Incluez votre pseudo marketplace dans le filigrane',
        'Gardez l\'opacité à 25-35% - visible mais pas distrayant',
        'Ajoutez le filigrane avant d\'uploader, pas après',
        'Gardez les originaux séparément - vous pourriez en avoir besoin pour des litiges',
        'Utilisez des filigranes cohérents sur toutes vos annonces',
      ],
      relatedTitle: 'Guides Connexes',
    },
  },
};

export function getGuideContent(guideId: string, lang: string): GuideContent | undefined {
  const guideContent = GUIDE_CONTENT[guideId];
  if (!guideContent) return undefined;
  return guideContent[lang] || guideContent['en'];
}
