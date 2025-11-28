import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FolderOpen,
  Info,
  BookOpen,
  Braces,
  Table,
  Code,
  FileCode,
  Database,
  FileText,
  Globe,
  Video,
  Music,
  Image,
  Film,
} from 'lucide-react';
import { locales, localeHtmlLang, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import {
  WIKI_FORMATS,
  WIKI_FORMAT_IDS,
  getWikiFormatBySlug,
  getWikiContent,
} from '@/config/glossary';
import SmartSidebar from '@/components/smart-sidebar';
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
  Image,
  Film,
};

interface PageProps {
  params: Promise<{ lang: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const params: Array<{ lang: string; slug: string }> = [];

  for (const locale of locales) {
    for (const formatId of WIKI_FORMAT_IDS) {
      params.push({
        lang: locale,
        slug: formatId,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const format = getWikiFormatBySlug(slug);

  if (!format) {
    return { title: 'Format not found' };
  }

  const content = getWikiContent(format.id, lang);

  if (!content) {
    return { title: 'Format not found' };
  }

  const canonicalUrl = `${BASE_URL}/${lang}/wiki/${slug}`;

  const alternateUrls = Object.fromEntries(
    locales.map((l) => [localeHtmlLang[l], `${BASE_URL}/${l}/wiki/${slug}`])
  );

  return {
    title: content.title,
    description: content.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      title: content.title,
      description: content.metaDescription,
      url: canonicalUrl,
      type: 'article',
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function WikiPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const format = getWikiFormatBySlug(slug);

  if (!format) {
    return <div>Format not found</div>;
  }

  const content = getWikiContent(format.id, lang);

  if (!content) {
    return <div>Content not found</div>;
  }

  // Get CTA link based on format category
  let ctaHref = `/${lang}`;
  if (format.category === 'data') {
    ctaHref = `/${lang}/${format.id}-to-json`;
  } else if (format.category === 'document' && format.id === 'pdf') {
    ctaHref = `/${lang}/tools/pdf-dark-mode`;
  } else if (format.category === 'media') {
    ctaHref = `/${lang}/tools/video-to-audio`;
  } else if (format.category === 'image' && format.id === 'gif') {
    ctaHref = `/${lang}/tools/gif-maker`;
  }

  const IconComponent = ICONS[format.icon] || FileText;

  // JSON-LD for FAQ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: lang === 'fr'
          ? `Qu'est-ce qu'un fichier ${format.extension} ?`
          : `What is a ${format.extension} file?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: content.whatIs.substring(0, 500),
        },
      },
      {
        '@type': 'Question',
        name: lang === 'fr'
          ? `Comment ouvrir un fichier ${format.extension} ?`
          : `How do I open a ${format.extension} file?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: content.howToOpen.programs.join(', '),
        },
      },
    ],
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
          href={`${BASE_URL}/${locale}/wiki/${slug}`}
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
              <li>
                <Link
                  href={`/${lang}/wiki`}
                  className="text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Wiki
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
              <li className="text-zinc-900 font-medium">
                {format.extension.toUpperCase()}
              </li>
            </ol>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <article className="flex-1 min-w-0 max-w-3xl">
              {/* Header */}
              <header className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 ${format.color} rounded-2xl flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-zinc-500 font-medium uppercase tracking-wide">
                      {content.fullName}
                    </span>
                    <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight">
                      {lang === 'fr' ? `Qu'est-ce qu'un fichier ` : 'What is a '}
                      <span className={`${format.color.replace('bg-', 'text-')}`}>
                        {format.extension}
                      </span>
                      {lang === 'fr' ? ' ?' : ' file?'}
                    </h1>
                  </div>
                </div>

                <p className="text-xl text-zinc-600 leading-relaxed">
                  {content.intro}
                </p>
              </header>

              {/* Ad Unit */}
              <AdUnit position="header" className="mb-10" />

              {/* Technical Details Card */}
              <section className="mb-10">
                <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900">
                      {lang === 'fr' ? 'Fiche Technique' : 'Technical Details'}
                    </h2>
                  </div>

                  <dl className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-zinc-200">
                      <dt className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                        {lang === 'fr' ? 'Développeur' : 'Developer'}
                      </dt>
                      <dd className="font-medium text-zinc-900">
                        {content.technicalDetails.developer}
                      </dd>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-zinc-200">
                      <dt className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                        {lang === 'fr' ? 'Première sortie' : 'First Released'}
                      </dt>
                      <dd className="font-medium text-zinc-900">
                        {content.technicalDetails.firstReleased}
                      </dd>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-zinc-200">
                      <dt className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                        MIME Type
                      </dt>
                      <dd className="font-mono text-sm text-zinc-900">
                        {content.technicalDetails.mimeType}
                      </dd>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-zinc-200">
                      <dt className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                        Extension
                      </dt>
                      <dd className="font-mono text-sm text-zinc-900">
                        {content.technicalDetails.fileExtension}
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>

              {/* What Is Section */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                  {lang === 'fr' ? `Qu'est-ce que le format ${format.id.toUpperCase()} ?` : `What is ${format.id.toUpperCase()}?`}
                </h2>
                <div className="prose prose-zinc max-w-none">
                  <div className="text-lg text-zinc-700 leading-relaxed whitespace-pre-line">
                    {content.whatIs}
                  </div>
                </div>
              </section>

              {/* Characteristics */}
              <section className="mb-10">
                <div className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8">
                  <h2 className="text-xl font-bold text-zinc-900 mb-6">
                    {lang === 'fr' ? 'Caractéristiques' : 'Key Characteristics'}
                  </h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {content.characteristics.map((char, index) => (
                      <li key={index} className="flex items-start gap-3 text-zinc-600">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* How to Open */}
              <section className="mb-10">
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900">
                      {lang === 'fr' ? `Comment ouvrir un fichier ${format.extension} ?` : `How to Open ${format.extension} Files`}
                    </h2>
                  </div>
                  <p className="text-zinc-700 mb-4">{content.howToOpen.description}</p>
                  <ul className="space-y-2">
                    {content.howToOpen.programs.map((program, index) => (
                      <li key={index} className="flex items-center gap-3 text-zinc-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>{program}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Common Uses */}
              <section className="mb-10">
                <h2 className="text-xl font-bold text-zinc-900 mb-4">
                  {lang === 'fr' ? 'Utilisations Courantes' : 'Common Uses'}
                </h2>
                <ul className="space-y-3">
                  {content.commonUses.map((use, index) => (
                    <li key={index} className="flex items-start gap-3 text-zinc-600">
                      <ArrowRight className="w-5 h-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Pros and Cons */}
              <section className="mb-10">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">
                  {lang === 'fr' ? 'Avantages et Inconvénients' : 'Pros and Cons'}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      {lang === 'fr' ? 'Avantages' : 'Pros'}
                    </h3>
                    <ul className="space-y-2">
                      {content.prosAndCons.pros.map((pro, index) => (
                        <li key={index} className="text-emerald-900 text-sm">
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                    <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      {lang === 'fr' ? 'Inconvénients' : 'Cons'}
                    </h3>
                    <ul className="space-y-2">
                      {content.prosAndCons.cons.map((con, index) => (
                        <li key={index} className="text-red-900 text-sm">
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* CTA Box */}
              <section className="mb-10">
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {content.ctaTitle}
                  </h2>
                  <p className="text-zinc-300 mb-6 max-w-lg mx-auto">
                    {content.ctaDescription}
                  </p>
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-zinc-900 bg-white rounded-xl hover:bg-zinc-100 transition-all duration-200 shadow-lg active:scale-[0.98]"
                  >
                    {content.ctaButtonText}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </section>

              {/* Ad Unit */}
              <AdUnit position="below-result" className="mb-10" />

              {/* Related Formats */}
              <section className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-zinc-200 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-zinc-600" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900">
                    {lang === 'fr' ? 'Formats Connexes' : 'Related Formats'}
                  </h2>
                </div>

                <div className="grid gap-4">
                  {content.relatedFormats.map((relatedId) => {
                    const relatedFormat = getWikiFormatBySlug(relatedId);
                    const relatedContent = getWikiContent(relatedId, lang);
                    if (!relatedFormat || !relatedContent) return null;
                    const RelatedIcon = ICONS[relatedFormat.icon] || FileText;

                    return (
                      <Link
                        key={relatedId}
                        href={`/${lang}/wiki/${relatedId}`}
                        className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all"
                      >
                        <div className={`w-12 h-12 ${relatedFormat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <RelatedIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-zinc-900 group-hover:text-zinc-700">
                            {relatedFormat.extension.toUpperCase()} - {relatedContent.fullName}
                          </h3>
                          <p className="text-sm text-zinc-500 truncate">
                            {relatedContent.intro.substring(0, 80)}...
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            </article>

            {/* Smart Sidebar */}
            <SmartSidebar lang={lang} currentContext="wiki" currentSlug={slug} />
          </div>
        </div>
      </div>
    </>
  );
}
