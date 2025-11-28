// Contrôle global pour afficher/masquer les pubs
// Mettre à true une fois l'approbation AdSense obtenue
export const SHOW_ADS = false;

interface AdUnitProps {
  position: 'header' | 'sidebar' | 'below-result' | 'inline' | 'modal';
  className?: string;
}

const AD_SIZES: Record<AdUnitProps['position'], { width: string; height: string; label: string }> = {
  header: { width: 'w-full', height: 'h-24', label: 'Leaderboard (728x90)' },
  sidebar: { width: 'w-full', height: 'h-[600px]', label: 'Skyscraper (300x600)' },
  'below-result': { width: 'w-full', height: 'h-32', label: 'Banner (728x90)' },
  inline: { width: 'w-full', height: 'h-20', label: 'Inline Ad (320x100)' },
  modal: { width: 'w-[300px]', height: 'h-[250px]', label: 'Medium Rectangle (300x250)' },
};

export default function AdUnit({ position, className = '' }: AdUnitProps) {
  // Ne rien afficher si les pubs sont désactivées
  if (!SHOW_ADS) return null;

  const size = AD_SIZES[position];

  return (
    <div
      className={`${size.width} ${size.height} ${className}`}
      data-ad-position={position}
    >
      {/* Placeholder visuel - Remplacer par le code AdSense/Ad Network réel */}
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
        <svg
          className="w-8 h-8 mb-2 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <span className="text-xs font-medium">{size.label}</span>
        <span className="text-xs mt-1">Espace publicitaire</span>
      </div>

      {/*
        Pour intégrer Google AdSense, remplacez le placeholder ci-dessus par:

        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        Et ajoutez dans le layout.tsx:
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      */}
    </div>
  );
}

// Composant pour la sidebar avec plusieurs emplacements
export function AdSidebar() {
  // Ne rien afficher si les pubs sont désactivées
  if (!SHOW_ADS) return null;

  return (
    <aside className="hidden xl:block w-80 flex-shrink-0 space-y-6">
      <AdUnit position="sidebar" />
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2">Astuce Pro</h3>
        <p className="text-sm text-blue-700">
          Saviez-vous que vous pouvez glisser-déposer vos fichiers directement dans la zone de texte ?
        </p>
      </div>
    </aside>
  );
}
