'use client';

import { useState, useCallback } from 'react';
import { Type, Droplets, RotateCcw, Grid } from 'lucide-react';
import ToolUI from '@/components/tool-ui';
import { addWatermark, type ProcessingProgress } from '@/lib/image-tools';

interface ImageWatermarkClientProps {
  lang: string;
}

export default function ImageWatermarkClient({ lang }: ImageWatermarkClientProps) {
  const [text, setText] = useState('© My Watermark');
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(48);
  const [rotation, setRotation] = useState(-30);
  const [tiled, setTiled] = useState(true);

  const dict = lang === 'fr' ? {
    uploadLabel: 'Glissez-déposez votre image ici',
    uploadHint: 'ou cliquez pour sélectionner',
    processButton: 'Ajouter le Filigrane',
    processingButton: 'Traitement en cours...',
    downloadButton: 'Télécharger l\'Image',
    successMessage: 'Votre image protégée est prête !',
    errorMessage: 'Erreur lors du traitement',
    tryAgain: 'Réessayer',
    textLabel: 'Texte du filigrane',
    textPlaceholder: '© Mon Filigrane',
    opacityLabel: 'Opacité',
    fontSizeLabel: 'Taille du texte',
    rotationLabel: 'Rotation',
    tiledLabel: 'Motif en tuiles',
    tiledHint: 'Répète le filigrane sur toute l\'image',
  } : {
    uploadLabel: 'Drag & drop your image here',
    uploadHint: 'or click to select',
    processButton: 'Add Watermark',
    processingButton: 'Processing...',
    downloadButton: 'Download Image',
    successMessage: 'Your protected image is ready!',
    errorMessage: 'Error during processing',
    tryAgain: 'Try Again',
    textLabel: 'Watermark text',
    textPlaceholder: '© My Watermark',
    opacityLabel: 'Opacity',
    fontSizeLabel: 'Font size',
    rotationLabel: 'Rotation',
    tiledLabel: 'Tiled pattern',
    tiledHint: 'Repeats the watermark across the entire image',
  };

  const processFile = useCallback(
    async (
      file: File,
      _options: Record<string, unknown>,
      onProgress: (p: ProcessingProgress) => void
    ): Promise<Uint8Array> => {
      const blob = await addWatermark(
        file,
        { text, opacity, fontSize, rotation, tiled, color: '#000000' },
        onProgress
      );
      const arrayBuffer = await blob.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    },
    [text, opacity, fontSize, rotation, tiled]
  );

  return (
    <ToolUI
      toolId="image-watermark"
      accept={{
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
      }}
      acceptLabel="JPG, PNG, WebP"
      processFile={processFile}
      outputFileName="watermarked.png"
      outputMimeType="image/png"
      lang={lang}
      dict={dict}
      options={{ text, opacity, fontSize, rotation, tiled }}
    >
      {/* Options */}
      <div className="space-y-5">
        {/* Watermark Text */}
        <div className="space-y-2">
          <label htmlFor="text" className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <Type className="w-4 h-4" />
            {dict.textLabel}
          </label>
          <input
            id="text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={dict.textPlaceholder}
            className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>

        {/* Opacity Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="opacity" className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <Droplets className="w-4 h-4" />
              {dict.opacityLabel}
            </label>
            <span className="text-sm font-mono text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded">
              {Math.round(opacity * 100)}%
            </span>
          </div>
          <input
            id="opacity"
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
          />
        </div>

        {/* Font Size Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="fontSize" className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <Type className="w-4 h-4" />
              {dict.fontSizeLabel}
            </label>
            <span className="text-sm font-mono text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded">
              {fontSize}px
            </span>
          </div>
          <input
            id="fontSize"
            type="range"
            min="16"
            max="120"
            step="4"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
          />
        </div>

        {/* Rotation Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="rotation" className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <RotateCcw className="w-4 h-4" />
              {dict.rotationLabel}
            </label>
            <span className="text-sm font-mono text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded">
              {rotation}°
            </span>
          </div>
          <input
            id="rotation"
            type="range"
            min="-45"
            max="45"
            step="5"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
          />
        </div>

        {/* Tiled Toggle */}
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={tiled}
              onChange={(e) => setTiled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-zinc-200 rounded-full peer-checked:bg-zinc-900 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <Grid className="w-4 h-4" />
              {dict.tiledLabel}
            </div>
            <p className="text-xs text-zinc-500 mt-1">{dict.tiledHint}</p>
          </div>
        </label>
      </div>
    </ToolUI>
  );
}
