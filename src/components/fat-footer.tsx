import Link from 'next/link';
import { ArrowUpRight, FileJson, Shield, Zap } from 'lucide-react';
import type { Locale } from '@/config/i18n';
import type { Dictionary } from '@/dictionaries';

interface FatFooterProps {
  lang: Locale;
  dict: Dictionary;
}

// All converters grouped by source
const CONVERTER_GROUPS = [
  {
    title: 'JSON Converters',
    links: [
      { label: 'JSON to CSV', href: 'json-to-csv' },
      { label: 'JSON to XML', href: 'json-to-xml' },
      { label: 'JSON to YAML', href: 'json-to-yaml' },
      { label: 'JSON to SQL', href: 'json-to-sql' },
      { label: 'JSON to Markdown', href: 'json-to-markdown' },
      { label: 'JSON to HTML', href: 'json-to-html' },
    ],
  },
  {
    title: 'CSV Converters',
    links: [
      { label: 'CSV to JSON', href: 'csv-to-json' },
      { label: 'CSV to XML', href: 'csv-to-xml' },
      { label: 'CSV to YAML', href: 'csv-to-yaml' },
      { label: 'CSV to SQL', href: 'csv-to-sql' },
      { label: 'CSV to Markdown', href: 'csv-to-markdown' },
      { label: 'CSV to HTML', href: 'csv-to-html' },
    ],
  },
  {
    title: 'XML & YAML',
    links: [
      { label: 'XML to JSON', href: 'xml-to-json' },
      { label: 'XML to CSV', href: 'xml-to-csv' },
      { label: 'YAML to JSON', href: 'yaml-to-json' },
      { label: 'YAML to CSV', href: 'yaml-to-csv' },
      { label: 'SQL to JSON', href: 'sql-to-json' },
      { label: 'SQL to CSV', href: 'sql-to-csv' },
    ],
  },
];

// Tools
const TOOLS = [
  { label: 'PDF Dark Mode', href: 'tools/pdf-dark-mode' },
  { label: 'PDF Flatten', href: 'tools/pdf-flatten' },
  { label: 'Image Watermark', href: 'tools/image-watermark' },
];

// Guides
const GUIDES = [
  { label: 'PDF Dark Mode Guide', href: 'guides/how-to-convert-pdf-dark-mode' },
  { label: 'Flatten PDF Forms', href: 'guides/how-to-flatten-pdf-forms' },
  { label: 'Watermark Images', href: 'guides/how-to-add-watermark-to-image' },
  { label: 'JSON to CSV Tutorial', href: 'guides/how-to-convert-json-to-csv' },
  { label: 'Protect Photos', href: 'guides/how-to-protect-photos-online' },
];

// Legal links (translated)
const LEGAL_LINKS: Record<string, { privacy: string; terms: string; cookies: string }> = {
  en: { privacy: 'Privacy Policy', terms: 'Terms of Service', cookies: 'Cookie Policy' },
  fr: { privacy: 'Confidentialité', terms: 'CGU', cookies: 'Cookies' },
  es: { privacy: 'Privacidad', terms: 'Términos', cookies: 'Cookies' },
  de: { privacy: 'Datenschutz', terms: 'Nutzungsbedingungen', cookies: 'Cookies' },
  pt: { privacy: 'Privacidade', terms: 'Termos', cookies: 'Cookies' },
};

export default function FatFooter({ lang, dict }: FatFooterProps) {
  return (
    <footer className="bg-zinc-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section - USPs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-16 border-b border-zinc-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">100% Private</h3>
              <p className="text-sm text-zinc-400">
                All processing happens in your browser. Your files never leave your device.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Instant Results</h3>
              <p className="text-sm text-zinc-400">
                No upload delays, no waiting. Convert your data in milliseconds.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
              <FileJson className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">42+ Formats</h3>
              <p className="text-sm text-zinc-400">
                JSON, CSV, XML, YAML, SQL, Markdown, HTML and more.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Converter Groups */}
          {CONVERTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${lang}/${link.href}`}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Tools</h4>
            <ul className="space-y-2.5">
              {TOOLS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}/${link.href}`}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/${lang}/tools`}
                  className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  All Tools
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Guides</h4>
            <ul className="space-y-2.5">
              {GUIDES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}/${link.href}`}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/${lang}/guides`}
                  className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  All Guides
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-zinc-900 font-bold text-sm">DC</span>
              </div>
              <span className="text-sm text-zinc-400">
                &copy; {new Date().getFullYear()} {dict.meta.siteName}. {dict.footer.copyright}
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <Link
                href={`/${lang}/legal/privacy`}
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                {LEGAL_LINKS[lang]?.privacy || LEGAL_LINKS.en.privacy}
              </Link>
              <Link
                href={`/${lang}/legal/terms`}
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                {LEGAL_LINKS[lang]?.terms || LEGAL_LINKS.en.terms}
              </Link>
              <Link
                href={`/${lang}/legal/cookies`}
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                {LEGAL_LINKS[lang]?.cookies || LEGAL_LINKS.en.cookies}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
