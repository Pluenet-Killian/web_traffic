'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SHOW_ADS } from './ad-unit';

interface AdStickyProps {
  position?: 'bottom' | 'left' | 'right';
}

export default function AdSticky({ position = 'bottom' }: AdStickyProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Ne pas activer le scroll listener si les pubs sont désactivées
    if (!SHOW_ADS) return;

    // Show after scroll
    const handleScroll = () => {
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  // Ne rien afficher si les pubs sont désactivées
  if (!SHOW_ADS || !isVisible || isDismissed) return null;

  if (position === 'bottom') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-zinc-200 shadow-lg animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div
            className="flex-1 h-[50px] md:h-[90px] bg-zinc-100 rounded-lg flex items-center justify-center"
            data-ad-slot="sticky-bottom"
          >
            <span className="text-xs text-zinc-400">728x90 Leaderboard</span>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Close ad"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Side sticky (for desktop)
  return (
    <div
      className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-40 hidden xl:block`}
    >
      <div className="relative">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 p-1 bg-white text-zinc-400 hover:text-zinc-600 rounded-full shadow-md border border-zinc-200 transition-colors z-10"
          aria-label="Close ad"
        >
          <X className="w-3 h-3" />
        </button>
        <div
          className="w-[160px] h-[600px] bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center"
          data-ad-slot={`sticky-${position}`}
        >
          <div className="text-center">
            <span className="text-xs text-zinc-400 block">160x600</span>
            <span className="text-xs text-zinc-400">Skyscraper</span>
          </div>
        </div>
      </div>
    </div>
  );
}
