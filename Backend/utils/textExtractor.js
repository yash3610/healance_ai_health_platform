/**
 * Text extraction from uploaded report files (PDF + DOCX for v1).
 * Image OCR (Tesseract) is deliberately skipped for v1 to keep the
 * backend lean — image uploads return a friendly "not supported" signal.
 */

import fs from 'fs';
import path from 'path';

// Dynamic-import inside the function so test suites that don't touch
// extraction don't have to resolve pdf-parse (it eagerly reads a sample
// file on import and throws in some CI environments).
export async function extractText(filePath, mimetype = '') {
  if (!filePath) {
    return { ok: false, reason: 'no-file', text: '' };
  }

  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    return { ok: false, reason: 'file-missing', text: '' };
  }

  const ext = path.extname(absolutePath).toLowerCase();
  const mime = (mimetype || '').toLowerCase();
  const isPdf = mime.includes('pdf') || ext === '.pdf';
  const isDocx =
    mime.includes('officedocument.wordprocessingml') || ext === '.docx';
  const isImage =
    mime.startsWith('image/') ||
    ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext);

  if (isImage) {
    return {
      ok: false,
      reason: 'image-unsupported',
      text: '',
    };
  }

  try {
    if (isPdf) {
      // pdf-parse v2 API: new PDFParse({ data: buffer }).getText()
      const { PDFParse } = await import('pdf-parse');
      const dataBuffer = fs.readFileSync(absolutePath);
      const parser = new PDFParse({ data: dataBuffer });
      let result;
      try {
        result = await parser.getText();
      } finally {
        // Release the underlying PDF.js document to free memory
        try { await parser.destroy(); } catch { /* ignore */ }
      }
      const text = (result?.text || '').trim();
      if (text.length < 20) {
        return { ok: false, reason: 'empty-text', text: '' };
      }
      return { ok: true, text, pageCount: result?.numpages ?? result?.pages?.length };
    }

    if (isDocx) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ path: absolutePath });
      const text = (result.value || '').trim();
      if (text.length < 20) {
        return { ok: false, reason: 'empty-text', text: '' };
      }
      return { ok: true, text };
    }

    return { ok: false, reason: 'unsupported-type', text: '' };
  } catch (err) {
    console.error('[textExtractor] extraction failed:', err.message);
    if (err.stack) console.error(err.stack);
    return { ok: false, reason: 'extraction-error', text: '', error: err.message };
  }
}
