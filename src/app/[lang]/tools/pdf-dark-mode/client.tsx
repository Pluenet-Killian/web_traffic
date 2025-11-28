'use client';

import { useState, useCallback } from 'react';
import { Moon } from 'lucide-react';
import ToolUI from '@/components/tool-ui';
import { convertPdfToDarkMode, type ProcessingProgress } from '@/lib/pdf-tools';

interface PdfDarkModeClientProps {
  lang: string;
}

export default function PdfDarkModeClient({ lang }: PdfDarkModeClientProps) {
  const [intensity, setIntensity] = useState(0.85);

  const dict = lang === 'fr' ? {
    uploadLabel: 'Glissez-déposez votre PDF ici',
    uploadHint: 'ou cliquez pour sélectionner',
    processButton: 'Convertir en Mode Sombre',
    processingButton: 'Conversion en cours...',
    downloadButton: 'Télécharger le PDF',
    successMessage: 'Votre PDF mode sombre est prêt !',
    errorMessage: 'Erreur lors de la conversion',
    tryAgain: 'Réessayer',
    intensityLabel: 'Intensité du mode sombre',
    intensityHint: 'Ajustez l\'obscurité du résultat',
  } : {
    uploadLabel: 'Drag & drop your PDF here',
    uploadHint: 'or click to select',
    processButton: 'Convert to Dark Mode',
    processingButton: 'Converting...',
    downloadButton: 'Download PDF',
    successMessage: 'Your dark mode PDF is ready!',
    errorMessage: 'Error during conversion',
    tryAgain: 'Try Again',
    intensityLabel: 'Dark mode intensity',
    intensityHint: 'Adjust the darkness of the result',
  };

  const processFile = useCallback(
    async (
      file: File,
      _options: Record<string, unknown>,
      onProgress: (p: ProcessingProgress) => void
    ): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      return convertPdfToDarkMode(arrayBuffer, intensity, onProgress);
    },
    [intensity]
  );

  return (
    <ToolUI
      toolId="pdf-dark-mode"
      accept={{ 'application/pdf': ['.pdf'] }}
      acceptLabel="PDF"
      processFile={processFile}
      outputFileName="dark-mode.pdf"
      outputMimeType="application/pdf"
      lang={lang}
      dict={dict}
      options={{ intensity }}
    >
      {/* Intensity Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="intensity" className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <Moon className="w-4 h-4" />
            {dict.intensityLabel}
          </label>
          <span className="text-sm font-mono text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded">
            {Math.round(intensity * 100)}%
          </span>
        </div>
        <input
          id="intensity"
          type="range"
          min="0.5"
          max="1"
          step="0.05"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
        />
        <p className="text-xs text-zinc-500">{dict.intensityHint}</p>
      </div>
    </ToolUI>
  );
}
