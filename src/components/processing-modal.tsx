'use client';

import { useEffect, useState } from 'react';
import { Shield, Lock, Zap, CheckCircle } from 'lucide-react';
import AdUnit, { SHOW_ADS } from './ad-unit';

interface ProcessingModalProps {
  isOpen: boolean;
  progress: number;
  status: string;
  lang: string;
  onComplete?: () => void;
}

const messages = {
  en: [
    { icon: Lock, text: 'Encrypting locally...' },
    { icon: Shield, text: 'Processing securely...' },
    { icon: Zap, text: 'Optimizing output...' },
    { icon: CheckCircle, text: 'Almost ready!' },
  ],
  fr: [
    { icon: Lock, text: 'Chiffrement local...' },
    { icon: Shield, text: 'Traitement sécurisé...' },
    { icon: Zap, text: 'Optimisation...' },
    { icon: CheckCircle, text: 'Presque prêt !' },
  ],
};

const tips = {
  en: [
    'Your files never leave your device',
    'No data is sent to any server',
    '100% private and secure',
    'Works offline too!',
  ],
  fr: [
    'Vos fichiers ne quittent jamais votre appareil',
    'Aucune donnée envoyée sur un serveur',
    '100% privé et sécurisé',
    'Fonctionne aussi hors ligne !',
  ],
};

export default function ProcessingModal({
  isOpen,
  progress,
  status,
  lang,
}: ProcessingModalProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const langKey = lang === 'fr' ? 'fr' : 'en';
  const currentMessages = messages[langKey];
  const currentTips = tips[langKey];

  useEffect(() => {
    if (!isOpen) {
      setMessageIndex(0);
      setTipIndex(0);
      return;
    }

    // Cycle through messages based on progress
    const newIndex = Math.min(
      Math.floor((progress / 100) * currentMessages.length),
      currentMessages.length - 1
    );
    setMessageIndex(newIndex);
  }, [progress, isOpen, currentMessages.length]);

  useEffect(() => {
    if (!isOpen) return;

    // Rotate tips every 2 seconds
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % currentTips.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, currentTips.length]);

  if (!isOpen) return null;

  const CurrentIcon = currentMessages[messageIndex].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 px-6 py-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center animate-pulse">
              <CurrentIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {currentMessages[messageIndex].text}
              </h3>
              <p className="text-zinc-400 text-sm">{status}</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="px-6 py-5">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-zinc-600">
                {lang === 'fr' ? 'Progression' : 'Progress'}
              </span>
              <span className="font-mono font-medium text-zinc-900">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-zinc-700 to-zinc-900 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Security Tip */}
          <div className={`flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl ${SHOW_ADS ? 'mb-5' : ''}`}>
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800 transition-opacity duration-300">
              {currentTips[tipIndex]}
            </p>
          </div>

          {/* Ad Unit - High Intent Placement (affiché uniquement si les pubs sont activées) */}
          {SHOW_ADS && (
            <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50">
              <div className="text-center py-1 bg-zinc-100 border-b border-zinc-200">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                  {lang === 'fr' ? 'Sponsorisé' : 'Sponsored'}
                </span>
              </div>
              <div className="flex items-center justify-center p-4 min-h-[250px]">
                <AdUnit position="modal" className="mx-auto" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200">
          <p className="text-xs text-zinc-500 text-center">
            {lang === 'fr'
              ? 'Veuillez patienter pendant le traitement...'
              : 'Please wait while processing...'}
          </p>
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
