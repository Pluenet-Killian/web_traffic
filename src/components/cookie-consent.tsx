'use client';

import { useConsent } from '@/contexts/consent-context';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import type { Locale } from '@/config/i18n';

interface CookieConsentProps {
  lang: Locale;
}

const TRANSLATIONS = {
  en: {
    title: 'We value your privacy',
    description: 'We use cookies to analyze our traffic and show you relevant ads. Your files are processed locally and never leave your device.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    learnMore: 'Learn more',
  },
  fr: {
    title: 'Nous respectons votre vie privée',
    description: 'Nous utilisons des cookies pour analyser notre trafic et vous montrer des publicités pertinentes. Vos fichiers sont traités localement et ne quittent jamais votre appareil.',
    acceptAll: 'Tout accepter',
    rejectAll: 'Tout refuser',
    learnMore: 'En savoir plus',
  },
  es: {
    title: 'Valoramos su privacidad',
    description: 'Utilizamos cookies para analizar nuestro tráfico y mostrarle anuncios relevantes. Sus archivos se procesan localmente y nunca salen de su dispositivo.',
    acceptAll: 'Aceptar todo',
    rejectAll: 'Rechazar todo',
    learnMore: 'Más información',
  },
  de: {
    title: 'Wir schätzen Ihre Privatsphäre',
    description: 'Wir verwenden Cookies, um unseren Traffic zu analysieren und Ihnen relevante Werbung zu zeigen. Ihre Dateien werden lokal verarbeitet und verlassen Ihr Gerät nie.',
    acceptAll: 'Alle akzeptieren',
    rejectAll: 'Alle ablehnen',
    learnMore: 'Mehr erfahren',
  },
  pt: {
    title: 'Valorizamos sua privacidade',
    description: 'Usamos cookies para analisar nosso tráfego e mostrar anúncios relevantes. Seus arquivos são processados localmente e nunca saem do seu dispositivo.',
    acceptAll: 'Aceitar tudo',
    rejectAll: 'Rejeitar tudo',
    learnMore: 'Saiba mais',
  },
};

export default function CookieConsent({ lang }: CookieConsentProps) {
  const { showBanner, acceptAll, rejectAll } = useConsent();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 text-white rounded-2xl shadow-2xl shadow-zinc-900/50 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-amber-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {t.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {t.description}{' '}
                  <Link
                    href={`/${lang}/legal/cookies`}
                    className="text-white underline underline-offset-2 hover:text-zinc-300 transition-colors"
                  >
                    {t.learnMore}
                  </Link>
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={acceptAll}
                    className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-zinc-900 bg-white rounded-lg hover:bg-zinc-100 transition-colors active:scale-[0.98]"
                  >
                    {t.acceptAll}
                  </button>
                  <button
                    onClick={rejectAll}
                    className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors active:scale-[0.98]"
                  >
                    {t.rejectAll}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy badges */}
          <div className="px-6 py-3 bg-zinc-800/50 border-t border-zinc-800 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              100% client-side processing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              No file uploads
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              GDPR compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
