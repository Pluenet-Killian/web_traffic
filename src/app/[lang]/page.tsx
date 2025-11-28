import Link from 'next/link';
import {
  ArrowRight,
  Search,
  Shield,
  Zap,
  Lock,
  Moon,
  FileCheck,
  Image as ImageIcon,
  FileJson,
  FileSpreadsheet,
  FileCode,
  FileType,
  Database,
  FileText,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { FORMATS, FORMAT_IDS, getAllConversions, getConversionSlug, getFormatLabel } from '@/config/formats';
import { type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import AdUnit from '@/components/ad-unit';
import AdNative from '@/components/ad-native';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

// Format icons mapping
const FORMAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  json: FileJson,
  csv: FileSpreadsheet,
  xml: FileCode,
  yaml: FileType,
  sql: Database,
  markdown: FileText,
  html: FileCode,
};

// Popular searches for keyword cloud
const POPULAR_SEARCHES = [
  { term: 'json to csv', href: 'json-to-csv', hot: true },
  { term: 'csv to json', href: 'csv-to-json', hot: true },
  { term: 'xml to json', href: 'xml-to-json' },
  { term: 'yaml to json', href: 'yaml-to-json' },
  { term: 'json to yaml', href: 'json-to-yaml' },
  { term: 'json to xml', href: 'json-to-xml' },
  { term: 'csv to xml', href: 'csv-to-xml' },
  { term: 'json to sql', href: 'json-to-sql' },
  { term: 'pdf dark mode', href: 'tools/pdf-dark-mode', hot: true },
  { term: 'pdf flatten', href: 'tools/pdf-flatten' },
  { term: 'image watermark', href: 'tools/image-watermark' },
  { term: 'video to audio', href: 'tools/video-to-audio', hot: true },
  { term: 'gif maker', href: 'tools/gif-maker' },
  { term: 'video mute', href: 'tools/video-mute' },
  { term: 'what is json', href: 'wiki/json' },
];

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const conversions = getAllConversions();

  const conversionsBySource = FORMAT_IDS.reduce((acc, source) => {
    acc[source] = conversions.filter((c) => c.source === source);
    return acc;
  }, {} as Record<string, typeof conversions>);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Clean with Search */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-small opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-full">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              42+ data conversions & tools
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-6">
              Convert data.
              <br />
              <span className="text-zinc-400">Instantly.</span>
            </h1>

            <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10">
              {dict.home.heroDescription}
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search conversions... (e.g., JSON to CSV)"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-zinc-400">Popular:</span>
              <Link
                href={`/${lang}/json-to-csv`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                JSON to CSV
              </Link>
              <Link
                href={`/${lang}/csv-to-json`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                CSV to JSON
              </Link>
              <Link
                href={`/${lang}/tools/pdf-dark-mode`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Moon className="w-3.5 h-3.5" />
                PDF Dark Mode
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - Main Tools */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
            {/* Large Card - JSON to CSV */}
            <Link
              href={`/${lang}/json-to-csv`}
              className="lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 p-8 flex flex-col justify-between min-h-[280px] hover:shadow-lg hover:shadow-yellow-100 transition-all duration-300"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  Most Popular
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-zinc-900 mb-2">
                  JSON to CSV
                </h3>
                <p className="text-zinc-600">
                  Convert JSON data to CSV format instantly. Perfect for spreadsheets and data analysis.
                </p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <FileJson className="w-12 h-12 text-yellow-500/60" />
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>

            {/* Medium Card - PDF Dark Mode */}
            <Link
              href={`/${lang}/tools/pdf-dark-mode`}
              className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/50 p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg hover:shadow-violet-100 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">PDF Tool</span>
                  <h3 className="text-lg font-bold text-zinc-900 mt-1">Dark Mode</h3>
                </div>
                <Moon className="w-8 h-8 text-violet-400" />
              </div>
              <p className="text-sm text-zinc-500 mt-2">Convert PDFs for comfortable night reading</p>
            </Link>

            {/* Medium Card - PDF Flatten */}
            <Link
              href={`/${lang}/tools/pdf-flatten`}
              className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg hover:shadow-blue-100 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">PDF Tool</span>
                  <h3 className="text-lg font-bold text-zinc-900 mt-1">Flatten & Secure</h3>
                </div>
                <FileCheck className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-sm text-zinc-500 mt-2">Flatten forms & remove metadata</p>
            </Link>

            {/* Medium Card - Image Watermark */}
            <Link
              href={`/${lang}/tools/image-watermark`}
              className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Image Tool</span>
                  <h3 className="text-lg font-bold text-zinc-900 mt-1">Watermark</h3>
                </div>
                <ImageIcon className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-sm text-zinc-500 mt-2">Protect your photos from theft</p>
            </Link>

            {/* Medium Card - CSV to JSON */}
            <Link
              href={`/${lang}/csv-to-json`}
              className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg hover:shadow-green-100 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Converter</span>
                  <h3 className="text-lg font-bold text-zinc-900 mt-1">CSV to JSON</h3>
                </div>
                <FileSpreadsheet className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-sm text-zinc-500 mt-2">Transform spreadsheet data to JSON</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Native Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdNative title="Sponsored" />
      </div>

      {/* USP Section - Compact */}
      <section className="py-12 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-zinc-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">{dict.home.feature1Title}</h3>
                <p className="text-sm text-zinc-500">{dict.home.feature1Desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-zinc-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">{dict.home.feature2Title}</h3>
                <p className="text-sm text-zinc-500">{dict.home.feature2Desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-zinc-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">{dict.home.feature3Title}</h3>
                <p className="text-sm text-zinc-500">{dict.home.feature3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Converters Grid */}
      <section id="conversions" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">
                {dict.home.allConversions}
              </h2>
              <p className="text-zinc-500 mt-1">
                {dict.home.chooseConversionDesc}
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium text-zinc-500 bg-zinc-100 rounded-full">
              {conversions.length} conversions
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {FORMAT_IDS.map((sourceId) => {
              const sourceLabel = getFormatLabel(sourceId, dict);
              const targetConversions = conversionsBySource[sourceId];
              const Icon = FORMAT_ICONS[sourceId] || FileJson;

              return (
                <div
                  key={sourceId}
                  className="bg-zinc-50 rounded-2xl p-5 hover:bg-zinc-100/80 transition-colors"
                >
                  {/* Format Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900">{sourceLabel}</h3>
                      <p className="text-xs text-zinc-500">
                        {dict.formats[sourceId]?.description}
                      </p>
                    </div>
                  </div>

                  {/* Conversion Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {targetConversions.map(({ target }) => {
                      const targetLabel = getFormatLabel(target, dict);
                      const slug = getConversionSlug(sourceId, target);

                      return (
                        <Link
                          key={slug}
                          href={`/${lang}/${slug}`}
                          className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all group"
                        >
                          <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                            {targetLabel}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad Unit */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdUnit position="inline" />
      </div>

      {/* Keyword Cloud Section (SEO) */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-zinc-900 mb-2">
              Popular Searches
            </h2>
            <p className="text-zinc-500">
              What people are converting right now
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {POPULAR_SEARCHES.map((search) => (
              <Link
                key={search.href}
                href={`/${lang}/${search.href}`}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all hover:shadow-sm ${
                  search.hot
                    ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {search.hot && <TrendingUp className="w-3.5 h-3.5" />}
                <span className="text-sm font-medium">{search.term}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Links Section (SEO) */}
      <section className="py-16 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-zinc-900 mb-6">
            All Converters A-Z
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2">
            {conversions.map(({ source, target }) => {
              const slug = getConversionSlug(source, target);
              const sourceLabel = getFormatLabel(source, dict);
              const targetLabel = getFormatLabel(target, dict);
              return (
                <Link
                  key={slug}
                  href={`/${lang}/${slug}`}
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors py-1"
                >
                  {sourceLabel} to {targetLabel}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
