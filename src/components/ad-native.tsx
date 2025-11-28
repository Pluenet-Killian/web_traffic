'use client';

import { SHOW_ADS } from './ad-unit';

interface AdNativeProps {
  title?: string;
  className?: string;
}

export default function AdNative({ title = 'Sponsored', className = '' }: AdNativeProps) {
  // Ne rien afficher si les pubs sont désactivées
  if (!SHOW_ADS) return null;

  return (
    <div className={`w-full ${className}`}>
      <div
        className="bg-white border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
        data-ad-slot="native"
      >
        <div className="flex items-start gap-4">
          {/* Thumbnail placeholder */}
          <div className="w-16 h-16 bg-zinc-100 rounded-lg flex-shrink-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-zinc-200 rounded" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
              {title}
            </span>
            <h4 className="text-sm font-medium text-zinc-900 mt-1 line-clamp-2">
              Native Ad Headline Placeholder
            </h4>
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
              Brief description of the sponsored content goes here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
