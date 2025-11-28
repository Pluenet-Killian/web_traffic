import Link from 'next/link';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { FORMATS, FORMAT_IDS, getAllConversions, getConversionSlug, getFormatLabel } from '@/config/formats';
import { type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import AdUnit from '@/components/ad-unit';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const conversions = getAllConversions();

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
              {dict.home.heroTitle}
              <span className="block text-blue-200">{dict.home.heroSubtitle}</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              {dict.home.heroDescription}
            </p>

            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-400" />
                <div className="text-left">
                  <div className="font-bold text-2xl">{conversions.length}</div>
                  <div className="text-blue-200 text-sm">{dict.home.possibleConversions}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-400" />
                <div className="text-left">
                  <div className="font-bold text-2xl">Instant</div>
                  <div className="text-blue-200 text-sm">{dict.home.instantProcessing}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-cyan-400" />
                <div className="text-left">
                  <div className="font-bold text-2xl">100%</div>
                  <div className="text-blue-200 text-sm">{dict.home.privacyFirst}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-4">
        <AdUnit position="header" />
      </div>

      {/* Conversion Matrix */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4">{dict.home.chooseConversion}</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          {dict.home.chooseConversionDesc}
        </p>

        <div className="space-y-8">
          {FORMAT_IDS.map((sourceId) => {
            const sourceFormat = FORMATS[sourceId];
            const sourceLabel = getFormatLabel(sourceId, dict);
            const targetConversions = conversionsBySource[sourceId];

            return (
              <div key={sourceId} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className={`${sourceFormat.color} px-6 py-4`}>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-xl">{sourceLabel}</span>
                    <span className="text-white/80 text-sm">→</span>
                  </div>
                  <p className="text-white/70 text-sm mt-1">{dict.formats[sourceId]?.description}</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {targetConversions.map(({ target }) => {
                      const targetFormat = FORMATS[target];
                      const targetLabel = getFormatLabel(target, dict);
                      const slug = getConversionSlug(sourceId, target);

                      return (
                        <Link
                          key={slug}
                          href={`/${lang}/${slug}`}
                          className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full ${targetFormat.color}`} />
                            <span className="font-medium text-gray-800">{targetLabel}</span>
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

      <div className="container mx-auto px-4 py-4">
        <AdUnit position="inline" />
      </div>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{dict.home.whyUseUs}</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">{dict.home.feature1Title}</h3>
              <p className="text-gray-600">{dict.home.feature1Desc}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">{dict.home.feature2Title}</h3>
              <p className="text-gray-600">{dict.home.feature2Desc}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">{dict.home.feature3Title}</h3>
              <p className="text-gray-600">{dict.home.feature3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* All Conversions List (SEO) */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">{dict.home.allConversions}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {conversions.map(({ source, target }) => {
            const slug = getConversionSlug(source, target);
            const sourceLabel = getFormatLabel(source, dict);
            const targetLabel = getFormatLabel(target, dict);
            return (
              <Link
                key={slug}
                href={`/${lang}/${slug}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {sourceLabel} → {targetLabel}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
