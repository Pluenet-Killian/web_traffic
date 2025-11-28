'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  VolumeX,
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

interface VideoMuteClientProps {
  lang: string;
}

export default function VideoMuteClient({ lang }: VideoMuteClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { isLoading, progress, load, removeAudio } = useFFmpeg();
  const { addRecentFile, updateBlobUrl } = useRecentFiles();
  const resultUrlRef = useRef<string | null>(null);

  const dict = lang === 'fr' ? {
    uploadLabel: 'Glissez-déposez votre vidéo ici',
    uploadHint: 'MP4, MOV, WebM, AVI (max 500 MB)',
    processButton: 'Supprimer l\'audio',
    loadingFFmpeg: 'Chargement de FFmpeg...',
    processingButton: 'Suppression en cours...',
    downloadButton: 'Télécharger la vidéo',
    successMessage: 'Audio supprimé avec succès !',
    errorMessage: 'Erreur lors de la suppression',
    tryAgain: 'Réessayer',
    removeFile: 'Supprimer',
    fileSelected: 'Fichier sélectionné',
  } : {
    uploadLabel: 'Drag & drop your video here',
    uploadHint: 'MP4, MOV, WebM, AVI (max 500 MB)',
    processButton: 'Remove Audio',
    loadingFFmpeg: 'Loading FFmpeg...',
    processingButton: 'Removing audio...',
    downloadButton: 'Download Video',
    successMessage: 'Audio removed successfully!',
    errorMessage: 'Error during removal',
    tryAgain: 'Try Again',
    removeFile: 'Remove',
    fileSelected: 'File selected',
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
      'video/x-msvideo': ['.avi'],
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024,
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

      const videoBlob = await removeAudio(file);

      if (!videoBlob) {
        throw new Error('Failed to remove audio');
      }

      setResult(videoBlob);

      const url = URL.createObjectURL(videoBlob);
      resultUrlRef.current = url;

      const ext = file.name.split('.').pop() || 'mp4';
      const outputFileName = file.name.replace(/\.[^/.]+$/, '') + '-muted.' + ext;
      const fileId = addRecentFile({
        fileName: outputFileName,
        operation: 'video-mute',
        operationLabel: lang === 'fr' ? 'Vidéo muette' : 'Muted Video',
        outputFormat: ext,
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

    const ext = file.name.split('.').pop() || 'mp4';
    const link = document.createElement('a');
    link.href = resultUrlRef.current;
    link.download = file.name.replace(/\.[^/.]+$/, '') + '-muted.' + ext;
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
              ? 'border-orange-500 bg-orange-50'
              : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-orange-600" />
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
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileVideo className="w-6 h-6 text-orange-600" />
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
                <VolumeX className="w-5 h-5" />
                {dict.processButton}
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-emerald-900">{dict.successMessage}</p>
              <p className="text-sm text-emerald-700">
                {file?.name.replace(/\.[^/.]+$/, '')}-muted.{file?.name.split('.').pop()}
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
