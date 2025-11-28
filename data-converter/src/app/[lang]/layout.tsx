import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { FileJson, Globe } from 'lucide-react';
import { locales, localeHtmlLang, localeOG, localeNames, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://data-converter.com';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: dict.meta.siteName + ' - ' + dict.meta.siteDescription,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.siteDescription,
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}`])
      ),
    },
    openGraph: {
      type: 'website',
      locale: localeOG[lang],
      url: `${BASE_URL}/${lang}`,
      siteName: dict.meta.siteName,
      title: dict.meta.siteName,
      description: dict.meta.siteDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.siteName,
      description: dict.meta.siteDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html lang={localeHtmlLang[lang]}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Hreflang tags for SEO */}
        {locales.map((locale) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={localeHtmlLang[locale]}
            href={`${BASE_URL}/${locale}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/en`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: dict.meta.siteName,
              url: `${BASE_URL}/${lang}`,
              description: dict.meta.siteDescription,
              inLanguage: lang,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${BASE_URL}/${lang}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href={`/${lang}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileJson className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl text-gray-900">{dict.meta.siteName}</span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link href={`/${lang}`} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  {dict.common.home}
                </Link>
                <Link href={`/${lang}/json-to-csv`} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  JSON → CSV
                </Link>
                <Link href={`/${lang}/csv-to-json`} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  CSV → JSON
                </Link>
              </nav>

              {/* Language Switcher */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                  <Globe className="w-4 h-4" />
                  <span>{localeNames[lang]}</span>
                </button>
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {locales.map((locale) => (
                    <Link
                      key={locale}
                      href={`/${locale}`}
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                        locale === lang ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {localeNames[locale]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FileJson className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-xl text-white">{dict.meta.siteName}</span>
                </div>
                <p className="text-sm leading-relaxed">{dict.footer.aboutText}</p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">{dict.common.popularConversions}</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href={`/${lang}/json-to-csv`} className="hover:text-white">JSON → CSV</Link></li>
                  <li><Link href={`/${lang}/csv-to-json`} className="hover:text-white">CSV → JSON</Link></li>
                  <li><Link href={`/${lang}/json-to-xml`} className="hover:text-white">JSON → XML</Link></li>
                  <li><Link href={`/${lang}/json-to-yaml`} className="hover:text-white">JSON → YAML</Link></li>
                  <li><Link href={`/${lang}/csv-to-sql`} className="hover:text-white">CSV → SQL</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">{dict.footer.info}</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href={`/${lang}`} className="hover:text-white">{dict.common.allConverters}</Link></li>
                  <li><span className="text-gray-500">{dict.footer.privacyPolicy}</span></li>
                  <li><span className="text-gray-500">{dict.footer.termsOfService}</span></li>
                  <li><span className="text-gray-500">{dict.footer.contact}</span></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} {dict.meta.siteName}. {dict.footer.copyright}</p>
              <p className="mt-2 text-gray-500">{dict.footer.securityNote}</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
