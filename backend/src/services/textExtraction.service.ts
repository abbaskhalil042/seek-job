import fs from 'fs/promises';
import mammoth from 'mammoth';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

/**
 * Extracts plain text from an uploaded resume file (PDF, DOCX, DOC, TXT).
 * `pdf-parse` is required lazily because its index file tries to read a test
 * fixture at import time in some setups; lazy import keeps boot clean.
 */
export async function extractTextFromFile(
  filePath: string,
  mimeType: string,
): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdfParse = (await import('pdf-parse')).default;
      const buffer = await fs.readFile(filePath);
      const data = await pdfParse(buffer);
      return normalise(data.text);
    }

    if (
      mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return normalise(result.value);
    }

    if (mimeType === 'text/plain') {
      const text = await fs.readFile(filePath, 'utf-8');
      return normalise(text);
    }

    throw ApiError.badRequest(`Unsupported file type for text extraction: ${mimeType}`);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    logger.error(`Text extraction failed: ${(err as Error).message}`);
    throw ApiError.unprocessable('Could not extract text from the uploaded file');
  }
}

function normalise(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[  ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
