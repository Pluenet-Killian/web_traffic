import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  BookOpen,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Database,
} from 'lucide-react';
import { locales, localeHtmlLang, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import { getAllGuides, getGuidesByCategory, getGuideContent } from '@/config/guides';

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
    ? 'Guides & Tutoriels - Comment Faire'
    : 'Guides & Tutorials - How To';

  const description = lang === 'fr'
    ? 'Apprenez comment convertir vos données, protéger vos images et manipuler vos PDFs avec nos guides gratuits.'
    : 'Learn how to convert your data, protect your images and manipulate your PDFs with our free guides.';

  const canonicalUrl = `${BASE_URL}/${lang}/guides`;

  const alternateUrls = Object.fromEntries(
    locales.map((l) => [localeHtmlLang[l], `${BASE_URL}/${l}/guides`])
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

const categoryIcons = {
  pdf: FileText,
  image: ImageIcon,
  data: Database,
};

const categoryLabels = {
  en: {
    pdf: 'PDF Guides',
    image: 'Image Guides',
    data: 'Data Guides',
  },
  fr: {
    pdf: 'Guides PDF',
    image: 'Guides Image',
    data: 'Guides Données',
  },
};

const categoryColors = {
  pdf: 'bg-violet-500',
  image: 'bg-emerald-500',
  data: 'bg-blue-500',
};

export default async function GuidesPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const pdfGuides = getGuidesByCategory('pdf');
  const imageGuides = getGuidesByCategory('image');
  const dataGuides = getGuidesByCategory('data');

  const title = lang === 'fr' ? 'Guides & Tutoriels' : 'Guides & Tutorials';
  const subtitle = lang === 'fr'
    ? 'Apprenez comment utiliser nos outils avec ces guides étape par étape'
    : 'Learn how to use our tools with these step-by-step guides';

  const langKey = lang === 'fr' ? 'fr' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: subtitle,
    url: `${BASE_URL}/${lang}/guides`,
    hasPart: getAllGuides().map((guide) => {
      const content = getGuideContent(guide.id, lang);
      return {
        '@type': 'HowTo',
        name: content?.title,
        description: content?.metaDescription,
        url: `${BASE_URL}/${lang}/guides/${guide.slug}`,
      };
    }),
  };

  const renderGuideSection = (
    guides: ReturnType<typeof getGuidesByCategory>,
    category: 'pdf' | 'image' | 'data'
  ) => {
    if (guides.length === 0) return null;

    const Icon = categoryIcons[category];
    const label = categoryLabels[langKey][category];
    const color = categoryColors[category];

    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-900">{label}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {guides.map((guide) => {
            const content = getGuideContent(guide.id, lang);
            if (!content) return null;

            return (
              <Link
                key={guide.id}
                href={`/${lang}/guides/${guide.slug}`}
                className="group p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-zinc-900 mb-2 group-hover:text-zinc-700">
                  {content.heroTitle}
                </h3>
                <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                  {content.heroSubtitle}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors">
                  <span>{lang === 'fr' ? 'Lire le guide' : 'Read guide'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
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
          href={`${BASE_URL}/${locale}/guides`}
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
              <li className="text-zinc-900 font-medium">Guides</li>
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
                <BookOpen className="w-4 h-4" />
                {lang === 'fr' ? 'Ressources gratuites' : 'Free Resources'}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
                {title.split(' ')[0]}{' '}
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
          {renderGuideSection(pdfGuides, 'pdf')}
          {renderGuideSection(imageGuides, 'image')}
          {renderGuideSection(dataGuides, 'data')}

          {/* Bottom CTA */}
          <section className="mt-12 bg-zinc-50 rounded-2xl border border-zinc-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">
              {lang === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}
            </h2>
            <p className="text-zinc-600 mb-6 max-w-lg mx-auto">
              {lang === 'fr'
                ? 'Tous nos outils sont 100% gratuits et fonctionnent directement dans votre navigateur.'
                : 'All our tools are 100% free and work directly in your browser.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${lang}/tools`}
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all"
              >
                {lang === 'fr' ? 'Voir les outils' : 'View Tools'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${lang}`}
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all"
              >
                {lang === 'fr' ? 'Convertisseurs' : 'Converters'}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
