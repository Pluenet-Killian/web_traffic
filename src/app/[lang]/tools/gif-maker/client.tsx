'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Image as ImageIcon,
  Upload,
  Loader2,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  FileVideo,
  Settings2,
} from 'lucide-react';
import { useFFmpeg, type GifOptions } from '@/hooks/useFFmpeg';
import { useRecentFiles } from '@/hooks/useRecentFiles';
import ProcessingModal from '@/components/processing-modal';

interface GifMakerClientProps {
  lang: string;
}

export default function GifMakerClient({ lang }: GifMakerClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<GifOptions>({
    fps: 10,
    width: 480,
    startTime: 0,
    duration: 5,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { isLoading, progress, load, createGif } = useFFmpeg();
  const { addRecentFile, updateBlobUrl } = useRecentFiles();
  const resultUrlRef = useRef<string | null>(null);

  const dict = lang === 'fr' ? {
    uploadLabel: 'Glissez-déposez votre vidéo ici',
    uploadHint: 'MP4, MOV, WebM (max 100 MB recommandé)',
    settingsLabel: 'Paramètres du GIF',
    fpsLabel: 'Images par seconde',
    widthLabel: 'Largeur (px)',
    startTimeLabel: 'Début (secondes)',
    durationLabel: 'Durée (secondes)',
    processButton: 'Créer le GIF',
    loadingFFmpeg: 'Chargement de FFmpeg...',
    processingButton: 'Création en cours...',
    downloadButton: 'Télécharger le GIF',
    successMessage: 'GIF créé avec succès !',
    errorMessage: 'Erreur lors de la création',
    tryAgain: 'Réessayer',
    previewHint: 'Le GIF sera créé à partir des {duration}s depuis {start}s',
  } : {
    uploadLabel: 'Drag & drop your video here',
    uploadHint: 'MP4, MOV, WebM (max 100 MB recommended)',
    settingsLabel: 'GIF Settings',
    fpsLabel: 'Frames per second',
    widthLabel: 'Width (px)',
    startTimeLabel: 'Start time (seconds)',
    durationLabel: 'Duration (seconds)',
    processButton: 'Create GIF',
    loadingFFmpeg: 'Loading FFmpeg...',
    processingButton: 'Creating GIF...',
    downloadButton: 'Download GIF',
    successMessage: 'GIF created successfully!',
    errorMessage: 'Error during creation',
    tryAgain: 'Try Again',
    previewHint: 'GIF will be created from {duration}s starting at {start}s',
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
      setError(null);
      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = null;
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/webm': ['.webm'],
    },
    maxFiles: 1,
    maxSize: 200 * 1024 * 1024,
  });

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setShowModal(true);

    try {
      const loaded = await load();
      if (!loaded) {
        throw new Error('Failed to load FFmpeg');
      }

      const gifBlob = await createGif(file, options);

      if (!gifBlob) {
        throw new Error('Failed to create GIF');
      }

      setResult(gifBlob);

      const url = URL.createObjectURL(gifBlob);
      resultUrlRef.current = url;

      const outputFileName = file.name.replace(/\.[^/.]+$/, '') + '.gif';
      const fileId = addRecentFile({
        fileName: outputFileName,
        operation: 'gif-maker',
        operationLabel: 'GIF Maker',
        outputFormat: 'gif',
      });
      updateBlobUrl(fileId, url);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setShowModal(false), 1000);
    }
  };

  const handleDownload = () => {
    if (!result || !resultUrlRef.current || !file) return;

    const link = document.createElement('a');
    link.href = resultUrlRef.current;
    link.download = file.name.replace(/\.[^/.]+$/, '') + '.gif';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
  };

  return (
    <div className="space-y-6">
      <ProcessingModal
        isOpen={showModal}
        progress={progress.progress}
        status={isLoading ? dict.loadingFFmpeg : dict.processingButton}
        lang={lang}
      />

      {!file && !result && (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
            ${isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-zinc-900">{dict.uploadLabel}</p>
              <p className="text-sm text-zinc-500 mt-1">{dict.uploadHint}</p>
            </div>
          </div>
        </div>
      )}

      {file && !result && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-zinc-100 rounded-xl">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileVideo className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-900 truncate">{file.name}</p>
              <p className="text-sm text-zinc-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={handleReset}
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-zinc-500" />
              <h3 className="font-medium text-zinc-900">{dict.settingsLabel}</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  {dict.fpsLabel}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={options.fps}
                    onChange={(e) => setOptions({ ...options, fps: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-sm font-mono bg-zinc-100 px-2 py-1 rounded w-12 text-center">
                    {options.fps}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  {dict.widthLabel}
                </label>
                <select
                  value={options.width}
                  onChange={(e) => setOptions({ ...options, width: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={320}>320px (Small)</option>
                  <option value={480}>480px (Medium)</option>
                  <option value={640}>640px (Large)</option>
                  <option value={800}>800px (HD)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  {dict.startTimeLabel}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={options.startTime}
                  onChange={(e) => setOptions({ ...options, startTime: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  {dict.durationLabel}
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  step="0.5"
                  value={options.duration}
                  onChange={(e) => setOptions({ ...options, duration: parseFloat(e.target.value) || 5 })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <p className="text-xs text-zinc-500 mt-4">
              {dict.previewHint
                .replace('{duration}', String(options.duration))
                .replace('{start}', String(options.startTime))}
            </p>
          </div>

          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full py-4 px-6 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {dict.processingButton}
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                {dict.processButton}
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Preview */}
          {resultUrlRef.current && (
            <div className="flex justify-center bg-zinc-100 rounded-xl p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrlRef.current}
                alt="Generated GIF"
                className="max-w-full rounded-lg shadow-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          )}

          <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-emerald-900">{dict.successMessage}</p>
              <p className="text-sm text-emerald-700">
                {file?.name.replace(/\.[^/.]+$/, '')}.gif
                {result && ` (${(result.size / 1024).toFixed(0)} KB)`}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-3"
          >
            <Download className="w-5 h-5" />
            {dict.downloadButton}
          </button>

          <button
            onClick={handleReset}
            className="w-full py-3 px-6 border-2 border-zinc-200 hover:border-zinc-300 text-zinc-700 font-medium rounded-xl transition-colors"
          >
            {dict.tryAgain}
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-900">{dict.errorMessage}</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
