'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ChevronRight,
  FileJson,
  Wrench,
  BookOpen,
  Home,
  Braces,
} from 'lucide-react';
import type { Locale } from '@/config/i18n';

interface MobileMenuProps {
  lang: Locale;
  dict: {
    common: {
      home: string;
    };
  };
}

export default function MobileMenu({ lang, dict }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <span className="font-semibold text-zinc-900">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {/* Home */}
          <Link
            href={`/${lang}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <Home className="w-5 h-5 text-zinc-400" />
            <span className="font-medium text-zinc-900">{dict.common.home}</span>
          </Link>

          {/* Converters */}
          <Link
            href={`/${lang}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileJson className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-zinc-900">Converters</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </Link>

          {/* Tools */}
          <Link
            href={`/${lang}/tools`}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-zinc-900">Tools</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </Link>

          {/* Guides */}
          <Link
            href={`/${lang}/guides`}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              <span className="font-medium text-zinc-900">Guides</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </Link>

          {/* Wiki */}
          <Link
            href={`/${lang}/wiki`}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Braces className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-zinc-900">Wiki</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </Link>
        </nav>

        {/* Quick Conversions */}
        <div className="p-4 border-t border-zinc-200">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Popular
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'JSON to CSV', href: `/${lang}/json-to-csv` },
              { label: 'CSV to JSON', href: `/${lang}/csv-to-json` },
              { label: 'JSON to XML', href: `/${lang}/json-to-xml` },
              { label: 'YAML to JSON', href: `/${lang}/yaml-to-json` },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm text-zinc-600 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors text-center"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
