import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import { Globe, ChevronDown } from 'lucide-react';
import { locales, localeHtmlLang, localeOG, localeNames, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import MegaMenu from '@/components/mega-menu';
import MobileMenu from '@/components/mobile-menu';
import FatFooter from '@/components/fat-footer';
import AdBillboard from '@/components/ad-billboard';
import ClientProviders from '@/components/client-providers';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://data-converter.com';

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
    <html lang={localeHtmlLang[lang]} className={`${inter.variable} ${jetbrainsMono.variable}`}>
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
      <body className="font-sans bg-white text-zinc-900 min-h-screen flex flex-col antialiased">
        <ClientProviders lang={lang}>
          {/* Premium Navbar */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href={`/${lang}`} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                    <span className="text-white font-bold text-sm">DC</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="font-semibold text-zinc-900 tracking-tight">
                      {dict.meta.siteName}
                    </span>
                    <span className="hidden md:inline text-zinc-400 text-sm ml-2">
                      Data Tools
                    </span>
                  </div>
                </Link>

                {/* Mega Menu (Desktop) */}
                <MegaMenu lang={lang} dict={dict} />

                {/* Right Side */}
                <div className="flex items-center gap-2">
                  {/* Language Switcher */}
                  <div className="relative group">
                    <button
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
                      aria-label="Change language"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="hidden sm:inline font-medium">{localeNames[lang]}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-zinc-200 shadow-xl shadow-zinc-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                      <div className="py-2">
                        {locales.map((locale) => (
                          <Link
                            key={locale}
                            href={`/${locale}`}
                            className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150 ${
                              locale === lang
                                ? 'bg-zinc-100 text-zinc-900 font-medium'
                                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                            }`}
                          >
                            <span>{localeNames[locale]}</span>
                            {locale === lang && (
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Menu */}
                  <MobileMenu lang={lang} dict={dict} />
                </div>
              </div>
            </div>
          </header>

          {/* Billboard Ad (Top of Page) */}
          <div className="bg-zinc-50 border-b border-zinc-200 py-4 hidden lg:block">
            <AdBillboard />
          </div>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Fat Footer */}
          <FatFooter lang={lang} dict={dict} />
        </ClientProviders>
      </body>
    </html>
  );
}
