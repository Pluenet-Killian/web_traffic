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
import VideoMuteClient from './client';
import SmartSidebar from '@/components/smart-sidebar';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://data-converter.com';
const TOOL_ID = 'video-mute';
const TOOL_SLUG = 'video-mute';

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const CONTENT = {
  en: {
    title: 'Video Mute - Remove Audio from Video',
    description: 'Remove audio track from any video file instantly. Mute MP4, MOV, WebM videos without re-encoding. Free, private, runs in your browser.',
    intro: 'Instantly remove the audio track from your videos without affecting video quality. Perfect for creating silent videos or removing unwanted background noise.',
    howItWorks: [
      'Upload your video file (MP4, MOV, WebM, AVI)',
      'Click "Remove Audio" to start processing',
      'Wait for the fast processing (video is not re-encoded)',
      'Download your muted video file',
    ],
    useCases: [
      'Create silent videos for social media',
      'Remove background noise from recordings',
      'Prepare videos for adding new audio/music',
      'Remove copyrighted music from videos',
      'Create B-roll footage without audio',
    ],
    benefits: [
      '100% client-side - your files never leave your device',
      'Ultra-fast processing (no re-encoding)',
      'Original video quality preserved',
      'Supports all major video formats',
      'Free and unlimited use',
    ],
    faq: [
      {
        question: 'Does this affect video quality?',
        answer: 'No! The video stream is copied directly without re-encoding, so there\'s zero quality loss. Only the audio track is removed.',
      },
      {
        question: 'Why is the processing so fast?',
        answer: 'We use stream copying instead of re-encoding. This means the video data is transferred as-is, which is much faster than traditional video processing.',
      },
      {
        question: 'Can I add new audio later?',
        answer: 'Yes! The output video has no audio track, making it perfect for adding your own music or voiceover in a video editor.',
      },
      {
        question: 'Is there a file size limit?',
        answer: 'The tool supports files up to 500 MB. Due to stream copying, processing is fast even for larger files.',
      },
    ],
  },
  fr: {
    title: 'Vidéo Muette - Supprimer l\'Audio',
    description: 'Supprimez la piste audio de n\'importe quelle vidéo instantanément. Rendez muettes vos vidéos MP4, MOV, WebM sans ré-encodage. Gratuit et privé.',
    intro: 'Supprimez instantanément la piste audio de vos vidéos sans affecter la qualité vidéo. Parfait pour créer des vidéos silencieuses ou supprimer le bruit de fond.',
    howItWorks: [
      'Uploadez votre fichier vidéo (MP4, MOV, WebM, AVI)',
      'Cliquez sur "Supprimer l\'audio" pour lancer le traitement',
      'Attendez le traitement rapide (la vidéo n\'est pas ré-encodée)',
      'Téléchargez votre vidéo muette',
    ],
    useCases: [
      'Créer des vidéos silencieuses pour les réseaux sociaux',
      'Supprimer le bruit de fond des enregistrements',
      'Préparer des vidéos pour ajouter un nouvel audio/musique',
      'Supprimer la musique protégée des vidéos',
      'Créer des séquences B-roll sans audio',
    ],
    benefits: [
      '100% côté client - vos fichiers ne quittent jamais votre appareil',
      'Traitement ultra-rapide (pas de ré-encodage)',
      'Qualité vidéo originale préservée',
      'Supporte tous les formats vidéo majeurs',
      'Gratuit et illimité',
    ],
    faq: [
      {
        question: 'Cela affecte-t-il la qualité vidéo ?',
        answer: 'Non ! Le flux vidéo est copié directement sans ré-encodage, donc il n\'y a aucune perte de qualité. Seule la piste audio est supprimée.',
      },
      {
        question: 'Pourquoi le traitement est-il si rapide ?',
        answer: 'Nous utilisons la copie de flux au lieu du ré-encodage. Cela signifie que les données vidéo sont transférées telles quelles, ce qui est beaucoup plus rapide.',
      },
      {
        question: 'Puis-je ajouter un nouvel audio plus tard ?',
        answer: 'Oui ! La vidéo de sortie n\'a pas de piste audio, ce qui la rend parfaite pour ajouter votre propre musique ou voix-off dans un éditeur vidéo.',
      },
      {
        question: 'Y a-t-il une limite de taille de fichier ?',
        answer: 'L\'outil supporte les fichiers jusqu\'à 500 Mo. Grâce à la copie de flux, le traitement est rapide même pour les fichiers volumineux.',
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
      'remove audio from video',
      'mute video',
      'video without sound',
      'silent video',
      'remove sound',
      'free video tool',
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

export default async function VideoMutePage({ params }: PageProps) {
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
                  <span className="px-3 py-1.5 text-sm font-bold text-white bg-orange-500 rounded-lg">
                    VIDEO
                  </span>
                  <span className="px-3 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg">
                    Mute
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
                <VideoMuteClient lang={lang} />
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
