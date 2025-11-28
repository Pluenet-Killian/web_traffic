// Tools Configuration - PDF & Image Manipulation Tools

export interface Tool {
  id: string;
  slug: string;
  category: 'pdf' | 'image';
  icon: string; // Lucide icon name
  color: string; // Tailwind bg color
  features: string[];
}

export const TOOLS: Record<string, Tool> = {
  'pdf-dark-mode': {
    id: 'pdf-dark-mode',
    slug: 'pdf-dark-mode',
    category: 'pdf',
    icon: 'Moon',
    color: 'bg-violet-500',
    features: ['darkMode', 'intensity', 'preview'],
  },
  'pdf-flatten': {
    id: 'pdf-flatten',
    slug: 'pdf-flatten',
    category: 'pdf',
    icon: 'FileCheck',
    color: 'bg-blue-500',
    features: ['flatten', 'removeMetadata', 'secure'],
  },
  'image-watermark': {
    id: 'image-watermark',
    slug: 'image-watermark',
    category: 'image',
    icon: 'Shield',
    color: 'bg-emerald-500',
    features: ['customText', 'opacity', 'tiled'],
  },
};

export const TOOL_IDS = Object.keys(TOOLS) as Array<keyof typeof TOOLS>;

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS[slug];
}

export function getAllTools(): Tool[] {
  return Object.values(TOOLS);
}

export function getToolsByCategory(category: 'pdf' | 'image'): Tool[] {
  return getAllTools().filter((tool) => tool.category === category);
}

// Tool content for SEO - similar to content-matrix for converters
export interface ToolContent {
  title: string;
  description: string;
  intro: string;
  howItWorks: string[];
  useCases: string[];
  benefits: string[];
  faq: { question: string; answer: string }[];
}

