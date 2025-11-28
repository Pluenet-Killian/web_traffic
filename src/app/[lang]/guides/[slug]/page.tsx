import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { locales, localeHtmlLang, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import {
  GUIDES,
  GUIDE_IDS,
  getGuideBySlug,
  getGuideContent,
  getAllGuides,
} from '@/config/guides';
import { getToolContent, TOOLS } from '@/config/tools';
import SmartSidebar from '@/components/smart-sidebar';
import AdUnit from '@/components/ad-unit';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://data-converter.com';

interface PageProps {
  params: Promise<{ lang: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const params: Array<{ lang: string; slug: string }> = [];

  for (const locale of locales) {
    for (const guideId of GUIDE_IDS) {
      const guide = GUIDES[guideId];
      params.push({
        lang: locale,
        slug: guide.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: 'Guide not found' };
  }

  const content = getGuideContent(guide.id, lang);

  if (!content) {
    return { title: 'Guide not found' };
  }

  const canonicalUrl = `${BASE_URL}/${lang}/guides/${slug}`;

  const alternateUrls = Object.fromEntries(
    locales.map((l) => [localeHtmlLang[l], `${BASE_URL}/${l}/guides/${slug}`])
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

export default async function GuidePage({ params }: PageProps) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return <div>Guide not found</div>;
  }

  const content = getGuideContent(guide.id, lang);

  if (!content) {
    return <div>Guide not found</div>;
  }

  // Get CTA link
  let ctaHref = `/${lang}`;
  if (guide.toolId) {
    ctaHref = `/${lang}/tools/${TOOLS[guide.toolId]?.slug || guide.toolId}`;
  } else if (guide.conversionSlug) {
    ctaHref = `/${lang}/${guide.conversionSlug}`;
  }

  // Get related guides
  const relatedGuides = getAllGuides()
    .filter((g) => g.id !== guide.id)
    .slice(0, 3);

  // JSON-LD for Article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: content.title,
    description: content.metaDescription,
    step: content.solutionSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step,
    })),
    tool: guide.toolId
      ? {
          '@type': 'SoftwareApplication',
          name: getToolContent(guide.toolId, lang)?.title,
          url: ctaHref,
        }
      : undefined,
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
          href={`${BASE_URL}/${locale}/guides/${slug}`}
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
                  href={`/${lang}/guides`}
                  className="text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Guides
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
              <li className="text-zinc-900 font-medium truncate max-w-[200px]">
                {content.heroTitle}
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
                <Link
                  href={`/${lang}/guides`}
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {lang === 'fr' ? 'Retour aux guides' : 'Back to Guides'}
                </Link>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 text-xs font-medium text-zinc-600 bg-zinc-100 rounded-md uppercase tracking-wide">
                    {lang === 'fr' ? 'Guide' : 'Tutorial'}
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-sm text-zinc-500">
                    {lang === 'fr' ? '5 min de lecture' : '5 min read'}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight mb-4 leading-tight">
                  {content.heroTitle}
                </h1>

                <p className="text-xl text-zinc-600 leading-relaxed">
                  {content.heroSubtitle}
                </p>
              </header>

              {/* Ad Unit */}
              <AdUnit position="header" className="mb-10" />

              {/* Introduction */}
              <section className="prose prose-zinc max-w-none mb-10">
                <div className="text-lg text-zinc-700 leading-relaxed whitespace-pre-line">
                  {content.introduction}
                </div>
              </section>

              {/* Problem Section */}
              <section className="mb-10">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 mb-4">
                        {content.problemTitle}
                      </h2>
                      <div className="text-zinc-700 leading-relaxed whitespace-pre-line">
                        {content.problemDescription}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Solution Section */}
              <section className="mb-10">
                <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900">
                      {content.solutionTitle}
                    </h2>
                  </div>

                  <ol className="space-y-4">
                    {content.solutionSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-zinc-700 leading-relaxed pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
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

              {/* Tips Section */}
              <section className="mb-10">
                <div className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-violet-600" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900">
                      {lang === 'fr' ? 'Conseils Pro' : 'Pro Tips'}
                    </h2>
                  </div>

                  <ul className="space-y-3">
                    {content.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 text-zinc-600">
                        <CheckCircle2 className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Ad Unit */}
              <AdUnit position="below-result" className="mb-10" />

              {/* Related Guides */}
              <section className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-zinc-200 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-zinc-600" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900">
                    {content.relatedTitle}
                  </h2>
                </div>

                <div className="grid gap-4">
                  {relatedGuides.map((relatedGuide) => {
                    const relatedContent = getGuideContent(relatedGuide.id, lang);
                    if (!relatedContent) return null;

                    return (
                      <Link
                        key={relatedGuide.id}
                        href={`/${lang}/guides/${relatedGuide.slug}`}
                        className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-zinc-900 group-hover:text-zinc-700 truncate">
                            {relatedContent.heroTitle}
                          </h3>
                          <p className="text-sm text-zinc-500 truncate">
                            {relatedContent.heroSubtitle}
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
            <SmartSidebar lang={lang} currentContext="guide" currentSlug={slug} />
          </div>
        </div>
      </div>
    </>
  );
}
