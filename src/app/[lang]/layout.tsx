import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import { FileJson, Globe, ChevronDown, Shield, Zap, Lock } from 'lucide-react';
import { locales, localeHtmlLang, localeOG, localeNames, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
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
      <body className="font-sans bg-zinc-50 text-zinc-900 min-h-screen flex flex-col antialiased">
        {/* Premium Glass Navbar */}
        <header className="glass-navbar sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link
                href={`/${lang}`}
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all duration-200">
                    <FileJson className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-zinc-900 tracking-tight">
                    {dict.meta.siteName}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider hidden sm:block">
                    {dict.home.privacyFirst}
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  href={`/${lang}`}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
                >
                  {dict.common.home}
                </Link>
                <Link
                  href={`/${lang}/json-to-csv`}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
                >
                  JSON → CSV
                </Link>
                <Link
                  href={`/${lang}/csv-to-json`}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
                >
                  CSV → JSON
                </Link>
                <Link
                  href={`/${lang}/json-to-yaml`}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
                >
                  JSON → YAML
                </Link>
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Security Badge */}
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                  <Shield className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-medium text-green-700">100% Secure</span>
                </div>

                {/* Language Switcher */}
                <div className="relative group">
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
                    aria-label="Change language"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">{localeNames[lang]}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-zinc-200 shadow-elevated opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div className="p-1">
                      {locales.map((locale) => (
                        <Link
                          key={locale}
                          href={`/${locale}`}
                          className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors duration-150 ${
                            locale === lang
                              ? 'bg-indigo-50 text-indigo-700 font-medium'
                              : 'text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          <span className="text-base">{getLanguageFlag(locale)}</span>
                          <span>{localeNames[locale]}</span>
                          {locale === lang && (
                            <span className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Premium Footer */}
        <footer className="bg-zinc-900 text-zinc-400 mt-auto">
          {/* Trust Badges */}
          <div className="border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{dict.home.feature1Title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{dict.footer.securityNote}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{dict.home.feature2Title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{dict.home.instantProcessing}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{dict.home.feature3Title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{dict.home.privacyFirst}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center">
                    <FileJson className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-white">{dict.meta.siteName}</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-500 max-w-xs">
                  {dict.footer.aboutText}
                </p>
              </div>

              {/* Popular Conversions */}
              <div>
                <h3 className="font-semibold text-white text-sm mb-4">{dict.common.popularConversions}</h3>
                <ul className="space-y-2.5">
                  {[
                    { href: 'json-to-csv', label: 'JSON → CSV' },
                    { href: 'csv-to-json', label: 'CSV → JSON' },
                    { href: 'json-to-xml', label: 'JSON → XML' },
                    { href: 'json-to-yaml', label: 'JSON → YAML' },
                    { href: 'csv-to-sql', label: 'CSV → SQL' },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={`/${lang}/${href}`}
                        className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* More Formats */}
              <div>
                <h3 className="font-semibold text-white text-sm mb-4">{dict.common.supportedFormats}</h3>
                <ul className="space-y-2.5">
                  {[
                    { href: 'xml-to-json', label: 'XML → JSON' },
                    { href: 'yaml-to-json', label: 'YAML → JSON' },
                    { href: 'json-to-sql', label: 'JSON → SQL' },
                    { href: 'csv-to-xml', label: 'CSV → XML' },
                    { href: 'json-to-markdown', label: 'JSON → Markdown' },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={`/${lang}/${href}`}
                        className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Info */}
              <div>
                <h3 className="font-semibold text-white text-sm mb-4">{dict.footer.info}</h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      href={`/${lang}`}
                      className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                    >
                      {dict.common.allConverters}
                    </Link>
                  </li>
                  <li>
                    <span className="text-sm text-zinc-600 cursor-not-allowed">
                      {dict.footer.privacyPolicy}
                    </span>
                  </li>
                  <li>
                    <span className="text-sm text-zinc-600 cursor-not-allowed">
                      {dict.footer.termsOfService}
                    </span>
                  </li>
                  <li>
                    <span className="text-sm text-zinc-600 cursor-not-allowed">
                      {dict.footer.contact}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-zinc-600">
                  &copy; {new Date().getFullYear()} {dict.meta.siteName}. {dict.footer.copyright}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {dict.footer.securityNote}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

// Helper function to get flag emoji for language
function getLanguageFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: '🇺🇸',
    fr: '🇫🇷',
    es: '🇪🇸',
    de: '🇩🇪',
    pt: '🇧🇷',
  };
  return flags[locale] || '🌐';
}
