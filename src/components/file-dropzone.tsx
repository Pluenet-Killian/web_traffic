'use client';

import { useCallback, useState } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

export interface FileDropzoneProps {
  accept: Accept;
  maxSize?: number; // in bytes
  onFileSelect: (file: File) => void;
  onFileClear?: () => void;
  selectedFile: File | null;
  label: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

export default function FileDropzone({
  accept,
  maxSize = 50 * 1024 * 1024, // 50MB default
  onFileSelect,
  onFileClear,
  selectedFile,
  label,
  hint,
  error,
  disabled = false,
}: FileDropzoneProps) {
  const [dragError, setDragError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      setDragError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0] as { errors: { code: string }[] };
        if (rejection.errors[0]?.code === 'file-too-large') {
          setDragError(`File too large. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`);
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setDragError('Invalid file type');
        } else {
          setDragError('File rejected');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [maxSize, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled,
  });

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setDragError(null);
      onFileClear?.();
    },
    [onFileClear]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const displayError = error || dragError;

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative flex flex-col items-center justify-center w-full min-h-[200px] p-8
          border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200 ease-out
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDragActive && !isDragReject ? 'border-zinc-900 bg-zinc-100 scale-[1.02]' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${selectedFile ? 'border-zinc-300 bg-zinc-50' : 'border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50'}
          ${displayError ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-zinc-900 truncate max-w-[280px]">
                {selectedFile.name}
              </p>
              <p className="text-sm text-zinc-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            {onFileClear && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-600 bg-zinc-200 hover:bg-zinc-300 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className={`
                w-16 h-16 rounded-xl flex items-center justify-center transition-colors
                ${isDragActive ? 'bg-zinc-900' : 'bg-zinc-200'}
              `}
            >
              <Upload
                className={`w-8 h-8 transition-colors ${isDragActive ? 'text-white' : 'text-zinc-500'}`}
              />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-zinc-900">
                {isDragActive ? 'Drop your file here' : label}
              </p>
              {hint && <p className="text-sm text-zinc-500">{hint}</p>}
              <p className="text-xs text-zinc-400">
                Max size: {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
