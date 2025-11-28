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
  ChevronRight,
  Shield,
  X,
} from 'lucide-react';
import { convert } from '@/lib/converters';
import { FORMATS } from '@/config/formats';
import { SAMPLE_DATA } from '@/config/content-matrix';
import type { Dictionary } from '@/dictionaries';

interface ConverterUIProps {
  source: string;
  target: string;
  dict: Dictionary;
}

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export default function ConverterUI({ source, target, dict }: ConverterUIProps) {
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast management
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

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;

    setIsConverting(true);
    setError('');

    setTimeout(() => {
      const result = convert(source, target, input);

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
    }, 100);
  }, [source, target, input, showToast, dict]);

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

  // Drag & Drop handlers
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

  // Format badge colors with updated palette
  const getFormatBadgeClasses = (format: string) => {
    const colorMap: Record<string, string> = {
      json: 'bg-amber-500 text-white',
      csv: 'bg-emerald-500 text-white',
      xml: 'bg-orange-500 text-white',
      yaml: 'bg-rose-500 text-white',
      sql: 'bg-blue-500 text-white',
      markdown: 'bg-purple-500 text-white',
      html: 'bg-cyan-500 text-white',
    };
    return colorMap[format] || 'bg-zinc-500 text-white';
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Import File */}
          <label className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 active:scale-[0.98]">
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

          {/* Load Example */}
          <button
            onClick={loadExample}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{dict.converter.loadExample}</span>
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 active:scale-[0.98]"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">{dict.converter.clear}</span>
          </button>
        </div>

        {/* Row count badge */}
        {rowCount !== undefined && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 bg-zinc-100 rounded-full">
            <FileText className="w-3.5 h-3.5" />
            {rowCount} {dict.converter.rows || 'rows'}
          </div>
        )}
      </div>

      {/* IDE-Style Editor Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input Editor */}
        <div className="flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-800 rounded-t-xl border-b border-zinc-700">
            <div className="flex items-center gap-3">
              {/* Window Dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              {/* Format Badge */}
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${getFormatBadgeClasses(source)}`}>
                {sourceLabel}
              </span>
              <span className="text-xs text-zinc-500">{dict.converter.input}</span>
            </div>
          </div>

          {/* Editor Body */}
          <div
            className={`relative flex-1 bg-zinc-900 rounded-b-xl overflow-hidden transition-all duration-200 ${
              isDragging ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-900' : ''
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Line Numbers Gutter */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-zinc-800/50 border-r border-zinc-700/50 pointer-events-none">
              <div className="flex flex-col items-end pr-3 pt-4 text-xs text-zinc-600 font-mono leading-relaxed select-none">
                {Array.from({ length: Math.max(input.split('\n').length, 15) }, (_, i) => (
                  <span key={i + 1}>{i + 1}</span>
                ))}
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.converter.pasteHere.replace('{format}', sourceLabel)}
              className="w-full min-h-[360px] h-full pl-14 pr-4 py-4 font-mono text-sm leading-relaxed bg-transparent text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none"
              spellCheck={false}
            />

            {/* Drag Overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="text-indigo-300 font-medium">
                    {dict.converter.dropFile || 'Drop your file here'}
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!input && !isDragging && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center opacity-50">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                  <p className="text-sm text-zinc-500">
                    {dict.converter.dragDropHint || 'Drag & drop a file or paste your data'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Editor */}
        <div className="flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-100 rounded-t-xl border border-b-0 border-zinc-200">
            <div className="flex items-center gap-3">
              {/* Window Dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
              </div>
              {/* Format Badge */}
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${getFormatBadgeClasses(target)}`}>
                {targetLabel}
              </span>
              <span className="text-xs text-zinc-500">{dict.converter.output}</span>
            </div>

            {/* Output Actions */}
            {output && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg transition-all duration-200"
                  title={dict.converter.copy}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? dict.converter.copied : dict.converter.copy}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg transition-all duration-200"
                  title={dict.converter.download}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{dict.converter.download}</span>
                </button>
              </div>
            )}
          </div>

          {/* Editor Body */}
          <div className="relative flex-1 bg-zinc-50 rounded-b-xl border border-t-0 border-zinc-200 overflow-hidden">
            {/* Line Numbers Gutter */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-zinc-100 border-r border-zinc-200 pointer-events-none">
              <div className="flex flex-col items-end pr-3 pt-4 text-xs text-zinc-400 font-mono leading-relaxed select-none">
                {Array.from({ length: Math.max(output.split('\n').length, 15) }, (_, i) => (
                  <span key={i + 1}>{i + 1}</span>
                ))}
              </div>
            </div>

            <textarea
              value={output}
              readOnly
              placeholder={dict.converter.resultHere.replace('{format}', targetLabel)}
              className="w-full min-h-[360px] h-full pl-14 pr-4 py-4 font-mono text-sm leading-relaxed bg-transparent text-zinc-900 placeholder-zinc-400 resize-none focus:outline-none"
              spellCheck={false}
            />

            {/* Empty State */}
            {!output && !error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center opacity-50">
                  <ChevronRight className="w-12 h-12 mx-auto mb-3 text-zinc-400" />
                  <p className="text-sm text-zinc-500">
                    {dict.converter.resultHere.replace('{format}', targetLabel)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-red-900">{dict.converter.conversionError}</p>
            <pre className="text-sm text-red-700 mt-1.5 whitespace-pre-wrap font-mono bg-red-100/50 p-3 rounded-lg overflow-x-auto">
              {error}
            </pre>
          </div>
        </div>
      )}

      {/* Convert Button */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleConvert}
          disabled={!input.trim() || isConverting}
          className="group relative inline-flex items-center gap-3 px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98] disabled:active:scale-100"
        >
          {isConverting ? (
            <>
              <RotateCw className="w-6 h-6 animate-spin" />
              <span>{dict.converter.converting}</span>
            </>
          ) : (
            <>
              <span>{dict.converter.convert}</span>
              <span className={`px-2 py-0.5 text-sm rounded ${getFormatBadgeClasses(source)}`}>
                {sourceLabel}
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              <span className={`px-2 py-0.5 text-sm rounded ${getFormatBadgeClasses(target)}`}>
                {targetLabel}
              </span>
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Shield className="w-4 h-4 text-green-500" />
          <span>{dict.converter.securityNotice}</span>
        </div>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-slide-in-right ${
              toast.type === 'success'
                ? 'bg-green-50/95 border-green-200 text-green-800'
                : toast.type === 'error'
                  ? 'bg-red-50/95 border-red-200 text-red-800'
                  : 'bg-white/95 border-zinc-200 text-zinc-800'
            }`}
            role="alert"
          >
            {toast.type === 'success' && (
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 opacity-50" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
