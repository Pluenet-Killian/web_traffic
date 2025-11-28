import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Wrench,
  ChevronDown,
} from 'lucide-react';
import { locales, localeHtmlLang, type Locale } from '@/config/i18n';
import { getDictionary } from '@/dictionaries';
import GifMakerClient from './client';
import SmartSidebar from '@/components/smart-sidebar';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://data-converter.com';
const TOOL_ID = 'gif-maker';
const TOOL_SLUG = 'gif-maker';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const CONTENT = {
  en: {
    title: 'GIF Maker - Convert Video to GIF',
    description: 'Create optimized GIFs from video clips instantly. Convert MP4 to GIF with custom settings. Free, private, runs in your browser.',
    intro: 'Transform your video clips into high-quality animated GIFs. Perfect for social media, messaging, and web content. Customize FPS, size, and duration.',
    howItWorks: [
      'Upload your video file (MP4, MOV, WebM)',
      'Adjust settings: FPS, width, start time, duration',
      'Click "Create GIF" and wait for processing',
      'Preview and download your optimized GIF',
    ],
    useCases: [
      'Create memes from video clips',
      'Make reaction GIFs for social media',
      'Create product demo animations',
      'Share video moments in messaging apps',
      'Create animated content for websites',
    ],
    benefits: [
      '100% client-side - your files never leave your device',
      'Optimized 2-pass encoding for best quality',
      'Customizable FPS, size, and duration',
      'Preview before download',
      'Free and unlimited use',
    ],
    faq: [
      {
        question: 'Why is the GIF file larger than the video?',
        answer: 'GIF is an old format without modern compression. A 5-second video might become a 10MB GIF. Keep GIFs short (2-5s) and small (480px) for best results.',
      },
      {
        question: 'What settings should I use?',
        answer: 'For web/messaging: 10 FPS, 480px width, 3-5s duration. For higher quality: 15 FPS, 640px. Higher settings = larger file size.',
      },
      {
        question: 'Why does creation take time?',
        answer: 'We use 2-pass encoding with palette generation for optimal colors. This takes longer but produces much better quality GIFs than simple conversion.',
      },
      {
        question: 'Is there a duration limit?',
        answer: 'We recommend keeping GIFs under 10 seconds for reasonable file sizes. Longer GIFs can become very large and slow to load.',
      },
    ],
  },
  fr: {
    title: 'Créateur de GIF - Vidéo vers GIF',
    description: 'Créez des GIFs optimisés à partir de clips vidéo instantanément. Convertissez MP4 en GIF avec des paramètres personnalisés. Gratuit et privé.',
    intro: 'Transformez vos clips vidéo en GIFs animés de haute qualité. Parfait pour les réseaux sociaux, la messagerie et le contenu web. Personnalisez les FPS, la taille et la durée.',
    howItWorks: [
      'Uploadez votre fichier vidéo (MP4, MOV, WebM)',
      'Ajustez les paramètres : FPS, largeur, temps de début, durée',
      'Cliquez sur "Créer le GIF" et attendez le traitement',
      'Prévisualisez et téléchargez votre GIF optimisé',
    ],
    useCases: [
      'Créer des mèmes à partir de clips vidéo',
      'Faire des GIFs de réaction pour les réseaux sociaux',
      'Créer des animations de démo produit',
      'Partager des moments vidéo dans les apps de messagerie',
      'Créer du contenu animé pour les sites web',
    ],
    benefits: [
      '100% côté client - vos fichiers ne quittent jamais votre appareil',
      'Encodage optimisé en 2 passes pour la meilleure qualité',
      'FPS, taille et durée personnalisables',
      'Aperçu avant téléchargement',
      'Gratuit et illimité',
    ],
    faq: [
      {
        question: 'Pourquoi le GIF est-il plus gros que la vidéo ?',
        answer: 'Le GIF est un ancien format sans compression moderne. Une vidéo de 5s peut devenir un GIF de 10 Mo. Gardez les GIFs courts (2-5s) et petits (480px) pour de meilleurs résultats.',
      },
      {
        question: 'Quels paramètres utiliser ?',
        answer: 'Pour web/messagerie : 10 FPS, 480px de largeur, 3-5s de durée. Pour meilleure qualité : 15 FPS, 640px. Plus de qualité = fichier plus gros.',
      },
      {
        question: 'Pourquoi la création prend-elle du temps ?',
        answer: 'Nous utilisons un encodage en 2 passes avec génération de palette pour des couleurs optimales. Cela prend plus de temps mais produit des GIFs de bien meilleure qualité.',
      },
      {
        question: 'Y a-t-il une limite de durée ?',
        answer: 'Nous recommandons de garder les GIFs sous 10 secondes pour une taille de fichier raisonnable. Les GIFs plus longs peuvent devenir très lourds.',
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = CONTENT[lang as 'en' | 'fr'] || CONTENT.en;

  const canonicalUrl = `${BASE_URL}/${lang}/tools/${TOOL_SLUG}`;

  return {
    title: content.title,
    description: content.description,
    keywords: [
      'gif maker',
      'video to gif',
      'mp4 to gif',
      'create gif',
      'animated gif',
      'free gif maker',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        locales.map((l) => [localeHtmlLang[l], `${BASE_URL}/${l}/tools/${TOOL_SLUG}`])
      ),
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonicalUrl,
      type: 'website',
      locale: lang,
    },
    robots: { index: true, follow: true },
  };
}

export default async function GifMakerPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const content = CONTENT[lang as 'en' | 'fr'] || CONTENT.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: content.title,
    description: content.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: content.benefits,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={localeHtmlLang[locale]}
          href={`${BASE_URL}/${locale}/tools/${TOOL_SLUG}`}
        />
      ))}

      <div className="min-h-screen bg-white">
        <nav className="border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href={`/${lang}`} className="text-zinc-500 hover:text-zinc-900 transition-colors">
                  {dict.common.home}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
              <li>
                <Link href={`/${lang}/tools`} className="text-zinc-500 hover:text-zinc-900 transition-colors">
                  Tools
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
              <li className="text-zinc-900 font-medium">{content.title}</li>
            </ol>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0 max-w-4xl">
              <header className="mb-8">
                <Link
                  href={`/${lang}/tools`}
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {dict.common.backToHome || 'Back to Tools'}
                </Link>

                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1.5 text-sm font-bold text-white bg-indigo-500 rounded-lg">
                    VIDEO
                  </span>
                  <span className="px-3 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg">
                    GIF Maker
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight mb-4">
                  {content.title}
                </h1>

                <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
                  {content.intro}
                </p>
              </header>

              <section className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 lg:p-8 mb-8">
                <GifMakerClient lang={lang} />
              </section>

              <section className="mb-8">
                <div className="feature-card">
                  <div className="feature-icon">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                    {lang === 'fr' ? 'Comment ça marche' : 'How It Works'}
                  </h2>
                  <ol className="space-y-3">
                    {content.howItWorks.map((step, index) => (
                      <li key={index} className="flex items-start gap-3 text-zinc-600">
                        <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 text-sm font-medium flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              <section className="mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                      {lang === 'fr' ? 'Cas d\'utilisation' : 'Use Cases'}
                    </h2>
                    <ul className="space-y-3">
                      {content.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start gap-3 text-zinc-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0" />
                          <span className="leading-relaxed">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                      {lang === 'fr' ? 'Avantages' : 'Benefits'}
                    </h2>
                    <ul className="space-y-3">
                      {content.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 text-zinc-600">
                          <CheckCircle2 className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-zinc-200 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">FAQ</h2>
                <div className="space-y-3">
                  {content.faq.map((item, index) => (
                    <details key={index} className="accordion-item group">
                      <summary className="accordion-trigger list-none">
                        <span className="pr-4">{item.question}</span>
                        <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                      </summary>
                      <div className="accordion-content">
                        <p className="leading-relaxed">{item.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            <SmartSidebar lang={lang} currentContext="image" currentSlug={TOOL_ID} />
          </div>
        </div>
      </div>
    </>
  );
}
