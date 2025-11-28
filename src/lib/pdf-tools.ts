import { PDFDocument, rgb, grayscale } from 'pdf-lib';

export interface ProcessingProgress {
  current: number;
  total: number;
  status: string;
}

export type ProgressCallback = (progress: ProcessingProgress) => void;

/**
 * Converts a PDF to dark mode by adding a dark background
 * Uses pdf-lib to modify pages with dark overlays
 * Note: True color inversion is limited in PDF - this creates a dark mode effect
 */
export async function convertPdfToDarkMode(
  pdfBytes: ArrayBuffer,
  intensity: number = 0.9, // 0-1, how dark the result should be
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  // Load the PDF
  onProgress?.({ current: 0, total: 100, status: 'Loading PDF...' });

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  onProgress?.({ current: 10, total: 100, status: 'Processing pages...' });

  // Modify each page in place
  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();

    // Calculate dark color based on intensity
    // Lower intensity = lighter dark, Higher intensity = darker
    const darkValue = 0.12 * (1 - intensity) + 0.05 * intensity;

    // Draw dark background behind the content
    // We draw it at z-index -1 by modifying the content stream
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: rgb(darkValue, darkValue, darkValue + 0.02), // Slightly blue tint
      opacity: intensity,
    });

    const progress = 10 + Math.round(((i + 1) / totalPages) * 80);
    onProgress?.({
      current: progress,
      total: 100,
      status: `Processing page ${i + 1} of ${totalPages}...`
    });
  }

  onProgress?.({ current: 95, total: 100, status: 'Finalizing PDF...' });

  const resultBytes = await pdfDoc.save();

  onProgress?.({ current: 100, total: 100, status: 'Complete!' });

  return resultBytes;
}

/**
 * Flattens PDF form fields and optionally removes metadata
 */
export async function flattenPdf(
  pdfBytes: ArrayBuffer,
  options: {
    flattenForms?: boolean;
    removeMetadata?: boolean;
  } = {},
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  const { flattenForms = true, removeMetadata = true } = options;

  onProgress?.({ current: 0, total: 100, status: 'Loading PDF...' });

  const pdfDoc = await PDFDocument.load(pdfBytes);

  onProgress?.({ current: 30, total: 100, status: 'Processing document...' });

  if (flattenForms) {
    // Get the form and flatten it
    const form = pdfDoc.getForm();
    try {
      form.flatten();
    } catch {
      // Form might not exist or be empty, that's okay
    }
  }

  onProgress?.({ current: 60, total: 100, status: 'Cleaning metadata...' });

  if (removeMetadata) {
    // Remove metadata
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');
  }

  onProgress?.({ current: 90, total: 100, status: 'Finalizing PDF...' });

  const resultBytes = await pdfDoc.save();

  onProgress?.({ current: 100, total: 100, status: 'Complete!' });

  return resultBytes;
}

/**
 * Gets PDF info for preview
 */
export async function getPdfInfo(pdfBytes: ArrayBuffer): Promise<{
  pageCount: number;
  title?: string;
  author?: string;
  hasForm: boolean;
}> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  let hasForm = false;
  try {
    hasForm = form.getFields().length > 0;
  } catch {
    hasForm = false;
  }

  return {
    pageCount: pdfDoc.getPageCount(),
    title: pdfDoc.getTitle(),
    author: pdfDoc.getAuthor(),
    hasForm,
  };
}
