'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Music,
  Upload,
  Loader2,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  FileVideo,
} from 'lucide-react';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { useRecentFiles } from '@/hooks/useRecentFiles';
import ProcessingModal from '@/components/processing-modal';

interface VideoToAudioClientProps {
  lang: string;
}

export default function VideoToAudioClient({ lang }: VideoToAudioClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'mp3' | 'aac'>('mp3');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { isLoading, progress, load, extractAudio } = useFFmpeg();
  const { addRecentFile, updateBlobUrl } = useRecentFiles();
  const resultUrlRef = useRef<string | null>(null);

  const dict = lang === 'fr' ? {
    title: 'Extraire l\'Audio',
    uploadLabel: 'Glissez-déposez votre vidéo ici',
    uploadHint: 'MP4, MOV, WebM, AVI (max 500 MB)',
    formatLabel: 'Format de sortie',
    processButton: 'Extraire l\'audio',
    loadingFFmpeg: 'Chargement de FFmpeg...',
    processingButton: 'Extraction en cours...',
    downloadButton: 'Télécharger l\'audio',
    successMessage: 'Audio extrait avec succès !',
    errorMessage: 'Erreur lors de l\'extraction',
    tryAgain: 'Réessayer',
    removeFile: 'Supprimer',
    fileSelected: 'Fichier sélectionné',
    progress: 'Progression',
  } : {
    title: 'Extract Audio',
    uploadLabel: 'Drag & drop your video here',
    uploadHint: 'MP4, MOV, WebM, AVI (max 500 MB)',
    formatLabel: 'Output format',
    processButton: 'Extract Audio',
    loadingFFmpeg: 'Loading FFmpeg...',
    processingButton: 'Extracting...',
    downloadButton: 'Download Audio',
    successMessage: 'Audio extracted successfully!',
    errorMessage: 'Error during extraction',
    tryAgain: 'Try Again',
    removeFile: 'Remove',
    fileSelected: 'File selected',
    progress: 'Progress',
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
      setError(null);
      // Cleanup previous result URL
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
      'video/x-msvideo': ['.avi'],
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024, // 500 MB
  });

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setShowModal(true);

    try {
      // Load FFmpeg if not already loaded
      const loaded = await load();
      if (!loaded) {
        throw new Error('Failed to load FFmpeg');
      }

      // Extract audio
      const audioBlob = await extractAudio(file, format);

      if (!audioBlob) {
        throw new Error('Failed to extract audio');
      }

      setResult(audioBlob);

      // Create URL for download
      const url = URL.createObjectURL(audioBlob);
      resultUrlRef.current = url;

      // Add to recent files
      const outputFileName = file.name.replace(/\.[^/.]+$/, '') + '.' + format;
      const fileId = addRecentFile({
        fileName: outputFileName,
        operation: 'video-to-audio',
        operationLabel: lang === 'fr' ? 'Vidéo → Audio' : 'Video → Audio',
        outputFormat: format,
      });
      updateBlobUrl(fileId, url);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
      // Keep modal open for 1 second to show completion
      setTimeout(() => setShowModal(false), 1000);
    }
  };

  const handleDownload = () => {
    if (!result || !resultUrlRef.current || !file) return;

    const link = document.createElement('a');
    link.href = resultUrlRef.current;
    link.download = file.name.replace(/\.[^/.]+$/, '') + '.' + format;
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
      {/* Processing Modal */}
      <ProcessingModal
        isOpen={showModal}
        progress={progress.progress}
        status={isLoading ? dict.loadingFFmpeg : dict.processingButton}
        lang={lang}
      />

      {/* File Upload */}
      {!file && !result && (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
            ${isDragActive
              ? 'border-pink-500 bg-pink-50'
              : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-pink-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-zinc-900">{dict.uploadLabel}</p>
              <p className="text-sm text-zinc-500 mt-1">{dict.uploadHint}</p>
            </div>
          </div>
        </div>
      )}

      {/* File Selected */}
      {file && !result && (
        <div className="space-y-6">
          {/* File Info */}
          <div className="flex items-center gap-4 p-4 bg-zinc-100 rounded-xl">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileVideo className="w-6 h-6 text-pink-600" />
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

          {/* Format Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <Music className="w-4 h-4" />
              {dict.formatLabel}
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat('mp3')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  format === 'mp3'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                }`}
              >
                MP3
                <span className="block text-xs font-normal opacity-70">Universal format</span>
              </button>
              <button
                onClick={() => setFormat('aac')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  format === 'aac'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                }`}
              >
                AAC
                <span className="block text-xs font-normal opacity-70">Better quality</span>
              </button>
            </div>
          </div>

          {/* Process Button */}
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
                <Music className="w-5 h-5" />
                {dict.processButton}
              </>
            )}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-emerald-900">{dict.successMessage}</p>
              <p className="text-sm text-emerald-700">
                {file?.name.replace(/\.[^/.]+$/, '')}.{format}
              </p>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-3"
          >
            <Download className="w-5 h-5" />
            {dict.downloadButton}
          </button>

          {/* Try Again */}
          <button
            onClick={handleReset}
            className="w-full py-3 px-6 border-2 border-zinc-200 hover:border-zinc-300 text-zinc-700 font-medium rounded-xl transition-colors"
          >
            {dict.tryAgain}
          </button>
        </div>
      )}

      {/* Error */}
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
