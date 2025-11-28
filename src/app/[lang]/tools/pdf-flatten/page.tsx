import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Wrench,
  ChevronDown,
} from 'lucide-react';
import { locales, localeHtmlLang, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import { getToolContent, TOOLS } from '@/config/tools';
import PdfFlattenClient from './client';
import SmartSidebar from '@/components/smart-sidebar';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://data-converter.com';
const TOOL_ID = 'pdf-flatten';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getToolContent(TOOL_ID, lang);
  const tool = TOOLS[TOOL_ID];

  if (!content) {
    return { title: 'Tool not found' };
  }

  const canonicalUrl = `${BASE_URL}/${lang}/tools/${tool.slug}`;

  const alternateUrls = Object.fromEntries(
    locales.map((l) => [localeHtmlLang[l], `${BASE_URL}/${l}/tools/${tool.slug}`])
  );

  return {
    title: content.title,
    description: content.description,
    keywords: [
      'pdf flatten',
      'flatten pdf forms',
      'remove pdf metadata',
      'pdf desensitizer',
      'secure pdf',
      'pdf converter',
      'free pdf tool',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonicalUrl,
      type: 'website',
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PdfFlattenPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = getToolContent(TOOL_ID, lang);
  const tool = TOOLS[TOOL_ID];

  if (!content) {
    return <div>Tool not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: content.title,
    description: content.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: content.benefits,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={localeHtmlLang[locale]}
          href={`${BASE_URL}/${locale}/tools/${tool.slug}`}
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
                  href={`/${lang}/tools`}
                  className="text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Tools
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
              <li className="text-zinc-900 font-medium">{content.title}</li>
            </ol>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-4xl">
          {/* Header */}
          <header className="mb-8">
            <Link
              href={`/${lang}/tools`}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1.5 text-sm font-bold text-white ${tool.color} rounded-lg`}>
                PDF
              </span>
              <span className="px-3 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg">
                Flatten & Secure
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight mb-4">
              {content.title}
            </h1>

            <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
              {content.intro}
            </p>
          </header>

          {/* Tool UI */}
          <section className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 lg:p-8 mb-8">
            <PdfFlattenClient lang={lang} />
          </section>

          {/* How It Works */}
          <section className="mb-8">
            <div className="feature-card">
              <div className="feature-icon">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                {lang === 'fr' ? 'Comment ça marche' : 'How It Works'}
              </h2>
              <ol className="space-y-3">
                {content.howItWorks.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-zinc-600">
                    <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 text-sm font-medium flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Use Cases & Benefits */}
          <section className="mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Use Cases */}
              <div className="feature-card">
                <div className="feature-icon">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                  {lang === 'fr' ? 'Cas d\'utilisation' : 'Use Cases'}
                </h2>
                <ul className="space-y-3">
                  {content.useCases.map((useCase, index) => (
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
                  {lang === 'fr' ? 'Avantages' : 'Benefits'}
                </h2>
                <ul className="space-y-3">
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-zinc-600">
                      <CheckCircle2 className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">FAQ</h2>

            <div className="space-y-3">
              {content.faq.map((item, index) => (
                <details key={index} className="accordion-item group">
                  <summary className="accordion-trigger list-none">
                    <span className="pr-4">{item.question}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="accordion-content">
                    <p className="leading-relaxed">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
            </div>

            {/* Smart Sidebar */}
            <SmartSidebar lang={lang} currentContext="pdf" currentSlug={TOOL_ID} />
          </div>
        </div>
      </div>
    </>
  );
}
