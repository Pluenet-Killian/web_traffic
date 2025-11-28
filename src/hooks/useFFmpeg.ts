'use client';

import { useState, useRef, useCallback } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

export interface FFmpegProgress {
  progress: number; // 0-100
  time?: number; // Current time in seconds
  duration?: number; // Total duration in seconds
}

export interface UseFFmpegReturn {
  isLoaded: boolean;
  isLoading: boolean;
  progress: FFmpegProgress;
  error: string | null;
  load: () => Promise<boolean>;
  extractAudio: (file: File, format?: 'mp3' | 'aac') => Promise<Blob | null>;
  removeAudio: (file: File) => Promise<Blob | null>;
  createGif: (file: File, options?: GifOptions) => Promise<Blob | null>;
  terminate: () => void;
}

export interface GifOptions {
  fps?: number; // Frames per second (default: 10)
  width?: number; // Width in pixels (default: 480)
  startTime?: number; // Start time in seconds
  duration?: number; // Duration in seconds (default: 5)
}

export function useFFmpeg(): UseFFmpegReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<FFmpegProgress>({ progress: 0 });
  const [error, setError] = useState<string | null>(null);

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const loadedRef = useRef(false);

  // Lazy load FFmpeg only when needed
  const load = useCallback(async (): Promise<boolean> => {
    if (loadedRef.current && ffmpegRef.current) {
      return true;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Dynamically import FFmpeg (only loads when this function is called)
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { toBlobURL } = await import('@ffmpeg/util');

      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      // Set up progress handler
      ffmpeg.on('progress', ({ progress: p, time }) => {
        setProgress({
          progress: Math.round(p * 100),
          time: time ? time / 1000000 : undefined,
        });
      });

      // Load FFmpeg with multi-threaded core if available
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

      // Try to load multi-threaded version first
      try {
        const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
        const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');

        await ffmpeg.load({
          coreURL,
          wasmURL,
        });
      } catch {
        // Fallback to single-threaded if multi-threaded fails
        console.warn('Multi-threaded FFmpeg failed, trying single-threaded...');
        const stBaseURL = 'https://unpkg.com/@ffmpeg/core-st@0.12.6/dist/esm';
        const coreURL = await toBlobURL(`${stBaseURL}/ffmpeg-core.js`, 'text/javascript');
        const wasmURL = await toBlobURL(`${stBaseURL}/ffmpeg-core.wasm`, 'application/wasm');

        await ffmpeg.load({
          coreURL,
          wasmURL,
        });
      }

      loadedRef.current = true;
      setIsLoaded(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Failed to load FFmpeg:', err);
      setError(err instanceof Error ? err.message : 'Failed to load FFmpeg');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Extract audio from video
  const extractAudio = useCallback(
    async (file: File, format: 'mp3' | 'aac' = 'mp3'): Promise<Blob | null> => {
      if (!ffmpegRef.current || !loadedRef.current) {
        const loaded = await load();
        if (!loaded) return null;
      }

      const ffmpeg = ffmpegRef.current!;
      setProgress({ progress: 0 });
      setError(null);

      try {
        const { fetchFile } = await import('@ffmpeg/util');

        // Write input file
        const inputName = 'input' + getExtension(file.name);
        const outputName = `output.${format}`;

        await ffmpeg.writeFile(inputName, await fetchFile(file));

        // Extract audio
        const audioCodec = format === 'mp3' ? 'libmp3lame' : 'aac';
        await ffmpeg.exec([
          '-i', inputName,
          '-vn', // No video
          '-acodec', audioCodec,
          '-b:a', '192k', // Bitrate
          outputName,
        ]);

        // Read output file
        const data = await ffmpeg.readFile(outputName);
        const mimeType = format === 'mp3' ? 'audio/mpeg' : 'audio/aac';
        const blob = toBlob(data as Uint8Array, mimeType);

        // Cleanup
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

        setProgress({ progress: 100 });
        return blob;
      } catch (err) {
        console.error('Failed to extract audio:', err);
        setError(err instanceof Error ? err.message : 'Failed to extract audio');
        return null;
      }
    },
    [load]
  );

  // Remove audio from video (mute)
  const removeAudio = useCallback(
    async (file: File): Promise<Blob | null> => {
      if (!ffmpegRef.current || !loadedRef.current) {
        const loaded = await load();
        if (!loaded) return null;
      }

      const ffmpeg = ffmpegRef.current!;
      setProgress({ progress: 0 });
      setError(null);

      try {
        const { fetchFile } = await import('@ffmpeg/util');

        const ext = getExtension(file.name);
        const inputName = 'input' + ext;
        const outputName = 'output' + ext;

        await ffmpeg.writeFile(inputName, await fetchFile(file));

        // Remove audio track
        await ffmpeg.exec([
          '-i', inputName,
          '-an', // No audio
          '-c:v', 'copy', // Copy video codec (fast)
          outputName,
        ]);

        const data = await ffmpeg.readFile(outputName);
        const mimeType = getMimeType(ext);
        const blob = toBlob(data as Uint8Array, mimeType);

        // Cleanup
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

        setProgress({ progress: 100 });
        return blob;
      } catch (err) {
        console.error('Failed to remove audio:', err);
        setError(err instanceof Error ? err.message : 'Failed to remove audio');
        return null;
      }
    },
    [load]
  );

  // Create GIF from video
  const createGif = useCallback(
    async (file: File, options: GifOptions = {}): Promise<Blob | null> => {
      if (!ffmpegRef.current || !loadedRef.current) {
        const loaded = await load();
        if (!loaded) return null;
      }

      const ffmpeg = ffmpegRef.current!;
      setProgress({ progress: 0 });
      setError(null);

      const { fps = 10, width = 480, startTime = 0, duration = 5 } = options;

      try {
        const { fetchFile } = await import('@ffmpeg/util');

        const inputName = 'input' + getExtension(file.name);
        const paletteName = 'palette.png';
        const outputName = 'output.gif';

        await ffmpeg.writeFile(inputName, await fetchFile(file));

        // Two-pass encoding for better quality
        // Pass 1: Generate palette
        const filterComplex = `[0:v] fps=${fps},scale=${width}:-1:flags=lanczos,split [a][b];[a] palettegen=stats_mode=single [p];[b][p] paletteuse=new=1`;

        const timeArgs = [
          '-ss', startTime.toString(),
          '-t', duration.toString(),
        ];

        await ffmpeg.exec([
          ...timeArgs,
          '-i', inputName,
          '-vf', `fps=${fps},scale=${width}:-1:flags=lanczos,palettegen=stats_mode=single`,
          '-y',
          paletteName,
        ]);

        setProgress({ progress: 50 });

        // Pass 2: Create GIF using palette
        await ffmpeg.exec([
          ...timeArgs,
          '-i', inputName,
          '-i', paletteName,
          '-lavfi', `fps=${fps},scale=${width}:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
          '-y',
          outputName,
        ]);

        const data = await ffmpeg.readFile(outputName);
        const blob = toBlob(data as Uint8Array, 'image/gif');

        // Cleanup
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(paletteName);
        await ffmpeg.deleteFile(outputName);

        setProgress({ progress: 100 });
        return blob;
      } catch (err) {
        console.error('Failed to create GIF:', err);
        setError(err instanceof Error ? err.message : 'Failed to create GIF');
        return null;
      }
    },
    [load]
  );

  // Terminate FFmpeg instance
  const terminate = useCallback(() => {
    if (ffmpegRef.current) {
      ffmpegRef.current.terminate();
      ffmpegRef.current = null;
      loadedRef.current = false;
      setIsLoaded(false);
    }
  }, []);

  return {
    isLoaded,
    isLoading,
    progress,
    error,
    load,
    extractAudio,
    removeAudio,
    createGif,
    terminate,
  };
}

// Helper functions

// Convert FFmpeg FileData to Blob (handles SharedArrayBuffer compatibility)
function toBlob(data: Uint8Array, mimeType: string): Blob {
  // Create a new regular ArrayBuffer copy to avoid SharedArrayBuffer issues
  const copy = new Uint8Array(data.length);
  copy.set(data);
  return new Blob([copy], { type: mimeType });
}

function getExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? `.${ext}` : '.mp4';
}

function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.webm': 'video/webm',
    '.mkv': 'video/x-matroska',
  };
  return mimeTypes[ext] || 'video/mp4';
}
