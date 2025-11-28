import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Wrench,
  ArrowRight,
  ChevronDown,
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
import AdUnit from '@/components/ad-unit';
import SmartSidebar from '@/components/smart-sidebar';

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
  const semanticContent = getConversionContent(source, target, lang, sourceLabel, targetLabel);

  const h1 = t(dict.seo.h1Template, { source: sourceLabel, target: targetLabel });
  const intro = semanticContent.intro;

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

  const relatedConversions = getAllConversions()
    .filter((c) => (c.source === source || c.target === target) && !(c.source === source && c.target === target))
    .slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={localeHtmlLang[locale]}
          href={`${BASE_URL}/${locale}/${slug}`}
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
              <li className="text-zinc-900 font-medium">
                {sourceLabel} → {targetLabel}
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
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {dict.common.backToHome}
                </Link>

                {/* Format Badges */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1.5 text-sm font-bold text-zinc-900 bg-zinc-200 rounded-lg">
                    {sourceLabel}
                  </span>
                  <ArrowRight className="w-5 h-5 text-zinc-400" />
                  <span className="px-3 py-1.5 text-sm font-bold text-zinc-900 bg-zinc-200 rounded-lg">
                    {targetLabel}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight mb-4">
                  {h1}
                </h1>

                <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
                  {intro}
                </p>
              </header>

              {/* Converter */}
              <section className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 lg:p-8 mb-8">
                <ConverterUI source={source} target={target} dict={dict} lang={lang} />
              </section>

              <AdUnit position="below-result" className="mb-8" />

              {/* Use Cases & Benefits */}
              <section className="mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Use Cases */}
                  <div className="feature-card">
                    <div className="feature-icon">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                      {dict.seo?.useCasesTitle || 'Common Use Cases'}
                    </h2>
                    <ul className="space-y-3">
                      {semanticContent.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start gap-3 text-zinc-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0" />
                          <span className="leading-relaxed">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="feature-card">
                    <div className="feature-icon">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                      {dict.seo?.benefitsTitle || 'Benefits'}
                    </h2>
                    <ul className="space-y-3">
                      {semanticContent.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 text-zinc-600">
                          <CheckCircle2 className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical Note */}
                <div className="mt-6 feature-card">
                  <div className="flex items-start gap-4">
                    <div className="feature-icon">
                      <Wrench className="w-5 h-5" />
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

              {/* FAQ */}
              <section className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8 mb-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">FAQ</h2>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="accordion-item group"
                    >
                      <summary className="accordion-trigger list-none">
                        <span className="pr-4">{faq.question}</span>
                        <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                      </summary>
                      <div className="accordion-content">
                        <p className="leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* Related */}
              <section className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8">
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
                        className="conversion-card group"
                      >
                        <span className="font-medium text-sm text-zinc-700 group-hover:text-zinc-900">
                          {sLabel} → {tLabel}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                      </Link>
                    );
                  })}
                </div>

                {/* Reverse */}
                <div className="mt-8 pt-6 border-t border-zinc-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-zinc-600">{dict.seo.reverseConversion}</p>
                    </div>
                    <Link
                      href={`/${lang}/${getConversionSlug(target, source)}`}
                      className="btn-primary"
                    >
                      {targetLabel} → {sourceLabel}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Smart Sidebar for Cross-Selling */}
            <SmartSidebar lang={lang} currentContext="data" currentSlug={slug} />
          </div>
        </div>
      </div>
    </>
  );
}
