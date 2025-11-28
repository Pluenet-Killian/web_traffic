'use client';

import Script from 'next/script';
import { useConsent } from '@/contexts/consent-context';
import { useEffect } from 'react';

// Replace these with your actual IDs when ready
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXX';

export default function AnalyticsScripts() {
  const { hasConsented, consentStatus } = useConsent();

  // Initialize dataLayer and gtag on mount
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer?.push(args);
    };

    // Set default consent
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });
  }, []);

  // Update consent when status changes
  useEffect(() => {
    if (consentStatus === 'accepted' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
  }, [consentStatus]);

  return (
    <>
      {/* Google Analytics - Only load if consent given */}
      {hasConsented && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true
                });
              `,
            }}
          />
        </>
      )}

      {/* Google AdSense - Only load if consent given */}
      {hasConsented && ADSENSE_CLIENT_ID !== 'ca-pub-XXXXXXXXXX' && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
