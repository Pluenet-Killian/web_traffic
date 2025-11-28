'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { FORMATS, FORMAT_IDS, getConversionSlug } from '@/config/formats';

export default function NotFound() {
  // Afficher les 6 conversions les plus populaires
  const popularConversions = [
    { source: 'json', target: 'csv' },
    { source: 'csv', target: 'json' },
    { source: 'json', target: 'xml' },
    { source: 'json', target: 'yaml' },
    { source: 'xml', target: 'json' },
    { source: 'csv', target: 'sql' },
  ];

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Code */}
        <div className="text-9xl font-bold text-gray-200 mb-4">404</div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page non trouvée
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Désolé, cette conversion n&apos;existe pas ou l&apos;URL est incorrecte.
          Vérifiez le format de l&apos;URL ou choisissez une conversion ci-dessous.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à l&apos;accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </div>

        {/* Popular Conversions */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Conversions populaires
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularConversions.map(({ source, target }) => (
              <Link
                key={`${source}-${target}`}
                href={`/${getConversionSlug(source, target)}`}
                className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-medium"
              >
                <span className={`w-2 h-2 rounded-full ${FORMATS[source].color}`} />
                {FORMATS[source].label} → {FORMATS[target].label}
              </Link>
            ))}
          </div>
        </div>

        {/* Format List */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Formats supportés :</p>
          <p className="mt-1">
            {FORMAT_IDS.map((id) => FORMATS[id].label).join(' • ')}
          </p>
        </div>
      </div>
    </main>
  );
}
