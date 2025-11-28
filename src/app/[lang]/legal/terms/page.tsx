import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import { locales, localeHtmlLang, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import { getLegalContent } from '@/config/legal';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://data-converter.com';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const legal = getLegalContent(lang);

  const canonicalUrl = `${BASE_URL}/${lang}/legal/terms`;

  return {
    title: legal.terms.title,
    description: 'Terms of Service for Data Converter. Read our terms and conditions for using our free online data conversion tools.',
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        locales.map((l) => [localeHtmlLang[l], `${BASE_URL}/${l}/legal/terms`])
      ),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const legal = getLegalContent(lang);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
              <span className="text-zinc-500">Legal</span>
            </li>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
            <li className="text-zinc-900 font-medium">{legal.terms.title}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <FileText className="w-7 h-7 text-zinc-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">{legal.terms.title}</h1>
              <p className="text-zinc-500 mt-1">
                {lang === 'fr' ? 'Dernière mise à jour' : 'Last updated'}: {legal.terms.lastUpdated}
              </p>
            </div>
          </div>

          {/* Summary Banner */}
          <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-4">
            <p className="text-zinc-700 font-medium">
              {lang === 'fr'
                ? '📋 Résumé : Service gratuit fourni "tel quel". Pas de garantie. Traitement 100% côté client.'
                : '📋 Summary: Free service provided "as is". No warranty. 100% client-side processing.'}
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-zinc max-w-none">
          {legal.terms.sections.map((section, index) => (
            <section key={index} className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">{section.title}</h2>
              <div className="text-zinc-600 leading-relaxed whitespace-pre-line">
                {section.content.split('**').map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="text-zinc-900 font-semibold">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Related Links */}
        <footer className="mt-16 pt-8 border-t border-zinc-200">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">
            {lang === 'fr' ? 'Documents connexes' : 'Related Documents'}
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${lang}/legal/privacy`}
              className="text-sm text-zinc-600 hover:text-zinc-900 underline underline-offset-4"
            >
              {lang === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
            </Link>
            <Link
              href={`/${lang}/legal/cookies`}
              className="text-sm text-zinc-600 hover:text-zinc-900 underline underline-offset-4"
            >
              {lang === 'fr' ? 'Politique des Cookies' : 'Cookie Policy'}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
