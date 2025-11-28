'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

interface ConsentContextType {
  consentStatus: ConsentStatus;
  acceptAll: () => void;
  rejectAll: () => void;
  hasConsented: boolean;
  showBanner: boolean;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const CONSENT_STORAGE_KEY = 'dc_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

interface ConsentProviderProps {
  children: ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      try {
        const { status, expiry } = JSON.parse(stored);
        if (new Date().getTime() < expiry) {
          setConsentStatus(status);
        } else {
          // Expired, remove and show banner again
          localStorage.removeItem(CONSENT_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(CONSENT_STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save consent to localStorage
  const saveConsent = useCallback((status: ConsentStatus) => {
    const expiry = new Date().getTime() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ status, expiry }));
    setConsentStatus(status);
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent('accepted');

    // Load Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      // GA is already loaded, update consent
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent('rejected');

    // Revoke Google consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }

    // Try to delete existing cookies
    const cookiesToDelete = ['_ga', '_gid', '_gat', 'IDE', 'DSID', 'FLC', 'AID', 'TAID'];
    cookiesToDelete.forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    });
  }, [saveConsent]);

  const hasConsented = consentStatus === 'accepted';
  const showBanner = isLoaded && consentStatus === 'pending';

  return (
    <ConsentContext.Provider
      value={{
        consentStatus,
        acceptAll,
        rejectAll,
        hasConsented,
        showBanner,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
