'use client';

import Link from 'next/link';
import {
  Moon,
  FileCheck,
  Shield,
  Sparkles,
  ArrowRight,
  Zap,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

type PageContext = 'data' | 'pdf' | 'image' | 'guide';

interface SmartSidebarProps {
  lang: string;
  currentContext: PageContext;
  currentSlug?: string;
}

interface Suggestion {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

const iconMap = {
  Moon: <Moon className="w-5 h-5" />,
  FileCheck: <FileCheck className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  ImageIcon: <ImageIcon className="w-5 h-5" />,
};

export default function SmartSidebar({ lang, currentContext, currentSlug }: SmartSidebarProps) {
  const suggestions = getSuggestions(lang, currentContext, currentSlug);

  if (suggestions.length === 0) return null;

  const titles = {
    en: {
      data: 'Save More Time',
      pdf: 'More Data Tools',
      image: 'More Data Tools',
      guide: 'Try It Now',
    },
    fr: {
      data: 'Gagnez du temps',
      pdf: 'Plus d\'outils Data',
      image: 'Plus d\'outils Data',
      guide: 'Essayez maintenant',
    },
  };

  const subtitles = {
    en: {
      data: 'Discover our productivity tools',
      pdf: 'Convert your data formats instantly',
      image: 'Convert your data formats instantly',
      guide: 'Use the tool for free',
    },
    fr: {
      data: 'Découvrez nos outils de productivité',
      pdf: 'Convertissez vos formats de données',
      image: 'Convertissez vos formats de données',
      guide: 'Utilisez l\'outil gratuitement',
    },
  };

  const langKey = lang === 'fr' ? 'fr' : 'en';
  const title = titles[langKey][currentContext];
  const subtitle = subtitles[langKey][currentContext];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 space-y-4">
          <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-2xl border border-zinc-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 text-sm">{title}</h3>
                <p className="text-xs text-zinc-500">{subtitle}</p>
              </div>
            </div>

            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={suggestion.href}
                  className="group flex items-start gap-3 p-3 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-zinc-100 group-hover:bg-zinc-900 rounded-lg flex items-center justify-center transition-colors">
                    <span className="text-zinc-600 group-hover:text-white transition-colors">
                      {suggestion.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-zinc-900 group-hover:text-zinc-700 truncate">
                        {suggestion.title}
                      </span>
                      {suggestion.badge && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${suggestion.badgeColor || 'bg-violet-100 text-violet-700'}`}>
                          {suggestion.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                      {suggestion.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                </Link>
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {lang === 'fr' ? '100% Sécurisé' : '100% Secure'}
                </p>
                <p className="text-xs text-zinc-500">
                  {lang === 'fr' ? 'Traitement local uniquement' : 'Local processing only'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 shadow-lg safe-area-inset-bottom">
        <div className="px-4 py-3">
          <p className="text-xs font-medium text-zinc-500 mb-2">{title}</p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <Link
                key={index}
                href={suggestion.href}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors flex-shrink-0"
              >
                <span className="text-zinc-600">{suggestion.icon}</span>
                <span className="text-sm font-medium text-zinc-900 whitespace-nowrap">
                  {suggestion.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function getSuggestions(lang: string, context: PageContext, currentSlug?: string): Suggestion[] {
  const isFr = lang === 'fr';

  // Tool suggestions for data converter pages
  const toolSuggestions: Suggestion[] = [
    {
      href: `/${lang}/tools/pdf-dark-mode`,
      icon: iconMap.Moon,
      title: isFr ? 'PDF Mode Sombre' : 'PDF Dark Mode',
      description: isFr ? 'Lisez vos PDFs la nuit' : 'Read PDFs at night',
      badge: 'NEW',
      badgeColor: 'bg-violet-100 text-violet-700',
    },
    {
      href: `/${lang}/tools/pdf-flatten`,
      icon: iconMap.FileCheck,
      title: isFr ? 'PDF Sécurisé' : 'Secure PDF',
      description: isFr ? 'Aplatir & supprimer métadonnées' : 'Flatten & remove metadata',
    },
    {
      href: `/${lang}/tools/image-watermark`,
      icon: iconMap.Shield,
      title: isFr ? 'Filigrane Image' : 'Image Watermark',
      description: isFr ? 'Protégez vos photos' : 'Protect your photos',
      badge: 'PRO',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  // Data converter suggestions for tool pages
  const dataSuggestions: Suggestion[] = [
    {
      href: `/${lang}/json-to-csv`,
      icon: iconMap.FileText,
      title: 'JSON → CSV',
      description: isFr ? 'Convertir JSON en tableur' : 'Convert JSON to spreadsheet',
    },
    {
      href: `/${lang}/csv-to-json`,
      icon: iconMap.FileText,
      title: 'CSV → JSON',
      description: isFr ? 'Transformer vos données' : 'Transform your data',
    },
    {
      href: `/${lang}/json-to-xml`,
      icon: iconMap.FileText,
      title: 'JSON → XML',
      description: isFr ? 'Export format universel' : 'Universal format export',
    },
  ];

  // Guide-specific suggestions (the actual tool)
  if (context === 'guide') {
    if (currentSlug?.includes('pdf-dark-mode')) {
      return [toolSuggestions[0], ...dataSuggestions.slice(0, 2)];
    }
    if (currentSlug?.includes('pdf-flatten')) {
      return [toolSuggestions[1], ...dataSuggestions.slice(0, 2)];
    }
    if (currentSlug?.includes('watermark')) {
      return [toolSuggestions[2], ...dataSuggestions.slice(0, 2)];
    }
    return toolSuggestions;
  }

  // Data pages -> suggest tools
  if (context === 'data') {
    return toolSuggestions;
  }

  // Tool pages -> suggest data converters
  if (context === 'pdf' || context === 'image') {
    return dataSuggestions;
  }

  return toolSuggestions;
}
