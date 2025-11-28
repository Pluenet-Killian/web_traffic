'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Copy,
  Download,
  ArrowRight,
  RefreshCw,
  Upload,
  Check,
  AlertCircle,
  FileText,
  Sparkles,
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
      // Fallback for older browsers
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

  return (
    <div className="w-full space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
          <Upload size={18} />
          <span className="text-sm font-medium">{dict.converter.importFile}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={sourceFormat.extension}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </label>

        <button
          onClick={loadExample}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Sparkles size={16} />
          {dict.converter.loadExample}
        </button>

        <button
          onClick={handleClear}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          {dict.converter.clear}
        </button>
      </div>

      {/* Conversion zones */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input with Drag & Drop */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-white text-sm font-bold rounded ${sourceFormat.color}`}>
              {sourceLabel}
            </span>
            <span className="text-sm text-gray-500">{dict.converter.input}</span>
          </div>
          <div
            className={`relative ${isDragging ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.converter.pasteHere.replace('{format}', sourceLabel)}
              className="w-full h-80 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
              spellCheck={false}
            />
            {/* Drag overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-blue-50 bg-opacity-90 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-blue-700 font-medium">
                    {dict.converter.dropFile || 'Drop your file here'}
                  </p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {dict.converter.dragDropHint || 'Drag & drop a file or paste your data'}
          </p>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-white text-sm font-bold rounded ${targetFormat.color}`}>
                {targetLabel}
              </span>
              <span className="text-sm text-gray-500">{dict.converter.output}</span>
              {rowCount !== undefined && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  {rowCount} {dict.converter.rows || 'rows'}
                </span>
              )}
            </div>

            {output && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  {copied ? dict.converter.copied : dict.converter.copy}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  {dict.converter.download}
                </button>
              </div>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={dict.converter.resultHere.replace('{format}', targetLabel)}
            className="w-full h-80 p-4 font-mono text-sm border border-gray-300 rounded-lg bg-gray-50 resize-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-red-800">{dict.converter.conversionError}</p>
            <pre className="text-sm text-red-600 mt-1 whitespace-pre-wrap font-mono">{error}</pre>
          </div>
        </div>
      )}

      {/* Convert button */}
      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          disabled={!input.trim() || isConverting}
          className="flex items-center gap-3 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConverting ? (
            <>
              <RefreshCw className="animate-spin" size={24} />
              {dict.converter.converting}
            </>
          ) : (
            <>
              {dict.converter.convert} {sourceLabel}
              <ArrowRight size={24} />
              {targetLabel}
            </>
          )}
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>{dict.converter.securityNotice}</span>
      </div>

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : toast.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
            role="alert"
          >
            {toast.type === 'success' && <Check className="w-5 h-5 text-green-500" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
            {toast.type === 'info' && <FileText className="w-5 h-5 text-blue-500" />}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
