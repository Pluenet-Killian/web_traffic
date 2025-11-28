'use client';

import { useState, useCallback } from 'react';
import {
  Download,
  Check,
  AlertCircle,
  Loader2,
  RotateCw,
  Sparkles,
  Minus,
  Square,
  X,
  FileType,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import FileDropzone from './file-dropzone';
import ProcessingModal from './processing-modal';
import type { Accept } from 'react-dropzone';
import type { ProcessingProgress } from '@/lib/pdf-tools';

interface ToolUIProps {
  toolId: string;
  accept: Accept;
  acceptLabel: string;
  processFile: (file: File, options: Record<string, unknown>, onProgress: (p: ProcessingProgress) => void) => Promise<Uint8Array>;
  outputFileName: string;
  outputMimeType: string;
  children?: React.ReactNode; // Options controls
  lang?: string;
  dict: {
    uploadLabel: string;
    uploadHint: string;
    processButton: string;
    processingButton: string;
    downloadButton: string;
    successMessage: string;
    errorMessage: string;
    tryAgain: string;
  };
  options?: Record<string, unknown>;
}

export default function ToolUI({
  accept,
  acceptLabel,
  processFile,
  outputFileName,
  outputMimeType,
  children,
  lang = 'en',
  dict,
  options = {},
}: ToolUIProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setProgress(null);
    setProcessingTime(null);
  }, []);

  const handleFileClear = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(null);
    setProcessingTime(null);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!file) return;

    const startTime = Date.now();
    setProcessing(true);
    setShowModal(true);
    setError(null);
    setProgress({ current: 0, total: 100, status: 'Starting...' });

    try {
      const resultData = await processFile(file, options, setProgress);

      // Add artificial delay for ad visibility (minimum 1.5s total processing time)
      await new Promise(resolve => setTimeout(resolve, 500));

      setResult(resultData);
      setProcessingTime(Date.now() - startTime);
      setShowModal(false);

      // Trigger confetti on success!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#18181b', '#3f3f46', '#71717a', '#a1a1aa'],
      });
    } catch (err) {
      setShowModal(false);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  }, [file, options, processFile]);

  const performDownload = useCallback(() => {
    if (!result) return;

    const blob = new Blob([new Uint8Array(result)], { type: outputMimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, outputFileName, outputMimeType]);

  const handleDownload = useCallback(async () => {
    if (!result) return;

    // Show modal with ad for download (high-intent moment)
    setShowModal(true);
    setProgress({ current: 0, total: 100, status: lang === 'fr' ? 'Préparation du fichier...' : 'Preparing file...' });

    // Simulate preparation with progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress({
        current: i,
        total: 100,
        status: i < 50
          ? (lang === 'fr' ? 'Optimisation...' : 'Optimizing...')
          : (lang === 'fr' ? 'Finalisation...' : 'Finalizing...')
      });
    }

    setShowModal(false);
    performDownload();
  }, [result, lang, performDownload]);

  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(null);
    setProcessingTime(null);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      {/* Processing Modal with Ad */}
      <ProcessingModal
        isOpen={showModal}
        progress={progress?.current || 0}
        status={progress?.status || ''}
        lang={lang}
      />

      {/* macOS Style Workspace Window */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden">
        {/* Window Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-100 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            {/* Traffic Light Buttons */}
            <div className="flex items-center gap-1.5">
              <button className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors" />
              <button className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors" />
              <button className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors" />
            </div>
          </div>

          {/* Title */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <FileType className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-600">
              {file ? file.name : (lang === 'fr' ? 'Aucun fichier' : 'No file selected')}
            </span>
          </div>

          {/* File info */}
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            {file && (
              <>
                <span>{formatFileSize(file.size)}</span>
                {processingTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {(processingTime / 1000).toFixed(1)}s
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Workspace Content */}
        <div className="p-6 space-y-6">
          {/* File Upload Zone */}
          <FileDropzone
            accept={accept}
            maxSize={50 * 1024 * 1024}
            onFileSelect={handleFileSelect}
            onFileClear={handleFileClear}
            selectedFile={file}
            label={dict.uploadLabel}
            hint={`${acceptLabel} • ${dict.uploadHint}`}
            error={error || undefined}
            disabled={processing}
          />

          {/* Options Panel */}
          {children && file && !result && (
            <div className="relative">
              <div className="absolute -top-3 left-4 px-2 bg-white">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {lang === 'fr' ? 'Options' : 'Options'}
                </span>
              </div>
              <div className="p-5 pt-6 bg-zinc-50/50 rounded-xl border border-zinc-200">
                {children}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {processing && progress && (
            <div className="relative">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-600 font-medium">{progress.status}</span>
                <span className="font-bold text-zinc-900">{progress.current}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-zinc-600 to-zinc-900 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress.current}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {result && (
            <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-emerald-900">{dict.successMessage}</p>
                <p className="text-sm text-emerald-700 mt-0.5">
                  {lang === 'fr'
                    ? `Traité en ${(processingTime! / 1000).toFixed(1)} secondes`
                    : `Processed in ${(processingTime! / 1000).toFixed(1)} seconds`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-red-900">{dict.errorMessage}</p>
                <pre className="text-sm text-red-700 mt-1 whitespace-pre-wrap font-mono">{error}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border-t border-zinc-200">
          {/* Left - Status */}
          <div className="flex items-center gap-2">
            {processing && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{dict.processingButton}</span>
              </div>
            )}
            {result && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{lang === 'fr' ? 'Prêt au téléchargement' : 'Ready to download'}</span>
              </div>
            )}
            {!processing && !result && file && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                <span>{lang === 'fr' ? 'Prêt à traiter' : 'Ready to process'}</span>
              </div>
            )}
          </div>

          {/* Right - Action Buttons */}
          <div className="flex items-center gap-3">
            {result && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 hover:border-zinc-400 transition-all"
              >
                <RotateCw className="w-4 h-4" />
                <span>{dict.tryAgain}</span>
              </button>
            )}

            {!result ? (
              <button
                onClick={handleProcess}
                disabled={!file || processing}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] disabled:active:scale-100"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{dict.processingButton}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{dict.processButton}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>{dict.downloadButton}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
