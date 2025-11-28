'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Copy,
  Download,
  ArrowRight,
  RotateCw,
  Upload,
  Check,
  AlertCircle,
  FileText,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { convert } from '@/lib/converters';
import { FORMATS } from '@/config/formats';
import { SAMPLE_DATA } from '@/config/content-matrix';
import ProcessingModal from './processing-modal';
import type { Dictionary } from '@/dictionaries';

interface ConverterUIProps {
  source: string;
  target: string;
  dict: Dictionary;
  lang?: string;
}

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export default function ConverterUI({ source, target, dict, lang = 'en' }: ConverterUIProps) {
  const sourceFormat = FORMATS[source];
  const targetFormat = FORMATS[target];
  const sourceLabel = dict.formats[source]?.label || sourceFormat.label;
  const targetLabel = dict.formats[target]?.label || targetFormat.label;

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rowCount, setRowCount] = useState<number | undefined>();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalProgress, setModalProgress] = useState(0);
  const [modalStatus, setModalStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleConvert = useCallback(async () => {
    if (!input.trim()) return;

    setIsConverting(true);
    setShowModal(true);
    setError('');
    setModalProgress(0);
    setModalStatus(lang === 'fr' ? 'Analyse des données...' : 'Analyzing data...');

    // Simulate progress for ad visibility
    const progressSteps = [
      { progress: 20, status: lang === 'fr' ? 'Parsing...' : 'Parsing...' },
      { progress: 50, status: lang === 'fr' ? 'Conversion...' : 'Converting...' },
      { progress: 80, status: lang === 'fr' ? 'Formatage...' : 'Formatting...' },
      { progress: 100, status: lang === 'fr' ? 'Finalisation...' : 'Finalizing...' },
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setModalProgress(step.progress);
      setModalStatus(step.status);
    }

    const result = convert(source, target, input);

    await new Promise(resolve => setTimeout(resolve, 300));
    setShowModal(false);

    if (result.success) {
      setOutput(result.data);
      setRowCount(result.rowCount);
      setError('');
      showToast(
        result.rowCount
          ? `${dict.converter.conversionSuccess || 'Conversion successful'} (${result.rowCount} ${dict.converter.rows || 'rows'})`
          : dict.converter.conversionSuccess || 'Conversion successful',
        'success'
      );
    } else {
      setOutput('');
      setRowCount(undefined);
      setError(result.error + (result.details ? `\n${result.details}` : ''));
    }

    setIsConverting(false);
  }, [source, target, input, showToast, dict, lang]);

  const handleCopy = useCallback(async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      showToast(dict.converter.copiedToClipboard || 'Copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      showToast(dict.converter.copiedToClipboard || 'Copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output, showToast, dict]);

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
    showToast(dict.converter.downloadStarted || 'Download started', 'success');
  }, [output, targetFormat, showToast, dict]);

  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInput(content);
        setOutput('');
        setError('');
        showToast(`${dict.converter.fileLoaded || 'File loaded'}: ${file.name}`, 'info');
      };
      reader.onerror = () => {
        showToast(dict.converter.fileReadError || 'Error reading file', 'error');
      };
      reader.readAsText(file);
    },
    [showToast, dict]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setRowCount(undefined);
  }, []);

  const loadExample = useCallback(() => {
    const sampleData = SAMPLE_DATA[source];
    if (sampleData) {
      setInput(sampleData);
      setOutput('');
      setError('');
      setRowCount(undefined);
      showToast(dict.converter.exampleLoaded || 'Example loaded', 'info');
    }
  }, [source, showToast, dict]);

  return (
    <div className="w-full space-y-6">
      {/* Processing Modal with Ad */}
      <ProcessingModal
        isOpen={showModal}
        progress={modalProgress}
        status={modalStatus}
        lang={lang}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="btn-secondary cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{dict.converter.importFile}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept={sourceFormat.extension}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>

          <button onClick={loadExample} className="btn-secondary">
            <Sparkles className="w-4 h-4" />
            <span>{dict.converter.loadExample}</span>
          </button>

          <button onClick={handleClear} className="btn-secondary">
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">{dict.converter.clear}</span>
          </button>
        </div>

        {rowCount !== undefined && (
          <span className="badge">
            <FileText className="w-3 h-3 mr-1" />
            {rowCount} {dict.converter.rows || 'rows'}
          </span>
        )}
      </div>

      {/* Editor Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-100 border border-b-0 border-zinc-200 rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-bold text-zinc-700 bg-zinc-200 rounded">
                {sourceLabel}
              </span>
              <span className="text-xs text-zinc-500">{dict.converter.input}</span>
            </div>
          </div>

          <div
            className={`relative flex-1 transition-all duration-200 ${
              isDragging ? 'ring-2 ring-zinc-900 ring-offset-2' : ''
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.converter.pasteHere.replace('{format}', sourceLabel)}
              className="w-full min-h-[320px] p-4 font-mono text-sm leading-relaxed bg-zinc-50 text-zinc-900 placeholder-zinc-400 border border-zinc-200 rounded-b-xl resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              spellCheck={false}
            />

            {isDragging && (
              <div className="absolute inset-0 bg-zinc-100 border-2 border-dashed border-zinc-400 rounded-b-xl flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-zinc-500" />
                  <p className="text-zinc-600 font-medium">
                    {dict.converter.dropFile || 'Drop your file here'}
                  </p>
                </div>
              </div>
            )}

            {!input && !isDragging && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center opacity-60">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-zinc-400" />
                  <p className="text-sm text-zinc-500">
                    {dict.converter.dragDropHint || 'Drag & drop or paste'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border border-b-0 border-zinc-800 rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-bold text-white bg-zinc-700 rounded">
                {targetLabel}
              </span>
              <span className="text-xs text-zinc-400">{dict.converter.output}</span>
            </div>

            {output && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-white transition-colors rounded"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? dict.converter.copied : dict.converter.copy}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-white transition-colors rounded"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{dict.converter.download}</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative flex-1">
            <textarea
              value={output}
              readOnly
              placeholder={dict.converter.resultHere.replace('{format}', targetLabel)}
              className="w-full min-h-[320px] p-4 font-mono text-sm leading-relaxed bg-zinc-950 text-zinc-100 placeholder-zinc-600 border border-zinc-800 rounded-b-xl resize-none focus:outline-none"
              spellCheck={false}
            />

            {!output && !error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center opacity-60">
                  <ArrowRight className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
                  <p className="text-sm text-zinc-500">
                    {dict.converter.resultHere.replace('{format}', targetLabel)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-red-900">{dict.converter.conversionError}</p>
            <pre className="text-sm text-red-700 mt-1 whitespace-pre-wrap font-mono">{error}</pre>
          </div>
        </div>
      )}

      {/* Convert Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleConvert}
          disabled={!input.trim() || isConverting}
          className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all duration-200 shadow-lg shadow-zinc-900/10 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] disabled:active:scale-100"
        >
          {isConverting ? (
            <>
              <RotateCw className="w-5 h-5 animate-spin" />
              <span>{dict.converter.converting}</span>
            </>
          ) : (
            <>
              <span>{dict.converter.convert}</span>
              <span className="px-2 py-0.5 text-xs bg-zinc-700 rounded">{sourceLabel}</span>
              <ArrowRight className="w-4 h-4" />
              <span className="px-2 py-0.5 text-xs bg-zinc-700 rounded">{targetLabel}</span>
            </>
          )}
        </button>

        <p className="text-sm text-zinc-500">
          {dict.converter.securityNotice}
        </p>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-in-right ${
              toast.type === 'success'
                ? 'bg-zinc-900 text-white'
                : toast.type === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-900 text-white'
            }`}
            role="alert"
          >
            {toast.type === 'success' && <Check className="w-4 h-4 text-green-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {toast.type === 'info' && <FileText className="w-4 h-4 text-zinc-400" />}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
