'use client';

import { SHOW_ADS } from './ad-unit';

interface AdBillboardProps {
  className?: string;
}

export default function AdBillboard({ className = '' }: AdBillboardProps) {
  // Ne rien afficher si les pubs sont désactivées
  if (!SHOW_ADS) return null;

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div
        className="w-full max-w-[970px] h-[90px] md:h-[250px] lg:h-[90px] bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center"
        data-ad-slot="billboard"
      >
        <div className="text-center">
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Advertisement</div>
          <div className="text-sm text-zinc-500">970x90 Billboard</div>
        </div>
      </div>
    </div>
  );
}
