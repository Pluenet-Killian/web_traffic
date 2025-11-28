import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { FileJson, Github } from 'lucide-react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://data-converter.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Data Converter - Convertisseur JSON, CSV, XML, YAML, SQL Gratuit',
    template: '%s | Data Converter',
  },
  description:
    'Convertissez vos fichiers JSON, CSV, XML, YAML et SQL gratuitement. Outil 100% sécurisé, traitement côté client. Aucune donnée envoyée au serveur.',
  keywords: [
    'convertisseur json',
    'convertir csv',
    'json vers csv',
    'xml vers json',
    'yaml convertisseur',
    'sql export',
    'data converter',
    'outil conversion données',
    'gratuit',
    'en ligne',
  ],
  authors: [{ name: 'Data Converter' }],
  creator: 'Data Converter',
  publisher: 'Data Converter',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Data Converter',
    title: 'Data Converter - Convertisseur de Données Gratuit',
    description:
      'Convertissez JSON, CSV, XML, YAML et SQL instantanément. 100% sécurisé et gratuit.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data Converter - Convertisseur de Données Gratuit',
    description:
      'Convertissez JSON, CSV, XML, YAML et SQL instantanément. 100% sécurisé et gratuit.',
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
  verification: {
    // Ajouter vos codes de vérification ici
    // google: 'votre-code-google',
    // yandex: 'votre-code-yandex',
    // bing: 'votre-code-bing',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Preconnect pour les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Schema.org pour l'organisation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Data Converter',
              url: BASE_URL,
              description: 'Convertisseur de données en ligne gratuit et sécurisé',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${BASE_URL}/search?q={search_term_string}`,
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
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileJson className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl text-gray-900">Data Converter</span>
                  <span className="hidden sm:block text-xs text-gray-500">
                    Convertisseur de données gratuit
                  </span>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Accueil
                </Link>
                <Link
                  href="/json-to-csv"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  JSON → CSV
                </Link>
                <Link
                  href="/csv-to-json"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  CSV → JSON
                </Link>
                <Link
                  href="/json-to-xml"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  JSON → XML
                </Link>
              </nav>

              {/* CTA */}
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">{children}</div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {/* About */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FileJson className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-xl text-white">Data Converter</span>
                </div>
                <p className="text-sm leading-relaxed">
                  Convertissez vos données entre JSON, CSV, XML, YAML et SQL gratuitement.
                  Notre outil fonctionne entièrement dans votre navigateur pour garantir
                  la confidentialité de vos données.
                </p>
              </div>

              {/* Popular Conversions */}
              <div>
                <h3 className="font-semibold text-white mb-4">Conversions populaires</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/json-to-csv" className="hover:text-white transition-colors">
                      JSON vers CSV
                    </Link>
                  </li>
                  <li>
                    <Link href="/csv-to-json" className="hover:text-white transition-colors">
                      CSV vers JSON
                    </Link>
                  </li>
                  <li>
                    <Link href="/json-to-xml" className="hover:text-white transition-colors">
                      JSON vers XML
                    </Link>
                  </li>
                  <li>
                    <Link href="/json-to-yaml" className="hover:text-white transition-colors">
                      JSON vers YAML
                    </Link>
                  </li>
                  <li>
                    <Link href="/csv-to-sql" className="hover:text-white transition-colors">
                      CSV vers SQL
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-semibold text-white mb-4">Informations</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">
                      Tous les convertisseurs
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-500">Politique de confidentialité</span>
                  </li>
                  <li>
                    <span className="text-gray-500">Conditions d&apos;utilisation</span>
                  </li>
                  <li>
                    <span className="text-gray-500">Contact</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
              <p>
                &copy; {new Date().getFullYear()} Data Converter. Tous droits réservés.
              </p>
              <p className="mt-2 text-gray-500">
                Traitement 100% côté client - Vos données ne quittent jamais votre navigateur.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
