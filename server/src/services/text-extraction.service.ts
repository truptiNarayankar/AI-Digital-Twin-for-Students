import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'
import path from 'node:path'
import { ApiError } from '../utils/apiError.js'

export interface ExtractedTextResult {
  text: string
  wordCount: number
  charCount: number
  pageCount?: number
}

export class TextExtractionError extends ApiError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode, 'TEXT_EXTRACTION_ERROR')
    this.name = 'TextExtractionError'
  }
}

/**
 * Normalizes and cleans resume text while preserving structure, bullet points, and keywords.
 */
export function cleanResumeText(rawText: string): string {
  if (!rawText) return ''

  return (
    rawText
      // Remove null bytes and non-printable control characters (except newline, tab, carriage return)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Normalize line breaks to \n
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Normalize irregular unicode whitespace to regular space
      .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
      // Normalize tabs to 2 spaces
      .replace(/\t/g, '  ')
      // Collapse multiple horizontal spaces to single space
      .replace(/[ ]{2,}/g, ' ')
      // Collapse 3 or more consecutive newlines to maximum 2 newlines (preserve paragraphs/sections)
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

/**
 * Validates whether extracted text has meaningful content.
 * Checks for scanned PDFs or empty files.
 */
export function validateExtractedText(cleanedText: string): void {
  // Check minimal character length
  if (!cleanedText || cleanedText.length < 50) {
    throw new TextExtractionError(
      'This resume appears to be image-based or contains insufficient machine-readable text. Please upload a text-based PDF or DOCX resume. (OCR support for scanned documents will be available in future updates).'
    )
  }

  // Count alphanumeric characters to ensure it's not just random punctuation/symbols
  const alphanumericCount = (cleanedText.match(/[a-zA-Z0-9]/g) || []).length
  if (alphanumericCount < 30) {
    throw new TextExtractionError(
      'This resume contains insufficient readable text characters. Please ensure your resume is exported with selectable text.'
    )
  }
}

export class TextExtractionService {
  /**
   * Extracts text from a PDF or DOCX buffer.
   */
  static async extractText(
    buffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<ExtractedTextResult> {
    const ext = path.extname(fileName).toLowerCase()
    let rawText = ''
    let pageCount: number | undefined

    if (ext === '.pdf' || mimeType === 'application/pdf') {
      rawText = await this.extractFromPdf(buffer)
    } else if (
      ext === '.docx' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      rawText = await this.extractFromDocx(buffer)
    } else {
      throw new TextExtractionError(
        `Unsupported file type: ${ext || mimeType}. Only PDF and DOCX documents are supported.`
      )
    }

    const cleanedText = cleanResumeText(rawText)
    validateExtractedText(cleanedText)

    const wordCount = cleanedText.split(/\s+/).filter(Boolean).length
    const charCount = cleanedText.length

    return {
      text: cleanedText,
      wordCount,
      charCount,
      pageCount,
    }
  }

  /**
   * Extracts text from PDF buffer using PDFParse.
   */
  private static async extractFromPdf(buffer: Buffer): Promise<string> {
    let parser: PDFParse | null = null
    try {
      parser = new PDFParse({ data: buffer })
      const result = await parser.getText()
      return result.text || ''
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      throw new TextExtractionError(
        `Failed to parse PDF document: ${errorMsg}. Please ensure the PDF is not encrypted or corrupted.`
      )
    } finally {
      if (parser) {
        try {
          await parser.destroy()
        } catch {
          // ignore cleanup error
        }
      }
    }
  }

  /**
   * Extracts text from DOCX buffer using mammoth.
   */
  private static async extractFromDocx(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer })
      return result.value || ''
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      throw new TextExtractionError(
        `Failed to parse Word document: ${errorMsg}. Please ensure the file is a valid .docx document.`
      )
    }
  }
}
