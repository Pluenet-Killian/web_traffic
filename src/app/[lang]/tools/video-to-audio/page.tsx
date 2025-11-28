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
import VideoToAudioClient from './client';
import SmartSidebar from '@/components/smart-sidebar';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://data-converter.com';
const TOOL_ID = 'video-to-audio';
const TOOL_SLUG = 'video-to-audio';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const CONTENT = {
  en: {
    title: 'Video to Audio Converter',
    description: 'Extract audio from any video file instantly. Convert MP4, MOV, WebM to MP3 or AAC. Free, private, runs in your browser.',
    intro: 'Extract high-quality audio from your videos without uploading to any server. Perfect for extracting music, podcasts, or voice recordings from video files.',
    howItWorks: [
      'Upload your video file (MP4, MOV, WebM, AVI)',
      'Choose your output format (MP3 or AAC)',
      'Click "Extract Audio" and wait for processing',
      'Download your audio file instantly',
    ],
    useCases: [
      'Extract music from video clips',
      'Create podcast audio from video recordings',
      'Save voice recordings from video calls',
      'Convert video lectures to audio for listening on the go',
      'Extract audio for video editing projects',
    ],
    benefits: [
      '100% client-side - your files never leave your device',
      'Supports all major video formats',
      'High-quality audio extraction (192 kbps)',
      'Choose between MP3 (universal) or AAC (better quality)',
      'Free and unlimited use',
    ],
    faq: [
      {
        question: 'Is my video uploaded to a server?',
        answer: 'No! All processing happens in your browser using WebAssembly. Your video files never leave your device.',
      },
      {
        question: 'What video formats are supported?',
        answer: 'We support MP4, MOV, WebM, and AVI files. Most common video formats will work.',
      },
      {
        question: 'What\'s the difference between MP3 and AAC?',
        answer: 'MP3 is universally compatible with all devices and players. AAC offers better audio quality at the same file size but may not play on older devices.',
      },
      {
        question: 'Is there a file size limit?',
        answer: 'The tool supports files up to 500 MB. Processing time depends on your device\'s performance.',
      },
    ],
  },
  fr: {
    title: 'Convertisseur Vidéo vers Audio',
    description: 'Extrayez l\'audio de n\'importe quelle vidéo instantanément. Convertissez MP4, MOV, WebM en MP3 ou AAC. Gratuit, privé, fonctionne dans votre navigateur.',
    intro: 'Extrayez de l\'audio haute qualité de vos vidéos sans envoyer vos fichiers sur un serveur. Parfait pour extraire de la musique, des podcasts ou des enregistrements vocaux.',
    howItWorks: [
      'Uploadez votre fichier vidéo (MP4, MOV, WebM, AVI)',
      'Choisissez votre format de sortie (MP3 ou AAC)',
      'Cliquez sur "Extraire l\'audio" et attendez le traitement',
      'Téléchargez votre fichier audio instantanément',
    ],
    useCases: [
      'Extraire la musique des clips vidéo',
      'Créer des podcasts audio à partir d\'enregistrements vidéo',
      'Sauvegarder des enregistrements vocaux d\'appels vidéo',
      'Convertir des cours vidéo en audio pour écouter en déplacement',
      'Extraire l\'audio pour des projets de montage vidéo',
    ],
    benefits: [
      '100% côté client - vos fichiers ne quittent jamais votre appareil',
      'Supporte tous les formats vidéo majeurs',
      'Extraction audio haute qualité (192 kbps)',
      'Choix entre MP3 (universel) ou AAC (meilleure qualité)',
      'Gratuit et illimité',
    ],
    faq: [
      {
        question: 'Ma vidéo est-elle envoyée sur un serveur ?',
        answer: 'Non ! Tout le traitement se fait dans votre navigateur avec WebAssembly. Vos fichiers vidéo ne quittent jamais votre appareil.',
      },
      {
        question: 'Quels formats vidéo sont supportés ?',
        answer: 'Nous supportons les fichiers MP4, MOV, WebM et AVI. La plupart des formats vidéo courants fonctionnent.',
      },
      {
        question: 'Quelle est la différence entre MP3 et AAC ?',
        answer: 'Le MP3 est universellement compatible avec tous les appareils et lecteurs. L\'AAC offre une meilleure qualité audio à taille égale mais peut ne pas fonctionner sur les anciens appareils.',
      },
      {
        question: 'Y a-t-il une limite de taille de fichier ?',
        answer: 'L\'outil supporte les fichiers jusqu\'à 500 Mo. Le temps de traitement dépend des performances de votre appareil.',
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = CONTENT[lang as 'en' | 'fr'] || CONTENT.en;

  const canonicalUrl = `${BASE_URL}/${lang}/tools/${TOOL_SLUG}`;

  const alternateUrls = Object.fromEntries(
    locales.map((l) => [localeHtmlLang[l], `${BASE_URL}/${l}/tools/${TOOL_SLUG}`])
  );

  return {
    title: content.title,
    description: content.description,
    keywords: [
      'video to audio',
      'extract audio from video',
      'mp4 to mp3',
      'video converter',
      'audio extractor',
      'free video tool',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonicalUrl,
      type: 'website',
      locale: lang,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function VideoToAudioPage({ params }: PageProps) {
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
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: content.benefits,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
        {/* Breadcrumb */}
        <nav className="border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href={`/${lang}`}
                  className="text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {dict.common.home}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
              <li>
                <Link
                  href={`/${lang}/tools`}
                  className="text-zinc-500 hover:text-zinc-900 transition-colors"
                >
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
              {/* Header */}
              <header className="mb-8">
                <Link
                  href={`/${lang}/tools`}
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {dict.common.backToHome || 'Back to Tools'}
                </Link>

                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1.5 text-sm font-bold text-white bg-pink-500 rounded-lg">
                    VIDEO
                  </span>
                  <span className="px-3 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg">
                    Audio Extractor
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight mb-4">
                  {content.title}
                </h1>

                <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
                  {content.intro}
                </p>
              </header>

              {/* Tool UI */}
              <section className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 lg:p-8 mb-8">
                <VideoToAudioClient lang={lang} />
              </section>

              {/* How It Works */}
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

              {/* Use Cases & Benefits */}
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

              {/* FAQ */}
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

            {/* Smart Sidebar */}
            <SmartSidebar lang={lang} currentContext="image" currentSlug={TOOL_ID} />
          </div>
        </div>
      </div>
    </>
  );
}
