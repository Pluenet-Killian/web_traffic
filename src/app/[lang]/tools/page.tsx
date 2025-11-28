import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  Moon,
  FileCheck,
  Shield,
  ArrowRight,
  Music,
  VolumeX,
  Image,
} from 'lucide-react';
import { locales, localeHtmlLang, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import { getAllTools, getToolsByCategory, getToolContent } from '@/config/tools';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://data-converter.com';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const title = lang === 'fr'
    ? 'Outils PDF, Image & Vidéo Gratuits - Traitement 100% Client-Side'
    : 'Free PDF, Image & Video Tools - 100% Client-Side Processing';

  const description = lang === 'fr'
    ? 'Outils gratuits pour manipuler vos PDFs, images et vidéos. Mode sombre PDF, filigranes, extraction audio, création de GIF. Tout se passe dans votre navigateur.'
    : 'Free tools to manipulate your PDFs, images and videos. PDF dark mode, watermarks, audio extraction, GIF maker. Everything happens in your browser.';

  const canonicalUrl = `${BASE_URL}/${lang}/tools`;

  const alternateUrls = Object.fromEntries(
    locales.map((l) => [localeHtmlLang[l], `${BASE_URL}/${l}/tools`])
  );

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: dict.meta.siteName,
      type: 'website',
      locale: lang,
    },
  };
}

const iconMap = {
  Moon,
  FileCheck,
  Shield,
  Music,
  VolumeX,
  Image,
};

export default async function ToolsPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const pdfTools = getToolsByCategory('pdf');
  const imageTools = getToolsByCategory('image');
  const videoTools = getToolsByCategory('video');

  const title = lang === 'fr' ? 'Outils PDF, Image & Vidéo' : 'PDF, Image & Video Tools';
  const subtitle = lang === 'fr'
    ? 'Outils gratuits et 100% client-side pour manipuler vos fichiers'
    : 'Free, 100% client-side tools to manipulate your files';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: subtitle,
    url: `${BASE_URL}/${lang}/tools`,
    hasPart: getAllTools().map((tool) => {
      const content = getToolContent(tool.id, lang);
      return {
        '@type': 'SoftwareApplication',
        name: content?.title || tool.id,
        description: content?.description,
        url: `${BASE_URL}/${lang}/tools/${tool.slug}`,
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={localeHtmlLang[locale]}
          href={`${BASE_URL}/${locale}/tools`}
        />
      ))}

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
              <li className="text-zinc-900 font-medium">Tools</li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-fade" />
          <div className="absolute inset-0 bg-radial-fade" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {dict.footer.securityNote}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
                {title.split(' ').slice(0, 1).join(' ')}{' '}
                <span className="text-gradient bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
                  {title.split(' ').slice(1).join(' ')}
                </span>
              </h1>

              <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* PDF Tools */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1.5 text-sm font-bold text-white bg-violet-500 rounded-lg">
                PDF
              </span>
              <h2 className="text-xl font-semibold text-zinc-900">
                {lang === 'fr' ? 'Outils PDF' : 'PDF Tools'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pdfTools.map((tool) => {
                const content = getToolContent(tool.id, lang);
                const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || Moon;

                return (
                  <Link
                    key={tool.id}
                    href={`/${lang}/tools/${tool.slug}`}
                    className="group p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-semibold text-zinc-900 mb-2 group-hover:text-zinc-700">
                      {content?.title || tool.id}
                    </h3>

                    <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                      {content?.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors">
                      <span>{lang === 'fr' ? 'Utiliser l\'outil' : 'Use tool'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Image Tools */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1.5 text-sm font-bold text-white bg-emerald-500 rounded-lg">
                IMAGE
              </span>
              <h2 className="text-xl font-semibold text-zinc-900">
                {lang === 'fr' ? 'Outils Image' : 'Image Tools'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageTools.map((tool) => {
                const content = getToolContent(tool.id, lang);
                const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || Shield;

                return (
                  <Link
                    key={tool.id}
                    href={`/${lang}/tools/${tool.slug}`}
                    className="group p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-semibold text-zinc-900 mb-2 group-hover:text-zinc-700">
                      {content?.title || tool.id}
                    </h3>

                    <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                      {content?.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors">
                      <span>{lang === 'fr' ? 'Utiliser l\'outil' : 'Use tool'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Video Tools */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1.5 text-sm font-bold text-white bg-pink-500 rounded-lg">
                VIDEO
              </span>
              <h2 className="text-xl font-semibold text-zinc-900">
                {lang === 'fr' ? 'Outils Vidéo' : 'Video Tools'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoTools.map((tool) => {
                const content = getToolContent(tool.id, lang);
                const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || Music;

                return (
                  <Link
                    key={tool.id}
                    href={`/${lang}/tools/${tool.slug}`}
                    className="group p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-semibold text-zinc-900 mb-2 group-hover:text-zinc-700">
                      {content?.title || tool.id}
                    </h3>

                    <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                      {content?.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors">
                      <span>{lang === 'fr' ? 'Utiliser l\'outil' : 'Use tool'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Security Notice */}
          <section className="mt-12 p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">
                  {lang === 'fr' ? 'Confidentialité Garantie' : 'Privacy Guaranteed'}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {lang === 'fr'
                    ? 'Tous nos outils fonctionnent 100% dans votre navigateur. Vos fichiers ne sont jamais envoyés sur nos serveurs. Aucune donnée n\'est collectée.'
                    : 'All our tools work 100% in your browser. Your files are never sent to our servers. No data is collected.'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