export const TOOL_CONTENT: Record<string, Record<string, ToolContent>> = {
  'pdf-dark-mode': {
    en: {
      title: 'PDF Dark Mode Generator',
      description: 'Convert any PDF to dark mode for comfortable night reading. 100% client-side, your files never leave your browser.',
      intro: 'Transform your PDFs into eye-friendly dark mode documents. Perfect for reading at night without straining your eyes. Our tool processes everything locally in your browser - your files are never uploaded to any server.',
      howItWorks: [
        'Upload your PDF file using drag & drop or file picker',
        'Adjust the darkness intensity using the slider',
        'Preview the result in real-time',
        'Download your dark mode PDF instantly',
      ],
      useCases: [
        'Reading academic papers or ebooks at night',
        'Reducing eye strain during long reading sessions',
        'Preparing documents for OLED screens to save battery',
        'Making documents more accessible for light-sensitive users',
      ],
      benefits: [
        '100% client-side processing - files never leave your device',
        'No file size limits - works with large PDFs',
        'Preserves text, images, and formatting',
        'Adjustable intensity for personal preference',
        'Free and unlimited use',
      ],
      faq: [
        {
          question: 'Is my PDF uploaded to a server?',
          answer: 'No! Everything happens in your browser using JavaScript. Your files never leave your device, ensuring complete privacy and security.',
        },
        {
          question: 'Will the text remain searchable?',
          answer: 'Yes, the dark mode conversion preserves all text layers. You can still search, select, and copy text from the converted PDF.',
        },
        {
          question: 'Does it work with scanned PDFs?',
          answer: 'Yes, but the result depends on the original scan quality. For best results with scanned documents, we recommend using a white background scan.',
        },
        {
          question: 'What happens to images in the PDF?',
          answer: 'Images are inverted along with the rest of the document. Photos may look unusual in dark mode - you can adjust the intensity to find a balance.',
        },
      ],
    },
    fr: {
      title: 'Générateur PDF Mode Sombre',
      description: 'Convertissez n\'importe quel PDF en mode sombre pour une lecture nocturne confortable. 100% côté client, vos fichiers ne quittent jamais votre navigateur.',
      intro: 'Transformez vos PDFs en documents mode sombre agréables pour les yeux. Parfait pour lire la nuit sans fatiguer vos yeux. Notre outil traite tout localement dans votre navigateur - vos fichiers ne sont jamais envoyés sur un serveur.',
      howItWorks: [
        'Uploadez votre fichier PDF par glisser-déposer ou sélection',
        'Ajustez l\'intensité de l\'obscurité avec le curseur',
        'Prévisualisez le résultat en temps réel',
        'Téléchargez votre PDF mode sombre instantanément',
      ],
      useCases: [
        'Lecture d\'articles académiques ou d\'ebooks la nuit',
        'Réduction de la fatigue oculaire pendant les longues sessions de lecture',
        'Préparation de documents pour écrans OLED pour économiser la batterie',
        'Rendre les documents plus accessibles aux utilisateurs sensibles à la lumière',
      ],
      benefits: [
        'Traitement 100% côté client - les fichiers ne quittent jamais votre appareil',
        'Aucune limite de taille - fonctionne avec les gros PDFs',
        'Préserve le texte, les images et la mise en forme',
        'Intensité ajustable selon vos préférences',
        'Gratuit et illimité',
      ],
      faq: [
        {
          question: 'Mon PDF est-il envoyé sur un serveur ?',
          answer: 'Non ! Tout se passe dans votre navigateur avec JavaScript. Vos fichiers ne quittent jamais votre appareil, garantissant confidentialité et sécurité.',
        },
        {
          question: 'Le texte restera-t-il recherchable ?',
          answer: 'Oui, la conversion en mode sombre préserve toutes les couches de texte. Vous pouvez toujours rechercher, sélectionner et copier le texte du PDF converti.',
        },
        {
          question: 'Ça fonctionne avec les PDFs scannés ?',
          answer: 'Oui, mais le résultat dépend de la qualité du scan original. Pour de meilleurs résultats, nous recommandons un scan sur fond blanc.',
        },
        {
          question: 'Que se passe-t-il pour les images dans le PDF ?',
          answer: 'Les images sont inversées avec le reste du document. Les photos peuvent paraître inhabituelles en mode sombre - ajustez l\'intensité pour trouver un équilibre.',
        },
      ],
    },
  },
  'pdf-flatten': {
    en: {
      title: 'PDF Flatten & Secure',
      description: 'Flatten PDF form fields and remove metadata to create a secure, non-editable document. 100% client-side processing.',
      intro: 'Secure your PDF documents by flattening form fields and removing sensitive metadata. Perfect for sharing contracts, filled forms, or any document you want to protect from modifications.',
      howItWorks: [
        'Upload your PDF with form fields or metadata',
        'Choose options: flatten forms, remove metadata, or both',
        'Preview the secured document',
        'Download your protected PDF',
      ],
      useCases: [
        'Sharing filled forms that shouldn\'t be modified',
        'Removing author information before distribution',
        'Creating print-ready PDFs from form documents',
        'Archiving documents in a permanent state',
      ],
      benefits: [
        'Prevent unauthorized modifications to form data',
        'Remove sensitive metadata (author, dates, software)',
        'Reduce file size by flattening complex forms',
        'Ensure consistent appearance across all viewers',
        '100% private - no server upload',
      ],
      faq: [
        {
          question: 'What does "flatten" mean?',
          answer: 'Flattening converts interactive form fields into static content. The values become part of the page, making them uneditable while preserving their appearance.',
        },
        {
          question: 'What metadata is removed?',
          answer: 'We remove author name, creation/modification dates, software information, and custom metadata. The visual content remains unchanged.',
        },
        {
          question: 'Can the flattening be reversed?',
          answer: 'No, flattening is permanent. Always keep a backup of your original document if you might need to edit it later.',
        },
        {
          question: 'Does this add password protection?',
          answer: 'No, this tool flattens and cleans the document. For password protection, you would need a different tool. However, flattening prevents casual editing.',
        },
      ],
    },
    fr: {
      title: 'PDF Aplatir & Sécuriser',
      description: 'Aplatissez les champs de formulaire PDF et supprimez les métadonnées pour créer un document sécurisé et non modifiable. Traitement 100% côté client.',
      intro: 'Sécurisez vos documents PDF en aplatissant les champs de formulaire et en supprimant les métadonnées sensibles. Parfait pour partager des contrats, formulaires remplis, ou tout document que vous voulez protéger des modifications.',
      howItWorks: [
        'Uploadez votre PDF avec champs de formulaire ou métadonnées',
        'Choisissez les options : aplatir les formulaires, supprimer les métadonnées, ou les deux',
        'Prévisualisez le document sécurisé',
        'Téléchargez votre PDF protégé',
      ],
      useCases: [
        'Partager des formulaires remplis qui ne doivent pas être modifiés',
        'Supprimer les informations d\'auteur avant distribution',
        'Créer des PDFs prêts à imprimer depuis des documents formulaire',
        'Archiver des documents dans un état permanent',
      ],
      benefits: [
        'Empêcher les modifications non autorisées des données de formulaire',
        'Supprimer les métadonnées sensibles (auteur, dates, logiciel)',
        'Réduire la taille du fichier en aplatissant les formulaires complexes',
        'Assurer une apparence cohérente sur tous les lecteurs',
        '100% privé - aucun envoi serveur',
      ],
      faq: [
        {
          question: 'Que signifie "aplatir" ?',
          answer: 'L\'aplatissement convertit les champs de formulaire interactifs en contenu statique. Les valeurs font partie de la page, les rendant non éditables tout en préservant leur apparence.',
        },
        {
          question: 'Quelles métadonnées sont supprimées ?',
          answer: 'Nous supprimons le nom de l\'auteur, les dates de création/modification, les informations logicielles et les métadonnées personnalisées. Le contenu visuel reste inchangé.',
        },
        {
          question: 'L\'aplatissement peut-il être inversé ?',
          answer: 'Non, l\'aplatissement est permanent. Gardez toujours une sauvegarde de votre document original si vous pourriez avoir besoin de le modifier plus tard.',
        },
        {
          question: 'Cela ajoute-t-il une protection par mot de passe ?',
          answer: 'Non, cet outil aplatit et nettoie le document. Pour la protection par mot de passe, vous auriez besoin d\'un autre outil. Cependant, l\'aplatissement empêche les modifications occasionnelles.',
        },
      ],
    },
  },
  'image-watermark': {
    en: {
      title: 'Image Watermark Pro',
      description: 'Add professional watermarks to your images. Protect your photos with customizable text overlays. 100% client-side.',
      intro: 'Protect your images with professional watermarks before sharing online. Perfect for photographers, sellers on marketplaces, and anyone who wants to prevent unauthorized use of their images.',
      howItWorks: [
        'Upload your image (JPG, PNG, WebP)',
        'Enter your watermark text',
        'Customize opacity, size, and pattern',
        'Download your protected image',
      ],
      useCases: [
        'Protecting product photos on marketplaces (Vinted, eBay, Airbnb)',
        'Adding copyright to photography portfolios',
        'Marking draft documents as "CONFIDENTIAL" or "DRAFT"',
        'Creating proof images before client payment',
      ],
      benefits: [
        'Tiled pattern covers the entire image',
        'Adjustable opacity to balance visibility and protection',
        'Works with any image format',
        'Fast processing entirely in your browser',
        'No watermarks on your watermarks - completely free',
      ],
      faq: [
        {
          question: 'Can the watermark be removed?',
          answer: 'A well-placed tiled watermark is very difficult to remove without damaging the image. For maximum protection, use medium opacity and cover the important parts of your image.',
        },
        {
          question: 'What image formats are supported?',
          answer: 'We support JPG, PNG, WebP, and most common image formats. The output is always a high-quality PNG to preserve the watermark clarity.',
        },
        {
          question: 'Is there a size limit?',
          answer: 'Since processing happens in your browser, it depends on your device. Most modern devices can handle images up to 50MP without issues.',
        },
        {
          question: 'Can I use a logo instead of text?',
          answer: 'Currently we support text watermarks only. Logo watermarking requires more complex processing and may be added in a future update.',
        },
      ],
    },
    fr: {
      title: 'Filigrane Image Pro',
      description: 'Ajoutez des filigranes professionnels à vos images. Protégez vos photos avec des superpositions de texte personnalisables. 100% côté client.',
      intro: 'Protégez vos images avec des filigranes professionnels avant de les partager en ligne. Parfait pour les photographes, vendeurs sur les marketplaces, et tous ceux qui veulent empêcher l\'utilisation non autorisée de leurs images.',
      howItWorks: [
        'Uploadez votre image (JPG, PNG, WebP)',
        'Entrez votre texte de filigrane',
        'Personnalisez l\'opacité, la taille et le motif',
        'Téléchargez votre image protégée',
      ],
      useCases: [
        'Protéger les photos de produits sur les marketplaces (Vinted, eBay, Airbnb)',
        'Ajouter un copyright aux portfolios de photographie',
        'Marquer les documents brouillons comme "CONFIDENTIEL" ou "BROUILLON"',
        'Créer des images de preuve avant paiement client',
      ],
      benefits: [
        'Le motif en tuiles couvre toute l\'image',
        'Opacité ajustable pour équilibrer visibilité et protection',
        'Fonctionne avec tous les formats d\'image',
        'Traitement rapide entièrement dans votre navigateur',
        'Pas de filigrane sur vos filigranes - entièrement gratuit',
      ],
      faq: [
        {
          question: 'Le filigrane peut-il être supprimé ?',
          answer: 'Un filigrane en tuiles bien placé est très difficile à supprimer sans endommager l\'image. Pour une protection maximale, utilisez une opacité moyenne et couvrez les parties importantes de votre image.',
        },
        {
          question: 'Quels formats d\'image sont supportés ?',
          answer: 'Nous supportons JPG, PNG, WebP, et la plupart des formats d\'image courants. La sortie est toujours un PNG haute qualité pour préserver la clarté du filigrane.',
        },
        {
          question: 'Y a-t-il une limite de taille ?',
          answer: 'Puisque le traitement se fait dans votre navigateur, cela dépend de votre appareil. La plupart des appareils modernes peuvent gérer des images jusqu\'à 50MP sans problème.',
        },
        {
          question: 'Puis-je utiliser un logo au lieu de texte ?',
          answer: 'Actuellement nous supportons uniquement les filigranes texte. Le filigrane par logo nécessite un traitement plus complexe et pourrait être ajouté dans une future mise à jour.',
        },
      ],
    },
  },
};

export function getToolContent(toolId: string, lang: string): ToolContent | undefined {
  const toolContent = TOOL_CONTENT[toolId];
  if (!toolContent) return undefined;
  return toolContent[lang] || toolContent['en'];
}
