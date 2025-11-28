'use client';

import { useState, useCallback } from 'react';
import { Copy, Download, ArrowRight, RefreshCw, Upload, Check, AlertCircle } from 'lucide-react';
import { convert } from '@/lib/converters';
import { FORMATS } from '@/config/formats';

interface ConverterUIProps {
  source: string;
  target: string;
}

export default function ConverterUI({ source, target }: ConverterUIProps) {
  const sourceFormat = FORMATS[source];
  const targetFormat = FORMATS[target];

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = useCallback(() => {
    setIsConverting(true);
    setError('');

    // Simule un délai pour l'UX (conversion instantanée sinon)
    setTimeout(() => {
      const result = convert(source, target, input);

      if (result.success) {
        setOutput(result.data);
        setError('');
      } else {
        setOutput('');
        setError(result.error);
      }

      setIsConverting(false);
    }, 100);
  }, [source, target, input]);

  const handleCopy = useCallback(async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback pour les navigateurs sans API clipboard
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;

    const blob = new Blob([output], { type: targetFormat.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted${targetFormat.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output, targetFormat]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
  }, []);

  const loadExample = useCallback(() => {
    setInput(sourceFormat.placeholder);
    setOutput('');
    setError('');
  }, [sourceFormat.placeholder]);

  return (
    <div className="w-full space-y-6">
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
          <Upload size={18} />
          <span className="text-sm font-medium">Importer fichier</span>
          <input
            type="file"
            accept={sourceFormat.extension}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          onClick={loadExample}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Charger exemple
        </button>

        <button
          onClick={handleClear}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Effacer
        </button>
      </div>

      {/* Zone de conversion */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-white text-sm font-bold rounded ${sourceFormat.color}`}>
              {sourceFormat.label}
            </span>
            <span className="text-sm text-gray-500">Entrée</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Collez votre ${sourceFormat.label} ici...`}
            className="w-full h-80 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-white text-sm font-bold rounded ${targetFormat.color}`}>
                {targetFormat.label}
              </span>
              <span className="text-sm text-gray-500">Sortie</span>
            </div>

            {output && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  {copied ? 'Copié!' : 'Copier'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  Télécharger
                </button>
              </div>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={`Le résultat ${targetFormat.label} apparaîtra ici...`}
            className="w-full h-80 p-4 font-mono text-sm border border-gray-300 rounded-lg bg-gray-50 resize-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-red-800">Erreur de conversion</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Bouton de conversion */}
      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          disabled={!input.trim() || isConverting}
          className="flex items-center gap-3 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConverting ? (
            <>
              <RefreshCw className="animate-spin" size={24} />
              Conversion en cours...
            </>
          ) : (
            <>
              Convertir {sourceFormat.label}
              <ArrowRight size={24} />
              {targetFormat.label}
            </>
          )}
        </button>
      </div>

      {/* Indicateur de sécurité */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Traitement 100% local - Vos données ne quittent jamais votre navigateur</span>
      </div>
    </div>
  );
}
