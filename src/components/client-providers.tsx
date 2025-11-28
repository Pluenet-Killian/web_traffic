'use client';

import { ReactNode } from 'react';
import { ConsentProvider } from '@/contexts/consent-context';
import CookieConsent from '@/components/cookie-consent';
import AnalyticsScripts from '@/components/analytics-scripts';
import type { Locale } from '@/config/i18n';

interface ClientProvidersProps {
  children: ReactNode;
  lang: Locale;
}

export default function ClientProviders({ children, lang }: ClientProvidersProps) {
  return (
    <ConsentProvider>
      <AnalyticsScripts />
      {children}
      <CookieConsent lang={lang} />
    </ConsentProvider>
  );
}
