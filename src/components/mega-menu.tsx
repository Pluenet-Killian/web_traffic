'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ArrowRight,
  FileJson,
  FileSpreadsheet,
  FileCode,
  FileType,
  Database,
  FileText,
  Moon,
  FileCheck,
  Shield,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import type { Locale } from '@/config/i18n';

interface MegaMenuProps {
  lang: Locale;
  dict: {
    common: {
      home: string;
      allConverters?: string;
      popularConversions?: string;
    };
  };
}

// Format data with icons
const FORMATS = [
  { id: 'json', label: 'JSON', icon: FileJson, color: 'text-yellow-500' },
  { id: 'csv', label: 'CSV', icon: FileSpreadsheet, color: 'text-green-500' },
  { id: 'xml', label: 'XML', icon: FileCode, color: 'text-orange-500' },
  { id: 'yaml', label: 'YAML', icon: FileType, color: 'text-purple-500' },
  { id: 'sql', label: 'SQL', icon: Database, color: 'text-blue-500' },
  { id: 'markdown', label: 'Markdown', icon: FileText, color: 'text-zinc-600' },
];

// Popular conversions
const POPULAR_CONVERSIONS = [
  { source: 'json', target: 'csv', label: 'JSON to CSV' },
  { source: 'csv', target: 'json', label: 'CSV to JSON' },
  { source: 'json', target: 'xml', label: 'JSON to XML' },
  { source: 'json', target: 'yaml', label: 'JSON to YAML' },
  { source: 'xml', target: 'json', label: 'XML to JSON' },
  { source: 'yaml', target: 'json', label: 'YAML to JSON' },
];

// Tools data
const TOOLS = [
  {
    id: 'pdf-dark-mode',
    label: 'PDF Dark Mode',
    description: 'Convert PDFs for night reading',
    icon: Moon,
    color: 'text-violet-500',
    category: 'PDF',
  },
  {
    id: 'pdf-flatten',
    label: 'PDF Flatten',
    description: 'Secure & flatten forms',
    icon: FileCheck,
    color: 'text-blue-500',
    category: 'PDF',
  },
  {
    id: 'image-watermark',
    label: 'Image Watermark',
    description: 'Protect your photos',
    icon: Shield,
    color: 'text-emerald-500',
    category: 'Image',
  },
];

// Guides data
const GUIDES = [
  { slug: 'how-to-convert-pdf-dark-mode', label: 'PDF Dark Mode Guide' },
  { slug: 'how-to-flatten-pdf-forms', label: 'Flatten PDF Forms' },
  { slug: 'how-to-add-watermark-to-image', label: 'Add Watermark to Images' },
  { slug: 'how-to-convert-json-to-csv', label: 'JSON to CSV Tutorial' },
  { slug: 'how-to-protect-photos-online', label: 'Protect Photos Online' },
];

export default function MegaMenu({ lang, dict }: MegaMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <nav ref={menuRef} className="hidden lg:flex items-center gap-1">
      {/* Home */}
      <Link
        href={`/${lang}`}
        className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 rounded-lg transition-colors duration-200"
      >
        {dict.common.home}
      </Link>

      {/* Converters Mega Menu */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter('converters')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
            activeMenu === 'converters'
              ? 'text-zinc-900 bg-zinc-100'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Converters
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeMenu === 'converters' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Mega Menu Dropdown */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 transition-all duration-200 ${
            activeMenu === 'converters'
              ? 'opacity-100 visible translate-y-0'
              : 'opacity-0 invisible -translate-y-2'
          }`}
        >
          <div className="w-[640px] bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-zinc-100">
              {/* Left: Formats Grid */}
              <div className="p-5">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                  Convert From
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {FORMATS.map((format) => {
                    const Icon = format.icon;
                    return (
                      <Link
                        key={format.id}
                        href={`/${lang}/${format.id}-to-csv`}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                      >
                        <Icon className={`w-4 h-4 ${format.color}`} />
                        <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                          {format.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right: Popular Conversions */}
              <div className="p-5 bg-zinc-50/50">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                  Popular
                </div>
                <div className="space-y-1">
                  {POPULAR_CONVERSIONS.map((conv) => (
                    <Link
                      key={`${conv.source}-${conv.target}`}
                      href={`/${lang}/${conv.source}-to-${conv.target}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white transition-colors group"
                    >
                      <span className="text-sm text-zinc-600 group-hover:text-zinc-900">
                        {conv.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100">
              <Link
                href={`/${lang}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                View all 42 converters
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Mega Menu */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter('tools')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
            activeMenu === 'tools'
              ? 'text-zinc-900 bg-zinc-100'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Tools
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeMenu === 'tools' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Tools Dropdown */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 transition-all duration-200 ${
            activeMenu === 'tools'
              ? 'opacity-100 visible translate-y-0'
              : 'opacity-0 invisible -translate-y-2'
          }`}
        >
          <div className="w-[400px] bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden">
            <div className="p-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                PDF & Image Tools
              </div>
              <div className="space-y-1">
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.id}
                      href={`/${lang}/tools/${tool.id}`}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                        <Icon className={`w-5 h-5 ${tool.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-900">
                            {tool.label}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider px-1.5 py-0.5 bg-zinc-100 rounded">
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100">
              <Link
                href={`/${lang}/tools`}
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                View all tools
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Guides Mega Menu */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter('guides')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
            activeMenu === 'guides'
              ? 'text-zinc-900 bg-zinc-100'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Guides
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeMenu === 'guides' ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Guides Dropdown */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 transition-all duration-200 ${
            activeMenu === 'guides'
              ? 'opacity-100 visible translate-y-0'
              : 'opacity-0 invisible -translate-y-2'
          }`}
        >
          <div className="w-[320px] bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden">
            <div className="p-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                How-To Guides
              </div>
              <div className="space-y-1">
                {GUIDES.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/${lang}/guides/${guide.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                  >
                    <BookOpen className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" />
                    <span className="text-sm text-zinc-600 group-hover:text-zinc-900">
                      {guide.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100">
              <Link
                href={`/${lang}/guides`}
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                View all guides
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
