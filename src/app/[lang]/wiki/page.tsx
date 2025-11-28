import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  Braces,
  Table,
  Code,
  FileCode,
  Database,
  FileText,
  Globe,
  Video,
  Music,
  Image as ImageIcon,
  Film,
} from 'lucide-react';
import { locales, localeHtmlLang, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import {
  WIKI_FORMATS,
  getWikiFormatsByCategory,
  getWikiContent,
  type FormatDefinition,
} from '@/config/glossary';
import AdUnit from '@/components/ad-unit';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://data-converter.com';

// Icon mapping
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Braces,
  Table,
  Code,
  FileCode,
  Database,
  FileText,
  Globe,
  Video,
  Music,
  Image: ImageIcon,
  Film,
};

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    en: 'File Format Wiki - Complete Guide to All File Types',
    fr: 'Wiki des Formats de Fichiers - Guide Complet',
    es: 'Wiki de Formatos de Archivo - Guia Completa',
    de: 'Dateiformat-Wiki - Kompletter Leitfaden',
    pt: 'Wiki de Formatos de Arquivo - Guia Completo',
  };

  const descriptions: Record<string, string> = {
    en: 'Learn about all file formats: JSON, CSV, XML, PDF, MP4, MP3, and more. Technical details, how to open, and conversion guides.',
    fr: 'Apprenez tout sur les formats de fichiers : JSON, CSV, XML, PDF, MP4, MP3 et plus. Détails techniques, comment ouvrir et guides de conversion.',
    es: 'Aprende sobre todos los formatos de archivo: JSON, CSV, XML, PDF, MP4, MP3 y mas. Detalles tecnicos y guias de conversion.',
    de: 'Erfahren Sie alles uber Dateiformate: JSON, CSV, XML, PDF, MP4, MP3 und mehr. Technische Details und Konvertierungsanleitungen.',
    pt: 'Aprenda sobre todos os formatos de arquivo: JSON, CSV, XML, PDF, MP4, MP3 e mais. Detalhes tecnicos e guias de conversao.',
  };

  const canonicalUrl = `${BASE_URL}/${lang}/wiki`;

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        locales.map((l) => [localeHtmlLang[l], `${BASE_URL}/${l}/wiki`])
      ),
    },
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

function FormatCard({ format, lang }: { format: FormatDefinition; lang: Locale }) {
  const content = getWikiContent(format.id, lang);
  const IconComponent = ICONS[format.icon] || FileText;

  if (!content) return null;

  return (
    <Link
      href={`/${lang}/wiki/${format.slug}`}
      className="group relative bg-white rounded-2xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 ${format.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
          <IconComponent className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-zinc-900 mb-1">
            {format.extension.toUpperCase()}
          </h3>
          <p className="text-sm text-zinc-500 mb-2">
            {content.fullName}
          </p>
          <p className="text-sm text-zinc-600 line-clamp-2">
            {content.intro.substring(0, 100)}...
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}

export default async function WikiIndexPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const dataFormats = getWikiFormatsByCategory('data');
  const documentFormats = getWikiFormatsByCategory('document');
  const mediaFormats = getWikiFormatsByCategory('media');
  const imageFormats = getWikiFormatsByCategory('image');

  const categoryTitles: Record<string, Record<string, string>> = {
    data: {
      en: 'Data Formats',
      fr: 'Formats de Données',
    },
    document: {
      en: 'Document Formats',
      fr: 'Formats de Documents',
    },
    media: {
      en: 'Audio & Video Formats',
      fr: 'Formats Audio & Vidéo',
    },
    image: {
      en: 'Image Formats',
      fr: 'Formats d\'Images',
    },
  };

  const pageContent = {
    en: {
      title: 'File Format Wiki',
      subtitle: 'Complete guide to understanding file formats',
      description: 'Learn about different file formats, their uses, and how to open them. Our comprehensive wiki covers data formats, documents, multimedia, and more.',
    },
    fr: {
      title: 'Wiki des Formats de Fichiers',
      subtitle: 'Guide complet pour comprendre les formats de fichiers',
      description: 'Apprenez tout sur les différents formats de fichiers, leurs utilisations et comment les ouvrir. Notre wiki complet couvre les formats de données, documents, multimédia et plus.',
    },
  };

  const content = pageContent[lang as 'en' | 'fr'] || pageContent.en;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href={`/${lang}`}
                className="text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                {dict.common.home}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
            <li className="text-zinc-900 font-medium">Wiki</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto mb-2">
            {content.subtitle}
          </p>
          <p className="text-zinc-500 max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Data Formats */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Braces className="w-5 h-5 text-yellow-600" />
            </div>
            {categoryTitles.data[lang] || categoryTitles.data.en}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataFormats.map((format) => (
              <FormatCard key={format.id} format={format} lang={lang} />
            ))}
          </div>
        </section>

        {/* Ad Unit */}
        <AdUnit position="inline" className="mb-16" />

        {/* Document Formats */}
        {documentFormats.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              {categoryTitles.document[lang] || categoryTitles.document.en}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentFormats.map((format) => (
                <FormatCard key={format.id} format={format} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {/* Media Formats */}
        {mediaFormats.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                <Video className="w-5 h-5 text-pink-600" />
              </div>
              {categoryTitles.media[lang] || categoryTitles.media.en}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaFormats.map((format) => (
                <FormatCard key={format.id} format={format} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {/* Image Formats */}
        {imageFormats.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
              </div>
              {categoryTitles.image[lang] || categoryTitles.image.en}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageFormats.map((format) => (
                <FormatCard key={format.id} format={format} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {lang === 'fr' ? 'Besoin de convertir des fichiers ?' : 'Need to convert files?'}
          </h2>
          <p className="text-zinc-300 mb-8 max-w-xl mx-auto">
            {lang === 'fr'
              ? 'Utilisez nos outils gratuits pour convertir vos fichiers entre différents formats instantanément.'
              : 'Use our free tools to convert your files between different formats instantly.'}
          </p>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-zinc-900 bg-white rounded-xl hover:bg-zinc-100 transition-all duration-200 shadow-lg"
          >
            {lang === 'fr' ? 'Voir tous les convertisseurs' : 'View All Converters'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
