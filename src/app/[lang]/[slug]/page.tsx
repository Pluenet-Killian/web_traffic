import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Wrench,
  ArrowRightLeft,
  Sparkles,
  ChevronDown,
  Target,
  Zap,
  Shield,
} from 'lucide-react';
import {
  FORMATS,
  getAllConversions,
  parseConversionSlug,
  getConversionSlug,
  getJsonLdData,
  getFormatLabel,
  getFormatDescription,
} from '@/config/formats';
import { locales, localeHtmlLang, type Locale } from '@/config/i18n';
import { getDictionary, t } from '@/dictionaries';
import { getConversionContent } from '@/config/content-matrix';
import ConverterUI from '@/components/converter-ui';
import AdUnit, { AdSidebar } from '@/components/ad-unit';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://data-converter.com';

interface PageProps {
  params: Promise<{ lang: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const conversions = getAllConversions();
  const params: Array<{ lang: string; slug: string }> = [];

  for (const locale of locales) {
    for (const { source, target } of conversions) {
      params.push({
        lang: locale,
        slug: getConversionSlug(source, target),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const parsed = parseConversionSlug(slug);

  if (!parsed) {
    return { title: 'Page not found' };
  }

  const { source, target } = parsed;
  const dict = await getDictionary(lang);
  const sourceLabel = getFormatLabel(source, dict);
  const targetLabel = getFormatLabel(target, dict);

  const title = t(dict.meta.titleTemplate, { source: sourceLabel, target: targetLabel });
  const description = t(dict.meta.descriptionTemplate, { source: sourceLabel, target: targetLabel });
  const canonicalUrl = `${BASE_URL}/${lang}/${slug}`;

  const alternateUrls = Object.fromEntries(
    locales.map((l) => [localeHtmlLang[l], `${BASE_URL}/${l}/${slug}`])
  );

  return {
    title,
    description,
    keywords: [
      `${sourceLabel} to ${targetLabel}`,
      `convert ${sourceLabel}`,
      `${sourceLabel} converter`,
      `${targetLabel} generator`,
      'online converter',
      'free tool',
    ],
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
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Format badge colors
function getFormatBadgeClasses(format: string): string {
  const colorMap: Record<string, string> = {
    json: 'bg-amber-500 text-white',
    csv: 'bg-emerald-500 text-white',
    xml: 'bg-orange-500 text-white',
    yaml: 'bg-rose-500 text-white',
    sql: 'bg-blue-500 text-white',
    markdown: 'bg-purple-500 text-white',
    html: 'bg-cyan-500 text-white',
  };
  return colorMap[format] || 'bg-zinc-500 text-white';
}

export default async function ConversionPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const parsed = parseConversionSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { source, target } = parsed;
  const dict = await getDictionary(lang);
  const sourceLabel = getFormatLabel(source, dict);
  const targetLabel = getFormatLabel(target, dict);
  const sourceDesc = getFormatDescription(source, dict);
  const targetDesc = getFormatDescription(target, dict);

  const jsonLd = getJsonLdData(source, target, lang, BASE_URL, dict);

  // Get semantic content from matrix
  const semanticContent = getConversionContent(source, target, lang, sourceLabel, targetLabel);

  // Generate dynamic content
  const h1 = t(dict.seo.h1Template, { source: sourceLabel, target: targetLabel });
  const intro = semanticContent.intro;

  // Generate FAQs
  const faqs = [
    semanticContent.faq,
    {
      question: t(dict.faq.q1, { source: sourceLabel, target: targetLabel }),
      answer: t(dict.faq.a1, { source: sourceLabel, target: targetLabel, sourceDesc, targetDesc }),
    },
    {
      question: dict.faq.q2,
      answer: t(dict.faq.a2, { source: sourceLabel }),
    },
    {
      question: t(dict.faq.q3, { source: sourceLabel }),
      answer: dict.faq.a3,
    },
    {
      question: t(dict.faq.q4, { source: sourceLabel, target: targetLabel }),
      answer: t(dict.faq.a4, { source: sourceLabel, target: targetLabel }),
    },
    {
      question: t(dict.faq.q5, { source: sourceLabel, target: targetLabel }),
      answer: t(dict.faq.a5, { source: sourceLabel, target: targetLabel }),
    },
  ];

  // Related conversions
  const relatedConversions = getAllConversions()
    .filter((c) => (c.source === source || c.target === target) && !(c.source === source && c.target === target))
    .slice(0, 6);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* Hreflang tags */}
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={localeHtmlLang[locale]}
          href={`${BASE_URL}/${locale}/${slug}`}
        />
      ))}

      <div className="min-h-screen bg-zinc-50">
        {/* Breadcrumb */}
        <nav className="bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href={`/${lang}`}
                  className="text-zinc-500 hover:text-indigo-600 transition-colors duration-200"
                >
                  {dict.common.home}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
              <li className="flex items-center gap-2 text-zinc-900 font-medium">
                <span className={`w-2 h-2 rounded-full ${getFormatBadgeClasses(source).replace('text-white', '')}`} />
                {sourceLabel}
                <span className="text-zinc-400">→</span>
                <span className={`w-2 h-2 rounded-full ${getFormatBadgeClasses(target).replace('text-white', '')}`} />
                {targetLabel}
              </li>
            </ol>
          </div>
        </nav>

        {/* Ad Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdUnit position="header" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <header className="mb-8">
                <Link
                  href={`/${lang}`}
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200 mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {dict.common.backToHome}
                </Link>

                {/* Format Badges */}
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-4 py-2 text-sm font-bold rounded-xl shadow-sm ${getFormatBadgeClasses(source)}`}>
                    {sourceLabel}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-zinc-400" />
                  </div>
                  <span className={`px-4 py-2 text-sm font-bold rounded-xl shadow-sm ${getFormatBadgeClasses(target)}`}>
                    {targetLabel}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight mb-4">
                  {h1}
                </h1>

                {/* Intro */}
                <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
                  {intro}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>{dict.home.instantProcessing}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>{dict.home.privacyFirst}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>{dict.home.feature3Title}</span>
                  </div>
                </div>
              </header>

              {/* Converter Tool */}
              <section className="bg-white rounded-2xl border border-zinc-200 shadow-subtle p-6 lg:p-8 mb-8">
                <ConverterUI source={source} target={target} dict={dict} />
              </section>

              <AdUnit position="below-result" className="mb-8" />

              {/* Use Cases & Benefits Section */}
              <section className="mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Use Cases Card */}
                  <div className="bg-white rounded-2xl border border-zinc-200 shadow-subtle p-6 hover:shadow-md hover:border-zinc-300 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Target className="w-5 h-5 text-amber-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-zinc-900">
                        {dict.seo?.useCasesTitle || 'Common Use Cases'}
                      </h2>
                    </div>
                    <ul className="space-y-3">
                      {semanticContent.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start gap-3 text-zinc-600">
                          <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Lightbulb className="w-3 h-3 text-amber-500" />
                          </div>
                          <span className="leading-relaxed">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits Card */}
                  <div className="bg-white rounded-2xl border border-zinc-200 shadow-subtle p-6 hover:shadow-md hover:border-zinc-300 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-zinc-900">
                        {dict.seo?.benefitsTitle || 'Benefits'}
                      </h2>
                    </div>
                    <ul className="space-y-3">
                      {semanticContent.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 text-zinc-600">
                          <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          </div>
                          <span className="leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical Note */}
                <div className="mt-6 bg-white rounded-2xl border border-zinc-200 shadow-subtle p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                        {dict.seo?.technicalNoteTitle || 'Technical Details'}
                      </h3>
                      <p className="text-zinc-600 leading-relaxed">
                        {semanticContent.technicalNote}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ Section - Accordion Style */}
              <section className="bg-white rounded-2xl border border-zinc-200 shadow-subtle p-6 lg:p-8 mb-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">FAQ</span>
                  </span>
                  Frequently Asked Questions
                </h2>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group rounded-xl border border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 transition-all duration-200 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none px-5 py-4">
                        <h3 className="font-medium text-zinc-900 pr-4 leading-relaxed">
                          {faq.question}
                        </h3>
                        <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0 group-hover:border-zinc-300 transition-all duration-200">
                          <ChevronDown className="w-4 h-4 text-zinc-500 group-open:rotate-180 transition-transform duration-200" />
                        </div>
                      </summary>
                      <div className="px-5 pb-5 pt-1">
                        <p className="text-zinc-600 leading-relaxed pl-0 border-l-2 border-indigo-200 pl-4">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* Related Conversions */}
              <section className="bg-white rounded-2xl border border-zinc-200 shadow-subtle p-6 lg:p-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">
                  {dict.common.relatedConversions}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {relatedConversions.map(({ source: s, target: t }) => {
                    const relatedSlug = getConversionSlug(s, t);
                    const sLabel = getFormatLabel(s, dict);
                    const tLabel = getFormatLabel(t, dict);
                    return (
                      <Link
                        key={relatedSlug}
                        href={`/${lang}/${relatedSlug}`}
                        className="group flex items-center gap-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${getFormatBadgeClasses(s).replace('text-white', '')}`} />
                          <span className="font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
                            {sLabel}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${getFormatBadgeClasses(t).replace('text-white', '')}`} />
                          <span className="font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
                            {tLabel}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Reverse Conversion CTA */}
                <div className="mt-8 pt-6 border-t border-zinc-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-zinc-600 mb-1">{dict.seo.reverseConversion}</p>
                      <p className="text-xs text-zinc-400">
                        {t(dict.seo.convertReverse, { source: sourceLabel, target: targetLabel })}
                      </p>
                    </div>
                    <Link
                      href={`/${lang}/${getConversionSlug(target, source)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      {targetLabel} → {sourceLabel}
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <AdSidebar />
          </div>
        </div>
      </div>
    </>
  );
}
