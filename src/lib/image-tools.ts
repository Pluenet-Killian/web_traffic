export interface ProcessingProgress {
  current: number;
  total: number;
  status: string;
}

export type ProgressCallback = (progress: ProcessingProgress) => void;

export interface WatermarkOptions {
  text: string;
  opacity: number; // 0-1
  fontSize: number; // in pixels
  rotation: number; // in degrees
  tiled: boolean;
  color: string; // hex color
}

/**
 * Adds a watermark to an image
 * Uses canvas API for client-side processing
 */
export async function addWatermark(
  imageFile: File,
  options: WatermarkOptions,
  onProgress?: ProgressCallback
): Promise<Blob> {
  const {
    text,
    opacity = 0.3,
    fontSize = 48,
    rotation = -30,
    tiled = true,
    color = '#000000',
  } = options;

  onProgress?.({ current: 0, total: 100, status: 'Loading image...' });

  // Load the image
  const img = await loadImage(imageFile);

  onProgress?.({ current: 20, total: 100, status: 'Creating canvas...' });

  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  canvas.width = img.width;
  canvas.height = img.height;

  onProgress?.({ current: 40, total: 100, status: 'Drawing image...' });

  // Draw original image
  ctx.drawImage(img, 0, 0);

  onProgress?.({ current: 60, total: 100, status: 'Adding watermark...' });

  // Configure watermark style
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (tiled) {
    // Tiled watermark pattern
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize * 1.5;

    // Calculate spacing
    const spacingX = textWidth + 100;
    const spacingY = textHeight + 100;

    // Save context state
    ctx.save();

    // Rotate entire canvas for the pattern
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw tiled watermarks
    const startX = -canvas.width;
    const startY = -canvas.height;
    const endX = canvas.width * 2;
    const endY = canvas.height * 2;

    for (let x = startX; x < endX; x += spacingX) {
      for (let y = startY; y < endY; y += spacingY) {
        ctx.fillText(text, x, y);
      }
    }

    // Restore context
    ctx.restore();
  } else {
    // Single centered watermark
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  onProgress?.({ current: 90, total: 100, status: 'Generating output...' });

  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      },
      'image/png',
      1.0
    );
  });

  onProgress?.({ current: 100, total: 100, status: 'Complete!' });

  return blob;
}

/**
 * Helper to load an image from a File
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Get image dimensions without fully loading it
 */
export async function getImageInfo(file: File): Promise<{
  width: number;
  height: number;
  type: string;
  size: number;
}> {
  const img = await loadImage(file);

  return {
    width: img.width,
    height: img.height,
    type: file.type,
    size: file.size,
  };
}
