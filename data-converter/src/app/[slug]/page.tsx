import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import {
  FORMATS,
  getAllConversions,
  parseConversionSlug,
  getConversionContent,
  getConversionSlug,
  getJsonLdData,
} from '@/config/formats';
import ConverterUI from '@/components/converter-ui';
import AdUnit, { AdSidebar } from '@/components/ad-unit';

// Configuration du site
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://data-converter.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Génération statique de toutes les pages de conversion
export async function generateStaticParams() {
  const conversions = getAllConversions();
  return conversions.map(({ source, target }) => ({
    slug: getConversionSlug(source, target),
  }));
}

// Métadonnées dynamiques pour le SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseConversionSlug(slug);

  if (!parsed) {
    return {
      title: 'Page non trouvée',
    };
  }

  const { source, target } = parsed;
  const content = getConversionContent(source, target);
  const canonicalUrl = `${BASE_URL}/${slug}`;

  return {
    title: content.title,
    description: content.metaDescription,
    keywords: [
      `convertir ${FORMATS[source].label} en ${FORMATS[target].label}`,
      `${FORMATS[source].label} vers ${FORMATS[target].label}`,
      `conversion ${FORMATS[source].label} ${FORMATS[target].label}`,
      `transformer ${FORMATS[source].label}`,
      'convertisseur en ligne',
      'outil gratuit',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: content.title,
      description: content.metaDescription,
      url: canonicalUrl,
      siteName: 'Data Converter',
      type: 'website',
      locale: 'fr_FR',
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

export default async function ConversionPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseConversionSlug(slug);

  // 404 si la conversion n'existe pas
  if (!parsed) {
    notFound();
  }

  const { source, target } = parsed;
  const sourceFormat = FORMATS[source];
  const targetFormat = FORMATS[target];
  const content = getConversionContent(source, target);
  const jsonLd = getJsonLdData(source, target, BASE_URL);

  // Conversions associées pour le maillage interne
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
            mainEntity: content.faqs.map((faq) => ({
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

      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                  Accueil
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <li className="text-gray-600">
                {sourceFormat.label} vers {targetFormat.label}
              </li>
            </ol>
          </div>
        </nav>

        {/* Header Ad */}
        <div className="container mx-auto px-4 py-4">
          <AdUnit position="header" />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <header className="mb-8">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à l&apos;accueil
                </Link>

                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-2 text-white font-bold rounded-lg ${sourceFormat.color}`}>
                    {sourceFormat.label}
                  </span>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                  <span className={`px-4 py-2 text-white font-bold rounded-lg ${targetFormat.color}`}>
                    {targetFormat.label}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {content.h1}
                </h1>

                <p className="text-lg text-gray-600 max-w-3xl">
                  {content.intro}
                </p>
              </header>

              {/* Converter Tool */}
              <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
                <ConverterUI source={source} target={target} />
              </section>

              {/* Below Result Ad */}
              <AdUnit position="below-result" className="mb-8" />

              {/* FAQ Section */}
              <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
                <div className="space-y-6">
                  {content.faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="p-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* Related Conversions */}
              <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-6">Conversions similaires</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedConversions.map(({ source: s, target: t }) => {
                    const relatedSlug = getConversionSlug(s, t);
                    return (
                      <Link
                        key={relatedSlug}
                        href={`/${relatedSlug}`}
                        className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        <span className={`w-2 h-2 rounded-full ${FORMATS[s].color}`} />
                        <span className="text-sm font-medium">
                          {FORMATS[s].label} → {FORMATS[t].label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Lien inverse */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Besoin de la conversion inverse ?</p>
                  <Link
                    href={`/${getConversionSlug(target, source)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Convertir {targetFormat.label} → {sourceFormat.label}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <AdSidebar />
          </div>
        </div>
      </main>
    </>
  );
}
