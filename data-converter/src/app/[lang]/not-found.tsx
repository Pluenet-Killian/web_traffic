'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { FORMATS, getConversionSlug } from '@/config/formats';

const popularConversions = [
  { source: 'json', target: 'csv' },
  { source: 'csv', target: 'json' },
  { source: 'json', target: 'xml' },
  { source: 'json', target: 'yaml' },
  { source: 'xml', target: 'json' },
  { source: 'csv', target: 'sql' },
];

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-9xl font-bold text-gray-200 mb-4">404</div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, this conversion doesn&apos;t exist or the URL is incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/en"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Popular Conversions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularConversions.map(({ source, target }) => (
              <Link
                key={`${source}-${target}`}
                href={`/en/${getConversionSlug(source, target)}`}
                className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-medium"
              >
                <span className={`w-2 h-2 rounded-full ${FORMATS[source].color}`} />
                {FORMATS[source].label} → {FORMATS[target].label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
