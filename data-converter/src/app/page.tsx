import Link from 'next/link';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { FORMATS, FORMAT_IDS, getAllConversions, getConversionSlug } from '@/config/formats';
import AdUnit from '@/components/ad-unit';

export default function Home() {
  const conversions = getAllConversions();

  // Grouper les conversions par format source
  const conversionsBySource = FORMAT_IDS.reduce((acc, source) => {
    acc[source] = conversions.filter((c) => c.source === source);
    return acc;
  }, {} as Record<string, typeof conversions>);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Convertisseur de Données
              <span className="block text-blue-200">Gratuit & Sécurisé</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              Transformez vos fichiers JSON, CSV, XML, YAML et SQL instantanément.
              <br />
              100% côté client - Vos données restent privées.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-400" />
                <div className="text-left">
                  <div className="font-bold text-2xl">{conversions.length}</div>
                  <div className="text-blue-200 text-sm">Conversions possibles</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-400" />
                <div className="text-left">
                  <div className="font-bold text-2xl">Instant</div>
                  <div className="text-blue-200 text-sm">Traitement rapide</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-cyan-400" />
                <div className="text-left">
                  <div className="font-bold text-2xl">100%</div>
                  <div className="text-blue-200 text-sm">Privacy-first</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="container mx-auto px-4 py-4">
        <AdUnit position="header" />
      </div>

      {/* Conversion Matrix */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4">
          Choisissez votre conversion
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Cliquez sur une conversion pour accéder à l&apos;outil dédié. Toutes les transformations
          sont effectuées localement dans votre navigateur.
        </p>

        {/* Format Cards */}
        <div className="space-y-8">
          {FORMAT_IDS.map((sourceId) => {
            const sourceFormat = FORMATS[sourceId];
            const targetConversions = conversionsBySource[sourceId];

            return (
              <div key={sourceId} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Source Header */}
                <div className={`${sourceFormat.color} px-6 py-4`}>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-xl">{sourceFormat.label}</span>
                    <span className="text-white/80 text-sm">vers...</span>
                  </div>
                  <p className="text-white/70 text-sm mt-1">{sourceFormat.description}</p>
                </div>

                {/* Target Links */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {targetConversions.map(({ target }) => {
                      const targetFormat = FORMATS[target];
                      const slug = getConversionSlug(sourceId, target);

                      return (
                        <Link
                          key={slug}
                          href={`/${slug}`}
                          className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full ${targetFormat.color}`} />
                            <span className="font-medium text-gray-800">{targetFormat.label}</span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Inline Ad */}
      <div className="container mx-auto px-4 py-4">
        <AdUnit position="inline" />
      </div>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi utiliser notre convertisseur ?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Sécurisé</h3>
              <p className="text-gray-600">
                Vos données ne quittent jamais votre navigateur. Aucun upload sur nos serveurs,
                traitement entièrement local.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ultra Rapide</h3>
              <p className="text-gray-600">
                Conversion instantanée grâce au traitement côté client. Pas d&apos;attente,
                pas de file d&apos;attente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gratuit & Illimité</h3>
              <p className="text-gray-600">
                Aucune limite de fichiers, aucun compte requis. Convertissez autant que vous voulez,
                gratuitement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Conversions List (SEO) */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Toutes les conversions disponibles</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {conversions.map(({ source, target }) => {
            const slug = getConversionSlug(source, target);
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {FORMATS[source].label} → {FORMATS[target].label}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
