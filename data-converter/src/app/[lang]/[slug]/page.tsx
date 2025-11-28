import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, CheckCircle, Lightbulb, Wrench } from 'lucide-react';
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://data-converter.com';

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

  // Generate alternate URLs for hreflang
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

export default async function ConversionPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const parsed = parseConversionSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { source, target } = parsed;
  const dict = await getDictionary(lang);
  const sourceFormat = FORMATS[source];
  const targetFormat = FORMATS[target];
  const sourceLabel = getFormatLabel(source, dict);
  const targetLabel = getFormatLabel(target, dict);
  const sourceDesc = getFormatDescription(source, dict);
  const targetDesc = getFormatDescription(target, dict);

  const jsonLd = getJsonLdData(source, target, lang, BASE_URL, dict);

  // Get semantic content from matrix
  const semanticContent = getConversionContent(source, target, lang, sourceLabel, targetLabel);

  // Generate dynamic content
  const h1 = t(dict.seo.h1Template, { source: sourceLabel, target: targetLabel });
  // Use semantic intro if available, otherwise fallback to template
  const intro = semanticContent.intro;

  // Generate FAQs - include semantic FAQ first for uniqueness
  const faqs = [
    // Semantic FAQ specific to this conversion pair (unique content)
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

      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href={`/${lang}`} className="text-blue-600 hover:text-blue-800">
                  {dict.common.home}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <li className="text-gray-600">
                {sourceLabel} → {targetLabel}
              </li>
            </ol>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-4">
          <AdUnit position="header" />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              {/* Header */}
              <header className="mb-8">
                <Link
                  href={`/${lang}`}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {dict.common.backToHome}
                </Link>

                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-2 text-white font-bold rounded-lg ${sourceFormat.color}`}>
                    {sourceLabel}
                  </span>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                  <span className={`px-4 py-2 text-white font-bold rounded-lg ${targetFormat.color}`}>
                    {targetLabel}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{h1}</h1>
                <p className="text-lg text-gray-600 max-w-3xl">{intro}</p>
              </header>

              {/* Converter Tool */}
              <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
                <ConverterUI source={source} target={target} dict={dict} />
              </section>

              <AdUnit position="below-result" className="mb-8" />

              {/* Semantic Content Section */}
              <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Use Cases */}
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      {dict.seo?.useCasesTitle || 'Common Use Cases'}
                    </h2>
                    <ul className="space-y-3">
                      {semanticContent.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="text-blue-500 mt-1">•</span>
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      {dict.seo?.benefitsTitle || 'Benefits'}
                    </h2>
                    <ul className="space-y-3">
                      {semanticContent.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical Note */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                    <Wrench className="w-5 h-5 text-gray-500" />
                    {dict.seo?.technicalNoteTitle || 'Technical Details'}
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {semanticContent.technicalNote}
                  </p>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">FAQ</h2>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="p-4 text-gray-600">{faq.answer}</div>
                    </details>
                  ))}
                </div>
              </section>

              {/* Related Conversions */}
              <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-6">{dict.common.relatedConversions}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedConversions.map(({ source: s, target: t }) => {
                    const relatedSlug = getConversionSlug(s, t);
                    const sLabel = getFormatLabel(s, dict);
                    const tLabel = getFormatLabel(t, dict);
                    return (
                      <Link
                        key={relatedSlug}
                        href={`/${lang}/${relatedSlug}`}
                        className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        <span className={`w-2 h-2 rounded-full ${FORMATS[s].color}`} />
                        <span className="text-sm font-medium">
                          {sLabel} → {tLabel}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">{dict.seo.reverseConversion}</p>
                  <Link
                    href={`/${lang}/${getConversionSlug(target, source)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t(dict.seo.convertReverse, { source: sourceLabel, target: targetLabel })}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            </div>

            <AdSidebar />
          </div>
        </div>
      </main>
    </>
  );
}
