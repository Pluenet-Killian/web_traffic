'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RecentFile {
  id: string;
  fileName: string;
  operation: string; // e.g., "json-to-csv", "pdf-dark-mode", "video-to-audio"
  operationLabel: string; // Human-readable label
  timestamp: number;
  outputFormat?: string;
  blobUrl?: string; // Temporary URL if file is still in memory
}

const STORAGE_KEY = 'recent_files';
const MAX_ITEMS = 5;

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

export function useRecentFiles() {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (!isBrowser) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentFile[];
        // Remove expired blob URLs (they won't work after page reload)
        const cleaned = parsed.map((file) => ({
          ...file,
          blobUrl: undefined, // Blob URLs don't persist
        }));
        setRecentFiles(cleaned);
      }
    } catch {
      // Invalid data, clear it
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever recentFiles changes
  useEffect(() => {
    if (!isBrowser || !isLoaded) return;

    try {
      // Don't save blob URLs to localStorage
      const toStore = recentFiles.map(({ blobUrl, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch {
      // Storage full or quota exceeded
      console.warn('Could not save recent files to localStorage');
    }
  }, [recentFiles, isLoaded]);

  // Add a new recent file
  const addRecentFile = useCallback(
    (file: Omit<RecentFile, 'id' | 'timestamp'>) => {
      const newFile: RecentFile = {
        ...file,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };

      setRecentFiles((prev) => {
        // Remove duplicates (same fileName + operation)
        const filtered = prev.filter(
          (f) => !(f.fileName === file.fileName && f.operation === file.operation)
        );
        // Add new file at the beginning and limit to MAX_ITEMS
        return [newFile, ...filtered].slice(0, MAX_ITEMS);
      });

      return newFile.id;
    },
    []
  );

  // Update blob URL for a file (when it's still in memory)
  const updateBlobUrl = useCallback((id: string, blobUrl: string) => {
    setRecentFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, blobUrl } : file))
    );
  }, []);

  // Remove a specific file
  const removeRecentFile = useCallback((id: string) => {
    setRecentFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      // Revoke blob URL if it exists
      if (file?.blobUrl) {
        URL.revokeObjectURL(file.blobUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    // Revoke all blob URLs
    recentFiles.forEach((file) => {
      if (file.blobUrl) {
        URL.revokeObjectURL(file.blobUrl);
      }
    });
    setRecentFiles([]);
  }, [recentFiles]);

  // Check if a blob URL is still valid
  const isBlobValid = useCallback((blobUrl: string | undefined): boolean => {
    if (!blobUrl) return false;
    // Blob URLs are only valid in the current session
    // We can do a simple check by trying to fetch it
    return blobUrl.startsWith('blob:');
  }, []);

  return {
    recentFiles,
    isLoaded,
    addRecentFile,
    updateBlobUrl,
    removeRecentFile,
    clearHistory,
    isBlobValid,
    hasHistory: recentFiles.length > 0,
  };
}

// Format relative time
export function formatRelativeTime(timestamp: number, lang: string = 'en'): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (lang === 'fr') {
    if (seconds < 60) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    return `Il y a ${days}j`;
  }

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}
