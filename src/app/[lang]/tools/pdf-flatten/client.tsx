'use client';

import { useState, useCallback } from 'react';
import { FileCheck, Trash2 } from 'lucide-react';
import ToolUI from '@/components/tool-ui';
import { flattenPdf, type ProcessingProgress } from '@/lib/pdf-tools';

interface PdfFlattenClientProps {
  lang: string;
}

export default function PdfFlattenClient({ lang }: PdfFlattenClientProps) {
  const [flattenForms, setFlattenForms] = useState(true);
  const [removeMetadata, setRemoveMetadata] = useState(true);

  const dict = lang === 'fr' ? {
    uploadLabel: 'Glissez-déposez votre PDF ici',
    uploadHint: 'ou cliquez pour sélectionner',
    processButton: 'Aplatir & Sécuriser',
    processingButton: 'Traitement en cours...',
    downloadButton: 'Télécharger le PDF',
    successMessage: 'Votre PDF sécurisé est prêt !',
    errorMessage: 'Erreur lors du traitement',
    tryAgain: 'Réessayer',
    optionsTitle: 'Options',
    flattenFormsLabel: 'Aplatir les formulaires',
    flattenFormsHint: 'Convertit les champs de formulaire en contenu statique',
    removeMetadataLabel: 'Supprimer les métadonnées',
    removeMetadataHint: 'Supprime auteur, dates, logiciel, etc.',
  } : {
    uploadLabel: 'Drag & drop your PDF here',
    uploadHint: 'or click to select',
    processButton: 'Flatten & Secure',
    processingButton: 'Processing...',
    downloadButton: 'Download PDF',
    successMessage: 'Your secured PDF is ready!',
    errorMessage: 'Error during processing',
    tryAgain: 'Try Again',
    optionsTitle: 'Options',
    flattenFormsLabel: 'Flatten form fields',
    flattenFormsHint: 'Converts form fields into static content',
    removeMetadataLabel: 'Remove metadata',
    removeMetadataHint: 'Removes author, dates, software info, etc.',
  };

  const processFile = useCallback(
    async (
      file: File,
      _options: Record<string, unknown>,
      onProgress: (p: ProcessingProgress) => void
    ): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      return flattenPdf(arrayBuffer, { flattenForms, removeMetadata }, onProgress);
    },
    [flattenForms, removeMetadata]
  );

  return (
    <ToolUI
      toolId="pdf-flatten"
      accept={{ 'application/pdf': ['.pdf'] }}
      acceptLabel="PDF"
      processFile={processFile}
      outputFileName="flattened.pdf"
      outputMimeType="application/pdf"
      lang={lang}
      dict={dict}
      options={{ flattenForms, removeMetadata }}
    >
      {/* Options */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900">{dict.optionsTitle}</h3>

        {/* Flatten Forms Toggle */}
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={flattenForms}
              onChange={(e) => setFlattenForms(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-zinc-200 rounded-full peer-checked:bg-zinc-900 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <FileCheck className="w-4 h-4" />
              {dict.flattenFormsLabel}
            </div>
            <p className="text-xs text-zinc-500 mt-1">{dict.flattenFormsHint}</p>
          </div>
        </label>

        {/* Remove Metadata Toggle */}
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={removeMetadata}
              onChange={(e) => setRemoveMetadata(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-zinc-200 rounded-full peer-checked:bg-zinc-900 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <Trash2 className="w-4 h-4" />
              {dict.removeMetadataLabel}
            </div>
            <p className="text-xs text-zinc-500 mt-1">{dict.removeMetadataHint}</p>
          </div>
        </label>
      </div>
    </ToolUI>
  );
}
