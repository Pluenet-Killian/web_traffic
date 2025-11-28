'use client';

import { useState } from 'react';
import { Clock, Download, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useRecentFiles, formatRelativeTime } from '@/hooks/useRecentFiles';

interface RecentFilesProps {
  lang: string;
  className?: string;
  variant?: 'sidebar' | 'inline';
}

export default function RecentFiles({ lang, className = '', variant = 'sidebar' }: RecentFilesProps) {
  const { recentFiles, isLoaded, removeRecentFile, clearHistory, hasHistory, isBlobValid } =
    useRecentFiles();
  const [isExpanded, setIsExpanded] = useState(true);

  // Don't render until localStorage is loaded (avoid hydration mismatch)
  if (!isLoaded) return null;

  // Don't render if no history
  if (!hasHistory) return null;

  const content = {
    en: {
      title: 'Recent Conversions',
      download: 'Download',
      noLongerAvailable: 'File expired',
      clearAll: 'Clear history',
      confirmClear: 'Clear all?',
    },
    fr: {
      title: 'Conversions récentes',
      download: 'Télécharger',
      noLongerAvailable: 'Fichier expiré',
      clearAll: 'Effacer l\'historique',
      confirmClear: 'Tout effacer ?',
    },
  };

  const t = content[lang as 'en' | 'fr'] || content.en;

  const handleDownload = (blobUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (variant === 'inline') {
    return (
      <div className={`bg-zinc-50 border border-zinc-200 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-500" />
            <h4 className="font-medium text-sm text-zinc-700">{t.title}</h4>
          </div>
          <button
            onClick={clearHistory}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {t.clearAll}
          </button>
        </div>

        <div className="space-y-2">
          {recentFiles.slice(0, 3).map((file) => {
            const canDownload = isBlobValid(file.blobUrl);

            return (
              <div
                key={file.id}
                className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-zinc-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{file.fileName}</p>
                  <p className="text-xs text-zinc-500">
                    {file.operationLabel} • {formatRelativeTime(file.timestamp, lang)}
                  </p>
                </div>
                {canDownload && file.blobUrl ? (
                  <button
                    onClick={() => handleDownload(file.blobUrl!, file.fileName)}
                    className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                    title={t.download}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs text-zinc-400 italic">{t.noLongerAvailable}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Sidebar variant (default)
  return (
    <div className={`bg-white border border-zinc-200 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50 border-b border-zinc-200 hover:bg-zinc-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500" />
          <h4 className="font-medium text-sm text-zinc-700">{t.title}</h4>
          <span className="px-1.5 py-0.5 text-xs bg-zinc-200 text-zinc-600 rounded-full">
            {recentFiles.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 space-y-2">
          {recentFiles.map((file) => {
            const canDownload = isBlobValid(file.blobUrl);

            return (
              <div
                key={file.id}
                className="group flex items-center gap-3 p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate" title={file.fileName}>
                    {file.fileName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {file.operationLabel}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {formatRelativeTime(file.timestamp, lang)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {canDownload && file.blobUrl ? (
                    <button
                      onClick={() => handleDownload(file.blobUrl!, file.fileName)}
                      className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title={t.download}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-400 px-2">{t.noLongerAvailable}</span>
                  )}
                  <button
                    onClick={() => removeRecentFile(file.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Clear all button */}
          <button
            onClick={clearHistory}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.clearAll}
          </button>
        </div>
      )}
    </div>
  );
}
